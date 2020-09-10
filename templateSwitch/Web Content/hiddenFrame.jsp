<!DOCTYPE HTML>
<HTML>
<HEAD>
<META charset="ISO-8859-1">
<TITLE>hiddenFrame.jsp</TITLE>

<SCRIPT TYPE="text/javascript">
var childWindow;
</SCRIPT>
</HEAD>
<BODY>
<SCRIPT TYPE="text/javascript">
function popup() {
	if (connect != 0) {
	childWindow = window.open('<%= response.encodeURL("checkTerm.jsp") %>','','height=1,width=1');
	childWindow.blur();
	childWindow.opener = self;
	}
}

var connect=0;
window.onunload=popup;
</SCRIPT>
</BODY>
</HTML>