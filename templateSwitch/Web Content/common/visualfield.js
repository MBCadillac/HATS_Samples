// Licensed Materials - property of IBM
//
// AIMCHSR00
// (C)Copyright IBM Corp. 2003 - 2010  All Rights Reserved

//.============================================================================
//.Function:  Visual Input Field
//.============================================================================

var DIRTY = " ";
var NUMERIC = String.fromCharCode(160);
var OPPOSITE_TO_SCREEN = String.fromCharCode(8237);
var CONTAINS_GLOBAL_VARIABLE = ".";
var BY_INITIAL = 2;
var BY_MOUSE = 1;
var BY_TAB = -1;
var BY_TYPING = 0;

var SCREENORIENT = " Screen Orientation: ";
var TYPINGORIENT = "  Typing Orientation: ";
var AUTOPUSH = "  Autopush: ";
var AUTOFLDREV = "  AutoFldRev: ";
var autoFldrev = false;
var isFldreversed = false;
var isSession5250 = false;
var disableNumSwapWhenSubmit = false;
var jr = new JSReorder();

if(!codePageArray){
	var isSession5250Array = new Array();
	var codePageArray = new Array();
	var isChkRTBArray = new Array();
	var autoKeyboardLayerSwitchArray = new Array();
}

var maxFieldLen;
var caretIn = BY_INITIAL;
var curPos = 0;
var selectionStart = 0;
var autoPush = false;
var pushMode = false;
var mousePressed = false;
var rightPushBound = 0;
var leftPushBound = 0;
var codePage = 37;
var layerGuess = layerGuessForAutoKeyboardLayerSwitch = false;
var hadnoFocus = true;
var preventAltNumpad = false;
var prevCharClass  = false;

var SG="S"+"&gt;";
var SL="&lt;"+"S";
var statusBLOCKED = "";

var gKeyCode;
var layerSwitched;
var autoKeyboardLayerSwitch = true;
var destroyNextKeyEvent = false;
var CONVERT_TO_HEBREW_LAYER1 = [1513,1504,1489,1490,1511,1499,1506,1497,1503,1495,1500,1498,1510,1502,1501,1508,47,1512,1491,1488,1493,1492,39,1505,1496,1494,1507]; /*65*/
var CONVERT_TO_HEBREW_LAYER1_H = [1507,61,1514,45,1509,46,59]; /*186*/
var CONVERT_TO_HEBREW_LAYER1_SHIFT_H = [58,43,62,95,60,63,126]; /*186*/
var CONVERT_TO_LOWER_CASE1 = [59,61,44,45,46,47,96]; /*186*/
var CONVERT_TO_LOWER_CASE1_SHIFT = [58,43,60,95,62,63,126]; /*186*/
var CONVERT_TO_LOWER_CASE2 = [91,null,93,39]; /*219*/
var CONVERT_TO_LOWER_CASE2_SHIFT = [123,null,125,34]; /*219*/
var CONVERT_TO_ARABIC_LAYER1 = [1588,1575,1572,1610,1579,1576,1604,1575,1607,1578,1606,1605,1577,1609,1582,1581,1590,1602,1587,1601,1593,1585,1589,1569,1594,1574]; /*65*/
var CONVERT_TO_ARABIC_LAYER1_SHIFT = [1616,1570,125,93,1615,91,1571,1571,247,1600,1548,47,8217,1570,215,1563,1614,1612,1613,1573,8216,123,1611,1618,1573,126]; /*65*/
var CONVERT_TO_ARABIC_LAYER2 = [1603,61,1608,45,1586,1592,1584]; /*186*/
var CONVERT_TO_ARABIC_LAYER2_SHIFT = [58,43,44,95,46,1567,1617]; /*186*/
var CONVERT_TO_ARABIC_LAYER3 = [1580,92,1583,1591]; /*219*/
var CONVERT_TO_ARABIC_LAYER3_SHIFT = [60,124,62,34]; /*219*/

function _preventDefault(event) {
	if(event.preventDefault)
		event.preventDefault();
	else
		event.returnValue = false;
}

function ConvertPosToColBidi(pos, sizecols){

	var p = document.getElementById("p_"+pos);                  
        if(p != null)   //protected field                       
                return pos % sizecols;                          

	if(gobject != null && (gobject.type == "text" || gobject.type == "textarea")){
		var pool = gobject.name.split("_");
		var fieldStart = parseInt(pool[1]);
		return (fieldStart % sizecols + getCaretOffsetPositionBidi(pos, sizecols ,gobject, fieldStart));
	}
	else
		return ( pos % sizecols );
}

function getCaretOffsetPositionBidi(pos, sizecols, obj, fieldStart){
	var a = (isIE) ? curPos : obj.selectionStart;
	if((obj.style.direction == "rtl") ^ (hatsForm.dir == "rtl")){
		var isAligned = (obj.style.textAlign == "right") ^ (hatsForm.dir == "rtl");
		len = (isAligned) ? maxFieldLen : obj.value.length;
		return Math.max(0,len - a - 1);
	}
	else if((obj.style.textAlign == "right") ^ (obj.style.direction == "rtl"))
		a = Math.max(0,a + maxFieldLen - obj.value.length - 1);
	else 		
		a = pos - fieldStart;
		
	return a;
}


function findAbsOffsetTop(obj){
	var curtop = 0;
	try{
		if (obj.offsetParent){
			do {
				curtop = curtop + obj.offsetTop;
			} while (obj = obj.offsetParent);
			return curtop;
		} else {
			alert(" offsetParent not supported");
			return obj.offsetTop;
		}
	}
	catch(e){
		alert(" offsetParent not supported");
		return obj.offsetTop;
	}
}


function TabIndexVIF() {
	hadnoFocus = false;
	var j;
	var elementOffsetTop = elementOffsetLeft = 0;

	var len =  hatsForm.elements.length;
	var curoffsetTop = -1;
	TA = new Array();
	var lineIndex = 0;
	var maxTabIndex = 500;
	var prevHeight = 100; 
	var curHeight = 0;  

	for (j = 0; j <= len-1; j++){
		elementNext = hatsForm.elements[j];
		if (isFocusAbleInputField(elementNext.type)){
			if(maxTabIndex < elementNext.tabIndex)
				maxTabIndex = elementNext.tabIndex;

			elementOffsetTop = findAbsOffsetTop(elementNext);
			curHeight = Math.min(prevHeight, elementNext.offsetHeight);
			//if ( (( elementNext.offsetTop - curoffsetTop)  >= elementNext.offsetHeight) || ( curoffsetTop == -1) )  {
			if (Math.abs(((elementOffsetTop - curoffsetTop)  >= curHeight)) || ( curoffsetTop == -1)){
				lineIndex++;
				TA[lineIndex] = 1;
				curoffsetTop = elementOffsetTop;  elementNext.offsetTop;
			} else {
				TA[lineIndex]++;
			}

			prevHeight = elementNext.offsetHeight;
		}
		else
			elementNext.tabIndex = 999;
	}

	lineIndex = 0;
	controlsOnLine = 0;
	previousTabIndex=0;
	for (j = 0; j <= len-1; j++){
		elementNext = hatsForm.elements[j];
		if (isFocusAbleInputField(elementNext.type)){
			if (controlsOnLine == 0) {
				lineIndex++;
				controlsOnLine = TA[lineIndex];
			}
			elementNext.tabIndex = controlsOnLine + previousTabIndex + maxTabIndex;

			controlsOnLine--;
			if (controlsOnLine == 0)
				previousTabIndex = previousTabIndex + TA[lineIndex];
		}
	}
}

document.body.oncopy = function(){
	if(isRealIE && event.srcElement.tagName != "TEXTAREA") {
		var selText;
		if(isIE)
			selText = document.selection.createRange().text;
		else if(window.getSelection())
			selText = window.getSelection().toString();

		processCopy(null, selText, hatsForm.dir == "rtl");
		_preventDefault(event);
	}
};

function reverseBeforeSubmit(hatsForm,intCommand){
	var isScreeRev = (intCommand == "reverse") ? true : false;

	if(hatsForm.LAYERGUESS != null)
		hatsForm.LAYERGUESS.value = (layerGuess) ? "true" : "false";
        var i = 0;

	for  (var j = 0; j < hatsForm.elements.length; j++){
		elementNext = hatsForm.elements[j];

		if(elementNext.type=="text" || elementNext.type=="textarea"){
			if(elementNext.style.unicodeBidi == "") continue;


			if(isScreeRev && (elementNext.title.indexOf(DIRTY) < 0)){
				elementNext.disabled = true;
			}
			else {
				if(elementNext.title.indexOf(DIRTY) >= 0)
					elementNext.disabled = false;

				var len = elementNext.value.length;
				if((elementNext.style.direction == "rtl") ^ (hatsForm.dir == "rtl")) {
					var text = "";
					for(i = len - 1;i >= 0;i--){
						symbol = elementNext.value.charAt(i);
						text += symbol;
					}
					elementNext.value = text;
				}

				var isGlobalVariableField = (elementNext.title.indexOf(CONTAINS_GLOBAL_VARIABLE) >= 0);
				maxLen = (isRealIE) ? elementNext.cols : elementNext.maxLength;
				var isOPPOSITE_TO_SCREEN = (elementNext.title.indexOf(OPPOSITE_TO_SCREEN) >= 0);                                                        
				var isDefaultCmd = (intCommand == "default") ? true : false;                                                         
				if(((isOPPOSITE_TO_SCREEN && (isGlobalVariableField)) || (elementNext.title.indexOf(NUMERIC) >= 0)) 				
						&& ((elementNext.style.textAlign == "right") ^ (hatsForm.dir == "rtl"))){
				// 	maxLen = (isIE) ? elementNext.cols : elementNext.maxLength;

					if((maxLen < 81) && (maxLen > (elementNext.value).length)){
						var fieldLen = maxLen - (elementNext.value).length;
						var pad = "";
						for(i = 0;i < fieldLen;i++)
							pad += ' ';

						elementNext.value = pad + elementNext.value;
					}
				}

				if((codePage == 420) && disableNumSwapWhenSubmit && isScreeRev
						&& (elementNext.title.indexOf(DIRTY) >= 0)){
					var text = "";
					var key="";
					for(i = 0;i < len;i++){
						symbol = elementNext.value.charAt(i);
						key= symbol.charCodeAt(0);
						if((hatsForm.dir == "ltr")){
							if((key > 47) && (key < 58))
								symbol = String.fromCharCode(key+1584);
						}else if((hatsForm.dir == "rtl")){
							if((key > 1631) && (key < 1642))
								symbol = String.fromCharCode(key-1584);
						}

						text += symbol;
					}
					elementNext.value = text;
				}

				if(((codePage != 420) && (elementNext.style.direction == "rtl")) ||
						((codePage == 420) && ((elementNext.style.direction == "rtl") ^ (hatsForm.dir == "rtl")))) {
					var text = "";
					len = elementNext.value.length;
					for(i = 0;i < len;i++) {
						symbol = elementNext.value.charAt(i);
						symbol = doSymSwap(symbol);
						text += symbol;
					}
                    
                    for(i = len; i < maxLen; i++)		
                        text = text + " ";				
                    
					elementNext.value = text;
				}
			}
		}
		else if(elementNext.type == "password"){
			if ((elementNext.title.indexOf(OPPOSITE_TO_SCREEN) >= 0) ||
					((elementNext.title.indexOf(NUMERIC) >= 0) && (hatsForm.dir == "rtl"))){
				var text = elementNext.value;
				elementNext.value = "";
				for(i = text.length - 1;i >= 0;i--)
					elementNext.value += text.charAt(i);
			}
		}
	}
}

function initVIF(form_id,codepage,ischkRTB,is5250,isautoKeyboardLayerSwitch) {
	codePage = codePageArray[form_id] = codepage;
	isChkRTBArray[form_id] = ischkRTB;
	autoKeyboardLayerSwitch = autoKeyboardLayerSwitchArray[form_id] = isautoKeyboardLayerSwitch;
	enableBIDI=true;
	if(isChrome || isIPAD || SAFARI)
		NN = true;

	isRealIE = (navigator.userAgent.indexOf('MSIE') > -1 || navigator.appVersion.indexOf('Trident/')) > 0; //correct IE detection
	if(!isRealIE) {
		if(!NN)
			alert("Emulation of Arabic/Hebrew host sessions works correctly only on Microsoft Explorer, Chrome or Netscape/Mozilla browser");
		else {
			index = navigator.userAgent.indexOf("Netscape/");
			if((index > 0) && (parseInt(navigator.userAgent.substring(index+9,index+10)) < 7))
				alert("To have full Bidi support use Netscape version 8 or above");
		}
	}
	
	var hatsFormBiDi = hatsForm;
	if (hatsFormBiDi==null || "HATSForm"!=hatsFormBiDi.name) {
		hatsFormBiDi = eval("document." + form_id);
	}

	var aTables = hatsFormBiDi.getElementsByTagName("table");
	for(var tableIndex = 0 ; tableIndex < aTables.length ; tableIndex ++){
		if(aTables.item(tableIndex).id == "hatsPrepopulatedRTLTable")
			aTables.item(tableIndex).dir = hatsFormBiDi.dir;
		else if(aTables.item(tableIndex).id == "hatsPrepopulatedReversedRTLTable"){
			if(hatsFormBiDi.dir == "ltr")
				aTables.item(tableIndex).dir =  "rtl";
			else
				aTables.item(tableIndex).dir =  "ltr";
		}
	}

	if(!autoKeyboardLayerSwitch) {
		if((hatsFormBiDi.LAYERGUESS != null) && (hatsFormBiDi.LAYERGUESS.value == "true"))
			layerGuess = true;
	}
	else if (gobject != null){
		layerGuess = (gobject.style.direction == "rtl") ^ layerSwitched;
	}

	isSession5250 = isSession5250Array[form_id] = is5250;
	if(!is5250) {
		if (hatsFormBiDi.dir == "rtl"){
			processPasswordNumeric(hatsFormBiDi);
			if((hatsFormBiDi.AUTOPUSH.value).indexOf("autoreverse=off") >= 0) {
				autoFldrev = false;
				processNumeric(hatsFormBiDi);
			}
			else
				autoFldrev = true;
		}
		else {
			if((hatsFormBiDi.AUTOPUSH.value).indexOf("autoreverse=on") >= 0) {
				autoFldrev = true;
				processAutoFieldReverse(null,hatsFormBiDi);
			}
			else
				autoFldrev = false;
		}
	}

	autoPush = ((hatsFormBiDi.AUTOPUSH.value).indexOf("autopush=on") >= 0) ? true : false;

	if(!isRealIE && (gobject!=null))
		showStatusBarOld(gobject,hatsFormBiDi);

	if(isRealIE && ("HATSForm" != hatsFormBiDi.name)) {
		var elements = document.getElementsByTagName("TEXTAREA");
		for(var j=0 ;j < elements.length; j++) {
			if (elements[j].currentStyle){
				cs = eval("elements[j].currentStyle." + "whiteSpace");
				if(cs == "normal")
					elements[j].style["whiteSpace"] = "pre";
			}
		}
	}
}

function adjustReversedFields() {
	var count =  hatsForm.elements.length;

	for  (var j = 0; j < count; j++){
		elementNext = hatsForm.elements[j];
		if(elementNext.type=="text" || elementNext.type=="textarea"){
			if(elementNext.style.unicodeBidi == "") continue;

			if(!isSession5250 && (elementNext.title.indexOf(NUMERIC) >= 0)){
				if((hatsForm.dir == "rtl") && !autoFldrev)
					reverseText(elementNext);
			}
			else if((elementNext.style.direction == "rtl")^(hatsForm.dir == "rtl"))
				reverseText(elementNext);
		}
	}
}

function showStatusBar(obj) {
	showStatusBarOld(obj,hatsForm);
}

function showStatusBarOld(obj,hatsFormObj) {
	if(!obj)
		return;

	var oiaName = "OPERATING_INFO_FOR_"+hatsFormObj.name+"_AREA";
	var oiabc = eval(document.getElementById(oiaName+"_ITEM_ID_"+"bidiControls"));
	var oiadiv = eval(document.getElementById(oiaName+"_DIV_ID"));
	var screenRTL = (hatsFormObj.dir == "rtl") ^ isChkRTBArray[hatsFormObj.name];
	temp_string = TYPINGORIENT;

	if((oiadiv == null) && (caretIn != BY_INITIAL))  {
		temp_string += (obj.style.direction == "rtl") ? "<=" : "=>";

		temp_string += AUTOPUSH;
		temp_string += (autoPush) ? "on" : "off";

		if(!isSession5250){
			temp_string += AUTOFLDREV;
			temp_string += (autoFldrev) ? "on" : "off";
		}
		if(codePage == 420){
			temp_string += "  Numerals:";
			temp_string += (layerGuess) ? " A" : " E";
		}

		statusBIDI = SCREENORIENT + (screenRTL ? "<=" : "=>") + temp_string;
		fieldType = (obj.title.indexOf(NUMERIC) >= 0) ? " Num:   " : " Alpha: ";
		statusBIDI = fieldType + statusBIDI;
		window.status = statusBIDI;
	}
	else  if((oiabc != null) || (caretIn == BY_INITIAL)) {
		OIA_typorient = (pushMode) ? "-" : "=";
		OIA_typorient = (obj.style.direction == "rtl") ? ("&lt;"+OIA_typorient) : (OIA_typorient+"&gt;");
		OIA_autopush = (autoPush) ? "P" : "";
		if(!isSession5250)
			OIA_autofldrev = (autoFldrev) ? "<->" : "&nbsp;&nbsp;&nbsp;";
		else
			OIA_autofldrev = "&nbsp;&nbsp;&nbsp;";

		if(codePage == 420)
			OIA_lang = (layerGuess) ? " A" : " E";
		else
			OIA_lang = (layerGuess) ? " H" : " E";

		OIA_screenorient = (screenRTL) ? SL : SG;
		OIA_BIDI = "<small style=\"COLOR: red\">" + statusBLOCKED + "</small>" + "<small>" + OIA_lang + OIA_typorient +"&nbsp;" + OIA_autopush + "&nbsp;" + OIA_autofldrev +"&nbsp;" + OIA_screenorient + "</small>";
		updateStatusWindow();
		statusBLOCKED = "";
	}
}

function reorderText(obj,text,isReverse){
	return reorderText(obj,text,isReverse,false);
}

function reorderText(obj,text,isReverse,isCopyOperation){
	var resultText = "";
	if(isReverse || ((obj != null) && (obj.style.direction == "rtl")) ){
		if(!isCopyOperation)
			text = jr.doReorder(text);

		var len = text.length;
		for(i = 0;i < len;i++) {
			symbol = text.charAt(len - i - 1);
			symbol = doSymSwap(symbol);
			resultText += symbol;
		}

		if(isCopyOperation)
			resultText = jr.doReorder(resultText);
	}
	else
		resultText = jr.doReorder(text);

	return resultText;
}

function processCopy(obj,text,isReverse){
	if(text == null){
		if(isIE) {
			range = document.selection.createRange();
			text = range.text;
		}
		else
			text = obj.value.substring(obj.selectionStart,obj.selectionEnd);
	}

	textToClipboard = reorderText(obj,text,isReverse,true);

	if(isRealIE) {
		try{
			if(window.clipboardData){
				window.clipboardData.setData("Text", textToClipboard);
			}
		}catch(e){}
		return true;
	}
}

function copyText(obj) {
	if(!isRealIE)
		return;

	_preventDefault(event);
	return processCopy(obj,null,false);
}

function cutText(obj) {
	if(!isRealIE)
		return;

	_preventDefault(event);

	if(pushMode){
		if(isIE)
			leftPushBound -= Math.abs(selectionStart - curPos);
		else
			leftPushBound -= Math.abs(obj.selectionStart - obj.selectionEnd);
	}

	if(obj.title.indexOf(DIRTY) < 0)
		obj.title = obj.title + DIRTY;

	var ret = processCopy(obj,null,false);
	if(!ret) return false;

	if(isIE) {
		curPos = Math.min(selectionStart,curPos);
		selectionStart = curPos;
		event.returnValue = false;
		range = document.selection.clear();
	}
	else {
		curPos = obj.selectionStart;
		obj.value = obj.value.substring(0,curPos) + obj.value.substring(obj.selectionEnd);
		obj.setSelectionRange(curPos,curPos);
	}

	return true;
}

function pasteText(obj) {
	if(!isRealIE)
		return;

	if(isIE) {
		if(event.returnValue == false) return;
		selectionEnd = Math.max(selectionStart, curPos);
		selectionStart = Math.min(selectionStart, curPos);
	} else {
		selectionEnd = obj.selectionEnd;
		selectionStart = obj.selectionStart;
	}
	_preventDefault(event);
	var clipboardText = "";
	try{
		var data="";
		if(window.clipboardData){
			data=window.clipboardData.getData("Text");
		}
		if(data){
			clipboardText = data;
		}
	}catch(e){}
	var clipboardTextLen = clipboardText.length;
	clipboardTextLen = Math.min(clipboardTextLen,maxFieldLen - selectionStart);
	var range = document.selection ? document.selection.createRange() : null;
	var delta = clipboardTextLen - (range ? (range.text).length : selectionEnd - selectionStart);
	if(delta > 0 && range) {
			if(obj.value.length < selectionStart + clipboardTextLen)
				delta = obj.value.length - (selectionStart + (range.text).length);

			range.moveEnd("character",delta);
		}

		var textFromClipboard = clipboardText.substring(0,clipboardTextLen);
		if(upperCase)
			textFromClipboard = textFromClipboard.toUpperCase();

	var reorderedText = reorderText(obj,textFromClipboard,false,false);
	if(range && range.parentElement() != obj)
		obj.value = reorderedText;
	else if(isOverWriteMode()) {
		if(range)
			range.text = reorderedText;
		else
			obj.value = obj.value.substring(0,selectionStart) + reorderedText + obj.value.substring(selectionStart + delta);
	} else {
		obj.value = obj.value.substring(0,selectionStart) + reorderedText + obj.value.substring(selectionEnd);
	}

	selectionStart = curPos = (isOverWriteMode() && range) ? selectionStart + clipboardTextLen : obj.value.length;

	if(pushMode && (leftPushBound == curPos - clipboardTextLen))
		leftPushBound += delta;

	if(event.srcElement.title.indexOf(DIRTY) < 0)
		event.srcElement.title = event.srcElement.title + DIRTY;
}

function mouseDblClick(){
	if(isIE) {
		obj = event.srcElement;

		selectionStart = 0;
		curPos = obj.value.length;
		caretIn = BY_MOUSE;
		if(pushMode) {
			toggleFieldOrient(obj,false,false);
			pushMode = false;
		}
		setSelectedRange(obj,selectionStart,curPos);
	}
}

function setSelectedRange(obj,selectionStartMod,curPosMod){
	var range = obj.createTextRange();
	if (range){
		range.collapse();
		range.moveEnd('character', curPosMod);
		range.moveStart('character', selectionStartMod);
		range.select();
	}
}

function handleSelect(event) {
	if(isIE){
		var obj = event.srcElement;
		if(gobject == obj && document.selection.createRange().text.length == obj.value.length) {
			mouseDblClick();
			event.returnValue = false;
		}
	}
}

function getCaretPos(event,obj) {
	var position = 0;
	var caretPos = document.selection.createRange().duplicate();
	var rangeLength = caretPos.text.length;
	try{
		var len = obj.value.length;
		if(len == 0) return (new Array(0,0));

		caretPos.collapse();
		var beginField = obj.createTextRange();
		beginField.collapse();

		for(; position <= len; position++) {
			if(caretPos.getBoundingClientRect().left <= beginField.getBoundingClientRect().left)
				break ;

			caretPos.move("character",-1);
		}
	} catch(e){}
	return new Array(position + rangeLength, position);
}

function setSelectionVariables(obj, event) {
	if(!isIE){
		selectionStart = obj.selectionStart;
		curPos = obj.selectionEnd;
	} else {
		var selection = getCaretPos(event, obj);
		if(selection) {
			selectionStart = Math.min(selection[0],selection[1]);
			curPos = Math.max(selection[0],selection[1]);
		}
	}
}

function mouseDown(event){
	if(event.button == 2) {
		var hint = document.getElementById("hint");
		if(hint != null){
			var hintElement = (hint.length > 0) ? hint[0] : hint;

			hintElement.style.left=(event.clientX - hint.scrollWidth > 0) ? (event.clientX - hint.scrollWidth) : 0;
			hintElement.style.top=event.clientY;
			hintElement.style.visibility = "visible";
		}
	}

	if(isIE) {
		var obj = event.srcElement;
		mousePressed = true;

		if(gobject != obj)
			caretIn = BY_MOUSE;
	}
}

function mouseUp(event,obj) {
	if(!obj) obj = this;

	var hint = document.getElementById("hint");
	if(hint != null){
		if(hint.length > 0)
			hint[0].style.visibility = "hidden";
		else
			hint.style.visibility = "hidden";
	}

	if(!isIE) {
		setSelectionVariables(obj, event);
	}
	else {
		mousePressed = false;
		if(event.button != 2)
			setSelectionVariables(obj, event);
	}

	if(pushMode && (curPos == selectionStart) && ((curPos > leftPushBound)||(selectionStart < rightPushBound)))
		toggleFieldOrient(obj,true,false);
}

document.body.oncontextmenu = function(){
	if(isIE)
		try{
			var obj = event.srcElement;
			if(gobject == obj)
				setSelectionVariables(obj, event);
		} catch(e){}
};

function updateBiDiCursorPos(obj) {
	if(!hatsForm.CURSORPOSITION || obj.type != "text" || obj.type != "textarea")
		return;
	else if((obj.style.direction == "rtl") ^ (hatsForm.dir == "rtl")) {
		var pool = obj.name.split("_");
		var fieldStart = parseInt(pool[1]);
		hatsForm.CURSORPOSITION.value = fieldStart + getCaretOffsetPositionBidi(hatsForm.CURSORPOSITION.value,intNumberOfColumns,obj,fieldStart);
	}
}

function killFocus(obj,event) {
	updateBiDiCursorPos(obj);

	if(!isLinux || !preventAltNumpad) {
		if(pushMode){
			toggleFieldOrient(obj,false,false);
			pushMode = false;
		}

		if (isFldreversed)
			processFieldReverse(obj,false);
	}
}

function setFocusFieldIntoGlobalBiDi(inputbox,pID){
	if(inputbox.type != "text" || inputbox.type != "textarea")
		return;

	enableBIDI=true;
	setFocusFieldIntoGlobalOrig(inputbox,pID);
	setCaretToFirstInputPosition(inputbox);
}

function setFocus(obj,portlet_ID) {
	isFldreversed = false;
	var text = obj.value;
	if(isIE) {
		maxFieldLen = obj.cols;

		if(caretIn == BY_TAB) {
			curPos = obj.value.length;
			selectionStart = 0;
			obj.select();
		}
		else if(caretIn != BY_MOUSE) {
			setSelectionVariables(obj, event);
		}
	}
	else {
		if(isRealIE) {
			maxFieldLen = obj.cols;
			if(caretIn == BY_TAB)
				obj.select();
		} else {
			maxFieldLen = obj.maxLength;
		}
	}
	if(maxFieldLen == -1 || maxFieldLen > 10000 || (obj.title.indexOf(CONTAINS_GLOBAL_VARIABLE) >= 0))
		maxFieldLen = 10000;

	enableBIDI=true;
	setFocusFieldIntoGlobalOrig(obj,portlet_ID);
	setCaretToFirstInputPosition(obj);

	if(autoKeyboardLayerSwitch) {
		layerSwitched = false;
		layerGuess = (obj.style.direction == "rtl") ^ layerSwitched;
	}

	if(hatsForm.name != "HATSForm") {
		codePage = codePageArray[hatsForm.name];
		isSession5250 = isSession5250Array[hatsForm.name];
		autoKeyboardLayerSwitch = autoKeyboardLayerSwitchArray[hatsForm.name];

		if(!autoKeyboardLayerSwitch) {
			var layerguess = document.getElementById("LAYERGUESS");
			if((layerguess != null) && (layerguess.value == "true"))
				layerGuess = true;
		}

		var autopushValue = hatsForm.AUTOPUSH.value;
		if(!isSession5250) {
			if(autopushValue.indexOf("autoreverse=off") >= 0)
				autoFldrev = false;
			else
				autoFldrev = true;
		}

		if((autopushValue.indexOf("autopush") < 0) && isSession5250)
			autoPush = true;
		else
			autoPush = (autopushValue.indexOf("autopush=on") >= 0) ? true : false;
	}

	if(text.length == 0)
		obj.style.textAlign = (obj.style.direction == "rtl") ? "right" : "left";

	if(!isIE && isLinux && (curPos > 0))
		obj.setSelectionRange(curPos,curPos);

	showStatusBar(obj);
	caretIn = BY_TYPING;

	if (isChkRTBArray[hatsForm.name] && hadnoFocus)
		TabIndexVIF();
}
/////
function setFocusInput(obj,portlet_ID) {
	isFldreversed = false;
	if(obj.type != "password")
		setContextual(obj);

	showStatusBar(obj);
	enableBIDI=true;

	if(autoKeyboardLayerSwitch)
		layerSwitched = false;

	setFocusFieldIntoGlobalOrig(obj,portlet_ID);
	setCaretToFirstInputPosition(obj);
}

function keyDownInput(event) {
	gKeyCode = event.keyCode;
	if(!isLinux && event.shiftKey && event.altKey) {
		layerGuess = !layerGuess;
		if(autoKeyboardLayerSwitch)
			layerSwitched = !layerSwitched;

		obj = (isIE) ? event.srcElement : event.target;
		showStatusBar(obj);
	}
}

function keyUpInput(event) {
	var obj = (isIE) ? event.srcElement : event.target;
	if(obj.type != "password")
		setContextual(obj);
}
///
function setContextual(obj) {
	var text = obj.value;
	for(i = 0 ;i < text.length ;i++){
		ch = text.charAt(i);
		if (ch >= String.fromCharCode(1488)) {
			if(!isFldreversed) {
				obj.style.direction = "rtl";
				obj.dir = "rtl";
				isFldreversed = true;
				showStatusBar(obj);
			}
			return;
		}
		else if ( ((ch >= 'A') && (ch <= 'Z')) || ((ch >= 'a') && (ch <= 'z')) ) {
			if(isFldreversed) {
				obj.style.direction = "ltr";
				obj.dir = "ltr";
				isFldreversed = false;
				showStatusBar(obj);
			}
			return;
		}
	}
}

function keyPressInput(event) {
	if(destroyNextKeyEvent || (event.returnValue == false)){
		_preventDefault(event);

		destroyNextKeyEvent = false;
		return;
	}

	if(!isRealIE && event.keyCode != 0)
		return;

	var ieKey = (isIE) ? event.keyCode : event.charCode;
	obj = (isIE) ? event.srcElement : event.target;
	ieKey = changeKey(ieKey,false,event,obj);

	if(disableNumSwapWhenSubmit && (hatsForm.dir == "rtl")){
		if((codePage == 420) && (ieKey > 47) && (ieKey < 58))
			ieKey = ieKey + 1584;
	}
	else if((codePage == 420) && layerGuess && (ieKey > 47) && (ieKey < 58))//Arabic, transform into Hindi
		ieKey = ieKey + 1584;

	if(((ieKey > 64) & (ieKey < 91)) || ((ieKey > 96) & (ieKey < 123))) {
		if(layerGuess) {
			layerGuess = false;
			showStatusBar(obj);
		}
	}
	else if(ieKey > 1487) {
		if(!layerGuess) {
			layerGuess = true;
			showStatusBar(obj);
		}
	}

	if(obj.type != "password")
		return;

	if((ieKey > 31) && !event.altKey && !event.ctrlKey){
		if(isRealIE)
			event.keyCode = ieKey;
		else {
			curPos = obj.selectionStart;
			event.preventDefault();

			if(isOverWriteMode() && (obj.selectionStart == obj.selectionEnd))
				obj.value = obj.value.substring(0,obj.selectionStart) + String.fromCharCode(ieKey) + obj.value.substring(obj.selectionEnd+1);
			else
				obj.value = obj.value.substring(0,obj.selectionStart) + String.fromCharCode(ieKey) + obj.value.substring(obj.selectionEnd);

			obj.setSelectionRange(curPos+1,curPos+1);
		}
	}
}

function mouseLeave(obj) {
	if(isIE) {
		if(mousePressed){
			if(event.x < 0)
				curPos = 0;
			else if(event.x > obj.offsetWidth)
				curPos = (obj.innerText).length;

			if(obj.style.direction == "rtl")
				curPos = (obj.innerText).length - curPos;
		}
	}
	var hint = document.getElementById("hint");
	if(hint != null){
		if(hint.length > 0)
			hint[0].style.visibility = "hidden";
		else
			hint.style.visibility = "hidden";
	}
}

function swapBrackets(_ieKey) {
	switch(_ieKey) //swap [{(
	{
	case 40:
		_ieKey = 41;
		break;
	case 41:
		_ieKey = 40;
		break;
	case 91:
		_ieKey = 93;
		break;
	case 93:
		_ieKey = 91;
		break;
	case 123:
		_ieKey = 125;
		break;
	case 125:
		_ieKey = 123;
		break;
	}
	return _ieKey;
}

function processLamAlef(ieKey,fieldDirection,event,obj) {
	if((ieKey == 1604) && ((gKeyCode != 71) || (event.shiftKey && gKeyCode == 71)))
		destroyNextKeyEvent = true;

	var replaced_Key = null;
	if(gKeyCode == 71)
		replaced_Key = 1571;
	else if(gKeyCode == 84)
		replaced_Key = 1573;
	else if(gKeyCode == 66)
		replaced_Key = (event.shiftKey) ? 1570 : 1575;

	if((obj.type != "password") && !fieldDirection && autoPush) {
		toggleFieldOrient(obj,true,pushMode && (curPos == leftPushBound));
		fieldDirection = !fieldDirection;
	}

	if(pushMode) {
		var cursorPos = (isIE) ? curPos : obj.selectionStart;
		if(!isOverWriteMode() || (leftPushBound == cursorPos))
			leftPushBound += 1;
	}

	if(isIE) {
		var replaceText = (fieldDirection) ? String.fromCharCode(1604) + String.fromCharCode(replaced_Key) : String.fromCharCode(replaced_Key) + String.fromCharCode(1604);
		tmp = Math.min(selectionStart, curPos);
		curPos = Math.max(selectionStart, curPos);
		selectionStart = tmp;

		ieKey = 1604;
		if(isOverWriteMode() && (curPos == selectionStart))
			obj.value = obj.value.substring(0,selectionStart) + replaceText + obj.value.substring(curPos+1);
		else
			obj.value = obj.value.substring(0,selectionStart) + replaceText + obj.value.substring(curPos);

		curPos = selectionStart = selectionStart + 1;
		setSelectedRange(obj,selectionStart + 1,selectionStart + 1);
	}
	else {
		if(fieldDirection){
			replaceFieldText(obj,1604);
			ieKey = replaced_Key;
		} else {
			replaceFieldText(obj,replaced_Key);
			ieKey = 1604;
		}
	}
	_preventDefault(event);
	return ieKey;
}

function changeKey(ieKey,fieldDirection,event,obj) {
	if(autoKeyboardLayerSwitch) {
		if(!((gKeyCode<58 && gKeyCode>47) || (gKeyCode<112 && gKeyCode>95) || (gKeyCode<222 && gKeyCode>218) || gKeyCode==32)) {
		if(codePage == 420)
			ieKey = processAutoKeyboardLayerSwitchArabic(ieKey,fieldDirection,event,obj);
		else
			ieKey = processAutoKeyboardLayerSwitchHebrew(ieKey,fieldDirection,event,obj);

		} else if(layerGuessForAutoKeyboardLayerSwitch ^ (fieldDirection ^ layerSwitched)) { //Bidi Keyboard, type English or vice versa
			ieKey = swapBrackets(ieKey);
		}
	}

	if(upperCase) {
		if((ieKey >=97 && ieKey <=122) || (useAccentedCharacters && ieKey>=224 && ieKey<=254 && ieKey!=247))
			ieKey = ieKey - 32;
	}
	return ieKey;
}

function processAutoKeyboardLayerSwitchHebrew(ieKey,fieldDirection,event,obj) {
	if((gKeyCode != ieKey) || (!isRealIE && gKeyCode == 59)){

		if(!isRealIE) {
			if(gKeyCode == 190 && layerGuessForAutoKeyboardLayerSwitch && (ieKey == 46 || ieKey == 63)) //'/'
				gKeyCode = 191;
			else if(gKeyCode == 188 && layerGuessForAutoKeyboardLayerSwitch && (ieKey == 34 || ieKey == 44)) //''' & '"'
				gKeyCode = 222;
		}
		if(fieldDirection ^ layerSwitched) {
			if(gKeyCode < 186 && gKeyCode >= 65)
				ieKey = CONVERT_TO_HEBREW_LAYER1[gKeyCode - 65];
			else if(gKeyCode < 219 && gKeyCode >= 186)
				ieKey = (event.shiftKey) ? CONVERT_TO_HEBREW_LAYER1_SHIFT_H[gKeyCode - 186] : CONVERT_TO_HEBREW_LAYER1_H[gKeyCode - 186];
		} else {
			if(gKeyCode>=65 && gKeyCode<=90)
				ieKey = gKeyCode + 32;
			else
				ieKey = forceToEnglishLayer(ieKey,event);
		}
	} else if (!isRealIE && event.shiftKey && !fieldDirection && !layerSwitched) { //swap angle brackets
		if(gKeyCode == 62)
			ieKey = 60;
		else if(gKeyCode == 60)
			ieKey = 62;
	}
	return ieKey;
}

function processAutoKeyboardLayerSwitchArabic(ieKey,fieldDirection,event,obj) {
	if((gKeyCode == 66) || (event.shiftKey && ((gKeyCode == 71) || (gKeyCode == 84)))){
		if(fieldDirection ^ layerSwitched)
			return processLamAlef(ieKey,fieldDirection,event,obj);
		else if(ieKey == 1604)
			destroyNextKeyEvent = true;
	}

	if(fieldDirection ^ layerSwitched) {
		if(gKeyCode < 186)
			ieKey = (event.shiftKey) ? CONVERT_TO_ARABIC_LAYER1_SHIFT[gKeyCode - 65] : CONVERT_TO_ARABIC_LAYER1[gKeyCode - 65];
			else if(gKeyCode < 219)
				ieKey = (event.shiftKey) ? CONVERT_TO_ARABIC_LAYER2_SHIFT[gKeyCode - 186] : CONVERT_TO_ARABIC_LAYER2[gKeyCode - 186];
				else if(gKeyCode < 223)
					ieKey = (event.shiftKey) ? CONVERT_TO_ARABIC_LAYER3_SHIFT[gKeyCode - 219] : CONVERT_TO_ARABIC_LAYER3[gKeyCode - 219];
	} else {
		if((gKeyCode != ieKey) && (gKeyCode != ieKey-32))
			ieKey = forceToEnglishLayer(ieKey,event);
	}
	return ieKey;
}

function forceToEnglishLayer(ieKey,event) {
	if (!isRealIE) {
		if(gKeyCode == 62 && !event.shiftKey && layerGuessForAutoKeyboardLayerSwitch) //','
			return 44;
		else if(gKeyCode == 60 && !event.shiftKey) //'.'
			return 46;
		else if(gKeyCode == 190 && layerGuessForAutoKeyboardLayerSwitch && (ieKey == 46 || ieKey == 63)) //'/'
			gKeyCode = 191;
		else if(gKeyCode == 188 && layerGuessForAutoKeyboardLayerSwitch && (ieKey == 34 || ieKey == 44)) //''' & '"'
			gKeyCode = 222;
		else if(gKeyCode == 173) //'_' & '-'
			gKeyCode = 189;
		else if(gKeyCode == 61) //'=' & '+'
			gKeyCode = 187;
		else if(gKeyCode == 59 && layerGuessForAutoKeyboardLayerSwitch) //''' & '~'
			gKeyCode = 192;
		else if((gKeyCode == 59 && !layerGuessForAutoKeyboardLayerSwitch)
			|| (gKeyCode == 58 && layerGuessForAutoKeyboardLayerSwitch)) //';' & ':'
			gKeyCode = 186;
	}

	if(gKeyCode < 186)
		ieKey = (event.shiftKey) ? gKeyCode : gKeyCode + 32;
	else if(gKeyCode < 219)
		ieKey =	(event.shiftKey) ? CONVERT_TO_LOWER_CASE1_SHIFT[gKeyCode - 186] : CONVERT_TO_LOWER_CASE1[gKeyCode - 186];
		else if(gKeyCode < 223)
			ieKey =	(event.shiftKey) ? CONVERT_TO_LOWER_CASE2_SHIFT[gKeyCode - 219] : CONVERT_TO_LOWER_CASE2[gKeyCode - 219];

			return ieKey;
}

function keyPress(event) {
	if(destroyNextKeyEvent || preventAltNumpad || (event.returnValue == false)) {
		_preventDefault(event);

		destroyNextKeyEvent = false;
		return;
	}

	var charCode, replacedKey = null;
	var obj = (isIE) ? event.srcElement : event.target;
	charClass = fieldDirection = (obj.style.direction == "rtl");

	if(isRealIE) {
		if(isIE && selectionStart != curPos) {
			setSelectionVariables(obj, event);
		}
		charCode = event.keyCode;
		ieKey = changeKey(event.keyCode,fieldDirection,event,obj);

		if(disableNumSwapWhenSubmit && (hatsForm.dir == "rtl")){
			if((codePage == 420) && (ieKey > 47) && (ieKey < 58))
				ieKey = event.keyCode = ieKey + 1584;
		}
		else if((codePage == 420) && layerGuess && (ieKey > 47) && (ieKey < 58))//Arabic, transform into Hindi
			ieKey = event.keyCode = ieKey + 1584;
	}
	else {
		if(event.keyCode != 0) //special keys
			return;

		charCode = ieKey = event.charCode;
		if(event.keyCode == CODE_ENTER){
			if(hatsForm.KeyboardToggle.value == "0"){
				event.preventDefault();
				return;
			}

			if(pushMode)
				toggleFieldOrient(obj,false,false);
		}
		else if(event.keyCode == CODE_INSERT) {
			isOverwriteMozilla = !isOverwriteMozilla;
		}
		else if((ieKey > 31) && !event.altKey && !event.ctrlKey){ //regular character
			ieKey = changeKey(ieKey,fieldDirection,event,obj);

			if(charCode != ieKey){
				replacedKey = ieKey;
			}

			if(disableNumSwapWhenSubmit && (hatsForm.dir == "rtl")){
				if((codePage == 420) && (ieKey > 47) && (ieKey < 58))
					replacedKey = ieKey + 1584;
			}
			else if((codePage == 420) && layerGuess && (ieKey > 47) && (ieKey < 58)){//Arabic, transform into Hindi
				replacedKey = ieKey + 1584;
			}
		}
	}

	if(autoKeyboardLayerSwitch) {
		if(((charCode > 64) && (charCode < 91)) || ((charCode > 96) && (charCode < 123)))
			layerGuessForAutoKeyboardLayerSwitch = false;
		else if((charCode > 1487) && !((charCode > 1631) && (charCode < 1642)))
			layerGuessForAutoKeyboardLayerSwitch = true;
	}

	if(((ieKey > 64) && (ieKey < 91)) || ((ieKey > 96) && (ieKey < 123)))
		layerGuess = charClass = false;  //English
	else if((ieKey > 1487) && !((ieKey > 1631) && (ieKey < 1642)))
		layerGuess = charClass = true;
	else if(ieKey == 32) 
		charClass = layerGuess;
	else if(fieldDirection && (((ieKey > 47) && (ieKey < 58)) || ((ieKey > 1631) && (ieKey < 1642)))) 
		charClass = false; //English (Numerals)

	if(prevCharClass != charClass && ieKey != 0) {
		prevCharClass = charClass;
		showStatusBar(obj);
	}

	if(autoPush) {
		fieldDirection = (obj.style.direction == "rtl");
		if(fieldDirection != charClass){ //enter/leave push mode
			setSelectionVariables(obj, event);
			if(selectionStart == curPos)
				toggleFieldOrient(obj,true,pushMode && (curPos == leftPushBound));

			if(autoKeyboardLayerSwitch && (((ieKey > 47) && (ieKey < 58)) || ((ieKey > 1631) && (ieKey < 1642)))) 
				layerSwitched = true;
		}
	}

	if((ieKey > 31) && !event.altKey && !event.ctrlKey){ //regular character
		var selectionLength = (isIE) ? Math.abs(selectionStart - curPos) : obj.selectionEnd - obj.selectionStart;
		if(!isIE) {
			curPos = obj.selectionEnd;
			selectionStart = obj.selectionStart;
		}

		if(!isOverWriteMode() || (selectionLength > 0)) {
			var text = obj.value;
			if(text.length - selectionLength >= maxFieldLen){
				var trimmedValue = (pushMode^isFldreversed) ? text.charAt(0): text.charAt(text.length-1);
				if(trimmedValue == ' ') {
					if(pushMode^isFldreversed){
						obj.value = text.substring(1);
						if (curPos > 0) {
							selectionStart--; curPos--; leftPushBound--; rightPushBound--;
						}
					}
					else
						obj.value = text.substring(0,text.length-1);

					if(isIE)
						setSelectedRange(obj,selectionStart,selectionStart);
					else
						replacedKey = ieKey;
				}
				else {
					_preventDefault(event);
					statusBLOCKED = "X";
					showStatusBar(obj);
					return;
				}
			}
		}
		else {
			if (curPos >= maxFieldLen){
				_preventDefault(event);
				statusBLOCKED = "X";
				showStatusBar(obj);
				return;
			}
		}

		if(pushMode){
			if(!isOverWriteMode() || (leftPushBound == curPos) || (selectionLength > 0))
				leftPushBound += 1 - selectionLength;
		}

		if(obj.title.indexOf(DIRTY) < 0)
			obj.title = obj.title + DIRTY;

		if(isIE) {
			if(selectionLength > 0){
				_preventDefault(event);
				var range = document.selection.createRange();
				range.text = String.fromCharCode(ieKey);
				range.select();
			}
			else
				event.keyCode = ieKey;

			selectionStart = curPos = Math.min(selectionStart,curPos) + 1;
		}
		else {
			replacedKey = (replacedKey != null) ? replacedKey : ieKey;
			if(isLinux && fieldDirection && (codePage == 420) && (ieKey > 1487)){
				_preventDefault(event);
				if(isOverWriteMode() && (selectionStart == curPos))
					text = obj.value.substring(0,selectionStart) + String.fromCharCode(replacedKey) + obj.value.substring(curPos+1);
				else
					text = obj.value.substring(0,selectionStart) + String.fromCharCode(replacedKey) + obj.value.substring(curPos);

				obj.value = ara_type(selectionStart,text,fieldDirection);
				obj.setSelectionRange(selectionStart+1,selectionStart+1);
			}
			else if((replacedKey != null) || isOverWriteMode()) {
				_preventDefault(event);
				replaceFieldText(obj,replacedKey);
			}
		}
	}
}
/////
function replaceFieldText(obj,characterCode) {
	if(isOverWriteMode() && (selectionStart == curPos))
		obj.value = obj.value.substring(0,selectionStart) + String.fromCharCode(characterCode) + obj.value.substring(curPos+1);
	else
		obj.value = obj.value.substring(0,selectionStart) + String.fromCharCode(characterCode) + obj.value.substring(curPos);

	obj.setSelectionRange(selectionStart+1,selectionStart+1);
}

/////
function keyUp(event) {
	var ieKey = event.keyCode;
	var obj = (isIE) ? event.srcElement : event.target;
	fieldDirection = (obj.style.direction == "rtl");

	if(upperCase)
		upperCase = false;

	if(!isIE)
		curPos = obj.selectionStart;

	if (((ieKey == 37) && !fieldDirection)||((ieKey == 39) && fieldDirection))
		processLeftarrow(obj, event);
	else if (((ieKey == 39) && !fieldDirection)||((ieKey == 37) && fieldDirection))
		processRightarrow(obj, event);
	else if (ieKey == CODE_HOME)
		processHome(obj, event);
	else if (ieKey == CODE_END)
		processEnd(obj, event);
}
/////
function keyDown(event) {
	var ieKey = gKeyCode = event.keyCode;
	var obj = (isIE) ? event.srcElement : event.target;

	if(OIA_BIDI.indexOf("X") != -1)
		showStatusBar(obj);

	if(ieKey == 18)
		preventAltNumpad = true;
	else if(!event.altKey)
		preventAltNumpad = false;

	if(event.shiftKey)
		processPush(obj,ieKey);

	if(!isLinux && event.shiftKey && event.altKey) {
		layerGuess = !layerGuess;
		showStatusBar(obj);
		if(autoKeyboardLayerSwitch)
			layerSwitched = !layerSwitched;
	}

	if((event.altKey && !isLinux) || (event.shiftKey && isLinux)){
		if(((ieKey == 111) && !isLinux) || ((ieKey == 102) && isLinux)) {  //Toggle Autopush
			autoPush = !autoPush;
			if(pushMode)
				toggleFieldOrient(obj,true,false);

			autoreverse_value = (autoFldrev) ? "autoreverse=on" : "autoreverse=off";
			hatsForm.AUTOPUSH.value = autoreverse_value + ((autoPush) ? "autopush=on" : "autopush=off");
			showStatusBar(obj);

			preventAltNumpad = true;
		}
		else if(((ieKey == 144) && !isLinux) || ((ieKey == 100) && isLinux)) {  //Field reverse
			processFieldReverse(obj,true);
			preventAltNumpad = true;
		}
		else if(((ieKey == 12) || (ieKey == 101)) & !isSession5250) {  //Toggle Auto field reverse
			autoFldrev = !autoFldrev;
			autopush_value = (autoPush) ? "autopush=on" : "autopush=off";
			hatsForm.AUTOPUSH.value = ((autoFldrev) ? "autoreverse=on" : "autoreverse=off") + autopush_value;

			if(hatsForm.dir != "rtl")
				processAutoFieldReverse(obj,hatsForm);
			else {
				processNumeric(hatsForm);
				processPasswordNumeric(hatsForm);
			}

			showStatusBar(obj);

			preventAltNumpad = true;
		}
	}
	else if (ieKey == CODE_BACKSPACE) {
		processBackspace(obj,event);
	}
    else if(ieKey == CODE_INSERT) {
            if(isChrome){
                isOverwriteMozilla = !isOverwriteMozilla;
            }
	   }
	else if (ieKey == CODE_DELETE) {
		processDelete(obj);
	}
	else if (ieKey == CODE_PAGEUP || ieKey == CODE_PAGEDOWN || ieKey == 38 || ieKey == 40) {
		_preventDefault(event);
	}
	else if(ieKey == CODE_TAB) {
		caretIn = BY_TAB;
	}
	else if(isIE) {
		if(event.ctrlKey & (ieKey == CODE_A)) { //Ctrl+a - select all
			mouseDblClick();
		}
		else if(ieKey == CODE_ENTER){ //enter
			if(hatsForm.KeyboardToggle.value == "0"){
				event.returnValue = false;
				return;
			}
			if(pushMode)
				toggleFieldOrient(obj,false,false);
		}
	}
}
/////
function doSymSwap(symbol){
	switch(symbol)
	{
	case "(":
		symbol = ")";
		break;
	case ")":
		symbol = "(";
		break;
	case "{":
		symbol = "}";
		break;
	case "}":
		symbol = "{";
		break;
	case "[":
		symbol = "]";
		break;
	case "]":
		symbol = "[";
		break;
	case "<":
		symbol = ">";
		break;
	case ">":
		symbol = "<";
		break;
	}
	return symbol;
}

function processHome(obj, event){
	setSelectionVariables(obj, event);
	if(pushMode && (curPos > leftPushBound || curPos < rightPushBound))
		toggleFieldOrient(obj,true,false);
}

function processEnd(obj, event){
	setSelectionVariables(obj, event);
	if(pushMode && (curPos > leftPushBound || curPos < rightPushBound))
		toggleFieldOrient(obj,true,false);
}
/////
function toggleFieldOrient(obj,setCursor,jumpFromPushSegment){
	var len = obj.value.length;
	var delta = 0;
	if(!isIE){
		selectionStart = obj.selectionStart;
		curPos = obj.selectionEnd;
	}

	obj.dir = obj.style.direction = (obj.style.direction == "rtl") ? "ltr" : "rtl";
	reverseText(obj);

	if(autoKeyboardLayerSwitch)
		layerSwitched = false;

	if(setCursor){
		pushMode = !pushMode;

		if(pushMode){
			delta = Math.abs(selectionStart - curPos);
			leftPushBound = rightPushBound = selectionStart = len - Math.max(selectionStart,curPos);
			curPos = selectionStart + delta;
		} else {
			if(jumpFromPushSegment)
				curPos = rightPushBound;

			selectionStart = curPos = len - curPos;
		}

		if(isIE){
			var rng = document.body.createTextRange();
			rng.moveToElementText(obj);
			rng.move("character",selectionStart);
			rng.moveEnd("character",delta);
			rng.select();
		} else {
			obj.setSelectionRange(selectionStart,curPos);
	}
	}

	showStatusBar(obj);
}

function processPush(obj,ieKey){
	if(((ieKey == 144) && !isLinux) || ((ieKey == 103) && isLinux)){
		preventAltNumpad = true;
		if(!pushMode)
			toggleFieldOrient(obj,true,true);
	}
	else if(((ieKey == 111) && !isLinux) || ((ieKey == 104) && isLinux)){
		preventAltNumpad = true;
		if(pushMode)
			toggleFieldOrient(obj,true,true);
	}
}

function processPasswordNumeric(hatsFormObj){
	var count =  hatsFormObj.elements.length;

	for (var j = 0; j < count; j++){
		elementNext = hatsFormObj.elements[j];
		if((elementNext.type == "password") && (elementNext.title.indexOf(NUMERIC) >= 0))
			elementNext.dir = ((hatsFormObj.AUTOPUSH.value).indexOf("autoreverse=off") >= 0) ? "rtl" : "ltr";
	}
}

function processNumeric(hatsFormObj){
	var count =  hatsFormObj.elements.length;

	for  (var j = 0; j < count; j++){
		elementNext = hatsFormObj.elements[j];
		if( (elementNext.type=="text" || elementNext.type=="textarea") && (elementNext.title.indexOf(NUMERIC) >= 0)){
			if((elementNext.style.unicodeBidi == "") || (elementNext.title.indexOf(CONTAINS_GLOBAL_VARIABLE) >= 0)) continue;

			len = elementNext.value.length;
			maxLen = (isRealIE) ? elementNext.cols : elementNext.maxLength;
			if((len == 0) || (len == maxLen))
				elementNext.style.textAlign = (autoFldrev) ? "left" : "right";

			elementNext.dir = elementNext.style.direction = (autoFldrev) ? "ltr" : "rtl";
			reverseText(elementNext);
		}
	}
}

function processAutoFieldReverse(obj,hatsFormObj) {
	var count = hatsFormObj.elements.length;

	if(!isIE && (obj != null))
		curPos =  obj.selectionStart;

	for (var j = 0; j < count; j++){
		elementNext = hatsFormObj.elements[j];
		if( (elementNext.type=="text" || elementNext.type=="textarea") && (elementNext.title.indexOf(NUMERIC) < 0)){
			if((elementNext.style.unicodeBidi == "") || (elementNext.title.indexOf(CONTAINS_GLOBAL_VARIABLE) >= 0)) continue;

			len = elementNext.value.length;
			maxLen = (isRealIE) ? elementNext.cols : elementNext.maxLength;
			if( (len == 0) || (len == maxLen) )
				elementNext.style.textAlign = (autoFldrev) ? "right" : "left";

			elementNext.dir = elementNext.style.direction = (autoFldrev) ? "rtl" : "ltr";
			reverseText(elementNext);
		}
	}

	if(obj != null){
		if (obj.title.indexOf(NUMERIC) >= 0)
			return;

		var textLength = obj.value.length;
		if(isIE){
			var rng = document.body.createTextRange();
			rng.moveToElementText(obj);
			if((curPos != 0) || (textLength != obj.cols))
				selectionStart = curPos = textLength - curPos;

			rng.move("character",curPos);
			rng.select();
		} else {
			if((curPos != 0) || (textLength != obj.maxLength))
				obj.setSelectionRange(textLength - curPos,textLength - curPos);
		}
	}
}

function reverseText(obj){
	text = obj.value;
	len = text.length;
	var temp = "";

	for(i = 0;i < len;i++){
		symbol = text.charAt(len - i - 1);
		symbol = doSymSwap(symbol);
		temp += symbol;
	}

	if(isLinux && (codePage == 420))
		obj.value = ara_type(0,temp,(obj.style.direction == "rtl"));
	else
		obj.value = temp;
}

function processFieldReverse(obj,setCursor){
	isFldreversed = !isFldreversed;
	var len = obj.value.length;

	if(!isIE)
		curPos = obj.selectionStart;

	if(len == 0){
		obj.style.textAlign = (obj.style.direction == "rtl") ? "left" : "right";
		setCursor = false;
	}
	else if((curPos == 0) && (len == maxFieldLen)){
		obj.style.textAlign = (obj.style.direction == "rtl") ? "left" : "right";
		curPos = len - curPos;
	}
	toggleFieldOrient(obj,false,false);

	if(setCursor){
		if(isIE){
			var rng = document.body.createTextRange();
			rng.moveToElementText(obj);
			selectionStart = curPos = len - curPos;
			rng.move("character",curPos);
			rng.select();
		} else
			obj.setSelectionRange(len-curPos,len-curPos);
	}
}

function processDelete(obj){
	if(!isIE){
		selectionStart = obj.selectionStart;
		curPos = obj.selectionEnd;
	}

	if(pushMode && (selectionStart < leftPushBound)){
		if(selectionStart == curPos)
			leftPushBound--;
		else
			leftPushBound -= Math.abs(selectionStart - curPos);
	}

	if(isIE){
		curPos = Math.min(selectionStart,curPos);
		selectionStart = curPos;
	}

	if((obj.title).indexOf(DIRTY) < 0)
		obj.title = obj.title + DIRTY;
}

function processBackspace(obj,event){
	if(isIE) {
		var range = document.selection.createRange();
		noSelection = ((range.text).length == 0) ;
	} else {
		selectionStart = obj.selectionStart;
		curPos = obj.selectionEnd;
		noSelection = (selectionStart == curPos);
	}

	if(noSelection){
		if(curPos > 0){
			if(pushMode && (curPos <= rightPushBound)){
				if(!isIE)
					preventAltNumpad = true;

				_preventDefault(event);
				statusBLOCKED = "X";
				showStatusBar(obj);
				return;
			}
			curPos--;
			if(pushMode)
				leftPushBound--;
		}
		else {
			if(isIE)
				event.returnValue = false;

			statusBLOCKED = "X";
			showStatusBar(obj);
			return;
		}
	} else {
		if(pushMode)
			leftPushBound -= Math.abs(selectionStart - curPos);

		curPos = (selectionStart > curPos) ? curPos : selectionStart;
	}
	selectionStart = curPos;

	if(obj.title.indexOf(DIRTY) < 0)
		obj.title = obj.title + DIRTY;
}

function processLeftarrow(obj, event){
	setSelectionVariables(obj, event);
	if(pushMode && (curPos < rightPushBound))
		toggleFieldOrient(obj,true,false);
}

function processRightarrow(obj, event){
	setSelectionVariables(obj, event);
	if(pushMode && (curPos > leftPushBound))
		toggleFieldOrient(obj,true,false);
}


function JSReorder()                   //Visual LTR -> Logical LTR only
{
	this.INIT                   =  0;
	this.LATIN                  =  1;
	this.LOCAL                  =  2;
	this.NEUTRAL                =  3;
	this.LOCALNUMBER            =  4;
	this.LATINNUMBER            =  5;
	this.LATINNUMERICTERMINATOR =  6;
	this.NUMERICSEPARATOR       =  8;
	this.ENDOFLINE              =  9;
	this.CARRIAGERETURN         = 10;
	this.LINEFEED               = 11;
	this.SPACE                  = 12;
	this.ARABICDIGIT            = 13;
	this.SEGMENTSEPARATOR       = 14;
	this.BLOCKSEPARATOR         = 15;
	this.BIDISPECIAL            = 16;

	this.LATIN_STATE            =  0;
	this.LOCAL_STATE            =  1;
	this.LATIN_NUM_STATE        =  2;
	this.LOCAL_NUM_STATE        =  3;
	this.NEUTRAL_STATE          =  4;
	this.EOL_STATE              =  5;

	this.MASK_STATE             = 0x00FF;
	this.MASK_ACTION            = 0xFF00;

	this.ACTION                 = 0x4000;
	this.NL                     = 0x4100;  //NEUTRALS TO LATIN
	this.NR                     = 0x4200;  //NEUTRALS TO LOCAL

	this.LocalInvert            = 1;
	this.LocalNumInvert         = 2;

	var NL = this.NL;
	var NR = this.NR;

	this.StateTable = new Table(6,10);
	this.StateTable.initTable(
			/*  I	L	R	N	.	D	.	.	E	.*/

			/* 0 LATIN_STATE     */ 0,	0,	1,	0,	-1,	2,	-1,	-1,	0,	5,
			/* 1 LOCAL_STATE     */ 0,	0,	1,	4,	-1,	3,	-1,	-1,	4,	5,
			/* 2 LATIN_NUM_STATE */ 0,	0,	1,	0,	-1,	2,	-1,	-1,	0,	5,
			/* 3 LOCAL_NUM_STATE */ 0,	0,	1,	4,	-1,	3,	-1,	-1,	4,	5,
			/* 4 NEUTRAL_STATE   */ NL|0,   NL|0,	NR|1,	4,	-1,	NR|3,	-1,	-1,	4,	NL|5,
			/* 5 EOL_STATE	     */ 0,	0,	1,	0,	-1,	2,	-1,	-1,	0,	5
	);
	this.getStateTable = getStateTable;

	this.StateToClass = new Array( this.LATIN, this.LOCAL, this.LATINNUMBER, this.LOCALNUMBER,
			this.NEUTRAL, this.ENDOFLINE );

	var I                       = this.INIT;
	var L                       = this.LATIN;
	var R                       = this.LOCAL;
	var D                       = this.LATINNUMBER;
	var X                       = this.LATINNUMERICTERMINATOR;
	var E                       = this.NUMERICSEPARATOR;
	var N                       = this.NEUTRAL;
	var S                       = this.SPACE;
	var C                       = this.CARRIAGERETURN;
	var F                       = this.LINEFEED;
	var A                       = this.ARABICDIGIT;
	var G                       = this.SEGMENTSEPARATOR;
	var B                       = this.BLOCKSEPARATOR;
	var H                       = this.BIDISPECIAL;

	this.UnicodeTable = new Table(9,256);
	this.UnicodeTable.initTable(
			/* Table 0: Unicode 00xx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  I,  F,  N,  N,  C,  N,  N,
			/*1-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*2-*/ S,  N,  N,  X,  X,  X,  N,  N,  N,  N,  N,  N,  E,  N,  E,  E,
			/*3-*/ D,  D,  D,  D,  D,  D,  D,  D,  D,  D,  E,  N,  N,  N,  N,  N,
			/*4-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*5-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  N,  N,  N,  N,  N,
			/*6-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*7-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  N,  N,  N,  N,  N,
			/*8-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*9-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*A-*/ S,  N,  X,  X,  X,  X,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*B-*/ X,  X,  D,  D,  N,  N,  N,  N,  N,  D,  N,  N,  N,  N,  N,  N,
			/*C-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*D-*/ L,  L,  L,  L,  L,  L,  L,  N,  L,  L,  L,  L,  L,  L,  L,  L,
			/*E-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*F-*/ L,  L,  L,  L,  L,  L,  L,  N,  L,  L,  L,  L,  L,  L,  L,  L,

			/* Table 1: Unicode 05xx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*1-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*2-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*3-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*4-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*5-*/ L,  L,  L,  L,  L,  L,  L,  N,  N,  L,  L,  L,  L,  L,  L,  L,
			/*6-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*7-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*8-*/ L,  L,  L,  L,  L,  L,  L,  L,  N,  L,  N,  N,  N,  N,  N,  N,
			/*9-*/ N,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*A-*/ R,  R,  N,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*B-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  N,  R,  R,  R,  R,  R,
			/*C-*/ R,  R,  R,  R,  R,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*D-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*E-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  N,  N,  N,  N,  N,
			/*F-*/ R,  R,  R,  R,  R,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,

			/* Table 2: Unicode 06xx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  R,  N,  N,  N,
			/*1-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  R,  N,  N,  N,  N,
			/*2-*/ N,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*3-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  N,  N,  N,  N,  N,
			/*4-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*5-*/ R,  R,  R,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*6-*/ A,  A,  A,  A,  A,  A,  A,  A,  A,  A,  X,  A,  A,  R,  N,  N,
			/*7-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*8-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*9-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*A-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*B-*/ R,  R,  R,  R,  R,  R,  R,  R,  N,  N,  R,  R,  R,  R,  R,  N,
			/*C-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  N,
			/*D-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*E-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  N,  N,
			/*F-*/ D,  D,  D,  D,  D,  D,  D,  D,  D,  D,  N,  N,  N,  N,  N,  N,

			/* Table 3: Unicode 20xx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ S,  S,  S,  S,  S,  S,  S,  E,  S,  S,  S,  S,  N,  N,  L,  R,
			/*1-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*2-*/ N,  N,  N,  N,  N,  N,  N,  N,  B,  B,  H,  N,  N,  N,  H,  N,
			/*3-*/ X,  X,  X,  X,  X,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*4-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*5-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*6-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  H,  H,  H,  H,
			/*7-*/ D,  N,  N,  N,  D,  D,  D,  D,  D,  D,  X,  X,  N,  N,  N,  N,
			/*8-*/ D,  D,  D,  D,  D,  D,  D,  D,  D,  D,  X,  X,  N,  N,  N,  N,
			/*9-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*A-*/ X,  X,  X,  X,  X,  X,  X,  X,  X,  X,  X,  X,  N,  N,  N,  N,
			/*B-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*C-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*D-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*E-*/ L,  L,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*F-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,

			/* Table 4: Unicode 21xx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*1-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*2-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*3-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*4-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*5-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*6-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*7-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*8-*/ L,  L,  L,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*9-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*A-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*B-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*C-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*D-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*E-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*F-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,

			/* Table 5: Unicode 30xx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ S,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*1-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*2-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*3-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*4-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*5-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*6-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*7-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*8-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*9-*/ L,  L,  L,  L,  L,  N,  N,  N,  N,  L,  L,  L,  L,  L,  L,  N,
			/*A-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*B-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*C-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*D-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*E-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*F-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  N,

			/* Table 6: Unicode FBxx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ L,  L,  L,  L,  L,  L,  L,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*1-*/ N,  N,  N,  L,  L,  L,  L,  L,  N,  N,  N,  N,  N,  N,  R,  R,
			/*2-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*3-*/ R,  R,  R,  R,  R,  R,  R,  N,  R,  R,  R,  R,  R,  N,  R,  N,
			/*4-*/ R,  R,  N,  R,  R,  N,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*5-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*6-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*7-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*8-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*9-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*A-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*B-*/ R,  R,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*C-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*D-*/ N,  N,  N,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*E-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*F-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,

			/* Table 7: Unicode FExx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*1-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*2-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*3-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*4-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*5-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*6-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*7-*/ R,  R,  R,  N,  R,  N,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*8-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*9-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*A-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*B-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*C-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*D-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*E-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,
			/*F-*/ R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  R,  N,  N,  N,

			/* Table 8: Unicode FFxx */
			/************************************************************************/
			/*     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F    */
			/************************************************************************/
			/*0-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*1-*/ D,  D,  D,  D,  D,  D,  D,  D,  D,  D,  N,  N,  N,  N,  N,  N,
			/*2-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*3-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  N,  N,  N,  N,  N,
			/*4-*/ N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*5-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  N,  N,  N,  N,  N,
			/*6-*/ N,  N,  N,  N,  N,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*7-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*8-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*9-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*A-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,
			/*B-*/ L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  L,  N,
			/*C-*/ N,  N,  L,  L,  L,  L,  L,  L,  N,  N,  L,  L,  L,  L,  L,  L,
			/*D-*/ N,  N,  L,  L,  L,  L,  L,  L,  N,  N,  L,  L,  L,  N,  N,  N,
			/*E-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,
			/*F-*/ N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N,  N
	);
	this.getUnicodeTable = getUnicodeTable;

	this.stringAsClasses = new Array();
	this.terminatorFlag = 0;

	this.doReorder = doReorder;
	this.stringToClass = stringToClass;
	this.applyClass = applyClass;
	this.getCharClass = getCharClass;
	this.getCharacterType = getCharacterType;
	this.doAction = doAction;
	this.invertSegment = invertSegment;
	this.needInvert = needInvert;
	this.doSymSwap = doSymSwap;
}

function getStateTable(){
	return this.StateTable;
}

function getUnicodeTable(){
	return this.UnicodeTable;
}

function getCharacterType(ch){
	var utab = this.getUnicodeTable().getArray();
	var str = new String(ch);
	var code = str.charCodeAt(0);
	var index = (code & 0xFF00) >> 8;
	switch (index)
	{
	case 0x00: break;
	case 0x05: index = 1;
	break;
	case 0x06: index = 2;
	break;
	case 0x20: index = 3;
	break;
	case 0x21: index = 4;
	break;
	case 0x30: index = 5;
	break;
	case 0xFB: index = 6;
	break;
	case 0xFE: index = 7;
	break;
	case 0xFF: index = 8;
	break;
	default:   return(this.NEUTRAL);
	}
	return (utab[index][code & 0xFF]);
}

function doReorder(str){
	if (str == null || str.length < 2)
		return (str);
	this.stringToClass(str);
	return (this.applyClass(str));
}

function stringToClass(str){
	var stab = this.getStateTable().getArray();
	var prevState = 0;
	var initialCharClass = this.LATIN;
	var curState = stab[prevState][initialCharClass];
	var curCharClass;
	var i;

	for (i=0; i<str.length; i++){
		prevState = curState;
		curCharClass = this.getCharClass(str,i);
		curState = stab[prevState][curCharClass];
		this.stringAsClasses[i] = this.StateToClass[curState & this.MASK_STATE] | this.terminatorFlag;
		this.doAction(curState,i);
		curState &= this.MASK_STATE;
	}

	for (i=0; i<str.length; i++)
		if ((this.stringAsClasses[i] & this.MASK_ACTION) == this.ACTION)
			this.stringAsClasses[i] &= this.MASK_STATE;
}

function getCharClass(str,index){
	var prev = this.NEUTRAL;
	var next = this.NEUTRAL;
	var curr;
	var result;

	this.terminatorFlag = 0;
	if (index > 0)
		prev = this.getCharacterType(str.charAt(index-1));
	curr = this.getCharacterType(str.charAt(index));

	switch (curr){
	case this.BLOCKSEPARATOR:
	case this.SEGMENTSEPARATOR:
		result = this.LATIN;
		break;
	case this.ARABICDIGIT:
		result = this.LATINNUMBER;
		break;
	case this.LATINNUMERICTERMINATOR:
		if (index>0)
			prev = this.stringAsClasses[index-1];
		if (prev == this.LATINNUMBER || prev == this.LOCALNUMBER)
			result = this.LATINNUMBER;
		else{
			this.terminatorFlag = this.ACTION;
			result = this.NEUTRAL;
		}
		break;
	case this.NUMERICSEPARATOR:
		result = this.NEUTRAL;
		if (prev == this.LATINNUMBER){
			if (index < str.length - 1)
				next = this.getCharacterType(str.charAt(index+1));
			switch (next){
			case this.LATINNUMBER:
				result = next;
				break;
			case this.LOCAL:
			case this.NEUTRAL:
				result = curr;
				break;
			}
		}
		break;
	case this.BIDISPECIAL:
	case this.SPACE:
		result = this.NEUTRAL;
		break;
	case this.CARRIAGERETURN:
	case this.LINEFEED:
		result = this.ENDOFLINE;
		break;
	default:
		result = curr;
	}
	return (result);
}

function doAction(currState,index){
	var action = currState & this.MASK_ACTION;
	var classFromAction;

	switch (action){
	case this.NL:
	case this.NR:
		classFromAction = (action & this.MASK_ACTION & ~this.ACTION) >> 8;
		while (index-- > 0){
			if ((this.stringAsClasses[index] & this.MASK_STATE) == this.NEUTRAL){
				if ((this.stringAsClasses[index] & this.MASK_ACTION) &&
						(this.stringAsClasses[index+1] == this.LOCALNUMBER ||
								this.stringAsClasses[index+1] == this.LATINNUMBER))
					this.stringAsClasses[index] = this.stringAsClasses[index+1];
				else
					this.stringAsClasses[index] = classFromAction;
			}
			else
				break;
		}
		break;
	}
}

function applyClass(str){
	var array = new Array(str.length);
	var Str = new String("");
	var i;
	for (i=0; i<str.length; i++)
		array[i] = str.charAt(i);
	this.invertSegment(array,this.LocalNumInvert);
	this.invertSegment(array,this.LocalInvert);
	for (i=0; i<array.length; i++)
		Str += array[i];
	return (Str);
}

function needInvert(invertType,index){
	switch (invertType){
	case this.LocalInvert:
		return (this.stringAsClasses[index] == this.LOCAL ||
				this.stringAsClasses[index] == this.LOCALNUMBER);
	case this.LocalNumInvert:
		return (this.stringAsClasses[index] == this.LOCALNUMBER);
	default:
		return (false);
	}
}

function invertSegment(s,invertType){
	var start = 0;
	var end;
	var sum;
	var tmp;
	var i;

	while (start < s.length){
		if (this.needInvert(invertType,start)){
			end = start + 1;
			while (end < s.length){
				if (!this.needInvert(invertType,end))
					break;
				end++;
			}
			sum = end - 1 + start;
			for (; start < sum - start; start++){
				tmp = this.doSymSwap( s[start] );
				s[start] = this.doSymSwap( s[sum-start] );
				s[sum-start] = tmp;
			}
			start = end - 1;
		}
		start++;
	}
}

//--------------------------------------------------------

function Table(nrows,ncols){
	var i = 0;
	this.trows = nrows;
	this.tcols = ncols;
	this.rows = new Array(nrows);
	for (i=0; i<nrows; i++)
		this.rows[i] = new Array(ncols);
	this.initTable = initTable;
	this.getArray = getArray;
}

function getArray(){
	return this.rows;
}

function initTable(){
	var i = 0;
	var j = 0;
	var k = 0;
	var l = 0;
	var m = Math.min(this.trows*this.tcols,initTable.arguments.length);
	for (k=0; k<m; k++,l++){
		if (l == this.tcols){
			i++;
			j=0;
			l=0;
		}
		this.rows[i][j++] = this.initTable.arguments[k];
	}
}
