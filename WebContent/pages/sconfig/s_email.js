//修改邮箱配置信息
$("#svaeEmail").click(function(){
	if(!vlidate($("#email_from"))){
		return ;
	}
	var email_ip=$("#email_ip").val();//邮箱服务器地址
	var email_name=$("#email_name").val();//邮箱名称
	var email_num=$("#email_num").val();//邮箱账号
	var email_password=$("#email_password").val();//邮箱密码
	var mobile_address=$("#mobile_address").val();//短信服务地址
	var contentManager_address=$("#contentManager_address").val();//内容管理服务接口地址
	var param={
			"email_ip":email_ip,
			"email_name":email_name,
			"email_num":email_num,
			"email_password":email_password,
			"mobile_address":mobile_address,
			"contentManager_address":contentManager_address
			};
	$.ajax({
		type : "post",
		url : "SConfig/updateEmail.asp",
		async :  true,
		data : param,
		dataType : "json",
		success : function(msg) {
			if(msg.result=="true"){				
				alert("保存成功");											
			}else{
				alert("系统异常，请稍后！");
			}
		},
		error : function() {						
		}
	
	});
});
//初始化页面数据
function findEmailInfo(){
	$.ajax({
		type : "post",
		url : "SConfig/findEmailInfo.asp",
		async :  true,
		data : "",
		dataType : "json",
		success : function(msg) {
			$("#email_ip").val(msg.email_ip);
			$("#email_name").val(msg.email_name);
			$("#email_password").val(msg.email_password);
			$("#email_num").val(msg.email_num);
			$("#mobile_address").val(msg.mobile_address);
			$("#contentManager_address").val(msg.contentManager_address);
		},
		error:function(){}
	});
}
findEmailInfo();