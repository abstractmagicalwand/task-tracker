import React from 'react';
import ReactDOM from 'react-dom';

import BoardMain from './BoardMain.jsx';
import BoardExtra from './BoardExtra.jsx';
import NavigationMenu from './NavigationMenu.jsx';

import {db} from '../db/index.js';
import {journal, account}  from '../db/journal.js';
import {load, loadJournal} from '../db/storage.js';
import {config} from '../db/config.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: load() || db,
      viewContent: null,
      viewLast: null,
      viewMini: 'spell',
      previewLength: config.PREVIEW_LENGTH
    };

    this.handleNavigation   = this.handleNavigation.bind(this);
    this.handleCreateTask   = this.handleCreateTask.bind(this);
    this.handleSearch       = this.handleSearch.bind(this);
    this.handleDeleteFolder = this.handleDeleteFolder.bind(this);
    this.handleDeleteTask   = this.handleDeleteTask.bind(this);
    this.handleCompleteTask = this.handleCompleteTask.bind(this);
    this.handleSaveEdit     = this.handleSaveEdit.bind(this);
    this.handleOpenNote     = this.handleOpenNote.bind(this);
    this.handleSaveNote     = this.handleSaveNote.bind(this);
    this.handleBackContent  = this.handleBackContent.bind(this);
    this.handleTick         = this.handleTick.bind(this);
    this.handleCancelTimer  = this.handleCancelTimer.bind(this);
    this.handleSetJournal   = this.handleSetJournal.bind(this);
    this.handleClearJournal = this.handleClearJournal.bind(this);

    this.searchTaskDB = this.searchTaskDB.bind(this);
    this.setStateDB   = this.setStateDB.bind(this);
    this.getFolderDB  = this.getFolderDB.bind(this);

    this.setWrapper = this.setWrapper.bind(this);
  }

  handleDeleteFolder(e) {
    e.preventDefault();
    const db = [...this.state.db]
    db.splice(this.getFolderDB(e.detail.project), 1);
    this.setStateDB(db);
  }

  handleNavigation(e) {
    e.preventDefault();

    const newState = Object.assign({}, this.state);

    if (e.detail.category === 'spell' || e.detail.category === 'account') {
      newState.viewMini = e.detail.category;
    } else {
      newState.viewLast = this.state.viewContent;
      newState.viewContent = e.detail.category;
    }

    this.setState(newState);
  }

  handleCreateTask(e) {
    e.preventDefault();
    const db = [...this.state.db];

    const folder = this.getFolderDB(e.detail.project) || db.length;

    if (folder === db.length) {
      db.unshift({
        project: e.detail.project,
        tasks: [e.detail],
        note: ''
      });
    } else {
      db[folder].tasks.unshift(e.detail);
    }

    this.setStateDB(db);
  }

  handleSearch(e) {
    e.preventDefault();
    this.setState({
      viewContent: 'search',
      value: e.detail.value
    });
  }

  handleDeleteTask(e) {
    const db   = [...this.state.db],
          task = this.searchTaskDB(e.detail.id, db);

    ++account['late'];
    task.arr.splice(task.i, 1);
    this.setStateDB(db);
  }

  handleCompleteTask(e) {
    const db   = [...this.state.db],
          _task = this.searchTaskDB(e.detail.id, db),
          task = _task.arr[_task.i],
          min = task.stopwatch[0] * 60 + task.stopwatch[1];

    ++account['completed'];
    account['minutes'] += min;

    const money = Math.floor(task.price / min * task.timePrice);
    account['wallet(usd)'] += isFinite(money) ? money : 0;

    task.complete = true;
    task.project  = 'ARCHIV';
    db[this.getFolderDB('ARCHIV')].tasks.unshift(_task.arr.splice(_task.i, 1)[0]);
    this.setStateDB(db);
  }

  handleSaveEdit(e) {
    const db = [...this.state.db];

    if (e.detail.project) {
      const folder = db[this.getFolderDB(e.detail.project)];
      folder.project = e.detail.value;

      folder.tasks.forEach(item => item.project = e.detail.value);
    } else if (e.detail.id) {
      const task = this.searchTaskDB(e.detail.id, db);
      task.arr[task.i].description = e.detail.value;
    }

    this.setStateDB(db);
  }

  setWrapper(func) {
    return (a) => {
        const db = [...this.state.db];
        func(a, db);
        this.setStateDB(db);
    };
  }

  handleOpenNote(e) {
    console.log(e);
    this.setState({
      viewContent: 'note',
      value      : e.detail.value,
      edit       : e.detail.project || e.detail.id,
      viewLast   : this.state.viewContent || 'inbox'
    });
  }

  handleSaveNote(e) {
    const db = [...this.state.db];

    if (typeof this.state.edit === 'number') {
      const task = this.searchTaskDB(this.state.edit, db);
      task.arr[task.i].note = e.detail.value;
    } else if (typeof this.state.edit === 'string') {
      this.state.db[this.getFolderDB(this.state.edit)].note = e.detail.value;
    }

    this.setState({
      viewContent: this.state.viewLast,
      edit: null,
      db: db,
      value: null
    });
    load(db);
  }

  handleBackContent(e) {
    if (!this.state.viewLast) return;
    this.setState({
      viewContent: this.state.viewLast,
      viewLast: this.state.viewContent
    });
  }

  handleTick(e) {
    const db = [...this.state.db],
          task = this.searchTaskDB(e.detail.id, db);

    switch (e.detail.type) {
    case 'timer':
        task.arr[task.i].timeDeath = e.detail.time;
        break;
    case 'stopwatch':
        task.arr[task.i].stopwatch = e.detail.time;
        break;
    }

    this.setStateDB(db);
  }

  handleCancelTimer(e) {
    const db = this.state.db.slice();
    db.forEach(item => {
      item.tasks.forEach((item, i, arr) => {
        if (e.detail.id === item.id) {
          item.timeDeath = null;
        }
      });
    });

    this.setStateDB(db);
  }

  handleSetJournal(e) {
    journal.push(e.detail);
    loadJournal(journal);
  }

  handleClearJournal(e) {
    journal.splice(e.detail.index, 1);
    loadJournal(journal);
  }

  componentWillMount() {
    window.removeEventListener('RELOCATE', this.handleNavigation);
    window.removeEventListener('TASK_CREATE', this.handleCreateTask);
    window.removeEventListener('SEARCH', this.handleSearch);
    window.removeEventListener('FOLDER_DELETE', this.handleDeleteFolder);
    window.removeEventListener('TASK_DELETE', this.handleDeleteTask);
    window.removeEventListener('COMPLETED', this.handleCompleteTask);
    window.removeEventListener('EDIT_SAVE', this.handleSaveEdit);
    window.removeEventListener('NOTE_OPEN', this.handleOpenNote);
    window.removeEventListener('NOTE_SAVE', this.handleSaveNote);
    window.removeEventListener('BACK', this.handleBackContent);
    window.removeEventListener('TICK', this.handleTick);
    window.removeEventListener('TIMER_DELETE', this.handleCancelTimer);
    window.removeEventListener('JOURNAL_CLEAR', this.handleClearJournal);
    window.removeEventListener('JOURNAL_SET', this.handleSetJournal);
  }

  render() {
    return (
      <div className='app'>
        <div className='app__container'>
          <div className='app__sidebar'>
            <NavigationMenu />
            <BoardExtra account={account} view={this.state.viewMini} />
          </div>
          <div
            className='app__content'
          >
            <BoardMain
              view={this.state.viewContent ? this.state.viewContent : 'inbox'}
              db={this.state.db}
              journal={journal}
              value={this.state.value ? this.state.value : ''}
              preview={config.PREVIEW_LENGTH}
            />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('RELOCATE', this.handleNavigation);
    window.addEventListener('TASK_CREATE', this.handleCreateTask);
    window.addEventListener('SEARCH', this.handleSearch);
    window.addEventListener('FOLDER_DELETE', this.handleDeleteFolder);
    window.addEventListener('TASK_DELETE', this.handleDeleteTask);
    window.addEventListener('COMPLETED', this.handleCompleteTask);
    window.addEventListener('EDIT_SAVE', this.handleSaveEdit);
    window.addEventListener('NOTE_OPEN', this.handleOpenNote);
    window.addEventListener('NOTE_SAVE', this.handleSaveNote)
    window.addEventListener('BACK', this.handleBackContent);
    window.addEventListener('TICK', this.handleTick);
    window.addEventListener('TIMER_DELETE', this.handleCancelTimer);
    window.addEventListener('JOURNAL_CLEAR', this.handleClearJournal);
    window.addEventListener('JOURNAL_SET', this.handleSetJournal);
  }

  searchTaskDB(id, DB) {
    const task = {};
    const db = DB;

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

  setStateDB(DB) {
    this.setState({db: DB});
    load(DB);
  }

  getFolderDB(project) {
    let index = null;
    this.state.db.forEach((folder, i) => {
      if (folder.project === project) index = i;
    });

    return index;
  }

};