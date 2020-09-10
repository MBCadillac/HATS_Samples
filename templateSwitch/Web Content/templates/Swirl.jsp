<!DOCTYPE HTML>
<html lang="en">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS"%>
<head>
<meta charset="UTF-8">
<title><HATS:Util type="applicationName" /></title>
<HATS:Util type="baseHref" />
<!-- Global Style Sheet -->
<link rel="stylesheet" href="../common/stylesheets/monochrometheme.css" type="text/css">
<link rel="stylesheet" href="../common/stylesheets/reverseVideoMono.css" type="text/css">
<script src="../common/env.js"></script>

<script src="../common/lxgwfunctions.js">
	portletID = "hatsportletid";
	activeID = "default";
	formID = "HATSForm";
</script>

<script src="../common/KBS.js">
	PortletKBInited['hatsportletid'] = false;
</script>

<script src="../common/HatsJS.js"></script>
</head>
<body>
	<!-- Header -->
	<div id="header">
		<!-- Logo -->
		<div id="logo">
			<span>My Company</span>
		</div>
	</div>
	<!-- Header -->

	<!-- Main -->
	<div id="main">
		<!-- Content -->
		<div id="content">
				<HATS:Transform skipBody="true">
					<P>Host screen transformation will be shown here</P>
				</HATS:Transform>
		</div>
		<div class="appKeypad">
			<HATS:ApplicationKeypad settings="layout:horizontal" />
		</div>
		<!-- /Content -->
	</div>
	<!-- Main -->
</body>
</html>