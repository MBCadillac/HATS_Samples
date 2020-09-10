/*
A JavaScript module RESEARCH
*/

// Ensure global namespace HATS.TEMPLATE exists
if(!window.HATS){
	window.HATS = {};
	if(!window.HATS.TEMPLATE){
		window.HATS.TEMPLATE = {};
	}
}

// Create global namespace for this module
HATS.TEMPLATE.RESEARCH = {};

var navIsIE = false;

HATS.TEMPLATE.RESEARCH.hasClass = function(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};

 HATS.TEMPLATE.RESEARCH.navHoverIn = function(ele) {
	if(ele.parentNode.parentNode.nodeName == 'LI')
		ele.parentNode.parentNode.className = ele.parentNode.parentNode.className + " r_lvl1nav_hover_item";
	else 
		ele.className = ele.className + " r_lvl1nav_hover_item";
};

HATS.TEMPLATE.RESEARCH.navHoverOut = function(ele){
	if(ele.parentNode.parentNode.nodeName == 'LI')
		ele.parentNode.parentNode.className = ele.parentNode.parentNode.className.replace("r_lvl1nav_hover_item","");
	else
		ele.className = ele.className.replace("r_lvl1nav_hover_item","");
};

HATS.TEMPLATE.RESEARCH.initNavJS = function() {
	var eles=document.getElementsByTagName("*");
	if (navigator.appName =="Microsoft Internet Explorer"){
		navIsIE = true;
	}
	
	for (var i=0; i < eles.length; i++) {
		if (HATS.TEMPLATE.RESEARCH.hasClass(eles[i], 'r_lvl1nav_item')) {
			anchors = eles[i].getElementsByTagName("a");
			for (var j=0; j < anchors.length; j++){
				anchors[j].onfocus = function() { HATS.TEMPLATE.RESEARCH.navHoverIn(this.parentNode); } ;
				anchors[j].onblur = function() { HATS.TEMPLATE.RESEARCH.navHoverOut(this.parentNode); } ;
			}
			if (navIsIE) {
				eles[i].onmouseenter = function() {HATS.TEMPLATE.RESEARCH.navHoverIn(this);};
				eles[i].onmouseleave = function() {HATS.TEMPLATE.RESEARCH.navHoverOut(this);};
			} else {
				eles[i].onmouseover = function() {HATS.TEMPLATE.RESEARCH.navHoverIn(this);};
				eles[i].onmouseout = function() {HATS.TEMPLATE.RESEARCH.navHoverOut(this);};
			}
		}
	}
};
HATS.TEMPLATE.RESEARCH.inited = false;
HATS.TEMPLATE.RESEARCH.init = function(){
    if(!HATS.TEMPLATE.RESEARCH.inited){
        var currentWindowOnload = window.onload || function () {};
        window.onload = null;
        window.onload = function () { currentWindowOnload(); HATS.TEMPLATE.RESEARCH.initNavJS(); };
        HATS.TEMPLATE.RESEARCH.inited = true;
    }
};

HATS.TEMPLATE.RESEARCH.init();