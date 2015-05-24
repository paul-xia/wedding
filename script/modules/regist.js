(function() {
	$.fn.extend({
		formParams: function(convert, writeDepend) {
			if (this[0].nodeName.toLowerCase() == 'form' && this[0].elements) {
				return $($.makeArray(this[0].elements)).getParams(convert, writeDepend);
			}
			return $("input[name], textarea[name], select[name]", this[0]).getParams(convert, writeDepend);
		},
		getParams: function(convert, writeDepend) {
			var data = {},
				current;

			convert = convert === undefined ? true : convert;

			this.each(function() {
				var el = this,
					type = el.type && el.type.toLowerCase();
				//if we are submit, ignore
				if ((type == 'submit') || (type == 'file') || !el.name) {
					return;
				}
				var radioCheck = /radio|checkbox/i,
					keyBreaker = /[^\[\]]+/g,
					numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;
				var isNumber = function(value) {
					if (Number(value) == value && !isNaN(parseFloat(value))) return true;
					if (typeof value != 'string') return false;
					return value.match(numberMatcher);
				};
				var key = el.name,
					value = $.data(el, "value") || $.fn.val.call([el]),
					isRadioCheck = radioCheck.test(el.type),
					parts = key.match(keyBreaker),
					write = !isRadioCheck || !!el.checked,
					//make an array of values
					lastPart;

				if (convert) {
					if (isNumber(value)) {
						value = parseFloat(value);
					} else if (value === 'true' || value === 'false') {
						value = Boolean(value);
					}
				}
				// value = value.replaceAll(/\</g,'&lt;');
				// value = value.replaceAll(/\>/g,'&gt;');
				// value = value.replaceAll(/\&/g,'&amp;');
				// value = value.replaceAll(/\\/g,'&quot;');
				// value = value.replaceAll(/\\t/g,'&nbsp;&nbsp;');
				// value = value.replaceAll(/\ /g,'&nbsp;');

				// go through and create nested objects
				current = data;
				for (var i = 0; i < parts.length - 1; i++) {
					if (!current[parts[i]]) {
						// Riant 20131202 Edited - For [NUMBER] array support
						// current[parts[i]] = {};
						var isArrayChild = i + 1 <= parts.length - 1 && isNumber(parts[i + 1]);
						current[parts[i]] = isArrayChild ? [] : {};
						// Edited END
					}
					current = current[parts[i]];
				}
				lastPart = parts[parts.length - 1];
				if (writeDepend && write && $.isFunction(writeDepend)) write = writeDepend(lastPart, current);

				//now we are on the last part, set the value
				if (type === "checkbox" && !$(el).is('.SC')) {
					if (lastPart in current) {
						// if (!$.isArray(current[lastPart]) ) {
						//     current[lastPart] = current[lastPart] === undefined ? [] : [current[lastPart]];
						// }
						if (write) {
							current[lastPart].push(value);
						}
					} else {
						current[lastPart] = write ? [value] : [];
					}
				} else if (write || !current[lastPart]) {
					// current[lastPart] = write ? value : undefined;
					if (write) current[lastPart] = value;
				}
			});
			return data;
		}
	});
	var registData = {
		password: null,
		password_confirm: null,
		email: null,
		agree: 0,
		user_name: null,
		telephone: null,
		flagEmail: true
	};
	var stepBox = $('#stepBox');
	var registByEmail = $('#registByEmail');
	var registByPhone = $('#registByPhone');
	var setUserInfo = $('#setUserInfo');
	changeStep(1);

	//返回
	setUserInfo.on('click', '.return', function(){
		changeStep(1);
	});

	//发送验证码
	registByPhone.on('click', '#sendValidCode', function(){
		//发送验证码js
		var btn = $(this);
		if(btn.hasClass('abtn_disabled')) return false;
		clockDown(60, btn);
		$.ajax({
			url: '/index.php?act=send_verify_code',
			type: 'post',
			data: {
				telephone: registByPhone.find('#phoneNumber').val()
			}
		}).complete(function(){})
		.success(function(data){
			console.log(data);
		});
	});

	//填写手机表单
	registByPhone.on('submit', function() {
		registData = $.extend(registData, $(this).formParams(false));
		console.log(registData);
		registData.flagEmail = false;
		changeStep(2);

		//加数据验证，验证码对比
		return false;
	});

	//填写邮箱表单
	registByEmail.on('submit', function() {
		registData = $.extend(registData, $(this).formParams(false));
		console.log(registData);
		changeStep(2);
		//加数据验证

		return false;
	});

	//用户信息提交
	setUserInfo.on('submit', function(){
		registData = $.extend(registData, $(this).formParams(false));
		console.log(registData);
		//changeStep(3);
		return false;
	});

	function clockDown(time, btn){
		if(time > 60) {
			btn.removeClass('abtn_disabled').text('发送验证码');
			return;
		}
		btn.addClass('abtn_disabled').text(time + '秒后可重新发送');
		setTimeout(function(){
			clockDown(time - 1, btn);
		}, 1000);
	}

	function changeStep(step){
		stepBox.attr('class', 'regist_step step_' + step);
		switch(step){
			case 1:
			registByEmail.show().siblings().hide();
			registByPhone.show().siblings().hide();
			break;
			case 2:
			setUserInfo.show().siblings().hide();
			if(!registData.flagEmail){
				setUserInfo.find('#loginText').text(registData.telephone);
			} else {
				setUserInfo.find('#loginText').text(registData.email);
			}
			setUserInfo.find('#telephone').val(registData.telephone);
			setUserInfo.find('#email').val(registData.email);
			break;
			case 3:
			//location.href = '/'
			break;
		}
	}
})(jQuery);