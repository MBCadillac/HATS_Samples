//Licensed Materials - Property of IBM
//
// Copyright IBM Corp. 2011  All Rights Reserved.

//.============================================================================
//.Functions:  Functions for HATS Dojo EnhancedGridWidget
//.============================================================================













var COLUMN_NAME_PREFIX = "col";
var escapeSpace = true;	    		
function getTableHeaderCells(jsonData){
	var dataRowCount = (jsonData.value.tableCellComponentElements==null)?0:(jsonData.value.tableCellComponentElements.length);
	var colCount = 0;
	var headerRowCount = 0;
	var headerCells = new Array();
	var maxColCount = getMaxColumnCount(jsonData);  
	if(!isNoHeader(jsonData)){  
		headerRowCount = jsonData.value.header.value.tableCellComponentElements.length;
		for(var i=0; i < headerRowCount ; i++){
			if(jsonData.value.header.value.tableCellComponentElements[i]!=null){
				if(colCount==0) colCount = jsonData.value.header.value.tableCellComponentElements[i].tableCellComponentElements.length;
				headerCells.push(new Array(maxColCount));  
				for(var j=0; j < colCount ; j++){
					headerCells[headerCells.length-1][j] = jsonData.value.header.value.tableCellComponentElements[i].tableCellComponentElements[j];
				}
			}
		}
	}else{
		for(var i=0; i < dataRowCount ; i++){
			if(jsonData.value.tableCellComponentElements[i].tableCellComponentElements!=null){
				if(colCount==0){
					colCount = jsonData.value.tableCellComponentElements[i].tableCellComponentElements.length;
					headerCells.push(new Array(colCount));
					for(var j=0; j < colCount ; j++){	                
						headerCells[0][j] = jsonData.value.tableCellComponentElements[i].tableCellComponentElements[j];
					}
					break;
				}
			}
		}   	       	   
	}                  
	return headerCells;
}

function getTableDataCells(jsonData){
	var dataRowCount = (jsonData.value.tableCellComponentElements==null)?0:(jsonData.value.tableCellComponentElements.length);               
	var colCount = 0;                                     
	var dataCells = new Array();            
	for(var i=0; i < dataRowCount ; i++){
		if(jsonData.value.tableCellComponentElements[i].tableCellComponentElements!=null){
			colCount = jsonData.value.tableCellComponentElements[i].tableCellComponentElements.length;
			dataCells.push(new Array(colCount));
			for(var j=0; j < colCount ; j++){
				dataCells[dataCells.length-1][j] = jsonData.value.tableCellComponentElements[i].tableCellComponentElements[j];	       
			}
		}
	}                    
	return dataCells;
}          
	
function getTableHeaderDefinition(headerRows, dataCells, isEmptyHeader, headerColCount){  	
	var struStr = "var tableLayout = [";
	var columnFormatter = function (value, rowIndex) {return renderCell(dataCells, value, rowIndex);};
	var fieldDef = new Array(headerColCount);
	var nameDef = new Array(headerColCount);
	var widthDef = new Array(headerColCount);
	for(var i=0; i < headerRows.length ; i++){
		for(var j=0; j < headerColCount ; j++){
			if(j<headerColCount){
				if(nameDef[j]==null) nameDef[j] = "";
				if(!isEmptyHeader) nameDef[j] = nameDef[j] + getCellText(headerRows[i][j]) + " ";
			}                   
			if(i==headerRows.length-1){                      
				widthDef[j] = getCellLength(headerRows[i][j]);
				fieldDef[j] = COLUMN_NAME_PREFIX + j;                         
			}
		}
	}
	for(var i=0; i < headerColCount ; i++){
		struStr = struStr + '{ field:"' + fieldDef[i] + '",name:"'+ nameDef[i] + '",width:'+ widthDef[i] + ",formatter:columnFormatter}" + ((i==headerColCount-1)?"":",");
	}                                            
	struStr = struStr + "];";
	eval(struStr);
	return tableLayout;
}

function getTableDataDefinition(dataCells, headerColCount){	  
	if(dataCells==null || dataCells.length==0){
		eval("var storeItems = { items: [{}] }");
		return storeItems;
	}
	var storeDataStr = "var storeItems = { items: [";
	var dataColCount = dataCells[dataCells.length-1].length;
	for(var i=0; i < dataCells.length ; i++){
		storeDataStr = storeDataStr + "{";
		
		for(var j=0; j < headerColCount ; j++){  
			if(headerColCount>dataColCount){				
				storeDataStr = storeDataStr + COLUMN_NAME_PREFIX + j +':"' + " " + "_" + i + "_" + j +'"'+ ((j==headerColCount-1)?"":",");
			}else{
				storeDataStr = storeDataStr + COLUMN_NAME_PREFIX + j +':"' + getCellText(dataCells[i][j]) + "_" + i + "_" + j +'"'+ ((j==headerColCount-1)?"":",");	
			}
		}		
						
		storeDataStr = storeDataStr + "}"+ ((i==dataCells.length-1)?"":",");
	}
	storeDataStr = storeDataStr + "] }";
	eval(storeDataStr);
	return storeItems;
}

function getRowLength(dataCells){
	var rowLen = 0;
	if(dataCells.length==0 || dataCells[0]==null) return rowLen;
	var dataColCount = dataCells[0].length;
	for(var j=0; j < dataColCount ; j++){
		rowLen = rowLen + getCellLength(dataCells[0][j]);
	}
	return rowLen;
}                         

function getCellText(cell){
	var cellText = "";
	if(cell==null || cell.value.fieldComponentElements==null) return cellText;   
	var fieldsCount = cell.value.fieldComponentElements.length;
	for(var i=0; i < fieldsCount ; i++){
		var fieldElement = cell.value.fieldComponentElements[i].value;
		if(fieldElement==null) continue;
		
		if(!fieldElement.isHidden) cellText = cellText + fieldElement.text.replace(/"/g, "\\\"");
	}
	return cellText;
}  



function getCellLength(cell){
	if(cell==null || cell.value.fieldComponentElements==null){
		return 0;
	}else{		
		return cell.value.length+1;
	}
}


function renderCell(dataCells, value, rowIndex) {    
	var splitValues = value.split("_");
	var row = splitValues[splitValues.length-2];
	var column = splitValues[splitValues.length-1];
	var cellDiv = dojo.create("div");
	var cell = dataCells[row][column];
	if(cell.value.fieldComponentElements==null) return cellDiv;
	var fieldsCount = cell.value.fieldComponentElements.length;
	for(var i=0; i < fieldsCount ; i++){
		var fieldElement = cell.value.fieldComponentElements[i].value;
		if(fieldElement==null) continue;
		var field = renderField(fieldElement);
		if(field!=null) cellDiv.appendChild(field);
	}
	return cellDiv.innerHTML;
}

function renderField(fieldElement) {               
	var field = null;
	if(fieldElement==null || fieldElement.isHidden) return field;
	
	var fieldText = (escapeSpace?convertSpace(fieldElement.text):fieldElement.text);
	field = dojo.create("label");
	field.innerHTML = fieldText;
	return field;
}            

function setComparatorMap(tableHeader, store) {
	store.comparatorMap = {};
	for(var i=0; i < tableHeader.length ; i++){
		store.comparatorMap[tableHeader[i].field] = sortColumn;
	}
}

function sortColumn(a,b) {
	var ret = 0;
	var sa = a.split("_");
	var ca = "";
	for(var i=0; i < sa.length-2 ; i++){
		ca = ca + sa[i] + ((i==sa.length-3)?"":"_");
	}    
	var sb = b.split("_");
	var cb = "";
	for(var i=0; i < sb.length-2 ; i++){
		cb = cb + sb[i] + ((i==sb.length-3)?"":"_");
	}
	if (ca > cb) ret = 1;
	if (ca < cb) ret = -1;
	return ret;
}

function isNoHeader(jsonData){
	if (jsonData && jsonData.value){
		return ((jsonData.value.header==null) || (jsonData.value.header.value==null) || (jsonData.value.header.value.tableCellComponentElements.length==0) || (jsonData.value.header.value.tableCellComponentElements[0].tableCellComponentElements.length==0));  
	} else {
		return true;
	}
}

function isNoData(jsonData){
	if (jsonData && jsonData.value){
		return (jsonData.value.tableCellComponentElements==null || jsonData.value.tableCellComponentElements.length ==0);
	} else {
		return true;
	}
}



function getMaxColumnCount(jsonData){
	var maxColumnCount = 0; 
	if(!isNoHeader(jsonData)){
		var headerRowCount = jsonData.value.header.value.tableCellComponentElements.length;
		for(var i=0; i < headerRowCount ; i++){
			if(jsonData.value.header.value.tableCellComponentElements[i]!=null){
				var colCount = jsonData.value.header.value.tableCellComponentElements[i].tableCellComponentElements.length;
				if(colCount>maxColumnCount) maxColumnCount = colCount;				
			}
		}
	}	
	var dataRowCount = (jsonData.value.tableCellComponentElements==null)?0:(jsonData.value.tableCellComponentElements.length);
	if(!isNoData(jsonData)){
		for(var i=0; i < dataRowCount ; i++){
			if(jsonData.value.tableCellComponentElements[i].tableCellComponentElements!=null){
				var colCount = jsonData.value.tableCellComponentElements[i].tableCellComponentElements.length;
				if(colCount>maxColumnCount) maxColumnCount = colCount;
				break;
			}
		}   
	}			                 
	return maxColumnCount;		
}




function calculateColumnCount(headerRows, dataCells){
	   var columnCount = 0;
	   var headerColCount = (headerRows.length>0?headerRows[headerRows.length-1].length:0);
	   var dataColCount = (dataCells.length>0?dataCells[0].length:0);
	   var columnCount = (headerColCount>dataColCount?headerColCount:dataColCount);
	   if(headerColCount>dataColCount){
			var adjColCount = 0;			
			for(var i=0; i < headerColCount-dataColCount ; i++){
				var headerText = "";
				for(var j=0; j < headerRows.length ; j++){
					headerText = headerText + getCellText(headerRows[j][headerColCount-i-1]);    
				}
				if(trimSpacesFromValue(headerText).length>0) break;
				adjColCount++;
			}	
			columnCount = columnCount - adjColCount;
	   }
	   return columnCount;		
}
