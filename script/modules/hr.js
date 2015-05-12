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
})(jQuery, $(window), $(document), $('html, body'));