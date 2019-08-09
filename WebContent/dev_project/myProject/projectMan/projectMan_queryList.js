
initVlidate($("#responsibility_add"));
initVlidate($("#set_authorization"));
function shift(type){
	if("rmselected"==type){//移除
		var val=getCurrentPageObj().find("#selected").val();
		if(val&&val!=""){
			if(val instanceof Array){
				for(var i=0;i<val.length;i++){
					var html=$("#selected option[value='"+val[i]+"']");
					getCurrentPageObj().find("#unselected").append('<option value="'+val[i]+'">'+html.text()+'</option>');
					html.remove();
				}
			}else{
				var html=getCurrentPageObj().find("#selected option[value='"+val+"']");
				getCurrentPageObj().find("#unselected").append('<option value="'+val+'">'+html.text()+'</option>');
				html.remove();
			}
		}
	}else if("addselected"==type){//新增
		var val=getCurrentPageObj().find("#unselected").val();
		if(val&&val!=""){
			if(val instanceof Array){
				for(var i=0;i<val.length;i++){
					var html=getCurrentPageObj().find("#unselected option[value='"+val[i]+"']");
					getCurrentPageObj().find("#selected").append('<option value="'+val[i]+'">'+html.text()+'</option>');
					html.remove();
				}
			}else{
				var html=getCurrentPageObj().find("#unselected option[value='"+val+"']");
				getCurrentPageObj().find("#selected").append('<option value="'+val+'">'+html.text()+'</option>');
				html.remove();
			}
		}
	}
}
function initProjectManInfo(data){
	var currTab=getCurrentPageObj();  //获取当前页面对象
	//赋值
	for(var key in data){
		if (key=="PROJECT_NUM") {
			$("#PROJECT_NUM").html(data[key]);
		}else if (key=="PROJECT_NAME") {
			$("#PROJECT_NAME").html(data[key]);
		}
	}
//	var project_id=$("#PROJECT_NUM").html();
	var project_num=$("#PROJECT_NUM").html();
	var project_id = $("#ProjectManInt_li").attr("project_id");
	var project_name=$("#PROJECT_NAME").html();
	//添加项目干系人
	$("#add_responsibility").bind("click",function(){
		$("#myModal_responsibility").modal("show");
		$("#responsibility_add input").val("");
	});
	$("#save_responsibility").unbind();
	$("#save_responsibility").bind('click',function(){
		if(!vlidate($("#responsibility_add"))){
			return ;
		}
		var inputs= $("input:text[name^='R.']");
		var params={};
		
		for ( var i = 0; i < inputs.length; i++) {
			params[$(inputs[i]).attr("name").substr(2)]=$(inputs[i]).val();
		}
		var user_name=$("#r_user_name").val();
		var company_name=$("#r_company_name").val();
		var user_post=$("#r_user_post").val();
		params["USER_NAME"]=user_name;
		params["COMPANY_NAME"]=company_name;
		params["USER_POST"]=user_post;
		params["PROJECT_ID"]=project_id;
		var add=getMillisecond();
		baseAjaxJsonp(dev_project+'projectman/editProjectStakeholder.asp?call='+add+'&SID='+SID, params, function(data){
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				$("#myModal_responsibility").modal("hide");
				responsibility_table.bootstrapTable('refresh',{
					url:dev_project+'projectman/queryListProjectStakeholderInfo.asp?call='+ref+'&SID='+SID+'&project_id='+project_id
				});
			}else{
				alert("保存失败");
			}
		}, add);
	});
	//修改项目干系人
	$("#update_responsibility").click(function(){
		var id=$("#responsibility_table").bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行修改!");
			return;
		}
		var ids=id[0].USER_NO;
		$("#myModal_responsibility").modal("show");
		var queryOne=getMillisecond();
		baseAjaxJsonp(dev_project+'projectman/queryOneProjectStakeholder.asp?call='+queryOne+'&SID='+SID+'&user_no='+ids, null, function(data){
			var p=new Array();
			for (var i in data) {
				for (var j in data[i]) {
					p=data[i][j];
				}
			}
			for ( var k in p) {
				if (k=="USER_NAME") {
					$("#r_user_name").val(p[k]);
				}else if (k=="USER_POST") {
					$("#r_user_post").val(p[k]);
				}else if (k=="COMPANY_NAME") {
					$("#r_company_name").val(p[k]);
				}else {
					$("input[name='R."+k+"']").val(p[k]);
				}
			}
		}, queryOne);
		$("#save_responsibility").unbind();
		$("#save_responsibility").bind('click',function(){
			if(!vlidate($("#responsibility_add"))){
				return ;
			}
			var inputs= $("input:text[name^='R.']");
			var params={};
			
			for ( var i = 0; i < inputs.length; i++) {
				params[$(inputs[i]).attr("name").substr(2)]=$(inputs[i]).val();
			}
			var user_name=$("#r_user_name").val();
			var company_name=$("#r_company_name").val();
			var user_post=$("#r_user_post").val();
			var user_no = $("#r_user_no").val();
			params["USER_NO"]=user_no;
			params["USER_NAME"]=user_name;
			params["COMPANY_NAME"]=company_name;
			params["USER_POST"]=user_post;
			params["PROJECT_ID"]=project_id;
			var up=getMillisecond();
			baseAjaxJsonp(dev_project+'projectman/updateProjectStakeholder.asp?call='+up+'&SID='+SID, params, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert("修改成功");
					$("#myModal_responsibility").modal("hide");
					responsibility_table.bootstrapTable('refresh',{
						url:dev_project+'projectman/queryListProjectStakeholderInfo.asp?call='+ref+'&SID='+SID+'&project_id='+project_id
					});
				}else{
					alert("修改失败");
				}
			},up);
		});
	});
	//删除干系人
	$("#delete_responsibility").click(function(){
		var id=$("#responsibility_table").bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行删除!");
			return;
		}
		var msg="是否删除此干系人？";
		nconfirm(msg,function(){
			var ids=id[0].USER_NO;
			var drop=getMillisecond();
			baseAjaxJsonp(dev_project+'projectman/deleteProjectStakeholder.asp?call='+drop+'&SID='+SID+'&USER_NO='+ids, null,function(data){		
				if (data != undefined && data != null && data.result=="true") {
					responsibility_table.bootstrapTable('refresh',{
						url:dev_project+'projectman/queryListProjectStakeholderInfo.asp?call='+ref+'&SID='+SID+'&project_id='+project_id
					});
					alert(data.msg);	
				}else{
					alert("删除失败");
				}
			},drop);
		});
	});
	//干系人列表显示
	var responsibility_table=currTab.find("#responsibility_table");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var ref=getMillisecond();//用于项目干系人列表的刷新
	responsibility_table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'projectman/queryListProjectStakeholderInfo.asp?call='+ref+'&SID='+SID+'&project_id='+project_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "USER_NAME", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:ref,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'USER_NAME',
			title : '干系人名称',
			align : "center"
		}, {
			field : "COMPANY_NAME",
			title : "单位名称",
			align : "center"
		}, {
			field : 'USER_POST',
			title : '职位',
			align : "center"
		}, {
			field : 'USER_MAIL',
			title : '邮箱',
			align : "center"
		}, {
			field : 'USER_MOBILE',
			title : '电话',
			align : "center"
		}]
	});
	var addProjectMan=currTab.find("#addProjectMan");
	//新增项目成员
	addProjectMan.bind("click",function(){
		initProjectManSelect(project_id);
		$("#setProjectManModal").modal("show");
		$("#setProject_name").html(project_name);
		$("#setProject_no").html(project_num);
		
	});
	//项目授权
	var project_authorization=currTab.find("#project_authorization");
	project_authorization.bind("click",function(){
		var queryOneProMan=getMillisecond();
		$("span[name='PROJECT_NUM']").text(project_num);
		$("span[name='PROJECT_NAME']").text(project_name);
		//获取当前时间
		var time=new Date();
		var t=time.getMonth()+1;
		var m=time.getFullYear()+'-'+t+'-'+time.getDate();
		$("span[name='PROJECT_TIME']").text(m);
		//当前项目经理
		baseAjaxJsonp(dev_project+'projectman/queryOneProjectMan.asp?call='+queryOneProMan+'&SID='+SID+'&project_id='+project_id, null, function(data){
			var pMan=new Array();
			for (var i in data) {
				for (var j in data[i]) {
					pMan=data[i][j];
				}
			}
			for ( var k in pMan) {
				if (k=="PROJECT_MAN_NAME") {
					$("span[name='PROJECT_MAN_NAME']").html(pMan[k]);
				}
			}
		}, queryOneProMan);
		$("#choicePerson").val("");
		$("#setProjectAuthorization").modal("show");
	});
	//选择项目授权人
	currTab.find("#colse_modal").click(function(){
		$("#myModal_choiceProjectMan").modal("hide");
	});
	var choicePerson=currTab.find("#choicePerson");
	choicePerson.bind("click",function(){	
		$("#myModal_choiceProjectMan").modal("show");
		openProjectManPop("chooseProjectMan",{projectManInfo_id:currTab.find("#choiceProMan_id"),projectManInfo_name:currTab.find("input[name='choiceProMan']")});	
	});
	//项目人员授权信息列表
	var projectManInfo=currTab.find("#table_projectManChoice");
	var findMan=getMillisecond();
	function openProjectManPop(id,callparams){
		//分页
		var queryParams=function(params){
			var temp={
					limit:params.limit,//页面大小
					offset:params.offset//页码
			};
			return temp;
		};		
		projectManInfo.bootstrapTable({
			url : dev_project+"projectman/queryListProjectMan.asp?SID="+SID+"&call="+findMan+"&PROJECT_ID="+project_id,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
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
			uniqueId : "USER_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:findMan,
			singleSelect: true,
			onDblClickRow:function(row){
				$('#myModal_choiceProjectMan').modal('hide');
				callparams.projectManInfo_name.val(row.USER_NAME);
				callparams.projectManInfo_id.val(row.USER_NO);
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
					title : '人员编号',
					align : "center"
		        }, {
		        	field : "USER_NAME",
					title : "人员名称",
					align : "center"
		        }, {
		        	field : "LEVEL_NAME",
					title : "人员等级",
					align : "center"
		        }]
		});
	}
	//项目授权人员查询	
	var select_projectMan=currTab.find("#select_projectMan");	
	select_projectMan.bind('click',function(){	
		var man_id=$("input[name='MAN_ID']").val();
		var man_name=$("input[name='MAN_NAME']").val();
		projectManInfo.bootstrapTable('refresh',{
			url:dev_project+"projectman/queryListProjectMan.asp?SID="+SID+"&call="+findMan+"&PROJECT_ID="+project_id
			+"&PROJECTMAN_ID="+man_id
			+"&PROJECTMAN_NAME="+man_name
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_projectMan").click();});
	//项目授权人员重置
	var reset_projectMan=currTab.find("#reset_projectMan");
	reset_projectMan.bind('click',function(){
		currTab.find("input[name='MAN_ID']").val("");
		currTab.find("input[name='MAN_NAME']").val("");
	});
	
	//保存项目授权人
	var save_ProjectAuthorization=currTab.find("#save_ProjectAuthorization");
	save_ProjectAuthorization.bind('click',function(){
		if(!vlidate($("#set_authorization"))){
			return ;
		}
		var duty_user_id=currTab.find("#choiceProMan_id").val();
		var params={};
		params["DUTY_USER_ID"]=duty_user_id;
		params["project_id"]=project_id;
		var addProA=getMillisecond();
		baseAjaxJsonp(dev_project+'projectman/projectManAuthorization.asp?call='+addProA+'&SID='+SID, params, function(data){
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				$("#setProjectAuthorization").modal("hide");
				$("#table_projectManInfo").bootstrapTable('refresh',{
					url:dev_project+'projectman/queryListProjectManInfo.asp?call='+qmi+'&SID='+SID+'&project_id='+project_id
				});
			}else{
				alert("保存失败");
			}
		},addProA);
	});
	//项目组成员列表显示
	var table=currTab.find("#table_projectManInfo");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var qmi=getMillisecond();//用于项目组成员列表的刷新
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'projectman/queryListProjectManInfo.asp?call='+qmi+'&SID='+SID+'&project_id='+project_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
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
		uniqueId : "USER_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:qmi,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			align: 'center',
			valign: 'middle'
		}, {
			field : "JOB",
			title : "角色",
			align : "center"
		}, {
			field : "USER_ID",
			title : "人员编号",
			align : "center"
		}, {
			field : "USER_NAME",
			title : "人员姓名",
			align : "center"
		}, {
			field : "PLAN_START_TIME",
			title : '计划投入开始日期',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				var e=row.PLAN_START_TIME;
				if (e==undefined) {
					e="";
				}
				var f=" <input type='text' name='PST.'"+(index+1)+" onClick='WdatePicker({});' class='citic-ast' placeholder='点击选择' readonly value="+e+">";
				return f;
			}
		}, {
			field : "PLAN_END_TIME",
			title : "计划投入结束时间",
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				var a=row.PLAN_END_TIME;
				if (a==undefined) {
					a="";
				}
				var c="<input type='text' name='PET.'"+(index+1)+" onClick='WdatePicker({});' class='citic-ast' placeholder='点击选择' readonly value="+a+">";
				return c;
			}
		}, {
			field : "WORKLOAD_RATIO",
			title : "工作量占比",
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				var b=row.WORKLOAD_RATIO;
				if (b==undefined) {
					b="";
				}
				var d="<input type='text' name='WR.'"+(index+1)+" value="+b+">";	
				return d;
			}
		},{
			field : "WORKLOAD_SATURATION",
			title : "工作量饱和度",
			align : "center"
		}, {
			field : "WHETHER_MEMBER",
			title : "是否行员",
			align : "center"
		}, {
			field : "SUPPLIER",
			title : "供应商",
			align : "center"
		},{
			field : "USER_MAIL",
			title : "邮箱",
			align : "center"
		},{
			field : "USER_MOBILE",
			title : "电话",
			align : "center"
		},{
			field : "DUTY_USER_NAME",
			title : "项目授权",
			align : "center",
			formatter: function (value, row, index) {
				var user_name = row.USER_NAME;
				
				if(value == user_name){
					return  "项目负责人";
				}else{
					return "项目组成员";
				}
			}
		}]
	});
	//删除项目成员记录
	var deleteProjectMan=currTab.find("#deleteProjectMan");
	deleteProjectMan.bind('click',function(){
		var seles = $("#table_projectManInfo").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var msg="是否删除此成员？";
		nconfirm(msg,function(){
			var USER_ID = seles[0].USER_ID;  
			var del=getMillisecond();
			baseAjaxJsonp(dev_project+"projectman/deleteProjectMan.asp?SID="+SID+"&call="+del,{"USER_ID":USER_ID,"PROJECT_ID":project_id}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert("删除成功!");
					$("#table_projectManInfo").bootstrapTable('refresh',{
						url:dev_project+'projectman/queryListProjectManInfo.asp?call='+qmi+'&SID='+SID+'&project_id='+project_id
					});
				}else{
					alert("删除失败!");
				}
			}, del);
		});
	});
	//项目人员选取
	function initProjectManSelect(project_id){
		$("#selected").empty();
		$("#unselected").empty();
		var call=getMillisecond();
		baseAjaxJsonp(dev_project+"projectman/findNoProjectMan.asp?call="+call+"&SID="+SID,{"project_id":project_id},function(data){
			var m=new Array();
			for ( var i in data) {
				for ( var j in data[i]) {
					m.push(data[i][j]);
				}
			}
			if(m!=undefined){
				for(var i=0;i<m.length;i++){
					$("#unselected").append('<option value="'+m[i].USER_NO+'">'+m[i].USER_NAME+'</option>');
				}
			}
		},call);
		var call1=getMillisecond();
		baseAjaxJsonp(dev_project+"projectman/findProjectMan.asp?call="+call1+"&SID="+SID,{"project_id":project_id},function(data){
			var m=new Array();
			for ( var i in data) {
				for ( var j in data[i]) {
					m.push(data[i][j]);
				}
			}
			if(m!=undefined){	
				for(var i=0;i<m.length;i++){
					$("#selected").append('<option value="'+m[i].USER_NO+'">'+m[i].USER_NAME+'</option>');
				}
			}
		},call1);
		//保存项目成员
		$("#save_ProjectMan").unbind("click");
		$("#save_ProjectMan").click(function(){
			var options=$("#selected option");
			var param={project_id:project_id,user_nos:""};
			if(options!=undefined){
				var user_no=$(options[0]).val();
				for(var i=1;i<options.length;i++){
					user_no=user_no+","+$(options[i]).val();
				}
				param["user_nos"]=user_no;
			}
			var call2=getMillisecond();
			baseAjaxJsonp(dev_project+"projectman/addprojectMan.asp?call="+call2+"&SID="+SID,param,function(data){
				if(data!=undefined&&data.result=="true"){
					alert("保存成功");	
					$("#table_projectManInfo").bootstrapTable('refresh',{
						url:dev_project+'projectman/queryListProjectManInfo.asp?call='+qmi+'&SID='+SID+'&project_id='+project_id
					});
					$("#setProjectManModal").modal("hide");
				}else{
					alert("保存失败");
				}
			},call2);
		});
	}
	//整体页面保存
	var projectMan_save=currTab.find("#projectMan_save");
	projectMan_save.bind('click',function(){
		var params={};
		params["project_id"]=project_id;
		var id=table.bootstrapTable("getData");
		var new_id=new Array();
		for ( var i in id) {			
			var first=$("input[name^='PST.']");
			var second=$("input[name^='PET.']");
			var third=$("input[name^='WR.']");
			for ( var j = i; j< id.length; i++) {
				new_id.push({"user_id":id[i].USER_ID,"plan_start_time":$(first[j]).val(),"plan_end_time":$(second[j]).val(),"workload_ratio":$(third[j]).val()});
				break;
			}
		}	
		params["new_id"]=JSON.stringify(new_id);
		var addAll=getMillisecond();
		baseAjaxJsonp(dev_project+"projectman/saveProjectManInfo.asp?call="+addAll+"&SID="+SID, params, function(data){
			if (data!=undefined&&data!=null&&data.result=="true") {
				alert("保存成功");
				closeCurrPageTab();
			}else {
				alert("保存失败");
			}
		},addAll);
	});
	//返回
	var projectMan_close=currTab.find("#projectMan_close");
	projectMan_close.bind('click',function(){
		closeCurrPageTab();
	});
}