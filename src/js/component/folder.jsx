import React    from 'react';
import ReactDOM from 'react-dom';

export default class Folder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {edit: false};

    this.handleDeleteFolder   = this.handleDeleteFolder.bind(this);
    this.handleEditFolder     = this.handleEditFolder.bind(this);
    this.handleNoteFolder     = this.handleNoteFolder.bind(this);
    this.handleClickFolder    = this.handleClickFolder.bind(this);
    this.handleSaveEditFolder = this.handleSaveEditFolder.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
    this.edit               = this.edit.bind(this);
    this.content            = this.content.bind(this);
  }

  handleClickFolder(e) {
    const tag = e.target.tagName;
    if (e.target.className !== 'wrap' && tag !== 'DIV' && tag !== 'P') return;

    window.dispatchEvent(new CustomEvent('clickNavBtn', {
      detail: {category: this.props.info.project}
    }));
  }

  handleDeleteFolder(e) {

    if (!e.target.classList.contains('delete-btn')) return;

    window.dispatchEvent(new CustomEvent('deleteFolder', {
      detail: {project: this.props.info.project}
    }));
  }

  handleEditFolder(e) {
    if (!e.target.classList.contains('edit-btn')) return;
    this.setStateToggleEdit();
  }

  handleSaveEditFolder(e) {
    this.setStateToggleEdit();

    window.dispatchEvent(new CustomEvent('save', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.value).value.slice(0, 21),
        project: this.props.info.project
      }
    }));
  }

  handleNoteFolder(e) {
    if (!e.target.classList.contains('note-btn')) return;
    window.dispatchEvent(new CustomEvent('openNote', {
      detail: {
        value: this.props.info.note,
        project: this.props.info.project
      }
    }));
  }

  render() {
    return (
      <div
        className='folder'
        onClick={this.handleClickFolder}>
        {this.content()}
        {this.edit()}
      </div>
    );
  }

  content() {
    if (this.state.edit) return;

    return (
      <span className='wrap'>
        <p
          className='folder-name'
          onClick={this.handleClickFolder}>
          {`${this.props.info.project}`}
        </p>
        <span className='folder-panel'>
          <span className='delete-btn' onClick={this.handleDeleteFolder} />
          <span className='edit-btn' onClick={this.handleEditFolder} />
          <span className='note-btn' onClick={this.handleNoteFolder} />
        </span>
      </span>
    );
  }

  edit() {
    if (!this.state.edit) return;

    return (
      <span className='wrap'>
        <span className='folder-edit'>
          <input
            className='folder-field'
            type='text'
            ref='value'
            defaultValue={`${this.props.info.project}`}
          />
          <span className='folder-edit-panel'>
            <span className='save' onClick={this.handleSaveEditFolder}></span>
            <span className='exit' onClick={this.handleEditFolder}></span>
          </span>
        </span>
      </span>
    );
  }

  setStateToggleEdit() {
    this.setState({edit: !this.state.edit});
  }
};