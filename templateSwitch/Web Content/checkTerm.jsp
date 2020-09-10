<!DOCTYPE HTML">
<HTML>
<HEAD>
<META charset="ISO-8859-1">
<TITLE>Disconnect Host Session</TITLE>
</HEAD>
<BODY>
<SCRIPT TYPE="text/javascript">
var timerID=null;
var timerCount=0;
var retryCount=5;

function disconnectIfParentClosed() {
	timerCount++;
	if ((window.opener != null) && (window.opener.closed == true)) {
		window.clearInterval(timerID);
		window.resizeTo(800,600);
		window.location.replace('<%= response.encodeURL("entry?COMMAND=disconnect&closeBrowser=true") %>');
	} else if (timerCount >= retryCount) {
		window.clearInterval(timerID);
		window.close();
	}
}

timerID = setInterval('disconnectIfParentClosed()', 100);
</SCRIPT>
</BODY>
</HTML>