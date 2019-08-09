<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>report</title>
<link rel="stylesheet" type="text/css" href="css/public.css"/>
</head>
<body style="height:100%;">
	<iframe frameborder="no" src="<%=request.getAttribute("src")%>" style="height:700px; max-width: 100%;" id="reportIframe" name="reportIframe">
	</iframe>
</body>
</html>