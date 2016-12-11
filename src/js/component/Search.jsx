import React, {Component} from 'react';

export default class Search extends Component {
  constructor() {
    super();

    this.handleRequest = this.handleRequest.bind(this);
  }

  handleRequest(e) {
    window.dispatchEvent(new CustomEvent('SEARCH', {
      detail: {
        value: e.target.value
      }
    }));
  }

  render() {
    return (
      <div className="list__container-search">
        <input
          className="list__search"
          type="text"
          onChange={this.handleRequest}
        />
      </div>
    );
  }
}