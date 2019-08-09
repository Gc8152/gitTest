function initChangeQueryLayout(row){
	var currTab=getCurrentPageObj();  //获取当前页面对象
	var currentLoginUser = $("#currentLoginNo").val();
	var project_id =row.PROJECT_ID;
	var draft_id =row.DRAFT_ID; 
	if(draft_id == undefined){
		initReqChangeTable("02");
	}else{
		initReqChangeTable("01");
		currTab.find("#versionChange_ver").hide();
		currTab.find("#versionChange_join").hide();
		currTab.find("#versionChange_out").hide();
	}
	initPlanChangeTable();
	initVersionChangeTable();
	
	//初始化需求变更列表
	function initReqChangeTable(type){
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset,
				project_id:project_id,
				draft_id:draft_id
			// 页码
			};
			return temp;
		};
		var tableCall =getMillisecond()+"1"; 
		currTab.find("#reqChangeTable").bootstrapTable({
			url :dev_project+"myProject/quertLiseReqChange.asp?SID=" + SID +"&type="+type+"&call=" + tableCall,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			uniqueId : "REQ_CHANGE_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:tableCall,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			},{
				field : 'ORDER_ID',
				title : '序号',
				align : "center",
				width:50,
				formatter:function(value,row,index){
					return index + 1;
				}
			},  {
				field : 'REQ_CHANGE_NUM',
				title : '变更编号',
				align : "center",
				visible:false
			}, {
				field : "REQ_CODE",
				title : "需求编号",
				align : "center",
			}, {
				field : "REQ_NAME",
				title : "需求名称",
				align : "center"
			}, {
				field : "CHANGE_ANALYZE_RESULT_NAME",
				title : "变更分析结论",
				align : "center"
			}, {
				field : "REQ_CHANGE_STATUS_NAME",
				title : "需求变更状态",
				align : "center"
			}, {
				field : "CHANGE_REASON_TYPE_NAME",
				title : "变更原因",
				align : "center"
			}, {
				field : "CREATE_NAME",
				title : "提出人",
				align : "center",
			},{
				field : "CHANGE_BUSINESSER",
				title : "业务联系人",
				align : "center"
			},  {
				field : "SUBMIT_TIME",
				title : "提出日期",
				align : "center",
			}/*, {
				field : "REQ_OPERATION_DATE",
				title : "期望投产日期",
				align : "center"
			}*/]
		});
	}
	
	
	//初始化版本变更列表
	function initVersionChangeTable(){
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset,
				project_id:project_id,
			};
			return temp;
		};
		var versionCall =getMillisecond()+"2"; 
		currTab.find("#versionChangeTable").bootstrapTable({
		      url: dev_project+'myProject/quertLiseVersionChange.asp?call='+versionCall+'&SID='+SID,   //请求后台的URL（*）
		      method: 'get',           //请求方式（*）   
		      striped: false,           //是否显示行间隔色
		      cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）		       
		      sortable: true,           //是否启用排序
		      sortOrder: "asc",          //排序方式
		      queryParams: queryParams,//传递参数（*）
		      sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
		      pagination: true,          //是否显示分页（*）
		      pageList: [5,10,15],    //可供选择的每页的行数（*）
		      pageNumber:1,            //初始化加载第一页，默认第一页
		      pageSize: 5,            //每页的记录行数（*）		       
		      clickToSelect: true,        //是否启用点击选中行
		      uniqueId: "REQ_CHANGE_ID",           //每一行的唯一标识，一般为主键列
		      cardView: false,          //是否显示详细视图
		      detailView: false,          //是否显示父子表	
		      jsonpCallback:versionCall,
		      singleSelect: true,//复选框单选
		      onLoadSuccess : function(data){
					gaveInfo();
				},
		      columns: [
				{	
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				}, {
			        field: 'ROW_NUM',
			        title: '序号',
			        align:"center",
			        width:50
		      },{
		    	  field: 'CHANGE_CODE',
		    	  title: '变更编号',
		    	  align:"center",
		    	  visible:false
		      },{
		    	  field: 'REQ_TASK_CODE',
		    	  title: '任务编号',
		    	  align:"center",
		    	  width:"17%"
		      },{
		    	  field: 'REQ_TASK_NAME',
		    	  title: '任务名称',
		    	  align:"center",
		    	  width:"17%"
		      },{
		      	  field:"REQ_CHANGE_SUBTYPE_NAME",
		      	  title:"变更类型",
		          align:"center"
		      },{
		      	  field:"CHANGE_STATE_NAME",
		      	  title:"变更状态",
		          align:"center"
			  },{
		    	  field:"SPONSOR_PERSON_NAME",
		    	  title:"提出人",
		          align:"center"
		      },{
		    	  field:"CREATE_TIME",
		    	  title:"提出日期",
		          align:"center",
		          formatter:function(value,row,index){
		 			 return value.substring(0,10);
		 		  }
		      },{
		          field: 'SYSTEM_NAME',
		          title: '应用名称',
		          align:"center",
		          visible:false
		      },{
		           field: 'VERSIONS_NAME',
		           title: '版本名称',
		           align:"center",
		           visible:false
		      }]
		    }); 
	}
	//初始化计划变更列表
	function initPlanChangeTable(){
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset,
				PROJECT_ID:project_id,
			// 页码
			};
			return temp;
		};
		var planCall =getMillisecond()+"3"; 
		currTab.find("#planChangeTable").bootstrapTable({
			//请求后台的URL（*）
			url : dev_project+'proChange/queryListApprove.asp?call='+planCall+'&SID='+SID,
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
			uniqueId : "CHANGE_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:planCall,
			singleSelect: true,
			onLoadSuccess:function(data){
				gaveInfo();
			},
			columns : [ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			}, {
				field : 'ROW_NUM',
				title : '序号',
				align : "center",
				width:50
			}, {
				field : "CHANGE_CODE",
				title : "变更编号",
				align : "center",
				visible:false
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
			}, {
				field : "CHANGE_REASON_NAME",
				title : "变更原因",
				align : "center"
			}, {
				field : "PRESENT_USER_NAME",
				title : "提出人",
				align : "center",
			}, {
				field : "PRESENT_DATE",
				title : "提出日期",
				align : "center",
			}, {
				field : "APP_STATUS_NAME",
				title : "变更状态",
				align : "center",
			}]
		});
	}
	
	//需求变更分析
	currTab.find("#reqChange_assess").click(function(){
		var seles = currTab.find("#reqChangeTable").bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行分析!");
				return;
		}
		if(seles[0].REQ_CHANGE_STATUS != "01"){
			alert("该申请不在待分析状态！");
			return;
		}
		if(seles[0].CHANGE_ANALYZE_ID != currentLoginUser){
			alert("您不是该变更的分析人！");
			return;
		}
		var selesInfo=JSON.stringify(seles);
		var params=JSON.parse(selesInfo);
		 closeAndOpenInnerPageTab("changeAnalyze","变更分析","dev_construction/requirement/requirement_change/analyze/changeAnalyze_edit.html", function(){
			 changeAnalyzeEdit(params[0]);
			});
	 });
	//需求变更审批
	currTab.find("#reqChange_app").click(function(){
		var seles = currTab.find("#reqChangeTable").bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行审批!");
				return;
		}
		if(seles[0].REQ_CHANGE_STATUS !="03"){
			alert("该变更不在审批中状态！");
			return;
		}
		 closeAndOpenInnerPageTab("changeApprove","变更审批","dev_construction/requirement/requirement_change/approve/changeApprove_edit.html", function(){
			 initTitle(seles[0].INSTANCE_ID);
			 initAFApprovalInfo(seles[0].INSTANCE_ID);
			 changeApproveEdit(seles[0]);
			});
	 });
	//查看需求变更详情
	currTab.find("#reqChange_detail").click(function(){
		var seles = currTab.find("#reqChangeTable").bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行查看!");
				return;
		}
		 closeAndOpenInnerPageTab("viewQuery","查看申请单","dev_construction/requirement/requirement_change/query/changeQuery_view.html", function(){
			 initTitle(seles[0].INSTANCE_ID);
			 initAFApprovalInfo(seles[0].INSTANCE_ID,'0');
			 changeQueryView(seles[0]);
			});
	 });
	
	//紧急加塞
	currTab.find("#versionChange_ver").click(function(){
		closePageTab("add_experts");
		closeAndOpenInnerPageTab("changeReq_add","申请版本加塞","dev_project/proReqChange/reqChange_add.html",function(){
			initChangeButtonEvent("0");
			initChange();
			getCurrentPageObj().find("#version_text1").html("加塞版本：");
			initSelect(getCurrentPageObj().find("#change_subtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_SUBTYPE"},"01");
		});		
	}); 	
	//补充协办
	currTab.find("#versionChange_join").click(function(){
		closePageTab("add_experts");
		closeAndOpenInnerPageTab("changeReq_add","申请补充协办","dev_project/proReqChange/reqChange_add.html",function(){
			initChangeButtonEvent("0");
			initChange();
			getCurrentPageObj().find("#version_text1").html("补充协办版本：");
			//初始化需求分类子类
			initSelect(getCurrentPageObj().find("#change_subtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_SUBTYPE"},"02");
		});		
	}); 
	//版本调出
	currTab.find("#versionChange_out").click(function(){
		closePageTab("add_experts");
		closeAndOpenInnerPageTab("changeReq_add","申请版本调出","dev_project/proReqChange/reqChange_add.html",function(){
			initChangeButtonEvent("0");
			initChange();
			getCurrentPageObj().find("#version_text1").html("调出版本：");
			initSelect(getCurrentPageObj().find("#change_subtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_SUBTYPE"},"03");
		});		
	}); 
	function initChange(){
		var initChangeCall = getMillisecond();
		baseAjaxJsonp(dev_project+'myProject/queryProjectSysAndVer.asp?call='+initChangeCall+'&SID='+SID+'&project_id='+project_id,null, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				var row = data.row;
				getCurrentPageObj().find("#system_id").val(row.SYSTEM_ID);
				getCurrentPageObj().find("#system_name").val(row.SYSTEM_NAME);
				getCurrentPageObj().find('#versions_id').val(row.VERSIONS_ID);
				getCurrentPageObj().find('#versions_name').val(row.VERSIONS_NAME);
			}else{
			}
		},initChangeCall);
		
	}
	//查看版本范围变更详情
	currTab.find("#versionChange_detail").click(function(){
		var id = currTab.find("#versionChangeTable").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.REQ_CHANGE_ID;});	
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据进行查看！");				
			return;
		}else{	
			var ids=JSON.stringify(id);
			var data=JSON.parse(ids);
			closeAndOpenInnerPageTab("changeReq_add","变更审批查看","dev_project/proReqChange/approve/reqChange_appDetil.html",function(){		
				for ( var k in data[0]) {
					if(k!="0" && k!="CHANGE_SUBTYPE" && k!="VERSION_ID" && k!="SYSTEM_ID" && k!="REQ_CHANGE_ID"){
						var str = data[0][k];
						k = k.toLowerCase();
						getCurrentPageObj().find("#"+k).html(str);
					}else if(k=="CHANGE_SUBTYPE"){
						if(data[0][k]=="01"){
							getCurrentPageObj().find("#version_text1").html("加塞版本：");
						}else if(data[0][k]=="02"){
							getCurrentPageObj().find("#version_text1").html("补充协办：");
						}else{
							getCurrentPageObj().find("#version_text1").html("版本调出：");
						}
					}
				}	
				getCurrentPageObj().find("#version_id").val(data[0].VERSIONS_ID);
				if(data[0]["INSTANCE_ID"]!=undefined){
					initTitle(data[0]["INSTANCE_ID"]);
					initAFApprovalInfo(data[0]["INSTANCE_ID"],'0');
				}else{
					getCurrentPageObj().find("#changeApp").hide();
				}
				initChangeButtonEvent(data[0].REQ_CHANGE_ID);
			});
		}
	});
	//发起计划变更
	currTab.find("#planChange_add").click(function(){
		closeAndOpenInnerPageTab("add_proChange","发起变更","dev_project/projectChangeManage/projectChangeApply/projectChange_edit.html", function(){
			initproChangeEditBtn(null);
			getCurrentPageObj().find("input[name=PROJECT_ID]").val(row.PROJECT_ID);
			getCurrentPageObj().find("input[name=PROJECT_NUM]").val(row.PROJECT_NUM);
			getCurrentPageObj().find("input[name=PROJECT_NAME]").val(row.PROJECT_NAME);
			getCurrentPageObj().find("input[name=STATUS]").val(row.STATUS);
			getCurrentPageObj().find("input[name=STATUS_NAME]").val(row.STATUS_NAME);
			getCurrentPageObj().find("input[name=PROJECT_TYPE]").val(row.PROJECT_TYPE);
			getCurrentPageObj().find("input[name=PROJECT_TYPE_NAME]").val(row.PROJECT_TYPE_NAME);
			//新建应用项目，现有应用改造项目
			if(row.PROJECT_TYPE == "SYS_DIC_NEW_PROJECT" || row.PROJECT_TYPE == "SYS_DIC_NEW_VERSION_PROJECT"){
				getCurrentPageObj().find("#change_version").show();
				changeVersion(row.PROJECT_ID);
			}else{
				getCurrentPageObj().find("#change_version").hide();
				queryMilestone(row.PROJECT_ID,"00","");//初始化模板里程碑
			}
		});
	});
	//查看计划变更详情
	var view = currTab.find("#planChange_detail");
	view.bind('click', function(e) {
		var seles = currTab.find("#planChangeTable").bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		closeAndOpenInnerPageTab("view_proChange","查看变更","dev_project/projectChangeManage/projectChangeApprove/proChangeApprove_detail.html", function(){
			initTitle(seles[0]["INSTANCE_ID"]);
			initAFApprovalInfo(seles[0]["INSTANCE_ID"],'0');
			initviewproChange(seles[0]);
		});
	});
}