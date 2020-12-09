$(document).on('DOMContentLoaded', () => {
	$(".header_slider").slick({
      lazyLoad: 'ondemand',
      slidesToShow: 1,
      slidesToScroll: 1,
      infinity: true,
      prevArrow: "<img src='assets/img/arr-left.png' class='slick-arrow slick-prev' alt='prev'>",
    	nextArrow: "<img src='assets/img/arr-right.png' class='slick-arrow slick-next' alt='next'>",
      customPaging:function(){return ''}
      //centerMode: true
  });
});