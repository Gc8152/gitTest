(function(){
	var currentPage = getCurrentPageObj();
	//按钮方法
	function initUpdatePassEvent(){
		
		//保存
		currentPage.find("#savePassword").click(function(){
			if(!vlidate(currentPage.find("#updatePass_form"))){
				return ;
			}
			
			//先验证旧密码是否输入正确，在执行保存
			oldPassworkBlurFunc(function(){
				var old_pwd_el=currentPage.find("#old_password");
				var new_password = currentPage.find("#new_password").val();
				var password = currentPage.find("#Uspassword").val();
				var old_pwd=old_pwd_el.val();
				if(old_pwd_el.parent().find(".tag-content").length>0){
					return;
				}
				if(new_password!=password){
					alert("两次输入密码不同");
					return ;
				}
				var user_no = currentPage.find("#user_no_op").val();
				var params ={"user_no":user_no,"password":password,"old_pwd":old_pwd};
				baseAjax("SUser/updatepass.asp",params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						alert("密码修改成功！",function(){
							toLoginPage();//返回登录页面
						});
					}else{
						alert("密码修改失败！");
					}
				});
			});
		});

		var new_password_str = currentPage.find("#new_password_str");//新密码提示框
		var new_password = currentPage.find("#new_password");//新密码输入框
		//新密码提示框聚焦事件（ie8下placeholder密码框显示为黑点，且无法通过切换属性显示，故此采用双框切换显示）
		new_password_str.focus(function(){
			new_password_str.hide();//隐藏新密码提示框
			new_password.show();//显示新密码输入框
			new_password.focus();//新密码输入框获得焦点
		});
		
		//新密码输入框失焦事件
		new_password.blur(function(){
			if(new_password.val()==""){//若没有输入值
				new_password.hide();//隐藏输入框
				new_password_str.show();//显示提示框
			}
		});
	}
	
	//后台验证原密码是否输入正确
	function oldPassworkBlurFunc(func){
		var user_no = currentPage.find("#user_no_op").val();
		var password = currentPage.find("#old_password").val();
		if($.trim(password).length==0){
			return;
		}
		var params = {"user_no":user_no,"password":password};
		baseAjaxNoLoading("SUser/finduserpass.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="false") {
				//alert("旧密码错误,请再次输入旧密码");
				currentPage.find("#old_password").parent().append('<div  id="'+Math.uuid()+'"  class="tag-content" >旧密码错误,请再次输入旧密码</div>');
			}
			if(func){
				func();
			}
		});
	}
	
	//清除旧密码错误提示
	function oldPassworkFocusFunc(){
		currentPage.find("#old_password").parent().find(".tag-content").remove();
	}
	
	//旧密码聚焦和失焦事件
	function verifOldPassword(){
		var old_password=currentPage.find("#old_password");
		old_password.focus(function(){
			oldPassworkFocusFunc();
		});
		old_password.blur(function(){
			oldPassworkBlurFunc();
		});
	}
	
	initUpdatePassEvent();
	verifOldPassword();
})();