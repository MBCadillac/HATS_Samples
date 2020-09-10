//Licensed Materials - Property of IBM
//
// Copyright IBM Corp. 2010, 2015  All Rights Reserved.

//.============================================================================
//.Function:  Load the JSON information and behaviors into the Widget
//.============================================================================





function bindJSONDataToDateTextBox(uLabel, uInputWidget, JSONData, widgetSettings)
{
    if (isDijit(uInputWidget) && JSONData && JSONData.value && widgetSettings && widgetSettings.value)
    {
        var elemValue = JSONData.value;
        if (elemValue.caption){
            uLabel.innerHTML = elemValue.caption;
        }

        //uInput represents the DOM node of uInputWidget and is used for setting attributes
        var uInput = uInputWidget.domNode;
        //bind JSON data to the Widget DOM node so the data can be accessed through the Widget DOM node
        uInput.JSONData = JSONData;
        uInput.hatsDojoConnections = [];
        var hc = uInput.hatsDojoConnections;
        
        //The DOM node of DateTextBox is no 'name' attribute, change using uInputWidget.textbox
        setDojoAttr(uInputWidget.textbox,"name",getPosLengthString(uInputWidget));

        var fullyear = true; 
        var strict = false; 

        //set Pattern
        widgetSettings.value.pattern = replaceDatePattern(widgetSettings.value.pattern);                             
        if(widgetSettings.value.pattern.indexOf("yy") != -1 && widgetSettings.value.pattern.indexOf("yyyy") == -1) { 
            uInputWidget.constraints.fullYear = false;                                                               
            uInputWidget.constraints.strict = true;																	 
            fullyear = false;                                                                                        
            strict = true;																							 
        }                                                                                                            
        uInputWidget.constraints.datePattern = widgetSettings.value.pattern;
        var pattern = widgetSettings.value.pattern; 


        //set MinDate
        if(widgetSettings.value.restrictMinDate == "true" && rightTrimFromString(widgetSettings.value.rangeStart) != "") {
            uInputWidget.constraints.min = new Date(Date.parse(rightTrimFromString(widgetSettings.value.rangeStart)));
        }

        //set MaxDate
        if(widgetSettings.value.restrictMaxDate == "true" && rightTrimFromString(widgetSettings.value.rangeEnd) != "") {
            uInputWidget.constraints.max = new Date(Date.parse(rightTrimFromString(widgetSettings.value.rangeEnd)));
        }

        
        
        //set default value
        if(rightTrimFromString(elemValue.text) != "") {
            if(dateChecking(rightTrimFromString(elemValue.text), pattern, fullyear, strict)) {
                setDijitAttribute(uInputWidget, "value", dateChecking(rightTrimFromString(elemValue.text), pattern, fullyear, strict));
            }else if(rightTrimFromString(widgetSettings.value.defaultValue) != "") {
                if(!isNaN(Date.parse(rightTrimFromString(widgetSettings.value.defaultValue)))) {
                    setDijitAttribute(uInputWidget, "value", new Date(Date.parse(rightTrimFromString(widgetSettings.value.defaultValue))));
                }
            }
            else {
                setDijitAttribute(uInputWidget, "value", new Date());
            }
        }
        else if(rightTrimFromString(widgetSettings.value.defaultValue) != "") {
            if(!isNaN(Date.parse(rightTrimFromString(widgetSettings.value.defaultValue)))) {
                setDijitAttribute(uInputWidget, "value", new Date(Date.parse(rightTrimFromString(widgetSettings.value.defaultValue))));
            }
        }

        //set invalid message
        if(widgetSettings.value.useInvalidMessage == "false") { 
            setDijitAttribute(uInputWidget, "invalidMessage", rightTrimFromString(widgetSettings.value.invalidMessage));
        }

        //set range message
        if(widgetSettings.value.useRangeMessage == "false") { 
            setDijitAttribute(uInputWidget, "rangeMessage", rightTrimFromString(widgetSettings.value.rangeMessage));
        }

        //set prompt message
        if(rightTrimFromString(widgetSettings.value.promptMessage) != "") {
            setDijitAttribute(uInputWidget, "promptMessage", rightTrimFromString(widgetSettings.value.promptMessage));
        }
        
        
        if(widgetSettings.value.validateOnSubmit=="true"){
            setDijitAttribute(uInputWidget, "validateOnSubmit", widgetSettings.value.validateOnSubmit);
        }	
                
        setDojoAttr(uInput,"required", "true");
        setDojoStyle(uInput,"width",elemValue.length+"em");

        hc.push(dojoConnect(uInputWidget, "onFocus", function(evt) {  
                setFocusFieldIntoGlobal(this, formID);}));

        hc.push(dojoConnect(uInputWidget, "onClick", function(evt) {
            setCursorPosition(elemValue.startPos, formID);}));
    }
}

function dateChecking(dateString, pattern, fullyear, strict) {                                           
    return dojo.date.locale.parse(dateString, {fullYear:fullyear, datePattern:pattern,selector:"date", strict:strict}); 
}                                                                                                        

function replaceDatePattern(a) { 
    var stringReplace = new String("");
    for (j = 0; j < a.length; j++)
    {
        if (a.charAt(j) == 'Y')
            stringReplace=stringReplace + 'y';
        else if (a.charAt(j) == 'm')
            stringReplace=stringReplace + 'M';
        else if (a.charAt(j) == 'D')
            stringReplace=stringReplace + 'd';
        else if (a.charAt(j) == 'e')
            stringReplace=stringReplace + 'E';
        else
            stringReplace=stringReplace + a.charAt(j);
    }
    return stringReplace;
}