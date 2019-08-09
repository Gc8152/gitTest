$("#GoBackSUserList").click(function(){
	closeCurrPageTab();
});

// 个人信息
function initQueryUser(obj){
	$.ajax({
		type : "post",
		url : "SUser/queryoneuser.asp?",
		async : true,
		data : {"user_no":obj},
		dataType : "json",
		success : function(data) {
			for ( var k in data) {
		        getCurrentPageObj().find("#QU"+k).text(data[k]);
			}
		},
		error : function() {
			alert("系统异常！");
		}
	});
}

maintain();
function maintain(){
	
	
	getCurrentPageObj().find("#save_gSystemInfo").click(function(){
	
	var user_mobile=getCurrentPageObj().find("#QUuser_mobile").val();
	var user_mail=getCurrentPageObj().find("#QUuser_mail").val();
	var memo=getCurrentPageObj().find("#QUmemo").val();
	var user_no=getCurrentPageObj().find("#QUuser_no").val();
	var params = {};
	/*params["user_mobile"]=QUuser_mobile;
	params["user_mail"]=QUuser_mail;
	params["memo"]=escape(encodeURIComponent(memo));
	params["user_no"]=user_no;*/
	
	baseAjax("SUser/maintain.asp?SID="+SID+"&user_mobile="+user_mobile+"&user_mail="+user_mail+"&memo="+escape(encodeURIComponent(memo))+"&user_no="+user_no,null, function(data) {
		
		if (data != undefined&&data!=null&&data.map=="true") {			
			alert("修改成功");
		}else{
			alert("修改成功");
		}
	});		
	});
}

