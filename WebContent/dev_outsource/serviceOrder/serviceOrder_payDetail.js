function getCurrentPageObj(){
	return jQuery;
}
var SID="";	
function getParamString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	}
		
	$(document).ready(function(){
		SID=getParamString("SID");
		baseAjaxJsonpNoCall(dev_outsource+"sOrder/queryAllsOrder.asp?acc_id="+getParamString("order_id"),{},function(data){
			if(data){
				for(var k in data.rows[0]){
					$("#"+k).text(data.rows[0][k]);
				}
				var start=data.rows[0]["ACC_STARTTIME"].replace("-","月").replace("-","日");
				var end=data.rows[0]["ACC_ENDTIME"].replace("-","月").replace("-","日");
				$("#cycle").text(data.rows[0]["ACC_YEAR"]+"年"+start+"-"+data.rows[0]["ACC_YEAR"]+"年"+end);
			}
		});
		baseAjaxJsonpNoCall(dev_outsource+"sOrder/queryOrderDetail.asp?acc_id="+getParamString("order_id"),{},function(data){
			var sumDay=0;//总天
			var sumMoney=0;//总金额
			for(var i=0;i<data.rows.length;i++){
				var tr='<tr class="personInfo">';
				tr+='<td>'+(i+1)+'</td>';
				tr+='<td>'+data.rows[i]["OP_NAME"]+'</td>';
				tr+='<td>'+data.rows[i]["GRADE_NAME"]+'</td>';
				tr+='<td>'+data.rows[i]["LEVEL_NAME"]+'</td>';
				tr+='<td>'+data.rows[i]["PERSON_DAY"]+'</td>';
				tr+='<td>'+data.rows[i]["AD_MONEY"]+'</td>';
				if(i==data.rows.length-1){
					tr+='<td rowspan="'+data.rows.length+'">无</td>';
				}
				sumDay+=parseFloat(data.rows[i]["PERSON_DAY"]);
				sumMoney+=parseFloat(data.rows[i]["AD_MONEY"]);
				tr+='</tr>';
				$("#outpersonTitle").after(tr);
			}
			$("#sumDay").text(sumDay);
			$("#sumMoney").text(sumMoney.toFixed(2));
		});
	});
	
	/*(function(){
		baseAjax("../../sOrder/findSOrderById.asp.asp",{order_code:getParamString("order_id")},function(data){
			if(data){
				for(var k in data.soInfo){
					 if(k=="TRAVEL_MONEY"){
						travelMoney=parseFloat(data.soInfo[k]);
					}else if(k=="EXPECTALL_MONEY"){
						expectallMoney=parseFloat(data.soInfo[k]);
					}
				}
				$("#CONTRACT_CODE").html(data.soInfo["CONTRACT_CODE"]);
				$("#ORDER_CODE").html(data.soInfo["ORDER_CODE"]);
				$("#ORDER_DATE").html(data.soInfo["ORDER_DATE"]);
				$("#SUPLIER_NAME").html(data.soInfo["SUPLIER_NAME"]+"（章）");
				$("#REQUIRE_DESCRIP").html(data.soInfo["ASS_NAME_CODE"]);
				initSOMonth(data.soInfo["ASS_CODE"],data.soInfo["CONTRACT_CODE"],data.soInfo["SUPLIER_ID"],getParamString("order_id"));
			}
		});
		function initSOMonth(str,contract_code,supplierId,order_code){//初始化非采购人月数
			var queryParams=function(params){
				var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
				};
				return temp;
			};
			$("#purchase_detail_mouth").bootstrapTable("destroy").bootstrapTable({//初始化采购人月数table
				url : '../../sOrder/initFirstMonthQuery.asp?orderCode='+order_code,//请求后台的URL（*）
				method : 'post', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : false, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "OP_QUALIFICATION", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,
				columns : [ {			
					field : 'OP_GRADE_NAME',
					title : '人员资质',
					align : "center"
				},{
					field : 'P_PRICE_TAX',
					title : '月单价(万元)',
					align : "center",
					formatter:function(value,row,index){
						var p_price=row.P_PRICE_TAX;
						if(p_price==null||p_price==undefined||p_price==""){
							p_price="0.00";
						}
						return p_price;
					}
				},{
					field : 'WORKLOAD_DAYS',
					title : '人月数',
					align : "center",
					formatter:function(value,row,index){
						var WORKLOAD_DAY=value;
						if(WORKLOAD_DAY==null||WORKLOAD_DAY==undefined||WORKLOAD_DAY==""){
							WORKLOAD_DAY="0.00";
						}
						WORKLOAD_DAY=parseFloat(WORKLOAD_DAY).toFixed(2);
						return WORKLOAD_DAY;
					}
				},{
					field : 'SUM_MONEY',
					title : '总价(万元)',
					align : "center",
					formatter:function (value,row,index){
						var price=row.P_PRICE_TAX;
						var workload_day=row.WORKLOAD_DAYS;
						if(price==null||price==undefined||price==""){
							price="0.00";
						}
						if(workload_day==null||workload_day==undefined||workload_day==""){
							workload_day="0.00";
						}
						var SUM_MONEY=parseFloat(price)*parseFloat(workload_day);
						SUM_MONEY=SUM_MONEY.toFixed(4);
						SUM_MONEY=SUM_MONEY+"";
						var moneys=SUM_MONEY.split("\.");
						if(moneys[1]=="0000"){}
						if(moneys[1]=="0000"){
							SUM_MONEY=moneys[0]+".00";					
						}else{
							SUM_MONEY=parseFloat(SUM_MONEY);
						}
						return SUM_MONEY+"";
					}
				},{
					field : 'START_TIME',
					title : '服务开始时间',
					align : "center"
				}],
				onLoadSuccess:function(data){
					var sumMonths=0;//人月数
					var sum_moneys=0;//总价
					for(var i=0;i<data.rows.length;i++){
						var price=data.rows[i].P_PRICE_TAX;
						var workmonth =data.rows[i].WORKLOAD_DAYS;
						if(workmonth==''||workmonth==undefined||workmonth==null){
							workmonth=0;
						}
						if(price==''||price==undefined||price==null){
							price=0;
							sum_moneys=accAdd(sum_moneys,numMulti(parseFloat(price),parseFloat(workmonth)));
						}else{
							sum_moneys=accAdd(sum_moneys,numMulti(parseFloat(price),parseFloat(workmonth)));
						}
						sumMonths=accAdd(data.rows[i].WORKLOAD_DAYS,sumMonths);
						sumMonths=parseFloat(sumMonths).toFixed(2);
						sum_moneys=parseFloat(sum_moneys).toFixed(4);//toFiexd只能对数据数据类型有效
						sum_moneys=parseFloat(sum_moneys+"");
					}
					var str=
						"<tr><td class='xxx'>合计</td><td></td><td><div id='sumMonths' class='xxx'>"+sumMonths+"</div></td>" +
						"<td><div id='sumPrice' class='xxx'>"+sum_moneys+"</div></td><td></td></tr>" +
						"<tr><td class='xxx'>预计出差费用(万元)</td><td><div id='travel_money' class='xxx'>"+travelMoney+"</div></td><td></td>"+
						"<td class='xxx'>预计总费用(万元)</td><td><div id='expectall_money'class='xxx' >"+expectallMoney+'('+convertCurrency(expectallMoney*10000)+')'+"</div></td>"+
						"</tr>";
					$("#purchase_detail_mouth").append(str);
				}
			});
		}
		function numMulti(num1, num2) { 
			var baseNum = 0; 
			try { 
				baseNum += num1.toString().split(".")[1].length; 
			} catch (e) { 
			} 
			try { 
				baseNum += num2.toString().split(".")[1].length; 
			} catch (e) { 
			} 
			var a=Number(num1.toString().replace(".", ""));
			var b=Number(num2.toString().replace(".", "")) ;
			var c=(a*b)/ Math.pow(10, baseNum);
			return c; 
		}
		function accAdd(arg1, arg2) {//加法函数
		    var r1, r2, m;  
		    try{  
		        r1=arg1.toString().split(".")[1].length;  
		    }catch(e){  
		        r1=0;  
		    }  
		    try{  
		        r2 = arg2.toString().split(".")[1].length;  
		    }catch(e){  
		        r2=0;  
		    } 
		    m=Math.pow(10, Math.max(r1, r2));  
		    return (arg1 * m + arg2 * m) / m;  
		} 
		function convertCurrency(money){
			var cnNum= new Array('零','壹','贰','叁','肆','伍','陆','柒','捌','玖');//汉子数字
			var cnIntRadice=new Array('','拾','佰','仟');//基本单位
			var cnIntUnits=new Array('','万','亿','兆');//扩展单位
			var cnDecUnits=new Array('角','分','毫','厘');//小数单位
			var cnInteger='整';//整数后跟的字符
			var cnIntLast='元';//整型完以后的单位
			
			var maxNum=999999999999999.999;//最大处理数字
			
			var integerNum;//金额整数部分
			
			var decimalNum;//金额小数部分
			
			var chineseStr='';
			
			var parts;//分离金额后用的数组
			
			if(money==''){
				return '';
			}
			money=parseFloat(money);
			if(money>=maxNum){
				return '';
			}
			if(money==0){
				chineseStr=cnNum[0]+cnIntLast+cnInteger;
				return chineseStr;
			}
			money=money.toString();
			if(money.indexOf('.')==-1){
				integerNum=money;
				decimalNum='';
			}else{
				parts=money.split('.');
				integerNum=parts[0];
				decimalNum=parts[1].substr(0,4);
			}
			
			if(parseInt(integerNum,10)>0){
				var zeroCount=0;
				var IntLen=integerNum.length;
				for (var i = 0; i < IntLen; i++) {
					var n=integerNum.substr(i,1);
					var p=IntLen-i-1;
					var q=p/4;
					var m=p%4;
					if(n=='0'){
						zeroCount++;
					}else{
						if(zeroCount>0){
							chineseStr+=cnNum[0];
						}
						zeroCount=0;
						chineseStr+=cnNum[parseInt(n)]+cnIntRadice[m];
					}
					if(m==0&&zeroCount<4){
						chineseStr+=cnIntUnits[q];
					}
				}
				chineseStr+=cnIntLast;
			}
			if(decimalNum!=''){//小数部分
				var declen=decimalNum.length;
				for (var i = 0; i < declen; i++) {
					var n=decimalNum.substr(i,1);
					if(n!='0'){
						chineseStr+=cnNum[Number(n)]+cnDecUnits[i];
					}
				}
			}
			if(chineseStr==''){
				chineseStr+=cnNum[0]+cnIntLast+cnInteger;
			}else if(decimalNum==''){
				chineseStr+=cnInteger;
			}
			return chineseStr;
		}
	})();*/