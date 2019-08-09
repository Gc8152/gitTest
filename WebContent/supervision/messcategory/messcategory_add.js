
var assortFlag;//用于标记督办类别下创建模型
	//初始化新增模型
	function messcaTegory_initAdd(assortid){
		var call=getMillisecond();	
		assortFlag = assortid;
		//给必填项添加*
		initVlidate($("#add_messcategory"));
		//下拉框
		autoInitSelect($("#add_messcategory"));
		baseAjaxJsonp(dev_workbench+"Assortment/queryAssortmentList.asp?call="+call+"&SID="+SID+"&flag=00",null,function(data){
			$("#assortid_add").empty();
			$("#assortid_add").append('<option id="removeOption" value="" >请选择</option>');
			for(var i=0;i<data.rows.length;i++){
				$("#assortid_add").append('<option value="'+data.rows[i].ASSORTID+'"selected>'+data.rows[i].ASSORTNAME+'</option>');	
			};
			$("#assortid_add").select2();		
		},call);
	}	
	//保存督办模型
	function messcaTegory_add(){
		$("#closePageMesscaTegory_add").click(function(){
			nconfirm("确定离开该页面?",function(){
				closeCurrPageTab();
			});
		});
		var call=getMillisecond();	
		$("#messcaTegory_addButton").click(function(){
			//必填项验证
			if(!vlidate($("#add_messcategory"),99999999)){
				return ;
			}	
			//取值
			var inputs = $("input[name^='MTA.']");
			var selects = $("select[name^='MTA.']");
			var textareas = $("textarea[name^='MTA.']");
			var params = {};
			inputs.each(function(){
				params[$(this).attr("name").substr(4)] = $(this).val();
			});
			selects.each(function(){
				params[$(this).attr("name").substr(4)] = $(this).val();
			});
			textareas.each(function(){
				params[$(this).attr("name").substr(4)] = $(this).val();
			});
				params['opt_type'] = 'add';			
			var url = dev_workbench+"PucTMesscategory/puctMesscategoryAdd.asp?call="+call+"&SID="+SID;
			baseAjaxJsonp(url,params,function(data){
				if(data.result=="true"){
					alert("添加成功！");
					if(assortFlag!=null && assortFlag!=undefined){
						onModalCloseEvent("messcategoryPop");
						$("#messcategoryPop").modal("hide");
						$("#messstrategy_Table").bootstrapTable('refresh',{url:"PucTMesscategory/queryAllMesscategory.asp?assortid="+assortFlag});
					}else{
						closeCurrPageTab();
						closeAndOpenInnerPageTab("supervisionmodel_querylist","督办模型配置","supervision/messcategory/messcategory_queryList.html");
					}
				}else{
					alert("添加失败！");
				}
			},call);
		});
	};

	//保存督办模型
	messcaTegory_add();