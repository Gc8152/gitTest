(function(supplierInfoManager){
	var themecall = getMillisecond();
	//初始化按钮事件
	function initSupplierInfoListButtonEvent(){
		initSelect(getCurrentPageObj().find("#sup_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_SUP_LEVEL"});	
		//重置
		getCurrentPageObj().find("#reset_supplierList").unbind("click");
		getCurrentPageObj().find("#reset_supplierList").click(function(){
			getCurrentPageObj().find("#supplierInfoList input").val("");
			var selects=getCurrentPageObj().find("#supplierInfoList select");
			selects.val(" ");
			selects.select2();
		});
		//查询供应商
		getCurrentPageObj().find("#queryAllSupplierList").unbind("click");
		getCurrentPageObj().find("#queryAllSupplierList").click(function(){
			var sup_name = getCurrentPageObj().find("#sup_name").val();
			var sup_simp_name = getCurrentPageObj().find("#sup_simp_name").val();
			var register_money_gt = $.trim(getCurrentPageObj().find("#register_money_gt").val());
			var register_money_lt = $.trim(getCurrentPageObj().find("#register_money_lt").val());
			var establish_time_st = $.trim(getCurrentPageObj().find("#establish_time_st").val());
			if("点击选择"==establish_time_st){
				establish_time_st="";
			}
			var establish_time_et = $.trim(getCurrentPageObj().find("#establish_time_et").val());
			if("点击选择"==establish_time_et){
				establish_time_et="";
			}
			var linkmanname = $.trim(getCurrentPageObj().find("#linkmanname").val());
			var sup_level = $.trim(getCurrentPageObj().find("#sup_level").val());
			var url=dev_outsource+'SupplierInfo/queryallsupplierinfo.asp?isBlackmenu=1&sup_name=' + escape(encodeURIComponent(sup_name))+'&sup_simp_name='+escape(encodeURIComponent(sup_simp_name))
			+'&register_money_gt='+register_money_gt+'&register_money_lt='+register_money_lt+'&sup_level='+sup_level
			+'&linkmanname='+escape(encodeURIComponent(linkmanname))+'&establish_time_st='+establish_time_st+'&establish_time_et='+establish_time_et+"&call="+themecall+"&SID="+SID;
			getCurrentPageObj().find('#detailTable').bootstrapTable('refresh',{url:url});
		});
		
		//新增供应商信息
		getCurrentPageObj().find("#addSupplier").unbind("click");
		getCurrentPageObj().find("#addSupplier").click(function(){
			closeAndOpenInnerPageTab("addSupplier","供应商信息新增","dev_outsource/supplier/supplierInfo/supplierInfo_add.html",function(){
				addOutsup();
			});
		});
		
		//修改供应商信息
		getCurrentPageObj().find("#updateSupplier").unbind("click");
		getCurrentPageObj().find("#updateSupplier").click(function(){
			var num = getCurrentPageObj().find("#detailTable").bootstrapTable('getSelections');
			if(num.length!=1){
				alert("请选择一条数据进行修改!");
				return ;
			}
			var nums = $.map(num, function (row) {
				return row.SUP_NUM;                    
			});
			closeAndOpenInnerPageTab("update_supplier","修改供应商","dev_outsource/supplier/supplierInfo/updateSupplier.html",function(){
				var call=getMillisecond();
				baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneSupplier.asp?sup_num="+nums+"&SID="+SID+"&call="+call, null , function(data) {
					for(var k in data){
						 if("file_id" == k){
							if(data["file_id"]&&$.trim(data["file_id"])!=""){
								getCurrentPageObj().find("#suppFile").val(data["file_id"]);
								findFileInfo(data["file_id"],function(msg){
									if(msg.rows.length>0){
										defaultShowFileInfo(data["file_id"],getCurrentPageObj().find("#addSuppFileButton").parent(),msg,true,"addSuppFileDiv");
									}
								});
			   				}
						}else{
							getCurrentPageObj().find("input[name='UB." + k + "']").val(data[k]);
							getCurrentPageObj().find("textarea[name='UB." + k + "']").val(data[k]);
						}
					}
					initUpdateSupplierSelect(data.group_company,data.ordinary_vat_payr,data.is_payer,data.sup_level,data.sup_sort_one,data.is_listed,data.nature_business);
					initUpdateSupplierInfoEvent();
					getCurrentPageObj().find("#tabShareholderInfo_up").click(initOwnershipInfoUpdate);//股权结构
					getCurrentPageObj().find("#tabLinkmanInfo_up").click(initSupLinkmanUpdate);//联系人信息
					getCurrentPageObj().find("#tabFinancialInfo_up").click(initFinancialInfoUpdate);//财务信息
					getCurrentPageObj().find("#tabSignInfo_up").click(initSignInfoUpdate);//与主要客户签约情况
					getCurrentPageObj().find("#tabEnclosureInfo_up").click(initEnclInfoUpdate);//资质文件信息
				},call);
			});
		});
		//删除供应商信息
		getCurrentPageObj().find("#deleteSupplier").unbind("click");
		getCurrentPageObj().find("#deleteSupplier").click(function(){
			var num = getCurrentPageObj().find("#detailTable").bootstrapTable('getSelections');
			var nums = $.map(num, function (row) {
				return row.SUP_NUM;                    
			});
			if(num.length!=1){
				alert("请选择一条数据进行删除!");
				return ;
			}
			nconfirm("确定要删除该数据吗？",function(){
				var call=getMillisecond();
				var url=dev_outsource+"SupplierInfo/deleteSupplierInfoByNum.asp?sup_num="+nums+"&SID="+SID+"&call="+call;
				baseAjaxJsonp(url,{},function(msg){
					alert("删除成功！",function(){
						getCurrentPageObj().find("#detailTable").bootstrapTable('remove', {
							field: 'SUP_NUM',
							values: nums
						});	
						getCurrentPageObj().find("#queryAllSupplierList").click();
					});
				},getMillisecond());
			});	
		});	
		//查看供应商信息
		getCurrentPageObj().find("#detailSupplier").unbind("click");
		getCurrentPageObj().find("#detailSupplier").click(function(){
			var id = getCurrentPageObj().find("#detailTable").bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条数据进行查看!");
				return ;
			}
			var nums = id[0].SUP_NUM;
			closeAndOpenInnerPageTab("supplierDetailInfo","供应商详细信息","dev_outsource/supplier/supplierInfo/supplierDetailInfo.html",function(){
				suplierDetail.initDetail(nums);
			});
		});
	/********************/
		
		getCurrentPageObj().find("#importSupplier").unbind("click");
		getCurrentPageObj().find("#importSupplier").click(function(){
			 startLoading();
			 $.ajaxFileUpload({
				    url:"SupplierInfo/importSupplierInfo.asp",
				    type:"post",
					secureuri:false,
					fileElementId:'supplierfile',
					data:'',
					dataType: 'json',
					success:function (msg){
						endLoading();
						getCurrentPageObj().find("#supplierfile").val("");
						getCurrentPageObj().find("#supplierfield").val("");
						$("#supplier_import").modal("hide");
						if(msg&&msg.result=="true"){
							alert("导入成功",function(){
								getCurrentPageObj().find("#detailTable").bootstrapTable("refresh");
							});
						}else if(msg&&msg.error_info){
							alert("导入失败:"+msg.error_info);
						}else{
							alert("导入失败！");
						}
					},
					error: function (msg){
						endLoading();
						alert("导入失败！");
					}
			   });
		});
		
		//供应商信息批量导入
		getCurrentPageObj().find("#importAllSup").unbind("click");
		getCurrentPageObj().find("#importAllSup").click(function(){
			$("#supplierAll_import").modal("show");
		});
		
		getCurrentPageObj().find("#importAllSupplier").unbind("click");
		getCurrentPageObj().find("#importAllSupplier").click(function(){
			startLoading();
			 $.ajaxFileUpload({
				    url:"SupplierImpInfo/importAllSupplierInfo.asp",
				    type:"post",
					secureuri:false,
					fileElementId:'supplierAllfile',
					data:'',
					dataType: 'json',
					success:function (msg){
						endLoading();
						getCurrentPageObj().find("#supplierAllfile").val("");
						getCurrentPageObj().find("#supplierAllfield").val("");
						$("#supplierAll_import").modal("hide");
						if(msg&&msg.result=="true"){
							alert("导入成功",function(){
								getCurrentPageObj().find("#detailTable").bootstrapTable("refresh");
							});
						}else if(msg&&msg.error_info){
							alert("导入失败:"+msg.error_info);
						}else{
							alert("导入失败！");
						}
					},
					error: function (msg){
						endLoading();
						alert("导入失败！");
					}
			   });
		});
	};
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	//初始化查询供应商列表显示table
	function initSSupplierInfo() {
		getCurrentPageObj().find("#detailTable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : dev_outsource+'SupplierInfo/queryallsupplierinfo.asp?isBlackmenu=1&SID=' + SID + "&call=" + themecall,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,20],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 10,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "sup_num", //每一行的唯一标识，一般为主键列
					jsonpCallback : themecall,
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					onLoadSuccess:function(data){
						gaveInfo();
					},
					columns : [ {
						field: 'middle',
						checkbox: true,
						rowspan: 2,
						align: 'center',
						valign: 'middle'
					},/*{
						field : 'R',
						title : '序号',
						align : "center",
					},*/{
						field : 'SUP_NUM',
						title : '供应商编号',
						align : "center",
						visible: false
					},{
						field : 'SUP_NAME',
						title : '供应商名称',
						width : "300",
						align : "center"
					}, {
						field : "SUP_SIMP_NAME",
						title : "供应商简称",
						align : "center"
					},{
						field : "REGISTER_MONEY",
						title : "注册资金(元)",
						align : "center",
						formatter : function(value,row,index){
							if(value!=null && value!="" && value!=undefined){
								value=value.toFixed(2);
								return formatNumber(value);
							}else{
								return "";
							}
						}
					},{
						field : "LINKNAME",
						title : "常用联系人",
						align : "center"
					}, {
						field : "LINKTEL",
						title : "联系电话",
						align : "center"
					}, {
						field : "LINKEMAIL",
						title : "联系邮箱",
						align : "center"
					}, {
						field : "ESTABLISH_TIME",
						title : "成立时间",
						align : "center"
					}, {
						field : "SUP_LEVEL",
						title : "供应商级别",
						align : "center"
					}]
				});
	};
	supplierInfoManager.init=function(){
		initSupplierInfoListButtonEvent();
		initSSupplierInfo();
	};
})(supplierInfoManager={});
/**
 * 校验输入的数字
 * @param obj
 */
function supplierInfoList_checkNum(obj){
	var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
	if(!reg.test(obj.value) && obj.value!="" && obj.value!=null){
		alert("请输入正确的数字！",function(){
			obj.value='';
		});
    }
}

//时间比较
function checkTimeSupCompare(){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#establish_time_st").val();
		var check_endtime = getCurrentPageObj().find("#establish_time_et").val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#establish_time_et").val("");
					getCurrentPageObj().find("#establish_time_st").val("");
				});
			}
		}
	}});
}
//注册资金比较
function checkMoneySupCompare(){
		var check_startmoney = getCurrentPageObj().find("#register_money_gt").val();
		var check_endmoney = getCurrentPageObj().find("#register_money_lt").val();
		if(check_startmoney!=""&&check_endmoney!=""){
			if(check_startmoney>check_endmoney){
				alert('金额范围不对!',function(){
					getCurrentPageObj().find("#register_money_lt").val("");
					getCurrentPageObj().find("#register_money_gt").val("");
				});
			}
		}
}
$(document).ready(function(){
	supplierInfoManager.init();
	importExcel.initImportExcel(getCurrentPageObj().find("#importAllSupDetails"),"供应商信息","sfile/downloadFTPFile.asp?id=m_045","SupplierInfo/importSupplierInfo.asp",function(msg){
		if(msg&&msg.result=="true"){
			alert("导入成功!");
			getCurrentPageObj().find("#queryAllSupplierList").click();
		}else if(msg&&msg.result=="false"&&msg.error_info){
			alert(msg.error_info);
		}else{
			alert("导入失败!");
		}
	});
});