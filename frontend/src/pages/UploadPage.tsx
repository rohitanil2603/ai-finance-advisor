import { Link } from "react-router-dom";
import { CsvUploadForm } from "@/components/transactions/CsvUploadForm";

export function UploadPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900">Upload a statement</h1>
      <p className="text-sm text-slate-500">
        CSV columns: <code className="rounded bg-slate-100 px-1 py-0.5">date</code>,{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5">description</code>,{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5">amount</code> (negative for debits,
        positive for credits), and an optional{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5">balance</code>.
      </p>
      <CsvUploadForm />
      <p className="text-sm text-slate-500">
        Once imported, head to{" "}
        <Link to="/transactions" className="font-medium text-brand-600 hover:underline">
          Transactions
        </Link>{" "}
        to review and edit categories, or{" "}
        <Link to="/dashboard" className="font-medium text-brand-600 hover:underline">
          Dashboard
        </Link>{" "}
        to see the charts.
      </p>
    </div>
  );
}
