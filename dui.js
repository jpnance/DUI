var context = window.location.pathname.split('/')[1];
var contextualUris = {
	ffl: {
		owners: 'http://games.espn.com/ffl/leaguesetup/ownerinfo?leagueId=122885'
	},
	fba: {
		owners: 'http://games.espn.com/fba/leaguesetup/ownerinfo?leagueId=119576'
	}
};

var switchAdded = {
	colors: false,
	contracts: false
};

var positionColors = {
		"QB": "rgb(215, 235, 255)",
		"RB": "Azure",
		"WR": "LightGoldenRodYellow",
		"TE": "rgb(220, 255, 220)",
		"DE": "SeaShell",
		"DT": "SeaShell",
		"LB": "SeaShell",
		"CB": "SeaShell",
		"DL": "SeaShell",
		"DB": "SeaShell",
		"S":" SeaShell",
		"K": "rgb(245, 245, 245)"
};
var teamAbbreviations = new Array(
		"Ari", "Atl", "Bal", "Buf",
		"Car", "Chi", "Cin", "Cle",
		"Dal", "Den", "Det", "GB",
		"Hou", "Ind", "Jax", "KC",
		"LAC", "LAR", "Mia", "Min",
		"NE", "NO", "NYG", "NYJ",
		"Oak", "Phi", "Pit", "Sea",
		"SF", "TB", "Ten", "Wsh",
		"FA", "StL", "Jac", "LA",
		"SD"
);

var positions = new Array();
var salaries = new Array();
var starts = new Array();
var ends = new Array();

var fetchDataForPathnames = [
	'/' + context + '/boxscore',
	'/' + context + '/boxscorefull',
	'/' + context + '/boxscorequick',
	'/' + context + '/boxscorescoring',
	'/' + context + '/clubhouse',
	'/' + context + '/dropplayers',
	'/' + context + '/freeagency',
	'/' + context + '/leaders',
	'/' + context + '/leaguerosters',
	'/' + context + '/rosterfix',
	'/' + context + '/tools/keeperselect',
	'/' + context + '/tools/lmtradereview',
	'/' + context + '/tools/waiverorder',
	'/' + context + '/trade',
	'/' + context + '/tradereview',
	'/' + context + '/watchlist'
];

var showColors = getColorSetting();
var showContracts = getContractSetting();

if ($.inArray(window.location.pathname, fetchDataForPathnames) != -1) {
	$(document).ready(loadDynastyData);
}

$(document).ready(loadOwners);
$(document).ready(function() {
	var loadableSelectors = 'div#playerTableHeader ul li a, ul.lineupsNav li.lineupsNavItemOff div, td.playertableStat a, tr.tableSubHead td.playertableData a, div.paginationNav a, ul.filterToolsOptionSet li a, div.games-dates-mod ul li a, div.playertablefiltersmenucontainer a';
	$('body').on('click', loadableSelectors, loadDynastyData);

	$("input[id^=budget]").css("width", "40px");

	$('a.flexpop[playerid]').each(function(i, e) {
		var $this = $(e);
		var playerId = $this.attr('playerid');

		if (context == 'ffl') {
			$this.attr('href', 'http://www.espn.com/nfl/players/profile?playerId=' + playerId);
		}
	});
});

function onDynastyData(data) {
	var interval = setInterval(function() {
		if (data && ($('span#playerTableTabSpinner').length == 0 || $('span#playerTableTabSpinner').css('display') == 'none')) {
			clearInterval(interval);

			//console.log("Setting up the player table data.");

			var parser = new DOMParser();
			var parsedXml = parser.parseFromString(data, "text/xml");

			var currentYear = parseInt(parsedXml.getElementsByTagName("season")[0].firstChild.nodeValue);

			addColorSwitch();
			setColors();

			addContractSwitch();
			setContracts();

			// set up maps of player IDs to salaries and player IDs to contracts
			var draftedXml = parsedXml.getElementsByTagName("drafted");
			if (draftedXml != null) {
				var players = draftedXml[0].getElementsByTagName("player");

				var playerId, contract, salary, start, end;

				for (var i = 0; i < players.length; i++) {
					playerId = null;
					contract = null;
					salary = null;
					start = null;
					end = null;

					playerIdNode = players[i].getElementsByTagName("id");

					if (playerIdNode.length > 0) {
						playerId = playerIdNode[0].firstChild.nodeValue;

						positionNode = players[i].getElementsByTagName("position");
						contractNode = players[i].getElementsByTagName("contract");

						if (positionNode.length > 0) {
							position = positionNode[0].firstChild.nodeValue;
							positions[playerId] = position;
						}

						if (contractNode.length > 0) {
							salaryNode = contractNode[0].getElementsByTagName("salary");
							startNode = contractNode[0].getElementsByTagName("start");
							endNode = contractNode[0].getElementsByTagName("end");

							if (salaryNode.length > 0) { salary = salaryNode[0].firstChild.nodeValue; }
							if (startNode.length > 0) { start = startNode[0].firstChild.nodeValue; }
							if (endNode.length > 0) { end = endNode[0].firstChild.nodeValue; }

							salaries[playerId] = salary;
							starts[playerId] = start;
							ends[playerId] = end;
						}
					}
				}
			}

			$("*[id^=playername]").each(
				function() {
					var playerId = this.id.match(/playername_(\d+)/)[1];
					var salaryDisplay, separatorString, contractDisplay, contractTip;
					var $salaryElement, $contractElement;
					var salary, term, finalYear, inYear, yearsLeft, contractTip;

					if (salaries[playerId] > 0) {
						$salaryElement = $("<strong>").text("$" + salaries[playerId]);
						salary = salaries[playerId];
					}
					else {
						$salaryElement = $("<em>").text('Free Agent');
					}

					if (salaries[playerId] == null || salaries[playerId] == 0) {
						contractTip = "This player is currently a free agent.";
					}
					else {
						separatorString = " - ";
						contractTip = "";

						if (ends[playerId] != "Not Yet Signed") {
							var startYear = starts[playerId];
							var endYear = ends[playerId];

							finalYear = endYear;

							if (startYear == "FA") {
								if (context == 'ffl') {
									startYear = endYear;
									finalYear = "RFA";
								}
								else if (context == 'fba') {
									startYear = endYear;
									finalYear = 'UFA';
								}
							}

							inYear = currentYear - startYear + 1;
							contractYears = endYear - startYear + 1;

							$yearsElement = $("<em>").text("(" + inYear + "/" + contractYears + ")");
							$contractElement = $("<span>").text(finalYear + " ").append($yearsElement);

							if (context == 'ffl') {
								var tempSalary = salary;
								var forYear = currentYear;
								contractTip = "Relief: ";

								for (var i = inYear; i <= contractYears; i++) {
									tempSalary = salary - Math.ceil(salary * (0.6 / Math.pow(2, i - 1)));
									forYear = currentYear + i - inYear;
									contractTip += "$" + tempSalary + " in " + forYear;

									if (contractYears > i) {
										contractTip += ", ";
									}
								}
							}
							else if (context == 'fba') {
								if (endYear > startYear) {
									contractTip = 'This player will be a restricted free agent at the end of his contract.';
								}
								else {
									contractTip = 'This player will be an unrestricted free agent at the end of his contract.';
								}
							}
						}
						else {
							$contractElement = $("<em>").text("Not Yet Signed");
							contractTip = "This player has not yet signed with his team.";
						}
					}

					$("#" + this.id).append(
						$("<div />")
						.append($salaryElement)
						.append(separatorString)
						.append($contractElement)
						.attr("title", contractTip)
						.addClass("contract")
					);
				}
			);
		}
		else {
			//console.log("Unable to fetch Dynasty League data.");
		}
	}, 10);
}

function toggleShowColors() {
	showColors = !showColors;

	saveColorSetting();
	setColors();
}

function toggleShowContracts() {
	showContracts = !showContracts;

	saveContractSetting();
	setContracts();
}

function addColorSwitch() {
	if (!switchAdded.colors) {
		var list = $("#games-subnav-links");
		var dropDown = $("ul.games-subnav-drop:last");
		var appendee;

		if (dropDown.length > 0) {
			appendee = dropDown;
		}
		else {
			appendee = list;
		}

		appendee
		.append(
			$("<li />")
			.append(
				$("<a />")
				.text("Toggle Colors")
				.css("cursor", "pointer")
			)
			.addClass("drop-item")
			.click(toggleShowColors)
		);
		switchAdded.colors = true;
	}
}

function addContractSwitch() {
	if (!switchAdded.contracts) {
		var list = $("#games-subnav-links");
		var dropDown = $("ul.games-subnav-drop:last");
		var appendee;

		if (dropDown.length > 0) {
			appendee = dropDown;
		}
		else {
			appendee = list;
		}

		appendee
		.append(
			$("<li />")
			.append(
				$("<a />")
				.text("Toggle Contracts")
				.css("cursor", "pointer")
			)
			.addClass("drop-item")
			.click(toggleShowContracts)
		);
		switchAdded.contracts = true;
	}
}

function generateSelectors(pos) {
	var selectorString = "";
	for (var i = 0; i < teamAbbreviations.length; i++) {
		selectorString += "td[id^=playername]:contains('" + teamAbbreviations[i] + "\u00a0" + pos + "')";

		if (i < teamAbbreviations.length - 1) {
			selectorString += ", ";
		}
	}

	return selectorString;
}

function setColors() {
	//console.log("Setting up the player table colors.");

	$("table.playerTableTable").each(function() {
		var realPlayerTable = $(this);

		if (showColors) {
			if (context == 'ffl') {
				realPlayerTable.find("[id^=playername]:contains('\u00a0S')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["S"]);
				realPlayerTable.find("[id^=playername]:contains('\u00a0QB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["QB"]);
				realPlayerTable.find("[id^=playername]:contains('\u00a0RB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["RB"]);
				realPlayerTable.find("[id^=playername]:contains('\u00a0WR')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["WR"]);
				realPlayerTable.find("[id^=playername]:contains('\u00a0TE')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["TE"]);
				realPlayerTable.find("[id^=playername]:contains('\u00a0DE')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["DE"]);
				realPlayerTable.find("[id^=playername]:contains('\u00a0DT')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["DT"]);
				realPlayerTable.find("[id^=playername]:contains('\u00a0LB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["LB"]);
				realPlayerTable.find("[id^=playername]:contains('\u00a0CB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["CB"]);
				realPlayerTable.find(generateSelectors("K")).parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["K"]);
			}
			else if (context == 'fba') {
				realPlayerTable.find("span[title=Out]").parent().parent().children("td[class!=sectionLeadingSpacer]").css("background-color", "#ffd6cc");
			}
		}
		else {
			realPlayerTable.find("[id^=playername]").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", "");
		}
	});
}

function setContracts() {
	if (showContracts) {
		$("body style#dui").remove();
	}
	else {
		$("body").append("<style id='dui' type='text/css'>.contract { display: none; }");
	}
}

function loadOwners() {
	//console.log("Setting up the owner drop-down menu.");

	$.get(contextualUris[context].owners, function(data) {
		var owners = [];

		$(data).find("tr.ownerRow").each(function(i, e) {
			var $row = $(e);
			var teamId = parseInt(e.id.split("-")[0]) - 1;
			var ownerName = $row.find("td span[id^=ownerspan]").text();

			if (!owners[teamId]) {
				owners[teamId] = [];
			}

			if (ownerName != "") {
				owners[teamId].push(ownerName);
			}
		});

		$("ul#games-tabs1 li a").each(function(i, e) {
			var $a = $(e);
			var href = $a.attr("href");

			var teamIdMatch = href.match(/teamId=(\d\d?)/);
			var teamId = parseInt(teamIdMatch[1]) - 1;

			var ownersString = owners[teamId][0];

			if (owners[teamId].length == 2) {
				ownersString += ", " + owners[teamId][1];
			}

			var $ownersElement = $("<span style='font-size: 10px; font-weight: normal;'>").text(ownersString);
			$a.append("<br />").append($ownersElement);
		});
	});
}

function getColorSetting() {
	chrome.runtime.sendMessage({ "action": "retrieveColorSetting", "context": context }, syncColorSetting);
}

function saveColorSetting() {
	chrome.runtime.sendMessage({ "action": "storeColorSetting", "context": context, "value": showColors });
}

function syncColorSetting(response) {
	showColors = (response.showColors == "true");
}

function getContractSetting() {
	chrome.runtime.sendMessage({ "action": "retrieveContractSetting", "context": context }, syncContractSetting);
}

function saveContractSetting() {
	chrome.runtime.sendMessage({ "action": "storeContractSetting", "context": context, "value": showContracts });
}

function syncContractSetting(response) {
	showContracts = (response.showContracts == "true");
}

function loadDynastyData() {
	chrome.runtime.sendMessage({ "action": "fetchDynastyData", "context": context }, onDynastyData);
}
