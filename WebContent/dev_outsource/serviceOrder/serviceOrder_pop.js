(function(){
	var html='';
		html+='<div id="myModal_orderPersonPop" class="modal hide fade in"                                         ';
		html+='	style="top: 50%;margin-top: -260px; width: 900px;" tabindex="-1" data-backdrop="static">           ';
		html+='	<div class="modal-header">                                                                         ';
		html+='		<button type="button" class="close"title="点击关闭" data-dismiss="modal">×</button>    			';
		html+='		<h5 id="myModalLabel">供应商订单人员查询页面</h5>                                               ';
		html+='	</div>                                                                                             ';
		html+='	<div class="modal-body">                                                                           ';
		html+='		<div class="ecitic-new">                                                                       ';
		html+='			<div style="padding:1px;margin:1px;">                                                      ';
		html+='				<table id="pop_orderPersonTable" title="双击选择一条数据"></table>                       ';
		html+='			</div>                                                                                     ';
		html+='		</div>                                                                                         ';
		html+='	</div>                                                                                             ';
		html+='	<div class="modal-footer"></div>                                                                   ';
		html+='</div>                                                                                              ';
		getCurrentPageObj().find("div:eq(0)").append(html);
})();
	
(function(orderPersonPop){
	var initTable=function(tableId,func_call){
			var queryParams=function(params){
				var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
				};
				return temp;
			};
			getCurrentPageObj().find("#"+tableId).bootstrapTable("destroy").bootstrapTable({
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "ASS_CODE", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess : function(data){
					computerSumMonn();
				},onDblClickRow:function(row){
					if(func_call){
						func_call(row);
						getCurrentPageObj().find("#"+tableId).bootstrapTable("remove",{field:"OP_CODE",values:[row["OP_CODE"]]});
					}
					if(getCurrentPageObj().find("#"+tableId).bootstrapTable("getData").length<1){
						getCurrentPageObj().find("#myModal_orderPersonPop").modal("hide");
					}
				},
				columns : [{
					field : 'number_no',
					title : '序号',
					align : "center",
					width : 80,
					formatter: function (value, row, index) {
		    			  return index+1;
		        	  }
				},{
					field : "OP_NAME",
					title : "人员姓名",
					align : "center"
				},{
					field : "GRADE_NAME",
					title : "人员方向",
					align : "center"
				},{
					field : "LEVEL_NAME",
					title : "人员级别",
					align : "center"
				},{
					field : "P_PRICE_TAX",
					title : "人员单价(人月)",
					align : "center"
				},{
					field : "PERSON_DAY",
					title : "人员考勤（人天）",
					align : "center"
				},{
					field : "AD_MONEY",
					title : "金额",
					align : "center",
					formatter: function (value, row, index) {
						if(value){
							return value;
						}
						return ((row.PERSON_DAY||0)*(row.P_PRICE_TAX||0)/22).toFixed(2);
					}
				}]
		});
	};
	var url="";
	/**
	 * 
	 */
	orderPersonPop.initQueryData=function(sup_num,contract_code,acc_starttime,acc_endtime,acc_id){
		url="sOrder/findPersonPriceAndLevel.asp?sup_num="+sup_num+"&contract_code="+contract_code+"&acc_starttime="+acc_starttime+"&acc_endtime="+acc_endtime+"&acc_id="+(acc_id||"");
	};
	/**
	 * 初始化表格数据
	 */
	var initTableData=function(selectedData){
		//OP_CODE
		var selectUser={};
		if(selectedData&&selectedData.length>0){
			for(var i=0;i<selectedData.length;i++){
				selectUser[selectedData[i]["OP_CODE"]]="01";
			}
		}
		baseAjaxJsonpNoCall(dev_outsource+url+"&type=01",{},function(data){
			if(data&&data.rows.length>0){
				var rows=[];
				var total=0;
				for(var i=0;i<data.rows.length;i++){
					var op_code=data.rows[i]["OP_CODE"];
					if(!selectUser[op_code]){
						rows[rows.length]=data.rows[i];
					}
					total++;
				}
				getCurrentPageObj().find("#pop_orderPersonTable").bootstrapTable("load",{rows:rows,total:total});
			}
		});
	};
	orderPersonPop.penOrderDetailPop=function(selectedData,func_call){
		initTable("pop_orderPersonTable",func_call);
		initTableData(selectedData);
		getCurrentPageObj().find("#myModal_orderPersonPop").modal("show");
	};
	
})(orderPersonPop={});