
function openCheckPop(id,callparams,flag,table_id){
	if(flag){
		if(flag=="" || flag==null || flag==undefined)
			flag = true;
	}
	$('#myModal_check').remove();
	$("#"+id).load("dev_construction/jury/conductPR/juryPop/checkPop.html",{},function(){
		getCurrentPageObj().find("#myModal_check").modal("show");
		//autoInitSelect(getCurrentPageObj().find("#pop_checkState"));
		var checkCall = getMillisecond();
		checkPop("#pop_checkTable",dev_construction+'GJury/queryCheckTaskList.asp?SID='+SID,callparams,flag,table_id);
		initSelect(getCurrentPageObj().find("#pop_checkGrade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"});
	});
}

/**
	 * 用户POP框
	 */
	function checkPop(checkTable,checkUrl,checkParam,flag,table_id){
		//查询所有用户POP框
		getCurrentPageObj().find(checkTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : checkUrl,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,15],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "CHECK_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: flag,
					onDblClickRow:function(row){
						getCurrentPageObj().find("#myModal_check").modal("hide");
						var records_old = getCurrentPageObj().find("#"+table_id).bootstrapTable('getData');
						
							var flag = true;
							$.map(records_old, function (row2) {
								if(row.CHECK_ID==row2.CHECK_ID)
									flag=false;
							})
							if(flag)
							addUserTaks(table_id,row);
					},
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
						        field: 'CHECK_ID',
						        title: 'ID',
						        align:"center",
						        visible:false
						      }, {
						          field: 'CHECK_NAME',
						          title: '检查项名字',
						          align:"center"
						        },{
						          field: 'GRADE_NAME',
						          title: '级别',
						          align:"center"
						       },{
						      	  field:"JURY_PRINCIPAL_NAME",
						      	  title:"评审负责人角色",
						          align:"center"
						      }]
				});
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
			};
			return temp;
		};		
		//获取选中节点数据
		
		getCurrentPageObj().find("#pop_checkSave").click(function(){
			
			var records = getCurrentPageObj().find(checkTable).bootstrapTable('getSelections');
			var records_old = getCurrentPageObj().find("#"+table_id).bootstrapTable('getData');
			var check_no = $.map(records, function (row) {
				var flag = true;
				
				$.map(records_old, function (row2) {
					if(row.CHECK_ID==row2.CHECK_ID)
						flag=false;
				})
				if(flag)
					addUserTaks(table_id,row);
			});
			getCurrentPageObj().find("#myModal_check").modal("hide");;
			
		});
		//获取选中记录的所有节点名称
		getCurrentPageObj().find("#pop_checkSave2").click(function(){
			var records = getCurrentPageObj().find(checkTable).bootstrapTable('getSelections');
//			var check_nos = "";
//			var check_names = "";
			var check_no = $.map(records, function (row) {
					var JURY_PRINCIPAL_NAME = row.JURY_PRINCIPAL_NAME;
					if(JURY_PRINCIPAL_NAME==null||JURY_PRINCIPAL_NAME==""||JURY_PRINCIPAL_NAME==undefined)
						JURY_PRINCIPAL_NAME = "所有人";
					var trHtml="<tr id='row' align='center'><td> <div class='form-control2' ><input name='jury_check' value='"+row.CHECK_ID+"' type='checkbox'/></div>"+
				    "</td><td>"+row.CHECK_NAME+"</td><td>"+JURY_PRINCIPAL_NAME+"</td></tr>"; 
					//
				  
				    var flag = true;
					 var chobj= getCurrentPageObj().find("input[name='check_task']:checkbox"); 
				     var delid="";//删除的ID  
				     chobj.each(function(){  
						if(row.CHECK_ID==$(this).val()){
							flag=false;
						}
				     });
				     if(flag){
				    	 var $tr=$("#"+table_id+" tr").eq("-1"); 
						$tr.after(trHtml);  
				     }
				     
				return row.REQ_TASK_NAME;                  
			});
			
			
			
			if($("#pop_checkTable input[type='checkbox']").is(':checked')){
//				checkParam.name.val(check_names);
//				checkParam.no.val(check_nos);
				$("#myModal_check").modal("hide");
			}else{
		        $.Zebra_Dialog('请选择一条或多条记录进行添加!', {
		            'type':     'close',
		            'title':    '提示',
		            'buttons':  ['是'],
		            'onClose':  function(caption) {
		            	if(caption=="是"){
		            	}
		            }
		        });
			}
		});
		
		//用户POP重置
		getCurrentPageObj().find("#pop_checkReset").click(function(){
			getCurrentPageObj().find("#check_query input").each(function(){
				$(this).val("");
			});
			getCurrentPageObj().find("#pop_checkGrade").val(" ");
			getCurrentPageObj().find("#pop_checkGrade").select2();
		});
		//多条件查询用户
		getCurrentPageObj().find("#pop_checkSearch").click(function(){
			var checkName = getCurrentPageObj().find("#pop_checkName").val();
			var checkGrade =  getCurrentPageObj().find("#pop_checkGrade").val();
			$(checkTable).bootstrapTable('refresh',	{url:checkUrl+"&checkName="+escape(encodeURIComponent(checkName))+"&checkGrade="+checkGrade});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_checkSearch").click();});
	}