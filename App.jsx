import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Selecione um folheto para enviar');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://SEU-BACKEND-AQUI.onrender.com/api/upload-folheto', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Falha ao analisar folheto');

      const data = await res.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar folheto');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    if (!busca) return;

    const encontrados = produtos
      .filter(produto => produto.nome.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => a.preco - b.preco);

    setResultado(encontrados.length > 0 ? encontrados[0] : null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">SuperPreço Comparador</h1>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded mb-6">
        {loading ? 'Analisando...' : 'Enviar Folheto'}
      </button>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleBuscar} className="bg-green-600 text-white px-4 py-2 rounded">
          Buscar Menor Preço
        </button>
      </div>

      {resultado && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Melhor Preço Encontrado:</h2>
          <p><strong>Produto:</strong> {resultado.nome}</p>
          <p><strong>Preço:</strong> R$ {resultado.preco.toFixed(2)}</p>
        </div>
      )}

      {produtos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Produtos no Folheto:</h2>
          <ul className="bg-white p-4 rounded shadow">
            {produtos.map((prod, idx) => (
              <li key={idx} className="border-b py-2">
                {prod.nome} - R$ {prod.preco.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
