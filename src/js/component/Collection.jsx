import React    from 'react';
import ReactDOM from 'react-dom';
import Folder   from './Folder.jsx';

export default class Collection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='collection'>
        <div className='collection__container'>
          {this.getFolders(this.props.db)}
        </div>
      </div>
    );
  }

  getFolders(db) {
    return db.filter(folder => {
      if (folder.project !== 'ARCHIV' && folder.project !== 'SANS')
        return folder;
    }).map(folder => <Folder key={folder.project} info={folder} />);
  }
};