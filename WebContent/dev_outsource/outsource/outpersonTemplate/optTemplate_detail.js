/**
 * 初始化合同信息
 * @param project_id
 */
//定义考核项的序号
var number=1;
var calls = getMillisecond();
function optTemplate_detailInfo(template_id){
	baseAjaxJsonp(dev_outsource+"OptTemplate/queryOneTemplateInfo.asp?template_id="+template_id+"&SID="+SID+"&call="+calls,null,function(data){
		if(data){
			var templateInfoval = data["templateInfo"];
			for(var p in templateInfoval){
				var projectKey = p.toLowerCase();
				if(projectKey == "template_id"){
					getCurrentPageObj().find("#OTDI_"+projectKey).val(template_id||"");
				}else if(projectKey == "opt_specialtype"){
					initSelect(getCurrentPageObj().find("select[name='OT.opt_specialtype']"),
							{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"},templateInfoval[p]);
					getCurrentPageObj().find("div[id=OTDI_"+projectKey+"]").text(templateInfoval[p]);
				}else{
					//getCurrentPageObj().find("#OTD_"+projectKey).text(templateInfoval[p]);
					getCurrentPageObj().find("div[id=OTDI_"+projectKey+"]").text(templateInfoval[p]||"");
					getCurrentPageObj().find("input[id=OTDI_"+projectKey+"]").val(templateInfoval[p]||"");
				}
			}
			TemplateInfo(template_id);
		}
	},calls);
}
//加载考核项父类
function TemplateInfo(template_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
		var url = dev_outsource+'OptTemplate/queryAllTemplateDetailInfoById.asp?SID='+SID+"&call="+calls+"&template_id="+template_id;
		getCurrentPageObj().find("#template_assess_table_info").bootstrapTable({////教育信息
			url : url,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [100],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : true, //是否显示父子表
			jsonpCallback : calls,
			singleSelect: true,
			onLoadSuccess:function(data){
			},
			columns : [ {
				field : 'ID',
				title : '主键',
				align : "center",
				visible:false
			},{
				field : 'ITEM_CODE',
				title : '考核项编号',
				align : "center",
				visible:false
			},{
				field : 'CHECK_ITEM_NAME',
				title : '考核项目',
				align : "center"
			},{
				field : 'RANK_DESC',
				title : '考核依据',
				align : "center",
				width:"30%"
			}],
			onExpandRow:function(index,row,$detail){
				InitOptTable(index,row,$detail);
			}
		});
	
}	
//加载考核项子类
InitOptTable=function (index,row,$detail){
	var parentid=row.ITEM_CODE;
	var cur_table=$detail.html('<table></table>').find('table');
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$(cur_table).bootstrapTable({
		url : dev_outsource+'OptTemplate/querySonTemplateDetailInfo.asp?SID='+SID+'&itemcode='+parentid,//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		//ajaxOptions:{strParentID:parentid},
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field : 'ID',
			title : '主键',
			align : "center",
			visible:false
		},{
			field : 'ONE_SCORE',
			title : '考核得分区间',
			align : "center"
		
		},{
			field : 'RANK_DESC',
			title : '考核依据',
			align : "center"
		} ],
		onExpandRow:function(index,row,$detail){
			oInit.InitOptTable(index,row,$detail);
		}
	});
};