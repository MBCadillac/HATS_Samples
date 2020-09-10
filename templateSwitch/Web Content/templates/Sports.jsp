<!DOCTYPE HTML>
<html lang="en">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS"%>
<head>
<meta charset="UTF-8">
<title><HATS:Util type="applicationName" /></title>
<HATS:Util type="baseHref" />
<!-- Global Style Sheet -->
<link rel="stylesheet" href="../common/stylesheets/tantheme.css" type="text/css">
<link rel="stylesheet" href="../common/stylesheets/reverseVideoTan.css" type="text/css">
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
			<h1>My Company</h1>
		</div>
	</div>
	<!-- Main -->
	<div id="main">
		<div id="navLeft">
			<div class="navLeftLinks">
				<span class="LINKSHEADER">My Company Links</span>
				<a class="BOTTOMBAR" href="http://www.ibm.com">My Company Home Page</a>
				<a class="BOTTOMBAR" href="http://www.ibm.com">My Company Map</a>
				<a class="BOTTOMBAR" href="http://www.ibm.com">My Company Employees</a>
				<a class="BOTTOMBAR" href="http://www.ibm.com">Jobs at My Company</a>
				<a class="BOTTOMBAR" href="http://www.ibm.com">My Company Articles</a>
				<br>
				<span class="LINKSHEADER">My Products</span>
				<a class="BOTTOMBAR" href="http://www.ibm.com">Main Product</a>
				<a class="BOTTOMBAR" href="http://www.ibm.com">Additional Products</a>
				<a class="BOTTOMBAR" href="http://www.ibm.com">Downloads</a>
				<a class="BOTTOMBAR" href="http://www.ibm.com">Support</a>
			</div>
			<div class="appKeypad">
				<HATS:ApplicationKeypad />
			</div>
		</div>
		<!-- Content -->
		<div id="content">
			<HATS:Transform skipBody="true">
				<P>Host screen transformation will be shown here</P>
			</HATS:Transform>
		</div>
		<div style="clear: both;"></div>
		<!-- /Content -->
	</div>
	<!-- Main -->
</body>
</html>