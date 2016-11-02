class NavigationMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handlerClickBtn = this.handlerClickBtn.bind(this);
  }

  handlerClickBtn(loc) {
    emitter.emit('Transfer', loc);
  }

  render() {
    return (
      <div className='navigation-menu'>
        <div
          className='navigation-menu-btn main'
          onClick={this.handlerClickBtn.bind(this, 'main')}>
          main
        </div>
        <div
          className='navigation-menu-btn project'
          onClick={this.handlerClickBtn.bind(this, 'project')}>
          project
        </div>
        <div
          className='navigation-menu-btn tag'
          onClick={this.handlerClickBtn.bind(this, 'tag')}>
          tag
        </div>
        <div
          className='navigation-menu-btn stats'
          onClick={this.handlerClickBtn.bind(this, 'stats')}>
          stats
        </div>
        <div
          className='navigation-menu-btn archiv'
          onClick={this.handlerClickBtn.bind(this, 'archiv')}>
          archiv
        </div>
        <div
          className='navigation-menu-btn setting'
          onClick={this.handlerClickBtn.bind(this, 'setting')}>
          setting
        </div>
      </div>
    )
  }
};