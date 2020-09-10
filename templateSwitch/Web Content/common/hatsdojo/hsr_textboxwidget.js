//Licensed Materials - Property of IBM
//
// Copyright IBM Corp. 2010, 2015  All Rights Reserved.

//.============================================================================
//.Function:  Load the JSON information and behaviors into the Widget
//.============================================================================











function bindJSONDataToTextBox(uLabel, uInputWidget, JSONData)
{
	if (isDijit(uInputWidget) && JSONData && JSONData.value)
	{
		var elemValue = JSONData.value; 
		if (elemValue.caption){
			uLabel.innerHTML = elemValue.caption;
		}
		//uInputDomNode represents the DOM node of uInputWidget
		var uInputDomNode = uInputWidget.domNode;
		//bind JSON data to the Widget DOM node so the data can be accessed through the Widget DOM node
		uInputDomNode.JSONData = JSONData;
		uInputDomNode.hatsDojoConnections = [];
		var hc = uInputDomNode.hatsDojoConnections;
		//uInput represents the textbox of uInputWidget and is used for event/attribute binding
		var uInput = uInputWidget.textbox;
		setDojoAttr(uInput,"name",getPosLengthString(uInputWidget)); 
		var eValue_text = rightTrimFromString(elemValue.text);
		if(uInputWidget.isVisualMode && uInputWidget.dir == 'rtl')
			eValue_text = uInputWidget.reverseRtlText(eValue_text);

		setDijitAttribute(uInputWidget, "value", rightTrimFromString(eValue_text));
		uInput.defaultValue = getDijitAttribute(uInputWidget, "value");
		setDojoStyle(uInputDomNode,"width",elemValue.length+"em");
		hc.push(dojoConnect(uInput, "onfocus", function(evt) {
			if (uInputWidget.isVisualMode)
			  setFocus(this, formID);
			else
			  setFocusFieldIntoGlobal(this, formID);
		}));
		hc.push(dojoConnect(uInputWidget, "onChange", function(evt) {
		  checkInput(this);}));
		hc.push(dojoConnect(uInputWidget, "onClick", function(evt) {
		  setCursorPosition(elemValue.startPos, formID);}));
		var isDBCSSession = isDBCSCodePage(CodePage);
		if (conntype == 5250 || conntype == 3270){ 
			if (conntype == 5250){ 
				if (!elemValue.isProtected && elemValue.hsrAttributes){
					if (elemValue.hsrAttributes.monocase){
						if (uInputWidget.isVisualMode)
							hc.push(dojoConnect(uInput, "onkeyup", function(evt){convertToUpperCase(evt);}));

						hc.push(dojoConnect(uInputWidget, "onKeyPress", function(evt){convertToUpperCase(evt);}));
						hc.push(dojoConnect(uInput, "onpaste", function(evt){convertToUpperCase(evt);}));
						hc.push(dojoConnect(uInput, "ondrop", function(evt){convertToUpperCase(evt);}));
						hc.push(dojoConnect(uInput, "onblur", function(evt){convertToUpperCase(evt);}));
						hc.push(dojoConnect(uInputWidget, "onClick", function(evt){convertToUpperCase(evt);}));
					}
					if (elemValue.hsrAttributes.rightFillBlank || 
						elemValue.hsrAttributes.rightFillZero ||
						elemValue.hsrAttributes.fieldExitRequired ){
						setDojoAttr(uInput,"disableAutoAdvance","true");
					}
					setDojoAttr(uInput,"autoEnter", (elemValue.hsrAttributes.autoEnter)?true:false);
					setDojoAttr(uInput,"fieldExitRequired", (elemValue.hsrAttributes.fieldExitRequired)?true:false);
					setDojoAttr(uInput,"required", (elemValue.hsrAttributes.required)?true:false);
					setDojoAttr(uInput,"fillRequired", (elemValue.hsrAttributes.fillRequired)?true:false);
				}
			}
			if (!elemValue.isProtected && elemValue.hsrAttributes){	
				var isSBCSOnly = true;
				var isFieldTypeFound = false;
				var methodVar;
				var imeModeVar = "inactive";
				var maxLengthVar = elemValue.length;	
				if (conntype == 5250){ 
					if (elemValue.hsrAttributes.alpha){
						methodVar = function(evt){allowAlphabeticOnly(evt);};
					} else
					if (elemValue.hsrAttributes.digitsOnly){
						methodVar = function(evt){allowDigitsOnly(evt);};
					} else
					if (elemValue.hsrAttributes.signedNumeric){
						methodVar = function(evt){allowSignedNumeric(evt);};
					} else
					if (elemValue.hsrAttributes.numericOnly){
						methodVar = function(evt){allowNumericOnly(evt);};
					} else
					if (elemValue.hsrAttributes.keyboardInhibited){
						methodVar = function(evt){inhibitKeyboardEntry(evt);};
						hc.push(dojoConnect(uInputWidget, "onKeyUp", methodVar));
						hc.push(dojoConnect(uInput, "oncut", methodVar));
						imeModeVar = "disabled";
						isSBCSOnly = false;
					} else						
					if (isDBCSSession && elemValue.hsrAttributes.dbcsOnly){
						methodVar = function(evt){allowDBCSOnly5250(evt);};
						imeModeVar = "active";
						isSBCSOnly = false;
						hc.push(dojoConnect(uInputWidget, "onKeyUp", methodVar));  
						hc.push(dojoConnect(uInputWidget, "onKeyDown", methodVar)); 
						if(showUnProtectedSosiAsSpace) {
							if(!eliminateMaxLengthForDBCSFields) {
								if(!(CodePage == 1390 || CodePage == 1399)){
									maxLengthVar = (elemValue.length/2) + 1;
								}
							} else {
								maxLengthVar = null;
								setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
							}
							if(CodePage == 1390 || CodePage == 1399) {
								if (getCharacterCount(uInputWidget.value) == (elemValue.length/2)) {
									setDijitAttribute(uInputWidget, "value", getDijitAttribute(uInputWidget, "value") + " ");
								}
							} else {
								if (uInputWidget.value && uInputWidget.value.length == (elemValue.length/2)) {
									setDijitAttribute(uInputWidget, "value", getDijitAttribute(uInputWidget, "value") + " ");
								}
							}
						} else {
							setDijitAttribute(uInputWidget, "value", leftTrimFromString(getDijitAttribute(uInputWidget, "value")));
							if(!eliminateMaxLengthForDBCSFields) {
								if(!(CodePage == 1390 || CodePage == 1399)) {
									maxLengthVar = (elemValue.length/2)-1;
								}
							} else {
								maxLengthVar = null;
								setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
							}
						}
					} else
					if (isDBCSSession && elemValue.hsrAttributes.dbcsPure) {
						methodVar = function(evt){allowDBCSPure(evt);};
						imeModeVar = "active";
						isSBCSOnly = false;
						hc.push(dojoConnect(uInputWidget, "onKeyUp", methodVar));  
						hc.push(dojoConnect(uInputWidget, "onKeyDown", methodVar)); 
						if(!eliminateMaxLengthForDBCSFields) {
							if(!(CodePage == 1390 || CodePage == 1399)){
								maxLengthVar = elemValue.length/2;
							}
						} else {
							maxLengthVar = null;
							setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
						}
					} else
					if (elemValue.hsrAttributes.unicode){
						isSBCSOnly = false;
						isFieldTypeFound = true;
						hc.push(dojoConnect(uInputWidget, "onKeyPress", function(evt){allowUnicodeOnly(evt);}));
						setDojoAttr(uInput,"maxLength",(elemValue.length/2));
						if(eliminateMaxLengthForDBCSFields){
							hc.push(dojoConnect(uInput, "onfocus", function(evt){allowUnicodeOnly(evt);}));
						}
					} else if (isDBCSSession && elemValue.hsrAttributes.dbcsOpen){
						methodVar = function(evt){allowDataLengthChecking(evt);};
						imeModeVar = null;
						isSBCSOnly = false;
						hc.push(dojoConnect(uInputWidget, "onKeyUp", methodVar));
						hc.push(dojoConnect(uInputWidget, "onKeyDown", methodVar));
						if(eliminateMaxLengthForDBCSFields){
							maxLengthVar = null;
							setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
						}
					} else
					if (isDBCSSession && elemValue.hsrAttributes.dbcsEither){
						methodVar = function(evt){allowDBCSEither(evt);};
						imeModeVar = "active";
						isSBCSOnly = false;
						var isJFieldMode = false;
						if (uInputWidget.value && uInputWidget.value.length > 0){
							var tmpValue = removeSpaceAsSOSI(uInputWidget.value);
							if (tmpValue.length>0){
								isJFieldMode = isDBCSChar(tmpValue.charAt(0), enableDBCSSession, enableDBCSEuro, CodePage);
							}
						}
						if (isJFieldMode){
							if(showUnProtectedSosiAsSpace) {
								if(!eliminateMaxLengthForDBCSFields) {
									if(!(CodePage == 1390 || CodePage == 1399)){
										maxLengthVar = (elemValue.length/2)+1;
									}
								} else {
									maxLengthVar = null;
									setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
								}
								if(CodePage == 1390 || CodePage == 1399){
									if (getCharacterCount(uInputWidget.value) == (elemValue.length/2)) {
										setDijitAttribute(uInputWidget, "value", getDijitAttribute(uInputWidget, "value") + " ");
									}
								} else {
									if (uInputWidget.value && uInputWidget.value.length == (elemValue.length/2)) {
										setDijitAttribute(uInputWidget, "value", getDijitAttribute(uInputWidget, "value") + " ");
									}
								}
							} else {
								if(!eliminateMaxLengthForDBCSFields) {
									maxLengthVar = (elemValue.length/2)-1;
								} else {
									maxLengthVar = null;
									setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
								}
							}
						} else {
							if(eliminateMaxLengthForDBCSFields) {
								maxLengthVar = null;
								setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
							}
							imeModeVar = "inactive";
						}
					} else
					if (isDBCSSession && elemValue.hsrAttributes.katakanaShift){
						methodVar = function(evt){allowKatakanaShift(evt);};
						imeModeVar = "active";
					}
				} else {
					if (elemValue.hsrAttributes.numeric){
						methodVar = function(evt){allowAlphaNumericShift(evt);};
					} else
					if(isDBCSSession && elemValue.hsrAttributes.dbcsOnly) {
						methodVar = function(evt){allowDBCSOnly3270(evt);};
						imeModeVar = "active";
						isSBCSOnly = false;
						if(!eliminateMaxLengthForDBCSFields) {
							if(!(CodePage == 1390 || CodePage == 1399)) {
								maxLengthVar = elemValue.length/2;
							}
						} else {
							maxLengthVar = null;
							setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
						}
					} else
					if(isDBCSSession && elemValue.hsrAttributes.dbcsOpen) {
						methodVar = function(evt){allowDataLengthChecking(evt);};
						isSBCSOnly = false;
						hc.push(dojoConnect(uInputWidget, "onKeyUp", methodVar));
						hc.push(dojoConnect(uInputWidget, "onKeyDown", methodVar));
						if(eliminateMaxLengthForDBCSFields){
							maxLengthVar = null;
							setDojoAttr(uInput,"eliminateMaxlengthInIdeographicFields","true");
						}
					}
				}
				if (methodVar) {
					hc.push(dojoConnect(uInputWidget, "onKeyPress", methodVar));
					hc.push(dojoConnect(uInput, "onpaste", methodVar));
					hc.push(dojoConnect(uInput, "ondrop", methodVar));
					hc.push(dojoConnect(uInput, "onblur", methodVar));
					hc.push(dojoConnect(uInputWidget, "onClick", methodVar));
					if (imeModeVar) {
						setDojoStyle(uInput,"imeMode",imeModeVar);
					}
					if (maxLengthVar) {
						if(uInputWidget.isVisualMode && isRealIE)
							setDojoAttr(uInput,"cols",maxLengthVar);
						else
							setDojoAttr(uInput,"maxLength",maxLengthVar);
					}
					if(eliminateMaxLengthForDBCSFields){
						hc.push(dojoConnect(uInput, "onfocus", methodVar));
					}
					isFieldTypeFound = true;
				} 	
				if(isDBCSSession && isSBCSOnly) {
					hc.push(dojoConnect(uInputWidget, "onKeyPress", function(evt){allowSBCSOnly(evt);}));
				}	
				if (isSBCSOnly && !isFieldTypeFound) {
					hc.push(dojoConnect(uInputWidget, "onKeyPress", function(evt){allowAlphaNumericShift(evt);}));
					hc.push(dojoConnect(uInput, "onpaste", function(evt){allowAlphaNumericShift(evt);}));
					hc.push(dojoConnect(uInput, "ondrop", function(evt){allowAlphaNumericShift(evt);}));
					hc.push(dojoConnect(uInput, "onblur", function(evt){allowAlphaNumericShift(evt);}));
					hc.push(dojoConnect(uInputWidget, "onClick", function(evt){allowAlphaNumericShift(evt);}));
					if(eliminateMaxLengthForDBCSFields){
						hc.push(dojoConnect(uInput, "onfocus", function(evt){allowAlphaNumericShift(evt);}));
					}
					setDojoStyle(uInput,"imeMode","inactive");
					if(uInputWidget.isVisualMode && isRealIE)
						setDojoAttr(uInput,"cols",maxLengthVar);
					else
						setDojoAttr(uInput,"maxLength",elemValue.length);
				}				
			}
		}
		if (!showUnProtectedSosiAsSpace){
			if (uInputWidget.value && uInputWidget.value.length > 0){
				setDijitAttribute(uInputWidget, "value", removeSpaceAsSOSI(uInputWidget.value));
			}
		}
	}
}

