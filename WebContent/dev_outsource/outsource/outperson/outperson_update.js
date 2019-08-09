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
	/*//毕业院校类型
	initSelect(getCurrentPageObj().find("select[name='UP.college_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_COLLEGE_TYPE"});	
	//岗位名称
	initSelect(getCurrentPageObj().find("select[name='UP.job_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_POSITION_TYPE"});	
	//人员状态
	initSelect(getCurrentPageObj().find("select[name='UP.op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"});	
	//专业分类
	initSelect(getCurrentPageObj().find("select[name='UP.op_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"});
	//性别
	initSelect(getCurrentPageObj().find("select[name='UP.op_sex']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_SEX"});
    //学历
	initSelect(getCurrentPageObj().find("select[name='UP.op_education']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"});
	//学位
	initSelect(getCurrentPageObj().find("select[name='UP.op_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEGREE"});
	//采购人员类型
	initSelect(getCurrentPageObj().find("select[name='UP.purch_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});
	//开发方向
	initSelect(getCurrentPageObj().find("select[name='UP.dev_direction']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
	//人员级别
	initSelect(getCurrentPageObj().find("select[name='UP.dev_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"});*/
	initVlidate(objPOP);
	var obj=getCurrentPageObj().find("#ustaff_name_pop");
	obj.unbind("click");
	obj.click(function(){
		openStaffPop("uaddOutPersonUserPop",{singleSelect:true,name:getCurrentPageObj().find("#ustaff_name_pop"),staff_id:getCurrentPageObj().find("input[name='ADD.staff_id']"),isOpt:true});
	});
	//行内归属部门
	obj=getCurrentPageObj().find("#UP_op_office_pop");
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"uop_office_pop_add_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#UP_op_office_pop").val(node.name);
			getCurrentPageObj().find("input[name='UP.op_office']").val(node.id);
		});
	});
	//供应商全称
	obj=getCurrentPageObj().find("#UP_supplier_name");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("uoutpersonAddSupplierPop",{singleSelect:true,parent_company:getCurrentPageObj().find("#UP_supplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='UP.supplier_id']")});
	});
	//所属应用pop框
	getCurrentPageObj().find("#UP_op_belongsystem").click(function(){
		openSystemPop("uoutpersonBelongSystemPop",{func_call:function(row){
			getCurrentPageObj().find("#ubelongSystem").val(row.SYSTEM_ID);
			getCurrentPageObj().find("#UP_op_belongsystem").val(row.SYSTEM_NAME);
			/*getCurrentPageObj().find("#uop_office").val(row.BUSINESS_DEPT_ID);
			getCurrentPageObj().find("#UP_op_office_pop").val(row.BUSINESS_DEPT_NAME);*/
			getCurrentPageObj().find("#uop_office").val(row.RES_GROUP_ID);
			getCurrentPageObj().find("#UP_op_office_pop").val(row.RES_GROUP_NAME);
			getCurrentPageObj().find("#UP_op_staff").val(row.PROJECT_MAN_ID);
			getCurrentPageObj().find("#UP_op_staff_name").val(row.PROJECT_MAN_NAME);
		}});
		//initModal();//POP框垂直居中
	});
	//行方项目经理pop框
	$("#UP_op_staff_name").click(function(){
		openUserPop("uuserOrgDivPop",{"name":$("#UP_op_staff_name"),"no":$("#UP_op_staff"),role:'0007'});
		initModal();//POP框垂直居中
	});
}
//根据是否当前资质控制资质结束时间是否必填
function changeEndTimeIsMustOrNot(v){
	//是当前资质 不必填
	if(v=="01"){
		objPOP.find("#uqu_end_time").removeAttr("validate");
		objPOP.find("#uqu_end_time").removeAttr("valititle");
		getCurrentPageObj().find("#uqu_end_time").parent().find("strong[class^='high']").remove();
		initVlidate(objPOP);
	}else{
		getCurrentPageObj().find("#uqu_end_time").attr("validate","v.required");
		getCurrentPageObj().find("#uqu_end_time").attr("valititle","请填写档次结束时间");
		initVlidate(objPOP);
	}
}
//修改外包人员(获取到选中行的id)
function updateOutPerson(item){
	update="update";
	for(var k in item){
		var k1 = k.toLowerCase();
		if(k1=="memo"){
			getCurrentPageObj().find("textarea[name='UP.memo']").text(formatString(item[k]));
		}else if(k1 == "op_skills"){
			//技术
			initSelect(getCurrentPageObj().find("select[name='UP.op_skills']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:item["OP_SPECIALTYPE"]},item[k]);
		}else if(k1 == "college_type"){
			//毕业院校类型
			initSelect(getCurrentPageObj().find("select[name='UP.college_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_COLLEGE_TYPE"},item[k]);	
		}else if(k1 == "job_type"){	
			//岗位名称
			initSelect(getCurrentPageObj().find("select[name='UP.job_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_POSITION_TYPE"},item[k]);	
		}else if(k1 == "op_state"){		
			//人员状态
			initSelect(getCurrentPageObj().find("select[name='UP.op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"},item[k]);	
		}else if(k1 == "op_specialtype"){	
			//专业分类
			initSelect(getCurrentPageObj().find("select[name='UP.op_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"},item[k]);
		}else if(k1 == "op_education"){	
		    //学历
			initSelect(getCurrentPageObj().find("select[name='UP.op_education']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"},item[k]);
		}else if(k1 == "op_degree"){	
			//学位
			initSelect(getCurrentPageObj().find("select[name='UP.op_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEGREE"},item[k]);
		}else if(k1 == "op_sex"){	
			//性别
			initSelect(getCurrentPageObj().find("select[name='UP.op_sex']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_SEX"},item[k]);
		}else if(k1 == "purch_type"){	
			//人员采购类型
			initSelect(getCurrentPageObj().find("select[name='UP.purch_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"},item[k]);
		}else if(k1 == "sup_num"){
			getCurrentPageObj().find("input[name='UP.supplier_id']").val(item[k]);
		}else if(k1 == "dev_direction"){
			if(item['OP_STATE']=='03'){
				initSelect(getCurrentPageObj().find("select[name='UP.dev_direction']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},item[k]);
			}else{
				initSelect(getCurrentPageObj().find("select[name='UP.dev_direction']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},item[k]);
				getCurrentPageObj().find("select[name='UP.dev_direction']").attr("disabled",true);
			}
		}else if(k1 == "dev_grade"){
			if(item['OP_STATE']=='03'){
				initSelect(getCurrentPageObj().find("select[name='UP.dev_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},item[k]);
			}else{
				initSelect(getCurrentPageObj().find("select[name='UP.dev_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},item[k]);
				getCurrentPageObj().find("select[name='UP.dev_grade']").attr("disabled",true);
			}
		}else {
			getCurrentPageObj().find("input[name='UP."+k1+"']").val(formatString(item[k]));
		}
	}
//	getCurrentPageObj().find("input[name='UP.op_name']").attr("readonly",true);
//	getCurrentPageObj().find("input[name='UP.idcard_no']").attr("readonly",true);
//	initMoreMsgPOP();
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
	initSelect(getCurrentPageObj().find("select[name='UP.op_skills']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}
/**
 * “技能类型”关联“技能”的选择变化
 */
function selectSkillType(e){
	initSelect(objPOP.find("#uskillinfo_form").find("select[name='skill']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
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
	initSelect(objPOP.find("#uqualiLevelinfo_form").find("select[name='op_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}
function changeCode(op_code){
	//检查身份证号码是否重复
	var call_op = getMillisecond();
	if(update!="update"){
		baseAjaxJsonp(dev_outsource+"outperson/judgeCode.asp?op_code="+op_code+'&call='+call_op+'&SID='+SID,null,function(data){
			if(data["rows"].length>0){
				alert("身份证号信息已存在，请确认后重新输入！");
				getCurrentPageObj().find("input[name='UP.idcard_no']").val("");
				return;
			}
		}, call_op);
	}
}
function initSaveButton(isNew){//初始化保存按钮
	var obj=getCurrentPageObj().find("#usaveOutPerson");
	obj.unbind("click");
	obj.click(function(){
		var idcard_no=getCurrentPageObj().find("input[name='UP.idcard_no']").val();
		changeCode(idcard_no);//检查身份证号是否重复
		if(vlidate(getCurrentPageObj().find("#myFrom"),"",false)){
			var card=getCurrentPageObj().find("input[name='UP.idcard_no']").val();
			var flag=isCard(card);//检查身份证号是否符合要求
			if(flag==false){
				return;
			}
			var param = {};
			var vals=getCurrentPageObj().find("[name^='UP.']");
			for(var i=0;i<vals.length;i++){
				var val=$(vals[i]);
				if($.trim(val.val())!=""){
					param[val.attr("name").substr(3)]=val.val();
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
						getCurrentPageObj().find("#ubascInfo").removeClass("active");
						getCurrentPageObj().find("#ubasic_info").removeClass("active");
						getCurrentPageObj().find("#ueduAndWork").addClass("active");
						getCurrentPageObj().find("#ueduAndWork").addClass("active");
						getCurrentPageObj().find("#uedu_work").addClass("active"); 
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
						initMoreMsgPOP();//初始化其他信息页签按钮
					}
				}, call_op);
			}
		}
	});
};
//初始化页签增删改按钮
function initMoreMsgPOP(){
	getCurrentPageObj().find("#uopModal_eduinfo").draggable({handle:"#uhed"});
	var op_code = objPOP.find("input[name='UP.idcard_no']").val();
	objPOP.find("input[name='UP.op_code']").val(op_code);
	/*******教育经历*******/
	eduInfo(op_code);
	//新增
	objPOP.find("#uadd_eduinfo").unbind("click");
	objPOP.find("#uadd_eduinfo").click(function(){
		//学历
		initSelect(objPOP.find("#ueduinfo_form").find("select[name='edu_background']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"});
		objPOP.find("#ueduinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#ueduinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find('#uopModal_eduinfo').modal('show');
		saveEduMsg(op_code,"add"," ");
		
	});
	//修改
	objPOP.find("#uupdate_eduinfo").unbind("click");
	objPOP.find("#uupdate_eduinfo").click(function(){
		var params = objPOP.find("#ueduinfo_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "special_desc"){
				objPOP.find("#ueduinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else if(k1 == "edu_background"){
				initSelect(objPOP.find("#ueduinfo_form").find("select[name='edu_background']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"},params[0][k]);
			}else{
				objPOP.find("#ueduinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#uopModal_eduinfo').modal('show');
		saveEduMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#udelete_eduinfo").unbind("click");
	objPOP.find("#udelete_eduinfo").click(function(){
		var id = objPOP.find("#ueduinfo_table").bootstrapTable("getSelections");
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
					objPOP.find("#ueduinfo_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryEduInfo.asp?op_code='+call_edu+'&call='+call_edu+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
	});
	/********工作履历********/
	workInfo(op_code);
	getCurrentPageObj().find("#uopModal_workinfo").draggable({handle:"#uhwi"});
	//新增
	objPOP.find("#uadd_workInfo").unbind("click");
	objPOP.find("#uadd_workInfo").click(function(){
		//公司性质
		initSelect(objPOP.find("#uworkinfo_form").find("select[name='enterprise_nature']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_NATURE_BUSINESS"});
		objPOP.find("#uworkinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#uworkinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find('#uopModal_workinfo').modal('show');
		saveWorkMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#uupdate_workInfo").unbind("click");
	objPOP.find("#uupdate_workInfo").click(function(){
		var params = objPOP.find("#uworkInfo_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "work_content" || k1 == "leave_reason" || k1 == "memo"){
				objPOP.find("#uworkinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else if(k1 == "enterprise_nature"){
				initSelect(objPOP.find("#uworkinfo_form").find("select[name='enterprise_nature']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_NATURE_BUSINESS"},params[0][k]);
			}else{
				objPOP.find("#uworkinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#uopModal_workinfo').modal('show');
		saveWorkMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#udelete_workInfo").unbind("click");
	objPOP.find("#udelete_workInfo").click(function(){
		var id = objPOP.find("#uworkInfo_table").bootstrapTable("getSelections");
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
					objPOP.find("#uworkInfo_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+'&call='+call_wor+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);
		});
	});

	/***********资质级别************/
	qualiLevel(op_code);
	getCurrentPageObj().find("#uopModal_qualiLevelinfo").draggable({handle:"#uhql"});
	//新增
	objPOP.find("#uadd_quali_level").unbind("click");
	objPOP.find("#uadd_quali_level").click(function(){
		objPOP.find("#uqualiLevelinfo_form").find("input").each(function(){ $(this).val(" "); });
		objPOP.find("#uqualiLevelinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find("#uqualiLevelinfo_form select").val(" ").select2();
		//开发方向
		initSelect(getCurrentPageObj().find("select[name='qualificate_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
		//人员级别
		initSelect(getCurrentPageObj().find("select[name='op_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"});
		//是否当前资质
		initSelect(getCurrentPageObj().find("select[name='is_current']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"});
		objPOP.find('#uopModal_qualiLevelinfo').modal('show');
		saveQualiLevelMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#uupdate_quali_level").unbind("click");
	objPOP.find("#uupdate_quali_level").click(function(){
		var params = objPOP.find("#uquali_level_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		objPOP.find("#uqualiLevelinfo_form").find("input").each(function(){ $(this).val(" "); });
		objPOP.find("#uqualiLevelinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find("#uqualiLevelinfo_form select").val(" ").select2();
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "memo"){
				objPOP.find("#uqualiLevelinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else if(k1 == "qualificate_level"){
				//开发方向
				initSelect(objPOP.find("#uqualiLevelinfo_form").find("select[name='qualificate_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},params[0][k]);
			}else if(k1 == "op_grade"){	
				//人员级别
				initSelect(objPOP.find("#uqualiLevelinfo_form").find("select[name='op_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},params[0][k]);
			}else if(k1 == "is_current"){	
				//是否当前资质
				initSelect(objPOP.find("#uqualiLevelinfo_form").find("select[name='is_current']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"},params[0][k]);
				changeEndTimeIsMustOrNot(params[0][k]);//点击修改回显时判断结束时间是否为必填项
			}else{
				objPOP.find("#uqualiLevelinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#uopModal_qualiLevelinfo').modal('show');
		saveQualiLevelMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#udelete_quali_level").unbind("click");
	objPOP.find("#udelete_quali_level").click(function(){
		var id = objPOP.find("#uquali_level_table").bootstrapTable("getSelections");
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
					objPOP.find("#uquali_level_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+'&call='+call_lev+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});
	//合同查询模态框
	modalInfo();
	function modalInfo(){
		$("input[name='contract_code']").click(function(){
			var supplier_id=getCurrentPageObj().find("#usupplier_id").val();
			openContractInfoPop("contractInfoPop",{code:getCurrentPageObj().find("input[name='contract_code']")},supplier_id,"","");
		});
	}
}
/*********教育经历***********/
//保存教育经历新信息
function saveEduMsg(op_code,status,op_id){
	var eduForm = objPOP.find("#ueduinfo_form");
	objPOP.find("#usaveEduInfo").unbind("click");
	objPOP.find("#usaveEduInfo").click(function(){
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
					objPOP.find('#uopModal_eduinfo').modal('hide');
					objPOP.find("#ueduinfo_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+'&call='+call_edu+'&SID='+SID});
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
					objPOP.find('#uopModal_eduinfo').modal('hide');
					objPOP.find("#ueduinfo_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+'&call='+call_edu+'&SID='+SID});
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
	$("#ueduinfo_table").bootstrapTable({////教育信息
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
	var workForm = objPOP.find("#uworkinfo_form");
	objPOP.find("#usaveWorkInfo").unbind("click");
	objPOP.find("#usaveWorkInfo").click(function(){
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
					objPOP.find('#uopModal_workinfo').modal('hide');
					objPOP.find("#uworkInfo_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+'&call='+call_wor+'&SID='+SID});
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
					objPOP.find('#uopModal_workinfo').modal('hide');
					objPOP.find("#uworkInfo_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryWorkInfo.asp?op_code='+op_code+'&call='+call_wor+'&SID='+SID});
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
	$("#uworkInfo_table").bootstrapTable({//工作履历信息
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
	var data = objPOP.find("#uworkInfo_table").bootstrapTable("getData")[index];
	for(var key in data){
		objPOP.find("div[name='"+key+"']").text(data[key]);
	}
	objPOP.find("#uopModal_workDetail").modal("show");
}
/*********资质证书***********/
//保存资质证书新信息
function saveCertlifMsg(op_code,status,op_id){
	var certlifForm = objPOP.find("#ucertlifinfo_form");
	objPOP.find("#usaveCertlifInfo").unbind("click");
	objPOP.find("#usaveCertlifInfo").click(function(){
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
					objPOP.find('#uopModal_certlifinfo').modal('hide');
					objPOP.find("#uqualificate_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+'&call='+call_qua+'&SID='+SID});
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
					objPOP.find('#uopModal_certlifinfo').modal('hide');
					objPOP.find("#uqualificate_info_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryQualificateInfo.asp?op_code='+op_code+'&call='+call_qua+'&SID='+SID});
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
	var call_qua = getMillisecond();
	$("#uqualificate_info_table").bootstrapTable({//资质证书信息
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
	var skillForm = objPOP.find("#uskillinfo_form");
	objPOP.find("#usaveSkillInfo").unbind("click");
	objPOP.find("#usaveSkillInfo").click(function(){
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
					objPOP.find('#uopModal_skillinfo').modal('hide');
					objPOP.find("#uskill_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/querySkillInfo.asp?op_code="+op_code+'&call='+call_ski+'&SID='+SID});
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
					objPOP.find('#uopModal_skillinfo').modal('hide');
					objPOP.find("#uskill_info_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/querySkillInfo.asp?op_code='+op_code+'&call='+call_ski+'&SID='+SID});
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
	$("#uskill_info_table").bootstrapTable({//专业技能信息
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
	var projectForm = objPOP.find("#uprojectinfo_form");
	objPOP.find("#usaveProjectInfo").unbind("click");
	objPOP.find("#usaveProjectInfo").click(function(){
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
					objPOP.find('#uopModal_projectinfo').modal('hide');
					objPOP.find("#uprojrct_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+'&call='+call_pro+'&SID='+SID});
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
					objPOP.find('#uopModal_projectinfo').modal('hide');
					objPOP.find("#uprojrct_info_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryProjectInfo.asp?op_code='+op_code+'&call='+call_pro+'&SID='+SID});
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
	$("#uprojrct_info_table").bootstrapTable({//教育信息
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
	var qualiLevelForm = objPOP.find("#uqualiLevelinfo_form");
	objPOP.find("#usaveQualiLevelInfo").unbind("click");
	objPOP.find("#usaveQualiLevelInfo").click(function(){
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
					objPOP.find('#uopModal_qualiLevelinfo').modal('hide');
					objPOP.find("#uquali_level_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+'&call='+call_lev+'&SID='+SID});
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
					objPOP.find('#uopModal_qualiLevelinfo').modal('hide');
					objPOP.find("#uquali_level_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryQualiLevelInfo.asp?op_code='+op_code+'&call='+call_lev+'&SID='+SID});
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
	$("#uquali_level_table").bootstrapTable({
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
function certlifDetail(){
	var op_code = objPOP.find("input[name='UP.idcard_no']").val();
	/**********资质证书**********/
	certlifInfo(op_code);
	getCurrentPageObj().find("#uopModal_certlifinfo").draggable({handle:"#uhci"});
	//新增
	objPOP.find("#uadd_qualificate_info").unbind("click");
	objPOP.find("#uadd_qualificate_info").click(function(){
		objPOP.find("#ucertlifinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#ucertlifinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find('#uopModal_certlifinfo').modal('show');
		saveCertlifMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#uupdate_qualificate_info").unbind("click");
	objPOP.find("#uupdate_qualificate_info").click(function(){
		var params = objPOP.find("#uqualificate_info_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "memo"){
				objPOP.find("#ucertlifinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else{
				objPOP.find("#ucertlifinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#uopModal_certlifinfo').modal('show');
		saveCertlifMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#udelete_qualificate_info").unbind("click");
	objPOP.find("#udelete_qualificate_info").click(function(){
		var call_op = getMillisecond();
		var id = objPOP.find("#uqualificate_info_table").bootstrapTable("getSelections");
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
					objPOP.find("#uqualificate_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+'&call='+call_qua+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});
	/************专业技能***********/
	skillInfo(op_code);
	getCurrentPageObj().find("#uopModal_skillinfo").draggable({handle:"hsk"});
	//新增
	objPOP.find("#uadd_skill_info").unbind("click");
	objPOP.find("#uadd_skill_info").click(function(){
		objPOP.find("#uskillinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#uskillinfo_form").find("textarea").text("");
		objPOP.find("#uskillinfo_form select").val(" ").select2();
		objPOP.find('#uopModal_skillinfo').modal('show');
		//技能类型
		initSelect(objPOP.find("#uskillinfo_form").find("select[name='skill_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},
				{dic_code:"C_DIC_OUTPERSION_SKILL"});
		//熟练度
		initSelect(objPOP.find("#uskillinfo_form").find("select[name='proficiency_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},
				{dic_code:"C_DIC_OUTPERSION_SKILL_PROFICIENCY"});
		saveSkillMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#uupdate_skill_info").unbind("click");
	objPOP.find("#uupdate_skill_info").click(function(){
		var params = objPOP.find("#uskill_info_table").bootstrapTable("getSelections");
		objPOP.find("#uskillinfo_form").find("textarea").text("");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "memo"){
				objPOP.find("#uskillinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else if(k1 == "skill_type"){
				initSelect(objPOP.find("#uskillinfo_form").find("select[name='skill_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_SKILL"},params[0][k]);
			}else if(k1 == "proficiency_degree"){
				initSelect(objPOP.find("#uskillinfo_form").find("select[name='proficiency_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_SKILL_PROFICIENCY"},params[0][k]);
			}else if(k1 == "skill"){
				initSelect(objPOP.find("#uskillinfo_form").find("select[name='skill']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:params[0]["SKILL_TYPE"]},params[0][k]);
			}else{
				objPOP.find("#uskillinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#uopModal_skillinfo').modal('show');
		saveSkillMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#udelete_skill_info").unbind("click");
	objPOP.find("#udelete_skill_info").click(function(){
		var id = objPOP.find("#uskill_info_table").bootstrapTable("getSelections");
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
					objPOP.find("#uskill_info_table").bootstrapTable('refresh',{url:dev_outsource+'outperson/querySkillInfo.asp?op_code='+op_code+'&call='+call_ski+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});
}
function projrctDetail(){
	var op_code = objPOP.find("input[name='UP.idcard_no']").val();
	/***********项目经历**********/
	projectInfo(op_code);
	getCurrentPageObj().find("#uopModal_projectinfo").draggable({handle:"#uhpi"});
	//新增
	objPOP.find("#uadd_projrct_info").unbind("click");
	objPOP.find("#uadd_projrct_info").click(function(){
		objPOP.find("#uprojectinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#uprojectinfo_form").find("textarea").each(function(){ $(this).text(""); });
		objPOP.find('#uopModal_projectinfo').modal('show');
		saveProjectMsg(op_code,"add"," ");
	});
	//修改
	objPOP.find("#uupdate_projrct_info").unbind("click");
	objPOP.find("#uupdate_projrct_info").click(function(){
		var params = objPOP.find("#uprojrct_info_table").bootstrapTable("getSelections");
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "project_abstract"||k1=="project_responsibility"){
				objPOP.find("#uprojectinfo_form").find("textarea[name='"+ k1 +"']").text(params[0][k]);
			}else{
				objPOP.find("#uprojectinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#uopModal_projectinfo').modal('show');
		saveProjectMsg(op_code,"update",params[0].OP_ID);
	});
	//删除
	objPOP.find("#udelete_projrct_info").unbind("click");
	objPOP.find("#udelete_projrct_info").click(function(){
		var id = objPOP.find("#uprojrct_info_table").bootstrapTable("getSelections");
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
					objPOP.find("#uprojrct_info_table").bootstrapTable('refresh',{url:dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+'&call='+call_pro+'&SID='+SID});
				}else{
					alert("删除失败!");
				}
			},call_op);	
		});
	});
}