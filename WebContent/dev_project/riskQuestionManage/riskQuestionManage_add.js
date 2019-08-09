;function initRiskQuestionSaveLayout(id, risk_id){
	
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#riskQuestionInfo_add_common");
	var riskForm = currTab.find("#riskQuestionInfo_add_risk");
	var questionForm = currTab.find("#riskQuestionInfo_add_question");
	var risk_div = currTab.find("#riskQuestionInfo_add_risk_div");
	var question_div = currTab.find("#riskQuestionInfo_add_question_div");
	//initVlidate(form)
	initVlidate(currTab);
	//保存操作
	var submit = currTab.find("#riskQuestionInfo_add_submit");
	submit.click(function(e){
		var type = currTab.find("select[name=FIRST_CLASSIFY]").val();
		var content = "";
		if(!vlidate(currTab,"",true)){
			return ;
		}
		var isComplete = vlidate(form,"",true);
		if(type=='01'){
			content += form.serialize() + "&" + riskForm.serialize();
			var riskComplete = vlidate(riskForm,"",true);
			if(isComplete&&riskComplete){
				
			} else {
				return;
			}
		} else if(type='02'){
			content += form.serialize() + "&" + questionForm.serialize();
			var questionComplete = vlidate(riskForm,"",true);
			if(isComplete&&questionComplete){
				
			} else {
				return;
			}
		}
		var call = getMillisecond()+1;
		baseAjaxJsonp(dev_project+"riskQuestionManage/riskSave.asp?SID="+SID+"&call="+call+"&"+content, null, function(data){
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
	var back = currTab.find("#riskQuestionInfo_add_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	//选择风险或者问题的控制按钮
	var type = currTab.find("select[name=FIRST_CLASSIFY]");
	type.bind('change',function(){
		if(type.val()=='01'){
			risk_div.show();
			question_div.hide();
		} else if(type.val()=='02') {
			risk_div.hide();
			question_div.show();
		}
	});
	//责任人pop
	var duty_man = form.find("input[name=DUTY_USER_NAME]");
	duty_man.click(function(){
		openPmPop(currTab.find("#chooseDutyMan"),{Zpm_id:form.find("input[name=DUTY_USER_ID]"),Zpm_name:form.find("input[name=DUTY_USER_NAME]")});
	});
	//风险的处理人pop
	var opt_man = riskForm.find("input[name=OPT_USER_NAME]");
	opt_man.click(function(){
		openPmPop(currTab.find("#chooseOptUser"),{Zpm_id:riskForm.find("input[name=OPT_USER_ID]"),Zpm_name:riskForm.find("input[name=OPT_USER_NAME]")});
	});
	//问题的处理人pop
	var ques_man = questionForm.find("input[name=OPT_USER_NAME]");
	ques_man.click(function(){
		openPmPop(currTab.find("#chooseOptUser"),{Zpm_id:questionForm.find("input[name=OPT_USER_ID]"),Zpm_name:questionForm.find("input[name=OPT_USER_NAME]")});
	});
	//问题或者风险的 下拉框过滤
	var firstSelect = form.find("select[name=FIRST_CLASSIFY]");
	firstSelect.bind('change',function(){
		var obj = form.find("select[name=SECOND_CLASSIFY]");
		var type = firstSelect.val();
		if(type=='01'){
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "","09,10,11,12,13");
		} else if(type='02'){
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "","01,02,03,04,05,06,07,08");
		}
	});
	//初始
	initLayout();
	function initLayout(){
		/*var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/queryOneProjectInfo.asp?call="+call+"&SID="+SID+"&PROJECT_ID="+id, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("input[name="+i+"]").val(result[i]);
			}
			//form.find("input[name=RISK_FROM_ID]").val(result.PROJECT_NUM+"--"+result.PROJECT_NAME);
		}, call);*/
		//初始化部分信息
		form.find("input[name=PRESENT_USER_NAME]").val($("#currentLoginName").val());
		form.find("input[name=PRESENT_USER_ID]").val($("#currentLoginNo").val());
		question_div.hide();
	}
	
	if(risk_id){
		//update
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/queryOneQuality.asp?call="+call+"&SID="+SID+"&RISK_ID="+risk_id, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("input[name="+i+"]").val(result[i]);
				currTab.find("select[name="+i+"]").attr("value",result[i]);
				currTab.find("textarea[name="+i+"]").val(result[i]);
			}
			autoInitSelect(form);//初始化下拉框
			autoInitSelect(riskForm);
			autoInitSelect(questionForm);
		},call);
	} else {
		autoInitSelect(form);//初始化下拉框
		autoInitSelect(riskForm);
		autoInitSelect(questionForm);
		//initSelect(form.find("select[name=SECOND_CLASSIFY]"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "",["09","10","11","12","13"]);
	}
	
	
	/**项目模态框开始**/
	//点击打开模态框
	var acceptCall = getMillisecond()+2;
	var dispose_project_name = currTab.find("input[name=RISK_FROM_ID]");
	dispose_project_name.click(function(){
		currTab.find("#project_man_table").modal('show');
		openPop("choosePm",{Zpm_id:currTab.find("input[name=PROJECT_ID]"),Zpm_name:currTab.find("input[name=RISK_FROM_ID]")});
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
			url : dev_project+"myProject/queryListmyProject.asp?call="+acceptCall+"&SID="+SID,
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
			uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:acceptCall,
			singleSelect: true,
			onDblClickRow:function(row){
				$('#project_man_table').modal('hide');
				callparams.Zpm_id.val(row.PROJECT_ID);
				callparams.Zpm_name.val(row.PROJECT_NUM+"--"+row.PROJECT_NAME);
				//缺省为项目经理
				currTab.find("input[name='DUTY_USER_ID']").val(row.PROJECT_MAN_ID);
				currTab.find("input[name='DUTY_USER_NAME']").val(row.PROJECT_MAN_NAME);
			},
			columns :[{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
		        	field : "PROJECT_ID",
					title : "项目id",
					align : "center",
					visible:false
		        }, {
		        	field : 'PROJECT_NUM',
					title : '项目编号',
					align : "center"
		        }, {
		        	field : "PROJECT_NAME",
					title : "项目名称",
					align : "center"
		        }, {
		        	field : "PROJECT_MAN_NAME",
					title : "项目经理",
					align : "center",
		        },  {
		        	field : "DUTY_USER_NAME",
					title : "项目负责人",
					align : "center"
		        }/*, {
		        	field : "ORG_NO",
					title : "所属部门编号",
					align : "center",
					visible:false
		        }, {
		        	field : "ORG_NAME",
					title : "所属部门名称",
					align : "center"
		        }*/]
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
		dispose_userInfo.bootstrapTable('refresh',{url:dev_project+"myProject/queryListmyProject.asp?call="+acceptCall+"&SID="+SID
				+"&PROJECT_MAN_ID="+escape(encodeURIComponent(USER_NO))+"&PROJECT_MAN_NAME="+escape(encodeURIComponent(USER_NAME))});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_emp").click();});
	/**处理人模态框结束**/
}