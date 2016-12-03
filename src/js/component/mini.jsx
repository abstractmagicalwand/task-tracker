import React from 'react';
import Spell from './spell.jsx';
import Account from './account.jsx';

export default class Mini extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.account);
    return this.props.view === 'spell' ? <Spell /> : <Account data={this.props.account} />;
  }
}