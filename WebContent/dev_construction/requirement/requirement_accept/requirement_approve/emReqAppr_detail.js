
var currTab=getCurrentPageObj();
var tableCall = getMillisecond();
function initEmReqDetailLayout(ids){
	var emreqdetailCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_input/queryEmRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+emreqdetailCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
	     if(k=="req_id"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else if(k=="affect_other_system"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='affect_other_system_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='affect_other_system_describe']").attr("validate","v.required");
	    	 }
	    	
	     }
	     else  if(k=="affect_other_system_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="change_system_fuction"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='change_system_fuction_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='change_system_fuction_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="change_system_fuction_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="change_data_structure"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='change_data_structure_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='change_data_structure_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="change_data_structure_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="update_system_file"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='update_system_file_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='update_system_file_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="update_system_file_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="emreq_solution"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="emreq_test_suggest"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else{
			currTab.find("div[name='" + k + "']").text(str);
			}
		}
		//初始化审批视图
		initTitle(data["INSTANCE_ID"]);
		initEmReqApprovalDetailInfo(data["INSTANCE_ID"]);
		//初始化附件列表
		initVlidate($("#emReqAppr_analysisForm"));
		var tablefile = getCurrentPageObj().find("#emReqAppr_filetable");
		
		getSvnFileList(tablefile, getCurrentPageObj().find("#emreqAppr_fileview_modal"), data.FILE_ID, "0101");
	},emreqdetailCall);
}
function initEmcontentPop(){
	getCurrentPageObj().find('#apphistoryPop').empty();
	getCurrentPageObj().find('#apphistoryPop').append(
		'<div class="ecitic-title">'+
			'<span>流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="EmAFApprovalTableInfo" class="table table-bordered table-hover table-text-show"></table>'+
		'</div>'		
	);

}
/*审批列表表格初始化列表*/
function initEmReqApprovalDetailInfo(instance_id) {
	this.instance_id=instance_id;
	initEmcontentPop();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find('#EmAFApprovalTableInfo').bootstrapTable({
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
			setRowspan("EmAFApprovalTableInfo");
			gaveInfo();
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
			align : "center",
			width : "30px"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
        	  if(row.STATE_NAME){
        		  return row.STATE_NAME;
        	  } 
        	  return '--';
          },
			
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
