class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: db
    }

    this.handleNavBtnApp       = this.handleNavBtnApp.bind(this);
    this.handleAddNewTaskApp   = this.handleAddNewTaskApp.bind(this);
    this.handleSearchReqApp    = this.handleSearchReqApp.bind(this);
    this.handleDeleteFolderApp = this.handleDeleteFolderApp.bind(this);
    this.handleDeleteTaskApp   = this.handleDeleteTaskApp.bind(this);
    this.handleCompleteTaskApp = this.handleCompleteTaskApp.bind(this);
    this.handleSaveEditApp     = this.handleSaveEditApp.bind(this);
    this.handleOpenNoteApp     = this.handleOpenNoteApp.bind(this);
    this.handleSaveNoteApp     = this.handleSaveNoteApp.bind(this);

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
    this.state.db.filter(item => {
      if (item.project  == 'SANS') return item;
    })[0].tasks.unshift({
      description: e.detail.description,
      id: Math.floor(Math.random() * Math.pow(100, 10))
    });

    this.setStateDb();
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

    if (typeof this.state.edit == 'number') {
      const task = this.searchTaskDb(this.state.edit);
      task.arr[task.i].note = e.detail.value;
    } else if (typeof this.state.edit == 'string') {
      this.state.db[this.getFolderOfDb(this.state.edit)].note = e.detail.value;
    }
    this.setState({
      viewContent: this.state.viewLast,
      edit: null,
      db: this.state.db,
      value: null
    });
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
    window.removeEventListener('saveNote'    , this.handleSaveNoteApp)
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
  }

  searchTaskDb(id) {
    const task = {};

    this.state.db.forEach(item => {
      item.tasks.forEach((item, i, arr) => {
        if (id == item.id) {
          task.i = i;
          task.arr = arr;
        }
      });
    });

    return task;
  }

  setStateDb() {
    this.setState({db: this.state.db});
  }

  getFolderOfDb(project) {
    let index;
    this.state.db.forEach((folder, i) => {
      if (folder.project == project) index = i;
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
  }

  handleGetText() {
    if (!ReactDOM.findDOMNode(this.refs.text).value.length) return;

    const event = new CustomEvent('addNewTask', {
      detail: {
        description: ReactDOM.findDOMNode(this.refs.text).value,
        id: Math.floor(Math.random() * Math.pow(100, 10))
      }
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
          if (item.project == 'ARCHIV')  return item;
        })[0].tasks;
    case 'project':
        return db.filter(item => {
          if (item.project == this.props.projectName) return item;
        })[0].tasks;
    case 'search':
        return this.getInboxTasks(db).filter((item, d, array) => {
          if (~item.description.indexOf(this.props.value)) return item;
        });
    }

  }

  getInboxTasks(db) {
    return db.filter(item => {
      if (!(item.project == 'ARCHIV'))  return item;
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
      if (folder.project != 'ARCHIV' && folder.project != 'SANS') return folder;
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
    //...
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

    this.state = {
      edit: false
    }

    this.handleDeleteTask      = this.handleDeleteTask.bind(this);
    this.handleNoteTask        = this.handleNoteTask.bind(this);
    this.handleCompleteTask    = this.handleCompleteTask.bind(this);
    this.handleToggleStopwatch = this.handleToggleStopwatch.bind(this);
    this.handleCancelTimer     = this.handleCancelTimer.bind(this);
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

  handleCancelTimer() {

  }

  handleToggleStopwatch() {

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

          {this.props.info.project != 'ARCHIV' ?
          <span>
            <span className='edit-btn' onClick={this.handleEditTask}></span>
            <span className='note-btn' onClick={this.handleNoteTask}></span>
            <input onClick={this.handleCompleteTask} className='complete' type='checkbox' />
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


class Folder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false
    }

    this.handleDeleteFolder   = this.handleDeleteFolder.bind(this);
    this.handleEditFolder     = this.handleEditFolder.bind(this);
    this.handleNoteFolder     = this.handleNoteFolder.bind(this);
    this.handleClickFolder    = this.handleClickFolder.bind(this);
    this.handleSaveEditFolder = this.handleSaveEditFolder.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
  }

  handleClickFolder(e) {
    if (e.target.tagName != 'DIV') return;
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

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
