import React from 'React';
import ReactDOM from 'react-dom';
import ReactApp from '../components/ReactApp';
import * as service from '../services/commonServices';

ReactDOM.render((
  <ReactApp dispatch={service} />
), document.getElementById('react_app'));
