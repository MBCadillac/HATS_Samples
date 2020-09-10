 <!DOCTYPE HTML>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page language="java" %>
<%@ page import="com.ibm.hats.common.*, com.ibm.hats.runtime.*, java.util.*, com.ibm.hats.util.*, com.ibm.etools.iseries.webfacing.runtime.host.core.*" %>
<%@ taglib uri="hats.tld" prefix="HATS" %>
<HEAD>
<META charset="utf-8">
</HEAD>
<%
    String hatsCsrf = (String) request.getAttribute(CommonConstants.CSRF_TOKEN_NAME);
	String sn = (String) request.getAttribute(CommonConstants.FORM_SESSIONNUMBER);
	if (sn == null) {
		sn = "1";
	}
	String urlfile = (String) request.getAttribute(CommonConstants.REQ_URL_REDIRECT);
	if (urlfile == null) {
		urlfile = "http://www.ibm.com";
	}
	Locale clientLocale = null;
	TransformInfo tInfo = (TransformInfo) request.getAttribute(CommonConstants.REQ_TRANSFORMINFO);
	if (tInfo != null) {
		clientLocale = tInfo.getClientLocale();
	}
	if (clientLocale == null) {
		clientLocale = (HatsLocale.getInstance().getDefaultLocale());
	}
	if (Ras.anyTracing) {
		Ras.traceEntry("JSP:" + this.getClass().getName(), "_jspService", clientLocale);
	}
	HatsMsgs msgs = new HatsMsgs("runtime", clientLocale);
	String stopLastAction = (String) request.getAttribute(CommonConstants.STOP_LAST_ACTION);
	if (stopLastAction == null) {
%>
<HATS:Form>
	<INPUT TYPE="HIDDEN" NAME="SESSIONNUMBER" VALUE="<%=sn%>" >
	<INPUT TYPE="HIDDEN" NAME="KeyboardToggle" VALUE="0" >
	<INPUT TYPE="HIDDEN" NAME="showURLFlag" VALUE="true" >
	<INPUT TYPE="HIDDEN" NAME="COMMAND" VALUE="ContinueFromShowURL" >
	<INPUT TYPE="HIDDEN" NAME="HatsCSRF" VALUE="<%=hatsCsrf%>" > 
	<TABLE style="margin: auto;">
		<TR>
			<TD style = "text-align: center;">
			<OBJECT class="center-div" type="text/html" width=600 height=400 data="<%=urlfile%>"> <A target="_blank" href="<%=urlfile%>"><%=urlfile%></A></OBJECT>
			</TD>
		</TR>
		<TR>
			<TD style = "text-align: center;">
			<INPUT class="center-div" type="submit" name="OK" class="ApplicationKeypad" value="<%=msgs.get("CONTINUE_APPLICATION_CAPTION")%>">
			</TD>
		</TR>
	</TABLE>
</HATS:Form>
<%
	} else {
		String doNotAllowRestart = (String) session.getAttribute("DoNotAllowRestart");
		String hatsDisconnectedRestart = msgs.get("DISCONNECT_PAGE_RESTART");
		String restartLabel = msgs.get("RESTART_CAPTION");
		String forwardedFrom = (String) request.getAttribute(WFCommonConstants.FORWARDED_ATTR);
		boolean forwardedFromWF = false;
		String refererPage = null;
		if (forwardedFrom != null && forwardedFrom.equals(WFCommonConstants.FORWARDED_FROM_WF)) {
			forwardedFromWF = true;
			refererPage = (String) request.getAttribute(WFCommonConstants.REFERERPAGE_ATTR);
		}
%>
<!-- submit form data by JavaScript -->
<SCRIPT TYPE="text/javascript">
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
		thisForm.method='get';
		thisForm.submit();
	}
</SCRIPT>
<!-- submit form data by JavaScript -->
<HATS:Form>

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
    <TABLE style="margin: auto;">
        <TR>
            <TD style = "text-align: center;">
            <OBJECT type="text/html" width=600 height=400
                data="<%=urlfile%>"> <A target="_blank" href="<%=urlfile%>"><%=urlfile%>
                </A> </OBJECT>
            </TD>
        </TR>
        
        <TR>
            <TD>
<%
	if (doNotAllowRestart == null && (!(forwardedFromWF && refererPage == null))) {/* check to see if the restart button should be displayed */
		// Restart information
		out.println("<P>" + hatsDisconnectedRestart + "</P>");
		if (forwardedFromWF) {
%>
<P><INPUT TYPE='BUTTON' NAME='HATS_restart' CLASS='ApplicationButton' VALUE='<%=restartLabel%>' onClick="parent.location='<%=refererPage%>'" style="width: auto" > </P>
<% } else { %>
<P><INPUT TYPE='BUTTON' NAME='HATS_restart' CLASS='ApplicationButton' VALUE='<%=restartLabel%>' onClick="ms_discon(this.form)" >
<INPUT TYPE='HIDDEN' NAME='SUBMITTED' VALUE='false'> </P>
<% }} %>
            </TD>
        </TR>
    </TABLE>
</HATS:Form>
<% } %>