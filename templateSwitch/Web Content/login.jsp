<!DOCTYPE HTML>
<%@ page contentType="text/html; charset=UTF-8" %><META charset="UTF-8">
<%@ page import="java.util.*, com.ibm.hats.util.*" %>
<%
	Locale l = com.ibm.hats.util.HatsLocale.getDefaultRequestLocale(request);
	String text = HatsMsgs.get("com/ibm/hats/msgs/", "runtime", "IDS_AUTH_TITLE", l);
	out.println("<html><head><title>" + text + "</title></head>" + "<body  >");

	out.println("<H2>" + text + "</H2>");
	text = HatsMsgs.get("com/ibm/hats/msgs/", "runtime", "IDS_SUBMIT", l);

	out.println("<BR><FORM ACTION='j_security_check' METHOD='POST'>" + " <TABLE BORDER='0' WIDTH='30%' CELLSPACING='3' CELLPADDING='2'>" + "   <TR>" + "    <TD><B>" + HatsMsgs.get("com/ibm/hats/msgs/", "runtime", "IDS_AUTH_LOGIN", l) + "</B></TD>"
			+ "    <TD><INPUT TYPE='text' SIZE='20' NAME='j_username'></TD>" + "   </TR><TR>" + "    <TD><B>" + HatsMsgs.get("com/ibm/hats/msgs/", "runtime", "IDS_AUTH_PASSWORD", l) + "</B></TD>" + "    <TD><INPUT TYPE='password' SIZE='10' NAME='j_password'></TD>"
			+ "   </TR><TR>" + "    <TD><INPUT TYPE='SUBMIT' NAME='submit' VALUE='" + text + "'></TD>" + "   </TR></TABLE></FORM>");

	out.println("</body></html>");
%>