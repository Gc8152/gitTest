//var SID=window.parent.SID;
function getCurrentPageObj(){
	return jQuery;
}
var SID = "";
function getParamString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	}
$(document).ready(function(){
//	 var call = getMillisecond();
	 SID=getParamString("SID");
	 baseAjaxJsonpNoCall(dev_outsource+'outperson/queryOneOutPersonRankInfo.asp',{id:getParamString("id"),flowid:getParamString("flowid")},function(data){
		if(data){
			var rows=data.rows[0];
			$("#apply_group").html(rows.APPLY_GROUP);
			$("#opt_manager").html(rows.OPT_MANAGER);
			$("#apply_reason").html(rows.APPLY_REASON);
			$("#apply_time").html("时间："+rows.RANK_APPLY_TIME);
			var flowInfo=data.flowList;
/*			$("#project_manager").html("项目经理:");
			$("#science_leader").html("科技职能组长意见:");
			$("#business_leader").html("业务职能组长意见:");
			$("#science_two").html("科技二级部领导意见:");
			$("#business_two").html("业务二级部领导意见:");
			$("#science_one").html("科技一级部领导意见:");
			$("#business_one").html("业务一级部领导意见:");*/
			$("#out_manager").html("外包管理岗意见:");
			$("#pro_leader").html("项目组长意见:");
			$("#center_leader").html("中心负责人意见:");
			for(var i=0;i<flowInfo.length;i++){
				var nodename=flowInfo[i].N_NAME;
				var opinion=flowInfo[i].APP_CONTENT;
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="外包人员管理"){
					$("#out_manager").append(opinion);
				}
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="项目组长"){
					$("#pro_leader").append(opinion);
				}
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="中心负责人"){
					$("#center_leader").append(opinion);
				}
			}
/*			for(var i=0;i<flowInfo.length;i++){
				var nodename=flowInfo[i].NODENAME;
				var operateopinion=flowInfo[i].OPERATEOPINION;
				var opinion=nodename+":"+operateopinion;
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="项目经理"){
					$("#project_manager").html(opinion);
				}
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="科技职能组长意见"){
					$("#science_leader").html(opinion);
				}
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="业务职能组长意见"){
					$("#business_leader").html(opinion);
				}
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="科技二级部领导意见"){
					$("#science_two").html(opinion);
				}
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="业务二级部领导意见"){
					$("#business_two").html(opinion);
				}
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="科技一级部领导意见"){
					$("#science_one").html(opinion);
				}
				if(nodename!=undefined&&nodename!=null&&nodename!=""&&nodename=="业务一级部领导意见"){
					$("#business_one").html(opinion);
				}
				
			}*/
		}
	});
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
//	var call = getMillisecond();
	 baseAjaxJsonpNoCall(dev_outsource+'outperson/queryRankPersonPrint.asp',{id:getParamString("id")},function(data){
			if(data){
				for(var i=0;i<data.rows.length;i++){
					var tr='<tr class="personInfo">';
					tr+='<td>'+data.rows[i]["OP_NAME"]+'</td>';
					tr+='<td>'+data.rows[i]["LEVEL_NAME"]+'</td>';
					tr+='<td>'+data.rows[i]["ORIGINAL_GRADE"]+'</td>';
					tr+='<td>'+data.rows[i]["GRADE_NAME"]+'</td>';
					tr+='<td>'+data.rows[i]["OP_COMPANY"]+'</td>';
					tr+='<td>'+data.rows[i]["EVALUATE_DATE"]+'</td>';
					tr+='</tr>';
					$("#rankPersonList").after(tr);
				}
			}
		});	
/*	$("#rankUpGradePrintTable").bootstrapTable("destroy").bootstrapTable({
		url : dev_outsource+'outperson/queryRankPersonPrint.asp?id='+getParamString("id")+'&call='+call+'&SID='+SID,//请求后台的URL（*）
		method : 'post', //请求方式（*）   
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
		uniqueId : "CHANGE_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: false,
		jsonpCallback:call,
		columns : [ {
			field : "OP_NAME",
			title : "姓名",
			align : "center"
		},{
			field : "OWN_PROJECT",
			title : "所在项目",
			align : "center"
		},{
			field : "CHECK_SCORE",
			title : "考核分数",
			align : "center",
			visible:false
		},{
			field : "LEVEL_NAME",
			title : "开发方向",
			align : "center"
		},{
			field : "ORIGINAL_GRADE",
			title : "原有级别",
			align : "center"
		},{
			field : "GRADE_NAME",
			title : "申请级别",
			align : "center"
		},{
			field : "OP_COMPANY",
			title : "公司名称",
			align : "center"
		},{
			field : "EVALUATE_DATE",
			title : "评定日期",
			align : "center"
		},{
			field : "EVALUATE_DATE",
			title : "人员情况说明文档",
			align : "center"
		}]
	});*/
});