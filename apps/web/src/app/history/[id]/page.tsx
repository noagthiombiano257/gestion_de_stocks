import { getProductById, getStockMovements } from "../../../lib/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductHistoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);

  console.log("Page historique - ID reçu:", resolvedParams.id, "ID parsé:", productId);

  if (isNaN(productId)) {
    console.error("ID invalide:", resolvedParams.id);
    notFound();
  }

  const product = await getProductById(productId);
  const movements = await getStockMovements(productId);

  if (!product) {
    console.error("Produit non trouvé pour ID:", productId);
    notFound();
  }

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

      <h1>📊 Historique : {product.name}</h1>
      <p style={{ color: "#666" }}>
        SKU : <strong>{product.sku}</strong> | Stock actuel : <strong>{product.quantity}</strong>
      </p>
      <p style={{ color: "#666" }}>
        Total : {movements.length} mouvement(s) enregistré(s)
      </p>

      <hr />

      {movements.length === 0 ? (
        <p>Aucun mouvement de stock enregistré pour ce produit.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Quantité</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Type/Raison</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>
                  {m.createdAt ? new Date(m.createdAt).toLocaleString("fr-FR") : "N/A"}
                </td>
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