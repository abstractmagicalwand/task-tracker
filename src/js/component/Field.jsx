import React, {Component} from 'react';

import config from '../db/config';

import Clone from '../mixin/index';

export default class Field extends Clone(Component) {
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
      const value = this.text.value;

      if (!~value.indexOf(' ')) return;

      const task = this.createTask(this.text.value);

      if (!task.description.length) return;

      window.dispatchEvent(new CustomEvent('TASK_CREATE', {
        detail: task
      }));
      this.text.value = '';
    }

    const newState = this.cloneDeep(this.state);

    if (!this.state.show) {
      this.setState(Object.assign(newState, {
        show: true
      }));
      return;
    }

    addTask.bind(this)();

    this.setState(Object.assign(newState, {
      show: false
    }));
  }

  createTask(text) {
    const priority = /\*+/,
      project = /@[\wа-яё]+/i,
      death = /\d\d\/\d\d\/\d\d/,
      money = /(?:\$)\d+/,
      timePrice = /\d\d:\d\d:\d\d/,
      formatTimePrice = timePrice.test(text)
        ? timePrice.exec(text)[0].split(':')
        : null,
      endFormatTimePrice = formatTimePrice
        ? +formatTimePrice[0] * 60 + +formatTimePrice[1]
        : config.DEFAULT_PRICE_MINUTES;

    return {
      stopwatch: [0, 0, 0],
      date: new Date(),
      complete: false,
      id: Math.floor(Math.random() * Math.pow(100, 10)),
      priority: priority.test(text) ? priority.exec(text)[0].length : 0,
      project: project.test(text) ? project.exec(text)[0] : 'SANS',
      timeDeath: death.test(text)
        ? death.exec(text)[0].split('/').map(item => +item)
        : null,
      price: money.test(text)
        ? money.exec(text)[0].slice(1)
        : config.DEFAULT_PRICE_TASK,
      timePrice: endFormatTimePrice,
      description: text
        .replace(priority, '')
        .replace(project, '')
        .replace(death, '')
        .replace(timePrice, '')
        .replace(money, '')
        .trim()
    };
  }

  render() {
    return (
      <div className="list__field">
        <span className="list__container-button-add">
          <span className="button-add" onClick={this.handleClickAdd} />
        </span>
        <textarea
          className={'list__area list__area_' +
            `${this.state.show ? 'show' : 'hidden'}`
          }
          ref={node => this.text = node}
          placeholder="Write your task..."
        />
      </div>
    );
  }

  componentDidUpdate() {
    this.state.show ? this.text.focus() : null;
  }
}
