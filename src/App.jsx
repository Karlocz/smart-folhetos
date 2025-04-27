import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './services/supabaseClient';

function App() {
  const [file, setFile] = useState(null);
  const [folhetos, setFolhetos] = useState([]);
  
  // Função para carregar a lista de folhetos
  const fetchFolhetos = async () => {
    const { data, error } = await supabase
      .from('folhetos') // Nome da tabela
      .select('*'); // Seleciona todas as colunas

    if (error) {
      console.error("Erro ao carregar os folhetos", error);
      return;
    }
    setFolhetos(data); // Atualiza o estado com a lista de folhetos
  };

  // UseEffect para buscar os folhetos ao carregar o componente
  useEffect(() => {
    fetchFolhetos();
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

    try {
      const response = await fetch("https://ongdxywgxszpxopxqfyq.supabase.co", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log(data.message);
      alert("Arquivo enviado com sucesso!");
      
      // Recarregar os folhetos após o envio
      fetchFolhetos();
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Falha no envio do arquivo.");
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

      <div className="folheto-list">
        <h2>Folhetos Enviados</h2>
        <ul>
          {folhetos.map((folheto, index) => (
            <li key={index}>
              <p>{folheto.nome}</p>
              {/* Aqui você pode exibir mais detalhes do folheto, se necessário */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
