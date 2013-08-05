tabSelected('popular');

$.header_explore.addEventListener('orientationChange', function(e) {
	$.header_explore.width = Ti.Platform.displayCaps.platformWidth;
});

function tabSelected(nameParam) {
	if (nameParam !== this.name) {
		switch(this.name) {
			case 'popular':
				$.popular.backgroundImage = $.popular.backgroundBaseImage;
				$.popular_name.color = '#7c7c7c';
				break;
			case 'near':
				$.near.backgroundImage = $.near.backgroundBaseImage;
				$.near_name.color = '#7c7c7c';
				break;
		}
	}
	
	this.name = nameParam;
	
	switch(this.name) {
		case 'popular':
			$.popular.backgroundImage = $.popular.backgroundSelectedImage;
			$.popular_name.color = Alloy.CFG.ui_color;
			break;
		case 'near':
			$.near.backgroundImage = $.near.backgroundSelectedImage;
			$.near_name.color = Alloy.CFG.ui_color;
			break;
	}
}

function popularTap() {
	tabSelected('popular');
	
	Ti.App.fireEvent('navigation', {
		action : 'open_page',
		title : 'popular',
		header : 'explore',
		source : 'popular',
		identifier : null,
		thumb : 'thumb_a'
	});
}

function nearTap(){
	tabSelected('near');
	
	Ti.App.fireEvent('navigation', {
		action : 'open_page',
		title : 'near',
		header : 'explore',
		source : 'near',
		identifier : null,
		thumb : 'thumb_a'
	});
}
