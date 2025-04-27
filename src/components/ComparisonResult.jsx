import React from 'react';

function ComparisonResult({ comparison }) {
  return (
    <div>
      <h2>Resultados da Comparação:</h2>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço Folheto 1</th>
            <th>Preço Folheto 2</th>
            <th>Mais Barato</th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>R$ {item.price1.toFixed(2)}</td>
              <td>R$ {item.price2.toFixed(2)}</td>
              <td>{item.cheaperAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonResult;
