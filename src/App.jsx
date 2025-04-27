import React, { useState } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabase = createClient('https://ongdxywgxszpxopxqfyq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ2R4eXdneHN6cHhvcHhxZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzQ5OTYsImV4cCI6MjA2MTM1MDk5Nn0.Z3utIhlvB4lbb3GghbwDiLno8EEmLqcthVhxiguI70c');

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    setUploading(true);

    // Gerar um nome único para o arquivo
    const fileName = `${Date.now()}-${file.name}`;

    try {
      // Enviar o arquivo para o Supabase
      const { data, error } = await supabase.storage
        .from('folhetos') // Nome do bucket no Supabase
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      console.log("Arquivo enviado com sucesso:", data);
      alert("Arquivo enviado com sucesso!");

    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Falha no envio do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Bem-vindo ao Smart Folhetos!</h1>
        <p>Agora você pode comparar ofertas de supermercado facilmente.</p>
      </div>

      <div className="upload-container">
        <h2>Envie seu Folheto</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            disabled={uploading}
          />
          <button type="submit" className="submit-btn" disabled={uploading}>
            {uploading ? "Enviando..." : "Enviar Folheto"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
