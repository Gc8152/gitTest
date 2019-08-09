function initNotieDetailInfo(ids,getSID){
	var call=getMillisecond();
	baseAjaxJsonp(dev_workbench+'notice/queryOneNoticeInfo.asp?call='+call+'&SID='+(getSID==undefined?SID:getSID)+'&notice_id='+ids, null, function(data){
		if(data){
			for(var k in data.notice){
				if(k=="NOTICE_FILES"){
					getCurrentPageObj().find("#file_id_noticeAdd1").val(data.notice[k]);
					 var tablefile = getCurrentPageObj().find("#noticeadd_filetable1");
					getFtpFileList(tablefile, getCurrentPageObj().find("#noticeadd_fileview_modal1"), data.notice[k], "0101");
				}
		        getCurrentPageObj().find("#in"+k).text(data.notice[k]);
			}
		}
		//initFiletable(data.notice.NOTICE_FILES);
	},call);
};



