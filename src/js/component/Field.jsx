import React    from 'react';
import ReactDOM from 'react-dom';
import {config} from '../db/config.js';

export default class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };

    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.createTask = this.createTask.bind(this);
  }

  handleClickAdd() {
    function addTask() {
      const value = ReactDOM.findDOMNode(this.refs.text).value;

      if (!~value.indexOf(' ')) return;

      const task = this.createTask(ReactDOM.findDOMNode(this.refs.text).value);

      if (!task.description.length) return;

      window.dispatchEvent(new CustomEvent('TASK_CREATE', {
        detail: task
      }));
      ReactDOM.findDOMNode(this.refs.text).value = '';
    }

    const newState = Object.assign({}, this.state);

    if (!this.state.show) {
      newState.show = true;
      this.setState(newState);
      return;
    }

    addTask.bind(this)();

    newState.show = false;
    this.setState(newState);
  }

  render() {
    return (
      <div className='list__field'>
        <textarea
          className={
            'list__area ' + 
            `list__area_${this.state.show ? 'show' : 'hidden'}`
          }
          ref='text'
          placeholder='Write you task...'
        >
        </textarea>
        <span className='list_container-button-add'>
          <span className='button-add' onClick={this.handleClickAdd} />
        </span>
      </div>
    );
  }

  componentDidUpdate() {
    this.state.show ? ReactDOM.findDOMNode(this.refs.text).focus() : null;
  }

  createTask(text) {
    const priority  = /\*+/,
          project   = /@[\wа-яё]+/i,
          tags      = /#[\wа-яё]+/ig,
          death     = /\d\d\/\d\d\/\d\d/,
          money     = /(?:\$)\d+/,
          timePrice = /\d\d:\d\d:\d\d/,
          formatTimePrice = timePrice.test(text) ?
            timePrice.exec(text)[0].split(':') :
            null,
          endFormatTimePrice = formatTimePrice ?
            +formatTimePrice[0] * 60 + +formatTimePrice[1] :
            config.DEFAULT_PRICE_MINUTES;

    const task = {
      stopwatch: [0, 0, 0],
      date: new Date(),
      complete: false,
      tags: text.match(tags),
      id: Math.floor(Math.random() * Math.pow(100, 10)),
      priority: priority.test(text) ? priority.exec(text)[0].length : 0,
      project: project.test(text) ? project.exec(text)[0] : 'SANS',
      timeDeath: death.test(text) ? 
        death.exec(text)[0].split(/\//) : 
        null,
      price: money.test(text) ? 
        money.exec(text)[0].slice(1) : 
        config.DEFAULT_PRICE_TASK,
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
    
    return task;
  }
};