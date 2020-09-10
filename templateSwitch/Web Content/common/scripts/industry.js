/*
A JavaScript module INDUSTRY
*/

// Ensure global namespace HATS.TEMPLATE exists
if(!window.HATS){
	window.HATS = {};
	if(!window.HATS.TEMPLATE){
		window.HATS.TEMPLATE = {};
	}
}

// Create global namespace for this module
HATS.TEMPLATE.INDUSTRY = {};

var navIsIE = false;

HATS.TEMPLATE.INDUSTRY.hasClass = function(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};

HATS.TEMPLATE.INDUSTRY.navHoverIn = function(ele) {
	var activeElem = HATS.TEMPLATE.INDUSTRY.getDescendantById(ele.parentNode, "i_lvl1nav_activeitem");
	activeElem.getElementsByTagName("ul")[0].style.display = "none";
	ele.className = ele.className.replace("i_lvl1nav_item_hover","");
	ele.className = ele.className + " i_lvl1nav_item_hover";
	ele.getElementsByTagName("ul")[0].style.display = "block";
	if (navIsIE){
		ele.getElementsByTagName("ul")[0].style.width = document.getElementById("i_wrapper").clientWidth + "px";	
	}
};

HATS.TEMPLATE.INDUSTRY.navHoverOut = function(ele){
	ele.getElementsByTagName("ul")[0].style.display = "none";
	ele.className = ele.className.replace("i_lvl1nav_item_hover","");
	var activeElem = HATS.TEMPLATE.INDUSTRY.getDescendantById(ele.parentNode, "i_lvl1nav_activeitem");
	activeElem.getElementsByTagName("ul")[0].style.display = "block";
};

HATS.TEMPLATE.INDUSTRY.navClickIn = function(ele){
	var activeElem = HATS.TEMPLATE.INDUSTRY.getDescendantById(ele.parentNode, "i_lvl1nav_activeitem");
	activeElem.getElementsByTagName("ul")[0].style.display = "none";
	activeElem.id = activeElem.id.replace("i_lvl1nav_activeitem","");
	
	ele.id = "i_lvl1nav_activeitem";
	ele.getElementsByTagName("ul")[0].style.display = "block";

	if (navIsIE){
		ele.getElementsByTagName("ul")[0].style.width = document.getElementById("i_wrapper").clientWidth + "px";		
	}
};

HATS.TEMPLATE.INDUSTRY.initNavJS = function() {
	if (navigator.appName =="Microsoft Internet Explorer"){
		navIsIE = true;
	}
	
	var eles=document.getElementsByTagName("*");

	for (var i=0; i<eles.length; i++) {
		if (HATS.TEMPLATE.INDUSTRY.hasClass(eles[i],'i_lvl1nav_item')) {
			eles[i].getElementsByTagName("a")[0].onfocus = eles[i].getElementsByTagName("a")[0].onclick = function() { HATS.TEMPLATE.INDUSTRY.navClickIn(this.parentNode); } ;
			if(navIsIE){
				eles[i].onmouseenter = function() { HATS.TEMPLATE.INDUSTRY.navHoverIn(this); } ;
				eles[i].onmouseleave = function() { HATS.TEMPLATE.INDUSTRY.navHoverOut(this); } ;		
			}
			else {
				eles[i].onmouseover = function() { HATS.TEMPLATE.INDUSTRY.navHoverIn(this); } ;
				eles[i].onmouseout = function() { HATS.TEMPLATE.INDUSTRY.navHoverOut(this); } ;
			}
		}
		if (eles[i].id=='i_lvl1nav_activeitem'){
			var ele = eles[i];
			ele.getElementsByTagName("ul")[0].style.display = "block";
			if (navIsIE){
				var wrapper = document.getElementById("i_wrapper");
				var activeSubmenu = ele.getElementsByTagName("ul")[0];
				activeSubmenu.style.width = wrapper.clientWidth + "px";	
				wrapper.onresize = function () { activeSubmenu.style.width = wrapper.clientWidth + "px"; };
			}		
		}
	}
};
HATS.TEMPLATE.INDUSTRY.getDescendantById = function(ele, id) {
	var descendants = ele.getElementsByTagName("*");
	for(var i=0;i<descendants.length; i++){
		if(descendants[i].id == id) return descendants[i];
	}
};
HATS.TEMPLATE.INDUSTRY.inited = false;
HATS.TEMPLATE.INDUSTRY.init = function(){
    if(!HATS.TEMPLATE.INDUSTRY.inited){
        var currentWindowOnload = window.onload || function () {};
        window.onload = null;
        window.onload = function () { currentWindowOnload(); HATS.TEMPLATE.INDUSTRY.initNavJS(); };
        HATS.TEMPLATE.INDUSTRY.inited = true;
    }
};

HATS.TEMPLATE.INDUSTRY.init();