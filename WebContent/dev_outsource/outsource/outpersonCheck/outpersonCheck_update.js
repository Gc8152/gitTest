/**
 * 字典初始化方法
 */
initVlidate($("#updateOptCheckList"));
/*function initUpdateOptCheckPage(){
	initVlidate($("#updateOptCheckList"));
	initSelect(getCurrentPageObj().find("#check_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_CHECKTYPE"});
	initSelect(getCurrentPageObj().find("#op_specialtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"});
}*/
var calls = getMillisecond();
//页面赋值
function optCheck_update(param){
	$("#check_id").val(param);
	var p=param;
	baseAjaxJsonp(dev_outsource+'OptCheck/findOptCheckDetail.asp?&check_id='+p+"&SID="+SID+"&call="+calls,null,function(msg){
		
		//页面赋值方法
		if(msg){
			for(var k in msg.optCheck){
				var moon = k.toLowerCase();
//				getCurrentPageObj().find("#"+k).text(msg.optCheck[k]);
//				getCurrentPageObj().find("#updateOptCheckList").setform(msg.optCheck);
				getCurrentPageObj().find("#OCU_"+moon).val(msg.optCheck[k]);
				if(moon=="op_specialtype"){
					initSelect(getCurrentPageObj().find("#op_specialtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"},msg.optCheck[k]); 
				}else if(moon=="check_type"){
					initSelect(getCurrentPageObj().find("#check_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_CHECKTYPE"},msg.optCheck[k]); 
				}
			}
			initBankInfoUp(msg.optCheck["OP_CODE"]);
			tableEventUp(msg.optCheck["CHECK_ID"],msg.optCheck["CHESCORE"]);
		}
	},calls);
}
//回显行内信息
function initBankInfoUp(op_code){
	baseAjaxJsonp(dev_outsource+"OptCheck/queryOneCheckBankInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls,null,function(data){
		if(data){
			var BankInfoMap = data["BankInfoMap"];
			for(var p in BankInfoMap){
				var projectKey = p.toLowerCase();
				getCurrentPageObj().find("#OCU_"+projectKey).val(BankInfoMap[p]);
				getCurrentPageObj().find("#OCU_op_staff_name").text(BankInfoMap["OP_STAFF_NAME"]);
				getCurrentPageObj().find("#OCU_org_name").text(BankInfoMap["ORG_NAME"]);
				getCurrentPageObj().find("#OCU_qualificate_level_name").text(BankInfoMap["QUALIFICATE_LEVEL_NAME"]);
				getCurrentPageObj().find("#OCU_op_grade_name").text(BankInfoMap["OP_GRADE_NAME"]);
				getCurrentPageObj().find("#OCU_project_name").text(BankInfoMap["PROJECT_NAME"]);
				getCurrentPageObj().find("#OCU_stt_time").text(BankInfoMap["STT_TIME"]);
				getCurrentPageObj().find("#OCU_edd_time").text(BankInfoMap["EDD_TIME"]);
				getCurrentPageObj().find("#OCU_st_time").text(BankInfoMap["ST_TIME"]);
				getCurrentPageObj().find("#OCU_ed_time").text(BankInfoMap["ED_TIME"]);
				getCurrentPageObj().find("#OCU_check_score").text(BankInfoMap["CHECK_SCORE"]);
			}
			getCurrentPageObj().find("#OCU_purch_type_name_DIV").text(BankInfoMap["PURCH_TYPE_NAME"]);
		}
	},calls);
	
}
var calls1 = "optTemplateDetailTableUpdate";
function tableEventUp(check_id,scr){
	getCurrentPageObj().find("#up_optTemplateDetailTable").bootstrapTable({
		url : dev_outsource+'OptCheck/findAlloptCheckDetail.asp?id='+check_id+"&SID="+SID+"&call="+calls1,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
	//	queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
	//	pageList : [5,10,20],//每页的记录行数（*）
	//	pageNumber : 1, //初始化加载第一页，默认第一页
	//	pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:calls1,
		singleSelect: true,
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
			field : 'DETAIL_ID',
			title : '考核项综合id',
			align : 'center',
			visible:false
		}, {
			field : "ITEMNAME",
			title : "考核项目",
			align : "center",
			width:"30%",
			formatter:function (value,row,index){
				return 	"<a style='color : blue' href='javascript:void(0)' onclick='openCheckItemPop(\"checkItemDetailU\",\""+row.ID+"\",\""+row.ITEMNAME+"\",\""+row.DETAIL+"\");'>"+value+"</a>";
			}
		}, {
			field : "DETAIL",
			title : "考核项分值",
			align : "center",
		}, {
			field : "CHECK_SCORE",
			title : "考核得分",
			align : "center",
			width:"8%",
			//edit:{type:'text'}
			formatter:function (value,row,index){
				var a = row.DETAIL;
//				var b =a.substr(0,a.length-1);
				var v = "";
				if(value != undefined&&value != null){
					v = value;
				}
				return 	'<input id="check_score_'+index+'" value="'+v+'" style="width:12px" type="text" name="check_score" onkeyup="check();"  onchange="changeScore(this.value,'+a+',this)" class="citic-ast"/>';
			}
		},{
			field : "CHECK_MEMO",
			title : "备注",
			align : "center",
			formatter:function (value,row,index){
				var v = "";
				if(value != undefined&&value != null){
					v = value;
				}
				return 	"<input type='text' value='"+v+"' id='check_memo_"+index+"' name='check_memo' class='citic-ast'/>";
			}
		}]
	});
}

//列表显示考核项信息
function initOptTemplateDetail(opt_specialtype) {

	getCurrentPageObj().find("#up_optTemplateDetailTable").bootstrapTable("refresh",{
			url : dev_outsource+'OptCheck/queryAlloptCheckDetail.asp?opt_specialtype='+opt_specialtype+"&SID="+SID+"&call="+calls1});
};

function changeScore(check_score,detail,obj){
	
	if(Number(check_score)>detail){
		alert("考核得分不能大于考核项分值！");
		$(obj).val("");
		return;
	}
	 var sumScore=0;
	 var cheScore="";
	 var checkScore=$("input[name='check_score']");
	 for (var i = 0; i < checkScore.length; i++) {
		 var a=checkScore[i].value;
		 if(a==""){
			 a="0";
		 }
		sumScore +=Number(a);
		cheScore +=","+(checkScore[i].id+"-"+a);
		$("#OCU_check_score").val(sumScore);
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
		return;
	}
	 var sumScore=0;
	 var cheScore="";
	 var checkScore=$("input[name='check_score']");
	 for (var i = 0; i < checkScore.length; i++) {
		 var a=checkScore[i].value;
		 if(a==""){
			 a="0";
		 }
		sumScore +=Number(a);
		cheScore +=","+(checkScore[i].id+"-"+a);
		$("#OCU_check_score").val(sumScore);
	}
}
 /**
  * 行员考核信息修改
  */
(function(){
	 var obj=getCurrentPageObj().find("#optCheckEdit");
	 obj.unbind("click");
	 obj.click(function(){
		 if(vlidate(getCurrentPageObj(),"",false)){
			 var params={};
			 params.op_specialtype=getCurrentPageObj().find("#op_specialtype").val();
			 params.op_specialtype=getCurrentPageObj().find("#check_type").val();
			 var sumScore=0;
			 var cheScore="";
			 var checkScore=$("input[name='check_score']");
			 for (var i = 0; i < checkScore.length; i++) {
				 var a=checkScore[i].value;
				 if(a==""){
					 a="0";
				 }
				sumScore +=Number(a);
				cheScore +=","+(checkScore[i].id+"-"+a);
			}
			 var param = getCurrentPageObj().find("#up_optTemplateDetailTable").bootstrapTable('getData');
			 var idstr='';
			//考核项
			 var template_table = new Array();
			 for(var i=0;i<param.length;i++){
				 //var check_score=getCurrentPageObj().find("#check_score").val()
				 idstr+=","+param[i].ID;
				 var a= getCurrentPageObj().find("#up_optTemplateDetailTable").find("#check_score_"+i).val();
				 if(a==""){
					 a="0";
				 }
				 var obj = new Object();
				 obj.check_id = param[i].ID;
				 obj.check_item = param[i].ITEMNAME;
				 obj.check_score =  param[i].DETAIL;
				 obj.get_score = a;
				 obj.check_memo = getCurrentPageObj().find("#up_optTemplateDetailTable").find("#check_memo_"+i).val();
				 template_table.push(obj);
			 }
			 params["template_table"]=JSON.stringify(template_table);
			 params.score=sumScore;
			 params.cheScore=cheScore;
			 params.check_id=$("#check_id").val();
			 params.idstr=idstr;
			 var inputs = $("input[name^='OCU.']");
			 var select = $("select[name^='OCU.']");
			 for (var i = 0; i < inputs.length; i++) {
					var obj = $(inputs[i]);
					params[obj.attr("name").substr(4)] = obj.val();
				}
				for(var i = 0; i < select.length; i++){
					var obj = $(select[i]);
					params[obj.attr("name").substr(4)] = obj.val();
				}
				baseAjaxJsonp(dev_outsource+"OptCheck/updateOptCheck.asp?SID="+SID+"&call="+calls,params,function(data){
				if(!data||!data.result||data.result=="false"){
					alert("修改失败!");
				}else{
					alert("修改成功!",function(){
						closeCurrPageTab();
					});
				}
			},calls);
		 }
	 });	 	
})();

//时间比较
function ocheckupdTimeCompare(){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#check_starttime").val();
		var check_endtime = getCurrentPageObj().find("#check_endtime").val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#check_starttime").val("");
					getCurrentPageObj().find("#check_endtime").val("");
				});
			}
		}
	}});
}
