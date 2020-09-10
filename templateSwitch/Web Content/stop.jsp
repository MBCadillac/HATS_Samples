<% out.println("<!--stop.jsp"); %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="false"%>
<%@ page import="java.text.*,  java.util.*, com.ibm.hats.util.*, com.ibm.hats.common.*, com.ibm.hats.runtime.*, com.ibm.etools.iseries.webfacing.runtime.host.core.*" %>
<%
	HttpSession httpSession = request.getSession(false);
	String disconnectWhy = (String) httpSession.getAttribute(RuntimeConstants.SESSION_STOP_KEY);
	String doNotAllowRestart = (String) httpSession.getAttribute("DoNotAllowRestart");
	String interopNoRestart = (String) httpSession.getAttribute("InteropNoRestart");
	httpSession.removeAttribute("InteropNoRestart");
	String closeBrowser = request.getParameter("closeBrowser");
	String hatsCsrf = (String) httpSession.getAttribute(CommonConstants.CSRF_TOKEN_NAME);
	httpSession.removeAttribute(RuntimeConstants.SESSION_STOP_KEY);
	Locale clientLocale = null;
	String appName = null;
	String stopLastAction = (String) request.getAttribute(CommonConstants.STOP_LAST_ACTION);
	String forwardedFrom = (String) request.getAttribute(WFCommonConstants.FORWARDED_ATTR);
	boolean forwardedFromWF = false;
	String refererPage = null;
	if (stopLastAction != null) {
		if (forwardedFrom != null && forwardedFrom.equals(WFCommonConstants.FORWARDED_FROM_WF)) {
			forwardedFromWF = true;
			refererPage = (String) request.getAttribute(WFCommonConstants.REFERERPAGE_ATTR);
		}
	}
	TransformInfo tInfo = (TransformInfo) request.getAttribute(CommonConstants.REQ_TRANSFORMINFO);
	if (tInfo != null) {
		clientLocale = tInfo.getClientLocale();
		appName = tInfo.getAppName();
	}
	if (clientLocale == null) {
		clientLocale = (HatsLocale.getInstance().getDefaultLocale());
	}
	if (Ras.anyTracing) {
		Ras.traceEntry("JSP:" + this.getClass().getName(), "_jspService", disconnectWhy, clientLocale);
	}
	HatsMsgs msgs = new HatsMsgs("runtime", clientLocale);
	String hatsWindowTitle = msgs.get("DISCONNECT_PAGE_TITLE");
	String hatsServerName = msgs.get("DISCONNECT_PAGE_SERVER");
	String hatsServerIP = msgs.get("DISCONNECT_PAGE_SERVERIP");
	String hatsDisconnectedTitle = msgs.get("DISCONNECT_PAGE_HEADER");
	String hatsDisconnectedRestart = msgs.get("DISCONNECT_PAGE_RESTART");
	String additionalInfo = msgs.get("HATS_PAGE_ADDINFO");
	String restartLabel = msgs.get("RESTART_CAPTION");
	String continueLabel = msgs.get("CONTINUE_APPLICATION_CAPTION");
	String hatsAppNameLabel = msgs.get("HATS_PAGE_APPNAME");
	String hatsCurrEventLabel = msgs.get("HATS_PAGE_CURREVT");
	String hatsErrorMoreInfoAvail = msgs.get("ERROR_PAGE_MOREINFOAVAIL");
%>
<% out.println("-->"); %>
<style>
.HATSSTATUSFOOTER {
	margin-top: 10px;
    padding: 0 4px 4px;
}
</style>

<!-- submit form data by JavaScript -->
<script>
	if (parent != self) {
		parent.frames[0].connect = 0;
	}

	var submitted=false;
	function ms_discon(thisForm) {
		if(submitted) return;
		submitted=true;
		if (appletInitialized && document.HATSApplet) {
			document.HATSApplet.doNotKillOnExit();
		}
		thisForm.submit();
	}
</script>

<FORM METHOD="POST" ACTION= <%= "\"" + "../" + CommonConstants.DEFAULT_ACCESS_SERVLET_NAME + "\""%> >

<!-- add in previous parameter overrides -->
<%
	if (request.getAttribute(RuntimeConstants.OVERRIDE_PARAMS_STORAGE) != null) {
		Properties p = (Properties) request.getAttribute(RuntimeConstants.OVERRIDE_PARAMS_STORAGE);
		for (Enumeration e = p.keys(); e.hasMoreElements();) {
			String name = (String) e.nextElement();
			String value = p.getProperty(name);
			out.println("<input type=\"hidden\" name=\"" + name + "\" value=\"" + value + "\">");
		}
	}
%>

<div class="HATSSTATUSTABLE">
	<div class="HATSSTATUSHEADER">
		<%= hatsDisconnectedTitle %>
	</div>
	<div style="text-align: right;">
		<%
			DateFormat df = DateFormat.getDateTimeInstance(DateFormat.FULL, DateFormat.MEDIUM, clientLocale);
			out.println("<P>"+ df.format(new java.util.Date()) + "</P>");
		%>
	</div>
	<div>
		<!-- Give reason for stopping -->
		<%
			if (disconnectWhy == null) { /* no specific disconnect reason given */
				out.println("<P>" + msgs.get("DISCONNECT_PAGE_ONEOF") + "</P>\n<UL><LI>" + msgs.get("DISCONNECT_PAGE_BUTTON") + "</LI><LI>" + msgs.get("DISCONNECT_PAGE_TIMEOUT") + "</LI><LI>" + msgs.get("DISCONNECT_PAGE_ERROR") + "</LI><LI>" + msgs.get("DISCONNECT_PAGE_LOGOFF")
						+ "</LI></UL>");
			} else {
				out.println("<P>" + msgs.get(disconnectWhy) + "</P>");
			}

			// Ending other than by disconnect button means there may be additional (error) info below.
			if (!("DISCONNECT_PAGE_BUTTON".equals(disconnectWhy))) {
				out.println(hatsErrorMoreInfoAvail);
			}

			if (stopLastAction != null) {
				if (doNotAllowRestart == null && interopNoRestart == null && (!(forwardedFromWF && refererPage == null))) { /* check to see if the restart button should be displayed */
					// Restart information
					out.println("<P>" + hatsDisconnectedRestart + "</P>");
					if (forwardedFromWF) {
		%>
		     <P><INPUT TYPE='BUTTON' NAME='HATS_restart' CLASS='ApplicationButton' VALUE='<%=restartLabel%>' onClick="parent.location='<%=refererPage%>'" style="width: auto" > </P>
		      <INPUT TYPE="HIDDEN" NAME="HatsCSRF" VALUE="<%=hatsCsrf%>" > 
		<% } else { %>
		 <INPUT TYPE="HIDDEN" NAME="HatsCSRF" VALUE="<%=hatsCsrf%>" >
		<P><INPUT TYPE='BUTTON' NAME='HATS_restart' CLASS='ApplicationButton' VALUE='<%=restartLabel%>' onClick="ms_discon(this.form)" style="width: auto" > </P>
		<%
			}
				}
			} else { /* if we have more actions, display Continue button */
		%>
		<INPUT TYPE="HIDDEN" NAME="COMMAND" VALUE="Continue" >
		 <INPUT TYPE="HIDDEN" NAME="HatsCSRF" VALUE="<%=hatsCsrf%>" >
		<P><INPUT TYPE='BUTTON' NAME='HATS_continue' CLASS='ApplicationButton' VALUE='<%=continueLabel%>' onClick="ms_discon(this.form)" style="width: auto" > </P>
		<% } %>
	</div>

	<!-- Additional information -->
	<div class="HATSSTATUSFOOTER">
		<%try {
			out.println("<H3>" + hatsWindowTitle + "</H3>");
			java.net.InetAddress myNetAddress = java.net.InetAddress.getLocalHost();
			out.println("<table border=0 cellpadding=2 cellspacing=0>");
			out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsServerName + "</td><td class='HATSFOOTERSTATUSINFO'>" + myNetAddress.getHostName() + "</td></tr>");
			out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsServerIP + "</td><td class='HATSFOOTERSTATUSINFO'>" + myNetAddress.getHostAddress() + "</td></tr>");
			out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsAppNameLabel + "</td><td class='HATSFOOTERSTATUSINFO'>" + appName + "</td></tr>");

			java.util.List errorMessages = (java.util.List) request.getAttribute(CommonConstants.HATS_ERROR_PAGE_MSGS);
			if ((errorMessages != null) && (errorMessages.size() > 0)) {
				String currentEventDescription = (String) request.getAttribute(CommonConstants.HATS_CURREVENT_DESC);
				if (currentEventDescription != null) {
					out.println("<tr><td class='HATSFOOTERSTATUSHEADER'>" + hatsCurrEventLabel + "</td><td class='HATSFOOTERSTATUSINFO'>" + currentEventDescription + "</td></tr>");
				}

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
	</div>
</div>
<%
// If closeBrowser=true was specified on the URL then close
// the browser.  Used in disconnectOnClose processing. 
	if ((closeBrowser != null) && (closeBrowser.equals("true"))) {
%>
<script>
window.close();
</script>
<%}%>
</FORM>