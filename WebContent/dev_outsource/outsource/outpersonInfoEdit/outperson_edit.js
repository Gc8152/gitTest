var objPOP = getCurrentPageObj(); //获取页面对象
var calls = getMillisecond();
initSelectElse();
//加载字典项等信息
function initSelectElse(){
	var currPage = getCurrentPageObj();
	//毕业院校类型
	initSelect(currPage.find("select[name='UPD.college_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_COLLEGE_TYPE"});	
	//岗位名称
	initSelect(currPage.find("select[name='UPD.job_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_POSITION_TYPE"});	
	//人员状态
	initSelect(currPage.find("select[name='UPD.op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"});	
	//专业分类
	initSelect(currPage.find("select[name='UPD.op_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"});
	//性别
	initSelect(currPage.find("select[name='UPD.op_sex']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_SEX"});
    //学历
	initSelect(currPage.find("select[name='UPD.op_education']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"});
	//学位
	initSelect(currPage.find("select[name='UPD.op_degree']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEGREE"});
	//技术特长
	initSelect(currPage.find("select[name='UPD.op_skills']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION_LANGUAGE"});
	//人员类型
	initSelect(currPage.find("select[name='UPD.op_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PERSON_TYPE"});
	//人员级别
	initSelect(currPage.find("select[name='UPD.op_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PERSON_LEVEL"});
	
	initVlidate(currPage);
	
	//行方项目经理李 pop框
	currPage.find("[name='UPD.op_staff_name']").click(function(){
		var $OPSTAFFPOP = currPage.find("[mod='opStaffPop']");
		var $OP_STAFF_NAME = currPage.find("[name='UPD.op_staff_name']");
		var $OP_STAFF = currPage.find("[name='UPD.op_staff']");
		opStaffPop($OPSTAFFPOP, {
			OP_STAFF_NAME : $OP_STAFF_NAME,
			OP_STAFF  : $OP_STAFF });
	});
	
	
	var obj=currPage.find("#staff_name_pop");
	obj.unbind("click");
	obj.click(function(){
		openStaffPop("addOutPersonUserPop",{singleSelect:true,name:currPage.find("#staff_name_pop"),staff_id:currPage.find("input[name='ADD.staff_id']"),isOpt:true});
	});
	//行内归属部门
	obj=currPage.find("#UPD_op_office_pop");
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"op_office_pop_add_tree","SOrg/queryorgtreeofficeslist.asp?suporg_code=1101",30,function(node){
			currPage.find("#UPD_op_office_pop").val(node.name);
			currPage.find("input[name='UPD.op_office']").val(node.id);
		});
	});
	//供应商全称
	obj=currPage.find("#UPD_supplier_name");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("outpersonAddSupplierPop",{singleSelect:true,parent_company:currPage.find("#UPD_supplier_name"),parent_sup_num:currPage.find("input[name='UPD.supplier_id']")});
	});
}
//新增外包人员
//function addOutPerson(){//字典初始化方法
//	initSaveButton("yes");
//	getCurrentPageObj().find("li[name='otherMsg']").hide();
//};
//修改外包人员(获取到选中行的id)
function updateOutPerson(item){
	for(var k in item){
		var k1 = k.toLowerCase();
		if(k1=="memo"){
			getCurrentPageObj().find("textarea[name='UPD.memo']").val(item[k]);
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
		}else if(k1 == "sup_num"){
			getCurrentPageObj().find("input[name='UPD.supplier_id']").val(item[k]);
		}else if(k1 == "op_type"){	
			//人员类型
			initSelect(getCurrentPageObj().find("select[name='UPD.op_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PERSON_TYPE"},item[k]);
		}else if(k1 == "op_level"){
			//人员级别
			initSelect(getCurrentPageObj().find("select[name='UPD.op_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PERSON_LEVEL"},item[k]);
		}else {
			getCurrentPageObj().find("input[name='UPD."+k1+"']").val(item[k]);
		}
		
		
	}
	if(item.OP_TYPE=='01'){//人员外包
		getCurrentPageObj().find("#is_op").show();
	}
	getCurrentPageObj().find("input[name='UPD.op_name']").attr("readonly",true);
	//getCurrentPageObj().find("input[name='UPD.idcard_no']").attr("readonly",true);
	initMoreMsgPOP(item["OP_CODE"]);
	initSaveButton("no");
}

function isCard(val){
	val=val.toUpperCase();
	if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(val))){
		alert("身份证长度不正确或不符合规定！");
		return false;
	}
	/*var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
			41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
	if(aCity[parseInt(val.substr(0,2))]==null){
		alert("身份证号不正确或不符合规定！");
		return false;
	}
	var len, re; len=val.length;
	if(len==15){
		re =new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
		var arrSplit=val.match(re);
		var dtmBirth=new Date('19'+arrSplit[2]+'/'+arrSplit[3]+'/'+arrSplit[4]);
		var dGoodDay; 
		dGoodDay=(dtmBirth.getFullYear()==Number(arrSplit[2]))&&((dtmBirth.getMonth()+1)==Number(arrSplit[3]))&&(dtmBirth.getDate()==Number(arrSplit[4])); 
		if(!dGoodDay){
			alert("身份证号的出生日期不对！");
			return false;
		}else{//
			var arrInt=new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
			var arrCh= new Array('1','0','X','9','8','7','6','5','4','3','2');
			var nTemp=0,i;
			val=val.substr(0,6)+'19'+val.substr(6,val.length-6);
			for(i=0;i<17;i++){
				nTemp +=val.substr(i,1)*arrInt[i];
			}
			val +=arrCh[nTemp%11];
			return true;
		}
	}
	if(len==18){
		re =new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
		var arrSplit=val.match(re);
		var dtmBirth=new Date(arrSplit[2]+'/'+arrSplit[3]+'/'+arrSplit[4]);
		var dGoodDay; 
		dGoodDay=(dtmBirth.getFullYear()==Number(arrSplit[2]))&&((dtmBirth.getMonth()+1)==Number(arrSplit[3]))&&(dtmBirth.getDate()==Number(arrSplit[4])); 
		if(!dGoodDay){
			alert("身份证号的出生日期不对！");
			return false;
		}else{//
			var valNum;
			var arrInt=new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
			var arrCh= new Array('1','0','X','9','8','7','6','5','4','3','2');
			var nTemp=0,i;
			for(i=0;i<17;i++){
				nTemp +=val.substr(i,1)*arrInt[i];
			}
			valNum=arrCh[nTemp%11];
			if(valNum!=val.substr(17,1)){
				alert("18位省份证号的校验码不正确！");
				return false;
			}
			return true;
		}
	}*/return true;
}
/**
 * 人员外包类型关联后面字段的显示
 */
function selectPersonType(e){
	var $obj_tr = getCurrentPageObj().find("#is_op");
	if(e=='01'){//人员外包
		$obj_tr.show();
	}else{
		$obj_tr.hide();
	}
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
	var currTab = getCurrentPageObj();
	if(purch_type=="01"){
		currTab.find("#trshow").show();
		currTab.find(".td_ass").show();
		currTab.find(".td_con").hide();
		currTab.find(".td_hide").show();
		currTab.find("input[name='ass_code']").val("");
		currTab.find("input[name='contract_code']").val("");
	}else if(purch_type=="02"){
		currTab.find("#trshow").show();
		currTab.find(".td_ass").hide();
		currTab.find(".td_con").show();
		currTab.find(".td_hide").show();
		currTab.find("input[name='ass_code']").val("");
		currTab.find("input[name='contract_code']").val("");
	}else if(purch_type=="04"){
		currTab.find("#trshow").hide();
		currTab.find("input[name='ass_code']").val("");
		currTab.find("input[name='contract_code']").val("");
	}else if(purch_type=="05"){
		currTab.find("#trshow").hide();
		currTab.find("input[name='ass_code']").val("");
		currTab.find("input[name='contract_code']").val("");
	}
}
function selectQualiLevel(e){
	initSelect(objPOP.find("#qualiLevelinfo_form").find("select[name='op_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}

function initSaveButton(isNew){//初始化保存按钮
	var obj=getCurrentPageObj().find("#saveOutPerson");
	obj.unbind("click");
	obj.click(function(){
		if(vlidate(getCurrentPageObj(),"",false)){
			var card=getCurrentPageObj().find("input[name='UPD.idcard_no']").val();//"445302199407241255";
			var flag=isCard(card);
			if(flag==false){
				return;
			}
			var param = {};
//			var param=getOutPersonWorkInfoParam();
//			if(param==false){
//				return;
//			}
			var vals=getCurrentPageObj().find("[name^='UPD.']");
			for(var i=0;i<vals.length;i++){
				var val=$(vals[i]);
				if($.trim(val.val())!=""){
					param[val.attr("name").substr(4)]=val.val();
				}
			}
			if(isNew == "yes"){//是否是新增
				baseAjaxJsonp(dev_outsource+"outperson/addOutPersonInfo.asp?SID="+SID+"&call="+calls,param,function(data){
					if(!data||!data.result||data.result=="false"){
						alert((data.msg||"保存失败!"));
					}else{
						alert("保存成功!");
						obj.unbind("click");
						closeCurrPageTab();
//						getCurrentPageObj().find("li[name='otherMsg']").show();
//						getCurrentPageObj().find("#bascInfo").removeClass("active");
//						getCurrentPageObj().find("#basic_info").removeClass("active");
//						getCurrentPageObj().find("#eduAndWork").addClass("active");
//						getCurrentPageObj().find("#edu_work").addClass("active");
//						//初始化其他信息页签按钮
//						initMoreMsgPOP();
					}
				},calls);
			}else if(isNew == "no"){
				baseAjaxJsonp(dev_outsource+"outperson/updOutPerson.asp?SID="+SID+"&call="+calls,param,function(data){
					if(!data||!data.result||data.result=="false"){
						alert("保存失败!");
					}else{
						alert("保存成功!");
						closeCurrPageTab();
					}
				},calls);
			}
		}
	});
};

//初始化页签增删改按钮
function initMoreMsgPOP(op_code){
	//var op_code = objPOP.find("input[name='UPD.idcard_no']").val();//"445302199407241255";
	objPOP.find("input[name='UPD.op_code']").val(op_code);
	/*******教育经历*******/
	eduInfo(op_code);
	//新增
	objPOP.find("#add_eduinfo").unbind("click");
	objPOP.find("#add_eduinfo").click(function(){
		//学历
		initSelect(objPOP.find("#eduinfo_form").find("select[name='edu_background']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_EDU"});
		objPOP.find("#eduinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#eduinfo_form").find("textarea").each(function(){ $(this).val(""); });
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
				objPOP.find("#eduinfo_form").find("textarea[name='"+ k1 +"']").val(params[0][k]);
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
		nconfirm("确定要删除这条数据吗？",function(){
			var url = "outperson/deleteEduInfo.asp?op_id="+ids+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#eduinfo_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryEduInfo.asp?op_code="+op_code+"&call=eduinfo&SID="+SID});
				}else{
					alert("删除失败!");
				}
			},calls);	
		});
	});
	
	/********工作履历********/
	workInfo(op_code);
	//新增
	objPOP.find("#add_workInfo").unbind("click");
	objPOP.find("#add_workInfo").click(function(){
		//公司性质
		initSelect(objPOP.find("#workinfo_form").find("select[name='enterprise_nature']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_NATURE_BUSINESS"});
		objPOP.find("#workinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#workinfo_form").find("textarea").each(function(){ $(this).val(""); });
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
				objPOP.find("#workinfo_form").find("textarea[name='"+ k1 +"']").val(params[0][k]);
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
			var url = "outperson/deleteWorkInfo.asp?op_id="+ids+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#workInfo_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+"&call=workInfo&SID="+SID});
				}else{
					alert("删除失败!");
				}
			},calls);	
		});
	});
	
	/**********资质证书**********/
	certlifInfo(op_code);
	//新增
	objPOP.find("#add_qualificate_info").unbind("click");
	objPOP.find("#add_qualificate_info").click(function(){
		objPOP.find("#certlifinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#certlifinfo_form").find("textarea").each(function(){ $(this).val(""); });
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
				objPOP.find("#certlifinfo_form").find("textarea[name='"+ k1 +"']").val(params[0][k]);
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
		var id = objPOP.find("#qualificate_info_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
		nconfirm("确定要删除这条数据吗？",function(){
			var url = "outperson/deleteQualificateInfo.asp?op_id="+ids+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#qualificate_info_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+"&call=qualificate&SID="+SID});
				}else{
					alert("删除失败!");
				}
			},calls);	
		});
	});
	
	/************专业技能***********/
	skillInfo(op_code);
	//新增
	objPOP.find("#add_skill_info").unbind("click");
	objPOP.find("#add_skill_info").click(function(){
		objPOP.find("#skillinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#skillinfo_form").find("textarea").each(function(){ $(this).val(""); });
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
		if(params.length != 1){
			alert("请选择一条数据进行修改！");
			return;
		};
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "memo"){
				objPOP.find("#skillinfo_form").find("textarea[name='"+ k1 +"']").val(params[0][k]);
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
			var url = "outperson/deleteSkillInfo.asp?op_id="+ids+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#skill_info_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/querySkillInfo.asp?op_code="+op_code+"&call=skillInfo&SID="+SID});
				}else{
					alert("删除失败!");
				}
			},calls);	
		});
	});
	
	
	/***********项目经历**********/
	projectInfo(op_code);
	//新增
	objPOP.find("#add_projrct_info").unbind("click");
	objPOP.find("#add_projrct_info").click(function(){
		objPOP.find("#projectinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#projectinfo_form").find("textarea").each(function(){ $(this).val(""); });
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
			if(k1 == "project_abstract"){
				objPOP.find("#projectinfo_form").find("textarea[name='"+ k1 +"']").val(params[0][k]);
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
			var url = "outperson/deleteProjectInfo.asp?op_id="+ids+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#projrct_info_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+"&call=outpeInfo&SID="+SID});
				}else{
					alert("删除失败!");
				}
			},calls);	
		});
	});
	
	
	/***********资质级别************/
	qualiLevel(op_code);
	//新增
	objPOP.find("#add_quali_level").unbind("click");
	objPOP.find("#add_quali_level").click(function(){
		objPOP.find("#qualiLevelinfo_form").find("input").each(function(){ $(this).val(""); });
		objPOP.find("#qualiLevelinfo_form").find("textarea").each(function(){ $(this).val(""); });
		objPOP.find("#qualiLevelinfo_form select").val("").select2();
		//资质级别
		initSelect(getCurrentPageObj().find("select[name='qualificate_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_QULITY_LEVEL"});
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
		for(var k in params[0]){
			var k1 = k.toLowerCase();
			if(k1 == "memo"){
				objPOP.find("#qualiLevelinfo_form").find("textarea[name='"+ k1 +"']").val(params[0][k]);
			}else if(k1 == "qualificate_level"){
				//资质级别
				initSelect(objPOP.find("#qualiLevelinfo_form").find("select[name='qualificate_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_QULITY_LEVEL"},params[0][k]);
			}else if(k1 == "op_grade"){	
				//人员档次
				initSelect(objPOP.find("#qualiLevelinfo_form").find("select[name='op_grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:params[0]["QUALIFICATE_LEVEL"]},params[0][k]);
			}else if(k1 == "is_current"){	
				//是否当前资质
				initSelect(objPOP.find("#qualiLevelinfo_form").find("select[name='is_current']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"},params[0][k]);
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
			var url = "outperson/deleteQualiLevelInfo.asp?op_id="+ids+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#quali_level_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+"&call=outpeLevel&SID="+SID});
				}else{
					alert("删除失败!");
				}
			},calls);	
		});
	});
	
	
	/************资源池************/
	//resourcePool(op_code);
	//新增
//	objPOP.find("#add_resource_pool").unbind("click");
//	objPOP.find("#add_resource_pool").click(function(){
//		//人员采购类型
//		initSelect(getCurrentPageObj().find("select[name='purch_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});
//		initSelect(getCurrentPageObj().find("select[name='is_key']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"});
//		objPOP.find("#resourcePoolinfo_form").find("input").each(function(){ $(this).val(""); });
//		objPOP.find("#resourcePoolinfo_form").find("textarea").each(function(){ $(this).val(""); });
//		objPOP.find("#resourcePoolinfo_form select").val("").select2();
//		objPOP.find('#opModal_resourcePoolinfo').modal('show');
//		/*objPOP.find('#opModal_resourcePoolinfo').modal({
//			backdrop:"static"
//		});*/
//		$("#trshow").hide();
//		$("input[name='ass_code']").val("");
//		$("input[name='contract_code']").val("");
//		saveResourcePoolMsg(op_code,"add"," ");
//	});
	//合同查询模态框
	modalInfo();
	function modalInfo(){
		$("input[name='contract_code']").click(function(){
			var supplier_id=getCurrentPageObj().find("#supplier_id").val();
			openContractInfoPop("contractInfoPop",{code:getCurrentPageObj().find("input[name='contract_code']")},supplier_id,"","");
		});
	}
	//任务查询模态框
	modalProjectQuery();
	function modalProjectQuery(){
		$("input[name='ass_code']").click(function(){
			openAssignmentPop("noprojetPop",{no:getCurrentPageObj().find("input[name='ass_code']")});
		});
	}
	//修改
	objPOP.find("#update_resource_pool").unbind("click");
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
			}else if(k1=="duty_explain"){
				objPOP.find("#resourcePoolinfo_form").find("textarea[name='"+ k1 +"']").val(params[0][k]);
			}else{
				objPOP.find("#resourcePoolinfo_form").find("input[name='"+ k1 +"']").val(params[0][k]);
			};
		};
		objPOP.find('#opModal_resourcePoolinfo').modal('show');
		saveResourcePoolMsg(op_code,"update",params[0].OP_ID);
	});
	
	//删除
	objPOP.find("#delete_resource_pool").unbind("click");
	objPOP.find("#delete_resource_pool").click(function(){
		var id = objPOP.find("#resource_pool_table").bootstrapTable("getSelections");
		var ids = $.map(id ,function(row){return row.OP_ID;});
		if(id.length != 1){
			alert("请选择一条数据进行删除！");
			return;
		};
		nconfirm("确定要删除这条数据吗？",function(){
			var url = "outperson/deleteResPoolInfo.asp?op_id="+ids+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, null, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("删除成功!");
					objPOP.find("#resource_pool_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryResPoolInfo.asp?op_code="+op_code+"&call=outpeAdd&SID="+SID});
				}else{
					alert("删除失败!");
				}
			},calls);	
		});
	});
	
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
			var url = "outperson/addEduInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_eduinfo').modal('hide');
					objPOP.find("#eduinfo_table").bootstrapTable('refresh',{url : dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+"&call=eduinfo&SID="+SID});
				}else{
					alert("添加失败!");
				}
			},calls);
		}else if(status == "update"){
			var url = "outperson/updateEduInfo.asp?op_id="+op_id+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_eduinfo').modal('hide');
					objPOP.find("#eduinfo_table").bootstrapTable('refresh',{url : dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+"&call=eduinfo&SID="+SID});
				}else{
					alert("修改失败!");
				}
			},calls);
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
		url : dev_outsource+'outperson/queryEduInfo.asp?op_code='+op_code+'&call=eduinfo&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:"eduinfo",
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
			var url = "outperson/addWorkInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_workinfo').modal('hide');
					objPOP.find("#workInfo_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+"&call=workInfo&SID="+SID});
				}else{
					alert("添加失败!");
				}
			},calls);
		}else if(status == "update"){
			var url = "outperson/updateWorkInfo.asp?op_id="+op_id+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_workinfo').modal('hide');
					objPOP.find("#workInfo_table").bootstrapTable('refresh',{url : dev_outsource+'outperson/queryWorkInfo.asp?op_code='+op_code+"&call=workInfo&SID="+SID});
				}else{
					alert("修改失败!");
				}
			},calls);
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
	$("#workInfo_table").bootstrapTable({//工作履历信息
		//请求后台的URL（*）
		url : dev_outsource+"outperson/queryWorkInfo.asp?op_code="+op_code+'&call=workInfo&SID='+SID,
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
		jsonpCallback:"workInfo",
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
			var url =  "outperson/addQualificateInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_certlifinfo').modal('hide');
					objPOP.find("#qualificate_info_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+"&call=qualificate&SID="+SID});
				}else{
					alert("添加失败!");
				}
			},calls);
		}else if(status == "update"){
			var url = "outperson/updateQualificateInfo.asp?op_id="+op_id+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_certlifinfo').modal('hide');
					objPOP.find("#qualificate_info_table").bootstrapTable('refresh',{url : dev_outsource+'outperson/queryQualificateInfo.asp?op_code='+op_code+"&call=qualificate&SID="+SID});
				}else{
					alert("修改失败!");
				}
			},calls);
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
	$("#qualificate_info_table").bootstrapTable({////教育信息
		url : dev_outsource+"outperson/queryQualificateInfo.asp?op_code="+op_code+'&call=qualificate&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:"qualificate",
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
			var url = "outperson/addSkillInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_skillinfo').modal('hide');
					objPOP.find("#skill_info_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/querySkillInfo.asp?op_code="+op_code+"&call=skillInfo&SID="+SID});
				}else{
					alert("添加失败!");
				}
			},calls);
		}else if(status == "update"){
			var url = "outperson/updateSkillInfo.asp?op_id="+op_id+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_skillinfo').modal('hide');
					objPOP.find("#skill_info_table").bootstrapTable('refresh',{url : dev_outsource+'outperson/querySkillInfo.asp?op_code='+op_code+"&call=skillInfo&SID="+SID});
				}else{
					alert("修改失败!");
				}
			},calls);
		}			
	});
}
function skillInfo(op_code){//初始化资质证书及技能相关信息
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#skill_info_table").bootstrapTable({//工作履历信息
		//请求后台的URL（*）
		url : dev_outsource+"outperson/querySkillInfo.asp?op_code="+op_code+'&call=skillInfo&SID='+SID,
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
		jsonpCallback:"skillInfo",
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
			var url = "outperson/addProjectInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_projectinfo').modal('hide');
					objPOP.find("#projrct_info_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+"&call=outpeInfo&SID="+SID});
				}else{
					alert("添加失败!");
				}
			},calls);
		}else if(status == "update"){
			var url = "outperson/updateProjectInfo.asp?op_id="+op_id+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_projectinfo').modal('hide');
					objPOP.find("#projrct_info_table").bootstrapTable('refresh',{url : dev_outsource+'outperson/queryProjectInfo.asp?op_code='+op_code+"&call=outpeInfo&SID="+SID});
				}else{
					alert("修改失败!");
				}
			},calls);
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
	$("#projrct_info_table").bootstrapTable({//教育信息
		url : dev_outsource+"outperson/queryProjectInfo.asp?op_code="+op_code+'&call=outpeInfo&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:"outpeInfo",
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
			var url = "outperson/addQualiLevelInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("保存成功!");
					objPOP.find('#opModal_qualiLevelinfo').modal('hide');
					objPOP.find("#quali_level_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+"&call=outpeLevel&SID="+SID});
				}else{
					alert(data.msg);
				}
			},calls);
		}else if(status == "update"){
			var url = "outperson/updateQualiLevelInfo.asp?op_id="+op_id+'&op_code='+op_code+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("保存成功!");
					objPOP.find('#opModal_qualiLevelinfo').modal('hide');
					objPOP.find("#quali_level_table").bootstrapTable('refresh',{url : dev_outsource+'outperson/queryQualiLevelInfo.asp?op_code='+op_code+"&call=outpeLevel&SID="+SID});
				}else{
					alert(data.msg);
				}
			},calls);
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
	$("#quali_level_table").bootstrapTable({
		url : dev_outsource+"outperson/queryQualiLevelInfo.asp?op_code="+op_code+'&call=outpeLevel&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:"outpeLevel",
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
			title : '资质级别',
			align : "center"
		},{
			field : 'OP_GRADE_NAME',
			title : '资质档次',
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
function saveResourcePoolMsg(op_code,status,op_id){
	var resourcePoolForm = objPOP.find("#resourcePoolinfo_form");
	objPOP.find("#saveResourcePoolInfo").unbind("click");
	objPOP.find("#saveResourcePoolInfo").click(function(){
		if(!vlidate(resourcePoolForm)){
			return;
		}
		var params = resourcePoolForm.serialize();
		if(status == "add"){
			var url =  "outperson/addResPoolInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("添加成功!");
					objPOP.find('#opModal_resourcePoolinfo').modal('hide');
					objPOP.find("#resource_pool_table").bootstrapTable('refresh',{url : dev_outsource+"outperson/queryResPoolInfo.asp?op_code="+op_code+"&call=outpeAdd&SID="+SID});
				}else{
					alert("添加失败!");
				}
			},calls);
		}else if(status == "update"){
			var url = "outperson/updateResPoolInfo.asp?op_id="+op_id+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(dev_outsource+url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert("修改成功!");
					objPOP.find('#opModal_resourcePoolinfo').modal('hide');
					objPOP.find("#resource_pool_table").bootstrapTable('refresh',{url : dev_outsource+'outperson/queryResPoolInfo.asp?op_code='+op_code+"&call=outpeAdd&SID="+SID});
				}else{
					alert("修改失败!");
				}
			},calls);
		}				
	});
}
function resourcePool(op_code){//初始化资源池信息
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#resource_pool_table").bootstrapTable({//教育信息
		url : dev_outsource+"outperson/queryResPoolInfo.asp?op_code="+op_code+'&call=outpeAdd&SID='+SID,//请求后台的URL（*）
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
		jsonpCallback:"outpeAdd",
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
