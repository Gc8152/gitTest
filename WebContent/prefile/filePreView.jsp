<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	//String swfFilePath=session.getAttribute("swfpath").toString();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/flexpaper.js"></script>
<script type="text/javascript" src="js/flexpaper_handlers.js"></script>
<style type="text/css" media="screen"> 
			html, body	{ height:100%; }
			body { margin:0; padding:0; overflow:auto; }   
			#flashContent { display:none; }
        </style>
<title>文档在线预览</title>
</head>
<body> 
	<div style="position:absolute;height:100%;width:100%">
		<div id="documentViewer" class="flexpaper_viewer" style="height:100%;width:100%"></div>
		
		<script type="text/javascript"> 
		/***
		获取url后面的参数
		**/
		function getParamString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		}
		$(document).ready(function(){
			var id=getParamString("p_");
			var ftp_id=getParamString("ftp_id");
			if(id!=null || ftp_id!=null){
				var url;
				if(id!=null){
					url = '../sfile/filePreView.asp?id=' + id;
				}
				if(ftp_id!=null){
					url = '../sfile/ftpFilePreView.asp?id=' + ftp_id;
				}
			}
			/*console.log(url);*/
	        $('#documentViewer').FlexPaperViewer({
	        	config : {
					SWFFile : url,
					Scale : 0.6,
					ZoomTransition : 'easeOut',
					ZoomTime : 0.5,
					ZoomInterval : 0.2,
					FitPageOnLoad : true,
					FitWidthOnLoad : false,
					FullScreenAsMaxWindow : false,
					ProgressiveLoading : false,
					MinZoomSize : 0.2,
					MaxZoomSize : 5,
					SearchMatchAll : false,
					InitViewMode : 'Portrait',
					RenderingOrder : 'flash',
					StartAtPage : '',
					
					ViewModeToolsVisible : true,
					ZoomToolsVisible : true,
					NavToolsVisible : true,
					CursorToolsVisible : true,
					SearchToolsVisible : true,
					WMode : 'window',
					localeChain: 'en_US'
				}
	        });
		});
		</script>            
	</div>
</body>
</html>