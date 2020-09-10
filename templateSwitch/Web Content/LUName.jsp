<!DOCTYPE HTML>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page language="java" %>
<%@ page import="com.ibm.hats.common.*,  java.util.*,  com.ibm.hats.util.*, com.ibm.hats.common.connmgr.HodPoolSpec" %>
<%@ taglib uri="hats.tld" prefix="HATS" %>
<HATS:IncludeTemplate/>
<%
	String appName = null;
	Locale clientLocale = null;
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
	String actionURI = (String) pageContext.getRequest().getAttribute(CommonConstants.REQ_SUBMIT_URI);
	if (actionURI == null)
		actionURI = ((HttpServletResponse) pageContext.getResponse()).encodeURL("../" + CommonConstants.DEFAULT_ACCESS_SERVLET_NAME);
%>
<html>
<HEAD>
<title><%= ((HttpServletRequest)pageContext.getRequest()).getContextPath() %></title>
</HEAD>

<body>
<form method="GET" action="<%= actionURI %>">
<%
	String luName = "";
	for (Enumeration e = request.getParameterNames(); e.hasMoreElements();) {
		String name = (String) e.nextElement();
		String value = request.getParameter(name);
		if ((name.equalsIgnoreCase(HodPoolSpec.LU_NAME_ATTR)) && (luName.equals(""))) {
			luName = value;
		} else {
			out.println("<input type=\"hidden\" name=\"" + name + "\" value=\"" + value + "\">");
		}
	}
%>

      <TABLE class="HATSTABLE" style="margin: auto;cellSpacing:1; cellPadding:4">
        <TBODY>
        <TR>
          <TD style="width:100%">
            <TABLE border="0" style="cellSpacing:1; cellPadding:4; width:75%"> 
              <TBODY>
              <TR class="HATSSTATUSHEADER" >
                 <TD class="HATSSTATUSHEADER" style="font-size:small"><%= msgs.get("IDS_AUTH_LOGIN") %></TD>
              </TR>
              <TR>                          
                 <TD  noWrap><BR><LABEL FOR="<%=HodPoolSpec.LU_NAME_ATTR%>"><SPAN><%= msgs.get("ENTER_LUNAME") %>&nbsp;&nbsp;</SPAN></LABEL>  <INPUT size="15" name="<%=HodPoolSpec.LU_NAME_ATTR%>" id="<%=HodPoolSpec.LU_NAME_ATTR%>" value="<%= luName %>"> <BR> &nbsp;</TD>
              </TR>              
              <TR class="HATSSTATUSFOOTER" >
                 <TD class="HATSSTATUSFOOTER" STYLE="TEXT-ALIGN: right;font-size:small"><INPUT class="HATSSTATUSFOOTER" type="submit" value="<%= msgs.get("SUBMIT_BUTTON_CAPTION") %>"></TD>
              </TR>
              </TBODY>
            </TABLE>
         </TD>
       </TR>
       </TBODY>
      </TABLE>
      
</form> 
</body>
</html>