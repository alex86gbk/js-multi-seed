/* jQuery */
import $ from 'jQuery';
import logo from '../assets/images/logo.svg';

$(function () {
  let $img = $('<img />');

  $img.get(0).src = logo;
  $img.attr({
    width: '100%',
    height: 300
  });
  $img.css({
    marginTop: -60,
    marginBottom: -80,
  });

  $('body').prepend($img);
});

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

