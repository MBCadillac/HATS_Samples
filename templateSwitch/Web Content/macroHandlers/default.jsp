<!DOCTYPE HTML>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page language="java" %>
<%@ page import="com.ibm.eNetwork.beans.HOD.event.*" %>
<%@ page import="com.ibm.hats.common.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.ibm.hats.util.*" %>
<%@ page import="com.ibm.hats.transform.widgets.*" %>
<%@ taglib uri="hats.tld" prefix="HATS" %>
<HEAD>
    <META name="GENERATOR" content="IBM WebSphere Studio">
    <META charset="utf-8">
</HEAD>

<SCRIPT TYPE="text/javascript">//load
</SCRIPT>

<%
	//System.out.println("got to macro default jsp");
	String sn = null;
	sn = (String) request.getAttribute(CommonConstants.FORM_SESSIONNUMBER);
	if (sn == null) {
		sn = "1";
	}
	Locale clientLocale = null;
	TransformInfo tInfo = (TransformInfo) request.getAttribute(CommonConstants.REQ_TRANSFORMINFO);
	if (tInfo != null) {
		clientLocale = tInfo.getClientLocale();
	}
	if (clientLocale == null) {
		clientLocale = (HatsLocale.getInstance().getDefaultLocale());
	}
	HatsMsgs msgs = new HatsMsgs("runtime", clientLocale);

	boolean escapeHTML = false;
	Hashtable projectHashtable = tInfo.getClassProperties();
	Properties projectProperties = (Properties) projectHashtable.get("com.ibm.hats.common.RuntimeSettings");
	if (projectProperties != null) {
		escapeHTML = CommonFunctions.getSettingProperty_boolean(projectProperties, HTMLWidgetUtilities.PROPERTY_ESCAPETAGS, false);
	}
%>
<SCRIPT TYPE="text/javascript">
	var submitted = false;
	function ms_macro(cmd, thisForm) {
		if (submitted)
			return;
		if (cmd == "ResetButton") { //document.HATSForm.reset();
			thisForm.reset();
			return;
		}
		submitted = true;
		//document.HATSForm.COMMAND.value=cmd;
		//document.HATSForm.submit();
		thisForm.COMMAND.value = cmd;
		thisForm.submit();
	}
</SCRIPT>

<HATS:Form>
	<INPUT TYPE="HIDDEN" NAME="COMMAND" VALUE="ret_macro">
	<INPUT TYPE="HIDDEN" NAME="SESSIONNUMBER" VALUE="<% try {out.print(sn);} catch (Exception e ) {}%>">
	<table>
<%
	try {
		int totalTableRows = 1;
		MacroExtractEvent meEv = null;
		VectorHashtable meEvHt = (VectorHashtable) request.getAttribute("MacroExtracts");
		HostScreen hs = tInfo.getHostScreen();
		VectorHashtable tableInfoHashTable = (VectorHashtable) request.getAttribute("MacroExtractsForTable");
		HatsBIDIServices hbs = hs == null ? new HatsBIDIServices() : new HatsBIDIServices(hs);
		if (meEvHt != null) {
			if (!meEvHt.isEmpty()) {
				//Enumeration mekey = meEvHt.keys();
				out.println("<tr><td><table>");
				//while(mekey.hasMoreElements()) {
				//meEv = (MacroExtractEvent) meEvHt.get(mekey.nextElement());
				for (int a = 0; a < meEvHt.size(); a++) {
					meEv = (MacroExtractEvent) meEvHt.getbyInt(a);

					boolean isTableFormat = false;
					boolean displayColumnHeadings = true;
					boolean endTable = true;
					Vector columns = null;
					if (tableInfoHashTable != null && !tableInfoHashTable.isEmpty()) {
						MacroExtractInfo prevTableInfo = null;
						String prevExtractName = null;
						MacroExtractInfo nextTableInfo = null;
						String nextExtractName = null;
						if (a > 0) {
							prevTableInfo = (MacroExtractInfo) tableInfoHashTable.getbyInt(a - 1);
							prevExtractName = prevTableInfo.getName();
						}
						if (a < (meEvHt.size() - 1)) {
							nextTableInfo = (MacroExtractInfo) tableInfoHashTable.getbyInt(a + 1);
							nextExtractName = nextTableInfo.getName();
						}
						MacroExtractInfo tableInfo = (MacroExtractInfo) tableInfoHashTable.getbyInt(a);
						if (tableInfo != null) {
							columns = tableInfo.getColumnList();
							if (columns != null & columns.size() != 0) {
								isTableFormat = true;
								if ((prevExtractName != null) && (prevExtractName.equals(tableInfo.getName())))
									displayColumnHeadings = false;
								else
									totalTableRows = 1;
								if ((nextExtractName != null) && (nextExtractName.equals(tableInfo.getName())))
									endTable = false;
							}
						}
					}

					if (meEv != null) {
						String name = meEv.getExtractName();
						boolean isRTLScreen = false;
						boolean isRTLExtract = false;
						String[] rows = meEv.getData();
						if (hs != null && hs.isBidi()) {
							MacroExtractInfo tableInfo = (MacroExtractInfo) tableInfoHashTable.getbyInt(a);
							isRTLExtract = tableInfo.getIsRTLScreen();
							isRTLScreen = meEv.getPS().isRTLScreen();
							for (int index = 0; index < rows.length; index++) {
								rows[index] = hbs.convertVisualToLogical(rows[index], !tableInfo.getIsRTLScreen(), true, true);
							}
						}
						if (!isTableFormat) {
							out.println("<tr><td><table class='HATSTABLE'>");
							//out.println("<tr><td>" + name + "</td></tr>");
							for (int i = 0; i < rows.length; i++) {
								//System.out.println("jsp extract line "+i+"::"+rows[i]);
								out.println("<tr class='" + (i % 2 == 0 ? "HATSTABLEEVENROW" : "HATSTABLEODDROW") + "'><td class='HATSTABLECELL'><tt>" + HTMLWidgetUtilities.htmlEscape(escapeHTML, rows[i]) + "</tt></td></tr>");
							}
							out.println("</table></td></tr>");
						} else {
							int col, row;
							ColumnExtractInfo colInfo;

							if (displayColumnHeadings) {
								out.println("  <tr><td><table class='HATSTABLE'>");
								out.println("    <tr>");
								for (col = 0; col < columns.size(); col++) {
									colInfo = (ColumnExtractInfo) columns.elementAt(col);
									out.println("      <th class='HATSTABLEHEADER'>" + HTMLWidgetUtilities.htmlEscape(escapeHTML, colInfo.name) + "</th>");
								}
								out.println("    </tr>");
							}
							for (row = 0; row < rows.length; row++) {
								out.println("    <tr class='" + (totalTableRows % 2 == 0 ? "HATSTABLEEVENROW" : "HATSTABLEODDROW") + "'>");
								totalTableRows++;
								for (col = 0; col < columns.size(); col++) {
									colInfo = (ColumnExtractInfo) columns.elementAt(col);
									if (isRTLScreen && isRTLExtract)
										out.println("      <td class='HATSTABLECELL' align='right'>"
												+ HTMLWidgetUtilities.htmlEscape(
														escapeHTML,
														Util.getDBCSShrunkString(Util.getDBCSDoubledString(rows[row], String.valueOf(hs.GetCodePage()), hs.isAccentedCharacter()).substring(colInfo.x, colInfo.x + colInfo.dx), String.valueOf(hs.GetCodePage()),
																hs.isAccentedCharacter())) + "</td>");
									else
										out.println("      <td class='HATSTABLECELL'>"
												+ HTMLWidgetUtilities.htmlEscape(
														escapeHTML,
														Util.getDBCSShrunkString(Util.getDBCSDoubledString(rows[row], String.valueOf(hs.GetCodePage()), hs.isAccentedCharacter()).substring(colInfo.x, colInfo.x + colInfo.dx), String.valueOf(hs.GetCodePage()),
																hs.isAccentedCharacter())) + "</td>");
								}
								out.println("    </tr>");
							}
							if (endTable)
								out.println("  </table></td></tr>");
						}
					}
				}
				out.println("</table></td></tr>");
			}
		}
		MacroPrompt prompt = null;
		MacroPromptInfo mpi = null;
		VectorHashtable mpHt = (VectorHashtable) request.getAttribute("MacroPrompts");
		MacroPromptContainer mpiHt = (MacroPromptContainer) request.getAttribute("MacroPromptsInfo"); //gad
		if (mpHt != null) {
			if (!mpHt.isEmpty()) {
				//Enumeration mpkey = mpHt.keys();
				out.println("<tr><td><table class='HATSTABLE'>");
				//while(mpkey.hasMoreElements()) {
				//prompt = (MacroPrompt) mpHt.get(mpkey.nextElement());
				for (int b = 0; b < mpHt.size(); b++) {
					prompt = (MacroPrompt) mpHt.getbyInt(b);

					if (mpiHt != null && !mpiHt.isEmpty())
						mpi = (MacroPromptInfo) mpiHt.getPromptInfo(b);

					String promptName = prompt.getName();
					String promptDef = prompt.getDefaultValue();
					String promptValue = prompt.getValue();
					boolean isPW = prompt.getIsPromptPassword();

					String text = "text";
					if (isPW) {
						text = "password";
					}
					int len = 10;
					String value = "";
					if ((promptValue == null) && (promptDef != null)) {
						value = promptDef;
						if (promptDef.length() > len) {
							len = promptDef.length();
						}
					} else if (promptValue != null) {
						value = promptValue;
						if (promptValue.length() > len) {
							len = promptValue.length();
						}
					}
					out.println("<tr class='HATSTABLEROW'>");
					out.println("<td class='HATSTABLECAPTIONCELL'><span class='HATSCAPTION'>" + promptName + "</span></td>");

					if (mpi != null && mpi.getScreenOrientation() != null && mpi.getScreenOrientation().equalsIgnoreCase("rtl"))
						out.println("<td class='HATSTABLECELL'><INPUT dir=\"rtl\" CLASS=\"HATSINPUT\" type=\"" + text + "\" name=\"" + promptName + "\" size=\"" + len + "\" value=\"" + value + "\"></td>");
					else
						out.println("<td class='HATSTABLECELL'><INPUT CLASS=\"HATSINPUT\" type=\"" + text + "\" name=\"" + promptName + "\" size=\"" + len + "\" value=\"" + value + "\"></td>");
					out.println("</tr>");
					//if(!isPW){ 
					//    out.println("<tr><td></td><td>current value="+promptValue+"</td></tr>");  
					//    out.println("<tr><td></td><td>default value="+promptDef+"</td></tr>");
					//} 
				}
				out.println("</table></td></tr>");
			}
		}
	} catch (Exception eeee) {
		eeee.printStackTrace();
	}
%>
		<tr>
			<td align='center'>
				<input type='button' onclick="ms_macro('ret_macro',this.form);" name='hats_macro_submit' class='ApplicationButton' value='<%=msgs.get("CONTINUE_BUTTON_CAPTION")%>' style="width: auto;">
			</td>
		</tr>
	</table>
</HATS:Form>