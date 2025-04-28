// src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';
import supabase from './services/supabaseClient'; // Importando o cliente Supabase

function App() {
  const [file, setFile] = useState(null);
  const [folhetos, setFolhetos] = useState([]); // Para armazenar os folhetos do Supabase

  // Função para carregar os folhetos do Supabase
  const fetchFolhetos = async () => {
    const { data, error } = await supabase
      .from('folhetos') // Nome da tabela onde os folhetos são armazenados
      .select('*');

    if (error) {
      console.error("Erro ao carregar os folhetos:", error);
    } else {
      setFolhetos(data);
    }
  };

  useEffect(() => {
    fetchFolhetos(); // Carregar folhetos ao iniciar
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("folheto", file);

    // Enviar o folheto para o Supabase
    const { data, error } = await supabase
      .storage
      .from('folhetos') // Nome do bucket onde o arquivo será armazenado
      .upload(`public/${file.name}`, file);

    if (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Falha no envio do arquivo.");
    } else {
      alert("Arquivo enviado com sucesso!");
      fetchFolhetos(); // Recarregar a lista de folhetos
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
          />
          <button type="submit" className="submit-btn">Enviar Folheto</button>
        </form>
      </div>

      <div className="folhetos-list">
        <h2>Folhetos Enviados</h2>
        <ul>
          {folhetos.map(folheto => (
            <li key={folheto.id}>
              <a href={folheto.url} target="_blank" rel="noopener noreferrer">
                {folheto.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
