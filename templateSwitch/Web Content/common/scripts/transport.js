/*
A JavaScript module TRANSPORT
*/

// Ensure global namespace HATS.TEMPLATE exists
if(!window.HATS){
	window.HATS = {};
	if(!window.HATS.TEMPLATE){
		window.HATS.TEMPLATE = {};
	}
}

// Create global namespace for this module
HATS.TEMPLATE.TRANSPORT = {};

var navIsIE = false;

HATS.TEMPLATE.TRANSPORT.hasClass = function(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};

HATS.TEMPLATE.TRANSPORT.navHoverIn = function(ele) {
	var activeElem = HATS.TEMPLATE.TRANSPORT.getDescendantById(ele.parentNode,'t_lvl1nav_activeitem');
	activeElem.getElementsByTagName("ul")[0].style.display = "none";
	ele.className = ele.className.replace("t_lvl1nav_item_hover","");
	ele.className = ele.className + " t_lvl1nav_item_hover";
	ele.getElementsByTagName("ul")[0].style.display = "block";
	if (navIsIE){
		ele.getElementsByTagName("ul")[0].style.width = document.getElementById("t_wrapper").clientWidth + "px";	
	}
};

HATS.TEMPLATE.TRANSPORT.navHoverOut = function(ele){
	ele.getElementsByTagName("ul")[0].style.display = "none";
	ele.className = ele.className.replace("t_lvl1nav_item_hover","");
	var activeElem = HATS.TEMPLATE.TRANSPORT.getDescendantById(ele.parentNode,'t_lvl1nav_activeitem');
	activeElem.getElementsByTagName("ul")[0].style.display = "block";
};

HATS.TEMPLATE.TRANSPORT.navClickIn = function(ele){
	var activeElem = HATS.TEMPLATE.TRANSPORT.getDescendantById(ele.parentNode,'t_lvl1nav_activeitem');
	activeElem.getElementsByTagName("ul")[0].style.display = "none";
	activeElem.id = activeElem.id.replace("t_lvl1nav_activeitem","");
	
	ele.id = "t_lvl1nav_activeitem";
	ele.getElementsByTagName("ul")[0].style.display = "block";

	if (navIsIE){
		ele.getElementsByTagName("ul")[0].style.width = document.getElementById("t_wrapper").clientWidth + "px";		
	}
};

HATS.TEMPLATE.TRANSPORT.initNavJS = function() {
	if (navigator.appName =="Microsoft Internet Explorer"){
		navIsIE = true;
	}
	
	var eles=document.getElementsByTagName("*");

	for (var i=0; i<eles.length; i++) {
		if (HATS.TEMPLATE.TRANSPORT.hasClass(eles[i],'t_lvl1nav_item')) {
			eles[i].getElementsByTagName("a")[0].onfocus = eles[i].getElementsByTagName("a")[0].onclick = function() { HATS.TEMPLATE.TRANSPORT.navClickIn(this.parentNode); } ;
			if(navIsIE){
				eles[i].onmouseenter = function() { HATS.TEMPLATE.TRANSPORT.navHoverIn(this); } ;
				eles[i].onmouseleave = function() { HATS.TEMPLATE.TRANSPORT.navHoverOut(this); } ;		
			}
			else {
				eles[i].onmouseover = function() { HATS.TEMPLATE.TRANSPORT.navHoverIn(this); } ;
				eles[i].onmouseout = function() { HATS.TEMPLATE.TRANSPORT.navHoverOut(this); } ;
			}
		}
		if (eles[i].id=='t_lvl1nav_activeitem'){
			var ele = eles[i];
			ele.getElementsByTagName("ul")[0].style.display = "block";
			if (navIsIE){
				var wrapper = document.getElementById("t_wrapper");
				var activeSubmenu = ele.getElementsByTagName("ul")[0];
				activeSubmenu.style.width = wrapper.clientWidth + "px";	
				wrapper.onresize = function () { activeSubmenu.style.width = wrapper.clientWidth + "px"; };
			}		
		}
	}
};
HATS.TEMPLATE.TRANSPORT.getDescendantById = function(ele, id) {
	var descendants = ele.getElementsByTagName("*");
	for(var i=0;i<descendants.length; i++){
		if(descendants[i].id == id) return descendants[i];
	}
};
HATS.TEMPLATE.TRANSPORT.inited = false;
HATS.TEMPLATE.TRANSPORT.init = function(){
    if(!HATS.TEMPLATE.TRANSPORT.inited){
        var currentWindowOnload = window.onload || function () {};
        window.onload = null;
        window.onload = function () { currentWindowOnload(); HATS.TEMPLATE.TRANSPORT.initNavJS(); };
        HATS.TEMPLATE.TRANSPORT.inited = true;
    }
};

HATS.TEMPLATE.TRANSPORT.init();