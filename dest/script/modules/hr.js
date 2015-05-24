(function($, win, doc, root){
	var mainWrapper = $('#mainWrapper');
	var navBar = $('#navBar');
	var navBarTop = navBar.offset().top;
	
	var targetArr = [];
	navBar.find('a').each(function(){
		var targetDom = $($(this).attr('href'));
		targetArr.push({
			top: targetDom.offset().top,
			tag: $(this),
			targetDom: targetDom
		})
	});
	navBar.on('click', 'a', function(){
		var targetDom = $($(this).attr('href'));
		//location.hash = this.href;
		root.stop(true, false).animate({
			scrollTop: targetDom.offset().top - 52
		}, 200);
		return false;
	});

	//查看档期
	$('#showTimeBtn').on('click', function(){
		var _this = this;
		var ShowPop = new showPop();
		this.timer = setTimeout(function(){
			ShowPop.remove();
		}, 5000);
		ShowPop.pop.mcalendar({
			firstDay: 1,
			weeks:  ["日", "一", "二", "三", "四", "五", "六"],
			todayTemp: '今',
			monthChange: function(year, month) {
				//月份改变触发ajax请求，处理渲染
				ShowPop.pop.find('#p-2015-05-21').addClass('current')
				//monthChange(year, month);
			}
		});
		ShowPop.pop.css({
			left: $(this).offset().left,
			top: $(this).offset().top + 45
		});
		ShowPop.pop.hover(function(){
			clearTimeout(_this.timer);
		}, function(){
			_this.timer = setTimeout(function(){
				ShowPop.remove();
			}, 3000);
		});
	});

	win.on('scroll', function(){
		var top = win.scrollTop();
		$('title').text(top)
		if(top > navBarTop){
			mainWrapper.addClass('nav-bar-float');

			for(var i = 0; i < targetArr.length; i ++){
				if(targetArr[i + 1]){
					if(top > targetArr[i].top && top < targetArr[i + 1].top){
						targetArr[i].tag.addClass('on').siblings().removeClass('on');
						break;
					} else if(top > targetArr[targetArr.length-1].top) {
						targetArr[targetArr.length-1].tag.addClass('on').siblings().removeClass('on');
					}
				}
				
			}
		} else {
			mainWrapper.removeClass('nav-bar-float');
			targetArr[0].tag.addClass('on').siblings().removeClass('on');
		}
	}).scroll();

	//简易弹出层
	function showPop(opts){
		opts = $.extend({
			afterShow: null
		}, opts);
		var pop = $('#lightbox');
		if(!pop.length)
			pop = $('<div class="lightbox" id="lightbox"></div>').appendTo('body');
		return {
			close: function(){
				pop.hide();
			},
			remove: function(){
				pop.remove();
			},
			show: function(){
				pop.show();
			},
			pop: pop
		}
	}
})(jQuery, $(window), $(document), $('html, body'));