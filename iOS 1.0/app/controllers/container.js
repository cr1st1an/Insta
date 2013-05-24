var buffers = [];
var current_buffer = 0;
var buffer_index;
var thumbs = [];
var thumbLayout = null;

newBuffer();

$.container.setThumbLayout = function(thumbLayoutParam) {
	$.container.thumbLayout = thumbLayoutParam;
}

$.container.appendData = function(dataParam, endParam) {

	for (var i in dataParam) {
		thumbs[i] = Alloy.createController($.container.thumbLayout).getView();
		dataParam[i]['time_ago'] = timeAgo(dataParam[i]['created_time']);
		thumbs[i].updateData(dataParam[i]);
		buffers[current_buffer].add(thumbs[i]);
		buffers[current_buffer].items++;

		buffer_index++;

		if (12 === buffer_index) {
			$.container.add(buffers[current_buffer++]);
			newBuffer();
		}
	}

	if (endParam) {
		$.container.add(buffers[current_buffer]);
	}
	
	$.container.fireEvent('orientationChange');
};

function newBuffer() {
	buffers[current_buffer] = Ti.UI.createView({
		width : Ti.Platform.displayCaps.platformWidth,
		top : -1232,
		height : 1232,
		layout : 'horizontal',
		items : 0
	});
	buffer_index = 0;
};

function timeAgo(createdTimeParam) {
	var date= new Date(parseInt(createdTimeParam) * 1000);
	
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return interval + "y ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " mo ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + "d ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + "h ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + "m ago";
    }
    return Math.floor(seconds) + "s ago";
}

$.container.addEventListener('orientationChange', function(e) {
	if (undefined !== thumbs[0]) {
		var columns = 0;
		if (Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight) {
			columns = 3;
		} else {
			columns = 4;
		}
		
		for (var i in buffers) {
			buffers[i].top = (((12 / columns) * thumbs[0].height) * i);
			buffers[i].width = Ti.Platform.displayCaps.platformWidth;
			buffers[i].height = (Math.ceil(buffers[i].items / columns) * thumbs[0].height);
		}
	}
});
