$(document).ready(function() {
	setColors();
});

var showColors = true;
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
	console.log("Setting up the player table colors.");

	if (showColors) {
		$("[id^=playername]:contains('\u00a0S')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["S"]);
		$("[id^=playername]:contains('\u00a0QB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["QB"]);
		$("[id^=playername]:contains('\u00a0RB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["RB"]);
		$("[id^=playername]:contains('\u00a0WR')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["WR"]);
		$("[id^=playername]:contains('\u00a0TE')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["TE"]);
		$("[id^=playername]:contains('\u00a0DE')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["DE"]);
		$("[id^=playername]:contains('\u00a0DT')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["DT"]);
		$("[id^=playername]:contains('\u00a0LB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["LB"]);
		$("[id^=playername]:contains('\u00a0CB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["CB"]);
		$(generateSelectors("K")).parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["K"]);
	}
	else {
		$("[id^=playername]").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", "");
	}
}