class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'project',
      tasks: db
    };

    this.setView     = this.setView.bind(this);
    this.setViewNote = this.setViewNote.bind(this);
    this.lib         = lib;
    this.getMain     = this.getMain.bind(this);
  }

  handlerChildReRender() {
    console.log('sup');
    this.setState({location: this.state.location});
  }

  componentWillMount() {
    emitter.removeListener('Transfer');
    emitter.removeListener('Note');
  }

  render() {
    return (
      <div className='app'>
        <Bar />
        <NavigationMenu />
        <PlaceAddTask />
        {this.takeView(this.state.location)}
      </div>
    );
  }

  componentDidMount() {
    emitter.addListener('Transfer', this.setView);
    emitter.addListener('Note', this.setViewNote);
  }

  setView(value) { this.setState({location: value}); }

  setViewNote(back, data) {

    if (~back.indexOf('@')) {
      this.setState({noteBack: back});
      this.setView('note');
    } else if (~back.indexOf('save')) {
      this.lib.getPropTask(
        this.state.tasks,
        'project',
        'value',
        true,
        this.state.noteBack).filter(item => {
          if (item) return item;
        })[0].note = data;
      this.setView('project');
    } else if (~back.indexOf('close')) {
      this.setView('project');
    }

  }

  getMain() {
    return this.lib.getAllTask(this.state.tasks);
  }

  handlerChildFunc(newTasks) {
    this.setState({tasks: newTasks});
    console.log('y');
  }

  takeView(path) {
    switch (path) {
    case 'main':
      return (<TaskList
        re  ={this.handlerChildReRender.bind(this)}
        proto   ={this.state.tasks}
        tasks   ={this.getMain()}
        field   ={'description'}
        type    ={'field'}
        task    ={true}
        value   ={null}
        quantity={config.PAGE_TASK} />
      );
    case 'project':
        return <FolderList tasks={this.state.tasks} />;
    case 'tag':
        return <TagsCloud tasks={this.state.tasks} />;
    case 'setting':
        return <Setting />;
    case 'help':
        return <Help />;
    case 'stats':
        return <Stats />;
    case 'archiv':
        return <Archiv tasks={this.state.tasks} />;
    case 'note':
        return <Note tasks={this.state.tasks} back={this.state.noteBack} />;
    default:
        break;
    }
  }
};


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


class FolderList extends React.Component {
  constructor(props) {
    super(props);
    this.getTaskInFolder = this.getTasksInFolder.bind(this);
    this.lib = lib;
  }

  render() {
    const folders = this.showFolder();
    return <div className='folder-view-mode'>{folders}</div>;
  }

  getTasksInFolder(project) {
    return this.props.tasks.filter(function(item) {
      if (item.project == project) return item;
    })[0].tasks;
  }

  showFolder(project) {
    return this.lib.getPropTask(this.props.tasks, 'project', 'field', false, null).map((item) => {
        if (!~item.indexOf('@')) return;
        return <Folder tasks={this.getTasksInFolder(item)} name={`${item}`} />;
    });
  }
};


class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    },
    this.handlerClickFolder   = this.handlerClickFolder.bind(this);
    this.handlerClickDelete   = this.handlerClickDelete.bind(this);
    this.handlerClickEdit     = this.handlerClickEdit.bind(this);
    this.handlerClickOpenNote = this.handlerClickOpenNote.bind(this);
  }

  handlerClickFolder(e, name) {
    if (e.target.tagName != 'DIV') return;
    if (this.state.selected) emitter.emit('Open', name);
    this.setState({selected: !this.state.selected});
  }

  handlerClickDelete(e) {
    e.preventDefault();
  }

  handlerClickEdit(e) {
    e.preventDefault();
  }

  handlerClickOpenNote(e) {
    e.preventDefault();
    emitter.emit('Note', this.props.name);
  }

  render() {
    return (
      <div
        className={`folder ${this.state.selected ? 'folder-selected' : ''}`}
        onClick={this.handlerClickFolder}>
        {this.state.selected ? (
          <div className='support'>
            <span
              onClick={this.handlerClickDelete}
              className='deleted'>
            </span>
            <span
              onClick={this.handlerClickEdit}
              className='edit'>
            </span>
            <span
              onClick={this.handlerClickOpenNote}
              className='add-note'>
            </span>
          </div>) :
          null
        }
        {this.props.name}
      </div>
    )
  }
};


class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      proto: this.props.proto
    };
    this.getListTask = this.getListTask.bind(this);
    this.lib = lib;
    this.setTask = this.setTask.bind(this, this.state.proto)
  }

  componentWillUnmount() {
    emitter.removeListener('Del');
    emitter.removeListener('Done');
    emitter.removeListener('Add');
  }

  render() {
    {/*this.lib.getPropTask(
      this.props.list,
      this.props.field,
      this.props.type,
      this.props.task,
      this.props.value),
      this.props.quantity*/}
    return (
      <div
        className='view list'>
        {this.getListTask(this.state.tasks, this.props.quantity)}
      </div>
    );
  }

  componentDidMount() {

    emitter.addListener('Del', (id) => {
      const list = this.state.tasks;
      const task = this.lib.getTask(list, id);
      list.splice(task.index, 1);
      list.timer = null;
      this.setState({tasks: list});
    });

    emitter.addListener('Done', (id) => {
      const list = this.state.tasks;
      const task = this.lib.getTask(list, id);
      list[task.index].completed = true;
      this.setState({tasks: list});
    });

    emitter.addListener('Add', this.setTask);
  }

  setTask(list, newItem) {
    let flag = false,
        sans;

    list.forEach(item => {
      if (newItem.project === item.project) {
        item.tasks.unshift(newItem);
        flag = true;
      } else if (item.project == 'SANS') {
        sans = item;
      }
    });

    if (flag) {
      this.setState({proto: list});
      return;
    }

    sans.tasks.unshift(newItem);
    this.setState({proto: list});
    this.props.re();
  }

  getListTask(list, quantity) {
    return list.map((item, index) => {

      if (quantity && !item.completed) {
        quantity--;
        return (
          <Task
            key={index}
            data={item.description}
            timer={item.timer}
            stopwatch={item.stopwatch}
            id={item.id}
          />
        );
      }

    });
  }
};


class PlaceAddTask extends React.Component {
  constructor(props) {
    super(props);
    this.handlerClickBtn = this.handlerClickBtn.bind(this);
  }

  handlerClickBtn(e) {
    if (!this.refs.textTask.value.length) return;
    const item = this.createTask();
    emitter.emit('Add', item);
    this.refs.textTask.value = '';
  }

  render() {
    return (
      <div className='add-task'>
        <textarea
          className='add-task-area'
          placeholder='#tags @project *priority %time death $time start'
          defaultValue=''
          ref='textTask'>
        </textarea>
        <div
          className='add-task-btn'
          onClick={this.handlerClickBtn}>
        </div>
      </div>
    );
  }

  parser(str) {
    const result    = {};
    result.str      = str;
    result.tags     = result.str.match(/#\w*/g);
    result.str      = result.str.replace(/#\w*/g, '');
    result.priority = result.str.match(/\*{2,}/g);
    result.str      = result.str.replace(/\*{2,}/g, '');
    result.project  = result.str.match(/@\w*/g);
    result.str      = result.str.replace(/@\w*/g, '');
    result.str      = result.str.trim();
    result.time     = null;
    return result;
  }

  createTask() {
    const newTask = this.parser(this.refs.textTask.value);

    return {
      description: newTask.str,
      id: Math.floor(Math.random() * Math.pow(10, 6)),
      completed: false,
      tags: newTask.tags,
      project: newTask.project,
      priority: newTask.priority,
      timeDeath: 0,
      note: '',
      date: new Date(),
      timer: newTask.timer,
      stopwatch: [0, 0, 0]
    }

  }
};


class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {completed: false};
    this.handlerDelBtn = this.handlerDelBtn.bind(this);
    this.handlerCheckComplete = this.handlerCheckComplete.bind(this);
  }

  handlerDelBtn() { emitter.emit('Del', this.props.id); }

  handlerCheckComplete() {
    this.setState({completed: !this.state.completed});
    emitter.emit('Done', this.props.id);
  }

  render() {
    return (
      <div
        className='task'>
        <p className='task-data'>{this.props.data}</p>
        <span
          className='task-delete'
          onClick={this.handlerDelBtn}>
        </span>
        <label
          className='task-label-checkbox'
          for='checkboxFourInput'>
            <input
              type='checkbox'
              className='task-input-checkbox'
              id='checkboxFourInput'
              onChange={this.handlerCheckComplete}
            />
        </label>
        {this.props.stopwatch ?
          (<Stopwatch stopwatch={this.props.stopwatch} />) :
          null
        }
        {this.props.timer ?
          (<Timer
            index={this.props.index}
            timer={this.props.timer}
            id={this.props.id} />) :
            null
        }
      </div>
    );
  }
};


class Stopwatch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      watch: this.props.stopwatch,
      stop: true
    };

    this.lib = lib;
    this.handlerClickBtn = this.handlerClickBtn.bind(this);
    this.handlerInterval = this.handlerInterval.bind(this);
  }

  handlerClickBtn(e) {
    e.preventDefault();
    this.setState({stop: !this.state.stop});
  }

  plus(h, m, s) {

    if (s != 59) {
      s += 1;
    } else if (s == 59) {
      m += 1;
      s = 0;
    } else if (m == 59) {
      h += 1;
      m = 0;
    }

    return [h, m, s];
  }

  handlerInterval() {
    this.setState({watch: this.lib.tick(this.state.watch, this.plus)});
  }

  render() {
    return (
      <p className='stopwatch'>
        [<span>{this.state.watch[0]}</span>:
         <span>{this.state.watch[1]}</span>:
         <span>{this.state.watch[2]}</span>]
      <input
        type='button'
        className='stopwatch-toggle'
        onClick={this.handlerClickBtn}/>
      </p>
    );
  }

  componentDidUpdate() {
    if (this.state.stop) {
      clearInterval(this.plank);
      this.plank = null;
    } else if (!this.plank) {
      this.plank = setInterval(this.handlerInterval, 1000);
    }
  }

};


class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.lib = lib;
    this.stats = {
      timer: taskDB[this.lib.getTask(taskDB, this.props.id).index].timer
    };
  }

  componentWillMount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <p className='timer'>[
        <span>{this.state.timer[0]}</span>:
        <span>{this.state.timer[1]}</span>:
        <span>{this.state.timer[2]}</span>
      ]</p>
    );
  }

  componentDidMount() {
    const self = this;

    if (this.timer && !this.state.timer && self.maxValArr(self.state.timer)) return;

    this.timer = setInterval(function() {
      self.setState({timer: self.tick(self.state.timer)});

      if (self.maxValArr(self.state.timer)) return;
      clearInterval(self.timer);
      self.timer = null;
      emitter.emit('Del', self.props.id);
    }, 1000);
  }

  minus(h, m, s) {

    if (s > 0) {
      s -= 1;
    } else if (s == 0) {
      m -= 1;
      s = 59;
    } else if (m == 0) {
      h -= 1;
      m = 59;
    }

    return [h, m, s];
  }

  maxValArr(arr) {
    return Math.max.apply(null, arr);
  }
};

class TagsCloud extends React.Component {
  constructor(props) {
    super(props);

    this.lib = lib;
  }

  render() {
    return (
    <div className='view cloud-tags'>
        {this.lib.getPropTask(this.props.tasks, 'tags', 'field', false, null)
          .join('')
          .split(',')
          .join(' ')}
    </div>);
  }
};

class Setting extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='view'>
      <p>music</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
    </div>
  }
};

class Help extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='view'>
        <h2>DOCS</h2>
        <h2>Motivation</h2>
      </div>
    );
  }
};

class Stats extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='view'>
        <p>привет</p>
        <p>привет</p>
        <p>привет</p>
      </div>
    );
  }
};

class Archiv extends React.Component {
  constructor(props) {
    super(props);
    this.lib = lib;
    this.getArchiv = this.getArchiv.bind(this);
  }

  getArchiv() {
    return this.lib.getPropTask(this.proto.tasks, 'project', 'value', true, 'ARCHIV')[0].tasks;
  }

  render() {
    return (
      <TaskList
        proto   ={this.props.tasks}
        tasks   ={this.getArchiv()}
        field   ={'description'}
        type    ={'field'}
        task    ={true}
        value   ={null}
        quantity={config.PAGE_TASK}
      />
    );
  }
};

// props !!! back
class Note extends React.Component {
  constructor(props) {
    super(props);

    this.handlerClickClose = this.handlerClickClose.bind(this);
    this.handlerClickSave  = this.handlerClickSave.bind(this);
    this.lib = lib;
    this.getValueNote = this.getValueNote.bind(this);
  }

  handlerClickClose(e) {
    emitter.emit('Note', 'close');
  }

  handlerClickSave(e) {
    if(!this.refs.textTask.value.length) return;
    emitter.emit('Note', 'save', this.refs.textTask.value);
  }

  render() {
    return (
      <div className='view'>
        <textarea
          className='note'
          defaultValue={this.getValueNote()}
          ref='textTask'>
        </textarea>
        <div className='note-pane'>
          <span onClick={this.handlerClickClose} className='note-save'></span>
          <span onClick={this.handlerClickSave} className='note-close'></span>
        </div>
      </div>
    )
  }

  getValueNote() {
    return this.lib.getPropTask(this.props.tasks, 'project', 'value', true,
      this.props.back).filter(item => {
        if (item) return item;
      })[0].note || '';
  }
}

class Bar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='bar'></div>;
  }
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);