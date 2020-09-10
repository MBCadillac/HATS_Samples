<!DOCTYPE HTML>
<%@ page contentType="text/html;charset=UTF-8" isErrorPage="true" %>
<%@ page import="java.util.*, java.text.DateFormat, java.io.StringWriter, java.io.PrintWriter, com.ibm.HostPublisher.IntegrationObject.BeanException, com.ibm.hats.util.*" %>
<HTML><HEAD>
<META charset="UTF-8">
<%
  Locale clientLocale = HatsLocale.getInstance().getDefaultLocale();
  if (Ras.anyTracing) { Ras.traceEntry("JSP:"+this.getClass().getName(), "_jspService", clientLocale); }
  HatsMsgs msgs = new HatsMsgs("runtime", clientLocale);
  String runtimeInitError1 = msgs.get("IO_ERROR_PAGE_RUNTIMEINITERROR1");
  String runtimeInitError2 = msgs.get("IO_ERROR_PAGE_RUNTIMEINITERROR2.");
  String runtimeBusyError = msgs.get("IO_ERROR_PAGE_RUNTIMEBUSYERROR");
  String generalError1 = msgs.get("IO_ERROR_PAGE_GENERALERROR1");
  String generalError2 = msgs.get("IO_ERROR_PAGE_GENERALERROR2");
  String specificError = msgs.get("IO_ERROR_PAGE_SPECIFICERROR");
  String httpSessionError = msgs.get("IO_ERROR_PAGE_HTTPSESSIONERROR");
  String hpError = msgs.get("IO_ERROR_PAGE_HPERROR");
  String hpServerName = msgs.get("IO_ERROR_PAGE_HPSERVERNAME");
  String hpIPAddress = msgs.get("IO_ERROR_PAGE_HPIPADDRESS");
  String hpAdditionalInfo = msgs.get("IO_ERROR_PAGE_HPADDITIONALINFO");
  String hpErrorReceivedBy = msgs.get("IO_ERROR_PAGE_HPERRORRECEIVEDBY");
  String hpErrorInfo = msgs.get("IO_ERROR_PAGE_HPERRORINFO");
;
%>
<title>
<% out.print(hpError); %>
</title>
<style type="text/css">
 BODY  { font-family: sans-serif; }
 H1    { font-family: sans-serif; font-weight: 700; background=blue; color=white; }
 .INFO { padding-top: 10px; padding-left: 10px; padding-bottom: 10px; background=#C0C0C0; }
</style>
</HEAD><BODY>

<%
// throw new Exception("OOPS");  // try to throw to secondary error page
HttpSession hp_session = request.getSession(false);
out.println("<h1>" + hpError + "</h1>");
%>

<table style= "width:100%"><tr><td width="30%">&nbsp;</td><td class=info>

<%
DateFormat df = DateFormat.getDateTimeInstance(DateFormat.FULL, DateFormat.FULL);
out.println("<p>"+ df.format(new java.util.Date()) + "</p>");

try
{
  java.net.InetAddress myNetAddress = java.net.InetAddress.getLocalHost();
  out.print("<p>" + hpServerName);
  out.println(myNetAddress.getHostName() + "</p>");
  out.print("<p>" + hpIPAddress);
  out.println(myNetAddress.getHostAddress() + "</p>");
}
catch (Exception e ) {}
%>

</td></tr></table>

<%
if (hp_session != null)
{
  if (exception == null)
  { // Allow this JSP to work for old EJB/IO's by trying to retrieve the exception the old (HP3.5) way
    exception = (Exception) hp_session.getAttribute("com_ibm_HostPub_emsg");   // get error message
  }

  if (exception != null)
  {
    if (exception instanceof BeanException)
    { // Exceptions thrown by doHPTransaction() call will be of this type
      StringWriter  sw            = new StringWriter();
      PrintWriter   pw            = new PrintWriter(sw);
      BeanException beanException = (BeanException) exception;

      // ---- An example (commented-out) of a conditional error page using the HATS message number
      // String emsgNumberString;       // HATS error message number
      // try
      // {
      //   emsgNumberString = beanException.getMessage().substring(3,7);  // get HATS message number
      // }
      // catch (Exception e) { emsgNumberString = "0000"; }

      if (beanException.isServerRuntimeInitError())
        out.println("<h3>" + runtimeInitError1 + " " + runtimeInitError2 + "</h3>");
      else if (beanException.isServerRuntimeBusyError())
        out.println("<h3>" + runtimeBusyError + "</h3>");
      else
      {
        // ---- A commented-out example of a conditional error page using the message number
        // if (emsgNumberString.equals("6003"))    // if message number 6003 received
        // {
        //   out.println("<h3>" + generalError1 + " " + generalError2 + "</h3>" );
        //   out.println( specificError + "<p>" + exception.getMessage() );
        // }
        // else
        // {

        out.println("<h3>" + generalError1 + " " + generalError2 + "</h3>" );
        out.println( specificError + "<p>" + exception.getMessage() );

        // }
      }

      // Additional information:
      beanException.printStackTrace(pw);  // copies it to string variable sw
      out.println("<p><div class=info>" + hpAdditionalInfo);

      Object errorIO = hp_session.getAttribute("c_i_H_IO");
      if (errorIO != null)
        out.println("<p>" + hpErrorReceivedBy + "<br>&nbsp;&nbsp;&nbsp;" + errorIO.toString() + "</p>");

      out.print("<p>" + hpErrorInfo + "<pre>" + sw.toString());
      out.println("</pre></p></div></p>");

    }
    else // exception is non-BeanException
    {
      out.println("<h3>" + generalError1 + " " + generalError2 + "</h3>" );
      out.println( specificError + "<p>" + exception.getMessage() + "</p>" );
    }
  }
  else  // exception null
  {
   out.println("<h3>" + generalError1 + " " + generalError2 + "</h3> ");
   out.println( httpSessionError );
  }

  if (hp_session.getAttribute("newSession") != null) // created a new session in Bean?
    hp_session.invalidate();                         // get rid of it
}
else  // session null
{
 out.println("<h3>" + generalError1 + " " + generalError2 + "</h3> ");
 out.println( httpSessionError );
}

%>

</BODY>
</HTML>
