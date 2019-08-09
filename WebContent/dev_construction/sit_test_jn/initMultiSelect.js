//初始化div多选框字典项
function initMultiSelect(objDiv,values) {
	// 初始化下拉选
	var attr_value = values;
	var dcode = objDiv.attr("diccode");
	if (dcode!= "" &&dcode != undefined) {
		if (attr_value!= "" && attr_value != undefined) {
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
								}
							}
						}
						objDiv.html(str);
					}
				
			},false);
		}
	}
}