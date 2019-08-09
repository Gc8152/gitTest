var objPOP = getCurrentPageObj(); //获取页面对象
var call_op = getMillisecond();
var call_edu = getMillisecond()+'1';
var call_wor = getMillisecond()+'2';
var call_qua = getMillisecond()+'3';
var call_ski = getMillisecond()+'4';
var call_pro = getMillisecond()+'5';
var call_lev = getMillisecond()+'6';
initSelectElse();
var update="";
function formatString(data){
	if(data==null){
		return '';
	}else{
		return data;
	}
}
//加载字典项等信息
function initSelectElse(){
	//毕业院校类型
	initSelect(getCurrentPageObj().find("select[name='UPD.college_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_COLLEGE_TYPE"});	
	//岗位名称
	initSelect(getCurrentPageObj().find("select[name='UPD.job_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_POSITION_TYPE"});	
	//人员状态
	initSelect(getCurrentPageObj().find("select[name='UPD.op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"});	
	//专业分类
	initSelect(getCurrentPageObj().find("select[name='UPD.op_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"});
	//性别
	initSelect(getCurrentPageObj().find("select[name='UPD.op_sex']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_SEX"});
    //学历
	initSelect(getCurrentPageObj().find("select[name='UPD.op_education']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"});
	//学位
	initSelect(getCurrentPageObj().find("select[name='UPD.op_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEGREE"});
	//采购人员类型
	initSelect(getCurrentPageObj().find("select[name='UPD.purch_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});
	//开发方向
	initSelect(getCurrentPageObj().find("select[name='UPD.dev_direction']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
	//人员级别
	initSelect(getCurrentPageObj().find("select[name='UPD.dev_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"});
	initVlidate(objPOP);
	var obj=getCurrentPageObj().find("#staff_name_pop");
	obj.unbind("click");
	obj.click(function(){
		openStaffPop("addOutPersonUserPop",{singleSelect:true,name:getCurrentPageObj().find("#staff_name_pop"),staff_id:getCurrentPageObj().find("input[name='ADD.staff_id']"),isOpt:true});
	});
	//行内归属部门
	obj=getCurrentPageObj().find("#UPD_op_office_pop");
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"op_office_pop_add_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#UPD_op_office_pop").val(node.name);
			getCurrentPageObj().find("input[name='UPD.op_office']").val(node.id);
		});
	});
	//供应商全称
	obj=getCurrentPageObj().find("#UPD_supplier_name");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("outpersonAddSupplierPop",{singleSelect:true,parent_company:getCurrentPageObj().find("#UPD_supplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='UPD.supplier_id']")});
	});
	//所属应用pop框
	$("#UPD_op_belongsystem").click(function(){
		openSystemPop("outpersonBelongSystemPop",{func_call:function(row){
			getCurrentPageObj().find("#belongSystem").val(row.SYSTEM_ID);
			getCurrentPageObj().find("#UPD_op_belongsystem").val(row.SYSTEM_NAME);
			/*getCurrentPageObj().find("#op_office").val(row.BUSINESS_DEPT_ID);
			getCurrentPageObj().find("#UPD_op_office_pop").val(row.BUSINESS_DEPT_NAME);*/
			getCurrentPageObj().find("#op_office").val(row.RES_GROUP_ID);
			getCurrentPageObj().find("#UPD_op_office_pop").val(row.RES_GROUP_NAME);
			getCurrentPageObj().find("#UPD_op_staff").val(row.PROJECT_MAN_ID);
			getCurrentPageObj().find("#UPD_op_staff_name").val(row.PROJECT_MAN_NAME);
		}	
		});
		//initModal();//POP框垂直居中
	});
	//行方项目经理pop框
	$("#UPD_op_staff_name").click(function(){
		openUserPop("userOrgDivPop",{"name":$("#UPD_op_staff_name"),"no":$("#UPD_op_staff"),role:'0007'});
		initModal();//POP框垂直居中
	});
}
//新增外包人员
function addOutPerson(){//字典初始化方法
	initSaveButton("yes");
	getCurrentPageObj().find("li[name='otherMsg']").hide();
	var currentUser_roles = $("#currentUser_roles").val();
	if(currentUser_roles!=null && currentUser_roles!=null ){
		
	var roles = currentUser_roles.split(",");
	for(var i=0;i<roles.length;i++){
		if(roles[i]=='0007'){
			getCurrentPageObj().find("#UPD_op_office_pop").val($("#currentLoginNoOrg_name").val());
			getCurrentPageObj().find("input[name='UPD.op_office']").val($("#currentLoginNoOrg_no").val());
			getCurrentPageObj().find("#UPD_op_staff").val($("#currentLoginNo").val());
			getCurrentPageObj().find("input[name='UPD.op_staff_name']").val($("#currentLoginName").val());
		}
	}
	}
};
//根据是否当前资质控制资质结束时间是否必填
function changeEndTimeIsMustOrNot(v){
	//是当前资质 不必填
	if(v=="01"){
		objPOP.find("#qu_end_time").removeAttr("validate");
		objPOP.find("#qu_end_time").removeAttr("valititle");
		getCurrentPageObj().find("#qu_end_time").parent().find("strong[class^='high']").remove();
		initVlidate(objPOP);
	}else{
		getCurrentPageObj().find("#qu_end_time").attr("validate","v.required");
		getCurrentPageObj().find("#qu_end_time").attr("valititle","请填写档次结束时间");
		initVlidate(objPOP);
	}
}
//修改外包人员(获取到选中行的id)
function updateOutPerson(item){
	update="update";
	for(var k in item){
		var k1 = k.toLowerCase();
		if(k1=="memo"){
			getCurrentPageObj().find("textarea[name='UPD.memo']").text(formatString(item[k]));
		}else if(k1 == "op_skills"){
			//技术
			initSelect(getCurrentPageObj().find("select[name='UPD.op_skills']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:item["OP_SPECIALTYPE"]},item[k]);
		}else if(k1 == "college_type"){
			//毕业院校类型
			initSelect(getCurrentPageObj().find("select[name='UPD.college_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_COLLEGE_TYPE"},item[k]);	
		}else if(k1 == "job_type"){	
			//岗位名称
			initSelect(getCurrentPageObj().find("select[name='UPD.job_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_POSITION_TYPE"},item[k]);	
		}else if(k1 == "op_state"){		
			//人员状态
			initSelect(getCurrentPageObj().find("select[name='UPD.op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"},item[k]);	
		}else if(k1 == "op_specialtype"){	
			//专业分类
			initSelect(getCurrentPageObj().find("select[name='UPD.op_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"},item[k]);
		}else if(k1 == "op_education"){	
		    //学历
			initSelect(getCurrentPageObj().find("select[name='UPD.op_education']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"},item[k]);
		}else if(k1 == "op_degree"){	
			//学位
			initSelect(getCurrentPageObj().find("select[name='UPD.op_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEGREE"},item[k]);
		}else if(k1 == "op_sex"){	
			//性别
			initSelect(getCurrentPageObj().find("select[name='UPD.op_sex']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_SEX"},item[k]);
		}else if(k1 == "purch_type"){	
			//人员采购类型
			initSelect(getCurrentPageObj().find("select[name='UPD.purch_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"},item[k]);
		}else if(k1 == "sup_num"){
			getCurrentPageObj().find("input[name='UPD.supplier_id']").val(item[k]);
		}else if(k1 == "dev_direction"){
			if(item['op_state']=='03'){
				initSelect(getCurrentPageObj().find("select[name='UPD.dev_direction']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},item[k]);
			}else{
				initSelect(getCurrentPageObj().find("select[name='UPD.dev_direction']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},item[k]);
				getCurrentPageObj().find("select[name='UPD.dev_direction']").attr("disabled",true);
			}
		}else if(k1 == "dev_grade"){
			if(item['op_state']=='03'){
				initSelect(getCurrentPageObj().find("select[name='UPD.dev_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},item[k]);
			}else{
				initSelect(getCurrentPageObj().find("select[name='UPD.dev_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},item[k]);
				getCurrentPageObj().find("select[name='UPD.dev_grade']").attr("disabled",true);
			}
		}else {
			getCurrentPageObj().find("input[name='UPD."+k1+"']").val(formatString(item[k]));
		}
	}
	getCurrentPageObj().find("input[name='UPD.op_name']").attr("readonly",true);
	getCurrentPageObj().find("input[name='UPD.idcard_no']").attr("readonly",true);
	initMoreMsgPOP();
	initSaveButton("no");
}
function isCard(val){
	val=val.toUpperCase();
	if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(val))){
		alert("身份证长度不正确或不符合规定！");
		return false;
	}
	return true;
}
/**
 * “专业分类”关联“技术特长”的选择变化
 */
function selectOptSkills(e){
	initSelect(getCurrentPageObj().find("select[name='UPD.op_skills']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}
/**
 * “技能类型”关联“技能”的选择变化
 */
function selectSkillType(e){
	initSelect(objPOP.find("#skillinfo_form").find("select[name='skill']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}
/**
 * “资质级别”关联“人员档次”的选择变化
 */
function selectPurchType(purch_type){
	if(purch_type=="01"){
		$("#trshow").show();
		$(".td_ass").show();
		$(".td_con").hide();
		$(".td_hide").show();
		$("input[name='ass_code']").val("");
		$("input[name='contract_code']").val("");
	}else if(purch_type=="02"){
		$("#trshow").show();
		$(".td_ass").hide();
		$(".td_con").show();
		$(".td_hide").show();
		$("input[name='ass_code']").val("");
		$("input[name='contract_code']").val("");
	}else if(purch_type=="04"){
		$("#trshow").hide();
		$("input[name='ass_code']").val("");
		$("input[name='contract_code']").val("");
	}else if(purch_type=="05"){
		$("#trshow").hide();
		$("input[name='ass_code']").val("");
		$("input[name='contract_code']").val("");
	}
}
function selectQualiLevel(e){
	initSelect(objPOP.find("#qualiLevelinfo_form").find("select[name='op_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}
function changeCode(op_code){
	//检查身份证号码是否重复
	var call_op = getMillisecond();
	if(update!="update"){
		baseAjaxJsonp(dev_outsource+"outperson/judgeCode.asp?op_code="+op_code+'&call='+call_op+'&SID='+SID,null,function(data){
			if(data["rows"].length>0){
				alert("身份证号信息已存在，请确认后重新输入！");
				getCurrentPageObj().find("input[name='UPD.idcard_no']").val("");
				return;
			}
		}, call_op);
	}
}
function initSaveButton(isNew){//初始化保存按钮
	var obj=getCurrentPageObj().find("#saveOutPerson");
	obj.unbind("click");
	obj.click(function(){
		var idcard_no=getCurrentPageObj().find("input[name='UPD.idcard_no']").val();
		changeCode(idcard_no);//检查身份证号是否重复
		if(vlidate(getCurrentPageObj().find("#myForm"),"",false)){
			var card=getCurrentPageObj().find("input[name='UPD.idcard_no']").val();
			var flag=isCard(card);//检查身份证号是否符合要求
			if(flag==false){
				return;
			}
			var param = {};
			var vals=getCurrentPageObj().find("[name^='UPD.']");
			for(var i=0;i<vals.length;i++){
				var val=$(vals[i]);
				if($.trim(val.val())!=""){
					param[val.attr("name").substr(4)]=val.val();
				}
			}
			var start_worktime=param.start_worktime;//参加工作时间
			var work_finance_time=param.work_finance_time;//银行从业时间
			var join_bank_time=param.join_bank_time;//如本行时间
			if(start_worktime>work_finance_time||start_worktime>join_bank_time){
				alert("参加工作时间不能小于银行从业时间和入本行时间！");
				return;
			}
			if(work_finance_time>join_bank_time){
				alert("银行从业时间不能小于入本行时间！");
				return;
			}
			if(isNew == "yes"){//是否是新增
				var  call_op = getMillisecond();
				baseAjaxJsonp(dev_outsource+'outperson/addOutPersonInfo.asp?call='+call_op+'&SID='+SID,param,function(data){
					if(!data||!data.result||data.result=="false"){
						alert((data.msg||"保存失败!"));
					}else{
						alert("保存成功!");
						obj.unbind("click");
						getCurrentPageObj().find("li[name='otherMsg']").show();
						getCurrentPageObj().find("#bascInfo").removeClass("active");
						getCurrentPageObj().find("#UPD_basic_info").removeClass("active");
						getCurrentPageObj().find("#eduAndWork").addClass("active");
						getCurrentPageObj().find("#eduAndWork").addClass("active");
						getCurrentPageObj().find("#UPD_edu_work").addClass("active"); 
						initMoreMsgPOP();//初始化其他信息页签按钮
					}
				},call_op);
			}else if(isNew == "no"){
				var  call_op = getMillisecond();
				baseAjaxJsonp(dev_outsource+'outperson/updOutPerson.asp?call='+call_op+'&SID='+SID,param,function(data){
					if(!data||!data.result||data.result=="false"){
						alert("保存失败!");
					}else{
						alert("保存成功!");
						obj.unbind("click");
						getCurrentPageObj().find("li[name='otherMsg']").show();
						getCurrentPageObj().find("#ubascInfo").removeClass("active");
						getCurrentPageObj().find("#ubasic_info").removeClass("active");
						getCurrentPageObj().find("#ueduAndWork").addClass("active");
						getCurrentPageObj().find("#ueduAndWork").addClass("active");
						getCurrentPageObj().find("#uedu_work").addClass("active"); 
						uinitMoreMsgPOP();//初始化其他信息页签按钮
					}
				}, call_op);
			}
		}
	});
};
//初始化页签增删改按钮
function initMoreMsgPOP(){
	getCurrentPageObj().find("#opModal_eduinfo").draggable({handle:"#hed"});
	var op_code = objPOP.find("input[name='UPD.idcard_no']").val();
	objPOP.find("input[name='UPD.op_code']").val(op_code);
	/*******教育经历*******/
	eduInfo(op_code);
	//新增
	objPOP.find("#add_eduinfo").unbind("click");
	objPOP.find("#add_eduinfo").click(function(){
		//学历
		initSelect(objPOP.find("#eduinfo_form").find("select[name='edu_background']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"});
		objPOP.find("#eduinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#eduinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find('#opModal_eduinfo').modal('show');
		saveEduMsg(op_code,"add"," ");
		
	});
	//修改
	objPOP.find("#update_eduinfo").unbind("click");
	objPOP.find("#update_eduinfo").click(function(){
		var params = objPOP.find("#eduinfo_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "special_desc"){
				objPOP.find("#eduinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else if(k1 == "edu_background"){
				initSelect(objPOP.find("#eduinfo_form").find("select[name='edu_background']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"},params[0][k]);
			}else{
				objPOP.find("#eduinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#opModal_eduinfo').modal('show');
		saveEduMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#delete_eduinfo").unbind("click");
	objPOP.find("#delete_eduinfo").click(function(){
		var id = objPOP.find("#eduinfo_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/deleteEduInfo.asp?op_id="+ids+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#eduinfo_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryEduInfo.asp?op_code='+call_edu+'&call='+call_edu+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
	});
	/********工作履历********/
	workInfo(op_code);
	getCurrentPageObj().find("#opModal_workinfo").draggable({handle:"#hwi"});
	//新增
	objPOP.find("#add_workInfo").unbind("click");
	objPOP.find("#add_workInfo").click(function(){
		//公司性质
		initSelect(objPOP.find("#workinfo_form").find("select[name='enterprise_nature']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_NATURE_BUSINESS"});
		objPOP.find("#workinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#workinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find('#opModal_workinfo').modal('show');
		saveWorkMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#update_workInfo").unbind("click");
	objPOP.find("#update_workInfo").click(function(){
		var params = objPOP.find("#workInfo_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "work_content" || k1 == "leave_reason" || k1 == "memo"){
				objPOP.find("#workinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else if(k1 == "enterprise_nature"){
				initSelect(objPOP.find("#workinfo_form").find("select[name='enterprise_nature']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_NATURE_BUSINESS"},params[0][k]);
			}else{
				objPOP.find("#workinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#opModal_workinfo').modal('show');
		saveWorkMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#delete_workInfo").unbind("click");
	objPOP.find("#delete_workInfo").click(function(){
		var id = objPOP.find("#workInfo_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
		nconfirm("确定要删除这条数据吗？",function(){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/deleteWorkInfo.asp?op_id="+ids+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#workInfo_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+'&call='+call_wor+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);
		});
	});
	/**********资质证书**********/
	certlifInfo(op_code);
	getCurrentPageObj().find("#opModal_certlifinfo").draggable({handle:"#hci"});
	//新增
	objPOP.find("#add_qualificate_info").unbind("click");
	objPOP.find("#add_qualificate_info").click(function(){
		objPOP.find("#certlifinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#certlifinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find('#opModal_certlifinfo').modal('show');
		saveCertlifMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#update_qualificate_info").unbind("click");
	objPOP.find("#update_qualificate_info").click(function(){
		var params = objPOP.find("#qualificate_info_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "memo"){
				objPOP.find("#certlifinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else{
				objPOP.find("#certlifinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#opModal_certlifinfo').modal('show');
		saveCertlifMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#delete_qualificate_info").unbind("click");
	objPOP.find("#delete_qualificate_info").click(function(){
		var call_op = getMillisecond();
		var id = objPOP.find("#qualificate_info_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
		nconfirm("确定要删除这条数据吗？",function(){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/deleteQualificateInfo.asp?op_id="+ids+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#qualificate_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+'&call='+call_qua+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});
	/************专业技能***********/
	skillInfo(op_code);
	getCurrentPageObj().find("#opModal_skillinfo").draggable({handle:"hsk"});
	//新增
	objPOP.find("#add_skill_info").unbind("click");
	objPOP.find("#add_skill_info").click(function(){
		objPOP.find("#skillinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#skillinfo_form").find("textarea").text("");
		objPOP.find("#skillinfo_form select").val(" ").select2();
		objPOP.find('#opModal_skillinfo').modal('show');
		//技能类型
		initSelect(objPOP.find("#skillinfo_form").find("select[name='skill_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},
				{dic_code:"C_DIC_OUTPERSION_SKILL"});
		//熟练度
		initSelect(objPOP.find("#skillinfo_form").find("select[name='proficiency_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},
				{dic_code:"C_DIC_OUTPERSION_SKILL_PROFICIENCY"});
		saveSkillMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#update_skill_info").unbind("click");
	objPOP.find("#update_skill_info").click(function(){
		var params = objPOP.find("#skill_info_table").bootstrapTable("getSelections");
		objPOP.find("#skillinfo_form").find("textarea").text("");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "memo"){
				objPOP.find("#skillinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else if(k1 == "skill_type"){
				initSelect(objPOP.find("#skillinfo_form").find("select[name='skill_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_SKILL"},params[0][k]);
			}else if(k1 == "proficiency_degree"){
				initSelect(objPOP.find("#skillinfo_form").find("select[name='proficiency_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_SKILL_PROFICIENCY"},params[0][k]);
			}else if(k1 == "skill"){
				initSelect(objPOP.find("#skillinfo_form").find("select[name='skill']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:params[0]["SKILL_TYPE"]},params[0][k]);
			}else{
				objPOP.find("#skillinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#opModal_skillinfo').modal('show');
		saveSkillMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#delete_skill_info").unbind("click");
	objPOP.find("#delete_skill_info").click(function(){
		var id = objPOP.find("#skill_info_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
		nconfirm("确定要删除这条数据吗？",function(){
			var call_op = getMillisecond();
			var url = dev_outsource+'outperson/deleteSkillInfo.asp?op_id='+ids+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#skill_info_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/querySkillInfo.asp?op_code='+op_code+'&call='+call_ski+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});
	/***********项目经历**********/
	projectInfo(op_code);
	getCurrentPageObj().find("#opModal_projectinfo").draggable({handle:"#hpi"});
	//新增
	objPOP.find("#add_projrct_info").unbind("click");
	objPOP.find("#add_projrct_info").click(function(){
		objPOP.find("#projectinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#projectinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find('#opModal_projectinfo').modal('show');
		saveProjectMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#update_projrct_info").unbind("click");
	objPOP.find("#update_projrct_info").click(function(){
		var params = objPOP.find("#projrct_info_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "project_abstract"||k1=="project_responsibility"){
				objPOP.find("#projectinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else{
				objPOP.find("#projectinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#opModal_projectinfo').modal('show');
		saveProjectMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#delete_projrct_info").unbind("click");
	objPOP.find("#delete_projrct_info").click(function(){
		var id = objPOP.find("#projrct_info_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
		nconfirm("确定要删除这条数据吗？",function(){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/deleteProjectInfo.asp?op_id="+ids+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#projrct_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+'&call='+call_pro+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});
	/***********资质级别************/
	qualiLevel(op_code);
	getCurrentPageObj().find("#opModal_qualiLevelinfo").draggable({handle:"#hql"});
	//新增
	objPOP.find("#add_quali_level").unbind("click");
	objPOP.find("#add_quali_level").click(function(){
		objPOP.find("#qualiLevelinfo_form").find("input").each(function(){ $(this).val(" "); });
		objPOP.find("#qualiLevelinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find("#qualiLevelinfo_form select").val(" ").select2();
		//开发方向
		initSelect(getCurrentPageObj().find("select[name='qualificate_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
		//人员级别
		initSelect(getCurrentPageObj().find("select[name='op_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"});
		//是否当前资质
		initSelect(getCurrentPageObj().find("select[name='is_current']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"});
		objPOP.find('#opModal_qualiLevelinfo').modal('show');
		saveQualiLevelMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#update_quali_level").unbind("click");
	objPOP.find("#update_quali_level").click(function(){
		var params = objPOP.find("#quali_level_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		objPOP.find("#qualiLevelinfo_form").find("input").each(function(){ $(this).val(" "); });
		objPOP.find("#qualiLevelinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find("#qualiLevelinfo_form select").val(" ").select2();
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "memo"){
				objPOP.find("#qualiLevelinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else if(k1 == "qualificate_level"){
				//开发方向
				initSelect(objPOP.find("#qualiLevelinfo_form").find("select[name='qualificate_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},params[0][k]);
			}else if(k1 == "op_grade"){	
				//人员级别
				initSelect(objPOP.find("#qualiLevelinfo_form").find("select[name='op_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},params[0][k]);
			}else if(k1 == "is_current"){	
				//是否当前资质
				initSelect(objPOP.find("#qualiLevelinfo_form").find("select[name='is_current']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"},params[0][k]);
				changeEndTimeIsMustOrNot(params[0][k]);//点击修改回显时判断结束时间是否为必填项
			}else{
				objPOP.find("#qualiLevelinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#opModal_qualiLevelinfo').modal('show');
		saveQualiLevelMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#delete_quali_level").unbind("click");
	objPOP.find("#delete_quali_level").click(function(){
		var id = objPOP.find("#quali_level_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
		nconfirm("确定要删除这条数据吗？",function(){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/deleteQualiLevelInfo.asp?op_id="+ids+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#quali_level_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+'&call='+call_lev+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});
	/************资源池************/
//	resourcePool(op_code);
//	getCurrentPageObj().find("#opModal_resourcePoolinfo").draggable();//模态款可拖拽
/*	getCurrentPageObj().find("#opModal_resourcePoolinfo").draggable({handle:'#hrp'});//模态款可拖拽
	//新增
	objPOP.find("#add_resource_pool").unbind("click");
	objPOP.find("#add_resource_pool").click(function(){
		//人员采购类型
		initSelect(getCurrentPageObj().find("select[name='purch_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});
		initSelect(getCurrentPageObj().find("select[name='is_key']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"});
		initSelect(getCurrentPageObj().find("select[name='project_role']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_OUT_PROJECT_ROLE"});
		objPOP.find("#resourcePoolinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#resourcePoolinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find("#resourcePoolinfo_form select").val("").select2();
		objPOP.find('#opModal_resourcePoolinfo').modal('show');
		objPOP.find('#opModal_resourcePoolinfo').modal({
			backdrop:"static"
		});
		$("#trshow").hide();
		$("input[name='ass_code']").val("");
		$("input[name='contract_code']").val("");
		saveResourcePoolMsg(op_code,"add"," ");
	});*/
	//合同查询模态框
	modalInfo();
	function modalInfo(){
		$("input[name='contract_code']").click(function(){
			var supplier_id=getCurrentPageObj().find("#supplier_id").val();
			openContractInfoPop("contractInfoPop",{code:getCurrentPageObj().find("input[name='contract_code']")},supplier_id,"","");
		});
	}
	//任务查询模态框
/*	modalProjectQuery();
	function modalProjectQuery(){
		$("input[name='ass_code']").click(function(){
			var supplier_id=getCurrentPageObj().find("#supplier_id").val();
			openAssignmentPop("noprojetPop",{no:getCurrentPageObj().find("input[name='ass_code']")},supplier_id);
		});
	}*/
	//修改
/*	objPOP.find("#update_resource_pool").unbind("click");
	objPOP.find("#update_resource_pool").click(function(){
		var params = objPOP.find("#resource_pool_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "purch_type"){
				initSelect(objPOP.find("#resourcePoolinfo_form").find("select[name='purch_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"},params[0][k]);
				if(params[0][k]=="01"){
					$("#trshow").show();
					$(".td_ass").show();
					$(".td_con").hide();
					$(".td_hide").show();
					$("input[name='contract_code']").val("");
				}else if(params[0][k]=="02"){
					$("#trshow").show();
					$(".td_ass").hide();
					$(".td_con").show();
					$(".td_hide").show();
					$("input[name='ass_code']").val("");
				}else if(params[0][k]=="04"){
					$("#trshow").hide();
					$("input[name='ass_code']").val("");
					$("input[name='contract_code']").val("");
				}else if(params[0][k]=="05"){
					$("#trshow").hide();
					$("input[name='ass_code']").val("");
					$("input[name='contract_code']").val("");
				}
			}else if(k1=="is_key"){
				initSelect(getCurrentPageObj().find("select[name='is_key']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"},params[0][k]);
			}else if(k1=="project_role"){
				initSelect(getCurrentPageObj().find("select[name='project_role']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_OUT_PROJECT_ROLE"},params[0][k]);
			}else if(k1=="duty_explain"){
				objPOP.find("#resourcePoolinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else{
				objPOP.find("#resourcePoolinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#opModal_resourcePoolinfo').modal('show');
		saveResourcePoolMsg(op_code,"update",params[0].OP_ID);
	});*/
	//删除
/*	objPOP.find("#delete_resource_pool").unbind("click");
	objPOP.find("#delete_resource_pool").click(function(){
		var id = objPOP.find("#resource_pool_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
		nconfirm("确定要删除这条数据吗？",function(){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/deleteResPoolInfo.asp?op_id="+ids+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#resource_pool_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryResPoolInfo.asp?op_code="+op_code+'&call=jq_1520840212928&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});*/
	
}
/*********教育经历***********/
//保存教育经历新信息
function saveEduMsg(op_code,status,op_id){
	var eduForm = objPOP.find("#eduinfo_form");
	objPOP.find("#saveEduInfo").unbind("click");
	objPOP.find("#saveEduInfo").click(function(){
		if(!vlidate(eduForm)){
			return;
		}
		var params = eduForm.serialize();
		if(status == "add"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/addEduInfo.asp?op_code="+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_eduinfo').modal('hide');
					objPOP.find("#eduinfo_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+'&call='+call_edu+'&SID='+SID});
				}else{
					alert("添加失败!");
				}
			},call_op);
		}else if(status == "update"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/updateEduInfo.asp?op_id="+op_id+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_eduinfo').modal('hide');
					objPOP.find("#eduinfo_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+'&call='+call_edu+'&SID='+SID});
				}else{
					alert("修改失败!");
				}
			},call_op);
		}
	});
}
//教育经历列表查询
function eduInfo(op_code){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#eduinfo_table").bootstrapTable({////教育信息
		url : dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+'&call='+call_edu+'&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:call_edu,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
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
/*********工作履历***********/
//保存工作履历新信息
function saveWorkMsg(op_code,status,op_id){
	var workForm = objPOP.find("#workinfo_form");
	objPOP.find("#saveWorkInfo").unbind("click");
	objPOP.find("#saveWorkInfo").click(function(){
		if(!vlidate(workForm)){
			return;
		}
		var params = workForm.serialize();
		if(status == "add"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/addWorkInfo.asp?op_code="+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_workinfo').modal('hide');
					objPOP.find("#workInfo_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+'&call='+call_wor+'&SID='+SID});
				}else{
					alert("添加失败!");
				}
			},call_op);
		}else if(status == "update"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/updateWorkInfo.asp?op_id="+op_id+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_workinfo').modal('hide');
					objPOP.find("#workInfo_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryWorkInfo.asp?op_code='+op_code+'&call='+call_wor+'&SID='+SID});
				}else{
					alert("修改失败!");
				}
			},call_op);
		}	
	});
}
//工作履历列表查询
function workInfo(op_code){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	var call_op = getMillisecond();
	$("#workInfo_table").bootstrapTable({//工作履历信息
		//请求后台的URL（*）
		url :  dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+'&call='+call_wor+'&SID='+SID,
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
		jsonpCallback:call_wor,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
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
				var str = "<span style='color:blue;cursor:pointer' onclick='viewWorkDetail("+index+")' >查看</span>";
				return str;
			}
		} ]
	});
}
//查看工作履历详情
function viewWorkDetail(index){
	var data = objPOP.find("#workInfo_table").bootstrapTable("getData")[index];
	for(var key in data){
		objPOP.find("div[name='"+key+"']").text(data[key]);
	}
	objPOP.find("#opModal_workDetail").modal("show");
}
/*********资质证书***********/
//保存资质证书新信息
function saveCertlifMsg(op_code,status,op_id){
	var certlifForm = objPOP.find("#certlifinfo_form");
	objPOP.find("#saveCertlifInfo").unbind("click");
	objPOP.find("#saveCertlifInfo").click(function(){
		if(!vlidate(certlifForm)){
			return;
		}
		var params = certlifForm.serialize();
		if(status == "add"){
			var call_op = getMillisecond();
			var url =  dev_outsource+"outperson/addQualificateInfo.asp?op_code="+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_certlifinfo').modal('hide');
					objPOP.find("#qualificate_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+'&call='+call_qua+'&SID='+SID});
				}else{
					alert("添加失败!");
				}
			},call_op);
		}else if(status == "update"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/updateQualificateInfo.asp?op_id="+op_id+'&call='+call_op+'&SID='+SID;;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_certlifinfo').modal('hide');
					objPOP.find("#qualificate_info_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryQualificateInfo.asp?op_code='+op_code+'&call='+call_qua+'&SID='+SID});
				}else{
					alert("修改失败!");
				}
			},call_op);
		}		
	});
}
function certlifInfo(op_code){//初始化资质证书及技能相关信息
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var call_op = getMillisecond();
	$("#qualificate_info_table").bootstrapTable({//资质证书信息
		url : dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+'&call='+call_qua+'&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:call_qua,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
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
/**********专业技能**********/
//保存专业技能新信息
function saveSkillMsg(op_code,status,op_id){
	var skillForm = objPOP.find("#skillinfo_form");
	objPOP.find("#saveSkillInfo").unbind("click");
	objPOP.find("#saveSkillInfo").click(function(){
		if(!vlidate(skillForm)){
			return;
		}
		var params = skillForm.serialize();
		if(status == "add"){
			var call_op = getMillisecond();	
			var url = dev_outsource+"outperson/addSkillInfo.asp?op_code="+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_skillinfo').modal('hide');
					objPOP.find("#skill_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/querySkillInfo.asp?op_code="+op_code+'&call='+call_ski+'&SID='+SID});
				}else{
					alert("添加失败!");
				}
			},call_op);
		}else if(status == "update"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/updateSkillInfo.asp?op_id="+op_id+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_skillinfo').modal('hide');
					objPOP.find("#skill_info_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/querySkillInfo.asp?op_code='+op_code+'&call='+call_ski+'&SID='+SID});
				}else{
					alert("修改失败!");
				}
			},call_op);
		}			
	});
}
function skillInfo(op_code){//初始化专业技能相关信息
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var call_op = getMillisecond();
	$("#skill_info_table").bootstrapTable({//专业技能信息
		//请求后台的URL（*）
		url : dev_outsource+"outperson/querySkillInfo.asp?op_code="+op_code+'&call='+call_ski+'&SID='+SID,
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
		jsonpCallback:call_ski,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'SKILL_TYPE_NAME',
			title : '技能类型',
			align : "center"
		},{
			field : 'SKILLNAME',
			title : '技能',
			align : "center"
		},{
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
/*********项目经历***********/
//保存项目经历新信息
function saveProjectMsg(op_code,status,op_id){
	var projectForm = objPOP.find("#projectinfo_form");
	objPOP.find("#saveProjectInfo").unbind("click");
	objPOP.find("#saveProjectInfo").click(function(){
		if(!vlidate(projectForm)){
			return;
		}
		var params = projectForm.serialize();
		if(status == "add"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/addProjectInfo.asp?op_code="+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_projectinfo').modal('hide');
					objPOP.find("#projrct_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+'&call='+call_pro+'&SID='+SID});
				}else{
					alert("添加失败!");
				}
			},call_op);
		}else if(status == "update"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/updateProjectInfo.asp?op_id="+op_id+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_projectinfo').modal('hide');
					objPOP.find("#projrct_info_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryProjectInfo.asp?op_code='+op_code+'&call='+call_pro+'&SID='+SID});
				}else{
					alert("修改失败!");
				}
			},call_op);
		}			
	});
}
function projectInfo(op_code){//初始化项目经历信息
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var call_op = getMillisecond();
	$("#projrct_info_table").bootstrapTable({//教育信息
		url : dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+'&call='+call_pro+'&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:call_pro,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
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
/*********资质级别***********/
//保存资质级别新信息
function saveQualiLevelMsg(op_code,status,op_id){
	var qualiLevelForm = objPOP.find("#qualiLevelinfo_form");
	objPOP.find("#saveQualiLevelInfo").unbind("click");
	objPOP.find("#saveQualiLevelInfo").click(function(){
		if(!vlidate(qualiLevelForm)){
			return;
		}
		var params = qualiLevelForm.serialize();
		if(status == "add"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/addQualiLevelInfo.asp?op_code="+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("保存成功!");
					objPOP.find('#opModal_qualiLevelinfo').modal('hide');
					objPOP.find("#quali_level_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+'&call='+call_lev+'&SID='+SID});
				}else{
					alert(data.msg);
				}
			},call_op);
		}else if(status == "update"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/updateQualiLevelInfo.asp?op_id="+op_id+'&op_code='+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("保存成功!");
					objPOP.find('#opModal_qualiLevelinfo').modal('hide');
					objPOP.find("#quali_level_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryQualiLevelInfo.asp?op_code='+op_code+'&call='+call_lev+'&SID='+SID});
				}else{
					alert(data.msg);
				}
			},call_op);
		}				
	});
}
function qualiLevel(op_code){//初始化资质级别信息
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var call_op = getMillisecond();
	$("#quali_level_table").bootstrapTable({
		url : dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+'&call='+call_lev+'&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:call_lev,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'QUALIFICATE_LEVEL_NAME',
			title : '开发方向',
			align : "center"
		},{
			field : 'OP_GRADE_NAME',
			title : '人员级别',
			align : "center"
		},{
			field : 'IS_CURRENT',
			title : '是否当前资质',
			align : "center",
			formatter:function(value, row, index){
				if(value=='01'){
					return "是";
				}
				if(value=='02'){
					return "否";
				}
			}
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
/*********资源池信息***********/
//保存资源池新信息
/*function saveResourcePoolMsg(op_code,status,op_id){
	var resourcePoolForm = objPOP.find("#resourcePoolinfo_form");
	objPOP.find("#saveResourcePoolInfo").unbind("click");
	objPOP.find("#saveResourcePoolInfo").click(function(){
		if(!vlidate(resourcePoolForm)){
			return;
		}
		var params = resourcePoolForm.serialize();
		if(status == "add"){
			var call_op = getMillisecond();
			var url =  dev_outsource+'outperson/addResPoolInfo.asp?op_code='+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_resourcePoolinfo').modal('hide');
					objPOP.find("#resource_pool_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryResPoolInfo.asp?op_code="+op_code+'&call=jq_1520840212928&SID='+SID});
				}else{
					alert(data.msg);
				}
			},call_op);
		}else if(status == "update"){
			var call_op = getMillisecond();
			var url = dev_outsource+"outperson/updateResPoolInfo.asp?op_id="+op_id+"&op_code="+op_code+'&call='+call_op+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_resourcePoolinfo').modal('hide');
					objPOP.find("#resource_pool_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryResPoolInfo.asp?op_code='+op_code+'&call=jq_1520840212928&SID='+SID});
				}else{
					alert(data.msg);
				}
			},call_op);
		}				
	});
}*/
/*function resourcePool(op_code){//初始化资源池信息
	var call_op = getMillisecond();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#resource_pool_table").bootstrapTable({//资源池信息
		url : dev_outsource+'outperson/queryResPoolInfo.asp?op_code='+op_code+'&call='+call_op+'&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:call_op,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
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
			field : "PROJECT_ROLE_NAME",
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
}*/