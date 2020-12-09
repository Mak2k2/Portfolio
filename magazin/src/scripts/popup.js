$(document).ready(() => {
	$('.show-popup').magnificPopup({
		type: 'inline',
		removalDelay: 500,
		callbacks: {
			beforeOpen: function () {
				this.st.mainClass = this.st.el.attr('data-effect');
			}
		},
		midClick: true
	});
	$('#close').click(function(){
    $.magnificPopup.close();
  });
});