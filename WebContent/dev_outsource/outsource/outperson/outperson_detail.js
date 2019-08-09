/**
 * 初始化外包人员详情信息
 * @param op_id
 */
function formatString(data){
	if(data==null){
		return '';
	}else{
		return data;
	}
}
function initOutPersonDetail(op_id,purch_type,idcard_no,flowid,spstate,flowurl){
	getCurrentPageObj().find("#idcard_no").val(formatString(idcard_no));
	var call = getMillisecond();
	baseAjaxJsonp(dev_outsource+'outperson/findOutPersonDetail.asp?call='+call+'&SID='+SID,{op_id:op_id},function(data){
		if(data){
			for(var k in data){
				getCurrentPageObj().find("#OPDT_"+k).text(formatString(data[k]));
			}
			//$("#OPDT_OP_SEX").text(dic_item["S_DIC_SEX"][data["OP_SEX"]]);
		    /*if(data.ENTRANCE_TIME==null || data.ENTRANCE_TIME==undefined){
				getCurrentPageObj().find("#OPDT_ENTRANCE_TIME").text(formatString(data["JOIN_BANK_TIME"]));
			}*/
		}
	},call);
	var purchatype= purch_type;
	initEpaMessage(op_id,purchatype,null,function(item){
		var oplaPages = getCurrentPageObj();
		oplaPages.find("#OPLA_coe_id").val(item["COE_ID"]||"");
		oplaPages.find("#OPLA_idcard_no").val(item["IDCARD_NO"]||"");
		oplaPages.find("#OPLA_leave_reason").val(item["LEAVE_REASON"]||"");
		oplaPages.find("#OPLA_actully_leavetime").val(item["ACTULLY_LEAVETIME"]||"");
		oplaPages.find("#OPLA_op_supoffice_manager").val(item["OP_SUPOFFICE_MANAGER"]||"");
		oplaPages.find("#OPLA_op_office_manager").val(item["OP_OFFICE_MANAGER"]|"");
	});
}
function initEpaMessage(op_id,purchatype){
	baseAjaxJsonpNoCall(dev_outsource+'outperson/findEpaMessage.asp?SID='+SID,{"op_id":op_id,"purch_type":purchatype},function(data){
		if(data!=null&&data.result!=null&&data.result=="true"){
			var item = data.rows;
			    for(var k in item){
					getCurrentPageObj().find("#OPDT_"+k).text(item[k]||"");
				}
			var out_resume=getCurrentPageObj().find("#ETA_out_resume");
			if(out_resume.length>0&&item&&item["OUT_RESUME"]){
				findFileInfo(item["OUT_RESUME"],function(data){
					if(data.rows.length>0){
						defaultShowFileInfo(item["OUT_RESUME"],out_resume.parent(),data,false,"outResumeFileDiv");
					}
				});
			}
		}
	});
}
function eduWorkInfoTableDetail(){
	var op_code = getCurrentPageObj().find("#idcard_no").val();
	eduinfoTableDetail(op_code);
	workInfoTableDetail(op_code);
}
function qualCertlifTableDetail(){
	var op_code = getCurrentPageObj().find("#idcard_no").val();
	qualificateInfoTableDetail(op_code);
	skill_infoTableDetail(op_code);
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
	var call = getMillisecond();
	getCurrentPageObj().find("#eduinfo_table_detail").bootstrapTable({////教育信息
		url : dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+'&call='+call+'&SID='+SID,//请求后台的URL（*）
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:call,
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
	var call = getMillisecond();
	getCurrentPageObj().find("#workInfo_table_detail").bootstrapTable({//工作履历信息
		//请求后台的URL（*）
		url :  dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+'&call='+call+'&SID='+SID,
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:call,
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
		}, {
			field : "",
			title : "操作",
			align : "center",
			formatter : function(value,row,index){
				var str = "<span style='color:blue;cursor:pointer' onclick='viewDWorkDetail("+index+")' >查看</span>";
				return str;
			}
		} ]
	});
}
//查看工作履历详情
function viewDWorkDetail(index){
	var data = getCurrentPageObj().find("#workInfo_table_detail").bootstrapTable("getData")[index];
	for(var key in data){
		getCurrentPageObj().find("#opDModal_workDetail").find("div[name='"+key+"']").text(formatString(data[key]));
	}
	getCurrentPageObj().find("#opDModal_workDetail").modal("show");
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
	var call = getMillisecond(); 	
	getCurrentPageObj().find("#qualificate_info_table_detail").bootstrapTable({////教育信息
		url : dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+'&call='+call+'&SID='+SID,//请求后台的URL（*）
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:call,
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
	var call=getMillisecond();
	getCurrentPageObj().find("#skill_info_table_detail").bootstrapTable({//工作履历信息
		//请求后台的URL（*）
		url : dev_outsource+"outperson/querySkillInfo.asp?op_code="+op_code+'&call='+call+'&SID='+SID,
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:call,
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
function projrctInfoTableDetail(){
	var op_code = getCurrentPageObj().find("#idcard_no").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var call=getMillisecond();
	getCurrentPageObj().find("#projrct_info_table_detail").bootstrapTable({//教育信息
		url : dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+'&call='+call+'&SID='+SID,//请求后台的URL（*）
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:call,
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
	var call=getMillisecond();
	getCurrentPageObj().find("#quali_level_table_detail").bootstrapTable({
		url : dev_outsource+'outperson/queryQualiLevelInfo.asp?op_code='+op_code+'&call='+call+'&SID='+SID,//请求后台的URL（*）
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:call,
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
			title : '开发方向',
			align : "center"
		},{
			field : 'OP_GRADE_NAME',
			title : '人员级别',
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
//人员考核信息
function optCheckTableDetail() {
	var op_code = getCurrentPageObj().find("#idcard_no").val();
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	var call=getMillisecond();
	getCurrentPageObj().find("#opt_check_table_detail").bootstrapTable({
				url : dev_outsource+"OptCheck/queryalloptcheck.asp?SID="+SID+"&call="+call+"&op_code="+op_code,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "CHECK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:call,
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
				},{
					field : 'OP_ID',
					title : '外包人员id',
					align : 'center',
					visible:false
				},{
					field : 'CHECK_ID',
					title : '考核id',
					align : 'center',
					visible:false
				},{
					field : 'IDCARD_NO',
					title : '身份证',
					align : "center"
				},{
					field : 'OP_NAME',
					title : '人员姓名',
					align : "center"
				}, {
					field : "SUP_NAME",
					title : "供应商名称",
					align : "center"
				}, {
					field : "OP_STAFF_NAME",
					title : "行方项目经理",
					align : "center"
				}, {
					field : "CHECK_SCORE",
					title : "考核分数",
					align : "center"
				}, {
					field : "CHECK_ENDTIME",
					title : "考核时间",
					align : "center"
				}, {
					field : "CHECK_TYPE_DISPLAY",
					title : "考核类别",
					align : "center"
				}]
			});
};
//人员考勤信息
function optAttTableDetail() {
	var op_code = getCurrentPageObj().find("#idcard_no").val();
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	var call=getMillisecond();
	getCurrentPageObj().find("#opt_att_table_detail").bootstrapTable({
		url : dev_outsource+'optattendance/queryOptAttendanceList.asp?call='+call+'&SID='+SID+"&op_code="+op_code,
		method : 'get', //请求方式（*）   
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,20],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ACC_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:call,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		},{
			field : 'R',
			title : '序号',
			align : "center",
		},{
			field : 'ACC_ID',
			title : '员工考勤id',
			align : 'center',
			visible:false,
		},{
			field : 'OP_CODE',
			title : '外包人员编号',
			align : "center",
			visible:true,
		},{
			field : 'USER_NAME',
			title : '外包人员姓名',
			align : "center",
		},{
			field : "SUP_NAME",
			title : "供应商名称",
			align : "center"
		},{
			field : 'ACC_TYPE_NAME',
			title : '考勤类型',
			align : "center",
		},{
			field : 'WORK_DATE',
			title : '考勤日期',
			align : "center",
		}, {
			field : "BERW_TIME",
			title : "上班时间",
			align : "center",
		}, {
			field : "AFTW_TIME",
			title : "下班时间",
			align : "center",
		},  {
			field : "WORK_HOURS",
			title : "工时时长",
			align : "center"
		},  {
			field : "ACC_STATUS_NAME",
			title : "考勤状态",
			align : "center"
		}]
	});
};
//请销假列表
function optHolidayTableDetail() {
	var op_code = getCurrentPageObj().find("#idcard_no").val();
	var columns =
		[ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'OP_ID',
			title : '外包人员id',
			align : 'center',
			visible:false
		},{
			field : 'LEAVE_ID',
			title : '请假id',
			align : 'center',
			visible:false
		},{
			field : 'INSTANCE_ID',
			title : '流程id',
			align : 'center',
			visible:false
		},{
			field : 'IDCARD_NO',
			title : '身份证',
			align : "center"
		},{
			field : 'OP_NAME',
			title : '人员姓名',
			align : "center"/*,
			formatter:function(value,row,index){
					return '<a style="color:blue" href="javascript:void(0)" onclick="openOptHolidayDetail(\''+row.LEAVE_ID+'\',\''+row.INSTANCE_ID+'\')";>'+value+'</a>';
			}*/
		}, {
			field : 'OP_PHONE',
			title : '联系电话',
			align : "center"
		},{
			field : "SUP_NAME",
			title : "供应商名称",
			align : "center"
		}, {
			field : "LEAVE_DAYS",
			title : "请假天数",
			align : "center"
		}, {
			field : "CLEAR_DAYS",
			title : "销假天数",
			align : "center"
		}, {
			field : "START_DATE",
			title : "请假开始时间",
			align : "center"
		}, {
			field : "END_DATE",
			title : "请假结束时间",
			align : "center"
		}, {
			field : "LEAVE_CATEGORY_DISPLAY",
			title : "假别",
			align : "center"
		}, {
			field : "LEAVE_STATE_DISPLAY",
			title : "请假状态",
			align : "center"
		}];
	
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	var call=getMillisecond();
	getCurrentPageObj().find("#opt_holiday_table_detail").bootstrapTable({
				url : dev_outsource+"opsHoliday/queryAllPersonHoliday.asp?SID="+SID+"&call="+call+"&menu_type=query"+"&op_code="+op_code,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "CHECK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:call,
				singleSelect: true,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : columns
			});
	//查看详情页面
	getCurrentPageObj().find("#opsHoliday_view").unbind("click");
	getCurrentPageObj().find("#opsHoliday_view").click(function(){
		var id = getCurrentPageObj().find("#opt_holiday_table_detail").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		closeAndOpenInnerPageTab("opsHolidayDetail","外包人员请假详细信息","dev_outsource/outsource/outPersionHolidayManage/outpersonHoliday_detail.html",function(){
			initOpsHolidayaddViewPage(id[0]);
			initAFApprovalInfo(id[0]["INSTANCE_ID"],"0");
		});
	});
};
//历史级别列表
function hisRankTableDetail() {
	var op_code = getCurrentPageObj().find("#idcard_no").val();
	var queryParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	var call = getMillisecond();
	getCurrentPageObj().find("#his_rank_table_detail").bootstrapTable({
				url : dev_outsource+'outperson/queryRankPerson.asp?op_idcard='+op_code+'&call='+call+'&SID='+SID+'&purchStr=purchStr',//请求后台的URL（*）
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "OP_CODE", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:call,
				columns : [ {
					field: 'middle',
					checkbox: false,
					rowspan: 2,
					align: 'center',
					valign: 'middle',
					visible : false
				},{
					field : 'abcdef',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
	        			  return index+1;
		        	  }
				},{
					field : 'OP_CODE',
					title : '身份证号',
					align : "center"
				},{
					field : 'OP_NAME',
					title : '姓名',
					align : "center"
				},{
					field : 'QUALIFICATE_LEVEL_NAME',
					title : '开发方向',
					align : "center"
				},{
					field : 'OP_GRADE_NAME',
					title : '人员级别',
					align : "center"
				},{
					field : 'STATUS',
					title : '人员状态',
					align : "center"
				}, {
					field : "SEX",
					title : "性别",
					align : "center",
				}, {
					field : "SUPPLIER_NAME",
					title : "供应商名称",
					align : "center",
				},  {
					field : "ORG_NAME",
					title : "行内归属部门",
					align : "center"
				},  {
				field : "SCORE",
					title : "考核分数",
					align : "center",
					visible : false
				},  {
					field : "ISCANLEVELUP",
					title : "是否可升级",
					align : "center",
					visible : false
				}]
			},call);
	};


	
function shenpiwbTableDetail(){
		var op_idcard = getCurrentPageObj().find("#idcard_no").val();
		shenpiliuchengRu(op_idcard);
		shenpiliuchengQing(op_idcard);
}
function shenpiliuchengRu(op_idcard){
    var Call = getMillisecond()+'2';
	var urls=dev_outsource+'outperson/approvalProcest.asp';
	baseAjaxJsonp(urls,{SID:SID,call:Call,op_idcard:op_idcard},function(msg){
		if(msg.instance_id!=null){
			shenpiwbTableRu(msg.instance_id);
		}
	}, Call);
}
function shenpiliuchengQing(op_idcard){
	var changeCall = getMillisecond()+'1';
	var url=dev_outsource+'outperson/approvalProcess.asp';
	baseAjaxJsonp(url,{SID:SID,call:changeCall,op_idcard:op_idcard},function(msc){
		if(msc.instance_id!=null){
			shenpiwbTableQing(msc.instance_id);
		}
	}, changeCall);
}
function initcontentPop(){
		getCurrentPageObj().find('#apphistoryPop').empty();
		getCurrentPageObj().find('#apphistoryPop').append(
			'<div class="ecitic-title">'+
				'<span>入/离场流程审批列表<em></em></span>'+
			'</div>'+
			'<div class="ecitic-new">'+
				'<table id="AFApprovalTableInfo" class="table table-bordered table-hover"></table>'+
			'</div>'		
		);
}
function shenpiwbTableRu(instance_id) {
		this.instance_id=instance_id;
		//initTitle(instance_id);
		initcontentPop();
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		var tableCall = 'jq_1529570877440';	
		getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable({
			url :'AFLaunch/queryAFApprovalLists.asp?instance_id='+instance_id+"&call="+tableCall,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : false, //是否启用点击选中行
			uniqueId : "af_id", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:tableCall,
			singleSelect: true,
			onLoadSuccess:function (){
				setRowspan("AFApprovalTableInfo");
			},
			columns : [{
				field : 'N_ID',
				title : '审批节点id',
				align : "center",
				visible:false
			},{
				field : 'N_NAME',
				title : '审批岗位',
				align : "center",
				valign: "middle"
			}, {
				field : "APP_PERSON",
				title : "工号",
				align : "center",
				visible:false
			}, {
				field : "APP_PERSON_NAME",
				title : "审批人",
				align : "center"
			}, {
				field : "APP_STATE",
				title : "操作",
				align : "center",
				formatter:function(value,row,index){
	        	  if(row.STATE_NAME){
	        		  return row.STATE_NAME;
	        	  } 
	        	  return '--';
	          }
			}, {
				field : "APP_CONTENT",
				title : "审批意见",
				align : "center"
			}, {
				field : "OPT_TIME",
				title : "审批时间",
				align : "center"
			}]
		});
}

function initcontentPops(){
	getCurrentPageObj().find('#apphistoryPops').empty();
	getCurrentPageObj().find('#apphistoryPops').append(
		'<div class="ecitic-title">'+
			'<span>请/销假流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="AFApprovalTableInfos" class="table table-bordered table-hover table-text-show"></table>'+
		'</div>'		
	);
}
function shenpiwbTableQing(instance_id) {
	this.instance_id=instance_id;
	initcontentPops();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var tableCalls = getMillisecond()+1;
	getCurrentPageObj().find('#AFApprovalTableInfos').bootstrapTable({
		url :'AFLaunch/queryAFApprovalLists.asp?instance_id='+instance_id+"&call="+tableCalls,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCalls,
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("AFApprovalTableInfos");
			gaveInfo();
		},
		columns : [{
			field : 'N_ID',
			title : '审批节点id',
			align : "center",
			visible:false
		},{
			field : 'N_NAME',
			title : '审批岗位',
			align : "center",
			valign: "middle"
		}, {
			field : "APP_PERSON",
			title : "工号",
			align : "center",
			visible:false
		}, {
			field : "APP_PERSON_NAME",
			title : "审批人",
			align : "center"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
        	  if(row.STATE_NAME){
        		  return row.STATE_NAME;
        	  } 
        	  return '--';
          }
		}, {
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
}
