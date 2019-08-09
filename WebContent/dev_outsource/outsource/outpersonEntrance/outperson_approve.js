
/**
 * 初始化外包人员详情信息
 * @param op_id
 */
function initOutPersonDetail(op_id,purch_type,op_code){
	initOpInfo(op_id);
	initEpaMessage(op_id);
	eduinfoTableDetail(op_code);
	workInfoTableDetail(op_code);
	qualificateInfoTableDetail(op_code);
	skill_infoTableDetail(op_code);
	projrctInfoTableDetail(op_code);
	qualiLevelTableDetail(op_code);
	getCurrentPageObj()[0].call_func=function(result,mark,biz_id,msg){
		if(mark=='over'){//审批通过
			appUpdateOutPersonState("over",biz_id);
		}else if(mark=='reject'){
			appUpdateOutPersonState("reject",biz_id);
		}else if(mark=='back'){
			appUpdateOutPersonState("back",biz_id);
		}else{
			alert(msg);
		}
	};
}
/**
 * 状态控制
 * @param state_type
 * @param biz_id
 */
function appUpdateOutPersonState(state_type,biz_id){
	baseAjaxJsonp(dev_outsource+"outperson/appUpdateOutPersonState.asp?call=jq_1520475159610&SID="+SID,{op_id:biz_id,state_type:state_type},function(data){
		
	},"jq_1520475159610");
}

//初始化教育信息
function eduinfoTableDetail(op_code){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#eduinfo_table_detail").bootstrapTable({////教育信息
		url : dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+'&call=outpe1&SID='+SID,//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:"outpe1",
		onLoadSuccess:function(data){
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*/{
			field : 'START_TIME',
			title : '开始时间',
			align : "center"
		},{
			field : 'END_TIME',
			title : '结束时间',
			align : "center"
		},{
			field : 'EDU_INSTITUTION',
			title : '教育机构',
			align : "center"
		},{
			field : 'EDU_BACKGROUND_NAME',
			title : '学历',
			align : "center"
		},{
			field : 'OP_SPECIAL',
			title : '专业',
			align : "center"
		},{
			field : "SPECIAL_DESC",
			title : "专业叙述",
			align : "center"
			
		} ]
	});
}
//初始化工作履历信息

function workInfoTableDetail(op_code){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	getCurrentPageObj().find("#workInfo_table_detail").bootstrapTable({//工作履历信息
		//请求后台的URL（*）
		url : dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+'&call=outpe2&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:"outpe2",
		onLoadSuccess:function(data){
		},
		columns : [/* {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*/{
			field : 'COMPANY_NAME',
			title : '单位名称',
			align : "center"
		},{
			field : 'START_TIME',
			title : '开始时间',
			align : "center"
		},{
			field : 'END_TIME',
			title : '结束时间',
			align : "center"
		},{
			field : 'ENTERPRISE_NATURE_NAME',
			title : '公司性质',
			align : "center"
		},{
			field : 'INDUSTRY_BELONG',
			title : '所属行业',
			align : "center"
		},{
			field : 'POSITION',
			title : '担任职务',
			align : "center"
		}/*, {
			field : "",
			title : "操作",
			align : "center",
			formatter : function(value,row,index){
				var str = "<span class='hower-view' onclick='viewWorkDetail("+index+")' value=\"查看\"></span>";
				return str;
			}
		}*/ ]
	});
}
//初始化相关资质证书
function qualificateInfoTableDetail(op_code){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#qualificate_info_table_detail").bootstrapTable({////教育信息
		url : dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+'&call=outpe3&SID='+SID,//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:"outpe3",
		onLoadSuccess:function(data){
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*/{
			field : 'CERTIFICATE_NAME',
			title : '资质证书',
			align : "center"
		},{
			field : 'ISSUING_TIME',
			title : '发行时间',
			align : "center"
		},{
			field : 'INDATE',
			title : '有效期',
			align : "center"
		},{
			field : 'ISSUING_UNIT',
			title : '发行单位',
			align : "center"
		},{
			field : 'MEMO',
			title : '备注',
			align : "center"
		}]
	});
}
//初始化相关技能信息
function skill_infoTableDetail(op_code){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#skill_info_table_detail").bootstrapTable({//工作履历信息
		//请求后台的URL（*）
		url : dev_outsource+"outperson/querySkillInfo.asp?op_code="+op_code+'&call=outpe4&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:"outpe4",
		onLoadSuccess:function(data){
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*/{
			field : 'SKILL_TYPE_NAME',
			title : '技能类型',
			align : "center"
		},{
			field : 'SKILLNAME',
			title : '技能',
			align : "center"
		},/*{
			field : 'SKILL_NAME',
			title : '名称',
			align : "center"
		},*/{
			field : 'PROFICIENCY_DEGREE_NAME',
			title : '熟练度',
			align : "center"
		},{
			field : 'USING_TIME',
			title : '掌握时间(月)',
			align : "center"
		},{
			field : 'MEMO',
			title : '备注',
			align : "center"
		}]
	});
}
//初始化项目经历信息
function projrctInfoTableDetail(op_code){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#projrct_info_table_detail").bootstrapTable({//教育信息
		url : dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+'&call=outpe5&SID='+SID,//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:"outpe5",
		onLoadSuccess:function(data){
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*/{
			field : 'PROJECT_NAME',
			title : '项目名称',
			align : "center"
		},{
			field : 'START_TIME',
			title : '开始时间',
			align : "center"
		},{
			field : 'END_TIME',
			title : '结束时间',
			align : "center"
		},{
			field : 'PALY_ROLE',
			title : '担任角色',
			align : "center"
		},{
			field : 'PROJECT_RESPONSIBILITY',
			title : '项目职责',
			align : "center"
		},{
			field : 'PROJECT_ABSTRACT',
			title : '项目简介',
			align : "center"
		}]
	});
}
//初始化资质级别信息
function qualiLevelTableDetail(op_code){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#quali_level_table_detail").bootstrapTable({
		url : dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+'&call=outpe6&SID='+SID,//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:"outpe6",
		onLoadSuccess:function(data){
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*/{
			field : 'QUALIFICATE_LEVEL_NAME',
			title : '资质级别',
			align : "center"
		},{
			field : 'OP_GRADE_NAME',
			title : '资质档次',
			align : "center"
		},{
			field : 'START_TIME',
			title : '资质开始时间',
			align : "center"
		},{
			field : 'END_TIME',
			title : '资质结束时间',
			align : "center"
		},{
			field : 'MEMO',
			title : '备注',
			align : "center"
		}]
	});
}
//初始化资源池
function initOutPersonWorkInfo(op_code){//初始化资源池信息
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#resource_pool_table_detail").bootstrapTable({//教育信息
		url : dev_outsource+"outperson/queryResPoolInfo.asp?op_code="+op_code+'&call=outpe7&SID='+SID,//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:"outpe7",
		onLoadSuccess:function(data){
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*/{
			field : 'PURCH_TYPE_NAME',
			title : '人员采购类型',
			align : "center",
			width : 90
		},{
			field : 'ASS_CODE',
			title : '任务书编号',
			align : "center",
			width : 150
		},{
			field : 'CONTRACT_CODE',
			title : '合同编号',
			align : "center",
			width : 150
		},{
			field : 'WORK_MONTH',
			title : '工作量(人月)',
			align : "center",
			width : 80
		},{
			field : 'SERVICE_STARTIME',
			title : '服务开始时间',
			align : "center",
			width : 105
		},{
			field : 'SERVICE_ENDTIME',
			title : '服务结束时间',
			align : "center",
			width : 105
		},{
			field : "PROJECT_ROLE",
			title : "项目角色",
			align : "center",
			width : 120
		},{
			field : "IS_KEY_NAME",
			title : "是否关键人员",
			align : "center",
			width : 80
		},{
			field : "DUTY_EXPLAIN",
			title : "职责说明",
			align : "center"
		}]
	});
}

function outPersonApprovalOver(op_code,type){
	var calls = getMillisecond();
	if(type == '01'){
		baseAjaxJsonp(dev_outsource+"outperson/outPersonApprocalUpdate.asp?SID="+SID+"&call="+calls+"&op_code="+op_code+"&type="+type,null,function(data){
			if(data != undefined&&data!=null&&data.result=="true"){
				
				alert("审批通过！");
				closeCurrPageTab();
			}else{
				alert("操作失败！");
			}
		},calls);
	}else if(type == '02'){
		baseAjaxJsonp(dev_outsource+"outperson/outPersonApprocalUpdate.asp?SID="+SID+"&call="+calls+"&op_code="+op_code+"&type="+type,null,function(data){
			if(data != undefined&&data!=null&&data.result=="true"){
				
				alert("审批打回成功！");
				closeCurrPageTab();
			}else{
				alert("操作失败！");
			}
		},calls);
	}else if(type == '03'){
		baseAjaxJsonp(dev_outsource+"outperson/outPersonApprocalUpdate.asp?SID="+SID+"&call="+calls+"&op_code="+op_code+"&type="+type,null,function(data){
			if(data != undefined&&data!=null&&data.result=="true"){
				
				alert("审批撤销成功！");
				closeCurrPageTab();
			}else{
				alert("操作失败！");
			}
		},calls);
	}
}