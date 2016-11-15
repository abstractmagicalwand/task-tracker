import React    from 'react';
import ReactDOM from 'react-dom';

let keyId = 0;

export default class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iterval: false
    };

    this.stop      = this.stop.bind(this);
    this.play      = this.play.bind(this);
    this.toggle    = this.toggle.bind(this);
    this.stopwatch = null;
    this.old       = null;
    this.compile   = this.compile.bind(this);

    this.handleTickStopwatch = this.handleTickStopwatch.bind(this);
  }

  handleTickStopwatch() {
    let [h, m, s] = this.old || this.props.time;

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
        id: this.props.id,
        now: new Date().getTime()
      }
    }));
  }

  componentWillMount() {
    if (!this.state.interval) this.play();
  }

  render() {
    return <span key={++keyId} className='stopwatch'>{this.compile()}</span>;
  }

  componentDidMount() {
    if (this.state.interval) this.stop();
  }

  componentWillUnmount() {
    this.stop();
  }

  compile() {
    const result = [],
          s = this.props.time;

    if (this.state.interval) {
      result.push(
        <span key={++keyId}>{s[0] < 10 ? `0${s[0]}` : s[0]}:</span>,
        <span key={++keyId}>{s[1] < 10 ? `0${s[1]}` : s[1]}:</span>,
        <span key={++keyId}>{s[2] < 10 ? `0${s[2]}` : s[2]}</span>
      );
    }
    result.push(
      <span
        key={++keyId}
        className={'stopwatch-btn' + (this.state.interval ? '' : ' pause')}
        onClick={this.toggle}
      />
    );

    return result;
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