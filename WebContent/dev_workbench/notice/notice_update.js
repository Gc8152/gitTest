//附件列表
var files="";
var deletefiles="";
function initPageDate(id){
	//初始化页面数据
	var call=getMillisecond();
	baseAjaxJsonp(dev_workbench+'notice/updateNoticeQuery.asp?call='+call+'&SID='+SID+'&notice_id='+id, null,function(data){
		if(data){
			getCurrentPageObj().find("#updateNotice").setform(data.notice);
		}
		
		 //附件上传
		 var tablefile = getCurrentPageObj().find("#noticeadd_filetable");
		 var business_code = getCurrentPageObj().find("#file_id_noticeAdd").val();
		 //business_code = getCurrentPageObj().find("#file_id_noticeAdd").val();
		 

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
		
		//初始化岗位
	    (function(){
			baseAjax('SRole/querySrole.asp',null,function(data){
				var obj=getCurrentPageObj().find("#receive_post");
				if(obj!=undefined&&data!=undefined){
					obj.empty();
					var receive_posts=getCurrentPageObj().find("[name='RECEIVE_POST']").val().split(",");
					for(var i=0;i<data.srole.length;i++){
						obj.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
						for(var j=0;j<receive_posts.length;j++){
							if(receive_posts[j]==data.srole[i].ROLE_NO){
								obj.children("option:last-child").attr("selected",true);
								break;
							}
						}
					}
					obj.select2();
				};
			});
		})();
		files=data.notice.NOTICE_FILES==undefined?"":data.notice.NOTICE_FILES;
		initFiletable(files);
	},call);
	//初始化部门
	var obj1=getCurrentPageObj().find("#receive_office");
	obj1.unbind("click");
	obj1.click(function(){
		openofficePop("updateOfficePop",null,{id:getCurrentPageObj().find("input[name='RECEIVE_OFFICE']"),name:getCurrentPageObj().find("#receive_office")});
/*		openSelectTreeDivToBody($(this),"querytreeoffices_id","SOrg/queryorgtreelist.asp",40,function(node){
			var name = getCurrentPageObj().find("#receive_office").val();
			var id = getCurrentPageObj().find("input[name='RECEIVE_OFFICE']").val();
			if(name==""||id==""){
				getCurrentPageObj().find("#receive_office").val(node.name);
				getCurrentPageObj().find("input[name='RECEIVE_OFFICE']").val(node.id);				
			}else{
				if(id.indexOf(node.id)<0){
					getCurrentPageObj().find("#receive_office").val(name+","+node.name);
					getCurrentPageObj().find("input[name='RECEIVE_OFFICE']").val(id+","+node.id);
				}
			}
		},true);*/
	});
}
/**
* 初始化页面POP框
*/
(function(){
	getCurrentPageObj().find("#receive_person").click(function(){
		openUserPop("userPop",{singleSelect:false,no:getCurrentPageObj().find("input[name='RECEIVE_PERSON']"),name:getCurrentPageObj().find("input[name='PERSON_RECEIVE']"),role:(getCurrentPageObj().find("#receive_post").val()+""),org_no:getCurrentPageObj().find("input[name='RECEIVE_OFFICE']").val()});
	});
})();
/**
* 初始化页面按钮
*/
(function(){
	//上传按钮
	getCurrentPageObj().find("#addfile").unbind("click");
	getCurrentPageObj().find("#addfile").click(function(){
		var file_id=Math.uuid();
		openFileUploadInfo("notice_file","",file_id,function(data){
			findFileInfo(file_id,function(data2){
				for(var i=0;i<data2.rows.length;i++){
					if(files==""){
						files=data2.rows[i]["ID"];
					}else{
						files=files+","+data2.rows[i]["ID"];
					}
				}
				$("#upFileTableInfo").bootstrapTable("refresh",{url:"sfile/queryFileInID.asp?id="+files});
			});
		});
	});
	//删除按钮
	getCurrentPageObj().find("#deletefile").unbind("click");
	getCurrentPageObj().find("#deletefile").click(function(){
		var id = $("#upFileTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.ID;                  
		});
		if(id.length<1){
			alert("请选择选择要删除的附件!");
			return ;
		}
		files=files.replace(","+ids, "");
		files=files.replace(ids+",", "");
		files=files.replace(ids, "");
		$("#upFileTableInfo").bootstrapTable("refresh",{url:"sfile/queryFileInID.asp?id="+files});
	});
	//保存按钮
	getCurrentPageObj().find("#noticeUpdate").unbind("click");
	getCurrentPageObj().find("#noticeUpdate").click(function(){
		if(vlidate(getCurrentPageObj().find("#updateNotice"),"",false)){
			var param = getPageData();
			param["file_id"]=getCurrentPageObj().find("#file_id_noticeAdd").val();
			
			var call=getMillisecond();
			baseAjaxJsonp(dev_workbench+'notice/updateNotice.asp?call='+call+'&SID='+SID,param, function(data){
				if(data!=null&&data!=undefined){
					if(data.result=="true"){
						closeCurrPageTab();
						alert("保存成功");
					}else{
						alert("保存失败");
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
		if(vlidate(getCurrentPageObj().find("#updateNotice"),"",false)){
			var param = getPageData();
			param["notice_publish"]='01';
			param["file_id"]=getCurrentPageObj().find("#file_id_noticeAdd").val();
			
			var call=getMillisecond();
			baseAjaxJsonp(dev_workbench+'notice/updateNotice.asp?call='+call+'&SID='+SID,param, function(data){
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
})();
function putClear(id){
	getCurrentPageObj().find("#"+id+" input").val("");
}
/**
* 获取页面数据
*/
function getPageData(){
	var obj;
	var temp={};
	var get = getCurrentPageObj().find("[name^='NOTICE']");
	for(var i=0;i<get.length;i++){
		obj = $(get[i]);
		if($.trim(obj.val())!=""){
			temp[obj.attr("name").toLowerCase()]=obj.val();
		}
	}
	get = getCurrentPageObj().find("[name^='RECEIVE']");
	for(var i=0;i<get.length;i++){
		obj = $(get[i]);
		if($.trim(obj.val())!=""){
			temp[obj.attr("name").toLowerCase()]=obj.val();
		}
	}
	get = getCurrentPageObj().find("[name^='SEND']");
	for(var i=0;i<get.length;i++){
		obj = $(get[i]);
		if($.trim(obj.val())!=""){
			temp[obj.attr("name").toLowerCase()]=obj.val();
		}
	}
	temp["receive_post"]=$("#receive_post").val()+"";
	temp["files"]=files;
	return temp;
}
//初始化查询参数
var queryParams=function(params){
	var temp={};
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};
function initFiletable(param){
	$("#upFileTableInfo").bootstrapTable({
		//请求后台的URL（*）
		url : "sfile/queryFileInID.asp?id="+param,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
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

function operateFormatter(value,row,index) {
	return ["<a  target='_blank' href='sfile/filePreView.asp?id="+row.ID+"'>"+row.FILE_NAME+"</a>"].join('');
};