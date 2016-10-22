const taskDB = [{
  'description': 'Купить молока.',
}, {
  'description': 'Выпить колы.',
}, {
  'description': 'Познакомиться с девочкой.'
}];

const App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <HatApp />
        <NavSideBarApp />
        <MainApp data="{taskDB}" />
        <AreaInputTaskApp />
      </div>
    );
  }
});

const HatApp = React.createClass({
  render: function() {
    return (
      <div className="hat-app"></div>
    )
  }
});

const NavSideBarApp = React.createClass({
  render: function() {
    return (
      <div className="nav-sidebar-app"></div>
    )
  }
});

const MainApp = React.createClass({
  render: function() {
    const tasks = this.props.data.map(function(item, index) {
      return (
        <TrackTask key={index} data={item} />
      )
    })

    return (
      <div className="main-app"></div>
    );
  }
});

const AreaInputTaskApp = React.createClass({
  render: function() {
    return (
      <div className="area-input-task-app">
        <textarea placeholder="#tags *priority @project :::deathtimer [create date]" className="text-area-input-task-app"></textarea>
        <button className="btn-area-input-task-app"></button>
      </div>
    );
  }
});

const TrackTask = React.createClass({
  render: function() {
    return (
      <div class="track-task"></div>
    )
  }
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
