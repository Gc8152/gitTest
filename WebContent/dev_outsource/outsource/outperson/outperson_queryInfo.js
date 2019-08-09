/**
 * 组装查询url 
 * @returns {String}
 */
var callTablequ = getMillisecond();
function queryOutPersonUrlq(){
	var url=dev_outsource+'outperson/findOutPersonInfo.asp?call='+callTablequ+'&SID='+SID+'&query=queryList';
	var sts="";
	var selects=getCurrentPageObj().find("select[name^='FDI.']");//获取下拉选的值
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			sts+='&'+obj.attr("name").substr(4)+"="+obj.val();
		}
	}
	var fds=getCurrentPageObj().find("input[name^='FDI.']");
	for(var i=0;i<fds.length;i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(4)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url+sts;
}
/**
 * “技能类型”关联“技能”的选择变化
 */
function selectSkillType(e){
	initSelect(getCurrentPageObj().find("select[name='FDI.skill']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}
/**
 * 初始化按钮各种事件
 */
(function(){
	//人员采购类型
	initSelect(getCurrentPageObj().find("#purch_type_qu"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});	
	//人员状态
	initSelect(getCurrentPageObj().find("select[name='FDI.op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"});
	//开发方向
	initSelect(getCurrentPageObj().find("select[name='FDI.dev_direction']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
	//人员级别
	initSelect(getCurrentPageObj().find("select[name='FDI.dev_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"});
	//技能类型
	initSelect(getCurrentPageObj().find("select[name='FDI.skill_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_SKILL"});
	//熟练度
	initSelect(getCurrentPageObj().find("select[name='FDI.proficiency_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_SKILL_PROFICIENCY"});
	var obj=getCurrentPageObj().find("#FDI_op_office");
	//实施处室
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"op_office_pop_fd_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#FDI_op_office").val(node.name);
			getCurrentPageObj().find("input[name='FDI.op_office']").val(node.id);
		});
	});
	//行方项目经理pop框
	getCurrentPageObj().find("#FDI_staff_name").click(function(){
		openUserPop("staffDivPop",{"name":getCurrentPageObj().find("#FDI_staff_name"),"no":getCurrentPageObj().find("#op_staff_qu"),role:'0007'});
		initModal();//POP框垂直居中
	});
	initSelect(getCurrentPageObj().find("select[name='FDI.op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"});	//人员状态
	getCurrentPageObj().find("#outperson_Detail").unbind("click");//查看详情
	getCurrentPageObj().find("#outperson_Detail").click(function(){
		var dt=getCurrentPageObj().find("#outperson_TableInfo").bootstrapTable('getSelections');
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		closeAndOpenInnerPageTab("outpersonDetailall","查看外包人员信息","dev_outsource/outsource/outperson/outperson_detail.html",function(){
			initOutPersonDetail(dt[0]["OP_ID"],dt[0]["PURCH_TYPE"],dt[0]["IDCARD_NO"]);
			//initEpaMessage(dt[0]["OP_ID"],dt[0]["PURCH_TYPE"]);
		});
	});
	//导出
	getCurrentPageObj().find("#outperson_export").unbind("click").click(function(){
		var url=dev_outsource+'outperson/exportFindOutPersonInfo.asp?SID='+SID+'&query=queryList';
		var sts="";
		var selects=getCurrentPageObj().find("select[name^='FDI.']");//获取下拉选的值
		for(var i=0;i<selects.length;i++){
			var obj=$(selects[i]);
			if($.trim(obj.val())!=""){
				sts+='&'+obj.attr("name").substr(4)+"="+obj.val();
			}
		}
		var fds=getCurrentPageObj().find("input[name^='FDI.']");
		for(var i=0;i<fds.length;i++){
			var obj=$(fds[i]);
			if($.trim(obj.val())!=""){
				url+='&'+obj.attr("name").substr(4)+"="+escape(encodeURIComponent(obj.val()));
			}
		}
		window.location.href=url+sts;
		
	})
	getCurrentPageObj().find("#outpersonLeave_Detail").unbind("click");//离场详情
	getCurrentPageObj().find("#outpersonLeave_Detail").click(function(){
		var dt=getCurrentPageObj().find("#outperson_TableInfo").bootstrapTable('getSelections');
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		closeAndOpenInnerPageTab("outpersonDetailInfo","查看离场详情","dev_outsource/outsource/outperson/outperson_leaveDetailInfo.html",function(){
			initOutPersonLeaveDetail(dt[0]["OP_ID"],dt[0]["IDCARD_NO"]);
		});
	});
	getCurrentPageObj().find("#queryInfo_OutPerson").unbind("click");//查询按钮
	getCurrentPageObj().find("#queryInfo_OutPerson").click(function(){
		getCurrentPageObj().find("#outperson_TableInfo").bootstrapTable("refresh",{url:queryOutPersonUrlq()});
	});
	getCurrentPageObj().find("#resetInfo_OutPerson").unbind("click");//重置按钮
	getCurrentPageObj().find("#resetInfo_OutPerson").click(function(){
		getCurrentPageObj().find("input[name^='FDI.']").val(" ");
		getCurrentPageObj().find("#FDIsupplier_name").val("");
		getCurrentPageObj().find("#FDI_op_office").val("");
		getCurrentPageObj().find("#FDI_staff_name").val("");
		getCurrentPageObj().find("#op_staff_qu").val("");
		getCurrentPageObj().find("select").val(" ");
		getCurrentPageObj().find("select").select2();
	});
	obj=getCurrentPageObj().find("#FDIsupplier_name");//供应商名称
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("outperson_contractSupplier_Pop_qu",
				{singleSelect:true,parent_company:getCurrentPageObj().find("#FDIsupplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='FDI.supplier_id']")});
	});
//	obj=getCurrentPageObj().find("#outperson_export");//外包人员导出
//	obj.unbind("click");
//	obj.click(function(){
		/*var purch_type=getCurrentPageObj().find("#purch_type").val();//人员采购类型
		if(purch_type==null||purch_type==undefined||purch_type=="请选择"||purch_type==""){
			alert("请先选择人员采购类型");
			return;
		}else{*/
//			var belongproject=getCurrentPageObj().find("#belongproject_qu").val();//身份证
//			var op_name=getCurrentPageObj().find("#op_name_qu").val();//外包人员姓名
//			var supplier_id=getCurrentPageObj().find("#supplier_id_qu").val();//供应商ID
//			var op_office=getCurrentPageObj().find("#op_office_qu").val();//实施处室
//			var op_state=getCurrentPageObj().find("#op_state_qu").val();//人员状态
//			var url ="outperson/exportOutPersonInfo.asp?op_name="+escape(encodeURIComponent(op_name))+"&belongproject="+belongproject
//			+"&supplier_id="+supplier_id+"&op_office="+op_office+"&op_state="+op_state;
//			window.location.href = url;
		/*}*/
//	});
})();
//function queryList(event){
//	if(event.keyCode==13){
//		getCurrentPageObj().find("#outpersonTableInfo").bootstrapTable("refresh",{url:queryOutPersonUrl()});
//	}
//}
var queryParams=function(params){
	var temp={};
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};


//查询列表显示table
(function() {
	getCurrentPageObj().find("#outperson_TableInfo").bootstrapTable({
				url : dev_outsource+'outperson/findOutPersonInfo.asp?call='+callTablequ+'&SID='+SID+'&query=queryList',
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
				jsonpCallback:callTablequ,
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
					field : 'Number',
					title : '序号',
					align : "center",
					//sortable: true,
					visible: false,
					formatter: function (value, row, index) {
							return index+1;
						}
				},{
					field : 'OP_ID',
					title : '员工id',
					align : 'center',
					visible:false
				},{
					field : 'OP_CODE',
					title : '外包人员编号',
					align : "center",
					visible:false
				},{
					field : 'OP_NAME',
					title : '外包人员姓名',
					align : "center"
				},{
					field : 'OP_STATE_NAME',
					title : '外包人员状态',
					align : "center"
				}, {
					field : "SEX_NAME",
					title : "性别",
					align : "center",
					/*formatter:function(value,row,index){
						return dic_item["S_DIC_SEX"][row.OP_SEX];
					}*/
				}, {
					field : "SUPPLIER_NAME",
					title : "供应商名称",
					align : "center"
				},  {
					field : "SSBM",
					title : "行内归属部门",
					align : "center"
				}, {
					field : "OP_STAFF_NAME",
					title : "行内项目经理",
					align : "center"
				}, {
					field : "PURCH_TYPE_NAME",
					title : "人员采购类型",
					align : "center"
				}/*,{
					field : "BELONGPROJECT",
					title : "所属项目",
					align : "center"
				}*/, {
					field : "OP_BELONGSYSTEM_NO",
					title : "所属应用编号",
					align : "center",
					visible:false
				}, {
					field : "OP_BELONGSYSTEM",
					title : "所属应用",
					align : "center"
				},{
					field : "ISCANLEVELUP",
					title : "是否可升级",
					align : "center",
					visible:false
				},{
					field : "DEV_DIRECTION_NAME",
					title : "开发方向",
					align : "center"
				},{
					field : "DEV_GRADE_NAME",
					title : "人员级别",
					align : "center"
				}]
			});
})();
/**
 * 判断同一供应商，同一人员采购类型，同一所属项目
 * @param supname
 * @param purchatype
 * @param belongProject
 * @param SSBM
 * @returns {Boolean}
 */
function validate_sup_pur_project(supname,purchatype,belongProject,ssbm){
	var supflag=true;
	var purflag=true;
	var projectflag=true;
	if(supname!=null&&supname!=""&&supname!=undefined){
		var supname1=supname[0];
		if(supname1==null||supname1==""||supname1==undefined){
			return false;
		}else{
			for(var i=1,length=supname.length;i<length;i++){
				if(supname1!=supname[i]){
					supflag=false;
					break;
				}
			}
		}
	}else{
		supflag=false;
	}
	if(supflag){
		if(purchatype!=null&&purchatype!=""&&purchatype!=undefined){
			var purchatype1=purchatype[0];
			if(purchatype1==null||purchatype1==""||purchatype1==undefined){
				return false;
			}else{
				for(var i=1,length=purchatype.length;i<length;i++){
					if(purchatype1!=purchatype[i]){
						purflag=false;
						break;
					}
				}
			}
		}else{
			purflag=false;
		}
	}
	if(purflag){
		if(belongProject!=null&&belongProject!=""&&belongProject!=undefined){
			var belongProject1=belongProject[0];
			if(belongProject1==null||belongProject1==""||belongProject1==undefined){
				return false;
			}else{
				for(var i=1,length=belongProject.length;i<length;i++){
					if(belongProject1!=belongProject[i]){
						projectflag=false;
						break;
					}
				}
			}
		}else{
			projectflag=false;
		}
	}
	if(supflag&&purflag&&projectflag){
		return true;
	}else{
		return false;
	}
}
