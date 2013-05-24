exports.setRoot = function(titleParam, headerParam, actionParam, identifierParam, thumbLayoutParam) {
	this.breadcrumbs = [];

	this.setPage(titleParam, headerParam, actionParam, identifierParam, thumbLayoutParam);
}

exports.setPage = function(titleParam, headerParam, actionParam, identifierParam, thumbLayoutParam) {
	this.loading = false;

	this.current = {};
	this.current['title'] = titleParam;
	this.current['header'] = headerParam;
	this.current['action'] = actionParam;
	this.current['identifier'] = identifierParam;
	this.current['thumb_layout'] = thumbLayoutParam;
	this.current['max_id'] = undefined;

	Ti.App.fireEvent('ui', {
		action : 'navbar_set_title',
		title : titleParam
	});

	Ti.App.fireEvent('ui', {
		action : 'main_new',
		header : this.current['header'],
		thumbLayout : this.current['thumb_layout']
	});

	this.requestMediaData();

	this.breadcrumbs.push(this.current);
}

exports.setMaxId = function(paginationParam) {
	if (undefined !== paginationParam) {
		this.loading = false;
		this.current['max_id'] = paginationParam['next_max_id'];
	}
	return this.current['max_id'];
}

exports.loadMore = function() {
	if (undefined !== this.current['max_id'])
		this.requestMediaData();
}

exports.requestUserData = function() {
	if (null !== this.current['identifier']) {
		Ti.App.fireEvent('instagram', {
			action : 'get_user',
			identifier : this.current['identifier']
		});
	}
}

exports.requestMediaData = function() {
	switch(this.current['action']) {
		case 'popular':
			if (!this.loading) {
				this.loading = true;
				Ti.App.fireEvent('instagram', {
					action : 'get_media_popular'
				});
			}
			break;
		case 'feed':
			if (!this.loading) {
				this.loading = true;
				Ti.App.fireEvent('instagram', {
					action : 'get_user_media_feed',
					max_id : this.current['max_id']
				});
			}
			break;
		case 'profile':
			if (!this.loading) {
				this.loading = true;
				Ti.App.fireEvent('instagram', {
					action : 'get_user_media_recent',
					identifier : this.current['identifier'],
					max_id : this.current['max_id']
				});
			}
			break;
	}
}

exports.isResponseExpected = function(endpointParam, identifierParam) {
	var expected = false;

	var actionEndpointMapper = {};
	actionEndpointMapper['popular'] = {media_popular : true};
	actionEndpointMapper['feed'] = {users_self_feed : true};
	actionEndpointMapper['profile'] = {users : true, users_id_media_recent : true};

	if (actionEndpointMapper[this.current['action']][endpointParam])
		if (identifierParam === this.current['identifier'])
			expected = true;

	return expected;
}
