import React    from 'react';
import ReactDOM from 'react-dom';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='board-extra'>
        <table className='board-extra__table'>
          <caption className='board-extra__title'>account</caption>
          <tbody className='board-extra__content'>
            <tr>
              <td>completed</td>
              <td>{`${this.props.data.completed}`}</td>
            </tr>
            <tr>
              <td>late</td>
              <td>{`${this.props.data.late}`}</td>
            </tr>
            <tr>
              <td>minutes</td>
              <td>{`${this.props.data.minutes}`}</td>
            </tr>
            <tr>
              <td>wallet</td>
              <td>{`${this.props.data.wallet}$`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

};