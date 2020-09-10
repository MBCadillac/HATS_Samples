/*
A JavaScript module FINANCE
*/

// Ensure global namespace HATS.TEMPLATE exists
if(!window.HATS){
	window.HATS = {};
	if(!window.HATS.TEMPLATE){
		window.HATS.TEMPLATE = {};
	}
}

// Create global namespace for this module
HATS.TEMPLATE.FINANCE = {};

var navIsIE = false;

HATS.TEMPLATE.FINANCE.hasClass = function(ele,cls){
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};

HATS.TEMPLATE.FINANCE.navHoverIn = function(ele){
	if(ele.parentNode.parentNode.nodeName == 'LI')
		ele.parentNode.parentNode.className = ele.parentNode.parentNode.className + " f_lvl1nav_item_hover";
	else 
		ele.className = ele.className + " f_lvl1nav_item_hover";
};

HATS.TEMPLATE.FINANCE.navHoverOut = function(ele){
	if(ele.parentNode.parentNode.nodeName == 'LI')
		ele.parentNode.parentNode.className = ele.parentNode.parentNode.className.replace("f_lvl1nav_item_hover","");
	else
		ele.className = ele.className.replace("f_lvl1nav_item_hover","");
};

HATS.TEMPLATE.FINANCE.initNavJS = function() {
	var eles=document.getElementsByTagName("*");
	if (navigator.appName =="Microsoft Internet Explorer"){
		navIsIE = true;
	}
	
	for (var i=0; i<eles.length; i++) {
		if (HATS.TEMPLATE.FINANCE.hasClass(eles[i],'f_lvl1nav_item')) {
			var anchors = eles[i].getElementsByTagName("a");
			for (var j=0; j < anchors.length; j++){
				anchors[j].onfocus = function() { HATS.TEMPLATE.FINANCE.navHoverIn(this.parentNode); } ;
				anchors[j].onblur = function() { HATS.TEMPLATE.FINANCE.navHoverOut(this.parentNode); } ;
			}
			if(navIsIE){
				eles[i].onmouseenter = function() { HATS.TEMPLATE.FINANCE.navHoverIn(this); } ;
				eles[i].onmouseleave = function() { HATS.TEMPLATE.FINANCE.navHoverOut(this); } ;		
			}
			else {
				eles[i].onmouseover = function() { HATS.TEMPLATE.FINANCE.navHoverIn(this); } ;
				eles[i].onmouseout = function() { HATS.TEMPLATE.FINANCE.navHoverOut(this); } ;
			}
		}
	}	
};
HATS.TEMPLATE.FINANCE.inited = false;
HATS.TEMPLATE.FINANCE.init = function(){
    if(!HATS.TEMPLATE.FINANCE.inited){
        var currentWindowOnload = window.onload || function () {};
        window.onload = null;
        window.onload = function () { currentWindowOnload(); HATS.TEMPLATE.FINANCE.initNavJS(); };
        HATS.TEMPLATE.FINANCE.inited = true;
    }
};

HATS.TEMPLATE.FINANCE.init();
