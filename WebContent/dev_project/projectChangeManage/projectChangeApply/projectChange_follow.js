function initfollow_proChange(data){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	autoInitSelect(currTab.find("#table_follow"));
	//上传
	currTab.find("#file_Add").unbind("click");
	currTab.find("#file_Add").click(function(){
		currTab.find("#file_follow_import").val("");
		currTab.find("#file_follow_import_id").val("");
		currTab.find("#modal_follow_import").modal("show");
	});
	currTab.find("#import_follow_button").unbind("click");
	currTab.find("#import_follow_button").click(function(){
		startLoading();
	    $.ajaxFileUpload({
		    url:dev_construction+'UatReport/importBugInfo.asp?SID='+SID,
		    type:"post",
			secureuri:false,					 //是否启用安全提交，默认为false。 
			fileElementId:'file_follow_import',  //需要上传的文件域的ID，即<input type="file">的ID。
			data:'',
			dataType: 'json',
			success:function (data){
				endLoading();
				currTab.find("#file_follow_import").val("");
				currTab.find("#modal_follow_import").modal("hide");
				if(data&&data.result=="true"){
					alert("导入成功");
				}else if(data&&data.error_info){
					//alert("导入失败:"+data.error_info);
				}else{	
					//alert("导入失败！");
				}
			},
			error: function (data){
				endLoading();
				currTab.find("#modal_follow_import").modal("hide");
				//alert("导入失败！");
			}
	   });
	});
	//返回
	var back = currTab.find("#back");
	back.click(function(){
		closeCurrPageTab();
	});
	//提交
	var submit=currTab.find("#summit_followingInfo");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		var param = {};
		param["CHANGE_EXPLAIN"]=currTab.find("textarea[name='CHANGE_EXPLAIN']").val();
		param["QUESTION_TYPE"]=currTab.find("select[name='QUESTION_TYPE']").val();
		param["CLOSE_DATE"]=currTab.find("input[name='CLOSE_DATE']").val();
		param["CHANGE_ID"] = data.CHANGE_ID;
		param["OPERATE_NAME"]=data.PRESENT_USER_NAME;
		param["INFO_FILE"]=currTab.find("#leaveInfo_file").val();
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"proChange/insertProChangeFollow.asp?call="+call+"&SID="+SID,param,function(data){
			if (data != undefined && data != null) {
				if(data.result=="true"){
					alert(data.msg);
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);
	});
	//初始化table
	var follow_histroy=currTab.find("#follow_histroy");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var tableCall = getMillisecond();
	follow_histroy.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'proChange/queryListProChangeFollow.asp?call='+tableCall+'&SID='+SID+'&CHANGE_ID='+data.CHANGE_ID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "CHANGE_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			/*sortable: true,*/
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'CLOSE_DATE',
			title : '日期',
			align : "center"
		}, {
			field : "OPERATE_NAME",
			title : "操作人",
			align : "center"
		}, {
			field : "QUESTION_TYPE",
			title : "操作",
			align : "center",
			formatter : function(value, row, index){
				var a=row.QUESTION_TYPE;
				if (a=='00') {
					return '跟踪';
				}else if(a=='01'){
					return  '受理';
				}else{
					return '-';
				}
			}
		}, {
			field : "CHANGE_EXPLAIN",
			title : "跟踪情况说明",
			align : "center"
		}, {
			field : "QUESTION_TYPE_NAME",
			title : "问题状态",
			align : "center"
		}, {
			field : "INFO_FILE",
			title : "附件",
			align : "center"
		}]
	});
}
initVlidate($("#change_follow"));