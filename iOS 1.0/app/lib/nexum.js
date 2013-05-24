exports.setSession = function(sessionParam) {
	this.session = sessionParam;
}

exports.postSession = function(codeParam) {
	httpPost('sessions', {
		id_install : Ti.Platform.id,
		client : Ti.App.id,
		version : Ti.App.version,
		code : codeParam
	});
};

exports.postEmail = function(emailParam) {
	httpPost('subscribers/email', {
		access_token : this.session['access_token'],
		email : emailParam
	});
};

exports.postInvite = function(inviteParam) {
	httpPost('subscribers/invite', {
		access_token : this.session['access_token'],
		invite : inviteParam
	});
};

function httpPost(pathParam, paramsParam) {
	var httpClient = Ti.Network.createHTTPClient();

	httpClient.onload = function(e) {
		httpPostHandler(pathParam, paramsParam, JSON.parse(this.responseText));
	}

	httpClient.timeout = Alloy.CFG.nx_timeout;

	httpClient.onerror = function(e) {
		httpErrorHandler('POST', pathParam, paramsParam, this.responseText);
	}

	httpClient.open('POST', Alloy.CFG.nx_endpoint + pathParam);

	httpClient.send(paramsParam);
};

function httpPostHandler(pathParam, paramsParam, responseParam) {
	if (responseParam['success']) {
		switch(pathParam) {
			case 'sessions':
				Ti.App.fireEvent('sessions', {
					action : 'set_current',
					accessToken : responseParam['access_token'],
					userData : responseParam['user_data']
				});
				if (undefined === responseParam['trigger']) {
					Ti.App.fireEvent('ui', {
						action : 'login_verified'
					});
				}
				break;
			case 'subscribers/email':
				Ti.App.fireEvent('ui', {
					action : 'login_save_email'
				});
				break;
			case 'subscribers/invite':
				Ti.App.fireEvent('sessions', {
					action : 'set_current_verified',
					verified : true
				});
				Ti.App.fireEvent('ui', {
					action : 'login_save_invite'
				});
				break;
		}
	} else {
		switch(pathParam) {
			case 'subscribers/email':
				Ti.App.fireEvent('ui', {
					action : 'login_wrong_email'
				});
				break;
			case 'subscribers/invite':
				Ti.App.fireEvent('ui', {
					action : 'login_wrong_invite'
				});
				break;
			default:
				alert('[ERROR] ' + responseParam['message']);
				break;
		}
	}

	switch(responseParam['trigger']) {
		case 'no_code':
			Ti.App.fireEvent('ui', {
				action : 'login_no_code'
			});
			break;
		case 'no_email':
			Ti.App.fireEvent('ui', {
				action : 'login_no_email'
			});
			break;
	}

	Ti.API.info('Path: ' + pathParam);
	Ti.API.info('Params: ' + paramsParam);
	Ti.API.info('Response: ' + responseParam);
};

function httpErrorHandler(methodParam, pathParam, paramsParam, responseParam) {
	Ti.API.info('Method: ' + methodParam);
	Ti.API.info('Path: ' + pathParam);
	Ti.API.info('Params: ' + JSON.stringify(paramsParam));
	Ti.API.info('Response: ' + responseParam);
};