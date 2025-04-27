import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './services/supabaseClient';
import UploadForm from './components/UploadForm';
import FolhetoList from './components/FolhetoList';

function App() {
  const [folhetos, setFolhetos] = useState([]);

  // Função para carregar os folhetos armazenados no Supabase
  const loadFolhetos = async () => {
    const { data, error } = await supabase
      .from('folhetos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar os folhetos:', error);
    } else {
      setFolhetos(data);
    }
  };

  useEffect(() => {
    loadFolhetos();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Bem-vindo ao Smart Folhetos!</h1>
        <p>Envie seus folhetos e compare ofertas de supermercado.</p>
      </div>
      <UploadForm loadFolhetos={loadFolhetos} />
      <FolhetoList folhetos={folhetos} />
    </div>
  );
}

export default App;
