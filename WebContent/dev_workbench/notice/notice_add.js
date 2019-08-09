var files="";
/**
 * 获取页面数据
 */
function getPageData(){
	var obj;
	var temp={};
	var inputs = getCurrentPageObj().find("[name^='N.']");
	for(var i=0;i<inputs.length;i++){
		obj = $(inputs[i]);
		if($.trim(obj.val())!=""){
			temp[obj.attr("name").substr(2)]=obj.val();
		}
	}
	temp["receive_post"]=$("#receive_post").val()+"";
	temp["files"]=files;
	return temp;
};
/**
 * 初始化页面按钮
 */
function initbutton(){
	
	
	
	
	//保存按钮
	
	getCurrentPageObj().find("#noticeAdd").unbind("click");
	getCurrentPageObj().find("#noticeAdd").click(function(){
		if(vlidate(getCurrentPageObj().find("#add_notice"),"",false)){
			var param = getPageData();
			param["file_id"]=getCurrentPageObj().find("#file_id_noticeAdd").val();
			param["notice_publish"]="02";
			//param["filedata"]=filedata;
			var call=getMillisecond();
			baseAjaxJsonp(dev_workbench+'notice/insertNotice.asp?call='+call+'&SID='+SID,param, function(data){
				if(data!=null&&data!=undefined){
					if(data.result=="true"){
						closeCurrPageTab();
						alert("保存成功!");
					}else{
						alert("保存失败!");
					}
				}else{
					alert("请求服务器未开启!");
				}

			},call);
		}
	});
	//发布按钮
	getCurrentPageObj().find("#noticePublish").unbind("click");
	getCurrentPageObj().find("#noticePublish").click(function(){
		if(vlidate(getCurrentPageObj().find("#add_notice"),"",false)){
			var param = getPageData();
			param["notice_publish"]="01";
			param["file_id"]=getCurrentPageObj().find("#file_id_noticeAdd").val();
			var call=getMillisecond();
			baseAjaxJsonp(dev_workbench+'notice/insertNotice.asp?call='+call+'&SID='+SID,param, function(data){
				if(data!=null&&data!=undefined){
					if(data.result=="true"){
						closeCurrPageTab();
						alert("发布成功");
					}else{
						alert("发布失败");
					}
				}else{
					alert("请求服务器未开启!");
				}
			},call);
		}
	});
	
	 //附件上传
	 var tablefile = getCurrentPageObj().find("#noticeadd_filetable");
	 var business_code = "";
	 //business_code = getCurrentPageObj().find("#file_id_noticeAdd").val();
	 if(typeof(business_code)!="undefined"){
		 business_code = Math.uuid();
		 getCurrentPageObj().find("#file_id_noticeAdd").val(business_code);
	 }

	 //点击打开模态框
	 var addfile = getCurrentPageObj().find("#noticeadd_file");
	 
	 addfile.click(function(){
		 var paramObj = new Object();
		 paramObj.NOTICE_TITLE = business_code;
		//var req_id=getCurrentPageObj().find('#req_id_reqAdd').val();
	 	openFileFtpUpload(getCurrentPageObj().find("#noticeadd_modalfile"), tablefile, 'NO1001',business_code, '0101', 'S_DIC_NOTICE_FILE', false,false, paramObj);
	 });

	 //附件删除
	 var delete_file = getCurrentPageObj().find("#noticedelete_file");
	 delete_file.click(function(){
	 	delFtpFile(tablefile, business_code, "0101");
	 });
	 
	 getFtpFileList(tablefile, getCurrentPageObj().find("#noticeadd_fileview_modal"), business_code, "0101");
	
};
function putClear(id){
	getCurrentPageObj().find("#"+id+" input").val("");
}
initbutton();
initVlidate($("#add_notice"));
/**
* 初始化处室和岗位
*/
(function(){
	//初始化处室
	var obj1=getCurrentPageObj().find("#receive_office");
	obj1.unbind("click");
	obj1.click(function(){
		
		openOrgTreePop("officePop",null,{id:getCurrentPageObj().find("#receive_office_name"),name:getCurrentPageObj().find("#receive_office")});

		/*		openSelectTreeDivToBody($(this),"querytreeoffices_id","SOrg/queryorgtreelist.asp",40,function(node){
			var name = getCurrentPageObj().find("#receive_office").val();
			var id = getCurrentPageObj().find("input[name='N.receive_office']").val();
			if(name==""||id==""){
				getCurrentPageObj().find("#receive_office").val(node.name);
				getCurrentPageObj().find("input[name='N.receive_office']").val(node.id);				
			}else{
				if(id.indexOf(node.id)<0){
					getCurrentPageObj().find("#receive_office").val(name+","+node.name);
					getCurrentPageObj().find("input[name='N.receive_office']").val(id+","+node.id);
				}
			}
		},true);*/
	});
	//初始化岗位
	baseAjax('SRole/querySrole.asp',null,function(data){
		var obj=getCurrentPageObj().find("#receive_post");
		if(obj!=undefined&&data!=undefined){
			obj.empty();
			for(var i=0;i<data.srole.length;i++){
				obj.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');	
			}
			obj.select2();
		};
	});
})();
/**
* 初始化页面POP框
*/
(function(){
	getCurrentPageObj().find("#receive_person").click(function(){
		openUserPop("userPop",{singleSelect:false,no:getCurrentPageObj().find("input[name='N.receive_person']"),name:getCurrentPageObj().find("#receive_person"),role:(getCurrentPageObj().find("#receive_post").val()+""),org_no:getCurrentPageObj().find("input[name='N.receive_office']").val()});
	});
})();


//初始化查询参数
var queryParams=function(params){
	var temp={};
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};
function initFiletable(){
	$("#FileTableInfo").bootstrapTable({
		//请求后台的URL（*）
		url : "sfile/queryFileInID.asp",
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "user_no", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: false,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'ID',
			align : "center",
			visible:false
		},{
			field : 'RN',
			title : '序号',
			align : "center"
		}, {
			field : "PATH_ID",
			title : "文档类型",
			align : "center"
		}, {
			field : "FILE_TYPE",
			title : "版本",
			align : "center"
		}, {
			field : "FILE_NAME",
			title : "文件名称",
			align : "center",
			formatter: operateFormatter	
		}, {
			field : "FILE_MEMO",
			title : "备注",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "上传时间",
			align : "center"
		}]
	});
}
initFiletable();
function operateFormatter(value,row,index) {
	return ["<a target='_blank' href='sfile/filePreView.asp?id="+row.ID+"'>"+row.FILE_NAME+"</a>"].join('');
};