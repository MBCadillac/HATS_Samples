//Licensed Materials - Property of IBM
//
// Copyright IBM Corp. 2010, 2015  All Rights Reserved.

//.============================================================================
//.Function:  Load the JSON information and behaviors into the Widget
//.============================================================================


function bindJSONDataToComboBox(uLabel, uInputWidget, JSONData, widgetSettings)
{	
	if (isDijit(uInputWidget) && JSONData && JSONData.value)
	{	
		var elemJSON = getInputComponentElementFromJSONData(JSONData);
		if (elemJSON && elemJSON.value)
		{
			var uInputDomNode = uInputWidget.domNode;
			var uInputTextbox = uInputWidget.textbox;
			var elemValue = elemJSON.value; 
			// set label
			if (elemValue.caption){
				uLabel.innerHTML = elemValue.caption;
			}
			// set default value: check the isDefault attribute from JSONData first, then the value in the text field
			//set base dijit values
			
			var elemDefaultValue =  getDefaultValueFromJSONData(JSONData);
			if (elemDefaultValue == null) {
				elemDefaultValue = rightTrimFromString(elemValue.text);
				
				var isDBCSSession = isDBCSCodePage(CodePage);
				if (isDBCSSession) {
					elemDefaultValue = removeSpaceAsSOSI(elemDefaultValue);
				}
				
			}
			if (elemDefaultValue != null && elemDefaultValue != "") {
				if(widgetSettings.value.stringListItems != ""){ 
					setDefaultValueFromItemStore(uInputWidget, uInputWidget.store, elemDefaultValue);
				}
				if (getDijitAttribute(uInputWidget, "value") == "") { 
					setDijitAttribute(uInputWidget, "value", elemDefaultValue); 
				}
			}
			
			
			setDijitAttribute(uInputWidget, "queryExpr", "*${0}*");
			setDijitAttribute(uInputWidget, "autoComplete", false);
				
			//bind JSON data to the Widget DOM node so the data can be accessed through the Widget DOM node
			var hatsinputname = getPosLengthStringFromJSONData(JSONData);
			uInputDomNode.JSONData = JSONData;
			uInputDomNode.hatsDojoConnections = [];
			var hc = uInputDomNode.hatsDojoConnections;
			
			//assign select name
			setDojoAttr(uInputDomNode, "name", hatsinputname);
			setDojoAttr(uInputTextbox, "name", hatsinputname);
						
			setDojoStyle(uInputDomNode, "width", getSuggestedInputWidth(uInputWidget));
			//assign code for selection or value entry on change
			hc.push(dojoConnect(uInputWidget, "onChange", function(val) {
				var cb = this; 
				var ci = cb.item;
				if(ci != null) { 
					cb.displayedValue = ci.fullName;  
					cb.value = ci.value; 
					cb.attr('item',ci);
				} else if (val!="") {  
				
					ci= getItemIfInStore(cb, cb.store, val);
					if(ci != null) {
						cb.displayedValue = ci.fullName;  
						cb.value = ci.value; 
						cb.attr('item',ci);
					} else {
						cb.value = cb.displayedValue = val;  
					}
				}
				checkInput(this);
			}));
			//assign autosubmit on change
			
			if (widgetSettings && widgetSettings.value && widgetSettings.value.autoSubmitOnSelect && widgetSettings.value.autoSubmitOnSelect == "true")
			{
				uInputWidget.autoSubmit = function(){
					var elemValue=getInputComponentElementFromJSONData(uInputWidget.domNode.JSONData).value;
					if(typeof uInputWidget.item != "undefined"){uInputWidget.displayedValue = uInputWidget.item.fullName;}
					ms(((typeof elemValue.action!="undefined")? elemValue.action:"[enter]"), formID);
				};
				hc.push(dojoConnect(uInputWidget, "_selectOption", uInputWidget, "autoSubmit"));
			} 
			
			//assign code for focus information provision
			hc.push(dojoConnect(uInputWidget, "onFocus", function(evt) {
				setFocusFieldIntoGlobal(this, formID);
			}));
		}
	}
}
