function personnelManage(selRow){
	var $page = getCurrentPageObj();  //获取当前页面对象
	var PROJECT_ID = selRow.PROJECT_ID;
	var PROJECT_NUM = selRow.PROJECT_NUM;
	//项目组成员列表显示
	var table=$page.find("#manTable");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var flag = true;
	var personCall = getMillisecond();//用于项目组成员列表的刷新
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'projectman/queryManList.asp?call='+personCall+'&SID='+SID+'&PROJECT_ID='+PROJECT_ID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "USER_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback : personCall,
		singleSelect : false,
		onDblClickRow:function(row){
		},
		onPreBody : function(data){
			if(data.length!=0){
				if(flag){
					for(var i=0;i<data.length;i++){
						if(data[i].TYPE == '01'){
							$page.find("input[name='INIT_PROJECT']").val(data[i].USER_ID);
						}
						if(data[i].TYPE == '02'){
							$page.find("input[name='INIT_TEST']").val(data[i].USER_ID);
						}
					}
					if(SID == $page.find("input[name='INIT_PROJECT']").val() && SID == $page.find("input[name='INIT_TEST']").val()){
						$page.find("input[name='CURR_ROLE']").val("ALL");
					}else if(SID == $page.find("input[name='INIT_PROJECT']").val()){
						$page.find("input[name='CURR_ROLE']").val("PRO");
						$page.find("#addTestMan").css("display","none");
					}else{
						$page.find("input[name='CURR_ROLE']").val("TES");
						$page.find("#addTestMan").css("display","none");
					}
					flag = false;
				}
			}
		},
		onLoadSuccess : function(){
			gaveInfo();
		},
		columns : [ 
		   /*{	
			   	field : "TYPE",
				align : 'center',
				valign : 'middle',
				formatter: function (value, row, index) {
					var result = '';
					var currRole = $page.find("input[name='CURR_ROLE']").val();
 					if (value == '00') {
 						if(currRole == 'ALL' || (currRole == 'PRO' && row.PROJECT_ROLE=='00') || (currRole == 'TES' && row.PROJECT_ROLE=='01') ){
 							result = "<input type='checkbox' name='proman_info' value='"+row.USER_ID+"'/>";
 						}
 					}
 					return result;
				}
				
		   },*/ {
			field : "PROJECT_ROLE",
			title : "角色",
			align : "center",
			width : "15%",
			formatter: function (value, row, index) {
				var result = value;
				if (row.TYPE== '00') {
					if(row.PROJECT_ROLE == '00'){
						result = "开发人员";
					}else{
						result = "测试人员";
					}
				}
				return result;
			}
		}, {
			field : "USER_ID",
			title : "人员编号",
			align : "center",
			width : "15%"
		}, {
			field : "USER_NAME",
			title : "人员姓名",
			align : "center",
			width : "15%"
		}, {
			field : "LOGIN_NAME",
			title : "登录名",
			align : "center",
			width : "15%"
		}, {
			field : "IS_BANKER",
			title : '是否行员',
			align : "center",
			width : "15%",
			formatter: function (value, row, index) {
				var isBanker = row.IS_BANKER;
				if (isBanker == '00') {
					isBanker = "是";
				}else if(isBanker == '01') {
					isBanker = "否";
				}else{
					isBanker = '';
				}
				return isBanker;
			}
		}, {
			field : "",
			title : "查看",
			align : "center",
			sortable: true,
			width : "15%",
			formatter: function (value, row, index) {
				var result = '';
				if (row.TYPE == '03') {
					result = "<a style='color:blue'  href='javascript:void(0)' onclick=\"viewDetail(\'"+row.USER_ID+"\',\'"+row.TYPE+"\')\">需求任务清单</a>";
				}
				if (row.TYPE == '04') {
					result = "<a style='color:blue'  href='javascript:void(0)' onclick=\"viewDetail(\'"+row.USER_ID+"\',\'"+row.TYPE+"\')\">SIT测试任务清单</a>";
				}
				return result;
			}
		}, {
			field :"TYPE",
			title :"操作",
			align : "center",
			width : "10%",
			formatter: function (value, row, index) {
				var result = '';
				var currRole = $page.find("input[name='CURR_ROLE']").val();
					if (value == '00') {
						if(currRole == 'ALL' || (currRole == 'PRO' && row.PROJECT_ROLE=='00') || (currRole == 'TES' && row.PROJECT_ROLE=='01') ){
							//result = "<a name='proman_info' onclick='deleteMan("+row.USER_ID+"')>";
							result = "<a style='color:blue'  href='javascript:void(0)' onclick=deleteMan('"+row.USER_ID+"')>删除</a>";
						}
					}
					return result;
			}
		}]
	});
	
	
	//添加开发人员
	$page.find("#addDevMan").click(function(){
		var $promanPop = $page.find("[mod='promanPop']");
		promanPop($promanPop, $page.find("#manTable"),"dev",PROJECT_NUM);
	});
	//添加测试人员
	/*$page.find("#addTestMan").click(function(){
		var $promanPop = $page.find("[mod='promanPop']");
		promanPop($promanPop, $page.find("#manTable"),"test");
	});*/

	//删除人员
	/*$page.find("#deleteMan").click(function(){
		var getCheck = getCurrentPageObj().find('input[name="proman_info"]:checked');
		if(getCheck.length == 0){
			alert("请选择要删除的人员");
			return;
		};
		getCheck.each(function(){ 
			table.bootstrapTable('removeByUniqueId',$(this).val());
		});
	});*/
	
	//保存人员数据
	$page.find("#projectMan_save").click(function(){
		var params = {};
		params["PROJECT_ID"] = PROJECT_ID;
		var saveDate = table.bootstrapTable('getData');
		var userArr = new Array();
		for ( var k in saveDate){
			if(saveDate[k].TYPE=='00'){
				userArr.push({"USER_ID":saveDate[k].USER_ID,"PROJECT_ROLE":saveDate[k].PROJECT_ROLE});
			}
			
		}
		params["USER_ARR"] = JSON.stringify(userArr);
		var addAll=getMillisecond();
		baseAjaxJsonp(dev_project+"projectman/saveManInfo.asp?call="+addAll+"&SID="+SID, params, function(data){
			if (data!=undefined&&data!=null&&data.result=="true") {
				alert("保存成功");
				closeCurrPageTab();
			}else {
				alert("保存失败");
			}
		},addAll);
	});
}

//删除人员
function deleteMan(user_id){
	var table = getCurrentPageObj().find("#manTable");
	table.bootstrapTable('removeByUniqueId',user_id);
}

function viewDetail(USER_ID,TYPE){
	
	var $viewDetailPop = getCurrentPageObj().find("[mod='viewDetailPop']");
	vdPop($viewDetailPop,USER_ID,TYPE);

}
