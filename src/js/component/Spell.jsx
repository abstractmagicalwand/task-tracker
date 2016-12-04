import React from 'react';

export default class Spell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className='spell'>
        <caption className='spell__title'>spells</caption>
        <tbody className='spell__content'>
          <tr><td>timer death</td>  <td>hh/mm/ss</td></tr>
          <tr><td>priority</td>     <td>*</td></tr>
          <tr><td>project</td>      <td>@name-project</td></tr>
          <tr><td>tags</td>         <td>#nameTag</td></tr>
          <tr><td>price</td>        <td>$money</td></tr>
          <tr><td>time price</td>   <td>hh:mm:ss</td></tr>
        </tbody>
      </table>
    );
  }
}
