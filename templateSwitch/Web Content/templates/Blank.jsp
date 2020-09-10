<!DOCTYPE HTML>
<html lang="en">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS"%>
<head>
<meta charset="UTF-8">
<title><HATS:Util type="applicationName" /></title>
<HATS:Util type="baseHref" />

<!-- See the User's and Administration Guide for information on using templates and stylesheets -->
<link rel="stylesheet" href="../common/stylesheets/whitetheme.css" type="text/css">
<link rel="stylesheet" href="../common/stylesheets/reverseVideoBlack.css" type="text/css">

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
<!-- Main -->
	<div id="main">
		<!-- Content -->
		<div id="content">
			<HATS:Transform skipBody="true">
				<P>Host screen transformation will be shown here</P>
			</HATS:Transform>
		</div>
		<!-- /Content -->
		<div class="appKeypad">
			<HATS:ApplicationKeypad settings="layout:horizontal" />
		</div>
	</div>
<!-- /Main -->
	<a href="http://localhost:9080/pahlow/entry?hatsgv_change=no">HATS View</a>
</body>
</html>