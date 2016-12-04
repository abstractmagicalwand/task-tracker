import React    from 'react';
import ReactDOM from 'react-dom';

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spoiler: true
    };
    this.timer           = null;
    this.handleTickTimer = this.handleTickTimer.bind(this);
    this.cancel          = this.cancel.bind(this);
    this.spoiler         = this.spoiler.bind(this);
    this.show            = this.show.bind(this);
    this.spoiler         = this.spoiler.bind(this);
    this.delete          = this.delete.bind(this);
    this.deleteTask      = this.deleteTask.bind(this);
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

    window.dispatchEvent(new CustomEvent('tick', {
      detail: {
        type: 'timer',
        time: [h, m, s],
        id: this.props.id
      }
    }));

  }

  componentWillMount() {
    clearInterval(this.timer);
    this.timer = null;
    this.deleteTask();
  }

  componentWillUpdate() { this.deleteTask(); }

  render() {
    return (
      <span className='timer'>
        {this.show()}
        {this.hidden()}
      </span>
    );
  }

  hidden() {
    if (!this.state.spoiler) return;
    return (
      <span
        className='button-open'
        onClick={this.spoiler}
        title='show'
      />
    );
  }

  show() {
    if (this.state.spoiler) return;
    const t = this.props.time;

    return (
      <span className='timer__container'>
        <span
          className='button-cancel'
          title='cancel'
          onClick={this.cancel}
        />
        <span>{t[0] < 10 ? `0${t[0]}` : t[0]}:</span>
        <span>{t[1] < 10 ? `0${t[1]}` : t[1]}:</span>
        <span>{t[2] < 10 ? `0${t[2]}` : t[2]}</span>
        <span
          className='button-spoil'
          title='spoil'
          onClick={this.spoiler}
        />
      </span>
    );
  }

  spoiler() {
    this.setState({spoiler: !this.state.spoiler});
  }

  componentDidMount() {
    const self = this;
    this.timer = setInterval(self.handleTickTimer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  cancel() {
    clearInterval(this.timer);
    this.timer = null;
    this.delete();
  }

  delete() {
    window.dispatchEvent(new CustomEvent('deleteTimer', {
      detail: {id: this.props.id}
    }));
  }

  deleteTask() {
    if (!Math.max(...this.props.time) || Math.min(...this.props.time) < 0) this.props.delete();
  }

};