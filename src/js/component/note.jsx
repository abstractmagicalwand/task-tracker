import React    from 'react';
import ReactDOM from 'react-dom';

export default class Note extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickBackNote = this.handleClickBackNote.bind(this);
    this.handleClickSaveNote = this.handleClickSaveNote.bind(this);
  }

  handleClickBackNote(e) {
    window.dispatchEvent(new CustomEvent('back'));
  }

  handleClickSaveNote(e) {
    window.dispatchEvent(new CustomEvent('saveNote', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.text).value
      }
    }));
  }

  render() {
    return (
      <div className='note'>
        <div className='note-panel'>
          <span className='exit' onClick={this.handleClickBackNote}></span>
          <span className='save' onClick={this.handleClickSaveNote}></span>
        </div>
        <textarea
          className='note-field'
          defaultValue={`${this.props.value}`}
          ref='text'
          placeholder='Write you note...'>
        </textarea>
      </div>
    );
  }
};