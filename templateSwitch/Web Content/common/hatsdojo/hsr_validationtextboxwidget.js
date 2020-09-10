//Licensed Materials - Property of IBM
//
// Copyright IBM Corp. 2010, 2015  All Rights Reserved.

//.============================================================================
//.Function:  Load the JSON information and behaviors into the Widget
//.============================================================================





function bindJSONDataToValidationTextBox(uLabel, uInputWidget, JSONData, widgetSettings)
{
	if (isDijit(uInputWidget) && JSONData && JSONData.value)
	{
		var elemValue = JSONData.value; 
		if (elemValue.caption){
			uLabel.innerHTML = elemValue.caption;
		}
		
		var uInput = uInputWidget.domNode;
		//bind JSON data to the Widget DOM node so the data can be accessed through the Widget DOM node
		uInput.JSONData = JSONData; 
		uInput.hatsDojoConnections = [];
		var hc = uInput.hatsDojoConnections;

		var eValue_text = rightTrimFromString(elemValue.text);
		if(uInputWidget.isVisualMode && uInputWidget.dir == 'rtl')
			eValue_text = uInputWidget.reverseRtlText(eValue_text);
				
		setDijitAttribute(uInputWidget, "value", rightTrimFromString(elemValue.text));
		
		
		if(trimSpacesFromValue(widgetSettings.value.regExp).length > 0){
		   setDijitAttribute(uInputWidget, "regExp", widgetSettings.value.regExp);	
		}
		
		
		if(widgetSettings.value.validateOnSubmit=="true"){
		   setDijitAttribute(uInputWidget, "validateOnSubmit", widgetSettings.value.validateOnSubmit);
		}		
		
		
		setDijitAttribute(uInputWidget, "promptMessage", widgetSettings.value.promptMessage);			
		
		
		var useDefaultInvalidMessage = (widgetSettings.value.useDefaultInvalidMessage=="true");		
		if(!useDefaultInvalidMessage){
		   setDijitAttribute(uInputWidget, "invalidMessage", widgetSettings.value.invalidMessage);
		}
				
		setDojoAttr(uInputWidget.textbox,"name",getPosLengthString(uInputWidget));
		
		setDojoStyle(uInput,"width",elemValue.length+"em");

		hc.push(dojoConnect(uInputWidget, "onfocus", function(evt) {
			if (uInputWidget.isVisualMode)
			  setFocus(this.focusNode, formID);
			else
			  setFocusFieldIntoGlobal(this, formID);
		}));
		
		hc.push(dojoConnect(uInputWidget, "onChange", function(evt) {
		  checkInput(this);}));
		hc.push(dojoConnect(uInputWidget, "onClick", function(evt) {
		  setCursorPosition(elemValue.startPos, formID);}));		
		
		if (!showUnProtectedSosiAsSpace){
			if (uInputWidget.value && uInputWidget.value.length > 0){
				setDijitAttribute(uInputWidget, "value", removeSpaceAsSOSI(uInputWidget.value));
			}
		}		
		
		
		var isDBCSSession = isDBCSCodePage(CodePage);
		if (conntype == 5250 || conntype == 3270){ 
			if (!elemValue.isProtected && elemValue.hsrAttributes){	
				var imeModeVar = "inactive";
				if (conntype == 5250){ 
					if (elemValue.hsrAttributes.keyboardInhibited){
						imeModeVar = "disabled";
					} else if (isDBCSSession && (elemValue.hsrAttributes.dbcsOnly || elemValue.hsrAttributes.dbcsPure)){
						imeModeVar = "active";
					} else if (isDBCSSession && elemValue.hsrAttributes.dbcsOpen){
						imeModeVar = null;
					} else if (isDBCSSession && elemValue.hsrAttributes.dbcsEither){
						imeModeVar = "active";
						isSBCSOnly = false;
						var isJFieldMode = false;
						if (uInputWidget.value && uInputWidget.value.length > 0){
							var tmpValue = removeSpaceAsSOSI(uInputWidget.value);
							if (tmpValue.length>0){
								isJFieldMode = isDBCSChar(tmpValue.charAt(0), enableDBCSSession, enableDBCSEuro, CodePage);
							}
						}
						if (!isJFieldMode){
							imeModeVar = "inactive";
						}
					} else if (isDBCSSession && elemValue.hsrAttributes.katakanaShift){
						imeModeVar = "active";
					}
				} else {
					if (isDBCSSession && elemValue.hsrAttributes.dbcsOnly) {
						imeModeVar = "active";
					} else if(isDBCSSession && elemValue.hsrAttributes.dbcsOpen) {
						imeModeVar = null;
					}
				}
				if (imeModeVar) {
					setDojoStyle(uInputWidget.textbox,"imeMode",imeModeVar);
				}				
			}
		}
		
	}
}

