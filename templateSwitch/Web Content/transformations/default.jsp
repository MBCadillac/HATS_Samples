<% out.println("<!--"); %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS" %>
<head><HATS:VCTStylesLink/></head>
<% out.println("-->"); %>
<script type="text/javascript" src="../common/env.js">
</script>

<script type="text/javascript" src="../common/lxgwfunctions.js">
</script>

<script type="text/javascript">
    portletID="hatsportletid";activeID="default";formID="HATSForm";
</script>

<script type="text/javascript" src="../common/KBS.js">
</script>

<script type="text/javascript">
    PortletKBInited['hatsportletid']=false;
</script>

<script type="text/javascript" src="../common/HatsJS.js">
</script>

<!-- Start of the HATS form. -->

<HATS:Form>
<!-- Insert your HATS component tags here. -->
	<div class="transformation">
		<HATS:DefaultRendering/>
	</div>
	<div class="HostKeypad">
		<HATS:HostKeypad />
	</div>
	<div class="oia">
		<HATS:OIA/>
	</div>
</HATS:Form>
<!-- End of the HATS form. -->