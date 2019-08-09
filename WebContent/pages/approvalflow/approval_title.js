/*初始化流程审批情况的title*/
function initTitle(instance_id){
	getCurrentPageObj().find("#apptitlePop").empty();
	getCurrentPageObj().find("#apptitlePop").append(
		'<div class="ecitic-title">'+
			'<span>审批进展情况<em></em></span>'+
	   	'</div>'+
		'<div id="titlePopDiv">'+
			'<div class="chartDiv">'+
				'<ul class="ulImg" id="title_ul"></ul>'+
			'</div>'+
		'</div>'
	);
	var call = getMillisecond();
	baseAjaxJsonp("AFLaunch/queryAFApprovalLists.asp",{instance_id:instance_id,call:call},function(data){
		if(data && data.total && data.total>0){
			getCurrentPageObj().find("#title_ul").find("li").remove(); 
			getCurrentPageObj().find("#title_ul").find("div").remove(); 
			getCurrentPageObj().find("#title_ul").append('<li><div><span><i class="fa fa-user"></i><img class="gou" alt="" src="'+getPic(data.rows[0]["APP_STATE"])+
					'" /></span><h2>'+data.rows[0]["N_NAME"]+'</h2></div></li>');
			var nids={};
			for(var i=1;i<data.total;i++){
				if(!nids[data.rows[i]["N_NAME"]]){
					nids[data.rows[i]["N_NAME"]]="1";
					getCurrentPageObj().find("#title_ul").append('<div class="arrowTip"><img  class="jiantou" src="images/jiantou.png" alt=""/></div>');
					getCurrentPageObj().find("#title_ul").append('<li><div><span><i class="fa fa-user"></i><img class="gou alt="" src="'+getPic(data.rows[i]["APP_STATE"])+'" /></span><h2>'+data.rows[i]["N_NAME"]+'</h2></div></li>');
				}
			}
		}
	},call);
}
/**初始化头部表格**/
function getPic(state){
	if(state){
		return "images/gou.png";
	}
	return "images/close.png";
}