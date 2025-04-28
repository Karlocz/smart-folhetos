import React, { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient'; // Certifique-se de importar corretamente o supabaseClient

function App() {
  const [folhetos, setFolhetos] = useState([]);

  useEffect(() => {
    // Função para listar os arquivos da pasta "upload" no Supabase
    const fetchFolhetos = async () => {
      const { data, error } = await supabase
        .storage
        .from('folhetos')
        .list('upload', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error('Erro ao listar arquivos:', error.message);
      } else {
        // Filtra os itens para pegar somente os arquivos e monta as URLs públicas para cada um
        const arquivos = data
          .filter(item => item.metadata && item.metadata.size > 0) // Filtra apenas arquivos, ignorando pastas
          .map(item => ({
            name: item.name,
            publicUrl: supabase
              .storage
              .from('folhetos')
              .getPublicUrl(`upload/${item.name}`).publicURL
          }));
        
        setFolhetos(arquivos); // Atualiza o estado com a lista de arquivos
      }
    };

    fetchFolhetos(); // Chama a função para buscar os arquivos
  }, []); // O array vazio [] significa que o useEffect só rodará na montagem inicial

  return (
    <div>
      <h1>Lista de Folhetos</h1>
      <ul>
        {folhetos.length > 0 ? (
          folhetos.map((folheto, index) => (
            <li key={index}>
              <a href={folheto.publicUrl} target="_blank" rel="noopener noreferrer">
                {folheto.name}
              </a>
            </li>
          ))
        ) : (
          <p>Nenhum folheto encontrado.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
