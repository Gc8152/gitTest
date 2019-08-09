var k=1;
function initUpdatePage(p_id){
	var call = getMillisecond();
	//初始化页面验证
	initVlidate(getCurrentPageObj().find("#update_form"));
	//初始化供应商pop
	var obj = getCurrentPageObj().find("#supplier_name_u");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("updatepriceSupplier_Pop",{singleSelect:true,parent_company:getCurrentPageObj().find("#supplier_name_u"),
			parent_sup_num:getCurrentPageObj().find("#supplier_id_u")});
	});
	//初始化合同pop框
	var obj = getCurrentPageObj().find("#contract_u");
	obj.unbind("click");
	obj.click(function(){
		var supplier_id= $("#supplier_id_u").val();
		if(supplier_id==""||supplier_id==undefined||supplier_id==null){
			alert("请先选择供应商！");
		}else{
			openContractInfoPop("updatepriceContract_Pop",{code:getCurrentPageObj().find("#contract_u")});
		}
	});
	var call = getMillisecond();
	baseAjaxJsonp(dev_outsource+'pPrice/findPPTypeById.asp?&p_id='+p_id+'&call='+call+'&SID='+SID,null,function(msg){
		//供应商编号
		$("#supplier_id_u").val(msg.SUPPLIER_ID);
		$("#supplier_name_u").val(msg.SUPPLIER_NAME);
		//类别
		initSelect(getCurrentPageObj().find("#p_category_u"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_ASS_TYPE"},msg.P_CATEGORY);
		//类型
		if("02"==msg.P_CATEGORY){
			initSelect(getCurrentPageObj().find("#p_type_u"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PEOPTYPE"},msg.P_TYPE);
		}else{
			initSelect(getCurrentPageObj().find("#p_type_u"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_OUTSOURCE_DEV"},msg.P_TYPE);
		}
		//合同号
		getCurrentPageObj().find("#contract_u").val(msg.CONTRACT);
		//开始时间
		getCurrentPageObj().find("#p_starttime_u").val(msg.P_STARTTIME);
		//结束时间
		getCurrentPageObj().find("#p_endtime_u").val(msg.P_ENDTIME);
		//主键
		getCurrentPageObj().find("#p_id_u").val(msg.P_ID);
		baseAjaxJsonp(dev_outsource+'pPrice/findPPriceById.asp?&p_id='+p_id+'&call='+call+'&SID='+SID,null,function(msg){
			for(var i=0;i<msg.total;i++){
				var tr=
					"<tr>" +
					"<td><select id='p_post_u"+(i+1)+"' name='P_POST'></select></td>" +
					"<td><select id='p_level_u"+(i+1)+"' name='P_LEVEL'></select></td>" +
//					"<td><input type='text' id='p_price_u"+(i+1)+"' name='P_PRICE' onchange='checkNum(this);'/></td>" +
					"<td><input type='text' id='p_price_tax_u"+(i+1)+"' name='P_PRICE_TAX'/></td>" +
					"<td><textarea type='text' id='p_memo_u"+(i+1)+"' name='P_MEMO' class='citic-text-ast'></textarea></td>" +
					"<td ><a  name='deleteprice' id='delete_u"+(i+1)+"' style='cursor: pointer;'>删除</a></td>" +
					"</tr>";
				getCurrentPageObj().find("#pUpdate").append(tr);
				initSelect(getCurrentPageObj().find("#p_post_u"+(i+1)),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"},msg.rows[i].P_POST);
				var value=msg.rows[i].P_LEVEL;
				initSelect(getCurrentPageObj().find("#p_level_u"+(i+1)),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"},msg.rows[i].P_LEVEL);
//				initSelect(getCurrentPageObj().find("#p_post_u"+(i+1)),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:value},msg.rows[i].P_POST);
//				getCurrentPageObj().find("#p_price_u"+(i+1)).val(msg.rows[i].P_PRICE);
				getCurrentPageObj().find("#p_price_tax_u"+(i+1)).val(msg.rows[i].P_PRICE_TAX);
				getCurrentPageObj().find("#p_memo_u"+(i+1)).val(msg.rows[i].P_MEMO);
				//删除加载行
				getCurrentPageObj().find("a[name='deleteprice']").click(function(){
					$(this).parent().parent().remove();
				});
				getCurrentPageObj().find("select[name='P_POST']").click(function(){
					var level=$(this).attr("id");
					var post=level.substr(0,8);
					level=level.substr(8,1);
					post=post+level;
					level="p_level_u"+level;
					var value= $('#'+level).val();
					if(value==undefined||value==null||value==""){
						alert("请先选择开发方向");
					}
				});
				k++;
			}
		},call);
	},call);
}
//添加行
function initPage(){
	//初始化供应商pop
	var obj = getCurrentPageObj().find("#supplier_id_name");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("updatepriceSupplier_Pop",{singleSelect:true,parent_company:getCurrentPageObj().find("#supplier_id_name"),
			parent_sup_num:getCurrentPageObj().find("input[name='supplier_id']")});
	});
	//添加一行单价
	getCurrentPageObj().find("#post_addtr").click(function(){
		 var tr=
			  "<tr>" +
			   /* "<td><select id='p_level_u"+k+"' name='P_LEVEL'  onchange='checkLevels(this)'></select></td>" +*/
			  	"<td><select id='p_post_u"+k+"' name='P_POST'></select></td>" +
			  	"<td><select id='p_level_u"+k+"' name='P_LEVEL'></select></td>" +
//		 		"<td><input type='text' id='p_price_u"+k+"' name='P_PRICE'/></td>" +
		 		"<td><input type='text' id='p_price_tax_u"+k+"' name='P_PRICE_TAX'/></td>" +
		 		"<td><textarea type='text' id='p_memo_u"+k+"' name='P_MEMO' class='citic-text-ast'></textarea></td>" +
		 		"<td><a  name='deleteprice' id='delete_u"+k+"' style='cursor: pointer;'>删除</a></td>" +
		 	"</tr>";
		 getCurrentPageObj().find("#pUpdate").append(tr);
		 initSelect(getCurrentPageObj().find("#p_post_u"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_DEV_DIRECT"});
			initSelect(getCurrentPageObj().find("#p_level_u"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_LEVEL"});
		k++;
		//删除加载行
		getCurrentPageObj().find("a[name='deleteprice']").click(function(){
			$(this).parent().parent().remove();
		});
		//判断人员档次是否有值
		getCurrentPageObj().find("select[name='P_POST']").click(function(){
			var level=$(this).attr("id");
			var post=level.substr(0,8);
			level=level.substr(8,1);
			post=post+level;
			level="p_level_u"+level;
			var value= $('#'+level).val();
			if(value==undefined||value==null||value==""){
				alert("请先选择开发方向");
			}
			
		});
   });
	//修改按钮
	getCurrentPageObj().find("#pprice_update").click(function(){
		//必填验证
		if(!vlidate(getCurrentPageObj().find("#update_form"))){
			return;
		}
		var dataJSON = new Array;//岗位单价信息
		var trs=getCurrentPageObj().find("#pUpdate tr:gt(0)");
		if(trs.length<=0){
			alert("至少添加一条人员单价信息!");
			return;
		}
		var postMap={};
//		var levelMap={};
		for(var i=0;i<trs.length;i++){
			var p_level=$(trs[i]).find("select[name='P_LEVEL']").val();
			var p_post=$(trs[i]).find("select[name='P_POST']").val();
			var postlevel=p_post+p_level;
			if(postMap[postlevel]){//如果该岗位已经存在
				alert("第"+(i + 1) + "人员级别信息重复");
				return;
			}else{
				postMap[postlevel]="1";//记录已经存在的岗位 
			}
//			var p_price=$(trs[i]).find("input[name='P_PRICE']").val();
			var p_price_tax=$(trs[i]).find("input[name='P_PRICE_TAX']").val();
			var p_memo=$(trs[i]).find("textarea[name='P_MEMO']").val();
			var datarows = {};
			datarows.p_level = p_level;
			datarows.p_post = p_post;
			if($.trim(p_level)==""||p_level==undefined||p_level==null){
				alert("第"+(i+1)+"行人员级别未选择！");
				return;
			}
			if($.trim(p_post)==""||p_post==undefined||p_post==null){
				alert("第"+(i+1)+"行开发方向未选择！");
				return;
			}
//			datarows.p_price=p_price;
			datarows.p_price_tax=p_price_tax;
			if($.trim(p_price_tax)==""||p_price_tax==undefined||p_price_tax==null){
				alert("第"+(i+1)+"行含税单价不能为空！");
				return;
			}else{
				var reg = new RegExp("^[0-9]+(.[0-9]{1,4})?$");
				if(!reg.test(p_price_tax)){
			        alert("第"+(i+1)+"行单价请保留两位小数!");
			        return;
			    }
//				checkNum(p_price_tax);
			}
//			if(parseFloat(p_price)>parseFloat(p_price_tax)){
//				alert("第"+(i+1)+"含税单价不能小于不含税单价！");
//				return;
//			}
			datarows.p_memo=p_memo;
			dataJSON.push(datarows);
		}
		var DataJSON=JSON.stringify(dataJSON);
		var talebJSON = new Array;//供应商合同 类别信息
		var datarow = {};
		datarow.supplier_id=getCurrentPageObj().find("#supplier_id_u").val();
		datarow.contract=getCurrentPageObj().find("#contract_u").val();
		datarow.p_category=getCurrentPageObj().find("#p_category_u").val();
		datarow.p_type=getCurrentPageObj().find("#p_type_u").val();
		datarow.p_starttime=getCurrentPageObj().find("#p_starttime_u").val();
		datarow.p_endtime=getCurrentPageObj().find("#p_endtime_u").val();
		datarow.p_id=getCurrentPageObj().find("#p_id_u").val();
		talebJSON.push(datarow);
		var TableJSON=JSON.stringify(talebJSON);
		var call = getMillisecond();
		baseAjaxJsonp(dev_outsource+"pPrice/updatePPrice.asp?call="+call+'&SID='+SID,{'p':DataJSON,'q':TableJSON},function(msg){
			var data=msg.result;
			if(data=="true"){
				alert("保存成功！");
				closeCurrPageTab();
				getCurrentPageObj().find("#personal_price_query").bootstrapTable('refresh');
			}else{
				alert("保存失败！");
			}
		},call);
	});
}
//初始化页面
initPage();
//级联
function checkLevels(obj){
	var level=obj.id;
	level=level.substr(7);
	initSelect(getCurrentPageObj().find("#p_post"+level),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:obj.value});
}