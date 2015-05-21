/*
@ project:wedding
@ date:2015-05-21
@ author:Paul Xia
*/
!function(a,b,c,d){var e=a("#mainWrapper"),f=a("#navBar"),g=f.offset().top,h=[];f.find("a").each(function(){var b=a(a(this).attr("href"));h.push({top:b.offset().top,tag:a(this),targetDom:b})}),f.on("click","a",function(){var b=a(a(this).attr("href"));return d.stop(!0,!1).animate({scrollTop:b.offset().top-52},200),!1}),b.on("scroll",function(){var c=b.scrollTop();if(a("title").text(c),c>g){e.addClass("nav-bar-float");for(var d=0;d<h.length;d++)if(h[d+1]){if(c>h[d].top&&c<h[d+1].top){h[d].tag.addClass("on").siblings().removeClass("on");break}c>h[h.length-1].top&&h[h.length-1].tag.addClass("on").siblings().removeClass("on")}}else e.removeClass("nav-bar-float"),h[0].tag.addClass("on").siblings().removeClass("on")}).scroll()}(jQuery,$(window),$(document),$("html, body"));