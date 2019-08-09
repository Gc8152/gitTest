
//初始化附件列表
function initReqDetailFileList(){
 
 var file_id = getCurrentPageObj().find("#file_id_reqRD").val();
 var tablefile = getCurrentPageObj().find("#reqRD_tablefile");
//初始化附件列表
 getSvnFileList(tablefile,getCurrentPageObj().find("#reqRD_fileview_modal"),file_id);	
	
}
//初始化需求收益估算和理由样式
function initReqDetailIncomeCss(){
	var req_income_flag=$('input:radio[name="RD.req_income_flag"]:checked').val();
	if(req_income_flag=='01'){//当需求收益为否时隐藏需求收益估算和理由
		$('#req_income_reqRD').parent().hide();
		$('#req_income_RD').parent().hide();
		$('#req_income_doc_reqRD').parent().parent().hide();
		$('#req_detail_remark').hide();
	}	
	initReqDetailFileList();//初始化附件列表
}
var tableCall = getMillisecond();
//流程实例id
var instance_id="";
function initcontentPop(){
	getCurrentPageObj().find('#apphistoryPop').empty();
	getCurrentPageObj().find('#apphistoryPop').append(
		'<div class="ecitic-title">'+
			'<span>流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="AFApprovalTableInfo" class="table table-bordered table-hover"></table>'+
		'</div>'		
	);

}
/*审批列表表格初始化列表*/
function initReqInputAFApprovalDetailInfo(instance_id) {
	this.instance_id=instance_id;
	initcontentPop();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable({
		url :'AFLaunch/queryAFApprovalLists.asp?instance_id='+instance_id+"&call="+tableCall,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("AFApprovalTableInfo");
		},
		columns : [{
			field : 'N_ID',
			title : '审批节点id',
			align : "center",
			visible:false
		},{
			field : 'N_NAME',
			title : '审批岗位',
			align : "center",
			valign: "middle"
		}, {
			field : "APP_PERSON",
			title : "工号",
			align : "center",
			visible:false
		}, {
			field : "APP_PERSON_NAME",
			title : "审批人",
			align : "center"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
      	  if(row.STATE_NAME){
      		  return row.STATE_NAME;
      	  } 
      	  return '--';
        }
		}, {
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
}
//合并单元格
function setRowspan(id){
	var tabledata=getCurrentPageObj().find('#'+id).bootstrapTable('getData');
	var n_name = tabledata[0].N_NAME;
	var j=0;
	var k=1;
	for(var i=1;i<tabledata.length;i++){
		if(n_name!=tabledata[i].N_NAME){
			getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
			j=i;
			k=1;
			n_name=tabledata[i].N_NAME;
		}else{
			k++;
		}
	}
	getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
}
function reqInputApproveOver(req_id,req_state){
	baseAjaxJsonp(dev_construction+"requirement_input/submitToAccept.asp?SID="+SID+"&req_id="+req_id+"&req_state="+req_state, null , function(data) {
		if(data!=null&&data!=""&&data.result=="true"){
			alert("提交成功!");
		}else{
			var mess=data.mess;
			alert("提交失败！"+""+mess);
		}
		});
}

