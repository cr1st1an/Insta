$.navbar.setTitle = function(titleParam) {
	$.title.text = titleParam.toLowerCase();
};

$.navbar.setRoot = function(rootParam) {
	if (undefined !== this.root) {
		switch(this.root) {
			case 'home':
				$.home.backgroundImage = $.home.backgroundBaseImage;
				$.home.touchEnabled = true;
				break;
			case 'explore':
				$.explore.backgroundImage = $.explore.backgroundBaseImage;
				$.explore.touchEnabled = true;
				break
			case 'profile':
				$.profile.backgroundImage = $.profile.backgroundBaseImage;
				$.profile.touchEnabled = true;
				break;
			case 'share':
				$.share.backgroundImage = $.share.backgroundBaseImage;
				$.share.touchEnabled = true;
				break;
		}
	}

	this.root = rootParam;

	switch(this.root) {
		case 'home':
			$.home.backgroundImage = $.home.backgroundSelectedImage;
			$.home.touchEnabled = false;
			break;
		case 'explore':
			$.explore.backgroundImage = $.explore.backgroundSelectedImage;
			$.explore.touchEnabled = false;
			break
		case 'profile':
			$.profile.backgroundImage = $.profile.backgroundSelectedImage;
			$.profile.touchEnabled = false;
			break;
		case 'share':
			$.share.backgroundImage = $.share.backgroundSelectedImage;
			$.share.touchEnabled = false;
			break;
	}
};

function homeTap() {
	Ti.App.fireEvent('navigation', {
		action : 'open_feed'
	});
};

function exploreTap() {
	Ti.App.fireEvent('navigation', {
		action : 'open_popular'
	});
};

function profileTap() {
	Ti.App.fireEvent('navigation', {
		action : 'open_profile'
	});
};

function prevTap() {
	
};