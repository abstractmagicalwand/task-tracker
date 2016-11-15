import React     from 'react';
import ReactDOM  from 'react-dom';
import Stopwatch from './stopwatch.jsx';
import Timer     from './timer.jsx';

let keyId = 0;

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
    this.compileTask = this.compileTask.bind(this);
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
    return <div className='task'>{this.compileTask()}</div>;
  }

  componentDidMount() {
    if (this.state.edit) document.querySelector('.edit-field').focus();
  }

  compileTask() {
    const resultTask = [];

    if (this.state.edit) {
      resultTask.push(
        <input
          key={++keyId}
          className='edit-field'
          type='text'
          ref='value'
          defaultValue={`${this.props.info.description}`}
        />,
        <span className='save' key={++keyId} onClick={this.handleSaveEditTask}></span>,
        <span className='exit' key={++keyId} onClick={this.handleEditTask}></span>
      );
    } else {
      if (this.props.info.project !== 'ARCHIV') {
        resultTask.push(
          <lable
            key={++keyId}
            onClick={this.handleCompleteTask}
            className='complete'>
          <input key={++keyId} type='checkbox'/></lable>,
          <p key={++keyId} className='descript'>{this.props.info.description}</p>,
          <Stopwatch
            key={++keyId}
            old={this.props.info.now}
            id={this.props.info.id}
            time={this.props.info.stopwatch}
          />,
          <span key={++keyId} className='edit-btn' onClick={this.handleEditTask}></span>,
          <span key={++keyId} className='note-btn' onClick={this.handleNoteTask}></span>,
          <span key={++keyId} className='delete-btn' onClick={this.handleDeleteTask}></span>
        );
      } else {
        resultTask.push(
          <p key={++keyId} className='descript archiv'>{this.props.info.description}</p>,
          <span key={++keyId} className='delete-btn' onClick={this.handleDeleteTask}></span>
        );
      }

      if (this.props.info.timeDeath) {
        resultTask.splice(2, 0, <Timer
          key={++keyId}
          old={this.props.info.now}
          id={this.props.info.id}
          time={this.props.info.timeDeath}
        />);
      }
    }

    return resultTask;
  }

  setStateToggleEdit() {
    this.setState({edit: !this.state.edit});
  }
};