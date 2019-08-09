$(function(){
    
    $("#branch").hide();
    $("#gittag").hide();
    var type= $.getUrlParam("pageType");
    initSelectData(type);
    //下拉菜单select2
    $("select").select2();

    initVlidate($("#codeBaseForm"));
    // 查看详情
    if(type=="detail"){
        $('#codeBaseForm input').attr("readonly", "readonly");
        $('#codeBaseForm select').attr("disabled", "true");
        $("#save").hide();
    }
    if(type=="detail" || type=="update"){
        $("#branch").hide();
        $("#gittag").hide();
        /*var id= $.getUrlParam("id");
        initCodeBase(id, type);*/
    }
    
    $('#type').on('change', function (e) {
        if($("#type").val()=="04"){
            $("#branch").show();
            $("#gittag").show();
        } else {
            $("#branch").hide();
            $("#gittag").hide();
        }
    });
    
    $('#scm').on('change', function (e) {
        if($("#scm").val()=="01"){
            $("#typeTr").show();
            $("#urlTr").show();
            //$("#branch").show();
            //$("#gittag").show();
            $("#type").val(" ").trigger("change");
        } else {
            $("#typeTr").hide();
            $("#urlTr").hide();
            $("#branch").hide();
            $("#gittag").hide();
        }
    });
    

    $("#save").click(function () {
        var url=contextpath+"codeBase/save";
        var result=vlidate($("#codeBaseForm"));
        if(result){
            baseAjaxJsonp(url, $("#codeBaseForm").serialize(), function(data){
                if(data.success){
                 alert("操作成功!", function(){
                         $("#close").click();
                     });
                }else{
                	alert(data.message);
                }
            });
        }else{
            alert("所保存内容不全或不符合条件");
        }
      
    });
    $("#close").click(function () {
        parent.closeCurrentTab(parent);
    });
});
var cisFlowInfo = new Object();
var select2Config = function(rows, tempSelectFun, tempResultFun){
    var obj = {
        data:rows,
        templateSelection: tempSelectFun,
        templateResult : tempResultFun
    }
    return obj;
}
function initSelectData(type){
    baseAjaxJsonp(contextpath + 'cis_flow/queryAllAppInfo', null, function(data){
        var tempResultFun = function(item){
            return item.text;
        };
        var codeRows = $.map(data.result, function (obj) {
            obj.text = obj.appName;
            return obj;
        });
        var codeBaseTempSelectFun = function(item){
            if(item.id!="" ){
                for(var key in item){
                    $("input[name='appInfo." + key + "']").val(item[key]);
                }
                $("input[name=appId]").val(item.id);
                var result=item.systemInfo;
                for(var p in result){
                    $("#systemName").val(result.systemName);
                }
            }
            return item.text;
        };
        $("#appInfo").select2(select2Config(codeRows, codeBaseTempSelectFun, tempResultFun));
        var id= $.getUrlParam("id");
        initCodeBase(id, type);
    });
}
function initCodeBase(id, type){
    
    baseAjaxJsonp(contextpath+"codeBase/findOne", {id:id}, function(data){
        if(data.success){
            $("#codeBaseForm").setform(data.result);
            $("#appInfo").val(data.result.appId);
            $("select").trigger("change");
           
            if(data.result.type=="04"){
                $("#branch").show();
                $("#gittag").show();
            }
            if(data.result.scm=="01"||data.result.scm==null){
                $("#typeTr").show();
                $("#urlTr").show();
            }
            if(type=="detail"){
                $("select").select2({"disabled":true});
            }
        }else{
            alert(data.message);
        }
    });
}
