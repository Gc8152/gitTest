var currTab=getCurrentPageObj();
initSelect(getCurrentPageObj().find("#STis_change"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_IS_CHANGE"},"01");

function initSelectPicker(obj,show,data,default_v,arr){
	if(obj!=undefined&&show!=undefined&&data!=undefined){
		obj.empty();
		for(var i=0;i<data.length;i++){
			if(default_v==undefined||default_v==""){
				default_v=data[i]["IS_DEFAULT"]=="00"?data[i][show.value]:"";
			}
			obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
		}
		if(default_v!=undefined&&default_v!=""){
			var mycars=default_v.split(",");
			obj.val(mycars).trigger('change');
		}else{
			obj.val(" ");
		}
		obj.select2();
	}
}
function initSplitTaskDetailLayOut(params){
	for(var k in params){
		var str=params[k];
		k = k.toLowerCase();//大写转换为小写
		if(k=="plan_onlinetime"||k=="sub_req_name"||k=="req_name"){
			currTab.find("span[name='STD."+k+"']").text(str);
		}else if(k=="sub_req_code"){
			//var req_sub_code=str.substring(str.indexOf('"')+1,str.lastIndexOf('"'));
			currTab.find('#STDsub_req_code').text(str);
		}else if(k=="sub_req_content"){
			currTab.find('#STDsub_req_content').text(str);	
		}else if(k=="req_code"){
			currTab.find('#STDreq_code').text(str);
		}else if(k=="sub_req_id"){//input框单独处理
			currTab.find('#STDsub_req_id').val(str);
		}else if(k=="req_id"){
			currTab.find('#STDreq_id').val(str);
		}else if(k=="req_acc_classify"){	
			currTab.find('#STDreq_acc_classify').val(str);
		}else if(k=="is_change"){
			if(str=="00"){
				$("#supply_style").hide();
				$("#is_involve").show(); 
				$("#is_involve1").show(); 
			}
			initSelect(getCurrentPageObj().find("#STDis_change"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_IS_CHANGE"},str);
		}else if(k=="involve_app"){
			var reqSpTaskCall=getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+"requirement_splitTask/queryApplicationList.asp?SID="+SID+"&call="+reqSpTaskCall,null,function(data){
				if(data!=undefined){
					globalSelectCache[data.dic_data]={};
					globalSelectCache[data.dic_data]["data"]=data.rows;
					globalSelectCache[data.dic_data]["startDate"]=new Date().getTime();
					var strcheck=params["INVOLVE_APP"];
					initSelectPicker(getCurrentPageObj().find("#STDinvolve_app"),{value:"SYSTEM_ID",text:"SYSTEM_NAME"},data.rows,strcheck);
				}
			},reqSpTaskCall);
		
			
		}
		
	}
	
	initTaskDetailTable();//初始化关联的任务列表
}

//点击需求编号事件，查看需求详情
function viewReqDetail(){
	var ids=getCurrentPageObj().find('#STDreq_id').val();
	var reqd_acc=getCurrentPageObj().find("#STDreq_acc_classify").val();
	if(reqd_acc=="00"){
		closeAndOpenInnerPageTab("EmRequirement_detail1","紧急需求详情","dev_construction/requirement/requirement_analyze/task_accept/emreq_detail.html",function(){
			initEmReqDetailLayout(ids);
		});	
	}
	else{
	closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
		initReqDetailLayout(ids);
	});}
}
//查询与单个子需求关联的任务列表
function initTaskDetailTable(){
	var sub_req_id=getCurrentPageObj().find('#STDsub_req_id').val();
	if(sub_req_id==null||sub_req_id==""){
		alert("获取子需求id失败！");
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
		getCurrentPageObj().find('#gReqTaskDetailTable').bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"requirement_splitTask/queryTaskInfoBySubReqId.asp?SID="+SID+"&sub_req_id="+sub_req_id,
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
					uniqueId : "SUB_REQ_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					columns : [ {
						field : '序号',
						title : '序号',
						align : "center",
						formatter: function(value, row, index) {
							return index+1;
						}
					},{
						field : 'SUB_REQ_ID',
						title : '需求序列号',
						align : "center",
						visible:false,
					},{
						field : 'DEPT_NAME',
						title : '项目组',
						align : "center",
						visible :false 
					},{
						field : "REQ_TASK_NAME",
						title : "任务名称",
						align : "center"
					},  {
						field : 'REQ_TASK_RELATION_DISPLAY',
						title : '从属关系',
						align : "center"
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center"
					}, {
						field : "PROJECT_MAN_NAME",
						title : "任务项目经理",
						align : "center"
					}, {
						field : "TASK_CONTENT",
						title : "应用实现内容",
						align : "center"
					}]
				});
}



