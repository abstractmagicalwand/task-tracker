import React    from 'react';
import ReactDOM from 'react-dom';

export default class Folder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false
    };

    this.handleDeleteFolder   = this.handleDeleteFolder.bind(this);
    this.handleEditFolder     = this.handleEditFolder.bind(this);
    this.handleNoteFolder     = this.handleNoteFolder.bind(this);
    this.handleClickFolder    = this.handleClickFolder.bind(this);
    this.handleSaveEditFolder = this.handleSaveEditFolder.bind(this);
    this.handleBackEditFolder = this.handleBackEditFolder.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
    this.edit               = this.edit.bind(this);
    this.content            = this.content.bind(this);
  }

  handleClickFolder(e) {
    const tag = e.target.tagName;
    if (e.target.className !== 'wrap' && tag !== 'DIV' && tag !== 'P') return;

    window.dispatchEvent(new CustomEvent('RELOCATE', {
      detail: {category: this.props.info.project}
    }));
  }

  handleDeleteFolder(e) {

    if (!e.target.classList.contains('button-delete')) return;

    window.dispatchEvent(new CustomEvent('FOLDER_DELETE', {
      detail: {project: this.props.info.project}
    }));
  }

  handleEditFolder(e) {
    if (!e.target.classList.contains('button-edit')) return;
    this.setStateToggleEdit();
  }

  handleSaveEditFolder(e) {
    this.setStateToggleEdit();

    window.dispatchEvent(new CustomEvent('EDIT_SAVE', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.value).value.slice(0, 21),
        project: this.props.info.project
      }
    }));
  }

  handleBackEditFolder(e) {
    this.setStateToggleEdit();
  }

  handleNoteFolder(e) {
    if (!e.target.classList.contains('button-note')) return;
    window.dispatchEvent(new CustomEvent('NOTE_OPEN', {
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
        onClick={this.handleClickFolder}
      >
        {this.content()}
        {this.edit()}
      </div>
    );
  }

  content() {
    if (this.state.edit) return;

    return (
      <div className='folder__container folder__container_level_one'>
        <p
          className='folder__name'
          onClick={this.handleClickFolder}
        >
          {`${this.props.info.project}`}
        </p>
        <span className='folder__panel'>
          <span className='button-delete' onClick={this.handleDeleteFolder} />
          <span className='button-edit'   onClick={this.handleEditFolder} />
          <span className='button-note'   onClick={this.handleNoteFolder} />
        </span>
      </div>
    );
  }

  edit() {
    if (!this.state.edit) return;

    return (
      <span className='folder__container folder__container_level_one'>
        <input
          className='folder__field'
          type='text'
          ref='value'
          defaultValue={`${this.props.info.project}`}
        />
        <span className='folder__edit-panel'>
          <span
            className='button-save'
            onClick={this.handleSaveEditFolder}
          />
          <span
            className='button-exit'
            onClick={this.handleBackEditFolder}
          />
        </span>
      </span>
    );
  }

  setStateToggleEdit() {
    this.setState({edit: !this.state.edit});
  }
};