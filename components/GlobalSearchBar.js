"use client";
import { useGlobalSearch } from "../app/context/GlobalSearchContext";

export default function GlobalSearchBar() {
  const { globalSearch, setGlobalSearch } = useGlobalSearch();

  return (
    <div className="p-4 flex gap-4 items-center bg-white rounded-xl shadow border border-blue-100 max-w-xl mx-auto mt-8">
      <input
        type="text"
        value={globalSearch}
        onChange={e => setGlobalSearch(e.target.value)}
        placeholder="Buscar en toda la app..."
        className="px-4 py-2 rounded-lg border border-blue-300 shadow focus:ring-2 focus:ring-blue-500 flex-1"
      />
      <span className="text-gray-600 text-sm">Valor actual: <b>{globalSearch}</b></span>
    </div>
  );
}
