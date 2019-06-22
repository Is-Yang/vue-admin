UE.registerUI('135editor',function(editor,uiName){
    var dialog = new UE.ui.Dialog({
        iframeUrl: editor.options.UEDITOR_HOME_URL+'dialogs/135editor/135EditorDialogPage.html',
        editor:editor,
        name:uiName,
        title:"你已进入高级编辑模式"
    });
	
	//dialog.onok = function (){};
    dialog.oncancel = function () {
		/*
		if(confirm('是否确认退出编辑，退出后内容将无法恢复，请自行保存内容')){
			$('#floatBar').show();
			$('.sidebar-right').css('right', 30);
		}else{
			return false;
		}*/
		$('#floatBar').show();
		$('.sidebar-right').css('right', 30).css('z-index',1);
    };
	
    dialog.fullscreen = true;
    dialog.draggable = false;
    var btn = new UE.ui.Button({
        name:'btn-dialog-' + uiName,
        className:'edui-for-135editor',
        title:'高级编辑',
        onclick:function () {
			$('#floatBar').hide();
			$(document).scrollTop(500);
            dialog.render();
            dialog.open();
			$('.sidebar-right').css('z-index',1006).css('right', document.body.scrollWidth-document.body.clientWidth);
        }
    });
    return btn;
},undefined);
// 修改最后的undefined参数为数字序号，比如5，可调整135编辑器按钮的顺序。默认出现在最后面