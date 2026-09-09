import { getAllStockMovements } from "../../lib/actions";
import Link from "next/link";

export default async function HistoryPage() {
  const movements = await getAllStockMovements();

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          ← Retour à l'accueil
        </Link>
      </div>

      <h1>📊 Historique complet des mouvements de stock</h1>
      <p style={{ color: "#666" }}>
        Total : {movements.length} mouvement(s) enregistré(s)
      </p>

      <hr />

      {movements.length === 0 ? (
        <p>Aucun mouvement de stock enregistré.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Produit</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Quantité</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Type/Raison</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>
                  {new Date(m.createdAt).toLocaleString("fr-FR")}
                </td>
                <td style={{ padding: "12px" }}>{m.productName}</td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: m.quantity >= 0 ? "green" : "red",
                  }}
                >
                  {m.quantity >= 0 ? `+${m.quantity}` : m.quantity}
                </td>
                <td style={{ padding: "12px" }}>{m.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}