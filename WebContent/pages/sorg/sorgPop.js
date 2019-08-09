function openSOrgPop(id,callparams){
	$('#myModal_org').remove();
	$("#"+id).load("pages/sorg/sorgPop.html",{},function(){
		$("#myModal_org").modal("show");
		autoInitSelect($("#pop_orgState"));
		orgPop("#pop_orgTable","SOrg/findAllOrgById.asp",callparams);
		$("select").select2();
	});
	
}	
/**
	 * 用户POP框
	 */
	function orgPop(orgTable,orgUrl,orgParam){
		var singleSelect=true;
		if(orgParam.singleSelect==false){
			singleSelect=false;
		}
		if(!singleSelect){
			$("#sorgPOPSureSelected").parent().show();
			$("#sorgPOPSureSelected").unbind("click");
			$("#sorgPOPSureSelected").click(function(){
				var ids = getCurrentPageObj().find(orgTable).bootstrapTable('getSelections');
				if(orgParam.name&&orgParam.no){
					var kvs=arrayObjToStr2(orgParam.no,ids,"ORG_CODE","ORG_NAME","");
					if(""==orgParam.name.val()||orgParam.name.attr("placeholder")==orgParam.name.val()){
						orgParam.no.val(kvs[0]);
						orgParam.name.val(kvs[1]);
					}else if(""!=kvs[0]&&""!=kvs[1]){
						orgParam.no.val(orgParam.no.val()+","+kvs[0]);
						orgParam.name.val(orgParam.name.val()+","+kvs[1]);
					}
					$('#myModal_org').modal('hide');
				}
			});
		}else{
			$("#sorgPOPSureSelected").parent().hide();
		}
		//查询所有用户POP框
		$(orgTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : orgUrl,
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
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "RN", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: singleSelect,
					onDblClickRow:function(row){
						$('#myModal_org').modal('hide');
						orgParam.name.val(row.ORG_NAME);
						orgParam.no.val(row.ORG_CODE);
					},
					columns :[
						{
							field: 'middle',
							checkbox: true,
							rowspan: 2,
							align: 'center',
							valign: 'middle',
							visible:!singleSelect
						},
						{
				          field: 'ORG_CODE',
				          title: '部门编号',
				          align:"center"
				        }, {
				          field: 'ORG_NAME',
				          title: '部门名称',
				          align:"center"
				        }, {
				        	field:"ORG_MANAGER",
				        	title:"部门经理",
				            align:"center"
				        }, {
				        	field:"BUSINESS_TYPE",
				        	title:"业务类型",
				            align:"center"
				        }, {
				        	field:"STATE",
				        	title:"状态",
				            align:"center",
							formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
				        }, {
				        	field:"UPDATE_TIME",
				        	title:"修改时间",
				            align:"center"
				        }]
				});
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};		
		
		var currtab=getCurrentPageObj();
		//用户POP重置
		currtab.find("#pop_orgReset").click(function(){
			currtab.find(".row input").each(function(){
				$(this).val("");
			});
			currtab.find("#pop_orgState").val("");
			currtab.find("#pop_orgState").select2();
		});
		//多条件查询用户
		$("#pop_orgSearch").click(function(){
			var pop_orgName = currtab.find("#pop_orgName").val()==currtab.find("#pop_orgName").attr("placeholder")?"":currtab.find("#pop_orgName").val();
			var pop_orgNo =  currtab.find("#pop_orgNo").val()==currtab.find("#pop_orgNo").attr("placeholder")?"":currtab.find("#pop_orgNo").val();
			var pop_orgManager = currtab.find("#pop_orgManager").val()==currtab.find("#pop_orgManager").attr("placeholder")?"":currtab.find("#pop_orgManager").val();
			var pop_orgState =  $.trim( $("#pop_orgState").val());
			$(orgTable).bootstrapTable('refresh',{url:"SOrg/findAllOrgById.asp?pop_orgName="+escape(encodeURIComponent(pop_orgName))+"&pop_orgNo="+pop_orgNo+"&pop_orgManager="+escape(encodeURIComponent(pop_orgManager))+"&pop_orgState="+pop_orgState});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_orgSearch").click();});
	}