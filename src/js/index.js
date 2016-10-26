const emitter = new EventEmitter();
const COUNT_TASK_MAIN_APP = 3;

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
        <Bar />
        <NavigationMenu />
        <List quantity={COUNT_TASK_MAIN_APP} />
        <AddTask />
      </div>
    );
  }
});

const Bar = React.createClass({
  render: function() {
    return (
      <div className="bar"></div>
    )
  }
});

const NavigationMenu = React.createClass({
  render: function() {
    return (
      <div className="navigation-menu"></div>
    )
  }
});

const List = React.createClass({
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
          <Task key={index} data={item.description} id={item.id} />
        );
      }

    });

    return (
      <div className="list">{tasks}</div>
    );
  }
});

const AddTask = React.createClass({
  onBtnClickHandler: function(e) {
    if (!this.refs.textTask.value.length) return;
    const item = this.createTask();
    emitter.emit('Add', item);
    this.refs.textTask.value = "";
  },

  parser: function(str) {
    const result    = {};
    result.str      = str;
    result.tags     = result.str.match(/#\w*/g);
    result.str      = result.str.replace(/#\w*/g, '');
    result.priority = result.str.match(/\*{2,}/g);
    result.str      = result.str.replace(/\*{2,}/g, '');
    result.project  = result.str.match(/@\w*/g);
    result.str      = result.str.replace(/@\w*/g, '');
    result.str      = result.str.trim();

    return result;
  },

  createTask: function() {
    const newText = this.parser(this.refs.textTask.value);
    console.log(newText)
    const task = [{
      description: newText.str,
      id: Math.floor(Math.random() * Math.pow(10, 6)),
      complited: false,
      tags: newText.tags,
      project: newText.project,
      priority: newText.priority,
      timeDeath: 0,
      notes: [],
      timeBank: 0,
      date: new Date()
    }];

    return task;
  },

  render: function() {
    return (
      <div className="add-task">
        <textarea 
          placeholder="#tags @project *priority %time death $time start" 
          className="add-task-area" 
          defaultValue="" 
          ref="textTask">
        </textarea>
        <div className="add-task-btn" onClick={this.onBtnClickHandler}>
        </div>
      </div>
    );
  }
});

const Task = React.createClass({
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

  edit: function() {
    this.props.data
  },

  render: function() {
    return (
      <div className="task" onDblclick={this.edit}>
        <p className="task-data">{this.props.data}</p>
        <span onClick={this.deleteTask} className="task-delete"></span>
        <label
          className="task-label-checkbox"
          for="checkboxFourInput">
            <input
              type="checkbox"
              className="task-input-checkbox"
              id="checkboxFourInput"
              onChange={this.onCheckedComplited}
            />
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
      ss: '00',
      stop: true
    };
  },

  stopwatch: null,

  stopwatchTime: null,

  clickBtn: function(e) {
    e.preventDefault();
    this.setState({stop: !this.state.stop});
  },

  getTime: function(timer) {
    let hh = +this.state.hh,
        mm = +this.state.mm,
        ss = +this.state.ss;

    if (ss != 59) {
      timer ? ss -= 1 : ss += 1;
    } else if (ss == 59) {
      timer ? mm -= 1 : mm += 1;
      ss = 0;
    } else if (mm == 59) {
      timer ? hh -= 1 : hh += 1;
      mm = 0;
    }

    return {
      hh: (hh < 10 ? 0 + '' + hh : hh),
      mm: (mm < 10 ? 0 + '' + mm : mm),
      ss: (ss < 10 ? 0 + '' + ss : ss)
    };
  },

  render: function() {

    if (!this.stopwatch && !this.state.stop) {
      const self = this;
      this.stopwatch = setInterval(function() {
        self.setState(self.getTime());
      }, 1000);
    } else if (this.stopwatch && this.state.stop) {
      clearInterval(this.stopwatch);
      this.stopwatch = null;
      this.stopwatchTime = null;
    }

    return (
      <p className="stopwatch">
        [
        <span>{this.state.hh}</span>:
        <span>{this.state.mm}</span>:
        <span>{this.state.ss}</span>
        ]
        <input type="button" className="stopwatch-toggle" onClick={this.clickBtn}/>
      </p>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

