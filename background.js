['showColors', 'showContracts', 'fba', 'ffl'].forEach(function(key) {
	if (localStorage[key] != null) {
		delete localStorage[key];
	}
});

['ffl-contracts', 'ffl-colors', 'fba-contracts', 'fba-colors'].forEach(function(key) {
	if (localStorage[key] == null) {
		localStorage[key] = 'true';
	}
});

function fetchDynastyData(context, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var data = xhr.responseText;
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

chrome.runtime.onMessage.addListener(onMessage);
