Alloy.Globals.ui.setParent($.index);

//Alloy.Globals.sessions.setSessions(JSON.parse(Ti.App.Properties.getString('sessions', '{}')), Ti.App.Properties.getInt('current_id', 0));
Alloy.Globals.sessions.loadSessions();
refreshSession();

function refreshSession() {
	Alloy.Globals.ui.setSession(Alloy.Globals.sessions.getCurrent());
	Alloy.Globals.nexum.setSession(Alloy.Globals.sessions.getCurrent());
	Alloy.Globals.instagram.setSession(Alloy.Globals.sessions.getCurrent());
}

Ti.App.addEventListener('instagram', function(e) {
	switch(e.action) {
		case 'get_user':
			Alloy.Globals.instagram.getUser(e.identifier);
			break;
		case 'get_media_search':
			Alloy.Globals.instagram.getMediaSearch(e.lat, e.lng, Alloy.Globals.navigation.getMaxHACK());
			break;
		case 'get_media_popular':
			Alloy.Globals.instagram.getMediaPopular();
			break;
		case 'get_user_media_feed':
			Alloy.Globals.instagram.getUserMediaFeed(e.max_id);
			break;
		case 'get_user_media_recent':
			Alloy.Globals.instagram.getUserMediaRecent(e.identifier, e.max_id);
			break;
	}
});

Ti.App.addEventListener('navigation', function(e) {
	switch(e.action) {
		case 'logout':
			Alloy.Globals.sessions.delCurrent();
			Alloy.Globals.ui.loginRequestLogout();
			break;
		case 'open_default':
		case 'open_feed':
			Alloy.Globals.ui.navbarSetRoot('home');
			Alloy.Globals.navigation.setRoot('feed', null, 'feed', null, 'thumb_a');
			break;
		case 'open_popular':
			Alloy.Globals.ui.navbarSetRoot('explore');
			Alloy.Globals.navigation.setRoot('explore', 'explore', 'popular', null, 'thumb_a');
			break;
		case 'open_profile':
			Alloy.Globals.ui.navbarSetRoot('profile');
			Alloy.Globals.navigation.setRoot('profile', 'profile', 'profile', 'self', 'thumb_b');
			break;
		case 'open_page':
			Alloy.Globals.navigation.setPage(e.title, e.header, e.source, e.identifier, e.thumb);
			break;
		case 'request_user_data':
			Alloy.Globals.navigation.requestUserData();
		case 'load_more':
			Alloy.Globals.navigation.loadMore();
			break;
	}
});

Ti.App.addEventListener('sessions', function(e) {
	switch(e.action) {
		case 'set_current':
			Alloy.Globals.sessions.setCurrentUser(e.userData, e.accessToken);
			break;
		case 'del_current':
			Alloy.Globals.sessions.delCurrent();
		case 'set_current_email':
			Alloy.Globals.sessions.setCurrentEmail(e.email);
			break;
		case 'set_current_verified':
			Alloy.Globals.sessions.setCurrentVerified(true);
			break;
	}
	refreshSession();
});

Ti.App.addEventListener('nexum', function(e) {
	switch(e.action) {
		case 'post_session':
			Alloy.Globals.nexum.postSession(e.code);
			break;
		case 'post_email':
			Alloy.Globals.nexum.postEmail(e.email);
			break;
		case 'post_invite':
			Alloy.Globals.nexum.postInvite(e.invite);
			break;
	}
});

Ti.App.addEventListener('ui', function(e) {
	switch(e.action) {
		case 'login_no_email':
			Alloy.Globals.sessions.setCurrentEmail(undefined);
			Alloy.Globals.ui.loginCheck();
			break;
		case 'login_no_code':
			Alloy.Globals.sessions.setCurrentVerified(undefined);
			Alloy.Globals.ui.loginCheck();
			break;
		case 'login_verified':
			Alloy.Globals.sessions.setCurrentVerified(true);
			Alloy.Globals.ui.loginCheck();
			break;
		case 'login_save_email':
			Alloy.Globals.ui.loginSaveEmail();
			break;
		case 'login_wrong_email':
			Alloy.Globals.ui.loginWrongEmail();
			break;
		case 'login_save_invite':
			Alloy.Globals.ui.loginClose();
			break;
		case 'login_wrong_invite':
			Alloy.Globals.ui.loginWrongInvite();
			break;
		case 'navbar_set_title':
			Alloy.Globals.ui.navbarSetTitle(e.title);
			break;
		case 'main_new':
			Alloy.Globals.ui.mainNew(e.header, e.thumbLayout);
			break;
		case 'main_new_container':
			Alloy.Globals.ui.mainNewContainer(e.thumbLayout);
			break;
		case 'main_scroll_to_index':
			Alloy.Globals.ui.mainScrollToIndex(e.index);
			break;
		case 'header_append_data':
			if (Alloy.Globals.navigation.isResponseExpected(e.endpoint, e.identifier)) {
				Alloy.Globals.ui.mainHeaderAppendData(e.data);
			}
			break;
		case 'container_append_data':
			if (Alloy.Globals.navigation.isResponseExpected(e.endpoint, e.identifier)) {
				Alloy.Globals.ui.slideshowAppendData(e.data);
				if (undefined === Alloy.Globals.navigation.setMax(e.pagination)) {
					Alloy.Globals.ui.mainContainerAppendData(e.data, true);
				} else {
					Alloy.Globals.ui.mainContainerAppendData(e.data, false);
				}
			}
			break;
		case 'slideshow_open_slideshow':
			Alloy.Globals.ui.slideshowOpenSlideshow(e.id);
			break;
	}
});

Ti.Gesture.addEventListener('orientationchange', function(e) {
	Alloy.Globals.ui.orientationChange();
});

Alloy.Globals.ui.boot();
$.index.open();
