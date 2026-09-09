import AddProductForm from '../../components/AddProductForm';

export default function AddProductPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Ajouter un produit
        </h1>
        <p className="text-gray-400">
          Ajoutez un nouveau produit à votre inventaire
        </p>
      </div>

      {/* Formulaire d'ajout */}
      <AddProductForm />
    </div>
  );
}