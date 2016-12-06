import React from 'react';

export default class Spell extends React.Component {
  render() {
    return (
      <div className='board-extra'>
        <table className='board-extra__table'>
          <caption className='board-extra__title'>spells</caption>
          <tbody className='board-extra__content'>
            <tr><td>timer death</td><td>hh/mm/ss</td></tr>
            <tr><td>priority</td><td>*</td></tr>
            <tr><td>project</td><td>@name-project</td></tr>
            <tr><td>tags</td><td>#nameTag</td></tr>
            <tr><td>price</td><td>$money</td></tr>
            <tr><td>time price</td><td>hh:mm:ss</td></tr>
          </tbody>
        </table>
      </div>
    );
  }
}
