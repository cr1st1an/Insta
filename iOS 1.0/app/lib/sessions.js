exports.loadSessions = function() {
	this.pool = JSON.parse(Ti.App.Properties.getString('module.sessions.pool', '{}'));
	this.current = Ti.App.Properties.getInt('module.sessions.current', 0);
}

exports.saveSessions = function() {
	Ti.App.Properties.setString('module.sessions.pool', JSON.stringify(this.pool));
	Ti.App.Properties.setInt('module.sessions.current', this.current);

	this.pool = JSON.parse(Ti.App.Properties.getString('module.sessions.pool', '{}'));
	this.current = Ti.App.Properties.getInt('module.sessions.current', 0);
}

exports.setCurrentUser = function(userDataParam, accessTokenParam) {
	if (undefined === this.pool[userDataParam['id']])
		this.pool[userDataParam['id']] = {};

	for (var key in userDataParam) {
		this.pool[userDataParam['id']][key] = userDataParam[key];
	}

	this.pool[userDataParam['id']]['access_token'] = accessTokenParam;
	this.current = userDataParam['id'];
	
	this.saveSessions();
}

exports.setCurrentEmail = function(emailParam) {
	if(undefined !== this.pool[this.current]){
		this.pool[this.current]['email']  = emailParam;
		this.saveSessions();
	}
}

exports.setCurrentVerified = function(verifiedParam) {
	if(undefined !== this.pool[this.current]){
		this.pool[this.current]['verified']  = verifiedParam;
		this.saveSessions();
	}
}

exports.getCurrent = function() {
	Ti.API.info(JSON.stringify(this.pool[this.current]));
	return this.pool[this.current];
}

exports.delCurrent = function() {
	if(undefined !== this.pool[this.current]){
		this.pool[this.current] = undefined;
		this.saveSessions();
	}
}
