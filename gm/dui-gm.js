// ==UserScript==
// @name           Dynasty
// @namespace      http://coinflipper.org/
// @description    Dynasty league stuff
// @include        http://games.espn.go.com/ffl/boxscore?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/boxscorefull?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/boxscorequick?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/boxscorescoring?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/clubhouse?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/dropplayers?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/freeagency?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/leaders?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/leaguerosters?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/rosterfix?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/tools/keeperselect?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/tools/lmtradereview?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/trade?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/tradereview?*leagueId=122885*
// @include        http://games.espn.go.com/ffl/watchlist?*leagueId=122885*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// ==/UserScript==

(
	function() {
		var version = 0.036;

		var currentYear = 2011;
		var positionColors = {
			"QB":"rgb(215, 235, 255)",
			"RB":"Azure",
			"WR":"LightGoldenRodYellow",
			"TE":"rgb(220, 255, 220)",
			"DE":"SeaShell",
			"DT":"SeaShell",
			"LB":"SeaShell",
			"CB":"SeaShell",
			"DL":"SeaShell",
			"DB":"SeaShell",
			"S":"SeaShell",
			//"K":"PapayaWhip"
			"K":"rgb(245, 245, 245)"
		};
		var teamAbbreviations = new Array(
			"Ari", "Atl", "Bal", "Buf",
			"Car", "Chi", "Cin", "Cle",
			"Dal", "Den", "Det", "GB",
			"Hou", "Ind", "Jac", "KC",
			"Mia", "Min", "NE", "NO",
			"NYG", "NYJ", "Oak", "Phi",
			"Pit", "SD", "Sea", "SF",
			"Stl", "TB", "Ten", "Was",
			"FA"
		);

		var showColors = (GM_getValue("dui_showColors") == null) || GM_getValue("dui_showColors");
		var switchAdded = false;

		var positions = new Array();
		var salaries = new Array();
		var starts = new Array();
		var ends = new Array();

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
			$("table.playerTableTable").each(function() {
				var playerTableParent = $(this).parent();
				var realPlayerTable = $(this).detach();

				if (showColors) {
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
				else {
					realPlayerTable.find("[id^=playername]").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", "");
				}

				playerTableParent.prepend(realPlayerTable);
			});
		}

		function toggleShowColors() {
			showColors = !showColors;
			GM_setValue("dui_showColors", showColors);

			setColors();
		}

		function addColorSwitch() {
			if (!switchAdded) {
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
				switchAdded = true;
			}
		}

		function duiGo() {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://thedynastyleague.com/dynastyData.xml?nocache=" + Math.random(),
				onload:
					function (responseDetails) {
						var parser = new DOMParser();
						var xmlstuff = parser.parseFromString(responseDetails.responseText, "text/xml");

						var latestVersionString = xmlstuff.getElementsByTagName("version")[0].firstChild.nodeValue;
						var latestVersionFloat = parseFloat(latestVersionString);

						if (version < latestVersionFloat) {
							var upgrade = confirm("There's a newer version of DUI available.\nWould you like to upgrade to the latest version?");

							if (upgrade) {
								window.location = "http://thedynastyleague.com/dui/dui-stable.user.js";
							}
						}

						$("div#playerTableHeader li").bind("click", duiGo);
						$("ul.lineupsNav li.lineupsNavItemOff div").bind("click", duiGo);
						$("td.playertableStat a").bind("click", duiGo);
						$("tr.tableSubHead td.playertableData a").bind("click", duiGo);
						$("div.paginationNav a").bind("click", duiGo);
						$("ul.filterToolsOptionSet li a").bind("click", duiGo);

						addColorSwitch();
						setColors();

						// set up maps of player IDs to salaries and player IDs to contracts
						var draftedXml = xmlstuff.getElementsByTagName("drafted");
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
								var salaryDisplay, contractDisplay, contractTip;
								var salary, term, finalYear, inYear, yearsLeft, contractTip;

								if (salaries[playerId] > 0) {
									salaryDisplay = "<strong>$" + salaries[playerId] + "</strong>";
									salary = salaries[playerId];
								}
								else {
									salaryDisplay = "<em>Free Agent</em>";
								}

								//if (starts[playerId] == null || starts[playerId] == "FA" || ends[playerId] == null) {
								if (salaries[playerId] == null || salaries[playerId] == 0) {
									contractDisplay = "";
									contractTip = "This player is currently a free agent.";
								}
								else {
									contractDisplay = " - ";
									contractTip = "";

									if (ends[playerId] != "Not Yet Signed") {
										var startYear = starts[playerId];
										var endYear = ends[playerId];

										finalYear = endYear;

										if (startYear == "FA") {
											startYear = endYear;
											finalYear = "RFA";
										}

										inYear = currentYear - startYear + 1;
										contractYears = endYear - startYear + 1;

										contractDisplay += finalYear + " <em>(" + inYear + "/" + contractYears + ")</em>";

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
									else {
										contractDisplay += "<em>Not Yet Signed</em>";
										contractTip = "This player has not yet signed with his team.";
									}
								}

								$("#" + this.id)
								.append(
									$("<div />")
									.append(salaryDisplay)
									.append(contractDisplay)
									.attr("title", contractTip)
								);

								//$("td#" + this.id).parent().css("background-color", positionColors[positions[playerId]]);
							}
						);
					}
			});
		}

		jQuery(document).ready(duiGo);
	}
)();
