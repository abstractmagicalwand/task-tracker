import React     from 'react';
import ReactDOM  from 'react-dom';
import Stopwatch from './stopwatch.jsx';
import Timer     from './timer.jsx';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {edit: false};

    this.handleDelete   = this.handleDelete.bind(this);
    this.handleNote     = this.handleNote.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleEdit     = this.handleEdit.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
    this.edit               = this.edit.bind(this);
    this.content            = this.content.bind(this);
    this.archiv             = this.archiv.bind(this);
    this.timer              = this.timer.bind(this);
    this.getClearJournal    = this.getClearJournal.bind(this);
    this.diffArrs           = this.diffArrs.bind(this);
    this.diffDate           = this.diffDate.bind(this);
    this.addArrs            = this.addArrs.bind(this);
  }

  handleDelete() {
    window.dispatchEvent(new CustomEvent('deleteTask', {
      detail: {id: this.props.info.id}
    }));
  }

  handleComplete(e) {
    window.dispatchEvent(new CustomEvent('complete', {
      detail: {id: this.props.info.id}
    }));
    e.target.checked = false;
  }

  handleEdit() {
    this.setStateToggleEdit();
  }

  handleSaveEdit(e) {
    this.setStateToggleEdit();
    window.dispatchEvent(new CustomEvent('save', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.value).value,
        id: this.props.info.id
      }
    }));
  }

  handleNote(e) {
    if (!e.target.classList.contains('note-btn')) return;
    window.dispatchEvent(new CustomEvent('openNote', {
      detail: {
        id: this.props.info.id,
        value: this.props.info.note
      }
    }));
  }

  render() {
    const time = this.diffDate(this.getClearJournal(this.props.info.id));

    return (
      <div className='task'>
        {this.edit()}
        {this.content(time.stopwatch, time.timer)}
        {this.archiv()}
      </div>
    );
  }

  componentDidMount() {
    if (this.state.edit) document.querySelector('.edit-field').focus();
  }

  componentWillUnmount() {
    if (!(this.props.info.project === 'ARCHIV')) {
      window.dispatchEvent(new CustomEvent('setInJournal', {
        detail: {
          id: this.props.info.id,
          date: new Date()
        }
      }));
    }
  }

  timer(time) {
    if (!this.props.info.timeDeath) return;
    return (
      <Timer
        className='wrap'
        old={this.props.info.now}
        id={this.props.info.id}
        time={time}
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
        <span className='save' onClick={this.handleSaveEdit}></span>
        <span className='exit' onClick={this.handleEdit}></span>
      </span>
    );
  }

  content(stopwatch, timer) {
    if (this.props.info.project === 'ARCHIV' || this.state.edit) return;

    return (
      <span className='wrap'>
        <lable
          onClick={this.handleComplete}
          className='complete'>
        <input type='checkbox'/></lable>
        <p className='descript'>{this.props.info.description}</p>
        {this.timer(timer)}
        <Stopwatch
          old={this.props.info.now}
          id={this.props.info.id}
          time={stopwatch}
        />
        <span className='edit-btn' onClick={this.handleEdit}></span>
        <span className='note-btn' onClick={this.handleNote}></span>
        <span className='delete-btn' onClick={this.handleDelete}></span>
      </span>
    );
  }

  archiv() {
    if (this.props.info.project !== 'ARCHIV') return;
    return (
      <span className='wrap'>
        <p className='descript archiv'>{this.props.info.description}</p>
        <span className='delete-btn' onClick={this.handleDelete}></span>
      </span>
    );
  }

  setStateToggleEdit() { this.setState({edit: !this.state.edit}); }

  getClearJournal(id) {
    let index;
    const tmp = this.props.journal.filter((item, i)=> {

      if (item.id === id) {
        index = i;
        return true;
      }

      return false;

    });

    window.dispatchEvent(new CustomEvent('clearJournal', {
      detail: {index: index}
    }));

    return tmp; // timer, stopwatch ...
  }

  diffDate(journal) {
    const result = {},
          timer     = this.props.info.timeDeath,
          stopwatch = this.props.info.stopwatch;



    if (journal.length) {
      console.log('result', journal);
      const journalToFormat = [
        journal[0].date.getHours(),
        journal[0].date.getMinutes(),
        journal[0].date.getSeconds()
      ],
            now = new Date(),
            nowDate = [
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ];

      if (timer) {
        result.timer = this.diffArrs(timer, this.diffArrs(journalToFormat, nowDate));
      } else {

      }

      if (Math.min(result) > 0) {
        result.stopwatch = this.addArrs(this.diffArrs(journalToFormat, nowDate), stopwatch);
      } else {
        result.stopwatch = stopwatch;
      }

      console.log('result', result);
    } else {
      result.timer = timer;
      result.stopwatch = stopwatch;
    }


    return result;
  }

  diffArrs(arrOne, arrTwo) {
    for (let i = arrOne.length; --i >= 0;) arrOne[i] -= arrTwo[i];
    return arrOne;
  }

  addArrs(arrOne, arrTwo) {
    for (let i = arrOne.length; --i >= 0;) arrOne[i] += arrTwo[i];
    return arrOne;
  }

};