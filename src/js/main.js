//Global elements
var mainContainer = $(".main-container");

var PageRouter = {};

var timelineFixer = {};

var timelineWidgetExpand = {};

var selectedWidgets = [];

window.onload = init;

function init(){
  $('.btn-active').addClass('hide');
}

PageRouter.clearMainContent = function(){
  $(mainContainer).children().addClass('hide');
}

//First screen
PageRouter.loadFirstScreen = function(e){
  $('.text').removeClass('hide');
  $(e).find('.selected').addClass('selected-animate');
  $(e).find('.btn-container').css('background-color','#ededed');
  $(e).find('.btn-container .content-contain p').css('font-weight', '600');
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
  PageRouter.loadFirstScreen(this);
});

$('.text-two').click(function(){
  PageRouter.clearMainContent();
  PageRouter.loadWidgetScreen();
});

$('.widget-btn').click(function(){
  PageRouter.clearMainContent();
  PageRouter.loadPlanScreen();
});

/*$('.btn').click(function(){
  $('.btn-active').addClass('hide');
  $(this).find(".btn-active").removeClass('hide');
});*/

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

var socket = io();

// handles adding widgets to screen
socket.on('button clicked', function (data){
  console.log(data);
  $widget = $('.widget.' + data);
  // if object does not exist, create it
  if ( $widget.length === 0) {
    // add the new html
    $('.widget-scroll').append( createWidget(data) );
    // add the active class to animate in
    // * FIXME: For some reason
    // * the animation is broken
    // * when you call addClass alone.
    // * Wrapping it in the setTimeout
    // * should be just a temporary fix
    setTimeout(function(){
      $('.widget.' + data).addClass('active');
    }, 1);
  // else remove it
  } else {
    $widget.removeClass('active'); //begin the animation
    // delay by 300ms before removing
    setTimeout(function(){
      $widget.remove();
    }, 300);
  }
});

function createWidget (name) {
  var html = '';
  switch (name) {
    case 'food':
      html =  '<div class="widget food">';
      html += ' <div class="icon"></div>';
      html += '  <div class="content">';
      html += '    <h1>Food Journal</h1>';
      html += '    <p class="tags">Food Log, Calorie Counter, Personalized Plan</p>';
      html += '    <p class="description">Personalize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.</p>';
      html += ' </div>';
      html += '</div>';
      break;

    case 'bloodPressure':
      html =  '<div class="widget bloodPressure">';
      html += '  <div class="icon"></div>';
      html += '  <div class="content">';
      html += '    <h1 class="title">Blood Pressure</h1>';
      html += '    <p class="tags">Monitor and record blood pressure reading</p>';
      html += '  </div>';
      html += '</div>';
      break;

    default:
      break;
  }

  return html;
}

// Insert Leap Here


Leap.loop(function(frame){
  // Leap Update Loop
  
  // Exit loop if no hand in view
  if(frame.hands.length < 1) return;
}).use('boneHand', {
  targetEl: $("#handModel-holder").get(0),
  arm: true
});;
