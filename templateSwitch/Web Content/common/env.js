// Licensed Materials - Property of IBM
//
// AIMCHSR00
// (C)Copyright IBM Corp. 2003, 2016  All Rights Reserved

//.============================================================================
//.Function:  Sets base environment variables representing browser, OS, and etc.
//.           This file must be included before any other HSR JavaScript files.
//.============================================================================
// SP1  41295  SP  19Feb2014  PageNotRendering correctly unless IE10 put to CompatibilityMode
// AS1  IT15796 AS 23Sept2016 UNABLE TO OVERWRITE INPUT FIELD TEXT.
//.============================================================================

var brwsapname = navigator.appName;
var brwsusragent = navigator.userAgent;
// var brwsapversion = navigator.appVersion;

var isLinux = (navigator.platform.indexOf("Linux") != -1) ? true : false;

var NN = false; //Netscape Navigator
var MAC = false; //Mac
var NNCOMPAT = false; //Netscape Navigator compatible
var OPERA = false; //Opera
var MOZILLA = false; //Mozilla
var KONQUEROR = false; //Konqueror
var SAFARI = false; //Safari
var isIE = false; //Microsoft Internet Explorer
var isIPAD = false; //iPad 
var isChrome = false;

var isNS4 = (document.layers) ? true : false;
var isIE4 = (document.all) ? true : false;

var isIE5 = false;
try{
	isIE5=(document.all && document.getElementById) ? true : false;
}catch(e){
	isIE5=false;
}

var isNS6 = false;
try{
	isNS6=((document.getElementById)&&(!isIE4)) ? true : false;
}catch(e){
	isNS6=false;
}

var isOtherBrowser = false;
var isIEMobile = false; 

var IEVersion = -1; 
var IE11Plus = false; 

if ((brwsusragent.toLowerCase().indexOf("mac")!=-1)) 
  MAC=true;


if ((brwsusragent.toLowerCase().indexOf("ipad")!=-1)){
	isIPAD=true;
}



if (brwsapname == 'Netscape')
{
	//Check for IE11+ 
	if (!!window.MSInputMethodContext && !!document.documentMode)
	//look for the Trident (IE11 and above only) and setup IEVersion
	{
		re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(brwsusragent) != null)
		{
			IEVersion = parseFloat( RegExp.$1 );
			IE11Plus = true;
		}
	}
}

if ((brwsapname == 'Microsoft Internet Explorer'))
{
  //brwsapname = 'Microsoft Internet Explorer'; 
  isIE = true;
}


if (isIE)
{
	
	var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if (re.exec(brwsusragent) != null)
		IEVersion = parseFloat( RegExp.$1 );
}

if(brwsusragent.indexOf('Windows CE')!=-1){ 
  brwsapname = 'Microsoft Internet Explorer Mobile';
  isIEMobile = true;
  isIE = true; 
  event=window.event;
}

if (brwsusragent.indexOf('Opera') != -1)
{
  brwsapname = 'Opera';
  isIE=false;
  NN=false;
  NNCONMPAT = true;
  OPERA = true;
  isIE4=false;
  isChrome = false;  
}

if (brwsapname.indexOf('Netscape') != -1)
{
  brwsapname = 'Netscape';
  NN = true;
  NNCOMPAT = true;
  isIE = false;
  isIE4=false;
  isChrome = false;  
}

if (brwsapname == 'Netscape')
{
  if ((brwsusragent.indexOf('Mozilla') != -1) || (brwsusragent.indexOf('Firebird') != -1))
  {
    brwsapname = 'Mozilla';
    NNCOMPAT = true;
    MOZILLA = true;
    isIE = false;
    isIE4=false;
    isNS4=false;
    isChrome = false;    
  }
}

if (brwsusragent.indexOf('Konqueror') != -1)
{
  brwsapname = 'Konqueror';
  KONQUEROR = true;
  NNCOMPAT = true;
  isIE = false;
  NN = false;
  isNS4 = false;
  //isNS6 = false;
  isIE4=false;
  isChrome = false;
}

if (brwsusragent.indexOf('Safari') != -1)
{
  brwsapname = 'Safari';
  SAFARI = true;
  NNCOMPAT = true;
  isIE = false;
  NN = false;
  isNS4 = false;
  //isNS6 = false;
  isIE4=false;
  isChrome = false;
}

if (brwsusragent.indexOf('Chrome') != -1)
{
  brwsapname = 'Chrome';
  SAFARI = false;
  NNCOMPAT = true;
  isIE = false;
  NN = false;
  isNS4 = false;
  //isNS6 = false;
  isIE4=false;
  isChrome = true;
}

if (MAC && isIE)
{
  isIE = true;
  isIE4=false;
}

if (!isIE)
{
   isIE5 = false;
}

isOtherBrowser = (!isIE) && (!isNS6);

function getBrowserAppName()
{
    return brwsapname;
}

function getBrowserUserAgent()
{
    return brwsusragent;
}

// alert ("MAC = "+MAC+", isLinux = "+isLinux+", brwsapname = "+brwsapname+", isOtherBrowser = "+isOtherBrowser+"\nisIE = "+isIE+", isIE4 = "+isIE4+", isIE5 = "+isIE5+"\nNN = "+NN+", NNCOMPAT = "+NNCOMPAT+", isNS4 = "+isNS4+", isNS6 = "+isNS6+", MOZILLA = "+MOZILLA);