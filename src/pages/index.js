/* eslint-disable */

/* react */
import React from 'React'
import ReactDOM from 'ReactDOM'
import ReactApp from '../components/ReactApp.jsx';
import * as service from '../services/commonServices';

ReactDOM.render((
  <div>
    <ReactApp dispatch={service} />
  </div>
), document.getElementById('react_app'));
