var defaults = {
	'showColors': undefined,
	'showContracts': undefined,
	'fba': undefined,
	'ffl': undefined,

	'ffl-contracts': 'true',
	'ffl-colors': 'true',
	'ffl-data': null,
	'ffl-last-fetched': null,

	'fba-contracts': 'true',
	'fba-colors': 'true',
	'fba-data': null,
	'fba-last-fetched': null
};

Object.keys(defaults).forEach(function(key) {
	if (defaults[key] === undefined) {
		delete localStorage[key];
	}
	else {
		if (localStorage[key] === undefined) {
			localStorage[key] = defaults[key];
		}
	}
});

function fetchDynastyData(context, callback) {
	if (needsNewData(context)) {
		//console.log('fetching new ' + context + ' data');
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(data) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var data = xhr.responseText;

					localStorage[context + '-last-fetched'] = (new Date()).toString();
					localStorage[context + '-data'] = data;

					callback(data);
				}
				else {
					callback(null);
				}
			}
		};

		var url = '';

		if (context == 'ffl') {
			url = 'http://thedynastyleague.com/data/data.xml?_=' + Math.random();
		}
		else if (context == 'fba') {
			url = 'http://thedynastyleague.com/data/colbys.xml?_=' + Math.random();
		}

		xhr.open('GET', url, true);
		xhr.send();
	}
	else {
		//console.log('using cached ' + context + ' data');
		callback(localStorage[context + '-data']);
	}
};

function onMessage(request, sender, callback) {
	if (request.action == 'fetchDynastyData') {
		fetchDynastyData(request.context, callback);
	}
	else if (request.action == 'retrieveColorSetting') {
		callback({ showColors: localStorage[request.context + '-colors'] } );
	}
	else if (request.action == 'storeColorSetting') {
		localStorage[request.context + '-colors'] = request.value;
	}
	else if (request.action == 'retrieveContractSetting') {
		callback({ showContracts: localStorage[request.context + '-contracts'] });
	}
	else if (request.action == 'storeContractSetting') {
		localStorage[request.context + '-contracts'] = request.value;
	}

	return true;
};

function needsNewData(context) {
	if (localStorage[context + '-last-fetched']) {
		var now = new Date();
		var lastFetched = new Date(localStorage[context + '-last-fetched']);

		if (now - lastFetched < 300000 && localStorage[context + '-data'] != null) {
			return false;
		}
	}

	return true;
}

chrome.runtime.onMessage.addListener(onMessage);
