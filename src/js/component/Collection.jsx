import React, {Component} from 'react';

import Folder from './Folder';

export default class Collection extends Component {
  constructor(props) {
    super(props);
  }

  getFolders(db) {
    return db.filter(folder => {
      if (folder.project !== 'ARCHIV' && folder.project !== 'SANS')
        return folder;
    }).map(folder => <Folder key={folder.project} info={folder} />);
  }

  render() {
    return (
      <div className="collection">
        <div className="collection__container">
          {this.getFolders(this.props.db)}
        </div>
      </div>
    );
  }
}