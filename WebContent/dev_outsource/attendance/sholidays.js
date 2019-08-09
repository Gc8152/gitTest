(function(jq){
	/**
	 * 头部月份信息
	 */
	function hm(){
		var ch= '<div class="day"><div class="DaySelect"><div class="select"><div class="stop" id="cy"></div>'+
				'<div class="sbox"><ul id="YearAll"></ul></div></div>';
		for(var i=1;i<=12;i++){
			ch+='<div class="selectm"><div class="stop cm" month="'+i+'">'+i+'月</div></div>';
		}
		 return ch+'</div><div id="DayAll"></div></div>';
	}
	/**
	 * 得到该月的第一天是星期几
	 */
	function GetWeekdayMonthStartsOn(Y,M){
		var date = new Date(Y,M-1,1);
		return date.getDay();
	}
	/**
	 * 得到该月的总天数
	 */
	function GetDaysInMonth(Y,M){
		if (M==1||M==3||M==5||M==7||M==8||M==10||M==12)
			return 31;
		else if (M==4||M==6||M==9||M==11)
			return 30;
		else if (M==2)
			if((Y%4==0 && Y%100!=0)||(Y%100==0 && Y%400==0))
				return 29;
			else
				return 28;
		else
			return 28;
	}
	/**
	 * 所有可查看的年份
	 */
	function YearAll(Y){
		var Ystr = "";
		for (var y = Y - 5; y <= Y+1; y++) {
			Ystr += "<li class='switchY'>"+ y +"</li>";
		}
		return Ystr;
	}
	/**
	 * 初始化当前日期的背景颜色
	 */
	function initCYM(obj,y,m,SY,SM){
		obj.find("#cy").text(y+"年");
		obj.find("div[class='stop cm']").css("background","none");
		 if(SY==y){
			 obj.find("div[month='"+SM+"']").css("background","#C0EBEF");
			if(SM!=m){
				obj.find("div[now='now']").css("background","#c3c3c3");
			}else{
				obj.find("div[month='"+SM+"']").attr("now","now");
			}
		 }else {
			 obj.find("div[now='now']").css("background","#c3c3c3");
		 }
	}
	function lday(j){
		if(j<10){
			return "0"+j;
		}
		return j;
	}
	function dayInfo(is67,ymd,j,today){
		var ht="";
		if(is67 && today=="Y"){
			ht="<div class='dayH' date='"+ymd+"' ><span class='stateday'>休息日</span>"+"<span class='spanday'>"+(j<10?("0"+j):j)+"</span>"+"</div><div class='alltitle_bef alltitle_bef_today' title='点击打卡'><span>上班打卡</span></div><div class='alltitle_aft alltitle_aft_today' title='点击打卡'><span>下班打卡</span></div>";
		}else if (is67 && today=="N"){
			ht="<div class='dayH' date='"+ymd+"' ><span class='stateday'>休息日</span>"+"<span class='spanday'>"+(j<10?("0"+j):j)+"</span>"+"</div><div class='alltitle_bef'><span>上班：未打卡</span></div><div class='alltitle_aft'><span>下班：未打卡</span></div>";
		}else if(!is67 && today=="Y"){
			ht="<div class='dayH' date='"+ymd+"' ><span class='stateday'>工作日</span>"+"<span class='spanday'>"+(j<10?("0"+j):j)+"</span>"+"</div><div class='alltitle_bef alltitle_bef_today' title='点击打卡'><span>上班打卡</span></div><div class='alltitle_aft alltitle_aft_today' title='点击打卡'><span>下班打卡</span></div>";
		}else if(!is67 && today=="N"){
			ht="<div class='dayH' date='"+ymd+"' ><span class='stateday'>工作日</span>"+"<span class='spanday'>"+(j<10?("0"+j):j)+"</span>"+"</div><div class='alltitle_bef'><span>上班：未打卡</span></div><div class='alltitle_aft'><span>下班：未打卡</span></div>";
		}
		return ht;
	}
	/**
	 * 切换年和月
	 */
	function switchYM(obj,SY,SM,SD,callback){
		obj.find("div[class='stop cm']").unbind("click");
		obj.find("div[class='stop cm']").click(function(){
			obj.find("div[class='stop cm']").attr("now","");
			jq(this).attr("now","now");
			jq(this).css("background","#c3c3c3");
			var y=obj.find("#cy").text().substr(0,4);
			var m=jq(this).attr("month");
			getDynamicTable(obj,y,m,SY,SM,SD);
			callback(y+"-"+lday(m));
		});
		obj.find(".switchY").unbind("click");
		obj.find(".switchY").click(function(){
			var ocy=obj.find("#cy");
			var y=jq(this).text().substr(0,4);
			var m=obj.find("div[now='now']").attr("month");
			ocy.text(y+"年");ocy.attr("y",y);
			getDynamicTable(obj,y,m,SY,SM,SD);
		    callback(y+"-"+lday(m));
		});
	}
	/**
	 * 某一天的操作事件
	 */
	function onEventDay(obj,o){
		if(o.onClick!=undefined){
			$(obj).on("click",".dayInfoRed .close",function(){
				o.onClick("close",$(this).parent().data("day"));
			});
			$(obj).on("click",".dayInfoRed .dayTitle",function(){
				o.onClick("update",$(this).parent().data("day"));
			});
//			$(obj).on("click",".dayH",function(){
//				o.onClick("add",$(this).parent().attr("id"));
//			});
			$(obj).on("click",".alltitle_bef_today",function(){
				o.onClick("bef",$(this).parent().attr("id"));
			});
			$(obj).on("click",".alltitle_aft_today",function(){
				o.onClick("aft",$(this).parent().attr("id"));
			});
		}
	}
	function getDynamicTable(obj,Y,M,SY,SM,SD){
		initCYM(obj,Y,M,SY,SM);
		var Temp,i,j;
		var FirstDate,MonthDate,CirNum,ErtNum; // '当月第一天为星期几,当月的总天数,表格的单元格数及循环数,表格第一排空格数与当月天数之和
		FirstDate = GetWeekdayMonthStartsOn(Y,M);// '得到该月的第一天是星期几  0-6
		MonthDate = GetDaysInMonth(Y,M);// '得到该月的总天数 30
		ErtNum = FirstDate + MonthDate;// -1 
		
		Temp = "";
		if (ErtNum > 35){
	   		CirNum = 42;
		}else if (ErtNum == 28){
	   		CirNum = 28; 
		}else{
	   		CirNum = 35;
		}
		j=1;
		for (i = 1; i <= CirNum; i++){
			if (i == 1){
				Temp += "<table><tr style='height:30px;'><th>星期日</th><th>星期一</th><th>星期二</th><th>星期三</th><th>星期四</th><th>星期五</th><th>星期六</th></tr><tr>";
			}
	    	if (i < FirstDate + 1 || i > ErtNum){//非工作日
	       		Temp += "<td></td>";
			}else{//工作日
				var ymd=Y+"-"+lday(M)+"-"+lday(j);
				var is67=(i % 7 == 0||(i+6)%7==0)?"is67 ":"";//周六或者是周qi
		      	Temp += (SY == Y && SM == M && SD == j ? "<td is67='"+(is67?2:1)+"' class='"+is67+"now' id='"+ymd+"'>"+ dayInfo(is67,ymd,j,"Y") + "</td>" : "<td is67='"+(is67?2:1)+"' class='"+is67+"nonow' id='"+ymd+"'>"+ dayInfo(is67,ymd,j,"N") + "</td>") ;

				j = j + 1;
			}
			if (i % 7 == 0 && i < ErtNum){
				Temp += "</tr><tr>";
			}
			if (i == CirNum){
				Temp += "</tr></table>";
			}
		}
		obj.find("#DayAll").html(Temp);
	}
	function setDayInfo(obj,o){
		if(o!=undefined&&o.length>0){
			for(var i=0;i<o.length;i++){
				obj.find("#"+o[i].ymd+" .alltitle").append("<div class='dayInfoRed' title='"+o[i].title+"'>"
						+"<div class='dayTitle'>"+o[i].title+"</div>"
						+"<div class='close'><img src='images/ltee_close_h.png'/></div>"
						+"</div>");
				obj.find("#"+o[i].ymd+" .dayInfoRed").data("day",o[i]);
			}
		}
	}
	jq.fn.WorkCalendar=function(p,o){
		  if (typeof p == "object") {
			  var SY = p.date.getFullYear();
			  var SM = p.date.getMonth()+1;
			  var SD = p.date.getDate();
			  jq(this).empty();
			  jq(this).append(hm());
			  getDynamicTable(this,SY,SM,SY,SM,SD);
			  this.find("#YearAll").html(YearAll(SY));
			  switchYM(this,SY,SM,SD,p.onSwitch);
			  onEventDay(this,p);
			  if(p.onSuccess){
				  p.onSuccess();
			  }
		  }else  if (typeof p == "string" && typeof o == "object") {
			 if("data"==p){
				 setDayInfo(this,o);
			 }				
		  }
		return this;
	};
})(jQuery);