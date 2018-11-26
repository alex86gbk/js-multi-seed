/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import $ from 'jQuery';

/**
 * 初始化 SkyCarousel
 */
function initSkyCarousel() {
  $('#character-slider').carousel({
    itemWidth: 256,
    itemHeight: 248,
    enableMouseWheel: false,
    gradientOverlayVisible: true,
    gradientOverlayColor: '#42bdc2',
    gradientOverlaySize: 300,
    distance: 30,
    selectedItemDistance: 80,
    selectByClick: true,
    selectedItemZoomFactor: 0.8,
    unselectedItemZoomFactor: 0.4,
    navigationButtonsVisible: false,
    showPreloader: false,
    autoSlideshow: true,
  });
}

$(function () {
  initSkyCarousel();
});
