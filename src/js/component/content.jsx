import React      from 'react';
import ReactDOM   from 'react-dom';
import List       from './list.jsx';
import Collection from './collection.jsx';
import Note       from './note.jsx';

export default class Content extends React.Component {
  constructor(props) {
    super(props);
    this.getCompView = this.getCompView.bind(this);
  }

  render() {
    return <div className={`content ${this.props.view === 'account' ? 'account-container' : ''}`}>{this.getCompView()}</div>;
  }

  getCompView() {
    switch (this.props.view) {
    case 'inbox':
        return <List
            journal={this.props.journal}
            type='inbox' db={this.props.db}
        />;
    case 'project':
        return <Collection db={this.props.db} />;
    case 'archiv':
        return <List type='archiv' db={this.props.db} />;
    case 'search':
        return <List
            journal={this.props.journal}
            type='search' value={this.props.value}
            db={this.props.db}
        />;
    case 'note':
        return <Note value={this.props.value} />;
    default:
        if (!~this.props.view.indexOf('@')) break;
        return <List
            type='project'
            journal={this.props.journal}
            projectName={this.props.view}
            db={this.props.db}
        />;
    }
  }

};