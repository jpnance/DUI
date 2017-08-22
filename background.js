if (localStorage["showColors"] == null) {
	localStorage["showColors"] = true;
}

if (localStorage["showContracts"] == null) {
	localStorage["showContracts"] = true;
}

function fetchDynastyData(callback) {
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

	var url = "http://thedynastyleague.com/data/data.xml?_=" + Math.random();
	xhr.open("GET", url, true);
	xhr.send();
};

function onMessage(request, sender, callback) {
	if (request.action == "fetchDynastyData") {
		fetchDynastyData(callback);
	}
	else if (request.action == "retrieveColorSetting") {
		callback({ "showColors": localStorage["showColors"] });
	}
	else if (request.action == "storeColorSetting") {
		localStorage["showColors"] = request.value;
	}
	else if (request.action == "retrieveContractSetting") {
		callback({ "showContracts": localStorage["showContracts"] });
	}
	else if (request.action == "storeContractSetting") {
		localStorage["showContracts"] = request.value;
	}

	return true;
};

chrome.runtime.onMessage.addListener(onMessage);
