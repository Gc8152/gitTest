/**
 * ztree节点名称格式化操作
 * 使用方法
 * 一、在simpleData中配置formatterNodeName属性，配置方式如下:
 * var setting = {  
		            view: {  
		                selectedMulti: false //禁止多点选中  
		            },	            
		            async:{dataType:"application/json"},

		            data: {  
		                simpleData: {  
		                    enable:true,  
		                    idKey: "ID",  
		                    pIdKey: "PID",  
		                    rootPId: "",
		                    formatterNodeName:function(node){return "";} 
		                }  
		            }}; 
 */
$.fn.zTree._z.data.getNodeName=function(setting, node){
	var formatterNodeName=setting.data.simpleData.formatterNodeName;
	if(formatterNodeName){//节点名称格式化
		return formatterNodeName(node);
	}else{
		var nameKey = setting.data.key.name;
		return "" + node[nameKey];
	}
};
/**
 * 节点title格式化
 */
$.fn.zTree._z.data.getNodeTitle=function(setting, node){
	var nodeTitle=setting.data.simpleData.formatterNodeTitle;
	if(nodeTitle){
		return nodeTitle(node);
	}else{
		var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
		return "" + node[t];
	}
};