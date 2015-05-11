# made by marchen
# time at 15/5/4
# index.coffee use by wedding/index.html


###################################
# 首页banner上部轮播特效
###################################
# get jq object
pics = $ '#pics img'
picsNavs = $ '#picsNav li'

picsIndex = 0
timeHandler = null

autoPlay = ->
  pics.fadeOut(500).eq(picsIndex).fadeIn(500)
  picsNavs.removeClass('on').eq(picsIndex).addClass('on')
  if picsIndex > 2
    picsIndex = -1
  picsIndex++
  timeHandler = setTimeout autoPlay, 4000

#start autoPlay
autoPlay()

#picnavs click event
picsNavs.on 'click', ->
  clearTimeout timeHandler
  index = $(this).index()
  picsIndex = index
  autoPlay()


###################################
# 首页banner底部商品展示特效
###################################
# get jq object
navBannerPrev = $ '#nav-banner-bottom-prev'
navBannerNext = $ '#nav-banner-bottom-next'
navBannerContent = $ '#banner-bottom-content'
navBannerIndex = 0
navBannerContentMaxIndex = navBannerContent.find('.box').length

navBannerPrev.click ->
  if navBannerIndex is 0
    return ;
  navBannerIndex--
  navBannerContent.animate({left:-290*navBannerIndex}, 300)

navBannerNext.click ->
  if navBannerIndex is navBannerContentMaxIndex-3
    return ;
  navBannerIndex++
  navBannerContent.animate({left:-290*navBannerIndex}, 300)



###################################
# 首页招投标滚动特效
###################################
navScroll = $ '#nav-bottom-scroll'

navScrollHeight = navScroll.height()
scrollTimeHandler = null

#copy scroll once
navScroll.children().clone().appendTo(navScroll)

startScroll = ->
  moveDis = parseInt(navScroll.css('top'))-1
  if moveDis < -navScrollHeight
    moveDis = 0
  navScroll.css("top", "#{moveDis}px")
  scrollTimeHandler = setTimeout(startScroll, 66);

startScroll()

navScroll.mouseenter ->
  clearTimeout scrollTimeHandler

navScroll.mouseleave ->
  startScroll()

###################################
# 首页婚姻大师导航特效
###################################
titleMenu = $ '.container-bottom-in .menu'
titleMenu.click ->
  menus = $(this).parent().find('.menu')
  index = menus.index($(this))
  menus.removeClass('on').eq(index).addClass('on')
  $(@).parent().siblings('.box').fadeOut(0).eq(index).fadeIn(0)