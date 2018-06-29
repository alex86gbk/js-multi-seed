import ReactDOM from 'ReactDOM'
import List from '../components/List.jsx';
import style from './index.css';
import * as service from '../services/indexServices';

ReactDOM.render((
  <div className={style.hello}>
    <h1>Hello js-multi-seed!</h1>
    <List dispatch={service} />
  </div>
), document.getElementById('main'));
