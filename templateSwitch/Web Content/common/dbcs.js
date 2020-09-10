//Licensed Materials - Property of IBM
//
// Copyright IBM Corp. 2010, 2014  All Rights Reserved.

//.============================================================================
//.Function:  DBCS unique functions
//.============================================================================



// Checks whether a character is a DBCS character or not
function isDBCSChar(unichar, isDBCSSession, isDBCSEuro, CodePage)
{
    if (!isDBCSSession) return false;
    if (useAccentedCharacters && ('\u0080' <= unichar) && (unichar <= '\u00FF')) return false;
    if (unichar == '\u20a9') return false;
    if (unichar == '\u20ac') {
        if (isDBCSEuro) return true;
        else return false;
    }
    if((unichar == '\u00a6') && (CodePage == 1390 || CodePage == 1399)) return true;
    if ('\u0080' <= unichar && unichar <= '\u00A1'
        || '\u00A4' == unichar
        || '\u00A7' <= unichar && unichar <= '\u00AB'
        || '\u00AD' <= unichar && unichar <= '\u00AE'
        || '\u00B0' <= unichar && unichar <= '\u04FF'
        || '\u0600' <= unichar && unichar <= '\u06FF'
        || '\u0F00' <= unichar && unichar <= '\u0FFF'
        || '\u1100' <= unichar && unichar <= '\u11FF'
        || '\u1800' <= unichar && unichar <= '\u18FF'
        || '\u1E00' <= unichar && unichar <= '\u27BF'
        || '\u2900' <= unichar && unichar <= '\u29FF'
        || '\u2E80' <= unichar && unichar <= '\u2EF3'
        || '\u2ff0' <= unichar && unichar <= '\u2ffb'
        || '\u3000' <= unichar && unichar <= '\u33FF'
        || '\u3400' <= unichar && unichar <= '\u4DFF'
        || '\u4E00' <= unichar && unichar <= '\u9FA5'
        || '\uA000' <= unichar && unichar <= '\uA4FF'
        || '\uAC00' <= unichar && unichar <= '\uD7A3'
        || '\uD800' <= unichar && unichar <= '\uDFFF' 
        || '\uE000' <= unichar && unichar <= '\uF86F'
        || '\uF900' <= unichar && unichar <= '\uFB4F'
        || '\uFB50' <= unichar && unichar <= '\uFDFF'
        || '\uFE20' <= unichar && unichar <= '\uFE6F'
        || '\uFE70' <= unichar && unichar <= '\uFEFF'
        || '\uFF00' <= unichar && unichar <= '\uFF60' 
        || '\uFFE0' <= unichar && unichar <= '\uFFE6'
        || '\uFFF0' <= unichar && unichar <= '\uFFFF') return true;

    return false;
}


/**
 *  DBCS Combination Characters for JIS2004 support
 */
var CombinationCharTable = [
//====HiByte===LowByte==
    ['\u00E6','\u0300'],
    ['\u0254','\u0300'],
    ['\u0254','\u0301'],
    ['\u0259','\u0300'],
    ['\u0259','\u0301'],
    ['\u025A','\u0300'],
    ['\u025A','\u0301'],
    ['\u028C','\u0300'],
    ['\u028C','\u0301'],
    ['\u02E5','\u02E9'],
    ['\u02E9','\u02E5'],
    ['\u304B','\u309A'],
    ['\u304D','\u309A'],
    ['\u304F','\u309A'],
    ['\u3051','\u309A'],
    ['\u3053','\u309A'],
    ['\u30AB','\u309A'],
    ['\u30AD','\u309A'],
    ['\u30AF','\u309A'],
    ['\u30B1','\u309A'],
    ['\u30B3','\u309A'],
    ['\u30BB','\u309A'],
    ['\u30C4','\u309A'],
    ['\u30C8','\u309A'],
    ['\u31F7','\u309A']
];

function isHighSurrogate(unichar)
{
    if( '\uD800' <= unichar && unichar <= '\uDBFF')
        return true;

    //Check if the combination characters
    for( var i=0; i<CombinationCharTable.length; i++ ) {
        if( unichar == CombinationCharTable[i][0] )
            return true;
    }
    return false;
}

function isLowSurrogate(unichar)
{
    if( '\uDC00' <= unichar && unichar <= '\uDFFF')
        return true;

    //Check if the combination characters
    for( var i=0; i<CombinationCharTable.length; i++ ) {
        if( unichar == CombinationCharTable[i][1] )
            return true;
    }
    return false;
}

function isSurrogate(highchar, lowchar)
{
    if( '\uD800' <= highchar && highchar <= '\uDBFF' && '\uDC00' <= lowchar && lowchar <= '\uDFFF')
        return true;

    //Check if the combination characters
    for( var i=0; i<CombinationCharTable.length; i++ ) {
        if( highchar == CombinationCharTable[i][0] && lowchar == CombinationCharTable[i][1])
            return true;
    }
    return false;
}




function addTextInputHandlingForChrome(element, func) {    
    if(window.isDijit && isDijit(element)){
        var djt = getDijit(element);
        if (djt && djt.domNode && djt.domNode.JSONData && djt.domNode.JSONData.value && djt.domNode.JSONData.value.hsrAttributes){
            var djtAtts = djt.domNode.JSONData.value.hsrAttributes;
            if (djtAtts && (getDijitAttribute(djt, "handleTextInput")==null)){
                var uInput = djt.textbox;		
                uInput.addEventListener("textInput", func, false);
                setDijitAttribute(djt, "handleTextInput", "1");
            }
        }			
     }else{
        var handleTextInput = element.getAttribute("handleTextInput");
        if(handleTextInput==null){
            element.addEventListener("textInput", func, false);
            element.setAttribute("handleTextInput","1");
        }
    }            
}


function allowDBCSOnly3270(event) {
    allowGField(event);
}

function allowDBCSPure(event) {
    allowGField(event);
}

function allowDBCSOnly3270ForIEMobile(inputbox) {
    allowGFieldForIEMobile(inputbox);
}

function allowDBCSPureForIEMobile(inputbox) {
    allowGFieldForIEMobile(inputbox);
}

// Allows only DBCS character event
function allowGField(event)
{
    event = (event) ? event : ((window.event) ? window.event : "");
    var code = event.keyCode ? event.keyCode : event.which;
    var element = (isIE) ? event.srcElement : event.target; 
    var iname = element.name;                               
    var ipool = iname.split("_");                           
    var ipos = parseInt(ipool[1]);                          
    var ilen = parseInt(ipool[2]);                          

    if(enableAutoConvertSBCStoDBCS && isIE && event.type == "keypress") {
        if(code == 32) {
            event.keyCode = 0x3000;
            event.returnValue = true;
        } else if(code >= 33 && code <=126) {
            event.keyCode = 65281 + (code - 33);
            event.returnValue = true;
            return;
        }
    }

    
    if (isChrome && enableDBCSSession){
       addTextInputHandlingForChrome(element, allowGField);
    }
    

    var ck = function(code) {
        if (isDBCSChar(String.fromCharCode(code), enableDBCSSession, enableDBCSEuro, CodePage)) return true;
        return false;
    };
    contentCheck(event, ck);
    if(isIE && enableDBCSSession && element.getAttribute("eliminateMaxlengthInIdeographicFields") == "true") {            
      if(autoAdvance && ((event.type == "keyup" && !isIMEstate) || (event.type == "keyup" && isIMEstate && code == 13)) && getCurrentPosition() == element.value.length) {   
            dataLengthCheckingForDBCSPure(element,true);                                                                  
        }                                                                                                                 
        else {                                                                                                            
            if((event.type == "keydown" && code == 9) || ((event.type == "keyup" && !isIMEstate) || (event.type == "keyup" && isIMEstate && code == 13)) || event.type == "blur") {/*$IC59165$*/ 
                var a = " "+element.onkeypress;                                                                           
                if(a.indexOf("allowDBCSOnly5250")!=-1) //J field without SOSI                                             
                    dataLengthCheckingForDBCSOnly(element,false);                                                         
                else                                                                                                      
                    dataLengthCheckingForDBCSPure(element,false);                                                         
             }                                                                                                            
         }                                                                                                                
    }                                                                                                                     
    
    else if((event.type == "keydown" && (code == 13 || code == 19 || code == 27 || code == 33 || code == 34 || (code > 111 && code < 124)))         
         || (event.type == "keyup" && code == 13) || event.type == "click" || event.type == "blur" 
         || (isChrome && isIMEstate && enableDBCSSession && event.type == "textInput")) {  
        var isWithinInputSize = false;
        var isAlmostWithinInputSize = false;
        var value = element.value;
        var tempValue = element.value;
        var i = value.length - 1;
        
        var a = " "+element.onkeypress;
        if(a.indexOf("allowDBCSOnly5250")!=-1) {//J field without SOSI
            if(countDataLengthForDBCS(value) > ilen - 2) {
                while(isWithinInputSize == false && i > -1) {
                    if (isAlmostWithinInputSize == true) {
                        isWithinInputSize = true;
                        break;
                    }
                    //if last character is surrogate character, remove high and low character together
                    if((CodePage == 1390 || CodePage == 1399) && isSurrogate(value.substr(value.length-2,1), value.substr(value.length-1,1))) {  
                        i--;
                        value = value.substr(0, i);
                    } else {
                        value = value.substr(0, i);
                    }
                    if (countDataLengthForDBCS(value) <= ilen - 2) {
                        isAlmostWithinInputSize = true;
                    }
                    i--;
                }
            }
        } else { 
            if(countDataLengthForDBCS(value) > ilen) {
                while(isWithinInputSize == false && i > -1) {
                    if (isAlmostWithinInputSize == true) {
                        isWithinInputSize = true;
                        break;
                    }
                    //if last character is surrogate character, remove high and low character together
                    if(isSurrogate(value.substr(value.length-2,1), value.substr(value.length-1,1))) {
                        i--;
                        value = value.substr(0, i);
                    } else {
                        value = value.substr(0, i);
                    }
                    if (countDataLengthForDBCS(value) <= ilen) {
                        isAlmostWithinInputSize = true;
                    }
                    i--;
                }
            }
        }
        if(tempValue != value){
            element.value = value;
            if(isChrome){                 
            	event.preventDefault();   
            }                             
        }
    }
    
}

// Allows only DBCS character event for IE Mobile
function allowGFieldForIEMobile(inputbox)
{

    if(enableAutoConvertSBCStoDBCS) {
        var content = inputbox.value;
        var data = "";
        for(var a = 0; a < content.length; a++) {
            var code = content.charCodeAt(a);
            if(code == 32) {
                code = 0x3000;
            }
            else if(code >= 33 && code <=126) {
                code = 65281 + (code - 33);
            }
            data += String.fromCharCode(code);
        }
        inputbox.value = data;
    }

    var ck = function(code) {
        if (isDBCSChar(String.fromCharCode(code), enableDBCSSession, enableDBCSEuro, CodePage)) return true;
        return false;
    };
    contentCheckForIEMobile(inputbox, ck);
}

function allowDBCSOnly5250(event) {
    allowJField(event);
}

function allowDBCSOnly5250ForIEMobile(inputbox) {
    allowJFieldForIEMobile(inputbox);
}

// Allows only DBCS character event
function allowJField(event)
{
    if(showUnProtectedSosiAsSpace && event.type != "keypress") { 
        event = (event) ? event : ((window.event) ? window.event : "");
            var code = event.keyCode ? event.keyCode : event.which;
        var element = (isIE) ? event.srcElement : event.target; 
        var value = element.value;                              
        var iname = element.name;                               
        var ipool = iname.split("_");                           
        var ipos = parseInt(ipool[1]);                          
        var ilen = parseInt(ipool[2]);                          
        
        
        if (isChrome && enableDBCSSession){
           addTextInputHandlingForChrome(element, allowJField);
        }
        

            
        var verifyText = function(inStr, ck) {
            var outStr = "";
            for (var i=0; i< inStr.length; i++)
            {
              if (ck(inStr.charCodeAt(i))) outStr += inStr.charAt(i);
              else continue; 
            }
            return outStr;
        };

        
        var removeSpaces = function(inStr) {
          var outStr = "";
          for (var i=0; i< inStr.length; i++) {
            if (inStr.charCodeAt(i) != 32) outStr += inStr.charAt(i);
          }
          return outStr;
        };

        var ck = function(code) {
            if (isDBCSChar(String.fromCharCode(code), enableDBCSSession, enableDBCSEuro, CodePage)) return true;
            return false;
        };

        if(event.type == "paste" || event.type == "drop" || (event.type == "focus" && exceedString != null)) {  
            
            if (!isIE || MAC) return;
            
            var caretPos = document.selection.createRange().duplicate();
            var selectText = document.selection.createRange().text;
            var t = caretPos.parentElement();
            var beginField = t.createTextRange();
            caretPos.collapse();
            beginField.collapse();
            var slen = t.value.length;
            var cPos = 0;
            var newPos = 0; 
            for (; cPos <= slen ; cPos++ ) {
                qa =caretPos.getBoundingClientRect();
                qb = beginField.getBoundingClientRect();
                if ( qa.left == qb.left ) break;
                caretPos.move("character",-1);
            }
            
            if(t.value.length > 0) {
                if(t.value.charCodeAt(0) == 32) { 
                    if(cPos > 0) cPos--;
                    t.value = t.value.substring(1, t.value.length);
                }
                if(t.value.charCodeAt(t.value.length-1) == 32) { 
                    if(cPos > t.value.length-1) cPos--;
                    t.value = t.value.substring(0, t.value.length-1);
                }
            }
            slen = t.value.length;

            
            var pText = "";
            if(event.type == "paste"){
                var data="";
                try{
                    if(clipboardData){
                        data=clipboardData.getData("Text");
                     }
                     if(data){
                         pText = verifyText(removeSpaces(data),ck);
                     }
                 }catch(e){}                
            }
            else if (event.type == "drop"){
                var data="";
                try{
                    if(event.dataTransfer){
                        data=event.dataTransfer.getData("Text");
                    }
                    if(data){
                        pText = verifyText(removeSpaces(data),ck);
                    }
                }catch(e){}
            }
            else if (event.type == "focus" && exceedString != null) {                 
                pText = verifyText(removeSpaces(exceedString),ck);                    
                exceedString = null;                                                  
            }                                                                         
            
            if(pText.length > 0 && selectText == "") {
                if(isOverWriteMode()) {
                    
                    if(cPos + pText.length > slen) {
                        t.value = t.value.substring(0,cPos) + pText;
                    } else {
                        t.value = t.value.substring(0,cPos) + pText + t.value.substring(cPos + pText.length ,slen);
                        newPos = cPos+pText.length; 
                    }
                } else {
                    
                    if(t.getAttribute("eliminateMaxlengthInIdeographicFields") == "true") {                                               
                        var iname = t.name;                                                                                               
                        var pool = iname.split("_");                                                                                      
                        var inputSize = parseInt(pool[2]);                                                                                
                        t.value = t.value.substring(0,cPos) + pText.substring(0,(inputSize/2) - 2 - slen) + t.value.substring(cPos,slen); 
                        newPos = cPos+pText.substring(0,(inputSize/2) - 2 - slen).length;                                                 
                    }                                                                                                                     
                    else {                                                                                                                
                        if(t.maxLength != -1 && t.maxLength != ChromeDefaultMaxLength)  
                            t.value = t.value.substring(0,cPos) + pText.substring(0, t.maxLength - 2 - slen) + t.value.substring(cPos,slen);
                        else
                            t.value = t.value.substring(0,cPos) + pText.substring(0, (ilen/2) - 2 - slen) + t.value.substring(cPos,slen);
                    }
                }
            }
            else if(pText.length > 0 && selectText != ""){
                 t.value = t.value.substring(0,cPos) + pText + t.value.substring(cPos + selectText.length ,slen);
            }
            
            t.value = " " + t.value;
            if(t.maxLength != -1 && t.maxLength != ChromeDefaultMaxLength) {   
                if(t.value.length > t.maxLength - 2) {
                    t.value = t.value.substring(0, t.maxLength - 1) + " ";
                }
            }
            else {
                if(t.value.length > (ilen/2+1) - 2) {
                    t.value = t.value.substring(0, (ilen/2+1) - 1) + " ";
                }
            }
            
            if(newPos != 0) {                    
                var range = t.createTextRange(); 
                range.move('character',newPos+1);
                range.select();                  
                newPos = 0                       
            }                                    
            updateCursorPosition(false,null);    
            event.returnValue = false;
            return;
        }else if(isIE && enableDBCSSession && element.getAttribute("eliminateMaxlengthInIdeographicFields") == "true") {
            if(autoAdvance && showUnProtectedSosiAsSpace && ((event.type == "keyup" && !isIMEstate) || (event.type == "keyup" && isIMEstate && code == 13)) && getCurrentPosition() == element.value.length) {   
                var nText = removeSpaces(element.value);                                                                      
                nText = verifyText(nText,ck);                                                                                 
                dataLengthCheckingForDBCSOnly(element, nText, true);                                                          
            }                                                                                                                 
            else {                                                                                                            
                if((event.type == "keydown" && code == 9) || ((event.type == "keyup" && !isIMEstate) || (event.type == "keyup" && isIMEstate && code == 13)) || event.type == "blur") {   
                    var nText = removeSpaces(element.value);                                                                  
                    nText = verifyText(nText,ck);                                                                             
                    dataLengthCheckingForDBCSOnly(element, nText, false);                                                     
                }                                                                                                             
            }                                                                                                                 
        } else if(enableDBCSSession && ((event.type == "keydown" && (code == 13 || code == 19 || code == 27 || code == 33 || code == 34 || (code > 111 && code < 124))) 
                                         || (event.type == "keyup" && code == 13)  
                                         || (isChrome && isIMEstate && enableDBCSSession && event.type == "textInput")  
                                         || event.type == "click" || event.type == "blur")) { 

            var t = (isIE) ? event.srcElement : event.target;

            var nText = removeSpaces(t.value); 
            nText = verifyText(nText,ck); 
            
            if(CodePage == 1390 || CodePage == 1399) {
                var isWithinInputSize = false;
                var isAlmostWithinInputSize = false;
                var i = nText.length - 1;
                if(countDataLengthForDBCS(nText) > ilen - 2) {
                    while(isWithinInputSize == false && i > -1) {
                        if (isAlmostWithinInputSize == true) {
                            isWithinInputSize = true;
                            break;
                        }
                            //if last character is surrogate character, remove high and low character together
                        if(isSurrogate(nText.substr(value.length-2,1), nText.substr(value.length-1,1))) {
                            i--;
                            nText = nText.substr(0, i);
                        } else {
                                nText = nText.substr(0, i);
                        }
                        if (countDataLengthForDBCS(nText) <= ilen - 2) {
                            isAlmostWithinInputSize = true;
                        }
                            i--;
                    }
                }
            }
            else { 
                if(t.maxLength != -1 && t.maxLength != ChromeDefaultMaxLength) {    
                    if(nText.length > t.maxLength - 2) { 
                        nText = nText.substring(0, t.maxLength - 2);
                    }
                }
                else {
                    if(nText.length > (ilen/2+1) - 2) { 
                        nText = nText.substring(0, (ilen/2+1) - 2);
                    }                    
                }
            }                

            var isValid = false; 
            if(nText == t.value) isValid = true; 

            nText = " " + nText;
            if(nText == t.value) isValid = true; 

            if(t.maxLength != -1 && t.maxLength != ChromeDefaultMaxLength) {     
                if(nText.length == t.maxLength - 1) { 
                    nText = nText + " ";
                    if(nText == t.value) isValid = true;
                }
            }
            else {
                if(nText.length == (ilen/2+1) - 1) { 
                    nText = nText + " ";
                    if(nText == t.value) isValid = true;
                }
            }            

            if(!isValid) {
                t.value = nText;
                if(isIE) {
                    event.returnValue = false;
                }
                else {
                    event.returnValue = false; 
                    event.preventDefault();
                }
            }
        }
    }
    else { 
       allowGField(event);
    }
}

// Allows only DBCS character event for IE Mobile
function allowJFieldForIEMobile(inputbox)
{
    if(showUnProtectedSosiAsSpace) {
        
        var verifyText = function(inStr, ck) {
            var outStr = "";
            for (var i=0; i< inStr.length; i++)
            {
              if (ck(inStr.charCodeAt(i))) outStr += inStr.charAt(i);
              else break;
            }
            return outStr;
        };

        
        var removeSpaces = function(inStr) {
          var outStr = "";
          for (var i=0; i< inStr.length; i++) {
            if (inStr.charCodeAt(i) != 32) outStr += inStr.charAt(i);
          }
          return outStr;
        };

        var ck = function(code) {
            if (isDBCSChar(String.fromCharCode(code), enableDBCSSession, enableDBCSEuro, CodePage)) return true;
            return false;
        };

        if(enableAutoConvertSBCStoDBCS) {
            var content = inputbox.value;
            var data = "";
            for(var a = 0; a < content.length; a++) {
                var code = content.charCodeAt(a);
                if(code == 32) {
                    code = 0x3000;
                }
                else if(code >= 33 && code <=126) {
                    code = 65281 + (code - 33);
                }
                data += String.fromCharCode(code);
            }
            inputbox.value = data;
        }

        var t = inputbox;
        var nText = removeSpaces(t.value); 
        nText = verifyText(nText,ck); 
        if(nText.length > t.maxLength - 2) { 
            nText = nText.substring(0, t.maxLength - 2);
        }

        var isValid = false; 
        if(nText == t.value) isValid = true; 

        nText = " " + nText;
        if(nText == t.value) isValid = true; 

        if(nText.length == t.maxLength - 1) { 
            nText = nText + " ";
            if(nText == t.value) isValid = true;
        }

        if(!isValid) {
            t.value = nText;
        }
    }
    else {
        allowGFieldForIEMobile(inputbox);
    }
}

function allowAlphaNumericShift(event) {
    event = (event) ? event : ((window.event) ? window.event : ""); 
    var code = event.keyCode ? event.keyCode : event.which;         
    var element = (isIE) ? event.srcElement : event.target;         
    var iname = element.name;                                       
    var ipool = iname.split("_");                                   
    var ipos = parseInt(ipool[1]);                                  
    var ilen = parseInt(ipool[2]);                                  

        var ck = function(code) {
        if (isDBCSChar(String.fromCharCode(code), enableDBCSSession, enableDBCSEuro, CodePage)) return false;
                return true;
    };
    contentCheck(event, ck);
    if(isIE && enableDBCSSession && element.getAttribute("eliminateMaxlengthInIdeographicFields") == "true") {            
        if(autoAdvance && !isIMEstate && code != 39 && getCurrentPosition() == element.value.length && (hatsForm != null && hatsForm.style.visibility != 'hidden')) {  
            if(element.value.length == ilen && event.type == "keyup") {                                                   
                nextInputField(element, ipos, ilen);                                                                      
            }                                                                                                             
            else if(element.value.length > ilen) {                                                                        
                if( event.type != "paste" )                                                                               
                    exceedString = element.value.substring(ilen);                                                         
                element.value = element.value.substring(0,ilen);                                                          
                nextInputField(element, ipos, ilen);                                                                      
            }                                                                                                             
        }                                                                                                                 
        else {                                                                                                            
            if((event.type == "keydown" && code == 9) || (event.type == "keyup" && !isIMEstate) || event.type == "blur") {
                if(element.value.length > ilen) {                                                                         
                    element.value = element.value.substring(0,ilen);                                                      
                }                                                                                                         
            }                                                                                                             
        }                                                                                                                 
    }                                                                                                                     
}

function allowAlphaNumericShiftForIEMobile(inputbox) {
        var ck = function(code) {
        if (isDBCSChar(String.fromCharCode(code), enableDBCSSession, enableDBCSEuro, CodePage)) return false;
                return true;
    };
    contentCheckForIEMobile(inputbox, ck);
}

function allowKatakanaShift(event) {
    allowAlphaNumericShift(event);
}

function allowKatakanaShiftForIEMobile(inputbox) {
    allowAlphaNumericShiftForIEMobile(inputbox);
}

// Allows only SBCS character event
function allowSBCSOnly(event) {}

function allowSBCSOnlyForIEMobile(inputbox) {}

function allowDBCSEither(event) {
    event = (event) ? event : ((window.event) ? window.event : "");
        var code = event.keyCode ? event.keyCode : event.which;
    var element = (isIE) ? event.srcElement : event.target;
    var isJFieldMode = element.getAttribute("jFieldMode");

    var ck = function (firstCharCode, element) { 
        if(isDBCSChar(String.fromCharCode(firstCharCode), enableDBCSSession, enableDBCSEuro, CodePage)) {
            if(isIE && enableDBCSSession && element.getAttribute("eliminateMaxlengthInIdeographicFields") == "true") { 
            //no thing to do                                                                                           
            } else if(CodePage == 1390 || CodePage == 1399 ) { 
                if(showUnProtectedSosiAsSpace) {
                    element.maxLength = element.size /2 + 1;
                } else {
                    element.maxLength = element.size /2 - 1;
                }
            } 
            element.style.imeMode = "active";
            allowJField(event);
            element.setAttribute("currentJFieldMode", "true");
        } else {
            element.maxLength = element.size;
            element.style.imeMode = "inactive";
            allowAlphaNumericShift(event);
            element.setAttribute("currentJFieldMode", "false");
        }
        return;
    };


    if(isJFieldMode == "true") { 
        element.setAttribute("currentJFieldMode", "true");
        allowJField(event);
        return;
    }

    if(element.value.length > 0 && !(element.value.length == 1 && showUnProtectedSosiAsSpace && element.value.charCodeAt(0) == 32)) { 
        var firstCharCode = element.value.charCodeAt(0);
        if(showUnProtectedSosiAsSpace && firstCharCode == 32 && element.value.length > 1) {
            firstCharCode = element.value.charCodeAt(1);
        }
        ck(firstCharCode, element);
    } else if(event.type == "paste" || event.type == "drop" || (event.type = "focus" && exceedString != null)) {  
        var pText = "";
        if(event.type == "paste"){
            var data="";
            try{
                if(clipboardData){
                    data=clipboardData.getData("Text");
                }
                if(data){
                    pText = data;
                }
            }catch(e){}
        }
        if(event.type == "drop"){
            var data="";
            try{
                if(event.dataTransfer){
                    data=event.dataTransfer.getData("Text");
                }
                if(data){
                    pText = data;
                }
            }catch(e){}
        }
        if(event.type == "focus" && exceedString != null){
            pText = exceedString;                         
            exceedString = null;                          
        }
        if(pText.length > 0) {
            var firstCharCode = pText.charCodeAt(0);
            if(showUnProtectedSosiAsSpace && firstCharCode == 32 && pText.length > 1) {
                firstCharCode = pText.charCodeAt(1);
            }
            ck(firstCharCode, element);
        }
    }
}

function allowDBCSEitherForIEMobile(inputbox) {
    var element = inputbox;
    var isJFieldMode = element.getAttribute("jFieldMode");

    var ck = function (firstCharCode, element) { 
        if(isDBCSChar(String.fromCharCode(firstCharCode), enableDBCSSession, enableDBCSEuro, CodePage)) {
            if(showUnProtectedSosiAsSpace) {
                element.maxLength = element.size /2 + 1;
            } else {
                element.maxLength = element.size /2 - 1;
            }
            element.style.imeMode = "active";
            allowJField(event);
            element.setAttribute("currentJFieldMode", "true");
        } else {
            element.maxLength = element.size;
            element.style.imeMode = "inactive";
            allowAlphaNumericShiftForIEMobile(element);
            element.setAttribute("currentJFieldMode", "false");
        }
        return;
    };


    if(isJFieldMode == "true") { 
        element.setAttribute("currentJFieldMode", "true");
        allowJFieldForIEMobile(element);
        return;
    }

    if(element.value.length > 0 && !(element.value.length == 1 && showUnProtectedSosiAsSpace && element.value.charCodeAt(0) == 32)) { 
        var firstCharCode = element.value.charCodeAt(0);
        if(showUnProtectedSosiAsSpace && firstCharCode == 32 && element.value.length > 1) {
            firstCharCode = element.value.charCodeAt(1);
        }
        ck(firstCharCode, element);
    }
}

function addPseudoSOSI(pseudoSO, pseudoSI, objValue) {
    var modifiedValue = "";
    var inputValue = new String(objValue);
    var inputValueLength = inputValue.length;
    if (inputValue != null) {
       for (var j=0; j<inputValueLength; j++) {
            var currentString = inputValue.substr(j,1);
            var nextCurrentString = inputValue.substr(j+1,1);
            if (parseInt(j+1) >= inputValueLength)
                nextCurrentString = null;
            // case 1 : if first character is DBCS, add pseudoSO
            if (isDBCSChar(currentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
               if (j == 0)
                   modifiedValue = modifiedValue + "" + pseudoSO + "" + currentString;
               if (parseInt(j+1) == inputValueLength) {
                   if (j == 0)
                      currentString = "";
                   modifiedValue = modifiedValue + "" + currentString;
               }
               if (j >=0 && parseInt(j+1) != inputValueLength) {
                   if (nextCurrentString != null && !isDBCSChar(nextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
                       if (j == 0)
                          currentString = "";
                       modifiedValue = modifiedValue + "" + currentString + pseudoSI;
                   } else {
                       if (j == 0)
                           currentString = "";
                       modifiedValue = modifiedValue + "" + currentString;
                   }
               }
            } else {
                 if (nextCurrentString != null && isDBCSChar(nextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
                     modifiedValue = modifiedValue + "" + currentString + "" + pseudoSO;
                 } else {
                     modifiedValue = modifiedValue + "" + currentString;
                 }
            }
        }
    }
    return modifiedValue;
}
function countDataLength(pseudoSO, pseudoSI, inputValue) {
    //pseudoSO, pseudoSI and SBCS have length 1
    //only DBCS has length 2
    var stringLength = 0;
    for (var i=0; i < inputValue.length; i++) {
        var currentString = inputValue.substr(i,1);
        if (currentString == pseudoSO || currentString == pseudoSI) {
            stringLength++;
        } else {
            if (isDBCSChar(currentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
                if(i+1 < inputValue.length && isSurrogate(currentString, inputValue.substr(i+1,1))) 
                    i++;                                                                            
                stringLength = stringLength + 2;
            } else {
                stringLength++;
            }
        }
    }
    return stringLength;
}

var autoAdvanceForMixedField = false; 
function dataLengthChecking(pseudoSO, pseudoSI, inputValue, obj) {
    var iname = obj.name;
    var pool = iname.split("_");
    var ipos =  parseInt(pool[1]); 
    var inputSize = parseInt(pool[2]);
    var modifiedValue = inputValue;

    var removePseudoSOSI = function(inStr) {                            
        var outStr = "";                                                
        for (var i=0; i< inStr.length; i++) {                           
            if (inStr.charCodeAt(i) != 30 && inStr.charCodeAt(i) != 31) 
                outStr += inStr.charAt(i);                              
        }                                                               
        return outStr;                                                  
    };                                                                  

    if (countDataLength(pseudoSO, pseudoSI, modifiedValue) > inputSize) {
        var isWithinInputSize = false;
        var isAlmostWithinInputSize = false;
        var i = modifiedValue.length - 1;
        while(isWithinInputSize == false && i > -1) {
            //remove pseudoSO and pseudoSI, if there is no DBCS within pseudoSO and pseudoSI
            if (isAlmostWithinInputSize == true) {
                if(modifiedValue.substr(modifiedValue.length-1,1) == pseudoSI &&
                    modifiedValue.substr(modifiedValue.length-2,1) == pseudoSO) {
                    modifiedValue = modifiedValue.substr(0,modifiedValue.length -2);
                }
                isWithinInputSize = true;
                if(autoAdvance && showUnProtectedSosiAsSpace && isIE && enableDBCSSession && obj.getAttribute("eliminateMaxlengthInIdeographicFields") == "true" && getCurrentPosition() == obj.value.length) { 
                    if(isSurrogate(inputValue.substr(i,1), inputValue.substr(i+1,1))){
                        exceedString = removePseudoSOSI(inputValue.substring(i));     
                    }else                                                             
                        exceedString = removePseudoSOSI(inputValue.substring(i+1));   
                }                                                                     
                break;
            }
            //if last character is surrogate character, remove high and low character together
            if(isSurrogate(modifiedValue.substr(modifiedValue.length-2,1), modifiedValue.substr(modifiedValue.length-1,1))) { 
                i--;                                                                                                          
                modifiedValue = inputValue.substr(0, i);                                                                      
            } else {                                                                                                          
                modifiedValue = inputValue.substr(0, i);
            }
            //add pseudoSI, if the last character is DBCS or pseudoSO
            if (isDBCSChar(modifiedValue.substr(modifiedValue.length-1,1), enableDBCSSession, enableDBCSEuro, CodePage) ||
                modifiedValue.substr(modifiedValue.length-1,1) == pseudoSO) {
                modifiedValue = modifiedValue + "" + pseudoSI;
            }
            if (countDataLength(pseudoSO, pseudoSI, modifiedValue) <= inputSize) {
                isAlmostWithinInputSize = true;
            }
            i--;
        }
    }
    
    else if(countDataLength(pseudoSO, pseudoSI, modifiedValue) == inputSize) {
        // If the last character at maxlength of the field is DBCS
        if(isDBCSChar(modifiedValue.substr(modifiedValue.length-1,1), enableDBCSSession, enableDBCSEuro, CodePage)) {        
            if(isSurrogate(modifiedValue.substr(modifiedValue.length-2,1), modifiedValue.substr(modifiedValue.length-1,1)))  
                //trim the last surrogate character
                modifiedValue = modifiedValue.substr(0,modifiedValue.length-2);                                              
            else                                                                                                             
                //trim the last double byte character
                modifiedValue = modifiedValue.substr(0,modifiedValue.length-1);                                              
            //if the new last character is SO, trim it
            if( modifiedValue.substr(modifiedValue.length-1,1)==pseudoSO)                                                    
                modifiedValue = modifiedValue.substr(0,modifiedValue.length-1);                                              
            //if the new last character is DBCS, add SI
            else if(isDBCSChar(modifiedValue.substr(modifiedValue.length-1,1), enableDBCSSession, enableDBCSEuro, CodePage)) 
                modifiedValue == modifiedValue + "" + pseudoSI;                                                              
        }                                                                                                                    
        // Count the new data length
        if(countDataLength(pseudoSO, pseudoSI, modifiedValue) == inputSize) {                                                
            if(autoAdvance && showUnProtectedSosiAsSpace && isIE && enableDBCSSession && obj.getAttribute("eliminateMaxlengthInIdeographicFields") == "true" && getCurrentPosition() == obj.value.length) { 
                autoAdvanceForMixedField = true;                                                                                                                                                            
            }                                                                                                                                                                                               
            else {                               
               autoAdvanceForMixedField = false; 
            }                                    
        }                                        
    }
    else {
        autoAdvanceForMixedField = false;
    }
    
    return modifiedValue;
}
function replacePseudoSOSI(pseudoSO, pseudoSI, inputValue) {
    var startPositionSO = inputValue.indexOf(pseudoSO);
    var startPositionSI = inputValue.indexOf(pseudoSI);
    var replaceString = "";
    if (showUnProtectedSosiAsSpace) {
        replaceString = " ";
    }
    while (startPositionSO != -1 || startPositionSI != -1) {
        inputValue = inputValue.replace(pseudoSO, replaceString);
        inputValue = inputValue.replace(pseudoSI, replaceString);
        startPositionSO = inputValue.indexOf(pseudoSO);
        startPositionSI = inputValue.indexOf(pseudoSI);
    }
    return inputValue;
}
function removeSpaceAsSOSI(modifiedValue) {
    if(modifiedValue==null) return;  
    var modifiedValue = modifiedValue;
    var temp = "";
    var modeSBCS = "SBCS";
    var modeDBCS = "DBCS";
    //mode character only SBCS or DBCS
    var modeCharacter = modeSBCS;
    var concatNextString = true;
    for (var i=0; i<modifiedValue.length;i++) {
        if (concatNextString == false) {
            concatNextString = true;
            continue;
        }
        var currentString = modifiedValue.substr(i,1);
        var nextCurrentString = modifiedValue.substr(i+1,1);
        var doubleNextCurrentString = modifiedValue.substr(i+2,1);
        var tripleNextCurrentString = modifiedValue.substr(i+3,1);
        var concatString = true;
        if (parseInt(i+1) >= modifiedValue.length)
            nextCurrentString = null;
        if (parseInt(i+2) >= modifiedValue.length)
            doubleNextCurrentString = null;
        if (parseInt(i+3) >= modifiedValue.length)
            tripleNextCurrentString = null;

        if (isDBCSChar(currentString, enableDBCSSession, enableDBCSEuro, CodePage))
            modeCharacter = modeDBCS;
        else
            modeCharacter = modeSBCS;
        if (currentString == " " && modeCharacter == modeSBCS) {
            if (nextCurrentString != null && isDBCSChar(nextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage))
                concatString = false;
        }
        if (modeCharacter == modeDBCS && nextCurrentString == " " &&  doubleNextCurrentString == null) {
            concatNextString = false;
        } else if (modeCharacter == modeDBCS && nextCurrentString == " " &&
            doubleNextCurrentString != null && doubleNextCurrentString != " " && !isDBCSChar(doubleNextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
            concatNextString = false;
        } else if (modeCharacter == modeDBCS && nextCurrentString == " " &&
            doubleNextCurrentString != null && isDBCSChar(doubleNextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
            currentString = currentString + " ";
            i++;
        } else if (modeCharacter == modeDBCS && nextCurrentString == " " &&
            doubleNextCurrentString == " " && tripleNextCurrentString != null &&
            isDBCSChar(tripleNextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
            currentString = currentString + "  ";
            i = i + 2;
        } else if (modeCharacter == modeDBCS && nextCurrentString == " " &&
            doubleNextCurrentString == " " && tripleNextCurrentString != null &&
            tripleNextCurrentString != " " &&
            !isDBCSChar(tripleNextCurrentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
            currentString = currentString + " ";
            i = i + 2;
        } else if (modeCharacter == modeDBCS && nextCurrentString == " " &&
            doubleNextCurrentString == " " && tripleNextCurrentString == " ") {
            currentString = currentString + " ";
            i = i + 2;
        }
        if (concatString)
            temp = temp.concat(currentString);
    }
    return temp;
}

function getCurrentPosition() {
    var caretPos = document.selection.createRange().duplicate();
    t = caretPos.parentElement();
    if (t.type!="text" && t.type!="password" && t.type!="textarea") return -1;
    var beginField = t.createTextRange();
    caretPos.collapse();
    beginField.collapse();
    var slen = t.value.length ;
    for ( pos = 0 ; pos <= slen ; pos++ )
    {
      qa =caretPos.getBoundingClientRect();
      qb = beginField.getBoundingClientRect();
      if ( qa.left == qb.left )
      {
        break;
      }
      caretPos.move("character",-1);
    }
    return pos;
}
function setCurrentPosition(cursorPosition) {
    var caretPos = document.selection.createRange();
    for ( pos = 0 ; pos < cursorPosition ; pos++ )
    {
      caretPos.move("character",1);
    }
    caretPos.select();
}
function allowDataLengthCheckingAlgorithm(event) {
    var code = event.keyCode ? event.keyCode : event.which;  
    var pseudoSO = '\u001F';
    var pseudoSI = '\u001E';
    var obj = (isIE) ? event.srcElement : event.target;
    var modifiedValue = obj.value;
    var tempModifiedValue = obj.value;
    var tempValue = null; 
    if(isIE){
        var cursorPosition = getCurrentPosition();
        if (event.type == "paste" || event.type == "drop" || (event.type == "focus" && exceedString != null)) { 
            var pasteValue = "";
            if (event.type == "paste"){
                var data="";
                try{
                    if(clipboardData){
                        data=clipboardData.getData("Text");
                    }
                    if(data){
                        pasteValue = data;
                    }
                }catch(e){}
            }
            if (event.type == "drop"){
                var data="";
                try{
                    if(event.dataTransfer){
                        data=event.dataTransfer.getData("Text");
                    }
                    if(data){
                        pasteValue = data;
                    }
                }catch(e){}
            }
            if (event.type == "focus" && exceedString != null) {
                pasteValue = exceedString;                    
                exceedString = null;                          
            }                                                 
            var beginString = "";
            var endString = "";
            if (parseInt(cursorPosition) > 0 && modifiedValue.length > 0) {
                beginString = modifiedValue.substr(0, cursorPosition);
            }
            if (overwritemodeenabled) {
                var endStringLength = parseInt(modifiedValue.length - cursorPosition + pasteValue.length);
                if (parseInt(endStringLength) >= 0) {
                    if(isSurrogate(modifiedValue.substr(parseInt(cursorPosition + pasteValue.length - 1),1),modifiedValue.substr(parseInt(cursorPosition + pasteValue.length),1))) 
                        endString = modifiedValue.substr(parseInt(cursorPosition + pasteValue.length - 1), endStringLength);                                                       
                    else                                                                                                                                                           
                        endString = modifiedValue.substr(parseInt(cursorPosition + pasteValue.length), endStringLength);
                }
            } else {
                endString = modifiedValue.substr(parseInt(cursorPosition), modifiedValue.length - cursorPosition);
            }
            if (pasteValue != null && pasteValue != "") {
                modifiedValue = beginString + "" + pasteValue + "" + endString;
                tempValue = beginString + "" + pasteValue; 
            }
            if(isIE) {
                      event.returnValue = false;
                  } else {
                event.preventDefault();
                  }
        }
    }
    if (showUnProtectedSosiAsSpace) {
        modifiedValue = removeSpaceAsSOSI(modifiedValue);
        if(tempValue != null) tempValue = removeSpaceAsSOSI(tempValue); 
    }
    modifiedValue = addPseudoSOSI(pseudoSO, pseudoSI, modifiedValue);
    modifiedValue = dataLengthChecking(pseudoSO, pseudoSI, modifiedValue, obj);
    modifiedValue = replacePseudoSOSI(pseudoSO, pseudoSI, modifiedValue);
    if(tempValue != null) tempValue = addPseudoSOSI(pseudoSO, pseudoSI, tempValue);           
    if(tempValue != null) tempValue = dataLengthChecking(pseudoSO, pseudoSI, tempValue, obj); 
    if(tempValue != null) tempValue = replacePseudoSOSI(pseudoSO, pseudoSI, tempValue);       
    
    var currPos = mycaret(obj);                                 
    if(isChrome && isIMEstate && event.type == "textInput"){    
       currPos = obj.selectionEnd;                              
    }                                                           
        
    if (tempModifiedValue != modifiedValue) {
    	
    	var beginValue = null;                                                      
    	if(obj.value.length==currPos){                                              
    		beginValue = obj.value;                                             
    	}else if(obj.value.length>currPos){                                         
    		beginValue = obj.value.substring(0, currPos);                       
    	}    	                                                                    
    	if(beginValue!=null){                                                       
        	var newVal = beginValue;        	                            
        	if(showUnProtectedSosiAsSpace) newVal = removeSpaceAsSOSI(newVal);  
        	newVal = addPseudoSOSI(pseudoSO, pseudoSI, newVal);    	            
        	newVal = dataLengthChecking(pseudoSO, pseudoSI, newVal, obj);       
        	newVal = replacePseudoSOSI(pseudoSO, pseudoSI, newVal);             
            if(beginValue!=newVal.substring(0, currPos)){                           
            	currPos = newVal.length;                                            
            }                                                                       
    	}      	                                                                        	
    	
    	if((event.type == "keyup" && code == 13) || (event.type == "keydown" && code == 13) || (isChrome && isIMEstate && event.type == "textInput")){   
    	   modifiedValue = rightTrimFromString(modifiedValue);                                                                                           
    	}                                                                                                                                                
    	
        obj.value = modifiedValue;
        
        if(isIE && event.type != "blur"){                        
           var range = obj.createTextRange();                  
           range.move('character',currPos);                    
           range.select();                                     
        }else if(typeof obj.selectionStart != 'undefined') {           
           if(!(isChrome && event.type == "blur")){            
              obj.selectionStart = currPos;                    
              obj.selectionEnd = currPos;                      
           }                                                           
        }                                                              
        
        if(isIE && tempValue != null) {               
            var range = obj.createTextRange();        
            range.move('character',tempValue.length); 
            range.select();                           
            updateCursorPosition(false,null);         
        }                                             
    }
    
    if(isChrome && isIMEstate && event.type == "textInput"){   
       obj.selectionStart = currPos;                           
       obj.selectionEnd = currPos;                             
    }                                                              
    
    if((exceedString != null && event.type == "keyup" && !isIMEstate && (hatsForm != null && hatsForm.style.visibility != 'hidden')) ||    
       (autoAdvanceForMixedField && event.type == "keyup" && !isIMEstate && (hatsForm != null && hatsForm.style.visibility != 'hidden'))) {
        var iname = obj.name;                 
        var pool = iname.split("_");          
        var ipos = parseInt(pool[1]);         
        var inputSize = parseInt(pool[2]);    
        nextInputField(obj, ipos, inputSize); 
    }                                         
}

function allowDataLengthChecking(event) {
    var code = event.keyCode ? event.keyCode : event.which;
    var obj = (isIE) ? event.srcElement : event.target; 

    
    if (isChrome && enableDBCSSession){                               
       addTextInputHandlingForChrome(obj, allowDataLengthChecking);   
    }                                                                 

    if (autoAdvance && showUnProtectedSosiAsSpace && isIE && enableDBCSSession && obj.getAttribute("eliminateMaxlengthInIdeographicFields") == "true" && (event.type == "keyup" && !isIMEstate) && getCurrentPosition() == obj.value.length && (hatsForm != null && hatsForm.style.visibility != 'hidden')) { 
        allowDataLengthCheckingAlgorithm(event);                                                                                                                                                                                                                                                              
    }                                                           //enter      pause/break    escape         page up       page down       F1-F12
    else if(enableDBCSSession && ((event.type == "keydown" && (code == 13 || code == 19 || code == 27 || code == 33 || code == 34 || (code > 111 && code < 124)))  
                                         || (event.type == "keyup" && code == 13)
                                         || event.type == "paste" || event.type == "click" || event.type == "blur" || event.type == "drop")) {
        allowDataLengthCheckingAlgorithm(event);
    } else if (code == 13 || event.type == "paste" || event.type == "blur" || event.type == "click" || event.type == "drop") {
        allowDataLengthCheckingAlgorithm(event);
    } else if(event.type == "focus" && exceedString != null) { 
        allowDataLengthCheckingAlgorithm(event);               
    }else if(isChrome && isIMEstate && enableDBCSSession && event.type == "textInput" ){     
    	allowDataLengthCheckingAlgorithm(event);                                             
    	event.preventDefault();                                                              
    }                                                                                        

}

//for IE Mobile
function allowDataLengthCheckingForIEMobile(inputbox) {
    var pseudoSO = '\u001F';
    var pseudoSI = '\u001E';
    var obj = inputbox;
    var modifiedValue = obj.value;
    var tempModifiedValue = obj.value;
    if (showUnProtectedSosiAsSpace) {
        modifiedValue = removeSpaceAsSOSI(modifiedValue);
    }
    modifiedValue = addPseudoSOSI(pseudoSO, pseudoSI, modifiedValue);
    modifiedValue = dataLengthChecking(pseudoSO, pseudoSI, modifiedValue, obj);
    modifiedValue = replacePseudoSOSI(pseudoSO, pseudoSI, modifiedValue);
    if (tempModifiedValue != modifiedValue) {
        obj.value = modifiedValue;
    }
}

function countDataLengthForDBCS(inputValue){
    var stringLength = 0;
    for (var i=0; i < inputValue.length; i++) {
        var currentString = inputValue.substr(i,1);
        if (isDBCSChar(currentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
            if(i+1 < inputValue.length && isSurrogate(currentString, inputValue.substr(i+1,1))) 
                i++;                                                                            
            stringLength = stringLength + 2;
        }
    }
    return stringLength;
}

function dataLengthCheckingForDBCSOnly(inputbox, inputValue, autoAdvance) { 
    var iname = inputbox.name;
    var pool = iname.split("_");
    var inputSize = parseInt(pool[2])-2;
    var data = inputValue;     
    var stringLength = countDataLengthForDBCS(data);
    if(stringLength > inputSize) {
        var isWithinInputSize = false;
        var i = data.length - 1;
        while(isWithinInputSize == false && i > -1) {
            modifiedValue = data.substr(0, i);
            stringLength = countDataLengthForDBCS(modifiedValue);
            if (stringLength <= inputSize) {
                isWithinInputSize = true;
                if(autoAdvance) {
                    if(isSurrogate(data.substr(i-1,1), data.substr(i,1))){   
                        exceedString = data.substr(i-1);                     
                    }else                                                    
                        exceedString = data.substr(i);                       
                }
            }
            i--;
        }
        stringLength = stringLength+2;
        if (showUnProtectedSosiAsSpace)
            inputbox.value = " "+modifiedValue+" ";
        else
            inputbox.value = modifiedValue;
        if(exceedString != null && (hatsForm != null && hatsForm.style.visibility != 'hidden')) 
            nextInputField(inputbox, parseInt(pool[1]), parseInt(pool[2]));
    }
    else if(stringLength == inputSize) {
        if (showUnProtectedSosiAsSpace) {
            data = " "+data+" ";                                                           
            if(autoAdvance && (hatsForm != null && hatsForm.style.visibility != 'hidden')) 
                nextInputField(inputbox, parseInt(pool[1]), parseInt(pool[2]));
        }

        
        var isValid = false;                       
        if(data == inputbox.value) isValid = true; 
        if(!isValid) {                             
            inputbox.value = data;                 
            event.returnValue = false;             
        }                                          
    }
    else {
        if (showUnProtectedSosiAsSpace)
            data = " "+data;                       

        
        var isValid = false;                       
        if(data == inputbox.value) isValid = true; 
        if(!isValid) {                             
            inputbox.value = data;                 
            event.returnValue = false;             
        }                                          
    }
}

function dataLengthCheckingForDBCSPure(inputbox, autoAdvance) {
    var iname = inputbox.name;
    var pool = iname.split("_");
    var ipos = parseInt(pool[1]);
    var inputSize = parseInt(pool[2]);
    var data = inputbox.value;
    var stringLength = countDataLengthForDBCS(data);
    if(stringLength > inputSize) {
        var isWithinInputSize = false;
        var i = data.length - 1;
        while(isWithinInputSize == false && i > -1) {
            modifiedValue = data.substr(0, i);
            stringLength = countDataLengthForDBCS(modifiedValue);
            if (stringLength <= inputSize) {
                isWithinInputSize = true;
                if(autoAdvance) {
                    if(isSurrogate(data.substr(i-1,1), data.substr(i,1))){   
                        exceedString = data.substr(i-1);                     
                    }else                                                    
                        exceedString = data.substr(i);                       
                }
            }
            i--;
        }
        inputbox.value = modifiedValue;
        if(exceedString != null && (hatsForm != null && hatsForm.style.visibility != 'hidden')) 
            nextInputField(inputbox, ipos, inputSize);
    }
    else if(stringLength == inputSize && autoAdvance && (hatsForm != null && hatsForm.style.visibility != 'hidden')) { 
        nextInputField(inputbox, ipos, inputSize);
    }
}



// Returns the number of characters contained within the specified string.
function getCharacterCount(str){
	if (str && str.length > 0){
		var tmp = str.replace(/(^\s*)|(\s*$)/g, "");
		if (tmp.length==0){
			return 0;
		} else {
			var stringLength = 0;
			for (var i=0; i < str.length; i++) {
				stringLength++;
				var currentString = str.substr(i,1);
				if (isDBCSChar(currentString, enableDBCSSession, enableDBCSEuro, CodePage)) {
					if(i+1 < str.length && isSurrogate(currentString, str.substr(i+1,1))) 
						i++;
				}
			}
			return stringLength;
		}
	} else {
		return 0;
	}
}



// Trims the left side SBCS/DBCS space of a string.
function leftTrimFromString(str){
    if (str){
        if ( str=="" || (str.charAt(0) != ' ' && str.charAt(0) != '\u3000')){
            return str;
        } else if (trimSpacesFromValue(str)==""){
            return "";
        }

        var index = -1;
        for (var i=0; i<str.length; i++){
            if (str.charAt(i) == ' ' || str.charAt(i) == '\u3000'){
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

//Trims the right side SBCS/DBCS space of a string.
function rightTrimFromString(str){
    if (str){
        if (str=="" || (str.charAt(str.length-1) != ' ' && str.charAt(str.length-1) != '\u3000')){
            return str;
        } else if (trimSpacesFromValue(str)==""){
            return "";
        }

        var index = str.length;
        for (var i=str.length-1; i>=0; i--){
            if (str.charAt(i) == ' ' || str.charAt(i) == '\u3000'){
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
