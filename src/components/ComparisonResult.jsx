import React from 'react';

function ComparisonResult({ results }) {
  if (!results || results.length === 0) {
    return <p>Nenhuma comparação disponível.</p>;
  }

  return (
    <div>
      <h2>Resultados da Comparação</h2>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço Folheto 1</th>
            <th>Preço Folheto 2</th>
            <th>Diferença</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>R$ {item.price1}</td>
              <td>R$ {item.price2}</td>
              <td>{item.difference >= 0 ? `+R$ ${item.difference}` : `-R$ ${Math.abs(item.difference)}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonResult;
