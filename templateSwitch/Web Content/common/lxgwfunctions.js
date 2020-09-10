//Licensed Materials - Property of IBM

//AIMCHSR00
//Copyright IBM Corp. 2003, 2016  All Rights Reserved.

//.============================================================================
//.Function:  Forms and Widgets data handlers
//.============================================================================



















var statusBIDI = "";
var enableBIDI = false;
var isRealIE = false;
var OIA_BIDI = "&nbsp;";
var intNumberOfColumns = 80;
var intNumberOfRows = 24;
var intCurrentPosition = 1;

var oiabc = "";
var nrtc = 1920;
var incount = 0;
var startin = [];
var lengthin = [];
var highlightInputField = false;
var gobject;
var screenLocked = false;
var enableDBCSSession = false;
var enableDBCSEuro = false;
var enableAutoConvertSBCStoDBCS = false;
var autoEraseFields = false;
var suppressUnchangedData = false;
var useAccentedCharacters = false;
var showUnProtectedSosiAsSpace = true;
var enableBusyPage = false;
var selectAllonFocus = true;
var CodePage = 37;
var eliminateMaxLengthForDBCSFields = false;
var ChromeDefaultMaxLength = 524288;   
var browserActualCaretPosition = 0;    

/***************************************************
 * NOTICE: DO NOT MODIFY THE FOLLOWING VARIABLES!! *
 ***************************************************/
var hatsForm;
var activeID;
var portletID;
var formID;

/***************************************************/

var lasttextfield; //last text field which had focus

var upperCase = false;
var appletInitialized = false;
window.onunload = checkForClose;
//Status Window
var statwin= [];
statwin[0]=" (,)";
statwin[1]="|";
statwin[2]=" ";
statwin[3]=" ";

var conntype = 3270;
var var_setupValuexxxaction="";
var var_setupValuepos="";
var prevPositioningElement = null;
var prevPositioningElementClassName = null;
var orig = null;  //pID, inputfieldname, value
var autoAdvance=false;
var overwritemodeenabled=true; //set to true to enable this for your application
var overwriteSetting = 7; //new base setting
var isOverwriteMozilla = false;
var exceedString = null; 
var carettrackingenabled=true;
var hatsFocusedClass='HATSFOCUSED';
var hatsUnfocusedClass='HATSUNFOCUSED';
var xMousePos = 0; // Horizontal position of the mouse on the screen
var yMousePos = 0; // Vertical position of the mouse on the screen
var xMousePosMax = 0; // Width of the page
var yMousePosMax = 0; // Height of the page
var calendarRequest=null;
var xhrservercheck=null;
var pageSubmitTimeout=-1;
var pageSubmitTimeoutRetries = 0;
var pageSubmitTimeoutRetryDelay = 0;
var evX = null;
var evY = null;
var hatsCalendarID="";
var initialInputFocusFromCursor = true;
var initialStartingInputName = "";
var nextFieldForDropDown=true;
var autoTabInputFields=false;
var dragapproved = false;
var dragvert = false;
var dragmoving = false;
var dragthumbObj = null;
var dragthumbID = null;
var dragStartX;
var dragStartY;
var dragStyleTop = 0;
var dragStyleLeft = 0;
var dragMaxUpMove = 0;
var dragMaxDownMove = 0;
var dragDelta = 0;
var scrollbarEnabled = false;
var scrollbarCount = 0;
var scrollbarArray;
var scrollbarFormArray;
var xhr=null;
var xhrid=null;
var xhruri=null;
var xhrwidget=null;
var xhrsettings=null;
var xhrhandler=null;
var xhrTR=null;
var tableRowArea=null;
var exactCursorLockedChoice=0;
var exactCursorLockedChoiceForDBCS=0;
var docgEbID=true;
var inMSB=false;

var IE10Version = 10.0; //SP3a

if(!isIEMobile){
	if (isNS4){ //Netscape 
		document.captureEvents(Event.MOUSEMOVE);
		document.onmousemove = captureMousePosition;
	}
	else if (isIE4){ //Internet Explorer
		document.onmousemove = captureMousePosition;
	}
	else if (isNS6){ //Netscape 6 
		document.onmousemove = captureMousePosition;
	}
}

if (parent != self){
	parent.frames[0].connect = 1;
}

function documentgetElementById(id){
	var val;
	if(docgEbID){
		try{
			val = document.getElementById(id);
			if(val!=null) return val;
		}catch(e){docgEbID=false;}
	}
	if(document.all){
		val = document.all[id];
		if(val!=null) return val;
	}
	return null;
}

//Resets hatsForm and other variables
function resetGlobals(){

	var tmp = document.forms;
	if(tmp && (typeof ibmCfg != "undefined")){
		if((tmp.length > 0) && ibmCfg.themeConfig.isPageRenderModeCSA){
			for(var i=0,iL=tmp.length; i<iL; ++i){
				if((tmp.item(i).name == portletID) && (tmp.item(i).style.display == "none")){
					var tmpParent = tmp.item(i).parentNode;
					tmpParent.removeChild(tmp.item(i));
				} else {
					hatsForm = tmp.item(i);
				}
			}
		}

		if(window.heartbeatVarsDB && ibmCfg.themeConfig.isPageRenderModeCSA){
			stopHeartbeat(portletID);
		}
	}

	if(hatsForm!=null){
		if (!hatsForm.CURSORPOSITION){
			var newCursorPosition = createInputElement("hidden", "CURSORPOSITION", "1");
			hatsForm.appendChild(newCursorPosition);
		}
		if (!hatsForm.COMMAND){
			var newCommand = createInputElement("hidden", "COMMAND", "[enter]");
			hatsForm.appendChild(newCommand);
		}
		setTimeout(resetCursor, 0);
	}
	
	
	keyPressed = false;
}

//Info constructor.
//This is overridden by the one in TabbedFolder.js, if that script is included
function Info(HTInfo, useTF, focusFieldName, hatsportletid){
	this.HTInfo = HTInfo;
	this.useTF = useTF;
	this.focusFieldName = focusFieldName;
	this.hatsportletid = hatsportletid;
}

//Creates an Info instance
//this is overridden by the one in TabbedFolder.js, if that script is included
function getInfo(id){
	if (id == "default" || id == null){
		id = "hatsportletid";
	}
	var ret = new Info(null,false,null,id);
	return (ret);
}

function getLinkElement(intPosition, pID){
	if (isNaN(intPosition)) return false;
	var name = "link_" + intPosition + (pID != null && pID != "HATSForm" ? "_" + pID : "");
	var e = documentgetElementById(name);
	if (e && e != null){
		return e;
	} else {
		return null;
	}
}

function getProtectedTextElement(intPosition, pID){
	if (isNaN(intPosition)) return false;
	var name = "p_" + intPosition + (pID != null && pID != "HATSForm" ? "_" + pID : "");
	var e = documentgetElementById(name); 
	if (e && e != null){
		return e;
	} else {
		return null;
	}
}

//Sets focus on InputField
function setInputFieldFocus(){
	try { //throws exceptions in portal due to concurrency
		
		var k=0;
		var cursorSet=false;
		updateStatusWindow();
		var intInitialCursorPosition=0;
		var elementNext;
		
		
		
		
		
		
		
		hatsForm.onsubmit = function(){ms("[enter]"); return false;}; 

		if (hatsForm.CURSORPOSITION.value != null){
			intInitialCursorPosition = hatsForm.CURSORPOSITION.value;
		}

		window.focus();
		if(!initialInputFocusFromCursor){
			hatsForm.CURSORPOSITION.value = intInitialCursorPosition;
			elementNext= findStartingInputItem();
			if(elementNext!=null){
				lasttextfield=elementNext;
				if (elementNext.name!=null){
					getInfo(hatsForm.name).focusFieldName = elementNext.name;
				}
				elementNext.focus();
			}
			return;
		}
		var elements=hatsForm.elements;
		var eName,eType;
		for (var j=0,jL=elements.length; j<jL; ++j){
			if (k!=1){
				elementNext = hatsForm.elements[j];
				eName=elementNext.name;
				eType=elementNext.type;
				if ((eType == "text") || (eType == "textarea") || (eType == "password") || (eType == "select-one") || (eType == "checkbox") || (eType == "radio")){
					if (eName!=null){
						if (eName.length>0){
							var elemlst=eName.split("_");
							if ((elemlst.length==3) || (elemlst.length>3)){
								if (elemlst[0].indexOf("in")!=-1){
									var start=parseInt(elemlst[1],10);
									var len=parseInt(elemlst[2],10);
									if ((intInitialCursorPosition >= start) && (intInitialCursorPosition < (start + len))){ //back from help, the cp is at the end of the field
										var cursorOffset = 0; 
										if (intInitialCursorPosition > start){ 
											cursorOffset = intInitialCursorPosition - start; 
											for(var i=0; i<cursorOffset; ++i){ 
												if (isDBCSChar(elementNext.value.charAt(i), enableDBCSSession, enableDBCSEuro, CodePage)){ 
													if(i+1 < cursorOffset && isSurrogate(elementNext.value.charAt(i), elementNext.value.charAt(i+1))) 
														i++; 
													cursorOffset--; 
												}
											}
										}
										if (isNS4){
											if ((elementNext.visibility != "hidden") && (!elementNext.disabled)){
												elementNext.focus();
												lasttextfield=elementNext;
												k = 1;
												hatsForm.CURSORPOSITION.value = intInitialCursorPosition;
												getInfo(hatsForm.name).focusFieldName = eName;
												cursorSet = true;
												break;
											}
										} else if ((elementNext.style.visibility != "hidden") && (!elementNext.disabled)){
											elementNext.focus();
											if (enableBIDI){ 
												if((elementNext.style.direction == "rtl")  ^ (hatsForm.dir == "rtl")){
													var maxLen = (isRealIE) ? elementNext.cols : elementNext.maxLength;
													if(elementNext.value.length == maxLen)
														cursorOffset = maxLen - cursorOffset - 1;
												}
												selectionStart = curPos = cursorOffset;
											}

											if (cursorOffset > 0){
												if (elementNext.createTextRange)  {
													var range = elementNext.createTextRange();
													range.collapse();
													range.moveStart('character', cursorOffset);
													range.select();
												} else {
													elementNext.setSelectionRange(cursorOffset, cursorOffset);
												}
											}
											lasttextfield=elementNext;
											k = 1;
											hatsForm.CURSORPOSITION.value = intInitialCursorPosition;
											getInfo(hatsForm.name).focusFieldName = eName;
											cursorSet = true;
											break;
										}
									}
								}
							}
						}
					}
				}
			}
		}

		// If the cursor has not been positioned, check for a link with the right ID
		if (!cursorSet){
			var lElem = getLinkElement(intInitialCursorPosition, hatsForm.name);
			if (lElem != null){
				lElem.focus();
				cursorSet = true;
			}
		}

		//If the cursor has not been positioned in a field, check to see if it can be positioned on protected text
		if (!cursorSet && getProtectedTextElement(intInitialCursorPosition, hatsForm.name) != null){
			setCursorPosition(intInitialCursorPosition, hatsForm.name);
		}
	} catch(e){}
}

//Initializes input field focus
function initInputFieldFocus(intPutItHere){
	intInitialCursorPosition = intPutItHere;
}

//Initializes and sets input field focus
function resetCursor(){
	try{ 
		if (hatsForm.CURSORPOSITION.value){
			initInputFieldFocus(hatsForm.CURSORPOSITION.value);
		}
	}catch(e){
		return;
	}
	setInputFieldFocus();
	//for mozilla and IE10 only
	setInitValuesforHidden();
}

//Updates hatsForm cursor position value
function updateCursor(cursor){
	if(typeof hatsForm.notRefreshSafe != "undefined"){
		return;
	}
	hatsForm.CURSORPOSITION.value = cursor;
	resetCursor();
}

//Check for close when unloading
function checkForClose(){
	if (self.screenTop < 9000 && appletInitialized && document.HATSApplet){
		document.HATSApplet.doNotKillOnExit();
	}
}

//Checks whether specified field is a HATS input field
function isHInput(type,name){
	if ((type == null) || (name == null)) return false;
	if ((type == "text") || (type == "password") || (type == "textarea") ||
			(type == "hidden") || (type == "checkbox") ||
			(type == "select-one") || (type == "radio")){
		var pool = name.split("_");
		if (pool.length>=3){
			if ((pool[0].indexOf("in")!=-1) && (!isNaN(pool[1])) && (!isNaN(pool[2]))){
				return true;
			}
		}
	}
	return false;
}


//Returns an array of input elements matching pos in e
function getElemsin_pos_y(e, pos){
	if (pos == "any") pos = -1; //faster compares
	var hatsInElems = [];
	var j=0,elemNext,eName;
	var contents = [];
	for (var i=0,iL=e.elements.length; i<iL; ++i){
		elemNext = e.elements[i];
		eName=elemNext.name;
		if (eName != null){
			if (eName.length > 0){
				if (isHInput(elemNext.type, eName)){
					if (pos == -1){
						contents[0] = elemNext;
						contents[1] = i;
						hatsInElems[j++] = contents;
					}
					else if (pos == pool[1]){
						contents[0] = elemNext;
						contents[1] = i;
						hatsInElems[j++] = contents;
					}
				}
			}
		}
	}
	return hatsInElems;
}

//Returns an array of input elements in e
function getElemsin_x_y(e){
	return getElemsin_pos_y(e,"any");
}

//returns clone of Form with only objects necessary for the http request
function formClone(inForm){
	//create new form
	var newHatsForm = document.createElement("form");
	//copy essential methods and attributes
	newHatsForm.acceptCharset = inForm.acceptCharset;
	newHatsForm.enctype = inForm.enctype;
	newHatsForm.action = inForm.action;
	newHatsForm.id = inForm.id;
	newHatsForm.method = inForm.method;
	newHatsForm.name = inForm.name;
	newHatsForm.target = inForm.target;
	newHatsForm.className = inForm.className;
	newHatsForm.dir = inForm.dir;
	newHatsForm.lang = inForm.lang;
	newHatsForm.title = inForm.title;
	newHatsForm.onsubmit = inForm.onsubmit;
	
	//copy all non-disabled form elements
	var inElement,newElement,iName,iType,nName;
	for(var i=0,iL=inForm.elements.length; i<iL; ++i){
		inElement = inForm.elements[i];
		iType=inElement.type;
		if (iType == undefined) 
			continue; 
		iName=inElement.name;
		//copy element if it was not removed
		if(!inElement.disabled && iName!="disabled" && iName!=""){
			newElement = null;
			// @AG1,@AG2 IE9 doesn't support angle brackets for creating elements dynamically with createElement
			// and IE9 allow set attributes on radio elements created dynamically with create Element, therefore IE version
			// check is added because of difference in behaviour of IE after IE8.
			if (((iType == "radio") || (iType == "checkbox")) && isIE && IEVersion > -1 && IEVersion <= 8.0){  //SP3c
				// IE does not allow to set attributes on radio  elements created dynamically with createElement.
				var checked="";
				if (inElement.checked){
					checked="checked";
				}
				newElement = document.createElement('<input type="'+iType+'" name="'+inElement.name+'" value="'+inElement.value+'" style="visibility:hidden" style="display:none" '+checked+'></input>');
						
			} else {
				//element tagName create
				newElement = document.createElement("input");
				//copy necessary element attributes for response data
				newElement.type = iType;
				newElement.name = iName;
				newElement.value = getPreferredHatsFormElementValue(inElement); 
				if ((iType == "radio") ||(iType == "checkbox")) 
					newElement.checked = inElement.checked; 
				//attach new element to new form
				newElement.style.visibility = 'hidden'; 
				newElement.style.display = 'none'; 
			}
			newHatsForm.appendChild(newElement);
			nName=newElement.name;
			//create links for direct-reference HATS form variables
			
			if((nName=="SESSIONNUMBER") && (!newHatsForm.SESSIONNUMBER)){newHatsForm.SESSIONUMBER = newElement;}
			if((nName=="PERF_TIMESTAMP")&& (!newHatsForm.PERF_TIMESTAMP)){newHatsForm.PERF_TIMESTAMP = newElement;}
			if((nName=="COMMAND") && (!newHatsForm.COMMAND)){newHatsForm.COMMAND = newElement;}
			if((nName=="CURSORPOSITION") && (!newHatsForm.CURSORPOSITION)){newHatsForm.CURSORPOSITION = newElement;}
			if((nName=="KeyboardToggle") && (!newHatsForm.KeyboardToggle)){newHatsForm.KeyboardToggle = newElement;}
			if((nName=="SESSIONID") && (!newHatsForm.SESSIONID)){newHatsForm.SESSIONID = newElement;}
			if((nName=="CARETPOS") && (!newHatsForm.CARETPOS)){newHatsForm.CARETPOS = newElement;}
			if((nName=="LINESIZE") && (!newHatsForm.LINESIZE)){newHatsForm.LINESIZE = newElement;}
		}
	}
	//attach new form to existing document
	newHatsForm.style.visibility = 'hidden';
	newHatsForm.style.display = 'none'; 
	document.body.appendChild(newHatsForm);
	//set the original reference to point to new form
	return newHatsForm;
}

//Lists string description of hatsForm elements
function listElements(){
	var mystring = "";
	for (var i=0,iL=hatsForm.elements.length,element; i<iL; ++i){
		element=hatsForm.elements[i];
		mystring = mystring + ":" + element.name + "=" + element.value + "(" + element.disabled + ")";
	}
	return mystring;
}

//Adjusts cursor position based on the command.
//Returns the intCommand itself if it is an enptui command
function adjustPosition(intCommand,pID){
	setHatsFocus(pID);
	if(typeof(intCommand) != "string"){
		intCommand = String(intCommand);
		return null;
	}

	if ((intCommand.indexOf("[")==-1) && (intCommand.indexOf("enptui")==-1) && (intCommand.indexOf("macrorun_")==-1))
		return intCommand;

	var elements=hatsForm.elements;
	var elementNext,eName,eType;
	for (var i=0,iL=hatsForm.elements.length; i<iL; ++i){
		elementNext = elements[i];
		eName=elementNext.name;
		eType=elementNext.type;
		if (isHInput(eType,eName)){
			inputAdjust(elementNext,true);

			if (eType=="checkbox"){
				elementNext.disabled=true;
			} else {
				var pool = eName.split("_");
				var pos = parseInt(hatsForm.CURSORPOSITION.value);
				var len = parseInt(pool[2]);
				var ipos = parseInt(pool[1]);
				if ((ipos <= pos) && ((ipos+len) >= pos)){
					var strlen=elementNext.value.length;
					var moveCursorToEndOfField = true; 

					if (carettrackingenabled  && (isIE||MOZILLA||OPERA)){ 
						
						if ((intCommand == "[fldext]") || (intCommand == "[qfldext]") ||
								(intCommand == "[field+]") || (intCommand == "[field-]") || (intCommand == "[eraseeof]") || inMSB){
							moveCursorToEndOfField = false;
						}
						
						
						else if (isCaretTrackingType(eType)){
							updateCursorPosition(true,pID);
							moveCursorToEndOfField = false;
						}
					}

					
					
					if (moveCursorToEndOfField){
						if (len>1){
							//Move cursor to the end of the field
							if ((strlen<len) && (strlen>0)){
								pos=(ipos)+strlen;
							} else if (strlen==0){
							}
							else {
								pos=(ipos)+len-1;
							}
						}
						hatsForm.CURSORPOSITION.value=pos;
					}
					hatsForm.CARETPOS.value=ipos+strlen;
					
					
				}
			}
		}
	}
	return intCommand;
}

//Processes a command on specified pID
function ms(intCommand,pID){
	var oldformname = hatsForm!=null?hatsForm.name:"";
	var iCmd=intCommand;
	setHatsFocus(pID);
	if (iCmd == "ResetButton"){
		hatsForm.reset();
		if (enableBIDI) adjustReversedFields();
		return;
	}

	
	if((!enableBusyPage && (typeof hatsForm.beensubmitted == "undefined")) && iCmd != 'ResetButton' && iCmd !='refresh' && iCmd != 'disconnect' && iCmd != 'default'){
		for (var i=0,hL=hatsForm.elements.length,element; i<hL; ++i){
			element=hatsForm.elements[i];
			if(window.isDijit && isDijit(element)){
				var djtme=getDijit(element);
				if(getDijitAttribute(djtme,"validateOnSubmit")=='true' && !djtme.isValid()){
					djtme.focus();
					return;
				}
			}
		}
	}

	if (!enableBusyPage && (typeof hatsForm.beensubmitted == "undefined")){
		hatsForm.beensubmitted=true;
	} else {
		if (!enableBusyPage && (typeof hatsForm.beensubmitted != "undefined"))
			return;
	}

	if (iCmd == "disconnect") closePrintJobWindow();
	
	if (gobject != null && window.isDijit && isDijit(gobject)){
		var djtme=getDijit(gobject);
		
		if (djtme.declaredClass == "dijit.form.FilteringSelect"){
			try {
				if (djtme.isValid() && djtme.item === undefined)
					djtme._onBlur();
			} catch(e){}
			if (!djtme.isValid()){
				djtme.reset();
			}
		}
	}
	if (gobject != null && oldformname==hatsForm.name) checkInput(gobject,iCmd); 
	setExtraInfo();
	hatsForm.COMMAND.value = adjustPosition(iCmd,pID);

	if(!enableDBCSSession){
		if(exactCursorLockedChoice>0){hatsForm.CURSORPOSITION.value=exactCursorLockedChoice; hatsForm.CARETPOS.value=exactCursorLockedChoice;}
	} else {
		if(exactCursorLockedChoiceForDBCS>0){hatsForm.CURSORPOSITION.value=exactCursorLockedChoiceForDBCS; hatsForm.CARETPOS.value=exactCursorLockedChoiceForDBCS;}
	}

	if (enableBIDI){
		if (isNS4){
			hatsForm.visibility = 'hidden';
		} else {
			hatsForm.style.visibility = 'hidden';
			reverseBeforeSubmit(hatsForm,iCmd);
		}
	}

	var cmdVal = hatsForm.COMMAND.value;
	if (!appletInitialized || !document.HATSApplet || !document.HATSApplet.isUseDynamicUpdates() || cmdVal == 'refresh' || cmdVal == 'disconnect' || cmdVal == 'default'){
		if(!isIEMobile){
			//SP2 start
			var areaNameNode = document.getElementById("AREA_NAME_ITEM_ID");
			if (areaNameNode) {
				var areaName = areaNameNode.getAttribute("VALUE");
				var divSystemWait = document.getElementById(areaName+"_ITEM_ID_systemWait");
				if (divSystemWait && divSystemWait.hasChildNodes()) {
					for (var i=0; i<divSystemWait.childNodes.length; i++) {
						var node = divSystemWait.childNodes.item(i);
						if (node && (node.nodeName == "img" || node.nodeName == "IMG")) {
							node.style.visibility="visible";
						}
					}
				}
			}
			//SP2 end
			hatsForm=formClone(hatsForm);
		}
		hatsForm.submit();
		startSubmitTimer();
	} else {
		window.focus();
		document.HATSApplet.userRequest();
	}
}

//Performs same function as ms() except that
//it is processes only when the "key" is not empty.
function msNonBlank(key,formID){
	if ((key!=null) && (key!="")){
		ms(key,formID);
	}
}

//submits hatsForm
function submitForm(){
	hatsForm.submit();
}

//Sets a refresh command
function appletRefresh(){
	if ((typeof hatsForm.beensubmitted == "undefined") && (typeof hatsForm.notRefreshSafe == "undefined")){
		hatsForm.beensubmitted = true;
	} else {
		return -1;
	}
	if (gobject != null) checkInput(gobject);
	setExtraInfo();
	hatsForm.COMMAND.value = "refresh";
}

//Performs refresh command
function appletFullPollRefresh(pID){
	if (document.forms[pID] && (typeof document.forms[pID].COMMAND != "undefined")){
		document.forms[pID].COMMAND.value = "poll_refresh";
		document.forms[pID].submit();
	}
}

function getEncoding(){
	return document.charset;
}

//Returns names and values of hatsForm elements
function getFormValues(){
	var values="",eType,element;
	var elements=hatsForm.elements;
	for (var i=0,iL=elements.length; i<iL; ++i){
		var elementVal = "";
		element=elements[i];
		eType=element.type;
		var computeValue = true;
		if ((eType == "radio") ||(eType == "checkbox"))
			computeValue = element.checked;
		if(computeValue){
			if (appletInitialized && document.HATSApplet){
				elementVal = document.HATSApplet.encode(element.value,document.charset);
			}else if(window.encodeURIComponent){
				elementVal = encodeURIComponent(element.value);
			}else if (window.escape){
				elementVal = escape(element.value);
			}
			values += "&" + element.name + "=" + elementVal;
		}
	}
	return values;
}

//Returns a default element section value
function getDefaultSelectValue(elem){
	var name = elem.name;
	var defaultElement = eval("document."+hatsForm.name+".selectDefault"+name);
	if (defaultElement == null){
		for (var i=0,iL=elem.options.length; i<iL; ++i){
			if (elem.options[i].defaultSelected){
				return elem.options[i].value;
			}
		}
		return null; 
	} else {
		return defaultElement.value;
	}
}

//Adjust element if necessary.
//Returns true if element was changed.
function inputAdjust(elem, disableIfSame){
	var type=elem.type;
	var name=elem.name;
	var pool = name.split("_"); 
	if (pool.length>3){
		if (pool[3] == "radio"){
			elem.disabled = true;
			return true;
		}
	}
	if (!((type=="checkbox") || (type=="radio"))){
		if (isHInput(type,name)){
			var hostVal;
			if (type=="select-one"){
				hostVal = getDefaultSelectValue(elem);
			} else if (type=="hidden"){
				if (MOZILLA || IEVersion == IE10Version){//bugzilla.mozilla#158209,184732 //SP3c
					hostVal = elem.getAttribute("initValue"); 
				}else if (!MAC && !isIEMobile){ 
					hostVal = elem.defaultValue;
				}
			} else {
				hostVal = elem.defaultValue;
			}

			if (hostVal==null) hostVal="";
			var webVal = elem.value;
			if (webVal==null) webVal="";

			var mdt = isIEMobile?"0":elem.getAttribute("MDT"); 
			if (suppressUnchangedData) mdt = "0";

			if (webVal == hostVal && mdt != "1"){ 
				if (disableIfSame){
					
					if (webVal == "" && type == "hidden" && window.isDijit && getEnclosingDijitWidget(elem) != null && getEnclosingDijitWidget(elem).declaredClass == "dijit.form.FilteringSelect" && getDojoAttr(getEnclosingDijitWidget(elem).valueNode, "dftVal")!=null){ 
						return false;
					} else 
						if (MOZILLA || (isIE && !isIEMobile)){
							elem.name="disabled";
						} else {
							elem.disabled=true;
						}
					return true;
				} else {
					return false;
				}
			} else {
				if ((MAC && isIE) && (type=="select-one")){
					return false;
				}
				var update = webVal;
				if (!autoEraseFields){
					if (enableBIDI && (pushMode || isFldreversed) && (elem.style.textAlign == "right")){
						while (hostVal.length > update.length){
							update = " "+update;
						}
					} else {
						while (hostVal.length > update.length){
							var is3270Num = " " + elem.alt;
							if ( is3270Num.indexOf("3270Num") != -1){			
								update = "0"+update;
							}else{
								update = update+" ";
							}
						}
					}
				}
				if (type=="select-one"){
					if (elem.selectedIndex >= 0){
						elem.options[elem.selectedIndex].value=update;
					}
				} else {
					if (elem.value!=update) elem.value = update;
				}
				if (update != webVal){
					return true;
				}
			}
		}
	}
	return false;
}

//Checks whether specified field is a HATS input field
function isHSameScreen(name,name2){
	if ((name2 == null) || (name == null)) return false;
	var pool = name.split("_");
	var screen = -1;
	if (pool.length>=3){
		if ((pool[0].indexOf("in")!=-1) && (!isNaN(pool[1])) && (!isNaN(pool[2]))){
			if(pool.length>3){
				if(!isNaN(pool[3])){
					screen = pool[3];
				}
			}
		}
	}
	var pool2 = name2.split("_");
	var screen2 = -1;
	if (pool2.length>=3){
		if ((pool2[0].indexOf("in")!=-1) && (!isNaN(pool2[1])) && (!isNaN(pool2[2]))){
			if(pool2.length>3){
				if(!isNaN(pool2[3])){
					screen2 = pool2[3];
				}
			}
		}
	}
	if(screen == screen2) return true;
	return false;
}

//Checks whether radio/checkbox contains "in5E" as name
function isH5EInput(type,name){
	if ((type == null) || (name == null)) return false;
	if ((type=="radio") || (type=="checkbox")){
		var pool = name.split("_");
		if (pool.length >= 3){
			if ((pool[0].indexOf("in5E")!=-1) && (!isNaN(pool[1])) && (!isNaN(pool[2]))){
				return true;
			}
		}
	}
	return false;
}


//Sets focus, cursor position, then process a specified command on pID
function msb(intCommand, intPos, pID){
	setHatsFocus(pID);
	hatsForm.CURSORPOSITION.value=intPos;
	inMSB=true;
	ms(intCommand,pID);
}


//Returns value of object selected from the selection list
function sellistValue(sellistobj){
	if (isNS4 && !isIE4 && !isNS6)  {
		var si=sellistobj.selectedIndex;
		var opt=sellistobj.options[si];
		return opt.value;
	} else {
		return sellistobj.value;
	}
}

//Sets text, password, hidden elements with xxxvalue if it contains "in" and matches pos
function setupValue(pos, len, xxxvalue,xxxaction){
	var elements=hatsForm.elements;
	var elementNext,eName,eType,pool;
	for (var i=0,iL=elements.length; i<iL; ++i){
		elementNext=elements[i];
		eName=elementNext.name;
		eType=elementNext.type;
		if ((eType=="text") || (eType=="textarea") || (eType=="password") || (eType=="hidden") || (eType=="checkbox") || (eType=="radio")){
			if (eName!=null){
				if (eName.length>0){
					pool = eName.split("_");
					if (pool.length==3){
						if (pool[0].indexOf("in")!=-1){
							if (pool[1] == pos){
								elementNext.value = xxxvalue;
							}
						}
					}
				}
			}
		}
	}
	var_setupValuepos=pos;
	var_setupValuexxxaction=xxxaction;
}


//Sets an element at specified position with value and processes the action
function setValue(pos, len, xxxvalue, xxxaction, pID){
	setHatsFocus(pID);
	var list = getElemsin_pos_y(hatsForm, pos);
	if (list!=null){
		for (var i=0,iL=list.length,elementNext; i<iL; ++i){
			elementNext = list[i][0];  //[][0] is elem itself
			elementNext.value = xxxvalue;
		}
	}
	ms(xxxaction, pID);
}

//Sets screen size (number of rows and columns)
function setLineSize(intLineSize){
	if (intLineSize == 2){
		intNumberOfColumns = 80;   // 24X80
		intNumberOfRows = 24;
	} else if (intLineSize == 3){
		intNumberOfColumns = 80;   // 32X80
		intNumberOfRows = 32;
	} else if (intLineSize == 4){
		intNumberOfColumns = 80;   // 43X80
		intNumberOfRows = 43;
	} else if (intLineSize == 6){
		intNumberOfColumns = 132;  // 27X132
		intNumberOfRows = 27;
	} else if (intLineSize == 5){
		intNumberOfColumns = 132;  // 24X132
		intNumberOfRows = 24;
	}else if (intLineSize == 17){
		intNumberOfColumns = 160;  // 62X160
		intNumberOfRows = 62;
	}
	nrtc = intNumberOfRows*intNumberOfColumns;
}

//Test for an empty string
function emptyString(stringToTest){
	var booleanResult = true;
	for (var i=0,iL=stringToTest.length; i<iL; ++i){
		if (stringToTest.charAt(i) != ' '){
			booleanResult = false;
			break;
		}
	}
	return booleanResult;
}

//Trims spaces at the end of intarget word
function strEndTrim(intarget){
	var outtarget=intarget;
	var poslen = intarget.length;
	if (poslen<=0) return outtarget; //no change possible
	while (intarget.charAt(poslen-1) == " "){
		poslen--;
	}
	if (poslen<intarget.length) poslen++;
	if ((poslen<intarget.length) && (poslen>=0)) //make it have a valid change to be changed
		outtarget = intarget.substring(0, poslen); //substring(start, length)
	return outtarget;
}

//Sets cursor position
function setCursorPosition(intCursorPosition,pID){
	if (isNaN(intCursorPosition)){
		updateStatusWindow(); return;
	}
	setHatsFocus(pID);
	
	if (!hatsForm.CURSORPOSITION){
		var newCursorPosition = createInputElement("hidden", "CURSORPOSITION", "1");
		hatsForm.appendChild(newCursorPosition);
	}
	hatsForm.CURSORPOSITION.value=intCursorPosition;
	updateStatusWindow();

	if (prevPositioningElement != null){
		prevPositioningElement.className = prevPositioningElementClassName;
	}

	var element = getProtectedTextElement(intCursorPosition, pID);
	if (element != null){
		prevPositioningElement = element;
		prevPositioningElementClassName = element.className;
		element.className = element.className + " HCURSORINDICATOR";
	} else {
		prevPositioningElement = null;
		prevPositioningElementClassName = null;
	}
}

//Save hidden variables initial value for Mozilla and IE10
//Workaround bugzilla.mozilla#158209,184732
function setInitValuesforHidden(){ 
	if(MOZILLA || IEVersion == IE10Version){ //SP3c
		var elements=hatsForm.elements;
		for (var q=0,qL=elements.length,element; q<qL; q++){
			element = elements[q];
			if(element.type=="hidden"){
				element.setAttribute("initValue",element.defaultValue);
			}
		}
	}
}

//This function is overridden by the one in TabbedFolder.js, if that script is included
function HATSTFInit(HTInfo, useTF, focusFieldName, hatsportletid){}

//This function is overridden by the one in TabbedFolder.js, if that script is included
function setExtraInfo(){}

function turnAutoTabOn(){
	initialInputFocusFromCursor = false;
	autoAdvance = true;
	autoTabInputFields = true;
}

function findStartingInputItem(){
	var elements=hatsForm.elements;
	for (var j=0,jL=elements.length,elementNext; j<jL; ++j){
		elementNext = elements[j];
		if(elementNext.name==initialStartingInputName){
			return elementNext;
		}
	}
	return findFirstInputItem();
}

function findFirstInputItem(){
	var startingInputTypes = "text,password,select-one,checkbox,radio";
	var elements=hatsForm.elements;
	for (var j=0,jL=elements.length,elementNext; j<jL; ++j){
		elementNext = elements[j];
		if (startingInputTypes.indexOf(elementNext.type)!=-1 && elementNext.type!="hidden"){
			return elementNext;
		}
	}
	return null;
}

//Returns displacement between the start position and num
function displacement(num){
	where=1;
	for (var i=0; i<incount; ++i){
		if (startin[i] < num){
			where+=lengthin[i]-1;
		}
	}
	return where;
}

//Sets cursor position and process PF1 key if clickNum >= screen size
function p(clickNum){
	if (cursorclick){
		if (isIE4){
			var tagTD=hatsForm.getElementsByTagName("TD");
			tagTD[hatsForm.CURSORPOSITION.value-displacement(hatsForm.CURSORPOSITION.value)].bgColor='#c0c0c0';
			tagTD[clickNum-displacement(clickNum)].bgColor='#FFFFFF';
		}
	}
	setCursorPosition(clickNum);
	if (clickNum >= nrtc){
		ms('[pf1]');
	}
}

//Sets cursor position
function C(clickNum){
	setCursorPosition(clickNum);
}

//Replaces " with &quot;
function quotechange(a){
	var stringReplace="";
	for (var j=0,aL=a.length; j<aL; ++j){
		if (a.charAt(j) == '\"')
			stringReplace=stringReplace + "&quot;";
		else
			stringReplace=stringReplace + a.charAt(j);
	}
	return stringReplace;
}

//Sets original input box
function setOriginal(inputbox, pID){
	orig = new Array(3);
	orig[0] = pID;
	orig[1] = inputbox.name;
	var handleorig = new String(inputbox.value);
	orig[2]=handleorig;
}

//Compares input box against the original and adjust it
function compareAgainstOriginal(inputbox, intCommand){
	if (orig == null){return;}
	if (orig[1] != inputbox.name){return;}
	if (gobject != inputbox){return;}
	if (!isHInput(inputbox.type,inputbox.name)){return;}

	var pool = inputbox.name.split("_");
	var fstart = parseInt(pool[1]);
	var flength = parseInt(pool[2]);
	var cpos = parseInt(hatsForm.CURSORPOSITION.value);
	if (!((fstart <= cpos) && ((fstart+flength-1) >= cpos))){
		return;
	}
	inputAdjust(inputbox,false);

	// if the command is field exit, don't move the cursor!
	if (((intCommand!=null) && ((intCommand=='[fldext]') || (intCommand=='[field+]') || (intCommand=='[field-]') ||
			(intCommand=='[eraseeof]')) || (carettrackingenabled && isCaretTrackingType(inputbox.type) && (isIE||MOZILLA)))){
		var a = " "+gobject.onkeypress;
		if(!showUnProtectedSosiAsSpace && a.indexOf("allowDBCSOnly")!=-1)
			setCursorPosition(cpos+1,hatsForm.name);
		
		
		var t=gobject;
		if( t != null && (t.type=="textarea" || t.type=="text" || t.type=="password") ) {
			
			t.focus();
			var valbox = t.value;
			t.value = '';
			t.value = valbox;
		}
		if(!showUnProtectedSosiAsSpace && a.indexOf("allowDataLengthChecking")!=-1){
			var pos = 0;
			var t=gobject;
			if(!isIE){
				pos = t.selectionStart;
			} else {
				var caretPos = document.selection.createRange().duplicate();
				var beginField = t.createTextRange();
				caretPos.collapse();
				beginField.collapse();
				var slen = t.value.length;
				for (pos = 0; pos <= slen; pos++){
					qa =caretPos.getBoundingClientRect();
					qb = beginField.getBoundingClientRect();
					if (qa.left == qb.left){
						break;
					}
					caretPos.move("character",-1);
				}
			}
			if(pos > 0){
				var inputValue = new String(gobject.value.substring(0,pos));
				var SOSI = 0;
				if (inputValue != null){
					for (var j=0,jL=inputValue.length; j<jL; ++j){
						var currentString = inputValue.substr(j,1);
						var nextCurrentString = inputValue.substr(j+1,1);
						if (parseInt(j+1) >= jL)
							nextCurrentString = null;
						if (isDBCSChar(currentString, enableDBCSSession, enableDBCSEuro, CodePage)){
							if (j==0)
								SOSI++;
							if (j >=0 && parseInt(j+1) != jL){
								if (nextCurrentString != null && !isDBCSChar(nextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage)){
									SOSI++;
								}
							}
						} else {
							if (nextCurrentString != null && isDBCSChar(nextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage)){
								SOSI++;
							}
						}
					}
					setCursorPosition(cpos+SOSI,hatsForm.name);
				}
			}
		}
		orig=null;
		return;
	}
	
	var b=inputbox.value;
	var d=fstart+b.length;
	
	if(inputbox.type == "select-one"){
		hatsForm.CARETPOS.value=d; //adjust CARETPOS for drop down
	}
	
	if (flength<=b.length){
		d=d-1; //adjust for last in field
	}
	setCursorPosition(d, hatsForm.name);
	orig=null;
}

//Sets global variables based on the focused field
function setFocusFieldIntoGlobal(inputbox,pID){
	enableBIDI=false;
	
	if(window.isDijit && isDijit(inputbox)){ 
		 
		setFocusFieldIntoGlobalOrig(getDijit(inputbox).textbox,pID);
		setCaretToFirstInputPosition(getDijit(inputbox).textbox);
	} else {
		setFocusFieldIntoGlobalOrig(inputbox,pID);
		setCaretToFirstInputPosition(inputbox);
	}
}

function setFocusFieldIntoGlobalOrig(inputbox,pID){
	if(typeof document.forms[pID].beensubmitted != "undefined") return;
	gobject = inputbox;
	getInfo(pID).focusFieldName = inputbox.name;
	setHatsFocus(pID);
	var pool = inputbox.name.split("_");
	setCursorPosition(pool[1],pID);
	
	if (isNS6 && !IE11Plus){
		if ((inputbox.type=="text") || (inputbox.type=="textarea") || (inputbox.type=="password")){
			if (inputbox.setSelectionRange){ //NS6+ only
				inputbox.setSelectionRange(0, 0); //before first character
			}
		}
	}
	setOriginal(inputbox,pID);
	thisFieldOverwrite(inputbox);
	if (enableBIDI && (inputbox.type == "password"))
		showStatusBar(inputbox);

	if (highlightInputField){
		inputbox.style.backgroundColor = highlighInputFieldColor;
	}
	updateStatusWindow();
	
	if ((isIE||MOZILLA||OPERA||IE11Plus) && (carettrackingenabled||statuswindowenabled)){
		updateCursorPosition(false,pID); //onFocus not run autoAdvance
	}
}

//htElement constructor
//Moved from TabbedFolder.js
function htElement(fieldName, fieldValue, fieldType){
	this.fieldName = fieldName;
	this.fieldValue = fieldValue;
	this.fieldType = fieldType;
}

//Check inputs and set the values
function checkInputOnCombo(me){
	checkInput(me, null); 
}

//Check inputs and set the values
function checkInput(me, intCommand){
	
	if (screenLocked) return;
	if(window.isDijit && isDijit(me)){ 
		var djtme=getDijit(me);
		if(!(djtme.displayedValue) && (djtme.declaredClass != "dijit.form.FilteringSelect")){
			me=djtme.textbox;
		}else{
			if (isHInput(djtme.type, djtme.name) && !isIEMobile){
				if (djtme.type != "text"){
					djtme.textbox.setAttribute("MDT", "1");
				}
			}
			compareAgainstOriginal(djtme.textbox, intCommand);
			checkInput2(djtme.name+"",getPreferredHatsFormElementValue(me)+"",djtme.type+""); 
			return;
		}
	}
	var type=me.type;

	if((type == "select-one")){
		
		if (isHInput(type, me.name) && !isIEMobile){
			var pool = me.name.split("_");
			var pos = parseInt(hatsForm.CURSORPOSITION.value);
			var len = parseInt(pool[2]);
			var ipos = parseInt(pool[1]);
			var webVal2 = "";
			for (var i=0; i<len; ++i) webVal2+="_";
			
			var hostVal = getDefaultSelectValue(me);
			if (hostVal==null) hostVal="";
			var webVal = me.value;
			if (webVal==null) webVal="";
			
			if (pos == ipos && (webVal == hostVal || webVal2 == hostVal))
				return;
		}
		
		
		var idVal=me.selectedIndex;
		if(idVal != -1){
			var idOptions=me.options;
			if(idOptions != null){
				var idSpot =idOptions[idVal];
				if(idSpot != null){
					var idName = idSpot.id;
					if(idName != null){
						if(idName != ""){
							var oldName= me.name;
							var oldType= type;
							me.name = idName;
							me.id = idName;
							checkInput2(oldName,"",oldType);//change the last selected option back to nothing;
							me.selectedIndex = idVal;
							if(enableBIDI)
								setFocusFieldIntoGlobalBiDi(me, hatsForm.name);
							else
								setFocusFieldIntoGlobal(me, hatsForm.name);
						}
					}
				}
			}
		}
	}
	if (isHInput(type, me.name) && !isIEMobile){
		if (type != "text" && type != "textarea"){
			me.setAttribute("MDT", "1");
			
		}
	}

	if ((type=="checkbox") || (type=="radio")){
		if (!(me.checked)) return;
	}
	compareAgainstOriginal(me, intCommand); 
	checkInput2(me.name,me.value,type);
	
	if((type == "select-one") && autoAdvance && nextFieldForDropDown){
		pool = me.name.split("_");
		nextInputField(me, parseInt(pool[1]), parseInt(pool[2])); 
	}
}

function changevaluefromcheckinput2(elem, buffer){
	var oldvalue=getPreferredHatsFormElementValue(elem);
	if (oldvalue != buffer){
		if(elem.id!=null && window.isDijit && isDijit(elem)){
			var djtelem=getDijit(elem);
			if(!setToItemValueIfInStore(djtelem, djtelem.store, rightTrimFromString(buffer))){
				elem.value = buffer;
			}
		} else {
			elem.value = buffer;
		}
		if(elem.id!=null){
			var areaDIV=documentgetElementById(elem.id+"CEP");
			if(areaDIV!=null){
				if(areaDIV.style.visibility!="hidden"){
					exactCursor(elem.id,-1);
				}
			}
		}
	}
}

//Check inputs and set the values
function checkInput2(name, value, type){
	if (screenLocked) return;
	var mesplit = [];
	mepool = name.split("_");
	if (isNS6){
		if (getInfo(hatsForm.name).useTF){
			var hte = new htElement(name,value,type);
			getInfo(hatsForm.name).HTInfo = updateHTInfo(hte);
		}
	}
	var lm = parseInt(mepool[1],10);
	var size = parseInt(mepool[2],10);
	var rm = lm + size - 1;
	var flag = lm + value.length - 1;
	if (value.length != 0){
		for (var i=0; i<size; ++i){
			mesplit[i] = new Array(2);
			mesplit[i][0] = lm + i;
			if (lm+i <= flag){
				mesplit[i][1] = value.charAt(i);
			} else {
				mesplit[i][1] = " ";
			}
		}
	} else if (value.length == 0){
		for (var i=0; i<size; ++i){
			mesplit[i] = new Array(2);
			mesplit[i][0] = lm + i;
			mesplit[i][1] = " ";
		}
	}
	var elements = hatsForm.elements;
	var element,eName,eType,buffer,clm,crm,csize,currString;
	// Start to loop for each element
	for (var i=0,iL=elements.length; i<iL; ++i){
		element = elements[i];
		eName = element.name;
		eType = element.type;
		if (eName == null){
			//do not process null name elements
		} else if (!isHInput(eType,eName)){
			//do not process non-HATS elements
		} else if (!isHSameScreen(eName, name)){
			//do not process non-HATS elements
		} else if (((eName.split("_"))[0]) == "selectDefaultin"){
			//do not process selectDefaultin, it is not a true input // here is culprit for changing selectdefaultin and therefore getting the item disabled
		} else if (((eName.split("_"))[0]) == "selectin"){
			//do not process selectin; it is the input field used by FilteringSelectWidget/ComboBoxWidget
		} else if ((eType == "select-one")){
			if ((eName==name) || (((eName.split("_"))[1]) == ((name.split("_"))[1]))){
				if (element.selectedIndex!=null){
					element.selectedIndex=-1;
					if (element.options != null){
						for (var f = 0; f<element.options.length; ++f){
							if (element.options[f].value == value){
								element.selectedIndex = f;
								break;
							}
						}
					}
				}
			}
		} else if (eName == name){ //for the elements have the same name
			if (!((eType == "radio") || (eType == "checkbox"))){
				changevaluefromcheckinput2(element, value); 
			}
		} else if ((eName != name) && !(isH5EInput(type,name))){
			var pool = eName.split("_");
			if ((pool.length>=3) && (!((eType=="checkbox") || (eType=="radio")))){
				if (pool[0].indexOf("in") != -1){
					clm = parseInt(pool[1],10); //field start position
					csize = parseInt(pool[2],10); //field length
					crm = clm + csize - 1; //field end position
					currString= getPreferredHatsFormElementValue(element); //initial value in the field 
					if ((clm >= lm && clm <= rm) || (crm >= lm && crm <= rm) || (clm < lm && crm > rm)){ //check if overlapping
						
						buffer="";
						var match, walker;
						if (currString.length != 0){
							for (var k =0; k<csize; ++k){
								match = false;
								walker = clm + k;
								len = size;
								for (var m=0; m<len; ++m){
									if (walker == mesplit[m][0]){
										buffer = buffer + mesplit[m][1];
										match = true;
									}
								}
								if (!match){
									if ((clm + k) <  rm){
										buffer = buffer + currString.charAt(k);
									} else if ((clm + k) > flag){
										buffer += currString.charAt(k);
									}
								}
							}
						} else if (currString.length == 0){
							for (var k =0; k<csize; ++k){
								match = false;
								walker = clm + k;
								for (var m=0; m<value.length; ++m){
									if (walker == mesplit[m][0]){
										buffer += mesplit[m][1];
										match = true;
									}
								}
								if (!match){
									if ((clm + k) < rm){
										buffer += " ";
									}
								}
							}
						}
						if (emptyString(buffer)){
							changevaluefromcheckinput2(element, "");
						} else {
							changevaluefromcheckinput2(element, buffer);
						}
					}
				}
			}
		}
	}
	
	
	if (!OPERA && !SAFARI && !MOZILLA &&!isIE) 
		gobject = null;
}

function getPreferredHatsFormElementValue(elem){
	var ret = elem.value;
	if(elem.id!=null && window.isDijit && isDijit(elem)){
		var djtelem=getDijit(elem);
		if(djtelem.store){ret=getTrueValueForSubmit(djtelem, djtelem.store, ret);}
	}
	return ret;
}

//Set activeID and formID
function  setActiveIDX(aID){
	activeID = aID;
	formID = aID;
}

//Set portletID
function setPortletIDX(pID){
	portletID = pID;
}

//Set hatsForm
function setFormObjX(){
	if (activeID != "default"){
		if (formID != activeID){
			formID = activeID;
		}
	}
	hatsForm = eval("document."+formID);
}

//If overwrite mode is enabled, set the overwrite mode based on the overwriteSetting
function thisFieldOverwrite(fldobj){
	if (!overwritemodeenabled) return;
	
	var aaname = fldobj.name;
	var pool = aaname.split("_");
	//var ipos = parseInt(pool[1]);
	var ilen = parseInt(pool[2]);
	var vlen = fldobj.value.length;
	if (ilen <= vlen){ //we have a full field
		setOverWriteMode((overwriteSetting==1)||(overwriteSetting==3)||(overwriteSetting==5)||(overwriteSetting==7));
	} else if ((ilen > vlen) && (vlen != 0)){
		setOverWriteMode((overwriteSetting==2)||(overwriteSetting==3)||(overwriteSetting==6)||(overwriteSetting==7));
	} else if (vlen == 0){
		setOverWriteMode((overwriteSetting==4)||(overwriteSetting==5)||(overwriteSetting==6)||(overwriteSetting==7));
	}
}

//Checks if overwrite mode is on or not
function isOverWriteMode(){
	if (enableBIDI) {
		return (isRealIE ? document.queryCommandValue("OverWrite") : isOverwriteMozilla);
	}
	
	if ((!isIE && !IE11Plus) || MAC || isIEMobile) return false; //Win IE only code 
	return document.queryCommandValue("OverWrite");
}

//Sets OverWrite mode on or off
function setOverWriteMode(bset){
	if (!overwritemodeenabled) return;

	if (enableBIDI) {
		if(!isRealIE)
			isOverwriteMozilla = true;
	}
	else
		
		if ((!isIE && !IE11Plus) || MAC ||isIEMobile) return; //Win IE only code 

	if (bset!=document.queryCommandValue("OverWrite"))
	{ //dont repeat commands to the system
		if (bset){
			document.execCommand("OverWrite");
		} else {
			document.execCommand("OverWrite",false,false);
		}
	}
}

//Update the old status
function updateStatusWindowOld(){
	var value = parseInt(hatsForm.CURSORPOSITION.value);
	if (!isNaN(value))  {
		statwin[0]=" "+value +"  ("+ ConvertPosToRow(value, intNumberOfColumns)+","+ ConvertPosToCol(value, intNumberOfColumns)+")";
	}
	if (isOverWriteMode()) statwin[1]="[]";
	else
		statwin[1]="|";
	if (screenLocked){
		statwin[3]=" >< ";
	}
	var strstat="";
	if (carettrackingenabled) strstat=strstat+statwin[0];
	if (overwritemodeenabled) strstat=strstat+"     "+statwin[1];
	if (statwin[2]!=" ") strstat=strstat+"     "+statwin[2];
	if (screenLocked) strstat=strstat+"     "+statwin[3];
	if (enableBIDI){
		window.status = statusBIDI;
	} else
		window.status=strstat;
}

//Update OIA on Status window
function updateStatusWindow(){
	if (statusUpdateOIA())  {
		for (var i=1; statusUpdateOIA(i); ++i){
		}
	}
}

//Update OIA status
function statusUpdateOIA(oiaCounter){
	if (hatsForm==null) return false;
	if (isIEMobile) return false; 
	var oiaNumber = "";
	if (oiaCounter != null){
		oiaNumber = "_"+oiaCounter;
	}
	//find the correct OIA for this form
	var oiaName = "OPERATING_INFO_FOR_"+hatsForm.name+"_AREA"+oiaNumber;

	if (eval(documentgetElementById(oiaName+"_DIV_ID"))==null){
		if (oiaCounter == null){
			updateStatusWindowOld();//window.status = statusBIDI;
		}
		return false;
	} //no OIA area

	var value = parseInt(hatsForm.CURSORPOSITION.value);
	if (!isNaN(value)){
		var oiacp = eval(documentgetElementById(oiaName+"_ITEM_ID_"+"cursorPosition"));
		if (oiacp!=null){
			oiacp.innerHTML= hatsForm.CURSORPOSITION.value;
		}
		var oiarw = eval(documentgetElementById(oiaName+"_ITEM_ID_"+"cursorRowColumn"));
		if (oiarw!=null){
			var rowoia =""+ConvertPosToRow(value, intNumberOfColumns);
			while (rowoia.length < 2) rowoia="0"+rowoia;
			var coloia =""+ConvertPosToCol(value, intNumberOfColumns);
			while (coloia.length < 3) coloia="0"+coloia;
			oiarw.innerHTML= rowoia+"/"+coloia;
		}
	}
	var oiaim = eval(documentgetElementById(oiaName+"_ITEM_ID_"+"insertMode"));
	if (oiaim!=null){
		if ((!isIE || MAC) && !MOZILLA){
			oiaim.innerHTML= "&nbsp;&nbsp;";
		}//if we cant support it don't show anything
		else if (isOverWriteMode()){
			oiaim.innerHTML=createImgTag("insertMode",overwriteModeImage,"[]","overwriteMode_indicator");
		} else {
			oiaim.innerHTML=createImgTag("insertMode",insertModeImage,"&nbsp;|","insertMode_indicator");
		}
	}
	
	var oiaii = eval(documentgetElementById(oiaName+"_ITEM_ID_"+"inputInhibited"));
	if (oiaii!=null){
		if (screenLocked) oiaii.innerHTML=createImgTag("inputInhibited",inputInhibitedImage,inputInhibitedTranslation,"inputInhibited_indicator");//" X ";
		else oiaii.innerHTML="&nbsp;&nbsp;&nbsp;";
	}
	var oiabc = eval(documentgetElementById(oiaName+"_ITEM_ID_"+"bidiControls"));
	if (oiabc!=null){
		oiabc.innerHTML = OIA_BIDI;
	}
	var oiaaai = eval(documentgetElementById(oiaName+"_ITEM_ID_"+"autoAdvanceIndicator"));
	if (oiaaai!=null){
		if (autoAdvance) oiaaai.innerHTML=createImgTag("autoAdvanceIndicator",autoAdvanceIndicatorImage,autoAdvanceIndicatorTranslation,"autoAdvanceIndicator_indicator");
		else oiaaai.innerHTML="&nbsp;";
	}
	var oiaaa = eval(documentgetElementById(oiaName+"_ITEM_ID_"+"appletActive"));
	if (oiaaa!=null){
		if (appletInitialized) oiaaa.innerHTML=createImgTag("appletActive",appletActiveImage,appletActiveTranslation,"appletActive_indicator");
		else oiaaa.innerHTML="&nbsp;";
	}
	var oiafd = eval(documentgetElementById(oiaName+"_ITEM_ID_"+"fieldData"));
	if (oiafd!=null){
		var stat = "";
		if (gobject!=null){
			if (isHInput(gobject.type,gobject.name)){
				if (gobject.type=="password") stat+=" "+hiddenTranslation;
				if (gobject.entryRequired=="true") stat+=" "+entryRequiredTranslation;
				if (gobject.fillRequired=="true") stat+=" "+fillRequiredTranslation;
				if (gobject.fieldExitRequired=="true") stat+=" "+fieldExitRequiredTranslation;
				if (gobject.autoEnter=="true") stat+=" "+autoEnterTranslation;
				if (gobject.style){
					if (gobject.style.textTransform)
						if (gobject.style.textTransform == "uppercase")
							stat+=" "+upperCaseTranslation+"<br>";
				}
				if (gobject.onkeypress){
					var a = " "+gobject.onkeypress;
					if (a.indexOf("allowSignedNumeric")!=-1) stat+=" "+signedNumericTranslation;
					if (a.indexOf("allowNumericOnly")!=-1) stat+=" "+numericTranslation;
					if (a.indexOf("allowNumLockOnly")!=-1) stat+=" "+numericTranslation; 
					if (a.indexOf("convertToUpperCase")!=-1) stat+=" "+upperCaseTranslation;
					if (a.indexOf("allowDBCSOnly") != -1) stat+=" "+dbcsOnlyTranslation;
					if (a.indexOf("allowDBCSPure") != -1) stat+=" "+dbcsPureTranslation;
					if (a.indexOf("allowSBCSOnly") != -1) stat+=" "+sbcsOnlyTranslation;
					if (a.indexOf("inhibitKeyboardEntry") != -1) stat+=" "+keyboardEntryInhibitedTranslation;
					if (a.indexOf("allowAlphabeticOnly") != -1) stat+=" "+alphabeticOnlyTranslation;
					if (a.indexOf("allowDigitsOnly") != -1) stat+=" "+digitsOnlyTranslation;
					if (a.indexOf("allowDBCSEither") != -1) stat+=" "+dbcsEitherTranslation;
					if (a.indexOf("allowKatakanaShift") != -1) stat+=" "+katakanaShiftTranslation;
					if (a.indexOf("allowUnicodeOnly") != -1) stat+=" "+unicodeFieldTranslation;
				}
			}
		}
		if (stat == ""){
			stat="&nbsp;";
		}
		oiafd.innerHTML= stat;
	}
	return true;
}

//Creates an <IMG> tag
function createImgTag(divClass,image,message,name){
	return "<IMG border=\"0\""+divClass+" src=\""+image+"\" alt=\""+message+"\" name=\""+name+"\">";
}

//Updates cursor position
function updateCursorPosition(autoAdvanceHandle,pID){
	setHatsFocus(pID);
	var ace = caretTracking(autoAdvanceHandle,pID); // the only call to caretTracking in the file
	if (enableBIDI && (gobject != null) && (gobject.type == "text" || gobject.type == "textarea")){
		var pool = gobject.name.split("_");
		var fieldStart = parseInt(pool[1]);
		ace = fieldStart + getCaretOffsetPositionBidi(ace,intNumberOfColumns,gobject,fieldStart);
	}

	if (ace == -1) return;
	if (isNaN(ace))return;
	setCursorPosition(ace,pID);
}

//Converts an absolute position to a row number based on the column size
function ConvertPosToRow(pos, sizecols){
	var a = Math.floor(pos / sizecols) + 1;
	return a;
}

//Converts an absolute position to a row number based on the column size
function ConvertPosToCol(pos, sizecols){
	if(enableBIDI)
		return ConvertPosToColBidi(pos, sizecols);
	else
		return (pos % sizecols);
}

//Converts a row and column number to an absolute position based on the column size
function ConvertRowColToPos(row,col,sizecols){
	var a = ((row-1) * sizecols) + col;
	return a;
}

//Returns the next input field
function nextInputField(currentElement, ipos, ilen, pID){
	setHatsFocus(pID);
	if (!autoTabInputFields)
		return nextvalidhatsinputfield(currentElement,ipos,ilen,pID); //no need to run, use the old way

	if ((!isIE || MAC) && !MOZILLA && !OPERA) 
		return -1; //Win IE,  Netscape/Mozilla/Opera only code
	if (hatsForm.elements.length<=1)
		return -1;  //no need to run function
	var isChkRTBFistIndex = (enableBIDI && isChkRTBArray[hatsForm.name]) ? true : false;
	var elements=hatsForm.elements;
	var i=0,element;
	for (var iL=elements.length; i<iL; ++i){
		element=elements[i];
		if (enableBIDI && isChkRTBArray[hatsForm.name]){
			if(element.tabIndex == currentElement.tabIndex + 1){
				isChkRTBFistIndex = false;
				break;
			}
		}
		else if(currentElement.name == element.name && currentElement.size == element.size){
			i++;
			break;
		}
	}

	if(i>=elements.length){i=0;} //loop to the top of the page
	for (var iL=elements.length; i<iL; ++i){
		element=elements[i];
		if (isFocusAbleInputField(element.type) &&(!element.disabled)
				&& (!element.readOnly)){
			if (isChkRTBFistIndex && (element.tabIndex != 1))
				continue;

			window.focus();element.focus();
			if (enableBIDI && (caretIn != BY_TAB)){
				if(element.type=="text" || element.type=="textarea")
					setFocus(element,pID);
				else if(element.type=="password")
					setFocusInput(element,pID);
			}

			var pool = element.name.split("_");
			if (pool[0].indexOf("in")!=-1){
				mlcpos=parseInt(pool[1]);
				return mlcpos;
			}
			return ipos;//don't advance the cursor variable, it is not a hats host screen input field
		}
	}
}

function isFocusAbleInputField(type){
	if ((type == null) || (name == null)) return false;
	if ((type=="text") || (type=="password") || (type=="textarea")
			|| (type=="checkbox") || (type=="select-one") || (type=="radio")){
		return true;
	}
	return false;
}


function tabToNextInputField(currentElement,position,plen){
	if (!autoAdvance){
		var saveAutoAdvance = autoAdvance;
		autoAdvance=true;
		nextInputField(currentElement,position,plen);
		autoAdvance = saveAutoAdvance;
	} else
		nextInputField(currentElement,position,plen);
}

//Returns next valid HATS field
function nextvalidhatsinputfield(currentElement,position,plen, pID){
	setHatsFocus(pID);
	if (!autoAdvance) return -1;   //no need to run function

	if ((!isIE || MAC)  && !MOZILLA && !OPERA) 
		return -1; //Win IE,  Netscape/Mozilla/Opera only code
	var elements = hatsForm.elements;
	if (elements.length <= 1) return -1; //no need to run function
	var mlc=elements[0];
	var mlcpos=-1;
	var mlcnum=-1;
	var x=position+plen;
	var elementNext,eName,eType,eStyle,pool,ipos;
	for (var i=0,iL=elements.length; i<iL; ++i){
		elementNext=elements[i];
		eName = elementNext.name;
		eType = elementNext.type;
		eStyle = elementNext.style;
		if ((!(currentElement==elementNext)) && (isHInput(eType,eName)) &&
				(!elementNext.disabled) && (eType!="hidden") && (!elementNext.readOnly) &&
				(eStyle.display != "none") && (eStyle.visibility != "hidden")){
			pool = elementNext.name.split("_");
			//ilen=parseInt(pool[2]);
			ipos=parseInt(pool[1]);

			if (enableBIDI && isChkRTBArray[hatsForm.name]){
				if (elementNext.tabIndex == currentElement.tabIndex + 1){
					mlcpos = 1;
					mlc=elementNext;
					break;
				}
			} else if (((mlcnum==-1) && (ipos>=x)) || ((ipos>=x) && (mlcpos>=ipos))){
				mlc=elementNext;
				mlcpos=ipos;
				mlcnum=i;
			}
		}
	}

	if (mlcpos != -1 && (!mlc.disabled) && (!mlc.readOnly) && (mlc.type != "hidden") &&
			(mlc.style.display != "none") && (mlc.style.visibility != "hidden")){
		window.focus();
		mlc.focus();
		if (enableBIDI && (caretIn != BY_TAB)){
			if(mlc.type=="text" || mlc.type=="textarea")
				setFocus(mlc,pID);
			else if(mlc.type=="password")
				setFocusInput(mlc,pID);
		}
	} else{ //change to focus on lowest cursor value input field
		for (var i=0,iL=elements.length; i<iL; ++i){
			elementNext=elements[i];
			eName = elementNext.name;
			eType = elementNext.type;
			if ((!(currentElement==elementNext)) && (isHInput(eType,eName)) 
					&& (!elementNext.disabled)
					&& (!elementNext.readOnly)
					&& (eType!="hidden")){
				if (enableBIDI && isChkRTBArray[hatsForm.name] && (elementNext.tabIndex != 1))
					continue;

				pool = eName.split("_");
				if (pool[0].indexOf("in")!=-1){
					//ilen=parseInt(pool[2]);
					ipos=parseInt(pool[1]);

					if(mlcpos==-1 || ipos<mlcpos){
						mlc=elementNext;
						mlcpos=ipos;
						mlcnum=i;
					}
				}
			}
		}
		if (mlcpos!=-1 && (!mlc.disabled) && (!mlc.readOnly) && (mlc.type != "hidden") &&
				(mlc.style.display != "none") && (mlc.style.visibility != "hidden")){
			window.focus();
			mlc.focus();
			if (enableBIDI && (caretIn != BY_TAB)){
				if(mlc.type=="text" || mlc.type=="textarea")
					setFocus(mlc,pID);
				else if(mlc.type=="password")
					setFocusInput(mlc,pID);
			}
		}
	}
	return mlcpos;
}

//Counts number of user interactive HATS form field
function countUserInteractiveHatsFormFields(){
	var uihff=0;
	if (hatsForm == null) return 0;
	var elements = hatsForm.elements;
	for (var i=0,iL=elements.length,elementNext; i<iL; ++i){
		elementNext=elements[i];
		if ((isHInput(elementNext.type, elementNext.name))
				&& (!elementNext.disabled)
				&& (!elementNext.readOnly)
				&& (elementNext.type!="hidden")){
			uihff=uihff+1;
		}
	}
	return uihff;
}

//Verifies that at least one user interactive HATS form field exists
function countMinimumUserInteractiveHatsFormFields(){
	if (hatsForm == null) return 0;
	var elements = hatsForm.elements;
	for (var i=0,iL=elements.length,elementNext; i<iL; ++i){
		elementNext=elements[i];
		if((!elementNext.disabled) && (elementNext.type!="hidden")){
			if(isHInput(elementNext.type, elementNext.name)){
				return 1;
			}
		}
	}
	return 0;
}

//Check if type in input is for caret tracking logic
function isCaretTrackingType(type){
	return (type=="text" || type=="password" || type=="textarea");
}

//Track caret position
function caretTracking(autoAdvanceHandle,pID){
	setHatsFocus(pID); 
	if ((!isIE || MAC) && !MOZILLA && !OPERA || isIEMobile)  
		return -1;  //Win IE, Netscape/Mozilla/Opera only code
	if (!carettrackingenabled) return -1;
	if (countMinimumUserInteractiveHatsFormFields()<1) return -1;
	var pos = 0, slen=0, t;

	if(!isIE){
		try{
			t = document.activeElement;
			if (typeof(t) == 'undefined' || t == null){
				t = gobject;
			}
			if ((t == null) || (t.type!="textarea" && t.type!="text" && t.type!="password")) return -1;
			pos = t.selectionStart;
			slen = t.value.length;
		} catch(e){return -1;}
	} else {
		var caretPos = document.selection.createRange().duplicate();
		t = caretPos.parentElement();
		if (t.type!="textarea" && t.type!="text" && t.type!="password") return -1;
		var beginField = t.createTextRange();
		caretPos.collapse();
		beginField.collapse();
		slen = t.value.length;

		for (pos=0; pos <= slen; pos++){
			qa =caretPos.getBoundingClientRect();
			qb = beginField.getBoundingClientRect();
			if (qa.left == qb.left){
				break;
			}
			caretPos.move("character",-1);
		}
	}

	var iname = t.name;
	var pool = iname.split("_");
	var ipos = parseInt(pool[1]);
	var ilen = parseInt(pool[2]);

	if(enableDBCSSession){
		var onKeyPressValue = " " + t.onkeypress;
		if ((onKeyPressValue.indexOf("allowDBCSEither") != -1 || onKeyPressValue.indexOf("allowDBCSOnly") != -1 || onKeyPressValue.indexOf("allowDBCSPure") != -1 || onKeyPressValue.indexOf("allowDataLengthChecking") != -1) && ilen>t.maxLength){
			if((onKeyPressValue.indexOf("allowDBCSOnly5250") != -1 || (onKeyPressValue.indexOf("allowDBCSEither") != -1 && t.getAttribute("currentJFieldMode") == "true"))&& autoAdvance && showUnProtectedSosiAsSpace && autoAdvanceHandle){
				ilen--; 
			}
		} else if(t.maxLength != -1) {  
			ilen = t.maxLength;
		}
	}

	if (isNaN(ipos)||isNaN(ilen)||isNaN(pos)){
		if (autoAdvance && autoTabInputFields && (t.maxLength==slen) && autoAdvanceHandle && iname != "disabled"){
			return nextInputField(t,-1,0,pID);
		}
		return(-1);
	}

	browserActualCaretPosition = pos; 
	
	var charCount = pos;
	var surrogate = false;
	for (var i=0; i<charCount; ++i){
		if (isDBCSChar(t.value.charAt(i), enableDBCSSession, enableDBCSEuro, CodePage)){
			 
			if(i+1 < charCount && isSurrogate(t.value.charAt(i), t.value.charAt(i+1))){
				i++;
				surrogate = true;
			}
			else {
				surrogate = false;
				pos++;
			}
			var onKeyPressValue = " " + t.onkeypress;
			if (onKeyPressValue != null && onKeyPressValue.indexOf("allowUnicodeOnly") != -1 && !surrogate){
				pos--;
			}
		}
	}
	var newcursor=ipos+pos;
	var isCursorDecr = false; 
	if ((newcursor) > (ipos + ilen - 1)){
		if (autoAdvance && t.getAttribute("disableAutoAdvance") != "true" && autoAdvanceHandle){ // we can try  to the next field
			if (t && t.getAttribute("autoEnter") == "true"){
				autoAdvance = false;
				ms("[enter]");
				return(newcursor-1);
			}
			// return tcp;
			var tcp=nextInputField(t,ipos,ilen,pID);
			if (tcp!=-1){
				newcursor= (tcp);  //tcp is now first character of a different field
				setNewCaretPosValue(tcp);//This is a situation where the caret is at the beginning again 
			}//else we want to go with the last char from the other screen
			else{
				
				
				newcursor=ipos; 
				setNewCaretPosValue(ipos);//This is a situation where the caret is at the beginning again 
				resetFieldCaret(t);
			}
		} else { // no field transition so since pos!=ilen, pos-=1
			newcursor= (newcursor-1);
			setNewCaretPosValue(ipos+ilen);//This is a situation where the caret is at the end and we need to have the cursor at the end
			isCursorDecr = true; 
		}
	} else {
		var fieldpos = parseInt(pool[1]);
		var fieldlen = parseInt(pool[2]);
		if((newcursor) > (fieldpos+fieldlen-1))
			newcursor = (fieldpos+fieldlen-1);
		setNewCaretPosValue(ipos+pos);//This is a situation where the caret and cursor match
	}
	
	

	
	if (!hatsForm.ISCURSORDECR){
		var isCursorDecrEle = createInputElement("hidden", "ISCURSORDECR", 'false');
		hatsForm.appendChild(isCursorDecrEle);
		hatsForm.ISCURSORDECR = isCursorDecrEle;
	}
	hatsForm.ISCURSORDECR.value = isCursorDecr;
	
	
	return(newcursor);
}


function setNewCaretPosValue(newcursor){
	if (!hatsForm.CARETPOS){
		//@AG1 start
		//var newCaretPosition = document.createElement("<INPUT TYPE='HIDDEN' NAME='CARETPOS' VALUE='" + pos+ipos + "' />");
		var newCaretPosition = document.createElement("input");
		newCaretPosition.setAttribute("type","hidden");
		newCaretPosition.setAttribute("name","CARETPOS");
		newCaretPosition.setAttribute("value",pos+ipos);
		//@AG1 end
		
		hatsForm.appendChild(newCaretPosition);
	} else {
		hatsForm.CARETPOS.value=newcursor;
	}
}

//Sets initial HATS focus
function setInitHatsFocus(formName){
	if (hatsForm==null){
		setHatsFocus(formName);
		if (hatsForm==null){
			alert('could not set initial hats focus!');
			return;
		}
		setInputFieldFocus();
		// For mozilla and IE10 only
		setInitValuesforHidden(); 
		updateStatusWindow();
		return;
	}
	updateStatusWindow();
}
//this function is only applied in IE
function setInitHatsFocusOnReadyState(){
	if (document.readyState!="complete" && !MAC && !isIEMobile){ 
		setTimeout(setInitHatsFocusOnReadyState, 500);
	} else {
		setInitHatsFocus(formHATSID);
	}
}

//Grab initial user input focus.
//It is forced and only used by Portal
function stealHatsFocus(formName){
	setHatsFocus(formName);
	if (hatsForm==null){
		alert('could not steal initial hats focus!');
		return;
	}
	
}

function getHATSForm(formName){
	var tmp=document.forms[formName];

	if (typeof tmp == 'undefined'){
		return tmp;
	}

	if(typeof tmp.tagName == "undefined"){
		if(tmp.length > 1){
			//check added for dispHTMLElementCollection
			for(var i=0,iL=tmp.length; i<iL;++i){
				if(tmp.item(i).style.display != "none"){
					tmp = tmp.item(i);
					break;
				}
			}
		} else {
			tmp = tmp.item(0);
		}
	}
	return tmp;
}

//Change user input focus to specified form
function setHatsFocus(formName){
	if (!formName) return;
	if (hatsForm){
		if (document.forms[formName]===hatsForm){
			return;
		}
	}
	var tmp=getHATSForm(formName);

	if (typeof tmp == 'undefined'){
		
		return;
	}

	if (hatsForm != null){
		removeHatsFocus(hatsForm.name);
	}
	hatsForm = tmp;
	
	//set current linesize
	if(hatsForm.LINESIZE != undefined)
		setLineSize(hatsForm.LINESIZE.value);

	
	
	hatsForm.poll_callback=function(){};
	hatsForm.poll_disconnect_callback=function(){return true;};
	hatsForm.poll_refresh_callback=function(){};

	var focusRegion = documentgetElementById("HATSFR"+formName); 
	if (focusRegion == null){
		return;
	}
	focusRegion.className=hatsFocusedClass;
}

//Remove any state from form losing the focus, update appearance
function removeHatsFocus(formName){
	var focusRegion=documentgetElementById("HATSFR"+formName); 
	if (focusRegion == null){
		
		return;
	}
	focusRegion.className=hatsUnfocusedClass;
	
}

//Capture mouse position
function captureMousePosition(e){
	if (isNS4){
		//NS4
		xMousePos = e.pageX;
		yMousePos = e.pageY;
		xMousePosMax = window.innerWidth+window.pageXOffset;
		yMousePosMax = window.innerHeight+window.pageYOffset;
	} else if (isIE || OPERA){
		//IE
		xMousePos = window.event.x+document.body.scrollLeft;
		yMousePos = window.event.y+document.body.scrollTop;
		xMousePosMax = document.body.clientWidth+document.body.scrollLeft;
		yMousePosMax = document.body.clientHeight+document.body.scrollTop;
		var maxScrollPosition = window.document.body.scrollWidth-window.document.body.clientWidth;
		xMouseRTLPos = window.event.x-(maxScrollPosition-document.body.scrollLeft);
	} else if (isNS6){ /*gecko*/
		// Netscape 6
		xMousePos = e.pageX;
		yMousePos = e.pageY;
		xMousePosMax = window.innerWidth+window.pageXOffset;
		yMousePosMax = window.innerHeight+window.pageYOffset;
	} else {
		xMousePos = e.pageX;
		yMousePos = e.pageY;
		xMousePosMax = window.innerWidth+window.pageXOffset;
		yMousePosMax = window.innerHeight+window.pageYOffset;
	}
}

function getButton(popupid){
	var elements = hatsForm.elements;
	var element,onclickstring;
	for (var i=0,iL=elements.length; i<iL; ++i){
		element = elements[i];
		onclickstring=" "+element.onclick;
		// Find the button for this popup
		if ((element.type == "button") && (onclickstring.indexOf(popupid)!=-1)){
			// now that we have found the element
			return element;
		}
	}
	return null;
}

function getPopupCallerFromElement(content){
	//it should have the same parent
	var parent=content.parentNode;
	var nodes=parent.childNodes;
	var node,onclickstring;
	for(var x=0; nodes[x]; x++){
		node = nodes[x];
		onclickstring=" "+node.onclick;
		if((onclickstring.indexOf("popup(")!=-1) && (onclickstring.indexOf(content.id)!=-1)){
			// now that we have found the element
			return node;
		}
	}
	return null;
}

function getFormFromElement(element){
	var parent=element.parentNode;
	while(parent!=null){
		if(parent.nodeName=="FORM"){
			return parent;
		}
		parent=parent.parentNode;
	}
	return null;
}

//pass the HTML element return the x, y position
function getElementScreenPosition(element){
	var eleft=element.offsetLeft;
	var etop=element.offsetTop;
	while(element.offsetParent!=null){
		var parent=element.offsetParent;
		eleft+=parent.offsetLeft;
		etop+=parent.offsetTop;
		element=parent;
	}
	return [eleft+3,etop+3];
}

//Show a popup
function popup(popupid){
	var content=documentgetElementById(popupid);
	content.style.cssText="";
	var contentForm=getFormFromElement(content);
	if(contentForm!=null){
		setHatsFocus(contentForm.name);
	}
	if (isNS4){
		document.layers[popupid].left = xMousePos;
		document.layers[popupid].top = yMousePos;
	}
	else if(isIEMobile){
		//no positioning
	}
	else if (isIE || OPERA || isNS6 || SAFARI || KONQUEROR){
		var popupCaller = getPopupCallerFromElement(content);
		if(popupCaller==null){
			popupCaller=getButton(popupid);
		}
		if(popupCaller!=null){
			
			if(content.style.visibility!="visible"){
				var position = getElementScreenPosition(popupCaller);
				if(content.offsetParent != null){
					
					var positionPopup = getElementScreenPosition(content);
					content.style.left=position[0]-positionPopup[0]+"px";
					content.style.top=position[1]-positionPopup[1]+"px";
				} else {
					content.style.left=position[0]+"px";
					content.style.top=position[1]+"px";
				}
			}
		} else { //shouldn't occur, covering bases
			if (isIE || OPERA){
				content.style.pixelLeft=xMousePos;
				content.style.pixelTop=yMousePos;
			} else if (isNS6 || SAFARI || KONQUEROR){
				content.style.left=xMousePos;
				content.style.top=yMousePos;
			}
		}
	}
	content.style.display="inline";
	content.style.visibility="visible";
}

//Show a popup in RTL screens
function popupRTL(popupid){
	var content=documentgetElementById(popupid);
	if (isNS4){
		document.layers[popupid].left = xMousePos;
		document.layers[popupid].top = yMousePos;
	} else if (isIE || OPERA){
		content.style.pixelLeft=xMouseRTLPos;
		content.style.pixelTop=yMousePos;
	} else if (isNS6){
		content.style.left=xMousePos;
		content.style.top=yMousePos;
	} else {
		content.style.left=xMousePos;
		content.style.top=yMousePos;
	}
	content.style.display="inline";
	content.style.visibility="visible";
}

//Close a popup
function closePopup(popupid){
	var content=documentgetElementById(popupid);
	content.style.visibility="hidden";
	content.style.display="none";
}

//Pick the field in a form and set its value
function pick(code, formName, fldName, popupName){
	setHatsFocus(formName);
	//var fld = eval("document."+hatsForm.name+"."+fldName);
	var elements = hatsForm.elements;
	for (var i=0,iL=elements.length,element,eType,eStyle; i<iL; ++i){
		element=elements[i];
		eType=element.type;
		eStyle=element.style;
		if ((element.name == fldName) && (eStyle.visibility != "hidden") && ((eType == "text") || (eType == "textarea") || (eType == "password"))){
			element.focus();
			if (enableBIDI && ((eStyle.direction == "rtl") ^ (hatsForm.dir == "rtl"))){
				var len = code.length;
				var text = "";
				for(var j=len-1,symbol; j>=0; j--){
					symbol = code.charAt(j);
					text+=symbol;
				}
				code = text;
			}
			element.value=code;
			element.blur();
			element.focus();
			if(!isIEMobile){
				element.setAttribute("MDT","1");
			}
			
			checkInput(element);
			break;
			
		}
	}
	closePopup(popupName); 
}

//Sets checkbox value
function setCheckboxValue(me){
	if (isHInput(me.type, me.name) && !isIEMobile){ 
		me.setAttribute("MDT", "1");
		
	}

	if (me.checked){
		checkInput(me);
	} else {
		var fld=eval("document."+hatsForm.name+".deselect_"+me.name);
		if (typeof(fld.value) == 'undefined'){
			var search = "deselect_"+me.name;
			var elements=hatsForm.elements;
			for (var i=0,iL=elements.length; i<iL; ++i){
				if (elements[i].name == search){
					fld = elements[i];
					break;
				}
			}
		}
		checkInput2(me.name,fld.value,"checkbox");
	}
}

//Sets subfile checkbox value
function SetSubfileCheckboxValue(code, pID){
	setHatsFocus(pID);
	var elements=hatsForm.elements;
	for (var i=0,iL=elements.length; i<iL; ++i){
		if (elements[i].type == "checkbox" && elements[i].checked){
			checkInput2(elements[i].name,code,"checkbox");
		}
	}
}

function setSubfileCheckboxAndSend(choice,key,formId){
	SetSubfileCheckboxValue(choice, formId);
	gobject = null;
	sendKeyIfNotSent(key,formId);
}

function sendKeyIfNotSent(key,formId){
	if(!isKeySent){
		ms(key,formId);
	}
}

//Evaluates checkbox value
function evalCheckboxValue(me, on, off){
	if (me.checked){
		checkInput2(me.name, on, "checkbox");
	} else {
		checkInput2(me.name, off, "checkbox");
	}
}

//Update screen locked status and disable hatsForm if screen is locked
function setScreenLocked(value){
	screenLocked = value;
	if (screenLocked && hatsForm){
		disableHhostForm(hatsForm);
	}
	updateStatusWindow();
}

//Disables HATS form elements
function disableHhostForm(form){
	var elements=form.elements;
	var element,eType;
	for (var i=0,iL=elements.length; i<iL; ++i){
		element=elements[i];
		eType=element.type;
		if ((eType != "button") && (eType != "hidden")){
			if (isHInput(eType,element.name)){
				element.disabled = true;
			}
		}
	}
}

//Disables form elements
function disableForm(form){
	var elements=form.elements;
	var element,eType;
	for (var i=0,iL=elements.length; i<iL; ++i){
		element=elements[i];
		eType=element.type;
		if (eType != "button" && eType != "hidden"){
			element.disabled = true;
		}
	}
}

//Arrow keys, home, end, backspace, insert, tab, enter, delete
function isNavigationKeyCode(event){
	if(isIEMobile) return false; 
	if(event.target && window.isDijit && isDijit(event.target)){ 
		var key = event.keyCode;
		return (event.ctrlKey || event.altKey || key == dojo.keys.HOME
				|| key == dojo.keys.END || key == dojo.keys.BACKSPACE
				|| key == dojo.keys.TAB || key == dojo.keys.ENTER
				|| key == dojo.keys.DELETE || key == dojo.keys.UP_ARROW
				|| key == dojo.keys.RIGHT_ARROW || key == dojo.keys.DOWN_ARROW
				|| key == dojo.keys.LEFT_ARROW || key == dojo.keys.INSERT);
	}
	
	
	
	
	else {
		var w = event.which;
		if (event.type && event.type=="keypress" && !isIE &&
				(event.charCode==46 || (typeof(event.charCode)=='undefined' && w==46))){
			return false;
		} else {
			return event.ctrlKey || event.altKey || (!isIE && (w==0 || w==8 || w==9 || w==13 || w==46));
		}
	}
	
}

function allowUnicodeOnly(event){
	if(isIEMobile) return;
}


function allowUnicodeOnlyForIEMobile(inputbox){}


function allowDigitsOnly(event){
	if(isIEMobile) return; 
	var ck = function(code){
		if (enableBIDI && ((code < 1642) && (code > 1631))) return true;
		if (code < 48 || code > 57) return false;
		return true;
	};
	contentCheck(event, ck);
}


function allowDigitsOnlyForIEMobile(inputbox){
	var ck = function(code){
		if (enableBIDI && ((code < 1642) && (code > 1631))) return true;
		if (code < 48 || code > 57) return false;
		return true;
	};
	contentCheckForIEMobile(inputbox, ck);
}


function allowAlphabeticOnly(event){
	if(isIEMobile) return; 
	var ck = function(code){
		if ((code < 65 || code > 90) && (code < 97 || code > 122) && code != 44 && code != 45 && code != 46 && code != 32) return false;
		return true;
	};
	contentCheck(event, ck);
}


function allowAlphabeticOnlyForIEMobile(inputbox){
	var ck = function(code){
		if ((code < 65 || code > 90) && (code < 97 || code > 122) && code != 44 && code != 45 && code != 46 && code != 32) return false;
		return true;
	};
	contentCheckForIEMobile(inputbox, ck);
}


function allowNumericOnly(event){
	if(isIEMobile) return; 
	var ck = function(code){
		if (enableBIDI && ((code < 1642) && (code > 1631))) return true;
		if ((code < 48 || code > 57) && code != 43 && code != 45 && code != 46 && code != 44 && code != 32) return false;
		return true;
	};
	contentCheck(event, ck);
}


function allowNumericOnlyForIEMobile(inputbox){
	var ck = function(code){
		if (enableBIDI && ((code < 1642) && (code > 1631))) return true;
		if ((code < 48 || code > 57) && code != 43 && code != 45 && code != 46 && code != 44 && code != 32) return false;
		return true;
	};
	contentCheckForIEMobile(inputbox, ck);
}


function allowNumLockOnly(event){
	if(isIEMobile) return;
	if(event.type=="keypress" || event.type=="paste" || event.type=="drop") {
		var ck = function(code){
			if (enableBIDI && ((code < 1642) && (code > 1631))) return true;
			if ((code < 48 || code > 57) && code != 43 && code != 45 && code != 46 && code != 44) return false;
			return true;
		};
		contentCheck(event, ck);
	} else if (event.type == "focus" && exceedString != null) {
		exceedString = null;
	}
}


function allowNumLockOnlyForIEMobile(inputbox){
	var ck = function(code){
		if (enableBIDI && ((code < 1642) && (code > 1631))) return true;
		if ((code < 48 || code > 57) && code != 43 && code != 45 && code != 46 && code != 44) return false;
		return true;
	};
	contentCheckForIEMobile(inputbox, ck);
}


function allowSignedNumeric(event){
	if(isIEMobile) return; 
	var ck = function(code){
		if (enableBIDI && ((code < 1642) && (code > 1631))) return true;
		if (code === 45) return true;
		if (code < 48 || code > 57) return false;
		return true;
	};
	contentCheck(event, ck);
}


function allowSignedNumericForIEMobile(inputbox){
	var ck = function(code){
		if (enableBIDI && ((code < 1642) && (code > 1631))) return true;
		if (code === 45) return true;
		if (code < 48 || code > 57) return false;
		return true;
	};
	contentCheckForIEMobile(inputbox, ck);
}


function allowAlphaNumericShift(event){
	if(isIEMobile) return;
	var ck = function(code){
		return true;
	};
	contentCheck(event, ck);
}


function allowAlphaNumericShiftForIEMobile(inputbox){
	var ck = function(code){
		return true;
	};
	contentCheckForIEMobile(inputbox, ck);
}

//Inhibit keyboard entry
function inhibitKeyboardEntry(event){
	if(isIEMobile) return; 
	event = (event) ? event : ((window.event) ? window.event : "");
	var code = event.keyCode ? event.keyCode : event.which;
	var element = event.target? event.target: event.srcElement;
	var type = event.type;
	//if it's a tab let it through for accessibility
	
	if(window.isDijit && isDijit(element) && event.charOrCode != dojo.keys.ENTER && event.charOrCode != dojo.keys.TAB && isNavigationKeyCode(event)){
		event.preventDefault();
	} else if(isIE && (type == "keypress" || ((type == "keyup" ||type == "keydown") && (code == 8 || code == 46)))){
		event.returnValue = false; 
	} else if(!isIE && type == "keypress" && !event.ctrlKey && !event.altKey &&(code == 0 || code == 8 || code == 46)){
		event.preventDefault(); 
	}
	
	if((element.value != element.defaultValue) || (code != 9 && (element.value + String.fromCharCode(code) != element.defaultValue))){
		element.value = element.defaultValue;
		if(SAFARI) event.preventDefault();
	}
	if(isIE && (type == "drop" || type == "paste" || type == "cut")) event.returnValue = false; 
}

//Inhibit keyboard entry for IE Mobile //
function inhibitKeyboardEntryForIEMobile(inputbox){
	inputbox.value = "";
}

function contentCheck(event, ck){
	if(isIEMobile) return; 
	event = (event) ? event : ((window.event) ? window.event : "");
	var code = event.keyCode ? event.keyCode : event.which;
	var pText = "";

	
	var e = (isIE) ? event.srcElement : event.target;
	if (window.isDijit && isDijit(e)){
		var djt = getDijit(e);
		if (djt && djt.domNode && djt.domNode.JSONData && djt.domNode.JSONData.value && djt.domNode.JSONData.value.hsrAttributes){
			var djtAtts = djt.domNode.JSONData.value.hsrAttributes;
			if (djtAtts && (djtAtts.signedNumeric || djtAtts.numericOnly) && (getDijitAttribute(djt, "initVal")==null)){
				setDijitAttribute(djt, "initVal", e.value);
			}
		}
	}else if(e.onkeypress){
	    var keypressEvents = " "+e.onkeypress;
		if((keypressEvents.indexOf("allowSignedNumeric")>=0 || keypressEvents.indexOf("allowNumericOnly")>=0) && (e.getAttribute("initVal")==null)){
		    e.setAttribute("initVal", e.value); 
		}
	}
	

	
	var verifyText = function(inStr, ck){
		var outStr = "";
		for (var i=0,iL=inStr.length; i<iL; ++i){
			if (ck(inStr.charCodeAt(i))) outStr += inStr.charAt(i);
			 
			else continue;
		}
		return outStr;
	};

	var eType=event.type;
	if(eType == "paste" || eType == "drop" || (eType == "focus" && exceedString != null)){  
		if(enableBIDI){
			var data="";
			try{
				if(clipboardData){
					data=clipboardData.getData("Text");
				}
				if(data){
					pText = verifyText(data,ck);
				}
			}catch(e){}
			if(pText.length == 0){
				if(isIE) event.returnValue = false;
			}
			return;
		}
		
		
		if ((!isIE && !IE11Plus) || MAC) return;
		
		if (IE11Plus){
			t = document.activeElement;
			slen = t.value.length;
			cPos = t.selectionStart;
			selectText = t.value.substring(t.selectionStart, t.selectionEnd);
			}
		else{
		var caretPos = document.selection.createRange().duplicate();
		var selectText = document.selection.createRange().text;
		var t = caretPos.parentElement();
		var beginField = t.createTextRange();
		caretPos.collapse();
		beginField.collapse();
		var slen = t.value.length;
		var cPos = 0;
		for (; cPos <= slen; cPos++){
			qa =caretPos.getBoundingClientRect();
			qb = beginField.getBoundingClientRect();
			if (qa.left == qb.left) break;
			caretPos.move("character",-1);
		}
		}
		if(eType == "paste"){
			var data="";
			try{
				if(clipboardData){
					data=clipboardData.getData("Text");
				}
				if(data){
					pText = verifyText(data,ck);
				}
			}catch(e){}
			//pText = verifyText(clipboardData.getData("Text"),ck);
		} else if (eType == "drop"){
			var data="";
			try{
				if(event.dataTransfer){
					data=event.dataTransfer.getData("Text");
				}
				if(data){
					pText = verifyText(data,ck);
				}
			}catch(e){}
			//pText = verifyText(event.dataTransfer.getData("Text"),ck);
		} else if (eType == "focus" && exceedString != null){
			
			pText = verifyText(exceedString,ck); 
			exceedString = null; 
		}
		if(pText.length > 0 && selectText == ""){
			if(isOverWriteMode()){
				
				if(cPos + pText.length > slen){
					t.value = (t.value.substring(0,cPos) + pText).substring(0,t.maxLength);
				} else {
					t.value = (t.value.substring(0,cPos) + pText + t.value.substring(cPos + pText.length ,slen)).substring(0,t.maxLength);
					var range = t.createTextRange(); 
					range.move('character',cPos+pText.length); 
					range.select(); 
				}
			} else {
				
				if(t.getAttribute("eliminateMaxlengthInIdeographicFields") == "true"){ 
					var iname = t.name;
					var pool = iname.split("_");
					var inputSize = parseInt(pool[2]);
					var a = " "+t.onkeypress;
					if(a.indexOf("allowDBCSPure") != -1 || a.indexOf("allowDBCSOnly3270") != -1){
						inputSize = inputSize / 2;
						t.value = t.value.substring(0,cPos) + pText.substring(0,inputSize-slen) + t.value.substring(cPos,slen);
					}	else {
						t.value = t.value.substring(0,cPos) + pText.substring(0,inputSize-slen) + t.value.substring(cPos,slen); 
					}
					var range = t.createTextRange(); 
					range.move('character',cPos+pText.substring(0,inputSize-slen).length); 
					range.select(); 
				}
				else 
					t.value = t.value.substring(0,cPos) + pText.substring(0,t.maxLength-slen) + t.value.substring(cPos,slen);
			}
		} else if(pText.length > 0 && selectText != ""){
			t.value = (t.value.substring(0,cPos) + pText + t.value.substring(cPos + selectText.length ,slen)).substring(0,t.maxLength);
		}
		
		
		if (event.preventDefault) event.preventDefault();
		event.returnValue = false;
		updateCursorPosition(false,null); 
		return;
	} else if(enableDBCSSession && ((eType == "keydown" && (code == 13 || code == 19 || code == 27 || code == 33 || code == 34 || (code > 111 && code < 124))) 
			|| (eType == "keyup" && code == 13)
			|| eType == "click" || eType == "blur")){
		var element = (isIE) ? event.srcElement : event.target;
		
		
		var isVerifyText = true;
		if(element.onkeypress){
			var keypressEvents = " "+element.onkeypress;
			if(keypressEvents.indexOf("allowSignedNumeric")>=0 || keypressEvents.indexOf("allowNumericOnly")>=0){
				var initVal = element.getAttribute("initVal");
				if (initVal!=null && initVal==element.value && element.getAttribute("MDT")!=1 ){  
					isVerifyText = false;
				}
			}
		}
		if (window.isDijit && isDijit(element)){
			var djt = getDijit(element);
			if (djt && djt.domNode && djt.domNode.JSONData && djt.domNode.JSONData.value && djt.domNode.JSONData.value.hsrAttributes){
				var djtAtts = djt.domNode.JSONData.value.hsrAttributes;
				if (djtAtts && (djtAtts.signedNumeric || djtAtts.numericOnly)){
					var initVal = getDijitAttribute(djt, "initVal");
					if (initVal!=null && initVal==e.value && e.getAttribute("MDT")!=1 ){ 
					   isVerifyText = false;
					}
				}
			}
		}
		if(isVerifyText){
		
		var nText = verifyText(element.value,ck);
		if(nText != element.value){
			element.value = nText;
			if(isIE){
				event.returnValue = false;
			} else {
				event.returnValue = false; 
				event.preventDefault();
			}
		}
		}
	} else if(eType == "keypress"){
		if(!ck(code) && !isNavigationKeyCode(event)){
			event.returnValue = false;
			
			var element = (isIE) ? event.srcElement : event.target;
			var isDojo17orAbove = false;
			if (window.isDijit && isDijit(element)){
				if (dojo.version && dojo.version.major == 1 && dojo.version.minor >= 7){
					isDojo17orAbove = true;
				}
			}
			
			if((!isIE && !isIPAD) || (isIE && isDojo17orAbove))
				if (event.preventDefault){event.preventDefault();}

		} else if (!MAC && !isIE){
			if (typeof event.returnValue == 'undefined')
				event.returnValue = true;
			else
				return;
		}
	}
}


function contentCheckForIEMobile(inputbox, ck){
	var verifyText = function(inStr, ck){
		var outStr = "";
		for (var i=0,iL=inStr.length; i<iL; ++i){
			if (ck(inStr.charCodeAt(i))) outStr += inStr.charAt(i);
			
			else continue;
		}
		return outStr;
	};

	var nText = verifyText(inputbox.value,ck);
	if(nText != inputbox.value){
		inputbox.value = nText;
	}
}

//Checks whether a character is a DBCS character or not
function isDBCSChar(unichar, isDBCSSession, isDBCSEuro, CodePage){
	return false;
}


function isHighSurrogate(unichar){return false;}
function isLowSurrogate(unichar){return false;}
function isSurrogate(highchar, lowchar){return false;}

//Auto-submit (send enter) if an element is filled
function autoSubmitIfFilled(element, event){
	var pool = element.name.split("_");
	if (pool.length == 3 ||(pool.length>3 && pool[3]!="radio")){
		if (pool[0].indexOf("in")!=-1){
			if (!isNaN(pool[2])){
				if (element.value.length == pool[2]){
					ms("[enter]");
				}
			}
		}
	}
	if (!MAC && !isIE)
		event.returnValue = true;
}

//Right justify with zeros prefixed
function rz(element){
	var str = element.value;
	var intLength = str.length;
	for (var i=0,iL=(element.maxLength - intLength); i<iL; ++i){
		str = "0" + str;
	}
	if (element.value != str){
		element.value = str;
	}
}

//Right justify with blanks prefixed
function rb(element){
	var str = element.value;
	var intLength = str.length;
	for (var i=0,iL=(element.maxLength - intLength); i<iL; ++i){
		str = " " + str;
	}
	if (element.value != str){
		element.value = str;
	}
}

//Opens a calendar
function openCalendar(event, baseURL, id, inputFieldNames, datePattern, patternLocale, rangeStart, rangeEnd, clientLocale, defaultValue, isInlineCalendar){
	if (!isInlineCalendar)
		isInlineCalendar = false;

	if (isInlineCalendar){
		
		
		var target = (isIE) ? event.srcElement : event.target;
		for (var p=target.parentNode;p!=null;p=p.parentNode){
			if ((p.id) && ((p.id.indexOf("HATSFR")) == 0)){
				var parentName=p.id.substring(6);
				setHatsFocus(parentName);
				break;
			}
		}
		
		var hatsPortalDiv;
		if (hatsForm.name){
			
			hatsPortalDiv = document.getElementById("HATSFR"+hatsForm.name);
			if (hatsPortalDiv)
				hatsCalendarID=hatsForm.name;
			
		}

		var calendarDiv = document.getElementById("hatsCalendarDiv"+hatsCalendarID);
		if (!calendarDiv){
			var newDiv = document.createElement("div");
			newDiv.id = "hatsCalendarDiv"+hatsCalendarID;
			newDiv.setAttribute("class", "calendarDivClass");
			newDiv.setAttribute("style","z-index: 100;"); 
			calendarDiv = newDiv;

			if (hatsPortalDiv){
				
				var all = hatsPortalDiv.getElementsByTagName('*');
				if (window.addEventListener){
					for (var i=0,iL=all.length; i<iL; ++i){
						all[i].addEventListener("focus", function(){document.getElementById(calendarDiv.id).style.display='none';}, false);
					}
				} else { 
					for (var i=0,iL=all.length; i<iL; ++i){
						all[i].attachEvent("onfocus", function(){document.getElementById(newDiv.id).style.display='none';});
					}
				}
				

				var portalDivChild = hatsPortalDiv.getElementsByTagName("div")[0];
				if (portalDivChild){
					portalDivChild.appendChild(calendarDiv);
				} else {
					hatsPortalDiv.appendChild(calendarDiv);
				}

				
				if (!OPERA){
					if (window.addEventListener){ // Mozilla, Netscape, Firefox
						hatsPortalDiv.addEventListener("click", function (){document.getElementById(newDiv.id).style.display='none';}, false);
					}
					
					
					
					
					
				}
			} else {
				
				var all = document.getElementsByTagName('*');
				if (window.addEventListener){
					for (var i=0,iL=all.length; i<iL; ++i){
						all[i].addEventListener("focus", function(){document.getElementById('hatsCalendarDiv').style.display='none';}, false);
					}
				} else { 
					for (var i=0,iL=all.length; i<iL; ++i){
						all[i].attachEvent("onfocus", function(){document.getElementById('hatsCalendarDiv').style.display='none';});
					}
				}
				document.body.appendChild(calendarDiv);

				
				if (!OPERA){
					if (window.addEventListener){ //Mozilla, Netscape, Firefox
						document.body.addEventListener("click",  function (){document.getElementById(newDiv.id).style.display='none';}, false);
					}
					
					
					
					
					
				}
			}
		}
		
		
		if (event.srcElement){
			evX = getAbsPosX(event.srcElement);
			evY = getAbsPosY(event.srcElement);
		}
		else if (event.target){
			evX = getAbsPosX(event.target);
			evY = getAbsPosY(event.target);
		}  else {
			evX = 10;
			evY = 10;
		}
	}

	var names = "";
	var values = "";

	for (var i=0,iL=inputFieldNames.length; i<iL; ++i){
		var e = eval("hatsForm." + inputFieldNames[i]);
		if (typeof e.value == 'undefined'){
			if (typeof e[0].value != 'undefined'){
				values = values + e[0].value;
			}
		} else {
			values = values + e.value;
		}
		names = names + inputFieldNames[i];
		if (i < iL-1){
			values = values + "|";
			names = names + "|";
		}
	}
	var address = baseURL + "?";
	address += "datePattern=" + encodeURIComponent(datePattern);
	address += "&inputFieldNames=" +  encodeURIComponent(names);
	address += "&inputFieldValues=" + encodeURIComponent(values);
	address += "&patternLocale=" + encodeURIComponent(patternLocale);
	address += "&rangeStart=" + encodeURIComponent(rangeStart);
	address += "&rangeEnd=" + encodeURIComponent(rangeEnd);
	address += "&calendarID=" + encodeURIComponent(id);
	address += "&clientLocale=" + encodeURIComponent(clientLocale);
	address += "&defaultValue=" + encodeURIComponent(defaultValue);
	address += "&useInlineCalendar=" + encodeURIComponent(isInlineCalendar);

	if (isInlineCalendar){
		sendCalendarRequest(address);
	} else {
		var w = window.open(address, id, "height=250,width=250,left=" + event.screenX + ",top=" + event.screenY + ",status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=yes");
		w.focus();
	}
	return false;
}

//Reverse the data direction for right-to-left
function reverseData(element,inputFieldValues){
	if (element.style.direction == "rtl"){
		var text = inputFieldValues;
		var len = text.length;
		var temp = "";
		for(var j=0;j<len;++j){
			temp +=  text.charAt(len - j - 1);
		}
		inputFieldValues = temp;
	}
	return inputFieldValues;
}

//Check for BIDI and set all of inupt field names and values.
function applyDate(inputFieldNames, inputFieldValues, isInlineCalendar, event){
	
	
	if (event){
		var target = (isIE) ? event.srcElement : event.target;
		for (var p=target.parentNode;p!=null;p=p.parentNode){
			if ((p.id) && ((p.id.indexOf("HATSFR")) == 0)){
				var parentName=p.id.substring(6);
				setHatsFocus(parentName);
				break;
			}
		}
	}
	
	for (var i=0,iL=inputFieldNames.length,iName,iVal; i<iL; ++i){
		iName=inputFieldNames[i];
		iVal=inputFieldValues[i];
		var e = eval("hatsForm." + iName);

		if (typeof e.value == 'undefined'){
			if (typeof e[0].value != 'undefined'){
				e = e[0];
				if ((isInlineCalendar) && (i == (iL - 1))){
					e.focus();
				}
			}
		}
		else if (e && isInlineCalendar && (i == (iL - 1))){
			e.focus();
		}

		try {
			e.setAttribute("MDT","1");
		}
		catch(ex){
			var errNum = (ex.number) ? (ex.number & 0xFFFF) : "";
			alert("applyDate Exception " + errNum + ": " + ex.name + " " + ex.toString());
		}

		if (enableBIDI){
			if(e.length > 0){
				for (var k=0,kL=e.length; k<kL; ++k){
					iVal = reverseData(e[k], iVal);
				}
			} else {
				iVal = reverseData(e, iVal);
			}
		}
		checkInput2(iName, iVal, e.type);

		if (i == (iL - 1)){// only set the cursor position on the last field (works for single and multiple)
			var inputField = iName.split("_");
			var fstart = parseInt(inputField[1]);
			var flength = parseInt(inputField[2]);
			var d = fstart + flength;

			if (flength <= iVal.length){
				d = d - 1; //adjust for last in field
			}

			setCursorPosition(d, hatsForm.name);
			hatsForm.CARETPOS.value = d + 1;
		}
	}
}

//Set all element values to an empty value for those listed in the nameList
function wipeInput(nameList){
	var myArray = nameList.split("|");
	var elements=hatsForm.elements;
	for (var i=0,iL=myArray.length; i<iL; ++i){
		if (myArray[i] != ""){
			for (var j=0,jL=elements.length,elementNext; j<jL; ++j){
				elementNext = elements[j];
				if (elementNext.name == myArray[i])
					elementNext.value="";
			}
		}
	}
	return;
}

//Initialize scrollbar
function scrollbarInit(isVertical,screenPos,scrollSize,sliderPos,sliderSize,formID){
	if (!scrollbarEnabled){
		document.onmousemove = mouseMove;
		scrollbarEnabled = true;
		scrollbarArray = [];
		scrollbarFormArray = [];
	}
	scrollbarArray[scrollbarCount] = "" + screenPos + "-" + isVertical + "-" + scrollSize + "-" + sliderPos + "-" + sliderSize;
	scrollbarFormArray[scrollbarCount] = formID;
	scrollbarCount++;
}

//Get X coordinate for an event
function getEvtX(evt){
	return ((evt) ? (evt.clientX) : 0);
}

//Get Y coordinate for an event
function getEvtY(evt){
	return ((evt) ? (evt.clientY) : 0);
}

//Get X and Y coordinate for an event
function getEvtLoc(evt){
	return "("+getEvtX(evt)+","+getEvtY(evt)+")";
}

//Get the object location
function getObjLoc(obj){
	if (obj)
		return "("+obj.offsetLeft+","+obj.offsetTop+","+obj.clientWidth+"w,"+obj.clientHeight+"h)";
	else
		return obj;
}

//Get the drag object location
function getDragObjLoc(obj){
	return ((obj) ? ((dragvert) ? (obj.offsetTop) : (obj.offsetLeft)) : 0);
}

//Get the drag object size
function getDragObjSize(obj){
	return ((obj) ? ((dragvert) ? (obj.clientHeight) : (obj.clientWidth)) : 0);
}

//Set drag object position
function dragSetObjPos(obj, pos){
	if (dragvert){
		if (NN)
			obj.style.top = pos;
		else
			obj.style.pixelTop = pos;
	} else {
		if (NN)
			obj.style.left = pos;
		else
			obj.style.pixelLeft = pos;
	}
	dragDelta = pos;
}

//Get the dragged distance
function dragGetDelta(evt){
	var delta = (dragvert) ? ( getEvtY(evt) - dragStartY) : ( getEvtX(evt) - dragStartX);
	delta = Math.min((Math.max(delta, dragMaxUpMove)), dragMaxDownMove);
	return delta;
}

//Handles mouse movement for dragging
function mouseMove(evt){
	try{
		if (dragapproved){
			evt = (evt) ? evt : event;
			dragSetObjPos(dragthumbObj, dragGetDelta(evt));
			dragmoving = true;
			return false;
		}
	}
	catch(e){
		var errNum = (e.number) ? (e.number & 0xFFFF) : "";
		alert("mouseMove Exception "+errNum+": " + e.name + " " + e.toString());
		if (e.fileName)
			alert(e.fileName + ":" + e.lineNumber);
		dragReset();
	}
}

//Handles start of dragging
function dragStart(evt){
	try{
		evt=(evt) ? evt : event;
		var target=(evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
		if (target && target.id){
			dragthumbID= target.id.split("_");
			if ((dragthumbID.length==4) && (dragthumbID[0]=="scroll") && (dragthumbID[2]=="thumb")){
				dragapproved = true;
				dragvert = (dragthumbID[3]=="v");
				screenpos = dragthumbID[1];
				document.onmouseup = dragStop;
			} else {
				dragapproved = false;
			}
		}
		if (dragapproved){
			upbutton = documentgetElementById("scroll_"+screenpos+"_up"); 
			downbutton = documentgetElementById("scroll_"+screenpos+"_down");
			pageupbutton = documentgetElementById("scroll_"+screenpos+"_pageup");
			pagedownbutton = documentgetElementById("scroll_"+screenpos+"_pagedown");
			dragthumbObj = target;
			if (NN){
				var sty = getComputedStyle(dragthumbObj,"");
				dragStyleLeft = sty.getPropertyValue("left");
				dragStyleTop = sty.getPropertyValue("top");
			} else {
				dragStyleLeft = dragthumbObj.style.pixelLeft;
				dragStyleTop = dragthumbObj.style.pixelTop;
			}
			if (NN){
				dragStartX= evt.pageX;
				dragStartY= evt.pageY;
			} else {
				dragStartX= getEvtX(evt);
				dragStartY= getEvtY(evt);
			}
			dragMaxUpMove= (pageupbutton) ? getDragObjLoc(pageupbutton)-getDragObjLoc(target)+2 : 0;
			dragMaxDownMove= (pagedownbutton) ? (getDragObjLoc(downbutton)-getDragObjLoc(target)-getDragObjSize(target)-2) : 0;
		}
	}
	catch(e){
		var errNum = (e.number) ? (e.number & 0xFFFF) : "";
		alert("dragStart Exception "+errNum+": " + e.name + " " + e.toString());
		if (e.fileName)
			alert(e.fileName + ":" + e.lineNumber);
		dragReset();
	}
}

//Handles reset of dragging
function dragReset(){
	dragapproved=false;
	dragvert=false;
	dragmoving=false;
}

//Handles stop of dragging
function dragStop(evt){
	try{
		if (dragapproved){
			evt = (evt) ? evt : event;
			dragReset();
			if (dragDelta != 0){
				dragMove = (dragDelta > 0) ? dragDelta : (0-dragDelta);
				dragMaxMove = (dragDelta > 0) ? dragMaxDownMove : (0-dragMaxUpMove);
				for (var i=0; i<scrollbarCount; ++i){
					sbData = scrollbarArray[i].split("-");
					if (sbData[0]==dragthumbID[1]){
						// build command: enptuislider-[pos]-[vertical]-[size]-[sliderpos]-[slidersize]-[U/D]-[movement]
						scrollSize = sbData[2];
						sliderPos = sbData[3];
						sliderSize = sbData[4];
						sliderAboveBarSize = sliderPos-1;
						sliderBelowBarSize = (scrollSize-2)-sliderSize-sliderAboveBarSize;
						pixelsPerPos = dragMaxMove / ((dragDelta > 0) ? sliderBelowBarSize:sliderAboveBarSize);
						movementSize = Math.round(dragMove / pixelsPerPos);
						if (movementSize == 0)
							movementSize = 1;
						movementDirection = (dragDelta > 0) ? "D":"U";
						workingCommand = "enptuislider-"+scrollbarArray[i]+"-"+movementDirection+"-"+movementSize;
						ms(workingCommand, scrollbarFormArray[i]);
					}
				}
			}
		}
	}
	catch(e){
		var errNum = (e.number) ? (e.number & 0xFFFF) : "";
		alert("dragStop Exception "+errNum+": " + e.name + " " + e.toString());
		if (e.fileName)
			alert(e.fileName + ":" + e.lineNumber);
		dragReset();
	}
}

function createNewXHR(){
	
	// branch for native XMLHttpRequest object
	if (window.XMLHttpRequest){
		return new XMLHttpRequest();
		// branch for IE/Windows ActiveX version
	} else if (window.ActiveXObject){
		try{
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (level1exception){
			try{
				return new ActiveXObject("Microsoft.XMLHTTP");
			} catch (level2exception){
				return null;
			}
		}
	}
}

function sendSubsequentGetNextTransformedScreenRequest(){
	if(typeof hatsForm.beensubmitted != "undefined") return;
	if(xhr==null){
		xhr=createNewXHR();
	}
	else {
		xhr.abort();
	}
	if (xhr!=null){
		if(xhrhandler!=null){
			xhr.onreadystatechange = xhrhandler;
		}
		xhr.open("GET", xhruri, true);
		if(xhrid!=null){
			xhr.setRequestHeader('componentIdentifier', xhrid);
		}
		if(xhrwidget!=null){
			xhr.setRequestHeader('widget', xhrwidget);
		}
		if(xhrsettings!=null){
			xhr.setRequestHeader('widgetSettings', encodeURIComponent(xhrsettings));
		}
		xhr.setRequestHeader("charset", document.charset ? document.charset : document.characterSet);
		xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		if(typeof hatsForm.beensubmitted != "undefined") return;
		xhr.send(null);
	}
}

function sendGetNextTransformedScreenRequest(uri, id, widget, settings, readyEventHandler){
	if(typeof hatsForm.beensubmitted != "undefined") return;
	xhrid=id;
	if(window.encodeURIComponent){
		xhrid = encodeURIComponent(id);
	}else if (window.escape){
		xhrid = escape(id);
	}
	xhruri=uri;
	xhrwidget=widget;
	xhrsettings=settings;
	xhrhandler=readyEventHandler;
	setTimeout(sendSubsequentGetNextTransformedScreenRequest,1000);
}

function combinedScreensWidgetSet(uri,id,widget,settings){
	if(null==hatsForm){
		hatsForm=getHATSForm(formID);
	}
	sendGetNextTransformedScreenRequest(uri,id, widget, settings, updateArea);
}

function updateArea(){
	if(typeof hatsForm.beensubmitted != "undefined") return;
	if(xhr!=null){
		if(xhr.readyState){
			if(xhr.readyState==4){
				if(typeof hatsForm.beensubmitted != "undefined") return;
				var divArea = eval(documentgetElementById("HScreenCombinationArea"));
				if(divArea!=null){
					var updateText=xhr.responseText;
					if(updateText!=null){
						try{
							var replace=xhr.getResponseHeader("currentTransform");
							if(replace=="append"){//replace or update?
								divArea.innerHTML+=updateText;
							}else{
								divArea.innerHTML=updateText;
							}
						}catch(e){
							divArea.innerHTML=updateText;
						}
						try{
							var keepgoing=xhr.getResponseHeader("moreScreens");
							if(keepgoing=="true"){
								if(typeof hatsForm.beensubmitted != "undefined") return;
								setTimeout(sendSubsequentGetNextTransformedScreenRequest,1000);
							}
						}catch(e){}
					}
				}
			}
		}
	}
}

function sendHeader(uri, headerReady, info){
	if(xhr==null){
		xhr=createNewXHR();
	}
	else {
		xhr.abort();
	}

	if (xhr!=null){
		if(ready!=null){
			xhr.onreadystatechange = headerReady;
		}
		xhr.open("HEAD", uri, true);
		if(info!=null){
			xhr.setRequestHeader('info', info);
		}
		xhr.send(null);
	}
}

function evalRefreshCheckResults(){
	if(xhr!=null){
		if (xhr.readyState==4){
			currentRefreshState(xhr.status);
		}
	}
}

function currentRefreshState(refreshState){
	if(refreshState==204) message="nothing new";
	else if(refreshState==205) message="please hit the refresh button";
	else if(refreshState==404) message="host session not found";
	else if(refreshState==501) message="web session not found";
	else if(refreshState==503) message="Busy, server doing something with this connection...";
	else message="no response ("+refreshState+")";
	alert(message);
}

function convertToUpperCase(event){
	if(preventDefault) return;
	if(isIEMobile) return;
	var code = event.keyCode ? event.keyCode : event.which;
	var textControl = (isIE) ? event.srcElement : event.target;

	
	if (textControl.onkeypress){
		var keypressEvents = " "+textControl.onkeypress;
		if ((keypressEvents.indexOf("allowDBCSOnly")!=-1)|| (keypressEvents.indexOf("allowDBCSPure")!=-1)){
			return;
		}
	}
	

	if(enableBIDI){
		upperCase = true;
		return;
	}
	var eType=event.type;
	
	if(isIE || IE11Plus){
		
		if((((code >=97 && code <=111)
				|| ((code>=112 && code<=122) && !(event.target && window.isDijit && isDijit(event.target)
				&& event.keyChar!=null && event.keyChar!='undefined' &&  event.keyChar.length==0)))
				|| (useAccentedCharacters && code>=224 && code<=254 && code!=247)) && (eType == "keypress")){	
			code = code - 32;
			event.keyCode = code;
			
			if(IE11Plus){
				var key;
				if(code){
					key = String.fromCharCode(code);
				}
					var newText = typeof key != 'undefined' ? key : String.fromCharCode(code);
					selectText = textControl.value.substring(textControl.selectionStart, textControl.selectionEnd);
					slen = textControl.value.length;
					var oldSelectionStart = textControl.selectionStart;
					var oldSelectionEnd = textControl.selectionEnd;
					if (event.preventDefault) event.preventDefault();
					
					
					if((selectText!="") || !isOverWriteMode()){
						textControl.value = textControl.value.substring(0, oldSelectionStart) + newText + textControl.value.substring(oldSelectionEnd);
						textControl.setSelectionRange(oldSelectionStart + newText.length, oldSelectionStart + newText.length);
						if (typeof event.returnValue == 'undefined')
							event.returnValue = false; 
						return;
					}
					
					else{
					if(oldSelectionStart + newText.length > slen){				
						textControl.value = (textControl.value.substring(0,oldSelectionStart) + newText).substring(0,textControl.maxLength);	
						} else {
						textControl.value = (textControl .value.substring(0,oldSelectionStart) + newText + textControl.value.substring(oldSelectionStart + newText.length ,slen)).substring(0,textControl.maxLength);
							var range = textControl.createTextRange(); 
								range.move('character',oldSelectionStart+newText.length); 
								range.select(); 
								}
					}	
			}
			if(!MAC) event.returnValue = true;
			return;
		} else if (eType == "paste" || eType == "drop"){
			var data="";
			try{
				if(clipboardData){
					data=clipboardData.getData("Text");
					if(data){
						var outStr = "";
						for (var i=0,iL=data.length; i<iL; ++i){
							var code = data.charAt(i);
							if (!isDBCSChar(code, enableDBCSSession, enableDBCSEuro, CodePage)){
								code = code.toUpperCase();
							}
							outStr += code;
						}
						clipboardData.setData("Text",outStr);
						
					}
				}
			}catch(e){}
			//clipboardData.setData("Text", clipboardData.getData("Text").toUpperCase());
		} else if (eType == "blur"){
			var data = textControl.value;
			if(data){
				var outStr = "";
				for (var i=0,iL=data.length; i<iL; ++i){
					var code=data.charAt(i);
					if (!isDBCSChar(code, enableDBCSSession, enableDBCSEuro, CodePage)){
						code=code.toUpperCase();
					}
					outStr+=code;
				}
				textControl.value = outStr;
			}
		}
		
	} else {
		if(((code >=97 && code <=122) || (useAccentedCharacters && code>=224 && code<=254 && code!=247)) && (eType == "keypress" || eType == "paste" || eType == "drop")){
			if(textControl.maxLength != -1 && textControl.value.length >= textControl.maxLength) 
				return; 

			code = code-32;
			var key;
			if(code){
				key = String.fromCharCode(code);
			}
			if (typeof event.ctrlKey != 'undefined'){
				if (event.ctrlKey){
					return true;
				}
			}
			var oldSelectionStart = textControl.selectionStart;
			var oldSelectionEnd = textControl.selectionEnd;
			if (typeof oldSelectionStart == 'undefined' || typeof oldSelectionEnd == 'undefined'){
				return true;
			}
			if (event.preventDefault) event.preventDefault();

			if (typeof event.returnValue == 'undefined')
				event.returnValue = false; 

			//var selectedText = textControl.value.substring(oldSelectionStart, oldSelectionEnd);
			var newText = typeof key != 'undefined' ? key : String.fromCharCode(code);
			textControl.value = textControl.value.substring(0, oldSelectionStart) + newText + textControl.value.substring(oldSelectionEnd);
			textControl.setSelectionRange(oldSelectionStart + newText.length, oldSelectionStart + newText.length);
			return false;
		}
	}
}


function convertToUpperCaseForIEMobile(inputbox){
	var data = inputbox.value;
	if(data){
		var outStr = "";
		for (var i=0,iL=data.length; i<iL; ++i){
			var code = data.charAt(i);
			if (!isDBCSChar(code, enableDBCSSession, enableDBCSEuro, CodePage)){
				code = code.toUpperCase();
			}
			outStr += code;
		}
		inputbox.value = outStr;
	}
	
}

function alerter(text){
	var alerterspace = eval(document.getElementById("alerterspace"));
	if (alerterspace==null){
		alerterspace = document.createElement("div");
		document.body.appendChild(alerterspace);
	}
	if (alerterspace!=null){
		alerterspace.innerHTML= text+ +"<BR>" + alerterspace.innerHTML;
	}
}

function mycaret(obj){
	try{
		var pos = 0;
		if(!isIE){
			pos = obj.selectionStart;
		}else{
			var caretPos = document.selection.createRange().duplicate();
			var t = caretPos.parentElement();
			if (t.type!="textarea" && t.type!="text" && t.type!="password") return -1;
			var beginField = t.createTextRange();
			caretPos.collapse();
			beginField.collapse();
			var slen = t.value.length;
			for (pos = 0; pos <= slen; pos++){
				qa =caretPos.getBoundingClientRect();
				qb = beginField.getBoundingClientRect();
				if (qa.left == qb.left){
					break;
				}
				caretPos.move("character",-1);
			}
		}
		return pos;
	}catch(e){
		return -1;
	}
}

function caretstart(obj){
	try{
		if(!isIE) return obj.selectionStart;
		var caretPos = document.selection.createRange().duplicate();
		
		return parseInt(""+caretPos.getBoundingClientRect().left);
	}catch(e){
		return -1;
	}
}

function caretend(obj){
	try{
		if(!isIE) return obj.selectionEnd;
		var caretPos = document.selection.createRange().duplicate();
		
		return parseInt(""+caretPos.getBoundingClientRect().right);
	}catch(e){
		return -1;
	}
}

function setCaretToFirstInputPosition(control){
	
	var cursorOffset = 0;
	var intInitialCursorPosition = 0;
	var cType=control.type;
	try{
		if (hatsForm.CURSORPOSITION.value != null){
			intInitialCursorPosition = hatsForm.CURSORPOSITION.value;
		}
	}catch(e){ 
		return; 
	}
	if(isIEMobile) return;
	if ((cType == "text") || (cType == "textarea") || (cType == "password")){
		if ((control.name != null) && (control.name.length > 0)){
			var elemlst = control.name.split("_");
			if ((elemlst.length == 3) || (elemlst.length > 3)){
				if (elemlst[0].indexOf("in") != 1){
					var start = parseInt(elemlst[1], 10);
					var len = parseInt(elemlst[2], 10);
					if ((intInitialCursorPosition >= start) && (intInitialCursorPosition < (start + len))){
						
						if (intInitialCursorPosition > start){
							cursorOffset = intInitialCursorPosition - start;
							for(var i=0; i <cursorOffset; ++i){ 
								if (isDBCSChar(control.value.charAt(i), enableDBCSSession, enableDBCSEuro, CodePage)){ 
									if(i+1 < cursorOffset && isSurrogate(control.value.charAt(i), control.value.charAt(i+1))) 
										i++; 
									cursorOffset--; 
								}
							}
						}
					}
				}
			}
		}
	}

	var currentCaretSelWidth = caretend(control)-caretstart(control);  
	var currentCaretPos = mycaret(control);  
	var content = control.value;
	var a = " "+control.onkeypress; 
	if (isIE && !selectAllonFocus && (currentCaretSelWidth!=0 || (content.charAt(0) == " " && a.indexOf("allowDBCSOnly")!=-1))){  
		if ((cType=="textarea") || (cType=="text") || (cType=="password") || (cType == "hidden") || (cType == "button") || (cType == "reset") || (cType == "submit")){
			if(control.createTextRange){
				var range = control.createTextRange();
				if(content.charAt(0) == " " && a.indexOf("allowDBCSOnly")!=-1){
					range.move("character",1);
					if(cursorOffset > 0){ 
						range.moveStart('character', cursorOffset-1); 
					}
				}
				else if(cursorOffset > 0){ 
					range.moveStart('character', cursorOffset);
				}
				range.collapse(true);
				range.select();
			}
			else {
				control.setSelectionRange(cursorOffset, cursorOffset);
			}
		}
	}
}

function encodeSpreadsheetURI(filename, portletID, link, combineScreenID){
	filename = encodeURI(filename);
	var escapeLink = link + "&fileNamePrefix=" + filename + "&portletID=" + portletID;
	if (combineScreenID){
		escapeLink = escapeLink + "&combineScreenID=" + encodeURI(combineScreenID);
	}
	location.href=escapeLink;
}

function tableRowPageRequest(uri, handler, area){
	if(xhrTR==null){
		xhrTR=createNewXHR();
	} else {
		xhrTR.abort();
	}
	if(area!=null){
		tableRowArea=area;
	}
	if (xhrTR!=null){
		if(handler!=null){
			xhrTR.onreadystatechange = handler;
		}
		try{
			xhrTR.open("GET",uri, true);
		}catch(except){
			alert("An exception occurred during open. Error name: " + except.name + ". Error message: " + except.message);
		}
		try{
			xhrTR.send(null);
		}catch(except){
			alert("An exception occurred during send. Error name: " + except.name + ". Error message: " + except.message);
		}
	}
}

function updateTableRowArea(){
	if(xhrTR!=null){
		if(xhrTR.readyState){
			if(xhrTR.readyState==4){
				if(xhrTR.status==404){
					ms("refresh");
					return;
				}
				var updateText=xhrTR.responseText;
				var area = documentgetElementById(tableRowArea);
				if(area!=null){
					if(updateText!=null){
						try{
							area.innerHTML=updateText;
						}catch(err){
							alert(tableRowArea+" area update failed:"+err);
						}
					}
				}
			}
		}
	}
}

function expandRow(areaName, path){
	try{
		var iconView = documentgetElementById(areaName+"Expand");
		var iconHide = documentgetElementById(areaName+"Collapse");
		var areaTR = documentgetElementById(areaName+"TR");
		var areaDIV = documentgetElementById(areaName+"DIV");
		var jsessionid="";
		//parsing of jsessionid done to handle URL rewriting
		if(path.indexOf(";jsessionid=") != -1){
			jsessionid=path.slice(path.indexOf(";jsessionid="));
			path=path.replace(jsessionid,"");
		}
		if(areaDIV.innerHTML.length<3){
			tableRowPageRequest(path+"/"+areaName+".html"+jsessionid, updateTableRowArea, areaName+"DIV");
		}
		if(MOZILLA && !isIEMobile){
			areaTR.style.display="table-row";
			areaTR.style.visibility="visible";
			var areaTD   = documentgetElementById(areaName+"TD");
			areaTD.style.display="table-cell";
			areaTD.style.visibility="visible";
			areaDIV.style.display="inline";
			areaDIV.style.visibility="visible";
		}else{
			areaTR.style.display="block";
			areaTR.style.visibility="visible";
			areaDIV.style.display="block";
			areaDIV.style.visibility="visible";
		}

		iconView.style.display="none";
		iconView.style.visibility="hidden";
		iconHide.style.display="inline";
		iconHide.style.visibility="visible";
		iconHide.focus();
	}catch(err){
		alert("An exception occurred in the script. Error name: " + err.name + ". Error message: " + err.message);
	}
	return;
}

function collapseRow(areaName){
	try{
		var iconView = documentgetElementById(areaName+"Expand");
		var iconHide = documentgetElementById(areaName+"Collapse");
		var areaTR  = documentgetElementById(areaName+"TR");
		var areaDIV = documentgetElementById(areaName+"DIV");

		areaTR.style.visibility="hidden";
		areaTR.style.display="none";
		if(MOZILLA && !isIEMobile){
			var areaTD   = documentgetElementById(areaName+"TD");
			areaTD.style.visibility="hidden";
			areaTD.style.display="none";
		}
		areaDIV.style.visibility="hidden";
		areaDIV.style.display="none";
		iconView.style.display="inline";
		iconView.style.visibility="visible";
		iconHide.style.display="none";
		iconHide.style.visibility="hidden";
		iconView.focus();
	}catch(err){
		alert("An exception occurred in the script. Error name: " + err.name + ". Error message: " + err.message);
	}
	return;
}


function exactCursor(iden, caret){
	try{
		var areaDIV=documentgetElementById(iden+"CEP");
		if(areaDIV==null){return;}
		if(caret==-1 && areaDIV.style.visibility=="hidden"){
			return;
		}
		var areaIN=documentgetElementById(iden+"");
		var pool=iden.split("_");
		var fieldstart=parseInt(pool[1],10);
		if(caret!=null){
			if(caret!=-1){
				var pos=fieldstart+parseInt(caret,10);
				if(pos==exactCursorLockedChoice){exactCursor(iden);return;}
				exactCursorLockedChoice=pos;
				moveOtherExactCursors(iden);
				
				if(hatsForm){
					if(hatsForm!=null){
						if(enableDBCSSession){
							var inputValue = new String(areaIN.value.substring(0,caret));
							for(var i=0,iL=inputValue.length; i<iL; ++i){
								if (isDBCSChar(inputValue.charAt(i), enableDBCSSession, enableDBCSEuro, CodePage)){
									if(i+1 < inputValue.length && isSurrogate(inputValue.charAt(i), inputValue.charAt(i+1)))
										i++;
									pos++;
									var onKeyPressValue = " " + areaIN.onkeypress;
									if (onKeyPressValue != null && onKeyPressValue.indexOf("allowUnicodeOnly") != -1){
										pos--;
									}
								}
							}
							exactCursorLockedChoiceForDBCS=pos;
						}
						hatsForm.CURSORPOSITION.value=pos;hatsForm.CARETPOS.value=pos;
					}
				}
			}//else just redraw
		}else if(areaDIV.style.visibility!="hidden"){
			var cursorMode=documentgetElementById(iden+"CursorMode");cursorMode.style.display="none";cursorMode.style.visibility="hidden";
			var dataMode=documentgetElementById(iden+"DataMode");dataMode.style.display="inline";dataMode.style.visibility="visible";
			areaDIV.innerHTML="";areaDIV.style.display="none";areaDIV.style.visibility="hidden";
			areaIN.style.display="inline";areaIN.style.visibility="visible";areaIN.focus();
			return;
		}
		var caretStyle="";var nocaretStyle="";var caretClass="";var nocaretClass="";
		try{caretStyle=documentgetElementById(iden+"CaretStyle").innerHTML;}catch(erc){caretStyle="";}
		try{nocaretStyle=documentgetElementById(iden+"NoCaretStyle").innerHTML;}catch(erc){nocaretStyle="";}
		try{caretClass=documentgetElementById(iden+"CaretClass").innerHTML;}catch(erc){caretClass="";}
		try{nocaretClass=documentgetElementById(iden+"NoCaretClass").innerHTML;}catch(erc){nocaretClass="";}
		var out="&nbsp;";var g=0; var st=""; var cl=""; var txt=areaIN.value;
		if(areaIN.type=="text" || areaIN.type=="textarea" || areaIN.type=="password"){
			for(;g<txt.length;g++){
				if(exactCursorLockedChoice==fieldstart+g){st=caretStyle;cl=caretClass;}else{st=nocaretStyle;cl=nocaretClass;}
				out+="<a href='javascript:exactCursor(\""+iden+"\",\""+g+"\");' id='"+iden+"c"+g+"'class='"+cl+"' style='"+st+"'>"+(areaIN.type=="password"?"*":txt.charAt(g))+"</a>&nbsp;";
			}
		}
		for(;g<areaIN.maxLength;g++){
			if(exactCursorLockedChoice==fieldstart+g){st=caretStyle;}else{st=nocaretStyle;}
			out+="<a href='javascript:exactCursor(\""+iden+"\",\""+g+"\");' id='"+iden+"c"+g+"' style='"+st+"'>&nbsp;</a>&nbsp;";
		}
		areaDIV.innerHTML=out+"&nbsp;&nbsp;";
		if(caret==null){
			var dataMode=documentgetElementById(iden+"DataMode");dataMode.style.display="none";dataMode.style.visibility="hidden";
			var cursorMode=documentgetElementById(iden+"CursorMode");cursorMode.style.display="inline";cursorMode.style.visibility="visible";
			areaIN.style.display="none";areaIN.style.visibility="hidden";
			areaDIV.style.display="inline";areaDIV.style.visibility="visible";
		}
		if((caret!=-1) && (areaDIV.style.visibility!="hidden")){ 
			var fieldend=fieldstart+parseInt(pool[2],10)-1;
			if(exactCursorLockedChoice<=fieldend && exactCursorLockedChoice>=fieldstart){
				documentgetElementById(iden+"c"+(exactCursorLockedChoice-fieldstart)).focus();
			}else{
				documentgetElementById(iden+"c0").focus();
			}
		}
	}catch(err){alert("An exception occurred in the script. Error name: " + err.name + ". Error message: " + err.message); }
}

function moveOtherExactCursors(currentid){
	if(hatsForm==null) return;
	if(exactCursorLockedChoice>0){
		var elements=hatsForm.elements;
		for (var i=0,iL=elements.length,ele,eName; i<iL; ++i){
			ele=elements[i];
			eName=ele.name;
			if (ele){
				if (eName != null){
					if (eName.length > 0){
						if (isHInput(ele.type, eName)){
							if ((currentid+"")!=(ele.id+"")){
								exactCursor(ele.id,-1);
							}
						}
					}
				}
			}
		}
	}
}

function setPageSubmitTimeout(pageTimeout, retries, retryDelay){
	if(pageTimeout==null) pageSubmitTimeout=-1;
	if(retries==null) pageSubmitTimeoutRetries = 0;
	if(retryDelay) pageSubmitTimeoutRetryDelay = 0;
	pageSubmitTimeout=pageTimeout;
	pageSubmitTimeoutRetries = retries;
	pageSubmitTimeoutRetryDelay = retryDelay;
}

function startSubmitTimer(){
	if(pageSubmitTimeout==null)return;
	if(pageSubmitTimeout==-1)return;
	setTimeout(checkForServer,pageSubmitTimeout);
}

function xhrServerCheckAvailable(uri, headerReady){
	try{
		if(xhrservercheck==null){
			xhrservercheck=createNewXHR();
		} else {
			xhrservercheck.abort();
		}
		if (xhrservercheck!=null){
			if(headerReady!=null){
				xhrservercheck.onreadystatechange = headerReady;
			}
			xhrservercheck.open("HEAD", uri, true);
			xhrservercheck.send(null);
		}
	}catch(err){}
}

function checkForServer(){
	var uri = asynchURL;
	xhrServerCheckAvailable(uri, evalServerCheckResults);
}

function evalServerCheckResults(){
	if(xhrservercheck!=null){
		if (xhrservercheck.readyState==4){
			currentServerState(xhrservercheck.status);
		}
	}
}

function currentServerState(refreshState){
	var message;
	if(refreshState==204) message="nothing new";
	else if(refreshState==205) message="please hit the refresh button";
	else if(refreshState==404) message="host session not found";
	else if(refreshState==501) message="web session not found";
	else if(refreshState==503) message="busy, server doing something with this connection...";
	else{
		message="no response ("+refreshState+")";
		if(pageSubmitTimeoutRetries > 0){
			pageSubmitTimeoutRetries--;
			setTimeout(startSubmitTimer,pageSubmitTimeoutRetryDelay);
		}else{
			hatsForm.beensubmitted = undefined; //server connection not found. allow user control
			
			//alert("The server could not be found.  User control of the page has been reinstated.");
		}
	}
	//alert(message);
}

function resetFieldCaret(field){
	if (field.createTextRange){
		var range = field.createTextRange();
		range.collapse();
		range.moveStart('character', 0);
		range.select();
	} else {
		field.setSelectionRange(0, 0);
	}
}

 


function init_heartbeatVars(pID, RefreshEnabled, PollInterval, DisconnectEnabled, DisconnectDelay, URL){
	if (!window.heartbeatVarsDB){
		window.heartbeatVarsDB = [];
	}

	var heartbeatVars = new Object();
	heartbeatVars.browserRefreshEnabled = RefreshEnabled;
	heartbeatVars.browserPollInterval = PollInterval;
	heartbeatVars.browserDisconnectEnabled = DisconnectEnabled;
	heartbeatVars.browserDisconnectDelay = DisconnectDelay;
	heartbeatVars.asynchURL = URL;
	heartbeatVars.pingRequest = null;
	heartbeatVars.heartbeatIntervalId = null;
	
	window.heartbeatVarsDB[pID]=heartbeatVars;
}

function startHeartBeat(pID){
	if (window.heartbeatVarsDB && window.heartbeatVarsDB[pID]){
		var heartbeatVars = window.heartbeatVarsDB[pID];
		if (heartbeatVars.browserRefreshEnabled || heartbeatVars.browserDisconnectEnabled){
			if(!heartbeatVars.pingRequest){
				setTimeout("startHeartbeatInterval(\""+ pID + "\")",1000);
			}
		}
	}
}

function startHeartbeatInterval(pID){
	if (window.heartbeatVarsDB && window.heartbeatVarsDB[pID]){
		var heartbeatVars = window.heartbeatVarsDB[pID];
		if (heartbeatVars.browserRefreshEnabled || heartbeatVars.browserDisconnectEnabled){
			heartbeatVars.heartbeatIntervalId = setInterval("sendPing(\""+pID+"\")", heartbeatVars.browserPollInterval);
			
			sendPing(pID);
		}
	}
}

function stopHeartbeat(pID){
	if (window.heartbeatVarsDB && window.heartbeatVarsDB[pID]){
		var heartbeatVars = window.heartbeatVarsDB[pID];
		clearInterval(heartbeatVars.heartbeatIntervalId);
	}
}

function disableBrowserRefresh(pID){
	if (window.heartbeatVarsDB && window.heartbeatVarsDB[pID]){
		var heartbeatVars = window.heartbeatVarsDB[pID];
		heartbeatVars.browserRefreshEnabled = false;
	}
}

function sendPing(pID){
	if(typeof document.forms[pID] == "undefined"){
		stopHeartbeat(pID);
		return;
	}
	if (window.heartbeatVarsDB && window.heartbeatVarsDB[pID]){
		var heartbeatVars = window.heartbeatVarsDB[pID];
		if (typeof document.forms[pID].beensubmitted != "undefined") return;
		if (heartbeatVars.pingRequest == null)
			heartbeatVars.pingRequest = createNewXHR();
		//else {
		//  pingRequest.abort();
		//  pingRequest = null;
		//}
		if (heartbeatVars.pingRequest != null){
			var pr = heartbeatVars.pingRequest;
			var randomValue = new Date().getTime(); //Keep browser from caching request
			
			pr.open("GET",heartbeatVars.asynchURL + randomValue,true);
			pr.onreadystatechange = function(){
				if (pr.readyState==4)
					handlePingResponse(pr, pID);
			};
			pr.send(null);
		}
	}
}

function handlePingResponse(pingRequest, pID){
	if (window.heartbeatVarsDB && window.heartbeatVarsDB[pID]){
		var heartbeatVars = window.heartbeatVarsDB[pID];
		var appResp;
		var cbResponse = false;
		
		var tmpForm=getHATSForm(pID);
		if (typeof tmpForm == 'undefined'){
			return;
		}
		
		if (pingRequest.status  == 200){/* 200 = OK */
			appResp = pingRequest.responseText;
		} else {
			appResp = "XX"; 
		}
		try{ 
			cbResponse=tmpForm.poll_callback(appResp);
		} catch(any_exp){
			// cbResponse=false; 
		}

		if (cbResponse){
			stopHeartbeat(pID);
		} else {
			
			if ('D' == appResp.charAt(0)){
				try{
					
					cbResponse=tmpForm.poll_disconnect_callback();
				} catch(any_exp){
					// cbResponse=false; 
				}
				
				if (cbResponse){
					stopHeartbeat(pID);
				}
				
				appletFullPollRefresh(pID);
				
			} else {
				
				if ('R' == appResp.charAt(0)){
					try{
						
						
						if(typeof tmpForm.notRefreshSafe != "undefined"){
							cbResponse=tmpForm.poll_refresh_callback(false);
						} else {
							cbResponse=tmpForm.poll_refresh_callback(true);
						}
					} catch(any_exp){
						// cbResponse=false; 
					}
					
					if (cbResponse || ((typeof tmpForm.notRefreshSafe == "undefined") && heartbeatVars.browserRefreshEnabled)){
						appletFullPollRefresh(pID);
					}
				}
			}
		}
	}
}

function sendCalendarRequest(calendarURL){
	if (calendarRequest == null)
		calendarRequest = createNewXHR();
	// else {
	// pingRequest.abort();
	// pingRequest = null;
	// }
	if (calendarRequest != null){
		calendarRequest.open("GET",calendarURL,true);
		calendarRequest.onreadystatechange = handleCalendarResponse;
		calendarRequest.send(null);
	}
}

function handleCalendarResponse(){
	if (calendarRequest.readyState == 4){
		if (calendarRequest.status  == 200){
			var calendarDiv = document.getElementById('hatsCalendarDiv'+hatsCalendarID); 
			calendarDiv.innerHTML=calendarRequest.responseText;

			var calendarClose = document.getElementById('calendarCloseBar');
			
			if (calendarClose)
				calendarClose.id += hatsCalendarID;
			

			calendarDiv.style.position = "absolute";
			showInlineCalendar(); 
			calendarDiv.style.width = calendarClose.offsetWidth + 8;

			
			calendarDiv.style.left = evX + "px";
			calendarDiv.style.top = evY + "px";

			
			if(evX + calendarClose.offsetWidth >= document.body.clientWidth + getScrollLength()){
				calendarDiv.style.left = document.body.clientWidth - calendarClose.offsetWidth;
				if(calendarDiv.style.left.indexOf("px")==-1){ 
				   calendarDiv.style.left = calendarDiv.style.left + "px";
				}
			}

			
			if(evY + calendarClose.offsetHeight + calendarDiv.offsetHeight >= document.body.clientHeight + getVerticalScrollTop()){
				calendarDiv.style.top = document.body.clientHeight + getVerticalScrollTop() - calendarClose.offsetHeight - calendarDiv.offsetHeight;
				if(calendarDiv.style.top.indexOf("px")==-1){
				   calendarDiv.style.top = calendarDiv.style.top + "px";
				}
			}

			var calTags = calendarDiv.getElementsByTagName('a');
			for (var i=0; i<calTags.length; ++i)
				calTags[i].setAttribute("tabindex", (i+1).toString());

			document.getElementById("hatsCalCloseAnchor").focus();
		}
	}
}

function getCalendarForm(){
	var children = document.getElementById("hatsCalendarDiv"+hatsCalendarID).childNodes;
	for(var i=0,iL=children.length; i<iL; ++i){
		if (children[i].nodeName == "FORM")
			return children[i];
	}
}

function calendarSubmit(baseURL, action){
	var calForm = getCalendarForm();
	var inputDate = calForm.next.value;

	if (action == "next")
		inputDate = calForm.next.value;
	else if (action == "previous")
		inputDate = calForm.previous.value;
	else if (action == "next_year")
		inputDate = calForm.next_year.value;
	else if (action == "previous_year")
		inputDate = calForm.previous_year.value;

	var address = baseURL + "/calendar?inputDate=" + encodeURIComponent(inputDate);
	address += "&datePattern=" + encodeURIComponent(calForm.datePattern.value);
	address += "&inputFieldNames=" +  encodeURIComponent(calForm.inputFieldNames.value);
	address += "&inputFieldValues=" + encodeURIComponent(calForm.inputFieldValues.value);
	address += "&patternLocale=" + encodeURIComponent(calForm.patternLocale.value);
	address += "&rangeStart=" + encodeURIComponent(calForm.rangeStart.value);
	address += "&rangeEnd=" + encodeURIComponent(calForm.rangeEnd.value);
	address += "&calendarID=" + encodeURIComponent(calForm.calendarID.value);
	address += "&clientLocale=" + encodeURIComponent(calForm.clientLocale.value);
	address += "&defaultValue=" + encodeURIComponent(calForm.defaultValue.value);
	address += "&useInlineCalendar=true";
	sendCalendarRequest(address);
}

function calendarCancelEvent(e){
	var ev = e || window.event;
	if (ev.stopPropagation)
		ev.stopPropagation();
	else
		ev.cancelBubble = true;
}


function getAbsPosX(el){
	var sum = 0;
	if(el.offsetParent)
		while(true){
			sum += el.offsetLeft;
			if(!el.offsetParent)
				break;
			el = el.offsetParent;
		}
	else if(el.x)
		sum += el.x;
	return sum;
}

function getAbsPosY(el){
	var sum = 0;
	if(el.offsetParent)
		while(true){
			sum += el.offsetTop;
			if(!el.offsetParent)
				break;
			el = el.offsetParent;
		}
	else if(el.y)
		sum += el.y;
	return sum;
}

function showInlineCalendar(){
	var div=document.getElementById("hatsCalendarDiv"+hatsCalendarID);
	if (div) div.style.display = "block";
}

function hideInlineCalendar(event){
	
	if (event){
		var target = (isIE) ? event.srcElement : event.target;
		for (var p=target.parentNode;p!=null;p=p.parentNode){
			if ((p.id) && ((p.id.indexOf("hatsCalendarDiv")) == 0)){
				p.style.display = "none";
				return;
			}
		}
	}
}

function getScrollLength(){
	var scrollLength = 0;
	if (isIE || OPERA)
		scrollLength = document.body.scrollLeft || document.documentElement.scrollLeft;
	else
		scrollLength = window.pageXOffset;

	return scrollLength;
}

function getVerticalScrollTop(){
	var scrollLength = 0;
	if (isIE || OPERA)
		scrollLength = document.body.scrollTop || document.documentElement.scrollTop;
	else
		scrollLength = window.pageYOffset;

	return scrollLength;
}

//Returns whether a codepage is a DBCS codepage
function isDBCSCodePage(codepage){
	if (codepage==290 || codepage==930 || codepage==933 || codepage==935 || codepage==937 || codepage==939  ||
			codepage==942 || codepage==948 || codepage==949 || codepage==950 || codepage==964 || codepage==1364 ||
			codepage==1371|| codepage==1381|| codepage==1388|| codepage==1390|| codepage==1399){
		return true;
	}
	return false;
}

//Removes underscores from the end of a string, and repads the string with spaces.
function stripUnderscoresFromValue(str){
	if (str){
		if (str.indexOf('_') != -1){
			var newValue;
			var newLength = str.length;
			for (var i = str.length - 1; i >= 0; i--){
				if (str.charAt(i) == '_'){
					newLength--;
				} else {
					break;
				}
			}
			// Build the new value (underscored strippes from the end of the string, replaced with spaces)
			if (newLength < str.length){
				newValue = str.substring(0, newLength);
				for(var i=0,iL=(str.length-newLength);i<iL;++i){
					newValue = newValue + " ";
				}
				return newValue;
			}
		}
	}
	return str;
}

//Trims the value of a string using regular expression.
function trimSpacesFromValue(str){
	if (str && str.length > 0 && str.indexOf(" ") != -1){
		var tmp = str.replace(/(^\s*)|(\s*$)/g, "");
		return tmp;
	}
	return str;
}

//Trims the left side space of a string.
function leftTrimFromString(str){
	if (str){
		if (str=="" || str.charAt(0) != " "){
			return str;
		} else if (trimSpacesFromValue(str)==""){
			return "";
		}

		var index = -1;
		for (var i=0,iL=str.length; i<iL; ++i){
			if (str.charAt(i) == " "){
				index = i;
			} else {
				break;
			}
		}

		if (index != -1){
			return str.substring(index+1, str.length);
		}
		return str;
	} else {
		return "";
	}
}

//Trims the right side space of a string.
function rightTrimFromString(str){
	if (str){
		if (str=="" || str.charAt(str.length-1) != " "){
			return str;
		} else if (trimSpacesFromValue(str)==""){
			return "";
		}

		var index = str.length;
		for (var i=str.length-1; i>=0; i--){
			if (str.charAt(i) == " "){
				index = i;
			} else {
				break;
			}
		}

		if (index != str.length){
			return str.substring(0, index);
		}
		return str;
	} else {
		return "";
	}
}

function createInputElement(type, name, value){
	var newElement = document.createElement("input");
	newElement.type = type;
	newElement.name = name;
	newElement.value = value;
	return newElement;
}


function convertSpace(text){
	if (text && text!=null){
		var regexHTML = new RegExp(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/gim);
		var regexSpace = new RegExp(/\s/g);
		var unicodeSpace = "\u00a0";
		var result = "";
		var temp = text;
		var htmls = text.match(regexHTML);

		if (htmls!=null){
			
			for (var i=0,iL=htmls.length; i<iL; ++i){
				var firstIndex = temp.search(regexHTML);
				var nonHtmlText = temp.substring(0, firstIndex);
				temp = temp.substring(nonHtmlText.length + htmls[i].length, temp.length);
				result = result + nonHtmlText.replace(regexSpace, unicodeSpace) + htmls[i];
			}
		}
		return result+temp.replace(regexSpace, unicodeSpace);
	}
	return text;
}