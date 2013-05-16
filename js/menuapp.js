
var menuStatus;
var App = new Object();

App = {
    splashScreenDuration: 5000,
    init: function() {
	
	  $("a.showMenu").click(function(){
		  $('#menu ul li.ui-li').removeClass('ui-corner-top');
	$('#menu ul').removeClass('ui-corner-all');
	$('#menu label, #menu span.ui-btn-inner').removeClass('ui-btn-corner-all');
	$('#menu ul li[data-role="list-divider"]').css('text-indent', '10px')	
	  $("#menu ul").niceScroll({
										  touchbehavior:false, 
										  cursorcolor:"#999", 
										  cursoropacitymax:0.6, 
										  cursorwidth:11,
										  cursorborder:"1px solid #333",
										  cursorborderradius:"6px",
										  background:"transparent",
										  autohidemode:"scroll"
	  });
            
	  if(menuStatus != true){
		$("#menu").animate({left: 0 + 'px'}, 'fast');
		$('a.showMenu').animate({left: 184 + 'px'}, 'fast');
	  menuStatus = true;
		return false;
	  } else {
		$("#menu").animate({left: -180 + 'px'}, 'fast');
		$('a.showMenu').animate({left: 2 + 'px'}, 'fast');
	  menuStatus = false;
		return false;
	  }
	  });
	  
	  setTimeout(function() {
	  $("#splash").fadeOut(800);
	  }, App.splashScreenDuration);
			
	}
	
}
	
//App.init();

$(App.init);

$(document).ready(function(){
	
var docHeight = $(document).height() - 45;

$('#menu').css('height', docHeight + 'px');
$('#menu ul').css('height', docHeight - 50 + 'px');

$('#carmanager .wrapper').css('height', $(document).height() + 'px')

//$('input[value="Hot Fuzz"]')

});
