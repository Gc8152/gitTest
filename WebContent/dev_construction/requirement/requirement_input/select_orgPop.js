var officeId;
var officeName;
function openOrgTreePop(id,callback,param){
	callbacks=callback;
	//先清除
	getCurrentPageObj().find('#myPop_fileUpload').remove();
	getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("dev_workbench/notice/select_officePop.html",{},function(){
	  getCurrentPageObj().find("#selectOfficePop").modal("show");
		initOrgTree1();
		initButton1();
		officeId=param.id;
		officeName=param.name;
		if(officeId.val()!=null){
			setCheckedAllOffice1(officeId.val(),officeName.val());
		}
	});
}
function initOrgTree1() {
	var setting = {
		view : {
			dblClickExpand : false,
			showLine : true,
			selectedMulti : true
		},
		check: {
			enable: true,
			chkStyle: "checkbox"
		},
		data : {
			simpleData : {
				enable : true,
				idKey : "ID",
				pIdKey : "PID",
				rootPId : ""
			},
			key: {
				name: "NAME"
			}
		},
	};
	 var zTreeNodes="";
	 baseAjaxJsonp(dev_construction+"requirement_input/queryOrgMenuTreeList.asp?SID="+SID, null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				zTreeNodes=data.data;
				var treeObj = $.fn.zTree.init(getCurrentPageObj().find("#treeOffice"), setting,zTreeNodes);
				if (data != undefined && data != null && data.result=="true"){
					zTreeOnExpand1(treeObj,"1");
				}else{
					alert("查询菜单树失败");
				}
			}
		});
}

function zTreeOnExpand1(treeObj,openNodeId) {
	var nodes = treeObj.getNodes();
	var ids = officeId.val().split(",");
	for(var i=0;i<ids.length;i++){
		for(var j=0;j<nodes.length;j++){
			if(nodes[j].isParent){
				if(ids[i].indexOf(nodes[j].ID+"")>=0){
					treeObj.expandNode(nodes[j],true,false,false);
				}
			}
		}
		var node = treeObj.getNodeByParam("ID", ids[i], null);
		if(node !=null){
			treeObj.checkNode(node,true,true);
		}
	}
};
function setCheckedAllOffice1(id,name){
	if(id!=null&&id!=""&&id!=undefined){
		var ids = id.split(",");
		var names = name.split(",");
		for(var i=0;i<ids.length;i++){
			$("#selected").append('<option value="'+ids[i]+'">'+names[i]+'</option>');
		}
	}
}
function getCheckedAllOffice1(){		
	var treeObj = $.fn.zTree.getZTreeObj("treeOffice");		
    var nodes = treeObj.getCheckedNodes(true);
    if(nodes!=undefined&&nodes.length>0){
       return nodes;
   }
   return "";
}
function move(optType){
	var ztreeVal=getCheckedAllOffice1();
	if("rmselected"==optType){//移除
		var val=getCurrentPageObj().find("#selected").val();
		if(val&&val!=""){
			for(var i=0;i<val.length;i++){
				for(var j=0;j<ztreeVal.length;j++){
					if(val[i]==ztreeVal[j].ID){
						$.fn.zTree.getZTreeObj("treeOffice").checkNode(ztreeVal[j],false,true);
					}
				}
				var html=getCurrentPageObj().find("#selected option[value='"+val[i]+"']");
				html.remove();
			}
		}
	}else if("addselected"==optType){//新增
		getCurrentPageObj().find("#selected").empty();
		if(ztreeVal&&ztreeVal!=""){
			for(var i=0;i<ztreeVal.length;i++){
				if(!ztreeVal[i].isParent){
					getCurrentPageObj().find("#selected").append('<option value="'+ztreeVal[i].ID+'">'+ztreeVal[i].NAME+'</option>');
				}
			}
		}
	}
}
function initButton1(){
	getCurrentPageObj().find('#selectOffices').click(function (){
		var options=$("#selected option");
		if(options!=null&&options!=""){
			var id = $(options[0]).val();
			var name = $(options[0]).text();
			for(var i=1;i<options.length;i++){
				id=id+","+$(options[i]).val();
				name=name+","+$(options[i]).text();
			}
			officeId.val(id);
			officeName.val(name);
		}
		getCurrentPageObj().find("#selectOfficePop").modal("hide");
	});
};