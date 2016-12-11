import React, {Component} from 'react';

export default class Note extends Component {
  constructor(props) {
    super(props);

    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  handleClickBack() {
    window.dispatchEvent(new CustomEvent('BACK'));
  }

  handleClickSave() {
    window.dispatchEvent(new CustomEvent('NOTE_SAVE', {
      detail: {
        value: this.text.value
      }
    }));
  }

  render() {
    return (
      <div className="note">
        <div className="note__container">
          <div className="note__panel">
            <span className="button-exit" onClick={this.handleClickBack} />
            <span className="button-save" onClick={this.handleClickSave} />
          </div>
          <textarea
            className="note__field"
            defaultValue={`${this.props.value}`}
            ref={node => this.text = node}
            placeholder="Write you note..."
          />
        </div>
      </div>
    );
  }
}