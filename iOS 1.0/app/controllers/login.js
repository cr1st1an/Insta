$.emailInput.value = 'email';
$.inviteInput.value = 'access code';

$.login.updateUser = function(userDataParam) {
	if (undefined !== userDataParam) {
		$.profilePictureEmail.image = userDataParam['profile_picture'];
		$.usernameEmail.text = '@' + userDataParam['username'];

		$.profilePictureInvite.image = userDataParam['profile_picture'];
		$.usernameInvite.text = '@' + userDataParam['username'];

		$.emailInvite.text = userDataParam['email'];
	}
};

$.login.requestStart = function() {
	hideAll();
	showView('start');
};

$.login.requestMail = function() {
	hideAll();
	showView('email');
};

$.login.requestCode = function() {
	hideAll();
	showView('invite');
};

$.login.saveEmail = function() {
	Ti.App.fireEvent('sessions', {
		action : 'set_current_email',
		email : $.emailInput.value
	});

	showView('invite');
	hideView('email');
};

$.login.wrongEmail = function() {
	$.emailInput.color = '#f73155';
	$.emailGo.backgroundImage = '/login/alert.png';
	$.emailGo.backgroundSelectedImage = '/login/alert.png';
};

$.login.saveInvite = function() {
	hideView('invite');
};

$.login.wrongInvite = function() {
	$.inviteInput.color = '#f73155';
	$.inviteGo.backgroundImage = '/login/alert.png';
	$.inviteGo.backgroundSelectedImage = '/login/alert.png';
};

$.login.requestLogin = function() {
	hideAll();
	showView('instagram');
	$.instagram.url = 'https://api.instagram.com/oauth/authorize/?client_id=' + Alloy.CFG.ig_client_id + '&redirect_uri=' + Alloy.CFG.ig_callback + '&response_type=code&scope=relationships+likes+comments&display=touch';
};

$.login.requestLogout = function() {
	$.instagram.url = Alloy.CFG.ig_logout;
	this.requestStart();
};

function hideAll() {
	$.start.touchEnabled = false;
	$.start.opacity = 0;
	$.instagram.touchEnabled = false;
	$.instagram.opacity = 0;
	$.email.touchEnabled = false;
	$.email.opacity = 0;
	$.invite.touchEnabled = false;
	$.invite.opacity = 0;
}

function hideView(idParam) {
	switch(idParam) {
		case 'start':
			$.start.touchEnabled = false;
			$.start.opacity = 0;
			break;
		case 'instagram':
			$.instagram.touchEnabled = false;
			$.instagram.opacity = 0;
			break;
		case 'email':
			$.email.touchEnabled = false;
			$.email.opacity = 0;
			break;
		case 'invite':
			$.invite.touchEnabled = false;
			$.invite.opacity = 0;
			break;
	}
}

function showView(idParam) {
	switch(idParam) {
		case 'start':
			$.start.touchEnabled = true;
			$.start.opacity = 1;
			break;
		case 'instagram':
			$.instagram.touchEnabled = true;
			$.instagram.opacity = 1;
			break;
		case 'email':
			$.email.touchEnabled = true;
			$.email.opacity = 1;
			break;
		case 'invite':
			$.invite.touchEnabled = true;
			$.invite.opacity = 1;
			break;
	}
}

function startTap() {
	$.login.requestLogin();
}

function cancelTap() {
	showView('start');
	hideView('instagram');
}

function backEmailTap() {
	$.emailInput.focus();
}

function backInviteTap() {
	$.inviteInput.focus();
}

function inputFocus() {
	$.login.hasKeyboard = true;
	$.login.fireEvent('orientationChange');

	if ('email' === $.emailInput.value) {
		$.emailInput.value = '';
	}

	if ('access code' === $.inviteInput.value) {
		$.inviteInput.value = '';
	}
}

function inputBlur() {
	$.login.hasKeyboard = false;
	$.login.fireEvent('orientationChange');

	if ('' === $.emailInput.value) {
		$.emailInput.value = 'email';
	}

	if ('' === $.inviteInput.value) {
		$.inviteInput.value = 'access code';
	}
}

function inputChange() {
	if ('#f73155' === $.emailInput.color) {
		$.emailInput.color = '#113452';
		$.emailGo.backgroundImage = '/login/go.png';
		$.emailGo.backgroundSelectedImage = '/login/go_tap.png';
	}

	if ('#f73155' === $.inviteInput.color) {
		$.inviteInput.color = '#113452';
		$.inviteGo.backgroundImage = '/login/go.png';
		$.inviteGo.backgroundSelectedImage = '/login/go_tap.png';
	}
}

function returnEmail(e) {
	if ('' !== $.emailInput.value) {
		Ti.App.fireEvent('nexum', {
			action : 'post_email',
			email : $.emailInput.value
		});
		
		$.emailInvite.text = $.emailInput.value;
	}
}

function returnInvite(e) {
	if ('' !== $.inviteInput.value) {
		Ti.App.fireEvent('nexum', {
			action : 'post_invite',
			invite : $.inviteInput.value
		});
	}
}

function undoUserTap(e){
	$.login.requestLogout();
}

function undoEmailTap(e){
	$.login.requestMail();
}

$.login.addEventListener('orientationChange', function(e) {
	var keyboardHeight;
	if (Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight) {
		keyboardHeight = 262;
	} else {
		keyboardHeight = 350;
	}

	$.email.animate(Ti.UI.createAnimation({
		top : ((Ti.Platform.displayCaps.platformHeight - 294 - 20 - ($.login.hasKeyboard ? keyboardHeight : 0)) / 2)
	}));

	$.invite.animate(Ti.UI.createAnimation({
		top : ((Ti.Platform.displayCaps.platformHeight - 294 - 20 - ($.login.hasKeyboard ? keyboardHeight : 0)) / 2)
	}));
});

$.instagram.addEventListener('load', function(e) {
	if (undefined !== e.source.url) {
		var invalid = ['http://instagram.com/', 'https://instagram.com/accounts/login/?next=', 'https://instagram.com/accounts/login/', 'http://nexumdigital.com/', 'https://instagram.com/accounts/password/reset/done/'];

		var url = e.source.url;
		url = url.replace('&_=_#_', '');
		url = url.replace('_#_', '');
		url = url.replace('#_', '');

		var code = url.replace(Alloy.CFG.ig_callback + '?code=', '');
		var error_reason = url.replace(Alloy.CFG.ig_callback + '?error_reason=', '');
		if (code !== url) {
			hideView('instagram');

			Ti.App.fireEvent('nexum', {
				action : 'post_session',
				code : code
			});
		} else if (error_reason != e.source.url || -1 !== invalid.indexOf(url)) {
			alert('Insta needs your authorization.');
		}
	}
});
