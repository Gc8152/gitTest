//初始化事件
inittest_defectTable();

function inittest_defectTable() {
    var $page = getCurrentPageObj(); //当前页
    autoInitSelect($page); //初始化下拉选
    var formObj = $page.find("#defectForm"); //表单对象
    var initTableCall = getMillisecond(); //table回调方法名
    var test_defectTable = $page.find("[tb='test_defectTable']");

    //初始化列表
    inittest_defectTable2();
    //重置按钮
    $page.find("[name='resetPrj']").click(function() {
        $page.find("table input").val("");
        $page.find("select").val(" ").select2();
    });


    //初始化表
    function initprojectTable2() {
        var queryParams = function(params) {
            var temp = {
                limit: params.limit, // 页面大小
                offset: params.offset
                    // 页码
            };
            return temp;	
        };
        test_defectTable.bootstrapTable({
            //url : dev_construction+"requirement_change/queryReqChangeList.asp?SID=" + SID + "&call=" + initTableCall,
            url: '',
            method: 'get', // 请求方式（*）
            striped: false, // 是否显示行间隔色
            cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            sortable: true, // 是否启用排序
            sortOrder: "asc", // 排序方式
            queryParams: queryParams, // 传递参数（*）
            sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pagination: true, // 是否显示分页（*）
            pageList: [5, 10, 15], // 可供选择的每页的行数（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: 5, // 每页的记录行数（*）
            clickToSelect: true, // 是否启用点击选中行
            // height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: " ", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            singleSelect: true, // 复选框单选
            jsonpCallback: initTableCall,
            onLoadSuccess: function(data) {
                gaveInfo();
            },
            columns : [{
                field: 'ORDER_ID',
                title: '序号',
                align: "center",
                width: "5%",
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
				field : "SUMMARY",
				title : "缺陷摘要",
				width : "6%",
				align : "center"
			}, {
				field : "FUNCPOINT_NAME",
				title : "功能点",
				width : "7%",
				align : "center"
			}, {
				field : "MODULE_NAME",
				title : "模块名称",
				width : "7%",
				align : "center"
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				width : "10%",
				align : "center"
			}, {
				field : "TEST_TYPE",
				title : "测试类型",
				width : "8%",
				align : "center"
			}, {
				field : "TEST_NUM",
				title : "测试轮次",
				width : "8%",
				align : "center"
			}, {
				field : "CREATE_TIME",
				title : "缺陷提出时间",
				width : "7%",
				align : "center"
			}, {
				field : "CREATE_MAN",
				title : "提出人",
				width : "8%",
				align : "center"
			}, {
				field : "DEFECT_STATE",
				title : "缺陷状态",
				width : "8%",
				align : "center"
			}, {
				field : "SEVERITY_GRADE",
				title : "严重程度",
				width : "10%",
				align : "center",
			}, {
				field : "PRIORITY_LEVEL",
				title : "优先级",
				width : "8%",
				align : "center",
			}, {
				field : "DISPOSE_MAN",
				title : "处理人",
				width : "8%",
				align : "center"
			}, {
				field : "CLOSING_TIME",
				title : "缺陷关闭时间",
				width : "8%",
				align : "center"
			}]
        });
    }
    
}