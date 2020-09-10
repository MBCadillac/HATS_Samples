<?xml version="1.0"?>

<!--                                                                                -->
<!--                                                                                -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!-- <xsl:output method="xml" indent="yes" doctype-system="http://127.0.0.1:8008/style/newHostPublisher.dtd"/> -->
<xsl:output method="xml" indent="no"/>

<!-- <xsl:strip-space elements="*"/> -->

<xsl:template match="/">
    <com.ibm.HostPublisher.IntegrationObject.properties>
    <xsl:apply-templates/>
    </com.ibm.HostPublisher.IntegrationObject.properties>
</xsl:template>

<xsl:template match="/*">
   <xsl:apply-templates/>
</xsl:template>

<xsl:template match="com.ibm.HostPublisher.IntegrationObject.properties">
  <xsl:apply-templates/>
</xsl:template>

<xsl:template match="inputProperties">
<inputProperties>
<xsl:apply-templates/>
</inputProperties>
</xsl:template>

<!-- Template for outputProperty Elements -->
<xsl:template match="outputProperties">
<outputProperties>
<!-- Need number of nodes in nodeset, and number of nodesets -->

<xsl:variable name="numberofsets">
<xsl:value-of select="count(/descendant::node()/value[position()=2])"/>
</xsl:variable>

<xsl:variable name="singleofsets">
<xsl:value-of select="count(/descendant::node()/value[(position()=last()) and (position() = 1)])"/>
</xsl:variable>

<xsl:variable name="numbervalues">
<xsl:value-of select="count(/descendant::node()/value[position()!=0])"/>
</xsl:variable>

<xsl:variable name="numbernodes">
<xsl:value-of select="($numbervalues - $singleofsets) div $numberofsets"/>
</xsl:variable>

<!-- For debug only:
<numberofnodesets>
<xsl:value-of select="$numberofsets"/>
</numberofnodesets>

<numberofsinglesets>
<xsl:value-of select="$singleofsets"/>
</numberofsinglesets>

<numberofnodes>
<xsl:value-of select="$numbernodes"/>
</numberofnodes>

<numberofvalues>
<xsl:value-of select="$numbervalues"/>
</numberofvalues>
end of debug -->

<Table>

<xsl:call-template name="outerloop">
    <xsl:with-param name="numouter">
      <xsl:value-of select="$numbernodes"/>
    </xsl:with-param>
    <xsl:with-param name="numinner">
      <xsl:value-of select="$numberofsets"/>
    </xsl:with-param>
    <xsl:with-param name="numoriginal">
      <xsl:value-of select="$numbernodes"/>
    </xsl:with-param>
  </xsl:call-template>

</Table>

<xsl:apply-templates/>

</outputProperties>
</xsl:template>

<xsl:template match="outputProperty">
<xsl:apply-templates/>
</xsl:template>


<xsl:template name="outerloop">
   <xsl:param name="numouter"/>
   <xsl:param name="numinner"/>
   <xsl:param name="numoriginal"/>
   <!-- For Debug Only:
   <outerLoop>
   <outervalue>
   <xsl:value-of select="$numouter"/>
   </outervalue>
   <innervalue>
   <xsl:value-of select="$numinner"/>
   </innervalue>
   </outerLoop>
   end of Debug -->

   <dataRecord>

   <!-- <xsl:for-each select="//value[position()=(number($numoriginal) - number($numouter))]"> -->
   <xsl:for-each select="/descendant::node()/value[(position()=(number($numoriginal) - number($numouter))) and not((position()=1) and (position()=last()))]">
	 <xsl:variable name="myOutName">
	 <xsl:value-of select="parent::node()/@name"/>
	 </xsl:variable>
     <outputProperty name="{$myOutName}">
     <xsl:value-of select="."/>
	 </outputProperty>
   </xsl:for-each>

   </dataRecord>

   <xsl:variable name="oneLess">
   <xsl:value-of select="number($numouter) - 1"/>
   </xsl:variable>

   <xsl:if test="0 &lt; $numouter">
       <xsl:call-template name="outerloop">
           <xsl:with-param name="numouter">
		      <xsl:value-of select="$oneLess"/>
		   </xsl:with-param> 
		   <xsl:with-param name="numinner">
		      <xsl:value-of select="$numinner"/>
		   </xsl:with-param>
           <xsl:with-param name="numoriginal">
		      <xsl:value-of select="number($numoriginal)"/>
		   </xsl:with-param> 
       </xsl:call-template> 
   </xsl:if>
</xsl:template>


<xsl:template match="value[not((position()=1) and (position()=last()))]">
</xsl:template>


<xsl:template match="outputProperty/value[(position()=1) and (position()=last())]">
	 <xsl:variable name="myOutName">
	 <xsl:value-of select="parent::node()/@name"/>
	 </xsl:variable>	 	
     <outputProperty name="{$myOutName}">
     <xsl:value-of select="."/>
	 </outputProperty>	 
</xsl:template>

<xsl:template match="inputProperty/value[(position()=1) and (position()=last())]">
	 <xsl:variable name="myOutName">
	 <xsl:value-of select="parent::node()/@name"/>
	 </xsl:variable>	 	
     <inputProperty name="{$myOutName}">
     <xsl:value-of select="."/>
	 </inputProperty>	 
</xsl:template>

<!-- Template for attributes not handled elsewhere -->
<xsl:template match="@*">
<NotHandledElsewhere>
<xsl:value-of select="."/>
</NotHandledElsewhere>
</xsl:template>


<!-- Template for text nodes -->
<xsl:template match="text()">
<TEXTNODES>
<xsl:value-of select="."/>
</TEXTNODES>
</xsl:template>

<!-- Template for cdata nodes -->
<xsl:template name="cdata">
<CDATANODES>
<xsl:value-of select="."/>
</CDATANODES>
</xsl:template>

<!-- Template for elements not handled elsewhere (leaf nodes) -->
<!--
<xsl:template match="*">
<MATCHSTAR>
<xsl:value-of select="."/>
</MATCHSTAR>
</xsl:template>
 -->

<!-- Template for elements with only text children 
<xsl:template match="*[text() and not(comment() or processing-instruction() or *)]">
<TEXTONLYCHILDREN>
<xsl:value-of select="."/>
</TEXTONLYCHILDREN>
</xsl:template>
-->

<!-- Template for elements with element children -->
<!-- <xsl:template match="*[*]">
<ELEMENTSELEMENTCHILDREN>
<xsl:value-of select="name(.)"/>
<xsl:apply-templates select="@*"/>
<xsl:apply-templates/>
<xsl:value-of select="name(.)"/>
</ELEMENTSELEMENTCHILDREN>
</xsl:template> -->

</xsl:stylesheet>
