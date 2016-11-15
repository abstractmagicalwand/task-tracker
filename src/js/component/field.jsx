import React    from 'react';
import ReactDOM from 'react-dom';

export default class Field extends React.Component {
  constructor(props) {
    super(props);
    this.handleGetText = this.handleGetText.bind(this);

    this.getNewTask = this.getNewTask.bind(this);
  }

  handleGetText() {
    if (!ReactDOM.findDOMNode(this.refs.text).value.length) return;
    const event = new CustomEvent('addNewTask', {
      detail: this.getNewTask(ReactDOM.findDOMNode(this.refs.text).value)
    });
    ReactDOM.findDOMNode(this.refs.text).value = '';

    window.dispatchEvent(event);
  }

  render() {
    return (
      <div className='field'>
        <textarea className='area' ref='text' placeholder='Write you task...'>
        </textarea>
        <span className='sand' onClick={this.handleGetText}/>
      </div>
    );
  }

  getNewTask(text) {
    const priority = /\*+/,
          project  = /@[\wа-яё]+/i,
          tags     = /#[\wа-яё]+/ig,
          death    = /\d\d\/\d\d\/\d\d/;

    const task = {
      stopwatch: [0, 0, 0],
      date: new Date(),
      complete: false,
      tags: text.match(tags),
      id: Math.floor(Math.random() * Math.pow(100, 10)),
      priority: priority.test(text) ? priority.exec(text)[0].length : null,
      project: project.test(text) ? project.exec(text)[0] : 'SANS',
      timeDeath: death.test(text) ? death.exec(text)[0].split(/\//) : null,
      description: text
        .replace(priority, '')
        .replace(project,  '')
        .replace(tags,     '')
        .replace(death,    '')
        .trim()
    };

    return task;
  }
};