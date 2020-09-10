<!DOCTYPE HTML>
<%@ page contentType="text/html; charset=UTF-8" %><META charset="UTF-8">
<%@ page import="java.util.*, com.ibm.hats.util.*" %>
<%
	Locale l = com.ibm.hats.util.HatsLocale.getDefaultRequestLocale(request);
	String text = HatsMsgs.get("com/ibm/hats/msgs/", "runtime", "IDS_AUTH_TITLE", l);

	out.println("<html><head><title>" + text + "</title></head>" + "<body  >");
	out.println("<H2>" + text + "</H2>");
	text = HatsMsgs.get("com/ibm/hats/msgs/", "runtime", "IDS_AUTH_FAILURE", l);
	out.println("<br> <H4>" + text + "</H4>");
	out.println("<FORM ACTION=\"" + request.getContextPath() + "/HATSAdmin/admin.jsp" + "\")>");
	text = HatsMsgs.get("com/ibm/hats/msgs/", "runtime", "IDS_RETRY", l);
	out.println("<INPUT TYPE='SUBMIT' NAME='submit' VALUE='" + text + "'>");
	out.println("</FORM>");
	out.println("</body></html>");
%>