var k=1;//初始化定义生成的tr编号
function addOutPersonRank(data){
	getCurrentPageObj().find("#apply_group").unbind("click");
	getCurrentPageObj().find("#apply_group").click(function(){
		openSelectTreeDivToBody($(this),"op_apply_pop_fd_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#apply_group").val(node.name);
			getCurrentPageObj().find("input[name='ADD.group_code']").val(node.id);
			
		});
	});
	if(data!=undefined&&data!=null&&data!=""){
		var call = getMillisecond();
		baseAjaxJsonp(dev_outsource+"outperson/queryOneOutPersonRankInfo.asp?id="+data+'&call='+call+'&SID='+SID,null,function(data){
			if(data["rows"]!=undefined&&data["rows"]!=null&&data["rows"]!=""){
				getCurrentPageObj().find("#rank_id").val(data["rows"][0].ID);
				getCurrentPageObj().find("#apply_group").val(data["rows"][0].APPLY_GROUP);
				getCurrentPageObj().find("#group_code").val(data["rows"][0].GROUP_CODE);
				getCurrentPageObj().find("#Add_opt_manager").val(data["rows"][0].OPT_MANAGER);
				getCurrentPageObj().find("#Add_rank_apply_time").val(data["rows"][0].RANK_APPLY_TIME);
				getCurrentPageObj().find("#apply_reason").val(data["rows"][0].APPLY_REASON);
				//附件（S/E级说明文档）
/*				if(data["rows"][0]["FILE_ID_SE"]&&$.trim(data["rows"][0]["FILE_ID_SE"])!=""){
					getCurrentPageObj().find("#file_id_SE").val(data["rows"][0]["FILE_ID_SE"]);
					findFileInfo(data["rows"][0]["FILE_ID_SE"],function(data1){
						if(data1.rows.length>0){
							defaultShowFileInfo(data["rows"][0]["FILE_ID_SE"],getCurrentPageObj().find("#file_button_SE").parent(),data1,true,"updateRankFileDivSe");
						}
					});
   				} */
				//附件（人员简历）
   				if (data["rows"][0]["FILE_ID_SON"]&&$.trim(data["rows"][0]["FILE_ID_SON"])!=""){
   					getCurrentPageObj().find("#file_id_son").val(data["rows"][0]["FILE_ID_SON"]);
					findFileInfo(data["rows"][0]["FILE_ID_SON"],function(data2){
						if(data2.rows.length>0){
							defaultShowFileInfo(data["rows"][0]["FILE_ID_SON"],getCurrentPageObj().find("#file_button_son").parent(),data2,true,"updateRankFileDivSon");
						}
					});
   				}
				getCurrentPageObj().find("#agroup_manager_project").val(data["rows"][0]["GROUP_MANAGER_PROJECT"]);
				getCurrentPageObj().find("#acore_manager").val(data["rows"][0]["CORE_MANAGER"]);
			}
			if(data["rankPerson"]!=undefined&&data["rankPerson"]!=null&&data["rankPerson"]!=""){
				for(var i=0;i<data["rankPerson"].length;i++){
	    			rankPerson =data["rankPerson"][i];
	    			 var tr="<tr id=\"rankOutperson_"+k+"\"   >"+
	    			 //姓名
	    			 "<td ><input type='hidden' id='op_code"+k+"' name='op_code'>" +
	    			 	  "<input type='text' id='op_name"+k+"' name='op_name'  onclick='chooseOneRankPerson("+k+")' readonly ></td>"+
	    			 //特长
	    			 "<td ><input type=\"text\" name=\"op_speciality\" id=\"op_speciality"+k+"\"    /></td>"+
	    			 //笔试/面试成绩
	    	/*		 "<td ><input id='op_grade"+k+"' name='op_grade'  /></td>"+*/
	    			 //拟定资质
	    		/*	 "<td ><select type=\"text\"   name=\"op_protocol_level\" id=\"op_protocol_level"+k+"\" onchange=\"selectProtocolLevel(this.value,"+k+");\" ></select></td>"+*/
	    			 "<td ><select type=\"text\"   name=\"op_protocol_level\" id=\"op_protocol_level"+k+"\" ></select></td>"+
	    			 //拟定级别
	    			 "<td ><select type=\"text\"   name=\"op_protocol_grade\" id=\"op_protocol_grade"+k+"\"   ></select></td>"+
	    			 //试用期
	    			 "<td ><input type=\"text\" name=\"op_probation\" id=\"op_probation"+k+"\"    /></td>"+
	    			 //公司名称
	    			 "<td ><input type=\"text\" name=\"op_company\" id=\"op_company"+k+"\"   readonly /></td>"+
	    			 //评定日期
	    			 "<td ><input type=\"text\" name=\"evaluate_date\" id=\"evaluate_date"+k+"\"  onClick=\"WdatePicker({})\" readonly  /></td>"+
	    			 //建议执行价格
	    	/*		 "<td ><input id='advice_price"+k+"' name='advice_price'  /></td>"+*/
	    			 //实际报到时间
	    			 "<td ><input type=\"text\" name=\"actually_time\" id=\"actually_time"+k+"\"  onClick=\"WdatePicker({})\" readonly  /></td>"+
	    			 //删除按钮
	    			 "<td ><a onclick=\"delRankPerson('"+k+"');\" name=\"assOutperson_del_"+k+"\" id=\"assOutperson_del_"+k+"\" >删除</button></a></tr>";
	    			 //
	    			getCurrentPageObj().find("#outpersonRankInfoTable").append(tr);
	    			initSelect(getCurrentPageObj().find("#op_protocol_level"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},rankPerson["OP_PROTOCOL_LEVEL"]);
	    			initSelect(getCurrentPageObj().find("#op_protocol_grade"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},rankPerson["OP_PROTOCOL_GRADE"]);
	    			for (var p in rankPerson ){
	    					getCurrentPageObj().find("#"+p.toLowerCase()+k).val(rankPerson[p]);
	    			}
	    			//序号自增
	    			k++;
	    		}
			}
		},call);
	}else{
		//当前登录人
		getCurrentPageObj().find("#Add_opt_manager").val($("#currentLoginName").val());
		//当前日期
		getCurrentPageObj().find("#Add_rank_apply_time").val(getCurrentYMD());
		//所属职能
		getCurrentPageObj().find("#apply_group").val($("#u_extend1_name").val());
		//所属职能编号
		getCurrentPageObj().find("#group_code").val($("#u_extend1").val());
	}
	//新增按钮点击事件
	var obj1=getCurrentPageObj().find("#outpersonInfo_add");
	obj1.unbind();
	obj1.click(function(){
		 var tr="<tr id=\"rankOutperson_"+k+"\" name=\"n\" >"+
		 //姓名
		 "<td ><input type='hidden' id='op_code"+k+"' name='op_code'>" +
		 	  "<input type='text' id='op_name"+k+"' name='op_name'  onclick='chooseOneRankPerson("+k+")' readonly /></td>"+
		 //特长
		 "<td ><input \"text\" id='op_speciality"+k+"' name='op_speciality'  /></td>"+
		 //笔试/面试成绩
/*		 "<td ><input id='op_grade"+k+"' name='op_grade'  /></td>"+*/
		 //拟定资质
		/* "<td ><select type=\"text\"   name=\"op_protocol_level\" id=\"op_protocol_level"+k+"\" onchange=\"selectProtocolLevel(this.value,"+k+");\" ></select></td>"+*/
		 "<td ><select type=\"text\"   name=\"op_protocol_level\" id=\"op_protocol_level"+k+"\"></select></td>"+
		 //拟定级别
		 "<td ><select type=\"text\"   name=\"op_protocol_grade\" id=\"op_protocol_grade"+k+"\"   ></select></td>"+
		 //试用期
		 "<td ><input type=\"text\" name=\"op_probation\" id=\"op_probation"+k+"\"    /></td>"+
		 //公司名称
		 "<td ><input type=\"text\" name=\"op_company\" id=\"op_company"+k+"\"  readonly  /></td>"+
		 //评定日期
		 "<td ><input type=\"text\" name=\"evaluate_date\" id=\"evaluate_date"+k+"\" readonly onClick=\"WdatePicker({})\"   /></td>"+
		 //特长
/*		 "<td ><input id='advice_price"+k+"' name='advice_price'  /></td>"+*/
		 //实际报到时间
		 "<td ><input type=\"text\" name=\"actually_time\" id=\"actually_time"+k+"\" readonly onClick=\"WdatePicker({})\"   /></td>"+
		 //删除按钮
		 "<td ><a onclick=\"delRankPerson('"+k+"');\" name=\"assOutperson_del_"+k+"\" id=\"assOutperson_del_"+k+"\" >删除</button></a></tr>";
		 //
		 getCurrentPageObj().find("#outpersonRankInfoTable").append(tr);
		 initSelect(getCurrentPageObj().find("#op_protocol_level"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
		 initSelect(getCurrentPageObj().find("#op_protocol_grade"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"});
		 //序号自增
		 k++;
		 initVlidate(getCurrentPageObj().find("#outpersonRankInfoTable"));
	});
	//附件（人员简历）
	getCurrentPageObj().find("#file_button_son").click(function(){
		var file_id = getCurrentPageObj().find("#file_id_son").val();
		if(""==$.trim(file_id)){
			getCurrentPageObj().find("#file_id_son").val(Math.uuid());
		}
		openFileUploadInfo('file_id_son','OUTPERSON_RANK',getCurrentPageObj().find("#file_id_son").val(),function(data){
			defaultShowFileInfo(getCurrentPageObj().find("#file_id_son").val(),getCurrentPageObj().find("#file_button_son").parent(),data,true,"addRankFileDiv");
		});
	});
/*	//附件（S/E说明文档）
	getCurrentPageObj().find("#file_button_SE").click(function(){
		var file_id = getCurrentPageObj().find("#file_id_SE").val();
		if(""==$.trim(file_id)){
			getCurrentPageObj().find("#file_id_SE").val(Math.uuid());
		}
		openFileUploadInfo('file_id_SE','OUTPERSON_RANK',getCurrentPageObj().find("#file_id_SE").val(),function(data){
			defaultShowFileInfo(getCurrentPageObj().find("#file_id_SE").val(),getCurrentPageObj().find("#file_button_SE").parent(),data,true,"addRankFileDiv");
		});
	});*/
	
	//保存
	var obj=getCurrentPageObj().find("#rank_optSave");
	obj.unbind("click");
	obj.click(function(){
		var state="save";
		saveRankInfo(state);
	});
	//保存并提交
	var obj2=getCurrentPageObj().find("#rank_optSubmit");
	obj2.unbind("click");
	obj2.click(function(){
		var state="submit";
		saveRankInfo(state);
	});
}
var reg = new RegExp("^([0-9])+(.[0-9]{1,2})?$");
//保存、修改、保存并提交方法（通过state判断）
function saveRankInfo(state){
	if(vlidate(getCurrentPageObj(),"",false)){
		var inputs = $("input[name^='ADD.']");
		var select = $("select[name^='ADD.']");
		var text = $("textarea[name^='ADD.']");
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
		var trs=getCurrentPageObj().find("#outpersonRankInfoTable tr:gt(0)");
		if(trs.length<=0){
			alert("至少添加一条人员信息!");
			return;
		}
		var es='';
		for(var i=0;i<trs.length;i++){
			var op_code=$(trs[i]).find("input[name='op_code']").val();
			var op_name=$(trs[i]).find("input[name='op_name']").val();
			var op_speciality=$(trs[i]).find("input[name='op_speciality']").val();
			var advice_price=$(trs[i]).find("input[name='advice_price']").val();
			var op_grade=$(trs[i]).find("input[name='op_grade']").val();
			var op_protocol_level=$(trs[i]).find("select[name='op_protocol_level']").val();
			var op_protocol_grade=$(trs[i]).find("select[name='op_protocol_grade']").val();
			if(op_protocol_level!=undefined&&op_protocol_level!=null&&op_protocol_level!=""){
				var op_protocol_level_type=typeof(op_protocol_level);
				if(op_protocol_level_type=='object'){
					op_protocol_level=op_protocol_level[0];
				}
			}
			if(op_protocol_grade!=undefined&&op_protocol_grade!=null&&op_protocol_grade!=""){
				var op_protocol_grade_type=typeof(op_protocol_grade);
				if(op_protocol_grade_type=='object'){
					op_protocol_grade=op_protocol_grade[0];
				}
			}
/*			if(op_protocol_level=="C_DIC_OUTPERSION_QULITY_LEVEL_E"&&(advice_price==undefined||advice_price==null||advice_price=="")){
				alert("请填写拟引入人员情况第" + (i + 1) + "行E级人员建议执行价格！");
				return;
			}*/
			if(op_protocol_level=="C_DIC_OUTPERSION_QULITY_LEVEL_E"||op_protocol_level=="C_DIC_OUTPERSION_QULITY_LEVEL_S"){
				es='1';
			}
			var op_probation=$(trs[i]).find("input[name='op_probation']").val();
			var op_company=$(trs[i]).find("input[name='op_company']").val();
			var evaluate_date=$(trs[i]).find("input[name='evaluate_date']").val();
			var actually_time=$(trs[i]).find("input[name='actually_time']").val();
			if ($.trim(op_name) == "" || op_name == undefined || op_name == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行人员姓名！");
				return;
			}
			if ($.trim(op_speciality) == "" || op_speciality == undefined || op_speciality == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行特长！");
				return;
			}
/*			if ($.trim(op_grade) == "" || op_grade == undefined || op_grade == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行笔试/面试成绩！");
				return;
			}*/
			if ($.trim(op_protocol_level) == "" || op_protocol_level == undefined || op_protocol_level == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行开发方向！");
				return;
			}
			if ($.trim(op_protocol_grade) == "" || op_protocol_grade == undefined || op_protocol_grade == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行人员级别！");
				return;
			}
			if ($.trim(op_probation) == "" || op_probation == undefined || op_probation == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行试用期！");
				return;
			}
			if ($.trim(evaluate_date) == "" || evaluate_date == undefined || evaluate_date == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行评定日期！");
				return;
			}
			if ($.trim(actually_time) == "" || actually_time == undefined || actually_time == null) {
				alert("请填写拟引入人员情况第" + (i + 1) + "行实际报到时间！");
				return;
			}
/*			if(advice_price!=undefined&&advice_price!=null&&advice_price!=""&&!reg.test(advice_price)){
				alert("第"+(i+1)+"行建议执行价格，请填写保留两位小数的数字！");
				return;
			}*/
			var datarows = {};
			datarows.op_code = op_code.toString();
			datarows.op_name = op_name.toString();
			datarows.op_speciality=op_speciality.toString();
//			datarows.advice_price=advice_price.toString();
//			datarows.op_grade=op_grade.toString();
			datarows.op_protocol_grade=op_protocol_grade.toString();
			datarows.op_probation=op_probation.toString();
			datarows.op_company=op_company.toString();
			datarows.evaluate_date=evaluate_date.toString();
			datarows.actually_time=actually_time.toString();
			datarows.op_protocol_level=op_protocol_level.toString();
			dataJSON.push(datarows);
		}
		var DataJSON=JSON.stringify(dataJSON);
		var call = getMillisecond();
		baseAjax("sfile/findFileInfo.asp?file_id="+params["file_id_son"],null,function(data){
//		baseAjaxJsonp(dev_outsource+"outperson/judgeFile.asp?file_id="+params["file_id_son"]+'&call='+call+'&SID='+SID,null,function(data){
			if(data.rows.length==0){
				alert("请上传人员简历！");
				return;
			}else{
				if(es=='1'){
					var call = getMillisecond();
					baseAjax("sfile/findFileInfo.asp?file_id="+params["file_id_SE"],null,function(data){
						if(data.rows.length==0){
							alert("职级评定为S/E级，请上传S/E级说明文档！");
							return ;
						}else{
							params["DataJSON"]=DataJSON;
							params["flag"]="1";
							if("save"==state){
								var call = getMillisecond();
								baseAjaxJsonp(dev_outsource+'outperson/addOutPersonRank.asp?call='+call+'&SID='+SID,params,function(data){
									if(!data||!data.result||data.result=="false"){
										alert((data.msg||"保存失败!"));
									}else{
										alert("保存成功!");
										closeCurrPageTab();
									}
								},call);
							}else{
								var rank_id=getCurrentPageObj().find("#rank_id").val();
								params["rank_id"]=rank_id;
								params["requestWay"]="batch";
								nconfirm("确定需要发起职级评定申请么？",function(){
									var call = getMillisecond();
									baseAjaxJsonp(dev_outsource+'outperson/applyOutPersonlevel.asp?call='+call+'&SID='+SID,params,function(data){
										var id = data.id;
										var call_or = getMillisecond();
										baseAjaxJsonp(dev_outsource+"outperson/queryOneOutPersonRankInfo.asp?id="+id+'&call='+call_or+'&SID='+SID,null,function(data1){
											var items = {};
											items["af_id"] = '182';//流程id
											items["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：04,外包管理）
											items["biz_id"] = data1["rows"][0].ID;//业务id
											items["group_manager_project"] = data1["rows"][0]["GROUP_MANAGER_PROJECT"];//项目组长id
											items["core_manager"] = data1["rows"][0]["CORE_MANAGER"];//中心负责人id
											approvalProcess(items,function(data2){});
										},call_or);
										if(data!=null){
											alert("职级评定申请成功");
											closeCurrPageTab();
										}
									},call);
								});
							}
						}
					});
				}else{
					params["DataJSON"]=DataJSON;
					params["flag"]="1";
					if("save"==state){
						var call = getMillisecond();
						baseAjaxJsonp(dev_outsource+'outperson/addOutPersonRank.asp?call='+call+'&SID='+SID,params,function(data){
							if(!data||!data.result||data.result=="false"){
								alert("保存失败!");
							}else{
								alert("保存成功!");
								closeCurrPageTab();
							}
						},call);
					}else{
						var rank_id=getCurrentPageObj().find("#rank_id").val();
						params["rank_id"]=rank_id;
						params["requestWay"]="batch";
						nconfirm("确定需要发起职级评定申请么？",function(){
							var call = getMillisecond();
							baseAjaxJsonp(dev_outsource+'outperson/applyOutPersonlevel.asp?call='+call+'&SID='+SID,params,function(data){
								var call_or = getMillisecond();
								var id = data.id;
								baseAjaxJsonp(dev_outsource+"outperson/queryOneOutPersonRankInfo.asp?id="+id+'&call='+call_or+'&SID='+SID,null,function(data1){
									var items = {};
									items["af_id"] = '182';//流程id
									items["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：04,外包管理）
									items["biz_id"] = data1["rows"][0].ID;//业务id
									items["group_manager_project"] = data1["rows"][0]["GROUP_MANAGER_PROJECT"];//项目组长id
									items["core_manager"] = data1["rows"][0]["CORE_MANAGER"];//中心负责人id
									approvalProcess(items,function(data2){});
								},call_or);
								if(data!=null){
									alert("职级评定申请成功");
									closeCurrPageTab();
								}
							},call);
						});
					}
				}
				
			}
//		},call);
		});
	}
}
//级联加载拟定级别
function selectProtocolLevel(e,k){
	initSelect(getCurrentPageObj().find("#op_protocol_grade"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});
}
//删除人员行
function delRankPerson(row){
	getCurrentPageObj().find("#rankOutperson_"+row).remove();
}

//选择人员pop框
function chooseOneRankPerson(k){
	var op_codeStr="";
	var trs=getCurrentPageObj().find("#outpersonRankInfoTable tr:gt(0)");
	for(var i=0;i<trs.length;i++){
		if(i==trs.length-1){
			op_codeStr=op_codeStr+$(trs[i]).find("input[name='op_code']").val();
		}else{
			op_codeStr=op_codeStr+$(trs[i]).find("input[name='op_code']").val()+",";
		}

	}
	var op_company = getCurrentPageObj().find("#op_company"+k);
	var op_name = getCurrentPageObj().find("#op_name"+k);
	var op_code = getCurrentPageObj().find("#op_code"+k);
	var op_office = getCurrentPageObj().find("#group_code").val();
	$('#chooseAddRankPersonPop').modal('show');
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var call = getMillisecond();
	getCurrentPageObj().find("#chooseAddPersonPopTable").bootstrapTable("destroy").bootstrapTable({
				url : dev_outsource+'outperson/queryRankPerson.asp?op_code='+op_codeStr+'&flag1=1'+'&call='+call+'&SID='+SID+'&op_office='+op_office,//请求后台的URL（*）
//				url : dev_outsource+'outperson/queryRankPerson.asp?op_code='+op_codeStr+'&call='+call+'&SID='+SID,//请求后台的URL（*）
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
					getCurrentPageObj().find('#chooseAddRankPersonPop').modal('hide');
						if(op_company)op_company.val(row.SUPPLIER_NAME);
						if(op_name)op_name.val(row.OP_NAME);
						if(op_code)op_code.val(row.OP_CODE);
						getCurrentPageObj().find("#agroup_manager_project").val(row.GROUP_MANAGER_PROJECT);
						getCurrentPageObj().find("#acore_manager").val(row.CORE_MANAGER);
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
				}]
			});
	//人员pop右上角的“x”
	$("#modalCloseAdd").click(function(){
		$('#chooseAddRankPersonPop').modal('hide');
	});
	//谈判及合同POP重置
	$("#pop_RankAddReset").click(function(){
		getCurrentPageObj().find("#op_name").val("");
		getCurrentPageObj().find("#sup_name").val("");
	});
	//多条件查询谈判及合同项目
	$("#pop_RankAddSearch").click(function(){
		var op_name = getCurrentPageObj().find("#op_name").val();
		var sup_name = getCurrentPageObj().find("#sup_name").val();
		$("#chooseAddPersonPopTable").bootstrapTable('refresh',{url:dev_outsource+'outperson/queryRankPerson.asp?flag1=1&op_code='+op_codeStr+"&op_name="+escape(encodeURIComponent(op_name))+
			"&sup_name="+escape(encodeURIComponent(sup_name))}
		);
	});
}
initVlidate(getCurrentPageObj());//初始化页面