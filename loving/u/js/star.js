$(document).ready(function(){
	_G = {
		pc: 1,
		pn: 500,
		fr: 1
	}
	var w = $('body').width();
	var l = parseInt(w)/2 - 200;
	$('.inner').css('left',l+'px');
	$('button.yeap').click(function(){
		$('.init').addClass('animated flip').children().remove();//.remove();
		$('.ansY1').css('display','block').appendTo($('.init'));
		function heartR(t){
			return (Math.sin(t)*Math.sqrt(Math.abs(Math.cos(t))))*Math.pow((Math.sin(t)+(7/5)), -1) - 2*Math.sin(t) + 2;
		}
		function point(x,y){
			var ox = $('body').width()/2;
			var oy = 100;
			var px = ox + x;
			var py = oy + y;
			$('<strong class="heartPoint">Love</strong>').css({'position':'absolute','left':px+'px','top':py+'px'}).appendTo($('.skyfall'));
		}
		function drawHeart(){
			if(_G.pc === _G.pn){clearInterval(draw);}
			var t = -Math.PI+(_G.pc- 1)*(2*Math.PI)/_G.pn;
			var r = heartR(t);
			var x = r*Math.cos(t);
			var y = -r*Math.sin(t);
			point(x*70,y*70);
			_G.pc++;
		}
		function displayPoem(){
			switch(_G.fr){
				case 1:{$('.init').addClass('nimated bounceOutUp');}break;
				case 23:{//do nothing
				}break;
				case 24:{
					$('.skyfall').stop().animate({top:0},{queue:false, duration:3000, easing: 'easeOutBounce'});
					var r0 = heartR(270/180*Math.PI);
					var loveX = $('body').width()/2;
					var loveY = 100+r0*70;
					$('<strong class="heartPoint">i</strong>').appendTo($('.skyfall')).css({'position':'absolute','left':loveX-15+'px','top':loveY+'px'});
					$('<strong class="heartPoint">you</strong>').appendTo($('.skyfall')).css({'position':'absolute','left':loveX+40+'px','top':loveY+'px'});
				}break;
				case 25:{
					draw = self.setInterval(drawHeart, 10);
				}break;
				case 26:{
					clearInterval(poem);
				}break;
				default:
				{
					$linePre = $('.line'+(_G.fr-1));
					$msgPre  = $('.withLine'+(_G.fr-1));
					$linePre.addClass('animated bounceOutUp').css({'position':'absolute','left':'-1000px'});
					$msgPre.addClass('animated bounceOutUp');
				}
			}
			$lineNo = $('.line'+_G.fr);
			$msgNo  = $('.withLine'+_G.fr);
			$lineNo.show().appendTo($('.entry')).addClass('animated bounceInUp');
			$msgNo.show().appendTo($('body')).addClass('animated bounceInUp');
			_G.fr++;
		}
		var poem=self.setInterval(displayPoem, 3000);
	})
	$('button.nop').click(function(){
		snowStorm.freeze();
		$('.init').addClass('animated bounceOutLeft');//.remove();
		$('.ansNo1').appendTo('.entry').show().addClass('animated bounceIn');
	})
	$('button.ans1btn').click(function(){
		$('.ansNo1').addClass('animated bounceOutLeft');//.remove();
		$('.ansNo2').appendTo('.entry').show().addClass('animated bounceIn');
	})
	$('button.ans2btn').click(function(){
		$('.ansNo2').addClass('animated bounceOutLeft');//.remove();
		$('.ansNo3').appendTo('.entry').css({'left':l-50+'px','display':'block'}).addClass('animated bounceIn');
	})
})
