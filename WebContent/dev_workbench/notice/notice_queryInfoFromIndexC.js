function initNotieDetailInfoFromIndexC(ids,getSID){
	var call=getMillisecond(); 
	baseAjaxJsonp(dev_workbench+'notice/queryOneNoticeInfo.asp?call='+
			call+'&SID='+(getSID==undefined?SID:getSID)+'&notice_id='+ids, null, function(data){
		if(data){			
			for(var k in data.notice){
					if(k=="NOTICE_FILES"){
						var tablefile = $("#contentHtml", parent.document).find("#noticeadd_filetable");
						getFtpFileList1(tablefile,  $("#contentHtml", parent.document).find("#noticeadd_fileview_modal"), data.notice[k], "0101");
					}
					 $("#contentHtml", parent.document).find("#"+k).text(data.notice[k]);
			}
		}
	},call);
};	
	/**
	 * 初始化附件列表
	 * @param tablefile  文件列表的jquery对象
	 * @param viewDiv	查看div的jquery对象
	 * @param business_code	业务编号
	 * @param phase		阶段
	 */
	function getFtpFileList1(tablefile, viewDiv, business_code, phase){
		viewDiv.load("upload/uploadifyFtpView.html",function(){
			var view_modal = viewDiv.find("#modalView");
			tablefile.bootstrapTable('destroy').bootstrapTable({
				url:"sfile/queryFTPFileByBusinessCode.asp?business_code="+business_code+"&phase="+phase,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				dataType : 'json',
		 		clickToSelect : true, //是否启用点击选中行
				uniqueId : "ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,
				onAll: function(name,args) {
					tablefile.find("span[name=view_file]").click(function(){
						var index = $(this).attr("index");
						var rowObj = tablefile.bootstrapTable('getData')[index];
						var spans = view_modal.find("span");
						for(var i=0; i<spans.length; i++){
							var span_name = $(spans[i]).attr("name");
							$(spans[i]).html(rowObj[span_name]);
						}
						view_modal.modal('show');
					});		
				},
				onLoadSuccess:function(data){
					gaveInfo();
					
				 },
				 columns : [ {
					 field: 'middle',
				 checkbox: true,
				 rowspan: 2,
				 align: 'center',
				 valign: 'middle'
				 }, {
					 field : 'FILE_ID',
					 title : '序号',
					 align : "center",
					 formatter: function (value, row, index) {
						 return index+1;
					 }
				 }, {
					 field : 'FILE_NAME',
					 title : '文档名称',
					 width : 250,
					 align : "center"
				 }, {
					 field : 'MODULE_FLAG_NAME',
					 title : '文档类型',
					 align : "center"
				 }, {
					 field : "OPT_PERSON_NAME",
					 title : "上传人",
					 align : "center"
				 }, {
					 field : "OPT_TIME",
					 width : 200,
					 title : "上传时间",
					 align : "center"
				 }, {
					 field : "DID",
					 title : "操作",
					 align : "center",
					 formatter: function (value, row, index) {
						
						 return '<span class="hover-view" name="download_file" index="'+index+'">'
						 	+'<a class="hover-view" name="testDL" onclick="'
						 	//+'baseAjax(\'sfile/verifyFileExit.asp\', {id:'+row.ID+'}, function(result){if(result.result){location.href=\'sfile/downloadFTPFile.asp?id='+row.ID+'\';}else{alert(result.msg);}});'
						 	+'location.href=\'sfile/downloadFTPFile.asp?id='+row.ID+'\';'
						 	+'">下载<a/></span>';
					 }
				 }]
			});
		});
	}



