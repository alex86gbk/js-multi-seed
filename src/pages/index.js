import ReactDOM from 'ReactDOM'
import List from '../components/List.jsx';
import style from './index.css';

ReactDOM.render((
  <div className={style.hello}>
    <h1>Hello js-multi-seed!</h1>
    <List></List>
  </div>
), document.getElementById('main'));
