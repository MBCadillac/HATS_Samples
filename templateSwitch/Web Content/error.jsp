<% out.println("<!--error.jsp"); %>
<!DOCTYPE HTML>
<%@ page contentType="text/html;charset=UTF-8" isErrorPage="false" %>
<%@ page language="java" %>
<%@ page import="java.text.*, java.util.*, com.ibm.hats.util.*, com.ibm.hats.common.*" %>
<%@ taglib uri="hats.tld" prefix="HATS" %>
<HTML><HEAD>
<%
	HttpSession httpSession = request.getSession(false);
	Locale clientLocale = null;
	String appName = null;
	String doNotAllowRestart = (String) httpSession.getAttribute("DoNotAllowRestart");
	TransformInfo tInfo = (TransformInfo) request.getAttribute(CommonConstants.REQ_TRANSFORMINFO);
	if (tInfo != null) {
		clientLocale = tInfo.getClientLocale();
		appName = tInfo.getAppName();
	}
	if (clientLocale == null) {
		clientLocale = (HatsLocale.getInstance().getDefaultLocale());
	}
	if (Ras.anyTracing) {
		Ras.traceEntry("JSP:" + this.getClass().getName(), "_jspService", clientLocale);
	}
	HatsMsgs msgs = new HatsMsgs("runtime", clientLocale);
	String hatsHATSTitle = msgs.get("DISCONNECT_PAGE_TITLE");
	String hatsServerName = msgs.get("DISCONNECT_PAGE_SERVER");
	String hatsServerIP = msgs.get("DISCONNECT_PAGE_SERVERIP");
	String hatsErrorTitle = msgs.get("ERROR_PAGE_HEADER");
	String hatsErrorExplanation = msgs.get("ERROR_PAGE_EXPLANATION");
	String hatsErrorExplanation2 = msgs.get("ERROR_PAGE_EXPLANATION2");
	String hatsErrorMoreInfoAvail = msgs.get("ERROR_PAGE_MOREINFOAVAIL");
	String hatsErrorWhatCanDo = msgs.get("ERROR_PAGE_WHATCANDO");
	String hatsErrorRestartInfo = msgs.get("ERROR_PAGE_RESTARTINFO");
	String disconnectLabel = msgs.get("DISCONNECT_CAPTION");
	String defaultLabel = msgs.get("DEFAULT_CAPTION");
	String additionalInfo = msgs.get("HATS_PAGE_ADDINFO");
	String hatsAppNameLabel = msgs.get("HATS_PAGE_APPNAME");
	String hatsCurrEventLabel = msgs.get("HATS_PAGE_CURREVT");
%>
<TITLE>
<% out.print(hatsErrorTitle); %>
</TITLE>
</HEAD><BODY>
<% out.println("-->"); %>

<!--
SCRIPT TYPE="text/javascript" LANGUAGE="javascript" SRC="../common/lxgwfunctions.js"
/SCRIPT
SCRIPT portletID="hatsportletid";activeID="default";formID="HATSForm";
/SCRIPT
SCRIPT TYPE="text/javascript" LANGUAGE="javascript" SRC="../common/KBS.js"
/SCRIPT
-->
<!--
  //function keyboard_init() {}
  //function ms(intCommand) {}
  //function toggleKeyboard() {}
 /SCRIPT
-->
<%
	String sn = null;
	sn = (String) request.getAttribute(CommonConstants.FORM_SESSIONNUMBER);
	if (sn == null) {
		sn = "1";
	}
%>
<SCRIPT TYPE="text/javascript">
var submitted=false;
function ms_error(cmd,thisForm) {
    if(submitted) return;
    submitted=true;
    //document.HATSForm.COMMAND.value=cmd;
    //document.HATSForm.submit();
    thisForm.COMMAND.value=cmd;
    if (appletInitialized && document.HATSApplet) {
        document.HATSApplet.doNotKillOnExit();
    }
    thisForm.submit();
}
</SCRIPT>

<!-- Disable application keypad -->
<HATS:Form>
<INPUT TYPE="HIDDEN" NAME="COMMAND" VALUE="disconnect" >
<INPUT TYPE="HIDDEN" NAME="SESSIONNUMBER" VALUE="<%out.print(sn);%>" >

<!-- Print banner -->
<TABLE class="HATSSTATUSTABLE" BORDER=0 style="WIDTH:100%; CELLPADDING:6">
<tr>
<td CLASS="HATSSTATUSHEADER"><%= hatsErrorTitle %></td>
</tr>
<TR><TD align="right">
<%
	DateFormat df = DateFormat.getDateTimeInstance(DateFormat.FULL, DateFormat.MEDIUM, clientLocale);
	out.println("<P>"+ df.format(new java.util.Date()) + "</P>");
%>
</TD></TR><TR><TD COLSPAN=2>

<!-- Give reason for stopping -->
<%
	if (doNotAllowRestart != null) {
		out.println("<P>" + hatsErrorExplanation + hatsErrorMoreInfoAvail + "</P><P>" + hatsErrorExplanation2 + "&nbsp;" + hatsErrorWhatCanDo + "</P>");
	} else {
		out.println("<P>" + hatsErrorExplanation + hatsErrorMoreInfoAvail + "</P><P>" + hatsErrorExplanation2 + "&nbsp;" + hatsErrorWhatCanDo + "&nbsp;" + hatsErrorRestartInfo + "</P>");
	}
%>
<!-- User choices -->
<INPUT TYPE='button' NAME='default'    CLASS='ApplicationButton' ACCESSKEY="hatsportletid" VALUE='<%=defaultLabel%>'    ONCLICK="ms_error('default',this.form)" style="width: auto" >
<INPUT TYPE='button' NAME='disconnect' CLASS='ApplicationButton' ACCESSKEY="hatsportletid" VALUE='<%=disconnectLabel%>' ONCLICK="ms_error('disconnect',this.form)" style="width: auto" >
</TD></TR>

<!-- Additional information -->
<TR><TD CLASS="HATSSTATUSFOOTER">
<%
	try {
		out.println("<H3>" + hatsHATSTitle + "</H3>");
		java.net.InetAddress myNetAddress = java.net.InetAddress.getLocalHost();
		out.println("<table border=0 cellpadding=2 cellspacing=0>");
		out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsServerName + "</td><td class='HATSFOOTERSTATUSINFO'>" + myNetAddress.getHostName() + "</td></tr>");
		out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsServerIP + "</td><td class='HATSFOOTERSTATUSINFO'>" + myNetAddress.getHostAddress() + "</td></tr>");
		out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsAppNameLabel + "</td><td class='HATSFOOTERSTATUSINFO'>" + appName + "</td></tr>");

		String currentEventDescription = (String) request.getAttribute(CommonConstants.HATS_CURREVENT_DESC);
		if (currentEventDescription != null) {
			out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsCurrEventLabel + "</td><td class='HATSFOOTERSTATUSINFO'>" + currentEventDescription + "</td></tr>");
		}

		java.util.List errorMessages = (java.util.List) request.getAttribute(CommonConstants.HATS_ERROR_PAGE_MSGS);
		if ((errorMessages != null) && (errorMessages.size() > 0)) {
			out.println("<tr><td class='HATSFOOTERSTATUSHEADER' colspan=2>" + additionalInfo + "<UL>");
			for (Iterator iter = errorMessages.iterator(); iter.hasNext();) {
				Object o = iter.next();
				if (o instanceof Throwable)
					out.println("<LI><pre>" + CommonFunctions.htmlEscape(Util.getStackTrace((Throwable) o)) + "</pre></LI>");
				else
					out.println("<LI><pre>" + CommonFunctions.htmlEscape((String) o) + "</pre></LI>");
			}
			out.println("</UL></td></tr>");
			errorMessages.clear();
		}
		out.println("</table>");
	} catch (Exception e) {}
%>
</TD></TR></TABLE>
</HATS:Form>
<% out.println("<!--error.jsp"); %>
</BODY></HTML>
<% out.println("-->"); %>