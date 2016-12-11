import React, {Component} from 'react';

import List from './List';
import Collection from './Collection';
import Note from './Note';

export default class BoardMain extends Component {
  constructor(props) {
    super(props);

    this.getView = this.getView.bind(this);
  }

  getView() {
    switch (this.props.view) {
    case 'inbox':
      return (
        <List
          journal={this.props.journal}
          type="inbox"
          db={this.props.db}
          preview={this.props.preview}
        />
      );
    case 'project':
      return <Collection db={this.props.db} />;
    case 'archiv':
      return <List type="archiv" db={this.props.db} />;
    case 'search':
      return (
        <List
          journal={this.props.journal}
          type="search"
          value={this.props.value}
          db={this.props.db}
          preview={this.props.preview}
        />
      );
    case 'note':
      return <Note value={this.props.value} />;
    default:
      if (!~this.props.view.indexOf('@')) break;
      return (
        <List
          type="project"
          journal={this.props.journal}
          projectName={this.props.view}
          db={this.props.db}
          preview={this.props.preview}
        />
      );
    }
  }

  render() {
    return (
      <div className="board-main">
        <div className="board-main__container">
          {this.getView()}
        </div>
      </div>
    );
  }
}