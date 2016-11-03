class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: db
    }

    this.handleNavBtnApp = this.handleNavBtnApp.bind(this);
    this.handleAddNewTaskApp = this.handleAddNewTaskApp.bind(this);
    this.handleSearchReqApp = this.handleSearchReqApp.bind(this);
    this.handleDeleteFolderApp = this.handleDeleteFolderApp.bind(this);
    this.handleDeleteTaskApp = this.handleDeleteTaskApp.bind(this);
  }

  handleDeleteFolderApp(e) {
    e.preventDefault();
    let index;
    this.state.db.forEach((folder, i) => {
      if (folder.project == e.detail.project) index = i;
    });

    this.state.db.splice(index, 1);

    this.setState({db: this.state.db});
  }

  handleNavBtnApp(e) {
    e.preventDefault();
    this.setState({viewContent: e.detail.category});
  }

  handleAddNewTaskApp(e) {
    e.preventDefault();
    this.state.db.filter(item => {
      if (item.project  == 'SANS') return item;
    })[0].tasks.unshift({description: e.detail.description});

    this.setState({db: this.state.db});
  }

  handleSearchReqApp(e) {
    e.preventDefault();
    this.setState({
      viewContent: 'search',
      value: e.detail.value
    });
  }

  handleDeleteTaskApp(e) {

  }

  componentWillMount() {
    window.removeEventListener('clickNavBtn', this.handleNavBtnApp);
    window.removeEventListener('addNewTask', this.handleAddNewTaskApp);
    window.removeEventListener('searchValue', this.handleSearchReqApp);
    window.removeEventListener('deleteFolder', this.handleDeleteFolderApp);
    window.removeEventListener('deleteTask', this.handleDeleteTaskApp);
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
    window.addEventListener('clickNavBtn', this.handleNavBtnApp);
    window.addEventListener('addNewTask', this.handleAddNewTaskApp);
    window.addEventListener('searchValue', this.handleSearchReqApp);
    window.addEventListener('deleteFolder', this.handleDeleteFolderApp);
    window.addEventListener('deleteTask', this.handleDeleteTaskApp);
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
        return <Note />;
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
      detail: {description: ReactDOM.findDOMNode(this.refs.text).value}
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
  }

  render() {
    return <div className='note'></div>;
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

    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleNoteTask = this.handleNoteTask.bind(this);
    this.handleCompleteTask = this.handleCompleteTask.bind(this);
    this.handleToggleStopwatch = this.handleToggleStopwatch.bind(this);
    this.handleCancelTimer = this.handleCancelTimer.bind(this);
    this.handleEditTask = this.handleEditTask.bind(this);
    this.handleSelecteTask = this.handleSelecteTask.bind(this);
  }

  handleDeleteTask() {
    const event = new CustomEvent('deleteTask', {
      detail: {id: this.props.info.id}
    });

    window.dispatchEvent(event);
  }

  handleNoteTask() {

  }

  handleCompleteTask() {

  }

  handleToggleStopwatch() {

  }

  handleCancelTimer() {

  }

  handleEditTask() {

  }

  handleSelecteTask() {

  }

  render() {
    return (
      <div className='task'>
        <p class='descript'>{this.props.info.description}</p>
        <span className='delete' onClick={this.handleDeleteTask}></span>
      </div>
    );
  }
}


class Folder extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeleteFolder = this.handleDeleteFolder.bind(this);
    this.handleEditFolder = this.handleDeleteFolder.bind(this);
    this.handleNoteFolder = this.handleNoteFolder.bind(this);
    this.handleClickFolder = this.handleClickFolder.bind(this);
  }

  handleDeleteFolder() {
    const event = new CustomEvent('deleteFolder', {
      detail: {project: this.props.info.project}
    });

    window.dispatchEvent(event);
  }

  handleEditFolder() {

  }

  handleNoteFolder() {

  }

  handleClickFolder(e) {
    if (e.target.tagName != 'DIV') return;
    const event = new CustomEvent('clickNavBtn', {
      detail: {category: this.props.info.project}
    });

    window.dispatchEvent(event);
  }

  render() {
    return (
      <div
        className={'folder' + (this.state.selecte ? ' selecte' : '')}
        onClick={this.handleClickFolder}>
        {this.props.info.project}
        <span className='delete' onClick={this.handleDeleteFolder}></span>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
