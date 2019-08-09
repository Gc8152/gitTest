/**
 * bootstrp-table分页选择数据的全量获取及选中回显.
 * 
 * 使用方法
 * 一、在options中设置
 * recallSelect:true,
 * uniqueId : "数据主键"
 * 二、取值方法
 * var selects=table.bootstrapTable("getRecallSelections");
 * @param jq
 */

(function(jq){
	var BootstrapTable = jq.fn.bootstrapTable.Constructor;
	var index=$.fn.bootstrapTable.methods.length;
	$.fn.bootstrapTable.methods[index]="getRecallSelections";
	/**
	 * 获取所有被记录的数据
	 * @param
	 */
	BootstrapTable.prototype.getRecallSelections=function(){
		var map=(this.options.selectionMaps||{});
		var selects=this.getSelections();
		for(var i=0;i<selects.length;i++){
			map[selects[i][this.options.uniqueId]]=selects[i];
		}
		this.options.selectionMaps=map;
		
		if(this.options.selectionMaps){
			var array=[];
			jq.each(this.options.selectionMaps,function(k,v){
				if(v){
					array[array.length]=v;
				}
			});
			return array;
		}else{
			return [];
		}
	};
	
	BootstrapTable.prototype.updatePagination = function(b) {
		if(this.options.recallSelect&&this.options.uniqueId){//是否记忆选择好的数据 uniqueId
			var uniqueId=this.options.uniqueId;
			var map=(this.options.selectionMaps||{});
			var selects=this.getSelections();
			for(var i=0;i<selects.length;i++){
				map[selects[i][this.options.uniqueId]]=selects[i];
			}
			this.options.selectionMaps=map;
			var $el=this.$el;
			if(this.options.onLoadSuccess){
				var success=this.options.onLoadSuccess;
				this.options.onLoadSuccess=function(data){
					success(data);
					recallCheck(map,uniqueId,data,$el);
				};
			}else{
				this.options.onLoadSuccess=function(data){
					recallCheck(map,uniqueId,data,$el);
				};
			}
			if(this.options.onUncheck){
				var onuncheck=this.options.onUncheck;
				this.options.onUncheck=function(data){
					onuncheck(data);
					map[data[uniqueId]]=null;
				};
			}else{
				this.options.onUncheck=function(data){
					map[data[uniqueId]]=null;
				};
			}
			if(this.options.onUncheckAll){
				var onuncheck=this.options.onUncheckAll;
				this.options.onUncheckAll=function(data){
					onuncheck(data);
					for(var i=0;i<data.length;i++){
						map[data[i][uniqueId]]=null;
					}
				};
			}else{
				this.options.onUncheckAll=function(data){
					for(var i=0;i<data.length;i++){
						map[data[i][uniqueId]]=null;
					}
				};
			}
		}
        b && jq(b.currentTarget).hasClass("disabled") || (this.options.maintainSelected || this.resetRows(),
        this.initPagination(),
        "server" === this.options.sidePagination ? this.initServer() : this.initBody(),
        this.trigger("page-change", this.options.pageNumber, this.options.pageSize));
    };
    /**
     * 记录数据选中操作
     */
    function recallCheck(map,uniqueId,data,btTable){
    	if(data&&data.rows&&data.rows.length>0){
    		for(var i=0;i<data.rows.length;i++){
    			if(map[data.rows[i][uniqueId]]){
    				btTable.bootstrapTable("check",i);
    			}
    		}
    	}
    }
    
})(jQuery);