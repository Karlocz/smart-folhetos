import { useState } from 'react';

export default function App() {
  const [product, setProduct] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!product.trim()) {
      alert('Digite o nome de um produto.');
      return;
    }

    setLoading(true);
    setResult(null);

    // Aqui futuramente você faz uma requisição real
    setTimeout(() => {
      setResult({
        product: product,
        bestPrice: 'R$ 5,99',
        market: 'Supermercado Bom Preço'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Smart Folhetos 🛒</h1>

      <input
        type="text"
        placeholder="Digite o nome do produto..."
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        className="border p-2 rounded w-full max-w-md mb-4"
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Buscando...' : 'Buscar Menor Preço'}
      </button>

      {result && (
        <div className="mt-8 bg-white p-6 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Resultado:</h2>
          <p><strong>Produto:</strong> {result.product}</p>
          <p><strong>Melhor Preço:</strong> {result.bestPrice}</p>
          <p><strong>Supermercado:</strong> {result.market}</p>
        </div>
      )}
    </div>
  );
}
