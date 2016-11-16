import React     from 'react';
import ReactDOM  from 'react-dom';
import Stopwatch from './stopwatch.jsx';
import Timer     from './timer.jsx';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {edit: false};

    this.handleDeleteTask      = this.handleDeleteTask.bind(this);
    this.handleNoteTask        = this.handleNoteTask.bind(this);
    this.handleCompleteTask    = this.handleCompleteTask.bind(this);
    this.handleEditTask        = this.handleEditTask.bind(this);
    this.handleSaveEditTask    = this.handleSaveEditTask.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
    this.edit               = this.edit.bind(this);
    this.content            = this.content.bind(this);
    this.archiv             = this.archiv.bind(this);
    this.timer              = this.timer.bind(this);
  }

  handleDeleteTask() {
    window.dispatchEvent(new CustomEvent('deleteTask', {
      detail: {id: this.props.info.id}
    }));
  }

  handleCompleteTask(e) {
    window.dispatchEvent(new CustomEvent('complete', {
      detail: {id: this.props.info.id}
    }));
    e.target.checked = false;
  }

  handleEditTask() {
    this.setStateToggleEdit();
  }

  handleSaveEditTask(e) {
    this.setStateToggleEdit();
    window.dispatchEvent(new CustomEvent('save', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.value).value,
        id: this.props.info.id
      }
    }));
  }

  handleNoteTask(e) {
    if (!e.target.classList.contains('note-btn')) return;
    window.dispatchEvent(new CustomEvent('openNote', {
      detail: {
        id: this.props.info.id,
        value: this.props.info.note
      }
    }));
  }

  render() {
    return (
      <div className='task'>
        {this.edit()}

        {this.content()}
        {this.archiv()}
      </div>
    );
  }

  componentDidMount() {
    if (this.state.edit) document.querySelector('.edit-field').focus();
  }

  timer() {
    if (!this.props.info.timeDeath) return;
    return (
      <Timer
        className='wrap'
        old={this.props.info.now}
        id={this.props.info.id}
        time={this.props.info.timeDeath}
      />
    );
  }

  edit() {
    if (!this.state.edit) return;
    return (
      <span className='wrap'>
        <input
          className='edit-field'
          type='text'
          ref='value'
          defaultValue={`${this.props.info.description}`}
        />
        <span className='save' onClick={this.handleSaveEditTask}></span>
        <span className='exit' onClick={this.handleEditTask}></span>
      </span>
    );
  }

  content() {
    if (this.props.info.project === 'ARCHIV' || this.state.edit) return;
    return (
      <span className='wrap'>
        <lable
          onClick={this.handleCompleteTask}
          className='complete'>
        <input type='checkbox'/></lable>
        <p className='descript'>{this.props.info.description}</p>
        {this.timer()}
        <Stopwatch
          old={this.props.info.now}
          id={this.props.info.id}
          time={this.props.info.stopwatch}
        />
        <span className='edit-btn' onClick={this.handleEditTask}></span>
        <span className='note-btn' onClick={this.handleNoteTask}></span>
        <span className='delete-btn' onClick={this.handleDeleteTask}></span>
      </span>
    );
  }

  archiv() {
    if (this.props.info.project !== 'ARCHIV') return;
    return (
      <span className='wrap'>
        <p className='descript archiv'>{this.props.info.description}</p>
        <span className='delete-btn' onClick={this.handleDeleteTask}></span>
      </span>
    );
  }

  setStateToggleEdit() {
    this.setState({edit: !this.state.edit});
  }
};