import React    from 'react';
import ReactDOM from 'react-dom';

export default class Field extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewTask = this.handleNewTask.bind(this);

    this.createTask = this.createTask.bind(this);
  }

  handleNewTask() {
    if (!ReactDOM.findDOMNode(this.refs.text).value.length) return;

    const task = this.createTask(ReactDOM.findDOMNode(this.refs.text).value);

    if (!task.description.length) return;

    window.dispatchEvent(new CustomEvent('addNewTask', {
      detail: task
    }));
    ReactDOM.findDOMNode(this.refs.text).value = '';
  }

  render() {
    return (
      <div className='field'>
        <textarea className='area' ref='text' placeholder='Write you task...'>
        </textarea>
        <span title='add task' className='sand' onClick={this.handleNewTask}/>
      </div>
    );
  }

  createTask(text) {
    const priority  = /\*+/,
          project   = /@[\wа-яё]+/i,
          tags      = /#[\wа-яё]+/ig,
          death     = /\d\d\/\d\d\/\d\d/,
          money     = /(?:\$)\d+/,
          timePrice = /\d\d:\d\d:\d\d/,
          formatTimePrice = timePrice.test(text) ?
            timePrice.exec(text)[0].split(':') : null,
          endFormatTimePrice = formatTimePrice ?
            +formatTimePrice[0] * 60 + +formatTimePrice[1] : 0;

    const task = {
      stopwatch: [0, 0, 0],
      date: new Date(),
      complete: false,
      tags: text.match(tags),
      id: Math.floor(Math.random() * Math.pow(100, 10)),
      priority: priority.test(text) ? priority.exec(text)[0].length : 0,
      project: project.test(text) ? project.exec(text)[0] : 'SANS',
      timeDeath: death.test(text) ? death.exec(text)[0].split(/\//) : null,
      price: money.test(text) ? money.exec(text)[0].slice(1) : 5,
      timePrice: endFormatTimePrice,
      description: text
        .replace(priority, '')
        .replace(project, '')
        .replace(tags, '')
        .replace(death, '')
        .replace(timePrice, '')
        .replace(money, '')
        .trim()
    };
    console.log(task);
    return task;
  }
};