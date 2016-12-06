import React    from 'react';
import ReactDOM from 'react-dom';

export default class NavigationMenu extends React.Component {
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
      <div className='navigation-menu'>
        <div className={
          'navigation-menu__container navigation-menu__container_vertical'
        }>
          <div
            className='navigation-menu__button'
            name='inbox'
            onClick={this.handleClickBtn}>
            inbox
          </div>
          <div
            className='navigation-menu__button'
            name='project'
            onClick={this.handleClickBtn}>
            project
          </div>
          <div
            className='navigation-menu__button'
            name='archiv'
            onClick={this.handleClickBtn}>
            archiv
          </div>
          <div
            className='navigation-menu__button'
            name='account'
            onClick={this.handleClickBtn}>
            account
          </div>
          <div
            className='navigation-menu__button'
            name='spell'
            onClick={this.handleClickBtn}>
            spell
          </div>
        </div>
      </div>
    );
  }
};