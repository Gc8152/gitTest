/**
 * 根据URl设置下拉框数据
 * @param obj $("#id")
 * @param show {"value":"enname","text":"cnname"}
 * @param url
 */
function initAPPSelect3(obj,show,param,default_v,preStr){
		globalSelectCache["count"]=globalSelectCache["count"]+1;
		if(globalSelectCache[param.dic_code]!=undefined&&globalSelectCache[param.dic_code]["data"]!=undefined){
			initSelectByData3(obj,show,globalSelectCache[param.dic_code]["data"],default_v);
			if(new Date().getTime()-globalSelectCache[param.dic_code]["startDate"]>50000){
				globalSelectCache[param.dic_code]={};
			}
			return;
		}
		if(globalSelectCache["count"]>7){
			globalSelectCache={};
			globalSelectCache["count"]=1;
		}
		if(!preStr){
			preStr="";
		}
		baseAjax(preStr+"SDic/findItemByDic.asp",param,function(data){
			if(data!=undefined){
				globalSelectCache[param.dic_code]={};
				globalSelectCache[param.dic_code]["data"]=data;
				globalSelectCache[param.dic_code]["startDate"]=new Date().getTime();
				initAppSelectByData3(obj,show,data,default_v);
			}
		});
}


function initAppSelectByData3(obj,show,data,default_v){
	if(obj!=undefined&&show!=undefined&&data!=undefined){
		obj.empty();
		for(var i=0;i<data.length;i++){
			if(default_v==undefined||default_v==""){
				default_v=data[i]["IS_DEFAULT"]=="00"?data[i][show.value]:"";
			}
			obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
		}
		if(default_v!=undefined&&default_v!=""){
			var mycars=default_v.split(",");
			obj.val(mycars).trigger('change');
		}else{
			obj.val(" ");
		}
		obj.select2();
	}
}

//加载地址信息
function getCheckedAddr(systemId){
	
	var sysCall = getMillisecond();
	var url = dev_application+'applicationManager/querySystemAddrList.asp?call='+sysCall+'&SID='+SID+'&system_id='+systemId;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			for(var n = 0; n < data.rows.length; n++){
				var dataMap = data.rows[n];
				for(var m in dataMap){
					
					var str = dataMap[m];
					m = m.toLowerCase();
					if(m == 'attr_type'){
						var tname = str;
					}else if(m == 'config_dic_code'){
						var tvalue = str;
					}else if(m == 'config_address'){
						var taddr = str;
					}
				}
				appendAddrHtml(tname,tvalue,taddr);
			}
		} else {
			alert("无数据！");
		}
	},sysCall);
	
}
//增加地址信息
function appendAddrHtml(tname,tvalue,taddr){
	if(!(tname=='SIT环境' || tname=='UAT环境' || tname=='1618_SIT环境')){
		var tbObj = getCurrentPageObj().find("#envirTable");
		var tr = "<tr name='dataInfoList' id='t"+tvalue+"'>" 
					+"<td class='table-text'>"+tname+"：</td>"
					+"<td colspan = '5'>" 
					+"<span  name='addr'  >"+taddr+"</span></td>"
				+"</tr>";
		tbObj.append(tr);
	}
}

function initfunctionInfoTwo(war){
	        var system_id = war;
	        getCurrentPageObj().find("#SfunctionTableInfoTwo").bootstrapTable(
					{
						url : dev_application+"applicationManager/queryPersons.asp?call=jq_1526643019275_&SID="+SID+"&system_id="+system_id,
						method : 'get', //请求方式（*）   
						striped : false, //是否显示行间隔色
						cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
						sortable : true, //是否启用排序
						sortOrder : "asc", //排序方式
						queryParams : queryParams,//传递参数（*）
						sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
						pagination : true, //是否显示分页（*）
						pageList : [5,10],//每页的记录行数（*）
						pageNumber : 1, //初始化加载第一页，默认第一页
						pageSize : 10,//可供选择的每页的行数（*）
						clickToSelect : true, //是否启用点击选中行
						uniqueId : "ROLE_NO", //每一行的唯一标识，一般为主键列
						cardView : false, //是否显示详细视图
						detailView : false, //是否显示父子表
						singleSelect: true,
						jsonpCallback:"jq_1526643019275_",
						onLoadSuccess:function(data){
						},
						columns : [
						  {
							field : 'USER_NO',
							title : '用户编号',
							align : "center"
						},{
							field : 'USER_NAME',
							title : '用户姓名',
							align : "center"
						},{
							field : 'ROLE_NO',
							title : '角色编号',
							align : "center"
						},{
							field : 'ROLE_NAME',
							title : '角色名称',
							align : "center"
						},{
							field : "OPT_NAME",
							title : "操作人",
							align : "center"
						},{
							field : "OPT_TIME",
							title : "操作时间",
							align : "center"
						}]
					});
			var queryParams=function(params){
				var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
				};
				return temp;
			};
};
