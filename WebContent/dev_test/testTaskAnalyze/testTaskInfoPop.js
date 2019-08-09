(function(taskInfoPop){
	var $page=getCurrentPageObj();
	var testtask_id="";
	taskInfoPop.setUpdateData=function(opt){
		testtask_id=opt.testtask_id;
		var pop=$page.find("#addTestTaskPop");
		baseAjaxJsonpNoCall(dev_test+"testTaskAnalyze/queryReqTaskInfoByProject.asp?testtask_id="+opt.testtask_id,"",function(data){
			if(data&&data.rows){
				taskInfoPop.setFuncInfo(data.rows);
			}
		});
		pop.find("#test_task_name").val(opt.task["TEST_TASK_NAME"]);
		pop.find("[name='test_task_man_id']").val(opt.task["TEST_TASK_MAN_ID"]);
		pop.find("#test_task_man_name").val(opt.task["TEST_TASK_MAN_NAME"]);
		pop.find("[name='test_start_date']").val(opt.task["TEST_START_DATE"]);
		pop.find("[name='test_end_date']").val(opt.task["TEST_END_DATE"]);
		pop.find("[name='test_task_desc']").val(opt.task["TEST_TASK_DESC"]);
	};
	/**
	 * opt_data:{system_id:,system_name:,project_id:,project_name,func_info:{},success_call:function(){},}
	 */
	taskInfoPop.openPop=function(opt_data){
		testtask_id="";
		initHtml($page);
		initHtmlEvent($page,opt_data);
		initDefaultData(opt_data);
		$page.find("#addTestTaskPop").modal("show");
	};
	var initDefaultData=function(opt_data){
		$page.find("#test_system_name").val(opt_data["system_name"]);
		$page.find("#project_name").val(opt_data["project_name"]);
	};
	var initHtmlEvent=function($page,opt_data){
		var pop=$page.find("#addTestTaskPop");
		var saveTestTask=$page.find("#saveTestTask");
		var test_start_date=pop.find("input[name='test_start_date']");
		var test_end_date=pop.find("input[name='test_end_date']");
		var test_task_man_name=pop.find("#test_task_man_name");
		var test_task_man_id=pop.find("input[name='test_task_man_id']");
		var func_info_ele=pop.find("input[name='func_info']");
		saveTestTask.unbind("click").click(function(){
			if(!vlidate($page)){
				return ;
			}
			var param=(opt_data.func_info||{});
				param['testTaskInfo["test_task_name"]']=pop.find("#test_task_name").val();
				param['testTaskInfo["test_system_no"]']=opt_data["system_id"];
				param['testTaskInfo["project_id"]']=opt_data["project_id"];
				param['testTaskInfo["test_task_man_id"]']=test_task_man_id.val();
				param['testTaskInfo["test_start_date"]']=test_start_date.val();
				param['testTaskInfo["test_end_date"]']=test_end_date.val();
				param['testTaskInfo["test_task_desc"]']=pop.find("[name='test_task_desc']").val();
				if(testtask_id){
					param['testTaskInfo["test_task_id"]']=testtask_id;
				}
				baseAjaxJsonpNoCall(dev_test+"testTaskAnalyze/addTestTaskInfoByFunc.asp",param,function(data){
					if(data&&"true"==data.result){
						pop.modal("hide");
						alert("保存成功!");
					}else{
						alert("保存失败!");
					}
					if(opt_data.success_call){
						opt_data.success_call(data);
					}
				});
		});
		/**
		 * 设置功能信息
		 */
		 taskInfoPop.setFuncInfo=function(data){
			var func_info={};//任务关联的功能信息
			var func_name="";
			for(var i=0;i<data.length;i++){
				func_info["taskReqTaskInfo["+i+"]"]=data[i]["REQ_TASK_CODE"];
				func_name+=data[i]["REQ_TASK_CODE"]+";";
			}
			opt_data.func_info=func_info;
			func_info_ele.val(func_name);
		};
		func_info_ele.unbind("click").click(function(){
			taskFuncPop.openFuncPop({params:"&update_testId="+testtask_id,project_id:opt_data["project_id"],callback:function(data){
				taskInfoPop.setFuncInfo(data);
			}});
		});
		
		test_task_man_name.unbind("click").click(function(){
			openUserPop("testTaskUserPop",{role:"0100",name:test_task_man_name,no:test_task_man_id});
		});
		test_start_date.unbind("click").click(function(){
			WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:(test_end_date.val()||"2108-01-01")});
		});
		test_end_date.unbind("click").click(function(){
			WdatePicker({dateFmt:'yyyy-MM-dd',minDate:(test_start_date.val()||undefined)});
		});
	};
	var initHtml=function ($page){
		if($page.find("#addTestTaskPop").length>0){
			$page.find("#addTestTaskPop input[type!='button'],textarea").val("");
			return;
		}
		var html='';
		html+='<div id="addTestTaskPop" class="modal hide fade modal-big-table" tabindex="-1">                                               							';
		html+='	<div class="modal-header">                                                                                                   							';
		html+='		<button type="button" class="close" data-dismiss="modal" title="点击关闭">×</button>                                     							';
		html+='		<h5>新增测试任务</h5>                                                                                                    							';
		html+='	</div>                                                                                                                       							';
		html+='	<div class=" ecitic-title-table modal-body ecitic-new" style="max-height:460px">                                             							';
		html+='		<form id="addFuncForm">                                                                                                  							';
		html+='			<table border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad">                        							';
		html+='				<tr>                                                                                                             							';
		html+='                    <td class="table-text" style="width:30%">任务名称</td>                                                    							';
		html+='                    <td ><input type="text" id ="test_task_name"class="requirement-ele-width" validate="v.required" valititle="该项为必填项"></td>        ';
		html+='                </tr>                                                                                                         							';
		html+='                <tr>                                                                                                          							';
		html+='                    <td class="table-text">系统名称</td>                                                                      							';
		html+='                    <td id="tdAdd"><input type="text" id="test_system_name" class="requirement-ele-width" readonly></td>                                 ';
		html+='                </tr>                                                                                                         							';
		html+='                <tr>                                                                                                          							';
		html+='                	<td id="tdName"  class="table-text">项目名称</td>                                                            							';
		html+='                    <td id="tdAdd"><input type="text" id="project_name" class="requirement-ele-width" readonly></td>                                     ';
		html+='                </tr>                                                                                                         							';
		html+='                <tr>                                                                                                          							';
		html+='                    <td class="table-text">测试人员</td>                                                                      							';
		html+='                    <td > <input type="hidden" name="test_task_man_id">																					';
		html+='							 <input type="text" class="requirement-ele-width" id="test_task_man_name"validate="v.required" valititle="该项为必填项" readonly></td>';
		html+='                </tr>                                                                                                         							';
		html+='                 <tr>                                                                                                         							';
		html+='                    <td class="table-text">测试需求任务</td>                                                                  							';
		html+='                    <td ><input type="text" class="requirement-ele-width" name="func_info" validate="v.required" valititle="该项为必填项" readonly></td>';
		html+='                </tr>                                                                                                         							';
		html+='                 <tr>                                                                                                         							';
		html+='                    <td class="table-text">测试开始时间</td>                                                                  							';
		html+='                    <td ><input type="text" class="requirement-ele-width" name="test_start_date" validate="v.required" valititle="该项为必填项" readonly></td>';
		html+='                </tr>                                                                                                         							';
		html+='                <tr>                                                                                                          							';
		html+='                    <td class="table-text">测试结束时间</td>                                                                  							';
		html+='                    <td ><input type="text" class="requirement-ele-width" name="test_end_date" validate="v.required" valititle="该项为必填项" readonly></td>';
		html+='                </tr>                                                                                                         							';
		html+='                <tr>                                                                                                         							 ';
		html+='                    <td class="table-text">任务描述</td>                                                                      							';
		html+='                    <td rowspaln="3"><textarea  name="test_task_desc" class="requirement-ele-width" ></textarea></td>                               		';
		html+='                </tr>                                                                                                         							';
		html+='			</table>                                                                                                            							 ';
		html+='		</form>                                                                                                                 							 ';
		html+='	</div>                                                                                                                      							 ';
		html+='	 <div class="ecitic-save">                                                                                                 							     ';
		html+='            <input type="button"  class="btn btn-ecitic" id="saveTestTask" value="保存" />                                  							    ';
		html+='            <input type="button" class="btn btn-ecitic" btn="closeTestTask" data-dismiss="modal" value="返回" />                                  		';
		html+='     </div>                                                                                                                  							 ';
		html+='	<div class="modal-footer"></div>                                                                                            							 ';
		html+='</div>                                                                                                                      							    ';
		html+='<script src="pages/suser/suserPop.js"></script>';
		html+='<script src="dev_test/testTaskAnalyze/testTaskFuncInfoPop.js"></script>';
		html+='<div id="testTaskUserPop"></div>';
		$page.append(html);
		initVlidate($page);
	};
})(taskInfoPop={});