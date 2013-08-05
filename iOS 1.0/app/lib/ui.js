exports.setParent = function(parentWindowParam) {
	this.parent = parentWindowParam;
};

exports.setSession = function(sessionParam) {
	this.session = sessionParam;
};

exports.loginCheck = function() {
	this.loginOpen();
	this.login.updateUser(this.session);

	if (undefined === this.session) {
		this.loginRequestStart();
	} else if (undefined === this.session['verified'] && undefined === this.session['email']) {
		this.loginRequestMail();
	} else if (undefined === this.session['verified']) {
		this.loginRequestCode();
	} else {
		this.loginClose();
		Ti.App.fireEvent('navigation', {
			action : 'open_default'
		});
	}
};

exports.loginRequestLogin = function() {
	this.login.requestLogin();
};

exports.loginRequestLogout = function() {
	this.loginOpen();
	this.login.requestLogout();
};

exports.loginRequestStart = function() {
	this.login.requestStart();
};

exports.loginRequestMail = function() {
	this.login.requestMail();
};

exports.loginRequestCode = function() {
	this.login.requestCode();
};

exports.loginSaveEmail = function() {
	this.login.saveEmail();
};

exports.loginWrongEmail = function() {
	this.login.wrongEmail();
};

exports.loginSaveInvite = function() {
	this.login.saveInvite();
};

exports.loginWrongInvite = function() {
	this.login.wrongInvite();
};

exports.loginOpen = function() {
	if (null === this.login) {
		this.login = Alloy.createController('login').getView();
		this.parent.add(this.login);
	}
};

exports.loginClose = function() {
	if (null !== this.login) {
		this.parent.remove(this.login);
		this.login = null;
	}
};

exports.navbarSetTitle = function(titleParam) {
	this.navbar.setTitle(titleParam);
};

exports.navbarSetRoot = function(rootParam) {
	this.navbar.setRoot(rootParam);
};

exports.mainNew = function(headerParam, thumbLayoutParam) {
	if (null !== this.main.header) {
		this.main.remove(this.main.header);
		this.main.header = null;
	}

	if (null !== this.main.container) {
		this.main.remove(this.main.container);
		this.main.container = null;
	}

	if (null !== headerParam) {
		this.main.header = Alloy.createController('header_' + headerParam).getView();
		this.main.add(this.main.header);
	}

	this.main.container = Alloy.createController('container').getView();
	this.main.container.setThumbLayout(thumbLayoutParam);
	this.main.refreshContainer();
	this.slideshow.resetSlideshow();
	this.main.add(this.main.container);
};

exports.mainNewContainer = function(thumbLayoutParam) {
	if (null !== this.main.container) {
		this.main.remove(this.main.container);
		this.main.container = null;
	}
	
	this.main.container = Alloy.createController('container').getView();
	this.main.container.setThumbLayout(thumbLayoutParam);
	this.main.refreshContainer();
	this.slideshow.resetSlideshow();
	this.main.add(this.main.container);
};

exports.mainScrollToIndex = function(indexParam) {
	this.main.scrollToIndex(indexParam);
};

exports.mainHeaderAppendData = function(dataParam) {
	this.main.header.appendData(dataParam);
};

exports.mainContainerAppendData = function(dataParam, endParam) {
	this.main.container.appendData(dataParam, endParam);
	this.main.increaseIndex(dataParam.length);
};

exports.slideshowAppendData = function(dataParam){
	this.slideshow.appendData(dataParam);
};

exports.slideshowOpenSlideshow = function(idParam){
	this.slideshow.openSlideshow(idParam);
};

exports.orientationChange = function() {
	if (null !== this.login)
		this.login.fireEvent('orientationChange');
		
	if (null !== this.main.header)
		this.main.header.fireEvent('orientationChange');

	if (null !== this.main.container)
		this.main.container.fireEvent('orientationChange');
		
	if (null !== this.slideshow)
		this.slideshow.fireEvent('orientationChange');
};

exports.boot = function() {
	this.login = null;
	this.slideshow = null;
	this.navbar = null;
	this.main = null;

	this.navbar = Alloy.createController('navbar').getView();
	this.parent.add(this.navbar);

	this.main = Alloy.createController('main').getView();
	this.main.header = null;
	this.main.container = null;
	this.parent.add(this.main);
	
	this.slideshow = Alloy.createController('slideshow').getView();
	this.parent.add(this.slideshow);
	
	this.loginCheck();
};
