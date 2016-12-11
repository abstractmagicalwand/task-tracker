import React from 'react';

export default function Account(props) {
  return (
    <div className="board-extra">
      <table className="board-extra__table">
        <caption className="board-extra__title">account</caption>
        <tbody className="board-extra__content">
          <tr>
            <td className="board-extra__account-cell">completed</td>
            <td className="board-extra__account-cell">
              {`${props.data.completed}`}
            </td>
          </tr>
          <tr>
            <td className="board-extra__account-cell">late</td>
            <td className="board-extra__account-cell">
              {`${props.data.late}`}
            </td>
          </tr>
          <tr>
            <td className="board-extra__account-cell">minutes</td>
            <td className="board-extra__account-cell">
              {`${props.data.minutes}`}
            </td>
          </tr>
          <tr>
            <td className="board-extra__account-cell">wallet</td>
            <td className="board-extra__account-cell">
              {`${props.data.wallet}$`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}