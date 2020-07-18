// Mobile menu
$('.nav-trigger').click(function () {
	$(this).toggleClass('active');
	$('#menu-principal').toggleClass('active');
});

$('#menu-principal a[href^="/#"]').click(function () {
	$('#menu-principal').toggleClass('active');
	$('.nav-trigger').toggleClass('active');
});

// feather icons
feather.replace()

// anime scroll
var root = document.documentElement;
root.className += ' js';
function boxTop(idBox) {
	var boxOffset = $(idBox).offset().top;
	return boxOffset;
}
$(document).ready( () => {
	var $target = $('.anime'),
		animationClass = 'anime-init',
		windowHeight = $(window).height(),
		offset = windowHeight - (windowHeight / 5);
	function animeScroll() {
		var documentTop = $(document).scrollTop();
		$target.each(function () {
			if (documentTop > boxTop(this) - offset) {
				$(this).addClass(animationClass);
			} else {
				$(this).removeClass(animationClass);
			}
		});
	}
	animeScroll();
	$(document).scroll( () => {
		animeScroll();
	});
});







