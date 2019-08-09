$(document).ready(function() {
			//下拉菜单select2
			initVlidate($("#appInfoForm"));
			$("select").select2();
			var type = $.getUrlParam("pageType");
			var init = false;
			var id = $.getUrlParam("id");
			initAppInfo(id, type);
			$("#save").click(function() {
				var url = contextpath + "appInfo/save";
				var result=vlidate($("#appInfoTable"));
				if(result){
					$("#status").removeAttr("disabled");
					baseAjaxJsonp(url,$("#appInfoForm").serialize(),function(data){
						if (data.success) {
							 alert("操作成功!", function(){
								 $("#close").click();
							 });
						} else {
							alert(data.message);
						}
					});
				} else {
					alert("所保存内容不全或不符合条件");
					}
			});
			$("#close").click(function() {
				parent.closeCurrentTab(parent);
			
			});
			$("#systemName").click(function(e) {
				$("#systemSelect_modal").modal("show");
				initSystemTable();
			});
			// 查看详情
			if (type == "detail") {
				$('#appInfoForm input').attr("readonly", "readonly");
				$("#save").hide();
				$("#systemName").unbind();
			}
			$("#systemSelectSure").click(function(e) {
				var selectItem = $("#systemSelectTable")
						.bootstrapTable("getSelections")[0];
				if (selectItem != null) {
					$("#systemName").val(selectItem["SYSTEM_NAME"]);
					$("#systemId").val(selectItem["SYSTEM_ID"]);
					$("#status").val(selectItem["IS_ONLINE"]);
					$("#dutyUserId").val(selectItem["USER_NAME"]);
					$("#createTime").val(getNowFormatDate());
					$("#status").trigger("change");
				} else {
					alert("未选择应用");
				}
				$("#systemSelect_modal").modal("hide");
			});
			$("#evnBuildKind").on("change", function(e){
				if(init){
					init = false;
				}else {
					initSelectData("evnBuildId", this.value);
				}
			});
			function initAppInfo(id, type) {
				var call = function(selectId, evnId){
					$("#" + selectId).val(evnId);
					$("#" + selectId).trigger("change");
				};
				if(id==null){
					initSelectData("evnBuildJDK", "2", call);
				} else {
					baseAjaxJsonp(contextpath + "appInfo/findOne",{id:id},function(data){
						if (type == "detail") {
						$("select").select2({
							"disabled" : true
						});
					}
					if (data.success) {
						init = true;
						$("#appInfoForm").setform(data.result);
						if(null!=data.result.systemInfo){
							$("#systemName").val(data.result.systemInfo.systemName);									
							$("#status").val(data.result.systemInfo.systemStatus).trigger("change");
						}
						if(data.result.evnBuildKind=="1"){
							initSelectData("evnBuildId", "1", call, data.result.evnBuildId);
						} else {
							initSelectData("evnBuildId", "0", call, data.result.evnBuildId);
						}
						initSelectData("evnBuildJDK", "2", call, data.result.evnBuildJDK);
						
					} else {
						alert(data.message);
					}
					});
				}
			}
			function initSystemTable() {
				var queryParams = function(params) {
					var systemInfo = {
						limit : params.limit, // 页面大小
						offset : params.offset / params.limit + 1 // 页码
					};
					return systemInfo;
				};
				$("#systemSelectTable").bootstrapTable("destroy")
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
			//应用pop框查询事件
			$("#querySystem").click(function(){
				$("#systemSelectTable").bootstrapTable('refresh',{
					url:contextpath + "appInfo/querySystemList?"+$("#query_form").serialize()
				})
			})
			
			
			function getNowFormatDate() {
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = year + seperator1 + month + seperator1
						+ strDate;
				return currentdate;
			}

		});
//initSelectData("evnBuildId", "0", call, data.result.evnBuildId);
function initSelectData(selectId, v, call, evnId){
	if(v!=" "){
		baseAjaxJsonp(contextpath + 'evnBuild/queryEvnBuildByType/' + v, null, function(data) {
			var result=data.result;
			$("#" + selectId).find("option").remove();
			$("#" + selectId).val(null).trigger("change");
			$("#" + selectId).append('<option selected="selected">请选择</option>');
			for(var p in result){
				$("#" + selectId).append("<option value='" + result[p].id+ "'>" +result[p].evnBuildName+ "</option>");
			}		
			if(call!=null){
				call(selectId, evnId);
			}
		})
	}
	
}


