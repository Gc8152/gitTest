/**
 * 字典初始化方法
 */
function initStaffCheckaddPage(){
	//专业分类
	initSelect(getCurrentPageObj().find("select[name='OCA.op_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"});
	initSelect(getCurrentPageObj().find("select[name='OCA.check_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_CHECKTYPE"});
	
	//choseCheckType();
	tableEvent();
	//初始化POP框(人员编号pop)
	var obj=getCurrentPageObj().find("#OCA_op_code");
	obj.unbind("click");
	obj.click(function(){
		openOptForCheckPop("optCheckPop",{singleSelect:true,
			//name:getCurrentPageObj().find("input[name='OCA.op_code']"),
			no:getCurrentPageObj().find("#OCA_op_code"),
			op_name:getCurrentPageObj().find("#OCA_op_name"),
			supplier_name:getCurrentPageObj().find("#OCA_supplier_name"),
			supplier_id:getCurrentPageObj().find("#OCA_supplier_id"),
			op_phone:getCurrentPageObj().find("#OCA_op_phone"),
			sex_name:getCurrentPageObj().find("#OCA_op_sex"),
			op_birthday:getCurrentPageObj().find("#OCA_op_birthday"),
			education_name:getCurrentPageObj().find("#OCA_op_education"),
			graduate_college:getCurrentPageObj().find("#OCA_graduate_college"),
			op_special:getCurrentPageObj().find("#OCA_op_special"),
			start_worktime:getCurrentPageObj().find("#OCA_start_worktime"),
			op_email:getCurrentPageObj().find("#OCA_op_email"),
			job_type_name:getCurrentPageObj().find("#OCA_job_type"),
			op_state_name:getCurrentPageObj().find("#OCA_op_state"),
			op_skills_name:getCurrentPageObj().find("#OCA_op_skills"),
			op_specialtype_name:getCurrentPageObj().find("#OCA_op_specialtype"),
			op_id:getCurrentPageObj().find("input[name='OCA.op_id']"),
			purch_type_name:getCurrentPageObj().find("input[name='OCA.purch_type_name']"),
			func_call:function(row){getCurrentPageObj().find("#OCU_purch_type_name").html(row["PURCH_TYPE_NAME"]);	}//
			});
	});
}

//回显行内信息
function initBankInfo(op_code){
	var calls = getMillisecond();
	baseAjaxJsonp(dev_outsource+"OptCheck/queryOneCheckBankInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls,null,function(data){
		if(data){
			var BankInfoMap = data["BankInfoMap"];
			for(var p in BankInfoMap){
				var projectKey = p.toLowerCase();
				getCurrentPageObj().find("#OCA_"+projectKey).val(BankInfoMap[p]||"");
				getCurrentPageObj().find("#OCA_op_staff_name").text(BankInfoMap["OP_STAFF_NAME"]||"");
				getCurrentPageObj().find("#OCA_org_name").text(BankInfoMap["ORG_NAME"]||"");
				getCurrentPageObj().find("#OCA_qualificate_level_name").text(BankInfoMap["QUALIFICATE_LEVEL_NAME"]||"");
				getCurrentPageObj().find("#OCA_op_grade_name").text(BankInfoMap["OP_GRADE_NAME"]||"");
				getCurrentPageObj().find("#OCA_project_name").text(BankInfoMap["PROJECT_NAME"]||"");
				getCurrentPageObj().find("#OCA_stt_time").text(BankInfoMap["STT_TIME"]||"");
				getCurrentPageObj().find("#OCA_edd_time").text(BankInfoMap["EDD_TIME"]||"");
				getCurrentPageObj().find("#OCA_st_time").text(BankInfoMap["ST_TIME"]||"");
				getCurrentPageObj().find("#OCA_ed_time").text(BankInfoMap["ED_TIME"]||"");
			}
		}
	},calls);
	
}

var dcall = "optTemplateDetailTableAdd";
function tableEvent(){
	var opt_specialtype="";
	getCurrentPageObj().find("#optTemplateDetailTable").bootstrapTable({
		url : dev_outsource+'OptCheck/queryAlloptCheckDetail.asp?opt_specialtype='+opt_specialtype+"&SID="+SID+"&call="+dcall,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
	//	queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
	//	pagination : false, //是否显示分页（*）
	//	pageList : [5,10,20],//每页的记录行数（*）
	//	pageNumber : 1, //初始化加载第一页，默认第一页
	//	pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback: dcall,
		editable:true,//开启编辑模式
		onLoadSuccess:function(data){
		},
		columns : [ {
			field : 'abcdef',
			title : '序号',
			align : "center",
			formatter: function (value, row, index) {
    			  return index+1;
        	},
			width:"5%"
		}, {
			field : 'ID',
			title : '考核项id',
			align : 'center',
			visible:false
		}, {
			field : "ITEMNAME",
			title : "考核项目",
			align : "center",
			width:"30%",
			formatter:function (value,row,index){
				return 	"<a style='color : blue' href='javascript:void(0)' onclick='openCheckItemPop(\"checkItemDetailA\",\""+row.ID+"\",\""+row.ITEMNAME+"\",\""+row.DETAIL+"\");'>"+value+"</a>";
			}
		}, {
			field : "ONE_SCORE",
			title : "考核项分值",
			align : "center"
		}, {
			field : "CHECK_SCORE",
			title : "考核得分",
			align : "center",
			width:"8%",
			//edit:{type:'text'}
			formatter:function (value,row,index){
				var a=row.ONE_SCORE;
				var b = 0;
				if(a.indexOf("分")!=-1){//考核分后带有分字
				   b = a.substr(0,a.length-1);
				}else{
				   b = a;
				}
				return 	'<input id="check_score_'+index+'" style="width:12px" type="text" name="check_score" onkeyup="check();"  onchange="changeScore(this.value,'+b+',this)" class="citic-ast"/>';
			}
		},{
			field : "CHECK_MEMO",
			title : "备注",
			align : "center",
			formatter:function (value,row,index){
				return 	"<input type='text' id='check_memo_"+index+"' name='check_memo' class='citic-ast'/>";
			}
		}]
	});
}


//列表显示考核项信息
function initOptTemplateDetail(opt_specialtype) {
	getCurrentPageObj().find("#optTemplateDetailTable").show();
	getCurrentPageObj().find("#optTemplateDetailTable").bootstrapTable("refresh",{
			url : dev_outsource+'OptCheck/queryAlloptCheckDetail.asp?opt_specialtype='+opt_specialtype+"&SID="+SID+"&call="+dcall});
};

function changeScore(check_score,detail,obj){
	if(Number(check_score)>Number(detail)){
		alert("考核得分不能大于考核项分值！");
		$(obj).val("");
	}
}
function check(){
	if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39)){
		if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105))){
			event.returnValue=false;
		}	
	}
	if(event.returnValue==false){
		alert("您的输入有误！");
	}
}
 /**
  * 外包人员考核信息新增
  */
(function(){
	 var obj=getCurrentPageObj().find("#optCheckSave");
	 obj.unbind("click");
	 obj.click(function(){
		 if(vlidate(getCurrentPageObj(),"",false)){
			 var params = getCurrentPageObj().find("#optTemplateDetailTable").bootstrapTable('getData');
			 var checkScore=$("input[name='check_score']");
			 var idstr='';
			//考核项
			 var template_table = new Array();
			 for(var i=0;i<params.length;i++){
				 idstr+=","+params[i].ID;
				 var a= getCurrentPageObj().find("#optTemplateDetailTable").find("#check_score_"+i).val();
				 if(a==""){
					 a="0";
				 }
				 var obj = new Object();
				 obj.check_id = params[i].ID;
				 obj.check_item = params[i].ITEMNAME;
				 obj.check_score =  params[i].ONE_SCORE;
				 obj.get_score = a;
				 obj.check_memo = getCurrentPageObj().find("#optTemplateDetailTable").find("#check_memo_"+i).val();
				 template_table.push(obj);
			 }
			 var sumScore=0;
			 var cheScore="";
			 for (var i = 0; i < checkScore.length; i++) {
				 var a=checkScore[i].value;
				 if(a==""){
					 a="0";
				 }
				sumScore +=Number(a);
				cheScore +=","+(checkScore[i].id+"-"+a);
			}
			var inputs = $("input[name^='OCA.']");
			var select = $("select[name^='OCA.']");
			var text = $("textarea[name^='OCA.']");
			var param = {};
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				param[obj.attr("name").substr(4)] = obj.val();
			}
			for(var i = 0; i < select.length; i++){
				var obj = $(select[i]);
				param[obj.attr("name").substr(4)] = obj.val();
			}
			for(var i = 0; i < text.length; i++){
				var obj = $(text[i]);
				param[obj.attr("name").substr(4)] = obj.val();
			}
			 param.idstr=idstr;
			 param.score=sumScore;
			 param.cheScore=cheScore;
			 param["template_table"]=JSON.stringify(template_table);
			 var calls = getMillisecond();
			 baseAjaxJsonp(dev_outsource+"OptCheck/optCheckAdd.asp?SID="+SID+"&call="+calls,param,function(data){
				if(!data||!data.result||data.result=="false"){
					alert(data.msg);
				}else{
					alert("保存成功!",function(){
						closeCurrPageTab();
					});
				}
			},calls);
		 }
	 });	 	
})();

/*function choseCheckType(){
	//获取当前时间
	var y,m,d;
	var date = new Date();         // 创建 Date 对象。
	if(IEVersion==8){
		y = (date.getYear()); // 获取年份。
	}else{
		y = (1900+date.getYear()); // 获取年份。 
	}
	m = (date.getMonth() + 1); // 获取月份。
	d = date.getDate();        // 获取日。
	//以浮点数大小形式比较日期
	var strdate = m+"."+d; 
	var fdate = parseFloat(strdate);
	var check_type = "";
	//第一季度 3.20-4.1
	if(fdate>=3.20 && fdate<4.1){
		check_type = y+"年第一季度考核";
	}
	//第二季度 6.20-7.1
	else if(fdate>=6.20 && fdate<7.1){
		check_type = y+"年第二季度考核";
	}
	//第三季度 9.20-10.1
	else if(fdate>=9.20 && fdate<10.1){
		check_type = y+"年第三季度考核";
	}
	//第四季度 12.20-12.31
	else if(fdate>=12.20 && fdate<=12.30){
		check_type = y+"年第四季度考核";
	}
	//上半年 7.20-8.1   
	else if(fdate>=7.20 && fdate<8.1){
		check_type = y+"年上半年考核";
	}
	//下半年 1.20-2.1 
	else if(fdate>=1.20 && fdate<2.1){
		check_type = (y-1)+"年下半年考核";
	}
	//年度 2.10-3.1
	else if(fdate>=2.10 && fdate<3.1){
		check_type = (y-1)+"年度考核";
	}
	//不在考核期内
	else{
		var none = "当前不在考核期内";
		getCurrentPageObj().find("input[name='OCA.check_type']").attr("placeholder",none);
	};
	getCurrentPageObj().find("select[name='OCA.check_type']").val(check_type);
}*/


initStaffCheckaddPage();
initVlidate($("#validate_table"));
initVlidate($("#addOptCheckTable"));