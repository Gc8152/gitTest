(function(serviceOrder){
	var flag="add";
	/**
	 * 获取当前的年
	 * @returns {String}
	 */
	var yearFunc=function(){
	   var y; var d = new Date();
		   if(IEVersion==8){ y = (d.getYear());} // 获取年份。
		   else{y = (1900+d.getYear()); } // 获取年份。 
		   return y;
	 };
	//季度
	//var quarter=[["",""]["01-01","03-31"],["04-01","06-30"],["07-01","09-30"],["10-01","12-31"]];
	var quarter=[["01-01","03-31"],["04-01","06-30"],["07-01","09-30"],["10-01","12-31"]];//字典项ITEM_CODE从01开始，故数组从[1]的值开始有效
	var initAddEvent=function(){//新增核算单的事件
		//初始化供应商pop
		//供应商名称
		getCurrentPageObj().find("#suplier_name").unbind("click");
		getCurrentPageObj().find("#suplier_name").click(function(){
			openSupplierPop2("sorderContractSupplier_Pop",
					{singleSelect:true,parent_company:getCurrentPageObj().find("#suplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='so.suplier_id']")},function(data){
						if(data!=null&&data!=undefined&&data!=""){
							initSelectByUrl(getCurrentPageObj().find("#contract_code"),dev_outsource+"sOrder/querySupplierContract.asp?sup_num="+data,{code:"CONTRACT_CODE",name:"CONTRACT_NAME"},function(){
								refreshBootstrapTable();
							});
						}
					});
		});
		getCurrentPageObj().find("#acc_quarter").change(function(){//下拉值发生变化时
			selectQuarterChange($(this).val());
		});
		getCurrentPageObj().find("#contract_code").change(function(){//合同下拉变化时
			refreshBootstrapTable();
		});
		getCurrentPageObj().find("#acc_year").unbind("click").click(function(){
			WdatePicker({onpicked:refreshBootstrapTable,dateFmt:'yyyy'});
		});
		initSelect(getCurrentPageObj().find("#acc_quarter"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_QUARTER"});//季度字典项
	};
	var initUpdateEvent=function(quarterDefault,contract_code){//修改核算单的事件
		getCurrentPageObj().find("#bookInfo_add").unbind("click").click(function(){
			orderPersonPop.penOrderDetailPop(getCurrentPageObj().find("#assInfo_table").bootstrapTable("getData"),function(row){
				getCurrentPageObj().find("#assInfo_table").bootstrapTable("append",row);
				computerSumMonn();
			});
		});
		getCurrentPageObj().find("#acc_quarter").prop({disabled: true});
		getCurrentPageObj().find("#contract_code").prop({disabled: true}).append('<option value="'+contract_code+'">'+contract_code+'</option>').select2();
		initSelect(getCurrentPageObj().find("#acc_quarter"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_QUARTER"},quarterDefault);//季度字典项
	};
	/**
	 * 季度select 中的change事件
	 */
	function selectQuarterChange(selectVal){
		var quarterDate=quarter[parseInt(selectVal)];
		var minDate=yearFunc()+"-"+quarterDate[0];
		var maxDate=yearFunc()+"-"+quarterDate[1];
		getCurrentPageObj().find("#acc_starttime").unbind("click").click(function(){
			WdatePicker({onpicked:refreshBootstrapTable,dateFmt:'MM-dd',minDate:minDate,maxDate:maxDate});
		}).val(quarterDate[0]);
		getCurrentPageObj().find("#acc_endtime").unbind("click").click(function(){
			WdatePicker({onpicked:refreshBootstrapTable,dateFmt:'MM-dd',minDate:minDate,maxDate:maxDate});
		}).val(quarterDate[1]);
		refreshBootstrapTable();
	}
	/**
	 * 刷新数据
	 */
	var refreshBootstrapTable=function(){
		var suplier_id=getCurrentPageObj().find("#suplier_id").val();
		var contract_code=getCurrentPageObj().find("#contract_code").val();
		var acc_starttime=getCurrentPageObj().find("#acc_starttime").val();
		var acc_endtime=getCurrentPageObj().find("#acc_endtime").val();
		if($.trim(suplier_id)&&$.trim(contract_code)&&$.trim(acc_starttime)&&$.trim(acc_endtime)){//都不为空则刷新表格
			var acc_year=getCurrentPageObj().find("#acc_year").val();
			var acc_id=getCurrentPageObj().find("#acc_id").val();
			var url=dev_outsource+'sOrder/findPersonPriceAndLevel.asp?call=jq_1520826055810'+flag+'&SID='+SID+'&sup_num='+suplier_id;
				url+='&contract_code='+contract_code;
				url+="&acc_starttime="+acc_year+"-"+acc_starttime;
				url+="&acc_endtime="  +acc_year+"-"+  acc_endtime;
				url+="&acc_id=" +acc_id;
			getCurrentPageObj().find("#assInfo_table").bootstrapTable("refresh",{url:url});
			if(flag=="update"){
				orderPersonPop.initQueryData(suplier_id,contract_code,acc_year+"-"+acc_starttime,acc_year+"-"+acc_endtime,acc_id);
			}
		};
	};
	/**
	 * 初始化表格
	 */
	var initBootstrapTable=function(url,jsonpCallback){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		var columns=[{
			field : 'number_no',
			title : '序号',
			align : "center",
			width : 80,
			formatter: function (value, row, index) {
    			  return index+1;
        	  }
		},{
			field : "OP_NAME",
			title : "人员姓名",
			align : "center"
		},{
			field : "GRADE_NAME",
			title : "人员方向",
			align : "center"
		},{
			field : "LEVEL_NAME",
			title : "人员级别",
			align : "center"
		},{
			field : "P_PRICE_TAX",
			title : "人员单价(元/月)",
			align : "center"
		},{
			field : "PERSON_DAY",
			title : "人员考勤(人天)",
			align : "center"
		},{
			field : "AD_MONEY",
			title : "金额(元)",
			align : "center",
			formatter: function (value, row, index) {
				if(value){
					return value;
				}
				return ((row.PERSON_DAY||0)*(row.P_PRICE_TAX||0)/22).toFixed(2);
			}
		}];
		if(flag!="query"){//查询时不增加操作列
			columns[columns.length]={
				field : "",
				title : "操作",
				align : "center",
				formatter: function (value, row, index) {
	  			  return "<a href='javascript:void(0)' style='color:#259ce0' onclick='removeOneUser(\""+row.OP_CODE+"\")'>删除</a>";
	      	  }
			};
		}
		getCurrentPageObj().find("#assInfo_table").bootstrapTable("destroy").bootstrapTable({
			url:url,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			//pagination : true, //是否显示分页（*）
			pageList : [5,10,20],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ASS_CODE", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			jsonpCallback : jsonpCallback,
			detailView : false, //是否显示父子表
			singleSelect: true,
			onLoadSuccess : function(data){
				computerSumMonn();
			},
			columns : columns
		});
	};
	/**
	 * type=add 表示新增页面 初始化 type=update表示修改页面初始化
	 * data 是选中的数据(修改或者查看)
	 */
	serviceOrder.Init=function(type,data){
		flag=type;
		if(flag=="add"){
			getCurrentPageObj().find("#bookInfo_add").hide();
			getCurrentPageObj().find("#acc_year").val(yearFunc());
			initAddEvent();
			initBootstrapTable("","jq_1520826055810add");
		}else if(flag=="update"){
			selectQuarterChange(data["ACC_QUARTER"]);//设置日期事件
			getCurrentPageObj().find("#bookInfo_add").show();
			getCurrentPageObj().find("#acc_code_show").text(data["ACC_CODE"]);
			getCurrentPageObj().find("#acc_money_show").text(data["ACC_MONEY"]);
			$.each(data,function(k,v){
				getCurrentPageObj().find("#"+k.toLowerCase()).val(v);
			});
			getCurrentPageObj().find("#suplier_id").val(data["SUP_NUM"]);
			initUpdateEvent(data["ACC_QUARTER"],data["CONTRACT_CODE"]);
			orderPersonPop.initQueryData(data["SUP_NUM"],data["CONTRACT_CODE"],data["ACC_YEAR"]+"-"+data["ACC_STARTTIME"],data["ACC_YEAR"]+"-"+data["ACC_ENDTIME"],data["ACC_ID"]);
			initBootstrapTable(dev_outsource+"sOrder/queryOrderDetail.asp?SID="+SID+"&call=jq_1520826055810update&acc_id="+data["ACC_ID"],"jq_1520826055810update");
		}else{
			getCurrentPageObj().find("#acc_name").prop({readonly:true});
			getCurrentPageObj().find("#bookInfo_add").hide();
			getCurrentPageObj().find("#save").hide();
			getCurrentPageObj().find("#save_submit").hide();
			getCurrentPageObj().find("#acc_code_show").text(data["ACC_CODE"]);
			getCurrentPageObj().find("#acc_money_show").text(data["ACC_MONEY"]);
			$.each(data,function(k,v){
				getCurrentPageObj().find("#"+k.toLowerCase()).val(v);
			});
			initUpdateEvent(data["ACC_QUARTER"],data["CONTRACT_CODE"]);
			orderPersonPop.initQueryData(data["SUP_NUM"],data["CONTRACT_CODE"],data["ACC_YEAR"]+"-"+data["ACC_STARTTIME"],data["ACC_YEAR"]+"-"+data["ACC_ENDTIME"]);
			initBootstrapTable(dev_outsource+"sOrder/queryOrderDetail.asp?SID="+SID+"&call=jq_1520826055810update&acc_id="+data["ACC_ID"],"jq_1520826055810update");
		}
	};
})(getCurrentPageObj()[0].serviceOrder={});
/**
 * 计算总金额
 */
function computerSumMonn(){
	var data=getCurrentPageObj().find("#assInfo_table").bootstrapTable("getData");
	var sum=0;
	if(data&&data.length>0){
		for(var i=0;i<data.length;i++){
			sum+=parseFloat(((data[i].PERSON_DAY||0)*(data[i].P_PRICE_TAX||0)/22).toFixed(2));
		}
	}
	sum=sum.toFixed(2);
	getCurrentPageObj().find("#acc_money_show").text(sum);
	getCurrentPageObj().find("#acc_money").val(sum);
}

/**
 * 删除
 * @param user_code
 */
function removeOneUser(op_code){
	getCurrentPageObj().find("#assInfo_table").bootstrapTable("remove",{field:"OP_CODE",values:[op_code]});
	computerSumMonn();
}

/**
 * 保存和提交按钮事件初始化
 */
(function(){
	function getOrderInfo(){
		var param='';
			param+='orderInfo["acc_id"]='+(getCurrentPageObj().find("#acc_id").val()||"");
			param+='&orderInfo["acc_code"]='+(getCurrentPageObj().find("#acc_code").val()||"");
			param+='&orderInfo["acc_name"]='+(getCurrentPageObj().find("#acc_name").val()||"");
			param+='&orderInfo["acc_state"]='+(getCurrentPageObj().find("#acc_state").val()||"");
			param+='&orderInfo["supplier_id"]='+(getCurrentPageObj().find("#suplier_id").val()||"");
			param+='&orderInfo["contract_code"]='+(getCurrentPageObj().find("#contract_code").val()||"");
			param+='&orderInfo["acc_year"]='+(getCurrentPageObj().find("#acc_year").val()||"");
			param+='&orderInfo["acc_quarter"]='+(getCurrentPageObj().find("#acc_quarter").val()||"");
			param+='&orderInfo["acc_starttime"]='+(getCurrentPageObj().find("#acc_starttime").val()||"");
			param+='&orderInfo["acc_endtime"]='+(getCurrentPageObj().find("#acc_endtime").val()||"");
			param+='&orderInfo["acc_money"]='+(getCurrentPageObj().find("#acc_money").val()||"");
		return param;
	}
	function getOrderDetailInfo(){
		var data=getCurrentPageObj().find("#assInfo_table").bootstrapTable("getData");
		if(data&&data.length>0){
			var param='';
			for(var i=0;i<data.length;i++){
				param+='&orderDetailInfo["'+i+'"]["ad_id"]='+(data[i]["AD_ID"]||"");
				param+='&orderDetailInfo["'+i+'"]["acc_id"]='+(data[i]["ACC_ID"]||"");
				param+='&orderDetailInfo["'+i+'"]["outsource_id"]='+(data[i]["OP_CODE"]||"");
				param+='&orderDetailInfo["'+i+'"]["outsource_type"]='+(data[i]["GRADE_NAME"]||"");
				param+='&orderDetailInfo["'+i+'"]["outsource_level"]='+(data[i]["LEVEL_NAME"]||"");
				param+='&orderDetailInfo["'+i+'"]["outsource_price"]='+(data[i]["P_PRICE_TAX"]||"0");
				param+='&orderDetailInfo["'+i+'"]["attendance_day"]='+(data[i]["PERSON_DAY"]||"0");
				param+='&orderDetailInfo["'+i+'"]["ad_money"]='+((data[i].PERSON_DAY||0)*(data[i].P_PRICE_TAX||0)/22).toFixed(2);
			}
			return param;
		}
		return "";
	}
	function saveSubmit(msg){
		if(!vlidate(getCurrentPageObj().find("#base_table"),"",true)){
			return;
		}
		nconfirm("确定要"+msg+"该核算单数据?",function(){
			baseAjaxProxyOutSource("sOrder/submitOrderInfo.asp",getOrderInfo()+getOrderDetailInfo(),function(data){
				if(data&&data.result=="true"){
					alert(msg+"成功!");
					closeCurrPageTab();
				}else{
					alert(msg+"失败!"+(data.msg||""));
				}
			});
		});
	}
	getCurrentPageObj().find("#save").unbind("click").click(function(){
		getCurrentPageObj().find("#acc_state").val("00");
		saveSubmit("保存");
	});
	getCurrentPageObj().find("#save_submit").unbind("click").click(function(){
		getCurrentPageObj().find("#acc_state").val("01");
		saveSubmit("生成");
	});
})();
/**
 * 初始化必填项
 */
$(document).ready(function(){
	initVlidate(getCurrentPageObj().find("#base_table"));
});








