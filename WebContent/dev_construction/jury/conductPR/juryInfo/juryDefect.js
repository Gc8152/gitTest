var defectQuery = getMillisecond();
//初始化表格
function initSJuryDefectInfo(){
	
	//添加页面跳转
	getCurrentPageObj().find("#defect_add").click(function() {
		var at_jury_grade = getCurrentPageObj().find("#at_jury_grade").val();
		var jury_principal_id = getCurrentPageObj().find("#jury_principal_id").val();//评审负责人
		var sponsor_id = getCurrentPageObj().find("#sponsor_id").val();//评审提出人
		var compere_id = getCurrentPageObj().find("#compere_id").val();//主持人
		var jury_id = getCurrentPageObj().find("#jury_id").val();
		closeAndOpenInnerPageTab("defect_edit","添加缺陷","dev_construction/jury/conductPR/juryInfo/juryDefectEdit.html",function(){	
			initSelect(getCurrentPageObj().find("#jury_grade_key"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"},at_jury_grade);

			getCurrentPageObj().find("#jury_id").val(jury_id);
			getCurrentPageObj().find("#sponsor_user_id").val(sponsor_id);//缺陷处理人为评审提出人
			getCurrentPageObj().find("#check_user_id").val(compere_id);//验证人为主持人
			getCurrentPageObj().find("#defect_save_type").val("add");
			//初始化数据,缺陷类型
			initSelect(getCurrentPageObj().find("#defect_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_TYPE"});
			//初始化数据,缺陷所属
			initSelect(getCurrentPageObj().find("#defect_when"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_WHEN"});
			//初始化数据,缺陷级别
			initSelect(getCurrentPageObj().find("#defect_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_GRADE"});
			//初始化数据,缺陷状态
			initSelect(getCurrentPageObj().find("#defect_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_STATE"},"01");
			//初始化数据,缺陷归因
			initSelect(getCurrentPageObj().find("#defect_cause"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_CAUSE"});

			
			getCurrentPageObj().find("#checkDefect").hide(); //验证
			getCurrentPageObj().find("#disposeDefect").hide(); //处理
		
		});
		
	});
	
	//删除缺陷
	getCurrentPageObj().find("#defect_del").click(function() {
		var id = getCurrentPageObj().find("#juryDefectInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.DEFECT_ID;});
		var state = $.map(id, function (row) {return row.DEFECT_STATE;});
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");				
			return;
		}else{
			if(id[0].CREATE_USER_ID != SID){
				alert("你不是缺陷提出人，不能删除此缺陷！");
				return;
			}
			var params ={};
			params['defect_id'] = ids[0];
			if(state[0]!='01'){
				alert("请选择未解决缺陷！");
				return;
			}
			nconfirm("确定要删除该数据吗?",function(){
				var expertsCall = getMillisecond();
				baseAjaxJsonp(dev_construction+'GDefect/deleteDefect.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						
						$("#juryDefectInfo").bootstrapTable('remove', {
							field: 'DEFECT_ID',
							values: ids
						});	
						alert("删除成功");
					}else{
						alert("删除失败");
					}
				},expertsCall);
				
			});
		}
	});
	
	
	//修改页面
	getCurrentPageObj().find("#defect_edit").click(function() {
		
		findOneDefectInfo("defect_edit","修改缺陷");
	});
	//处理页面
	getCurrentPageObj().find("#defect_dispose").click(function() {
		findOneDefectInfo("defect_dispose","处理缺陷");
	});
	//重新处理
	getCurrentPageObj().find("#defect_dispose_again").click(function() {
		findOneDefectInfo("defect_dispose_again","处理缺陷");
	});
	
	//验证页面
	getCurrentPageObj().find("#defect_verify").click(function() {
		findOneDefectInfo("defect_verify","验证缺陷");
	});
	
	//查看
	getCurrentPageObj().find("#defect_view").click(function() {
		findOneDefectInfo("defect_view","查看缺陷");
	});
	
	//完成评审
	getCurrentPageObj().find("#finish_jury").click(function() {
		var jury_id = $("#prepare_div input[name='G.jury_id']").val();
		var param = {};
		param['jury_id']=jury_id;
		param['reviewer_user_id']=SID;
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"GDefect/queryFinishJury.asp.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		getCurrentPageObj().find("#defect_query_info").hide();
			}else{ 
				alert(data.msg);
			}
		}, call);
	});
	
	
};

//初始化缺陷
function defectInfo(jury_id){
	getCurrentPageObj().find("#juryDefectInfo").bootstrapTable({
	      url: dev_construction+'GDefect/queryDefectList.asp?call='+defectQuery+'&SID='+SID+'&jury_id='+jury_id,     //请求后台的URL（*）
	      method: 'get',           //请求方式（*）   
	      striped: false,           //是否显示行间隔色
	      cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）		       
	      sortable: true,           //是否启用排序
	      sortOrder: "asc",          //排序方式
	      queryParams: queryParams,//传递参数（*）
	      sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
	      pagination: true,          //是否显示分页（*）
	      pageList: [5,10,15],    //可供选择的每页的行数（*）
	      pageNumber:1,            //初始化加载第一页，默认第一页
	      pageSize: 5,            //每页的记录行数（*）		       
	      clickToSelect: true,        //是否启用点击选中行
	      //height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
	      uniqueId: "DEFECT_ID",           //每一行的唯一标识，一般为主键列
	      cardView: false,          //是否显示详细视图
	      detailView: false,          //是否显示父子表	
	      jsonpCallback:defectQuery,
	      singleSelect: true,//复选框单选
	      
	      columns: [
			{	
				//radio:true,
				checkbox:true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			}, 
			{
	        field: 'ROW_NUM',
	        title: '序号',
	        align:"center"
	      }, {
	        field: 'DEFECT_ID',
	        title: 'ID',
	        align:"center",
	        visible:false
	      }, {
	          field: 'DEFECT_NAME',
	          title: '缺陷名字',
	          align:"center"
	        },{
	          field: 'DEFECT_TYPE_NAME',
	          title: '缺陷类型',
	          align:"center"
	       },{
	      	  field:"DEFECT_STATE_NAME",
	      	  title:"缺陷状态",
	          align:"center"
	      }, {
	           field: 'DEFECT_WHEN_NAME',
	           title: '缺陷所属',
	           align:"center"
	       },{
	           field: 'JURY_GRADE_NAME',
	           title: '评审等级',
	           align:"center"
	       },{
	           field: 'JURY_TASK_NAME',
	           title: '需求任务',
	           align:"center"
	       },{
	    	   field:"DEFECT_GRADE_NAME",
	    	   title:"缺陷等级",
	    	   align:"center"
	       },{
	      	  field:"DEFECT_CAUSE_NAME",
	      	  title:"缺陷归因",
	          align:"center"
	      },{
	      	field:"DISPOSE_TIME",
	      	title:"处理时间",
	          align:"center"
	      },{
	        	field:"CREATE_USER_NAME",
	          	title:"提出人",
	              align:"center"
	          },{
	            	field:"SPONSOR_USER_NAME",
	              	title:"缺陷责任人",
	                  align:"center"
	              },{
	                	field:"CHECK_USER_NAME",
	                  	title:"验证人",
	                      align:"center"
	                  },{
	                	field:"AT_PRINCIPAL_NAME",
	                  	title:"环节处理人",
	                      align:"center"
	                  }]
	    }); 
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		}
}


function findOneDefectInfo(defectObj,text){
	var id = getCurrentPageObj().find("#juryDefectInfo").bootstrapTable('getSelections');
	var ids = $.map(id, function (row) {return row.DEFECT_ID;});
	var state = $.map(id, function (row) {return row.DEFECT_STATE;});
	if(ids==null||ids==undefined||ids==""){
		alert("请选择一条数据！");				
		return;
	}else{
		if(defectObj=="defect_dispose"){
			
			if(state[0]=='02' || state[0]=='03'){
				alert("此缺陷已处理");
				return;
			}
			if(id[0].SPONSOR_USER_ID != SID){
				alert("你不是缺陷责任人，不能处理此缺陷！");
				return;
			}
		}else if(defectObj == "defect_verify"){
			if(id[0].AT_PRINCIPAL_ID != SID){
				alert("你不是当前责任人，不能验证此缺陷！");
				return;
			}
			if(state[0]=="01" ||state[0]=="04"){
				alert("请先处理完再验证");
				return;
			}
			else if(state[0]=="03"){
				alert("此缺陷已关闭");
				return;
			}
		}else if(defectObj == "defect_edit"){
			if(id[0].CREATE_USER_ID != SID){
				alert("你不是缺陷提出人，不能修改此缺陷！");
				return;
			}
			if(state[0]!='01'){
				alert("请选择未解决的缺陷");
				return;
			}
		}
		
		var params ={};
		params['defect_id'] = ids[0];
		var req_task_state = getCurrentPageObj().find("#req_task_state").val();
		closeAndOpenInnerPageTab("defect_edit",text,"dev_construction/jury/conductPR/juryInfo/juryDefectEdit.html",function(){	
			getCurrentPageObj().find("#req_task_state").val(req_task_state);
			getCurrentPageObj().find("#defect_save_type").val(defectObj);
			var expertsCall = getMillisecond();
			baseAjaxJsonp(dev_construction+'GDefect/queryDefectById.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
				for ( var k in data) {
					var str = data[k];
					k = k.toLowerCase();
					getCurrentPageObj().find("#"+k).val(str);
					//getCurrentPageObj().find("#"+k).attr("disabled",true);
					if(defectObj != "defect_edit"){
						getCurrentPageObj().find("#addDefect_from input").attr("disabled",true);
						getCurrentPageObj().find("#addDefect_from select").attr("disabled",true);
						getCurrentPageObj().find("#addDefect_from textarea").attr("disabled",true);
					
					}//initSelect(getCurrentPageObj().find("#reviewer_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REVIEWER_GRADE"},str);
				}	
				getCurrentPageObj().find("#remark").text(data.REMARK);	
				
				
				initSelect(getCurrentPageObj().find("#jury_grade_key"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"},data.JURY_GRADE_KEY);
				
				//初始化数据,缺陷类型
				initSelect(getCurrentPageObj().find("#defect_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_TYPE"},data.DEFECT_TYPE);
				//初始化数据,缺陷所属
				initSelect(getCurrentPageObj().find("#defect_when"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_WHEN"},data.DEFECT_WHEN);
				//初始化数据,缺陷级别
				initSelect(getCurrentPageObj().find("#defect_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_GRADE"},data.DEFECT_GRADE);
				//初始化数据,缺陷状态
				initSelect(getCurrentPageObj().find("#defect_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_STATE"},data.DEFECT_STATE);
				//初始化数据,缺陷归因
				initSelect(getCurrentPageObj().find("#defect_cause2"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_CAUSE"},data.DEFECT_CAUSE);
				initSelect(getCurrentPageObj().find("#defect_cause"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_DEFECT_CAUSE"},data.DEFECT_CAUSE);
				if(defectObj == "defect_verify" || defectObj == "defect_view"){
					getCurrentPageObj().find("#set_question_solve").show();
					getCurrentPageObj().find("#set_defect_cause").show();
					
					if(defectObj == "defect_view"){
						getCurrentPageObj().find("#checkDefect").hide(); //验证
					}
					getCurrentPageObj().find("#addDefect").hide(); //保存
					getCurrentPageObj().find("#disposeDefect").hide(); //处理
				}
				if(defectObj == "defect_dispose"){
					getCurrentPageObj().find("#checkDefect").hide(); //验证
					getCurrentPageObj().find("#addDefect").hide(); //保存
				}
				
				if(defectObj == "defect_edit"){
					getCurrentPageObj().find("#checkDefect").hide(); //验证
					getCurrentPageObj().find("#disposeDefect").hide(); //处理
				}
				//alert(data['experts_type']);
				
			},expertsCall);
		});
	}
}

initSJuryDefectInfo();
