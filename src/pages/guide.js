/* eslint-disable */

import style from './guide.css';

/* jQuery */
import jQueryApp from '../components/jQueryApp';

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

/* vue */
import Vue from 'vue';
import { Carousel, CarouselItem } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from '../components/VueApp.vue';

Vue.use(Carousel);
Vue.use(CarouselItem);

new Vue({
  el: '#vue_app',
  render: h => h(App)
});

