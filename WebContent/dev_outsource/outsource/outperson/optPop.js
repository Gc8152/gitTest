function initOptPopOrgEvent(){
	//行员pop框
	var obj=getCurrentPageObj().find("#pop_opt_staff_id_name");
	obj.unbind("click");
	obj.click(function(){
		openStaffPop("supNameOptPop",{singleSelect:true,name:getCurrentPageObj().find("#pop_opt_staff_id_name"),staff_id:getCurrentPageObj().find("#pop_opt_staff_id")});
	});
	//供应商pop框
	obj=getCurrentPageObj().find("#pop_opt_supplier_id_name");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("staffNameOptPop",{singleSelect:true,parent_company:getCurrentPageObj().find("#pop_opt_supplier_id_name"),parent_sup_num:getCurrentPageObj().find("#pop_opt_supplier_id")});
	});
}
function openOptPop(id,callparams,callback){
	//先清除
	getCurrentPageObj().find('#myModal_opt').remove();
	//getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("dev_outsource/outsource/outperson/optPop.html",{},function(){
		getCurrentPageObj().find("#myModal_opt").modal("show");
		var url = dev_outsource+"outperson/findOutPersonInfo.asp?a=1";
		//callparams获取到所有外包人员的信息
		optPop("#pop_optTable",url,callparams);
	});
	if(callback){
		viliaddStaff=callback;
	}
}

function openOptPopBySUser(id,callparams,callback){
	//先清除
	getCurrentPageObj().find('#myModal_opt').remove();
	//getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("dev_outsource/outsource/outperson/optPop.html",{},function(){
		getCurrentPageObj().find("#myModal_opt").modal("show");
		var url = dev_outsource+"outperson/findOutPersonInfo.asp?query_type=nosuser";
		//callparams获取到所有外包人员的信息
		optPop("#pop_optTable",url,callparams);
	});
	if(callback){
		viliaddStaff=callback;
	}
}
var queryParams=function(params){
	var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
	};
	return temp;
};	
/**
	 * 用户POP框
	 */
function optPop(optTable,optUrl,optParam){
	var singleSelect=true;//判断是否为复选
	if(optParam.singleSelect==false){
		singleSelect=false;
	}
	if(!singleSelect){
		$("#optPOPSureSelected").parent().show();
		$("#optPOPSureSelected").unbind("click");
		$("#optPOPSureSelected").click(function(){
			var ids = getCurrentPageObj().find(supplierTable).bootstrapTable('getSelections');
			if(optParam.name&&optParam.no){
				var kvs=arrayObjToStr2(optParam.no,ids,"OP_CODE","OP_NAME");
				if(""==optParam.name.val()||optParam.name.attr("placeholder")==optParam.name.val()){
					optParam.no.val(kvs[0]);
					optParam.name.val(kvs[1]);
				}else if(""!=kvs[0]&&""!=kvs[1]){
					optParam.no.val(optParam.no.val()+","+kvs[0]);
					optParam.name.val(optParam.name.val()+","+kvs[1]);
				}
				$('#myModal_opt').modal('hide');
			}
		});
	}else{
		$("#optPOPSureSelected").parent().hide();
	}
	var columns=[ 
        {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
			visible:!singleSelect
		},{
			field : 'OP_ID',
			title : '外包人员主键',
			align : "center",
			visible:false
		},{
			field : 'OP_CODE',
			title : '身份证号',
			align : "center"
		},{
			field : 'OP_NAME',
			title : '外包人员姓名',
			align : "center"
		},{
			field : "SUPPLIER_NAME",
			title : "供应商名称",
			align : "center"
		},{
			field : "OP_BIRTHDAY",
			title : "出生日期",
			align : "center",
			visible:false
		},{
			field : "OP_PHONE",
			title : "联系电话",
			align : "center",
			visible:false
		},{
			field : "EDUCATION_NAME",
			title : "学历",
			align : "center",
			visible:false
		},{
			field : "GRADUATE_COLLEGE",
			title : "毕业院校",
			align : "center",
			visible:false
		},{
			field : "OP_SPECIAL",
			title : "专业",
			align : "center",
			visible:false
		},{
			field : "START_WORKTIME",
			title : "参加工作时间",
			align : "center",
			visible:false
		},{
			field : "OP_EMAIL",
			title : "电子邮件",
			align : "center",
			visible:false
		},{
			field : "JOB_TYPE_NAME",
			title : "人员岗位",
			align : "center",
			visible:false
		},{
			field : "OP_STATE_NAME",
			title : "人员状态",
			align : "center"
		},{
			field : "OP_SKILLS_NAME",
			title : "技术特长",
			align : "center",
			visible:false
		},{
			field : "OP_SPECIALTYPE",
			title : "专业分类编号",
			align : "center",
			visible:false
		},{
			field : "OP_SPECIALTYPE_NAME",
			title : "专业分类",
			align : "center",
			formatter:function(value,row,index){
				if(value=="测试类"){
					return value;
				}else if(value=="运维类"){
					return value;
				}else{
					return "开发类";
				}
			}
		},{
			field : "SEX_NAME",
			title : "性别",
			align : "center",
			visible:false
		}];
	//查询所有行员POP框
	getCurrentPageObj().find(optTable).bootstrapTable("destroy").bootstrapTable({
				//请求后台的URL（*）
				url : optUrl+'&call=jq_1520840212928&SID='+SID,
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
				uniqueId : "user_no", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: singleSelect,
				jsonpCallback:"jq_1520840212928",
				onDblClickRow:function(row){
					if(singleSelect){
						getCurrentPageObj().find('#myModal_opt').modal('hide');
						if(optParam.no){//外包人员编号
							optParam.no.val(row.IDCARD_NO);
						}
						if(optParam.op_name){//外包人员姓名
							optParam.op_name.val(row.OP_NAME);
						}
						if(optParam.supplier_name){//供应商名称
							optParam.supplier_name.val(row.SUPPLIER_NAME);
						}
						if(optParam.supplier_id){//供应商
							optParam.supplier_id.val(row.SUPPLIER_ID);
						}
						if(optParam.op_id){//主键id
							optParam.op_id.val(row.OP_ID);
						}
						if(optParam.sex_name){//性别
							optParam.sex_name.val(row.SEX_NAME);
						}
						if(optParam.op_birthday){//出生日期
							optParam.op_birthday.val(row.OP_BIRTHDAY);
						}
						if(optParam.op_phone){//联系电话
							optParam.op_phone.val(row.OP_PHONE);
						}
						if(optParam.education_name){//学历
							optParam.education_name.val(row.EDUCATION_NAME);
						}
						if(optParam.graduate_college){//毕业院校
							optParam.graduate_college.val(row.GRADUATE_COLLEGE);
						}
						if(optParam.op_special){//专业
							optParam.op_special.val(row.OP_SPECIAL);
						}
						if(optParam.start_worktime){//参加工作时间
							optParam.start_worktime.val(row.START_WORKTIME);
						}
						if(optParam.op_email){//电子邮件
							optParam.op_email.val(row.OP_EMAIL);
						}
						if(optParam.job_type_name){//人员岗位
							optParam.job_type_name.val(row.JOB_TYPE_NAME);
						}
						if(optParam.op_state_name){//人员状态
							optParam.op_state_name.val(row.OP_STATE_NAME);
						}
						if(optParam.op_skills_name){//技术特长
							optParam.op_skills_name.val(row.OP_SKILLS_NAME);
						}
						if(optParam.op_specialtype_name){//专业分类
							optParam.op_specialtype_name.val(row.OP_SPECIALTYPE_NAME);
						}
						if(optParam.purch_type_name){//人员采购类型
							optParam.purch_type_name.val(row.PURCH_TYPE_NAME);
						}
						initBankInfo(row.OP_CODE);//初始化行内信息
						getCurrentPageObj().find("#info_show").show();
						getCurrentPageObj().find("#kaohe").show();
						getCurrentPageObj().find("#OCA_check_date").val((new Date()).getFullYear()+'-'+((new Date()).getMonth()+1)+'-'+(new Date()).getDate());
					}
				},
				columns : columns
			});
		
	
	//行员POP重置
	getCurrentPageObj().find("#pop_optReset").click(function(){
		getCurrentPageObj().find(".row input").each(function(){
			$(this).val("");
		});
		
		if(optParam.name){
			optParam.name.removeData("node");
		}
	});
	//多条件查询行员信息
	getCurrentPageObj().find("#pop_optSearch").click(function(){
		var pop_optCode = getCurrentPageObj().find("#pop_optCode").val();
		var pop_optname =  getCurrentPageObj().find("#pop_optname").val();
//			var pop_opt_supplier_id =  $.trim(getCurrentPageObj().find("#pop_opt_supplier_id").val());
//			var pop_opt_staff_id =  $.trim(getCurrentPageObj().find("#pop_opt_staff_id").val());
		getCurrentPageObj().find(optTable).bootstrapTable('refresh',{url:optUrl+"?call=jq_1520840212928&op_name="+escape(encodeURIComponent(pop_optname))+"&op_code="+pop_optCode});//+"&supplier_id="+pop_opt_supplier_id+"&staff_id="+pop_opt_staff_id});
	});
}
	
function closeOptPop(){
	getCurrentPageObj().find('#myModal_opt').modal('hide');
}