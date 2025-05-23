import { useState } from "react";
import { runQuery } from "../services/DatabaseService";

const RunQueries = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRunQuery = async () => {
    const sanitizedQuery = query.trim();
    const isValidSelect = sanitizedQuery.toLowerCase().startsWith("select");
    const semicolonCount = (sanitizedQuery.match(/;/g) || []).length;

    if (!isValidSelect || semicolonCount > 1) {
      setError("Not valid SQL SELECT statement for the current database schema.");
      setResult([]);
      return;
    }

    const response = await runQuery(sanitizedQuery);
    if (response.isSuccess) {
      setResult(response.body);
      setError(null);
    } else {
      setResult([]);
      setError("Not valid SQL SELECT statement for the current database schema.");
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">
          Run raw SQL Queries.
        </h1>
        <p className="mt-2 text-[12px] text-blue-600">
          Run select queries to view data from the database.
        </p>
      </header>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-[90%]"
          placeholder="Enter SELECT query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleRunQuery}>
          Run Query
        </button>
      </div>

      {error && ( <p className="text-red-600 text-sm mb-4">{error}</p> )}

      {result.length > 0 && (
        <div className="overflow-auto max-w-full">
          <table className="w-full text-sm text-left border-collapse border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                {Object.keys(result[0]).map((col) => (
                  <th key={col} className="border px-3 py-2 font-medium text-gray-700">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((val, colIndex) => (
                    <td key={colIndex} className="border px-3 py-2">
                      {val !== null ? String(val) : "NA"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RunQueries;
