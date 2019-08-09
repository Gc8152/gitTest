var i = 1;
function initPPriceAddPage() {// 初始化新增页面
	var obj = getCurrentPageObj().find("#supplier_name_a");// 初始化供应商pop
	obj.unbind("click");
	obj.click(function() {
		openSupplierPop("addpriceSupplier_Pop", {
			singleSelect : true,
			parent_company : getCurrentPageObj().find("#supplier_name_a"),
			parent_sup_num : getCurrentPageObj().find("#supplier_id_a")
		});
	});
	var objc = getCurrentPageObj().find("#contract_a");// 初始化合同pop框
	objc.unbind("click");
	objc.click(function() {
		var supplier_id = $("#supplier_id_a").val();
		if (supplier_id == "" || supplier_id == undefined
				|| supplier_id == null) {
			alert("请先选择供应商！");
		} else {
			openContractInfoPop("addpriceContract_Pop", {
				code : getCurrentPageObj().find("#contract_a")
			}, supplier_id);
		}
	});
	getCurrentPageObj().find("#post_add").click(function() {// 添加一行单价
			var tr = "<tr>"
					//开发方向
					+ "<td><select id='p_post"+ i+ "' name='pp.P_POST' ></select></td>"
					//人员级别
					+ "<td><select id='p_level"+ i+ "' name='pp.P_LEVEL'></select></td>"
					/*+ "<td><select id='p_level"+ i+ "' name='pp.P_LEVEL' onchange='checkLevel(this)' ></select></td>"*/
					//含税单价
					+ "<td><input type='text' id='p_price_tax"+ i+ "' name='pt.P_PRICE_TAX'/></td>"
					//备注
					+ "<td><textarea type='text' id='p_memo"+ i+ "' name='pm.P_MEMO' class='citic-text-ast'></textarea></td>"
					+ "<td ><a name='deleteprice' id='delete" + i+ "' style='cursor: pointer;'>删除</a></td>"
					+ "</tr>";
			$("#pprice_add_table").append(tr);
			// 开发方向
			initSelect(getCurrentPageObj().find("#p_post" + i), {value : "ITEM_CODE",text : "ITEM_NAME"}, {dic_code : "C_DIC_OUTPERSION_DEV_DIRECT"});
			initSelect(getCurrentPageObj().find("#p_level" + i), {value : "ITEM_CODE",text : "ITEM_NAME"}, {dic_code : "C_DIC_OUTPERSION_LEVEL"});
			//			getCurrentPageObj().find("#p_post" + i).select2();
			i++;
			// 删除加载行
			getCurrentPageObj().find("a[name='deleteprice']").click(function() {
				$(this).parent().parent().remove();
			});
			// 判断开发方向是否有值
			getCurrentPageObj().find("select[name='pp.P_POST']").click(function() {
				var level = $(this).attr("id");// level=p_posti
				var post = level.substr(0, 6);// post=p_post
				level = level.substr(6, 1);// level=i
				post = post + level;
				level = "p_level" + level;
				var value = $('#' + level).val();
				if (value == undefined
						|| value == null
						|| value == "") {
					alert("请先选择开发方向");
				}
			});
		});
	// 保存按钮
	getCurrentPageObj().find("#pprice_save").click(
			function() {
				// 必填验证
				if (!vlidate(getCurrentPageObj().find("#pprice_au"))) {
					return;
				}
				var dataJSON = new Array;// 岗位单价信息
				var trs = getCurrentPageObj().find("#pprice_add_table tr:gt(0)");
				if (trs.length <= 0) {
					alert("至少添加一条人员单价信息!");
					return;
				}
				var postMap = {};
				for (var i = 0; i < trs.length; i++) {
					var p_post = $(trs[i]).find("select[name='pp.P_POST']").val();
					var p_level = $(trs[i]).find("select[name='pp.P_LEVEL']").val();
					var postlevel=p_post+p_level;
					if (postMap[postlevel]) {// 如果该岗位已经存在
						alert("第"+(i + 1) + "人员级别信息重复");
						return;
					} else {
						postMap[postlevel] = "1";// 记录已经存在的岗位
					}
					var p_level = $(trs[i]).find("select[name='pp.P_LEVEL']").val();
					var p_price_tax = $(trs[i]).find("input[name='pt.P_PRICE_TAX']").val();
					var p_memo = $(trs[i]).find("textarea[name='pm.P_MEMO']").val();
					var datarows = {};
					if ($.trim(p_level) == "" || p_level == undefined|| p_level == null) {
						alert("第" + (i + 1) + "行开发方向未选择！");
						return;
					}
					if ($.trim(p_post) == "" || p_post == undefined|| p_post == null) {
						alert("第" + (i + 1) + "行人员级别未选择！");
						return;
					}
					datarows.p_level = p_level;
					datarows.p_post = p_post;
					if ($.trim(p_price_tax) == "" || p_price_tax == undefined|| p_price_tax == null) {
						alert("第" + (i + 1) + "含税单价不能为空！");
						return;
					}else{
						var reg = new RegExp("^[0-9]+(.[0-9]{1,4})?$");
						if(!reg.test(p_price_tax)){
					        alert("第"+(i+1)+"行单价(含税:元)请保留两位位小数!");
					        return;
					    }
					}
					datarows.p_price_tax = p_price_tax;
					datarows.p_memo = p_memo;
					dataJSON.push(datarows);
				}
				var DataJSON = JSON.stringify(dataJSON);
				var talebJSON = new Array;// 供应商合同 类别信息
				var datarow = {};
				datarow.supplier_id = getCurrentPageObj().find("#supplier_id_a").val();
				datarow.contract = getCurrentPageObj().find("#contract_a").val();
				datarow.p_starttime = getCurrentPageObj().find("#p_starttime_a").val();
				datarow.p_endtime = getCurrentPageObj().find("#p_endtime_a").val();
				talebJSON.push(datarow);
				var TableJSON = JSON.stringify(talebJSON);
				var call = getMillisecond();
				// 保存新增信息.
				baseAjaxJsonp(dev_outsource+'pPrice/addPPrice.asp?call='+call+'&SID='+SID, {'p' : DataJSON,'q' : TableJSON}, function(msg) {
					var data = msg.result;
					if (data == "true") {
						alert("保存成功！");
						closeCurrPageTab();
						getCurrentPageObj().find("#personal_price_query").bootstrapTable('refresh');
					} else if (data == "exist") {
						alert("该类别信息下的人员单价已存在，不能重复添加");
					} else {
						alert("保存失败！");
					}
				},call);
			});
	initVlidate(getCurrentPageObj().find("#pprice_au"));// 初始化页面验证
}
/**
 * 校验输入的数字
 * 
 * @param obj
 */
//function checkNum(obj) {
//	if(obj!=undefined&&obj!=null&&obj!=""){
//		var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
//		if (!reg.test(obj)) {
//			alert("请输入两位小数的数字!");
//			obj.value = '';
//			return;
//		}
//	}
//}
// 人员档次，资质级别级联
/*function checkLevel(obj) {
	var level = obj.id;
	level = level.substr(7);
	initSelect(getCurrentPageObj().find("#p_post" + level), {
		value : "ITEM_CODE",
		text : "ITEM_NAME"
	}, {
		dic_code : obj.value
	});
}*/
// 初始化页面
initPPriceAddPage();
