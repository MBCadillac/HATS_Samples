<% out.println("<!--busy.jsp"); %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="false"%>
<%@ page import="java.text.*, java.util.*, com.ibm.hats.util.*, com.ibm.hats.common.*" %>
<%@ taglib uri="hats.tld" prefix="HATS" %>
<%
	HttpSession httpSession = request.getSession(false);
	Locale clientLocale = null;
	String appName = null;
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
	String hatsBusyMoreInfoAvail = msgs.get("ERROR_PAGE_MOREINFOAVAIL");
	String hatsBusyTitle = msgs.get("ERROR_PAGE_BUSY_HEADER");
	String hatsBusyExplanation = msgs.get("ERROR_PAGE_BUSY");
	String hatsBusyWhatCanDo = msgs.get("ERROR_PAGE_BUSY2");
	String refreshLabel = msgs.get("REFRESH_CAPTION");
	String additionalInfo = msgs.get("HATS_PAGE_ADDINFO");
	String hatsAppNameLabel = msgs.get("HATS_PAGE_APPNAME");
	String hatsCurrEventLabel = msgs.get("HATS_PAGE_CURREVT");
%>
<% out.println("-->"); %>
<style>
.HATSSTATUSFOOTER {
	margin-top: 10px;
    padding: 0 4px 4px;
}
</style>

<%
	String sn = null;
	sn = (String) request.getAttribute(CommonConstants.FORM_SESSIONNUMBER);
	if (sn == null) {
		sn = "1";
	}
%>
<script>
var submitted=false;
function ms_busy(cmd,thisForm) {
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
</script>

<!-- Disable application keypad -->
<HATS:Form>
<input TYPE="HIDDEN" NAME="COMMAND" VALUE="disconnect" >
<input TYPE="HIDDEN" NAME="SESSIONNUMBER" VALUE="<%out.print(sn);%>" >

<!-- Print banner -->
<div class="HATSSTATUSTABLE">
	<div class="HATSSTATUSHEADER">
		<%= hatsBusyTitle %>
	</div>
	<div style="text-align: right;">
		<%
			DateFormat df = DateFormat.getDateTimeInstance(DateFormat.FULL, DateFormat.MEDIUM, clientLocale);
			out.println("<P>" + df.format(new java.util.Date()) + "</P>");
		%>
	</div>
	<div>
		<!-- Give reason for stopping -->
		<%
			out.println("<p>" + hatsBusyExplanation + "&nbsp;&nbsp;" + hatsBusyMoreInfoAvail + "</p><p>" + hatsBusyWhatCanDo + "</p>");
		%>
		<!-- User choices -->
		<input TYPE='button' NAME='refresh' CLASS='ApplicationButton' ACCESSKEY="hatsportletid" VALUE='<%=refreshLabel%>' ONCLICK="ms_busy('refresh',this.form)" style="width: auto" >
	</div>

	<!-- Additional information -->
	<div class="HATSSTATUSFOOTER">
		<%
			try {
				out.println("<H3>" + hatsHATSTitle + "</H3>");
				java.net.InetAddress myNetAddress = java.net.InetAddress.getLocalHost();
				out.println("<table border='0' cellpadding='2' cellspacing='0'>");
				out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsServerName + "</td><td class='HATSFOOTERSTATUSINFO'>" + myNetAddress.getHostName() + "</td></tr>");
				out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsServerIP + "</td><td class='HATSFOOTERSTATUSINFO'>" + myNetAddress.getHostAddress() + "</td></tr>");
				out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsAppNameLabel + "</td><td class='HATSFOOTERSTATUSINFO'>" + appName + "</td></tr>");
		
				String currentEventDescription = (String) request.getAttribute(CommonConstants.HATS_CURREVENT_DESC);
				if (currentEventDescription != null) {
					out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsCurrEventLabel + "</td><td class='HATSFOOTERSTATUSINFO'>" + currentEventDescription + "</td></tr>");
				}

				java.util.List errorMessages = (java.util.List) request.getAttribute(CommonConstants.HATS_ERROR_PAGE_MSGS);
				if (errorMessages != null) {
					out.println("<tr><td class='HATSFOOTERSTATUSHEADER' colspan=2>" + additionalInfo + "<ul>");
					for (Iterator iter = errorMessages.iterator(); iter.hasNext();) {
						Object o = iter.next();
						if (o instanceof Throwable)
							out.println("<li><pre>" + Util.getStackTrace((Throwable) o) + "</pre></li>");
						else
							out.println("<li><pre>" + (String) o + "</pre></li>");
					}
					out.println("</ul></td></tr>");
					errorMessages.clear();
				}

				out.println("</table>");
			} catch (Exception e) {}
		%>
	</div>
</div>
</HATS:Form>