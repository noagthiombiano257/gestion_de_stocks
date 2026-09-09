"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
      <input
        type="text"
        placeholder="Rechercher par nom ou SKU..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          fontSize: "14px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "4px",
        }}
      >
        Rechercher
      </button>
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            router.push("/");
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ccc",
            color: "#333",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          Réinitialiser
        </button>
      )}
    </form>
  );
}