var expertsQuery = getMillisecond();
//初始化按钮事件
function initRoleButtonEvent(){
	//重置
	var form = getCurrentPageObj().find("#changeQuery");
	var reset = getCurrentPageObj().find("#reset");
	reset.click(function(){
		form[0].reset();
		getCurrentPageObj().find("select").select2();
		/*getCurrentPageObj().find("#change_code").val("");
		getCurrentPageObj().find("#change_subtype").val(" ");
		getCurrentPageObj().find("#change_subtype").select2();
		getCurrentPageObj().find("#change_state").val(" ");
		getCurrentPageObj().find("#change_state").select2();
		getCurrentPageObj().find("#create_time").val("");
		getCurrentPageObj().find("#system_name").val("");
		getCurrentPageObj().find("#version_name").val("");*/
	});
	//查询
	getCurrentPageObj().find("#queryAppInfoChange").click(function(){
		//var change_code = getCurrentPageObj().find("#change_code").val();
		var change_state = getCurrentPageObj().find("#change_state").val();
		var change_subtype = getCurrentPageObj().find("#change_subtype").val();
		var create_time = getCurrentPageObj().find("#create_time").val();
		var system_name = getCurrentPageObj().find("#system_name").val();
		var version_name = getCurrentPageObj().find("#version_name").val();
		
		getCurrentPageObj().find('#changeReqTableInfo').bootstrapTable('refresh',
				{url:dev_project+'PChangeReq/queryApproveList.asp?call='+expertsQuery+'&SID='+SID+"&type=2"+"&system_name="+encodeURI(system_name)+"&change_state="+
						change_state+"&change_subtype="+change_subtype+"&create_time="+create_time+"&version_name="+encodeURI(version_name)});
	});

	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryAppInfoChange").click();});
	//拿回
	var currTab=getCurrentPageObj();
    var nahui = currTab.find("#changegReq_nahui");
    nahui.click(function(){
		var seles = getCurrentPageObj().find("#changeReqTableInfo").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行通过!");
			return;
		}
		var person = seles[0].SPONSOR_PERSON;                    
		if(person!=SID){
			alert("你不是发起人不能拿回");
			return ;
		}
		var state = seles[0].CHANGE_STATE_NAME;                    
		if(state!="审批中"){
			alert("该信息不能拿回");
			return ;
		}
		
		approval('02',null,seles[0].INSTANCE_ID);//02撤回
	});

	//查看
	getCurrentPageObj().find("#changeReq_appinfo").click(function(){
		var id = getCurrentPageObj().find("#changeReqTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.REQ_CHANGE_ID;});	
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");				
			return;
		}else{	
			var ids=JSON.stringify(id);
			var data=JSON.parse(ids);
			closeAndOpenInnerPageTab("changeReq_add","变更审批查看","dev_project/proReqChange/approve/reqChange_appDetil.html",function(){		
			
				for ( var k in data[0]) {
					//debugger;
					if(k!="0" && k!="CHANGE_SUBTYPE" && k!="VERSION_ID" && k!="SYSTEM_ID" && k!="REQ_CHANGE_ID"){
						var str = data[0][k];
						k = k.toLowerCase();
						getCurrentPageObj().find("#"+k).html(str);
					}else if(k=="CHANGE_SUBTYPE"){
						if(data[0][k]=="01"){
							getCurrentPageObj().find("#version_text1").html("加塞版本：");
						}else if(data[0][k]=="02"){
							getCurrentPageObj().find("#version_text1").html("补充协办：");
						}else{
							getCurrentPageObj().find("#version_text1").html("版本调出：");
						}
					}
				}
				getCurrentPageObj().find("#version_id").val(data[0].VERSIONS_ID);
				if(data[0]["INSTANCE_ID"]!=undefined){
					initTitle(data[0]["INSTANCE_ID"]);
					initAFApprovalInfo(data[0]["INSTANCE_ID"],'0');
				}else{
					getCurrentPageObj().find("#changeApp").hide();
				}
				
				initChangeButtonEvent(data[0].REQ_CHANGE_ID);
			});
		}
	});
	
	
	
}


//初始化表格
function initGChangAppInfo(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#changeReqTableInfo").bootstrapTable({
      url: dev_project+'PChangeReq/queryApproveList.asp?call='+expertsQuery+'&SID='+SID+"&type=2",     //请求后台的URL（*）
      method: 'get',           //请求方式（*）   
      striped: false,           //是否显示行间隔色
      cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）		       
      sortable: true,           //是否启用排序
      sortOrder: "asc",          //排序方式
      queryParams: queryParams,//传递参数（*）
      sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
      pagination: true,          //是否显示分页（*）
      pageList: [5,10,15],    //可供选择的每页的行数（*）
      pageNumber:1,            //初始化加载第一页，默认第一页
      pageSize: 10,            //每页的记录行数（*）		       
      clickToSelect: true,        //是否启用点击选中行
      //height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
      uniqueId: "REQ_CHANGE_ID",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表	
      jsonpCallback:expertsQuery,
      singleSelect: true,//复选框单选
      onLoadSuccess : function(data){
			gaveInfo();
		},
      columns: [
		{	
			//radio:true,
			checkbox:true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
        field: 'ROW_NUM',
        title: '序号',
        align:"center",
        width:50
      }, {
        field: 'REQ_CHANGE_ID',
        title: 'ID',
        align:"center",
        visible:false
      },{
    	  field: 'CHANGE_CODE',
    	  title: '变更编号',
    	  align:"center",
    	  visible:false
      },{
          field: 'SYSTEM_NAME',
          title: '应用名称',
          align:"center"
      },{
           field: 'VERSIONS_NAME',
           title: '版本名称',
           align:"center"
      },{
      	  field:"REQ_CHANGE_SUBTYPE_NAME",
      	  title:"变更类型",
          align:"center"
      },{
    	  field:"SPONSOR_PERSON_NAME",
    	  title:"发起人",
          align:"center"
      },{
      	field:"CHANGE_STATE_NAME",
      	title:"变更状态",
          align:"center"
      },{
    	  field:"CURR_ACTORNO_NAME",
    	  title:"当前审批人",
    	  align:"center"
      },{
    	  field:"CREATE_TIME",
    	  title:"申请日期",
    	  align:"center",
    	  formatter:function(value,row,index){
			 return value.substring(0,10);
		 }}]
      
    }); 
	
};

initSelect(getCurrentPageObj().find("#change_subtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_SUBTYPE"});
//初始化数据,
initSelect(getCurrentPageObj().find("#change_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_STATE"});

//初始化方法
initGChangAppInfo();
initRoleButtonEvent();

