class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: db
    }
  }

  componentDidMount() {
    window.addEventListener('click123', e => console.log(event.detail.category));
  }

  render() {
    return (
      <div className='app'>
        <Bar />
        <Nav />
        <Field />
        <Content db={this.state.db}/>
      </div>
    );
  }
}


class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='content'>
        {/*<List type='inbox' db={this.props.db} />*/}
        <Collection db={this.props.db} />
      </div>
    );
  }
}


class Bar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='bar'></div>;
  }
}


class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickBtn = this.handleClickBtn.bind(this);
  }

  handleClickBtn(e) {
    const event = new CustomEvent('click123', {
      detail: {category: e.target.getAttribute('name')}
    });

    e.target.dispatchEvent(event);

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
  }

  render() {
    return (
      <div className='field'>
        <textarea className='area'>
        </textarea>
        <input className='sand' type='button' />
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
    return db.reduce((sum, item) => sum.concat(item.tasks), []);
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
    return db.map(folder => <Folder info={folder} />);
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
    return <div className='help'></div>;
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
  }

  render() {
    return <div className='search'></div>;
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

  }

  render() {
    return <div className='folder'>{this.props.info.project}</div>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
