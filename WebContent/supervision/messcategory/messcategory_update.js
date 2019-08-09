
var assortFlag;//用于标记督办类别下创建模型
	//初始化频率配置、修改
	function messcaTegory_initUpdate(category_code,assortid){
		var call=getMillisecond();
		assortFlag = assortid;
		//给必填项添加*
		initVlidate($("#update_messcategory"));
		//将模型编号赋值到页面上
		$("#messcategoryCode").val(category_code);
		//根据模型编号给模型赋值
		var url = dev_workbench+"PucTMesscategory/findMessCategoryByCode.asp?category_code="+category_code+"&call="+call+"&SID="+SID;
		baseAjaxJsonp(url,null,function(data){
			for(var k in data){
				$("input[name='UDP."+k.toLowerCase()+"']").val(data[k]);
					$("textarea[name='UDP." + k.toLowerCase() + "']").val(data[k]);		  
				if(k.toLowerCase()=='category_state'){
	   				   initSelect($("select[name='UDP." + k.toLowerCase() + "']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},data[k]);
				}
				if(k.toLowerCase()=='assortid'){
					var dataAssortid = data[k];
					baseAjaxJsonp(dev_workbench+"Assortment/queryAssortmentList.asp?call="+call+"&SID="+SID,"",function(result){
	   					$("#assortid_update").empty();
	   					$("#assortid_update").append('<option id="removeOption" value="" >请选择</option>');
	   					for(var i=0;i<result.rows.length;i++){
	   						if(dataAssortid==result.rows[i].ASSORTID){
	   							$("#assortid_update").append('<option value="'+result.rows[i].ASSORTID+'"selected>'+result.rows[i].ASSORTNAME+'</option>');	
	   						}else{
	   							$("#assortid_update").append('<option value="'+result.rows[i].ASSORTID+'">'+result.rows[i].ASSORTNAME+'</option>');		   							
	   						}
	   					};
	   					$("#assortid_update").select2();	
	   				},call);
				}
				if(k.toLowerCase()=='category_type'){
	   				   initSelect($("select[name='UDP." + k.toLowerCase() + "']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"M_DIC_MESSTYPE"},data[k]);
				}
			}
		},call);
	}
	//保存督办模型
	function messcaTegory_update(){
		$("#closePageMesscaTegory_update").click(function(){
			nconfirm("确定离开该页面?",function(){
				closeCurrPageTab();
			});
		});
		var call=getMillisecond();	
		$("#messcaTegory_updateButton").click(function(){
			//必填项验证
			if(!vlidate($("#update_messcategory"),99999999)){
				return ;
			}	
			//取值
			var inputs = $("input[name^='UDP.']");
			var selects = $("select[name^='UDP.']");
			var textareas = $("textarea[name^='UDP.']");
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
				params['opt_type'] = 'update';
				params['category_code'] = $("#messcategoryCode").val();
			var url = dev_workbench+"PucTMesscategory/puctMesscategoryAdd.asp?call="+call+"&SID="+SID;
			baseAjaxJsonp(url,params,function(data){
				if(data.result=="true"){
					alert("修改成功！");
					if(assortFlag!=null && assortFlag!=undefined){
						onModalCloseEvent("messcategoryPop");
						$("#messcategoryPop").modal("hide");
						$("#messstrategy_Table").bootstrapTable('refresh',{url:"PucTMesscategory/queryAllMesscategory.asp?assortid="+assortFlag});
					}else{
						closeCurrPageTab();
						closeAndOpenInnerPageTab("supervisionmodel_querylist","督办模型配置","supervision/messcategory/messcategory_queryList.html",function(){});
					}
				}else if(data.result=="blockup"){
					$("#categorystate span[class='selection']").append('<div id="remindinfo" class="tag-content" >'+"此模型的类别已停用，故此模型不能启用！"+'</div>');
				}else{
					alert("修改失败！");
				}
			},call);
		});
	};
   function removeinfo(){
	   $("#remindinfo").remove();
   }
	//保存督办模型
	messcaTegory_update();