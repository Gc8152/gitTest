<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ page import="com.yusys.Utils.MD5"%>
<%@ page import="com.yusys.entity.SUser"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>附件上传</title>
<link rel="stylesheet" type="text/css" href="uploadify.css">
<link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css" />
<%
	SUser suser =null;
	try{
		suser = (SUser) request.getSession().getAttribute("userinfo");
	}catch(Exception e){
	}
	if(suser==null){
		suser=new SUser();
	}
	String user_no=suser.getUser_no();
	String m=MD5.getMD5ofStr(user_no+MD5.PASSWORDTYPE);
%>
<style type="text/css">
#file_upload {
	padding-top: 5px;
	padding-left: 20px;
}
#file_upload-queue{
	overflow: auto;
    height: 160px;
}
#upload_opt {
	line-height: 30px;
	height: 30px;
	float: right;
	padding-right: 30px;
	padding-top: 5px;
}
.cancel a{
	height: 13px !important;
    width: 13px !important;
}
.cancel a:hover{
	background-color: #D8C9C9;
	height: 13px;
    width: 13px;
}
</style>
</head>
<body>
	<div id="upload_opt">
		<a href="javascript:$('#file_upload').uploadify('cancel','*')">清空列表</a>
		<a href="javascript:$('#file_upload').uploadify('upload', '*')">开始上传</a>
	</div>
	<div id="file_upload"></div>
	<script type="text/javascript"
	src="../../js/jquery/jquery-1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="jquery.uploadify.min.js"></script>
<script>
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
	var uploadUrl='../../sfile/uploadFile.asp?path_id=';
	if(getParamString("isSvn")){
		uploadUrl='../../sfileSvn/uploadFile.asp?path_id=';
	}
	
	$(document)
			.ready(
					function() {
						var path_id = getParamString("path_id");
						var file_id = getParamString("file_id");
						$("#file_upload")
								.uploadify(
										{
											'buttonText' : '选择文件',
											'height' : 30,
											'swf' : 'uploadify.swf',
											'uploader' : '',
											'width' : 120,
											'auto' : false,
											'onUploadStart' : function(file) {
												$("#file_upload")
														.uploadify(
																'settings',
																'uploader',
																		uploadUrl
																		+ path_id
																		+ '&file_id='
																		+ file_id
																		+ "&u=<%=user_no%>"
																		+ "&m=<%=m%>"
																		+ '&file_name='
																		+ escape(encodeURIComponent(file.name)));
											},
											'fileObjName' : 'file',
											'onUploadSuccess' : function(file,
													data, response) {
												var dt={};
												try{
													dt=eval('(' + data+ ')');
												}catch(e){}
												
												if (data != null
														&& dt.result == "true") {
													
												} else {
													alert("上传失败!"+(dt.msg||""));
												}
											},
											'onUploadError' : function(file, errorCode, errorMsg) {
													alert("上传失败，文件名已存在!");
											}
										});
					});
</script>
</body>
</html>