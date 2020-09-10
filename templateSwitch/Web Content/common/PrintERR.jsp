<!DOCTYPE HTML >
<%@ page contentType="text/html;charset=UTF-8" isErrorPage="true" %>
<%@ page language="java" %>
<%@ page import="com.ibm.hats.util.*" %>
<%@ page import="java.util.Locale" %>
<%
    Locale locale = request.getLocale();
	HatsMsgs m = new HatsMsgs("runtime",locale);
%>
<html>
  <head>
    <META charset="UTF-8">
	<title><%= m.get("PRINT_TITLE") %></title>
	<style Type="text/css">
		p { text-align:center; }
	</style>
  </head>
  <body>
  <%
  if (exception == null)
  { %>
  <p> <h3><%= m.get("PRINT_NOT_SUPPORTED") %></h3> </p> <%
  } 
  else
  { %>
  <p> <h3><%= exception.getClass().getName() %></h3>
  <pre><%= exception.getMessage() %></pre> </p> <%
  } %>
      <br>
      <p>
	  <input type="button" value="<%= m.get("PRINT_CLOSE_WINDOW_CAPTION") %>" onclick="window.close()" >
      </p>
  </body>
</html>
