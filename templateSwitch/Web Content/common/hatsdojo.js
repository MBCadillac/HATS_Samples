//Licensed Materials - Property of IBM
//
// Copyright IBM Corp. 2010, 2015  All Rights Reserved.
//.============================================================================
//.Functions:  Special functions for HATS Dojo Dijits
//.============================================================================


function getEnclosingDijitWidget(elem){
	if (typeof this.registry != 'undefined')
		return this.registry.getEnclosingWidget(elem);
	else
		return dijit.getEnclosingWidget(elem);
}

function getDojoAttr(node, attr){
	if (typeof this.domAttr != 'undefined')
		return this.domAttr.get(node, attr);
	else
		return dojo.attr(node, attr);
}

function setDojoAttr(node, attr, value){
	if (typeof this.domAttr != 'undefined')
		return this.domAttr.set(node, attr, value);
	else
		return dojo.attr(node, attr, value);
}

function getDojoStyle(node, style){
	if (typeof this.domStyle != 'undefined')
		return this.domStyle.get(node, style);
	else
		return dojo.style(node, style);
}

function setDojoStyle(node, style, value){
	if (typeof this.domStyle != 'undefined')
		return this.domStyle.set(node, style, value);
	else
		return dojo.style(node, style, value);
}

function getDojoById(nodeId){
	if (typeof this.dom != 'undefined')
		return this.dom.byId(nodeId);
	else
		return dojo.byId(nodeId);
}

function dojoConnect(target, type, listener, method){
	if (typeof this.on != 'undefined'){
		if (type.indexOf("on") == 0){
			type = type.substring(2);
			type = type.toLowerCase();
		}
		if (type == 'keypress' && typeof target.textbox != 'undefined')
			target = target.textbox;
		
		if (typeof method == 'undefined')
			return this.on(target, type, listener);
		else
			return this.on(target, type, listener, method);
	}else{
		if (typeof method == 'undefined')
			return dojo.connect(target, type, listener);
		else
			return dojo.connect(target, type, listener, method);
	}
}

function setDefaultValueFromItemStore(widget, store, key)  
{
    setToItemValueIfInStore(widget, store, key);
}
function setToItemValueIfInStore(widget, store, key)  
{
    var item=getItemIfInStore(widget, store, key);
    if(item!=null){
        widget.attr('item',item);
        return true;
    }else{return false;}
}
function getItemIfInStore(widget, store, key)  
{
    var fnd=null;
    key = escapeQueryWildcards(key);
    try {
        store.fetch({query:{'value':key}, queryOptions:{ignoreCase:true},onItem:function(item){
            fnd=item;
        }});
    }catch(ex){}
    if(fnd==null){
        try {
            store.fetch({query:{'fullName':key}, queryOptions:{ignoreCase:true},onItem:function(item){
                fnd=item;
            }});
        }catch(ex){}
    }
    return fnd;
}
function getTrueValueForSubmit(widget, store, key)  
{
    var value=key;
    var fnd=false;
    key = escapeQueryWildcards(key);
    try {
        store.fetch({
        query:{'value':key},
        queryOptions:{ignoreCase:true},
        onItem:function(item){
            fnd=true;
            value=store.getValue(item, 'value');
        }
        });
    }catch(ex){
    }
if(fnd==false){
    try {
        store.fetch({
        query:{'fullName':key},
        queryOptions:{ignoreCase:true},
        onItem:function(item){
            fnd=true;
            value=store.getValue(item, 'value');
        }
        });
    }catch(ex){
    }
}

    return value;
}

function escapeQueryWildcards(val)
{
	var ret = val;
	if (val != null)
	{
		try {
			if (typeof val == 'object') ret = val.toString();
			if (typeof ret == 'string' && ret != "")
			{
				ret = ret.replace(/\*/g, "\\\*");
				ret = ret.replace(/\?/g, "\\\?");
			}
		} catch(ex){}
	}
	return ret;
}
function isDijit(widget)
{
    try {
        if (typeof registry != "undefined")
            return (typeof registry.byId(widget.id) != "undefined");
        else
            return ((typeof dijit != "undefined") && (typeof dijit.byId(widget.id) != "undefined"));
    }
    catch(ex){
        return false;
    }
}

function getPosLengthString(hatsDijit)
{
    if(isDijit(hatsDijit))
    {
        var prefix = getJSONVar(hatsDijit).value.isProtected?"p_":"in_";  
        if (undefined != getDijitPosition(hatsDijit) && undefined != getDijitLength(hatsDijit) ) {
            return prefix + getDijitPosition(hatsDijit) + "_" + getDijitLength(hatsDijit);
        }
    }
}

function getDijitPosition(hatsDijit)
{
    if(isDijit(hatsDijit)) {
        return getJSONVar(hatsDijit).value.startPos;
    }
}

function getDijitLength(hatsDijit)
{
    if(isDijit(hatsDijit)) {
        return getJSONVar(hatsDijit).value.length;
    }
}

function addPosLengthNamesToAllTextBoxes() {
    if(dijit){
    	if (typeof this.dom != "undefined")
    		require(["dojo/query"], function(query){
    			query("[data-dojo-type*=TextBox]", dom.byId("HATSForm")).forEach("addDijitPosLengthName(item)");
    		});
    	else
    		dojo.query("[dojoType*=TextBox]", dojo.byId("HATSForm")).forEach("addDijitPosLengthName(item)");
    }
}

function addDijitPosLengthName(hatsDijit) {
    if(isDijit(hatsDijit)){
        var  dij = getDijit(hatsDijit);  
        if(dij.domNode.name !== undefined) { 
            dij.domNode.name = getPosLengthString(hatsDijit); 
        }
    }
}

function getDijit(hatsDijit){
    if(isDijit(hatsDijit)){
    	if (typeof registry != "undefined")
    		return registry.byId(hatsDijit.id);
    	else
    		return dijit.byId(hatsDijit.id);
    }
    return hatsDijit;
}

function getJSONVar(hatsDijit){
    if(isDijit(hatsDijit)){
        return getDijit(hatsDijit).domNode.JSONData; 
    }
}



function setDijitAttribute(hatsDijit, name, value){
    if(isDijit(hatsDijit)){
        if (dojo.version && dojo.version.major == 1 && dojo.version.minor == 4){
            getDijit(hatsDijit).attr(name, value); 
        } else {
            getDijit(hatsDijit).set(name, value); 
        }
    }
}

function getDijitAttribute(hatsDijit, name){
    if(isDijit(hatsDijit)){
        if (dojo.version && dojo.version.major == 1 && dojo.version.minor == 4){
            return getDijit(hatsDijit).attr(name); 
        } else {
            return getDijit(hatsDijit).get(name); 
        }
    }
    return null;
}


function getListItemsFromJSONData(JSONData, baseList){
    if(baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
    if (JSONData && JSONData.type){ 
        var funcHandler=eval("getListItemsFromJSON"+JSONData.type);
        if(funcHandler!=null){
            return funcHandler(JSONData, baseList);
        }
    }
    return baseList;
}
function getListItemsFromJSONArray(JSONObj, baseList){
    if(baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
    for(var i=0;i<JSONObj.length;i++){
        var elemType=null;
        if(JSONObj[i].type){
            elemType = JSONObj[i].type;
        }
        if(elemType!=null){
            var funcHandler=eval("getListItemsFromJSON"+elemType);
            if(funcHandler!=null){
                baseList=funcHandler(JSONObj[i], baseList);
            }
        }
    }
    return baseList;
}
function getListItemsFromJSONInputComponentElement(JSONObj, baseList){
    if(baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
    if(JSONObj.value && JSONObj.value.hints && JSONObj.value.hints.value){
        if (JSONObj.value.hints.value.elements){
            baseList=getListItemsFromJSONArray(JSONObj.value.hints.value.elements, baseList);
        } else if (JSONObj.value.hints.value.componentElements){
            baseList=getListItemsFromJSONArray(JSONObj.value.hints.value.componentElements, baseList);
        }
    }
    return baseList;
}

function createUniqueItemsList(baseList, identifier){  
    var baseList2 = new Array();
    if(baseList==null) return baseList2;
    if(identifier==null) identifier="value";
    for(var i=0;i<baseList.length;i++){
        var flag=false;
        for(var j=(i+1);j<baseList.length;j++){
            if(baseList[i][identifier]==baseList[j][identifier]){flag=true; break;}
        }
        if(flag==false){baseList2.push(baseList[i]);}
    }
    return baseList2;
}

function getListItemsFromJSONListItemComponentElement(JSONObj, baseList){
    if(baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
    baseList.push({"name": JSONObj.value.description,"value": JSONObj.value.item, "fullName":JSONObj.value.fullCaption});
    return baseList;
}
function getListItemsFromJSONPlaceholderListItemComponentElement(JSONObj, baseList){
    if(baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
    return baseList;
}
function getListItemsFromJSONFunctionKeyComponentElement(JSONObj, baseList){
    if(baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
    baseList.push({"name": JSONObj.value.caption,"value": JSONObj.value.mnemonic, "fullName":JSONObj.value.fullCaption});
    return baseList;
}
//Process listStr in the format specified by "List items" of "Fill from string" widget setting (i.e., string of items separated with a semicolon ";") and append the items to baseList
function getListItemsFromString(listStr, baseList){
    if(baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
    if(listStr==null) return baseList;
    var pairs = listStr.split(";");
    for(var i=0;i<pairs.length;i++){
        var pr = pairs[i].split("=");
        if(pr.length==2){ baseList.push({"name":pr[0],"value":pr[1],"fullName":pr[1]+"="+pr[0]});}
        else if(pr.length==1){ baseList.push({"name":pr[0],"value":pr[0],"fullName":pr[0]});}
    }
    return baseList;
}


function getListItemsFromJSONSelectionComponentElement(JSONObj, baseList){
    if(baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
    if(JSONObj.value && JSONObj.value.componentElements){
            baseList=getListItemsFromJSONArray(JSONObj.value.componentElements, baseList);
        }
    return baseList;
}


function getListItemsFromHATSWidgetSettings(settings)
{
    var list = null;
    if (settings && settings.value && settings.value.useString && settings.value.useString == "true" && settings.value.stringListItems && settings.value.stringListItems != "") 
    {
        list = getListItemsFromString(settings.value.stringListItems);
    }
    if (settings && settings.special && settings.special.gvValueListString && settings.special.gvValueListString !="")
    {
	list = getListItemsFromGV(settings.special.gvValueListString, settings.special.gvCaptionListString, list);
    }
    return list;
}

function getListItemsFromGV(gvValueListString, gvCaptionListString, baseList)
{
	if (baseList==null) baseList =  [{"name":"","value":"","fullName":"" }];
	if (gvValueListString==null || gvValueListString=="") return baseList;
	var gvValues = gvValueListString.split(";");
	var gvCaptions = null;
	if (gvCaptionListString != null && gvCaptionListString!="") gvCaptions = gvCaptionListString.split(";");
	for (var i=0;i<gvValues.length;i++)
	{
		if (gvCaptions!=null && i<gvCaptions.length)
		{
			baseList.push({"name":gvCaptions[i],"value":gvValues[i],"fullName":gvValues[i]+"="+gvCaptions[i]});
		} else
		{
			baseList.push({"name":gvValues[i],"value":gvValues[i],"fullName":gvValues[i]});
		}
	}
	return baseList;
}

function getPosLengthStringFromJSONData(JSONData)
{
    if (JSONData)
    {
        var elemJSON = getInputComponentElementFromJSONData(JSONData);
        if (elemJSON != null)
        {
             return getPosLengthStringFromInputComponentElementJSONData(elemJSON);
        }
    }
    return null;
}

function getInputComponentElementFromJSONData(JSONData)
{
    var elemJSON = null;
    if (JSONData)
    {
        if(JSONData.type && JSONData.type == "InputComponentElement")
        {
            elemJSON =  JSONData;
        } else if(JSONData.value && JSONData.value.inputComponentElement)
        {
            elemJSON = JSONData.value.inputComponentElement;
        }
    }
    return elemJSON;
}

function getPosLengthStringFromInputComponentElementJSONData(JSONData)
{
    if (JSONData && JSONData.value)
    {
        var prefix = JSONData.value.isProtected?"p_":"in_";
        if (undefined != JSONData.value.startPos && undefined != JSONData.value.length) {
            return prefix + JSONData.value.startPos + "_" + JSONData.value.length;
        }
    }
    return null;
}

function getListItemComponentElementArrayFromJSONData(JSONData)
{
    var elemJSON = null;
    if (JSONData && JSONData.value)
    {
        if(JSONData.value.componentElements && JSONData.value.componentElements.length > 0){
            elemJSON = JSONData.value.componentElements;
        } else
        if (JSONData.value.hints && JSONData.value.hints.value && JSONData.value.hints.value.elements && JSONData.value.hints.value.elements.length > 0)
        {
            elemJSON = JSONData.value.hints.value.elements;
        }
        return elemJSON;
    }
}

function getDefaultValueFromListItemComponentElementJSONArray(JSONArray)
{
    if (JSONArray)
    {
        for(var i=0;i<JSONArray.length;i++){
            if(JSONArray[i].value && JSONArray[i].value.isDefault){
                return JSONArray[i].value.item;
            }
        }
    }
    return null;
}

function getDefaultValueFromJSONData(JSONData)
{
    return getDefaultValueFromListItemComponentElementJSONArray(getListItemComponentElementArrayFromJSONData(JSONData));
}

function getLongestValueOrFullName(init,fieldlength,widget,JSONData) {
    var fnd=init;
    if(fieldlength>fnd &&(JSONData.type == "InputComponentElement")) fnd=fieldlength;
    if(widget.store){
        try {
            widget.store.fetch({onItem:function(item){
                var val=widget.store.getValue(item, 'fullName').length;
                if(fnd<val) fnd=val;
                val=widget.store.getValue(item, 'value').length;
                if(fnd<val) fnd=val;
            }});
        }catch(ex){}
    }
    return fnd;
}


function getSuggestedInputWidth(inputWidget)
{	
    var JSONData = inputWidget.domNode.JSONData;
    var longestLength = getLongestValueOrFullName(1, getInputComponentElementFromJSONData(JSONData).value.length,inputWidget,JSONData);
	var cp = (typeof(dojoCodePage)!=='undefined')?dojoCodePage:CodePage;
    if (isDBCSCodePage(cp)){
    	return longestLength*0.7 + 4 + "em";
    }
    return longestLength*0.5 + 4 + "em";  
}




function getHatsDojoConnections(hatsDijit)
{
    if(isDijit(hatsDijit)){
        try {
            return getDijit(hatsDijit).domNode.hatsDojoConnections;
        }
        catch (e) {return [];}
    }
}

function disconnectAllDijitEvents(hatsDijit)
{
    if(isDijit(hatsDijit)){
        try {
        	if (typeof registry != "undefined"){
        		require(["dojo/_base/array"], function(array){
        			array.forEach(getHatsDojoConnections(hatsDijit), "item.remove();");
        		});
        	}
        	else
        		dojo.forEach(getHatsDojoConnections(hatsDijit), "dojo.disconnect(item);");
        }
        catch (e) {return false;}
    }
}



function isFilter(inputWidget)
{
    var djtme=getDijit(inputWidget);
    if (djtme.declaredClass == "dijit.form.FilteringSelect")
        return true;
    else
        return false;

}

function isCombo(inputWidget)
{
    var djtme=getDijit(inputWidget);
    if (djtme.declaredClass == "dijit.form.ComboBox")
        return true;
    else
        return false;

}
