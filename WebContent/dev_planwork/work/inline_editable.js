(function(jq){
	/**
	 * 初始化表格的头
	 */
	function initMytableHeader(columns){
		var header='<thead><tr class="mytable-header">';
		for(var i=0;i<columns.length;i++){
			var width = columns[i].width;
			if (width == "" || width == undefined || width == null) {
				width = "10%";
			} else {
				if ((width+"").indexOf("px")<=0 && (width+"").indexOf("%")<=0) {
					width = width + "%";
				}
			}
			header=header+"<th  class='mytable-row-th' style='width:"+ width +"'>"+columns[i].title+"</th>";
		}
		return header+"</tr></thead>";
	}
	/**
	 * 初始化表格的行
	 */
	function initMytableRow(i,id,data,columns){
		initMytable[id].data[i]=data;
		var datarow="";
		datarow='<tr index='+i+' id="'+id+'-rows-'+i+'" class="mytable-row">';
		for(var j=0;j<columns.length;j++){
			var field=columns[j]['field'];
			datarow=datarow+"<td field='"+field+"' class='mytable-row-td'><div class='mytable-column-div' style='display:inline;'>"+formatter(i,columns[j],data,field)+"</div></td>";
		}
	  return datarow+'</tr>';
	}
	/**
	 * 数据格式化
	 */
	function formatter(index,column,data,field){
		var value="";
		if(column.formatter){
			value=column.formatter(index,data[field],data);
		}else{
			value=data[field];
		}
		if(value){
			return value;
		}
		return "--";
	}
	
	/**
	 * 初始化表格事件
	 */
	function initMytableEvent(id,config){
		jq("tr[id^='"+id+"-rows-'] .mytable-row-td").unbind("click");
		jq("tr[id^='"+id+"-rows-'] .mytable-row-td").click(function(){//单选 事件
			var selected=jq("#"+id+" .mytable-selected");
			var index=$(this).parent().attr("index");
			/*if((index%2)>0){
				selected.addClass("mytable-row-td mytable-qishu");
			}else{
				selected.addClass("mytable-row-td");
			}*/
			selected.removeClass("mytable-selected");
			jq(this).parent().addClass("mytable-selected");
			if(config.click){
				config.click(index,config.data.rows[index]);
			}
		});
		jq("tr[id^='"+id+"-rows-']").unbind("dblclick");
		jq("tr[id^='"+id+"-rows-']").dblclick(function(){
			var index=jq(this).attr("index");
			if(config.dblclick){
				config.dblclick(index,config.data.rows[index]);
			}
		});
	}
	
	
	//针对jsonp设计的通用ajax请求
	function baseAjaxJsonp2(url, param, callback,method, async) {
		if(method=="" || method==null || method==undefined){
			method = "jsonp_success";
		}
		var call=getMillisecond();
		$.ajax({
			type : "get",
			url : url+"&call="+call,
			async : async == undefined ? true : false,
			data : param,
			dataType : "jsonp",
			jsonp: "callback",//服务端用于接收callback调用的function名的参数  
	        jsonpCallback: call,//回调函数名称，需要与后台返回的json数据串前缀保持一致
			success : function(msg) {
				callback(msg);
			},
			error : function(msg) {
				callback();
			}
		});
	}
	//获取当前毫秒值
	function getMillisecond(){
		var myData = new Date(); 
		return "jq_"+myData.getTime();
	}

	/***
	*tr数据
	**/
	function getDataRowTr(id,data,columns){
		var datarows="";
		if(data&&data.rows){
			for(var i=0;i<data.rows.length;i++){
				datarows=datarows+initMytableRow(i,id,data.rows[i],columns);
			}
		}
		return datarows;
	}
	
	/**
	 * 初始化表格
	 */
	function initMytable(id,config,isurl){
		if(!jq("#"+id).hasClass("mytable-view")){
			jq("#"+id).addClass("mytable-view");
		}
		if(config.columns!=undefined){
			initMytable[id]=config;
			//var start='<table id="'+id+'_table" style="width:100%;" border="0" cellspacing="0" cellpadding="0">';
			var datarows=(config.url&&!isurl)?"<tr id='"+id+"_loading' ><td class='noDataTd' colspan='"+config.columns.length+"'>正在努力查找数据....</td></tr>":"<tbody><tr id='"+id+"_loading'></tr></tbody>";
			//var end='</table>';
			jq("#"+id).html(initMytableHeader(config.columns)+datarows);
			if(config.data&&config.data.rows){
				initDataAndEvent(id,config);
			}else if(config.url&&!isurl){
				findData(id,config,function(data){
					config.data=data;
					initDataAndEvent(id,config);
				});
			}else{
				config.data={total:0,rows:[]};
			}
		}
	}

	/**
	 * 刷新
	 */
	function refresh(id,param){
		$("#"+id+" tr[index]").remove();
		if(typeof param == 'string'){
			initMytable[id].url=param;
			initDataAndEvent(id,initMytable[id]);
		}else if(typeof param == 'object'){
			if(initMytable[id].url){
				initMytable[id].queryParams=param;
				$("#"+id+"_loading").show();
				findData(id,initMytable[id],function(data){
					initMytable[id].data=data;
					initDataAndEvent(id,initMytable[id]);
					$("#"+id+"_loading").hide();
				});
			}else if(initMytable[id].data){
				initDataAndEvent(id,initMytable[id]);
			}
		}
	}
	/**
	 * 初始化数据和事件
	 */
	function initDataAndEvent(id,config){
		datarows=getDataRowTr(id,config.data,config.columns);
		jq("#"+id+" .mytable-row-td").remove();
		jq("#"+id+" .noDataTd").remove();
		if(datarows==""&&config.url){
			datarows="<tr index='index' ><td class='noDataTd' colspan='"+config.columns.length+"'>没有找到匹配的记录</td></tr>";
		}
		$("#"+id+"_loading").hide();
		$("#"+id+"_loading").after(datarows);
		initMytableEvent(id,config);
		if(config.loadSuccess){
			config.loadSuccess(config.data);
		}
	}
	
	/**查找数据*/
	function findData(id,config,callback){
		baseAjaxJsonp2(config.url,config.queryParams,function(data){
			if(callback){
				callback(data);
			}
		}); 
	}
	/**
	 * 开始编辑
	 */
	function beginEditorTb(id,index){
		var tr=jq("#"+id).find("tr[index='"+index+"']");
		if(tr.find('input').length>0||tr.find('textarea').length>0){
			return false;
		}
		initMytable[id].data['rows'][index]["edting"]=true;
		var config=initMytable[id];
		var columns=config.columns;
		for(var i=0;i<columns.length;i++){
			if(columns[i].edit&&columns[i].edit.type){
				var td=tr.find("td[field='"+columns[i].field+"']");
				var tdvalue=td.text();
				td.html(setMyTableEditor(index,columns[i].edit,columns[i].field,tdvalue));
				if(columns[i].edit.type=="select"){
					$("#"+id +" select").select2();
				}
			}
		}
	}
	/**
	 * 设置编辑
	 */
	function setMyTableEditor(index,edit,name,value){
		var tdHtml="<div style='position: relative;'>";
		value=value=="--"?"":value;
		var click=edit.click?(" onclick="+edit.click):"";
		var class_=edit.class_?(" class="+edit.class_):"";
		var readonly=edit.readonly?(" readonly"):"";
		var placeholder=edit.placeholder?(" placeholder="+edit.placeholder):"";
		
		if("text"==edit.type){
			tdHtml=tdHtml+ "<input index='"+index+"' name='"+name+"' type='text' "+placeholder+click+class_+readonly+" value='"+value+"'/>";
		}else if("textnum"==edit.type){
			tdHtml=tdHtml+ "<input index='"+index+"' name='"+name+"' type='text' "+placeholder+click+class_+readonly+" value='"+value+"'"+" validate='v.number50' />";
		}else if("textnum50"==edit.type){
			tdHtml=tdHtml+ "<input index='"+index+"' name='"+name+"' type='text' "+placeholder+click+class_+readonly+" value='"+value+"'"+" validate='v.number' />";
		}else if("number0-24"==edit.type){
            tdHtml=tdHtml+ "<input index='"+index+"' name='"+name+"' type='text' "+placeholder+click+class_+readonly+" value='"+value+"'"+" validate='v.number0-24' />";
        }else if("number0-100"==edit.type){
            tdHtml=tdHtml+ "<input index='"+index+"' name='"+name+"' type='text' "+placeholder+click+class_+readonly+" value='"+value+"'"+" validate='v.number0-100' />";
        }else if("textarea"==edit.type){
			tdHtml=tdHtml+ "<textarea class='citic-text-ast' "+click+class_+" name='"+name+"'>"+value+"</textarea>";
		}else if("select"==edit.type){
			tdHtml=tdHtml+ selectHandle(edit,name,value);
		}
		return tdHtml+"</div>";
	}
	/**
	 * 下拉处理 
	 */
	function selectHandle(edit,name,text){
		var select="<select name='"+name+"'>";
		if(edit.data){
			for(var i=0;i<edit.data.length;i++){
				select+="<option value='"+edit.data[i][edit.value]+"'"+(text==edit.data[i][edit.value]?"selected":"")+">"+edit.data[i][edit.text]+"</option>";
			}
		}else if(edit.url){
			baseAjaxJsonp2(edit.url,{},function(data){
				for(var i=0;i<data.length;i++){
					select+="<option value='"+data[i][edit.value]+"'"+(text==data[i][edit.value]?"selected":"")+">"+data[i][edit.text]+"</option>";
				}
			},"async");
		}
		select+="</select>";
		return select;
	}
	/**
	 * 结束编辑
	 */
	function endEditorTb(id,index){ 
		var tr=jq("#"+id).find("tr[index='"+index+"']");
		if(tr.find('input').length<=0 && tr.find('textarea').length<=0){
			return false;
		}
		initMytable[id].data['rows'][index]["edting"]=false;
		
		var config=initMytable[id];
		var columns=config.columns;
		for(var i=0;i<columns.length;i++){
			if(columns[i].edit&&columns[i].edit.type){
				var td=tr.find("td[field='"+columns[i].field+"']");
				var text=td.find("[name='"+columns[i].field+"']").val();
				if(columns[i].fvalue){
					initMytable[id].data[index][columns[i].fvalue]=text;
					td.html("<div class='mytable-column-div'>"+td.find("[name='"+columns[i].field+"'] option:selected").text()+"</div>");
				}else{
					initMytable[id].data[index][columns[i].field]=text;
					td.html("<div class='mytable-column-div'>"+text+"</div>");
				}
			}
		}
	}
	/**
	 * 增加行
	 */
	function appenRowTb(id,row){
		var data=initMytable[id].data;
		var length=data.rows.length;
		jq("#"+id +" .noDataTd").remove();
		jq("#"+id +" tbody").append(initMytableRow(length,id,row,initMytable[id].columns));
		initMytable[id].data.total++;
		initMytable[id].data.rows[length]=row;
		initMytableEvent(id,initMytable[id]);
		return length;
	}
	/**
	 * 新增并编辑
	 */
	function appendAndEditor(id,row){
		beginEditorTb(id,appenRowTb(id,row));
	}
	/**
	 * 增加行
	 */
	function delRowTb(id,index){
		initMytable[id].data['rows'][index]["edting"]=false;
		var data=initMytable[id].data;
		var length=data.rows.length;
		var new_data={total:0,rows:[]};
		for(var i=0;i<length;i++){
			if(i!=index){
				endEditorTb(id,i);
				if(initMytable[id].data['rows'][i]["edting"]){
					initMytable[id].data['rows'][new_data.rows.length]["edting"]=true;
				}
				new_data.rows[new_data.rows.length]=data.rows[i];
			}
		}
		new_data["total"]=new_data.rows.length;
		initMytable[id].data=new_data;
		initMytable(id,initMytable[id],true);
	}
	/**
	 * 加载数据
	 */
	function load(id,data){
		if(data&&data.length){
			data={rows:data,total:data.length};
		}
		initMytable[id].data=data;
		initDataAndEvent(id,initMytable[id]);
	}
	jq.fn.TaskMytable=function(o,p){
		if(typeof o == 'object'){
			initMytable(this.selector.substr(1),o);
		}else if(typeof o == 'string'){
			var i=this.selector.indexOf("#");
			var id=this.selector.substr(i).replace("#","");
			if("beginEditor"==o){
				beginEditorTb(id,p);
			}else if("endEditor"==o){
				endEditorTb(id,p);
			}else if("appenRow"==o){
				return appenRowTb(id,p);
			}else if("appenRowAndEditor"==o){
				appendAndEditor(id,p);
			}else if("getData"==o){
				return initMytable[id].data;
			}else if("delRow"==o){
				delRowTb(id,p);
			}else if("getSelectedIndex"==o){
				return $(this).find("tr.mytable-selected").attr("index");
			}else if("delSelectedRow"==o){
				delRowTb(id,$(this).find("tr.mytable-selected").attr("index"));
			}else if("refresh"==o){
				refresh(id,p); 
			}else if("load"==o){
				load(id,p); 
			}
		}
	};
})(jQuery);