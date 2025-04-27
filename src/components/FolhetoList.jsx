import React from 'react';

function FolhetoList({ folhetos }) {
  return (
    <div className="folheto-list-container">
      <h2>Folhetos Enviados</h2>
      <ul>
        {folhetos.map((folheto) => (
          <li key={folheto.id}>
            <a href={`https://ongdxywgxszpxopxqfyq.supabase.co/storage/v1/object/public/folhetos/${folheto.url}`} target="_blank" rel="noopener noreferrer">
              {folheto.nome}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FolhetoList;
