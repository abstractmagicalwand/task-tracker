import React    from 'react';
import ReactDOM from 'react-dom';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='account'>
        {Object.keys(this.props.data).map((item, i) => {
            return (
              <p className='account__item' key={i}>
                <span className='account__prop'>
                  {`${item}`}
                </span>
                <span className='account__value'>
                  {`${this.props.data[item]}`}
                </span>
              </p>
            );
        })}
      </div>
    );
  };

};