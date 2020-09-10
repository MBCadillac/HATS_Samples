// Licensed Materials - Property of IBM
//
// AIMCHSR00
// (C)Copyright IBM Corp. 2003, 2014  All Rights Reserved

//.============================================================================
//.Function:  Defines and processes keyboard related constants and events
//.============================================================================

/***************************************************
 * NOTICE: DO NOT MODIFY THE FOLLOWING VARIABLES!! *
 ***************************************************/
var CODE_BACKSPACE = 8;
var CODE_TAB       = 9;
var CODE_ENTER     = 13;
var CODE_PAUSE     = 19;
var CODE_ESC       = 27;
var CODE_PAGEUP    = 33;
var CODE_PAGEDOWN  = 34;
var CODE_END       = 35;
var CODE_HOME      = 36;
var CODE_INSERT    = 45;
var CODE_DELETE    = 46;
var CODE_A         = 65;
var CODE_B         = 66;
var CODE_C         = 67;
var CODE_D         = 68;
var CODE_E         = 69;
var CODE_F         = 70;
var CODE_G         = 71;
var CODE_H         = 72;
var CODE_I         = 73;
var CODE_J         = 74;
var CODE_K         = 75;
var CODE_L         = 76;
var CODE_M         = 77;
var CODE_N         = 78;
var CODE_O         = 79;
var CODE_P         = 80;
var CODE_Q         = 81;
var CODE_R         = 82;
var CODE_S         = 83;
var CODE_T         = 84;
var CODE_U         = 85;
var CODE_V         = 86;
var CODE_W         = 87;
var CODE_X         = 88;
var CODE_Y         = 89;
var CODE_Z         = 90;
var CODE_F1        = 112;
var CODE_F2        = 113;
var CODE_F3        = 114;
var CODE_F4        = 115;
var CODE_F5        = 116;
var CODE_F6        = 117;
var CODE_F7        = 118;
var CODE_F8        = 119;
var CODE_F9        = 120;
var CODE_F10       = 121;
var CODE_F11       = 122;
var CODE_F12       = 123;
var HostKey        = 1;
var ApplicationKey = 2;
var CODE_PLUS      = 107;
var CODE_MINUS     = 109;

/***********************************************
 * NOTICE: DO NOT MODIFY THE ABOVE VARIABLES!! *
 ***********************************************/

var defaultKeyMappings = [
                          // KEYCODE,       ALT, CTRL, SHIFT, MNEMONIC
                          //============ command key mappings ================
                          [CODE_ENTER,      0,    0,     0, '[enter]'     ],
                          [CODE_PAUSE,      0,    0,     0, '[attn]'      ],
                          [CODE_ESC,        0,    0,     0, '[clear]'     ],
                          [CODE_ESC,        0,    0,     1, '[sysreq]'    ],
                          [CODE_R,          0,    1,     0, '[reset]'     ],
                          [CODE_PAGEUP,     0,    0,     0, '[pageup]'    ],
                          [CODE_PAGEUP,     1,    0,     0, 'refresh'     ],
                          [CODE_PAGEDOWN,   0,    0,     0, '[pagedn]'    ],
                          [CODE_PAGEDOWN,   1,    0,     0, '[pa3]'       ],
                          [CODE_END,        1,    0,     0, '[pa2]'       ],
                          [CODE_INSERT,     1,    0,     0, 'default'     ],
                          [CODE_DELETE,     1,    0,     0, '[pa1]'       ],
                          [CODE_D,          0,    1,     0, 'disconnect'  ],
                          [CODE_H,          0,    1,     0, '[help]'      ],
                          [CODE_P,          0,    1,     0, '[printhost]' ],
                          [CODE_J,          0,    1,     0, 'printjobs'   ],
                          [CODE_ENTER,      1,    0,     0, 'reverse'     ],
                          [CODE_ENTER,      1,    1,     0, 'reverse'     ],
                          [CODE_K,          0,    1,     0, 'toggle'      ],
                          [CODE_S,          0,    1,     0, 'ResetButton' ],
                          //============ function key mappings ===============
                          [CODE_F1,         0,    0,     0, '[pf1]'       ],
                          [CODE_F1,         0,    0,     1, '[pf13]'      ],
                          [CODE_F2,         0,    0,     0, '[pf2]'       ],
                          [CODE_F2,         0,    0,     1, '[pf14]'      ],
                          [CODE_F3,         0,    0,     0, '[pf3]'       ],
                          [CODE_F3,         0,    0,     1, '[pf15]'      ],
                          [CODE_F4,         0,    0,     0, '[pf4]'       ],
                          [CODE_F4,         0,    0,     1, '[pf16]'      ],
                          [CODE_F5,         0,    0,     0, '[pf5]'       ],
                          [CODE_F5,         0,    0,     1, '[pf17]'      ],
                          [CODE_F6,         0,    0,     0, '[pf6]'       ],
                          [CODE_F6,         0,    0,     1, '[pf18]'      ],
                          [CODE_F7,         0,    0,     0, '[pf7]'       ],
                          [CODE_F7,         0,    0,     1, '[pf19]'      ],
                          [CODE_F8,         0,    0,     0, '[pf8]'       ],
                          [CODE_F8,         0,    0,     1, '[pf20]'      ],
                          [CODE_F9,         0,    0,     0, '[pf9]'       ],
                          [CODE_F9,         0,    0,     1, '[pf21]'      ],
                          [CODE_F10,        0,    0,     0, '[pf10]'      ],
                          [CODE_F10,        0,    0,     1, '[pf22]'      ],
                          [CODE_F11,        0,    0,     0, '[pf11]'      ],
                          [CODE_F11,        0,    0,     1, '[pf23]'      ],
                          [CODE_F12,        0,    0,     0, '[pf12]'      ],
                          [CODE_F12,        0,    0,     1, '[pf24]'      ],
                          [CODE_ENTER,      0,    1,     0, '[qfldext]'   ],
                          [CODE_ENTER,      0,    0,     1, '[fldext]'    ],
                          [CODE_PLUS,       0,    1,     0, '[field+]'    ],
                          [CODE_MINUS,      0,    0,     1, '[qfld-]'     ],
                          [CODE_MINUS,      0,    1,     0, '[field-]'    ]
                          ];

//***********************************************************************************
//* Due to limitations in how the Macintosh Safari browser maps keys to ordinal
//* values, we have the need to remove the Function key defnitions from the default
//* keymap.  If the mac safari browser is detected in keyboard init, we'll swap the
//* table defined below out for the default table defined above.
//***********************************************************************************
var macSafariKeyMappings = [
                            // KEYCODE,       ALT, CTRL, SHIFT, MNEMONIC
                            //============ command key mappings ================
                            [CODE_ENTER,      0,    0,     0, '[enter]'     ],
                            [CODE_PAUSE,      0,    0,     0, '[attn]'      ],
                            [CODE_ESC,        0,    0,     0, '[clear]'     ],
                            [CODE_ESC,        0,    0,     1, '[sysreq]'    ],
                            [CODE_R  ,        0,    1,     0, '[reset]'     ],
                            [CODE_PAGEUP,     1,    0,     0, 'refresh'     ],
                            [CODE_PAGEDOWN,   0,    0,     0, '[pagedn]'    ],
                            [CODE_PAGEDOWN,   1,    0,     0, '[pa3]'       ],
                            [CODE_END,        1,    0,     0, '[pa2]'       ],
                            [CODE_INSERT,     1,    0,     0, 'default'     ],
                            [CODE_DELETE,     1,    0,     0, '[pa1]'       ],
                            [CODE_D,          0,    1,     0, 'disconnect'  ],
                            [CODE_H,          0,    1,     0, '[help]'      ],
                            [CODE_P,          0,    1,     0, '[printhost]' ],
                            [CODE_J,          0,    1,     0, 'printjobs'   ],
                            [CODE_ENTER,      1,    0,     0, 'reverse'     ],
                            [CODE_K,          0,    1,     0, 'toggle'      ],
                            [CODE_S,          0,    1,     0, 'ResetButton' ],
                            [CODE_ENTER,      0,    1,     0, '[qfldext]'   ],
                            [CODE_ENTER,      0,    0,     1, '[fldext]'    ],
                            ];

var applicationKeys =[
                      'disconnect',
                      'refresh',
                      'printjobs',
                      'toggle',
                      'default',
                      'reverse',
                      'ResetButton'
                      ];


var IMEkeysForKeyUp = [
//-Keycode----ALT-CTRL-Shift----//
[  CODE_ENTER,  0,  0,  0  ],
[  CODE_M,      0,  1,  0  ],
[  CODE_ENTER,  0,  1,  0  ]
];

var IMEkeysForKeyDown = [
//-Keycode----ALT-CTRL-Shift----//
[  25,          1,  0,  0  ]//ALT + SBCS/DBCS key
];

function isIMEkeysForKeyUp(event){
	var code = event.keyCode ? event.keyCode : event.which;
	var IMEkeysCount = IMEkeysForKeyUp.length;
	for(var i=0; i < IMEkeysCount; ++i){
		if(code == IMEkeysForKeyUp[i][0] &&
				event.altKey == IMEkeysForKeyUp[i][1] &&
				event.ctrlKey == IMEkeysForKeyUp[i][2] &&
				event.shiftKey == IMEkeysForKeyUp[i][3])
			return true;
	}
	return false;
}

function isIMEkeysForKeyDown(event){
	var code = event.keyCode ? event.keyCode : event.which;
	var IMEkeysCount = IMEkeysForKeyDown.length;
	for(var i=0; i<IMEkeysCount; ++i){
		if(code == IMEkeysForKeyDown[i][0] &&
				event.altKey == IMEkeysForKeyDown[i][1] &&
				event.ctrlKey == IMEkeysForKeyDown[i][2] &&
				event.shiftKey == IMEkeysForKeyDown[i][3])
			return true;
	}
	return false;
}

var preventDefault = false;
var keyHandlingEnabled = true;
var HostButtonList = [];
var ApplicationButtonList = [];
var toggleKeyCodeIndex,toggleKeyCode;
var NoHostKeypadButtons = true;
var bDebug = false;
var beInited = false;
var PortletKBInited = [];
var HATSPortletKBInited= [];
var toggleButtons = [];
var toggleButtonArraySize = 0;
var toggleLinks = [];
var toggleLinkArraySize = 0;
var toggleSearched = false;
var pjw;
var isKeySent = false;
var kbdSupportAll = false;
var autoSubmitField = null;
var autoSubmitFieldChanged = false;
var activeFormName = null;
var isIMEstate = false;

//onhelp handler
function helpfunction(){
	if(isOtherBrowser) return true;
	keyboard_init();
	if (preventDefault){
		if (bDebug) alert("Hot-key F1(CTRL/SHIFT-F1) no longer brings up the help window!!");
		preventDefault = false;
		return false;
	}
}

//oncontextmenu event handler
function contextfunction(e){
	if(isOtherBrowser) return true;
	keyboard_init();
	if (preventDefault){
		if(bDebug) alert("Blocking context menu in NS6 the similar way as blocking help window in IE...");
		preventDefault = false;
		return false;
	}
}

if (!isIE && !isIEMobile){
	document.onkeypress = keypresshandler;
	document.onkeydown = keydownhandler;
	document.onkeyup = keyuphandler;
	document.onhelp = helpfunction;
	document.oncontextmenu = contextfunction;
	document.onclick = clickhandler;
}

//Toggles key handling on/off
//When keyHandlingEnabled is true, AID keys are processed.
//When keyHandlingEnabled is false, AID keys will not be processed.
function toggleKeyboard(pID){
	setHatsFocus(pID);
	if(isOtherBrowser) return;
	keyboard_init();

	keyHandlingEnabled = !keyHandlingEnabled;
	if(bDebug) alert("keyHandlingEnabled status after toggled=" + keyHandlingEnabled);
	if (keyHandlingEnabled){
		hatsForm.KeyboardToggle.value = "1";
	} else {
		hatsForm.KeyboardToggle.value = "0";
	}
	ms('toggle',pID);
}

//onclick event handler
function clickhandler(e){
	e = (e) ? e : ((window.event) ? window.event : "");
	var element = e.srcElement ? e.srcElement : e.target;

	if(element!=null && element.form!=undefined){
		if (typeof element.form.beensubmitted != "undefined") return false;

		//Return if the event is not for a hats form
		if(hatsForm !=null && hatsForm.name!=element.form.name) return true;
	}

	if(isIMEstate) isIMEstate = false;

	forceChange(element);
	if(!element.disabled){
		if(element.type == "radio"){
			var pool = element.name.split("_");
			if(pool.length>=3){
				if((pool[0].indexOf("in")!=-1) &&(!isNaN(pool[1]))&&(!isNaN(pool[2]))){
					if(!(element.checked)) return;
					if(!element.disabled){
						element.blur();
						element.focus();
					}
				}
			}
		}
	}

	// Code to handle positioning on protected text (non HTML anchor tag implementation)
	
	if (element.id){
		var eID=element.id;
		if(eID != "" && eID.substring(0, 2) == "p_"){
			var t = eID.indexOf("_", 2);
			var pos = null;
			var formName = null;
			if (t != -1){
				pos = eID.substring(2, t);
				formName = eID.substring(t + 1, eID.length);
			} else {
				pos = eID.substring(2, eID.length);
				formName = (hatsForm != null ? hatsForm.name : null);
			}

			if (formName != null){
				var action = element.getAttribute("action");
				if (action == null || action == ""){
					setCursorPosition(pos, formName);
				} else {
					msb(action, pos, formName);
				}
			}
		}
	} else {
		if(carettrackingenabled||statuswindowenabled)
			updateCursorPosition(false,null); //A0 added null
	}
}

//Method to return the HTML Form object containing the given DOM node

function getParentForm(node){
	while (node.parentNode && node.parentNode != null && node.parentNode != node){
		if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "FORM"){
			return node.parentNode;
		} else {
			node = node.parentNode;
		}
	}
	return null;
}

//keyUp event handler
function keyuphandler(e){
	if(isOtherBrowser && !OPERA) return true;
	e = (e) ? e : ((window.event) ? window.event : "");
	var element = e.srcElement ? e.srcElement : e.target;
	
	if (element!=null && element.form!=undefined) {
		
		//Return if the event is not for a hats form
		if (hatsForm !=null && hatsForm.name!=element.form.name) return true;
		
		//Return if either hats form is already submitted, 
		//or else some function key is pressed
		var keyCode = e.keyCode ? e.keyCode : e.which;
		if ((typeof element.form.beensubmitted != "undefined") 
				|| (keyCode >= CODE_F1 && keyCode <= CODE_F12))
			return false;
		
	}
	
	if(enableDBCSSession && (element.tagName == "INPUT")){
		//if(isIMEstate && code == CODE_ENTER)
		if(isIMEstate && isIMEkeysForKeyUp(e))
			isIMEstate = false;
		if(element.onkeypress != null){
			if(!(isIE && window.isDijit && isDijit(element) && (isFilter(element) || isCombo(element))))
				element.onkeypress(e);
			
			if (isHInput(element.type, element.name)){
				if (!isNonDataKeyCodeForKeyUp(e)){
					element.setAttribute("MDT", "1");
				}
			}
		}
	}

	
	if(carettrackingenabled||statuswindowenabled){
		if(isNonDataKeyCodeForKeyUp(e))
			updateCursorPosition(false,null);
		else
			updateCursorPosition(true,null);
	}
}

//keyPress event handler
function keypresshandler(e){
	e = (e) ? e : ((window.event) ? window.event : "");
	var element = e.srcElement ? e.srcElement : e.target;
	
	if(element!=null && element.form!=undefined){
		if (typeof element.form.beensubmitted != "undefined") return false;

		//Return if the event is not for a hats form
		if(hatsForm !=null && hatsForm.name!=element.form.name) return true;
	}
	
	if (element != null){
		if (isHInput(element.type, element.name)){
			if (!isNavigationKeyCode(e)){
				element.setAttribute("MDT", "1");
				//alert("3.value of element " + element + " set to : " + element.getAttribute("MDT"));
			}
		}
	}
	
	if(element.form!=undefined){
		element.form.notRefreshSafe = true;
	}
	var kc = e.keyCode ? e.keyCode : e.which;
	if(isOtherBrowser && !OPERA){
		if (kc == CODE_ENTER){
			ms('[enter]');
			return false;
		}
		return true;
	}
	keyboard_init();
	if (isIE || !isNS6) return;
	if (preventDefault){
		e.preventDefault();
		if(!(kc == CODE_F10 && (e.shiftKey)))preventDefault = false;
		return false;
	}
}

//Performs keydown event on specified formName.
function keydownhandlerHSR(e, formName){
	hatsForm = document.forms[formName];
	if (hatsForm != null) activeFormName = formName;
	keydownhandler(e);
}

//keyDown event handler
function keydownhandler(e){
	var ie=isIE,a;
	e = (e) ? e : ((window.event) ? window.event : "");
	var element = e.srcElement ? e.srcElement : e.target;
	
	if(element!=null && element.form!=undefined){
		if (typeof element.form.beensubmitted != "undefined") return false;

		//Return if the event is not for a hats form
		if(hatsForm !=null && hatsForm.name!=element.form.name) return true;
	}
	
	if((enableDBCSSession) && (element.tagName == "INPUT")){
		var code = e.keyCode ? e.keyCode : e.which;
		//isIMEstate = code == 229;
		if(code == 229) isIMEstate = true;
		else if(isIMEstate && isIMEkeysForKeyDown(e)) isIMEstate = false;
		else if(isIMEstate && !isNonDataKeyCodeForKeyUp(e)) isIMEstate = false;

		if(isIMEstate && (element.form!=undefined)) element.form.notRefreshSafe = true;
		if(element.onkeypress != null){
			if(!(ie && window.isDijit && isDijit(element) && (isFilter(element) || isCombo(element))))
				element.onkeypress(e);
			//Return ONLY when e.returnValue is false
			if(e.returnValue == false) return;
		}
	}

	if((hatsForm==null) || (isOtherBrowser && !OPERA)){
		return true;
	}
	keyboard_init();
	preventDefault = false;
	if (hatsForm.name == activeFormName){
		if(!beInited) return true;
	} else {
		if(!HATSPortletKBInited[hatsForm.name]) return true;
	}

	if (!(ie||isNS6||OPERA)) return true;
	var we=window.event;
	var keyCode = (ie)?(we.keyCode):(e.keyCode);
	var altKeyDown = (ie)?(we.altKey):(e.altKey);
	var ctrlKeyDown = (ie)?(we.ctrlKey):(e.ctrlKey);
	var shiftKeyDown = (ie)?(we.shiftKey):(e.shiftKey);
	if(isToggleKey(keyCode,altKeyDown,ctrlKeyDown,shiftKeyDown) && (ApplicationButtonList['toggle'])){
		toggleKeyboard(hatsForm.name);
		blockDefaultKeyAction();
		return false;
	}

	if (!keyHandlingEnabled) return true;
	
	var keyMnemonic = getMnemonic(keyCode,altKeyDown,ctrlKeyDown,shiftKeyDown);  
	
	
	if(carettrackingenabled||statuswindowenabled) {
		if(isNonDataKeyCodeForKeyUp(e) || keyMnemonic=="[eraseeof]" || keyMnemonic=="[erasefld]")     
			updateCursorPosition(false,null);
		else
			updateCursorPosition(true,null);
	}
	
	var target = (ie && !MAC)?(document.activeElement):(e.target);
	var tagName=target.tagName.toLowerCase();
	
	if(ie || IE11Plus){
		if(tagName=="select"){
			if(target.onchange){
				a =" "+target.onchange;
				if(a.indexOf('ms')!=-1){
					if (((keyCode+""=="38") || (keyCode+""=="40")) && !(altKeyDown && ctrlKeyDown && shiftKeyDown)){
						autoSubmitField=target;
						autoSubmitFieldChanged=true;
						if (keyCode+""=="38") target.selectedIndex-=1;
						else if (keyCode+""=="40") target.selectedIndex+=1;
						else target.selectedIndex+=1;
						return false;
					} else if (keyCode+""=="9"){//&& !(altKeyDown && ctrlKeyDown && shiftKeyDown)
						forceChange(null);
					}
				}
			}
		}
	}
	
	if((ie || IE11Plus) && (altKeyDown & (keyCode == CODE_ENTER))){
		try{
			if(document.all.reverse == null){
				blockDefaultKeyAction();
				return;
			}
		} catch(excp) {
			blockDefaultKeyAction();
			return;
		}
	}

	var mappings=defaultKeyMappings;

	for (var i=0,iL=mappings.length; i<iL; ++i){
		if ((mappings[i][0] == keyCode)
				&& !(mappings[i][1]^altKeyDown)
				&& !(mappings[i][2]^ctrlKeyDown)
				&& !(mappings[i][3]^shiftKeyDown)){
			if((target!=null)&&(mappings[i][4]=="[enter]")){
				if((tagName=="a") &&
						((target.href.toLowerCase().indexOf("javascript")==-1) ||
						(target.href.toLowerCase().indexOf("setcur")==-1)))
					return true;
				if((tagName=="input") && ((target.type.toLowerCase()=="button") || (target.type.toLowerCase()=="submit")))
					return true;
				
				if(ie || IE11Plus){
					if(tagName=="select"){
						if(target.onchange){
							a =" "+target.onchange;
							if(a.indexOf('ms')!=-1){
								target.onchange();
								return false;
							}
						}
					}
				}
			}
			
			if(mappings[i][4]=="[qfldext]"){       
				processQuickFieldExit(element,""); 
				blockDefaultKeyAction();           
			} else if(mappings[i][4]=="[qfld-]"){  
				processQuickFieldExit(element,"-");
				blockDefaultKeyAction();           
			} else {
				if(enableBIDI && gobject != null)
					updateBiDiCursorPos(gobject);

				sendKeyIfEnabled(mappings[i][4]);
			}
			return false;
		}
	}
	return true;
}


function processQuickFieldExit(element,prefix){
	
	if (element.tagName != "INPUT") return;

	// calculate starting pos and length of the field
	var p=element.name.split("_");
	var pos=parseInt(p[1]);
	var len=parseInt(p[2]);

	// clear the field from the caret position to the end
	var caretPos = parseInt(hatsForm.CARETPOS.value);
	var endChar=pos+len-1;
	if (caretPos<=endChar){
	
		
		var end = enableDBCSSession ? browserActualCaretPosition : (caretPos-pos);
		var newValue = element.value.substring(0, end);
		//var newValue = element.value.substring(0, caretPos-pos);
		
		element.value=prefix+newValue;
		forceChange(element);
	}
	var nextElement=tabToNextInputField(element,pos,len);
}

//If autoSubmitField != target, force onchange() call on autoSubmitField
function forceChange(target){
	if (autoSubmitField != null){
		if (autoSubmitFieldChanged){
			if (autoSubmitField != target){
				autoSubmitField.onchange();
			}
		}
	}
}

//Sends AID key mnemonic only if enabled
function sendKeyIfEnabled(mnemonic){
	if(isOtherBrowser && !OPERA) return;
	keyboard_init();
	if (bDebug) alert("check before sending key... " + mnemonic + "");

	if ((kbdSupportAll) ||
			(NoHostKeypadButtons && !ApplicationButtonList[mnemonic]) ||
			(HostButtonList[mnemonic] | ApplicationButtonList[mnemonic])){
		blockDefaultKeyAction();
		if(mnemonic == "printjobs"){
			openPrintWindow(PrintURL);
		} else {
			ms(mnemonic,hatsForm.name);
			isKeySent = true;
		}
	}
}

//Prevents default key action
function blockDefaultKeyAction(){
	if(isOtherBrowser) return;
	keyboard_init();
	if (isIE){
		window.event.keyCode = 0;
		window.event.returnValue = false;
	}
	preventDefault = true;
}

//Returns an index of where "toggle" keycode is from defaultKeyMappings array
function getToggleKeyCodeIndex(){
	if(isOtherBrowser) return 0;
	var code, mappings = defaultKeyMappings;

	for (var i=0,iL=mappings.length; i<iL; ++i){
		code = mappings[i][0];
		if (mappings[i][4] == "toggle"){
			toggleKeyCodeIndex = i;
			return toggleKeyCodeIndex;
		}
	}
}


function getMnemonic(keyCode,altKeyDown,ctrlKeyDown,shiftKeyDown){
   if(isOtherBrowser) return "";
   var mappings=defaultKeyMappings;
   for (var i=0,iL=mappings.length; i<iL; ++i){
      if ((mappings[i][0] == keyCode) && !(mappings[i][1]^altKeyDown) && !(mappings[i][2]^ctrlKeyDown) && !(mappings[i][3]^shiftKeyDown)){
         return mappings[i][4]; 
      }
   }
}


//Returns "toggle" keycode
function getToggleKeyCode(){
	if(isOtherBrowser) return 0;
	return defaultKeyMappings[getToggleKeyCodeIndex()][0];
}

//Checks whether the keyCode is a "toggle" keycode
function isToggleKey(keyCode,altKeyDown,ctrlKeyDown,shiftKeyDown){
	if(isOtherBrowser) return false;
	keyboard_init();
	var i = toggleKeyCodeIndex;

	if (defaultKeyMappings == null || defaultKeyMappings[i] == null){
		return false;
	}
	var mappings=defaultKeyMappings;
	var code = mappings[i][0];
	if ((code == keyCode)
			&& !(mappings[i][1]^altKeyDown)
			&& !(mappings[i][2]^ctrlKeyDown)
			&& !(mappings[i][3]^shiftKeyDown)){
		return true;
	}
	return false;
}

//Initializes keyboard setting
function keyboard_init(){
	if((isOtherBrowser && !OPERA) || hatsForm == null) return;
	if(SAFARI) defaultKeyMappings = macSafariKeyMappings;
	var fName=hatsForm.name;
	if(fName == activeFormName){
		if(beInited) return;
		beInited = true;
	} else {
		if(HATSPortletKBInited[fName] == null) HATSPortletKBInited[fName] = false;
		if(HATSPortletKBInited[fName]){
			return;
		}
		//setFormObj();  //the form obj must to be reloaded, if this portlet has not done keyboard_init.
		for(pID in HATSPortletKBInited){
			HATSPortletKBInited[pID] = false;
			if(pID == fName){
				HATSPortletKBInited[pID] = true;
			}
		}
	}
	toggleKeyCode = getToggleKeyCode();
	InitButtonList();

	if (bDebug) debug_yoyo();
	if(hatsForm.KeyboardToggle){
		if (hatsForm.KeyboardToggle.value=="0") keyHandlingEnabled = false;
		else if (hatsForm.KeyboardToggle.value=="1") keyHandlingEnabled = true;
	}
}

//Determines whether a mnemonic is an application key or host key.
//Returns 0 for mnemonic doesn't exist in defaultKeyMappings table
function whatKindOfKey(mnemonic){
	if(isOtherBrowser) return 0;
	keyboard_init();
	var mappings=defaultKeyMappings;
	for (var i=0,iL=mappings.length; i<iL; ++i){
		if(mnemonic == mappings[i][4]){
			if(isApplicationKey(mnemonic))
				return ApplicationKey;
			else
				return HostKey;
		}
	}
	return 0;
}


//event.ctrlKey, event.altKey, Arrow keys, home, end, backspace, insert, tab, enter, delete , alt, ctrl, Shift, Fn, Caps Lock, Num Lock, Scroll Lock, Menu
function isNonDataKeyCodeForKeyUp(event) {
	event = (event) ? event : ((window.event) ? window.event : "");
	var keyCode = event.keyCode ? event.keyCode : event.which;
	var ret = event.ctrlKey || event.altKey ||(keyCode >= 37 && keyCode <= 40) || keyCode == 36 || keyCode == 35 || keyCode == 8 || keyCode == 45 || keyCode == 9 || keyCode == 13 || keyCode == 46
	|| keyCode == 18 || keyCode == 17 || keyCode == 16 || keyCode == 255 || keyCode == 20 || keyCode == 144 || keyCode == 145 || keyCode == 93;
	return ret;
}

//Checks whether a mnemonic is an application key or not
function isApplicationKey(mnemonic){
	if(isOtherBrowser) return false;
	keyboard_init();
	var aKeys=applicationKeys;
	for (var i=0,iL=aKeys.length; i<iL; ++i){
		if(mnemonic == aKeys[i])
			return true;
	}
	return false;
}

//Initializes button list
function InitButtonList(){
	if(isOtherBrowser) return;
	var cells,cell,cellName,j,jL;
	var debugOut="";

	cells = document.getElementsByTagName("input");
	for (j=0,jL=cells.length; j<jL; ++j){
		cell=cells[j];
		if(cell.getAttribute("accesskey") != "hatsportletid"){
			if(cell.getAttribute("accesskey") != hatsForm.name){
				continue;
			}
		}
		cellName = cell.name;
		if (cell.type == "button"){
			if (bDebug) debugOut = debugOut + "\n" + "   button cellName = " + cellName;
			switch(whatKindOfKey(cellName)){
			case 1://HostKey:
				NoHostKeypadButtons = false;
				if (!(cell.disabled)){
					HostButtonList[cellName]= true;
					if (bDebug) debugOut = debugOut + ":=> HostKey \n";
				}
				break;
			case 2://ApplicationKey:
				if (!(cell.disabled)){
					ApplicationButtonList[cellName]= true;
					if (bDebug) debugOut = debugOut + ":=> ApplicationKey \n";
				}
				break;
			}
		}
	}
	cells = document.getElementsByTagName("a");
	for (j=0,jL=cells.length; j<jL; ++j){
		cell=cells[j];
		if(cell.getAttribute("accesskey") != "hatsportletid"){
			if(cell.getAttribute("accesskey") != hatsForm.name){
				continue;
			}
		}
		cellName = cell.name;
		if (bDebug) debugOut = debugOut + "\n" + "   link cellName = " + cellName;
		switch(whatKindOfKey(cellName)){
		case 1://HostKey:
			NoHostKeypadButtons = false;
			if (cell.href != ""){
				HostButtonList[cellName]= true;
				if (bDebug) debugOut = debugOut + ":=> HostKey \n";
			}
			break;
		case 2://ApplicationKey:
			if (cell.href != ""){
				ApplicationButtonList[cellName]= true;
				if (bDebug) debugOut = debugOut + ":=> ApplicationKey \n";
			}
			break;
		}
	}
	if (bDebug) alert(debugOut);
}

//Used for debugging to list buttons
function debug_yoyo(){
	if(isOtherBrowser) return;
	keyboard_init();
	alert("toggleKeyCodeIndex="+toggleKeyCodeIndex+"\n"+"toggleKeyCode="+toggleKeyCode);

	var out="HostButtonList Aray \n============================\n";
	for (member in HostButtonList ){
		out = out + member + " = " +HostButtonList[member] +"\n";
	}
	alert(out);
	out="ApplicationButtonList Aray \n============================\n";
	for (member in ApplicationButtonList){
		out = out + member + " = " +ApplicationButtonList[member] +"\n";
	}
	alert(out);
}

//Closes Print Job window
function closePrintJobWindow(){
	if (pjw != null){
		pjw.close();
	}
}

//Opens Print Window
function openPrintWindow(url){
	var features,newX,newY;
	if (isIE){
		newX = window.screenLeft + 20;
		newY = window.screenTop + 20;
	}
	if (isNS4 || isNS6){
		newX = window.screenX + 20;
		newY = window.screenY + 20;
	}
	features = 'resizable,top=' + newY +
	',left=' + newX +
	',screenX=' + newX +
	',screenY=' + newY + ',scrollbars,status,toolbar';
	pjw = window.open(url,"HATSv1PrintJobViewOpenedByEndUser",features );
}

//Toggles Search
function searchToggles(){
	var cells = document.getElementsByTagName("input");
	var tButtons=toggleButtons;
	var tLinks=toggleLinks;
	var i,iL;
	for (i=0,iL=cells.length; i<iL; ++i){
		if (cells[i].getAttribute("name") == "toggle"){
			tButtons[toggleButtonArraySize++] = cells[i];
		}
	}
	//search links
	cells = document.getElementsByTagName("a");
	for (i=0,iL=cells.length; i<iL; ++i){
		if (cells[i].getAttribute("name") == "toggle"){
			tLinks[toggleLinkArraySize++] = cells[i];
		}
	}
	toggleSearched = true;
}

//Changes toggle captions
function changeToggleCaptions(){
	if (!toggleSearched){
		searchToggles();
	}
	var captionText = keyHandlingEnabled ? keyboardOffString: keyboardOnString;
	var tButtons=toggleButtons;

	for (var i=0,iL=tButtons.length; i<iL; ++i){
		tButtons[i].value = captionText;
	}

	if(!isIEMobile){ 
		var tLinks=toggleLinks;
		for (var i=0,iL=tLinks.length; i<iL; ++i){
			tLinks[i].replaceChild(document.createTextNode(captionText),tLinks[i].firstChild);
		}
	}
}