import React from 'react';

export default function Spell() {
  return (
    <div className="board-extra">
      <table className="board-extra__table">
        <caption className="board-extra__title">spell</caption>
        <tbody className="board-extra__content">
          <tr>
            <td className="board-extra__spell-cell">timer death</td>
            <td className="board-extra__spell-cell">hh/mm/ss</td>
          </tr>
          <tr>
            <td className="board-extra__spell-cell">priority</td>
            <td className="board-extra__spell-cell">*</td>
          </tr>
          <tr>
            <td className="board-extra__spell-cell">project</td>
            <td className="board-extra__spell-cell">@name-project</td>
          </tr>
          <tr>
            <td className="board-extra__spell-cell">price</td>
            <td className="board-extra__spell-cell">$money</td>
          </tr>
          <tr>
            <td className="board-extra__spell-cell">time price</td>
            <td className="board-extra__spell-cell">hh:mm:ss</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
