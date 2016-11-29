import React    from 'react';
import ReactDOM from 'react-dom';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='account'>
        {
          Object.keys(this.props.data).map((item, i) => {
            return (<p className='account-data' key={i}>{`${item} ${this.props.data[item]}`}</p>);
          })
        }
      </div>);
  }


};