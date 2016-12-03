import React    from 'react';
import ReactDOM from 'react-dom';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickBtn = this.handleClickBtn.bind(this);
  }

  handleClickBtn(e) {
    const event = new CustomEvent('clickNavBtn', {
      detail: {category: e.target.getAttribute('name')}
    });
    window.dispatchEvent(event);
  }

  render() {
    return (
      <div className='nav'>
        <div
          className='btn'
          name='inbox'
          onClick={this.handleClickBtn}>
          inbox
        </div>
        <div
          className='btn'
          name='project'
          onClick={this.handleClickBtn}>
          project
        </div>
        <div
          className='btn'
          name='archiv'
          onClick={this.handleClickBtn}>
          archiv
        </div>
        <div
          className='btn'
          name='account'
          onClick={this.handleClickBtn}>
          account
        </div>
        <div
          className='btn'
          name='spell'
          onClick={this.handleClickBtn}>
          spell
        </div>
      </div>
    );
  }
};