//Global elements
var mainContainer = $(".main-container");

var PageRouter = {};

var timelineFixer = {};

var timelineWidgetExpand = {};

window.onload = init;

function init(){
    $('.btn-active').addClass('hide');
}

PageRouter.clearMainContent = function(){
    $(mainContainer).children().addClass('hide');
}

//First screen
PageRouter.loadFirstScreen = function(){
    $('.text').removeClass('hide');
    $('.selected').addClass('selected-animate');
    $('.btn-container').css('background-color','#ededed');
    $('.btn p').css('font-weight', '600');
}

//Second Screen
PageRouter.loadWidgetScreen = function(){
    $('.widget-holder').removeClass('hide');
}

//Plan Screen
PageRouter.loadPlanScreen = function(){
    $('.plan-screen').removeClass('hide');
    //timelineFixer.adjust();
}

//Expand food journal
timelineWidgetExpand.expandFoodWidget = function(e){
    $(e).find('.unexpanded-widget').addClass('hide');
    $(e).css({
        'width':'400px',
        'height': '500px',
        'cursor': 'default',
    });
    $(e).find('.expanded-widget').removeClass('hide');
}

timelineWidgetExpand.search = function(e){
    //$(e).parent().removeClass('hide');
    $(e).parent().parent().find('.list').removeClass('hide');
    //console.log($(e).find('.list'));
}

timelineWidgetExpand.close = function(){
    /*$(e).closest('.expanded-widget').addClass('hide');
    $(e).closest('.expanded-widget').find('.list').addClass('hide');
    $(e).parent().parent().css({
        'width':'296px',
        'height':'160px',
        'cursor':'pointer',
    });
    $(e).closest('.module').find('.unexpanded-widget').removeClass('hide');*/
    $('.expanded-widget').addClass('hide');
    $('.expanded-widget').find('.list').addClass('hide');
    $('.module').css({
        'width':'296px',
        'height':'160px',
        'cursor':'pointer',
    });
    $('.module').find('.unexpanded-widget').removeClass('hide');
}






//hide all
$(mainContainer).children().addClass('hide');

//Nothing on the screen
$('.regimen').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadFirstScreen();
});

$('.text-two').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadWidgetScreen();
});

$('.widget-btn').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadPlanScreen();
});

$('.btn').click(function(){
    $('.btn-active').addClass('hide');
    $(this).find(".btn-active").removeClass('hide');
});

$('.module').click(function(){
    timelineWidgetExpand.close();
    timelineWidgetExpand.expandFoodWidget(this);
});

$('.searchbox').click(function(){
    timelineWidgetExpand.search(this);
});

$('.cancel').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    timelineWidgetExpand.close(this);
});
