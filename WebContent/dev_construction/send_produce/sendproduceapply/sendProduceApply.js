/**
 * 获取时间戳
 */
var getcall=getMillisecond()+'1';

/**
 * 组装查询url 
 * @returns {String}
 */
function sendProduceUrl(){
	var url = dev_construction+'sendProduceApply/querySendProInfo.asp?call='+getcall+'&SID='+SID;
	var queryCondition = getCurrentPageObj().find("#querysendCondition [name]");
	for(var i=0; i<queryCondition.length; i++){
		var obj=$(queryCondition[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

(function() {
	var queryParams =function(params){
		var temp = {};//getApplyQueryParam();
		temp["limit"]=params.limit;
		temp["offset"]=params.offset;
		return temp;
	};
	getCurrentPageObj().find("#sendProduceApplyTab").bootstrapTable({
		url : dev_construction+'sendProduceApply/querySendProInfo.asp?call='+getcall+'&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback: getcall,
		onLoadSuccess:function(data){
			gaveInfo();
			getCurrentPageObj().find("#sendProduceApply").text("发起投产");
		},
		onCheck:function(selection){
			if(selection["VERSIONS_TYPE"]=='15'){
				getCurrentPageObj().find("#sendProduceApply").text("发起紧急投产");
			}else{
				getCurrentPageObj().find("#sendProduceApply").text("发起一般投产");
			}
		},
		onUncheck:function(selection){
			getCurrentPageObj().find("#sendProduceApply").text("发起投产");
		},
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center",
			width :"130"
		},{
			field : 'PROJECT_MAN_NAME',
			title : '应用负责人',
			align : "center",
			width :"180"
		},{
			field : 'RES_GROUP_NAME',
			title : '负责组',
			align : "center",
			width :"180"
		},{
			field : 'VERSIONS_NAME',
			title : '版本名称',
			align : "center",
			width :"180"
		}]
	});
})();

//初始化页面按钮事件
(function() {
	
	var currTab=getCurrentPageObj();
	//重置按钮
	currTab.find("#resetParam").unbind("click").click(function(){
		getCurrentPageObj().find("#ecitic-table input").val("");
	});
	//查询按钮
	currTab.find("#queryParam").unbind("click").click(function(){
		getCurrentPageObj().find("#sendProduceApplyTab").bootstrapTable("refresh",{url:sendProduceUrl()});
	});
	//发起投产
	currTab.find("#sendProduceApply").unbind("click").click(function(){
		var selections = currTab.find("#sendProduceApplyTab").bootstrapTable('getSelections');
		if(selections.length <1) {
			alert("请至少选择一条数据!");
			return;
		}
		if(selections[0]["VERSIONS_TYPE"]=='15'){
			//发起紧急投产
			closeAndOpenInnerPageTab("sendProduceInstancy_add","发起紧急投产","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_add.html",function(){
				sendInstancyApply(selections[0]);
				
			});
		}else{
			//发起一般投产
			 closeAndOpenInnerPageTab("sendProduceApply_add","发起投产审计","dev_construction/send_produce/sendproduceapply/sendProduceApply_add.html",function(){
			     sendApply(selections[0]);
		      });
		}
	});
})();

