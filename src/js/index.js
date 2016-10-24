const emitter = new EventEmitter();
const COUNT_TASK_MAIN_APP = 4;

const taskDB = [{
  description: 'Купить молока.',
  id: 1,
  complited: false,
  tags: [],
  project: [],
  priority: 0,
  timeDeath: 0,
  notes: [],
  timeBank: 0
}, {
  description: 'Выпить колы.',
  id: 2,
  complited: false,
  tags: [],
  project: [],
  priority: 0,
  timeDeath: 0,
  notes: [],
  timeBank: 0
}, {
  description: 'Познакомиться с девочкой.',
  id: 3,
  complited: false,
  tags: [],
  project: [],
  priority: 0,
  timeDeath: 0,
  notes: [],
  timeBank: 0
}, ];

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

    emitter.addListener('Del', function(id) {
      const task = self.getTask(self.state.tasks, id);
      task.list.splice(task.id, 1);
      self.setState({tasks: task.list});
    });

    emitter.addListener('Done', function(id) {
      const task = self.getTask(self.state.tasks, id);
      task.list[task.id].complited = true;
      self.setState({tasks: task.list});
    });
  },

  componentWillUnmount: function() {
    emitter.removeListener('Add');
    emitter.removeListener('Del');
    emitter.removeListener('Done');
  },

  getTask: function(list, id) {

    function searchTask(list, id) {
      let result;
      list.forEach(function(item, index) {
        if (item.id == id) result = index;
      });
      return result;
    }

    const task = {};

    task.list = list;
    task.id = searchTask(task.list, id);
    
    return task;
  },

  propTypes: {
    data: React.PropTypes.shape({
      description: React.PropTypes.string.isRequired
    })
  },

  render: function() {
    let quantity = this.props.quantity;
    const tasks = this.state.tasks.map(function(item, index) {

      if (quantity && !item.complited) {
        quantity = quantity - 1;
        return (
          <TrackTask key={index} data={item.description} id={item.id} />
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
    const item = this.createTask();
    emitter.emit('Add', item);
    this.refs.textTask.value = "";
  },

  createTask: function(text) {
    const task = [{
      description: this.refs.textTask.value,
      id: Math.floor(Math.random() * Math.pow(10, 6)),
      complited: false,
      tags: [],
      project: [],
      priority: 0,
      timeDeath: 0,
      notes: [],
      timeBank: 0,
      date: new Date()
    }];

    return task;
  },

  render: function() {
    const sym = '\u2386';
    return (
      <div className="area-input-task-app">
        <textarea 
          defaultValue=""
          ref="textTask"
          placeholder="#tags *priority @project :::deathtimer [create date]" 
          className="text-area-input-task-app">
        </textarea>
        <div 
          onClick={this.onBtnClickHandler} 
          className="btn-area-input-task-app">
          {sym}
        </div>
      </div>
    );
  }
});

const TrackTask = React.createClass({
  getInitialState: function() {
    return {
      complited: false
    }
  },

  deleteTask: function() {
    emitter.emit('Del', this.props.id);
  },

  onCheckedComplited: function() {
    this.setState({complited: !this.state.complited});
    emitter.emit('Done', this.props.id);
  },

  render: function() {
    return (
      <div className="track-task">
        <p className="track-task-data">{this.props.data}</p>
        <span onClick={this.deleteTask} className="track-task-delete"></span>
        <label 
          className="track-task-checkbox" 
          for="checkboxFourInput">
          <span className="track-task-checkbox-in">
            <input 
              type="checkbox" 
              className="track-task-checkbox-input"
              id="checkboxFourInput"
              onChange={this.onCheckedComplited}
            />
          </span>
        </label>
        <TimerAndStopWatch />
      </div>
    );
  } 
});

const TimerAndStopWatch = React.createClass({
  getInitialState: function() {
    return {
      hh: '00',
      mm: '00',
      ss: '00'
    };
  },

  stopwatch: null,

  stopwatchTime: null,

  getTime: function() {
    const now = new Date;
    const nowSs = now.getSeconds();

    now.setTime(0);
    now.setHours(0);

    this.stopwatchTime ? now.setSeconds(nowSs - this.stopwatchTime) :
      this.stopwatchTime = nowSs; 

    const ss = now.getSeconds();
    const mm = now.getMinutes();
    const hh = now.getHours();

    return {
      ss: (ss < 10 ? 0 + '' + ss : ss),
      mm: (mm < 10 ? 0 + '' + mm : mm),
      hh: (hh < 10 ? 0 + '' + hh : hh)
    }
  },

  render: function() {

    if (!this.stopwatch) {
      const self = this;
      this.stopwatch = setInterval(function() {
        const nowTime = self.getTime();
        self.setState({
          ss: nowTime.ss,
          mm: nowTime.mm,
          hh: nowTime.hh
        })
      }, 1000);
    }

    return (
      <p className="stopwatch">
        [<span className="stopwatch-hh">{this.state.hh}</span>:
        <span className="stopwatch-mm">{this.state.mm}</span>:
        <span className="stopwatch-ss">{this.state.ss}</span>]
        <input type="button" className="stopwatch-of-on"/>
      </p>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
