function initAnnualVersionViewEvent(item){
	var currTab = getCurrentPageObj();//当前页
	initAnnualVersion(item);
	
	//初始化版本里程碑信息
	function initAnnualVersion(item){

		if(item.VERSIONS_TYPE == "04"){//双周版,显示周次与应用
			currTab.find("[hid='week_hide']").show();
		}else{
			currTab.find("[hid='week_hide']").hide();
		}
		/*currTab.find("[name='A.system_name']").html(item.SYSTEM_NAME);*/
		currTab.find("[name='A.versions_date']").html(item.VERSIONS_DATE);
		currTab.find("[name='A.versions_name']").html(item.VERSIONS_NAME);
		/*currTab.find("[name='A.system_name']").html(item.SYSTEM_NAME);*/
		currTab.find("[name='A.versions_status_name']").html(item.VERSIONS_STATUS_NAME);
		initSelectText(currTab.find("[name='A.versions_type']"),{dic_code:"SYS_DIC_VERSION_PROJECT",dic_val:item.VERSIONS_TYPE});
		initSelectText(currTab.find("[name='A.versions_week']"),{dic_code:"P_DIC_VERSIONS_WEEK",dic_val:item.VERSIONS_WEEK});
		initMilestone(item.VERSIONS_ID,null);
	}
	
	//关闭
	closeObj = currTab.find("#closeInfo_back");
	closeObj.bind('click',function(e){
		closeCurrPageTab();
	});
	
	function initMilestone(versions_id,type){
		var mTable = currTab.find("#table_milestone");//里程碑table
		mTable.find("tr").not(":eq(0)").remove();
		var call=getMillisecond()+1;
		baseAjaxJsonp(dev_construction + "annualVersion/initMilestone.asp?SID=" + SID + '&call=' + call,
				{"type" : type , "versions_id" : versions_id}, 
				function(data){
					var list = data.milestoneList;
					if(data.result=="true"){
						if (list != undefined && list != null) {
							for ( var i = 0; i < list.length; i++) {
								 var map = list[i];
								 var milestone_name = map.MILESTONE_NAME;
								 var start_time = map.START_TIME == undefined ? "" : map.START_TIME;;
								 var end_time = map.END_TIME == undefined ? "" : map.END_TIME;;
								 var tr = "<tr name='milestoneInfoList'>" 
								 			+ "<td>" + (i + 1) + "</td>"
								 			+ "<td>" + milestone_name+ "</td>"
											+ "<td>"+ start_time+ "</td>"
											+ "<td>" + end_time + "</td>" +
										  "</tr>";
	
								 mTable.append(tr);
							 }
						}
					}else{
						alert("初始化里程碑失败!");
					}
				}, call);
	}
	
	//加载字典项文本
	function initSelectText(obj,param){
		var selInfo = globalSelectCache[param.dic_code];
		if(selInfo!=undefined&&selInfo["data"]!=undefined){
			var data = selInfo["data"];
			for(var i=0;i<data.length;i++){
				if(data[i]["ITEM_CODE"] == param.dic_val){
					obj.html(data[i]["ITEM_NAME"]);
					return;
				}
			}
		}
		baseAjax("SDic/findItemByDic.asp",param,function(data){
			if(data!=undefined){
				for(var i=0;i<data.length;i++){
					if(data[i]["ITEM_CODE"] == param.dic_val){
						obj.html(data[i]["ITEM_NAME"]);
						return;
					}
				}
			}
		});
	}
	
};