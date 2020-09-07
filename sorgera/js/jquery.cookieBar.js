/*!
 * jQuery Cookiebar Plugin
 * https://github.com/carlwoodhouse/jquery.cookieBar
 *
 * Copyright 2012-17, Carl Woodhouse. the cookie function is inspired by https://github.com/carhartl/jquery-cookie
 * Disclaimer: if you still get fined for not complying with the eu cookielaw, it's not our fault.
 * Licence: MIT
 */

(function ($) {
	$.cookie = function (key, value, options) {
		if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
			options = $.extend({}, options);

			if (value === null || value === undefined) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}
		options = value || {};
		var decode = options.raw ? function (s) { return s; } : decodeURIComponent;

		var pairs = document.cookie.split('; ');
		for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
			// IE
			if (decode(pair[0]) === key) return decode(pair[1] || '');
		}
		return null;
	};

	$.fn.cookieBar = function (options) {
		var settings = $.extend({
			'closeButton': 'none',
			'hideOnClose': true,
			'secure': false,
			'path': '/',
			'domain': '',
			'name': 'cookiebar',
			'expiresDays': 365
		}, options);

		return this.each(function () {
			var cookiebar = $(this);

			// just in case they didnt hide it by default.
			cookiebar.hide();

			// if close button not defined. define it!
			if (settings.closeButton == 'none') {
				cookiebar.append('<a class="cookiebar-close">Continue</a>');
				$.extend(settings, { 'closeButton': '.cookiebar-close' });
			}

			if ($.cookie(settings.name) != 'hide') {
				cookiebar.show();
			}

			cookiebar.find(settings.closeButton).click(function () {
				if (settings.hideOnClose) {
					cookiebar.hide();
				}
				$.cookie(settings.name, 'hide', { path: settings.path, secure: settings.secure, domain: settings.domain, expires: settings.expiresDays });
				cookiebar.trigger('cookieBar-close');
				return false;
			});
		});
	};

	// self injection init
	$.cookieBar = function (options) {
		$('body').prepend('<div id="gdpr-box" class="cookies-accept">
       <p>We use cookies to enhance your experience in our web site. By visiting it, you agree our <a href="/privacy-policy/#cookies" class="cb-policy">Cookies Policy</a>
       <button class="gdpr-button-accept">Accept cookies</button>
       <a href="/link-to-cookie-policy" class="gdpr-button-settings">Change settings</a></p>
   </div>');
		$('.cookie-message').cookieBar(options);
	};
})(jQuery);