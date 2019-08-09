var k=1;//初始化定义生成的tr编号
function upGradeOutPersonRank(data){
	getCurrentPageObj().find("#apply_group").unbind("click");
	getCurrentPageObj().find("#apply_group").click(function(){
		openSelectTreeDivToBody($(this),"op_apply_pop_fu_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#apply_group").val(node.name);
			getCurrentPageObj().find("input[name='UPG.group_code']").val(node.id);
			
		});
	});
	if(data!=undefined&&data!=null&&data!=""){
		var call = getMillisecond();
		baseAjaxJsonp(dev_outsource+"outperson/queryOneOutPersonRankInfo.asp?id="+data+'&call='+call+'&SID='+SID,null,function(data){
			if(data["rows"]!=undefined&&data["rows"]!=null&&data["rows"]!=""){
				getCurrentPageObj().find("#rank_id").val(data["rows"][0].ID);
				getCurrentPageObj().find("#apply_group").val(data["rows"][0].APPLY_GROUP);
				getCurrentPageObj().find("#group_code").val(data["rows"][0].GROUP_CODE);
				getCurrentPageObj().find("#Up_opt_manager").val(data["rows"][0].OPT_MANAGER);
				getCurrentPageObj().find("#Up_rank_apply_time").val(data["rows"][0].RANK_APPLY_TIME);
				getCurrentPageObj().find("#apply_reason").val(data["rows"][0].APPLY_REASON);
				//附件(S/E级说明文档)
/*				if(data["rows"][0]["FILE_ID_SE"]&&$.trim(data["rows"][0]["FILE_ID_SE"])!=""){	
					getCurrentPageObj().find("#file_id_SE").val(data["rows"][0]["FILE_ID_SE"]);
					findFileInfo(data["rows"][0]["FILE_ID_SE"],function(data1){
						if(data1.rows.length>0){
							defaultShowFileInfo(data["rows"][0]["FILE_ID_SE"],getCurrentPageObj().find("#file_button_SE").parent(),data1,true,"updateRankFileDivSE");
						}
					});
				}*/
				//附件(人员情况说明文档)
				if(data["rows"][0]["FILE_ID_STATE"]&&$.trim(data["rows"][0]["FILE_ID_STATE"])!=""){
					getCurrentPageObj().find("#file_id_state").val(data["rows"][0]["FILE_ID_STATE"]);
					findFileInfo(data["rows"][0]["FILE_ID_STATE"],function(data2){
						if(data2.rows.length>0){
							defaultShowFileInfo(data["rows"][0]["FILE_ID_STATE"],getCurrentPageObj().find("#file_button_state").parent(),data2,true,"updateRankFileDivState");
						}
					});
				}
				
				getCurrentPageObj().find("#group_manager_project").val(data["rows"][0]["GROUP_MANAGER_PROJECT"]);
				getCurrentPageObj().find("#core_manager").val(data["rows"][0]["CORE_MANAGER"]);
			}
			if(data["rankPerson"]!=undefined&&data["rankPerson"]!=null&&data["rankPerson"]!=""){
				for(var i=0;i<data["rankPerson"].length;i++){
	    			rankPerson =data["rankPerson"][i];
	    			 var tr="<tr id=\"rankOutperson_"+k+"\"   >"+
	    			 //姓名
	    			 "<td ><input type='hidden' id='op_code"+k+"' name='op_code'>" +
	    			 	  "<input type='text' id='op_name"+k+"' name='op_name'  onclick='chooseUpGradePer("+k+")' readonly ></td>"+
	    			 //所在项目
	    			// "<td ><input id='own_project"+k+"' name='own_project' readonly /></td>"+
	    			 	  //所属应用
	    			 	  "<td ><input id='op_belongsystem_name"+k+"' name='op_belongsystem_name' readonly /></td>"+
	    			 //考核分数
	    			/* "<td ><input id='check_score"+k+"' name='check_score' readonly /></td>"+*/
	    			 //申请资质
	    			 /* "<td ><select type=\"text\"   name=\"op_protocol_level\" id=\"op_protocol_level"+k+"\" onchange=\"selectUpGradeProLevel(this.value,"+k+");\" ></select></td>"+*/
	    			 "<td ><input type=\"hidden\" name=\"op_protocol_level\" id=\"op_protocol_level"+k+"\" />" +
	    			 	"<input type=\"text\" id=\"op_level_name"+k+"\"  style='width:100px;'  readonly /></td>"+
	    			 //原有级别
	    			 "<td ><input id='original_grade"+k+"' name='original_grade' readonly  style='width:100px;' /></td>"+
	    			 //申请级别
	    			 "<td ><select type=\"text\"   name=\"apply_grade\" id=\"apply_grade"+k+"\"   ></select></td>"+
	    			 //公司名称
	    			 "<td ><input type=\"text\" name=\"op_company\" id=\"op_company"+k+"\"   readonly /></td>"+
	    			 //评定日期
	    			 "<td ><input type=\"text\" name=\"evaluate_date\" id=\"evaluate_date"+k+"\"  onClick=\"WdatePicker({})\" readonly  /></td>"+
	    			 //删除按钮
	    			 "<td ><a onclick=\"delUpGradePer('"+k+"');\" name=\"assOutperson_del_"+k+"\" id=\"assOutperson_del_"+k+"\" >删除</button></a></tr>";
	    			 //
	    			getCurrentPageObj().find("#rankUpGradeTable").append(tr);
//	    			initSelect(getCurrentPageObj().find("#op_protocol_level"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_QULITY_LEVEL"},rankPerson["OP_PROTOCOL_LEVEL"]);
//	    			initSelect(getCurrentPageObj().find("#apply_grade"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:rankPerson["OP_PROTOCOL_LEVEL"]},rankPerson["APPLY_GRADE"]);
//	    			initSelect(getCurrentPageObj().find("#op_protocol_level"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
	    			for (var p in rankPerson ){
	    				if(p == 'OP_PROTOCOL_GRADE'){ 
	    					initSelect(getCurrentPageObj().find("#apply_grade"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},rankPerson[p]);
						}
	    				if(p.toLowerCase()=='level_name'){
	    					getCurrentPageObj().find("#op_"+p.toLowerCase()+k).val(rankPerson[p]);
	    				}
	    				getCurrentPageObj().find("#"+p.toLowerCase()+k).val(rankPerson[p]);
	    			}
	    			//序号自增
	    			k++;
	    		}
			}
		},call);
	}else{
		//当前登录人
		getCurrentPageObj().find("#Up_opt_manager").val($("#currentLoginName").val());
		//当前日期
		getCurrentPageObj().find("#Up_rank_apply_time").val(getCurrentYMD());
		//所属职能
		getCurrentPageObj().find("#apply_group").val($("#u_extend1_name").val());
		//所属职能
		getCurrentPageObj().find("#group_code").val($("#u_extend1").val());
		getCurrentPageObj().find("input[name='UPG.group_code']").val($("#currentLoginNoOrg_no").val());
		getCurrentPageObj().find("#apply_group").val($("#currentLoginNoOrg_name").val());
	}
	//新增按钮点击事件
	var obj1=getCurrentPageObj().find("#outpersoUpGrade_add");
	obj1.unbind();
	obj1.click(function(){
		 var tr="<tr id=\"rankOutperson_"+k+"\" name=\"n\" >"+
		 //姓名
		 "<td ><input type='hidden' id='op_code"+k+"' name='op_code'>" +
		 	  "<input type='text' id='op_name"+k+"' name='op_name'  onclick='chooseUpGradePer("+k+")' readonly /></td>"+
		 //所在项目
		// "<td ><input id='own_project"+k+"' name='own_project' readonly /></td>"+
		 	  //所属应用
		 	 "<td ><input id='op_belongsystem_name"+k+"' name='op_belongsystem_name' readonly /></td>"+
		 //考核分数
		/* "<td ><input id='check_score"+k+"' name='check_score' readonly /></td>"+*/
		 //申请资质
		 /* "<td ><select type=\"text\"   name=\"op_protocol_level\" id=\"op_protocol_level"+k+"\" onchange=\"selectUpGradeProLevel(this.value,"+k+");\" ></select></td>"+*/
		 "<td ><input type=\"hidden\" name=\"op_protocol_level\" id=\"op_protocol_level"+k+"\" />" +
		 	"<input type=\"text\" id=\"op_level_name"+k+"\"  style='width:100px;'  readonly /></td>"+
		 //原有级别
		 "<td ><input id='original_grade"+k+"' name='original_grade'  style='width:100px;'  readonly  /></td>"+
		 //申请级别
		 "<td ><select type=\"text\"   name=\"apply_grade\" id=\"apply_grade"+k+"\"   ></select></td>"+
		 //公司名称
		 "<td ><input type=\"text\" name=\"op_company\" id=\"op_company"+k+"\"  readonly  /></td>"+
		 //评定日期
		 "<td ><input type=\"text\" name=\"evaluate_date\" id=\"evaluate_date"+k+"\" readonly onClick=\"WdatePicker({})\"   /></td>"+
		 //删除按钮
		 "<td ><a onclick=\"delUpGradePer('"+k+"');\" name=\"assOutperson_del_"+k+"\" id=\"assOutperson_del_"+k+"\" >删除</button></a></tr>";
		 //
		 getCurrentPageObj().find("#rankUpGradeTable").append(tr);
//		 initSelect(getCurrentPageObj().find("#op_protocol_level"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_QULITY_LEVEL"});
//		 initSelect(getCurrentPageObj().find("#op_protocol_level"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
		 initSelect(getCurrentPageObj().find("#apply_grade"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"});
		 //序号自增
		 k++;
		 initVlidate(getCurrentPageObj().find("#rankUpGradeTable"));
	});
	  
	//当申请职能组改变时清空拟引入人员情况表
	getCurrentPageObj().find("#apply_group").click(function(){
		  	getCurrentPageObj().find("tr[name^='n']").remove();
	});
	//附件（人员情况说明表）
	getCurrentPageObj().find("#file_button_state").click(function(){
		var file_id = getCurrentPageObj().find("#file_id_state").val();
		if(""==$.trim(file_id)){
			getCurrentPageObj().find("#file_id_state").val(Math.uuid());
		}
		openFileUploadInfo('file_id_state','OUTPERSON_RANK',getCurrentPageObj().find("#file_id_state").val(),function(data){
			defaultShowFileInfo(getCurrentPageObj().find("#file_id_state").val(),getCurrentPageObj().find("#file_button_state").parent(),data,true,"addRankFileDivState");
		});
	});
	//附件（S/E级说明文档）
/*	getCurrentPageObj().find("#file_button_SE").click(function(){
		var file_id = getCurrentPageObj().find("#file_id_SE").val();
		if(""==$.trim(file_id)){
			getCurrentPageObj().find("#file_id_SE").val(Math.uuid());
		}
		openFileUploadInfo('file_id_SE','OUTPERSON_RANK',getCurrentPageObj().find("#file_id_SE").val(),function(data){
			defaultShowFileInfo(getCurrentPageObj().find("#file_id_SE").val(),getCurrentPageObj().find("#file_button_SE").parent(),data,true,"addRankFileDivSE");
		});
	});*/
	//保存
	var obj=getCurrentPageObj().find("#rankUpGrade_optSave");
	obj.unbind("click");
	obj.click(function(){
		var state="save";
		saveRankUpGradeInfo(state);
	});
	//保存并提交
	var obj2=getCurrentPageObj().find("#rankUpGrade_optSubmit");
	obj2.unbind("click");
	obj2.click(function(){
		var state="submit";
		saveRankUpGradeInfo(state);
	});
}

//保存、修改、保存并提交方法（通过state判断）
function saveRankUpGradeInfo(state){
	if(vlidate(getCurrentPageObj(),"",false)){
		
		var inputs = $("input[name^='UPG.']");
		var select = $("select[name^='UPG.']");
		var text = $("textarea[name^='UPG.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(4)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(4)] = obj.val();
		}
		for(var i = 0; i < text.length; i++){
			var obj = $(text[i]);
			params[obj.attr("name").substr(4)] = obj.val();
		}
		var dataJSON = new Array;
		var trs=getCurrentPageObj().find("#rankUpGradeTable tr:gt(0)");
		if(trs.length<=0){
			alert("至少添加一条人员信息!");
			return;
		}
		var s='';
		for(var i=0;i<trs.length;i++){
			var op_code=$(trs[i]).find("input[name='op_code']").val();//身份证号
			var op_name=$(trs[i]).find("input[name='op_name']").val();//姓名
//			var own_project=$(trs[i]).find("input[name='own_project']").val();//所在项目
			var op_belongsystem_name=$(trs[i]).find("input[name='op_belongsystem_name']").val();//所属应用
//			var check_score=$(trs[i]).find("input[name='check_score']").val();//考核分数
			var original_grade=$(trs[i]).find("input[name='original_grade']").val();//原有级别
//			var op_protocol_level=$(trs[i]).find("select[name='op_protocol_level']").val();//申请资质
			var op_protocol_level=$(trs[i]).find("input[name='op_protocol_level']").val();//申请资质
			var apply_grade=$(trs[i]).find("select[name='apply_grade']").val();//申请级别
//			if(op_protocol_level!=undefined&&op_protocol_level!=null&&op_protocol_level!=""){
//				var op_protocol_level_type=typeof(op_protocol_level);
//				if(op_protocol_level_type=='object'){
//					op_protocol_level=op_protocol_level[0];
//				}
//			}
			if(apply_grade!=undefined&&apply_grade!=null&&apply_grade!=""){
				var apply_grade_type=typeof(apply_grade);
				if(apply_grade_type=='object'){
					apply_grade=apply_grade[0];
				}
			}
//			if(op_protocol_level=="C_DIC_OUTPERSION_QULITY_LEVEL_S"){
//				s='1';
//			}
			var op_company=$(trs[i]).find("input[name='op_company']").val();//公司名称
			var evaluate_date=$(trs[i]).find("input[name='evaluate_date']").val();//评定日期
			if ($.trim(op_name) == "" || op_name == undefined || op_name == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行人员姓名！");
				return;
			}
			if ($.trim(op_protocol_level) == "" || op_protocol_level == undefined || op_protocol_level == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行开发方向！");
				return;
			}
			if ($.trim(apply_grade) == "" || apply_grade == undefined || apply_grade == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行人员级别！");
				return;
			}
			if ($.trim(evaluate_date) == "" || evaluate_date == undefined || evaluate_date == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行评定日期！");
				return;
			}
			var datarows = {};
			datarows.op_code = op_code.toString();
			datarows.op_name = op_name.toString();
//			datarows.own_project = own_project.toString();
			datarows.op_belongsystem_name = op_belongsystem_name.toString();
//			datarows.check_score = check_score.toString();
			datarows.original_grade = original_grade.toString();
			datarows.op_protocol_level=op_protocol_level.toString();
			datarows.apply_grade=apply_grade.toString();
			datarows.op_company=op_company.toString();
			datarows.evaluate_date=evaluate_date.toString();
			dataJSON.push(datarows);
		}
		var DataJSON=JSON.stringify(dataJSON);
		var call = getMillisecond();
		baseAjax("sfile/findFileInfo.asp?file_id="+params["file_id_state"],null,function(data){
//			if(data.result == 'false'){
//				alert("请上传人员情况说明文档！");
//				return ;
//			}else{
				if(s=='1'){
					var call = getMillisecond();
//					baseAjax("sfile/findFileInfo.asp?file_id="+params["file_id_SE"],null,function(data){
//						if(data.rows.length==0){
//							alert("职级评定为S级，请上传S级说明文档！");
//							return ;
//						}else{
							params["DataJSON"]=DataJSON;
							params["flag"]="2";
							if("save"==state){
								var call = getMillisecond();
								baseAjaxJsonp(dev_outsource+'outperson/addOutPersonRank.asp?call='+call+'&SID='+SID,params,function(data){
									if(!data||!data.result||data.result=="false"){
										alert("保存失败!");
										return;
									}else{
										alert("保存成功!");
										closeCurrPageTab();
										getCurrentPageObj().find("#outpersonTableInfoRank").bootstrapTable("refresh");
									}
								},call);
							}else{//保存并提交
								var rank_id = new Array();
								rank_id.push(getCurrentPageObj().find("#rank_id").val());
								params["rank_id"]=rank_id.join(",");
								params["requestWay"]="batch";
								nconfirm("确定需要发起职级评定申请么？",function(){
										var call = getMillisecond();
										baseAjaxJsonp(dev_outsource+'outperson/applyOutPersonUpGrade.asp?call='+call+'&SID='+SID,params,function(data){
											var items = {};
											items["af_id"] = '182';//流程id
											items["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：04,外包管理）
											items["biz_id"] = data.id;//业务id
											items["group_manager_project"] = getCurrentPageObj().find("#group_manager_project").val();//项目组长id
											items["core_manager"] = getCurrentPageObj().find("#core_manager").val();//中心负责人id
											approvalProcess(items,function(data){
												if(data!=null){
													alert("职级评定申请成功");
													closeCurrPageTab();
													getCurrentPageObj().find("#outpersonTableInfoRank").bootstrapTable("refresh");
												}
											});
										},call);							
									
								});
							}
//						}
//					});
				}else{
					params["DataJSON"]=DataJSON;
					params["flag"]="2";
					if("save"==state){
						var call = getMillisecond();
						baseAjaxJsonp(dev_outsource+'outperson/addOutPersonRank.asp?call='+call+'&SID='+SID,params,function(data){
							if(!data||!data.result||data.result=="false"){
								alert("保存失败!");
								return;
							}else{
								alert("保存成功!");
								closeCurrPageTab();
								getCurrentPageObj().find("#outpersonTableInfoRank").bootstrapTable("refresh");
							}
						},call);
					}else{//保存并提交
						var rank_id = new Array();
						rank_id.push(getCurrentPageObj().find("#rank_id").val());
						params["rank_id"]=rank_id.join(",");
						params["requestWay"]="batch";
						nconfirm("确定需要发起职级评定申请么？",function(){
							var	uuid = Math.uuid();
								var call = getMillisecond();
								baseAjaxJsonp(dev_outsource+'outperson/applyOutPersonUpGrade.asp?call='+call+'&SID='+SID,params,function(data){
									var items = {};
									items["af_id"] = '182';//流程id
									items["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：04,外包管理）
									items["biz_id"] = data.id;//业务id
									items["group_manager_project"] = getCurrentPageObj().find("#group_manager_project").val();//项目组长id
									items["core_manager"] = getCurrentPageObj().find("#core_manager").val();//中心负责人id
									approvalProcess(items,function(data){});
									if(data!=null){
										alert("职级评定申请成功！");
										closeCurrPageTab();
										getCurrentPageObj().find("#outpersonTableInfoRank").bootstrapTable("refresh");
									}else if(data!=null){
										alert(data.message);
										return;
									}
								},call);								
						});
					}
				}
				
//			}
		});

		
	}
}

//级联加载拟定级别
function selectUpGradeProLevel(e,k){
	initSelect(getCurrentPageObj().find("#apply_grade"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}

//删除人员行
function delUpGradePer(row){
	getCurrentPageObj().find("#rankOutperson_"+row).remove();
	
}

//选择人员pop框
function chooseUpGradePer(k){
	var op_codeStr="";
	var trs=getCurrentPageObj().find("#rankUpGradeTable tr:gt(0)");
	for(var i=0;i<trs.length;i++){
		if(i==trs.length-1){
			op_codeStr=op_codeStr+$(trs[i]).find("input[name='op_code']").val();
		}else{
			if(op_codeStr==""){
				op_codeStr=op_codeStr+$(trs[i]).find("input[name='op_code']").val()
			}else{
				op_codeStr=op_codeStr+$(trs[i]).find("input[name='op_code']").val()+",";
			}
		}
	}
	var op_company = getCurrentPageObj().find("#op_company"+k);
//	var own_project = getCurrentPageObj().find("#own_project"+k);//所在项目
	var op_belongsystem_name = getCurrentPageObj().find("#op_belongsystem_name"+k);//所属应用
//	var check_score = getCurrentPageObj().find("#check_score"+k);//考核分数
	var original_grade = getCurrentPageObj().find("#original_grade"+k);//原有级别
	var op_name = getCurrentPageObj().find("#op_name"+k);
	var op_code = getCurrentPageObj().find("#op_code"+k);
	var apply_grade = getCurrentPageObj().find("#apply_grade"+k);
	var op_protocol_level = getCurrentPageObj().find("#apply_grade"+k);
	var op_office = getCurrentPageObj().find("#group_code").val();
	$('#chooseUpRankPersonPop').modal('show');
	getCurrentPageObj().find("#op_name").val("");
	getCurrentPageObj().find("#sup_name").val(" ");
//	getCurrentPageObj().find("#iscanlevelup").select2();
//	initSelect(getCurrentPageObj().find("#iscanlevelup"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_YN"});
	var queryParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	var call = getMillisecond();
	getCurrentPageObj().find("#chooseUpPersonPopTable").bootstrapTable("destroy").bootstrapTable({
				url : dev_outsource+'outperson/queryRankPerson.asp?op_code='+op_codeStr+'&flag2=2'+'&call='+call+'&SID='+SID+'&op_office='+op_office+'&op_state=01',//请求后台的URL（*）
				//url : dev_outsource+'outperson/queryRankPerson.asp?op_code='+op_codeStr+'&call='+call+'&SID='+SID,//请求后台的URL（*）
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "OP_CODE", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:call,
				onDblClickRow:function(row){
					getCurrentPageObj().find('#chooseUpRankPersonPop').modal('hide');
						if(op_company)op_company.val(row.SUPPLIER_NAME);
//						if(own_project)own_project.val(row.BELONGPROJECT);
						if(op_belongsystem_name)op_belongsystem_name.val(row.OP_BELONGSYSTEM_NAME);
						if(original_grade)original_grade.val(row.OP_GRADE_NAME);
//						if(check_score)check_score.val(row.SCORE);
						if(op_name)op_name.val(row.OP_NAME);
						if(op_code)op_code.val(row.OP_CODE);
//						if(op_protocol_level)op_protocol_level.val(row.QUALIFICATE_LEVEL);
//						if(apply_grade)apply_grade.val(row.OP_CODE);
//		    			initSelect(getCurrentPageObj().find("#op_protocol_level"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},row.DEV_DIRECTION);
		    			getCurrentPageObj().find("#op_protocol_level"+k).val(row.DEV_DIRECTION);
		    			getCurrentPageObj().find("#op_level_name"+k).val(row.QUALIFICATE_LEVEL_NAME);
//		    			initSelect(getCurrentPageObj().find("#apply_grade"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},row.DEV_GRADE);
		    			getCurrentPageObj().find("#evaluate_date"+k).val(getCurrentYMD());
		    			getCurrentPageObj().find("#group_manager_project").val(row.GROUP_MANAGER_PROJECT);
						getCurrentPageObj().find("#core_manager").val(row.CORE_MANAGER);
				},
				columns : [ {
					field: 'middle',
					checkbox: false,
					rowspan: 2,
					align: 'center',
					valign: 'middle',
					visible : false
				},{
					field : 'abcdef',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
	        			  return index+1;
		        	  }
				},{
					field : 'OP_CODE',
					title : '身份证号',
					align : "center"
				},{
					field : 'OP_NAME',
					title : '姓名',
					align : "center"
				},{
					field : 'QUALIFICATE_LEVEL_NAME',
					title : '开发方向',
					align : "center"
				},{
					field : 'OP_GRADE_NAME',
					title : '人员级别',
					align : "center"
				},{
					field : 'STATUS',
					title : '人员状态',
					align : "center"
				}, {
					field : "SEX",
					title : "性别",
					align : "center",
				}, {
					field : "SUPPLIER_NAME",
					title : "供应商名称",
					align : "center",
				},  {
					field : "ORG_NAME",
					title : "行内归属部门",
					align : "center"
				},   {
					field : "OP_BELONGSYSTEM_NO",
					title : "所属应用编号",
					align : "center",
					visible : false
				},   {
					field : "OP_BELONGSYSTEM_NAME",
					title : "所属应用",
					align : "center"
				},  {
				field : "SCORE",
					title : "考核分数",
					align : "center",
					visible : false
				},  {
					field : "ISCANLEVELUP",
					title : "是否可升级",
					align : "center",
					visible : false
				}]
			},call);
	//人员pop右上角的“x”
	$("#modalCloseUp").click(function(){
		$('#chooseUpRankPersonPop').modal('hide');
	});
	//谈判及合同POP重置
	$("#pop_UpGradeReset").click(function(){
		getCurrentPageObj().find("#op_name").val("");
		getCurrentPageObj().find("#sup_name").val(" ");
//		getCurrentPageObj().find("#iscanlevelup").select2();
	});
	//多条件查询谈判及合同项目
	$("#pop_UpGradeSearch").click(function(){
		var op_name = getCurrentPageObj().find("#op_name").val();
		var sup_name =  $.trim(getCurrentPageObj().find("#sup_name").val());
		$("#chooseUpPersonPopTable").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryRankPerson.asp?flag2=2&op_code='+op_codeStr+"&op_name="+escape(encodeURIComponent(op_name))+
			"&sup_name="+escape(encodeURIComponent(sup_name))+'&flag2=2'+'&call='+call+'&SID='+SID+'&op_office='+op_office}
		);
	});
}
initVlidate(getCurrentPageObj());//初始化页面