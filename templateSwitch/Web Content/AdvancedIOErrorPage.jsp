<%@ page contentType="text/html;charset=UTF-8" isErrorPage="true" %>
<%@ page import="java.io.StringWriter, java.io.PrintWriter, com.ibm.HostPublisher.IntegrationObject.BeanException, com.ibm.hats.common.CommonConstants" %>
<%  String destination;
    String label = (String)request.getAttribute(CommonConstants.HATS_EXISTING_CONN);
    HttpSession hatsSession = request.getSession(false);
        
    if (hatsSession != null) {
       if ((exception != null) && (exception instanceof BeanException)) {
          StringWriter sw = new StringWriter();
          PrintWriter pw = new PrintWriter(sw);
          BeanException beanException = (BeanException)exception;
       
          beanException.printStackTrace(pw);
          hatsSession.setAttribute("com_ibm_HostPub_emsg", sw.toString());
       }

       hatsSession.setAttribute("DoNotAllowRestart","true");
    }
    
    if (label != null) {
       destination = "/entry";
    }   
    else {
       destination = "/BasicIOErrorPage.jsp";
    }
%>
<jsp:forward page="<%= destination %>" />

