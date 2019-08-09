//跳转接口详情页   新建接口
var $page = getCurrentPageObj();
function GoCheckDetail(id,version,app_type,index,APP_ID){
	
	if('00'==app_type){
		//打开新建接口pop框
			
			var newInterPop = $page.find("#newInterPop");
			
			userInterAccept_newInterPop(newInterPop,index,APP_ID);
			
	}else
	{
		closeAndOpenInnerPageTab("newinterinfo_360mesbasic","接口信息查询","dev_application/interfaceInfo/interfaceinfo_360mesbasic.html",function(){
			
			var modObj = getCurrentPageObj().find("#inter360_basic_table");
			Inter360InfoDetail(id);
			inter360initAttrTable(id,version,modObj,"table[tb=360attrTable] tbody",null);
			//报文输入输出信息
			initImportContentQuery(id,"AImportContentList",version);
			initExportContentQuery(id,"AExportContentList",version);
			//接口调用关系查询
			initInter_useRelationQuery(id);
			//接口版本信息
			initVersionListTable(id);
			//变更列表信息
			initExchangeListQuery(id);
		});
	}
	
}


function userInterAccept_newInterPop(obj,index,APP_ID){
	
	$page.find("#userInterAccept_newInterPop").remove();
	//加载pop框内容
	obj.load("dev_application/postUseInterAccept/newInterAccept_checkPop.html",{},function(){

		var modObj = $page.find("#userInterAccept_newInterPop");
		modObj.modal("show");
		//初始化接口信息
		params = getCurrentPageObj().find("#AcceptListCheckTable").bootstrapTable("getData")[index];
		$page.find("#INTER_NAME").html(params.INTER_NAME);
		$page.find("#SER_SYSTEM_NAME_POP").html(params.SER_SYSTEM_NAME);
		$page.find("#INTER_OFFICE_TYPE_NAME").html(params.INTER_OFFICE_TYPE_NAME);
		$page.find("#INTER_DESCR").html(params.INTER_DESCR);
		$page.find("#INPUT_MSG").html(params.INPUT_MSG);
		$page.find("#RETURN_MSG").html(params.RETURN_MSG);
		
		//initAttrTable(modObj,APP_ID);//初始化属性table
		var Obj = $page.find("#table1");
		inter360initAttrTable_pop(Obj, "table[tb=attrTable] tbody",APP_ID);
		

	});

	
	// 初始化接口属性信息table
	function inter360initAttrTable_pop(modObj, tableid, app_id) {
		var rowCall = getMillisecond();
		var table = modObj.find(tableid);
		baseAjaxJsonp(dev_application + "InterQuery/initInterAttrByparam.asp?SID="
				+ SID + "&call=" + rowCall, {
			app_id : app_id
		}, function(data) {
			if (data && data.attrRowList) {
				// 先动态生成表列内容
				var appendHtml = getInter360TableBodyHtml(data.attrRowList);
				table.empty("");
				table.append(appendHtml);
				// 最后初始化字典项
				inter360AutoInitSelect(table);
			} else {
				table.empty("");
			}
		}, rowCall, false);
	}
	// 初始化动态类型表格
	function getInter360TableBodyHtml(attrField) {
		var rowNum = 2;
		var appendHtml = "";
		var fieldNum = 1;
		for ( var i = 0; i < attrField.length; i++) {
			appendHtml += fieldNum % rowNum == 1 ? "<tr>" : "";
			appendHtml += getRowLineInter360(attrField[i]);
			appendHtml += fieldNum % rowNum == 0 ? "</tr>" : "";
			fieldNum++;
		}
		// 补全因非结束产生的表格不全的情况;
		if (!(fieldNum % rowNum == 1)) {
			while (!(fieldNum % rowNum == 1)) {
				appendHtml += "<td colspan='2'></td>";
				fieldNum++;
			}
			appendHtml += "</tr>";
		}

		return appendHtml;
	}
	// 生成动态类型表格HTML代码
	function getRowLineInter360(item) {
		var str = "";
		str += "<td  class='table-text' width='20%' >" + item.ATTR_NAME + ":</td>";
		if (item.ATTR_TYPE == "00") {// 00表示文本框
			str += "<td><div>"
					+ item.ATTR_VALUE + "</div></td>";
		} else if ((item.ATTR_TYPE == "01") || (item.ATTR_TYPE == "03")
				|| (item.ATTR_TYPE == "02")) {// 01表示下拉单选
			str += "<td><div attr_id='" + item.ATTR_ID + "' attr_value='"
					+ item.ATTR_VALUE + "' diccode='" + item.DIC_INFO + "' value='"
					+ item.DEFAULT_VALUE + "'></div></td>";
		}
		return str;
	}
	//初始化div内容根据DIC_CODE和Item_code
	function inter360AutoInitSelect(tableObj) {
		// 初始化下拉选
		var divs = tableObj.find("[diccode]");
		for (var i = 0; i < divs.length; i++) {
				var obj = getCurrentPageObj().find(divs[i]);
				var attr_value = getCurrentPageObj().find(divs[i]).attr("value");
				var dcode = getCurrentPageObj().find(divs[i]).attr("diccode");
				if (dcode!= "" &&dcode != undefined) {
					baseAjax("SDic/findItemByDic.asp", { dic_code : dcode }, function(data) {
						if (data != undefined) {
							var strs = new Array(); // 定义一数组
							strs = attr_value.split(","); // 字符分割
								var str = "";
								for ( var j = 0; j < strs.length; j++) {
									for ( var i = 0; i < data.length; i++) {
										if (data[i]["ITEM_CODE"] == strs[j]) {
											if (j != strs.length - 1) {
												str += data[i]["ITEM_NAME"] + ",";
											} else {
												str += data[i]["ITEM_NAME"];
											}
										}// if
									}// for
								}// for
							obj.text(str);
							}
						
					},false);
				}//if
		}//for
	}

}


