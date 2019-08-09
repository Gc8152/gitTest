
autoInitRadio({dic_code:"G_DIC_REQ_FEASIBILITY"},getCurrentPageObj().find("#SPD_acc_feasibility"),"SPD.req_feasibility_result",{labClass:"ecitic-radio-inline",value:"01"});

//初始化页面信息
function initSplitReqDetailLayOut(ids){
	var subDeTailCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqPageById.asp?SID="+SID+"&req_id="+ids+"&call="+subDeTailCall, null , function(data) {
		for ( var f in data) {
			  var map=data[f];
		   if(f=="1"||f=="2"){
		     for(var k in map){
				var str=map[k];
				k = k.toLowerCase();//大写转换为小写
		    if(k=="req_datatable_flag"||k=="req_income_flag"||k=="req_dis_result"||k=="req_acc_result"){
		    	  getCurrentPageObj().find("input[name='SPD."+k+"']"+"[value="+str+"]").attr("checked",true);
		    }else if(k=="req_level"){
		    	autoInitRadio({dic_code:"G_DIC_REQUIREMENT_LEVEL"},getCurrentPageObj().find("#req_level_reqSPD"),"SPD.req_level",{labClass:"ecitic-radio-inline",value:str});
		    }else if(k=="req_id"){
		    	 getCurrentPageObj().find('#req_id_reqSPD').val(str);
		    }else if(k=="file_id"){
		    	 getCurrentPageObj().find('#file_id_reqSPD').val(str);
		    }else if(k=="file_id_assess"){
		    	 getCurrentPageObj().find('#file_id_reqAssSPD').val(str);
		    }else if(k=="req_type1"){
				if(str=='02'){
					getCurrentPageObj().find('#business_org_hide').hide();
					getCurrentPageObj().find('#SPDproject_id_display').hide();
				}
			/*}else if(k=="req_assess_level"){
				var num=str.split(",");
				for(var i=0;i<num.length;i++){
				  getCurrentPageObj().find("input[name='SPD."+k+"']"+"[value="+num[i]+"]").attr("checked",true);
				}
			}else if(k=="req_type1"&&str=="02"){
	    	 	getCurrentPageObj().find('#hiddenStyle').hide();
	    	 	getCurrentPageObj().find('#hiddenStyle1').hide();*/
	    	}else{
				  getCurrentPageObj().find("span[name='SPD."+k+"']").text(str);
			}
		    }
		    }
		    }
		initReqSubListDetail();//初始化详情页面子需求列表
		initReqPlanDetailList();//初始化详情页面需求实施计划列表
	},subDeTailCall);
	
}

//初始化子需求列表,详情页面
function initReqSubListDetail(){
	var req_id=getCurrentPageObj().find('#req_id_reqSPD').val();
	if(req_id==null||req_id==""){
		alert("子需求列表获取需求id失败");
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
	var reqSubDetailCall = getMillisecond();
	req_id=getCurrentPageObj().find('#gReqSubDetail').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"requirement_splitreq/queryReqSubList.asp?SID="+SID+"&req_id="+req_id+"&call="+reqSubDetailCall,
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
				uniqueId : "SUB_REQ_CODE", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqSubDetailCall,
				singleSelect : true,// 复选框单选
				columns : [{
					field : '',
					title : '序号',
					align : "center",
					formatter:function(value, row, index){
						return index+1;
					}
				},{
					field : 'SUB_REQ_CODE',
					title : '需求点编号',
					align : "center",
				},{
					field : 'SUB_REQ_NAME',
					title : '需求点名称',
					align : "center",
				},{
					field : 'SUB_REQ_STATE_DISPLAY',
					title : '需求点状态',
					align : "center",
				},{
					field : 'PLAN_ONLINETIME',
					title : '计划投产时间',
					align : "center",
				},{
					field : 'SUB_REQ_CONTENT',
					title : '需求点描述',
					align : "center",
				}]
			});
 }





//初始化实施计划列表
function initReqPlanDetailList(){
	var req_id=getCurrentPageObj().find('#req_id_reqSPD').val();
	if(req_id==null||req_id==""){
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
	var reqPlanDetailCall = getMillisecond();
	getCurrentPageObj().find('#gReqPlanTable').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"requirement_accept/queryReqPlanList.asp?SID="+SID+"&req_id="+req_id+"&call="+reqPlanDetailCall,
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
				jsonpCallback:reqPlanDetailCall,
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
	initSubReqDetailIncomeCss();//初始化需求评估样式
	initReqDetailFileList();//初始化文件上传列表
}

//初始化需求评估样式
function initSubReqDetailIncomeCss(){
	var req_income_flag=getCurrentPageObj().find('input:radio[name="SPD.req_income_flag"]:checked').val();
	if(req_income_flag=="01"){//收益评估为否时隐藏收益估算和理由
		getCurrentPageObj().find('#req_income_spd').hide();
		getCurrentPageObj().find('#req_income_reqSPD').hide();
		getCurrentPageObj().find('#req_remark_spd').hide();
		getCurrentPageObj().find('#req_income_doc_reqSPD').parent().parent().hide();
	}
	
}
//初始化附件列表
function initReqDetailFileList(){
 //初始化需求信息附件列表
 var business_code = getCurrentPageObj().find("#req_code_reqSPD").html();
 var tablefile = getCurrentPageObj().find("#reqSpd_tablefile");
 getSvnFileList(tablefile,getCurrentPageObj().find("#reqSpd_fileview_modal"),business_code,"0101",function(){
	 appendAssTable(tablefile,business_code);
 });
//初始化需求工作量评估附件列表
 /*var ass_tablefile = getCurrentPageObj().find("#reqSpdAss_tablefile");
 getSvnFileList(ass_tablefile,getCurrentPageObj().find("#reqSpdAss_fileview_modal"),business_code,"0102");*/
}

function appendAssTable(tablefile,business_code){
	 baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:business_code, phase:'0102'},function(data){
			tablefile.bootstrapTable("append",data);
		},false); }





