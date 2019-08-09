
function choose_func_Pop(obj,callparams,callback){
	$("#chooseFuncPoint_Pop").remove();
	//加载pop框内容
	obj.load("dev_test/testTaskAnalyze/chooseFuncPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#chooseFuncPoint_Pop");
		modObj.modal("show");
		initZtree(callparams);
		//初始化树结构
		function initZtree(itemTree){
			var system_id = itemTree.SYSTEM_ID;
			var system_name = itemTree.SYSTEM_NAME;
			var task_num = itemTree.TASK_NUM;
			var zNodes = new Array();
			var sycall = getMillisecond();
			
			var setting = {  
		            view: {  
		                selectedMulti: true //多点选中  
		            },	            
		            async:{dataType:"application/json"},

		            data: {  
		                simpleData: {  
		                    enable:true,  
		                    idKey: "ID",  
		                    pIdKey: "PID",  
		                    rootPId: ""  
		                }  
		            },  
		            callback: {  
		                onClick: function(event,treeId,treeNode) {
		                	
	 	                }  
		            }  
		        };  
			
			baseAjaxJsonp(dev_test+'testTaskAnalyze/querySystemTree.asp?SYSTEM_ID='+system_id+'&TASK_NUM='+task_num+'&call='+sycall+'&SID='+SID,null,function(data) {
				if (data != undefined && data != null && data.result=="true") {
					var funcPoint = data.functree;
					var chooseFunc = data.choosefunc;
					//已选功能点赋值
					var funcArray = new Array();
					 if(chooseFunc != null && chooseFunc.length > 0) {
						 for(var k = 0;k<chooseFunc.length; k++){
							 funcArray[k] = chooseFunc[k].FUNC_NO;
							 getCurrentPageObj().find("#selected").append('<option value="'+chooseFunc[k].FUNC_NO+'" pid="'+chooseFunc[k].SUPFUNC_NO+'">'+chooseFunc[k].FUNC_NAME+'</option>');
							
					 	 }
					 }
					
					//应用树
					if(funcPoint != null && funcPoint.length > 0) {
						for(var j = 0;j<funcPoint.length; j++) {
							 if($.inArray(funcPoint[j].FUNC_NO, funcArray) == -1){
								 var arr2={"ID":funcPoint[j].FUNC_NO,
			          						"PID":funcPoint[j].SUPFUNC_NO,
			          						"name":funcPoint[j].FUNC_NAME};
									zNodes.push(arr2);
							 }

						}
					}
				
					
					var treeObj = $.fn.zTree.init($("#treeFuncPoint"),setting, zNodes);
					
					treeObj.expandAll(true);//默认展开或折叠全部节点
				}else{
					alert("查询失败");
				}
			},sycall);
			
		}//初始化树结构END
		
		//保存提交
		getCurrentPageObj().find("[btn='savvFunc']").unbind("click");
		getCurrentPageObj().find("[btn='savvFunc']").click(function(){
				var options = getCurrentPageObj().find("#selected option");
				var param = {};
				var optionArr = new Array();
				for(var i = 0;i<options.length;i++){
					
					optionArr.push({"SUPFUNC_NO":options[0].getAttribute("pid"),"FUNC_NO":options[i].value});
				}
				param["OPTIONS"] = JSON.stringify(optionArr); 
				param["TASK_NUM"] = callparams.TASK_NUM;

				var saveCall = getMillisecond() + '2';
				baseAjaxJsonp(dev_test+'testTaskAnalyze/saveChooseFunc.asp?call='+saveCall+'&SID='+SID,param,function(data){
//					debugger;
					if(data.ChooseFlag=="true"){
						nconfirm("移除功能点，将删除功能点下的测试要点，确定删除？",function(){
						if(data!=undefined&&data.result=="true"){
							alert("保存成功");
							if(callback){
								callback();
							}
						}else{
							alert("保存失败");
						}
					});
					}else{
						if(data!=undefined&&data.result=="true"){
							alert("保存成功");
							if(callback){
								callback();
							}
						}else{
							alert("保存失败");
						}
					}
				},saveCall);
				modObj.modal("hide");
			});
	
	});
}



function funcMove(type){
	if("remove"==type){//移除
		var treeObj = $.fn.zTree.getZTreeObj("treeFuncPoint");
		var seles=getCurrentPageObj().find("#selected").val();
		if(seles&&seles!=""){
			if(seles instanceof Array){
				for(var i=0;i<seles.length;i++){
					var selObj = getCurrentPageObj().find("#selected option[value='"+seles[i]+"']");
					selObj.remove();
					var pNode = treeObj.getNodeByParam("ID", selObj.attr("pid"), null);
					var newNode = {ID:selObj.attr("value"),PID:selObj.attr("pid"),name:selObj.text()};
					newNode = treeObj.addNodes(pNode, newNode);
				}
			}
		}
	}else if("add"==type){//增加
		var treeObj = $.fn.zTree.getZTreeObj("treeFuncPoint");
		var nodes = treeObj.getSelectedNodes();
		if(nodes&&nodes.length>0){
			for(var i=0;i<nodes.length;i++){
				if(nodes[i].level == '2' || (nodes[i].PID == "" && nodes[i].check_Child_State == -1)){
					 treeObj.removeNode(nodes[i]);
					 getCurrentPageObj().find("#selected").append('<option value="'+nodes[i].ID+'" pid="'+nodes[i].PID+'">'+nodes[i].name+'</option>');
				}
			}
		}

	}
}





































//var url = '';
//var currentPage = getCurrentPageObj();
//
///**
// * 初始化角色数据
// * @param orgcode
// * @param actorno
// * @param actorname
// */
//function initRoleSelect(orgcode,actorno,actorname){
//	currentPage.find("#selected").empty();
//	currentPage.find("#unselected").empty();
//	baseAjax("SRole/findUserNoRole.asp",{actorno:actorno,org_code:orgcode},function(data){
//		if(data!=undefined){
//			for(var i=0;i<data.length;i++){
//				currentPage.find("#unselected").append('<option value="'+data[i].role_no+'">'+data[i].role_name+'</option>');
//			}
//		}
//	},false);
//	
//	baseAjax("SRole/findUserRole.asp",{actorno:actorno,org_code:orgcode},function(data){
//		if(data!=undefined){
//			for(var i=0;i<data.length;i++){
//				currentPage.find("#selected").append('<option value="'+data[i].role_no+'">'+data[i].role_name+'</option>');
//			}
//		}
//	},false);
//	

//}
//
//function move(type){
//	if("rmselected"==type){//移除
//		var val=getCurrentPageObj().find("#selected").val();
//		if(val&&val!=""){
//			if(val instanceof Array){
//				for(var i=0;i<val.length;i++){
//					var html=getCurrentPageObj().find("#selected option[value='"+val[i]+"']");
//					getCurrentPageObj().find("#unselected").append('<option value="'+val[i]+'">'+html.text()+'</option>');
//					html.remove();
//				}
//			}else{
//				var html=getCurrentPageObj().find("#selected option[value='"+val+"']");
//				getCurrentPageObj().find("#unselected").append('<option value="'+val+'">'+html.text()+'</option>');
//				html.remove();
//			}
//		}
//	}else if("addselected"==type){//新增
//		var val=getCurrentPageObj().find("#unselected").val();
//		if(val&&val!=""){
//			if(val instanceof Array){
//				for(var i=0;i<val.length;i++){
//					var html=getCurrentPageObj().find("#unselected option[value='"+val[i]+"']");
//					getCurrentPageObj().find("#selected").append('<option value="'+val[i]+'">'+html.text()+'</option>');
//					html.remove();
//				}
//			}else{
//				var html=getCurrentPageObj().find("#unselected option[value='"+val+"']");
//				getCurrentPageObj().find("#selected").append('<option value="'+val+'">'+html.text()+'</option>');
//				html.remove();
//			}
//		}
//	}
//}
////按钮方法
//function initQueryUserButtonEvent(){
//	currentPage.find("#setUserRule").click(function(){
//		var id = currentPage.find("#SUserTableInfo").bootstrapTable('getSelections');
//		if(id&&id.length==1){
//			initOrgUserTree(function(org_code){
//				initRoleSelect(org_code,id[0].user_no,id[0].user_name);
//			});
//			
//			currentPage.find("#setRoleUser").text(id[0].user_name);
//			currentPage.find("#setRoleUser_no").text(id[0].user_no);
//			currentPage.find("#setUserRuleModal").modal("show");
//		}else{
//			alert("请选择一条数据进行角色设置!");
//		}
//	});
//	currentPage.find("#queryUser").click(
//			function() {
//				var user_no = currentPage.find("#user_no").val();
//				var user_name = currentPage.find("#user_name").val();
//				var login_name = currentPage.find("#login_name").val();
//				var state = $.trim(currentPage.find("#user_state").val());
//				var is_banker = $.trim(currentPage.find("#is_banker").val());
//				var org_code=$.trim(currentPage.find("#org_code").val());
//				currentPage.find('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp?user_no='+user_no+'&user_name='
//					+escape(encodeURIComponent(user_name))+'&login_name='+login_name+'&state='+state+'&is_banker='+is_banker+'&org_code='+org_code});
//			});
//	//onclick="openInnerPageTab('add_user','创建用户','pages/suser/suser_add.html')"
//	currentPage.find("#addUser").click(function(){
//		pageDispatchUser(this,"addUser","");
//	});
//	currentPage.find("#reset").click(function() {
//		currentPage.find("input[name^='S.']").val("");
//		currentPage.find("select[name^='S.']").val("");
//		currentPage.find("#user_state").val(" ");
//		currentPage.find("#user_state").select2();
//		currentPage.find("#is_banker").val(" ");
//		currentPage.find("#is_banker").select2();
//	});
//	currentPage.find("#org_name").click(function(){
//		openSelectTreeDiv($(this),"userListtree_id","SOrg/queryorgtreelist.asp",{"margin-left":"170px",width:'208px'},function(node){
//			currentPage.find("#org_name").val(node.name);
//			currentPage.find("#org_code").val(node.id);
//		});
//	});
//	currentPage.find("#org_name").focus(function(){
//		currentPage.find("#org_name").click();
//	});	
///*	$("#org_name").click(function(){
//		openSOrgPop("sorgDivPermiss",{name:$("#org_name"),no:$("#org_code")});
//	});*/
//	
//	currentPage.find("#delteUser").click(function(){
//		var id = currentPage.find("#SUserTableInfo").bootstrapTable('getSelections');
//		var ids = $.map(id, function (row) {
//			return row.user_no;                  
//		});
//		if(id.length!=1){
//			alert("请选择一条数据进行修改!");
//			return ;
//		}
//		nconfirm("确定要删除该数据吗？",function(){
//			currentPage.find("#SUserTableInfo").bootstrapTable('remove', {
//				field: 'user_no',
//				values: ids
//			});
//			var url="SUser/delteuser.asp?user_no="+ids;
//			$.ajax({
//				type : "post",
//				url : url,
//				async :  true,
//				data : "",
//				dataType : "json",
//				success : function(msg) {
//					alert("删除成功！");
//				},
//				error : function() {	
//					alert("删除失败！");
//				}
//			});
//		});
//	});
//
//	//修改查询功能
//	currentPage.find("#updateUser").click(function(){
//		var id = currentPage.find("#SUserTableInfo").bootstrapTable('getSelections');
//		if(id.length!=1){
//			alert("请选择一条数据进行修改!");
//			return ;
//		}
//		var ids = $.map(id, function (row) {
//			return row.user_no;                    
//		});
//		pageDispatchUser(this,"updateUser",ids);
//	});
//	
//
//
//	
//	currentPage.find("#resetAllUserPass").click(function(){
//		baseAjax("SUser/resetAllUserPass.asp",{},function(data){
//			if(data==undefined||data.result=="false"){
//				alert("用户密码初始化失败!");
//			}else{
//				alert("用户密码初始化成功!");
//			}
//		});
//	});
//	
//	
//
//	//用户角色查询
//	$("#queryUserRole").click(function(){
//		var id = getCurrentPageObj().find("#SUserTableInfo").bootstrapTable('getSelections');
//		if(id.length!=1){
//			alert("请选择一个用户进行查看!");
//			return ;
//		}
//		var ids = $.map(id, function (row) {
//			return row.user_no;                    
//		});
//		background_openUserRolePop("background_userRolePop",{user_no:ids});
//	});
//	
//}
//
//
//	
////下拉框方法
//function initSUserType(){
//	//初始化数据
//	initSelect(currentPage.find("#user_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERSTATE"},"bb");
//	//初始化数据,是否行员
//	initSelect(currentPage.find("#is_banker"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"}," ");
//}
//
//
//function initOrgUserTree(clickCallback) {
//	currentPage.find("#selected").empty();
//	currentPage.find("#unselected").empty();
//	var setting = {
//			async : {
//				enable : true,
//				url : "SOrg/queryorgtreelist.asp",
//				contentType : "application/json",
//				type : "get",
//				autoParam: ["id"]
//			},
//			view : {
//				dblClickExpand : false,
//				showLine : true,
//				selectedMulti : false
//			},
//			data : {
//				simpleData : {
//					enable : true,
//					idKey : "id",
//					pIdKey : "pid",
//					rootPId : ""
//				}
//			},
//			callback : {
//				onClick : function(event, treeId, treeNode) {//点击后查询数据方法
//					clickCallback(treeNode.id);
//				}
//			}
//	};
//	$.fn.zTree.init(currentPage.find("#treeOrgRole"), setting);
//}
////同步OA用户
///*function synchronizationUser(){
//	$("#synchronizationUser").click(function(){
//		startLoading();
//		$.ajax({
//			type : "post",
//			url : "OA/SynchronizationUser.asp",
//			dataType : "json",
//			success : function(data){
//				if(data="true"){
//					alert("同步成功！");
//					$('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp'});
//					endLoading();
//				}else{
//					alert("同步失败！");
//					endLoading();
//				}
//			},
//			error:function(){
//				alert("同步失败！");
//				endLoading();
//			}
//		});
//
//	});
//}*/
//initQueryUserButtonEvent();
//initSUserInfo();
//initSUserType();
