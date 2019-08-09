<%@ page contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8" import="java.util.*,com.runqian.report4.model.ReportDefine"%>
<%@ taglib uri="/reportJsp/runqianReport4.tld" prefix="report" %>
<%@ page import="java.net.URLDecoder"%>

<html>
<head>
<style>
	.report1{
		display:none;
	}
	.ecitic-operation {
    background: #c9161d;
    margin-bottom: 5px;
}
</style>
</head>
<body leftMargin=0 topMargin=0 rightMargin=0 bottomMargin=0>
<script language=javascript>
	var _editorBorderLeft = "1px solid red";      //填报编辑框左边框
	var _editorBorderTop = "1px solid red";       //填报编辑框上边框
	var _editorBorderRight = "1px solid red";     //填报编辑框右边框
	var _editorBorderBottom = "1px solid red";    //填报编辑框下边框
	var _editingRowBackColor = "#d1f2fe";         //填报编辑行背景色，设为空值则不标记当前编辑行
	var _calendarMainBackColor = "#fa8072";       //填报下拉日历主面板色
	var _calendarWeekColor = "#FFFFFF";           //填报下拉日历周文字色
	var _calendarDayColor = "#000040";            //填报下拉日历日期文字色
	var _calendarDayBackColor = "#ffe4e1";        //填报下拉日历日期面板色
</script>

<%
	request.setCharacterEncoding( "UTF-8" );
	String file = request.getParameter( "file" );
	String form = request.getParameter( "form" );
	String needQuery = request.getParameter( "needQuery" );
	if( needQuery == null ) needQuery = "1";
	String params = request.getParameter( "params" );	
	params = java.net.URLDecoder.decode(params,"UTF-8");
	String saveAsName = request.getParameter( "saveAsName" );
	if( saveAsName == null || saveAsName.trim().length() == 0 ) saveAsName = file;
	String needFunctionBar = request.getParameter( "needFunctionBar" );
	String border = request.getParameter( "border" );
	if( border == null || border.trim().length() == 0 ) border = "border: thin inset";
	String sscale = request.getParameter( "scale" );
	double scale = 100;
	try {
		scale = Double.parseDouble( sscale );
	}catch( Exception e ) {}
	scale = scale / 100;
	sscale = String.valueOf( scale );
	
	if( form != null && form.trim().length() > 0 ) {
	%>
	<div id=paramDiv>
		<table><tr><td>
			<report:param name="form1" paramFileName="<%=form%>"
				needSubmit="no"
				params="<%=params%>"
			/>
		</td>
		<% if( needQuery.equals( "1" ) ) { %>
		<td valign=top><a href="javascript:_submit( form1 )"><img src="images/report/rq_query.jpg" border=no style="vertical-align:middle"></a></td>
		<% } %>
		</tr></table>
		<hr>
	</div>
	<%}
	String appmap = request.getContextPath();
	String excelImage = "<img src='" + appmap + "/images/report/rq_excel.gif' border=no style='vertical-align:middle' alt='存为Excel'>";
	String wordImage = "<img src='" + appmap + "/images/report/doc.gif' border=no style='vertical-align:middle' alt='存为Word'>";
	String printImage = "<img src='" + appmap + "/images/report/print.gif' border=no style='vertical-align:middle' alt='打印报表'>";
	/* String pdfImage = "<img src='" + appmap + "/images/rq_pdf.gif' border=no style='vertical-align:middle' alt='存为Pdf'>"; */
	
%>
<!-- 增加分页按钮 -->
<div class="ecitic-operation"
><input type="button" value="首页" onclick="report1_toPage(1)">
<input type="button" value="上一页" onclick="report1_toPage(report1_getCurrPage()-1)"> 第<font id=c_page_span></font>页 共<font id="t_page_span"></font>页   <input type="button" value="下一页" onclick="report1_toPage(report1_getCurrPage()+1)"><input type="button" value="尾页" onclick="report1_toPage(report1_getTotalPage())"></div>
<!--<input name='print_btn' type='button' class='btn001' value='打印' onClick="report1_print();return false;"> -->
<%
	if( needFunctionBar.equals( "1" ) ) { %>
			<a href="#" onClick="report1_saveAsExcel();return false;"><%=excelImage%></a><%-- <a href="#" onClick="report1_saveAsPdf();return false;"><%=pdfImage%> </a>--%>
			<a href="#" onClick="report1_saveAsWord();return false;"><%=wordImage%></a>
			<!--<a href="#" onClick="report1_print();return false;"><%=printImage%></a>  -->
<%}%>
<report:html name="report1" reportFileName="<%=file%>"
	scale="<%=sscale%>"
	params="<%=params%>"
	excelPageStyle="0"
	needScroll="no"
	needPageMark="yes"
	scrollBorder="<%=border%>"
	selectText="yes"
	promptAfterSave="yes"
	funcBarLocation=""
	saveAsName="<%=saveAsName%>"
	backAndRefresh="no"
	height="-1"
	needPrint="yes"
/>
<!-- <div id=div1 style="width:100%;height:100%"></div> -->

<script language="javascript">
	//设置分页显示值
	document.getElementById( "t_page_span" ).innerHTML=report1_getTotalPage();
	document.getElementById( "c_page_span" ).innerHTML=report1_getCurrPage();
</script>

<script language=javascript >
	document.body.style.overflow = "hidden";
	window.onresize = myResize;
	function myResize() {
		var scrolldiv = document.getElementById( "report1_scrollArea" );
		if( scrolldiv != null ) {
			var div1 = document.getElementById( "div1" );
			div1.style.display = "";
			var h = div1.offsetHeight;
			h -= getHeightX( document.body );
			var paramDiv = document.getElementById( "paramDiv" );
			if( paramDiv != null ) h -= paramDiv.offsetHeight;
			var functionBar = document.getElementById( "functionBar" );
			if( functionBar != null ) h -= functionBar.offsetHeight;
			if( ! document.all ) {
				h -= 3;
				scrolldiv.style.width = scrolldiv.offsetWidth - 4;
			}
			//scrolldiv.style.height = "1000px"
			//document.getElementById( "report1_contentdiv" ).style.height="800px";
			_resizeScroll();
			div1.style.display = "none";
		}
	}
	myResize();
		
	//parent.document.body.style.height=document.body.scrollHeight;
	//parent.document.body.style.width = document.getElementById( "report1").scrollWidth + 10;
	//alert(parent.document.body.clientHeight+"px");
	parent.document.getElementById( "test1").style.display = "block";
    parent.document.getElementById( "test1").style.height=document.getElementById( "report1").scrollHeight + 100;
    //parent.document.getElementById( "test1").style.width = document.getElementById( "report1").scrollWidth + 10;
    if(document.getElementById( "report1").scrollWidth + 10 <= parent.document.body.clientWidth){
    	parent.document.getElementById( "test").style.width = parent.document.body.clientWidth;
    }else{
    	parent.document.getElementById( "test").style.width = document.getElementById( "report1").scrollWidth + 10;
    }
    if(parent.reportInitCallback){
    	var params={width:parent.document.getElementById( "test").style.width};
    	parent.reportInitCallback(params);
    }
    parent.document.getElementById("query").disabled = false;
    parent.document.getElementById("reset").disabled = false;
    var loding = parent.document.getElementById("loding");
    	if(loding == null || loding == undefined){}else{
    		loding.style.display = "none";
    	}
    //alert( $(".tit_bg01_right",window.parent.document).width());
    //window.parent.document.body.style.width)
    //$(".tit_bg01_right",window.parent.document).width(window.parent.document.body.style.width); 
   // alert($(".tit_bg01_right",window.parent.document).width());
    //alert(parent.document.getElementById( "test").style.width);
	function setActorSkillNeedInfo(empSid,actorno,actorname){
		var url = 'queryYcomsUserskillDetail.jsp?actorno='+actorno+'&empSid='+empSid+'&actorname='+actorname;
		url = encodeURI(url);
		window.open(encodeURI(url),"userSkill");
		
		
	}
	
</script>

</body>
</html>
