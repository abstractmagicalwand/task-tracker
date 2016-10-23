const emitter = new EventEmitter();
const COUNT_TASK_MAIN_APP = 5;

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
        <MainApp quantity={COUNT_TASK_MAIN_APP} />
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
  getInitialState: function() { return {tasks: taskDB}; },

  componentDidMount: function() {
    const self = this;
    emitter.addListener('Add', function(item) {
      const newTask = item.concat(self.state.tasks);
      self.setState({tasks: newTask});
    });
  },

  componentWillUnmount: function() {
    emitter.removeListener('Add');
  },

  propTypes: {
    data: React.PropTypes.shape({
      description: React.PropTypes.string.isRequired
    })
  },

  render: function() {
    const quantity = this.props.quantity;
    const tasks = this.state.tasks.map(function(item, index) {
      console.log(index);
      if (index <= quantity) {
        return (
          <TrackTask key={index} data={item['description']} />
        );
      }

    });

    return (
      <div className="main-app">{tasks}</div>
    );
  }
});

const AreaInputTaskApp = React.createClass({
  onBtnClickHandler: function(e) {
    if (!this.refs.textTask.value.length) return;
    const item = [{description: this.refs.textTask.value}];

    emitter.emit('Add', item);
    this.refs.textTask.value = "";
  },

  render: function() {
    return (
      <div className="area-input-task-app">
        <textarea 
          defaultValue=""
          ref="textTask"
          placeholder="#tags *priority @project :::deathtimer [create date]" 
          className="text-area-input-task-app">
        </textarea>
        <button onClick={this.onBtnClickHandler} className="btn-area-input-task-app"></button>
      </div>
    );
  }
});

const TrackTask = React.createClass({
  deleteTask: function() {
    emitter.emit('Del', this.props.id);
  },
  render: function() {
    return (
      <div className="track-task">
        {this.props.data}
        <span onClick={this.deleteTask} className="track-task-delete"></span>
      </div>
    );
  } 
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
