<% out.println("<!--blank.jsp"); %>
<!DOCTYPE HTML>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page language="java" %>
<%@ taglib uri="hats.tld" prefix="HATS" %>
<html>
<head>
<meta charset="utf-8">
<HATS:VCTStylesLink/>
</head>
<body>

<link rel="stylesheet" type="text/css" href="../common/stylesheets/serene.css" />

<% out.println("-->"); %>
<script type="text/javascript" src="../common/env.js">
</script>

<script type="text/javascript" src="../common/lxgwfunctions.js">
  	portletID="hatsportletid";activeID="default";formID="HATSForm";
</script>

<script type="text/javascript" src="../common/KBS.js">
  	PortletKBInited['hatsportletid']=false;
</script>

<script type="text/javascript" src="../common/HatsJS.js">
</script>

<!-- Start of the HATS form. -->
<HATS:Form>

<!-- Insert your HATS component tags here. -->

<HATS:DefaultRendering erow="-1" col="1" settings="" ecol="-1" row="1" applyTextReplacement="true" applyGlobalRules="true"></HATS:DefaultRendering>

<HATS:HostKeypad />
</HATS:Form>
<!-- End of the HATS form. -->
<HATS:OIA/>
<% out.println("<!--blank.jsp"); %>
</body>
</html>
<% out.println("-->"); %>