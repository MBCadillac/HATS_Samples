// Licensed Materials - Property of IBM
//
// AIMCHSR00
// (C)Copyright IBM Corp. 2003 - 2005  All Rights Reserved

//.============================================================================
//.Function:  HATS Specific event handlers
//.============================================================================

window.onload=addEventHandlers;

// Returns a target element
function targetElement(e) {
	if (isIE5) {
		obj = document.activeElement;
	} else if (isNS6) {
		obj = e.target;
	}
	return obj;
}

// Adds event handlers
function addEventHandlers() {
	var xf = document.getElementsByTagName("input");
	for ( var i = 0; i < xf.length; i++) {
		if ((xf[i].type != "text") && (xf[i].type != "password")
				&& (xf[i].id != "HATSTEXTINPUT")) {
			continue;
		}
		xf[i].onfocus = fieldOnFocus;
		xf[i].onchange = fieldOnChange;
	}

	var xb = document.getElementsByName("HATSBUTTON");
	for ( var i = 0; i < xb.length; i++) {
		xb[i].onclick = buttonOnClick;
	}

	var xfk = document.getElementsByName("HATSFK");
	for ( var i = 0; i < xfk.length; i++) {
		xfk[i].onclick = functionKeyOnClick;
	}

	var xs = document.getElementsByName("HATSDROPDOWNLIST");
	for ( var i = 0; i < xs.length; i++) {
		xs[i].onchange = selectOnClick;
	}

	var xl = document.getElementsByName("HATSLINK");
	for ( var i = 0; i < xl.length; i++) {
		obj = xl[i];
		xl[i].onclick = linkOnClick;
		xl[i].href = "#";
	}

	var xr = document.getElementsByName("HATSOPTIONLIST");
	for ( var i = 0; i < xr.length; i++) {
		xr[i].onclick = radioOnClick;
	}
}

// Handles function key Click event
function functionKeyOnClick(e) {
	var obj = targetElement(e);
	var id = obj.id;
	var namearray = new Array();
	idarray = id.split("_");
	callFunction(idarray);
}

// Handles field click event
function fieldOnClick(e) {
	var obj = targetElement(e);
	var iarray = new Array();
	iarray = obj.name.split("_");
	setCursorPosition(iarray[1]);
}

// Handles field focus event
function fieldOnFocus(e) {
	var obj = targetElement(e);
	var iarray = new Array();
	iarray = obj.id.split("_");
	setCursorPosition(iarray[1]);
	setFocusFieldIntoGlobal(obj);
}

// Handles field change event
function fieldOnChange(e) {
	var obj = targetElement(e);
	checkInput(obj);
}

// Handles button click event
function buttonOnClick(e) {
	var obj = targetElement(e);
	var id = obj.id;
	var namearray = new Array();
	idarray = id.split("_");
	callFunction(idarray);
}

// Handles selection click event
function selectOnClick(e) {
	var obj = targetElement(e);
	if (obj.length > 0) {
		obj = obj.options[obj.selectedIndex];
		var id = obj.id;
		var idarray = new Array();
		idarray = id.split("_");
		callFunction(idarray);
	}
}

// Handles link click event
function linkOnClick(e) {
	var obj = targetElement(e);
	if (isNS6) {
		obj = obj.parentNode;
	}
	var id = obj.id;
	var idarray = new Array();
	idarray = id.split("_");
	callFunction(idarray);
}

// Handles radio button click event
function radioOnClick(e) {
	var obj = targetElement(e);
	var id = obj.id;
	var idarray = new Array();
	idarray = id.split("_");
	callFunction(idarray);
}

// calls either ms() or setValue()
function callFunction(iarray) {
	switch (iarray[0]) {
	case ("ms"):
		ms(iarray[1]);
		break;
	case ("setValue"):
		setValue(iarray[1], iarray[2], iarray[3], iarray[4]);
		break;
	default:
		break;
	}
}