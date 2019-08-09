var workcall=getMillisecond();
var queryParams=function(params){
	var temp={};
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};
/**
 * 组装查询url 
 * @returns {String}
 */
function queryOutworkbenchUrl(){
	var url = dev_outsource+'outperson/findOutPersonInfo.asp?call='+workcall+'&SID='+SID+'&query=queryList&out_work=08';
	var sts="";
	var selects=getCurrentPageObj().find("select[name^='FD.']");//获取下拉选的值
	for(var i=0;i<selects.length;i++){
		var obj=getCurrentPageObj().find(selects[i]);
		if($.trim(obj.val())!=""){
			sts+='&'+obj.attr("name").substr(3)+"="+obj.val();
		}
	}
	var fds=getCurrentPageObj().find("input[name^='FD.']");//name为FD.entranceLeave的输入框表示如离场发起查询
	for(var i=0;i<fds.length;i++){
		var obj=getCurrentPageObj().find(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(3)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url+sts;
}
//查询列表显示table
(function() {
	initSelect(getCurrentPageObj().find("#purch_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});	//人员采购类型
	initSelect(getCurrentPageObj().find("select[id='op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"});	//人员状态
	var obj=getCurrentPageObj().find("#FD_op_office");//实施处室
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"op_office_pop_fd_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#FD_op_office").val(node.name);
			getCurrentPageObj().find("input[name='FD.op_office']").val(node.id);
		});
	});
	obj=getCurrentPageObj().find("#FDsupplier_name");//供应商名称
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("outperson_contractSupplier_Pop",
				{singleSelect:true,parent_company:getCurrentPageObj().find("#FDsupplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='FD.supplier_id']")});
	});
	getCurrentPageObj().find("#outperson_Add").unbind("click");//新增按钮
	getCurrentPageObj().find("#outperson_Add").click(function(){
		closeAndOpenInnerPageTab("outpersonAdd","增加外包人员信息","dev_outsource/outsource/outperson/outperson_add.html",function(){
			 addOutPerson();
		});
	});
	getCurrentPageObj().find("#outperson_Edit").unbind("click");//修改按钮
	getCurrentPageObj().find("#outperson_Edit").click(function(){
		var dt=getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable('getSelections');
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		//先注释掉，为了更改导入的数据
//		IF(DT[0]["OP_STATE"]=='01'){
//			ALERT("在场人员不可修改！");
//			RETURN;
//		}
		//先注释掉，为了更改导入的数据
//		if(dt[0]["SPSTATE_ENTER"]=='1'){
//			alert("审批已通过，不可修改！");
//			return;
//		}
		closeAndOpenInnerPageTab("outpersonEdit","修改外包人员信息","dev_outsource/outsource/outperson/outperson_update.html",function(){
			updateOutPerson(dt[0]);
		});
	});
	getCurrentPageObj().find("#outperson_Del").unbind("click");//删除按钮
	getCurrentPageObj().find("#outperson_Del").click(function(){
		var dt=getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable('getSelections');
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		if(dt[0]["OP_STATE"]!='03'){
			alert("只有待入场人员信息可删除");
			return;
		}
		nconfirm("确定需要删除该数据？",function(){
			var call_op = getMillisecond();
			baseAjaxJsonp(dev_outsource+'outperson/deleteOutPerson.asp?call='+call_op+'&SID='+SID,{op_id:dt[0]["OP_ID"]},function(data){
				if(data&&data.result=="true"){
					getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable("refresh");
					alert("删除成功");
				}else{
					alert("删除失败");
				}
			},call_op);
		});
	});
	//查看入场
	getCurrentPageObj().find("#Outworkbench_Apply").unbind("click");//查看详情
	getCurrentPageObj().find("#Outworkbench_Apply").click(function(){
		var dt=getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable('getSelections');
		//流程id
		var flowid=$.map(dt, function (row) {
			return row.FLOWID_ENTER;                    
		});
		//审批状态
		var spstate=$.map(dt, function (row) {
			return row.SPSTATE_ENTER;                    
		});
		//流程url
		var flowurl=$.map(dt, function (row) {
			return row.FLOWURL_ENTER;                    
		});
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		closeAndOpenInnerPageTab("outpersonInbankDetailOne","查看外包人员入场信息","dev_outsource/outsource/outperson/outperson_workflowdetail.html",function(){
			initOutPersonDetail(dt[0]["OP_ID"],dt[0]["PURCH_TYPE"],dt[0]["IDCARD_NO"],flowid[0],spstate[0],flowurl[0]);
			if(dt[0]["AF_NAME"]){
				getCurrentPageObj().find("#af_title span").text(dt[0]["AF_NAME"]+"列表");
			}else{
				getCurrentPageObj().find("#af_title").hide();
			}
			if(dt[0]["INSTANCE_ID"]){
				initAFApprovalInfo(dt[0]["INSTANCE_ID"],'0');
			}
		});
	});
	//查看离场
	getCurrentPageObj().find("#outpersonout_Detail").unbind("click");//查看详情
	getCurrentPageObj().find("#outpersonout_Detail").click(function(){
		var dt=getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable('getSelections');
		//流程id
		var flowid=$.map(dt, function (row) {
			return row.FLOWID_OUT;                    
		});
		//审批状态
		var spstate=$.map(dt, function (row) {
			return row.SPSTATE_OUT;                    
		});
		//流程url
		var flowurl=$.map(dt, function (row) {
			return row.FLOWURL_OUT;                    
		});
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		closeAndOpenInnerPageTab("opOutbankDetail","查看外包人员离场信息","dev_outsource/outsource/outperson/outperson_workflowdetail.html",function(){
			initOutPersonDetail(dt[0]["OP_ID"],dt[0]["PURCH_TYPE"],dt[0]["IDCARD_NO"],flowid[0],spstate[0],flowurl[0]);
		});
	});
	//入场申请
	getCurrentPageObj().find("#Outworkbench_Apply").unbind("click");
	getCurrentPageObj().find("#Outworkbench_Apply").click(function(){
		var dt=getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable('getSelections');
		if(!dt||dt.length==0){
			alert("请选择一条数据!");
			return;
		}
		var k = dt[0]["OP_STATE"];
		if(k != "03"&&k!="08"&&k!="02"){
			alert("请选择状态为【待入场、入场被拒绝、离场】的人员发起申请！");
			return;
		};
		var purchatype=dt[0]["PURCH_TYPE"];  
		if(purchatype == ""||purchatype==null||purchatype==undefined){
			alert("请先填写资源池信息！");
			return;
		}
		if(dt.length>0){
			/*if(dt[0]["SPSTATE_ENTER"]=='1'){
				alert("您好，流程审批已通过!");
				return ;
			}*/
			//是否为非项目任务
			if(purchatype == "01"){ //"01"非项目任务
				closeAndOpenInnerPageTab("opEntranceApply","外包人员入场申请","dev_outsource/outsource/outpersonEntrance/outpersonEntrance_apply.html",function(){
					initOpEntranceApply(dt[0]["OP_ID"],purchatype);
				});
			}else{
				closeAndOpenInnerPageTab("opEntranceApply","外包人员入场申请","dev_outsource/outsource/outpersonEntrance/outpersonEntrance_apply.html",function(){
					initOpEntranceApply(dt[0]["OP_ID"],purchatype);
				});
			}
		}else{
			alert("请选择数据！");
		}
		
	});
	//离场登记
	getCurrentPageObj().find("#leave_register").unbind("click");
	getCurrentPageObj().find("#leave_register").click(function(){
		var dt=getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable('getSelections');
		if(!dt||dt.length==0){
			alert("请选择一条数据!");
			return;
		}
		closeAndOpenInnerPageTab("opOutbankDetail","人员离场信息登记","dev_outsource/outsource/outperson/outperson_leaveInfo.html",function(){
			initOutPersonLeave(dt[0]["OP_ID"]);
		});
	});
	//离场申请
	getCurrentPageObj().find("#outperson_LeaveApply").unbind("click");
	getCurrentPageObj().find("#outperson_LeaveApply").click(function(){
		var dt=getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable('getSelections');
		if(!dt||dt.length==0){
			alert("请选择一条数据!");
			return;
		}
		var k = dt[0]["OP_STATE"];
		if(k != "01"&&k != "04"&&k != "09"){
//			alert("请选择在场人员发起申请！");
			alert("请选择状态为【在场、待离场、离场拒绝】的人员发起申请！");
			return;
		};
		var purchatype= dt[0]["PURCH_TYPE"];                    
		if(dt.length>0){
			if(dt[0]["SPSTATE_OUT"]=='1'){
				alert("您好，申请已通过!");
				return ;
			}
			closeAndOpenInnerPageTab("opLeaveApply","外包人员离场申请","dev_outsource/outsource/outperson/outperson_leaveApply.html",function(){
				initOpLeaveApply(dt[0]["OP_ID"],purchatype);
			});
			/*var flag=validate_sup_pur_project(supname,purchatype,belongProject);
			if(flag){
				
			}else{
				alert("请选择同一供应商，同一人员采购类型，同一所属项目的外包人员发起批量离场申请");
				return ;
			}*/
		}else{
			alert("请选择一条数据！");
		};
		/*
		var k = dt[0]["OP_STATE"];
		if(k == "01"|| k=="04" || k=="05"|| k=="06"|| k=="07"){
			alert("该外包人员在场或锁定!");
			return;
		}*/
	});
/*	getCurrentPageObj().find("#outperson_Import").unbind("click");//导入按钮
	getCurrentPageObj().find("#outperson_Import").click(function(){
		getCurrentPageObj().find("#outpersonld").val("");
		getCurrentPageObj().find("#file_outperson_import").val("");
		getCurrentPageObj().find("#modal_outperson_import").modal("show");
	});*/
	
	getCurrentPageObj().find("#import_outperson_button").unbind("click");//导入功能
	getCurrentPageObj().find("#import_outperson_button").click(function(){
		startLoading();
	    $.ajaxFileUpload({
		    url:"outperson/importOutPersonInfo.asp",
		    type:"post",
			secureuri:false,
			fileElementId:'file_outperson_import',
			data:'',
			dataType: 'json',
			success:function (msg){
				endLoading();
				getCurrentPageObj().find("#file_outperson_import").val("");
				getCurrentPageObj().find("#modal_outperson_import").modal("hide");
				if(msg&&msg.result=="true"){
					alert("导入成功");
					getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable("refresh");
				}else if(msg&&msg.error_info){
					alert("导入失败:"+msg.error_info);
				}else{
					alert("导入失败！");
				}
			},
			error: function (msg){
				endLoading();
				alert("导入失败！");
			}
	   });
	});
	obj=getCurrentPageObj().find("#outperson_export");//外包人员导出
	obj.unbind("click");
	obj.click(function(){
		var belongproject=getCurrentPageObj().find("#belongproject").val();//身份证
		var op_name=getCurrentPageObj().find("#op_name").val();//外包人员姓名
		var supplier_id=getCurrentPageObj().find("#supplier_id").val();//供应商ID
		var op_office=getCurrentPageObj().find("#op_office").val();//实施处室
		var op_state=getCurrentPageObj().find("#op_state").val();//人员状态
		var url ="outperson/exportOutPersonInfo.asp?op_name="+escape(encodeURIComponent(op_name))+"&belongproject="+belongproject
		+"&supplier_id="+supplier_id+"&op_office="+op_office+"&op_state="+op_state;
		window.location.href = url;
	});
	//查询按钮
	getCurrentPageObj().find("#queryOutworkbenchInfo").unbind("click");
	getCurrentPageObj().find("#queryOutworkbenchInfo").click(function(){
		getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable("refresh",{url:queryOutworkbenchUrl()});
	});
	//重置按钮
	getCurrentPageObj().find("#resetOutworkbenchInfo").unbind("click");//重置按钮
	getCurrentPageObj().find("#resetOutworkbenchInfo").click(function(){
		getCurrentPageObj().find("input[name^='FD.']:visible").val(" ");
		getCurrentPageObj().find("#FDsupplier_name").val("");
		getCurrentPageObj().find("#staffInfoList select:visible").val(" ").select2();
		getCurrentPageObj().find("input[name='FD.supplier_id'],input[name='FD.op_office']").val(" ");
	});
	var outpseron_workflowType=getCurrentPageObj().find("#outpseron_workflowType").val();
	var outpseronEnterFlag=false;
	var outpseronOutFlag=false;
	if(outpseron_workflowType=="enterbank"){
		outpseronEnterFlag=true;
	}else if(outpseron_workflowType=="outbank"){
		outpseronOutFlag=true;
	}
	getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable({
				url : queryOutworkbenchUrl(),
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
				uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:workcall,
				onLoadSuccess:function(data){
					gaveInfo();
				},
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
					visible:false,
				},{
					field : 'OP_ID',
					title : '员工id',
					align : 'center',
					visible:false,
				},{
					field : 'OP_CODE',
					title : '外包人员编号',
					align : "center",
					visible:false,
				},{
					field : 'OP_NAME',
					title : '外包人员姓名',
					align : "center",
				},{
					field : 'OP_STATE_NAME',
					title : '外包人员状态',
					align : "center",
				}, {
					field : "SEX_NAME",
					title : "性别",
					align : "center",
				}, {
					field : "SUPPLIER_NAME",
					title : "供应商名称",
					align : "center",
				},  {
					field : "SSBM",
					title : "行内归属部门",
					align : "center"
				}, {
					field : "OP_STAFF_NAME",
					title : "行内项目经理",
					align : "center"
				}, {
					field : "OP_BELONGSYSTEM_NO",
					title : "所属应用编号",
					align : "center",
					visible:false
				}, {
					field : "OP_BELONGSYSTEM",
					title : "所属应用",
					align : "center"
				}, {
					field : "PURCH_TYPE_NAME",
					title : "人员采购类型",
					align : "center"
				}, {
					field : "OP_GRADE_NAME",
					title : "人员档次",
					align : "center",
					visible:false
				}, {
					field : "DEV_DIRECTION_NAME",
					title : "开发方向",
					align : "center"
				}, {
					field : "DEV_GRADE_NAME",
					title : "人员级别",
					align : "center"
				},{
					field : "BELONGPROJECT",
					title : "所属项目",
					align : "center",
					visible:false
				}, {
					field : "SPSTATENAME_ENTER",
					title : "入场审批状态",
					align : "center",
//					visible:outpseronEnterFlag,
					visible:false,
					formatter:function(value,row,index){
						var SPSTATENAME_ENTER=row.SPSTATENAME_ENTER;
						if(SPSTATENAME_ENTER==null||SPSTATENAME_ENTER==""||SPSTATENAME_ENTER==undefined){
							SPSTATENAME_ENTER="待发起";
						}
						return SPSTATENAME_ENTER;
					}
				 }, {
					field : "SPSTATENAME_OUT",
					title : "离场审批状态",
					align : "center",
					visible:outpseronOutFlag,
					formatter:function(value,row,index){
						var SPSTATENAME_OUT=row.SPSTATENAME_OUT;
						if(SPSTATENAME_OUT==null||SPSTATENAME_OUT==""||SPSTATENAME_OUT==undefined){
							SPSTATENAME_OUT="待发起";
						}
						return SPSTATENAME_OUT;
					}
				}]
			});
	//初始化导入文件
	importExcel.initImportExcel(getCurrentPageObj().find("#outperson_Import"),"外包人员信息","sfile/downloadFTPFile.asp?id=m_044","outperson/importOutPersonInfo.asp",function(msg){
		if(msg&&msg.result=="true"){
			getCurrentPageObj().find("#OutworkTableInfo").bootstrapTable("refresh");
			alert("导入成功!");
		}else if(msg&&msg.result=="false"&&msg.error_info){
			alert(msg.error_info);
		}else{
			alert("导入失败!");
		}
	});
})();
