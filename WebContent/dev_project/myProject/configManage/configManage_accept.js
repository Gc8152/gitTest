;function initconfigManageAcceptLayout(id, config_id){
	var currTab = getCurrentPageObj();
	var form = currTab.find("#configManage_accept_form");
	currTab.find("input[name=PROJECT_ID]").val(id);
	currTab.find("input[name=CONFIG_ID]").val(config_id);
	var revise=currTab.find("#REVISE_CON");
	currTab.find("#CONFIRM_INCON_CONFIG").bind('change', function(e) {
		var inputs = form.find("input");
		var textareas = form.find("textarea");
		if($("#CONFIRM_INCON_CONFIG").val() == 02){//确认不符合项为否，是否修正必须为否
			revise.val('02');
			revise.select2();
			revise.attr("disabled",true);
			currTab.find("#RECORD_DESCR_ID").attr("validate","v.required").attr("valititle","该项为必填项");
			for (var i = 0; i < inputs.length; i++) {
				form.find("input[reqc=reqc]").removeAttr("validate");
				form.find("input[reqc=reqc]").parent().find("strong").remove();
			}
			for (var i = 0; i < textareas.length; i++) {
				form.find("textarea[reqc=reqc]").removeAttr("validate");
				form.find("textarea[reqc=reqc]").parent().find("strong").remove();
			}
			initVlidate(currTab);
		}else{
			currTab.find("#RECORD_DESCR_ID").removeAttr("validate");
			currTab.find("#RECORD_DESCR_ID").parent().find("strong").remove();
			for (var i = 0; i < inputs.length; i++) {
				form.find("input[reqc=reqc]").attr("validate","v.required").attr("valititle","该项为必填项");
			}
			for (var i = 0; i < textareas.length; i++) {
				form.find("textarea[reqc=reqc]").attr("validate","v.required").attr("valititle","该项为必填项");
			}
			initVlidate(currTab);
			revise.removeAttr("disabled"); 
		}
	});
	//提交操作
	var submit = currTab.find("#configManage_accept_sumit");
	submit.click(function(e){
		$("#REVISE").removeAttr("disabled");
		var content = form.serialize();
		//判断是否为空
        if(!vlidate($("#configManage_accept_form"))){
			  return ;
		  }
		var call =getMillisecond();
		baseAjaxJsonp(dev_project+"Confignotconform/confignotconformAccept.asp?call="+call+"&SID="+SID+"&"+content, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);
	});
	
	//返回操作
	var back = currTab.find("#configManage_accept_back");
	back.click(function(e){
		closeCurrPageTab();
	});

	initLayout();
	function initLayout(){
		autoInitSelect(form);//初始化下拉
		var content = form.serialize();
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"Confignotconform/confignotconformQureyBasic.asp?call="+call+"&SID="+SID+"&"+content, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("div[name="+i+"]").html(result[i]);
				currTab.find("input[name="+i+"]").val(result[i]);
			}
		},call);
	}
	
	
	/**处理人模态框开始**/
	//点击打开模态框
	var acceptCall = getMillisecond();
	var dispose_user_name = currTab.find("input[name=DISPOSE_USER_NAME]");
	dispose_user_name.click(function(){
		$("#dispose_user_table").modal('show');
		openPop("choosePm",{Zpm_id:currTab.find("input[name=DISPOSE_USER_ID]"),Zpm_name:currTab.find("input[name=DISPOSE_USER_NAME]")});
	});
	//处理人信息列表
	var dispose_userInfo = currTab.find("#table_dispose_userInfo");
	function openPop(id,callparams){
		//分页
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
		//查询所有POP框
		dispose_userInfo.bootstrapTable("destroy").bootstrapTable({
			//请求后台的URL（*）
			url : dev_project+"draftPro/queryListUserInfo.asp?call="+acceptCall+"&SID="+SID,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:acceptCall,
			singleSelect: true,
			onDblClickRow:function(row){
				$('#dispose_user_table').modal('hide');
				callparams.Zpm_id.val(row.USER_NO);
				callparams.Zpm_name.val(row.USER_NAME);
			},
			columns :[{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
		        	field : 'USER_NO',
					title : '用户编号',
					align : "center"
		        }, {
		        	field : "USER_NAME",
					title : "用户姓名",
					align : "center"
		        }, {
		        	field : "USER_POST",
					title : "用户岗位",
					align : "center",
		        }, {
		        	field : "STATE",
					title : "用户状态",
					align : "center"
		        },  {
		        	field : "USER_LEVEL",
					title : "用户等级",
					align : "center"
		        }, {
		        	field : "ORG_NO",
					title : "所属部门编号",
					align : "center",
					visible:false
		        }, {
		        	field : "ORG_NAME",
					title : "所属部门名称",
					align : "center"
		        }]
		});
	}
	//POP重置
	var reset_emp = currTab.find("#reset_emp");
	reset_emp.click(function(){
		currTab.find("input[name=EMP_ID]").val("");
		currTab.find("input[name=EMP_NAME]").val("");
	});
	//多条件查询处理人
	var select_emp = currTab.find("#select_emp");
	select_emp.click(function(){
		var USER_NO = currTab.find("input[name=EMP_ID]").val();
		var USER_NAME =  currTab.find("input[name=EMP_NAME]").val();
		dispose_userInfo.bootstrapTable('refresh',{url:dev_project+"draftPro/queryListUserInfo.asp?call="+acceptCall+"&SID="+SID
				+"&USER_NO="+escape(encodeURIComponent(USER_NO))+"&USER_NAME="+escape(encodeURIComponent(USER_NAME))});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_emp").click();});
	/**处理人模态框结束**/
}