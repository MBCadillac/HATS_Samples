//Licensed Materials - Property of IBM
//
// Copyright IBM Corp. 2010, 2015  All Rights Reserved.

//.============================================================================
//.Function:  Load the JSON information and behaviors into the Widget
//.============================================================================

















function bindJSONDataToFilteringSelect(uLabel, uInputWidget, JSONData, widgetSettings)
{
	if (isDijit(uInputWidget) && JSONData && JSONData.value)
	{
		var elemJSON = getInputComponentElementFromJSONData(JSONData);
		if (elemJSON && elemJSON.value)
		{
			var elemValue = elemJSON.value; 
			// set label
			if (uLabel && elemValue.caption){
				uLabel.innerHTML = elemValue.caption;
			}
			//bind JSON data to the Widget DOM node so the data can be accessed through the Widget DOM node
			uInputWidget.domNode.JSONData = JSONData;
			uInputWidget.domNode.hatsDojoConnections = [];
			var hc = uInputWidget.domNode.hatsDojoConnections;

			var hatsinputname = getPosLengthStringFromJSONData(JSONData);
			setDojoAttr(uInputWidget.textbox, "name", "select"+hatsinputname); 
			setDojoAttr(uInputWidget.domNode, "name", hatsinputname);
			
			setDojoStyle(uInputWidget.domNode, "width", getSuggestedInputWidth(uInputWidget));
			// set default value: check the isDefault attribute from JSONData first, then the value in the text field
			var elemDefaultValue =  getDefaultValueFromJSONData(JSONData);
			if (elemDefaultValue == null) {
				elemDefaultValue = rightTrimFromString(elemValue.text);
				
				var isDBCSSession = isDBCSCodePage(CodePage);
				if (isDBCSSession) {
					elemDefaultValue = removeSpaceAsSOSI(elemDefaultValue);
				}
				
			}
			if (elemDefaultValue != null && elemDefaultValue != "") {
				setDefaultValueFromItemStore(uInputWidget, uInputWidget.store, elemDefaultValue);
				
				if (uInputWidget.item != null)
				{
					setDojoAttr(uInputWidget.valueNode, "dftVal", uInputWidget.value);
				}
			}
			setDijitAttribute(uInputWidget, "queryExpr", "*${0}*");
			setDijitAttribute(uInputWidget, "autoComplete", false);
			
			hc.push(dojoConnect(uInputWidget, "onFocus", function() {
				setFocusFieldIntoGlobal(this, formID);}));
			hc.push(dojoConnect(uInputWidget, "onChange", function() {
				checkInput(this);}));
			if (widgetSettings && widgetSettings.value && widgetSettings.value.autoSubmitOnSelect && widgetSettings.value.autoSubmitOnSelect == "true") 
			{
				
			  uInputWidget.autoSubmit = function(){
					var elemValue=getInputComponentElementFromJSONData(uInputWidget.domNode.JSONData).value;
					if(typeof uInputWidget.item != "undefined"){uInputWidget.displayedValue = uInputWidget.item.fullName;}
					ms(((elemValue.action)? elemValue.action:"[enter]"), formID);
				};
				hc.push(dojoConnect(uInputWidget, "_selectOption", uInputWidget, "autoSubmit"));
			}
		 	
		 	//reset field value if invalid
		 	hc.push(dojoConnect(uInputWidget, "onBlur", function() {
				if (!this.isValid()) {
						uInputWidget.reset();
					}
			}));
		}
	}
}
