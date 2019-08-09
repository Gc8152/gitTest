var officeId;
var officeName;
function openofficePop(id,callback,param){
	callbacks=callback;
	//先清除
	$('#myPop_fileUpload').remove();
	getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("dev_workbench/notice/select_officePop.html",{},function(){
		$("#selectOfficePop").modal("show");
		initOrgTree();
		initButton();
		officeId=param.id;
		officeName=param.name;
		if(officeId.val()!=null){
			setCheckedAllOffice(officeId.val(),officeName.val());
		}
	});
}
function initOrgTree() {
	var setting = {
		async : {
			enable : true,
			url : "SOrg/queryorgtreelist.asp",
			contentType : "application/json",
			type : "get",
			autoParam: ["id"]
		},
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
				idKey : "id",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback: {
			/*onAsyncSuccess: zTreeOnAsyncSuccess,*/
			onAsyncSuccess: function(event, treeId, treeNode, msg){
				var treeObj = $.fn.zTree.getZTreeObj(treeId);
				treeObj.expandNode(treeObj.getNodeByTId(treeId+"_1"), true, false, true);
				zTreeOnExpand("treeOffice","1");
			},
		}
	};
$.fn.zTree.init(getCurrentPageObj().find("#treeOffice"), setting);
}
function zTreeOnExpand(treeId,openNodeId) {
	var treeObj = $.fn.zTree.getZTreeObj("treeOffice");
	var nodes =  treeObj.getNodesByParam("pid",openNodeId, null);
	var ids = officeId.val().split(",");
	for(var i=0;i<ids.length;i++){
		for(var j=0;j<nodes.length;j++){
			if(nodes[j].isParent){
				if(ids[i].indexOf(nodes[j].id+"")>=0){
					treeObj.expandNode(nodes[j],true,false,false);
					zTreeOnExpand(treeOffice,nodes[j].id);
				}
			}
			if(nodes[j].id==ids[i]){
				$.fn.zTree.getZTreeObj("treeOffice").checkNode(nodes[j],true,true);
			}
		}
	}
};
function setCheckedAllOffice(id,name){
	if(id!=null&&id!=""&&id!=undefined){
		var ids = id.split(",");
		var names = name.split(",");
		for(var i=0;i<ids.length;i++){
			$("#selected").append('<option value="'+ids[i]+'">'+names[i]+'</option>');
		}
	}
}
function getCheckedAllOffice(){		
	var treeObj = $.fn.zTree.getZTreeObj("treeOffice");		
    var nodes = treeObj.getCheckedNodes(true);
    if(nodes!=undefined&&nodes.length>0){
       return nodes;
   }
   return "";
}
function move(optType){
	var ztreeVal=getCheckedAllOffice();
	if("rmselected"==optType){//移除
		var val=getCurrentPageObj().find("#selected").val();
		if(val&&val!=""){
			for(var i=0;i<val.length;i++){
				for(var j=0;j<ztreeVal.length;j++){
					if(val[i]==ztreeVal[j].id){
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
					getCurrentPageObj().find("#selected").append('<option value="'+ztreeVal[i].id+'">'+ztreeVal[i].name+'</option>');
				}
			}
		}
	}
}
function initButton(){
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
		$("#selectOfficePop").modal("hide");
	});
};