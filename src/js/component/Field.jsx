import React    from 'react';
import ReactDOM from 'react-dom';

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
      if (!ReactDOM.findDOMNode(this.refs.text).value.length) return;

      const task = this.createTask(ReactDOM.findDOMNode(this.refs.text).value);

      if (!task.description.length) return;

      window.dispatchEvent(new CustomEvent('addNewTask', {
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
          className={`list__area_${this.state.show ? 'show' : 'hidden'}`}
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
            0;

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

    task.preview = `${task.description.length > 95 ? `${task.description.slice(0, 61)}...` : task.description}`;

    return task;
  }
};