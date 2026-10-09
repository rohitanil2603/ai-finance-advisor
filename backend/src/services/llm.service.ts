import { env } from "../config/env";
import { AppError } from "../utils/errors";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const TIMEOUT_MS = 30_000;

interface OpenRouterResponse {
  choices?: { message?: { content?: string } }[];
}

// Thin OpenRouter client. Any failure (missing key, network, timeout, non-2xx, empty
// response) is normalized to an AppError so insights.service / the controller can surface
// one clear message to the frontend's ErrorBanner instead of a raw fetch error.
export async function chatCompletionJson(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!env.OPENROUTER_API_KEY) {
    throw new AppError(503, "AI insights are not configured. Set OPENROUTER_API_KEY in the backend .env.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": env.OPENROUTER_SITE_URL,
        "X-Title": env.OPENROUTER_APP_NAME,
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new AppError(504, "The AI request timed out. Please try again.");
    }
    throw new AppError(502, "Could not reach the AI provider. Please try again.");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new AppError(502, `AI provider error (${response.status}). Please try again.`, body.slice(0, 500));
  }

  const data = (await response.json()) as OpenRouterResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new AppError(502, "AI provider returned an empty response.");
  }
  return content;
}
