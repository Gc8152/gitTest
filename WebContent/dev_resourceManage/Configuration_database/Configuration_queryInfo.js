//初始化列表
var changeCalls = getMillisecond()+'1';
function initTableInfo(item) {
	var CONFIG_ID=item;
	var currTab = getCurrentPageObj();
	var url=dev_resource+'ConfigApply/queryConfigInfo.asp?call='+changeCalls+'&SID='+SID+'&CONFIG_ID='+CONFIG_ID;
	baseAjaxJsonp(url,null,function(data){
		var r=data.rows[0];
		//console.log(r);
		for(var k in r){
		getCurrentPageObj().find("input[name='C."+ k +"']").val(r[k]);
		getCurrentPageObj().find("textarea[name='C."+ k +"']").val(r[k]);
		}
	},changeCalls);
	
	//
	var changeCall = getMillisecond();
	
	getCurrentPageObj().find('#user_table').bootstrapTable({
		url : dev_resource+"ConfigApply/queryDevInfo.asp?SID="+SID+'&call='+changeCall+'&CONFIG_ID='+CONFIG_ID,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : false, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "USER_NO", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		jsonpCallback:changeCall,
		singleSelect : true,// 复选框单选
		
		columns :[ {
			checkbox:true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},
		{
			field : 'USER_NO',
			title : '用户编号',
			align : "center",
			 width:"10%"
		}, {
			field : "USER_NAME",
			title : "用户名称",
			align : "center"
		}, {
			field : "LOGIN_NAME",
			title : "登陆名",
			align : "center"
		},{
			field : "ROLE_NAME",
			title : "角色岗位",
			align : "center"
		}, {
			field : "ROLE_NO",
			title : "角色",
			align : "center",
			visible : false
		}, {
			field : "DID",
			title : "操作",
			align : "center",
			formatter: function (value, row, index) {
				return '<span >-</span>';
			}
	        }]
	});
	initTableNext(item);
};

function initTableNext(item){
	var CONFIG_ID=item;
	var changeCall = getMillisecond()+'2';
	var dev_flag="02";
	var currTab = getCurrentPageObj();
	var url=dev_resource+'ConfigApply/queryConfigInfo.asp?call='+changeCall+'&SID='+SID+'&CONFIG_ID='+CONFIG_ID;
	baseAjaxJsonp(url,null,function(data){
		var r=data.rows[0];
		var project_man_id=r.PROJECT_MAN_ID;
		var skill_man_id=r.SKILL_MAN_ID;
		baseAjaxJsonp(dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall+"&dev_flag="+dev_flag +"&PROJECT_MAN_ID="+project_man_id+"&SKILL_MAN_ID="+skill_man_id,null, function(data) {
			if(data.rows1.length!=0){
				$('#user_table').bootstrapTable("prepend",data.rows1[0]);
			}
			if(data.rows2.length!=0){
				$('#user_table').bootstrapTable("prepend",data.rows2[0]);
			}
		},changeCall);
	},changeCall);
	
};
