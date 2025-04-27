import React, { useState } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabase = createClient('https://your-project-id.supabase.co', 'your-anon-key');

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [productComparison, setProductComparison] = useState(null);

  const handleFileChange = (event, fileNumber) => {
    if (fileNumber === 1) {
      setFile1(event.target.files[0]);
    } else {
      setFile2(event.target.files[0]);
    }
  };

  const handleSubmit = async (event, fileNumber) => {
    event.preventDefault();

    const file = fileNumber === 1 ? file1 : file2;

    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from('folhetos')
        .upload(fileName, file);

      if (error) {
        console.error("Erro ao enviar arquivo:", error.message);
        alert("Falha no envio do arquivo.");
        return;
      }

      console.log("Arquivo enviado com sucesso:", data);
      alert("Arquivo enviado com sucesso!");

    } catch (error) {
      console.error("Erro desconhecido:", error);
      alert("Falha no envio do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleCompare = async () => {
    // Aqui você precisará implementar a lógica para comparar produtos entre os dois folhetos.
    // Isso pode ser feito de várias formas, dependendo de como você extrai e armazena as informações dos produtos.
    
    // Exemplo fictício:
    const folheto1 = await supabase.storage.from('folhetos').download('path-to-file1');
    const folheto2 = await supabase.storage.from('folhetos').download('path-to-file2');

    // Suponha que ambos os folhetos tenham a estrutura abaixo:
    const produtos1 = extractProducts(folheto1); // Função que você criaria para extrair os produtos
    const produtos2 = extractProducts(folheto2);

    // Comparar preços de um produto
    const produto = compareProducts(produtos1, produtos2); // Função para comparar preços entre os dois folhetos
    setProductComparison(produto);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Bem-vindo ao Smart Folhetos!</h1>
        <p>Agora você pode comparar ofertas de supermercado facilmente.</p>
      </div>

      <div className="upload-container">
        <h2>Envie o primeiro Folheto</h2>
        <form onSubmit={(event) => handleSubmit(event, 1)} className="upload-form">
          <input
            type="file"
            onChange={(event) => handleFileChange(event, 1)}
            className="file-input"
            disabled={uploading}
          />
          <button type="submit" className="submit-btn" disabled={uploading}>
            {uploading ? "Enviando..." : "Enviar Folheto 1"}
          </button>
        </form>
      </div>

      <div className="upload-container">
        <h2>Envie o segundo Folheto</h2>
        <form onSubmit={(event) => handleSubmit(event, 2)} className="upload-form">
          <input
            type="file"
            onChange={(event) => handleFileChange(event, 2)}
            className="file-input"
            disabled={uploading}
          />
          <button type="submit" className="submit-btn" disabled={uploading}>
            {uploading ? "Enviando..." : "Enviar Folheto 2"}
          </button>
        </form>
      </div>

      <div className="comparison-container">
        <button onClick={handleCompare} disabled={uploading || !file1 || !file2}>
          Comparar Produtos
        </button>

        {productComparison && (
          <div className="comparison-result">
            <h3>Comparação de Produto:</h3>
            <p>Produto: {productComparison.name}</p>
            <p>Preço no Folheto 1: {productComparison.price1}</p>
            <p>Preço no Folheto 2: {productComparison.price2}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Função fictícia para extrair produtos de um folheto
const extractProducts = (folheto) => {
  // Suponha que você extraia os dados dos folhetos aqui, usando uma biblioteca de OCR ou alguma outra técnica
  return [
    { name: 'Produto A', price: 10.99 },
    { name: 'Produto B', price: 5.99 },
  ];
};

// Função fictícia para comparar produtos entre dois folhetos
const compareProducts = (produtos1, produtos2) => {
  const produtoComparado = produtos1[0]; // Exemplo: comparar o primeiro produto
  const produto2 = produtos2.find(p => p.name === produtoComparado.name);
  return {
    name: produtoComparado.name,
    price1: produtoComparado.price,
    price2: produto2 ? produto2.price : 'Não encontrado',
  };
};

export default App;
