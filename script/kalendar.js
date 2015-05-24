/**
 * Calendar
 *
 */
(function($) {
  var map = {
    Set: function(key, value) {
      this[key] = value;
    },
    Get: function(key) {
      return this[key];
    },
    Contains: function(key) {
      return this.Get(key) == null ? false : true;
    },
    Remove: function(key) {
      delete this[key];
    }
  };
  /*
   * NCalender 初始化方法
   */
  function init(obj) {
      show(obj);
      // 数据初始化
      var opts = $.data(obj, "mcalendar").options;
      if (opts.data != undefined || opts.data != null) {
        map = opts.data;
        initCalBody(obj);
      }
    }
    /*
     * NCalender 显示方法
     *
     *  @param month 要显示的月份
     */
  function show(obj, month) {
      // 定义calender div
      var cal = $.data(obj, "mcalendar");
      // 定义options
      var opts = cal.options;
      // 内建calendar div
      $(obj).addClass('mcalendar').append('<div class="mcalendar-header">' + '<span class="mcalendar-showtoday"></span>' +  '<div class="mcalendar-td"><span class="mcalendar-title"></span>' + '<a href="#" class="mcalendar-prevmonth" title="上一月">' + opts.prevTxt + '</a>' + '<a href="#" class="mcalendar-nextmonth" title="下一月">' + opts.nextTxt + '</a></div>'
        //+ '<div class="mcalendar-prevyear" title="'+opts.prevYearTxt+'">&lt;&lt;</div>'
        //+ '<div class="mcalendar-nextyear" title="'+opts.nextYearTxt+'">&gt;&gt;</div>'
        + '</div>' + '<div class="mcalendar-body"></div>');
      // 定义mcalendar-prevmonth 和 next 按钮的方法
      $(obj).find(".mcalendar-nextmonth").on('click', function() {
        changeMonth(obj, 1);
        return false;
      });
      $(obj).find(".mcalendar-prevmonth").on('click', function() {
        changeMonth(obj, -1);
        return false;
      });
      $(obj).find('.mcalendar-showtoday').on('click', function() {
        var date = new Date();
        if(opts.month === date.getMonth()+1 && opts.year === date.getFullYear()){
          return false;
        }
        changeMonth(obj)
      });
      // 定义mcalendar-prevyear 和 next 按钮的方法
      // $(obj).find(".mcalendar-nextyear").on('click', function() {
      //   changeYear(obj, 1);
      // });
      // $(obj).find(".mcalendar-prevyear").on('click', function() {
      //   changeYear(obj, -1);
      // });
      // 显示
      changeMonth(obj, 0);
    }
    /*
     * 远程加载数据
     *
     */
  function loadData(obj) {
      var opts = $.data(obj, "mcalendar").options;
      $.ajax({
        url: opts.url,
        data: {
          year: opts.year,
          month: opts.month
        },
        type: 'POST',
        success: function(data) {
          // 本地data信息基础上添加附加data
          for (var date in data) {
            var event = new Array();;
            for (var title in data[date]) {
              if (data[date][title] != "") {
                event.push('<a href="' + data[date][title] + '">' + title + '</a>');
              } else {
                event.push('<span>' + title + '</span>');
              }
            }
            map.Set(date, event);
          }
          initCalBody(obj);
        }
      });
    }
    /*
     * 改变年份
     *
     */
  function changeYear(obj, num) {
      // 获取当前绑定元素data中的月份信息
      var opts = $.data(obj, "mcalendar").options;
      opts.year += num;
      if (opts.url != undefined || opts.url != null) {
        loadData(obj);
      } else {
        initCalBody(obj);
      }
    }
    /*
     * 改变月份
     *
     */
  function changeMonth(obj, num) {
      // 获取当前绑定元素data中的月份信息
      var opts = $.data(obj, "mcalendar").options;
      if (num) {
        opts.month += num;
      } else {
        opts.month = new Date().getMonth() + 1;
        opts.year = new Date().getFullYear();
      }

      if (opts.month > 12) {
        opts.year++;
        opts.month = 1;
      } else {
        if (opts.month < 1) {
          opts.year--;
          opts.month = 12;
        }
      }

      if (opts.url != undefined || opts.url != null) {
        loadData(obj);
      } else {
        initCalBody(obj);
      }
      typeof opts.monthChange === 'function' ? opts.monthChange(opts.year, opts.month) : '';
    }
    /*
     * 日期格式化
     *
     * @param date 日期
     * @returns string
     */
  function formatDate(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
    }
    /*
     * 初始化日历控件的table显示信息
     *
     */
  function initCalBody(obj) {
      var thisDate = new Date();
      var opts = $.data(obj, "mcalendar").options;
      // 设置calender header中的显示文字信息
      // $(obj).find(".mcalendar-title span").html(opts.months[opts.month - 1] + "/" + opts.year);
      var headText = opts.headTodayTemp.replace('{year}',thisDate.getFullYear()).replace('{month}', thisDate.getMonth() + 1).replace('{day}', thisDate.getDate());
      $(obj).find('.mcalendar-showtoday').text(headText).attr('title', '回到今天');
      $(obj).find(".mcalendar-title").text(opts.year + '年' + opts.month + '月');
      // 获取日历控件的body
      var body = $(obj).find("div.mcalendar-body");
      // 如果日历body中已经存在table 先移除
      body.find(">table").remove();
      // 生成table
      var table = $("<table class=\"mcalendar-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><thead></thead><tbody></tbody></table>").prependTo(body);
      // 生成首行的星期信息，通过opts的firstDay参数确定第一项显示星期几.同时周六和周日添加特别样式
      var tr = $("<tr></tr>").appendTo(table.find("thead"));
      for (var i = opts.firstDay; i < opts.weeks.length; i++) {
        tr.append("<th " + ((i == 0 || i == 6) ? "class=\"mcalendar-th-ms\"" : "") + ">" + opts.weeks[i] + "</th>");
      }
      for (var i = 0; i < opts.firstDay; i++) {
        tr.append("<th " + ((i == 0 || i == 6) ? "class=\"mcalendar-th-ms\"" : "") + ">" + opts.weeks[i] + "</th>");
      }
      // 生成需要进行填充的 7*6的td数据
      var tdArray = new Array();
      // 获取每月第一天的天数
      var fday = new Date(opts.year, opts.month - 1, 1).getDay();
      // 获取当前月份总天数
      var cday = new Date(opts.year, opts.month, 0).getDate();
      // 进行td的封装
      // 添加前一个月天数
      var k = fday - opts.firstDay >= 0 ? (fday - opts.firstDay) : (fday - opts.firstDay + 7);
      k = k == 0 ? 7 : k;
      var k1 = new Date(opts.year, opts.month - 1, 0).getDate();
      if (opts.isPreMonth) {
        for (var i = 0; i < k; i++) {
          var dateStr = formatDate(new Date(opts.month - 1 < 1 ? opts.year - 1 : opts.year, opts.month - 1 < 1 ? 11 : opts.month - 2, k1 - k + i + 1));
          tdArray.push({
            td: (k1 - k + i + 1),
            value: dateStr,
            cls: 'mcalendar-pn-td-f'
          });
        }
      } else {
        for (var i = 0; i < k; i++) {
          var dateStr = formatDate(new Date(opts.month - 1 < 1 ? opts.year - 1 : opts.year, opts.month - 1 < 1 ? 11 : opts.month - 2, k1 - k + i + 1));
          tdArray.push({
            td: '', //(k1 - k + i + 1),
            value: dateStr,
            cls: 'mcalendar-pn-td-f'
          });
        }
      }

      // 添加该月的正常天数
      for (var i = 1; i <= cday; i++) {
        var dateStr = formatDate(new Date(opts.year, opts.month - 1, i));
        tdArray.push({
          td: i,
          value: dateStr,
          cls: ''
        });
      }
      // 添加后td
      var s = 42 - tdArray.length;
      if (opts.isPreMonth) {
        for (var i = 0; i < s; i++) {
          var dateStr = formatDate(new Date(opts.month + 1 > 12 ? opts.year + 1 : opts.year, opts.month + 1 > 12 ? 0 : opts.month, i + 1));
          tdArray.push({
            td: (i + 1),
            value: dateStr,
            cls: 'mcalendar-pn-td-f'
          });
        }
      } else {
        for (var i = 0; i < s; i++) {
          var dateStr = formatDate(new Date(opts.month + 1 > 12 ? opts.year + 1 : opts.year, opts.month + 1 > 12 ? 0 : opts.month, i + 1));
          tdArray.push({
            td: '', //(i + 1),
            value: dateStr,
            cls: 'mcalendar-pn-td-f'
          });
        }
      }
      // 取当天日期格式化
      var nowDateStr = formatDate(new Date());
      // 获取数据data 中当月的大事记
      for (var i = 0; i < 6; i++) {
        var tr = $("<tr class='row_" + i + ' ' + (i % 2 === 0 ? 'odd' : 'opp') + "'></tr>").appendTo(table.find("tbody"));
        for (var j = 0; j < 7; j++) {
          var day = tdArray.shift();
          if (day != undefined) {
            if (map.Contains(day.value)) {
              // 拼接 td 内html
              var tdHtml = "<span class='mcalendar-event-span'><span>" + day.td + "</span><div class='mcalendar-div'><div class='mcalendar-div-top'></div><div class='mcalendar-div-cnt'>";
              for (var k = 0, a; a = map.Get(day.value)[k++];) {
                tdHtml += a + "<br/>";
              }
              tdHtml += "</div><div class='mcalendar-div-btm'></div></div></span>";
              var $td = $("<td></td>").attr("id", 'p-' + day.value)
                .data('day', j)
                .html(tdHtml)
                .hover(function() {
                  // 鼠标移入时显示大事记
                  $(this).find(".mcalendar-div").show();
                  $(this).find(".mcalendar-event-span").css("z-index", 10000);
                }, function() {
                  // 鼠标移出时隐藏大事记
                  $(this).find(".mcalendar-div").hide();
                  $(this).find(".mcalendar-event-span").css("z-index", 0);
                }).appendTo(tr);
              if (nowDateStr == day.value) {
                var text = opts.todayTemp.replace('{month}', (thisDate.getMonth() + 1)).replace('{day}', thisDate.getDate());
                $td.addClass('mcalendar-nowdate').text(text);
              }
            } else {
              var $td = $("<td></td>")
                .attr("id", 'p-' + day.value)
                .data('day', j)
                .addClass(day.cls)
                .html(day.td)
                .data('date',day.td)
                .appendTo(tr);
              if (nowDateStr == day.value) {
                var text = opts.todayTemp.replace('{month}', (thisDate.getMonth() + 1)).replace('{day}', thisDate.getDate());
                $td.addClass('mcalendar-nowdate').text(text);
              }
            }
          }
        }
      }
    }
    /**
     * 定义NCalender
     *
     * @param str 操作函数或id
     * @param param 参数信息
     */
  $.fn.mcalendar = function(str, param) {
    // 如果str 为 string 意味着调用相应操作方法
    if (typeof str == "string") {
      // 获取操作函数
      var func = $.fn.mcalendar.methods[str];
      if (func) {
        return func(this, param);
      }
    }
    // 设置mcalendar的options信息
    var opts = str || {};
    // 遍历所有调用mcalendar的元素，添加并初始化calendar
    return this.each(function() {
      // 利用jquery data 向元素附加数据
      var data = $.data(this, "mcalendar");
      // 如果该元素的data已经存在，则直接进行拓展
      if (data) {
        $.extend(data.options, opts);
      } else {
        // 如果data为空，则在继承默认设置的基础上添加信息
        $.data(this, "mcalendar", {
          options: $.extend({}, $.fn.mcalendar.defaults, opts)
        });
      }
      // 调用mcalendar的初始化方法
      init(this);
    });
  };
  /**
   * 定义所有可操作方法
   *
   */
  $.fn.mcalendar.methods = {
    locationMonth: function(obj, num) {
      changeMonth(obj, num);
    },
    locationYear: function(obj, num) {
      changeYear(obj, num);
    },
    init: function(obj) {
      init(obj);
    }
  };
  /**
   * mcalendar 的默认参数定义
   *
   */
  $.fn.mcalendar.defaults = {
    // 定义一周的第一天： Sunday is 0, Monday is 1,......
    firstDay: 0,
    // 定义星期的文字表示信息
    weeks: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    // 定义月份的文字表示信息
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ],
    // 定义年份
    year: new Date().getFullYear(),
    // 定义月份
    month: new Date().getMonth() + 1,
    // 当前日期
    current: new Date(),
    // 上下月显示文字
    prevTxt: "&lt;",
    nextTxt: "&gt;",
    // 上下年显示文字
    prevYearTxt: "上年",
    nextYearTxt: "下年",
    headTodayTemp: '今天是{year}年{month}月{day}日',
    todayTemp: '今日 {month}月{day}日',
    // 远程数据加载地址
    url: null,
    // 数据信息
    data: null,
    monthChange: null,
    isPreMonth: true //是否显示上一个月和下一个月的日期
  };
})(jQuery);