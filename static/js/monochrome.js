function setCookie(cookieName, cookieValue, expDays) {
	var d = new Date();
	d.setTime(d.getTime() + (expDays*86400000)); //24*60*60*1000
	var expires = "expires="+d.toUTCString();
	var domainVar = window.domainVar !== undefined ? window.domainVar : "";
	document.cookie = cookieName + "=" + cookieValue + "; " + expires + domainVar + "; path=/";
}

function getCookie(cookieName) {
	var name = cookieName + "=";
	var cArray = document.cookie.split(';');
	for(var i = 0, len = cArray.length; i < len; i++) {
		var c = cArray[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

function checkMonochrome() {
	var Value = getCookie("monochrome");
	if (Value == "1") {
		setBleached();
	} else if (Value == "2") {
		setBlackened();
	} else {
		setNormal();
	}
}

function enableMonochrome() {
	setBleached();
	setMediumFont();
	setButtons(true);
}

function invertMonochrome() {
	if (getCookie("monochrome") == "1") {
		setBlackened();
	} else {
		setBleached();
	}
}

function disableMonochrome() {
	setNormal();
	setButtons(false);
	setNormalFont();
}

function setMediumFont() {
	setCookie("largefont", "1", 1);
	removeClass(0, "body", "font-large");
	removeClass(0, "body", "font-extra-large");
	addClass(0, "body", "font-medium");
}
function setLargeFont() {
	setCookie("largefont", "2", 1);
	removeClass(0, "body", "font-medium");
	removeClass(0, "body", "font-extra-large");
	addClass(0, "body", "font-large");
}
function setExtraLargeFont() {
	setCookie("largefont", "3", 1);
	removeClass(0, "body", "font-medium");
	removeClass(0, "body", "font-large");
	addClass(0, "body", "font-extra-large");
}

function setNormalFont() {
	setCookie("largefont", "", -1);
	removeClass(0, "body", "font-medium");
	removeClass(0, "body", "font-large");
	removeClass(0, "body", "font-extra-large");
}

function setBleached() {
	setCookie("monochrome", "1", 1);
	removeClass(0, "body", "blackened");
	addClass(0, "body", "bleached");
	setIcons(true);
}

function setBlackened() {
	setCookie("monochrome", "2", 1);
	removeClass(0, "body", "bleached");
	addClass(0, "body", "blackened");
	setIcons(false);
}

function setNormal() {
	setCookie("monochrome", "", -1);
	removeClass(0, "body", "blackened");
	removeClass(0, "body", "bleached");
	setIcons(false);
}

function setIcons(whiteout) {
	schedule = document.getElementById("id_ScheduleType")
	if (schedule) {
		var radiobox = "url('/static/images/radiobox.svg')";
		var radioboxChecked = 'url("/static/images/radiobox-checked.svg")';
		if (whiteout){
			radiobox = "url('/static/images/radiobox-black.svg')";
			radioboxChecked = "url('/static/images/radiobox-checked-black.svg')";
		}
		list = schedule.getElementsByTagName("li");
		for (var i = 0, len = list.length; i < len; i++) {
			input = list[i].getElementsByTagName("input")[0];
			label = list[i].getElementsByTagName("label")[0];
			if (input.checked){
				label.style.backgroundImage = radioboxChecked;
			} else {
				label.style.backgroundImage = radiobox;
			}
		}
	}

	pdfInput = document.getElementsByName("viewPDF");
	if (pdfInput.length) {
		var pdfIcon = "/static/images/pdf.svg";
		if (whiteout){
			pdfIcon = "/static/images/pdf-black.svg";
		}
		for (var i = 0, len = pdfInput.length; i < len; i++) {
			pdfInput[i].src = pdfIcon;
		}
	}

	pdfInput = document.getElementsByName("viewEXCEL");
	if (pdfInput.length) {
		var pdfIcon = "/static/images/xls.svg";
		if (whiteout){
			pdfIcon = "/static/images/xls-black.svg";
		}
		for (var i = 0, len = pdfInput.length; i < len; i++) {
			pdfInput[i].src = pdfIcon;
		}
	}
}

function setButtons(show){
	if (show) {
		show
		document.getElementById('MediumFontButton').style.display='inline-block';
		document.getElementById('LargeFontButton').style.display='inline-block';
		document.getElementById("ExtraLargeFontButton").style.display='inline-block';
		document.getElementById('InversionButton').style.display='inline-block';
		document.getElementById('StandartVersionButton').style.display='inline-block';
		//document.getElementById('MonochromeVersionButton').style.display='none';
	} else {
		document.getElementById('MediumFontButton').style.display='none';
		document.getElementById('LargeFontButton').style.display='none';
		document.getElementById('ExtraLargeFontButton').style.display='none';
		document.getElementById('InversionButton').style.display='none';
		document.getElementById('StandartVersionButton').style.display='none';
		//document.getElementById('MonochromeVersionButton').style.display='inline-block';
	}
}

function addClass(idType, elemName, clName){
	if (idType == 0 || idType == 1) {	//gets list of elements by Tag or Class Name
		if (idType == 0) {
			list = document.getElementsByTagName(elemName);	//by Tag Name
		} else {
			list = document.getElementsByClassName(elemName);//by Class Name
		}
		for (var i = 0, len = list.length; i < len; i++) {
			if (list[i].className == null || list[i].className =="") {
				list[i].className = clName;
			} else if (!(hasClass(list[i], clName))){
				list[i].className = list[i].className + " " + clName;
			}
		}
	} else if (idType == 2){	//gets an element by ID Name
		elem = document.getElementById(elemName);
		if (elem !== null) {
			if (elem.className == null || elem.className =="") {
				elem.className = clName;
			} else if (!(hasClass(elem, clName))){
				elem.className = elem.className + " " + clName;
			}
		}
	}
}

function removeClass(idType, elemName, clName){
	if (idType == 0 || idType == 1) {
		if (idType == 0) {
			list = document.getElementsByTagName(elemName);
		} else {
			list = document.getElementsByClassName(elemName);
		}
		for (var i = 0, len = list.length; i < len; i++) {
			if (hasClass(list[i], clName)) {	//checks if class exists
				newClassName = list[i].className;
				newClassName = newClassName.replace(" " + clName, "");
				newClassName = newClassName.replace(clName + " ", "");
				newClassName = newClassName.replace(clName, "");
				if (newClassName == "") {
					list[i].removeAttribute("class");
				} else {
					list[i].className = newClassName;
				}
			}
		}
	} else if (idType == 2){
		elem = document.getElementById(elemName);
		if (elem !== null) {
			if (hasClass(elem, clName)) {
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
}

function hasClass(element, clName){
	return (" " + element.className + " " ).indexOf( " "+clName+" " ) > -1;
}

function GetDomainName() {
	var url = window.location.href;
	var url_parts = url.split('/');
	var domain_name_parts = url_parts[2].split(':');
	var domain_name = domain_name_parts[0];
	return domain_name;
}

document.addEventListener('DOMContentLoaded', function() {
	if (getCookie("monochrome") == "1") {
		addClass(0, "body", "bleached");
		setButtons(true);
		setIcons(true);
	} else if (getCookie("monochrome") == "2") {
		addClass(0, "body", "blackened");
		setButtons(true);
	}
	if (getCookie("largefont") == "1") {
		addClass(0, "body", "font-medium");
	} else if (getCookie("largefont") == "2") {
		addClass(0, "body", "font-large");
	} else if (getCookie("largefont") == "3") {
		addClass(0, "body", "font-extra-large");
	}
}, false);