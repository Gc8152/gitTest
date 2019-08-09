

autoInitRadio({dic_code:"G_DIC_REQ_FEASIBILITY"},getCurrentPageObj().find("#APR_acc_feasibility"),"APR.req_feasibility_result",{labClass:"ecitic-radio-inline",value:"01"});

//初始化页面信息
function initReqAprDetailLayOut(ids,instance_id){
	var reqAprDetailCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqById.asp?SID="+SID+"&req_id="+ids+"&call="+reqAprDetailCall, null , function(data) {
			for ( var f in data) {
				var map=data[f];
				   if(f=="1"||f=="2"){
				     for(var k in map){
						var str=map[k];
						k = k.toLowerCase();//大写转换为小写
				    if(k=="req_datatable_flag"||k=="req_level"||k=="req_income_flag"||k=="req_dis_result"||k=="req_acc_result"){
				    	getCurrentPageObj().find("input[name='APR."+k+"']"+"[value="+str+"]").attr("checked",true);
				    }else if(k=="req_id"){
				    	getCurrentPageObj().find('#req_id_reqAPR').val(str);
				    }else if(k=="file_id"){
				    	getCurrentPageObj().find('#file_id_reqAPR').val(str);
				    }else if(k=="file_id_assess"){
				    	getCurrentPageObj().find('#file_id_reqAssAPR').val(str);
					}else if(k=="req_assess_level"){
						var num=str.split(",");
						for(var i=0;i<num.length;i++){
							$("input[name='APR."+k+"']"+"[value="+num[i]+"]").attr("checked",true);
							}
					}else if(k=="req_type1"){
							if(str=='02'){
								getCurrentPageObj().find('#business_org_hide').hide();
								getCurrentPageObj().find('#APRproject_id_display').hide();
							}
				   }else{
					  $("span[name='APR."+k+"']").text(str);
					}
				   }
				  }
				   if(f==1){
					 //初始化流程数据
						initTitle(map["INSTANCE_ID"]);
						initReqApprovalDetailInfo(instance_id,'0');
				   }
			    }
			initReqApproveCss();//收益估算样式初始化
			initReqDetailFileList(data[1]["REQ_STATE"]);//初始化文件列表
			initReqApprovePlanList();//实施计划初始化
		},reqAprDetailCall);
	
}

//初始化需求收益估算样式
function initReqApproveCss(){
	var req_income_flag=getCurrentPageObj().find('input:radio[name="APR.req_income_flag"]:checked').val();
	if(req_income_flag=="01"){//收益评估为否时隐藏收益估算和理由
		getCurrentPageObj().find('#req_income_hide').hide();
		getCurrentPageObj().find('#req_income_APR').hide();
		getCurrentPageObj().find('#remark_apr').hide();
		getCurrentPageObj().find('#req_income_doc_reqAPR').parent().parent().hide();
	}
}

//初始化附件列表
function initReqDetailFileList(req_state){
 if(parseInt(req_state)>=9){
	//初始化需求信息附件列表
	var file_id = getCurrentPageObj().find("#req_code_reqAPR").text();
	var tablefile = getCurrentPageObj().find("#reqAPR_tablefile");
	getSvnFileList(tablefile,getCurrentPageObj().find("#reqAPR_fileview_modal"),file_id,"0101",function(){
		getAss_tablefile(tablefile,file_id);
	});	
	//初始化需求工作量评估信息附件列表
	/*var ass_tablefile = getCurrentPageObj().find("#reqAssAPR_tablefile");
	getSvnFileList(ass_tablefile,getCurrentPageObj().find("#reqAprAss_fileview_modal"),file_id,"0102"); */
 }else{
   //初始化需求信息附件列表
    var file_id = getCurrentPageObj().find("#file_id_reqAPR").val();
    var tablefile = getCurrentPageObj().find("#reqAPR_tablefile");
    var ass_file_id = getCurrentPageObj().find("#file_id_reqAssAPR").val();
    getSvnFileList(tablefile,getCurrentPageObj().find("#reqAPR_fileview_modal"),file_id,"0101",function(){
    	getAss_tablefile(tablefile,ass_file_id);
    });	
    //初始化需求工作量评估信息附件列表
    /*var ass_file_id = getCurrentPageObj().find("#file_id_reqAssAPR").val();
    var ass_tablefile = getCurrentPageObj().find("#reqAssAPR_tablefile");
    getSvnFileList(ass_tablefile,getCurrentPageObj().find("#reqAprAss_fileview_modal"),ass_file_id,"0102");*/
 }
}

function getAss_tablefile(tablefile,business_code){
	baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:business_code, phase:'0102'},function(data){
		tablefile.bootstrapTable("append",data);
	},false);
}


//初始化实施计划列表
function initReqApprovePlanList(){
	var req_id=getCurrentPageObj().find('#req_id_reqAPR').val();
	if(req_id==null||req_id==""){
		alert('实施计划获取需求id失败');
		return;
		
	}
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqPlanCall = getMillisecond();
	$('#gReqPlanTable').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"requirement_accept/queryReqPlanList.asp?SID="+SID+"&req_id="+req_id+"&call="+reqPlanCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_PLAN_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqPlanCall,
				singleSelect : true,// 复选框单选
				columns : [{
					field : 'REQ_PLAN_ID',
					title : '计划id',
					align : "center",
					visible:false,
				},{
					field : 'REQ_PLAN_NAME',
					title : '计划名称',
					align : "center",
				},{
					field : 'PLAN_STARTTIME',
					title : '计划开始时间',
					align : "center",
				}, {
					field : 'PLAN_ENDTIME',
					title : '计划结束时间',
					align : "center"
				}, {
					field : "PLAN_CONTENT",
					title : "备注",
					align : "center"
				}]
			});
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
			'<table id="AFApprovalTableInfo" class="table table-bordered table-hover table-text-show"></table>'+
		'</div>'		
	);

}
/*审批列表表格初始化列表*/
function initReqApprovalDetailInfo(instance_id) {
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

