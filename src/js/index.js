const taskDB = [{
  description: 'Купить молока.',
}, {
  description: 'Выпить колы.',
}, {
  description: 'Познакомиться с девочкой.'
}];

const App = React.createClass({

  render: function() {
    return (
      <div className="app">
        <HatApp />
        <NavSideBarApp />
        <MainApp />
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
  getInitialState: function() {
    return (
      {tasks: taskDB}
    );
  },

  propTypes: {
    data: React.PropTypes.shape({
      description: React.PropTypes.string.isRequired
    })
  },

  render: function() {
    const tasks = this.state.tasks.map(function(item, index) {
      return (
        <TrackTask key={index} data={item['description']} />
      )
    });

    return (
      <div className="main-app">{tasks}</div>
    );
  }
});

const AreaInputTaskApp = React.createClass({
  onBtnClickHandler: function() {

  },
  render: function() {
    return (
      <div className="area-input-task-app">
        <textarea 
          placeholder="#tags *priority @project :::deathtimer [create date]" 
          className="text-area-input-task-app">
        </textarea>
        <button className="btn-area-input-task-app"></button>
      </div>
    );
  }
});

const TrackTask = React.createClass({
  render: function() {
    return (
      <div className="track-task">{this.props.data}</div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
