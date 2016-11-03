class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: db
    }

    this.handleNavBtn = this.handleNavBtn.bind(this);
    this.handleAddNewTask = this.handleAddNewTask.bind(this);
    this.handleSearchReq = this.handleSearchReq.bind(this);
  }

  handleNavBtn(e) {
    this.setState({viewContent: e.detail.category});
    e.preventDefault(e);
  }

  handleAddNewTask(e) {
    this.state.db.filter(item => {
      if (item.project  == 'SANS') return item;
    })[0].tasks.unshift({description: e.detail.description});

    this.setState({db: this.state.db});
  }

  handleSearchReq(e) {
    this.setState({
      viewContent: 'search',
      searchValue: e.detail.value
    });
  }

  componentWillMount() {
    window.removeEventListener('clickNavBtn', this.handleNavBtn);
    window.removeEventListener('addNewTask', this.handleAddNewTask);
    window.removeEventListener('searchValue', this.handleSearchReq);
  }

  render() {
    return (
      <div className='app'>
        <Bar />
        <Nav />
        <Field />
        <Content view={this.state.viewContent ? this.state.viewContent : 'inbox'} db={this.state.db} searchValue={this.state.searchValue ? this.state.searchValue : ''}/>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('clickNavBtn', this.handleNavBtn);
    window.addEventListener('addNewTask', this.handleAddNewTask);
    window.addEventListener('searchValue', this.handleSearchReq);
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
        return <List type='search' value={this.props.searchValue} db={this.props.db} />
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
          console.log(this.props.value);
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
    console.log(tasks);
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
      </div>
    );
  }
}


class Folder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selecte: false
    }

    this.handleDeleteFolder = this.handleDeleteFolder.bind(this);
    this.handleEditFolder = this.handleDeleteFolder.bind(this);
    this.handleNoteFolder = this.handleNoteFolder.bind(this);
    this.handleSelecteFolder = this.handleSelecteFolder.bind(this);
  }

  handleDeleteFolder() {

  }

  handleEditFolder() {

  }

  handleNoteFolder() {

  }

  handleSelecteFolder() {
    const event = new CustomEvent('clickNavBtn', {
      detail: {category: this.props.info.project}
    });

    window.dispatchEvent(event);
  }

  render() {
    return (
      <div
        className={'folder' + (this.state.selecte ? ' selecte' : '')}
        onClick={this.handleSelecteFolder}>
        {this.props.info.project}
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
