import { useRef, useState } from "react";
import * as transactionsApi from "@/api/transactions.api";
import { apiErrorMessage } from "@/api/client";
import type { UploadResult } from "@/types/transaction";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface CsvUploadFormProps {
  onUploaded?: (result: UploadResult) => void;
}

export function CsvUploadForm({ onUploaded }: CsvUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a .csv file.");
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const data = await transactionsApi.uploadCsv(file);
      setResult(data);
      onUploaded?.(data);
    } catch (err) {
      setError(apiErrorMessage(err, "Upload failed. Please check the file and try again."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-white"
        }`}
      >
        <p className="text-sm font-medium text-slate-700">
          {file ? file.name : "Drag and drop your CSV here, or click to browse"}
        </p>
        <p className="text-xs text-slate-400">
          Columns: date, description, amount (debit/credit), optional balance
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleUpload} disabled={!file} loading={uploading}>
          Upload
        </Button>
        {file && (
          <Button
            variant="secondary"
            onClick={() => {
              setFile(null);
              setResult(null);
              setError(null);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {error && <ErrorBanner message={error} onRetry={file ? handleUpload : undefined} />}

      {result && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p className="font-medium text-slate-700">
            Imported {result.imported} transaction{result.imported === 1 ? "" : "s"}
            {result.skipped > 0 && ` · skipped ${result.skipped} duplicate(s)`}
          </p>
          {result.errors.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-red-600">{result.errors.length} row error(s):</p>
              <ul className="mt-1 max-h-40 list-disc overflow-y-auto pl-5 text-slate-600">
                {result.errors.map((rowError) => (
                  <li key={rowError.row}>
                    Row {rowError.row}: {rowError.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
