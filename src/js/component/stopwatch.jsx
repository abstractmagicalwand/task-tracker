import React    from 'react';
import ReactDOM from 'react-dom';

export default class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iterval: false
    };

    this.stop      = this.stop.bind(this);
    this.play      = this.play.bind(this);
    this.toggle    = this.toggle.bind(this);
    this.show      = this.show.bind(this);

    this.handleTickStopwatch = this.handleTickStopwatch.bind(this);
  }

  handleTickStopwatch() {
    let [h, m, s] = this.props.time;

    if (s < 59) {
      ++s;
    } else if (s === 59 && m < 59) {
      s = 0;
      ++m;
    } else if (m === 59) {
      m = 0;
      ++h;
    }

    window.dispatchEvent(new CustomEvent('tick', {
      detail: {
        type: 'stopwatch',
        time: [h, m, s],
        id: this.props.id
      }
    }));
  }

  componentWillMount() {
    if (!this.state.interval) this.play();
  }

  render() {
    return <span className='stopwatch'>
      {this.show()}
      <span
        className={'stopwatch-btn' + (this.state.interval ? '' : ' pause')}
        onClick={this.toggle}
      />
    </span>;
  }

  componentDidMount() {
    if (this.state.interval) this.stop();
  }

  componentWillUnmount() {
    this.stop();
  }

  show() {
    if (!this.state.interval) return;
    const s = this.props.time;
    return (
      <span className='wrap'>
        <span>{s[0] < 10 ? `0${s[0]}` : s[0]}:</span>
        <span>{s[1] < 10 ? `0${s[1]}` : s[1]}:</span>
        <span>{s[2] < 10 ? `0${s[2]}` : s[2]}</span>
      </span>
    )
  }

  toggle() { this.state.interval ? this.stop() : this.play(); }

  play() {
    const self = this;
    this.stopwatch = setInterval(self.handleTickStopwatch, 1000);
    this.setState({interval: !this.state.interval});
  }

  stop() {
    clearInterval(this.stopwatch);
    this.stopwatch = null;
    this.setState({interval: !this.state.interval});
  }
};