class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: db
    }
  }

  render() {
    return (
      <div className='app'>
        <Content db={this.state.db}/>
        <Bar />
        <Nav />
        <Field />
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
        <List type='inbox' db={this.props.db}/>
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
  }

  render() {
    return (
      <div className='nav'>
        <div className='btn'>Inbox</div>
        <div className='btn'>Project</div>
        <div className='btn'>Archiv</div>
        <div className='btn'>Stats</div>
        <div className='btn'>Help</div>
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
    console.log( db.reduce((sum, item) => sum.concat(item.tasks), []) );
    return db.reduce((sum, item) => sum.concat(item.tasks), []);
  }

  getCompTasks(tasks) {
    return tasks.map((task) => <Task info={task} />)
  }
}


class Collection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='collection'></div>;
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
  }

  render() {
    return <div className='task'></div>;
  }
}


class Folder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='folder'></div>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
