import React           from 'react';
import ReactDOM        from 'react-dom';
import Field           from './field.jsx';
import Search          from './search.jsx';
import Task            from './task.jsx';
import {journal, temp} from '../db/journal.js';

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickBackList = this.handleClickBackList.bind(this);

    this.getDate      = this.getDate.bind(this);
    this.getCompTasks = this.getCompTasks.bind(this);
    this.handleBlockSelect = this.handleBlockSelect.bind(this);
  }

  handleClickBackList(e) {
    window.dispatchEvent(new CustomEvent('back'));
  }

  handleBlockSelect(e) {
    console.log(1);
  }

  render() {
    return (
      <div className='list'>
        {this.props.type === 'project' ? <span onTouchStart={this.handleBlockSelect} className='list-exit' onClick={this.handleClickBackList}>{'\u25C0' + ' back'}</span> : null}
        {this.props.type !== 'archiv'  ? <Search /> : null}
        {this.props.type !== 'archiv'  ? <Field />  : null}
        {this.getCompTasks(this.getTasks(this.props.type, this.props.db))}
      </div>
    );
  }

  getTasks(type, db) {

    switch (type) {
    case 'inbox':
        return this.getInboxTasks(db);
    case 'archiv':
        return db.filter(item => {
          if (item.project === 'ARCHIV') return item;
        })[0].tasks;
    case 'project':
        return db.filter(item => {
          if (item.project === this.props.projectName) return item;
        })[0].tasks;
    case 'search':
        const val = this.props.value;
        return this.getInboxTasks(db).filter((item, d, array) => {
          if (~item.description.search(new RegExp(`${val}`, 'i'))) return item;
        });
    }

  }

  getInboxTasks(db) {
    return db.filter(item => {
      if (!(item.project === 'ARCHIV'))  return item;
    }).reduce((sum, item) => sum.concat(item.tasks), []);
  }

  getCompTasks(tasks) {

    const exceptions = ['project', 'archiv', 'search'];

    function compareDateYMD(date1, date2) {
      if (!date1 || !date2) return false;

      // short name string to date, param string, return create date
      const std = s => new Date(s);
      date1 = std(date1);
      date2 = std(date2);

      if (!(date1.getFullYear() === date2.getFullYear()) ||
          !(date1.getMonth()    === date2.getMonth())    ||
          !(date1.getDay()      === date2.getDay())) {
          return false;
      }

      return true;
    }

    return tasks.map((task, i) => {

      if (compareDateYMD(temp.date, task.date) ||
        ~exceptions.indexOf(this.props.type)) {
        return (
          <Task
            journal={this.props.journal}
            info={task}
            key={task.id}
            stopwatch={this.props.stopwatch}
          />
        );
      } else {
        temp.date = task.date;
        return this.getDate(task, task.date);
      }

    });
  }

  getDate(task, date) {
    return (
      <div className='wrap-date' key={task.id}>
        <p className='date'>
        {this.getFormatDate(task.date)}
        </p>
        <Task
          journal={this.props.journal}
          info={task}
          stopwatch={this.props.stopwatch}
        />
      </div>
    );
  }

  getFormatDate(date) {
    function getNameMonth(month) {
      switch (month) {
      case 0:
          return 'January';
      case 1:
          return 'February';
      case 2:
          return 'March';
      case 3:
          return 'April';
      case 4:
          return 'May';
      case 5:
          return 'June';
      case 6:
          return 'July';
      case 7:
          return 'August';
      case 8:
          return 'September';
      case 9:
          return 'October';
      case 10:
          return 'November';
      case 11:
          return 'December';
      }
    }
    // d - short name date
    const d = new Date(date);
    return `${d.getDate()}, ${getNameMonth(d.getMonth())} ${d.getFullYear()}`;
  }

};