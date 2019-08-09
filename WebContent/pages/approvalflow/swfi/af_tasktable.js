(function(jq){
	/**
	 * 初始化表格的头
	 */
	function initMytableHeader(columns){
		var header='<thead><tr class="mytable-header">';
		for(var i=0;i<columns.length;i++){
			header=header+"<th  class='mytable-row-th' style='width:"+(columns[i].width||10)+"%'>"+columns[i].title+"</th>";
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
			datarow=datarow+"<td field='"+field+"' class='mytable-row-td'><div class='mytable-column-div'>"+formatter(i,columns[j],data,field)+"</div></td>";
		}
	  return datarow+'</tr>';
	}
	/**
	 * 数据格式化
	 */
	function formatter(index,column,data,field){
		var value="";
		if(column.formatter){
			value=column.formatter(index,data[field],data,field);
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
		jq("tr[id^='"+id+"-rows-']").unbind("click");
		jq("tr[id^='"+id+"-rows-']").click(function(){//单选 事件
			var selected=jq("#"+id+" .mytable-selected");
			var index=selected.attr("index");
			if((index%2)>0){
				selected.attr("class","mytable-row mytable-qishu");
			}else{
				selected.attr("class","mytable-row");
			}
			jq(this).attr("class","mytable-selected");
			index=jq(this).attr("index");
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
		if(config.columns!=undefined){
			initMytable[id]=config;
			var start='<div class="mytable-view"><table id="'+id+'_table" style="width:100%;" border="0" cellspacing="0" cellpadding="0">';
			var datarows="<tr id='"+id+"_loading' ><td class='noDataTd' colspan='"+config.columns.length+"'>正在努力查找数据....</td></tr>";
			var end='</table></div>';
			jq("#"+id).html(start+initMytableHeader(config.columns)+datarows+end);
			if(config.data&&config.data.rows){
				initDataAndEvent(id,config);
			}else if(config.url&&!isurl){
				findData(id,config,function(data){
					config.data=(data||{rows:[],total:0});
					initDataAndEvent(id,config);
				});
			}
		}
	}

	/**
	 * 刷新
	 */
	function refresh(id,param){
		$("#"+id+" tr[index]").remove();
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
	/**
	 * 初始化数据和事件
	 */
	function initDataAndEvent(id,config){
		datarows=getDataRowTr(id,config.data,config.columns);
		if(datarows==""){
			datarows="<tr index='index' ><td class='noDataTd' colspan='"+config.columns.length+"'>没有查到可用的数据</td></tr>";
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
		baseAjax(config.url,config.queryParams,function(data){
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
		if(initMytable[id].data['rows'][index]&&initMytable[id].data['rows'][index]["edting"]){
			return false;
		}
		initMytable[id].data['rows'][index]["edting"]=true;
		var config=initMytable[id];
		var columns=config.columns;
		for(var i=0;i<columns.length;i++){
			if(columns[i].edit&&columns[i].edit.type){
				var td=tr.find("td[field='"+columns[i].field+"']");
				var tdvalue=td.text();
				td.html(setMyTableEditor(columns[i].edit,columns[i].field,tdvalue));
				if(columns[i].edit.type=="select"){
					$("#"+id +" select").select2();
				}
			}
		}
	}
	/**
	 * 设置编辑
	 */
	function setMyTableEditor(edit,name,value){
		var tdHtml="<div style='min-width:50px;max-width:100%'>";
		value=value=="--"?"":value;
		if("text"==edit.type){
			tdHtml=tdHtml+ "<input style='width:"+(edit.width||90)+"px;text-align:center;line-height: 16px;height: 16px;margin-bottom: 0px;' name='"+name+"' type='text' value='"+value+"'/>";
		}else if("textarea"==edit.type){
			tdHtml=tdHtml+ "<textarea style='width:99%;height:99%;' name='"+name+"'>"+value+"</textarea>";
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
				select+="<option value='"+edit.data[i][edit.value]+"'"+(text==edit.data[i][edit.text]?"selected":"")+">"+edit.data[i][edit.text]+"</option>";
			}
		}else if(edit.url){
			baseAjax(edit.url,{},function(data){
				for(var i=0;i<data.length;i++){
					select+="<option value='"+data[i][edit.value]+"'"+(text==data[i][edit.text]?"selected":"")+">"+data[i][edit.text]+"</option>";
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
		if(!initMytable[id].data['rows'][index]||!initMytable[id].data['rows'][index]["edting"]){
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
					td.html("<div style='min-width:50px;max-width:100%'>"+td.find("[name='"+columns[i].field+"'] option:selected").text()+"</div>");
				}else{
					initMytable[id].data[index][columns[i].field]=text;
					td.html("<div style='min-width:50px;max-width:100%'>"+text+"</div>");
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
		$("#"+id+"_table tr[index='index']").hide();
		$("#"+id+" tr[index='index']").hide();
		jq("#"+id +" tbody").append(initMytableRow(length,id,row,initMytable[id].columns));
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
	 * 删除行
	 */
	function delRowTb(id,index){
		var data=initMytable[id].data;
		var length=data.rows.length;
		var new_data={total:0,rows:[]};
		for(var i=0;i<length;i++){
			if(i!=index){
				new_data.rows[new_data.rows.length]=data.rows[i];
			}
		}
		new_data["total"]=new_data.rows.length;
		initMytable[id].data=new_data;
		initMytable(id,initMytable[id],true);
	}
	
	jq.fn.TaskMytable=function(o,p){
		if(typeof o == 'object'){
			initMytable(this.selector.substr(1),o);
		}else if(typeof o == 'string'){
			if("beginEditor"==o){
				beginEditorTb(this.selector.substr(1),p);
			}else if("endEditor"==o){
				endEditorTb(this.selector.substr(1),p);
			}else if("appenRow"==o){
				return appenRowTb(this.selector.substr(1),p);
			}else if("appenRowAndEditor"==o){
				appendAndEditor(this.selector.substr(1),p);
			}else if("getData"==o){
				return initMytable[this.selector.substr(1)].data;
			}else if("delRow"==o){
				delRowTb(this.selector.substr(1),p);
			}else if("getSelectedIndex"==o){
				return $(this).find("tr.mytable-selected").attr("index");
			}else if("delSelectedRow"==o){
				delRowTb(this.selector.substr(1),$(this).find("tr.mytable-selected").attr("index"));
			}else if("refresh"==o){
				refresh(this.selector.substr(1),p); 
			}
		}
	};
})(jQuery);