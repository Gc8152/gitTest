<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>登陆超时</title>
<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
<link rel="stylesheet" href="bootstrap/css/matrix-style.css" />
<script type="text/javascript" src="js/jquery/jquery-1.9.1/jquery.min.js"></script>
<script src="js/commons/commons.js"></script>
</head>
<body>
<div id="content" class="timeout">
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span12">
				<div class="widget-box">
					<div class="widget-title">
						<span class="icon">
							<i class="icon-info-sign"></i>
						</span>
						<h5>登陆超时</h5>
					</div>
					<div class="widget-content">
						<div class="error_ex">
							<h1>sorry</h1>
							<h3>抱歉！您登陆超时了！</h3>
							<p><a onclick="toLoginPage()">点击此处重新登陆</a></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>