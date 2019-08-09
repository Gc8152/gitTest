//页面赋值
var calls = getMillisecond();
function optCheck_detail(param){
	baseAjaxJsonp(dev_outsource+'OptCheck/findOptCheckDetail.asp?&check_id='+param+"&SID="+SID+"&call="+calls,null,function(msg){
		if(msg){
			for(var k in msg.optCheck){
				var moon = k.toLowerCase();
				getCurrentPageObj().find("#OCD_"+moon).val(msg.optCheck[k]);
				if(moon=="op_specialtype"){
					initSelect(getCurrentPageObj().find("#op_specialtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"},msg.optCheck[k]); 
				}
			}
			initBankInfoDe(msg.optCheck["OP_CODE"]);
			tableEventDe(msg.optCheck["CHECK_ID"],msg.optCheck["CHESCORE"]);
		}
	},calls);
}
//回显行内信息
function initBankInfoDe(op_code){
	baseAjaxJsonp(dev_outsource+"OptCheck/queryOneCheckBankInfo.asp?op_code="+op_code+"&SID="+SID+"&call="+calls,null,function(data){
		if(data){
			var BankInfoMap = data["BankInfoMap"];
			for(var p in BankInfoMap){
					var projectKey = p.toLowerCase();
					if(projectKey=="purch_type_name"){
						getCurrentPageObj().find("#purch_type_name").text(BankInfoMap[p]);
					}
					getCurrentPageObj().find("#OCD_"+projectKey).text(BankInfoMap[p]);
			}
		}
	},calls);
	
}
function tableEventDe(check_id,scr){
	var calls1 = getMillisecond()+1;
	$("#det_optTemplateDetailTable").bootstrapTable({
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
		detailView : false, //是否显示父子表.
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
				return 	"<a style='color : blue' href='javascript:void(0)' onclick='openCheckItemPop(\"checkItemDetailD\",\""+row.ID+"\",\""+row.ITEMNAME+"\",\""+row.DETAIL+"\");'>"+value+"</a>";
			}
		}, {
			field : "DETAIL",
			title : "考核项分值",
			align : "center",
		},{
			field : "CHECK_SCORE",
			title : "考核得分",
			align : "center"
		},{
			field : "CHECK_MEMO",
			title : "备注",
			align : "center",
		}]
	});
}
