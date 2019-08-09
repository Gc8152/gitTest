function initAnnualVersionEditEvent(item){//item作为新增修改标识
	function initVersionDate(type){
		var currTab = getCurrentPageObj();//当前页
		if(type == "15"){
			currTab.find("input[name='A.versions_date']").bind('click',function(e){
				WdatePicker({dateFmt:'yyyy年',minDate:'2000年',maxDate:'2050年'});
			});
			currTab.find("input[name='A.versions_date']").bind('focus',function(){
				WdatePicker({dateFmt:'yyyy年',minDate:'2000年',maxDate:'2050年'});
				autoInitVersionsName();
			});
		}else{
			currTab.find("input[name='A.versions_date']").bind('click',function(e){
				WdatePicker({dateFmt:'yyyy年MM月',minDate:'2000年1月',maxDate:'2050年12月'});
			});
			currTab.find("input[name='A.versions_date']").bind('focus',function(e){
				WdatePicker({dateFmt:'yyyy年MM月',minDate:'2000年1月',maxDate:'2050年12月'});
				autoInitVersionsName();
			});
		}
	}
	var currTab = getCurrentPageObj();//当前页
	initVlidate(currTab);
	var bTable = currTab.find("#table_basic");//基本信息table
	var mTable = currTab.find("#table_milestone");//里程碑table
	var sflag = true;//初始化应用开关

	//初始化下拉选
	autoInitSelect(bTable);
	if(item){//初始化版本信息
		initAnnualVersion(item);
	}
	if(item!=null){
		initVersionDate(item.VERSIONS_TYPE);
	}else{
		initVersionDate();
	}
	
	//切换版本类型事件
	var versions_typeObj = currTab.find("select[name='A.versions_type']");
	versions_typeObj.bind('change',function(e){
		currTab.find("input[name='A.versions_date']").unbind('click');
		currTab.find("input[name='A.versions_date']").unbind('focus');
		var type=versions_typeObj.val();
		weekObj = currTab.find("[hid='week_hide']");
		if(type == "04"){//双周版显示周次与应用选项
			weekObj.show();
			if(sflag){
				initSystemSelect(" ");
			}
		}else{
			weekObj.hide();
			weekObj.find("select").val("");
			weekObj.find("select").select2();
		}
		initVersionDate(type);
		initMilestone(null,type);//初始化模板里程碑信息
	});
	
	//保存
	var saveObj = currTab.find("#save_annualVersion");
	saveObj.bind('click',function(e){
		if(!vlidate(getCurrentPageObj().find("#addorUpdateVersion_from"))){
			alert("请填写相关必填项");
			return ;
		}
/*		if(!vlidate(currTab)){
			return ;
		}*/
		var milestoneArr = new Array();
		var sort = 1;
		currTab.find("[name='milestoneInfoList']").each(
				function() {
					var milestone_id = $(this).find("[name='milestone_id']").attr("mid");
					var start_time = ($(this).find("[name='start_time']").val()||"||");
					var end_time = ($(this).find("[name='end_time']").val()||"||");
					milestoneArr.push(sort + "&&" + milestone_id + "&&" + start_time + "&&" + end_time);
					sort++;
				});
		var versions_id = null;//versions_id作为是新增修改的标识
		if(item){
			versions_id = item.VERSIONS_ID;
		}
		var params = getPageParam("A");
		params["versions_id"] = versions_id;
		params["milestoneArr"] = milestoneArr;
		var call=getMillisecond();
		baseAjaxJsonp(dev_construction + "annualVersion/editAnnualVersion.asp?SID=" + SID + '&call=' + call,
				params,
				function(data){
					if(data != null && data.result == "true"){
						closeCurrPageTab();
					}
					alert(data.msg);
				}, call);
	});
	
	//提交
	var conmmitObj = currTab.find("#commit_annualVersion");
	conmmitObj.bind('click',function(e){
		if(!vlidate(getCurrentPageObj().find("#addorUpdateVersion_from"))){
			alert("请填写相关必填项");
			return ;
		}
		saveObj.click();
	});
		
	//重置
	resetObj = currTab.find("#reset_annualVersion");
	resetObj.bind('click',function(e){
		if(item){
			initAnnualVersion(item);
		}else{
			currTab.find("input,select").val(" ");
			currTab.find("select").select2();
			mTable.find("tr").not(":eq(0)").remove();
		}
	});
	
	//关闭
	closeObj = currTab.find("#close_back");
	closeObj.bind('click',function(e){
		closeCurrPageTab();
	});
	
	//初始化版本里程碑信息
	function initAnnualVersion(item){
		if(item.VERSIONS_TYPE == "04"){//双周版,显示周次与应用
			currTab.find("[hid='week_hide']").show();
			initSystemSelect(item.SYSTEM_ID);
		}else{
			currTab.find("[hid='week_hide']").hide();
		}
		//currTab.find("[name='A.system_id']").val(item.SYSTEM_ID);
		currTab.find("[name='A.versions_date']").val(item.VERSIONS_DATE);
		currTab.find("[name='A.versions_name']").val(item.VERSIONS_NAME);
		//initSelect(currTab.find("[name='A.versions_week']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_VERSIONS_WEEK"},item.VERSIONS_WEEK);
		initSelect(currTab.find("[name='A.versions_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_VERSION_PROJECT"},item.VERSIONS_TYPE);
		//currTab.find("select").select2();
		initMilestone(item.VERSIONS_ID,item.VERSIONS_TYPE);
	}
	
	//初始化应用
	function initSystemSelect(id){
		var sCall=getMillisecond()+1;
		baseAjaxJsonp(dev_construction+"annualVersion/queryListSystem.asp?SID=" + SID + '&call=' + sCall,{},
				function(data){
					if (data.result=="true") {
						var obj=currTab.find("[name='A.system_id']");
						obj.empty();
						obj.append('<option value="">请选择</option>');
						for(var i=0;i<data.systemList.length;i++){
							obj.append('<option value="'+data.systemList[i].SYSTEM_ID+'">'+data.systemList[i].SYSTEM_NAME+'</option>');	
						}
						obj.val(id);
						obj.select2();
						sflag = false;
					}else{
						alert("初始化应用失败");
					}
				}, sCall);
	}
	
	//初始化模板里程碑
	function initMilestone(versions_id,type){
		mTable.find("tr").not(":eq(0)").remove();
		var call=getMillisecond();
		baseAjaxJsonp(dev_construction + "annualVersion/initMilestone.asp?SID=" + SID + '&call=' + call,
				{"type" : type , "versions_id" : versions_id}, 
				function(data){
					var list = data.milestoneList;
					if(data.result=="true"){
						if (list != undefined && list != null) {
							for ( var i = 0; i < list.length; i++) {
								 var map = list[i];
								 var milestone_id = map.MILESTONE_ID;
								 var milestone_name = map.MILESTONE_NAME;
								 var start_time = map.START_TIME == undefined ? "" : map.START_TIME;;
								 var end_time = map.END_TIME == undefined ? "" : map.END_TIME;;
								 var is_choice=map.IS_CHOICE;//'00'必选,'01'非必选
								 var tr = "<tr name='milestoneInfoList'>" 
								 			+ "<td>" + (i + 1) + "</td>"
								 			+ "<td name='milestone_id' mid='" + milestone_id + "'>" + milestone_name+ "</td>"
											+ "<td><input id='annualVersionPlan_milestoneTime"+i+"' type='text' name='start_time' onClick=\"WdatePicker({maxDate:\'#F{$dp.$D(\\'annualVersionPlan1_milestoneTime"+i+"\\',{d:0});}\'})\" value='" + start_time+ "' validate='v.required' valititle='"+milestone_name+'开始未选择'+"'/></td>"
											+ "<td><input id='annualVersionPlan1_milestoneTime"+i+"' type='text' name='end_time' onClick=\"WdatePicker({minDate:\'#F{$dp.$D(\\'annualVersionPlan_milestoneTime"+i+"\\',{d:0});}\'})\" value='" + end_time + "' validate='v.required' valititle='"+milestone_name+'结束未选择'+"'/></td>" +
										  "</tr>";
	
								 mTable.append(tr);
							 }
						}
						initVlidate(mTable);	
					}else{
						alert("初始化里程碑失败!");
					}
				}, call);
	}
	
	//动态生成版本名称
	function autoInitVersionsName(){
		var $type = currTab.find("[name='A.versions_type']");
		var $week = currTab.find("[name='A.versions_week']");
		var $date = currTab.find("[name='A.versions_date']");
		var $name = currTab.find("[name='A.versions_name']");
		currTab.find("[name='A.versions_type'],[name='A.versions_week']").bind('change',function(e){
			initName();
		});
		
		$date.focus(function(e){
			initName();
		});
		function initName(){
			if($type.val() && $date.val()){
				if($type.val() == "04"){//双周版
					if($week.val() != ""){
						$name.val($date.val()+$week.select2('data')[0].text);
					}else{
						$name.val("");
					}
				}else{
					$name.val($date.val()+$type.select2('data')[0].text);
				}
			}
		}
	}
	autoInitVersionsName();
};