
$(function(){
	initLayout();
	getServerInfo();
	
	function initLayout(){
		$("#serverTypeDbRow1").hide(clearDbField());
		$("#serverTypeDbRow2").hide();
		//下拉菜单select2
		$("select").select2();
		$("#serverType").select2({templateSelection: function(item){
			if(item.id=="02"){
				$("#serverTypeDbRow1").show();
				$("#serverTypeDbRow2").show();
			} else {
				$("#serverTypeDbRow1").hide(clearDbField());
				$("#serverTypeDbRow2").hide();
			}
			return item.text;
		}})
		
		$("#serverSystemName").click(function(e) {
			$("#SSystemSelect_modal").modal("show");
			initSSystemTable();
			
		});
		$("#SSystemSelectSure").click(function(e) {
			var selectItem = $("#SSystemSelectTable").bootstrapTable("getSelections")[0];
			if (selectItem != null) {
				$("#serverSystemName").val(selectItem["SYSTEM_NAME"]);
				$("input[name=serverSystem]").val(selectItem["SYSTEM_ID"]);
			} else {
				alert("未选择应用");
			}
			$("#SSystemSelect_modal").modal("hide");
		});
		$("#querySystem").click(function(){
			$("#SSystemSelectTable").bootstrapTable('refresh',{
				url:contextpath + "appInfo/querySystemList?"+$("#query_form_server").serialize()
			})
		})
		
	}
	
	
	function getServerInfo(){
		var serverId = getParamString("id");
		if(serverId!=""&&serverId!=null&&serverId!=undefined){
			baseAjaxJsonp(contextpath + "server_info/info/" + serverId, null, function(data){
				if(data.success){
					var result = data.result;
					for(var item in result){
						if(typeof(result[item])!=="object"){
							$("[name='" + item + "']").val(result[item]);
						} else {
							for(var subItem in result[item]){
								$("[name='" + item + "." + subItem + "']").val(result[item][subItem]);
							}
						}
					}
					if(result.serverType=="02"){
						$("#serverTypeDbRow1").show();
						$("#serverTypeDbRow2").show();
					}
					$("select").trigger("change");
					
					//判断是否查看操作
					var detail = getParamString("detail");
					if(detail!=""&&detail!=null&&detail!=undefined){
						$("select").select2({"disabled":true});
						$("input").attr("disabled","disabled");
					}
				}
			});
		}
	}
	
	function saveServerInfo(){
		var param = $("#serverInfoForm").serialize()
		baseAjaxJsonp(contextpath + "server_info/save",param,function(data){
			if(data.success){
				 alert("操作成功!", function(){
					 parent.closeCurrentTab(parent);
				 });
				
			} else {
				alert("保存失败" + data.message);
			}
		});
		
		/*$.ajax({
			type : "post",
			url : contextpath + "server_info/save",
			async : true,
			//data : serverInfo,
			data : $("#serverInfoForm").serialize(),
			dataType : "json",
			success : function(data){
				if(data.success){
					 alert("操作成功!", function(){
						 parent.closeCurrentTab(parent);
					 });
					
				} else {
					alert("保存失败" + data.message);
				}
			},
			error : function(xhr,status,error) {
				//后台数据校验返回值
				if("error"==status && xhr.status==400){
					alert("提交参数不合规");
				}
			}
		});*/
	
}
	
	function clearDbField(){
		$("#dbType").val(" ").trigger("change");
		$("input[name=instanceName]").val("");
		$("input[name=dbUsername]").val("");
		$("input[name=dbPassword]").val("");
	}
	
	//初始化页面按钮事件
	$("#save").click(function(event){
		var $form = $("#serverInfoForm");
		var result = vlidate($form);
		if(result){
			/*var serverInfo = new Object();
			var $inputs = $form.find("input");
			var $selects = $form.find("select");
			var $textareas = $form.find("textarea");
			
			for(var i=0; i<$inputs.length; i++){
				if($inputs[i].value!=""){
					serverInfo[$($inputs[i]).attr("name")] = $.trim($inputs[i].value);
				}
			}
			for(var i=0; i<$selects.length; i++){
				if($selects[i].value!=" "){
					serverInfo[$($selects[i]).attr("name")] = $.trim($selects[i].value);
				}
			}
			for(var i=0; i<$textareas.length; i++){
				if($($textareas[i]).val()!=""){
					serverInfo[$($textareas[i]).attr("name")] = $.trim($($textareas[i]).val());
				}
			}
			serverInfo["serverUseType"] = "03";*/
			saveServerInfo();

		} else {
			alert("所保存内容不全或不符合条件！");
		}
	});
	
	$("#close").click(function(event){
		nconfirm("放弃当前修改内容离开",function(){
			//location.href="app_server_list.html";
			parent.closeCurrentTab(parent);
		});
	});
});
function initSSystemTable() {
	var queryParams = function(params) {
		var systemInfo = {
			limit : params.limit, // 页面大小
			offset : params.offset / params.limit + 1 // 页码
		};
	/*	var $form = $("#query_form_server");
		var $inputs = $form.find("input");
		for (var i = 0; i < $inputs.length; i++) {
			if ($inputs[i].value != "") {
				systemInfo[$($inputs[i]).attr("name")] = $
						.trim($inputs[i].value);
			}
		}
		systemInfo["serverUseType"] = "03";
		systemInfo["flowStatus"] = "00";*/
		return systemInfo;
	};
	$("#SSystemSelectTable").bootstrapTable("destroy")
			.bootstrapTable({
				url : contextpath + "appInfo/querySystemList",
				method : 'post', // 请求方式（*）
				contentType : "application/x-www-form-urlencoded",
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				dataType:"jsonp",
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 5, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : true,// 复选框单选
				onLoadSuccess : function(data) {
				},
				columns : [ {
					checkbox : true,
					//rowspan : 2,
					align : 'center',
					valign : 'middle',
	                width: "5%"
				}, {
					field : 'SYSTEM_ID',
					title : '序号',
					align : "center",
					  width: "5%",
					formatter : function(value, row, index) {
						return index + 1;
					}
				}, {
					field : 'SYSTEM_NAME',
					title : '子应用名称',
					align : "center",
					width : "13%"
				}, {
					field : 'SYSTEM_SHORT',
					title : '流程名称',
					align : "center",
					width : "19%"
				} ]
			});
}
//function ipExist(){
//	 var ip=$("#serverIp").val();
//	 $.ajax({
//         type : "post",
//         url : contextpath+ "server_info/queryIp",
//         async :  true,
//         data : {ip:ip},
//         dataType : "json",
//         success : function(data) {
//             if(!data.result){
//            	 alert("该ip地址已存在");
//             }
//         },
//         error : function(msg) {
//         }
//     });
//}
