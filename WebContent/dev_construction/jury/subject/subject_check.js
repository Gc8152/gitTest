
var checkCall = "checkList";
initGCheckInfo();
//初始化表格

function reloadCheck(theme_id){
	$('#ThemeCheckTable').bootstrapTable('refresh',{url : dev_construction+'GCheck/queryCheckList.asp?call='+checkCall+'&SID='+SID+'&theme_id='+theme_id});
}

function initGCheckList(theme_id){
	//var theme_id=1;
	//var themeCall = "theme_list";
		//getMillisecond();
	$("#ThemeCheckTable").bootstrapTable("destroy").bootstrapTable({
	      url: dev_construction+'GCheck/queryCheckList.asp?call='+checkCall+'&SID='+SID+'&theme_id='+theme_id,     //请求后台的URL（*）
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
	      uniqueId: "CHECK_ID",           //每一行的唯一标识，一般为主键列
	      cardView: false,          //是否显示详细视图
	      detailView: false,          //是否显示父子表	
	      jsonpCallback:checkCall,
	      singleSelect: true,//复选框单选
	      onLoadSuccess:function(data){
	    	  
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
	          title: '主题名字',
	          align:"center"
	        },{
	          field: 'ITEM_NAME',
	          title: '级别',
	          align:"center"
	       },{
	      	  field:"JURY_PRINCIPAL_NAME",
	      	  title:"评审负责人",
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
//checkBox多选 方法回调
function checkGrade(){
	var spCodesTemp = "";
	getCurrentPageObj().find('input:checkbox[name=checkGradeName]:checked').each(function(i){
       if(0==i){
    	   spCodesTemp = getCurrentPageObj().find(this).val();
       }else{
    	   spCodesTemp += (","+getCurrentPageObj().find(this).val());
       }
       
     });
	getCurrentPageObj().find('#jury_check_grade').val(spCodesTemp);
	
}

function initGCheckInfo(){
		//添加页面pop框弹出
		var theme_id = $("#theme_id").val();
		getCurrentPageObj().find("#check_add").click(function() {
			
			//alert($("#themeFrom input[name='G.jury_grade']").val());
			closeAndOpenInnerPageTab("update_check","添加检查项","dev_construction/jury/subject/subject_check.html",function(){	
				getCurrentPageObj().find("#check_save").val("add");
				getCurrentPageObj().find("#theme_id").val(theme_id);
				initCheck(getCurrentPageObj().find("#juryCheckGrade"),{dic_code:"G_DIC_JURY_GRADE"},"checkGradeName","checkGrade");
				baseAjax('SRole/querySrole.asp',null,function(data){
					var jury_principal=getCurrentPageObj().find("#check_principal_role");
					if(data!=undefined){
						jury_principal.empty();
						for(var i=0;i<data.srole.length;i++){
							jury_principal.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
						}
						jury_principal.select2();
					};
				});
			});
			
		});
		
		
		
		//修改页面pop框弹出
		getCurrentPageObj().find("#check_edit").click(function() {
			var expertsCall = getMillisecond();
			var id = getCurrentPageObj().find("#ThemeCheckTable").bootstrapTable('getSelections');
			var ids = $.map(id, function (row) {return row.CHECK_ID;});	
			if(ids==null||ids==undefined||ids==""){
				alert("请选择一条数据！");
				return;
			}else{	
				var check_id = ids[0];
				
				closeAndOpenInnerPageTab("update_check","添加检查项","dev_construction/jury/subject/subject_check.html",function(){	
					getCurrentPageObj().find("#check_save").val("edit");
					getCurrentPageObj().find("#theme_id").val(theme_id);
				
					baseAjaxJsonp(dev_construction+'GCheck/queryCheckById.asp.asp?call='+expertsCall+'&SID='+SID+"&check_id="+check_id,null, function(data) {
						if (data != undefined&&data!=null&&data.result=="true") {
							
							for ( var k in data) {
								var str = data[k];
								k = k.toLowerCase();
								getCurrentPageObj().find("#"+k).val(str);
							}
							getCurrentPageObj().find("#check_principal_name").val(data.JURY_PRINCIPAL_NAME);
							getCurrentPageObj().find("#check_principal_role").val(data.JURY_PRINCIPAL_ROLE);
							var mycars=data.JURY_PRINCIPAL_ROLE.split(",");
							
							baseAjax('SRole/querySrole.asp',null,function(data){
								var jury_principal=getCurrentPageObj().find("#check_principal_role");
								if(data!=undefined){
									jury_principal.empty();
									for(var i=0;i<data.srole.length;i++){
										jury_principal.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									}
									jury_principal.select2();
								};
								getCurrentPageObj().find("#check_principal_role").val(mycars).trigger('change');
							});	
							initCheck(getCurrentPageObj().find("#juryCheckGrade"),{dic_code:"G_DIC_JURY_GRADE"},"checkGradeName","checkGrade",data.ITEM_CODE);
							getCurrentPageObj().find('#jury_check_grade').val(data.ITEM_CODE);
						}else{
							alert("查询失败");
						}
					},expertsCall);	
				});
			}
		});
		
		
		
		//保存
		$("#checkSave").click(function(){
			if(!vlidate($("#checkForm"))){
	    		return;
	   		}
			var expertsCall = getMillisecond();
			var params = getPageParam("G");		//遍历当前页面的input,text,select
			var check_save = getCurrentPageObj().find("#check_save").val();
			//var theme_id = getCurrentPageObj().find("#theme_id").val();
			var jury_principal_name = "";
			//var jury_principal_role = getCurrentPageObj().find("#check_principal_role").val();
			$("#check_principal_role option:selected").each(function(){
				if(jury_principal_name!="")
					jury_principal_name = jury_principal_name+","+$(this).text(); 
				else
					jury_principal_name = $(this).text();
	        });
			params['theme_id'] = theme_id;
			params['check_save'] = check_save;
			params['jury_principal_role'] = params['check_principal_role'].toString();
			params['jury_principal_name'] = jury_principal_name;
			
			
			
					//修改操作页面
			baseAjaxJsonp(dev_construction+'GCheck/insertCheck.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("添加成功");
					getCurrentPageObj().find("#setProcessModel").modal("hide");
					closePageTab("update_check");
					reloadCheck(theme_id);
				}else{
					alert("添加失败");
				}
			},expertsCall);
			
		});
		//关闭
		getCurrentPageObj().find("#checkClose").click(function(){
			closePageTab("update_check");
		});
		
		//删除
		getCurrentPageObj().find("#check_del").click(function(){
			var checkDelCall = getMillisecond();
			var id = getCurrentPageObj().find("#ThemeCheckTable").bootstrapTable('getSelections');
			var ids = $.map(id, function (row) {return row.CHECK_ID;});	
			if(ids==null||ids==undefined||ids==""){
				alert("请选择一条数据！");
				return;
			}else{	
				var params={};
				params["check_id"] = ids[0];
				nconfirm("是否确定删除？",function(){
				baseAjaxJsonp(dev_construction+'GCheck/deleteCheck.asp?call='+checkDelCall+'&SID='+SID,params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						alert("删除成功");
						//closePageTab("update_check");
						//reloadCheck(theme_id);
						//getCurrentPageObj().find('#ThemeCheckTable').bootstrapTable('refresh',{url : dev_construction+'GCheck/queryCheckList.asp?call='+checkCall+'&SID='+SID+'&theme_id='+theme_id});
						$("#ThemeCheckTable").bootstrapTable('remove', {
							field: 'CHECK_ID',
							values: ids
						});	
					}else{
						alert("删除失败");
					}
				},checkDelCall);
				});
			}
		});

		getCurrentPageObj().find("#check_principal_name").click(function(){ 
			openRolePop("addDivCheck",{name:$("#check_principal_name"),no:$("#check_principal_role")},false);
		});	
};

