var calls = getMillisecond();
$(function(){
	//新增
	getCurrentPageObj().find("#addSupplierConfigBtn").click(function(){
		var appendtr=buildTr("","","","","","");
		getCurrentPageObj().find("#addSupplierConfig_table").append(appendtr);
		//分类1
		initSelectForItem(".itemTr:last select[name='categoryone']","SUP_CATEGORT_ONE","");
		initSelectForItem(".itemTr:last select[name='categorytwo']","SUP_CATEGORT_SECOND","");
		initSelectForItem(".itemTr:last select[name='categorythree']","SUP_CATEGORT_THIRD","");
		initSelectForItem(".itemTr:last select[name='checkitem']","SUP_CHECKITEM","");
		initSelectForItem(".itemTr:last select[name='checkmode']","SUP_CHECKMODE","");
	});
	//保存
	getCurrentPageObj().find("#save_addSupplierConfig").unbind();
	getCurrentPageObj().find("#save_addSupplierConfig").click(function(){
		if(!vlidate(getCurrentPageObj().find("#addsupConfigForm"))){
			return ;
		}
		var objarr=[];
		var trLength=getCurrentPageObj().find("tr[class^=itemTr]").length;
		var configId=getCurrentPageObj().find("#config_id").val();
		var category=getCurrentPageObj().find("#category").val();
		var importdegree=getCurrentPageObj().find("#importdegree").val();
		var id,categoryOne,categoryTwo,categoryThree,checkItem,checkMode;
		for(var i=0;i<trLength;i++){
			id=getCurrentPageObj().find(".itemTr:eq("+i+") input[name='id']").val();
			categoryOne=getCurrentPageObj().find(".itemTr:eq("+i+") select[name='categoryOne']").val();
			categoryTwo=getCurrentPageObj().find(".itemTr:eq("+i+") select[name='categoryTwo']").val();
			categoryThree=getCurrentPageObj().find(".itemTr:eq("+i+") select[name='categoryThree']").val();
			checkItem=getCurrentPageObj().find(".itemTr:eq("+i+") select[name='checkItem']").val();
			checkMode=getCurrentPageObj().find(".itemTr:eq("+i+") select[name='checkMode']").val();
			objarr.push(buildPO(id,configId,categoryOne,categoryTwo,categoryThree,checkItem,checkMode));
		}
		
		var param={};
		param.id=configId;
		param.category=category;
		param.importdegree=importdegree;
		param.itemJson=JSON.stringify(objarr);
		var url="supplierConfig/addSupplierConfig.asp";
		var tips="保存";
		if(configId!=null&&configId!=""&&configId!=undefined){
			url=dev_outsource+"supplierConfig/updateSupplierConfig.asp?SID="+SID+"&call="+calls;
			tips="修改";
		}
		baseAjaxJsonp(url,param,function(data){
			if(data != undefined&&data!=null&&data.result=="true"){				
				alert(tips+"成功");	
				closeCurrPageTab();
			}else{
				alert(tips+"失败");
			}
		},calls);
	});
});
//关闭
getCurrentPageObj().find("#close_addSupplierConfig").unbind();
getCurrentPageObj().find("#close_addSupplierConfig").click(function(){
	closeCurrPageTab();
});
/**
 * 初始化列表
 * @param 
 */
function initSelectForItem(objId,query_diccode,defaultValue){
	baseAjaxJsonp(dev_outsource+"supDic/queryAllSupDic.asp?flag=item&query_diccode="+query_diccode+"&SID="+SID+"&call="+calls,null,function(data){
		if(data!=null&&data.rows!=null){
			 var d=data.rows;
			 var obj=getCurrentPageObj().find(objId);
			 obj.empty();
			 var op='<option id="removeOption" value="" >请选择</option>';
			 for(var j=0;j<d.length;j++){
					op+='<option value="'+d[j]["ITEMCODE"]+'">'+d[j]["ITEMNAME"]+'</option>';	
			 }
			obj.append(op);
			if(defaultValue!=undefined&&defaultValue!=""){
				obj.val(defaultValue);
			}else{
				obj.val("");
			}
			obj.select2();
		 }
	},calls);
}


/**
 * 初始化页面
 * @param configId:模板id
 * @param opertype：操作类型
 */
function initSupConfigDetail(configId,opertype){
	if(configId!=null&&configId!=""&&configId!=undefined){
		baseAjaxJsonp(dev_outsource+"supplierConfig/queryOneSupplierConfig.asp?configId="+configId+"&SID="+SID+"&call="+calls,null,function(data){
			if(data!=null&&data.configInfo!=null){
				var cf=data.configInfo;
				if(opertype=="detail"){
					getCurrentPageObj().find("#category").attr("disabled","disabled");
					getCurrentPageObj().find("#importdegree").attr("disabled","disabled");
					//隐藏保存和增加按钮
					getCurrentPageObj().find("#save_addSupplierConfig").hide();
					getCurrentPageObj().find("#addSupplierConfigBtn").hide();
				}
				initSelect($("#category"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_TECHNOLOGIC_MANAGE"},cf["CATEGORY"]);
				initSelect($("#importdegree"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_SUP_LEVEL"},cf["IMPORTDEGREE"]);
				getCurrentPageObj().find("#config_id").val(cf["CONFIGID"]);

			}
			if(data!=null&&data.itemlist!=null){
				var list=data.itemlist;
				for(var i=0;i<list.length;i++){
					var appendtr=buildTr(list[i]["ID"],"","","","","");
					getCurrentPageObj().find("#addSupplierConfig_table").append(appendtr);
					//分类1
					if(opertype=="detail"){
						getCurrentPageObj().find(".itemTr select[name=categoryone]").attr("disabled","disabled");
						getCurrentPageObj().find(".itemTr select[name=categorytwo]").attr("disabled","disabled");
						getCurrentPageObj().find(".itemTr select[name=categorythree]").attr("disabled","disabled");
						getCurrentPageObj().find(".itemTr select[name=checkitem]").attr("disabled","disabled");
						getCurrentPageObj().find(".itemTr select[name=checkmode]").attr("disabled","disabled");
					}
					getCurrentPageObj().find(".itemTr:eq("+(i)+") input[name='id']").val(list[i]["ID"]);
					initSelectForItem(".itemTr:last select[name='categoryone']","SUP_CATEGORT_ONE",list[i]["CATEGORYONE"]);
					initSelectForItem(".itemTr:last select[name='categorytwo']","SUP_CATEGORT_SECOND",list[i]["CATEGORYTWO"]);
					initSelectForItem(".itemTr:last select[name='categorythree']","SUP_CATEGORT_THIRD",list[i]["CATEGORYTHREE"]);
					initSelectForItem(".itemTr:last select[name='checkitem']","SUP_CHECKITEM",list[i]["CHECKITEM"]);
					initSelectForItem(".itemTr:last select[name='checkmode']","SUP_CHECKMODE",list[i]["CHECKMODE"]);
				}
			}
		},calls);
	}else{
		initSelect($("#category"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_TECHNOLOGIC_MANAGE"});
		initSelect($("#importdegree"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_SUP_LEVEL"});
	}
}
/**
 * 构造tr
 * @param xh
 * @param id
 * @param categoryone
 * @param categorytwo
 * @param categorythree
 * @param checkitem
 * @param checkmode
 * @returns {String}
 */
function buildTr(id,categoryone,categorytwo,categorythree,checkitem,checkmode){
	var tr='<tr class="itemTr">'+
	 '<td>'+'<input type="hidden" name="id" id="supitemid" value="'+id+'"/>'+
	 '<select  name="categoryone"  id="categoryone" validate="v.required" valititle="该项为必填项"></select></td>'+
	 '<td><select  name="categorytwo"  id="categorytwo" validate="v.required" valititle="该项为必填项"></select></td>'+
	 '<td><select  name="categorythree"  id="categorythree" validate="v.required" valititle="该项为必填项"></select></td>'+
	 '<td><select  name="checkitem"  id="checkitem" validate="v.required" valititle="该项为必填项"></select></td>'+
	 '<td><select  name="checkmode"  id="checkmode" validate="v.required" valititle="该项为必填项"></select></td>'+
	 '<td><a onclick="deleteOneConfigItem(this)">删除</a></td></tr>';
	return tr;
}
/**
 * 构造实体
 * @param id
 * @param categoryOne
 * @param categoryTwo
 * @param categoryThree
 * @param checkItem
 * @param checkMode
 * @returns {___anonymous7239_7240}
 */
function buildPO(id,configId,categoryOne,categoryTwo,categoryThree,checkItem,checkMode){
	var po={};
	po.id=turnValue(id);
	po.configId=turnValue(configId);
	po.categoryOne=turnValue(categoryOne);
	po.categoryTwo=turnValue(categoryTwo);
	po.categoryThree=turnValue(categoryThree);
	po.checkItem=turnValue(checkItem);
	po.checkMode=turnValue(checkMode);
	return po;
}
function turnValue(value){
	if(value==""||value==undefined||value==null){
		return "";
	}else{
		return value;
	}
}
/**
 * 删除
 * @param id
 */
function deleteOneConfigItem(obj){
	var obj1=$(obj).parents("tr");
	var id=obj1.find("input[name='id']").val();
	if(id!=null&&id!=undefined&&id!=""){
		nconfirm("确定要删除该数据吗？",function(){
			baseAjaxJsonp(dev_outsource+"supplierConfig/deleteSupplierConfigItem.asp?id="+id+"&SID="+SID+"&call="+calls,null, function(data) {
			/*$.ajax({
				type : "get",
				url : "supplierConfig/deleteSupplierConfigItem.asp?id="+id,
				dataType : "json",
				success : function(msg) {*/
					alert("删除成功！");
					obj1.remove();
				/*},
				error : function() {	
					alert("删除失败！");
				}*/
			},calls);
		});		
	}else{
		obj1.remove();
	}
}

  