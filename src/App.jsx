import React, { useState, useEffect } from 'react';
import './App.css';
import supabase from './services/supabaseClient';

function App() {
  const [file, setFile] = useState(null);
  const [folhetos, setFolhetos] = useState([]);

  const fetchFolhetos = async () => {
    const { data, error } = await supabase
      .storage
      .from('folhetos') // Nome do bucket
      .list('public', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Erro ao carregar os folhetos:', error);
    } else {
      console.log('Folhetos carregados:', data);
      setFolhetos(data);
    }
  };

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

    const { data, error } = await supabase
      .storage
      .from('folhetos')
      .upload(`public/${file.name}`, file);

    if (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Falha no envio do arquivo.');
    } else {
      alert('Arquivo enviado com sucesso!');
      fetchFolhetos(); // Atualizar a lista após upload
    }
  };

  // Gerar URL pública
  const getPublicUrl = (path) => {
    const { publicURL } = supabase
      .storage
      .from('folhetos')
      .getPublicUrl(`public/${path}`);
    return publicURL;
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
          {folhetos.length > 0 ? (
            folhetos.map((folheto) => (
              <li key={folheto.name}>
                <a href={getPublicUrl(folheto.name)} target="_blank" rel="noopener noreferrer">
                  {folheto.name}
                </a>
              </li>
            ))
          ) : (
            <li>Nenhum folheto encontrado.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
