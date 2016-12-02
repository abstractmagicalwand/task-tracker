import React from 'react';
import ReactDOM from 'react-dom';

export default class Stopwatch extends React.Component {
  constructor(props) {
    super(props);

    this.commutator = this.commutator.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.show = this.show.bind(this);
  }

  componentWillMount() {
    this.stopwatch = null;
  }

  render() {
    return (
      <span className='stopwatch'>
        {this.show(this.props.shape, this.props.time)}
        <span
          className={'stopwatch-btn ' + (this.props.shape ? '' : 'pause')}
          title={this.props.shape ? 'play' : 'pause'}
          onClick={this.props.toggle.bind(this, this.props.id)}
        />
      </span>
    );
  }

/*  componentDidUpdate() {
    this.commutator(this.props.shape, this, this.props.id, this.props.tick);
  }*/

  componentDidMount() {
    this.commutator(this.props.shape, this, this.props.id, this.props.tick);
  }

  commutator(shape, context, id, tick) {

    if (shape) {
      context.play(context, id, tick);
    } else {
      context.stop(context);
    }

  }

  play(context, id, tick) {
    context.stopwatch = setInterval(tick.bind(context, id), 1000);
  }

  stop(context) {
    if (typeof context.stopwatch === 'object') clearInterval(context.stopwatch);
    context.stopwatch = null;
  }

  show(shape, time) {
    if (!shape) return;

    return (
      <span className='wrap'>
        <span>{time[0] < 10 ? `0${time[0]}` : time[0]}:</span>
        <span>{time[1] < 10 ? `0${time[1]}` : time[1]}:</span>
        <span>{time[2] < 10 ? `0${time[2]}` : time[2]}</span>
      </span>
    );
  }

}

Stopwatch.propTypes = {
  id: React.PropTypes.number.isRequired, //...
  tick: React.PropTypes.func.isRequired,
  toggle: React.PropTypes.func.isRequired,
  shape: React.PropTypes.bool.isRequired,
  time: React.PropTypes.array.isRequired
};

export {Stopwatch};