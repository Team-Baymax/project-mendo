//Global elements
var mainContainer = $(".main-container");

//Nothing on the screen
$('.regimen').click(function(){
    
});

//First screen
$(".text-two")

$('.text-two').click(function(){
    clearMainContent();
    loadWidgetScreen();
});

$('.btn').click(function(){
    $('.btn').find('.btn-active').css('visibility', 'hidden');
    $(this).find(".btn-active").css("visibility","visible");
});

function clearMainContent(){
    $(mainContainer).children().css("display","none");
}

//Second Screen
function loadWidgetScreen(){
    /*var widgetHolder = $(div);
    widgetHolder.addClass("widget-holder");*/
    $('.widget-holder').css('display', 'block');
}

/*
<div class="widget-holder">
                <div class="widget-bg">
                    <div class="widget">
                        <div class="img"></div>
                        <div class="content">
                            <p>Blah Blah Blah</p>
                        </div>
                    </div>
                    
                    <div class="widget-btn"><p>Done</p></div>
                </div>
            </div>*/