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
              <td className='board-extra__account_cell'>completed</td>
              <td className='board-extra__account_cell'>
                {`${this.props.data.completed}`}
              </td>
            </tr>
            <tr>
              <td className='board-extra__account_cell'>late</td>
              <td className='board-extra__account_cell'>
                {`${this.props.data.late}`}
              </td>
            </tr>
            <tr>
              <td className='board-extra__account_cell'>minutes</td>
              <td className='board-extra__account_cell'>
                {`${this.props.data.minutes}`}
              </td>
            </tr>
            <tr>
              <td className='board-extra__account_cell'>wallet</td>
              <td className='board-extra__account_cell'>
                {`${this.props.data.wallet}$`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

};