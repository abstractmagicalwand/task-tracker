import React    from 'react';
import ReactDOM from 'react-dom';
import Field    from './field.jsx';
import Search   from './search.jsx';
import Task     from './task.jsx';

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.tmpDate = null;

    this.getDate      = this.getDate.bind(this);
    this.getCompTasks = this.getCompTasks.bind(this);
  }

  render() {
    return (
      <div className='list'>
        {this.props.type !== 'archiv' ? <Search /> : null}
        {this.props.type !== 'archiv' ? <Field />  : null}
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
    return tasks.map((task, i) => {

      if (this.tmpDate === task.date) {
        return <Task journal={this.props.journal} info={task} key={task.id} />
      } else {
        this.tmpDate = task.date;
        return this.getDate(task, task.date);
      }

    });
  }

  getDate(task, date) {
    return (
      <div className='wrapDate' key={task.id}>
        <p className='date'>
        {this.getFormatDate(task.date)}
        </p>
        <Task journal={this.props.journal} info={task} />
      </div>
    );
  }

  getFormatDate(DATE) {
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

    const date = new Date(DATE);
    return `${date.getDay()}, ${getNameMonth(date.getMonth())} ${date.getFullYear()}`;
  }

};