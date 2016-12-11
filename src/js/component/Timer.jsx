import React, {Component} from 'react';

import Clone from '../mixin/index';

export default class Timer extends Clone(Component) {
  constructor(props) {
    super(props);
    this.state = {
      spoiler: true
    };

    this.handleTickTimer = this.handleTickTimer.bind(this);

    this.timer = null;
    this.cancel = this.cancel.bind(this);
    this.spoiler = this.spoiler.bind(this);
    this.show = this.show.bind(this);
    this.spoiler = this.spoiler.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  handleTickTimer() {
    let [h, m, s] = this.props.time;

    if (s > 0) {
      --s;
    } else if (s === 0 && m > 0) {
      s = 59;
      --m;
    } else if (m === 0) {
      s = 59;
      m = 59;
      --h;
    }

    window.dispatchEvent(new CustomEvent('TICK', {
      detail: {
        type: 'timer',
        time: [h, m, s],
        id: this.props.id
      }
    }));
  }

  cancel() {
    clearInterval(this.timer);
    this.timer = null;
    this.delete();
  }

  hidden() {
    if (!this.state.spoiler) return;

    return (
      <span className="button-close" onClick={this.spoiler} title="show" />
    );
  }

  show() {
    const t = this.props.time;

    if (this.state.spoiler) return;

    return (
      <span className="timer__container">
        <span
          className="button-cancel"
          title="cancel"
          onClick={this.cancel}
        />
        <span>{t[0] < 10 ? `0${t[0]}` : t[0]}:</span>
        <span>{t[1] < 10 ? `0${t[1]}` : t[1]}:</span>
        <span>{t[2] < 10 ? `0${t[2]}` : t[2]}</span>
        <span
          className="button-open"
          title="spoil"
          onClick={this.spoiler}
        />
      </span>
    );
  }

  spoiler() {
    this.setState(Object.assign(this.cloneDeep(this.state), {
      spoiler: !this.state.spoiler
    }));
  }

  delete() {
    window.dispatchEvent(new CustomEvent('TIMER_DELETE', {
      detail: {
        id: this.props.id
      }
    }));
  }

  deleteTask() {
    if (!Math.max(...this.props.time) || Math.min(...this.props.time) < 0)
      this.props.delete();
  }

  componentWillMount() {
    clearInterval(this.timer);
    this.timer = null;
    this.deleteTask();
  }

  componentDidMount() {
    const self = this;

    this.timer = setInterval(self.handleTickTimer, 1000);
  }

  componentWillUpdate() {
    this.deleteTask();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    return (
      <span className="timer">
        {this.show()}
        {this.hidden()}
      </span>
    );
  }
}