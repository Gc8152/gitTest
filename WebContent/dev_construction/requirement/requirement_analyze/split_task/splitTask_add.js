var currTab=getCurrentPageObj();
initAppData();
initSelect(getCurrentPageObj().find("#STis_change"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_IS_CHANGE"},"01");

/**
 * 根据data设置下拉（数据过滤）  
 * @param obj
 * @param show
 * @param data
 */


//
function initAppData(){
	var reqSpTaskCall=getMillisecond()+'1';
	baseAjaxJsonp(dev_construction+"requirement_splitTask/queryApplicationList.asp?SID="+SID+"&call="+reqSpTaskCall,null,function(data){
		if(data!=undefined){
			globalSelectCache[data.dic_data]={};
			globalSelectCache[data.dic_data]["data"]=data.rows;
			globalSelectCache[data.dic_data]["startDate"]=new Date().getTime();
			initSelectPicker(getCurrentPageObj().find("#STinvolve_app"),{value:"SYSTEM_ID",text:"SYSTEM_NAME"},data.rows);
		}
	},reqSpTaskCall);
}

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
			//obj.val(default_v);
		}else{
			obj.val(" ");
		}
		obj.select2();
		//$("#removeOption").remove();//神奇的将select 设置为空
		//alert(obj.val());
	}
}

//初始化页面信息
function initSplitTaskLayOut(params){
	for(var k in params){
		var str=params[k];
		k = k.toLowerCase();//大写转换为小写
		if(k=="req_id"||k=="sub_req_id"||k=="plan_onlinetime"||k=="sub_req_name"||k=="req_name"){
			currTab.find("input[name='ST."+k+"']").val(str);
			currTab.find("span[name='ST."+k+"']").text(str);
		}else if(k=="sub_req_code"){
			//var req_sub_code=str.substring(str.indexOf('"')+1,str.lastIndexOf('"'));
			currTab.find('#STsub_req_code').text(str);
		}else if(k=="sub_req_content"){
			currTab.find('#STsub_req_content').text(str);	
		}else if(k=="req_code"){
			currTab.find('#STreq_code').text(str);
		}
		else if(k=="req_acc_classify"){
			currTab.find('#STreq_acc_classify').val(str);
		}else if(k=="is_change"){
			var callTime=getMillisecond()+'1';
			var req_sub_id=params["SUB_REQ_ID"];
			baseAjaxJsonp(dev_construction+"requirement_splitTask/queryIsVersion.asp?SID="+SID+"&call="+callTime+"&req_sub_id="+req_sub_id,null,function(data){
				if(data.rows.IS_VERSION=="00"){
						if(params["IS_CHANGE"]!="00"&&params["IS_CHANGE"]!="01"){
							getCurrentPageObj().find('#involve_app_hide+strong').hide();
							getCurrentPageObj().find('#STinvolve_app').removeAttr("validate");
							getCurrentPageObj().find('#STinvolve_app').removeAttr("valititle");
							
						}else if(params["IS_CHANGE"]=="00"){
							$("#supply_style_add").hide();
							$("#is_involve_add").show(); 
							$("#is_involve1_add").show(); 
							getCurrentPageObj().find('#STis_change').attr("disabled","disabled");
							getCurrentPageObj().find('#STinvolve_app').attr("disabled","disabled");
						}else if(params["IS_CHANGE"]=="01"){
							getCurrentPageObj().find('#STis_change').attr("disabled","disabled");
							getCurrentPageObj().find('#involve_app_hide+strong').hide();
							getCurrentPageObj().find('#STinvolve_app').removeAttr("validate");
							getCurrentPageObj().find('#STinvolve_app').removeAttr("valititle");
						}
					}else if(data.rows.IS_VERSION==undefined||data.rows.IS_VERSION==null||data.rows.IS_VERSION=="02"||data.rows.IS_VERSION=="01"){//没入版或者取消入版
						if(params["IS_CHANGE"]=="00"){
							$("#supply_style_add").hide();
							$("#is_involve_add").show(); 
							$("#is_involve1_add").show(); 
						}else{
							getCurrentPageObj().find('#involve_app_hide+strong').hide();
							getCurrentPageObj().find('#STinvolve_app').removeAttr("validate");
							getCurrentPageObj().find('#STinvolve_app').removeAttr("valititle");
						}
					}
				getCurrentPageObj().find('#STis_change+strong').attr("style","top:80%;");
				initSelect(getCurrentPageObj().find("#STis_change"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_IS_CHANGE"},(params["IS_CHANGE"]||"01"));
			},callTime);
			
		}else if(k=="involve_app"){
			var reqSpTaskCall=getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+"requirement_splitTask/queryApplicationList.asp?SID="+SID+"&call="+reqSpTaskCall,null,function(data){
				if(data!=undefined){
					globalSelectCache[data.dic_data]={};
					globalSelectCache[data.dic_data]["data"]=data.rows;
					globalSelectCache[data.dic_data]["startDate"]=new Date().getTime();
					var strcheck=params["INVOLVE_APP"];
					initSelectPicker(getCurrentPageObj().find("#STinvolve_app"),{value:"SYSTEM_ID",text:"SYSTEM_NAME"},data.rows,strcheck);
				}
			},reqSpTaskCall);
		
			
		}
	}
	if(params["IS_CHANGE"]==""||params["IS_CHANGE"]==undefined){
		getCurrentPageObj().find('#STis_change+strong').attr("style","top:80%;");
		getCurrentPageObj().find('#involve_app_hide+strong').hide();
		getCurrentPageObj().find('#STinvolve_app').removeAttr("validate");
		getCurrentPageObj().find('#STinvolve_app').removeAttr("valititle");
	}
	initTaskTable();//初始化关联的任务列表
}

var count=1;//行数ID后缀  
var delid="";//删除的ID  
var addid="";//添加ID的前缀  
function addReqTaskTr2(id,rowData){//table的id,行数据
	var space = "";
	var spaceId = "a";//先给需求任务的ID赋值为“a”,

if(rowData!=null&&rowData.REQ_TASK_STATE!="01"&&rowData.REQ_TASK_STATE!="00"&&rowData.REQ_TASK_STATE!="02"){//非草拟和待受理以及退回状态的任务不可操作
	var trHtml1 =
    	'<tr>' +
			'<td align="center"><input class="form-control" id="taskcheck'+count+'" type="checkbox" name="taskbox" value="'+count+'"/>' +
				'<input type="hidden" id="RTreq_task_id'+count+'" name="RT.req_task_id" value="'+(rowData?rowData.REQ_TASK_ID:spaceId)+'"></td>' +
				'<td><textarea  id="RTreq_task_name'+count+'" name="RT.req_task_name" readonly>'+(rowData?(rowData.REQ_TASK_NAME=="undefined"?space:rowData.REQ_TASK_NAME):space)+'</textarea></td>' +	
			'<td><select  id="RTreq_task_relation'+count+'" name="RT.req_task_relation"    disabled></select></td>' +
			'<td><input type="hidden" id="RTsystem_no'+count+'" name="RT.system_no" value="'+(rowData?rowData.SYSTEM_NO:space)+'"/>' +
	    		'<input type="text" id="RTsystem_name'+count+'" name="RT.system_name"  value="'+(rowData?rowData.SYSTEM_NAME:space)+'" readonly/></td>' +
	    	'<td><input type="hidden" id="RTproject_man_id'+count+'" name="RT.project_man_id" value="'+(rowData?rowData.PROJECT_MAN_ID:space)+'"/>' +
	    		'<input type="text" id="RTproject_man_name'+count+'" name="RT.project_man_name"   value="'+(rowData?rowData.PROJECT_MAN_NAME:space)+'" readonly/></td>' +
	    	'<td><input type="text" id="RTreq_task_state_display'+count+'" name="RT.req_task_state_display" value="'+(rowData?(rowData.REQ_TASK_STATE_DISPLAY=="undefined"?space:rowData.REQ_TASK_STATE_DISPLAY):space)+'" readonly/>'+
	    	    '<input type="hidden" id="RTreq_task_state'+count+'" name="RT.req_task_state" value="'+(rowData?(rowData.REQ_TASK_STATE=="undefined"?space:rowData.REQ_TASK_STATE):space)+'"/></td>' +
	    	'<td><textarea id="RTtask_content'+count+'" name="RT.task_content" readonly>'+(rowData?(rowData.TASK_CONTENT=="undefined"?space:rowData.TASK_CONTENT):space)+'</textarea></td>'+
	    	'<input type="hidden" id="RTreq_task_code'+count+'" name="RT.req_task_code" value="'+(rowData?rowData.REQ_TASK_CODE:space)+'"></td>' +
	    "</tr>"; 
    $("#"+id).append(trHtml1);
    initSelect(getCurrentPageObj().find("#RTreq_task_relation"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TASK_RELATION"},rowData.REQ_TASK_RELATION);
}else{
	if((rowData!=null&&rowData.REQ_TASK_STATE=="00")||(rowData!=null&&rowData.REQ_TASK_RELATION=="01")){//默认自动生成的主办任务从属关系和所选应用不可操作
		var trHtml2 =
    	'<tr>' +
			'<td align="center"><input class="form-control" id="taskcheck'+count+'" type="checkbox" name="taskbox" value="'+count+'"/>' +
			    '<input type="hidden" id="RTreq_task_id'+count+'" name="RT.req_task_id" value="'+(rowData?rowData.REQ_TASK_ID:spaceId)+'"></td>' +
		    '<td><textarea  id="RTreq_task_name'+count+'" name="RT.req_task_name">'+(rowData?(rowData.REQ_TASK_NAME=="undefined"?space:rowData.REQ_TASK_NAME):space)+'</textarea></td>' +
			'<td><select id="RTreq_task_relation'+count+'" name="RT.req_task_relation" onchange="isSameMain()" disabled></select></td>' +
			'<td><input type="hidden" id="RTsystem_no'+count+'" name="RT.system_no" value="'+(rowData?rowData.SYSTEM_NO:space)+'"/>' +
    		    '<input type="text" id="RTsystem_name'+count+'" name="RT.system_name" onclick="openSysPop('+count+');" value="'+(rowData?rowData.SYSTEM_NAME:space)+'" placeholder="点击选择" readonly/></td>' +
    	    '<td><input type="hidden" id="RTproject_man_id'+count+'" name="RT.project_man_id" value="'+(rowData?rowData.PROJECT_MAN_ID:space)+'"/>' +
    		    '<input type="text" id="RTproject_man_name'+count+'" name="RT.project_man_name" onclick="selectProjectMan('+count+');" value="'+(rowData?rowData.PROJECT_MAN_NAME:space)+'" readonly/></td>' +
    	    '<td><input type="text" id="RTreq_task_state_display'+count+'" name="RT.req_task_state_display" value="'+(rowData?(rowData.REQ_TASK_STATE_DISPLAY=="undefined"?space:rowData.REQ_TASK_STATE_DISPLAY):"草拟")+'" readonly/>'+
    	        '<input type="hidden" id="RTreq_task_state'+count+'" name="RT.req_task_state" value="'+(rowData?(rowData.REQ_TASK_STATE=="undefined"?space:rowData.REQ_TASK_STATE):"00")+'"/></td>'+
    	    '<td><textarea id="RTtask_content'+count+'" name="RT.task_content">'+(rowData?(rowData.TASK_CONTENT=="undefined"?space:rowData.TASK_CONTENT):space)+'</textarea></td>'+
    	    '<input type="hidden" id="RTreq_task_code'+count+'" name="RT.req_task_code" value="'+(rowData?rowData.REQ_TASK_CODE:space)+'"></td>' +
         "</tr>";
      $("#"+id).append(trHtml2);
	}else{//新增以及待受理的列表拼接
		//判断为新增状态时，默认勾选且不能更改
		 var disabled=(rowData&&rowData["REQ_TASK_STATE"]=="01")?"":'disabled="disabled" checked="checked"';
	  var trHtml =
		'<tr>' +
			'<td align="center"><input class="form-control" id="taskcheck'+count+'" type="checkbox" name="taskbox" value="'+count+'" '+disabled+' />' +
				'<input type="hidden" id="RTreq_task_id'+count+'" name="RT.req_task_id" value="'+(rowData?rowData.REQ_TASK_ID:spaceId)+'"></td>' +
			'<td><textarea  id="RTreq_task_name'+count+'" name="RT.req_task_name">'+(rowData?(rowData.REQ_TASK_NAME=="undefined"?space:rowData.REQ_TASK_NAME):space)+'</textarea></td>' +
			'<td><select id="RTreq_task_relation'+count+'" name="RT.req_task_relation" onchange="isSameMain()"></select></td>' +
			'<td><input type="hidden" id="RTsystem_no'+count+'" name="RT.system_no" value="'+(rowData?rowData.SYSTEM_NO:space)+'"/>' +
	    		'<input type="text" id="RTsystem_name'+count+'" name="RT.system_name" onclick="openSysPop('+count+');" value="'+(rowData?rowData.SYSTEM_NAME:space)+'" placeholder="点击选择" readonly/></td>' +
	    	'<td><input type="hidden" id="RTproject_man_id'+count+'" name="RT.project_man_id" value="'+(rowData?rowData.PROJECT_MAN_ID:space)+'"/>' +
	    		'<input type="text" id="RTproject_man_name'+count+'" name="RT.project_man_name" onclick="selectProjectMan('+count+');"  value="'+(rowData?rowData.PROJECT_MAN_NAME:space)+'" readonly/></td>' +
	    	'<td><input type="text" id="RTreq_task_state_display'+count+'" name="RT.req_task_state_display" value="'+(rowData?(rowData.REQ_TASK_STATE_DISPLAY=="undefined"?space:rowData.REQ_TASK_STATE_DISPLAY):"草拟")+'" readonly/>'+
	    	'<input type="hidden" id="RTreq_task_state'+count+'" name="RT.req_task_state" value="'+(rowData?(rowData.REQ_TASK_STATE=="undefined"?space:rowData.REQ_TASK_STATE):"00")+'"/></td>'+
	    	'<td><textarea id="RTtask_content'+count+'" name="RT.task_content">'+(rowData?(rowData.TASK_CONTENT=="undefined"?space:rowData.TASK_CONTENT):" ")+'</textarea></td>'+
	    	'<input type="hidden" id="RTreq_task_code'+count+'" name="RT.req_task_code" value="'+(rowData?rowData.REQ_TASK_CODE:space)+'"></td>' +
	    "</tr>";
    $("#"+id).append(trHtml);
	}
    if(rowData!=null||rowData==""){
      initSelect(getCurrentPageObj().find("#RTreq_task_relation"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TASK_RELATION"},rowData.REQ_TASK_RELATION);
    }else{
      initSelect(getCurrentPageObj().find("#RTreq_task_relation"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TASK_RELATION"},"02");
    }
  }
    count++;
}

//弹出项目经理pop框
function selectProjectMan(num){
	openRoleUserPop("taskProjectMan_pop",{no:getCurrentPageObj().find('#RTproject_man_id'+num),name:getCurrentPageObj().find('#RTproject_man_name'+num)},"0007");
}

initSplitTaskReqBtn();
//初始化按钮
function initSplitTaskReqBtn(){
	$("#saveForTaskAcceptSure").click(function(){
		var sub_req_id=getCurrentPageObj().find('#STsub_req_id').val();
		var reqSpTaskCall=getMillisecond();
		nconfirm("确定要确认这些任务?",function(){
			baseAjaxJsonp(dev_construction+"requirement_splitTask/updateReqTaskStateToAccept.asp?SID="+SID+"&sub_req_id=" +sub_req_id+"&call="+reqSpTaskCall,{}, function(data) {
				if(data&&data.result=="true"){
					 alert("确认成功",function(){
						 closeCurrPageTab();
					 });
					 return ;
				}
			},reqSpTaskCall);
		},function(){});
	});
	
	$("#saveForTaskAcceptBack").click(function(){
		var sub_req_id=getCurrentPageObj().find('#STsub_req_id').val();
		var reqSpTaskCall=getMillisecond();
		nconfirm("确定要打回这些任务?",function(){
			baseAjaxJsonp(dev_construction+"requirement_splitTask/updateReqTaskStateToBack.asp?SID="+SID+"&sub_req_id=" +sub_req_id+"&call="+reqSpTaskCall,{sure_back_info:""}, function(data) {
				if(data&&data.result=="true"){
					 alert("打回成功",function(){
						 closeCurrPageTab();
					 });
					 return ;
				}
			},reqSpTaskCall);
		},function(){});
	});
//提交并保存
$('#saveForTaskAccept').click(function(){
	if(!vlidate($("#g_reqtask_split"),"",true)){
		 alert("请按要求填写图表中的必填项！");
		return ;
	}
	var taskrelation=new Array();
	var trs = $("table[name='addtask'] tbody tr");
	for(var i=0; i<trs.length; i++){
		taskrelation[i]=$(trs[i]).find("select").val();
	}
	var num=1;
	for(var j=0;j<taskrelation.length;j++){
		if(taskrelation[j]=="01"){
			num+=1;
			if(num>3||num==3){
				alert("同个需求点不能有两个主办任务");
				j=j+1;
				return;
			}
		}
	}
	var check=0;
	for(var j=0;j<taskrelation.length;j++){
		if(taskrelation[j]=="01"){
			check+=1;
		}
	}
	if(check==0){
		alert("该需求点没有主办任务");
		return;
	}
	
	var selects =  getCurrentPageObj().find("#gReqTaskTable select");
	for(var i=0; i<selects.length; i++) {
		if(!$(selects[i]).val() || $(selects[i]).val()==" "){//为空
			alert("还有从属关系未填写完整！");
			return;
		}
	}
	var input_text = getCurrentPageObj().find("#gReqTaskTable input[type='text']");
	for(var i=0; i<input_text.length; i++) {
		if(!$(input_text[i]).val()) {
			alert("还有实施应用未选择！");
			return;
		}
	}
	var trc = getCurrentPageObj().find("#gReqTaskTable tbody tr");
	for(var i=0; i<trc.length; i++){
	    var textareas=$(trc[i]).find("textarea");
		 if(!$(textareas[0]).val()||$(textareas[0]).val()=="") {
			 alert("还有任务名称未填写！");
			 return;
	   }
	}
	var checkeds=getCurrentPageObj().find("input:checkbox[name^='taskbox']:checked");
	if(checkeds.length==0){
		alert("请至少选择一条任务进行提交");
		return;
	}
	
	//涉及应用
	var involve_app = "";
	getCurrentPageObj().find("#STinvolve_app option:selected").each(function() {
    	var text= $(this).attr("value");
    	text = text.replace(/(^\s*)|(\s*$)/g, "");
    	if(text !== '' && typeof(text) !== undefined && text !== null){
    		if(involve_app == ""){
    			involve_app = text;
    		}else{
    			involve_app += ","+text;
    		}
    	}
    });
	var is_change = getCurrentPageObj().find("#STis_change").val();
	if(is_change=="请选择"){
		alert("请选择是否有数据库表结构变更!");
		return;
	}else if(is_change=="00"&&involve_app==""){
		alert("请选择涉及应用!");
		return;
	}
	var taskInfo = {};
	var req_task_id ="f";
	var req_task_name="f";
	var system_no="f";
	var project_man_id="f";
	var req_task_state="f";
	var req_task_relation="f";
	var task_content="f";
	var req_id=getCurrentPageObj().find('#STreq_id').val();
	var sub_req_code=getCurrentPageObj().find('#STsub_req_code').html();
	var sub_req_id=getCurrentPageObj().find('#STsub_req_id').val();
	var chobj= getCurrentPageObj().find("input[name='taskbox']:checkbox");
	chobj.each(function(){  
        if($(this).is(":checked")){
            delid = $(this).val();
			req_task_id=req_task_id+","+getCurrentPageObj().find('#RTreq_task_id'+delid).val();
			req_task_name=req_task_name+"#%"+getCurrentPageObj().find('#RTreq_task_name'+delid).val();
			system_no=system_no+","+getCurrentPageObj().find('#RTsystem_no'+delid).val();
			project_man_id=project_man_id+","+getCurrentPageObj().find('#RTproject_man_id'+delid).val();
			req_task_state=req_task_state+","+getCurrentPageObj().find('#RTreq_task_state'+delid).val();
			req_task_relation=req_task_relation+","+getCurrentPageObj().find('#RTreq_task_relation'+delid).val();
			task_content=task_content+"#%"+getCurrentPageObj().find('#RTtask_content'+delid).val();
		}
	});
	/*var trs = getCurrentPageObj().find("table[name='addtask'] tbody tr");
	for(var i=0; i<trs.length; i++){
		var gInputs = $(trs[i]).find("input");
		var gTextarea=$(trs[i]).find("textarea");
		if(i==0){
			req_task_id= $(gInputs[1]).val();
			system_no = $(gInputs[2]).val();
            project_man_id = $(gInputs[4]).val();
            req_task_state = $(gInputs[7]).val();
			req_task_relation = $(trs[i]).find("select").val();
			req_task_name = $(gTextarea[0]).val()==""?" ":$(gTextarea[0]).val();
			task_content = $(gTextarea[1]).val()==""?" ":$(gTextarea[1]).val();
		}else{
			req_task_id = req_task_id+","+$(gInputs[1]).val();
			system_no = system_no+","+$(gInputs[2]).val();
			project_man_id = project_man_id+","+ $(gInputs[4]).val();
			req_task_state = req_task_state+","+$(gInputs[7]).val();
			req_task_relation = req_task_relation + "," + $(trs[i]).find("select").val();
			req_task_name = req_task_name + "," + $(gTextarea[0]).val();
			task_content = task_content + "," + $(gTextarea[1]).val();
		}
		
	}*/
	taskInfo['req_task_id'] = req_task_id;
	taskInfo['system_no'] = system_no;
	taskInfo['project_man_id'] = project_man_id;
	taskInfo['req_task_state'] = req_task_state;
	taskInfo['req_task_relation'] = req_task_relation;
	taskInfo['req_task_name'] = req_task_name;
	taskInfo['task_content'] = task_content;
	var req_acc_classify = getCurrentPageObj().find('#STreq_acc_classify').val();
	if("05"==getCurrentPageObj().find('#req_task_type').val()){//主办为紧急任务
		req_acc_classify="00";
	}
	taskInfo['req_acc_classify'] = req_acc_classify;
	baseAjaxJsonp(dev_construction+"requirement_splitTask/insertReqTask.asp?SID="+SID+"&req_id="+req_id+"&sub_req_code="+sub_req_code+"&sub_req_id="+sub_req_id+"&involve_app="+involve_app+"&is_change="+is_change, taskInfo , function(data) {
	if (data != undefined && data != null && data.result=="true") {
			alert("保存提交成功");
			closePageTab("requirement_splitTask");
		}else{
			var mess=data.mess;
			alert("保存提交失败:"+mess);
		}
	});
});


//新增任务派发，组装一行表格
getCurrentPageObj().find('#reqTask_add').click(function(){
	var trs = getCurrentPageObj().find("table[name='addtask'] tbody tr");
	var req_task_state="";
	var req_task_relation="";
	for(var i=0; i<trs.length; i++){
		var gInputs = $(trs[i]).find("input");
		req_task_state = $(gInputs[7]).val();
		req_task_relation = $(trs[i]).find("select").val();
		if((req_task_state=='12'||req_task_state=='13') && req_task_relation=='01'){
		    alert("主线任务已提交投产，该需求点不能再拆分任务了!");
			return;
		}
		/*if(req_task_state=='11' && req_task_relation=='01'){
		    alert("主线任务状态待提交投产，该需求点不能再拆分任务了!");
			return;
		}*/
		/*if((req_task_state=='09'||req_task_state=='090'||req_task_state=='10'||req_task_state=='11') && req_task_relation=='01'){
			req_task_state_display=$(gInputs[6]).val();
			var str="主线任务状态为"+req_task_state_display+"，该需求点不能再拆分任务了!";
		    alert(str);
			return;
		}*/
	}
	addReqTaskTr2("gReqTaskTable",null);
 });

//删除选中的任务分派信息
getCurrentPageObj().find('#reqTask_del').click(function(){
	var checkeds=getCurrentPageObj().find("input:checkbox[name^='taskbox']:checked");
	if(checkeds.length==0){
		alert("请至少选择一条数据");
		return;
	}
	var chobj= getCurrentPageObj().find("input[name='taskbox']:checkbox");
	if(chobj.length!=0){
    chobj.each(function(){  
        if($(this).is(":checked")){
            delid = $(this).val();
           var req_task_id= getCurrentPageObj().find('#RTreq_task_id'+delid).val();
           var req_task_relation = getCurrentPageObj().find('#RTreq_task_relation'+delid).val();
           var req_task_state = getCurrentPageObj().find('#RTreq_task_state'+delid).val();
           //if(req_task_id!=null&&req_task_id!=" "&&req_task_id!=""){
           if(req_task_id!=""&&req_task_id != 'a') {
        	   if(req_task_relation=="01"&&(req_task_state=="00"||req_task_state=="17")){
        		   alert("该任务是默认的主办任务不能删除");
        		   return false;
        	   }else if(req_task_state!="17"){
        	     alert("该任务已派发，不能删除");
        	     return false;
        	   }
           }else{
               $(this).parent().parent().remove();
           }
        } 
     });
	}else{
		alert("并无表格数据,无法删除");
	}
  });


//关闭任务
getCurrentPageObj().find('#reqTask_close').click(function(){
	var chobj= getCurrentPageObj().find("input:checkbox[name^='taskbox']:checked");
	if(chobj.length==1){
	  delid = chobj.val();
	 var req_task_id=getCurrentPageObj().find('#RTreq_task_id'+delid).val();
	    if(req_task_id==null||req_task_id==""){
	    	alert("获取任务id失败");
	    	return;
	    }
	    if(req_task_id=="a"){
	    	alert("该任务还未保存，无须关闭");
	    	return;
	    }
	 var params={};
	 var sub_req_code=getCurrentPageObj().find('#STsub_req_code').html();   
	 var req_task_relation=getCurrentPageObj().find('#RTreq_task_relation'+delid).val(); 
	 var req_task_state=getCurrentPageObj().find('#RTreq_task_state'+delid).val();
	 var task_state=parseInt(req_task_state);
	 if(req_task_relation=='01'&&task_state>=4){//主办且已入版的任务不能关闭
		 alert("主办且已入版的任务不能关闭");
		 return;
	 }
	 if(task_state>=12 && task_state<16){
		 alert("已投产的任务不能关闭");
		 return; 
	 }
	 params["sub_req_code"]=sub_req_code;
	 params["req_task_relation"]=req_task_relation;
	 params["req_task_state"]=req_task_state;
	 /*******提醒参数*******/
	 var project_man_id=getCurrentPageObj().find('#RTproject_man_id'+delid).val();
	 var req_task_code=getCurrentPageObj().find('#RTreq_task_code'+delid).val();
	 var req_task_name=getCurrentPageObj().find('#RTreq_task_name'+delid).val();
	 var sub_req_id=getCurrentPageObj().find('#STsub_req_id').val();
	 params["project_man_id"]=project_man_id;
	 params["b_id"]=req_task_id;
	 params["b_code"]=req_task_code;
	 params["b_name"]=req_task_name+"（编号："+req_task_code+"）已关闭";
	 params["sub_req_id"]=sub_req_id;
	 params["remind_type"]="PUB2017174";//任务关闭提醒
	 nconfirm("确定关闭当前任务吗？",function(){
		 baseAjaxJsonp(dev_construction+"requirement_splitTask/closeReqTask.asp?SID="+SID+"&req_task_id="+req_task_id,params, function(data) { 
			 if (data != undefined && data != null && data.result=="true") {
					alert("任务已关闭");
					if(req_task_relation=="02"){
					  getCurrentPageObj().find('#taskcheck'+delid).parent().parent().remove();
					}else if(req_task_relation=="01"){
						closePageTab("requirement_splitTask");
					}
				}else{
					var mess=data.mess;
					if(mess!="underfined"){
					  alert("任务关闭失败:"+mess);
					}else{
					  alert("任务关闭失败");
					}
				}
		 });
	 });   
	    
	}else{
		alert("请选择一条任务进行操作");
	}
});

//全选与全不选
getCurrentPageObj().find('#choseAll').click(function(){
	var flag=$(this).is(":checked");
	 getCurrentPageObj().find("input[name='taskbox']:checkbox").prop("checked",flag);

});
}
//判断任务是否有重复主办
function isSameMain(){
	var taskrelation=new Array();
	var trs = $("table[name='addtask'] tbody tr");
	for(var i=0; i<trs.length; i++){
		taskrelation[i]=$(trs[i]).find("select").val();
	}
	var num=1;
	for(var j=0;j<taskrelation.length;j++){
		if(taskrelation[j]=="01"){
			num+=1;
			if(num>3||num==3){
				alert("同个需求点不能有两个主办任务");
				j=j+1;
				getCurrentPageObj().find('#RTreq_task_relation'+j).val(" ");
				getCurrentPageObj().find('#RTreq_task_relation'+j).select2();
				//getCurrentPageObj().find('#RTreq_task_relation'+j).val("");
				return;
			}
		}
	}
	
}

//点击需求编号事件，查看需求详情
function viewReqDetail(){
	var req_acc=getCurrentPageObj().find("#STreq_acc_classify").val();
	if(req_acc=="00"){
		var ids=getCurrentPageObj().find('#STreq_id').val();
		closeAndOpenInnerPageTab("EmRequirement_detail1","紧急需求详情","dev_construction/requirement/requirement_analyze/task_accept/emreq_detail.html",function(){
			initEmReqDetailLayout(ids);
		});
		
	}else{
		var ids=getCurrentPageObj().find('#STreq_id').val();
		closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
			initReqDetailLayout(ids);
		});
	}
}

//加载项目组
function loadTaskOrg(count){
	//项目组
	openSelectTreeDiv(getCurrentPageObj()("#RTreq_dept_name"+count),"splitTask_tree_id"+count,"SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "-345px",width:"180px"},function(node){
		getCurrentPageObj()("#RTreq_dept_name"+count).val(node.name);
		getCurrentPageObj()("#RTreq_dept_no"+count).val(node.id);
				
	});
		
	getCurrentPageObj()("#RTreq_dept_name"+count).focus(function(){
		getCurrentPageObj()("#RTreq_dept_name"+count).click();
		});
}

//弹出应用选择Pop框
function openSysPop(num){
	openSystemPopForSplitTask("taskSystem_pop",{sysname:getCurrentPageObj().find('#RTsystem_name'+num),sysno:getCurrentPageObj().find('#RTsystem_no'+num),pro_man_id:getCurrentPageObj().find('#RTproject_man_id'+num),pro_man_name:getCurrentPageObj().find('#RTproject_man_name'+num)});
}


//查询与单个子需求关联的任务列表
function initTaskTable(){
	var sub_req_id=$('#STsub_req_id').val();
	if(sub_req_id==null||sub_req_id==""){
		alert("获取子需求id失败！");
		return;
	}
	var reqSpTaskCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_splitTask/queryTaskInfoBySubReqId.asp?SID="+SID+"&sub_req_id="+sub_req_id+"&call="+reqSpTaskCall, null , function(data) {
		             for(var i=0;i<data["rows"].length;i++){
		            	 var rowsData=data["rows"][i];
		            	 addReqTaskTr2("gReqTaskTable",rowsData); 
		            	 if(rowsData&&rowsData["REQ_TASK_RELATION"]=="01"){
		            		 getCurrentPageObj().find('#req_task_type').val(rowsData["REQ_TASK_TYPE"]||"");
		            	 }
	            	  
	               }
			},reqSpTaskCall);
}
//是否有数据库表结构变更
function showOrHideApp(){
	 var req_type1=getCurrentPageObj().find('#STis_change').val();	
		if(req_type1=='00'){//需求大类为需求申请书时显示主管业务部门
			$("#supply_style_add").hide();
			$("#is_involve_add").show(); 
			$("#is_involve1_add").show(); 
			alert("当涉及数据库表结构变更时,需要拆分涉及应用的配合任务!");
			$('#involve_app_hide+strong').show();
			$('#STinvolve_app').attr("validate","v.required");
		}else{
			$("#supply_style_add").show();
			$("#is_involve_add").hide(); 
			$("#is_involve1_add").hide(); 
			getCurrentPageObj().find('#STinvolve_app').val(" ").select2();
			getCurrentPageObj().find('#involve_app_hide+strong').hide();
	    	getCurrentPageObj().find('#STinvolve_app').removeAttr("validate");
	    	getCurrentPageObj().find('#STinvolve_app').removeAttr("valititle");
			
		}
		
	}


