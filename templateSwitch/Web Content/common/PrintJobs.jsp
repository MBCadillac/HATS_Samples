<!DOCTYPE HTML>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page errorPage="PrintERR.jsp" %>
<%@ page language="java" %>
<%@ page import="com.ibm.hats.runtime.*" %>
<%@ page import="com.ibm.hats.common.*" %>
<%@ page import="java.util.Locale" %>
<%@ taglib uri="hats.tld" prefix="HATS" %>

<%
	TransformInfo tInfo = (TransformInfo) request.getAttribute(CommonConstants.REQ_TRANSFORMINFO);
	Locale locale = tInfo.getClientLocale();
	PrintResourceHandler handler = (PrintResourceHandler) request.getAttribute(RuntimeConstants.REQ_PRINT_RESOURCE);
%>

<html>
  <head>
    <HATS:Util type="baseHref" />
    <title><%= PrintNLS.getPrintTitle(locale) %> [<%= handler.getHost() %>]</title>
    <link rel="stylesheet" href="../common/stylesheets/PrintJobWindow.css" type="text/css">
  <META charset="UTF-8">
</head>
  <body alink="#0000ff" bgcolor="#ffffff" link="#6699cc" vlink="#996699" onload="window.focus()">
    <h2 class="PrintJobHeading"><%= PrintNLS.getPrintHeading(locale) %></h2>
    <br><br>
    <table style= "width:100%">
      <tr>
        <td width="60%">
          <HATS:PrintSessionConnection />
        </td>
        <td align="right">
          <HATS:PrintLUName />
        </td>
      </tr>
    </table>
    <br>
    <a href="<%= response.encodeURL( handler.getAppURL() + "?pjAction=refresh&amp;httpSessionID=" + handler.getHttpSessionID()) %>" >
        <%= PrintNLS.getPrintRefreshList(locale) %>
        <img src="../common/images/Refresh.gif" align="top" alt="<%= PrintNLS.getPrintRefreshList(locale) %>" border="0" hspace="8" height="13" width="16" >
    </a>

    <HATS:PrintJobList />

    <a href="<%= response.encodeURL(handler.getAppURL() + "?pjAction=refresh&amp;httpSessionID=" + handler.getHttpSessionID()) %>" >
        <%= PrintNLS.getPrintRefreshList(locale) %>
        <img src="../common/images/Refresh.gif" align="top" alt="<%= PrintNLS.getPrintRefreshList(locale) %>" border="0" hspace="8" height="13" width="16" >
    </a>
    <br>
    <br>
    <form name="PrintForm" action="<%= response.encodeURL(handler.getAppURL()) %>" method="get">
      <input type="hidden" name="pjAction" value="" >
      <input type="hidden" name="httpSessionID" value="<%= handler.getHttpSessionID() %>" >
      <input type="hidden" name="jobID" value="" >
      <HATS:PrintJobDeleteAllButton />
      &nbsp;&nbsp;
      <input type="button" value="<%= PrintNLS.getPrintCloseWindowCaption(locale) %>" onclick="window.close()" >
    </form>
  </body>
</html>