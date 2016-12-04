import React      from 'react';
import ReactDOM   from 'react-dom';
import List       from './List.jsx';
import Collection from './Collection.jsx';
import Note       from './Note.jsx';

export default class BoardMain extends React.Component {
  constructor(props) {
    super(props);
    this.getView = this.getView.bind(this);
  }

  render() {
    return (
      <div className='board-main'>
        <div className='board-main__container'>
          {this.getView()}
        </div>
      </div>
    );
  }

  getView() {
    switch (this.props.view) {
    case 'inbox':
        return (
          <List
            journal={this.props.journal}
            type='inbox'
            db={this.props.db}
          />
        );
    case 'project':
        return <Collection db={this.props.db} />;
    case 'archiv':
        return <List type='archiv' db={this.props.db} />;
    case 'search':
        return (
          <List
            journal={this.props.journal}
            type='search'
            value={this.props.value}
            db={this.props.db}
          />
        );
    case 'note':
        return <Note value={this.props.value} />;
    default:
        if (!~this.props.view.indexOf('@')) break;
        return (
          <List
            type='project'
            journal={this.props.journal}
            projectName={this.props.view}
            db={this.props.db}
          />
        );
    }
  }

};