var slideshow_data = [];
var slideshow_index = 0;
var slides_ids = [];
var current = 0;
var moving = false;

$.slideshow.slide = null;
$.slideshow.slide_buffer = null;

$.slideshow.resetSlideshow = function() {
	slideshow_data = [];
	slideshow_index = 0;
	slides_ids = [];
	current = 0;
	moving = false;
}

$.slideshow.appendData = function(dataParam) {
	for (var i in dataParam) {
		slides_ids[dataParam[i]['id']] = slideshow_index;
		slideshow_data[slideshow_index] = dataParam[i];
		slideshow_index++;
	}
}

$.slideshow.openSlideshow = function(idParam) {
	moving = false;

	current = slides_ids[idParam];

	if (null !== $.slideshow.slide) {
		$.slideshow.remove($.slideshow.slide);
		$.slideshow.slide = null;
	}

	$.slideshow.slide = Alloy.createController('slide').getView();
	$.slideshow.slide.updateData(slideshow_data[current]);
	$.slideshow.add($.slideshow.slide);

	$.slideshow.opacity = 1;
	$.slideshow.touchEnabled = true;
}
function backTap() {
	$.slideshow.opacity = 0;
	$.slideshow.touchEnabled = false;

	if (null !== $.slideshow.slide) {
		$.slideshow.remove($.slideshow.slide);
		$.slideshow.slide = null;
	}
}

function nextSlide() {
	if (!moving && undefined !== slideshow_data[current + 1]) {
		moving = true;
		if (null !== $.slideshow.slide_buffer) {
			$.slideshow.remove($.slideshow.slide_buffer);
			$.slideshow.slide_buffer = null;
		}

		$.slideshow.slide_buffer = Alloy.createController('slide').getView();
		$.slideshow.slide_buffer.left = Ti.Platform.displayCaps.platformWidth;
		$.slideshow.slide_buffer.updateData(slideshow_data[current + 1]);
		$.slideshow.add($.slideshow.slide_buffer);

		$.slideshow.slide_buffer.animate(Ti.UI.createAnimation({
			left : Math.floor((Ti.Platform.displayCaps.platformWidth - 612) / 2)
		}));

		$.slideshow.slide.animate(Ti.UI.createAnimation({
			left : -612
		}), function(e) {
			$.slideshow.remove($.slideshow.slide);
			$.slideshow.slide = null;
			$.slideshow.slide = $.slideshow.slide_buffer;
			$.slideshow.slide_buffer = null;
			moving = false;
		});

		current++;
	}
}

function prevSlide() {
	if (!moving && undefined !== slideshow_data[current - 1]) {
		moving = true;
		if (null !== $.slideshow.slide_buffer) {
			$.slideshow.remove($.slideshow.slide_buffer);
			$.slideshow.slide_buffer = null;
		}

		$.slideshow.slide_buffer = Alloy.createController('slide').getView();
		$.slideshow.slide_buffer.left = -612;
		$.slideshow.slide_buffer.updateData(slideshow_data[current - 1]);
		$.slideshow.add($.slideshow.slide_buffer);

		$.slideshow.slide_buffer.animate(Ti.UI.createAnimation({
			left : Math.floor((Ti.Platform.displayCaps.platformWidth - 612) / 2)
		}));

		$.slideshow.slide.animate(Ti.UI.createAnimation({
			left : Ti.Platform.displayCaps.platformWidth
		}), function(e) {
			$.slideshow.remove($.slideshow.slide);
			$.slideshow.slide = null;
			$.slideshow.slide = $.slideshow.slide_buffer;
			$.slideshow.slide_buffer = null;
			moving = false;
		});

		current--;
	}

}

function swipeSlideshow(e) {
	switch(e.direction) {
		case 'left':
			nextSlide();
			break;
		case 'right':
			prevSlide();
			break;
	}

	Ti.App.fireEvent('ui', {
		action : 'main_scroll_to_index',
		index : current
	});
}

$.slideshow.addEventListener('orientationChange', function(e) {
	if (null !== $.slideshow.slide) {
		$.slideshow.slide.top = undefined;
		$.slideshow.slide.left = undefined;
		
		setTimeout(function(e) {
			var left = Math.floor((Ti.Platform.displayCaps.platformWidth - 612) / 2);
			var top = Math.floor((Ti.Platform.displayCaps.platformHeight - 20 -  $.slideshow.slide.toImage().height) / 2);
			if (0 > top)
				top = 0;

			$.slideshow.slide.left = left;
			$.slideshow.slide.top = top;
		}, 200);
	}
});
