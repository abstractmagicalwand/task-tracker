import React    from 'react';
import ReactDOM from 'react-dom';

export default class Help extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table>
        <caption>spells</caption>
        <tbody>
          <tr><td>timer death</td><td>hh/mm/ss</td></tr>
          <tr><td>priority</td><td>*</td></tr>
          <tr><td>project</td><td>@name-project</td></tr>
          <tr><td>tags</td><td>#nameTag</td></tr>
          <tr><td>price</td><td>$money</td></tr>
          <tr><td>time price</td><td>[hh/mm/ss]</td></tr>
        </tbody>
      </table>
    );
  }
}
