if(!isIEMobile){ /*$$ GMm1a mobile doesn't allow registration on docuemnt for these events$$*/
	document.onkeypress = keypresshandler;
	document.onkeydown = keydownhandler;
	document.onkeyup = keyuphandler;
	document.onhelp = helpfunction;
	document.oncontextmenu = contextfunction;
	document.onclick = clickhandler;
}