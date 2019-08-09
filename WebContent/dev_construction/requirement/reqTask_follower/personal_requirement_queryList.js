//初始化字典项
(function(){
	appendSelect(getCurrentPageObj().find("[name='req_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_STATE"});
	initSelect(getCurrentPageObj().find("[name='req_type1']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"});
	initSelect(getCurrentPageObj().find("[name='req_acc_classify']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CLASSIFY"});
})();
//初始化下拉数
(function(){
	//提出部门
	getCurrentPageObj().find("[name='req_put_dept_name']").click(function(){
		openSelectTreeDiv($(this),"req_put_dept_tree_requirement_queryList","SOrg/queryorgtreelist.asp",{"margin-top":"2px", width:"225px", height:"200px"},function(node){
			getCurrentPageObj().find("[name='req_put_dept_name']").val(node.name);
			getCurrentPageObj().find("[name='req_put_dept']").val(node.id);
		});
	});
})();

//项目组长加载
var reqAssReturnCall=getMillisecond();
baseAjaxJsonp(dev_construction+"requirement_accept/queryUserByRoleNo.asp?role_no=0082&limit=5&offset=0&SID="+SID+"&call="+reqAssReturnCall, {}, function(data){
	var elem=getCurrentPageObj().find("#req_product_leaderid");
	elem.append('<option value=" ">请选择</option>');	
	if(data&&data.rows&&data.rows.length>0){
		for(var i=0;i<data.rows.length;i++){
			var value=data.rows[i]["USER_NO"];
			var name=data.rows[i]["ORG_NAME"]+":"+data.rows[i]["USER_NAME"];
			elem.append('<option value="'+value+'">'+name+'</option>');	
		}
	}
	elem.val(" ");
	elem.select2();
},reqAssReturnCall);

/**aa
 * 组装查询url 
 * @returns {String}
 */
function RequirementQueryUrlP(){
	var url = dev_construction+"GFollowerTask/queryAllReqInfo.asp?SID="+SID+'&personal=personal';
	var fds=getCurrentPageObj().find("#PreqTerm [name]");
	for(var i=0; i<fds.length; i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			if(obj.attr("name")=="req_state"){
				var all = "";
				getCurrentPageObj().find("[name='req_state'] option:selected").each(function() {
		        	var text= $(this).attr("value");
		        	text = text.replace(/(^\s*)|(\s*$)/g, "");
		        	if(text !== '' && typeof(text) !== undefined && text !== null){
		        		if(all == ""){
		        			all = text;
		        		}else{
		        			all += ","+text;
		        		}
		        	}
		        });
				url+='&req_state='+all;
			}else{
				url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
			}
		}
	}
	return url;
}

/**
 * 获取查询参数
 * @returns 
 */
function getReqQueryParamP(){
	var param={};
	var finds=	getCurrentPageObj().find("#PreqTerm [name]");
	for(var i=0;i<finds.length;i++){
		var obj=$(finds[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}

//获取时间
var personal_call = getMillisecond();
/**
 * 查询列表显示table
 */
(function () {
	var queryParams=function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		temp["call"] = personal_call;
		return temp;
	};
	getCurrentPageObj().find("#preqTable").bootstrapTable(
			{
				url : dev_construction+'GFollowerTask/queryAllReqInfo.asp?SID='+SID+'&personal=personal',
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [10,20,50],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: personal_call,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [{
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'REQ_ID',
					title : '需求ID',
					align : 'center',
					visible:false
				},{
					field : 'REQ_CODE',
					title : '需求编号',
					align : 'center',
					width : 140,
				},{
					field : 'REQ_NAME',
					title : '需求名称',
					align : 'center',
					width : 400,
					formatter : function(value, row, index) {
						return req_namformatter(32,value);
					}
				},{
					field : 'REQ_ACC_CLASSIFY_DISPLAY',
					title : '需求分类',
					align : 'center',	
					width : 135,
					formatter:function(value,row,index){
						if(row.REQ_ACC_CLASSIFY=="00"){
							return '<span style="color:red;">'+value+'</span>';
						}else{
							return value;
						}
					}
				},{
					field : 'REQ_TYPE1_NAME',
					title : '需求大类',
					align : 'center',	
					width : 145,
				},{
					field : "REQ_STATE_NAME",
					title : "需求状态",
					align : "center",
					width : 135,
					formatter:function(value,row,index){
						return '<span style="color:red">'+value+'</span>';}
				},{
					field : 'SUMMIT_TIME',
					title : '需求提出日期',
					align : "center",
					width : 110,
				},{
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center",
					width : 100,
				},{
					field : "REQ_PUT_DEPT_NAME",
					title : "提出部门",
					align : "center",
					width : 120,
				},{
					field : "CREATE_PERSON_NAME",
					title : "需求提出人",
					align : "center",
					width : 90,
				},{
					field : "REQ_BUSINESSER",
					title : "业务联系人",
					align : "center",
					width : 100,
				},{
					field : "REQ_BUSINESS_PHONE",
					title : "业务联系电话",
					align : "center",
					width : 120,
				},{
					field : "P_OWNER_NAME",
					title : "当前处理人",
					align : "center",
					width : 100,
				},{
					field : "REQ_OPERATION_DATE",
					title : "要求投产时间",
					align : "center",
					width : 110,
				},{
					field : "REQ_ANALYSIS",
					title : "需求分析岗",
					align : "center",
					width : 100,
				},{
					field : "REQ_ACC_PRODUCTMAN",
					title : "产品经理",
					align : "center",
					width : 100,
					formatter:function(value,row,index){
						if(row.REQ_ACC_PRODUCTMAN!=null && row.REQ_ACC_PRODUCTMAN!="" && row.REQ_ACC_PRODUCTMAN!=undefined){
							return row.REQ_ACC_PRODUCTMAN;
						}
						else{
							return row.REQ_PRODUCT_MANAGER_NAME;
						}
					}
				},{
					field : "REQ_SCORE_NAME",
					title : "优先级",
					align : "center",
					width : 60,
				},{
					field : "REQ_ACC_RESULT",
					title : "受理结果",
					align : "center",
					width : 75,
				},{
					field : "OLD_REQ_CODE",
					title : "存量需求编号",
					align : "center",
					width : 140,
					visible:false
				}  ]
			});
})();
/**
 * 初始化页面按钮事件
 */
(function(){
	//重置按钮
	getCurrentPageObj().find("#resetp").click(function(){
		getCurrentPageObj().find("#PreqTerm input").val("");
		var selects=$("#PreqTerm select");
		selects.val(" ");
		selects.select2();
	});
	
	//查询按钮事件
	getCurrentPageObj().find("#queryp").unbind("click");
	getCurrentPageObj().find("#queryp").click(function(){
		getCurrentPageObj().find("#preqTable").bootstrapTable("refresh",{url:RequirementQueryUrlP()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryp").click();});
	
	//360视图按钮
	getCurrentPageObj().find("#viewp").unbind("click");
	getCurrentPageObj().find("#viewp").click(function(){
		var selects = getCurrentPageObj().find("#preqTable").bootstrapTable("getSelections");
		if(selects.length != 1) {
			alert("请选择一条数据进行操作！");
			return;
		}
		var ids = $.map(selects, function(item, index) {
			return item.REQ_ID;
		});
		closeAndOpenInnerPageTab("requirement_360view","业务需求360页面","dev_construction/requirement/reqTask_follower/requirement_360view.html",function(){
			initReqInfoInView(ids[0]);
			initFollowerTaskQuery(ids[0]);
			reqChange_info(ids[0]);
			reqStop_info(ids[0]);
		});
	});
	
	//应用pop
	 getCurrentPageObj().find("#system_name_req360").unbind("click");
	 getCurrentPageObj().find("#system_name_req360").click(function(){
		 openTaskSystemPop("system_req360",{sysno:getCurrentPageObj().find("#system_id_req360"),sysname:getCurrentPageObj().find("#system_name_req360")}); 
	 });
	
	
})();

