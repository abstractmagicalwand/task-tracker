import React from 'react';
import Spell from './Spell.jsx';
import Account from './Account.jsx';

export default class BoardExtra extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='board-extra'>
        <div className='board-extra__container'>
          {this.props.view === 'spell' ?
            <Spell /> :
            <Account data={this.props.account} />
          }
        </div>
      </div>
    );
  }
}