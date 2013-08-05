exports.setSession = function(sessionParam) {
	this.session = sessionParam;
};

exports.getUser = function(idParam) {
	var params = {};
	if (undefined !== this.session['access_token'])
		params['access_token'] = this.session['access_token'];

	httpGet('users/' + idParam, params, 'users', idParam);
};

exports.getUserMediaFeed = function(maxIdParam) {
	var params = {};
	if (undefined !== this.session['access_token'])
		params['access_token'] = this.session['access_token'];
	if (undefined !== maxIdParam)
		params['max_id'] = maxIdParam;
	params['count'] = 50;

	httpGet('users/self/feed', params, 'users_self_feed', null);
};

exports.getUserMediaRecent = function(idParam, maxIdParam) {
	var params = {};
	if (undefined !== this.session['access_token'])
		params['access_token'] = this.session['access_token'];
	if (undefined !== maxIdParam)
		params['max_id'] = maxIdParam;
	params['count'] = 50;

	httpGet('users/' + idParam + '/media/recent', params, 'users_id_media_recent', idParam);
};

exports.getMediaSearch = function(latParam, lngParam, maxTimestampParam) {
	var params = {};
	if (undefined !== this.session['access_token'])
		params['access_token'] = this.session['access_token'];
	if (undefined !== maxTimestampParam)
		params['max_timestamp'] = maxTimestampParam;
	params['lat'] = latParam;
	params['lng'] = lngParam;

	httpGet('media/search', params, 'media_search', null);
}

exports.getMediaPopular = function() {
	var params = {};
	if (undefined !== this.session['access_token'])
		params['access_token'] = this.session['access_token'];
	params['count'] = 50;

	httpGet('media/popular', params, 'media_popular', null);
};

function httpGet(pathParam, paramsParam, endpointParam, identifierParam) {
	var httpClient = Ti.Network.createHTTPClient();
	var params = '?';

	httpClient.onload = function(e) {
		httpGetHandler(pathParam, paramsParam, JSON.parse(this.responseText), endpointParam, identifierParam);
	}

	httpClient.timeout = Alloy.CFG.ig_timeout;

	httpClient.onerror = function(e) {
		httpErrorHandler('GET', pathParam, paramsParam, this.responseText, endpointParam, identifierParam);
	}
	for (var key in paramsParam) {
		params += '&' + key + '=' + paramsParam[key];
	}

	httpClient.open('GET', Alloy.CFG.ig_endpoint + pathParam + params);

	httpClient.send();
};

function httpGetHandler(pathParam, paramsParam, responseParam, endpointParam, identifierParam) {
	switch(endpointParam) {
		case 'users':
			Ti.App.fireEvent('ui', {
				action : 'header_append_data',
				endpoint : endpointParam,
				identifier : identifierParam,
				data : responseParam['data']
			});
			break;
		case 'media_search':
			if (0 < responseParam['data'].length) {
				responseParam['pagination'] = {};
				responseParam['pagination']['max_timestamp'] = responseParam['data'][responseParam['data'].length-1]['created_time'];
			}
		case 'users_self_feed':
		case 'users_id_media_recent':
		case 'media_popular':
			Ti.App.fireEvent('ui', {
				action : 'container_append_data',
				endpoint : endpointParam,
				identifier : identifierParam,
				pagination : responseParam['pagination'],
				data : responseParam['data']
			});
			break;
	}

	Ti.API.info('Path: ' + pathParam);
	Ti.API.info('Params: ' + paramsParam);
	Ti.API.info('Response: ' + JSON.stringify(responseParam));
};

function httpErrorHandler(methodParam, pathParam, paramsParam, responseParam, endpointParam, identifierParam) {
	try {
		responseParam = JSON.parse(responseParam);
		alert("Instagram says: " + responseParam['meta']['error_message']);
	} catch (e) {
	}

	Ti.API.info('Method: ' + methodParam);
	Ti.API.info('Path: ' + pathParam);
	Ti.API.info('Params: ' + JSON.stringify(paramsParam));
	Ti.API.info('Response: ' + responseParam);
};