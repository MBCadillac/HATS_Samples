var fOnFocus = new Function("setFocus(this,\"form1\");");
var fOnMouseOut = new Function("mouseLeave(this);");
var fOnDblClick = new Function("mouseDblClick(this);");
var fOnBlur = new Function("killFocus(this, 'null');");
var fOnCut = new Function("cutText(this);");
var fOnCopy = new Function("copyText(this);");
var fOnPaste = new Function("pasteText(this);");
var fOnSubmit = new Function("handleSubmit()");

function getInfo(id){return null;}

/////
function addEventHandlers(codepage) {
    isLinux = (navigator.platform.indexOf("Linux") != -1) ? true : false;    
    if(isLinux) {
        if(!NN)
            alert("Emulation of Arabic/Hebrew host sessions works correctly only on Microsoft Explorer or Netscape/Mozilla browser");
        else {
            index = navigator.userAgent.indexOf("Netscape/");
            if((index > 0) && (parseInt(navigator.userAgent.substring(index+9,index+10)) < 7))
                alert("To have full Bidi support use Netscape version 8 or above");
        }
    }
    else if (navigator.appName == 'Microsoft Internet Explorer')
        isIE = true;
    
    var hint;
    if(isIE) {
        hint = document.createElement("<div dir='ltr' id='hint' style=\"BACKGROUND-COLOR: rgb(255,255,128); COLOR: black; BORDER-BOTTOM-STYLE: groove; BORDER-LEFT-STYLE: groove; BORDER-RIGHT-STYLE: groove; BORDER-TOP-STYLE: groove; FONT-FAMILY: serif; FONT-SIZE: x-small; HEIGHT: 50px; LEFT: 1px; POSITION: absolute; TOP: 1px; VISIBILITY: hidden; WIDTH: 250px; Z-INDEX: 1\"></div>");
        hint.innerText = "Field reverse-'Alt+Numpad Numlock'\nPush on-'Shift+Numpad Numlock'\nPush off-'Shift+Numpad /'";
    }
    else {
        hint = document.createElement("<div>");
        hint.setAttribute("dir","ltr");
        hint.setAttribute("id","hint");
        hint.setAttribute("style","BACKGROUND-COLOR: rgb(255,255,128); COLOR: black; BORDER-BOTTOM-STYLE: groove; BORDER-LEFT-STYLE: groove; BORDER-RIGHT-STYLE: groove; BORDER-TOP-STYLE: groove; FONT-FAMILY: serif; FONT-SIZE: small; HEIGHT: 50px; LEFT: 1px; POSITION: absolute; TOP: 1px; VISIBILITY: hidden; WIDTH: 250px; Z-INDEX: 1");
        if(isLinux)
        	hint.innerHTML =  "Field reverse-'Shift+Numpad 4'<br\>Push on-'Shift+Numpad 7'<br\>Push off-'Shift+Numpad 8'";
		else        	
			hint.innerHTML =  "Field reverse-'Alt+Numpad Numlock'<br\>Push on-'Shift+Numpad Numlock'<br\>Push off-'Shift+Numpad /'";     
    }

    var body = document.getElementsByTagName("BODY");
    body[0].appendChild(hint);

    var forms = document.getElementsByTagName("FORM");
    if(forms != null) {
        forms[0].onsubmit = fOnSubmit;
        hatsForm = forms[0];
        hatsForm.name = hatsForm.id;
		autoKeyboardLayerSwitch = autoKeyboardLayerSwitchArray[hatsForm.name] = false;
		codePage = codePageArray[hatsForm.name] = codepage;
		isChkRTBArray[hatsForm.name] = false;
		isSession5250 = isSession5250Array[hatsForm.name] = false;		
	}

    var elements = document.getElementsByTagName("textarea");    
    for(var j=0 ;j < elements.length; j++) {
            //var jr = new JSReorder();
            //elements[j].value = jr.doReorder(elements[j].value);
        
            if(isIE) {
            	elements[j].onselect=new Function("handleSelect(event);");
                elements[j].onkeypress= new Function("keyPress(event);");
                elements[j].onkeydown= new Function("keyDown(event);");
                elements[j].onkeyup= new Function("keyUp(event);");
                elements[j].onmouseup=new Function("mouseUp(event,this);");
                elements[j].onmousedown=new Function("mouseDown(event);");
                elements[j].wrap="off";
            }else{
            	elements[j].onselect=handleSelect;
                elements[j].onkeypress=keyPress;
                elements[j].onkeydown=keyDown;
                elements[j].onkeyup=keyUp;
                elements[j].onmouseup=mouseUp;
                elements[j].onmousedown=mouseDown;
                elements[j].setAttribute("wrap", "off");
            }
            
            //elements[j].onsubmit=fOnSubmit;            
            elements[j].onfocus=fOnFocus;
            elements[j].ondblclick=fOnDblClick;
            elements[j].onmouseout=fOnMouseOut;
            elements[j].onblur=fOnBlur;
            elements[j].oncut=fOnCut;
            elements[j].oncopy=fOnCopy;
            elements[j].onpaste=fOnPaste;
            elements[j].style.unicodeBidi = "bidi-override";
            elements[j].dir="ltr";
            elements[j].style.direction = "ltr";
            elements[j].style.textAlign= "left";
            elements[j].style.position = "relative";            
            elements[j].style.overflow = "hidden";
            elements[j].rows="1";
            if(!isIE)
                elements[j].style.height = "23px";

    }
    if(elements.length > 0)
    	elements[0].focus();
}
function handleSubmit() {
/*
    var temp,text;
    var elements = document.getElementsByTagName("textarea");            
    var screenDir  = document.getElementById("screenDir");
	if(screenDir.dir == "rtl") {	    	    
	    for(var i=0;i < elements.length; i++) {
	        reverseText(elements[i]);

            //var text = elements[i].value;
            //elements[i].value = "";
            //for(i = text.length - 1;i >= 0;i--) {
            //    symbol = text.charAt(i);
            //    symbol = doSymSwap(symbol);
            //    elements[i].value += symbol;
            //}
	
	    } 
	}
*/	   
}
