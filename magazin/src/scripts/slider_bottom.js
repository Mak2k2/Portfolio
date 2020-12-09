$(document).on('DOMContentLoaded', () => {
    let slides = 4;
    let temp_slides = 0;

    temp_slides = Number(document.cookie);

    setInterval(() => quantity(), 2000);

    let quantity = () => {
        let width = window.innerWidth;
        if (width <= 1099) slides = 4;     
        if (width <= 1090) slides = 3;
        if (width <= 820) slides = 2;
        if (width <= 565) slides = 1;

        if (slides != temp_slides) {
            temp_slides = slides;
            document.cookie = temp_slides;
            location.reload()
        }
    };

    $('.slider_bottom').slick({
        lazyLoad: 'ondemand',
        slidesToShow: temp_slides,
        focusOnSelect: true,
        arrows: true,
        prevArrow: "<img src='assets/img/arr-left-black.png' class='slick-arrow slick-prev' alt='prev'>",
        nextArrow: "<img src='assets/img/arr-right-black.png' class='slick-arrow slick-next' alt='next'>",
        infinity: true
    });
});