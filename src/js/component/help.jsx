import React    from 'react';
import ReactDOM from 'react-dom';

export default class Help extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='help'>
        <h3 className='help-title'>Spells</h3>
        <p><span className='help-prop'>timer death:</span> hh/mm/ss</p>
        <p><span className='help-prop'>priority:</span> * </p>
        <p>count stars, level priority</p>
        <p><span className='help-prop'>project:</span> @name-project</p>
        <p><span className='help-prop'>tags:</span> #nameTag</p>
      </div>
    );
  }
}