var currTab = getCurrentPageObj();
function initUpdateButtonEvent(){
	initVlidate(currTab);
	//新增自定义模态框
	currTab.find("#u_addTag").click(function(){
		$("#u_tagModel").modal('show');
	});
    //pop重置
	currTab.find("#u_reset_tag").click(function(){
		$("#u_tag_name_model").val("");
	});
	//pop保存
	currTab.find("#u_save_tag").click(function(){
		//判断是否为空
        if(!vlidate(currTab.find("#u_tag_name_model").parent())){
			  return ;
		  }
		var tag_name = $.trim(currTab.find("#u_tag_name_model").val());
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


function initFilePathSelect(path_id,status,path_type,file_num){var f = file_num;
	currTab.find("#u_chooseBarList1").empty();
	currTab.find("#u_chooseBarList2").empty();
	currTab.find("#u_chooseBarList").empty();
	currTab.find("#u_path_id").val(path_id);
 	initSelect(currTab.find("#u_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_FILEPATH_STATUS"},status);
 	initSelect(currTab.find("#u_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_PATH_TYPE"},path_type);
 	baseAjax("SPathTag/queryFilePathNoTag.asp",{path_id:path_id},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				if(data[i].tag_type == "00"){
					currTab.find("#u_chooseBarList1").append('<li value="'+data[i].tag_id+'">'+data[i].tag_name+'</li>');
				}
				if(data[i].tag_type == "01"){
					currTab.find("#u_chooseBarList2").append('<li value="'+data[i].tag_id+'">'+data[i].tag_name+'</li>');
				}
			}
		}
	},false);
 	
 	baseAjax("SPathTag/queryFilePathTag.asp",{path_id:path_id},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				currTab.find("#u_chooseBarList").append('<li value="'+data[i].tag_id+'">'+data[i].tag_name+'</li>');
			}
		}
	},false);
 	saveOrder();
 	
 	currTab.find("#u_saveFliePath").unbind("click");
 	currTab.find("#u_saveFliePath").click(function(){
 		//判断该路径下是否存在文件
        if(parseInt(file_num)>0){
        	  alert('该路径下存在文件，不能修改！');
			  return ;
		  }
		//判断是否为空
        if(!vlidate(currTab.find("#sFilePath_update_from"))){
			  return ;
		  }
        if (currTab.find("#u_chooseBarList li").length == 0) {
            alert('已选标签不能为空!');
            return;
        }
		var options = currTab.find("#u_chooseBarList li");
		var path_id = currTab.find("#u_path_id").val();
		var status = $.trim(currTab.find("#u_status").val());
		var type = $.trim(currTab.find("#u_type").val());
		var path = currTab.find("input[name=chooseBarListSortOrder]").val();
		var param={path_id:path_id,status:status,path:path,path_type:type,tag_ids:""};
		if(options!=undefined){
			var tag_id=$(options[0]).val();
			for(var i=1;i<options.length;i++){
				tag_id=tag_id+","+$(options[i]).val();
			}
			param["tag_ids"]=tag_id;
		}
		baseAjax("SFilePath/updateFilePath.asp",param,function(data){
			if(data!=undefined&&data.result=="true"){
				alert("保存成功");
			}else{
				alert("保存失败");
			}
		},false);
	});
}

//$("#dragSortSelect #u_chooseBarList1, #dragSortSelect #u_chooseBarList").dragsort({ dragSelector: "li", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'></li>" });
currTab.find("#u_chooseBarList1,#u_chooseBarList2,#u_chooseBarList").sortable({
    connectWith: ".connectedSortable",
    stop: function (event, ui) {
    	saveOrder();
    }
}).disableSelection();
function saveOrder() {
	var data = currTab.find("#dragSortSelect #u_chooseBarList li").map(function() { return $(this).html(); }).get();
	if(data == "") {
		currTab.find("input[name=chooseBarListSortOrder]").val(data.join("+"));
	}
	else{
		currTab.find("input[name=chooseBarListSortOrder]").val("文件服务器+"+data.join("+"));
	}
};
saveOrder();
initUpdateButtonEvent();
