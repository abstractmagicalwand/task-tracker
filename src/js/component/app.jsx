import React    from 'react';
import ReactDOM from 'react-dom';
import {db}     from '../db/index.js';
import Content  from '../component/content.jsx';
import Nav      from '../component/nav.jsx';
import Help     from '../component/help.jsx';

export default class App extends React.Component {
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
    console.log(task.arr[task.i]);
    this.state.db[this.getFolderOfDb('ARCHIV')].tasks.unshift(task.arr.splice(task.i, 1)[0]);
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
      viewLast: this.state.viewContent || 'inbox'
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
  }

  render() {
    return (
      <div className='app'>
        <Nav />
        <Content
          view={this.state.viewContent ? this.state.viewContent : 'inbox'}
          db={this.state.db}
          value={this.state.value ? this.state.value : ''}/>
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

};