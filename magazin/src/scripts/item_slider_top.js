$(document).on('DOMContentLoaded', () => {
	$(".item_right_slider_top").slick({
      lazyLoad: 'ondemand',
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: false,
      arrows: false,
      asNavFor: '.item_right_slider_bottom',
      customPaging:function(){return ''}
  });
  $('.item_right_slider_bottom').slick({
    lazyLoad: 'ondemand',
    slidesToShow: 4,
    focusOnSelect: true,
    arrows: false,
    asNavFor: '.item_right_slider_top',
    infinity: true
  });
});