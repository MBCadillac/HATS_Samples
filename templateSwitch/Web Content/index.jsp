<%@ page contentType="text/html; charset=utf-8"%>
<%@ page language="java" %>
<%@ page import="java.util.*" %>
<%
String userAgent = (String) request.getHeader("user-agent");
%>
<HTML>
<HEAD>
</HEAD>

<%
	String parmString = new String("");
	boolean ieOK = false;
	if ((userAgent.indexOf("MSIE 5.5") != -1) || (userAgent.indexOf("MSIE 6.0") != -1) || (userAgent.indexOf("MSIE 7.0") != -1) || (userAgent.indexOf("MSIE 8.0") != -1) || (userAgent.indexOf("MSIE 9.0") != -1))
		ieOK = true;

	String disconnectOnClose = request.getParameter("disconnectOnClose");
	if ((disconnectOnClose != null) && (disconnectOnClose.equals("true")) && (ieOK)) {
		Enumeration parmNames = request.getParameterNames();
		while (parmNames.hasMoreElements()) {
			String name = (String) parmNames.nextElement();
			if (name.equals("disconnectOnClose") == false) {
				String values[] = request.getParameterValues(name);
				for (int i = values.length - 1; i >= 0; i--) {
					parmString = "&" + name + "=" + values[i] + parmString;
				}
			}
		}

		if (parmString.length() > 0) {
			parmString = "?" + parmString.substring(1);
		}
%>
<FRAMESET rows="0%,100%" FRAMEBORDER="no">
   <FRAME src="<%= response.encodeURL("hiddenFrame.jsp") %>" noresize>
   <FRAME src="<%= response.encodeURL("index.jsp" + parmString) %>">
   <NOFRAMES>
   <BODY>
      <P>Frames are required.</P>
   </BODY>
   </NOFRAMES>
</FRAMESET>
<% }else{ %>
<BODY>
<jsp:forward page="entry" />
</BODY>
<% } %>
</HTML>