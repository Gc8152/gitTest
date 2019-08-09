

initPlanSelect();
//$("#planOutter tr:eq(2) td:gt(1) div").css("display","none");
//保存按钮事件
$("#planOutter_save").click(function(){
	if(!vlidate($("#planOutter_form_add"))){
		return;
	}
	var selected=$("#is_work_all_night option:selected").val();
	var work_load=$("#work_load").val();
	var work_overtime=$("#work_overtime").val();
	if(selected!="01"){
		if(parseFloat(work_load)>=24){
			alert("选了通宵才能报工时间大于24小时");
			return;
		}
	}
	if(parseFloat(work_overtime)>parseFloat(work_load)){
		alert("加班工时不能大于正常工时");
		return;
	}
	if($("#remark").val().length>200){
		alert("您输入的内容超出限制，最多录入200个");
		return;
	}
	var params=$("#planOutter_form_add").serialize();
	//params['plan_name']=encodeURIComponent($("#plan_name").val());
	//alert(params);
	var call = getMillisecond();
	var tabcall=getMillisecond();
	var queryParams = function(params) {
        var temp = {};
        temp["limit"] = params.limit;
        temp["offset"] = params.offset;
        return temp;
    };
	baseAjaxJsonp(dev_planwork + 'planOutterCon/savePlanOutter.asp?call=' + call+ '&SID=' + SID+ '&w_date=' + $("#currentTimeHidden").text(), params,
		function(msg) {
		   if(null!=msg&&""!=msg&&msg!=undefined){
		   if(msg.result=='true'){
			   alert("新增成功！");
			   $("#myModal_planOutter").modal("hide");
//			   $("#attendanceCalendarTable").bootstrapTable('refresh',{url:dev_planwork + 'workCon/findAll.asp?call='+tabcall+'&SID=' + SID});
			   //console.log($("#currentTimeHidden").text());
        baseAjaxJsonp(dev_planwork + 'workCon/findAll.asp?call='+tabcall+'&SID=' + SID+'&cuttTime=' + $("#currentTimeHidden").text(), queryParams,
		            function(result) {
			  // $("#attendanceCalendarTable").TaskMytable("refresh",{url:dev_planwork + 'workCon/findAll.asp?call='+tabcall+'&SID=' + SID+'&cuttTime='+$("#currentTimeHidden").text()});
        	$("#attendanceCalendarTable").TaskMytable("load",result.rows);
        	 taskEdit();
			            }, tabcall);
		     }else{
               alert(msg.message);
            }
		   }
		}, call);
	
});


//选中无，不显示关联
$("#associate_type_app2").click(function(){
	$("#associate_name").val("");
	$("#associate_code").val("");
	$("#planOutter tr:eq(2) td:gt(1) div").css("display","none");
	
		
});
//选中问题单按钮，初始化表格
$("#associate_type_app1").click(function(){
	$("#associate_name").val("");
	$("#associate_code").val("");
	$("#planOutter tr:eq(2) td:gt(1) div").css("display","block");
});

//选中项目，初始化表格
$("#associate_type_app0").click(function(){
	$("#associate_name").val("");
	$("#associate_code").val("");
	$("#planOutter tr:eq(2) td:gt(1) div").css("display","block");
});

//关联项目或者任务单事件单POP框
$("#associate_name").click(function(){
	$("#myModal_associate").modal("show");
	if($("#associate_type_app1").is(":checked")){//选中问题单任务按钮
		$("#program_table").hide();
		$("#problem_table").show();
		initProblemTable();
	}else if($("#associate_type_app0").is(":checked")){//选中项目按钮
		$("#problem_table").hide();
		$("#program_table").show();
		initProjectTable();
	}
	
});

//下拉列表数据
function initPlanSelect(){
	initVlidate($("#planOutter_form_add"));
	//初始化任务类型数据
	var arr="00,01,02,03,04,05,06,07,08,09,14";
	initSelect($("#plan_type_code"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_OUTTER_TASK_TYPE"},null,null,arr);
	//初始化是否确认完成字典数据
	initSelect($("#is_sure"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_IS_FINISH"});
}
//时间控件
function initDate(){
	WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
	});
}