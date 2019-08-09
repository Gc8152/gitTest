function pageDispatch_sdic_add() {
	// 打开页面
	closeAndOpenInnerPageTab("add_sdic", "创建类别", "pages/sdic/sdic_add.html",function(){
		// 状态下拉框
		initSelect($("#dic_add_state"), {value : "ITEM_CODE",text : "ITEM_NAME"}, {dic_code : "S_DIC_OC"});
		//初始化角色下拉框
		baseAjax('SRole/querySrole.asp',null,function(data){
			var obj=getCurrentPageObj().find("#manager_role");
			if(obj!=undefined&&data!=undefined){
				obj.empty();
				obj.append('<option value=" ">请选择</option>');
				for(var i=0;i<data.srole.length;i++){
					obj.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');	
				}
				obj.select2();
			};
		});
		// 所属菜单
		menuSdicAdd();
		// 新增保存
		sdicAdd();
	});
}

function menuSdicAdd() {
	// 所属菜单
	$("#dic_add_menuname").click(
			function() {
				openSelectTreeDivToBody($(this), "dic_menutree_id",
						"SMenu/queryAllmenu.asp",30, function(node) {
							$("#dic_add_menuname").val(node.name);
							$("#dic_add_menucode").val(node.id);
						});
			});
	$("#dic_add_menuname").focus(function() {
		$("#dic_add_menuname").click();
	});
}

function sdicAdd() {
	$("#dic_add_save").on('click', function() {
		var dic_add_code = $("#dic_add_code").val();
		var dic_add_codename = $("#dic_add_codename").val();
		var dic_add_state = $("#dic_add_state").val();
		var dic_add_memo = $("#dic_add_memo").val();
		var dic_add_menucode = $("#dic_add_menucode").val();
		var manager_role = getCurrentPageObj().find("#manager_role").val();
		// 判断编码是否重复
		if (!vlidate($("#sdic_form_add"))) {
			return;
		}
		ok = true;
		if (ok) {
			$.ajax({
				url : "SDic/findById.asp",
				type : "post",
				async : false,
				data : {
					"dic_code" : dic_add_code
				},
				dataType : "json",
				success : function(msg) {
					if (msg.result) {
						alert("类别编码重复！请重新输入！");
						ok = false;
						return;
					}
				}
			});
		}
		// 新增
		if (ok) {
			$.ajax({
				url : "SDic/save.asp",
				type : "post",
				async : false,
				data : {
					"dic_code" : dic_add_code,
					"dic_name" : dic_add_codename,
					"state" : dic_add_state,
					"memo" : dic_add_memo,
					"menu_no" : dic_add_menucode,
					"manager_role":manager_role
				},
				dataType : "json",
				success : function(msg) {
					if(msg.result=="true"){
						alert("保存成功!");
						closeCurrPageTab();
						closeAndOpenInnerPageTab("sdic_manager","字典类查询","pages/sdic/sdic_queryInfo.html");
					}else{
						alert("保存失败!");
					}

				}
			});
		}
	});
}
