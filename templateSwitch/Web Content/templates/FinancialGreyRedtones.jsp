<!DOCTYPE HTML>
<html lang="en">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS"%>
<head>
<meta charset="UTF-8">
<title><HATS:Util type="applicationName" /></title>
<HATS:Util type="baseHref" />
<!-- Global Style Sheet -->
<link rel="stylesheet" href="../common/stylesheets/graytheme.css" type="text/css">
<link rel="stylesheet" href="../common/stylesheets/reverseVideoGray.css" type="text/css">
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
			<span>Comprehensive and reliable financial data</span>
		</div>
	</div>
	<!-- Nav -->
	<nav id="nav">
		<ul>
			<li><a href="http://www.ibm.com/software/awdtools/hats/">Home</a></li>
			<li><a href="http://www.ibm.com">Links</a></li>
			<li><a href="http://www.ibm.com">About My Company</a></li>
			<li><a href="http://www.ibm.com">Stock Quote</a></li>
		</ul>
	</nav>

	<!-- Main -->
	<div id="main">
		<div id="navLeft">
			<div class="navLeftBtn">
				<a class="navLeftBtn" href="http://www.ibm.com">Home Page</a>
				<a class="navLeftBtn" href="http://www.ibm.com">Financial Data</a>
				<a class="navLeftBtn" href="http://www.ibm.com">Human Resources</a>
				<a class="navLeftBtn" href="http://www.ibm.com">Employees</a>
				<a class="navLeftBtn" href="http://www.ibm.com">Job Opportunities</a>
				<a class="navLeftBtn" href="http://www.ibm.com">Location</a>
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