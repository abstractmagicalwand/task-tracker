import React    from 'react';
import ReactDOM from 'react-dom';

export default class Note extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  handleClickBack(e) {
    window.dispatchEvent(new CustomEvent('back'));
  }

  handleClickSave(e) {
    window.dispatchEvent(new CustomEvent('NOTE_SAVE', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.text).value
      }
    }));
  }

  render() {
    return (
      <div className='note'>
        <div className='note__container'>
          <div className='note__panel'>
            <span className='button-exit' onClick={this.handleClickBack} />
            <span className='button-save' onClick={this.handleClickSave} />
          </div>
          <textarea
            className='note__field'
            defaultValue={`${this.props.value}`}
            ref='text'
            placeholder='Write you note...'>
          </textarea>
        </div>
      </div>
    );
  }
};