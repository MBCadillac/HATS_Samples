function updateStatusWindow() {}                                                     
function setFocusFieldIntoGlobalOrig() {}                                            
function isHInput(type,name){return false;}                                          
function setCaretToFirstInputPosition(obj) {}                                                     
function setCursorPosition(intCursorPosition,pID){}                                  
function updateCursorPosition(autoAdvanceHandle,pID){}                               
function ms(intCommand,pID){}                                                        
function getInfo(id){return null;}
function isOverWriteMode()                                                           
{                                                                                    
  if (isOverwriteMozilla && enableBIDI) return true;                     
  if (!isRealIE) return false;                                                           
  return document.queryCommandValue("OverWrite");                                  
}                                                                                    

var carettrackingenabled=true;                                                       
beensubmitted = false;                                                               
var gobject;                                                                         
var upperCase = "";                                                                
var OIA_BIDI = "&nbsp;";                                                           
enableDBCSSession=false;                                                             
var enableBIDI = true;                                                           
isRealIE = (navigator.userAgent.indexOf('MSIE') > -1 || navigator.appVersion.indexOf('Trident/')) > 0;                                                           
var hatsForm = document.forms[0];                                                    
var isOverwriteMozilla = false;   
var disableNumSwapWhenSubmit=false;    