import React    from 'react';
import ReactDOM from 'react-dom';
import Folder   from './folder.jsx';

export default class Collection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='collection'>{this.getCompFolders(this.props.db)}</div>;
  }

  getCompFolders(db) {
    let i = 0;
    return db.filter(folder => {
      if (folder.project !== 'ARCHIV' && folder.project !== 'SANS') return folder;
    }).map(folder => <Folder key={++i} info={folder} />);
  }
};