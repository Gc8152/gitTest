var currTab = getCurrentPageObj();
function initAddButtonEvent(){
	initVlidate(currTab);
	//初始下拉
	initSelect(currTab.find("#s_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_FILEPATH_STATUS"});
	initSelect(currTab.find("#s_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_PATH_TYPE"});
	//新增自定义模态框
	currTab.find("#addTag").click(function(){
		currTab.find("#tagModel").modal('show');
	});
    //pop重置
	currTab.find("#reset_tag").click(function(){
		currTab.find("#tag_name_model").val("");
	});
	//pop保存
	currTab.find("#save_tag").click(function(){
		//判断是否为空
        if(!vlidate(currTab.find("#tag_name_model").parent())){
			  return ;
		  }
		var tag_name = $.trim(currTab.find("#tag_name_model").val());
		 $.ajax({
	           url:"SPathTag/addPathTag.asp",
	           type:"post",
	           data:{"tag_name":tag_name},
	           dataType:"json",
	           success:function(data){
	       			alert(data.msg);
	           }
	        });
	});
}
var url = '';

function initTagSelect(){
	currTab.find("#chooseBarList1").empty();
	currTab.find("#chooseBarList2").empty();
	currTab.find("#chooseBarList").empty();
	baseAjax("SPathTag/queryListPathTag.asp",{},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				if(data[i].TAG_TYPE == "00"){
					currTab.find("#chooseBarList1").append('<li value="'+data[i].TAG_ID+'">'+data[i].TAG_NAME+'</li>');
				}
				if(data[i].TAG_TYPE == "01"){
					currTab.find("#chooseBarList2").append('<li value="'+data[i].TAG_ID+'">'+data[i].TAG_NAME+'</li>');
				}
			}
		}
	},false);

	currTab.find("#saveFliePath").unbind("click");
	currTab.find("#saveFliePath").click(function(){
		//判断是否为空
        if(!vlidate(currTab.find("#sFilePath_from"))){
			  return ;
		  }
        if (currTab.find("#chooseBarList li").length == 0) {
            alert('已选标签不能为空!');
            return;
        }
        ok = true;
		if (ok){
			baseAjax("SFilePath/queryOneFilePath.asp",{path_id:currTab.find("#s_path_id").val()},function(data){
				if (data.result) {
					alert("规则编码重复！请重新输入！");
					ok = false;
					return;
				}
			},false);
		}
		if (ok){
			baseAjax("SFilePath/queryOneByType.asp",{path_type:currTab.find("#s_type").val()},function(data){
				if (data.result) {
					alert("该文件类型已经存在路径规则了！");
					ok = false;
					return;
				}
			},false);
		}
		if(ok){
			var options=currTab.find("#chooseBarList li");
			var path_id = currTab.find("#s_path_id").val();
			var status = $.trim(currTab.find("#s_status").val());
			var type = $.trim(currTab.find("#s_type").val());
			var path = currTab.find("input[name=chooseBarListSortOrder]").val();
			var param={path_id:path_id,status:status,path:path,path_type:type,tag_ids:""};
			if(options!=undefined){
				var tag_id=$(options[0]).val();
				for(var i=1;i<options.length;i++){
					tag_id=tag_id+","+$(options[i]).val();
				}
				param["tag_ids"]=tag_id;
			}
			baseAjax("SFilePath/addFilePath.asp",param,function(data){
				if(data!=undefined&&data.result=="true"){
					alert("保存成功");
				}else{
					alert("保存失败");
				}
			},false);
		}
	});
}
//currTab.find("#chooseBarList1,#chooseBarList").dragsort({ dragSelector: "li", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'></li>" });
currTab.find("#chooseBarList1,#chooseBarList2,#chooseBarList").sortable({
    connectWith: ".connectedSortable",
    stop: function (event, ui) {
    	saveOrder();
    }
}).disableSelection();

function saveOrder() {
	var data = currTab.find("#dragSortSelect #chooseBarList li").map(function() { return $(this).html(); }).get();
	if(data == "") {
		currTab.find("input[name=chooseBarListSortOrder]").val(data.join("+"));
	}
	else{
		currTab.find("input[name=chooseBarListSortOrder]").val("文件服务器+"+data.join("+"));
	}
};
saveOrder();
initAddButtonEvent();
initTagSelect();