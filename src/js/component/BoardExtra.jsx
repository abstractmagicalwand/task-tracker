import React from 'react';

import Spell from './Spell';
import Account from './Account';

export default function BoardExtra(props) {
  return (
    <div className="board-extra">
      <div className="board-extra__container">
        {props.view === 'spell'
          ? <Spell />
          : <Account data={props.account} />
        }
      </div>
    </div>
  );
}
