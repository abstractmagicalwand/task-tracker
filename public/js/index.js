class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {db: db}

    this.handleNavBtnApp       = this.handleNavBtnApp.bind(this);
    this.handleAddNewTaskApp   = this.handleAddNewTaskApp.bind(this);
    this.handleSearchReqApp    = this.handleSearchReqApp.bind(this);
    this.handleDeleteFolderApp = this.handleDeleteFolderApp.bind(this);
    this.handleDeleteTaskApp   = this.handleDeleteTaskApp.bind(this);
    this.handleCompleteTaskApp = this.handleCompleteTaskApp.bind(this);
    this.handleSaveEditApp     = this.handleSaveEditApp.bind(this);
    this.handleOpenNoteApp     = this.handleOpenNoteApp.bind(this);
    this.handleSaveNoteApp     = this.handleSaveNoteApp.bind(this);
    this.handleBackContentApp  = this.handleBackContentApp.bind(this);
    this.handleTickApp         = this.handleTickApp.bind(this);
    this.handleCancelTimerApp  = this.handleCancelTimerApp.bind(this);
    /*this.handleSaveTimeApp     = this.handleSaveTimeApp.bind(this);*/

    this.searchTaskDb  = this.searchTaskDb.bind(this);
    this.setStateDb    = this.setStateDb.bind(this);
    this.getFolderOfDb = this.getFolderOfDb.bind(this);
  }

  handleDeleteFolderApp(e) {
    e.preventDefault();
    this.state.db.splice(this.getFolderOfDb(e.detail.project), 1);
    this.setStateDb();
  }

  handleNavBtnApp(e) {
    e.preventDefault();
    this.setState({viewContent: e.detail.category});
  }

  handleAddNewTaskApp(e) {
    e.preventDefault();
    const db = this.state.db.slice();

    const folder = this.getFolderOfDb(e.detail.project) || db.length;

    if (folder === db.length) {
      db.unshift({
        project: e.detail.project,
        tasks: [e.detail],
        note: ''
      });
    } else {
      db[folder].tasks.unshift(e.detail);
    }

    this.setState({db: db});
  }

  handleSearchReqApp(e) {
    e.preventDefault();
    this.setState({
      viewContent: 'search',
      value: e.detail.value
    });
  }

  handleDeleteTaskApp(e) {
    const task = this.searchTaskDb(e.detail.id);
    task.arr.splice(task.i, 1);
    this.setStateDb();
  }

  handleCompleteTaskApp(e) {
    const task = this.searchTaskDb(e.detail.id);
    task.arr[task.i].complete = true;
    task.arr[task.i].project  = 'ARCHIV';
    this.state.db[this.getFolderOfDb('ARCHIV')].tasks.push(task.arr.splice(task.i, 1)[0]);
    this.setStateDb();
  }

  handleSaveEditApp(e) {

    if (e.detail.project) {
      const folder = this.state.db[this.getFolderOfDb(e.detail.project)];
      folder.project = e.detail.value;

      folder.tasks.forEach(item => item.project = e.detail.value);
    } else if (e.detail.id) {
      const task = this.searchTaskDb(e.detail.id);
      task.arr[task.i].description = e.detail.value;
    }

    this.setStateDb();
  }

  handleOpenNoteApp(e) {
    this.setState({
      viewContent: 'note',
      value: e.detail.value,
      edit: e.detail.project || e.detail.id,
      viewLast: this.state.viewContent
    });

  }

  handleSaveNoteApp(e) {

    if (typeof this.state.edit === 'number') {
      const task = this.searchTaskDb(this.state.edit);
      task.arr[task.i].note = e.detail.value;
    } else if (typeof this.state.edit === 'string') {
      this.state.db[this.getFolderOfDb(this.state.edit)].note = e.detail.value;
    }

    this.setState({
      viewContent: this.state.viewLast,
      edit: null,
      db: this.state.db,
      value: null
    });
  }

  handleBackContentApp(e) {
    if (!this.state.viewLast) return;
    this.setState({
      viewContent: this.state.viewLast,
      viewLast: this.state.viewContent
    });
  }

  handleTickApp(e) {
    const task = this.searchTaskDb(e.detail.id);

    switch (e.detail.type) {
    case 'timer':
        task.arr[task.i].timeDeath = e.detail.time;
        break;
    case 'stopwatch':
        task.arr[task.i].stopwatch = e.detail.time;
        break;
    }

    task.arr[task.i].now = e.detail.now;
    console.log(task.arr[task.i].now);
    this.setStateDb();
  }

  handleCancelTimerApp(e) {
    const db = this.state.db.slice();
    db.forEach(item => {
      item.tasks.forEach((item, i, arr) => {
        if (e.detail.id === item.id) {
          item.timeDeath = null;
        }
      });
    });

    this.setState({db: db});
  }

/*  handleSaveTimeApp(e) {
    const task = this.searchTaskDb(e.detail.id, this.state.db.slice());

    if (e.detail.timer) {
      task.arr[task.i].timerStorage = e.detail.timer;
    } else if (e.detail.stopwatch) {
      task.arr[task.i].stopwatchStorage = e.detail.stopwatch;
    }
    console.dir(db);
    this.setStateDb(db);
  }*/

  componentWillMount() {
    window.removeEventListener('clickNavBtn' , this.handleNavBtnApp);
    window.removeEventListener('addNewTask'  , this.handleAddNewTaskApp);
    window.removeEventListener('searchValue' , this.handleSearchReqApp);
    window.removeEventListener('deleteFolder', this.handleDeleteFolderApp);
    window.removeEventListener('deleteTask'  , this.handleDeleteTaskApp);
    window.removeEventListener('complete'    , this.handleCompleteTaskApp);
    window.removeEventListener('save'        , this.handleSaveEditApp);
    window.removeEventListener('openNote'    , this.handleOpenNoteApp);
    window.removeEventListener('saveNote'    , this.handleSaveNoteApp);
    window.removeEventListener('back'        , this.handleBackContentApp);
    window.removeEventListener('tick'        , this.handleTickApp);
    window.removeEventListener('deleteTimer' , this.handleCancelTimerApp);
    /*window.removeEventListener('saveTime'    , this.handleSaveTimeApp);*/
  }

  render() {
    return (
      <div className='app'>
        <Bar />
        <Nav />
        <Field />
        <Content view={this.state.viewContent ? this.state.viewContent : 'inbox'} db={this.state.db} value={this.state.value ? this.state.value : ''}/>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('clickNavBtn' , this.handleNavBtnApp);
    window.addEventListener('addNewTask'  , this.handleAddNewTaskApp);
    window.addEventListener('searchValue' , this.handleSearchReqApp);
    window.addEventListener('deleteFolder', this.handleDeleteFolderApp);
    window.addEventListener('deleteTask'  , this.handleDeleteTaskApp);
    window.addEventListener('complete'    , this.handleCompleteTaskApp);
    window.addEventListener('save'        , this.handleSaveEditApp);
    window.addEventListener('openNote'    , this.handleOpenNoteApp);
    window.addEventListener('saveNote'    , this.handleSaveNoteApp)
    window.addEventListener('back'        , this.handleBackContentApp);
    window.addEventListener('tick'        , this.handleTickApp);
    window.addEventListener('deleteTimer' , this.handleCancelTimerApp);
    /*window.addEventListener('saveTime'    , this.handleSaveTimeApp);*/
  }

  searchTaskDb(id, DB) {
    const task = {};
    const db = DB || this.state.db

    db.forEach(item => {
      item.tasks.forEach((item, i, arr) => {
        if (id === item.id) {
          task.i = i;
          task.arr = arr;
        }
      });
    });

    return task;
  }

  setStateDb(DB) {
    const db = DB || this.state.db;
    this.setState({db: db});
  }

  getFolderOfDb(project) {
    let index = null;
    this.state.db.forEach((folder, i) => {
      if (folder.project === project) index = i;
    });

    return index;
  }

}

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.getCompView = this.getCompView.bind(this);
  }

  render() {
    return <div className='content'>{this.getCompView()}</div>;
  }

  getCompView() {
    switch (this.props.view) {
    case 'inbox':
        return <List type='inbox' db={this.props.db} />;
    case 'project':
        return <Collection db={this.props.db} />;
    case 'archiv':
        return <List type='archiv' db={this.props.db} />;
    case 'stats':
        return <Stats />;
    case 'search':
        return <List type='search' value={this.props.value} db={this.props.db} />
    case 'help':
        return <Help />;
    case 'note':
        return <Note value={this.props.value} />;
    default:
        if (!~this.props.view.indexOf('@')) break;
        return <List type='project' projectName={this.props.view} db={this.props.db} />;
    }
  }



}


class Bar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='bar'>
        <Search />
      </div>
    );
  }
}


class Nav extends React.Component {
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
        <div className='btn' name='inbox' onClick={this.handleClickBtn}>Inbox</div>
        <div className='btn' name='project' onClick={this.handleClickBtn}>Project</div>
        <div className='btn' name='archiv' onClick={this.handleClickBtn}>Archiv</div>
        <div className='btn' name='stats' onClick={this.handleClickBtn}>Stats</div>
        <div className='btn' name='help' onClick={this.handleClickBtn}>Help</div>
      </div>
    );
  }
}


class Field extends React.Component {
  constructor(props) {
    super(props);
    this.handleGetText = this.handleGetText.bind(this);

    this.getNewTask = this.getNewTask.bind(this);
  }

  handleGetText() {
    if (!ReactDOM.findDOMNode(this.refs.text).value.length) return;
    const event = new CustomEvent('addNewTask', {
      detail: this.getNewTask(ReactDOM.findDOMNode(this.refs.text).value)
    });
    ReactDOM.findDOMNode(this.refs.text).value = '';

    window.dispatchEvent(event);
  }

  render() {
    return (
      <div className='field'>
        <textarea className='area' ref='text'>
        </textarea>
        <input className='sand' type='button' onClick={this.handleGetText}/>
      </div>
    );
  }

  getNewTask(text) {
    const priority = /\*+/,
          project  = /@[\wа-яё]+/i,
          tags     = /#[\wа-яё]+/ig,
          death    = /\d\d\/\d\d\/\d\d/;

    const task = {
      stopwatch: [0, 0, 0],
      date: new Date(),
      stopwatchToggle: false,
      complete: false,
      tags: text.match(tags),
      id: Math.floor(Math.random() * Math.pow(100, 10)),
      priority: priority.test(text) ? priority.exec(text)[0].length : null,
      project: project.test(text) ? project.exec(text)[0] : 'SANS',
      timeDeath: death.test(text) ? death.exec(text)[0].split(/\//) : null,
      description: text
        .replace(priority, '')
        .replace(project,  '')
        .replace(tags,     '')
        .replace(death,    '')
        .trim()
    };

    return task;
  }
}


class List extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='list'>{this.getCompTasks(this.getTasks(this.props.type, this.props.db))}</div>
  }

  getTasks(type, db) {

    switch (type) {
    case 'inbox':
        return this.getInboxTasks(db);
    case 'archiv':
        return db.filter(item => {
          if (item.project === 'ARCHIV')  return item;
        })[0].tasks;
    case 'project':
        return db.filter(item => {
          if (item.project === this.props.projectName) return item;
        })[0].tasks;
    case 'search':
        return this.getInboxTasks(db).filter((item, d, array) => {
          if (~item.description.indexOf(this.props.value)) return item;
        });
    }

  }

  getInboxTasks(db) {
    return db.filter(item => {
      if (!(item.project === 'ARCHIV'))  return item;
    }).reduce((sum, item) => sum.concat(item.tasks), []);
  }

  getCompTasks(tasks) {
    return tasks.map(task => <Task info={task} />)
  }
}


class Collection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='collection'>{this.getCompFolders(this.props.db)}</div>;
  }

  getCompFolders(db) {
    return db.filter(folder => {
      if (folder.project !== 'ARCHIV' && folder.project !== 'SANS') return folder;
    }).map(folder => <Folder info={folder} />);
  }
}


class Help extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='help'></div>;
  }
}


class Stats extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='stats'></div>;
  }
}


class Note extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickBackNote = this.handleClickBackNote.bind(this);
    this.handleClickSaveNote = this.handleClickSaveNote.bind(this);
  }

  handleClickBackNote(e) {
    window.dispatchEvent(new CustomEvent('back'));
  }

  handleClickSaveNote(e) {
    window.dispatchEvent(new CustomEvent('saveNote', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.text).value
      }
    }));
  }

  render() {
    return (
      <div className='note'>
        <textarea className='note-field' defaultValue={`${this.props.value}`} ref='text'></textarea>
        <span className='back' onClick={this.handleClickBackNote}></span>
        <span className='note-save' onClick={this.handleClickSaveNote}></span>
      </div>
    );
  }
}


class Search extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchReq = this.handleSearchReq.bind(this);
  }

  handleSearchReq(e) {
    const event = new CustomEvent('searchValue', {
      detail: {value: e.target.value}
    })

    window.dispatchEvent(event);
  }

  render() {
    return <input className='search' type='text' onChange={this.handleSearchReq}/>;
  }
}


class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {edit: false};

    this.handleDeleteTask      = this.handleDeleteTask.bind(this);
    this.handleNoteTask        = this.handleNoteTask.bind(this);
    this.handleCompleteTask    = this.handleCompleteTask.bind(this);
    this.handleEditTask        = this.handleEditTask.bind(this);
    this.handleSaveEditTask    = this.handleSaveEditTask.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
  }

  handleDeleteTask() {
    window.dispatchEvent(new CustomEvent('deleteTask', {
      detail: {id: this.props.info.id}
    }));
  }

  handleCompleteTask(e) {
    window.dispatchEvent(new CustomEvent('complete', {
      detail: {id: this.props.info.id}
    }));
    e.target.checked = false;
  }

  handleEditTask() {
    this.setStateToggleEdit();
  }

  handleSaveEditTask(e) {
    this.setStateToggleEdit();

    window.dispatchEvent(new CustomEvent('save', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.value).value,
        id: this.props.info.id
      }
    }));
  }

  handleNoteTask(e) {
    if (!e.target.classList.contains('note-btn')) return;
    window.dispatchEvent(new CustomEvent('openNote', {
      detail: {
        id: this.props.info.id,
        value: this.props.info.note
      }
    }));
  }

  render() {
    /*const timeSw = comeBackTime(this.props.info.stopwatchStorage, this.props.info.stopwatch);*/

    return (
      <div className='task'>
        {this.state.edit ? <div className='edit'>
          <input className='edit-field' type='text' ref='value' defaultValue={`${this.props.info.description}`} />
          <span className='edit-save' onClick={this.handleSaveEditTask}></span>
          <span className='edit-close' onClick={this.handleEditTask}></span>
        </div> :
        <div>
          <p className='descript'>{this.props.info.description}</p>
          <span className='delete-btn' onClick={this.handleDeleteTask}></span>

          {this.props.info.project !== 'ARCHIV' ?
            <span>
              <span className='edit-btn' onClick={this.handleEditTask}></span>
              <span className='note-btn' onClick={this.handleNoteTask}></span>
              <input onClick={this.handleCompleteTask} className='complete' type='checkbox' />
              <Stopwatch old={this.props.info.now} id={this.props.info.id} time={this.props.info.stopwatch} />
              {this.props.info.timeDeath ?
                <Timer old={this.props.info.now} id={this.props.info.id} time={this.props.info.timeDeath} /> : null}
            </span> :
            null}
        </div>}
      </div>
    );
  }

  setStateToggleEdit() {
    this.setState({edit: !this.state.edit});
  }
}

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.interval  = false;
    this.stop      = this.stop.bind(this);
    this.play      = this.play.bind(this);
    this.toggle    = this.toggle.bind(this);
    this.stopwatch = null;

    this.handleTickStopwatch = this.handleTickStopwatch.bind(this);
    /*this.save = this.save.bind(this);*/
  }

  handleTickStopwatch() {
    let [h, m, s] = this.props.time;

    if (s < 59) {
      ++s;
    } else if (s === 59 && m < 59) {
      s = 0;
      ++m;
    } else if (m === 59) {
      m = 0;
      ++h;
    }

    window.dispatchEvent(new CustomEvent('tick', {
      detail: {
        type: 'stopwatch',
        time: [h, m, s],
        id: this.props.id,
        now: new Date().getTime()
      }
    }));
  }

  componentWillMount() {
    if (!this.interval) this.play();
  }

  render() {
    const s = this.props.time;
    return (
      <span>
        <span className={'stopwatch'}>
          <span>{s[0] < 10 ? `0${s[0]}` : s[0]}</span>:
          <span>{s[1] < 10 ? `0${s[1]}` : s[1]}</span>:
          <span>{s[2] < 10 ? `0${s[2]}` : s[2]}</span>
        </span>
        <span className='stopwatch-btn' onClick={this.toggle}></span>
      </span>
    );
  }

  componentDidMount() {
    if (this.interval) this.stop();
  }

  componentWillUnmount() {
    this.stop();
  }

/*  save() {
    window.dispatchEvent(new CustomEvent('saveTime', {
        detail: {
          stopwatch: new Date(),
          id: this.props.id
          }
      }
    ));
    comeBackTime();
  }*/

  toggle() { this.interval ? this.stop() : this.play(); }

  play() {
    const self = this;
    this.stopwatch = setInterval(self.handleTickStopwatch, 1000);
    this.interval = !this.interval;
  }

  stop() {
    clearInterval(this.stopwatch);
    this.stopwatch = null;
    this.interval = !this.interval;
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.handleTickTimer = this.handleTickTimer.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    const t = this.props.time;

    return (
      <span>
        <span className='timer'>
          <span>{t[0] < 10 ? `0${t[0]}` : t[0]}</span>:
          <span>{t[1] < 10 ? `0${t[1]}` : t[1]}</span>:
          <span>{t[2] < 10 ? `0${t[2]}` : t[2]}</span>
        </span>
        <span className='stopwatch-btn' onClick={this.cancel}></span>
      </span>
    );
  }

  componentDidMount() {
    const self = this;
    this.timer = setInterval(self.handleTickTimer, 1000);
  }

  componentWillUnmount() {
    this.cancel();
  }

  handleTickTimer() {
    let [h, m, s] = this.props.time;

    if (s > 0) {
      --s;
    } else if (s === 0) {
      s = 59;
      --m;
    } else if (m === 0) {
      m = 0;
      --h;
    }

    if (!Math.max(h, m, s)) {
      clearInterval(this.timer);
      this.timer = null;
      window.dispatchEvent(new CustomEvent('deleteTask', {
        detail: {id: this.props.id}
      }));
    } else {
      window.dispatchEvent(new CustomEvent('tick', {
        detail: {
          type: 'timer',
          time: [h, m, s],
          id: this.props.id,
          now: new Date().getTime()
        }
      }));
    }

  }

/*  save(time, id) {
    window.dispatchEvent(new CustomEvent('saveTime',
    {detail: {
      timer: time,
      id: id
      }
    }));
  }*/

  cancel() {
    clearInterval(this.timer);
    this.timer = null;
    window.dispatchEvent(new CustomEvent('deleteTimer', {
      detail: {id: this.props.id}
    }));
  }
}


class Folder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {edit: false};

    this.handleDeleteFolder   = this.handleDeleteFolder.bind(this);
    this.handleEditFolder     = this.handleEditFolder.bind(this);
    this.handleNoteFolder     = this.handleNoteFolder.bind(this);
    this.handleClickFolder    = this.handleClickFolder.bind(this);
    this.handleSaveEditFolder = this.handleSaveEditFolder.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
  }

  handleClickFolder(e) {
    if (e.target.tagName !== 'DIV') return;
    window.dispatchEvent(new CustomEvent('clickNavBtn', {
      detail: {category: this.props.info.project}
    }));
  }

  handleDeleteFolder(e) {

    if (!e.target.classList.contains('delete-btn')) return;

    window.dispatchEvent(new CustomEvent('deleteFolder', {
      detail: {project: this.props.info.project}
    }));
  }

  handleEditFolder(e) {
    if (!e.target.classList.contains('edit-btn')) return;
    this.setStateToggleEdit();
  }

  handleSaveEditFolder(e) {
    this.setStateToggleEdit();

    window.dispatchEvent(new CustomEvent('save', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.value).value,
        project: this.props.info.project
      }
    }));
  }

  handleNoteFolder(e) {
    if (!e.target.classList.contains('note-btn')) return;
    window.dispatchEvent(new CustomEvent('openNote', {
      detail: {
        value: this.props.info.note,
        project: this.props.info.project
      }
    }));
  }

  render() {
    return (
      <div className='folder' onClick={this.handleClickFolder}>
        {this.state.edit ?
        <div className='edit'>
          <input className='edit-field' type='text' ref='value' defaultValue={`${this.props.info.project}`} />
          <span className='edit-save' onClick={this.handleSaveEditFolder}></span>
          <span className='edit-close' onClick={this.handleEditFolder}></span>
        </div> :
        <div className='folder-'>
          <p>{`${this.props.info.project}`}</p>
          <span className='delete-btn' onClick={this.handleDeleteFolder}></span>
          <span className='edit-btn' onClick={this.handleEditFolder}></span>
          <span className='note-btn' onClick={this.handleNoteFolder}></span>
        </div>}
      </div>
    );
  }


  setStateToggleEdit() {
    this.setState({edit: !this.state.edit});
  }
}

function addArrs(arrOne, arrTwo) {
  for (let i = arrOne.length; --i >= 0;) arrOne[i] += arrTwo[i];
  return arrOne;
}

function getArrSMH(old) {
  const s = ms => Math.round(((new Date().getTime() - ms) / 1000) % 60);
  const m = ms => Math.round(((new Date().getTime() - ms) / (1000 * 60)) % 60);
  const h = ms => {
    return Math.round(((new Date().getTime() - ms) / (1000 * 60 * 60)) % 24);
  };

  return [h(old), m(old), s(old)];
}

function diffArrs(arrOne, arrTwo) {
  for (let i = arrOne.length; --i >= 0;) arrOne[i] -= arrTwo[i];
  return arrOne;
}


/*function load(db) {

  if (db) {
    Lockr.set('db', db);
  } else {
    const oldDB = Lockr.get('db');
    return oldDB;
  }

}

function wrapFlag() {
  let flag = true;

  return function(storageSw, defaultSw) {
    if (!storageSw && storageSw !== null) flag = !flag;
    let timeSw, timeTimer;

    if (storageSw) {
      timeSw = getArrSMH(storageSw);
      //timeTimer = getArrSMH(this.props.info.timerStorage);
    } else {
      timeSw = defaultSw;
      //timeTimer = this.props.info.timeDeath;
    }

    return timeSw;
  };
};

const comeBackTime = wrapFlag();*/

ReactDOM.render(<App />, document.getElementById('root'));