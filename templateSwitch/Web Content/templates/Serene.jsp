<!DOCTYPE HTML>
<html lang="en">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS"%>
<head>
<meta charset="UTF-8">
<title><HATS:Util type="applicationName" /></title>
<HATS:Util type="baseHref" />
<link rel="stylesheet" type="text/css" href="../common/stylesheets/serene.css" />
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
			<span>IBM Enterprise Modernization</span>
		</div>
		<!-- Nav -->
		<nav id="nav">
			<ul>
				<li><a href="http://www.ibm.com/software/awdtools/hats/">Home page</a></li>
				<li><a href="http://www.ibm.com">About us</a></li>
				<li><a href="http://www.ibm.com">Employee portal</a></li>
				<li><a href="http://www.ibm.com">Jobs</a></li>
				<li><a href="http://www.ibm.com/software/awdtools/hats/library">Articles</a></li>
				<li><a href="http://www.ibm.com">Site map</a></li>
			</ul>
		</nav>
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