function openConsumerAppPop(obj,params){
	$("#myModal_ConsumerApp").remove();
	//加载pop框内容
	obj.load("dev_application/interfaceManage/interInfoRepair/ConsumerAppPop.html",{},function(){
		var modObjPOP = getCurrentPageObj().find("#myModal_ConsumerApp");
		modObjPOP.modal("show");
		initVlidate(modObjPOP);//渲染必填项
		if(params){//初始化数据
			for(var k in params){//初始化基本信息
				k1 = k.toLowerCase();
				modObjPOP.find("[name='R."+ k1 +"']").val(params[k]);
			}
			if(params.INVOK_ID){//有id传进来表示修改
				//不可选择消费方
				modObjPOP.find("[name='R.con_system_id']").attr("disabled","disabled");
			}else{//清空余留的invok_id
				modObjPOP.find("[name='R.invok_id']").val("");
			}
		}
		var m_flag = true;
		//点击选择应用按钮
		modObjPOP.find("[name='R.con_system_id']").click(function(){
			modObjPOP.find("#interInfoRepair_systemPop").modal("show");
			if(m_flag){//只初始化一次模态框列表事件
				initSystemPopEvent();//初始化模态框事件
				m_flag = false;
			}
		});
		//保存按钮
		modObjPOP.find("[btn='tab3_popSave']").click(function(){
			if(!vlidate(modObjPOP,"",true)){
				return ;
			}
			
			var aaa=getCurrentPageObj().find("[name='R.add_remark']").val();
		    if(aaa.length>150){
		    	alert("补登说明至多可输入150汉字！");
		    	return;
		    }
			
			var rParam = getPageParam("R");
			rParam["inter_version"] = params.inter_version;
			var sCall = getMillisecond();
			baseAjaxJsonp(dev_application+"InterInfoRepair/saveConsumerApp.asp?SID=" + SID + "&call=" + sCall, rParam, function(data) {
				alert(data.msg);
				if(data.result=="true"){
					modObjPOP.modal("hide");
					var url = dev_application+'InterQuery/interUseRelationQuery.asp?SID='+SID+'&call='+params.call+'&inter360_id='+params.inter_id;
					getCurrentPageObj().find("[tb='tab3_relation']").bootstrapTable('refresh',{
						url:url});
				}
			},sCall,false);
			
		});
		
		//初始化应用列表
		function initSystemPopEvent(){
			var sCall = getMillisecond();//表回调方法		
			var queryParams = function(params) {
				var temp = {
					limit : params.limit, // 页面大小
					offset : params.offset
				// 页码
				};
				return temp;
			};
			var sUrl = dev_application+"applicationManager/queryApplication.asp?SID="+SID + "&call=" + sCall;
			modObjPOP.find("[tb='table_system']").bootstrapTable({
				url :sUrl,
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
				pageSize : 5, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : false,// 复选框单选
				jsonpCallback:sCall,
				onDblClickRow:function(row){
				},
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'order_id',
					title : '序号',
					align : "center",
					width : "50px",
					formatter:function(value,row,index){
						return index + 1;
					}
				}, {
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center"
				}, {
					field : "SYSTEM_SHORT",
					title : "应用简称",
					align : "center"
				}, {
					field : "PROJECT_MAN_NAME",
					title : "应用负责人",
					align : "center"
				}]
			});
			
			//关闭模态框按钮
			modObjPOP.find("[btn='close']").click(function(){
				modObjPOP.find("#interInfoRepair_systemPop").modal("hide");
			});
			
			//重置按钮
			modObjPOP.find("#reset_system").click(function(){
				modObjPOP.find("#system_name").val("");
				modObjPOP.find("#project_man_name").val("");
			});
			//查询按钮
			modObjPOP.find("#query_system").click(function(){
				var params = getCurrentPageObj().find("#myModal_ConsumerAppForm").serialize();
				var sUrl = dev_application+"applicationManager/queryApplication.asp?SID="+SID + "&call=" + sCall + "&" + params;
				modObjPOP.find("[tb='table_system']").bootstrapTable('refresh',{
					url:sUrl});
			});	
			//enter触发查询
			enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_system").click();});
			
			//选择按钮
			modObjPOP.find("#select").click(function(){
				var reData = getCurrentPageObj().find("[tb='tab3_relation']").bootstrapTable("getData");
				var seleData = modObjPOP.find("[tb='table_system']").bootstrapTable("getSelections");
				var seleId = "";
				var seleName = "";
				for(var i = 0; i < seleData.length; i++){
					for(var j = 0; j < reData.length; j++){
						if(seleData[i].SYSTEM_ID == reData[j].CON_SYSTEM_ID){
							alert(seleData[i].SYSTEM_NAME + "已存在");
							return;
						}
					}
					seleId += seleData[i].SYSTEM_ID + ",";
					seleName += seleData[i].SYSTEM_NAME + ",";					
				}
				modObjPOP.find("[name='R.con_system_id']").val(seleId.substring(0, seleId.length - 1));
				modObjPOP.find("[name='R.system_name']").val(seleName.substring(0, seleName.length - 1));
				modObjPOP.find("#interInfoRepair_systemPop").modal("hide");
			});
		}	
	});
	
	
}