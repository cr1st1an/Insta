exports.setRoot = function(titleParam, headerParam, sourceParam, identifierParam, thumbLayoutParam) {
	this.breadcrumbs = [];

	if (undefined === this.current) {
		this.current = {};
	}

	this.setPage(titleParam, headerParam, sourceParam, identifierParam, thumbLayoutParam);
}

exports.setPage = function(titleParam, headerParam, sourceParam, identifierParam, thumbLayoutParam) {
	this.loading = false;

	if (headerParam === this.current['header'] && identifierParam === this.current['identifier']) {
		Ti.App.fireEvent('ui', {
			action : 'main_new_container',
			thumbLayout : thumbLayoutParam
		});
	} else {
		Ti.App.fireEvent('ui', {
			action : 'main_new',
			header : headerParam,
			thumbLayout : thumbLayoutParam
		});
	}

	this.current = {};
	this.current['title'] = titleParam;
	this.current['header'] = headerParam;
	this.current['source'] = sourceParam;
	this.current['identifier'] = identifierParam;
	this.current['thumb_layout'] = thumbLayoutParam;
	this.current['max'] = undefined;

	Ti.App.fireEvent('ui', {
		action : 'navbar_set_title',
		title : titleParam
	});

	this.requestMediaData();

	this.breadcrumbs.push(this.current);
}

exports.setMax = function(paginationParam) {
	if (undefined !== paginationParam) {
		this.loading = false;
		if (undefined !== paginationParam['next_max_id'])
			this.current['max'] = paginationParam['next_max_id'];
		else if (undefined !== paginationParam['max_timestamp'])
			this.current['max'] = paginationParam['max_timestamp'];
		else
			this.current['max'] = undefined;
	}
	return this.current['max'];
}

exports.getMaxHACK = function(){
	return this.current['max'];
}

exports.loadMore = function() {
	if (undefined !== this.current['max'])
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
	switch(this.current['source']) {
		case 'feed':
			if (!this.loading) {
				this.loading = true;
				Ti.App.fireEvent('instagram', {
					action : 'get_user_media_feed',
					max_id : this.current['max']
				});
			}
			break;
		case 'near':
			if (!this.loading) {
				this.loading = true;

				Ti.Geolocation.purpose = 'to find photos near you';
				Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
				Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

				Ti.Geolocation.getCurrentPosition(function(e) {
					if (e.success) {
						/*
						 this.latitude = e.coords.latitude;
						 this.longitude = e.coords.longitude;
						 this.hor = e.coords.accuracy;
						 this.ver = e.coords.altitudeAccuracy;
						 */
					} else {
						Ti.Geolocation.restart();
					}

					if (0 !== e.coords.latitude && 0 !== e.coords.longitude) {
						Ti.App.fireEvent('instagram', {
							action : 'get_media_search',
							lat : e.coords.latitude,
							lng : e.coords.longitude
						});
					} else {
						this.loading = false;
					}
				});
			}
			break;
		case 'profile':
			if (!this.loading) {
				this.loading = true;
				Ti.App.fireEvent('instagram', {
					action : 'get_user_media_recent',
					identifier : this.current['identifier'],
					max_id : this.current['max']
				});
			}
			break;
		case 'popular':
			if (!this.loading) {
				this.loading = true;
				Ti.App.fireEvent('instagram', {
					action : 'get_media_popular'
				});
			}
			break;
	}
}

exports.isResponseExpected = function(endpointParam, identifierParam) {
	var expected = false;
	var sourceEndpointMapper = {};
	sourceEndpointMapper['feed'] = {
		users_self_feed : true
	};
	sourceEndpointMapper['near'] = {
		media_search : true
	};
	sourceEndpointMapper['profile'] = {
		users : true,
		users_id_media_recent : true
	};
	sourceEndpointMapper['popular'] = {
		media_popular : true
	};

	if (sourceEndpointMapper[this.current['source']][endpointParam])
		if (identifierParam === this.current['identifier'])
			expected = true;

	return expected;
}
