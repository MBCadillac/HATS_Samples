<!DOCTYPE HTML>
<html lang="en">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS"%>
<head>
<meta charset="UTF-8">
<title><HATS:Util type="applicationName" /></title>
<HATS:Util type="baseHref" />
<!-- Global Style Sheet -->
<link href="../common/stylesheets/medical.css" rel="stylesheet" type="text/css">
<!--[if lt IE 7]>
<style type="text/css">
input.RHBLANK,input.RHBLUE,input.RHGREEN,input.RHRED,input.RHCYAN,
input.RHWHITE,input.RHMAGENTA,input.RHBROWN,input.RHYELLOW,input.RHGRAY 
{ background-image: none !important; }
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
		<div id="m_logo">
			<div class="m_COMPANYTITLE">My Company</div>
		</div>
	</div>
	<div id="bodyTable">
		<!-- Nav -->
		<nav id="m_lvl1nav">
			<ul id="m_lvl1nav_list">
				<li class="m_lvl1nav_item"><a href="http://www.ibm.com/software/awdtools/hats/" >Main product</a></li>
				<li class="m_lvl1nav_item"><a href="http://www.ibm.com" >Additional products</a></li>
				<li class="m_lvl1nav_item"><a href="http://www.ibm.com/developerworks/downloads/ws/whats/" >Downloads</a></li>
				<li class="m_lvl1nav_item"><a href="http://www.ibm.com/software/awdtools/hats/support/" >Support</a></li>
				<li class="m_lvl1nav_item m_lvl1nav_active_item"><a href="javascript:;">Site</a></li>
		    </ul>
		</nav>
		
		<!-- Main -->
		<div id="main">
			<div id="m_lvl2nav" >
				<ul id="m_lvl2nav_list">
					<li class="m_lvl2nav_item m_lvl2nav_active_item"><a href="javascript:;">My HATS Application</a></li>
					<li class="m_lvl2nav_item"><a href="http://www.ibm.com/software/awdtools/hats/">Home Page</a></li>
					<li class="m_lvl2nav_item"><a href="http://www.ibm.com">Employee portal</a></li>
					<li class="m_lvl2nav_item"><a href="http://www.ibm.com">Jobs</a></li>
					<li class="m_lvl2nav_item"><a href="http://www.ibm.com/software/awdtools/hats/library">Articles</a></li>
			    </ul>
			</div>
			<!-- Content -->
			<div id="m_content">
				<HATS:Transform skipBody="true">
					<P>Host screen transformation will be shown here</P>
				</HATS:Transform>
				
				<div class="appKeypad">
					<HATS:ApplicationKeypad settings="layout:horizontal" />
				</div>
			</div>
			<!-- /Content -->
		</div>
		<!-- Main -->
	</div>
</body>
</html>