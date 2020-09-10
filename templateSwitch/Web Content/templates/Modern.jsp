<!DOCTYPE HTML>
<html lang="en">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS"%>
<head>
<meta charset="UTF-8">
<title><HATS:Util type="applicationName" /></title>
<HATS:Util type="baseHref" />
<!-- Global Style Sheet -->
<link rel="stylesheet" href="../common/stylesheets/whitetheme.css" type="text/css">
<link rel="stylesheet" href="../common/stylesheets/reverseVideoWhite.css" type="text/css">
<style type="text/css">
body {
	background-color: #ccf;
}

TABLE.HostKeypad {
	border-style: none;
	background-color: white;
	margin: 0px 0px 0px 4px;
}

.extraBackground {
	background-color: #ccf;
	margin: 0px;
	padding: 0px;
}

.keySection {
	margin: 0px;
	padding: 0px;
	background-color: white
}

.renderSection {
	margin-top: 4px;
	background-color: white
}

.purple {
	background-color: white;
	width: 100%;
}

.purple .topright {
	background: transparent url(../common/images/purple_right_t.gif)
		no-repeat scroll right top;
}

.purple .bottomright {
	background: transparent url(../common/images/purple_right_b.gif)
		no-repeat scroll right bottom;
}

.purple .topleft {
	background: transparent url(../common/images/purple_left_t.gif)
		no-repeat scroll left top;
}

.purple .bottomleft {
	background: transparent url(../common/images/purple_left_b.gif)
		no-repeat scroll left bottom;
}

#topDiv {
	display: inline-block;
	width: 100%;
}

#imgDiv {
	float: left;
}
#AppKeypadDiv {
	float: right;
}
</style>
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
	<div id="topDiv">
		<div id="imgDiv"><img src="../common/images/modern_image_pda.gif" alt="Modern Image PDA" width="37" height="32"></div>
		<div id="AppKeypadDiv"><HATS:ApplicationKeypad settings="layout:horizontal" /></div>
	</div>
	<div class="roundedcornermodule purple">
		<div class="topright">
			<div class="topleft">
				<div class="bottomright">
					<div class="bottomleft">
						<!-- Main -->
						<div id="main">
							<!-- Content -->
							<div id="content">
								<HATS:Transform skipBody="true">
									<P>Host screen transformation will be shown here</P>
								</HATS:Transform>
							</div>
							<!-- /Content -->
						</div>
						<!-- Main -->
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>