<!DOCTYPE HTML>
<html lang="en">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS"%>
<head>
<meta charset="UTF-8">
<title><HATS:Util type="applicationName" /></title>
<HATS:Util type="baseHref" />
<!-- Global Style Sheet -->
<link href="../common/stylesheets/industry.css" rel="stylesheet" type="text/css">

<!--[if lt IE 7]>
<style type="text/css">
input.RHBLANK,input.RHBLUE,input.RHGREEN,input.RHRED,input.RHCYAN,
input.RHWHITE,input.RHMAGENTA,input.RHBROWN,input.RHYELLOW,input.RHGRAY 
{ background-image: none !important; }
</style>
<![endif]-->
<!--[if IE]> 
<style type="text/css">
.i_lvl1nav_item { display: inline !important;}
</style>
<![endif]-->
<script type="text/javascript" src="../common/scripts/industry.js" ></script>
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
		<div id="i_logo">
			<div class="i_COMPANYTITLE">My Company</div>
		</div>
		<!-- Nav -->
		<nav id="i_lvl1nav_list">
			<ul>
				<li class="i_lvl1nav_item" id="i_lvl1nav_activeitem"><a href="javascript:;">Products</a>
					<ul>
						<li><a href="http://www.ibm.com/software/awdtools/hats/">Main product</a></li>
						<li><a href="http://www.ibm.com">Additional products</a></li>
						<li><a href="http://www.ibm.com/developerworks/downloads/ws/whats/">Downloads</a></li>
						<li><a href="http://www.ibm.com/software/awdtools/hats/support/">Support</a></li>
					</ul></li>
				<li class="i_lvl1nav_item"><a href="javascript:;">Company Links</a>
					<ul>
						<li><a href="http://www.ibm.com/software/awdtools/hats/">Home page</a></li>
						<li><a href="http://www.ibm.com">About us</a></li>
						<li><a href="http://www.ibm.com">Employee portal</a></li>
						<li><a href="http://www.ibm.com">Jobs</a></li>
						<li><a href="http://www.ibm.com/software/awdtools/hats/library">Articles</a></li>
						<li><a href="http://www.ibm.com">Site map</a></li>
					</ul></li>
			</ul>
		</nav>
	</div>
	
	<!-- Main -->
	<div id="main">
		<!-- Content -->
		<div id="i_content">
			<HATS:Transform skipBody="true">
				<P>Host screen transformation will be shown here</P>
			</HATS:Transform>
		</div>
		<div class="appKeypad">
			<HATS:ApplicationKeypad settings="layout:horizontal" />
			<a href="http://localhost:9080/pahlow/entry?hatsgv_change=change">Print View</a>
		</div>
		<!-- /Content -->
	</div>
	<!-- Main -->
	
</body>
</html>