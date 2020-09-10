<% out.println("<!--"); %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="hats.tld" prefix="HATS" %>
<head><HATS:VCTStylesLink/></head>
<% out.println("-->"); %>

<!-- Start of the HATS form. -->
<HATS:Form>
<!-- Insert your HATS component tags here. -->
	<div class="transformation">
		<HATS:Component type="com.ibm.hats.transform.components.FieldComponent" widget="com.ibm.hats.transform.widgets.FieldWidget" row="1" col="1" erow="-1" ecol="-1" componentSettings="" widgetSettings="mapBackgroundColors:true|allowPositionOnProtected:false|magentaBackgroundColor:#ff00ff|blinkStyle:font-style: italic|tableCellClass:|greenBackgroundColor:#00ff00|redBackgroundColor:#ff0000|characterRendering:false|linkClass:HATSLINK|mapExtendedAttributes:false|tableClass:HATSFIELDTABLE|cyanBackgroundColor:#00ffff|yellowBackgroundColor:#ffff33|underlineStyle:text-decoration: underline|preserveColors:true|readOnly:false|style:|columnSeparatorStyle:border-width: 1px; border-style: solid|whiteBackgroundColor:#ffffff|reverseVideoStyle:background-color:#666666|blueBackgroundColor:#0000ff|" textReplacement="" applyTextReplacement="false" applyGlobalRules="false"/>
	</div>
	<div class="HostKeypad">
		<HATS:HostKeypad />
	</div>
	<div class="oia">
		<HATS:OIA/>
	</div>
</HATS:Form>
<!-- End of the HATS form. -->