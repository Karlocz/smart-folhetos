import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { extractTextFromImageUrl, extractProductsFromText, compareProducts } from './ocrProcessor';
import ComparisonResult from './components/ComparisonResult';
import './styles/App.css';

// Configuração do Supabase
const supabase = createClient('https://ongdxywgxszpxopxqfyq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ2R4eXdneHN6cHhvcHhxZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzQ5OTYsImV4cCI6MjA2MTM1MDk5Nn0.Z3utIhlvB4lbb3GghbwDiLno8EEmLqcthVhxiguI70c');

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const uploadFileToSupabase = async (file) => {
    const filePath = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from('folhetos')
      .upload(filePath, file);

    if (error) {
      throw new Error('Erro ao enviar para o Supabase: ' + error.message);
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('folhetos')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleCompare = async (e) => {
    e.preventDefault();

    if (!file1 || !file2) {
      alert('Selecione os dois folhetos!');
      return;
    }

    try {
      setLoading(true);

      // Envia arquivos para o Supabase
      const [url1, url2] = await Promise.all([
        uploadFileToSupabase(file1),
        uploadFileToSupabase(file2)
      ]);

      // Extrai texto das URLs
      const text1 = await extractTextFromImageUrl(url1);
      const text2 = await extractTextFromImageUrl(url2);

      // Extrai produtos
      const products1 = extractProductsFromText(text1);
      const products2 = extractProductsFromText(text2);

      // Compara produtos
      const result = compareProducts(products1, products2);

      setComparison(result);
    } catch (error) {
      console.error('Erro no processo:', error);
      alert('Falha ao comparar folhetos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Smart Folhetos - Comparador</h1>
      <form onSubmit={handleCompare} className="upload-form">
        <input type="file" accept="image/*" onChange={handleFile1Change} />
        <input type="file" accept="image/*" onChange={handleFile2Change} />
        <button type="submit" disabled={loading}>
          {loading ? 'Comparando...' : 'Comparar Folhetos'}
        </button>
      </form>

      {comparison && (
        <div className="comparison-result">
          <ComparisonResult comparison={comparison} />
        </div>
      )}
    </div>
  );
}

export default App;
