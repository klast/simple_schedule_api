function hasClass(elem, clName){
	if (elem != null) {
		return (" " + elem.className + " " ).indexOf( " "+clName+" " ) > -1;
	} else {return false;}
}

//adds class to a specified element
function addClassByRef(elem, clName){
	if (elem != null) {
		if (elem.className == null || elem.className =="") {
			elem.className = clName;
		} else if (!(hasClass(elem, clName))){
			elem.className = elem.className + " " + clName;
		}
	}
}

//removes class from a specified element
function removeClassByRef(elem, clName){
	if (elem != null) {
		
		if (hasClass(elem, clName)) {	//checks if class exists
			newClassName = elem.className;
			newClassName = newClassName.replace(" " + clName, "");
			newClassName = newClassName.replace(clName + " ", "");
			newClassName = newClassName.replace(clName, "");
			if (newClassName == "") {
				elem.removeAttribute("class");
			} else {
				elem.className = newClassName;
			}
		}
	}
}

function getCSS(elem, property) {
	var css = null;
	if(window.getComputedStyle !== 'undefined') {
		css = document.defaultView.getComputedStyle(elem, null).getPropertyValue(property);
	}
	else if(elem.currentStyle) {
		css = elem.currentStyle[property];
	}
	return css;
}

function getTableHeader(tableID) {
	if(document.getElementById(tableID) != null && document.getElementById(tableID) != ""){
		return document.getElementById(tableID).getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th");
	} else {return null;}
}

function switchColumns(tableID, shiftMode) {
	list = getTableHeader(tableID);
	var firstPos = 1;
	while (firstPos < list.length && hasClass(list[firstPos], "column-hidden")) {firstPos++;}
	var lastPos = firstPos;
	while (lastPos < list.length && !(hasClass(list[lastPos], "column-hidden")) ) {lastPos++;}
	var visibleColumnsNumber = lastPos - firstPos;
	var newPos = 0;
	if (shiftMode <= 0) {
		if (shiftMode == -1) {newPos = Math.max(firstPos - 1, 1);}
		else if (shiftMode == -2) {newPos = Math.max(firstPos - visibleColumnsNumber, 1);}
		else {newPos = 1;}
	} else {
		if (shiftMode == 1) {newPos = Math.min(firstPos + 1, list.length - visibleColumnsNumber);}
		else if (shiftMode == 2) {newPos = Math.min(firstPos + visibleColumnsNumber, list.length - visibleColumnsNumber);}
		else {newPos = list.length - visibleColumnsNumber;}
	}
	if (firstPos != newPos) {
		//console.log("switching columns!");
		var table = document.getElementById(tableID);
		for (var i = 0, row; row = table.rows[i]; i++) {
			for (var j = 1, col; col = row.cells[j]; j++) {
				if (j >= newPos && j < newPos + visibleColumnsNumber){removeClassByRef(col, "column-hidden");}
				else {addClassByRef(col, "column-hidden");}
			}
		}
	}
}

function shiftForwardByOne(){switchColumns("schedule", 1);}

function shiftBackwardByOne(){switchColumns("schedule", -1);}

function shiftForwardByGroup(){switchColumns("schedule", 2);}

function shiftBackwardByGroup(){switchColumns("schedule", -2);}

function shiftToTheBeginning(){switchColumns("schedule", -3);}

function shiftToTheEnd(){switchColumns("schedule", 3);}

function getCSS(elem, property) {
	var css = null;
	if(window.getComputedStyle) {
		css = document.defaultView.getComputedStyle(elem, null).getPropertyValue(property);
	}
	else if(elem.currentStyle) {
		css = elem.currentStyle[property];
	}
	return css;
}

function adjustColumnsOnResize(table, fixedWidth, columnWidth, listLength, parent, parentPadding) {
	var newTableWidth = parseInt(parent.offsetWidth, 10) - parentPadding;
	console.log(parent.offsetWidth);
	console.log(parentPadding);
	if (newTableWidth != window.TableWidth) {
		window.tableWidth = newTableWidth;
		var newVisibleColumnsNumber = Math.min(Math.max(1, Math.floor((tableWidth - fixedWidth) / columnWidth)), listLength - 1);
		if (newVisibleColumnsNumber != window.visibleColumnsNumber){
			buttonGroup = document.getElementsByClassName("timetable")[0].getElementsByClassName("btn-group")[0];
			if (newVisibleColumnsNumber == listLength - 1){addClassByRef(buttonGroup, "column-hidden");} 
			else {removeClassByRef(buttonGroup, "column-hidden");}
			//console.log("adjusting columns!");
			window.visibleColumnsNumber = newVisibleColumnsNumber;
			for (var i = 0, row; row = table.rows[i]; i++) {
				for (var j = 1, col; col = row.cells[j]; j++) {
					if (j <= newVisibleColumnsNumber){removeClassByRef(col, "column-hidden");}
					else {addClassByRef(col, "column-hidden");}
				}
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	//console.log("DOM loaded!");
	var list = getTableHeader("schedule");
	if (list != null){
		window.tableWidth = 0;
		window.visibleColumnsNumber = 0;
		var fixedWidth = 75; //somehow first column width doesn't show initial css value
		var columnWidth = parseInt(getCSS(list[1], "width"), 10);
		var table = document.getElementById("schedule");
		var parent = document.getElementsByClassName("timetable")[0];
		var parentPadding = parseInt(getCSS(parent, "padding-left"), 10) + parseInt(getCSS(parent, "padding-right"), 10);

		adjustColumnsOnResize(table, fixedWidth, columnWidth, list.length, parent, parentPadding);
		window.addEventListener("resize", function(){adjustColumnsOnResize(table, fixedWidth, columnWidth, list.length, parent, parentPadding)}, false);
	}
});