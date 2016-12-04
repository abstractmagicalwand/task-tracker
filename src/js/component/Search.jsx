import React    from 'react';
import ReactDOM from 'react-dom';

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchReq = this.handleSearchReq.bind(this);
  }

  handleSearchReq(e) {
    window.dispatchEvent(new CustomEvent('searchValue', {
      detail: {value: e.target.value}
    }));
  }

  render() {
    return (
      <input
        className='list__search'
        type='text'
        onChange={this.handleSearchReq}
      />
    );
  }
};