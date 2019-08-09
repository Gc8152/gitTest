
function openThemePop(id,callparams,flag){
	if(flag){
		if(flag=="" || flag==null || flag==undefined)
			flag = true;
	}
	$('#myModal_theme').remove();
	$("#"+id).load("dev_construction/jury/conductPR/juryPop/themePop.html",{},function(){
		$("#myModal_theme").modal("show");
		//autoInitSelect($("#pop_themeState"));
		var themeCall = getMillisecond();
		themePop("#pop_themeTable",dev_construction+'GTheme/queryThemeList.asp?SID='+SID,callparams,flag);
		initSelect(getCurrentPageObj().find("#pop_themeGrade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"});

	});
}

/**
	 * 用户POP框
	 */
	function themePop(themeTable,themeUrl,themeParam,flag){
		//查询所有用户POP框
		$(themeTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : themeUrl,
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
					uniqueId : "THEME_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: flag,
					onDblClickRow:function(row){
						$('#myModal_theme').modal('hide');
						themeParam.name.val(row.THEME_NAME);
						themeParam.no.val(row.THEME_ID);
						themeParam.process_name.val(row.PROCESS_NAME);
						//themeParam.jury_type.val(row.REQ_TASK_STATE);
						
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
				        field: 'THEME_ID',
				        title: 'ID',
				        align:"center",
				        visible:false
				      }, {
				          field: 'THEME_NAME',
				          title: '主题名字',
				          align:"center"
				        },{
				          field: 'JURY_WORD_PRO',
				          title: '评审工作产品',
				          align:"center"
				       },{
				      	  field:"PROCESS_NAME",
				      	  title:"评审过程",
				          align:"center"
				      },{
				      	  field:"GRADE_NAME",
				      	  title:"评审等级",
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
		
		//获取选中记录的所有节点名称
		$("#pop_themeSave").click(function(){
			var records = $(themeTable).bootstrapTable('getSelections');
			var theme_nos = "";
			var theme_names = "";
			var theme_no = $.map(records, function (row) {
				
				return row.THEME_ID;                  
			});
			
			
			
			if($("#pop_themeTable input[type='checkbox']").is(':checked')){
				themeParam.name.val(theme_names);
				themeParam.no.val(theme_nos);
				$("#myModal_theme").modal("hide");
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
		getCurrentPageObj().find("#pop_themeReset").click(function(){
			getCurrentPageObj().find(".form-inline input").each(function(){
				$(this).val("");
			});
			getCurrentPageObj().find("#pop_themeGrade").val(" ");
			getCurrentPageObj().find("#pop_themeGrade").select2();
		});
		//多条件查询用户
		getCurrentPageObj().find("#pop_themeSearch").click(function(){
			var theme_name = getCurrentPageObj().find("#pop_themeName").val();
			var tnp=getCurrentPageObj().find("#pop_themeName").attr("placeHolder");
			if(theme_name==tnp){
				theme_name="";
			}
			var theme_grade =  $.trim($("#pop_themeGrade").val());
			
			$(themeTable).bootstrapTable('refresh',	{url:themeUrl+"&theme_name="+escape(encodeURIComponent(theme_name))+"&theme_grade="+theme_grade});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_themeSearch").click();});
	}
