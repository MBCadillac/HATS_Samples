// Licensed Materials - Property of IBM
//
// 5724-D34   (Product: IBM HATS)
//
// (C) Copyright IBM Corp. 2002  All Rights Reserved

var intInitialCursorPosition = -1;

function htElement(fieldName,fieldValue,fieldType){
	this.fieldName = fieldName;
	this.fieldValue = fieldValue;
	this.fieldType = fieldType;
}

function HT(hts){
	this.hts = hts;
}

function updateHTInfo(hte){
	var ret;
	name = hte.fieldName;
	value = hte.fieldValue;
	type = hte.fileType;
	HTInfo = getInfo(activeID).HTInfo;
	if(HTInfo==null){
		ret = new Array(1);
		ret[0] = hte;
	} else {
		hts = HTInfo.hts;
		extraCount = 0;
		for (i=0;i<hts.length;i++){
			if (hts[i].fieldName == name && hts[i].fieldType == type){
				hts[i].fieldValue = value;
				extraCount++;
				break;
			}
		}
		ret = hts;
		if (extraCount==0){
			newSize = parseInt(hts.length)+1;
			ret = new Array(newSize);
			ret[hts.length] = hte;
			for (i=0;i<hts.length;i++){
				ret[i] = hts[i];
			}
		}
	}
	return (new HT(ret));
}

function updateCheckInput(){
	if(isNS6){
		HTInfo = getInfo(activeID).HTInfo;
		if (HTInfo!=null){
			hts = HTInfo.hts;
			for (i=0;i<hts.length;i++){
				if (hts[i].fieldType == "password")
					checkInputForTF(hts[i]);
			}
		}
	}
}

function setExtraInfo(){
	if (isNS6 && !isIEMobile)/*$$GMm1c$$*/
	{
		useTF = getInfo(activeID).useTF;
		if (useTF)
		{
			HTInfo = getInfo(activeID).HTInfo;
			if(HTInfo!=null)
			{
				hatsform = document.getElementsByName(hatsForm.name);
				extraId = getID();
				if (hatsform!=null)
				{
					extraId = extraId + "TFExtraInfo";
					oldExtraInfo = documentgetElementById(extraId);
					if (oldExtraInfo!=null)
					{
						hatsform[0].removeChild(oldExtraInfo);
					}
					newExtraInfo = document.createElement("DIV");
					newExtraInfo.setAttribute("id","TFExtraInfo");
					newExtraInfo.setAttribute("style","position:absolute;visibility:hidden;");
					for (i=0;i<HTInfo.hts.length;i++){
						hiddenField = document.createElement("input");
						hiddenField.setAttribute("type","hidden");
						hiddenField.setAttribute("name",HTInfo.hts[i].fieldName);
						hiddenField.setAttribute("value",HTInfo.hts[i].fieldValue);
						newExtraInfo.appendChild(hiddenField);
					}
					hatsform[0].insertBefore(newExtraInfo,hatsform[0].firstChild);
				}
			}
		}
	}
}

function Tab(bgcolor,selectedBGColor,fontColor,selectedFontColor,hoveredBGColor){
	this.bgcolor = bgcolor;
	this.selectedBGColor = selectedBGColor;
	this.fontColor = fontColor;
	this.selectedFontColor = selectedFontColor;
	this.hoveredBGColor = hoveredBGColor;
}

function TabbedFolder(id,selected,fontSize,tabHeight,tabs,CSSFamily,width,height){
	this.id = id;
	this.selected = selected;
	this.fontSize = fontSize;
	this.tabHeight = tabHeight;
	this.tabs = tabs;
	this.CSSFamily = CSSFamily;
	this.width = width;
	this.height= height;
}

function showFolder(index,tabs,flag){
	if (isIE5 && (flag != true)) return;
	ID = tabs.id;
	tabID = ID+"tab";
	folderID = ID+"folder";
	labelID = ID+"label";
	num = tabs.tabs.length;
	selectedFontColor = tabs.tabs[index].selectedFontColor;
	if (!isNS4){
		if (tabs.selected != null) hide(tabs);
		folder = getElement(folderID,index);
		tab = getElement(tabID,index);
		label = getElement(labelID,index);

		inputs = folder.getElementsByTagName("input");
		for (j=0;j<inputs.length;j++){
			if (inputs[j].type == "text" || inputs[j].type == "password"  || inputs[j].type == "checkbox" || inputs[j].type == "radio" )
				inputs[j].style.visibility = "visible";
		}

		inputs = folder.getElementsByTagName("select");
		for (j = 0; j < inputs.length; j++){
			inputs[j].style.visibility = "visible";
		}

		folder.style.visibility = "visible";
		folder.style.display = "block";
		tab.style.cursor = "text";
		folder.style.zIndex = num+1;
		folder.style.cursor = "text";
		selectedBGColor = tabs.tabs[index].selectedBGColor;
		folder.style.backgroundColor = selectedBGColor;
		tab.style.backgroundColor = selectedBGColor;
		tab.style.zIndex = num+2;
		label.style.fontWeight = "bold";
		label.style.cursor = "text";
		label.style.color = selectedFontColor;
		posn = -1;
		folder.style.top = posn;
		tabs.selected = index;
		setCursorFocus((folderID+index));
		if (isNS6)
			updateCheckInput();
	}
}

function hide(tabs){
	ID = tabs.id;
	tabID = ID+"tab";
	folderID = ID+"folder";
	labelID = ID+"label";
	num = tabs.tabs.length;
	index = tabs.selected;
	fontColor = tabs.tabs[index].fontColor;
	if (!isNS4){
		folder = getElement(folderID,index);
		tab = getElement(tabID,index);
		label = getElement(labelID,index);
		if (isNS6){
			tab.style.cursor = "pointer";
			label.style.cursor = "pointer";
		}

		inputs = folder.getElementsByTagName("input");
		for (j=0;j<inputs.length;j++){
			if (inputs[j].type == "text" || inputs[j].type == "password"  || inputs[j].type == "checkbox" || inputs[j].type == "radio" )
				inputs[j].style.visibility = "hidden";
		}

		inputs = folder.getElementsByTagName("select");
		for (j=0; j<inputs.length; j++){
			inputs[j].style.visibility = "hidden";
		}

		folder.style.zIndex = num-index;
		folder.style.visibility = "hidden";
		folder.style.display = "none";
		folder.style.backgroundColor = tabs.tabs[index].bgcolor;
		tab.style.backgroundColor = tabs.tabs[index].bgcolor;
		tab.style.color = fontColor;
		tab.style.zIndex = num-index;
		tab.style.cursor = "hand";
		label.style.fontWeight = "normal";
		label.style.cursor = "hand";
		label.style.color = fontColor;
	}
}

function hover(index,tabs){
	ID = tabs.id;
	tabID = ID+"tab";
	labelID = ID+"label";
	hoveredBGColor = tabs.tabs[index].hoveredBGColor;
	if (!isNS4){
		tab = getElement(tabID,index);
		if (index!=tabs.selected)
			tab.style.backgroundColor = hoveredBGColor;
		label = getElement(labelID,index);
		label.style.fontWeight = "bold";
	}
}

function out(index,tabs){
	ID = tabs.id;
	tabID = ID+"tab";
	labelID = ID+"label";
	bgcolor = tabs.tabs[index].bgcolor;
	selectedBGColor = tabs.tabs[index].selectedBGColor;
	if (!isNS4){
		tab.style.backgroundColor = bgcolor;
		tab = getElement(tabID,index);
		label = getElement(labelID,index);
		if (index!=tabs.selected){
			label.style.fontWeight = "lighter";
		} else {
			tab.style.backgroundColor = selectedBGColor;
		}
	}
}

function getElement(type,index){
	if (!isNS4){
		return (documentgetElementById(type+index));
	}
}

function init(tabs,pID){
	if (!isNS4){
		getInfo(pID).useTF = true;
		useTF = true;
		ID = tabs.id;
		tabID = ID+"tab";
		folderID = ID+"folder";
		labelID = ID+"label";
		relatedIndexID = ID+"relatedIndex";
		count = 0;
		relatedIndex = documentgetElementById(relatedIndexID);
		relatedIndex.style.width = tabs.width;
		relatedIndex.style.height = tabs.height;
		num = tabs.tabs.length;
		rowNum = 1;
		tabheight = tabs.tabHeight;
		for(i=0;i<num;i++){
			tab = getElement(tabID,i);
			tab.style.backgroundColor = tabs.tabs[i].bgcolor;
			tab.style.height = tabheight;
			label = getElement(labelID,i);
			label.style.color=tabs.tabs[i].fontColor;
			fontSize = parseInt(tabs.fontSize);
			tab.style.fontSize = fontSize;
		}
		for(i=0;i<num;i++){
			folder = getElement(folderID,i);
			folder.style.width = tabs.width;
			folder.style.height = tabs.height - tabheight;
			folder.style.backgroundColor = tabs.tabs[i].bgcolor;
			if (i!=0){
				folder.style.visibility="hidden";
				folder.style.display="none";

				inputs = folder.getElementsByTagName("input");
				for (j=0;j<inputs.length;j++){
					if (inputs[j].type == "text" || inputs[j].type == "password" || inputs[j].type == "checkbox" || inputs[j].type == "radio" )
						inputs[j].style.visibility = "hidden";
				}

				inputs = folder.getElementsByTagName("select");
				for (j=0; j<inputs.length; j++){
					inputs[j].style.visibility = "hidden";
				}
			}
		}
	}
}

function setCursorFocus(folderID){
	if (!isNS4){
		index = intInitialCursorPosition;
		focusFieldName = getInfo(activeID).focusFieldName;
		if (focusFieldName!=null){
			indexArray = focusFieldName.split("_");
			index = indexArray[1];
		}

		if(portletID != "hatsportletid"){
			if(portletID != activeID) return;
		}

		if (hatsForm == null){
			return;
		}
		hatsform = hatsForm.getElementsByTagName("input");
		for (var j = 0; j < hatsform.length; j++){
			elementNext = hatsform[j];
			if ((elementNext.type == "text") || (elementNext.type == "password")){
				if( (elementNext.name.indexOf(index) != -1)){
					if (elementNext.style.visibility!="hidden"){
						elementNext.focus();
						lasttextfiled = elementNext;
						getInfo(activeID).focusFieldName = elementNext.name;
						break;
					}
				}
			}
		}
	}
}


function checkInputForTF(me){
	var member = new Array();
	var mesplit = new Array();
	name = me.fieldName;
	value = me.fieldValue;
	mepool = name.split("_");
	lm = parseInt(mepool[1],10);
	size = parseInt(mepool[2],10);
	rm = lm + size - 1;
	flag = lm + value.length - 1;

	if(value.length != 0){
		for(var i = 0; i<size; ++i ){
			mesplit[i] = new Array(2);
			mesplit[i][0] = lm + i ;
			if( lm+i <= flag ){
				mesplit[i][1] = value.charAt(i);
			} else {
				mesplit[i][1] = " ";
			}
		}
	}
	else if(value.length == 0){
		for(var i = 0; i<size; ++i){
			mesplit[i] = new Array(2);
			mesplit[i][0] = lm + i ;
			mesplit[i][1] = " ";
		}
	}

	hatsform = hatsForm.getElementsByTagName("input");
	for(var i = 0; i<hatsform.length; ++i)
	{
		current = hatsform[i].name;
		pool = current.split("_");
		member[i] = new Array(4);
		member[i][0] = i;
		member[i][1] = parseInt(pool[1],10);//field start position
		member[i][2] = parseInt(pool[2],10);//field length
		member[i][3] = member[i][1] + member[i][2] - 1;//field end position
		member[i][4] = hatsform[i].value;//initial value in the field
	}

	// Start to loop for each element
	for(var i = 0; i<hatsform.length; ++i){
		if(hatsform[i].name == name )//for the elements have the same name
		{
			hatsform[i].value = value;
		}
		else if( hatsform[i].name != name){
			if( (member[i][1] >= lm && member[i][1] <= rm ) ||
					(member[i][3] >= lm && member[i][3] <= rm ) ||
					(member[i][1] <  lm && member[i][3] >  rm ))//check if overlapping
			{

				currString = member[i][4];
				clm = member[i][1];
				crm = member[i][3];
				buffer = new String();
				csize = member[i][2];
				if(currString.length != 0){
					for(var k =0; k<csize; ++k){
						match = false;
						walker = clm + k;
						len = size;
						for(var m = 0; m<len; ++m){
							if(walker == mesplit[m][0]){
								buffer = buffer + mesplit[m][1];
								match = true;
							}
						}
						if(!match){
							if( ( clm + k ) <  rm ){
								buffer = buffer + currString.charAt(k);
							} else if( (clm + k ) > flag){
								buffer += currString.charAt(k);
							}
						}
					}
				}
				else if(currString.length == 0){
					for(var k =0; k<csize; ++k){
						match = false;
						walker = clm + k;
						for(var m = 0; m<value.length; ++m){
							if(walker == mesplit[m][0]){
								buffer += mesplit[m][1];
								match = true;
							}
						}
						if(!match){
							if( ( clm + k ) <  rm ){
								buffer += " ";
							}
						}
					}
				}
				if(emptyString(buffer)){
					hatsform[i].value = "";
				} else {
					hatsform[i].value = buffer;
				}
			}
		}
	}
}

function getUnescape(str){
	newStr = str;
	if(newStr.indexOf("&")!=-1){
		index = newStr.indexOf("&");
		if (newStr.substring(index,index+6)=="&nbsp;" || newStr.substring(index,index+6)=="&quot;"){
			newStr = str.substring(0,index)+" "+str.substr(index+6);
		} else if(newStr.substring(index,index+5)=="&amp;"){
			newStr = str.substring(0,index)+" "+str.substr(index+5);
		} else if(newStr.substring(index,index+4)=="&gt;" || newStr.substring(index,index+4)=="&lt;"){
			newStr = str.substring(0,index)+" "+str.substr(index+4);
		} else {
			newStr = str.substring(0,index)+" "+str.substr(index+1);
		}
		getUnescape(newStr);
	}
	return newStr;
}

function drawCSS(tabs){
	ID = tabs.id;
	document.write("<style type=\"text/css\">\n");
	document.write("."+ID+"hatstab\n{\n");
	document.write("\tmargin : 0;\n");
	document.write("\t\tborder : "+tabs.CSSFamily.borderCSS+tabs.CSSFamily.borderColor+";\n");
	document.write("\t\tborder-bottom-style :none;\n");
	document.write("\t\tposition : relative;\n");
	document.write("\t\tcursor : pointer;\n");
	document.write("\t\tcursor : hand;\n");
	document.write("\t\ttext-align : center;\n");
	document.write("\t\tfont-family : "+tabs.CSSFamily.tabFont+";\n");
	document.write("\t\theight : "+tabs.tabHeight+";\n");
	document.write("\t\tline-height : 200%;\n}\n");
	document.write("."+ID+"hatsfolder\n{\n");
	document.write("\t\tposition : relative;\n");
	document.write("\t\tvisibility: visible;\n");
	document.write("\t\tmargin : 0;\n");
	document.write("\t\tbackground-color : white;\n");
	document.write("\t\tborder : "+tabs.CSSFamily.borderCSS+tabs.CSSFamily.borderColor+";\n");
	document.write("\t\tfont-family : "+tabs.CSSFamily.folderFont+";\n");
	document.write("\t\toverflow : auto;\n}\n");
	document.write("."+ID+"hatslabel\n{\n");
	document.write("\t\ttext-decoration : none;\n");
	document.write("\t\tcursor : pointer;\n");
	document.write("\t\tcursor : hand;\n}\n");
	document.write("\t\t</style>\n");
}

function CSSFamily(borderCSS,borderColor,tabFont,folderFont){
	this.borderCSS = borderCSS;
	this.borderColor = borderColor;
	this.tabFont = tabFont;
	this.folderFont = folderFont;
}

var HTInfoArray = null;
function HTInfoInit(HTInfo,useTF,focusFieldName,hatsportletid){
	//   info = new Info(HTInfo,useTF,focusFieldName,hatsportletid);
	//   HTInfoArray = addInfo(info);
}

function HATSTFInit(HTInfo,useTF,focusFieldName,hatsportletid){
	info = new Info(HTInfo,useTF,focusFieldName,hatsportletid);
	HTInfoArray = addInfo(info);
}

function Info(HTInfo,useTF,focusFieldName,hatsportletid){
	this.HTInfo = HTInfo;
	this.useTF = useTF;
	this.focusFieldName = focusFieldName;
	this.hatsportletid = hatsportletid;
}

function addInfo(info){
	var ret;
	if(HTInfoArray==null){
		ret = new Array(1);
		ret[0] = info;
	} else {
		extraCount = 0;
		for (i=0;i<HTInfoArray.length;i++){
			if (HTInfoArray[i].hatsportletid == info.hatsportletid){
				HTInfoArray[i].HTInfo == info.HTInfo ;
				HTInfoArray[i].useTF == info.useTF ;
				HTInfoArray[i].focusFieldName == info.focusFieldName ;
				extraCount++;
				break;
			}
		}
		ret = HTInfoArray;
		if (extraCount==0){
			newSize = parseInt(HTInfoArray.length)+1;
			ret = new Array(newSize);
			ret[HTInfoArray.length] = info;
			for (i=0;i<HTInfoArray.length;i++){
				ret[i] = HTInfoArray[i];
			}
		}
	}
	return (ret);
}
function getInfo(id){
	ret = null;
	if (id == "default" || id == null){
		id = "hatsportletid" ;
	}
	count = 0;
	if (HTInfoArray!=null){
		for (i=0;i<HTInfoArray.length;i++){
			if (HTInfoArray[i].hatsportletid == id){
				ret = HTInfoArray[i];
				count++;
				break;
			}
		}
	}
	if (count==0){
		ret = new Info(null,false,null,id);
		HTInfoArray = addInfo(ret);
	}

	return (ret);
}

function getID(){
	var id = activeID;
	if (id == "default" || id == null){
		id = "hatsportletid" ;
	}

	return (id);
}