import React     from 'react';
import ReactDOM  from 'react-dom';
import Stopwatch from './Stopwatch.jsx';
import Timer     from './Timer.jsx';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      descript: false
    };

    this.handleDelete        = this.handleDelete.bind(this);
    this.handleNote          = this.handleNote.bind(this);
    this.handleCompleted     = this.handleCompleted.bind(this);
    this.handleExit          = this.handleExit.bind(this);
    this.handleSave          = this.handleSave.bind(this);
    this.handleToggle        = this.handleToggle.bind(this);
    this.handleClickDescript = this.handleClickDescript.bind(this);

    this.edit = this.edit.bind(this);
    this.content = this.content.bind(this);
    this.archiv = this.archiv.bind(this);
    this.timer = this.timer.bind(this);
    this.getClearJournal = this.getClearJournal.bind(this);
    this.diffArrs = this.diffArrs.bind(this);
    this.diffDate = this.diffDate.bind(this);
    this.addArrs = this.addArrs.bind(this);
    this.color = this.color.bind(this);
    this.createPreview = this.createPreview.bind(this);
  }

  handleDelete() {
    window.dispatchEvent(new CustomEvent('TASK_DELETE', {
      detail: {id: this.props.info.id}
    }));
  }

  handleCompleted(e) {
    console.log(e);
    window.dispatchEvent(new CustomEvent('COMPLETED', {
      detail: {id: this.props.info.id}
    }));
    e.target.checked = false;
  }

  handleExit() {
    this.handleToggle();
  }

  handleSave(e) {
    this.handleToggle();
    window.dispatchEvent(new CustomEvent('EDIT_SAVE', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.value).value,
        id: this.props.info.id
      }
    }));
  }

  handleNote(e) {
    if (!e.target.classList.contains('button-note')) return;
    console.log('!!!')
    window.dispatchEvent(new CustomEvent('NOTE_OPEN', {
      detail: {
        id: this.props.info.id,
        value: this.props.info.note
      }
    }));
  }

  handleToggle() {
    const newState = Object.assign({}, this.state);
    newState.edit = !this.state.edit;
    this.setState(newState);
  }

  handleClickDescript(e) {
    if (!(e.target.classList.contains('task__container') || 
      e.target.classList.contains('task__descript'))) return;

    const newState = Object.assign({}, this.state);
    newState.descript = !this.state.descript;
    this.setState(newState);
    console.log(this.state.descript);
  }

  render() {
    const time = this.diffDate(this.props.info.project === 'ARCHIV' ?
      [] : this.getClearJournal(this.props.info.id));

    return (
      <div className='task'>
          {this.edit()}
          {this.content(time.stopwatch, time.timer, time.lable)}
          {this.archiv()}
      </div>
    );
  }

  componentDidMount() {
    if (this.state.edit) document.querySelector('.edit-field').focus();
  }

  componentWillUnmount() {
    if (!(this.props.info.project === 'ARCHIV')) {
      window.dispatchEvent(new CustomEvent('JOURNAL_SET', {
        detail: {
          id: this.props.info.id,
          date: new Date()
        }
      }));
    }
  }

  timer(time) {
    const t = this.props.info.timeDeath;

    if (!t) return;

    return (
      <Timer
        delete={this.handleDelete}
        id={this.props.info.id}
        time={time}
      />
    );
  }

  edit() {
    if (!this.state.edit) return;

    return (
      <span
        className={`task__container-descript  task__container task__container_level_${this.color()}`}
      >
        <input
          className="task__field"
          type="text"
          ref="value"
          defaultValue={`${this.props.info.description}`}
        />
        <span className="task__panel">
          <span className="button-save" onClick={this.handleSave} />
          <span className="button-exit" onClick={this.handleExit} />
        </span>
      </span>
    );
  }

  content(stopwatch, timer, lable) {
    if (this.props.info.project === 'ARCHIV' || this.state.edit) return;

    return (
      <span 
        onClick={this.handleClickDescript} 
        className={`task__container-descript${this.state.descript ? 
          ' task__container-descript_full' : 
          ''}`
      }>
        <span className={
          `task__container task__container_level${this.color()}`
        }>
          <div className="task__container-checkbox">
            <lable
              onClick={this.handleCompleted}
              className="task__checkbox"
            >
            <input type="checkbox"/>
            </lable>
          </div>
          <p
            className="task__descript"
          >
            {this.createPreview(
              this.props.info.description, 
              this.props.preview
            )}
          </p>

          <span className="task__panel">
            {this.timer(timer)}
            {lable ? <span className="task__lable"></span> : null}
            <Stopwatch
              id={this.props.info.id}
              time={stopwatch}
            />
            <span
              title="edit"
              className="button-edit"
              onClick={this.handleExit}
            />
            <span
              title="note"
              className="button-note"
              onClick={this.handleNote}
            />
            <span
              title="delete"
              className="button-delete"
              onClick={this.handleDelete}
            />
          </span>
        </span>
        <span className="task__detail" hidden={!this.state.descript}>
          <p>
            <span className="task__attribute">
              Description:
            </span> 
            {this.props.info.description}
          </p>
          <p>
            <span className="task__attribute">
              Price:
            </span>  
            {this.props.info.price}
            \sUSD
          </p>
          <p>
            <span className="task__attribute">
              Time on complete:
            </span>  
            {this.props.info.timePrice} 
            minutes
          </p>
        </span>
      </span>
    );
  }

  archiv() {
    if (this.props.info.project !== 'ARCHIV') return;
    return (
      <span className="task__container task__container_level_one">
        <p className="task__descript">{this.props.info.description}</p>
        <span className="task__panel">
          <span className="button-delete" onClick={this.handleDelete} />
        </span>
      </span>
    );
  }

  createPreview(str, n) {
    if (str.length < n) return str;
    return `${str.slice(0, n)}...`;
  }

  getClearJournal(id) {
    let index;
    const tmp = this.props.journal.filter((item, i)=> {

      if (item.id === id) {
        index = i;
        return true;
      }

      return false;
    });

    window.dispatchEvent(new CustomEvent('JOURNAL_CLEAR', {
      detail: {index: index}
    }));

    return tmp; // timer, stopwatch ...
  }

  diffDate(journal) {
    const timer     = this.props.info.timeDeath,
          stopwatch = this.props.info.stopwatch,
          result    = {
            timer: timer,
            stopwatch: stopwatch,
            lable: false
          };

    if (!journal.length) {
      return result;
    }

    // j - short name from journal
    const j = (typeof(journal[0].date) === 'string') ? 
      new Date(journal[0].date) :
      journal[0].date;

    const journalHMS = [j.getHours(), j.getMinutes(), j.getSeconds()];

    const now = new Date();

    const nowDate = [now.getHours(), now.getMinutes(), now.getSeconds()];

    if (timer) {
      result.timer = this.formatTimer(
        this.diffArrs(
          timer,
          this.formatTimer(
            this.diffArrs(nowDate, journalHMS)
          )
        )
      );
    }

    if (!timer || Math.min(...result.timer) < 0) result.timer = timer;

    if (stopwatch.some(item => item > 0)) {
      result.lable = true;
      result.stopwatch = this.formatStopwatch(
        this.addArrs(
          stopwatch,
          this.formatTimer(
            this.diffArrs(nowDate, journalHMS)
          )
        )
      );
    } else {
      result.stopwatch = stopwatch;
    }

    return result;
  }

  diffArrs(arr1, arr2) {
    for (let i = arr1.length; --i >= 0;) arr1[i] -= arr2[i];
    return arr1;
  }

  addArrs(arr1, arr2) {
    for (let i = arr1.length; --i >= 0;) arr1[i] += arr2[i];
    return arr1;
  }

  formatTimer(arr) {

    for (let i = arr.length; --i >= 0;) {

      while (arr[i] < 0) {

        if (arr[i] < 0) {
          arr[i] += 60;

          if (0 <= (i - 1)) {
            arr[i - 1] -= 1;
          } else {
            arr[i] = arr[i + 1] = arr[i + 2] = 0;
          }

        }

      }

    }

    return arr;
  }

  formatStopwatch(arr) {

    for (let i = arr.length; --i >= 0;) {

      while (arr[i] > 59) {

        if (arr[i] > 59) {
          arr[i] -= 60;
          if (0 <= (i - 1)) arr[i - 1] += 1;
        }

      }

    }

    return arr;
  }

  color() {

    switch (this.props.info.priority) {
    case 0:
        return '_one';
    case 1:
        return '_two';
    case 2:
        return '_three';
    case 3:
        return '_four';
    case 4:
        return '_five';
    }

  }

};
