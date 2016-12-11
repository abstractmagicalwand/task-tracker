import React, {Component} from 'react';

import Clone from '../mixin/index';

export default class Folder extends Clone(Component) {
  constructor(props) {
    super(props);
    this.state = {
      edit: false
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleNote = this.handleNote.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);
    this.handleBackEdit = this.handleBackEdit.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
    this.edit = this.edit.bind(this);
    this.content = this.content.bind(this);
  }

  setStateToggleEdit() {
    this.setState(Object.assign(this.cloneDeep(this.state), {
      edit: !this.state.edit
    }));
  }

  content() {
    if (this.state.edit) return;

    return (
      <div className="folder__container folder__container_level_one">
        <p
          className="folder__name"
          onClick={this.handleClick}
        >
          {`${this.props.info.project}`}
        </p>
        <span className="folder__panel">
          <span className="button-delete" onClick={this.handleDelete} />
          <span className="button-edit" onClick={this.handleEdit} />
          <span className="button-note" onClick={this.handleNote} />
        </span>
      </div>
    );
  }

  edit() {
    if (!this.state.edit) return;

    return (
      <span className="folder__container folder__container_level_one">
        <input
          className="folder__field"
          type="text"
          ref={node => this.value = node}
          defaultValue={`${this.props.info.project}`}
        />
        <span className="folder__edit-panel">
          <span
            className="button-save"
            onClick={this.handleSaveEdit}
          />
          <span
            className="button-exit"
            onClick={this.handleBackEdit}
          />
        </span>
      </span>
    );
  }

  handleClick(e) {
    const tag = e.target.tagName;

    if (e.target.className !== 'wrap' && tag !== 'DIV' && tag !== 'P') return;

    window.dispatchEvent(new CustomEvent('RELOCATE', {
      detail: {
        category: this.props.info.project
      }
    }));
  }

  handleDelete(e) {
    if (!e.target.classList.contains('button-delete')) return;

    window.dispatchEvent(new CustomEvent('FOLDER_DELETE', {
      detail: {
        project: this.props.info.project
      }
    }));
  }

  handleEdit(e) {
    if (!e.target.classList.contains('button-edit')) return;

    this.setStateToggleEdit();
  }

  handleSaveEdit() {
    this.setStateToggleEdit();

    window.dispatchEvent(new CustomEvent('EDIT_SAVE', {
      detail: {
        value: this.value.value.slice(0, 21),
        project: this.props.info.project
      }
    }));
  }

  handleBackEdit() {
    this.setStateToggleEdit();
  }

  handleNote(e) {
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
        className="folder"
        onClick={this.handleClick}
      >
        {this.content()}
        {this.edit()}
      </div>
    );
  }
}