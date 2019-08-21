/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var nonce;

      nonce = null;

      Rails.loadCSPNonce = function() {
        var ref;
        return nonce = (ref = document.querySelector("meta[name=csp-nonce]")) != null ? ref.content : void 0;
      };

      Rails.cspNonce = function() {
        return nonce != null ? nonce : Rails.loadCSPNonce();
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.setAttribute('nonce', cspNonce());
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.preventInsignificantClick = function(e) {
        var data, insignificantMetaClick, link, metaClick, method, primaryMouseKey;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        insignificantMetaClick = metaClick && method === 'GET' && !data;
        primaryMouseKey = e.button === 0;
        if (!primaryMouseKey || insignificantMetaClick) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMethod, handleRemote, loadCSPNonce, preventInsignificantClick, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, loadCSPNonce = Rails.loadCSPNonce, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, preventInsignificantClick = Rails.preventInsignificantClick, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null)) {
        if (jQuery.rails) {
          throw new Error('If you load both jquery_ujs and rails-ujs, use rails-ujs only.');
        }
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        document.addEventListener('DOMContentLoaded', loadCSPNonce);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.ActiveStorage = {});
})(this, function(exports) {
  "use strict";
  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }
  var sparkMd5 = createCommonjsModule(function(module, exports) {
    (function(factory) {
      {
        module.exports = factory();
      }
    })(function(undefined) {
      var hex_chr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];
      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
      }
      function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
      }
      function md51(s) {
        var n = s.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a) {
        var n = a.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }
        a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
        length = a.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= a[i] << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n) {
        var s = "", j;
        for (j = 0; j < 4; j += 1) {
          s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
        }
        return s;
      }
      function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
          x[i] = rhex(x[i]);
        }
        return x.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to !== undefined) {
              end = clamp(to, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
        for (i = 0; i < length; i += 1) {
          arr[i] = str.charCodeAt(i);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex) {
        var bytes = [], length = hex.length, x;
        for (x = 0; x < length - 1; x += 2) {
          bytes.push(parseInt(hex.substr(x, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD5() {
        this.reset();
      }
      SparkMD5.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD5.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }
        this._buff = this._buff.substring(i - 64);
        return this;
      };
      SparkMD5.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash
        };
      };
      SparkMD5.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD5.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD5.prototype._finish = function(tail, length) {
        var i = length, tmp, lo, hi;
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(this._hash, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
      };
      SparkMD5.hash = function(str, raw) {
        return SparkMD5.hashBinary(toUtf8(str), raw);
      };
      SparkMD5.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD5.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD5.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
        this._length += arr.byteLength;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }
        this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i, ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff[i] << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD5.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD5.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD5.prototype.setState.call(this, state);
      };
      SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
      SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
      SparkMD5.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD5;
    });
  });
  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var FileChecksum = function() {
    createClass(FileChecksum, null, [ {
      key: "create",
      value: function create(file, callback) {
        var instance = new FileChecksum(file);
        instance.create(callback);
      }
    } ]);
    function FileChecksum(file) {
      classCallCheck(this, FileChecksum);
      this.file = file;
      this.chunkSize = 2097152;
      this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
      this.chunkIndex = 0;
    }
    createClass(FileChecksum, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        this.callback = callback;
        this.md5Buffer = new sparkMd5.ArrayBuffer();
        this.fileReader = new FileReader();
        this.fileReader.addEventListener("load", function(event) {
          return _this.fileReaderDidLoad(event);
        });
        this.fileReader.addEventListener("error", function(event) {
          return _this.fileReaderDidError(event);
        });
        this.readNextChunk();
      }
    }, {
      key: "fileReaderDidLoad",
      value: function fileReaderDidLoad(event) {
        this.md5Buffer.append(event.target.result);
        if (!this.readNextChunk()) {
          var binaryDigest = this.md5Buffer.end(true);
          var base64digest = btoa(binaryDigest);
          this.callback(null, base64digest);
        }
      }
    }, {
      key: "fileReaderDidError",
      value: function fileReaderDidError(event) {
        this.callback("Error reading " + this.file.name);
      }
    }, {
      key: "readNextChunk",
      value: function readNextChunk() {
        if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
          var start = this.chunkIndex * this.chunkSize;
          var end = Math.min(start + this.chunkSize, this.file.size);
          var bytes = fileSlice.call(this.file, start, end);
          this.fileReader.readAsArrayBuffer(bytes);
          this.chunkIndex++;
          return true;
        } else {
          return false;
        }
      }
    } ]);
    return FileChecksum;
  }();
  function getMetaValue(name) {
    var element = findElement(document.head, 'meta[name="' + name + '"]');
    if (element) {
      return element.getAttribute("content");
    }
  }
  function findElements(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    var elements = root.querySelectorAll(selector);
    return toArray$1(elements);
  }
  function findElement(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    return root.querySelector(selector);
  }
  function dispatchEvent(element, type) {
    var eventInit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var disabled = element.disabled;
    var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, detail = eventInit.detail;
    var event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
      element.disabled = false;
      element.dispatchEvent(event);
    } finally {
      element.disabled = disabled;
    }
    return event;
  }
  function toArray$1(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (Array.from) {
      return Array.from(value);
    } else {
      return [].slice.call(value);
    }
  }
  var BlobRecord = function() {
    function BlobRecord(file, checksum, url) {
      var _this = this;
      classCallCheck(this, BlobRecord);
      this.file = file;
      this.attributes = {
        filename: file.name,
        content_type: file.type,
        byte_size: file.size,
        checksum: checksum
      };
      this.xhr = new XMLHttpRequest();
      this.xhr.open("POST", url, true);
      this.xhr.responseType = "json";
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      this.xhr.setRequestHeader("X-CSRF-Token", getMetaValue("csrf-token"));
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobRecord, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(JSON.stringify({
          blob: this.attributes
        }));
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        if (this.status >= 200 && this.status < 300) {
          var response = this.response;
          var direct_upload = response.direct_upload;
          delete response.direct_upload;
          this.attributes = response;
          this.directUploadData = direct_upload;
          this.callback(null, this.toJSON());
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error creating Blob for "' + this.file.name + '". Status: ' + this.status);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        var result = {};
        for (var key in this.attributes) {
          result[key] = this.attributes[key];
        }
        return result;
      }
    }, {
      key: "status",
      get: function get$$1() {
        return this.xhr.status;
      }
    }, {
      key: "response",
      get: function get$$1() {
        var _xhr = this.xhr, responseType = _xhr.responseType, response = _xhr.response;
        if (responseType == "json") {
          return response;
        } else {
          return JSON.parse(response);
        }
      }
    } ]);
    return BlobRecord;
  }();
  var BlobUpload = function() {
    function BlobUpload(blob) {
      var _this = this;
      classCallCheck(this, BlobUpload);
      this.blob = blob;
      this.file = blob.file;
      var _blob$directUploadDat = blob.directUploadData, url = _blob$directUploadDat.url, headers = _blob$directUploadDat.headers;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("PUT", url, true);
      this.xhr.responseType = "text";
      for (var key in headers) {
        this.xhr.setRequestHeader(key, headers[key]);
      }
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobUpload, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(this.file.slice());
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        var _xhr = this.xhr, status = _xhr.status, response = _xhr.response;
        if (status >= 200 && status < 300) {
          this.callback(null, response);
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error storing "' + this.file.name + '". Status: ' + this.xhr.status);
      }
    } ]);
    return BlobUpload;
  }();
  var id = 0;
  var DirectUpload = function() {
    function DirectUpload(file, url, delegate) {
      classCallCheck(this, DirectUpload);
      this.id = ++id;
      this.file = file;
      this.url = url;
      this.delegate = delegate;
    }
    createClass(DirectUpload, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        FileChecksum.create(this.file, function(error, checksum) {
          if (error) {
            callback(error);
            return;
          }
          var blob = new BlobRecord(_this.file, checksum, _this.url);
          notify(_this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
          blob.create(function(error) {
            if (error) {
              callback(error);
            } else {
              var upload = new BlobUpload(blob);
              notify(_this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
              upload.create(function(error) {
                if (error) {
                  callback(error);
                } else {
                  callback(null, blob.toJSON());
                }
              });
            }
          });
        });
      }
    } ]);
    return DirectUpload;
  }();
  function notify(object, methodName) {
    if (object && typeof object[methodName] == "function") {
      for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        messages[_key - 2] = arguments[_key];
      }
      return object[methodName].apply(object, messages);
    }
  }
  var DirectUploadController = function() {
    function DirectUploadController(input, file) {
      classCallCheck(this, DirectUploadController);
      this.input = input;
      this.file = file;
      this.directUpload = new DirectUpload(this.file, this.url, this);
      this.dispatch("initialize");
    }
    createClass(DirectUploadController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = this.input.name;
        this.input.insertAdjacentElement("beforebegin", hiddenInput);
        this.dispatch("start");
        this.directUpload.create(function(error, attributes) {
          if (error) {
            hiddenInput.parentNode.removeChild(hiddenInput);
            _this.dispatchError(error);
          } else {
            hiddenInput.value = attributes.signed_id;
          }
          _this.dispatch("end");
          callback(error);
        });
      }
    }, {
      key: "uploadRequestDidProgress",
      value: function uploadRequestDidProgress(event) {
        var progress = event.loaded / event.total * 100;
        if (progress) {
          this.dispatch("progress", {
            progress: progress
          });
        }
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        detail.file = this.file;
        detail.id = this.directUpload.id;
        return dispatchEvent(this.input, "direct-upload:" + name, {
          detail: detail
        });
      }
    }, {
      key: "dispatchError",
      value: function dispatchError(error) {
        var event = this.dispatch("error", {
          error: error
        });
        if (!event.defaultPrevented) {
          alert(error);
        }
      }
    }, {
      key: "directUploadWillCreateBlobWithXHR",
      value: function directUploadWillCreateBlobWithXHR(xhr) {
        this.dispatch("before-blob-request", {
          xhr: xhr
        });
      }
    }, {
      key: "directUploadWillStoreFileWithXHR",
      value: function directUploadWillStoreFileWithXHR(xhr) {
        var _this2 = this;
        this.dispatch("before-storage-request", {
          xhr: xhr
        });
        xhr.upload.addEventListener("progress", function(event) {
          return _this2.uploadRequestDidProgress(event);
        });
      }
    }, {
      key: "url",
      get: function get$$1() {
        return this.input.getAttribute("data-direct-upload-url");
      }
    } ]);
    return DirectUploadController;
  }();
  var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
  var DirectUploadsController = function() {
    function DirectUploadsController(form) {
      classCallCheck(this, DirectUploadsController);
      this.form = form;
      this.inputs = findElements(form, inputSelector).filter(function(input) {
        return input.files.length;
      });
    }
    createClass(DirectUploadsController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var controllers = this.createDirectUploadControllers();
        var startNextController = function startNextController() {
          var controller = controllers.shift();
          if (controller) {
            controller.start(function(error) {
              if (error) {
                callback(error);
                _this.dispatch("end");
              } else {
                startNextController();
              }
            });
          } else {
            callback();
            _this.dispatch("end");
          }
        };
        this.dispatch("start");
        startNextController();
      }
    }, {
      key: "createDirectUploadControllers",
      value: function createDirectUploadControllers() {
        var controllers = [];
        this.inputs.forEach(function(input) {
          toArray$1(input.files).forEach(function(file) {
            var controller = new DirectUploadController(input, file);
            controllers.push(controller);
          });
        });
        return controllers;
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return dispatchEvent(this.form, "direct-uploads:" + name, {
          detail: detail
        });
      }
    } ]);
    return DirectUploadsController;
  }();
  var processingAttribute = "data-direct-uploads-processing";
  var submitButtonsByForm = new WeakMap();
  var started = false;
  function start() {
    if (!started) {
      started = true;
      document.addEventListener("click", didClick, true);
      document.addEventListener("submit", didSubmitForm);
      document.addEventListener("ajax:before", didSubmitRemoteElement);
    }
  }
  function didClick(event) {
    var target = event.target;
    if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
      submitButtonsByForm.set(target.form, target);
    }
  }
  function didSubmitForm(event) {
    handleFormSubmissionEvent(event);
  }
  function didSubmitRemoteElement(event) {
    if (event.target.tagName == "FORM") {
      handleFormSubmissionEvent(event);
    }
  }
  function handleFormSubmissionEvent(event) {
    var form = event.target;
    if (form.hasAttribute(processingAttribute)) {
      event.preventDefault();
      return;
    }
    var controller = new DirectUploadsController(form);
    var inputs = controller.inputs;
    if (inputs.length) {
      event.preventDefault();
      form.setAttribute(processingAttribute, "");
      inputs.forEach(disable);
      controller.start(function(error) {
        form.removeAttribute(processingAttribute);
        if (error) {
          inputs.forEach(enable);
        } else {
          submitForm(form);
        }
      });
    }
  }
  function submitForm(form) {
    var button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
    if (button) {
      var _button = button, disabled = _button.disabled;
      button.disabled = false;
      button.focus();
      button.click();
      button.disabled = disabled;
    } else {
      button = document.createElement("input");
      button.type = "submit";
      button.style.display = "none";
      form.appendChild(button);
      button.click();
      form.removeChild(button);
    }
    submitButtonsByForm.delete(form);
  }
  function disable(input) {
    input.disabled = true;
  }
  function enable(input) {
    input.disabled = false;
  }
  function autostart() {
    if (window.ActiveStorage) {
      start();
    }
  }
  setTimeout(autostart, 1);
  exports.start = start;
  exports.DirectUpload = DirectUpload;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=122)}([function(e,t,n){"use strict";e.exports=n(46)},function(e,t,n){e.exports=n(118)()},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o,a,i,u){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,o,a,i,u],s=0;(l=new Error(t.replace(/%s/g,function(){return c[s++]}))).name="Invariant Violation"}throw l.framesToPop=1,l}}},function(e,t,n){(function(e,r){var o;
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */(function(){var a,i=200,u="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",l="Expected a function",c="__lodash_hash_undefined__",s=500,f="__lodash_placeholder__",p=1,d=2,h=4,m=1,v=2,y=1,g=2,b=4,E=8,w=16,_=32,x=64,k=128,S=256,N=512,O=30,T="...",C=800,P=16,j=1,R=2,I=1/0,A=9007199254740991,U=17976931348623157e292,M=NaN,z=4294967295,D=z-1,L=z>>>1,F=[["ary",k],["bind",y],["bindKey",g],["curry",E],["curryRight",w],["flip",N],["partial",_],["partialRight",x],["rearg",S]],W="[object Arguments]",B="[object Array]",$="[object AsyncFunction]",V="[object Boolean]",q="[object Date]",H="[object DOMException]",K="[object Error]",Q="[object Function]",G="[object GeneratorFunction]",Y="[object Map]",Z="[object Number]",X="[object Null]",J="[object Object]",ee="[object Proxy]",te="[object RegExp]",ne="[object Set]",re="[object String]",oe="[object Symbol]",ae="[object Undefined]",ie="[object WeakMap]",ue="[object WeakSet]",le="[object ArrayBuffer]",ce="[object DataView]",se="[object Float32Array]",fe="[object Float64Array]",pe="[object Int8Array]",de="[object Int16Array]",he="[object Int32Array]",me="[object Uint8Array]",ve="[object Uint8ClampedArray]",ye="[object Uint16Array]",ge="[object Uint32Array]",be=/\b__p \+= '';/g,Ee=/\b(__p \+=) '' \+/g,we=/(__e\(.*?\)|\b__t\)) \+\n'';/g,_e=/&(?:amp|lt|gt|quot|#39);/g,xe=/[&<>"']/g,ke=RegExp(_e.source),Se=RegExp(xe.source),Ne=/<%-([\s\S]+?)%>/g,Oe=/<%([\s\S]+?)%>/g,Te=/<%=([\s\S]+?)%>/g,Ce=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Pe=/^\w*$/,je=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Re=/[\\^$.*+?()[\]{}|]/g,Ie=RegExp(Re.source),Ae=/^\s+|\s+$/g,Ue=/^\s+/,Me=/\s+$/,ze=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,De=/\{\n\/\* \[wrapped with (.+)\] \*/,Le=/,? & /,Fe=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,We=/\\(\\)?/g,Be=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,$e=/\w*$/,Ve=/^[-+]0x[0-9a-f]+$/i,qe=/^0b[01]+$/i,He=/^\[object .+?Constructor\]$/,Ke=/^0o[0-7]+$/i,Qe=/^(?:0|[1-9]\d*)$/,Ge=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Ye=/($^)/,Ze=/['\n\r\u2028\u2029\\]/g,Xe="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",Je="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",et="[\\ud800-\\udfff]",tt="["+Je+"]",nt="["+Xe+"]",rt="\\d+",ot="[\\u2700-\\u27bf]",at="[a-z\\xdf-\\xf6\\xf8-\\xff]",it="[^\\ud800-\\udfff"+Je+rt+"\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",ut="\\ud83c[\\udffb-\\udfff]",lt="[^\\ud800-\\udfff]",ct="(?:\\ud83c[\\udde6-\\uddff]){2}",st="[\\ud800-\\udbff][\\udc00-\\udfff]",ft="[A-Z\\xc0-\\xd6\\xd8-\\xde]",pt="(?:"+at+"|"+it+")",dt="(?:"+ft+"|"+it+")",ht="(?:"+nt+"|"+ut+")"+"?",mt="[\\ufe0e\\ufe0f]?"+ht+("(?:\\u200d(?:"+[lt,ct,st].join("|")+")[\\ufe0e\\ufe0f]?"+ht+")*"),vt="(?:"+[ot,ct,st].join("|")+")"+mt,yt="(?:"+[lt+nt+"?",nt,ct,st,et].join("|")+")",gt=RegExp("['’]","g"),bt=RegExp(nt,"g"),Et=RegExp(ut+"(?="+ut+")|"+yt+mt,"g"),wt=RegExp([ft+"?"+at+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[tt,ft,"$"].join("|")+")",dt+"+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[tt,ft+pt,"$"].join("|")+")",ft+"?"+pt+"+(?:['’](?:d|ll|m|re|s|t|ve))?",ft+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",rt,vt].join("|"),"g"),_t=RegExp("[\\u200d\\ud800-\\udfff"+Xe+"\\ufe0e\\ufe0f]"),xt=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,kt=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],St=-1,Nt={};Nt[se]=Nt[fe]=Nt[pe]=Nt[de]=Nt[he]=Nt[me]=Nt[ve]=Nt[ye]=Nt[ge]=!0,Nt[W]=Nt[B]=Nt[le]=Nt[V]=Nt[ce]=Nt[q]=Nt[K]=Nt[Q]=Nt[Y]=Nt[Z]=Nt[J]=Nt[te]=Nt[ne]=Nt[re]=Nt[ie]=!1;var Ot={};Ot[W]=Ot[B]=Ot[le]=Ot[ce]=Ot[V]=Ot[q]=Ot[se]=Ot[fe]=Ot[pe]=Ot[de]=Ot[he]=Ot[Y]=Ot[Z]=Ot[J]=Ot[te]=Ot[ne]=Ot[re]=Ot[oe]=Ot[me]=Ot[ve]=Ot[ye]=Ot[ge]=!0,Ot[K]=Ot[Q]=Ot[ie]=!1;var Tt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Ct=parseFloat,Pt=parseInt,jt="object"==typeof e&&e&&e.Object===Object&&e,Rt="object"==typeof self&&self&&self.Object===Object&&self,It=jt||Rt||Function("return this")(),At=t&&!t.nodeType&&t,Ut=At&&"object"==typeof r&&r&&!r.nodeType&&r,Mt=Ut&&Ut.exports===At,zt=Mt&&jt.process,Dt=function(){try{var e=Ut&&Ut.require&&Ut.require("util").types;return e||zt&&zt.binding&&zt.binding("util")}catch(e){}}(),Lt=Dt&&Dt.isArrayBuffer,Ft=Dt&&Dt.isDate,Wt=Dt&&Dt.isMap,Bt=Dt&&Dt.isRegExp,$t=Dt&&Dt.isSet,Vt=Dt&&Dt.isTypedArray;function qt(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function Ht(e,t,n,r){for(var o=-1,a=null==e?0:e.length;++o<a;){var i=e[o];t(r,i,n(i),e)}return r}function Kt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&!1!==t(e[n],n,e););return e}function Qt(e,t){for(var n=null==e?0:e.length;n--&&!1!==t(e[n],n,e););return e}function Gt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(!t(e[n],n,e))return!1;return!0}function Yt(e,t){for(var n=-1,r=null==e?0:e.length,o=0,a=[];++n<r;){var i=e[n];t(i,n,e)&&(a[o++]=i)}return a}function Zt(e,t){return!!(null==e?0:e.length)&&ln(e,t,0)>-1}function Xt(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0;return!1}function Jt(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}function en(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}function tn(e,t,n,r){var o=-1,a=null==e?0:e.length;for(r&&a&&(n=e[++o]);++o<a;)n=t(n,e[o],o,e);return n}function nn(e,t,n,r){var o=null==e?0:e.length;for(r&&o&&(n=e[--o]);o--;)n=t(n,e[o],o,e);return n}function rn(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}var on=pn("length");function an(e,t,n){var r;return n(e,function(e,n,o){if(t(e,n,o))return r=n,!1}),r}function un(e,t,n,r){for(var o=e.length,a=n+(r?1:-1);r?a--:++a<o;)if(t(e[a],a,e))return a;return-1}function ln(e,t,n){return t==t?function(e,t,n){var r=n-1,o=e.length;for(;++r<o;)if(e[r]===t)return r;return-1}(e,t,n):un(e,sn,n)}function cn(e,t,n,r){for(var o=n-1,a=e.length;++o<a;)if(r(e[o],t))return o;return-1}function sn(e){return e!=e}function fn(e,t){var n=null==e?0:e.length;return n?mn(e,t)/n:M}function pn(e){return function(t){return null==t?a:t[e]}}function dn(e){return function(t){return null==e?a:e[t]}}function hn(e,t,n,r,o){return o(e,function(e,o,a){n=r?(r=!1,e):t(n,e,o,a)}),n}function mn(e,t){for(var n,r=-1,o=e.length;++r<o;){var i=t(e[r]);i!==a&&(n=n===a?i:n+i)}return n}function vn(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}function yn(e){return function(t){return e(t)}}function gn(e,t){return Jt(t,function(t){return e[t]})}function bn(e,t){return e.has(t)}function En(e,t){for(var n=-1,r=e.length;++n<r&&ln(t,e[n],0)>-1;);return n}function wn(e,t){for(var n=e.length;n--&&ln(t,e[n],0)>-1;);return n}var _n=dn({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),xn=dn({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function kn(e){return"\\"+Tt[e]}function Sn(e){return _t.test(e)}function Nn(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function On(e,t){return function(n){return e(t(n))}}function Tn(e,t){for(var n=-1,r=e.length,o=0,a=[];++n<r;){var i=e[n];i!==t&&i!==f||(e[n]=f,a[o++]=n)}return a}function Cn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function Pn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=[e,e]}),n}function jn(e){return Sn(e)?function(e){var t=Et.lastIndex=0;for(;Et.test(e);)++t;return t}(e):on(e)}function Rn(e){return Sn(e)?function(e){return e.match(Et)||[]}(e):function(e){return e.split("")}(e)}var In=dn({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});var An=function e(t){var n,r=(t=null==t?It:An.defaults(It.Object(),t,An.pick(It,kt))).Array,o=t.Date,Xe=t.Error,Je=t.Function,et=t.Math,tt=t.Object,nt=t.RegExp,rt=t.String,ot=t.TypeError,at=r.prototype,it=Je.prototype,ut=tt.prototype,lt=t["__core-js_shared__"],ct=it.toString,st=ut.hasOwnProperty,ft=0,pt=(n=/[^.]+$/.exec(lt&&lt.keys&&lt.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"",dt=ut.toString,ht=ct.call(tt),mt=It._,vt=nt("^"+ct.call(st).replace(Re,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),yt=Mt?t.Buffer:a,Et=t.Symbol,_t=t.Uint8Array,Tt=yt?yt.allocUnsafe:a,jt=On(tt.getPrototypeOf,tt),Rt=tt.create,At=ut.propertyIsEnumerable,Ut=at.splice,zt=Et?Et.isConcatSpreadable:a,Dt=Et?Et.iterator:a,on=Et?Et.toStringTag:a,dn=function(){try{var e=La(tt,"defineProperty");return e({},"",{}),e}catch(e){}}(),Un=t.clearTimeout!==It.clearTimeout&&t.clearTimeout,Mn=o&&o.now!==It.Date.now&&o.now,zn=t.setTimeout!==It.setTimeout&&t.setTimeout,Dn=et.ceil,Ln=et.floor,Fn=tt.getOwnPropertySymbols,Wn=yt?yt.isBuffer:a,Bn=t.isFinite,$n=at.join,Vn=On(tt.keys,tt),qn=et.max,Hn=et.min,Kn=o.now,Qn=t.parseInt,Gn=et.random,Yn=at.reverse,Zn=La(t,"DataView"),Xn=La(t,"Map"),Jn=La(t,"Promise"),er=La(t,"Set"),tr=La(t,"WeakMap"),nr=La(tt,"create"),rr=tr&&new tr,or={},ar=fi(Zn),ir=fi(Xn),ur=fi(Jn),lr=fi(er),cr=fi(tr),sr=Et?Et.prototype:a,fr=sr?sr.valueOf:a,pr=sr?sr.toString:a;function dr(e){if(Tu(e)&&!yu(e)&&!(e instanceof yr)){if(e instanceof vr)return e;if(st.call(e,"__wrapped__"))return pi(e)}return new vr(e)}var hr=function(){function e(){}return function(t){if(!Ou(t))return{};if(Rt)return Rt(t);e.prototype=t;var n=new e;return e.prototype=a,n}}();function mr(){}function vr(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=a}function yr(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=z,this.__views__=[]}function gr(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function br(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Er(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function wr(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new Er;++t<n;)this.add(e[t])}function _r(e){var t=this.__data__=new br(e);this.size=t.size}function xr(e,t){var n=yu(e),r=!n&&vu(e),o=!n&&!r&&wu(e),a=!n&&!r&&!o&&Mu(e),i=n||r||o||a,u=i?vn(e.length,rt):[],l=u.length;for(var c in e)!t&&!st.call(e,c)||i&&("length"==c||o&&("offset"==c||"parent"==c)||a&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||Ha(c,l))||u.push(c);return u}function kr(e){var t=e.length;return t?e[_o(0,t-1)]:a}function Sr(e,t){return li(ra(e),Ar(t,0,e.length))}function Nr(e){return li(ra(e))}function Or(e,t,n){(n===a||du(e[t],n))&&(n!==a||t in e)||Rr(e,t,n)}function Tr(e,t,n){var r=e[t];st.call(e,t)&&du(r,n)&&(n!==a||t in e)||Rr(e,t,n)}function Cr(e,t){for(var n=e.length;n--;)if(du(e[n][0],t))return n;return-1}function Pr(e,t,n,r){return Lr(e,function(e,o,a){t(r,e,n(e),a)}),r}function jr(e,t){return e&&oa(t,ol(t),e)}function Rr(e,t,n){"__proto__"==t&&dn?dn(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}function Ir(e,t){for(var n=-1,o=t.length,i=r(o),u=null==e;++n<o;)i[n]=u?a:Ju(e,t[n]);return i}function Ar(e,t,n){return e==e&&(n!==a&&(e=e<=n?e:n),t!==a&&(e=e>=t?e:t)),e}function Ur(e,t,n,r,o,i){var u,l=t&p,c=t&d,s=t&h;if(n&&(u=o?n(e,r,o,i):n(e)),u!==a)return u;if(!Ou(e))return e;var f=yu(e);if(f){if(u=function(e){var t=e.length,n=new e.constructor(t);t&&"string"==typeof e[0]&&st.call(e,"index")&&(n.index=e.index,n.input=e.input);return n}(e),!l)return ra(e,u)}else{var m=Ba(e),v=m==Q||m==G;if(wu(e))return Zo(e,l);if(m==J||m==W||v&&!o){if(u=c||v?{}:Va(e),!l)return c?function(e,t){return oa(e,Wa(e),t)}(e,function(e,t){return e&&oa(t,al(t),e)}(u,e)):function(e,t){return oa(e,Fa(e),t)}(e,jr(u,e))}else{if(!Ot[m])return o?e:{};u=function(e,t,n){var r=e.constructor;switch(t){case le:return Xo(e);case V:case q:return new r(+e);case ce:return function(e,t){var n=t?Xo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}(e,n);case se:case fe:case pe:case de:case he:case me:case ve:case ye:case ge:return Jo(e,n);case Y:return new r;case Z:case re:return new r(e);case te:return function(e){var t=new e.constructor(e.source,$e.exec(e));return t.lastIndex=e.lastIndex,t}(e);case ne:return new r;case oe:return o=e,fr?tt(fr.call(o)):{}}var o}(e,m,l)}}i||(i=new _r);var y=i.get(e);if(y)return y;i.set(e,u),Iu(e)?e.forEach(function(r){u.add(Ur(r,t,n,r,e,i))}):Cu(e)&&e.forEach(function(r,o){u.set(o,Ur(r,t,n,o,e,i))});var g=f?a:(s?c?Ra:ja:c?al:ol)(e);return Kt(g||e,function(r,o){g&&(r=e[o=r]),Tr(u,o,Ur(r,t,n,o,e,i))}),u}function Mr(e,t,n){var r=n.length;if(null==e)return!r;for(e=tt(e);r--;){var o=n[r],i=t[o],u=e[o];if(u===a&&!(o in e)||!i(u))return!1}return!0}function zr(e,t,n){if("function"!=typeof e)throw new ot(l);return oi(function(){e.apply(a,n)},t)}function Dr(e,t,n,r){var o=-1,a=Zt,u=!0,l=e.length,c=[],s=t.length;if(!l)return c;n&&(t=Jt(t,yn(n))),r?(a=Xt,u=!1):t.length>=i&&(a=bn,u=!1,t=new wr(t));e:for(;++o<l;){var f=e[o],p=null==n?f:n(f);if(f=r||0!==f?f:0,u&&p==p){for(var d=s;d--;)if(t[d]===p)continue e;c.push(f)}else a(t,p,r)||c.push(f)}return c}dr.templateSettings={escape:Ne,evaluate:Oe,interpolate:Te,variable:"",imports:{_:dr}},dr.prototype=mr.prototype,dr.prototype.constructor=dr,vr.prototype=hr(mr.prototype),vr.prototype.constructor=vr,yr.prototype=hr(mr.prototype),yr.prototype.constructor=yr,gr.prototype.clear=function(){this.__data__=nr?nr(null):{},this.size=0},gr.prototype.delete=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},gr.prototype.get=function(e){var t=this.__data__;if(nr){var n=t[e];return n===c?a:n}return st.call(t,e)?t[e]:a},gr.prototype.has=function(e){var t=this.__data__;return nr?t[e]!==a:st.call(t,e)},gr.prototype.set=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=nr&&t===a?c:t,this},br.prototype.clear=function(){this.__data__=[],this.size=0},br.prototype.delete=function(e){var t=this.__data__,n=Cr(t,e);return!(n<0)&&(n==t.length-1?t.pop():Ut.call(t,n,1),--this.size,!0)},br.prototype.get=function(e){var t=this.__data__,n=Cr(t,e);return n<0?a:t[n][1]},br.prototype.has=function(e){return Cr(this.__data__,e)>-1},br.prototype.set=function(e,t){var n=this.__data__,r=Cr(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this},Er.prototype.clear=function(){this.size=0,this.__data__={hash:new gr,map:new(Xn||br),string:new gr}},Er.prototype.delete=function(e){var t=za(this,e).delete(e);return this.size-=t?1:0,t},Er.prototype.get=function(e){return za(this,e).get(e)},Er.prototype.has=function(e){return za(this,e).has(e)},Er.prototype.set=function(e,t){var n=za(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this},wr.prototype.add=wr.prototype.push=function(e){return this.__data__.set(e,c),this},wr.prototype.has=function(e){return this.__data__.has(e)},_r.prototype.clear=function(){this.__data__=new br,this.size=0},_r.prototype.delete=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n},_r.prototype.get=function(e){return this.__data__.get(e)},_r.prototype.has=function(e){return this.__data__.has(e)},_r.prototype.set=function(e,t){var n=this.__data__;if(n instanceof br){var r=n.__data__;if(!Xn||r.length<i-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new Er(r)}return n.set(e,t),this.size=n.size,this};var Lr=ua(Kr),Fr=ua(Qr,!0);function Wr(e,t){var n=!0;return Lr(e,function(e,r,o){return n=!!t(e,r,o)}),n}function Br(e,t,n){for(var r=-1,o=e.length;++r<o;){var i=e[r],u=t(i);if(null!=u&&(l===a?u==u&&!Uu(u):n(u,l)))var l=u,c=i}return c}function $r(e,t){var n=[];return Lr(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}function Vr(e,t,n,r,o){var a=-1,i=e.length;for(n||(n=qa),o||(o=[]);++a<i;){var u=e[a];t>0&&n(u)?t>1?Vr(u,t-1,n,r,o):en(o,u):r||(o[o.length]=u)}return o}var qr=la(),Hr=la(!0);function Kr(e,t){return e&&qr(e,t,ol)}function Qr(e,t){return e&&Hr(e,t,ol)}function Gr(e,t){return Yt(t,function(t){return ku(e[t])})}function Yr(e,t){for(var n=0,r=(t=Ko(t,e)).length;null!=e&&n<r;)e=e[si(t[n++])];return n&&n==r?e:a}function Zr(e,t,n){var r=t(e);return yu(e)?r:en(r,n(e))}function Xr(e){return null==e?e===a?ae:X:on&&on in tt(e)?function(e){var t=st.call(e,on),n=e[on];try{e[on]=a;var r=!0}catch(e){}var o=dt.call(e);r&&(t?e[on]=n:delete e[on]);return o}(e):function(e){return dt.call(e)}(e)}function Jr(e,t){return e>t}function eo(e,t){return null!=e&&st.call(e,t)}function to(e,t){return null!=e&&t in tt(e)}function no(e,t,n){for(var o=n?Xt:Zt,i=e[0].length,u=e.length,l=u,c=r(u),s=1/0,f=[];l--;){var p=e[l];l&&t&&(p=Jt(p,yn(t))),s=Hn(p.length,s),c[l]=!n&&(t||i>=120&&p.length>=120)?new wr(l&&p):a}p=e[0];var d=-1,h=c[0];e:for(;++d<i&&f.length<s;){var m=p[d],v=t?t(m):m;if(m=n||0!==m?m:0,!(h?bn(h,v):o(f,v,n))){for(l=u;--l;){var y=c[l];if(!(y?bn(y,v):o(e[l],v,n)))continue e}h&&h.push(v),f.push(m)}}return f}function ro(e,t,n){var r=null==(e=ti(e,t=Ko(t,e)))?e:e[si(xi(t))];return null==r?a:qt(r,e,n)}function oo(e){return Tu(e)&&Xr(e)==W}function ao(e,t,n,r,o){return e===t||(null==e||null==t||!Tu(e)&&!Tu(t)?e!=e&&t!=t:function(e,t,n,r,o,i){var u=yu(e),l=yu(t),c=u?B:Ba(e),s=l?B:Ba(t),f=(c=c==W?J:c)==J,p=(s=s==W?J:s)==J,d=c==s;if(d&&wu(e)){if(!wu(t))return!1;u=!0,f=!1}if(d&&!f)return i||(i=new _r),u||Mu(e)?Ca(e,t,n,r,o,i):function(e,t,n,r,o,a,i){switch(n){case ce:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case le:return!(e.byteLength!=t.byteLength||!a(new _t(e),new _t(t)));case V:case q:case Z:return du(+e,+t);case K:return e.name==t.name&&e.message==t.message;case te:case re:return e==t+"";case Y:var u=Nn;case ne:var l=r&m;if(u||(u=Cn),e.size!=t.size&&!l)return!1;var c=i.get(e);if(c)return c==t;r|=v,i.set(e,t);var s=Ca(u(e),u(t),r,o,a,i);return i.delete(e),s;case oe:if(fr)return fr.call(e)==fr.call(t)}return!1}(e,t,c,n,r,o,i);if(!(n&m)){var h=f&&st.call(e,"__wrapped__"),y=p&&st.call(t,"__wrapped__");if(h||y){var g=h?e.value():e,b=y?t.value():t;return i||(i=new _r),o(g,b,n,r,i)}}if(!d)return!1;return i||(i=new _r),function(e,t,n,r,o,i){var u=n&m,l=ja(e),c=l.length,s=ja(t).length;if(c!=s&&!u)return!1;var f=c;for(;f--;){var p=l[f];if(!(u?p in t:st.call(t,p)))return!1}var d=i.get(e);if(d&&i.get(t))return d==t;var h=!0;i.set(e,t),i.set(t,e);var v=u;for(;++f<c;){p=l[f];var y=e[p],g=t[p];if(r)var b=u?r(g,y,p,t,e,i):r(y,g,p,e,t,i);if(!(b===a?y===g||o(y,g,n,r,i):b)){h=!1;break}v||(v="constructor"==p)}if(h&&!v){var E=e.constructor,w=t.constructor;E!=w&&"constructor"in e&&"constructor"in t&&!("function"==typeof E&&E instanceof E&&"function"==typeof w&&w instanceof w)&&(h=!1)}return i.delete(e),i.delete(t),h}(e,t,n,r,o,i)}(e,t,n,r,ao,o))}function io(e,t,n,r){var o=n.length,i=o,u=!r;if(null==e)return!i;for(e=tt(e);o--;){var l=n[o];if(u&&l[2]?l[1]!==e[l[0]]:!(l[0]in e))return!1}for(;++o<i;){var c=(l=n[o])[0],s=e[c],f=l[1];if(u&&l[2]){if(s===a&&!(c in e))return!1}else{var p=new _r;if(r)var d=r(s,f,c,e,t,p);if(!(d===a?ao(f,s,m|v,r,p):d))return!1}}return!0}function uo(e){return!(!Ou(e)||(t=e,pt&&pt in t))&&(ku(e)?vt:He).test(fi(e));var t}function lo(e){return"function"==typeof e?e:null==e?Pl:"object"==typeof e?yu(e)?mo(e[0],e[1]):ho(e):Ll(e)}function co(e){if(!Za(e))return Vn(e);var t=[];for(var n in tt(e))st.call(e,n)&&"constructor"!=n&&t.push(n);return t}function so(e){if(!Ou(e))return function(e){var t=[];if(null!=e)for(var n in tt(e))t.push(n);return t}(e);var t=Za(e),n=[];for(var r in e)("constructor"!=r||!t&&st.call(e,r))&&n.push(r);return n}function fo(e,t){return e<t}function po(e,t){var n=-1,o=bu(e)?r(e.length):[];return Lr(e,function(e,r,a){o[++n]=t(e,r,a)}),o}function ho(e){var t=Da(e);return 1==t.length&&t[0][2]?Ja(t[0][0],t[0][1]):function(n){return n===e||io(n,e,t)}}function mo(e,t){return Qa(e)&&Xa(t)?Ja(si(e),t):function(n){var r=Ju(n,e);return r===a&&r===t?el(n,e):ao(t,r,m|v)}}function vo(e,t,n,r,o){e!==t&&qr(t,function(i,u){if(o||(o=new _r),Ou(i))!function(e,t,n,r,o,i,u){var l=ni(e,n),c=ni(t,n),s=u.get(c);if(s)return void Or(e,n,s);var f=i?i(l,c,n+"",e,t,u):a,p=f===a;if(p){var d=yu(c),h=!d&&wu(c),m=!d&&!h&&Mu(c);f=c,d||h||m?yu(l)?f=l:Eu(l)?f=ra(l):h?(p=!1,f=Zo(c,!0)):m?(p=!1,f=Jo(c,!0)):f=[]:ju(c)||vu(c)?(f=l,vu(l)?f=Vu(l):Ou(l)&&!ku(l)||(f=Va(c))):p=!1}p&&(u.set(c,f),o(f,c,r,i,u),u.delete(c));Or(e,n,f)}(e,t,u,n,vo,r,o);else{var l=r?r(ni(e,u),i,u+"",e,t,o):a;l===a&&(l=i),Or(e,u,l)}},al)}function yo(e,t){var n=e.length;if(n)return Ha(t+=t<0?n:0,n)?e[t]:a}function go(e,t,n){var r=-1;return t=Jt(t.length?t:[Pl],yn(Ma())),function(e,t){var n=e.length;for(e.sort(t);n--;)e[n]=e[n].value;return e}(po(e,function(e,n,o){return{criteria:Jt(t,function(t){return t(e)}),index:++r,value:e}}),function(e,t){return function(e,t,n){var r=-1,o=e.criteria,a=t.criteria,i=o.length,u=n.length;for(;++r<i;){var l=ea(o[r],a[r]);if(l){if(r>=u)return l;var c=n[r];return l*("desc"==c?-1:1)}}return e.index-t.index}(e,t,n)})}function bo(e,t,n){for(var r=-1,o=t.length,a={};++r<o;){var i=t[r],u=Yr(e,i);n(u,i)&&Oo(a,Ko(i,e),u)}return a}function Eo(e,t,n,r){var o=r?cn:ln,a=-1,i=t.length,u=e;for(e===t&&(t=ra(t)),n&&(u=Jt(e,yn(n)));++a<i;)for(var l=0,c=t[a],s=n?n(c):c;(l=o(u,s,l,r))>-1;)u!==e&&Ut.call(u,l,1),Ut.call(e,l,1);return e}function wo(e,t){for(var n=e?t.length:0,r=n-1;n--;){var o=t[n];if(n==r||o!==a){var a=o;Ha(o)?Ut.call(e,o,1):Lo(e,o)}}return e}function _o(e,t){return e+Ln(Gn()*(t-e+1))}function xo(e,t){var n="";if(!e||t<1||t>A)return n;do{t%2&&(n+=e),(t=Ln(t/2))&&(e+=e)}while(t);return n}function ko(e,t){return ai(ei(e,t,Pl),e+"")}function So(e){return kr(dl(e))}function No(e,t){var n=dl(e);return li(n,Ar(t,0,n.length))}function Oo(e,t,n,r){if(!Ou(e))return e;for(var o=-1,i=(t=Ko(t,e)).length,u=i-1,l=e;null!=l&&++o<i;){var c=si(t[o]),s=n;if(o!=u){var f=l[c];(s=r?r(f,c,l):a)===a&&(s=Ou(f)?f:Ha(t[o+1])?[]:{})}Tr(l,c,s),l=l[c]}return e}var To=rr?function(e,t){return rr.set(e,t),e}:Pl,Co=dn?function(e,t){return dn(e,"toString",{configurable:!0,enumerable:!1,value:Ol(t),writable:!0})}:Pl;function Po(e){return li(dl(e))}function jo(e,t,n){var o=-1,a=e.length;t<0&&(t=-t>a?0:a+t),(n=n>a?a:n)<0&&(n+=a),a=t>n?0:n-t>>>0,t>>>=0;for(var i=r(a);++o<a;)i[o]=e[o+t];return i}function Ro(e,t){var n;return Lr(e,function(e,r,o){return!(n=t(e,r,o))}),!!n}function Io(e,t,n){var r=0,o=null==e?r:e.length;if("number"==typeof t&&t==t&&o<=L){for(;r<o;){var a=r+o>>>1,i=e[a];null!==i&&!Uu(i)&&(n?i<=t:i<t)?r=a+1:o=a}return o}return Ao(e,t,Pl,n)}function Ao(e,t,n,r){t=n(t);for(var o=0,i=null==e?0:e.length,u=t!=t,l=null===t,c=Uu(t),s=t===a;o<i;){var f=Ln((o+i)/2),p=n(e[f]),d=p!==a,h=null===p,m=p==p,v=Uu(p);if(u)var y=r||m;else y=s?m&&(r||d):l?m&&d&&(r||!h):c?m&&d&&!h&&(r||!v):!h&&!v&&(r?p<=t:p<t);y?o=f+1:i=f}return Hn(i,D)}function Uo(e,t){for(var n=-1,r=e.length,o=0,a=[];++n<r;){var i=e[n],u=t?t(i):i;if(!n||!du(u,l)){var l=u;a[o++]=0===i?0:i}}return a}function Mo(e){return"number"==typeof e?e:Uu(e)?M:+e}function zo(e){if("string"==typeof e)return e;if(yu(e))return Jt(e,zo)+"";if(Uu(e))return pr?pr.call(e):"";var t=e+"";return"0"==t&&1/e==-I?"-0":t}function Do(e,t,n){var r=-1,o=Zt,a=e.length,u=!0,l=[],c=l;if(n)u=!1,o=Xt;else if(a>=i){var s=t?null:xa(e);if(s)return Cn(s);u=!1,o=bn,c=new wr}else c=t?[]:l;e:for(;++r<a;){var f=e[r],p=t?t(f):f;if(f=n||0!==f?f:0,u&&p==p){for(var d=c.length;d--;)if(c[d]===p)continue e;t&&c.push(p),l.push(f)}else o(c,p,n)||(c!==l&&c.push(p),l.push(f))}return l}function Lo(e,t){return null==(e=ti(e,t=Ko(t,e)))||delete e[si(xi(t))]}function Fo(e,t,n,r){return Oo(e,t,n(Yr(e,t)),r)}function Wo(e,t,n,r){for(var o=e.length,a=r?o:-1;(r?a--:++a<o)&&t(e[a],a,e););return n?jo(e,r?0:a,r?a+1:o):jo(e,r?a+1:0,r?o:a)}function Bo(e,t){var n=e;return n instanceof yr&&(n=n.value()),tn(t,function(e,t){return t.func.apply(t.thisArg,en([e],t.args))},n)}function $o(e,t,n){var o=e.length;if(o<2)return o?Do(e[0]):[];for(var a=-1,i=r(o);++a<o;)for(var u=e[a],l=-1;++l<o;)l!=a&&(i[a]=Dr(i[a]||u,e[l],t,n));return Do(Vr(i,1),t,n)}function Vo(e,t,n){for(var r=-1,o=e.length,i=t.length,u={};++r<o;){var l=r<i?t[r]:a;n(u,e[r],l)}return u}function qo(e){return Eu(e)?e:[]}function Ho(e){return"function"==typeof e?e:Pl}function Ko(e,t){return yu(e)?e:Qa(e,t)?[e]:ci(qu(e))}var Qo=ko;function Go(e,t,n){var r=e.length;return n=n===a?r:n,!t&&n>=r?e:jo(e,t,n)}var Yo=Un||function(e){return It.clearTimeout(e)};function Zo(e,t){if(t)return e.slice();var n=e.length,r=Tt?Tt(n):new e.constructor(n);return e.copy(r),r}function Xo(e){var t=new e.constructor(e.byteLength);return new _t(t).set(new _t(e)),t}function Jo(e,t){var n=t?Xo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function ea(e,t){if(e!==t){var n=e!==a,r=null===e,o=e==e,i=Uu(e),u=t!==a,l=null===t,c=t==t,s=Uu(t);if(!l&&!s&&!i&&e>t||i&&u&&c&&!l&&!s||r&&u&&c||!n&&c||!o)return 1;if(!r&&!i&&!s&&e<t||s&&n&&o&&!r&&!i||l&&n&&o||!u&&o||!c)return-1}return 0}function ta(e,t,n,o){for(var a=-1,i=e.length,u=n.length,l=-1,c=t.length,s=qn(i-u,0),f=r(c+s),p=!o;++l<c;)f[l]=t[l];for(;++a<u;)(p||a<i)&&(f[n[a]]=e[a]);for(;s--;)f[l++]=e[a++];return f}function na(e,t,n,o){for(var a=-1,i=e.length,u=-1,l=n.length,c=-1,s=t.length,f=qn(i-l,0),p=r(f+s),d=!o;++a<f;)p[a]=e[a];for(var h=a;++c<s;)p[h+c]=t[c];for(;++u<l;)(d||a<i)&&(p[h+n[u]]=e[a++]);return p}function ra(e,t){var n=-1,o=e.length;for(t||(t=r(o));++n<o;)t[n]=e[n];return t}function oa(e,t,n,r){var o=!n;n||(n={});for(var i=-1,u=t.length;++i<u;){var l=t[i],c=r?r(n[l],e[l],l,n,e):a;c===a&&(c=e[l]),o?Rr(n,l,c):Tr(n,l,c)}return n}function aa(e,t){return function(n,r){var o=yu(n)?Ht:Pr,a=t?t():{};return o(n,e,Ma(r,2),a)}}function ia(e){return ko(function(t,n){var r=-1,o=n.length,i=o>1?n[o-1]:a,u=o>2?n[2]:a;for(i=e.length>3&&"function"==typeof i?(o--,i):a,u&&Ka(n[0],n[1],u)&&(i=o<3?a:i,o=1),t=tt(t);++r<o;){var l=n[r];l&&e(t,l,r,i)}return t})}function ua(e,t){return function(n,r){if(null==n)return n;if(!bu(n))return e(n,r);for(var o=n.length,a=t?o:-1,i=tt(n);(t?a--:++a<o)&&!1!==r(i[a],a,i););return n}}function la(e){return function(t,n,r){for(var o=-1,a=tt(t),i=r(t),u=i.length;u--;){var l=i[e?u:++o];if(!1===n(a[l],l,a))break}return t}}function ca(e){return function(t){var n=Sn(t=qu(t))?Rn(t):a,r=n?n[0]:t.charAt(0),o=n?Go(n,1).join(""):t.slice(1);return r[e]()+o}}function sa(e){return function(t){return tn(kl(vl(t).replace(gt,"")),e,"")}}function fa(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=hr(e.prototype),r=e.apply(n,t);return Ou(r)?r:n}}function pa(e){return function(t,n,r){var o=tt(t);if(!bu(t)){var i=Ma(n,3);t=ol(t),n=function(e){return i(o[e],e,o)}}var u=e(t,n,r);return u>-1?o[i?t[u]:u]:a}}function da(e){return Pa(function(t){var n=t.length,r=n,o=vr.prototype.thru;for(e&&t.reverse();r--;){var i=t[r];if("function"!=typeof i)throw new ot(l);if(o&&!u&&"wrapper"==Aa(i))var u=new vr([],!0)}for(r=u?r:n;++r<n;){var c=Aa(i=t[r]),s="wrapper"==c?Ia(i):a;u=s&&Ga(s[0])&&s[1]==(k|E|_|S)&&!s[4].length&&1==s[9]?u[Aa(s[0])].apply(u,s[3]):1==i.length&&Ga(i)?u[c]():u.thru(i)}return function(){var e=arguments,r=e[0];if(u&&1==e.length&&yu(r))return u.plant(r).value();for(var o=0,a=n?t[o].apply(this,e):r;++o<n;)a=t[o].call(this,a);return a}})}function ha(e,t,n,o,i,u,l,c,s,f){var p=t&k,d=t&y,h=t&g,m=t&(E|w),v=t&N,b=h?a:fa(e);return function y(){for(var g=arguments.length,E=r(g),w=g;w--;)E[w]=arguments[w];if(m)var _=Ua(y),x=function(e,t){for(var n=e.length,r=0;n--;)e[n]===t&&++r;return r}(E,_);if(o&&(E=ta(E,o,i,m)),u&&(E=na(E,u,l,m)),g-=x,m&&g<f){var k=Tn(E,_);return wa(e,t,ha,y.placeholder,n,E,k,c,s,f-g)}var S=d?n:this,N=h?S[e]:e;return g=E.length,c?E=function(e,t){for(var n=e.length,r=Hn(t.length,n),o=ra(e);r--;){var i=t[r];e[r]=Ha(i,n)?o[i]:a}return e}(E,c):v&&g>1&&E.reverse(),p&&s<g&&(E.length=s),this&&this!==It&&this instanceof y&&(N=b||fa(N)),N.apply(S,E)}}function ma(e,t){return function(n,r){return function(e,t,n,r){return Kr(e,function(e,o,a){t(r,n(e),o,a)}),r}(n,e,t(r),{})}}function va(e,t){return function(n,r){var o;if(n===a&&r===a)return t;if(n!==a&&(o=n),r!==a){if(o===a)return r;"string"==typeof n||"string"==typeof r?(n=zo(n),r=zo(r)):(n=Mo(n),r=Mo(r)),o=e(n,r)}return o}}function ya(e){return Pa(function(t){return t=Jt(t,yn(Ma())),ko(function(n){var r=this;return e(t,function(e){return qt(e,r,n)})})})}function ga(e,t){var n=(t=t===a?" ":zo(t)).length;if(n<2)return n?xo(t,e):t;var r=xo(t,Dn(e/jn(t)));return Sn(t)?Go(Rn(r),0,e).join(""):r.slice(0,e)}function ba(e){return function(t,n,o){return o&&"number"!=typeof o&&Ka(t,n,o)&&(n=o=a),t=Fu(t),n===a?(n=t,t=0):n=Fu(n),function(e,t,n,o){for(var a=-1,i=qn(Dn((t-e)/(n||1)),0),u=r(i);i--;)u[o?i:++a]=e,e+=n;return u}(t,n,o=o===a?t<n?1:-1:Fu(o),e)}}function Ea(e){return function(t,n){return"string"==typeof t&&"string"==typeof n||(t=$u(t),n=$u(n)),e(t,n)}}function wa(e,t,n,r,o,i,u,l,c,s){var f=t&E;t|=f?_:x,(t&=~(f?x:_))&b||(t&=~(y|g));var p=[e,t,o,f?i:a,f?u:a,f?a:i,f?a:u,l,c,s],d=n.apply(a,p);return Ga(e)&&ri(d,p),d.placeholder=r,ii(d,e,t)}function _a(e){var t=et[e];return function(e,n){if(e=$u(e),(n=null==n?0:Hn(Wu(n),292))&&Bn(e)){var r=(qu(e)+"e").split("e");return+((r=(qu(t(r[0]+"e"+(+r[1]+n)))+"e").split("e"))[0]+"e"+(+r[1]-n))}return t(e)}}var xa=er&&1/Cn(new er([,-0]))[1]==I?function(e){return new er(e)}:Ul;function ka(e){return function(t){var n=Ba(t);return n==Y?Nn(t):n==ne?Pn(t):function(e,t){return Jt(t,function(t){return[t,e[t]]})}(t,e(t))}}function Sa(e,t,n,o,i,u,c,s){var p=t&g;if(!p&&"function"!=typeof e)throw new ot(l);var d=o?o.length:0;if(d||(t&=~(_|x),o=i=a),c=c===a?c:qn(Wu(c),0),s=s===a?s:Wu(s),d-=i?i.length:0,t&x){var h=o,m=i;o=i=a}var v=p?a:Ia(e),N=[e,t,n,o,i,h,m,u,c,s];if(v&&function(e,t){var n=e[1],r=t[1],o=n|r,a=o<(y|g|k),i=r==k&&n==E||r==k&&n==S&&e[7].length<=t[8]||r==(k|S)&&t[7].length<=t[8]&&n==E;if(!a&&!i)return e;r&y&&(e[2]=t[2],o|=n&y?0:b);var u=t[3];if(u){var l=e[3];e[3]=l?ta(l,u,t[4]):u,e[4]=l?Tn(e[3],f):t[4]}(u=t[5])&&(l=e[5],e[5]=l?na(l,u,t[6]):u,e[6]=l?Tn(e[5],f):t[6]);(u=t[7])&&(e[7]=u);r&k&&(e[8]=null==e[8]?t[8]:Hn(e[8],t[8]));null==e[9]&&(e[9]=t[9]);e[0]=t[0],e[1]=o}(N,v),e=N[0],t=N[1],n=N[2],o=N[3],i=N[4],!(s=N[9]=N[9]===a?p?0:e.length:qn(N[9]-d,0))&&t&(E|w)&&(t&=~(E|w)),t&&t!=y)O=t==E||t==w?function(e,t,n){var o=fa(e);return function i(){for(var u=arguments.length,l=r(u),c=u,s=Ua(i);c--;)l[c]=arguments[c];var f=u<3&&l[0]!==s&&l[u-1]!==s?[]:Tn(l,s);return(u-=f.length)<n?wa(e,t,ha,i.placeholder,a,l,f,a,a,n-u):qt(this&&this!==It&&this instanceof i?o:e,this,l)}}(e,t,s):t!=_&&t!=(y|_)||i.length?ha.apply(a,N):function(e,t,n,o){var a=t&y,i=fa(e);return function t(){for(var u=-1,l=arguments.length,c=-1,s=o.length,f=r(s+l),p=this&&this!==It&&this instanceof t?i:e;++c<s;)f[c]=o[c];for(;l--;)f[c++]=arguments[++u];return qt(p,a?n:this,f)}}(e,t,n,o);else var O=function(e,t,n){var r=t&y,o=fa(e);return function t(){return(this&&this!==It&&this instanceof t?o:e).apply(r?n:this,arguments)}}(e,t,n);return ii((v?To:ri)(O,N),e,t)}function Na(e,t,n,r){return e===a||du(e,ut[n])&&!st.call(r,n)?t:e}function Oa(e,t,n,r,o,i){return Ou(e)&&Ou(t)&&(i.set(t,e),vo(e,t,a,Oa,i),i.delete(t)),e}function Ta(e){return ju(e)?a:e}function Ca(e,t,n,r,o,i){var u=n&m,l=e.length,c=t.length;if(l!=c&&!(u&&c>l))return!1;var s=i.get(e);if(s&&i.get(t))return s==t;var f=-1,p=!0,d=n&v?new wr:a;for(i.set(e,t),i.set(t,e);++f<l;){var h=e[f],y=t[f];if(r)var g=u?r(y,h,f,t,e,i):r(h,y,f,e,t,i);if(g!==a){if(g)continue;p=!1;break}if(d){if(!rn(t,function(e,t){if(!bn(d,t)&&(h===e||o(h,e,n,r,i)))return d.push(t)})){p=!1;break}}else if(h!==y&&!o(h,y,n,r,i)){p=!1;break}}return i.delete(e),i.delete(t),p}function Pa(e){return ai(ei(e,a,gi),e+"")}function ja(e){return Zr(e,ol,Fa)}function Ra(e){return Zr(e,al,Wa)}var Ia=rr?function(e){return rr.get(e)}:Ul;function Aa(e){for(var t=e.name+"",n=or[t],r=st.call(or,t)?n.length:0;r--;){var o=n[r],a=o.func;if(null==a||a==e)return o.name}return t}function Ua(e){return(st.call(dr,"placeholder")?dr:e).placeholder}function Ma(){var e=dr.iteratee||jl;return e=e===jl?lo:e,arguments.length?e(arguments[0],arguments[1]):e}function za(e,t){var n,r,o=e.__data__;return("string"==(r=typeof(n=t))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof t?"string":"hash"]:o.map}function Da(e){for(var t=ol(e),n=t.length;n--;){var r=t[n],o=e[r];t[n]=[r,o,Xa(o)]}return t}function La(e,t){var n=function(e,t){return null==e?a:e[t]}(e,t);return uo(n)?n:a}var Fa=Fn?function(e){return null==e?[]:(e=tt(e),Yt(Fn(e),function(t){return At.call(e,t)}))}:Bl,Wa=Fn?function(e){for(var t=[];e;)en(t,Fa(e)),e=jt(e);return t}:Bl,Ba=Xr;function $a(e,t,n){for(var r=-1,o=(t=Ko(t,e)).length,a=!1;++r<o;){var i=si(t[r]);if(!(a=null!=e&&n(e,i)))break;e=e[i]}return a||++r!=o?a:!!(o=null==e?0:e.length)&&Nu(o)&&Ha(i,o)&&(yu(e)||vu(e))}function Va(e){return"function"!=typeof e.constructor||Za(e)?{}:hr(jt(e))}function qa(e){return yu(e)||vu(e)||!!(zt&&e&&e[zt])}function Ha(e,t){var n=typeof e;return!!(t=null==t?A:t)&&("number"==n||"symbol"!=n&&Qe.test(e))&&e>-1&&e%1==0&&e<t}function Ka(e,t,n){if(!Ou(n))return!1;var r=typeof t;return!!("number"==r?bu(n)&&Ha(t,n.length):"string"==r&&t in n)&&du(n[t],e)}function Qa(e,t){if(yu(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!Uu(e))||(Pe.test(e)||!Ce.test(e)||null!=t&&e in tt(t))}function Ga(e){var t=Aa(e),n=dr[t];if("function"!=typeof n||!(t in yr.prototype))return!1;if(e===n)return!0;var r=Ia(n);return!!r&&e===r[0]}(Zn&&Ba(new Zn(new ArrayBuffer(1)))!=ce||Xn&&Ba(new Xn)!=Y||Jn&&"[object Promise]"!=Ba(Jn.resolve())||er&&Ba(new er)!=ne||tr&&Ba(new tr)!=ie)&&(Ba=function(e){var t=Xr(e),n=t==J?e.constructor:a,r=n?fi(n):"";if(r)switch(r){case ar:return ce;case ir:return Y;case ur:return"[object Promise]";case lr:return ne;case cr:return ie}return t});var Ya=lt?ku:$l;function Za(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||ut)}function Xa(e){return e==e&&!Ou(e)}function Ja(e,t){return function(n){return null!=n&&(n[e]===t&&(t!==a||e in tt(n)))}}function ei(e,t,n){return t=qn(t===a?e.length-1:t,0),function(){for(var o=arguments,a=-1,i=qn(o.length-t,0),u=r(i);++a<i;)u[a]=o[t+a];a=-1;for(var l=r(t+1);++a<t;)l[a]=o[a];return l[t]=n(u),qt(e,this,l)}}function ti(e,t){return t.length<2?e:Yr(e,jo(t,0,-1))}function ni(e,t){if(("constructor"!==t||"function"!=typeof e[t])&&"__proto__"!=t)return e[t]}var ri=ui(To),oi=zn||function(e,t){return It.setTimeout(e,t)},ai=ui(Co);function ii(e,t,n){var r=t+"";return ai(e,function(e,t){var n=t.length;if(!n)return e;var r=n-1;return t[r]=(n>1?"& ":"")+t[r],t=t.join(n>2?", ":" "),e.replace(ze,"{\n/* [wrapped with "+t+"] */\n")}(r,function(e,t){return Kt(F,function(n){var r="_."+n[0];t&n[1]&&!Zt(e,r)&&e.push(r)}),e.sort()}(function(e){var t=e.match(De);return t?t[1].split(Le):[]}(r),n)))}function ui(e){var t=0,n=0;return function(){var r=Kn(),o=P-(r-n);if(n=r,o>0){if(++t>=C)return arguments[0]}else t=0;return e.apply(a,arguments)}}function li(e,t){var n=-1,r=e.length,o=r-1;for(t=t===a?r:t;++n<t;){var i=_o(n,o),u=e[i];e[i]=e[n],e[n]=u}return e.length=t,e}var ci=function(e){var t=uu(e,function(e){return n.size===s&&n.clear(),e}),n=t.cache;return t}(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(je,function(e,n,r,o){t.push(r?o.replace(We,"$1"):n||e)}),t});function si(e){if("string"==typeof e||Uu(e))return e;var t=e+"";return"0"==t&&1/e==-I?"-0":t}function fi(e){if(null!=e){try{return ct.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function pi(e){if(e instanceof yr)return e.clone();var t=new vr(e.__wrapped__,e.__chain__);return t.__actions__=ra(e.__actions__),t.__index__=e.__index__,t.__values__=e.__values__,t}var di=ko(function(e,t){return Eu(e)?Dr(e,Vr(t,1,Eu,!0)):[]}),hi=ko(function(e,t){var n=xi(t);return Eu(n)&&(n=a),Eu(e)?Dr(e,Vr(t,1,Eu,!0),Ma(n,2)):[]}),mi=ko(function(e,t){var n=xi(t);return Eu(n)&&(n=a),Eu(e)?Dr(e,Vr(t,1,Eu,!0),a,n):[]});function vi(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Wu(n);return o<0&&(o=qn(r+o,0)),un(e,Ma(t,3),o)}function yi(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r-1;return n!==a&&(o=Wu(n),o=n<0?qn(r+o,0):Hn(o,r-1)),un(e,Ma(t,3),o,!0)}function gi(e){return(null==e?0:e.length)?Vr(e,1):[]}function bi(e){return e&&e.length?e[0]:a}var Ei=ko(function(e){var t=Jt(e,qo);return t.length&&t[0]===e[0]?no(t):[]}),wi=ko(function(e){var t=xi(e),n=Jt(e,qo);return t===xi(n)?t=a:n.pop(),n.length&&n[0]===e[0]?no(n,Ma(t,2)):[]}),_i=ko(function(e){var t=xi(e),n=Jt(e,qo);return(t="function"==typeof t?t:a)&&n.pop(),n.length&&n[0]===e[0]?no(n,a,t):[]});function xi(e){var t=null==e?0:e.length;return t?e[t-1]:a}var ki=ko(Si);function Si(e,t){return e&&e.length&&t&&t.length?Eo(e,t):e}var Ni=Pa(function(e,t){var n=null==e?0:e.length,r=Ir(e,t);return wo(e,Jt(t,function(e){return Ha(e,n)?+e:e}).sort(ea)),r});function Oi(e){return null==e?e:Yn.call(e)}var Ti=ko(function(e){return Do(Vr(e,1,Eu,!0))}),Ci=ko(function(e){var t=xi(e);return Eu(t)&&(t=a),Do(Vr(e,1,Eu,!0),Ma(t,2))}),Pi=ko(function(e){var t=xi(e);return t="function"==typeof t?t:a,Do(Vr(e,1,Eu,!0),a,t)});function ji(e){if(!e||!e.length)return[];var t=0;return e=Yt(e,function(e){if(Eu(e))return t=qn(e.length,t),!0}),vn(t,function(t){return Jt(e,pn(t))})}function Ri(e,t){if(!e||!e.length)return[];var n=ji(e);return null==t?n:Jt(n,function(e){return qt(t,a,e)})}var Ii=ko(function(e,t){return Eu(e)?Dr(e,t):[]}),Ai=ko(function(e){return $o(Yt(e,Eu))}),Ui=ko(function(e){var t=xi(e);return Eu(t)&&(t=a),$o(Yt(e,Eu),Ma(t,2))}),Mi=ko(function(e){var t=xi(e);return t="function"==typeof t?t:a,$o(Yt(e,Eu),a,t)}),zi=ko(ji);var Di=ko(function(e){var t=e.length,n=t>1?e[t-1]:a;return n="function"==typeof n?(e.pop(),n):a,Ri(e,n)});function Li(e){var t=dr(e);return t.__chain__=!0,t}function Fi(e,t){return t(e)}var Wi=Pa(function(e){var t=e.length,n=t?e[0]:0,r=this.__wrapped__,o=function(t){return Ir(t,e)};return!(t>1||this.__actions__.length)&&r instanceof yr&&Ha(n)?((r=r.slice(n,+n+(t?1:0))).__actions__.push({func:Fi,args:[o],thisArg:a}),new vr(r,this.__chain__).thru(function(e){return t&&!e.length&&e.push(a),e})):this.thru(o)});var Bi=aa(function(e,t,n){st.call(e,n)?++e[n]:Rr(e,n,1)});var $i=pa(vi),Vi=pa(yi);function qi(e,t){return(yu(e)?Kt:Lr)(e,Ma(t,3))}function Hi(e,t){return(yu(e)?Qt:Fr)(e,Ma(t,3))}var Ki=aa(function(e,t,n){st.call(e,n)?e[n].push(t):Rr(e,n,[t])});var Qi=ko(function(e,t,n){var o=-1,a="function"==typeof t,i=bu(e)?r(e.length):[];return Lr(e,function(e){i[++o]=a?qt(t,e,n):ro(e,t,n)}),i}),Gi=aa(function(e,t,n){Rr(e,n,t)});function Yi(e,t){return(yu(e)?Jt:po)(e,Ma(t,3))}var Zi=aa(function(e,t,n){e[n?0:1].push(t)},function(){return[[],[]]});var Xi=ko(function(e,t){if(null==e)return[];var n=t.length;return n>1&&Ka(e,t[0],t[1])?t=[]:n>2&&Ka(t[0],t[1],t[2])&&(t=[t[0]]),go(e,Vr(t,1),[])}),Ji=Mn||function(){return It.Date.now()};function eu(e,t,n){return t=n?a:t,t=e&&null==t?e.length:t,Sa(e,k,a,a,a,a,t)}function tu(e,t){var n;if("function"!=typeof t)throw new ot(l);return e=Wu(e),function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=a),n}}var nu=ko(function(e,t,n){var r=y;if(n.length){var o=Tn(n,Ua(nu));r|=_}return Sa(e,r,t,n,o)}),ru=ko(function(e,t,n){var r=y|g;if(n.length){var o=Tn(n,Ua(ru));r|=_}return Sa(t,r,e,n,o)});function ou(e,t,n){var r,o,i,u,c,s,f=0,p=!1,d=!1,h=!0;if("function"!=typeof e)throw new ot(l);function m(t){var n=r,i=o;return r=o=a,f=t,u=e.apply(i,n)}function v(e){var n=e-s;return s===a||n>=t||n<0||d&&e-f>=i}function y(){var e=Ji();if(v(e))return g(e);c=oi(y,function(e){var n=t-(e-s);return d?Hn(n,i-(e-f)):n}(e))}function g(e){return c=a,h&&r?m(e):(r=o=a,u)}function b(){var e=Ji(),n=v(e);if(r=arguments,o=this,s=e,n){if(c===a)return function(e){return f=e,c=oi(y,t),p?m(e):u}(s);if(d)return Yo(c),c=oi(y,t),m(s)}return c===a&&(c=oi(y,t)),u}return t=$u(t)||0,Ou(n)&&(p=!!n.leading,i=(d="maxWait"in n)?qn($u(n.maxWait)||0,t):i,h="trailing"in n?!!n.trailing:h),b.cancel=function(){c!==a&&Yo(c),f=0,r=s=o=c=a},b.flush=function(){return c===a?u:g(Ji())},b}var au=ko(function(e,t){return zr(e,1,t)}),iu=ko(function(e,t,n){return zr(e,$u(t)||0,n)});function uu(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new ot(l);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],a=n.cache;if(a.has(o))return a.get(o);var i=e.apply(this,r);return n.cache=a.set(o,i)||a,i};return n.cache=new(uu.Cache||Er),n}function lu(e){if("function"!=typeof e)throw new ot(l);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}uu.Cache=Er;var cu=Qo(function(e,t){var n=(t=1==t.length&&yu(t[0])?Jt(t[0],yn(Ma())):Jt(Vr(t,1),yn(Ma()))).length;return ko(function(r){for(var o=-1,a=Hn(r.length,n);++o<a;)r[o]=t[o].call(this,r[o]);return qt(e,this,r)})}),su=ko(function(e,t){var n=Tn(t,Ua(su));return Sa(e,_,a,t,n)}),fu=ko(function(e,t){var n=Tn(t,Ua(fu));return Sa(e,x,a,t,n)}),pu=Pa(function(e,t){return Sa(e,S,a,a,a,t)});function du(e,t){return e===t||e!=e&&t!=t}var hu=Ea(Jr),mu=Ea(function(e,t){return e>=t}),vu=oo(function(){return arguments}())?oo:function(e){return Tu(e)&&st.call(e,"callee")&&!At.call(e,"callee")},yu=r.isArray,gu=Lt?yn(Lt):function(e){return Tu(e)&&Xr(e)==le};function bu(e){return null!=e&&Nu(e.length)&&!ku(e)}function Eu(e){return Tu(e)&&bu(e)}var wu=Wn||$l,_u=Ft?yn(Ft):function(e){return Tu(e)&&Xr(e)==q};function xu(e){if(!Tu(e))return!1;var t=Xr(e);return t==K||t==H||"string"==typeof e.message&&"string"==typeof e.name&&!ju(e)}function ku(e){if(!Ou(e))return!1;var t=Xr(e);return t==Q||t==G||t==$||t==ee}function Su(e){return"number"==typeof e&&e==Wu(e)}function Nu(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=A}function Ou(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function Tu(e){return null!=e&&"object"==typeof e}var Cu=Wt?yn(Wt):function(e){return Tu(e)&&Ba(e)==Y};function Pu(e){return"number"==typeof e||Tu(e)&&Xr(e)==Z}function ju(e){if(!Tu(e)||Xr(e)!=J)return!1;var t=jt(e);if(null===t)return!0;var n=st.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&ct.call(n)==ht}var Ru=Bt?yn(Bt):function(e){return Tu(e)&&Xr(e)==te};var Iu=$t?yn($t):function(e){return Tu(e)&&Ba(e)==ne};function Au(e){return"string"==typeof e||!yu(e)&&Tu(e)&&Xr(e)==re}function Uu(e){return"symbol"==typeof e||Tu(e)&&Xr(e)==oe}var Mu=Vt?yn(Vt):function(e){return Tu(e)&&Nu(e.length)&&!!Nt[Xr(e)]};var zu=Ea(fo),Du=Ea(function(e,t){return e<=t});function Lu(e){if(!e)return[];if(bu(e))return Au(e)?Rn(e):ra(e);if(Dt&&e[Dt])return function(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}(e[Dt]());var t=Ba(e);return(t==Y?Nn:t==ne?Cn:dl)(e)}function Fu(e){return e?(e=$u(e))===I||e===-I?(e<0?-1:1)*U:e==e?e:0:0===e?e:0}function Wu(e){var t=Fu(e),n=t%1;return t==t?n?t-n:t:0}function Bu(e){return e?Ar(Wu(e),0,z):0}function $u(e){if("number"==typeof e)return e;if(Uu(e))return M;if(Ou(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=Ou(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(Ae,"");var n=qe.test(e);return n||Ke.test(e)?Pt(e.slice(2),n?2:8):Ve.test(e)?M:+e}function Vu(e){return oa(e,al(e))}function qu(e){return null==e?"":zo(e)}var Hu=ia(function(e,t){if(Za(t)||bu(t))oa(t,ol(t),e);else for(var n in t)st.call(t,n)&&Tr(e,n,t[n])}),Ku=ia(function(e,t){oa(t,al(t),e)}),Qu=ia(function(e,t,n,r){oa(t,al(t),e,r)}),Gu=ia(function(e,t,n,r){oa(t,ol(t),e,r)}),Yu=Pa(Ir);var Zu=ko(function(e,t){e=tt(e);var n=-1,r=t.length,o=r>2?t[2]:a;for(o&&Ka(t[0],t[1],o)&&(r=1);++n<r;)for(var i=t[n],u=al(i),l=-1,c=u.length;++l<c;){var s=u[l],f=e[s];(f===a||du(f,ut[s])&&!st.call(e,s))&&(e[s]=i[s])}return e}),Xu=ko(function(e){return e.push(a,Oa),qt(ul,a,e)});function Ju(e,t,n){var r=null==e?a:Yr(e,t);return r===a?n:r}function el(e,t){return null!=e&&$a(e,t,to)}var tl=ma(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=dt.call(t)),e[t]=n},Ol(Pl)),nl=ma(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=dt.call(t)),st.call(e,t)?e[t].push(n):e[t]=[n]},Ma),rl=ko(ro);function ol(e){return bu(e)?xr(e):co(e)}function al(e){return bu(e)?xr(e,!0):so(e)}var il=ia(function(e,t,n){vo(e,t,n)}),ul=ia(function(e,t,n,r){vo(e,t,n,r)}),ll=Pa(function(e,t){var n={};if(null==e)return n;var r=!1;t=Jt(t,function(t){return t=Ko(t,e),r||(r=t.length>1),t}),oa(e,Ra(e),n),r&&(n=Ur(n,p|d|h,Ta));for(var o=t.length;o--;)Lo(n,t[o]);return n});var cl=Pa(function(e,t){return null==e?{}:function(e,t){return bo(e,t,function(t,n){return el(e,n)})}(e,t)});function sl(e,t){if(null==e)return{};var n=Jt(Ra(e),function(e){return[e]});return t=Ma(t),bo(e,n,function(e,n){return t(e,n[0])})}var fl=ka(ol),pl=ka(al);function dl(e){return null==e?[]:gn(e,ol(e))}var hl=sa(function(e,t,n){return t=t.toLowerCase(),e+(n?ml(t):t)});function ml(e){return xl(qu(e).toLowerCase())}function vl(e){return(e=qu(e))&&e.replace(Ge,_n).replace(bt,"")}var yl=sa(function(e,t,n){return e+(n?"-":"")+t.toLowerCase()}),gl=sa(function(e,t,n){return e+(n?" ":"")+t.toLowerCase()}),bl=ca("toLowerCase");var El=sa(function(e,t,n){return e+(n?"_":"")+t.toLowerCase()});var wl=sa(function(e,t,n){return e+(n?" ":"")+xl(t)});var _l=sa(function(e,t,n){return e+(n?" ":"")+t.toUpperCase()}),xl=ca("toUpperCase");function kl(e,t,n){return e=qu(e),(t=n?a:t)===a?function(e){return xt.test(e)}(e)?function(e){return e.match(wt)||[]}(e):function(e){return e.match(Fe)||[]}(e):e.match(t)||[]}var Sl=ko(function(e,t){try{return qt(e,a,t)}catch(e){return xu(e)?e:new Xe(e)}}),Nl=Pa(function(e,t){return Kt(t,function(t){t=si(t),Rr(e,t,nu(e[t],e))}),e});function Ol(e){return function(){return e}}var Tl=da(),Cl=da(!0);function Pl(e){return e}function jl(e){return lo("function"==typeof e?e:Ur(e,p))}var Rl=ko(function(e,t){return function(n){return ro(n,e,t)}}),Il=ko(function(e,t){return function(n){return ro(e,n,t)}});function Al(e,t,n){var r=ol(t),o=Gr(t,r);null!=n||Ou(t)&&(o.length||!r.length)||(n=t,t=e,e=this,o=Gr(t,ol(t)));var a=!(Ou(n)&&"chain"in n&&!n.chain),i=ku(e);return Kt(o,function(n){var r=t[n];e[n]=r,i&&(e.prototype[n]=function(){var t=this.__chain__;if(a||t){var n=e(this.__wrapped__),o=n.__actions__=ra(this.__actions__);return o.push({func:r,args:arguments,thisArg:e}),n.__chain__=t,n}return r.apply(e,en([this.value()],arguments))})}),e}function Ul(){}var Ml=ya(Jt),zl=ya(Gt),Dl=ya(rn);function Ll(e){return Qa(e)?pn(si(e)):function(e){return function(t){return Yr(t,e)}}(e)}var Fl=ba(),Wl=ba(!0);function Bl(){return[]}function $l(){return!1}var Vl=va(function(e,t){return e+t},0),ql=_a("ceil"),Hl=va(function(e,t){return e/t},1),Kl=_a("floor");var Ql,Gl=va(function(e,t){return e*t},1),Yl=_a("round"),Zl=va(function(e,t){return e-t},0);return dr.after=function(e,t){if("function"!=typeof t)throw new ot(l);return e=Wu(e),function(){if(--e<1)return t.apply(this,arguments)}},dr.ary=eu,dr.assign=Hu,dr.assignIn=Ku,dr.assignInWith=Qu,dr.assignWith=Gu,dr.at=Yu,dr.before=tu,dr.bind=nu,dr.bindAll=Nl,dr.bindKey=ru,dr.castArray=function(){if(!arguments.length)return[];var e=arguments[0];return yu(e)?e:[e]},dr.chain=Li,dr.chunk=function(e,t,n){t=(n?Ka(e,t,n):t===a)?1:qn(Wu(t),0);var o=null==e?0:e.length;if(!o||t<1)return[];for(var i=0,u=0,l=r(Dn(o/t));i<o;)l[u++]=jo(e,i,i+=t);return l},dr.compact=function(e){for(var t=-1,n=null==e?0:e.length,r=0,o=[];++t<n;){var a=e[t];a&&(o[r++]=a)}return o},dr.concat=function(){var e=arguments.length;if(!e)return[];for(var t=r(e-1),n=arguments[0],o=e;o--;)t[o-1]=arguments[o];return en(yu(n)?ra(n):[n],Vr(t,1))},dr.cond=function(e){var t=null==e?0:e.length,n=Ma();return e=t?Jt(e,function(e){if("function"!=typeof e[1])throw new ot(l);return[n(e[0]),e[1]]}):[],ko(function(n){for(var r=-1;++r<t;){var o=e[r];if(qt(o[0],this,n))return qt(o[1],this,n)}})},dr.conforms=function(e){return function(e){var t=ol(e);return function(n){return Mr(n,e,t)}}(Ur(e,p))},dr.constant=Ol,dr.countBy=Bi,dr.create=function(e,t){var n=hr(e);return null==t?n:jr(n,t)},dr.curry=function e(t,n,r){var o=Sa(t,E,a,a,a,a,a,n=r?a:n);return o.placeholder=e.placeholder,o},dr.curryRight=function e(t,n,r){var o=Sa(t,w,a,a,a,a,a,n=r?a:n);return o.placeholder=e.placeholder,o},dr.debounce=ou,dr.defaults=Zu,dr.defaultsDeep=Xu,dr.defer=au,dr.delay=iu,dr.difference=di,dr.differenceBy=hi,dr.differenceWith=mi,dr.drop=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,(t=n||t===a?1:Wu(t))<0?0:t,r):[]},dr.dropRight=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,0,(t=r-(t=n||t===a?1:Wu(t)))<0?0:t):[]},dr.dropRightWhile=function(e,t){return e&&e.length?Wo(e,Ma(t,3),!0,!0):[]},dr.dropWhile=function(e,t){return e&&e.length?Wo(e,Ma(t,3),!0):[]},dr.fill=function(e,t,n,r){var o=null==e?0:e.length;return o?(n&&"number"!=typeof n&&Ka(e,t,n)&&(n=0,r=o),function(e,t,n,r){var o=e.length;for((n=Wu(n))<0&&(n=-n>o?0:o+n),(r=r===a||r>o?o:Wu(r))<0&&(r+=o),r=n>r?0:Bu(r);n<r;)e[n++]=t;return e}(e,t,n,r)):[]},dr.filter=function(e,t){return(yu(e)?Yt:$r)(e,Ma(t,3))},dr.flatMap=function(e,t){return Vr(Yi(e,t),1)},dr.flatMapDeep=function(e,t){return Vr(Yi(e,t),I)},dr.flatMapDepth=function(e,t,n){return n=n===a?1:Wu(n),Vr(Yi(e,t),n)},dr.flatten=gi,dr.flattenDeep=function(e){return(null==e?0:e.length)?Vr(e,I):[]},dr.flattenDepth=function(e,t){return(null==e?0:e.length)?Vr(e,t=t===a?1:Wu(t)):[]},dr.flip=function(e){return Sa(e,N)},dr.flow=Tl,dr.flowRight=Cl,dr.fromPairs=function(e){for(var t=-1,n=null==e?0:e.length,r={};++t<n;){var o=e[t];r[o[0]]=o[1]}return r},dr.functions=function(e){return null==e?[]:Gr(e,ol(e))},dr.functionsIn=function(e){return null==e?[]:Gr(e,al(e))},dr.groupBy=Ki,dr.initial=function(e){return(null==e?0:e.length)?jo(e,0,-1):[]},dr.intersection=Ei,dr.intersectionBy=wi,dr.intersectionWith=_i,dr.invert=tl,dr.invertBy=nl,dr.invokeMap=Qi,dr.iteratee=jl,dr.keyBy=Gi,dr.keys=ol,dr.keysIn=al,dr.map=Yi,dr.mapKeys=function(e,t){var n={};return t=Ma(t,3),Kr(e,function(e,r,o){Rr(n,t(e,r,o),e)}),n},dr.mapValues=function(e,t){var n={};return t=Ma(t,3),Kr(e,function(e,r,o){Rr(n,r,t(e,r,o))}),n},dr.matches=function(e){return ho(Ur(e,p))},dr.matchesProperty=function(e,t){return mo(e,Ur(t,p))},dr.memoize=uu,dr.merge=il,dr.mergeWith=ul,dr.method=Rl,dr.methodOf=Il,dr.mixin=Al,dr.negate=lu,dr.nthArg=function(e){return e=Wu(e),ko(function(t){return yo(t,e)})},dr.omit=ll,dr.omitBy=function(e,t){return sl(e,lu(Ma(t)))},dr.once=function(e){return tu(2,e)},dr.orderBy=function(e,t,n,r){return null==e?[]:(yu(t)||(t=null==t?[]:[t]),yu(n=r?a:n)||(n=null==n?[]:[n]),go(e,t,n))},dr.over=Ml,dr.overArgs=cu,dr.overEvery=zl,dr.overSome=Dl,dr.partial=su,dr.partialRight=fu,dr.partition=Zi,dr.pick=cl,dr.pickBy=sl,dr.property=Ll,dr.propertyOf=function(e){return function(t){return null==e?a:Yr(e,t)}},dr.pull=ki,dr.pullAll=Si,dr.pullAllBy=function(e,t,n){return e&&e.length&&t&&t.length?Eo(e,t,Ma(n,2)):e},dr.pullAllWith=function(e,t,n){return e&&e.length&&t&&t.length?Eo(e,t,a,n):e},dr.pullAt=Ni,dr.range=Fl,dr.rangeRight=Wl,dr.rearg=pu,dr.reject=function(e,t){return(yu(e)?Yt:$r)(e,lu(Ma(t,3)))},dr.remove=function(e,t){var n=[];if(!e||!e.length)return n;var r=-1,o=[],a=e.length;for(t=Ma(t,3);++r<a;){var i=e[r];t(i,r,e)&&(n.push(i),o.push(r))}return wo(e,o),n},dr.rest=function(e,t){if("function"!=typeof e)throw new ot(l);return ko(e,t=t===a?t:Wu(t))},dr.reverse=Oi,dr.sampleSize=function(e,t,n){return t=(n?Ka(e,t,n):t===a)?1:Wu(t),(yu(e)?Sr:No)(e,t)},dr.set=function(e,t,n){return null==e?e:Oo(e,t,n)},dr.setWith=function(e,t,n,r){return r="function"==typeof r?r:a,null==e?e:Oo(e,t,n,r)},dr.shuffle=function(e){return(yu(e)?Nr:Po)(e)},dr.slice=function(e,t,n){var r=null==e?0:e.length;return r?(n&&"number"!=typeof n&&Ka(e,t,n)?(t=0,n=r):(t=null==t?0:Wu(t),n=n===a?r:Wu(n)),jo(e,t,n)):[]},dr.sortBy=Xi,dr.sortedUniq=function(e){return e&&e.length?Uo(e):[]},dr.sortedUniqBy=function(e,t){return e&&e.length?Uo(e,Ma(t,2)):[]},dr.split=function(e,t,n){return n&&"number"!=typeof n&&Ka(e,t,n)&&(t=n=a),(n=n===a?z:n>>>0)?(e=qu(e))&&("string"==typeof t||null!=t&&!Ru(t))&&!(t=zo(t))&&Sn(e)?Go(Rn(e),0,n):e.split(t,n):[]},dr.spread=function(e,t){if("function"!=typeof e)throw new ot(l);return t=null==t?0:qn(Wu(t),0),ko(function(n){var r=n[t],o=Go(n,0,t);return r&&en(o,r),qt(e,this,o)})},dr.tail=function(e){var t=null==e?0:e.length;return t?jo(e,1,t):[]},dr.take=function(e,t,n){return e&&e.length?jo(e,0,(t=n||t===a?1:Wu(t))<0?0:t):[]},dr.takeRight=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,(t=r-(t=n||t===a?1:Wu(t)))<0?0:t,r):[]},dr.takeRightWhile=function(e,t){return e&&e.length?Wo(e,Ma(t,3),!1,!0):[]},dr.takeWhile=function(e,t){return e&&e.length?Wo(e,Ma(t,3)):[]},dr.tap=function(e,t){return t(e),e},dr.throttle=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw new ot(l);return Ou(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),ou(e,t,{leading:r,maxWait:t,trailing:o})},dr.thru=Fi,dr.toArray=Lu,dr.toPairs=fl,dr.toPairsIn=pl,dr.toPath=function(e){return yu(e)?Jt(e,si):Uu(e)?[e]:ra(ci(qu(e)))},dr.toPlainObject=Vu,dr.transform=function(e,t,n){var r=yu(e),o=r||wu(e)||Mu(e);if(t=Ma(t,4),null==n){var a=e&&e.constructor;n=o?r?new a:[]:Ou(e)&&ku(a)?hr(jt(e)):{}}return(o?Kt:Kr)(e,function(e,r,o){return t(n,e,r,o)}),n},dr.unary=function(e){return eu(e,1)},dr.union=Ti,dr.unionBy=Ci,dr.unionWith=Pi,dr.uniq=function(e){return e&&e.length?Do(e):[]},dr.uniqBy=function(e,t){return e&&e.length?Do(e,Ma(t,2)):[]},dr.uniqWith=function(e,t){return t="function"==typeof t?t:a,e&&e.length?Do(e,a,t):[]},dr.unset=function(e,t){return null==e||Lo(e,t)},dr.unzip=ji,dr.unzipWith=Ri,dr.update=function(e,t,n){return null==e?e:Fo(e,t,Ho(n))},dr.updateWith=function(e,t,n,r){return r="function"==typeof r?r:a,null==e?e:Fo(e,t,Ho(n),r)},dr.values=dl,dr.valuesIn=function(e){return null==e?[]:gn(e,al(e))},dr.without=Ii,dr.words=kl,dr.wrap=function(e,t){return su(Ho(t),e)},dr.xor=Ai,dr.xorBy=Ui,dr.xorWith=Mi,dr.zip=zi,dr.zipObject=function(e,t){return Vo(e||[],t||[],Tr)},dr.zipObjectDeep=function(e,t){return Vo(e||[],t||[],Oo)},dr.zipWith=Di,dr.entries=fl,dr.entriesIn=pl,dr.extend=Ku,dr.extendWith=Qu,Al(dr,dr),dr.add=Vl,dr.attempt=Sl,dr.camelCase=hl,dr.capitalize=ml,dr.ceil=ql,dr.clamp=function(e,t,n){return n===a&&(n=t,t=a),n!==a&&(n=(n=$u(n))==n?n:0),t!==a&&(t=(t=$u(t))==t?t:0),Ar($u(e),t,n)},dr.clone=function(e){return Ur(e,h)},dr.cloneDeep=function(e){return Ur(e,p|h)},dr.cloneDeepWith=function(e,t){return Ur(e,p|h,t="function"==typeof t?t:a)},dr.cloneWith=function(e,t){return Ur(e,h,t="function"==typeof t?t:a)},dr.conformsTo=function(e,t){return null==t||Mr(e,t,ol(t))},dr.deburr=vl,dr.defaultTo=function(e,t){return null==e||e!=e?t:e},dr.divide=Hl,dr.endsWith=function(e,t,n){e=qu(e),t=zo(t);var r=e.length,o=n=n===a?r:Ar(Wu(n),0,r);return(n-=t.length)>=0&&e.slice(n,o)==t},dr.eq=du,dr.escape=function(e){return(e=qu(e))&&Se.test(e)?e.replace(xe,xn):e},dr.escapeRegExp=function(e){return(e=qu(e))&&Ie.test(e)?e.replace(Re,"\\$&"):e},dr.every=function(e,t,n){var r=yu(e)?Gt:Wr;return n&&Ka(e,t,n)&&(t=a),r(e,Ma(t,3))},dr.find=$i,dr.findIndex=vi,dr.findKey=function(e,t){return an(e,Ma(t,3),Kr)},dr.findLast=Vi,dr.findLastIndex=yi,dr.findLastKey=function(e,t){return an(e,Ma(t,3),Qr)},dr.floor=Kl,dr.forEach=qi,dr.forEachRight=Hi,dr.forIn=function(e,t){return null==e?e:qr(e,Ma(t,3),al)},dr.forInRight=function(e,t){return null==e?e:Hr(e,Ma(t,3),al)},dr.forOwn=function(e,t){return e&&Kr(e,Ma(t,3))},dr.forOwnRight=function(e,t){return e&&Qr(e,Ma(t,3))},dr.get=Ju,dr.gt=hu,dr.gte=mu,dr.has=function(e,t){return null!=e&&$a(e,t,eo)},dr.hasIn=el,dr.head=bi,dr.identity=Pl,dr.includes=function(e,t,n,r){e=bu(e)?e:dl(e),n=n&&!r?Wu(n):0;var o=e.length;return n<0&&(n=qn(o+n,0)),Au(e)?n<=o&&e.indexOf(t,n)>-1:!!o&&ln(e,t,n)>-1},dr.indexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Wu(n);return o<0&&(o=qn(r+o,0)),ln(e,t,o)},dr.inRange=function(e,t,n){return t=Fu(t),n===a?(n=t,t=0):n=Fu(n),function(e,t,n){return e>=Hn(t,n)&&e<qn(t,n)}(e=$u(e),t,n)},dr.invoke=rl,dr.isArguments=vu,dr.isArray=yu,dr.isArrayBuffer=gu,dr.isArrayLike=bu,dr.isArrayLikeObject=Eu,dr.isBoolean=function(e){return!0===e||!1===e||Tu(e)&&Xr(e)==V},dr.isBuffer=wu,dr.isDate=_u,dr.isElement=function(e){return Tu(e)&&1===e.nodeType&&!ju(e)},dr.isEmpty=function(e){if(null==e)return!0;if(bu(e)&&(yu(e)||"string"==typeof e||"function"==typeof e.splice||wu(e)||Mu(e)||vu(e)))return!e.length;var t=Ba(e);if(t==Y||t==ne)return!e.size;if(Za(e))return!co(e).length;for(var n in e)if(st.call(e,n))return!1;return!0},dr.isEqual=function(e,t){return ao(e,t)},dr.isEqualWith=function(e,t,n){var r=(n="function"==typeof n?n:a)?n(e,t):a;return r===a?ao(e,t,a,n):!!r},dr.isError=xu,dr.isFinite=function(e){return"number"==typeof e&&Bn(e)},dr.isFunction=ku,dr.isInteger=Su,dr.isLength=Nu,dr.isMap=Cu,dr.isMatch=function(e,t){return e===t||io(e,t,Da(t))},dr.isMatchWith=function(e,t,n){return n="function"==typeof n?n:a,io(e,t,Da(t),n)},dr.isNaN=function(e){return Pu(e)&&e!=+e},dr.isNative=function(e){if(Ya(e))throw new Xe(u);return uo(e)},dr.isNil=function(e){return null==e},dr.isNull=function(e){return null===e},dr.isNumber=Pu,dr.isObject=Ou,dr.isObjectLike=Tu,dr.isPlainObject=ju,dr.isRegExp=Ru,dr.isSafeInteger=function(e){return Su(e)&&e>=-A&&e<=A},dr.isSet=Iu,dr.isString=Au,dr.isSymbol=Uu,dr.isTypedArray=Mu,dr.isUndefined=function(e){return e===a},dr.isWeakMap=function(e){return Tu(e)&&Ba(e)==ie},dr.isWeakSet=function(e){return Tu(e)&&Xr(e)==ue},dr.join=function(e,t){return null==e?"":$n.call(e,t)},dr.kebabCase=yl,dr.last=xi,dr.lastIndexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r;return n!==a&&(o=(o=Wu(n))<0?qn(r+o,0):Hn(o,r-1)),t==t?function(e,t,n){for(var r=n+1;r--;)if(e[r]===t)return r;return r}(e,t,o):un(e,sn,o,!0)},dr.lowerCase=gl,dr.lowerFirst=bl,dr.lt=zu,dr.lte=Du,dr.max=function(e){return e&&e.length?Br(e,Pl,Jr):a},dr.maxBy=function(e,t){return e&&e.length?Br(e,Ma(t,2),Jr):a},dr.mean=function(e){return fn(e,Pl)},dr.meanBy=function(e,t){return fn(e,Ma(t,2))},dr.min=function(e){return e&&e.length?Br(e,Pl,fo):a},dr.minBy=function(e,t){return e&&e.length?Br(e,Ma(t,2),fo):a},dr.stubArray=Bl,dr.stubFalse=$l,dr.stubObject=function(){return{}},dr.stubString=function(){return""},dr.stubTrue=function(){return!0},dr.multiply=Gl,dr.nth=function(e,t){return e&&e.length?yo(e,Wu(t)):a},dr.noConflict=function(){return It._===this&&(It._=mt),this},dr.noop=Ul,dr.now=Ji,dr.pad=function(e,t,n){e=qu(e);var r=(t=Wu(t))?jn(e):0;if(!t||r>=t)return e;var o=(t-r)/2;return ga(Ln(o),n)+e+ga(Dn(o),n)},dr.padEnd=function(e,t,n){e=qu(e);var r=(t=Wu(t))?jn(e):0;return t&&r<t?e+ga(t-r,n):e},dr.padStart=function(e,t,n){e=qu(e);var r=(t=Wu(t))?jn(e):0;return t&&r<t?ga(t-r,n)+e:e},dr.parseInt=function(e,t,n){return n||null==t?t=0:t&&(t=+t),Qn(qu(e).replace(Ue,""),t||0)},dr.random=function(e,t,n){if(n&&"boolean"!=typeof n&&Ka(e,t,n)&&(t=n=a),n===a&&("boolean"==typeof t?(n=t,t=a):"boolean"==typeof e&&(n=e,e=a)),e===a&&t===a?(e=0,t=1):(e=Fu(e),t===a?(t=e,e=0):t=Fu(t)),e>t){var r=e;e=t,t=r}if(n||e%1||t%1){var o=Gn();return Hn(e+o*(t-e+Ct("1e-"+((o+"").length-1))),t)}return _o(e,t)},dr.reduce=function(e,t,n){var r=yu(e)?tn:hn,o=arguments.length<3;return r(e,Ma(t,4),n,o,Lr)},dr.reduceRight=function(e,t,n){var r=yu(e)?nn:hn,o=arguments.length<3;return r(e,Ma(t,4),n,o,Fr)},dr.repeat=function(e,t,n){return t=(n?Ka(e,t,n):t===a)?1:Wu(t),xo(qu(e),t)},dr.replace=function(){var e=arguments,t=qu(e[0]);return e.length<3?t:t.replace(e[1],e[2])},dr.result=function(e,t,n){var r=-1,o=(t=Ko(t,e)).length;for(o||(o=1,e=a);++r<o;){var i=null==e?a:e[si(t[r])];i===a&&(r=o,i=n),e=ku(i)?i.call(e):i}return e},dr.round=Yl,dr.runInContext=e,dr.sample=function(e){return(yu(e)?kr:So)(e)},dr.size=function(e){if(null==e)return 0;if(bu(e))return Au(e)?jn(e):e.length;var t=Ba(e);return t==Y||t==ne?e.size:co(e).length},dr.snakeCase=El,dr.some=function(e,t,n){var r=yu(e)?rn:Ro;return n&&Ka(e,t,n)&&(t=a),r(e,Ma(t,3))},dr.sortedIndex=function(e,t){return Io(e,t)},dr.sortedIndexBy=function(e,t,n){return Ao(e,t,Ma(n,2))},dr.sortedIndexOf=function(e,t){var n=null==e?0:e.length;if(n){var r=Io(e,t);if(r<n&&du(e[r],t))return r}return-1},dr.sortedLastIndex=function(e,t){return Io(e,t,!0)},dr.sortedLastIndexBy=function(e,t,n){return Ao(e,t,Ma(n,2),!0)},dr.sortedLastIndexOf=function(e,t){if(null==e?0:e.length){var n=Io(e,t,!0)-1;if(du(e[n],t))return n}return-1},dr.startCase=wl,dr.startsWith=function(e,t,n){return e=qu(e),n=null==n?0:Ar(Wu(n),0,e.length),t=zo(t),e.slice(n,n+t.length)==t},dr.subtract=Zl,dr.sum=function(e){return e&&e.length?mn(e,Pl):0},dr.sumBy=function(e,t){return e&&e.length?mn(e,Ma(t,2)):0},dr.template=function(e,t,n){var r=dr.templateSettings;n&&Ka(e,t,n)&&(t=a),e=qu(e),t=Qu({},t,r,Na);var o,i,u=Qu({},t.imports,r.imports,Na),l=ol(u),c=gn(u,l),s=0,f=t.interpolate||Ye,p="__p += '",d=nt((t.escape||Ye).source+"|"+f.source+"|"+(f===Te?Be:Ye).source+"|"+(t.evaluate||Ye).source+"|$","g"),h="//# sourceURL="+(st.call(t,"sourceURL")?(t.sourceURL+"").replace(/[\r\n]/g," "):"lodash.templateSources["+ ++St+"]")+"\n";e.replace(d,function(t,n,r,a,u,l){return r||(r=a),p+=e.slice(s,l).replace(Ze,kn),n&&(o=!0,p+="' +\n__e("+n+") +\n'"),u&&(i=!0,p+="';\n"+u+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),s=l+t.length,t}),p+="';\n";var m=st.call(t,"variable")&&t.variable;m||(p="with (obj) {\n"+p+"\n}\n"),p=(i?p.replace(be,""):p).replace(Ee,"$1").replace(we,"$1;"),p="function("+(m||"obj")+") {\n"+(m?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(i?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var v=Sl(function(){return Je(l,h+"return "+p).apply(a,c)});if(v.source=p,xu(v))throw v;return v},dr.times=function(e,t){if((e=Wu(e))<1||e>A)return[];var n=z,r=Hn(e,z);t=Ma(t),e-=z;for(var o=vn(r,t);++n<e;)t(n);return o},dr.toFinite=Fu,dr.toInteger=Wu,dr.toLength=Bu,dr.toLower=function(e){return qu(e).toLowerCase()},dr.toNumber=$u,dr.toSafeInteger=function(e){return e?Ar(Wu(e),-A,A):0===e?e:0},dr.toString=qu,dr.toUpper=function(e){return qu(e).toUpperCase()},dr.trim=function(e,t,n){if((e=qu(e))&&(n||t===a))return e.replace(Ae,"");if(!e||!(t=zo(t)))return e;var r=Rn(e),o=Rn(t);return Go(r,En(r,o),wn(r,o)+1).join("")},dr.trimEnd=function(e,t,n){if((e=qu(e))&&(n||t===a))return e.replace(Me,"");if(!e||!(t=zo(t)))return e;var r=Rn(e);return Go(r,0,wn(r,Rn(t))+1).join("")},dr.trimStart=function(e,t,n){if((e=qu(e))&&(n||t===a))return e.replace(Ue,"");if(!e||!(t=zo(t)))return e;var r=Rn(e);return Go(r,En(r,Rn(t))).join("")},dr.truncate=function(e,t){var n=O,r=T;if(Ou(t)){var o="separator"in t?t.separator:o;n="length"in t?Wu(t.length):n,r="omission"in t?zo(t.omission):r}var i=(e=qu(e)).length;if(Sn(e)){var u=Rn(e);i=u.length}if(n>=i)return e;var l=n-jn(r);if(l<1)return r;var c=u?Go(u,0,l).join(""):e.slice(0,l);if(o===a)return c+r;if(u&&(l+=c.length-l),Ru(o)){if(e.slice(l).search(o)){var s,f=c;for(o.global||(o=nt(o.source,qu($e.exec(o))+"g")),o.lastIndex=0;s=o.exec(f);)var p=s.index;c=c.slice(0,p===a?l:p)}}else if(e.indexOf(zo(o),l)!=l){var d=c.lastIndexOf(o);d>-1&&(c=c.slice(0,d))}return c+r},dr.unescape=function(e){return(e=qu(e))&&ke.test(e)?e.replace(_e,In):e},dr.uniqueId=function(e){var t=++ft;return qu(e)+t},dr.upperCase=_l,dr.upperFirst=xl,dr.each=qi,dr.eachRight=Hi,dr.first=bi,Al(dr,(Ql={},Kr(dr,function(e,t){st.call(dr.prototype,t)||(Ql[t]=e)}),Ql),{chain:!1}),dr.VERSION="4.17.15",Kt(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){dr[e].placeholder=dr}),Kt(["drop","take"],function(e,t){yr.prototype[e]=function(n){n=n===a?1:qn(Wu(n),0);var r=this.__filtered__&&!t?new yr(this):this.clone();return r.__filtered__?r.__takeCount__=Hn(n,r.__takeCount__):r.__views__.push({size:Hn(n,z),type:e+(r.__dir__<0?"Right":"")}),r},yr.prototype[e+"Right"]=function(t){return this.reverse()[e](t).reverse()}}),Kt(["filter","map","takeWhile"],function(e,t){var n=t+1,r=n==j||3==n;yr.prototype[e]=function(e){var t=this.clone();return t.__iteratees__.push({iteratee:Ma(e,3),type:n}),t.__filtered__=t.__filtered__||r,t}}),Kt(["head","last"],function(e,t){var n="take"+(t?"Right":"");yr.prototype[e]=function(){return this[n](1).value()[0]}}),Kt(["initial","tail"],function(e,t){var n="drop"+(t?"":"Right");yr.prototype[e]=function(){return this.__filtered__?new yr(this):this[n](1)}}),yr.prototype.compact=function(){return this.filter(Pl)},yr.prototype.find=function(e){return this.filter(e).head()},yr.prototype.findLast=function(e){return this.reverse().find(e)},yr.prototype.invokeMap=ko(function(e,t){return"function"==typeof e?new yr(this):this.map(function(n){return ro(n,e,t)})}),yr.prototype.reject=function(e){return this.filter(lu(Ma(e)))},yr.prototype.slice=function(e,t){e=Wu(e);var n=this;return n.__filtered__&&(e>0||t<0)?new yr(n):(e<0?n=n.takeRight(-e):e&&(n=n.drop(e)),t!==a&&(n=(t=Wu(t))<0?n.dropRight(-t):n.take(t-e)),n)},yr.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},yr.prototype.toArray=function(){return this.take(z)},Kr(yr.prototype,function(e,t){var n=/^(?:filter|find|map|reject)|While$/.test(t),r=/^(?:head|last)$/.test(t),o=dr[r?"take"+("last"==t?"Right":""):t],i=r||/^find/.test(t);o&&(dr.prototype[t]=function(){var t=this.__wrapped__,u=r?[1]:arguments,l=t instanceof yr,c=u[0],s=l||yu(t),f=function(e){var t=o.apply(dr,en([e],u));return r&&p?t[0]:t};s&&n&&"function"==typeof c&&1!=c.length&&(l=s=!1);var p=this.__chain__,d=!!this.__actions__.length,h=i&&!p,m=l&&!d;if(!i&&s){t=m?t:new yr(this);var v=e.apply(t,u);return v.__actions__.push({func:Fi,args:[f],thisArg:a}),new vr(v,p)}return h&&m?e.apply(this,u):(v=this.thru(f),h?r?v.value()[0]:v.value():v)})}),Kt(["pop","push","shift","sort","splice","unshift"],function(e){var t=at[e],n=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",r=/^(?:pop|shift)$/.test(e);dr.prototype[e]=function(){var e=arguments;if(r&&!this.__chain__){var o=this.value();return t.apply(yu(o)?o:[],e)}return this[n](function(n){return t.apply(yu(n)?n:[],e)})}}),Kr(yr.prototype,function(e,t){var n=dr[t];if(n){var r=n.name+"";st.call(or,r)||(or[r]=[]),or[r].push({name:t,func:n})}}),or[ha(a,g).name]=[{name:"wrapper",func:a}],yr.prototype.clone=function(){var e=new yr(this.__wrapped__);return e.__actions__=ra(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=ra(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=ra(this.__views__),e},yr.prototype.reverse=function(){if(this.__filtered__){var e=new yr(this);e.__dir__=-1,e.__filtered__=!0}else(e=this.clone()).__dir__*=-1;return e},yr.prototype.value=function(){var e=this.__wrapped__.value(),t=this.__dir__,n=yu(e),r=t<0,o=n?e.length:0,a=function(e,t,n){var r=-1,o=n.length;for(;++r<o;){var a=n[r],i=a.size;switch(a.type){case"drop":e+=i;break;case"dropRight":t-=i;break;case"take":t=Hn(t,e+i);break;case"takeRight":e=qn(e,t-i)}}return{start:e,end:t}}(0,o,this.__views__),i=a.start,u=a.end,l=u-i,c=r?u:i-1,s=this.__iteratees__,f=s.length,p=0,d=Hn(l,this.__takeCount__);if(!n||!r&&o==l&&d==l)return Bo(e,this.__actions__);var h=[];e:for(;l--&&p<d;){for(var m=-1,v=e[c+=t];++m<f;){var y=s[m],g=y.iteratee,b=y.type,E=g(v);if(b==R)v=E;else if(!E){if(b==j)continue e;break e}}h[p++]=v}return h},dr.prototype.at=Wi,dr.prototype.chain=function(){return Li(this)},dr.prototype.commit=function(){return new vr(this.value(),this.__chain__)},dr.prototype.next=function(){this.__values__===a&&(this.__values__=Lu(this.value()));var e=this.__index__>=this.__values__.length;return{done:e,value:e?a:this.__values__[this.__index__++]}},dr.prototype.plant=function(e){for(var t,n=this;n instanceof mr;){var r=pi(n);r.__index__=0,r.__values__=a,t?o.__wrapped__=r:t=r;var o=r;n=n.__wrapped__}return o.__wrapped__=e,t},dr.prototype.reverse=function(){var e=this.__wrapped__;if(e instanceof yr){var t=e;return this.__actions__.length&&(t=new yr(this)),(t=t.reverse()).__actions__.push({func:Fi,args:[Oi],thisArg:a}),new vr(t,this.__chain__)}return this.thru(Oi)},dr.prototype.toJSON=dr.prototype.valueOf=dr.prototype.value=function(){return Bo(this.__wrapped__,this.__actions__)},dr.prototype.first=dr.prototype.head,Dt&&(dr.prototype[Dt]=function(){return this}),dr}();It._=An,(o=function(){return An}.call(t,n,t,r))===a||(r.exports=o)}).call(this)}).call(this,n(6),n(15)(e))},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t,n){var r=n(29),o="object"==typeof self&&self&&self.Object===Object&&self,a=r||o||Function("return this")();e.exports=a},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t,n){"use strict";var r=n(17),o={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},a={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},i={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},u={};function l(e){return r.isMemo(e)?i:u[e.$$typeof]||o}u[r.ForwardRef]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0};var c=Object.defineProperty,s=Object.getOwnPropertyNames,f=Object.getOwnPropertySymbols,p=Object.getOwnPropertyDescriptor,d=Object.getPrototypeOf,h=Object.prototype;e.exports=function e(t,n,r){if("string"!=typeof n){if(h){var o=d(n);o&&o!==h&&e(t,o,r)}var i=s(n);f&&(i=i.concat(f(n)));for(var u=l(t),m=l(n),v=0;v<i.length;++v){var y=i[v];if(!(a[y]||r&&r[y]||m&&m[y]||u&&u[y])){var g=p(n,y);try{c(t,y,g)}catch(e){}}}return t}return t}},function(e,t,n){var r=n(53),o=n(54),a=n(55),i=n(56),u=n(57);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=a,l.prototype.has=i,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(11);e.exports=function(e,t){for(var n=e.length;n--;)if(r(e[n][0],t))return n;return-1}},function(e,t){e.exports=function(e,t){return e===t||e!=e&&t!=t}},function(e,t,n){var r=n(28),o=n(64),a=n(65),i="[object Null]",u="[object Undefined]",l=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?u:i:l&&l in Object(e)?o(e):a(e)}},function(e,t,n){var r=n(19)(Object,"create");e.exports=r},function(e,t,n){var r=n(79);e.exports=function(e,t){var n=e.__data__;return r(t)?n["string"==typeof t?"string":"hash"]:n.map}},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";!function e(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)}catch(e){console.error(e)}}(),e.exports=n(47)},function(e,t,n){"use strict";e.exports=n(120)},,function(e,t,n){var r=n(63),o=n(69);e.exports=function(e,t){var n=o(e,t);return r(n)?n:void 0}},function(e,t,n){var r=n(12),o=n(4),a="[object AsyncFunction]",i="[object Function]",u="[object GeneratorFunction]",l="[object Proxy]";e.exports=function(e){if(!o(e))return!1;var t=r(e);return t==i||t==u||t==a||t==l}},function(e,t,n){var r=n(31);e.exports=function(e,t,n){"__proto__"==t&&r?r(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}},function(e,t,n){var r=n(20),o=n(36);e.exports=function(e){return null!=e&&o(e.length)&&!r(e)}},function(e,t,n){"use strict";(function(e,r){var o,a=n(44);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var i=Object(a.a)(o);t.a=i}).call(this,n(6),n(117)(e))},function(e,t){e.exports=function(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}},function(e,t,n){var r=n(121);e.exports=d,e.exports.parse=a,e.exports.compile=function(e,t){return u(a(e,t))},e.exports.tokensToFunction=u,e.exports.tokensToRegExp=p;var o=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function a(e,t){for(var n,r=[],a=0,i=0,u="",s=t&&t.delimiter||"/";null!=(n=o.exec(e));){var f=n[0],p=n[1],d=n.index;if(u+=e.slice(i,d),i=d+f.length,p)u+=p[1];else{var h=e[i],m=n[2],v=n[3],y=n[4],g=n[5],b=n[6],E=n[7];u&&(r.push(u),u="");var w=null!=m&&null!=h&&h!==m,_="+"===b||"*"===b,x="?"===b||"*"===b,k=n[2]||s,S=y||g;r.push({name:v||a++,prefix:m||"",delimiter:k,optional:x,repeat:_,partial:w,asterisk:!!E,pattern:S?c(S):E?".*":"[^"+l(k)+"]+?"})}}return i<e.length&&(u+=e.substr(i)),u&&r.push(u),r}function i(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function u(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,o){for(var a="",u=n||{},l=(o||{}).pretty?i:encodeURIComponent,c=0;c<e.length;c++){var s=e[c];if("string"!=typeof s){var f,p=u[s.name];if(null==p){if(s.optional){s.partial&&(a+=s.prefix);continue}throw new TypeError('Expected "'+s.name+'" to be defined')}if(r(p)){if(!s.repeat)throw new TypeError('Expected "'+s.name+'" to not repeat, but received `'+JSON.stringify(p)+"`");if(0===p.length){if(s.optional)continue;throw new TypeError('Expected "'+s.name+'" to not be empty')}for(var d=0;d<p.length;d++){if(f=l(p[d]),!t[c].test(f))throw new TypeError('Expected all "'+s.name+'" to match "'+s.pattern+'", but received `'+JSON.stringify(f)+"`");a+=(0===d?s.prefix:s.delimiter)+f}}else{if(f=s.asterisk?encodeURI(p).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}):l(p),!t[c].test(f))throw new TypeError('Expected "'+s.name+'" to match "'+s.pattern+'", but received "'+f+'"');a+=s.prefix+f}}else a+=s}return a}}function l(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function c(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function s(e,t){return e.keys=t,e}function f(e){return e.sensitive?"":"i"}function p(e,t,n){r(t)||(n=t||n,t=[]);for(var o=(n=n||{}).strict,a=!1!==n.end,i="",u=0;u<e.length;u++){var c=e[u];if("string"==typeof c)i+=l(c);else{var p=l(c.prefix),d="(?:"+c.pattern+")";t.push(c),c.repeat&&(d+="(?:"+p+d+")*"),i+=d=c.optional?c.partial?p+"("+d+")?":"(?:"+p+"("+d+"))?":p+"("+d+")"}}var h=l(n.delimiter||"/"),m=i.slice(-h.length)===h;return o||(i=(m?i.slice(0,-h.length):i)+"(?:"+h+"(?=$))?"),i+=a?"$":o&&m?"":"(?="+h+"|$)",s(new RegExp("^"+i,f(n)),t)}function d(e,t,n){return r(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return s(e,t)}(e,t):r(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(d(e[o],t,n).source);return s(new RegExp("(?:"+r.join("|")+")",f(n)),t)}(e,t,n):function(e,t,n){return p(a(e,n),t,n)}(e,t,n)}},function(e,t,n){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;function i(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,u,l=i(e),c=1;c<arguments.length;c++){for(var s in n=Object(arguments[c]))o.call(n,s)&&(l[s]=n[s]);if(r){u=r(n);for(var f=0;f<u.length;f++)a.call(n,u[f])&&(l[u[f]]=n[u[f]])}}return l}},function(e,t,n){var r=n(19)(n(5),"Map");e.exports=r},function(e,t,n){var r=n(5).Symbol;e.exports=r},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(this,n(6))},function(e,t,n){var r=n(21),o=n(11);e.exports=function(e,t,n){(void 0===n||o(e[t],n))&&(void 0!==n||t in e)||r(e,t,n)}},function(e,t,n){var r=n(19),o=function(){try{var e=r(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,n){var r=n(93)(Object.getPrototypeOf,Object);e.exports=r},function(e,t){var n=Object.prototype;e.exports=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||n)}},function(e,t,n){var r=n(94),o=n(7),a=Object.prototype,i=a.hasOwnProperty,u=a.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&i.call(e,"callee")&&!u.call(e,"callee")};e.exports=l},function(e,t){var n=Array.isArray;e.exports=n},function(e,t){var n=9007199254740991;e.exports=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=n}},function(e,t,n){(function(e){var r=n(5),o=n(96),a=t&&!t.nodeType&&t,i=a&&"object"==typeof e&&e&&!e.nodeType&&e,u=i&&i.exports===a?r.Buffer:void 0,l=(u?u.isBuffer:void 0)||o;e.exports=l}).call(this,n(15)(e))},function(e,t,n){var r=n(98),o=n(99),a=n(100),i=a&&a.isTypedArray,u=i?o(i):r;e.exports=u},function(e,t){e.exports=function(e,t){if(("constructor"!==t||"function"!=typeof e[t])&&"__proto__"!=t)return e[t]}},function(e,t,n){var r=n(104),o=n(106),a=n(22);e.exports=function(e){return a(e)?r(e,!0):o(e)}},function(e,t){var n=9007199254740991,r=/^(?:0|[1-9]\d*)$/;e.exports=function(e,t){var o=typeof e;return!!(t=null==t?n:t)&&("number"==o||"symbol"!=o&&r.test(e))&&e>-1&&e%1==0&&e<t}},function(e,t){e.exports=function(e){return e}},function(e,t,n){(function(e){!function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function a(e,t){a.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function u(e,t,n){u.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function l(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function c(e){var t=void 0===e?"undefined":x(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function s(e,t,n,r,f,p,d){d=d||[];var h=(f=f||[]).slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(h,p))return;if("object"===(void 0===r?"undefined":x(r))){if(r.prefilter&&r.prefilter(h,p))return;if(r.normalize){var m=r.normalize(h,p,e,t);m&&(e=m[0],t=m[1])}}}h.push(p)}"regexp"===c(e)&&"regexp"===c(t)&&(e=e.toString(),t=t.toString());var v=void 0===e?"undefined":x(e),y=void 0===t?"undefined":x(t),g="undefined"!==v||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),b="undefined"!==y||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!g&&b)n(new a(h,t));else if(!b&&g)n(new i(h,e));else if(c(e)!==c(t))n(new o(h,e,t));else if("date"===c(e)&&e-t!=0)n(new o(h,e,t));else if("object"===v&&null!==e&&null!==t)if(d.filter(function(t){return t.lhs===e}).length)e!==t&&n(new o(h,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var E;for(e.length,E=0;E<e.length;E++)E>=t.length?n(new u(h,E,new i(void 0,e[E]))):s(e[E],t[E],n,r,h,E,d);for(;E<t.length;)n(new u(h,E,new a(void 0,t[E++])))}else{var w=Object.keys(e),_=Object.keys(t);w.forEach(function(o,a){var i=_.indexOf(o);i>=0?(s(e[o],t[o],n,r,h,o,d),_=l(_,i)):s(e[o],void 0,n,r,h,o,d)}),_.forEach(function(e){s(void 0,t[e],n,r,h,e,d)})}d.length=d.length-1}else e!==t&&("number"===v&&isNaN(e)&&isNaN(t)||n(new o(h,e,t)))}function f(e,t,n,r){return r=r||[],s(e,t,function(e){e&&r.push(e)},n),r.length?r:void 0}function p(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,a=n.path?n.path.length-1:0;++o<a;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,a=t[n],i=r.path.length-1;for(o=0;o<i;o++)a=a[r.path[o]];switch(r.kind){case"A":e(a[r.path[o]],r.index,r.item);break;case"D":delete a[r.path[o]];break;case"E":case"N":a[r.path[o]]=r.rhs}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":t=l(t,n);break;case"E":case"N":t[n]=r.rhs}return t}(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function d(e){return"color: "+N[e].color+"; font-weight: bold"}function h(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach(function(e){var t=e.kind,r=function(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,a=e.index,i=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+a+"]",i];default:return[]}}(e);n.log.apply(n,["%c "+N[t].text,d(t)].concat(k(r)))}):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function m(e,t,n,r){switch(void 0===e?"undefined":x(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,k(n)):e[r];case"function":return e(t);default:return e}}function v(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,a=void 0===o?function(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var a=["action"];return a.push("%c"+String(e.type)),t&&a.push("%c@ "+r),n&&a.push("%c(in "+o.toFixed(2)+" ms)"),a.join(" ")}}(t):o,i=t.collapsed,u=t.colors,l=t.level,c=t.diff,s=void 0===t.titleFormatter;e.forEach(function(o,f){var p=o.started,d=o.startedTime,v=o.action,y=o.prevState,g=o.error,b=o.took,E=o.nextState,_=e[f+1];_&&(E=_.prevState,b=_.started-p);var x=r(v),k="function"==typeof i?i(function(){return E},v,o):i,S=w(d),N=u.title?"color: "+u.title(x)+";":"",O=["color: gray; font-weight: lighter;"];O.push(N),t.timestamp&&O.push("color: gray; font-weight: lighter;"),t.duration&&O.push("color: gray; font-weight: lighter;");var T=a(x,S,b);try{k?u.title&&s?n.groupCollapsed.apply(n,["%c "+T].concat(O)):n.groupCollapsed(T):u.title&&s?n.group.apply(n,["%c "+T].concat(O)):n.group(T)}catch(e){n.log(T)}var C=m(l,x,[y],"prevState"),P=m(l,x,[x],"action"),j=m(l,x,[g,y],"error"),R=m(l,x,[E],"nextState");if(C)if(u.prevState){var I="color: "+u.prevState(y)+"; font-weight: bold";n[C]("%c prev state",I,y)}else n[C]("prev state",y);if(P)if(u.action){var A="color: "+u.action(x)+"; font-weight: bold";n[P]("%c action    ",A,x)}else n[P]("action    ",x);if(g&&j)if(u.error){var U="color: "+u.error(g,y)+"; font-weight: bold;";n[j]("%c error     ",U,g)}else n[j]("error     ",g);if(R)if(u.nextState){var M="color: "+u.nextState(E)+"; font-weight: bold";n[R]("%c next state",M,E)}else n[R]("next state",E);c&&h(y,E,n,k);try{n.groupEnd()}catch(e){n.log("—— log end ——")}})}function y(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},O,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,a=t.predicate,i=t.logErrors,u=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var l=[];return function(e){var n=e.getState;return function(e){return function(c){if("function"==typeof a&&!a(n,c))return e(c);var s={};l.push(s),s.started=_.now(),s.startedTime=new Date,s.prevState=r(n()),s.action=c;var f=void 0;if(i)try{f=e(c)}catch(e){s.error=o(e)}else f=e(c);s.took=_.now()-s.started,s.nextState=r(n());var p=t.diff&&"function"==typeof u?u(n,c):t.diff;if(v(l,Object.assign({},t,{diff:p})),l.length=0,s.error)throw s.error;return f}}}}var g,b,E=function(e,t){return function(e,t){return new Array(t+1).join(e)}("0",t-e.toString().length)+e},w=function(e){return E(e.getHours(),2)+":"+E(e.getMinutes(),2)+":"+E(e.getSeconds(),2)+"."+E(e.getMilliseconds(),3)},_="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,x="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},k=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},S=[];g="object"===(void 0===e?"undefined":x(e))&&e?e:"undefined"!=typeof window?window:{},(b=g.DeepDiff)&&S.push(function(){void 0!==b&&g.DeepDiff===f&&(g.DeepDiff=b,b=void 0)}),n(o,r),n(a,r),n(i,r),n(u,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:s,enumerable:!0},applyDiff:{value:function(e,t,n){e&&t&&s(e,t,function(r){n&&!n(e,t,r)||p(e,t,r)})},enumerable:!0},applyChange:{value:p,enumerable:!0},revertChange:{value:function(e,t,n){if(e&&t&&n&&n.kind){var r,o,a=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===a[n.path[r]]&&(a[n.path[r]]={}),a=a[n.path[r]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,a=t[n],i=r.path.length-1;for(o=0;o<i;o++)a=a[r.path[o]];switch(r.kind){case"A":e(a[r.path[o]],r.index,r.item);break;case"D":case"E":a[r.path[o]]=r.lhs;break;case"N":delete a[r.path[o]]}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":case"E":t[n]=r.lhs;break;case"N":t=l(t,n)}return t}(a[n.path[r]],n.index,n.item);break;case"D":case"E":a[n.path[r]]=n.lhs;break;case"N":delete a[n.path[r]]}}},enumerable:!0},isConflict:{value:function(){return void 0!==b},enumerable:!0},noConflict:{value:function(){return S&&(S.forEach(function(e){e()}),S=null),f},enumerable:!0}});var N={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},O={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?y()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=O,t.createLogger=y,t.logger=T,t.default=T,Object.defineProperty(t,"__esModule",{value:!0})}(t)}).call(this,n(6))},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}n.d(t,"a",function(){return r})},function(e,t,n){"use strict";(function(t){var n="__global_unique_id__";e.exports=function(){return t[n]=(t[n]||0)+1}}).call(this,n(6))},function(e,t,n){"use strict";
/** @license React v16.9.0
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(26),o="function"==typeof Symbol&&Symbol.for,a=o?Symbol.for("react.element"):60103,i=o?Symbol.for("react.portal"):60106,u=o?Symbol.for("react.fragment"):60107,l=o?Symbol.for("react.strict_mode"):60108,c=o?Symbol.for("react.profiler"):60114,s=o?Symbol.for("react.provider"):60109,f=o?Symbol.for("react.context"):60110,p=o?Symbol.for("react.forward_ref"):60112,d=o?Symbol.for("react.suspense"):60113,h=o?Symbol.for("react.suspense_list"):60120,m=o?Symbol.for("react.memo"):60115,v=o?Symbol.for("react.lazy"):60116;o&&Symbol.for("react.fundamental"),o&&Symbol.for("react.responder");var y="function"==typeof Symbol&&Symbol.iterator;function g(e){for(var t=e.message,n="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)n+="&args[]="+encodeURIComponent(arguments[r]);return e.message="Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e}var b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E={};function w(e,t,n){this.props=e,this.context=t,this.refs=E,this.updater=n||b}function _(){}function x(e,t,n){this.props=e,this.context=t,this.refs=E,this.updater=n||b}w.prototype.isReactComponent={},w.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw g(Error(85));this.updater.enqueueSetState(this,e,t,"setState")},w.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},_.prototype=w.prototype;var k=x.prototype=new _;k.constructor=x,r(k,w.prototype),k.isPureReactComponent=!0;var S={current:null},N={suspense:null},O={current:null},T=Object.prototype.hasOwnProperty,C={key:!0,ref:!0,__self:!0,__source:!0};function P(e,t,n){var r=void 0,o={},i=null,u=null;if(null!=t)for(r in void 0!==t.ref&&(u=t.ref),void 0!==t.key&&(i=""+t.key),t)T.call(t,r)&&!C.hasOwnProperty(r)&&(o[r]=t[r]);var l=arguments.length-2;if(1===l)o.children=n;else if(1<l){for(var c=Array(l),s=0;s<l;s++)c[s]=arguments[s+2];o.children=c}if(e&&e.defaultProps)for(r in l=e.defaultProps)void 0===o[r]&&(o[r]=l[r]);return{$$typeof:a,type:e,key:i,ref:u,props:o,_owner:O.current}}function j(e){return"object"==typeof e&&null!==e&&e.$$typeof===a}var R=/\/+/g,I=[];function A(e,t,n,r){if(I.length){var o=I.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function U(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>I.length&&I.push(e)}function M(e,t,n){return null==e?0:function e(t,n,r,o){var u=typeof t;"undefined"!==u&&"boolean"!==u||(t=null);var l=!1;if(null===t)l=!0;else switch(u){case"string":case"number":l=!0;break;case"object":switch(t.$$typeof){case a:case i:l=!0}}if(l)return r(o,t,""===n?"."+z(t,0):n),1;if(l=0,n=""===n?".":n+":",Array.isArray(t))for(var c=0;c<t.length;c++){var s=n+z(u=t[c],c);l+=e(u,s,r,o)}else if(s=null===t||"object"!=typeof t?null:"function"==typeof(s=y&&t[y]||t["@@iterator"])?s:null,"function"==typeof s)for(t=s.call(t),c=0;!(u=t.next()).done;)l+=e(u=u.value,s=n+z(u,c++),r,o);else if("object"===u)throw r=""+t,g(Error(31),"[object Object]"===r?"object with keys {"+Object.keys(t).join(", ")+"}":r,"");return l}(e,"",t,n)}function z(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}(e.key):t.toString(36)}function D(e,t){e.func.call(e.context,t,e.count++)}function L(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?F(e,r,n,function(e){return e}):null!=e&&(j(e)&&(e=function(e,t){return{$$typeof:a,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(e,o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(R,"$&/")+"/")+n)),r.push(e))}function F(e,t,n,r,o){var a="";null!=n&&(a=(""+n).replace(R,"$&/")+"/"),M(e,L,t=A(t,a,r,o)),U(t)}function W(){var e=S.current;if(null===e)throw g(Error(321));return e}var B={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return F(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;M(e,D,t=A(null,null,t,n)),U(t)},count:function(e){return M(e,function(){return null},null)},toArray:function(e){var t=[];return F(e,t,null,function(e){return e}),t},only:function(e){if(!j(e))throw g(Error(143));return e}},createRef:function(){return{current:null}},Component:w,PureComponent:x,createContext:function(e,t){return void 0===t&&(t=null),(e={$$typeof:f,_calculateChangedBits:t,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:s,_context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:p,render:e}},lazy:function(e){return{$$typeof:v,_ctor:e,_status:-1,_result:null}},memo:function(e,t){return{$$typeof:m,type:e,compare:void 0===t?null:t}},useCallback:function(e,t){return W().useCallback(e,t)},useContext:function(e,t){return W().useContext(e,t)},useEffect:function(e,t){return W().useEffect(e,t)},useImperativeHandle:function(e,t,n){return W().useImperativeHandle(e,t,n)},useDebugValue:function(){},useLayoutEffect:function(e,t){return W().useLayoutEffect(e,t)},useMemo:function(e,t){return W().useMemo(e,t)},useReducer:function(e,t,n){return W().useReducer(e,t,n)},useRef:function(e){return W().useRef(e)},useState:function(e){return W().useState(e)},Fragment:u,Profiler:c,StrictMode:l,Suspense:d,unstable_SuspenseList:h,createElement:P,cloneElement:function(e,t,n){if(null==e)throw g(Error(267),e);var o=void 0,i=r({},e.props),u=e.key,l=e.ref,c=e._owner;if(null!=t){void 0!==t.ref&&(l=t.ref,c=O.current),void 0!==t.key&&(u=""+t.key);var s=void 0;for(o in e.type&&e.type.defaultProps&&(s=e.type.defaultProps),t)T.call(t,o)&&!C.hasOwnProperty(o)&&(i[o]=void 0===t[o]&&void 0!==s?s[o]:t[o])}if(1===(o=arguments.length-2))i.children=n;else if(1<o){s=Array(o);for(var f=0;f<o;f++)s[f]=arguments[f+2];i.children=s}return{$$typeof:a,type:e.type,key:u,ref:l,props:i,_owner:c}},createFactory:function(e){var t=P.bind(null,e);return t.type=e,t},isValidElement:j,version:"16.9.0",unstable_withSuspenseConfig:function(e,t){var n=N.suspense;N.suspense=void 0===t?null:t;try{e()}finally{N.suspense=n}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentDispatcher:S,ReactCurrentBatchConfig:N,ReactCurrentOwner:O,IsSomeRendererActing:{current:!1},assign:r}},$={default:B},V=$&&B||$;e.exports=V.default||V},function(e,t,n){"use strict";
/** @license React v16.9.0
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(0),o=n(26),a=n(48);function i(e){for(var t=e.message,n="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)n+="&args[]="+encodeURIComponent(arguments[r]);return e.message="Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e}if(!r)throw i(Error(227));var u=null,l={};function c(){if(u)for(var e in l){var t=l[e],n=u.indexOf(e);if(!(-1<n))throw i(Error(96),e);if(!f[n]){if(!t.extractEvents)throw i(Error(97),e);for(var r in f[n]=t,n=t.eventTypes){var o=void 0,a=n[r],c=t,d=r;if(p.hasOwnProperty(d))throw i(Error(99),d);p[d]=a;var h=a.phasedRegistrationNames;if(h){for(o in h)h.hasOwnProperty(o)&&s(h[o],c,d);o=!0}else a.registrationName?(s(a.registrationName,c,d),o=!0):o=!1;if(!o)throw i(Error(98),r,e)}}}}function s(e,t,n){if(d[e])throw i(Error(100),e);d[e]=t,h[e]=t.eventTypes[n].dependencies}var f=[],p={},d={},h={};var m=!1,v=null,y=!1,g=null,b={onError:function(e){m=!0,v=e}};function E(e,t,n,r,o,a,i,u,l){m=!1,v=null,function(e,t,n,r,o,a,i,u,l){var c=Array.prototype.slice.call(arguments,3);try{t.apply(n,c)}catch(e){this.onError(e)}}.apply(b,arguments)}var w=null,_=null,x=null;function k(e,t,n){var r=e.type||"unknown-event";e.currentTarget=x(n),function(e,t,n,r,o,a,u,l,c){if(E.apply(this,arguments),m){if(!m)throw i(Error(198));var s=v;m=!1,v=null,y||(y=!0,g=s)}}(r,t,void 0,e),e.currentTarget=null}function S(e,t){if(null==t)throw i(Error(30));return null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function N(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}var O=null;function T(e){if(e){var t=e._dispatchListeners,n=e._dispatchInstances;if(Array.isArray(t))for(var r=0;r<t.length&&!e.isPropagationStopped();r++)k(e,t[r],n[r]);else t&&k(e,t,n);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}function C(e){if(null!==e&&(O=S(O,e)),e=O,O=null,e){if(N(e,T),O)throw i(Error(95));if(y)throw e=g,y=!1,g=null,e}}var P={injectEventPluginOrder:function(e){if(u)throw i(Error(101));u=Array.prototype.slice.call(e),c()},injectEventPluginsByName:function(e){var t,n=!1;for(t in e)if(e.hasOwnProperty(t)){var r=e[t];if(!l.hasOwnProperty(t)||l[t]!==r){if(l[t])throw i(Error(102),t);l[t]=r,n=!0}}n&&c()}};function j(e,t){var n=e.stateNode;if(!n)return null;var r=w(n);if(!r)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":(r=!r.disabled)||(r=!("button"===(e=e.type)||"input"===e||"select"===e||"textarea"===e)),e=!r;break e;default:e=!1}if(e)return null;if(n&&"function"!=typeof n)throw i(Error(231),t,typeof n);return n}var R=Math.random().toString(36).slice(2),I="__reactInternalInstance$"+R,A="__reactEventHandlers$"+R;function U(e){if(e[I])return e[I];for(;!e[I];){if(!e.parentNode)return null;e=e.parentNode}return 5===(e=e[I]).tag||6===e.tag?e:null}function M(e){return!(e=e[I])||5!==e.tag&&6!==e.tag?null:e}function z(e){if(5===e.tag||6===e.tag)return e.stateNode;throw i(Error(33))}function D(e){return e[A]||null}function L(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function F(e,t,n){(t=j(e,n.dispatchConfig.phasedRegistrationNames[t]))&&(n._dispatchListeners=S(n._dispatchListeners,t),n._dispatchInstances=S(n._dispatchInstances,e))}function W(e){if(e&&e.dispatchConfig.phasedRegistrationNames){for(var t=e._targetInst,n=[];t;)n.push(t),t=L(t);for(t=n.length;0<t--;)F(n[t],"captured",e);for(t=0;t<n.length;t++)F(n[t],"bubbled",e)}}function B(e,t,n){e&&n&&n.dispatchConfig.registrationName&&(t=j(e,n.dispatchConfig.registrationName))&&(n._dispatchListeners=S(n._dispatchListeners,t),n._dispatchInstances=S(n._dispatchInstances,e))}function $(e){e&&e.dispatchConfig.registrationName&&B(e._targetInst,null,e)}function V(e){N(e,W)}var q=!("undefined"==typeof window||void 0===window.document||void 0===window.document.createElement);function H(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var K={animationend:H("Animation","AnimationEnd"),animationiteration:H("Animation","AnimationIteration"),animationstart:H("Animation","AnimationStart"),transitionend:H("Transition","TransitionEnd")},Q={},G={};function Y(e){if(Q[e])return Q[e];if(!K[e])return e;var t,n=K[e];for(t in n)if(n.hasOwnProperty(t)&&t in G)return Q[e]=n[t];return e}q&&(G=document.createElement("div").style,"AnimationEvent"in window||(delete K.animationend.animation,delete K.animationiteration.animation,delete K.animationstart.animation),"TransitionEvent"in window||delete K.transitionend.transition);var Z=Y("animationend"),X=Y("animationiteration"),J=Y("animationstart"),ee=Y("transitionend"),te="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ne=null,re=null,oe=null;function ae(){if(oe)return oe;var e,t,n=re,r=n.length,o="value"in ne?ne.value:ne.textContent,a=o.length;for(e=0;e<r&&n[e]===o[e];e++);var i=r-e;for(t=1;t<=i&&n[r-t]===o[a-t];t++);return oe=o.slice(e,1<t?1-t:void 0)}function ie(){return!0}function ue(){return!1}function le(e,t,n,r){for(var o in this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n,e=this.constructor.Interface)e.hasOwnProperty(o)&&((t=e[o])?this[o]=t(n):"target"===o?this.target=r:this[o]=n[o]);return this.isDefaultPrevented=(null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue)?ie:ue,this.isPropagationStopped=ue,this}function ce(e,t,n,r){if(this.eventPool.length){var o=this.eventPool.pop();return this.call(o,e,t,n,r),o}return new this(e,t,n,r)}function se(e){if(!(e instanceof this))throw i(Error(279));e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function fe(e){e.eventPool=[],e.getPooled=ce,e.release=se}o(le.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=ie)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=ie)},persist:function(){this.isPersistent=ie},isPersistent:ue,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;this.nativeEvent=this._targetInst=this.dispatchConfig=null,this.isPropagationStopped=this.isDefaultPrevented=ue,this._dispatchInstances=this._dispatchListeners=null}}),le.Interface={type:null,target:null,currentTarget:function(){return null},eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null},le.extend=function(e){function t(){}function n(){return r.apply(this,arguments)}var r=this;t.prototype=r.prototype;var a=new t;return o(a,n.prototype),n.prototype=a,n.prototype.constructor=n,n.Interface=o({},r.Interface,e),n.extend=r.extend,fe(n),n},fe(le);var pe=le.extend({data:null}),de=le.extend({data:null}),he=[9,13,27,32],me=q&&"CompositionEvent"in window,ve=null;q&&"documentMode"in document&&(ve=document.documentMode);var ye=q&&"TextEvent"in window&&!ve,ge=q&&(!me||ve&&8<ve&&11>=ve),be=String.fromCharCode(32),Ee={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},we=!1;function _e(e,t){switch(e){case"keyup":return-1!==he.indexOf(t.keyCode);case"keydown":return 229!==t.keyCode;case"keypress":case"mousedown":case"blur":return!0;default:return!1}}function xe(e){return"object"==typeof(e=e.detail)&&"data"in e?e.data:null}var ke=!1;var Se={eventTypes:Ee,extractEvents:function(e,t,n,r){var o=void 0,a=void 0;if(me)e:{switch(e){case"compositionstart":o=Ee.compositionStart;break e;case"compositionend":o=Ee.compositionEnd;break e;case"compositionupdate":o=Ee.compositionUpdate;break e}o=void 0}else ke?_e(e,n)&&(o=Ee.compositionEnd):"keydown"===e&&229===n.keyCode&&(o=Ee.compositionStart);return o?(ge&&"ko"!==n.locale&&(ke||o!==Ee.compositionStart?o===Ee.compositionEnd&&ke&&(a=ae()):(re="value"in(ne=r)?ne.value:ne.textContent,ke=!0)),o=pe.getPooled(o,t,n,r),a?o.data=a:null!==(a=xe(n))&&(o.data=a),V(o),a=o):a=null,(e=ye?function(e,t){switch(e){case"compositionend":return xe(t);case"keypress":return 32!==t.which?null:(we=!0,be);case"textInput":return(e=t.data)===be&&we?null:e;default:return null}}(e,n):function(e,t){if(ke)return"compositionend"===e||!me&&_e(e,t)?(e=ae(),oe=re=ne=null,ke=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return ge&&"ko"!==t.locale?null:t.data;default:return null}}(e,n))?((t=de.getPooled(Ee.beforeInput,t,n,r)).data=e,V(t)):t=null,null===a?t:null===t?a:[a,t]}},Ne=null,Oe=null,Te=null;function Ce(e){if(e=_(e)){if("function"!=typeof Ne)throw i(Error(280));var t=w(e.stateNode);Ne(e.stateNode,e.type,t)}}function Pe(e){Oe?Te?Te.push(e):Te=[e]:Oe=e}function je(){if(Oe){var e=Oe,t=Te;if(Te=Oe=null,Ce(e),t)for(e=0;e<t.length;e++)Ce(t[e])}}function Re(e,t){return e(t)}function Ie(e,t,n,r){return e(t,n,r)}function Ae(){}var Ue=Re,Me=!1;function ze(){null===Oe&&null===Te||(Ae(),je())}var De={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Le(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!De[e.type]:"textarea"===t}function Fe(e){return(e=e.target||e.srcElement||window).correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function We(e){if(!q)return!1;var t=(e="on"+e)in document;return t||((t=document.createElement("div")).setAttribute(e,"return;"),t="function"==typeof t[e]),t}function Be(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function $e(e){e._valueTracker||(e._valueTracker=function(e){var t=Be(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&void 0!==n&&"function"==typeof n.get&&"function"==typeof n.set){var o=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(e){r=""+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}(e))}function Ve(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Be(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}var qe=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;qe.hasOwnProperty("ReactCurrentDispatcher")||(qe.ReactCurrentDispatcher={current:null}),qe.hasOwnProperty("ReactCurrentBatchConfig")||(qe.ReactCurrentBatchConfig={suspense:null});var He=/^(.*)[\\\/]/,Ke="function"==typeof Symbol&&Symbol.for,Qe=Ke?Symbol.for("react.element"):60103,Ge=Ke?Symbol.for("react.portal"):60106,Ye=Ke?Symbol.for("react.fragment"):60107,Ze=Ke?Symbol.for("react.strict_mode"):60108,Xe=Ke?Symbol.for("react.profiler"):60114,Je=Ke?Symbol.for("react.provider"):60109,et=Ke?Symbol.for("react.context"):60110,tt=Ke?Symbol.for("react.concurrent_mode"):60111,nt=Ke?Symbol.for("react.forward_ref"):60112,rt=Ke?Symbol.for("react.suspense"):60113,ot=Ke?Symbol.for("react.suspense_list"):60120,at=Ke?Symbol.for("react.memo"):60115,it=Ke?Symbol.for("react.lazy"):60116;Ke&&Symbol.for("react.fundamental"),Ke&&Symbol.for("react.responder");var ut="function"==typeof Symbol&&Symbol.iterator;function lt(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=ut&&e[ut]||e["@@iterator"])?e:null}function ct(e){if(null==e)return null;if("function"==typeof e)return e.displayName||e.name||null;if("string"==typeof e)return e;switch(e){case Ye:return"Fragment";case Ge:return"Portal";case Xe:return"Profiler";case Ze:return"StrictMode";case rt:return"Suspense";case ot:return"SuspenseList"}if("object"==typeof e)switch(e.$$typeof){case et:return"Context.Consumer";case Je:return"Context.Provider";case nt:var t=e.render;return t=t.displayName||t.name||"",e.displayName||(""!==t?"ForwardRef("+t+")":"ForwardRef");case at:return ct(e.type);case it:if(e=1===e._status?e._result:null)return ct(e)}return null}function st(e){var t="";do{e:switch(e.tag){case 3:case 4:case 6:case 7:case 10:case 9:var n="";break e;default:var r=e._debugOwner,o=e._debugSource,a=ct(e.type);n=null,r&&(n=ct(r.type)),r=a,a="",o?a=" (at "+o.fileName.replace(He,"")+":"+o.lineNumber+")":n&&(a=" (created by "+n+")"),n="\n    in "+(r||"Unknown")+a}t+=n,e=e.return}while(e);return t}var ft=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,pt=Object.prototype.hasOwnProperty,dt={},ht={};function mt(e,t,n,r,o,a){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a}var vt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){vt[e]=new mt(e,0,!1,e,null,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];vt[t]=new mt(t,1,!1,e[1],null,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){vt[e]=new mt(e,2,!1,e.toLowerCase(),null,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){vt[e]=new mt(e,2,!1,e,null,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){vt[e]=new mt(e,3,!1,e.toLowerCase(),null,!1)}),["checked","multiple","muted","selected"].forEach(function(e){vt[e]=new mt(e,3,!0,e,null,!1)}),["capture","download"].forEach(function(e){vt[e]=new mt(e,4,!1,e,null,!1)}),["cols","rows","size","span"].forEach(function(e){vt[e]=new mt(e,6,!1,e,null,!1)}),["rowSpan","start"].forEach(function(e){vt[e]=new mt(e,5,!1,e.toLowerCase(),null,!1)});var yt=/[\-:]([a-z])/g;function gt(e){return e[1].toUpperCase()}function bt(e,t,n,r){var o=vt.hasOwnProperty(t)?vt[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(function(e,t,n,r){if(null==t||function(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}(e,t,n,r))return!0;if(r)return!1;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}(t,n,o,r)&&(n=null),r||null===o?function(e){return!!pt.call(ht,e)||!pt.call(dt,e)&&(ft.test(e)?ht[e]=!0:(dt[e]=!0,!1))}(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(n=3===(o=o.type)||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}function Et(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}function wt(e,t){var n=t.checked;return o({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function _t(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=Et(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function xt(e,t){null!=(t=t.checked)&&bt(e,"checked",t,!1)}function kt(e,t){xt(e,t);var n=Et(t.value),r=t.type;if(null!=n)"number"===r?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if("submit"===r||"reset"===r)return void e.removeAttribute("value");t.hasOwnProperty("value")?Nt(e,t.type,n):t.hasOwnProperty("defaultValue")&&Nt(e,t.type,Et(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function St(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!("submit"!==r&&"reset"!==r||void 0!==t.value&&null!==t.value))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}""!==(n=e.name)&&(e.name=""),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!!e._wrapperState.initialChecked,""!==n&&(e.name=n)}function Nt(e,t,n){"number"===t&&e.ownerDocument.activeElement===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(yt,gt);vt[t]=new mt(t,1,!1,e,null,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(yt,gt);vt[t]=new mt(t,1,!1,e,"http://www.w3.org/1999/xlink",!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(yt,gt);vt[t]=new mt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1)}),["tabIndex","crossOrigin"].forEach(function(e){vt[e]=new mt(e,1,!1,e.toLowerCase(),null,!1)}),vt.xlinkHref=new mt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0),["src","href","action","formAction"].forEach(function(e){vt[e]=new mt(e,1,!1,e.toLowerCase(),null,!0)});var Ot={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Tt(e,t,n){return(e=le.getPooled(Ot.change,e,t,n)).type="change",Pe(n),V(e),e}var Ct=null,Pt=null;function jt(e){C(e)}function Rt(e){if(Ve(z(e)))return e}function It(e,t){if("change"===e)return t}var At=!1;function Ut(){Ct&&(Ct.detachEvent("onpropertychange",Mt),Pt=Ct=null)}function Mt(e){if("value"===e.propertyName&&Rt(Pt))if(e=Tt(Pt,e,Fe(e)),Me)C(e);else{Me=!0;try{Re(jt,e)}finally{Me=!1,ze()}}}function zt(e,t,n){"focus"===e?(Ut(),Pt=n,(Ct=t).attachEvent("onpropertychange",Mt)):"blur"===e&&Ut()}function Dt(e){if("selectionchange"===e||"keyup"===e||"keydown"===e)return Rt(Pt)}function Lt(e,t){if("click"===e)return Rt(t)}function Ft(e,t){if("input"===e||"change"===e)return Rt(t)}q&&(At=We("input")&&(!document.documentMode||9<document.documentMode));var Wt={eventTypes:Ot,_isInputEventSupported:At,extractEvents:function(e,t,n,r){var o=t?z(t):window,a=void 0,i=void 0,u=o.nodeName&&o.nodeName.toLowerCase();if("select"===u||"input"===u&&"file"===o.type?a=It:Le(o)?At?a=Ft:(a=Dt,i=zt):(u=o.nodeName)&&"input"===u.toLowerCase()&&("checkbox"===o.type||"radio"===o.type)&&(a=Lt),a&&(a=a(e,t)))return Tt(a,n,r);i&&i(e,o,t),"blur"===e&&(e=o._wrapperState)&&e.controlled&&"number"===o.type&&Nt(o,"number",o.value)}},Bt=le.extend({view:null,detail:null}),$t={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Vt(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=$t[e])&&!!t[e]}function qt(){return Vt}var Ht=0,Kt=0,Qt=!1,Gt=!1,Yt=Bt.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:qt,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},movementX:function(e){if("movementX"in e)return e.movementX;var t=Ht;return Ht=e.screenX,Qt?"mousemove"===e.type?e.screenX-t:0:(Qt=!0,0)},movementY:function(e){if("movementY"in e)return e.movementY;var t=Kt;return Kt=e.screenY,Gt?"mousemove"===e.type?e.screenY-t:0:(Gt=!0,0)}}),Zt=Yt.extend({pointerId:null,width:null,height:null,pressure:null,tangentialPressure:null,tiltX:null,tiltY:null,twist:null,pointerType:null,isPrimary:null}),Xt={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",dependencies:["pointerout","pointerover"]}},Jt={eventTypes:Xt,extractEvents:function(e,t,n,r){var o="mouseover"===e||"pointerover"===e,a="mouseout"===e||"pointerout"===e;if(o&&(n.relatedTarget||n.fromElement)||!a&&!o)return null;if(o=r.window===r?r:(o=r.ownerDocument)?o.defaultView||o.parentWindow:window,a?(a=t,t=(t=n.relatedTarget||n.toElement)?U(t):null):a=null,a===t)return null;var i=void 0,u=void 0,l=void 0,c=void 0;"mouseout"===e||"mouseover"===e?(i=Yt,u=Xt.mouseLeave,l=Xt.mouseEnter,c="mouse"):"pointerout"!==e&&"pointerover"!==e||(i=Zt,u=Xt.pointerLeave,l=Xt.pointerEnter,c="pointer");var s=null==a?o:z(a);if(o=null==t?o:z(t),(e=i.getPooled(u,a,n,r)).type=c+"leave",e.target=s,e.relatedTarget=o,(n=i.getPooled(l,t,n,r)).type=c+"enter",n.target=o,n.relatedTarget=s,r=t,a&&r)e:{for(o=r,c=0,i=t=a;i;i=L(i))c++;for(i=0,l=o;l;l=L(l))i++;for(;0<c-i;)t=L(t),c--;for(;0<i-c;)o=L(o),i--;for(;c--;){if(t===o||t===o.alternate)break e;t=L(t),o=L(o)}t=null}else t=null;for(o=t,t=[];a&&a!==o&&(null===(c=a.alternate)||c!==o);)t.push(a),a=L(a);for(a=[];r&&r!==o&&(null===(c=r.alternate)||c!==o);)a.push(r),r=L(r);for(r=0;r<t.length;r++)B(t[r],"bubbled",e);for(r=a.length;0<r--;)B(a[r],"captured",n);return[e,n]}};function en(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t}var tn=Object.prototype.hasOwnProperty;function nn(e,t){if(en(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++)if(!tn.call(t,n[r])||!en(e[n[r]],t[n[r]]))return!1;return!0}function rn(e,t){return{responder:e,props:t}}function on(e){var t=e;if(e.alternate)for(;t.return;)t=t.return;else{if(0!=(2&t.effectTag))return 1;for(;t.return;)if(0!=(2&(t=t.return).effectTag))return 1}return 3===t.tag?2:3}function an(e){if(2!==on(e))throw i(Error(188))}function un(e){if(!(e=function(e){var t=e.alternate;if(!t){if(3===(t=on(e)))throw i(Error(188));return 1===t?null:e}for(var n=e,r=t;;){var o=n.return;if(null===o)break;var a=o.alternate;if(null===a){if(null!==(r=o.return)){n=r;continue}break}if(o.child===a.child){for(a=o.child;a;){if(a===n)return an(o),e;if(a===r)return an(o),t;a=a.sibling}throw i(Error(188))}if(n.return!==r.return)n=o,r=a;else{for(var u=!1,l=o.child;l;){if(l===n){u=!0,n=o,r=a;break}if(l===r){u=!0,r=o,n=a;break}l=l.sibling}if(!u){for(l=a.child;l;){if(l===n){u=!0,n=a,r=o;break}if(l===r){u=!0,r=a,n=o;break}l=l.sibling}if(!u)throw i(Error(189))}}if(n.alternate!==r)throw i(Error(190))}if(3!==n.tag)throw i(Error(188));return n.stateNode.current===n?e:t}(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}new Map,new Map,new Set,new Map;var ln=le.extend({animationName:null,elapsedTime:null,pseudoElement:null}),cn=le.extend({clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),sn=Bt.extend({relatedTarget:null});function fn(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}for(var pn={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},dn={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},hn=Bt.extend({key:function(e){if(e.key){var t=pn[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?13===(e=fn(e))?"Enter":String.fromCharCode(e):"keydown"===e.type||"keyup"===e.type?dn[e.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:qt,charCode:function(e){return"keypress"===e.type?fn(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?fn(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),mn=Yt.extend({dataTransfer:null}),vn=Bt.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:qt}),yn=le.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),gn=Yt.extend({deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null}),bn=[["blur","blur",0],["cancel","cancel",0],["click","click",0],["close","close",0],["contextmenu","contextMenu",0],["copy","copy",0],["cut","cut",0],["auxclick","auxClick",0],["dblclick","doubleClick",0],["dragend","dragEnd",0],["dragstart","dragStart",0],["drop","drop",0],["focus","focus",0],["input","input",0],["invalid","invalid",0],["keydown","keyDown",0],["keypress","keyPress",0],["keyup","keyUp",0],["mousedown","mouseDown",0],["mouseup","mouseUp",0],["paste","paste",0],["pause","pause",0],["play","play",0],["pointercancel","pointerCancel",0],["pointerdown","pointerDown",0],["pointerup","pointerUp",0],["ratechange","rateChange",0],["reset","reset",0],["seeked","seeked",0],["submit","submit",0],["touchcancel","touchCancel",0],["touchend","touchEnd",0],["touchstart","touchStart",0],["volumechange","volumeChange",0],["drag","drag",1],["dragenter","dragEnter",1],["dragexit","dragExit",1],["dragleave","dragLeave",1],["dragover","dragOver",1],["mousemove","mouseMove",1],["mouseout","mouseOut",1],["mouseover","mouseOver",1],["pointermove","pointerMove",1],["pointerout","pointerOut",1],["pointerover","pointerOver",1],["scroll","scroll",1],["toggle","toggle",1],["touchmove","touchMove",1],["wheel","wheel",1],["abort","abort",2],[Z,"animationEnd",2],[X,"animationIteration",2],[J,"animationStart",2],["canplay","canPlay",2],["canplaythrough","canPlayThrough",2],["durationchange","durationChange",2],["emptied","emptied",2],["encrypted","encrypted",2],["ended","ended",2],["error","error",2],["gotpointercapture","gotPointerCapture",2],["load","load",2],["loadeddata","loadedData",2],["loadedmetadata","loadedMetadata",2],["loadstart","loadStart",2],["lostpointercapture","lostPointerCapture",2],["playing","playing",2],["progress","progress",2],["seeking","seeking",2],["stalled","stalled",2],["suspend","suspend",2],["timeupdate","timeUpdate",2],[ee,"transitionEnd",2],["waiting","waiting",2]],En={},wn={},_n=0;_n<bn.length;_n++){var xn=bn[_n],kn=xn[0],Sn=xn[1],Nn=xn[2],On="on"+(Sn[0].toUpperCase()+Sn.slice(1)),Tn={phasedRegistrationNames:{bubbled:On,captured:On+"Capture"},dependencies:[kn],eventPriority:Nn};En[Sn]=Tn,wn[kn]=Tn}var Cn={eventTypes:En,getEventPriority:function(e){return void 0!==(e=wn[e])?e.eventPriority:2},extractEvents:function(e,t,n,r){var o=wn[e];if(!o)return null;switch(e){case"keypress":if(0===fn(n))return null;case"keydown":case"keyup":e=hn;break;case"blur":case"focus":e=sn;break;case"click":if(2===n.button)return null;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":e=Yt;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":e=mn;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":e=vn;break;case Z:case X:case J:e=ln;break;case ee:e=yn;break;case"scroll":e=Bt;break;case"wheel":e=gn;break;case"copy":case"cut":case"paste":e=cn;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":e=Zt;break;default:e=le}return V(t=e.getPooled(o,t,n,r)),t}},Pn=Cn.getEventPriority,jn=[];function Rn(e){var t=e.targetInst,n=t;do{if(!n){e.ancestors.push(n);break}var r;for(r=n;r.return;)r=r.return;if(!(r=3!==r.tag?null:r.stateNode.containerInfo))break;e.ancestors.push(n),n=U(r)}while(n);for(n=0;n<e.ancestors.length;n++){t=e.ancestors[n];var o=Fe(e.nativeEvent);r=e.topLevelType;for(var a=e.nativeEvent,i=null,u=0;u<f.length;u++){var l=f[u];l&&(l=l.extractEvents(r,t,a,o))&&(i=S(i,l))}C(i)}}var In=!0;function An(e,t){Un(t,e,!1)}function Un(e,t,n){switch(Pn(t)){case 0:var r=function(e,t,n){Me||Ae();var r=Mn,o=Me;Me=!0;try{Ie(r,e,t,n)}finally{(Me=o)||ze()}}.bind(null,t,1);break;case 1:r=function(e,t,n){Mn(e,t,n)}.bind(null,t,1);break;default:r=Mn.bind(null,t,1)}n?e.addEventListener(t,r,!0):e.addEventListener(t,r,!1)}function Mn(e,t,n){if(In){if(null===(t=U(t=Fe(n)))||"number"!=typeof t.tag||2===on(t)||(t=null),jn.length){var r=jn.pop();r.topLevelType=e,r.nativeEvent=n,r.targetInst=t,e=r}else e={topLevelType:e,nativeEvent:n,targetInst:t,ancestors:[]};try{if(n=e,Me)Rn(n);else{Me=!0;try{Ue(Rn,n,void 0)}finally{Me=!1,ze()}}}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,10>jn.length&&jn.push(e)}}}var zn=new("function"==typeof WeakMap?WeakMap:Map);function Dn(e){var t=zn.get(e);return void 0===t&&(t=new Set,zn.set(e,t)),t}function Ln(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}function Fn(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Wn(e,t){var n,r=Fn(e);for(e=0;r;){if(3===r.nodeType){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Fn(r)}}function Bn(){for(var e=window,t=Ln();t instanceof e.HTMLIFrameElement;){try{var n="string"==typeof t.contentWindow.location.href}catch(e){n=!1}if(!n)break;t=Ln((e=t.contentWindow).document)}return t}function $n(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&("text"===e.type||"search"===e.type||"tel"===e.type||"url"===e.type||"password"===e.type)||"textarea"===t||"true"===e.contentEditable)}var Vn=q&&"documentMode"in document&&11>=document.documentMode,qn={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")}},Hn=null,Kn=null,Qn=null,Gn=!1;function Yn(e,t){var n=t.window===t?t.document:9===t.nodeType?t:t.ownerDocument;return Gn||null==Hn||Hn!==Ln(n)?null:("selectionStart"in(n=Hn)&&$n(n)?n={start:n.selectionStart,end:n.selectionEnd}:n={anchorNode:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection()).anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset},Qn&&nn(Qn,n)?null:(Qn=n,(e=le.getPooled(qn.select,Kn,e,t)).type="select",e.target=Hn,V(e),e))}var Zn={eventTypes:qn,extractEvents:function(e,t,n,r){var o,a=r.window===r?r.document:9===r.nodeType?r:r.ownerDocument;if(!(o=!a)){e:{a=Dn(a),o=h.onSelect;for(var i=0;i<o.length;i++)if(!a.has(o[i])){a=!1;break e}a=!0}o=!a}if(o)return null;switch(a=t?z(t):window,e){case"focus":(Le(a)||"true"===a.contentEditable)&&(Hn=a,Kn=t,Qn=null);break;case"blur":Qn=Kn=Hn=null;break;case"mousedown":Gn=!0;break;case"contextmenu":case"mouseup":case"dragend":return Gn=!1,Yn(n,r);case"selectionchange":if(Vn)break;case"keydown":case"keyup":return Yn(n,r)}return null}};function Xn(e,t){return e=o({children:void 0},t),(t=function(e){var t="";return r.Children.forEach(e,function(e){null!=e&&(t+=e)}),t}(t.children))&&(e.children=t),e}function Jn(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Et(n),t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function er(e,t){if(null!=t.dangerouslySetInnerHTML)throw i(Error(91));return o({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function tr(e,t){var n=t.value;if(null==n){if(n=t.defaultValue,null!=(t=t.children)){if(null!=n)throw i(Error(92));if(Array.isArray(t)){if(!(1>=t.length))throw i(Error(93));t=t[0]}n=t}null==n&&(n="")}e._wrapperState={initialValue:Et(n)}}function nr(e,t){var n=Et(t.value),r=Et(t.defaultValue);null!=n&&((n=""+n)!==e.value&&(e.value=n),null==t.defaultValue&&e.defaultValue!==n&&(e.defaultValue=n)),null!=r&&(e.defaultValue=""+r)}function rr(e){var t=e.textContent;t===e._wrapperState.initialValue&&(e.value=t)}P.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")),w=D,_=M,x=z,P.injectEventPluginsByName({SimpleEventPlugin:Cn,EnterLeaveEventPlugin:Jt,ChangeEventPlugin:Wt,SelectEventPlugin:Zn,BeforeInputEventPlugin:Se});var or={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function ar(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ir(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?ar(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}var ur=void 0,lr=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n)})}:e}(function(e,t){if(e.namespaceURI!==or.svg||"innerHTML"in e)e.innerHTML=t;else{for((ur=ur||document.createElement("div")).innerHTML="<svg>"+t+"</svg>",t=ur.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function cr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}var sr={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},fr=["Webkit","ms","Moz","O"];function pr(e,t,n){return null==t||"boolean"==typeof t||""===t?"":n||"number"!=typeof t||0===t||sr.hasOwnProperty(e)&&sr[e]?(""+t).trim():t+"px"}function dr(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=pr(n,t[n],r);"float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}Object.keys(sr).forEach(function(e){fr.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),sr[t]=sr[e]})});var hr=o({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function mr(e,t){if(t){if(hr[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML))throw i(Error(137),e,"");if(null!=t.dangerouslySetInnerHTML){if(null!=t.children)throw i(Error(60));if(!("object"==typeof t.dangerouslySetInnerHTML&&"__html"in t.dangerouslySetInnerHTML))throw i(Error(61))}if(null!=t.style&&"object"!=typeof t.style)throw i(Error(62),"")}}function vr(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}function yr(e,t){var n=Dn(e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument);t=h[t];for(var r=0;r<t.length;r++){var o=t[r];if(!n.has(o)){switch(o){case"scroll":Un(e,"scroll",!0);break;case"focus":case"blur":Un(e,"focus",!0),Un(e,"blur",!0),n.add("blur"),n.add("focus");break;case"cancel":case"close":We(o)&&Un(e,o,!0);break;case"invalid":case"submit":case"reset":break;default:-1===te.indexOf(o)&&An(o,e)}n.add(o)}}}function gr(){}var br=null,Er=null;function wr(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function _r(e,t){return"textarea"===e||"option"===e||"noscript"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&null!=t.dangerouslySetInnerHTML.__html}var xr="function"==typeof setTimeout?setTimeout:void 0,kr="function"==typeof clearTimeout?clearTimeout:void 0;function Sr(e){for(;null!=e;e=e.nextSibling){var t=e.nodeType;if(1===t||3===t)break}return e}new Set;var Nr=[],Or=-1;function Tr(e){0>Or||(e.current=Nr[Or],Nr[Or]=null,Or--)}function Cr(e,t){Nr[++Or]=e.current,e.current=t}var Pr={},jr={current:Pr},Rr={current:!1},Ir=Pr;function Ar(e,t){var n=e.type.contextTypes;if(!n)return Pr;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o,a={};for(o in n)a[o]=t[o];return r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=a),a}function Ur(e){return null!=(e=e.childContextTypes)}function Mr(e){Tr(Rr),Tr(jr)}function zr(e){Tr(Rr),Tr(jr)}function Dr(e,t,n){if(jr.current!==Pr)throw i(Error(168));Cr(jr,t),Cr(Rr,n)}function Lr(e,t,n){var r=e.stateNode;if(e=t.childContextTypes,"function"!=typeof r.getChildContext)return n;for(var a in r=r.getChildContext())if(!(a in e))throw i(Error(108),ct(t)||"Unknown",a);return o({},n,r)}function Fr(e){var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||Pr,Ir=jr.current,Cr(jr,t),Cr(Rr,Rr.current),!0}function Wr(e,t,n){var r=e.stateNode;if(!r)throw i(Error(169));n?(t=Lr(e,t,Ir),r.__reactInternalMemoizedMergedChildContext=t,Tr(Rr),Tr(jr),Cr(jr,t)):Tr(Rr),Cr(Rr,n)}var Br=a.unstable_runWithPriority,$r=a.unstable_scheduleCallback,Vr=a.unstable_cancelCallback,qr=a.unstable_shouldYield,Hr=a.unstable_requestPaint,Kr=a.unstable_now,Qr=a.unstable_getCurrentPriorityLevel,Gr=a.unstable_ImmediatePriority,Yr=a.unstable_UserBlockingPriority,Zr=a.unstable_NormalPriority,Xr=a.unstable_LowPriority,Jr=a.unstable_IdlePriority,eo={},to=void 0!==Hr?Hr:function(){},no=null,ro=null,oo=!1,ao=Kr(),io=1e4>ao?Kr:function(){return Kr()-ao};function uo(){switch(Qr()){case Gr:return 99;case Yr:return 98;case Zr:return 97;case Xr:return 96;case Jr:return 95;default:throw i(Error(332))}}function lo(e){switch(e){case 99:return Gr;case 98:return Yr;case 97:return Zr;case 96:return Xr;case 95:return Jr;default:throw i(Error(332))}}function co(e,t){return e=lo(e),Br(e,t)}function so(e,t,n){return e=lo(e),$r(e,t,n)}function fo(e){return null===no?(no=[e],ro=$r(Gr,ho)):no.push(e),eo}function po(){null!==ro&&Vr(ro),ho()}function ho(){if(!oo&&null!==no){oo=!0;var e=0;try{var t=no;co(99,function(){for(;e<t.length;e++){var n=t[e];do{n=n(!0)}while(null!==n)}}),no=null}catch(t){throw null!==no&&(no=no.slice(e+1)),$r(Gr,po),t}finally{oo=!1}}}function mo(e,t){return 1073741823===t?99:1===t?95:0>=(e=10*(1073741821-t)-10*(1073741821-e))?99:250>=e?98:5250>=e?97:95}function vo(e,t){if(e&&e.defaultProps)for(var n in t=o({},t),e=e.defaultProps)void 0===t[n]&&(t[n]=e[n]);return t}var yo={current:null},go=null,bo=null,Eo=null;function wo(){Eo=bo=go=null}function _o(e,t){var n=e.type._context;Cr(yo,n._currentValue),n._currentValue=t}function xo(e){var t=yo.current;Tr(yo),e.type._context._currentValue=t}function ko(e,t){for(;null!==e;){var n=e.alternate;if(e.childExpirationTime<t)e.childExpirationTime=t,null!==n&&n.childExpirationTime<t&&(n.childExpirationTime=t);else{if(!(null!==n&&n.childExpirationTime<t))break;n.childExpirationTime=t}e=e.return}}function So(e,t){go=e,Eo=bo=null,null!==(e=e.dependencies)&&null!==e.firstContext&&(e.expirationTime>=t&&(li=!0),e.firstContext=null)}function No(e,t){if(Eo!==e&&!1!==t&&0!==t)if("number"==typeof t&&1073741823!==t||(Eo=e,t=1073741823),t={context:e,observedBits:t,next:null},null===bo){if(null===go)throw i(Error(308));bo=t,go.dependencies={expirationTime:0,firstContext:t,responders:null}}else bo=bo.next=t;return e._currentValue}var Oo=!1;function To(e){return{baseState:e,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function Co(e){return{baseState:e.baseState,firstUpdate:e.firstUpdate,lastUpdate:e.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function Po(e,t){return{expirationTime:e,suspenseConfig:t,tag:0,payload:null,callback:null,next:null,nextEffect:null}}function jo(e,t){null===e.lastUpdate?e.firstUpdate=e.lastUpdate=t:(e.lastUpdate.next=t,e.lastUpdate=t)}function Ro(e,t){var n=e.alternate;if(null===n){var r=e.updateQueue,o=null;null===r&&(r=e.updateQueue=To(e.memoizedState))}else r=e.updateQueue,o=n.updateQueue,null===r?null===o?(r=e.updateQueue=To(e.memoizedState),o=n.updateQueue=To(n.memoizedState)):r=e.updateQueue=Co(o):null===o&&(o=n.updateQueue=Co(r));null===o||r===o?jo(r,t):null===r.lastUpdate||null===o.lastUpdate?(jo(r,t),jo(o,t)):(jo(r,t),o.lastUpdate=t)}function Io(e,t){var n=e.updateQueue;null===(n=null===n?e.updateQueue=To(e.memoizedState):Ao(e,n)).lastCapturedUpdate?n.firstCapturedUpdate=n.lastCapturedUpdate=t:(n.lastCapturedUpdate.next=t,n.lastCapturedUpdate=t)}function Ao(e,t){var n=e.alternate;return null!==n&&t===n.updateQueue&&(t=e.updateQueue=Co(t)),t}function Uo(e,t,n,r,a,i){switch(n.tag){case 1:return"function"==typeof(e=n.payload)?e.call(i,r,a):e;case 3:e.effectTag=-2049&e.effectTag|64;case 0:if(null==(a="function"==typeof(e=n.payload)?e.call(i,r,a):e))break;return o({},r,a);case 2:Oo=!0}return r}function Mo(e,t,n,r,o){Oo=!1;for(var a=(t=Ao(e,t)).baseState,i=null,u=0,l=t.firstUpdate,c=a;null!==l;){var s=l.expirationTime;s<o?(null===i&&(i=l,a=c),u<s&&(u=s)):(Lu(s,l.suspenseConfig),c=Uo(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastEffect?t.firstEffect=t.lastEffect=l:(t.lastEffect.nextEffect=l,t.lastEffect=l))),l=l.next}for(s=null,l=t.firstCapturedUpdate;null!==l;){var f=l.expirationTime;f<o?(null===s&&(s=l,null===i&&(a=c)),u<f&&(u=f)):(c=Uo(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastCapturedEffect?t.firstCapturedEffect=t.lastCapturedEffect=l:(t.lastCapturedEffect.nextEffect=l,t.lastCapturedEffect=l))),l=l.next}null===i&&(t.lastUpdate=null),null===s?t.lastCapturedUpdate=null:e.effectTag|=32,null===i&&null===s&&(a=c),t.baseState=a,t.firstUpdate=i,t.firstCapturedUpdate=s,e.expirationTime=u,e.memoizedState=c}function zo(e,t,n){null!==t.firstCapturedUpdate&&(null!==t.lastUpdate&&(t.lastUpdate.next=t.firstCapturedUpdate,t.lastUpdate=t.lastCapturedUpdate),t.firstCapturedUpdate=t.lastCapturedUpdate=null),Do(t.firstEffect,n),t.firstEffect=t.lastEffect=null,Do(t.firstCapturedEffect,n),t.firstCapturedEffect=t.lastCapturedEffect=null}function Do(e,t){for(;null!==e;){var n=e.callback;if(null!==n){e.callback=null;var r=t;if("function"!=typeof n)throw i(Error(191),n);n.call(r)}e=e.nextEffect}}var Lo=qe.ReactCurrentBatchConfig,Fo=(new r.Component).refs;function Wo(e,t,n,r){n=null==(n=n(r,t=e.memoizedState))?t:o({},t,n),e.memoizedState=n,null!==(r=e.updateQueue)&&0===e.expirationTime&&(r.baseState=n)}var Bo={isMounted:function(e){return!!(e=e._reactInternalFiber)&&2===on(e)},enqueueSetState:function(e,t,n){e=e._reactInternalFiber;var r=Nu(),o=Lo.suspense;(o=Po(r=Ou(r,e,o),o)).payload=t,null!=n&&(o.callback=n),Ro(e,o),Cu(e,r)},enqueueReplaceState:function(e,t,n){e=e._reactInternalFiber;var r=Nu(),o=Lo.suspense;(o=Po(r=Ou(r,e,o),o)).tag=1,o.payload=t,null!=n&&(o.callback=n),Ro(e,o),Cu(e,r)},enqueueForceUpdate:function(e,t){e=e._reactInternalFiber;var n=Nu(),r=Lo.suspense;(r=Po(n=Ou(n,e,r),r)).tag=2,null!=t&&(r.callback=t),Ro(e,r),Cu(e,n)}};function $o(e,t,n,r,o,a,i){return"function"==typeof(e=e.stateNode).shouldComponentUpdate?e.shouldComponentUpdate(r,a,i):!t.prototype||!t.prototype.isPureReactComponent||(!nn(n,r)||!nn(o,a))}function Vo(e,t,n){var r=!1,o=Pr,a=t.contextType;return"object"==typeof a&&null!==a?a=No(a):(o=Ur(t)?Ir:jr.current,a=(r=null!=(r=t.contextTypes))?Ar(e,o):Pr),t=new t(n,a),e.memoizedState=null!==t.state&&void 0!==t.state?t.state:null,t.updater=Bo,e.stateNode=t,t._reactInternalFiber=e,r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=a),t}function qo(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Bo.enqueueReplaceState(t,t.state,null)}function Ho(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs=Fo;var a=t.contextType;"object"==typeof a&&null!==a?o.context=No(a):(a=Ur(t)?Ir:jr.current,o.context=Ar(e,a)),null!==(a=e.updateQueue)&&(Mo(e,a,n,o,r),o.state=e.memoizedState),"function"==typeof(a=t.getDerivedStateFromProps)&&(Wo(e,t,a,n),o.state=e.memoizedState),"function"==typeof t.getDerivedStateFromProps||"function"==typeof o.getSnapshotBeforeUpdate||"function"!=typeof o.UNSAFE_componentWillMount&&"function"!=typeof o.componentWillMount||(t=o.state,"function"==typeof o.componentWillMount&&o.componentWillMount(),"function"==typeof o.UNSAFE_componentWillMount&&o.UNSAFE_componentWillMount(),t!==o.state&&Bo.enqueueReplaceState(o,o.state,null),null!==(a=e.updateQueue)&&(Mo(e,a,n,o,r),o.state=e.memoizedState)),"function"==typeof o.componentDidMount&&(e.effectTag|=4)}var Ko=Array.isArray;function Qo(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){n=n._owner;var r=void 0;if(n){if(1!==n.tag)throw i(Error(309));r=n.stateNode}if(!r)throw i(Error(147),e);var o=""+e;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===o?t.ref:((t=function(e){var t=r.refs;t===Fo&&(t=r.refs={}),null===e?delete t[o]:t[o]=e})._stringRef=o,t)}if("string"!=typeof e)throw i(Error(284));if(!n._owner)throw i(Error(290),e)}return e}function Go(e,t){if("textarea"!==e.type)throw i(Error(31),"[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,"")}function Yo(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function o(e,t,n){return(e=Ju(e,t)).index=0,e.sibling=null,e}function a(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index)<n?(t.effectTag=2,n):r:(t.effectTag=2,n):n}function u(t){return e&&null===t.alternate&&(t.effectTag=2),t}function l(e,t,n,r){return null===t||6!==t.tag?((t=nl(n,e.mode,r)).return=e,t):((t=o(t,n)).return=e,t)}function c(e,t,n,r){return null!==t&&t.elementType===n.type?((r=o(t,n.props)).ref=Qo(e,t,n),r.return=e,r):((r=el(n.type,n.key,n.props,null,e.mode,r)).ref=Qo(e,t,n),r.return=e,r)}function s(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?((t=rl(n,e.mode,r)).return=e,t):((t=o(t,n.children||[])).return=e,t)}function f(e,t,n,r,a){return null===t||7!==t.tag?((t=tl(n,e.mode,r,a)).return=e,t):((t=o(t,n)).return=e,t)}function p(e,t,n){if("string"==typeof t||"number"==typeof t)return(t=nl(""+t,e.mode,n)).return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case Qe:return(n=el(t.type,t.key,t.props,null,e.mode,n)).ref=Qo(e,null,t),n.return=e,n;case Ge:return(t=rl(t,e.mode,n)).return=e,t}if(Ko(t)||lt(t))return(t=tl(t,e.mode,n,null)).return=e,t;Go(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:l(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case Qe:return n.key===o?n.type===Ye?f(e,t,n.props.children,r,o):c(e,t,n,r):null;case Ge:return n.key===o?s(e,t,n,r):null}if(Ko(n)||lt(n))return null!==o?null:f(e,t,n,r,null);Go(e,n)}return null}function h(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return l(t,e=e.get(n)||null,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case Qe:return e=e.get(null===r.key?n:r.key)||null,r.type===Ye?f(t,e,r.props.children,o,r.key):c(t,e,r,o);case Ge:return s(t,e=e.get(null===r.key?n:r.key)||null,r,o)}if(Ko(r)||lt(r))return f(t,e=e.get(n)||null,r,o,null);Go(t,r)}return null}function m(o,i,u,l){for(var c=null,s=null,f=i,m=i=0,v=null;null!==f&&m<u.length;m++){f.index>m?(v=f,f=null):v=f.sibling;var y=d(o,f,u[m],l);if(null===y){null===f&&(f=v);break}e&&f&&null===y.alternate&&t(o,f),i=a(y,i,m),null===s?c=y:s.sibling=y,s=y,f=v}if(m===u.length)return n(o,f),c;if(null===f){for(;m<u.length;m++)null!==(f=p(o,u[m],l))&&(i=a(f,i,m),null===s?c=f:s.sibling=f,s=f);return c}for(f=r(o,f);m<u.length;m++)null!==(v=h(f,o,m,u[m],l))&&(e&&null!==v.alternate&&f.delete(null===v.key?m:v.key),i=a(v,i,m),null===s?c=v:s.sibling=v,s=v);return e&&f.forEach(function(e){return t(o,e)}),c}function v(o,u,l,c){var s=lt(l);if("function"!=typeof s)throw i(Error(150));if(null==(l=s.call(l)))throw i(Error(151));for(var f=s=null,m=u,v=u=0,y=null,g=l.next();null!==m&&!g.done;v++,g=l.next()){m.index>v?(y=m,m=null):y=m.sibling;var b=d(o,m,g.value,c);if(null===b){null===m&&(m=y);break}e&&m&&null===b.alternate&&t(o,m),u=a(b,u,v),null===f?s=b:f.sibling=b,f=b,m=y}if(g.done)return n(o,m),s;if(null===m){for(;!g.done;v++,g=l.next())null!==(g=p(o,g.value,c))&&(u=a(g,u,v),null===f?s=g:f.sibling=g,f=g);return s}for(m=r(o,m);!g.done;v++,g=l.next())null!==(g=h(m,o,v,g.value,c))&&(e&&null!==g.alternate&&m.delete(null===g.key?v:g.key),u=a(g,u,v),null===f?s=g:f.sibling=g,f=g);return e&&m.forEach(function(e){return t(o,e)}),s}return function(e,r,a,l){var c="object"==typeof a&&null!==a&&a.type===Ye&&null===a.key;c&&(a=a.props.children);var s="object"==typeof a&&null!==a;if(s)switch(a.$$typeof){case Qe:e:{for(s=a.key,c=r;null!==c;){if(c.key===s){if(7===c.tag?a.type===Ye:c.elementType===a.type){n(e,c.sibling),(r=o(c,a.type===Ye?a.props.children:a.props)).ref=Qo(e,c,a),r.return=e,e=r;break e}n(e,c);break}t(e,c),c=c.sibling}a.type===Ye?((r=tl(a.props.children,e.mode,l,a.key)).return=e,e=r):((l=el(a.type,a.key,a.props,null,e.mode,l)).ref=Qo(e,r,a),l.return=e,e=l)}return u(e);case Ge:e:{for(c=a.key;null!==r;){if(r.key===c){if(4===r.tag&&r.stateNode.containerInfo===a.containerInfo&&r.stateNode.implementation===a.implementation){n(e,r.sibling),(r=o(r,a.children||[])).return=e,e=r;break e}n(e,r);break}t(e,r),r=r.sibling}(r=rl(a,e.mode,l)).return=e,e=r}return u(e)}if("string"==typeof a||"number"==typeof a)return a=""+a,null!==r&&6===r.tag?(n(e,r.sibling),(r=o(r,a)).return=e,e=r):(n(e,r),(r=nl(a,e.mode,l)).return=e,e=r),u(e);if(Ko(a))return m(e,r,a,l);if(lt(a))return v(e,r,a,l);if(s&&Go(e,a),void 0===a&&!c)switch(e.tag){case 1:case 0:throw e=e.type,i(Error(152),e.displayName||e.name||"Component")}return n(e,r)}}var Zo=Yo(!0),Xo=Yo(!1),Jo={},ea={current:Jo},ta={current:Jo},na={current:Jo};function ra(e){if(e===Jo)throw i(Error(174));return e}function oa(e,t){Cr(na,t),Cr(ta,e),Cr(ea,Jo);var n=t.nodeType;switch(n){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ir(null,"");break;default:t=ir(t=(n=8===n?t.parentNode:t).namespaceURI||null,n=n.tagName)}Tr(ea),Cr(ea,t)}function aa(e){Tr(ea),Tr(ta),Tr(na)}function ia(e){ra(na.current);var t=ra(ea.current),n=ir(t,e.type);t!==n&&(Cr(ta,e),Cr(ea,n))}function ua(e){ta.current===e&&(Tr(ea),Tr(ta))}var la=1,ca=1,sa=2,fa={current:0};function pa(e){for(var t=e;null!==t;){if(13===t.tag){if(null!==t.memoizedState)return t}else if(19===t.tag&&void 0!==t.memoizedProps.revealOrder){if(0!=(64&t.effectTag))return t}else if(null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var da=0,ha=2,ma=4,va=8,ya=16,ga=32,ba=64,Ea=128,wa=qe.ReactCurrentDispatcher,_a=0,xa=null,ka=null,Sa=null,Na=null,Oa=null,Ta=null,Ca=0,Pa=null,ja=0,Ra=!1,Ia=null,Aa=0;function Ua(){throw i(Error(321))}function Ma(e,t){if(null===t)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!en(e[n],t[n]))return!1;return!0}function za(e,t,n,r,o,a){if(_a=a,xa=t,Sa=null!==e?e.memoizedState:null,wa.current=null===Sa?Ya:Za,t=n(r,o),Ra){do{Ra=!1,Aa+=1,Sa=null!==e?e.memoizedState:null,Ta=Na,Pa=Oa=ka=null,wa.current=Za,t=n(r,o)}while(Ra);Ia=null,Aa=0}if(wa.current=Ga,(e=xa).memoizedState=Na,e.expirationTime=Ca,e.updateQueue=Pa,e.effectTag|=ja,e=null!==ka&&null!==ka.next,_a=0,Ta=Oa=Na=Sa=ka=xa=null,Ca=0,Pa=null,ja=0,e)throw i(Error(300));return t}function Da(){wa.current=Ga,_a=0,Ta=Oa=Na=Sa=ka=xa=null,Ca=0,Pa=null,ja=0,Ra=!1,Ia=null,Aa=0}function La(){var e={memoizedState:null,baseState:null,queue:null,baseUpdate:null,next:null};return null===Oa?Na=Oa=e:Oa=Oa.next=e,Oa}function Fa(){if(null!==Ta)Ta=(Oa=Ta).next,Sa=null!==(ka=Sa)?ka.next:null;else{if(null===Sa)throw i(Error(310));var e={memoizedState:(ka=Sa).memoizedState,baseState:ka.baseState,queue:ka.queue,baseUpdate:ka.baseUpdate,next:null};Oa=null===Oa?Na=e:Oa.next=e,Sa=ka.next}return Oa}function Wa(e,t){return"function"==typeof t?t(e):t}function Ba(e){var t=Fa(),n=t.queue;if(null===n)throw i(Error(311));if(n.lastRenderedReducer=e,0<Aa){var r=n.dispatch;if(null!==Ia){var o=Ia.get(n);if(void 0!==o){Ia.delete(n);var a=t.memoizedState;do{a=e(a,o.action),o=o.next}while(null!==o);return en(a,t.memoizedState)||(li=!0),t.memoizedState=a,t.baseUpdate===n.last&&(t.baseState=a),n.lastRenderedState=a,[a,r]}}return[t.memoizedState,r]}r=n.last;var u=t.baseUpdate;if(a=t.baseState,null!==u?(null!==r&&(r.next=null),r=u.next):r=null!==r?r.next:null,null!==r){var l=o=null,c=r,s=!1;do{var f=c.expirationTime;f<_a?(s||(s=!0,l=u,o=a),f>Ca&&(Ca=f)):(Lu(f,c.suspenseConfig),a=c.eagerReducer===e?c.eagerState:e(a,c.action)),u=c,c=c.next}while(null!==c&&c!==r);s||(l=u,o=a),en(a,t.memoizedState)||(li=!0),t.memoizedState=a,t.baseUpdate=l,t.baseState=o,n.lastRenderedState=a}return[t.memoizedState,n.dispatch]}function $a(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},null===Pa?(Pa={lastEffect:null}).lastEffect=e.next=e:null===(t=Pa.lastEffect)?Pa.lastEffect=e.next=e:(n=t.next,t.next=e,e.next=n,Pa.lastEffect=e),e}function Va(e,t,n,r){var o=La();ja|=e,o.memoizedState=$a(t,n,void 0,void 0===r?null:r)}function qa(e,t,n,r){var o=Fa();r=void 0===r?null:r;var a=void 0;if(null!==ka){var i=ka.memoizedState;if(a=i.destroy,null!==r&&Ma(r,i.deps))return void $a(da,n,a,r)}ja|=e,o.memoizedState=$a(t,n,a,r)}function Ha(e,t){return"function"==typeof t?(e=e(),t(e),function(){t(null)}):null!=t?(e=e(),t.current=e,function(){t.current=null}):void 0}function Ka(){}function Qa(e,t,n){if(!(25>Aa))throw i(Error(301));var r=e.alternate;if(e===xa||null!==r&&r===xa)if(Ra=!0,e={expirationTime:_a,suspenseConfig:null,action:n,eagerReducer:null,eagerState:null,next:null},null===Ia&&(Ia=new Map),void 0===(n=Ia.get(t)))Ia.set(t,e);else{for(t=n;null!==t.next;)t=t.next;t.next=e}else{var o=Nu(),a=Lo.suspense;a={expirationTime:o=Ou(o,e,a),suspenseConfig:a,action:n,eagerReducer:null,eagerState:null,next:null};var u=t.last;if(null===u)a.next=a;else{var l=u.next;null!==l&&(a.next=l),u.next=a}if(t.last=a,0===e.expirationTime&&(null===r||0===r.expirationTime)&&null!==(r=t.lastRenderedReducer))try{var c=t.lastRenderedState,s=r(c,n);if(a.eagerReducer=r,a.eagerState=s,en(s,c))return}catch(e){}Cu(e,o)}}var Ga={readContext:No,useCallback:Ua,useContext:Ua,useEffect:Ua,useImperativeHandle:Ua,useLayoutEffect:Ua,useMemo:Ua,useReducer:Ua,useRef:Ua,useState:Ua,useDebugValue:Ua,useResponder:Ua},Ya={readContext:No,useCallback:function(e,t){return La().memoizedState=[e,void 0===t?null:t],e},useContext:No,useEffect:function(e,t){return Va(516,Ea|ba,e,t)},useImperativeHandle:function(e,t,n){return n=null!=n?n.concat([e]):null,Va(4,ma|ga,Ha.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Va(4,ma|ga,e,t)},useMemo:function(e,t){var n=La();return t=void 0===t?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=La();return t=void 0!==n?n(t):t,r.memoizedState=r.baseState=t,e=(e=r.queue={last:null,dispatch:null,lastRenderedReducer:e,lastRenderedState:t}).dispatch=Qa.bind(null,xa,e),[r.memoizedState,e]},useRef:function(e){return e={current:e},La().memoizedState=e},useState:function(e){var t=La();return"function"==typeof e&&(e=e()),t.memoizedState=t.baseState=e,e=(e=t.queue={last:null,dispatch:null,lastRenderedReducer:Wa,lastRenderedState:e}).dispatch=Qa.bind(null,xa,e),[t.memoizedState,e]},useDebugValue:Ka,useResponder:rn},Za={readContext:No,useCallback:function(e,t){var n=Fa();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&Ma(t,r[1])?r[0]:(n.memoizedState=[e,t],e)},useContext:No,useEffect:function(e,t){return qa(516,Ea|ba,e,t)},useImperativeHandle:function(e,t,n){return n=null!=n?n.concat([e]):null,qa(4,ma|ga,Ha.bind(null,t,e),n)},useLayoutEffect:function(e,t){return qa(4,ma|ga,e,t)},useMemo:function(e,t){var n=Fa();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&Ma(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)},useReducer:Ba,useRef:function(){return Fa().memoizedState},useState:function(e){return Ba(Wa)},useDebugValue:Ka,useResponder:rn},Xa=null,Ja=null,ei=!1;function ti(e,t){var n=Zu(5,null,null,0);n.elementType="DELETED",n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function ni(e,t){switch(e.tag){case 5:var n=e.type;return null!==(t=1!==t.nodeType||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t)&&(e.stateNode=t,!0);case 6:return null!==(t=""===e.pendingProps||3!==t.nodeType?null:t)&&(e.stateNode=t,!0);case 13:default:return!1}}function ri(e){if(ei){var t=Ja;if(t){var n=t;if(!ni(e,t)){if(!(t=Sr(n.nextSibling))||!ni(e,t))return e.effectTag|=2,ei=!1,void(Xa=e);ti(Xa,n)}Xa=e,Ja=Sr(t.firstChild)}else e.effectTag|=2,ei=!1,Xa=e}}function oi(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag&&18!==e.tag;)e=e.return;Xa=e}function ai(e){if(e!==Xa)return!1;if(!ei)return oi(e),ei=!0,!1;var t=e.type;if(5!==e.tag||"head"!==t&&"body"!==t&&!_r(t,e.memoizedProps))for(t=Ja;t;)ti(e,t),t=Sr(t.nextSibling);return oi(e),Ja=Xa?Sr(e.stateNode.nextSibling):null,!0}function ii(){Ja=Xa=null,ei=!1}var ui=qe.ReactCurrentOwner,li=!1;function ci(e,t,n,r){t.child=null===e?Xo(t,null,n,r):Zo(t,e.child,n,r)}function si(e,t,n,r,o){n=n.render;var a=t.ref;return So(t,o),r=za(e,t,n,r,a,o),null===e||li?(t.effectTag|=1,ci(e,t,r,o),t.child):(t.updateQueue=e.updateQueue,t.effectTag&=-517,e.expirationTime<=o&&(e.expirationTime=0),_i(e,t,o))}function fi(e,t,n,r,o,a){if(null===e){var i=n.type;return"function"!=typeof i||Xu(i)||void 0!==i.defaultProps||null!==n.compare||void 0!==n.defaultProps?((e=el(n.type,null,r,null,t.mode,a)).ref=t.ref,e.return=t,t.child=e):(t.tag=15,t.type=i,pi(e,t,i,r,o,a))}return i=e.child,o<a&&(o=i.memoizedProps,(n=null!==(n=n.compare)?n:nn)(o,r)&&e.ref===t.ref)?_i(e,t,a):(t.effectTag|=1,(e=Ju(i,r)).ref=t.ref,e.return=t,t.child=e)}function pi(e,t,n,r,o,a){return null!==e&&nn(e.memoizedProps,r)&&e.ref===t.ref&&(li=!1,o<a)?_i(e,t,a):hi(e,t,n,r,a)}function di(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function hi(e,t,n,r,o){var a=Ur(n)?Ir:jr.current;return a=Ar(t,a),So(t,o),n=za(e,t,n,r,a,o),null===e||li?(t.effectTag|=1,ci(e,t,n,o),t.child):(t.updateQueue=e.updateQueue,t.effectTag&=-517,e.expirationTime<=o&&(e.expirationTime=0),_i(e,t,o))}function mi(e,t,n,r,o){if(Ur(n)){var a=!0;Fr(t)}else a=!1;if(So(t,o),null===t.stateNode)null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),Vo(t,n,r),Ho(t,n,r,o),r=!0;else if(null===e){var i=t.stateNode,u=t.memoizedProps;i.props=u;var l=i.context,c=n.contextType;"object"==typeof c&&null!==c?c=No(c):c=Ar(t,c=Ur(n)?Ir:jr.current);var s=n.getDerivedStateFromProps,f="function"==typeof s||"function"==typeof i.getSnapshotBeforeUpdate;f||"function"!=typeof i.UNSAFE_componentWillReceiveProps&&"function"!=typeof i.componentWillReceiveProps||(u!==r||l!==c)&&qo(t,i,r,c),Oo=!1;var p=t.memoizedState;l=i.state=p;var d=t.updateQueue;null!==d&&(Mo(t,d,r,i,o),l=t.memoizedState),u!==r||p!==l||Rr.current||Oo?("function"==typeof s&&(Wo(t,n,s,r),l=t.memoizedState),(u=Oo||$o(t,n,u,r,p,l,c))?(f||"function"!=typeof i.UNSAFE_componentWillMount&&"function"!=typeof i.componentWillMount||("function"==typeof i.componentWillMount&&i.componentWillMount(),"function"==typeof i.UNSAFE_componentWillMount&&i.UNSAFE_componentWillMount()),"function"==typeof i.componentDidMount&&(t.effectTag|=4)):("function"==typeof i.componentDidMount&&(t.effectTag|=4),t.memoizedProps=r,t.memoizedState=l),i.props=r,i.state=l,i.context=c,r=u):("function"==typeof i.componentDidMount&&(t.effectTag|=4),r=!1)}else i=t.stateNode,u=t.memoizedProps,i.props=t.type===t.elementType?u:vo(t.type,u),l=i.context,"object"==typeof(c=n.contextType)&&null!==c?c=No(c):c=Ar(t,c=Ur(n)?Ir:jr.current),(f="function"==typeof(s=n.getDerivedStateFromProps)||"function"==typeof i.getSnapshotBeforeUpdate)||"function"!=typeof i.UNSAFE_componentWillReceiveProps&&"function"!=typeof i.componentWillReceiveProps||(u!==r||l!==c)&&qo(t,i,r,c),Oo=!1,l=t.memoizedState,p=i.state=l,null!==(d=t.updateQueue)&&(Mo(t,d,r,i,o),p=t.memoizedState),u!==r||l!==p||Rr.current||Oo?("function"==typeof s&&(Wo(t,n,s,r),p=t.memoizedState),(s=Oo||$o(t,n,u,r,l,p,c))?(f||"function"!=typeof i.UNSAFE_componentWillUpdate&&"function"!=typeof i.componentWillUpdate||("function"==typeof i.componentWillUpdate&&i.componentWillUpdate(r,p,c),"function"==typeof i.UNSAFE_componentWillUpdate&&i.UNSAFE_componentWillUpdate(r,p,c)),"function"==typeof i.componentDidUpdate&&(t.effectTag|=4),"function"==typeof i.getSnapshotBeforeUpdate&&(t.effectTag|=256)):("function"!=typeof i.componentDidUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof i.getSnapshotBeforeUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),t.memoizedProps=r,t.memoizedState=p),i.props=r,i.state=p,i.context=c,r=s):("function"!=typeof i.componentDidUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof i.getSnapshotBeforeUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),r=!1);return vi(e,t,n,r,a,o)}function vi(e,t,n,r,o,a){di(e,t);var i=0!=(64&t.effectTag);if(!r&&!i)return o&&Wr(t,n,!1),_i(e,t,a);r=t.stateNode,ui.current=t;var u=i&&"function"!=typeof n.getDerivedStateFromError?null:r.render();return t.effectTag|=1,null!==e&&i?(t.child=Zo(t,e.child,null,a),t.child=Zo(t,null,u,a)):ci(e,t,u,a),t.memoizedState=r.state,o&&Wr(t,n,!0),t.child}function yi(e){var t=e.stateNode;t.pendingContext?Dr(0,t.pendingContext,t.pendingContext!==t.context):t.context&&Dr(0,t.context,!1),oa(e,t.containerInfo)}var gi={};function bi(e,t,n){var r,o=t.mode,a=t.pendingProps,i=fa.current,u=null,l=!1;if((r=0!=(64&t.effectTag))||(r=0!=(i&sa)&&(null===e||null!==e.memoizedState)),r?(u=gi,l=!0,t.effectTag&=-65):null!==e&&null===e.memoizedState||void 0===a.fallback||!0===a.unstable_avoidThisFallback||(i|=ca),Cr(fa,i&=la),null===e)if(l){if(a=a.fallback,(e=tl(null,o,0,null)).return=t,0==(2&t.mode))for(l=null!==t.memoizedState?t.child.child:t.child,e.child=l;null!==l;)l.return=e,l=l.sibling;(n=tl(a,o,n,null)).return=t,e.sibling=n,o=e}else o=n=Xo(t,null,a.children,n);else{if(null!==e.memoizedState)if(o=(i=e.child).sibling,l){if(a=a.fallback,(n=Ju(i,i.pendingProps)).return=t,0==(2&t.mode)&&(l=null!==t.memoizedState?t.child.child:t.child)!==i.child)for(n.child=l;null!==l;)l.return=n,l=l.sibling;(a=Ju(o,a,o.expirationTime)).return=t,n.sibling=a,o=n,n.childExpirationTime=0,n=a}else o=n=Zo(t,i.child,a.children,n);else if(i=e.child,l){if(l=a.fallback,(a=tl(null,o,0,null)).return=t,a.child=i,null!==i&&(i.return=a),0==(2&t.mode))for(i=null!==t.memoizedState?t.child.child:t.child,a.child=i;null!==i;)i.return=a,i=i.sibling;(n=tl(l,o,n,null)).return=t,a.sibling=n,n.effectTag|=2,o=a,a.childExpirationTime=0}else n=o=Zo(t,i,a.children,n);t.stateNode=e.stateNode}return t.memoizedState=u,t.child=o,n}function Ei(e,t,n,r,o){var a=e.memoizedState;null===a?e.memoizedState={isBackwards:t,rendering:null,last:r,tail:n,tailExpiration:0,tailMode:o}:(a.isBackwards=t,a.rendering=null,a.last=r,a.tail=n,a.tailExpiration=0,a.tailMode=o)}function wi(e,t,n){var r=t.pendingProps,o=r.revealOrder,a=r.tail;if(ci(e,t,r.children,n),0!=((r=fa.current)&sa))r=r&la|sa,t.effectTag|=64;else{if(null!==e&&0!=(64&e.effectTag))e:for(e=t.child;null!==e;){if(13===e.tag){if(null!==e.memoizedState){e.expirationTime<n&&(e.expirationTime=n);var i=e.alternate;null!==i&&i.expirationTime<n&&(i.expirationTime=n),ko(e.return,n)}}else if(null!==e.child){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;null===e.sibling;){if(null===e.return||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=la}if(Cr(fa,r),0==(2&t.mode))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;null!==n;)null!==(r=n.alternate)&&null===pa(r)&&(o=n),n=n.sibling;null===(n=o)?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Ei(t,!1,o,n,a);break;case"backwards":for(n=null,o=t.child,t.child=null;null!==o;){if(null!==(r=o.alternate)&&null===pa(r)){t.child=o;break}r=o.sibling,o.sibling=n,n=o,o=r}Ei(t,!0,n,null,a);break;case"together":Ei(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function _i(e,t,n){if(null!==e&&(t.dependencies=e.dependencies),t.childExpirationTime<n)return null;if(null!==e&&t.child!==e.child)throw i(Error(153));if(null!==t.child){for(n=Ju(e=t.child,e.pendingProps,e.expirationTime),t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,(n=n.sibling=Ju(e,e.pendingProps,e.expirationTime)).return=t;n.sibling=null}return t.child}function xi(e){e.effectTag|=4}var ki=void 0,Si=void 0,Ni=void 0,Oi=void 0;function Ti(e,t){switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;null!==t;)null!==t.alternate&&(n=t),t=t.sibling;null===n?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;null!==n;)null!==n.alternate&&(r=n),n=n.sibling;null===r?t||null===e.tail?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Ci(e){switch(e.tag){case 1:Ur(e.type)&&Mr();var t=e.effectTag;return 2048&t?(e.effectTag=-2049&t|64,e):null;case 3:if(aa(),zr(),0!=(64&(t=e.effectTag)))throw i(Error(285));return e.effectTag=-2049&t|64,e;case 5:return ua(e),null;case 13:return Tr(fa),2048&(t=e.effectTag)?(e.effectTag=-2049&t|64,e):null;case 18:return null;case 19:return Tr(fa),null;case 4:return aa(),null;case 10:return xo(e),null;default:return null}}function Pi(e,t){return{value:e,source:t,stack:st(t)}}ki=function(e,t){for(var n=t.child;null!==n;){if(5===n.tag||6===n.tag)e.appendChild(n.stateNode);else if(20===n.tag)e.appendChild(n.stateNode.instance);else if(4!==n.tag&&null!==n.child){n.child.return=n,n=n.child;continue}if(n===t)break;for(;null===n.sibling;){if(null===n.return||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Si=function(){},Ni=function(e,t,n,r,a){var i=e.memoizedProps;if(i!==r){var u=t.stateNode;switch(ra(ea.current),e=null,n){case"input":i=wt(u,i),r=wt(u,r),e=[];break;case"option":i=Xn(u,i),r=Xn(u,r),e=[];break;case"select":i=o({},i,{value:void 0}),r=o({},r,{value:void 0}),e=[];break;case"textarea":i=er(u,i),r=er(u,r),e=[];break;default:"function"!=typeof i.onClick&&"function"==typeof r.onClick&&(u.onclick=gr)}mr(n,r),u=n=void 0;var l=null;for(n in i)if(!r.hasOwnProperty(n)&&i.hasOwnProperty(n)&&null!=i[n])if("style"===n){var c=i[n];for(u in c)c.hasOwnProperty(u)&&(l||(l={}),l[u]="")}else"dangerouslySetInnerHTML"!==n&&"children"!==n&&"suppressContentEditableWarning"!==n&&"suppressHydrationWarning"!==n&&"autoFocus"!==n&&(d.hasOwnProperty(n)?e||(e=[]):(e=e||[]).push(n,null));for(n in r){var s=r[n];if(c=null!=i?i[n]:void 0,r.hasOwnProperty(n)&&s!==c&&(null!=s||null!=c))if("style"===n)if(c){for(u in c)!c.hasOwnProperty(u)||s&&s.hasOwnProperty(u)||(l||(l={}),l[u]="");for(u in s)s.hasOwnProperty(u)&&c[u]!==s[u]&&(l||(l={}),l[u]=s[u])}else l||(e||(e=[]),e.push(n,l)),l=s;else"dangerouslySetInnerHTML"===n?(s=s?s.__html:void 0,c=c?c.__html:void 0,null!=s&&c!==s&&(e=e||[]).push(n,""+s)):"children"===n?c===s||"string"!=typeof s&&"number"!=typeof s||(e=e||[]).push(n,""+s):"suppressContentEditableWarning"!==n&&"suppressHydrationWarning"!==n&&(d.hasOwnProperty(n)?(null!=s&&yr(a,n),e||c===s||(e=[])):(e=e||[]).push(n,s))}l&&(e=e||[]).push("style",l),a=e,(t.updateQueue=a)&&xi(t)}},Oi=function(e,t,n,r){n!==r&&xi(t)};var ji="function"==typeof WeakSet?WeakSet:Set;function Ri(e,t){var n=t.source,r=t.stack;null===r&&null!==n&&(r=st(n)),null!==n&&ct(n.type),t=t.value,null!==e&&1===e.tag&&ct(e.type);try{console.error(t)}catch(e){setTimeout(function(){throw e})}}function Ii(e){var t=e.ref;if(null!==t)if("function"==typeof t)try{t(null)}catch(t){qu(e,t)}else t.current=null}function Ai(e,t,n){if(null!==(n=null!==(n=n.updateQueue)?n.lastEffect:null)){var r=n=n.next;do{if((r.tag&e)!==da){var o=r.destroy;r.destroy=void 0,void 0!==o&&o()}(r.tag&t)!==da&&(o=r.create,r.destroy=o()),r=r.next}while(r!==n)}}function Ui(e,t){switch("function"==typeof Gu&&Gu(e),e.tag){case 0:case 11:case 14:case 15:var n=e.updateQueue;if(null!==n&&null!==(n=n.lastEffect)){var r=n.next;co(97<t?97:t,function(){var t=r;do{var n=t.destroy;if(void 0!==n){var o=e;try{n()}catch(e){qu(o,e)}}t=t.next}while(t!==r)})}break;case 1:Ii(e),"function"==typeof(t=e.stateNode).componentWillUnmount&&function(e,t){try{t.props=e.memoizedProps,t.state=e.memoizedState,t.componentWillUnmount()}catch(t){qu(e,t)}}(e,t);break;case 5:Ii(e);break;case 4:Li(e,t)}}function Mi(e,t){for(var n=e;;)if(Ui(n,t),null!==n.child&&4!==n.tag)n.child.return=n,n=n.child;else{if(n===e)break;for(;null===n.sibling;){if(null===n.return||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}}function zi(e){return 5===e.tag||3===e.tag||4===e.tag}function Di(e){e:{for(var t=e.return;null!==t;){if(zi(t)){var n=t;break e}t=t.return}throw i(Error(160))}switch(t=n.stateNode,n.tag){case 5:var r=!1;break;case 3:case 4:t=t.containerInfo,r=!0;break;default:throw i(Error(161))}16&n.effectTag&&(cr(t,""),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||zi(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag&&18!==n.tag;){if(2&n.effectTag)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.effectTag)){n=n.stateNode;break e}}for(var o=e;;){var a=5===o.tag||6===o.tag;if(a||20===o.tag){var u=a?o.stateNode:o.stateNode.instance;if(n)if(r){var l=u;u=n,8===(a=t).nodeType?a.parentNode.insertBefore(l,u):a.insertBefore(l,u)}else t.insertBefore(u,n);else r?(8===(l=t).nodeType?(a=l.parentNode).insertBefore(u,l):(a=l).appendChild(u),null!=(l=l._reactRootContainer)||null!==a.onclick||(a.onclick=gr)):t.appendChild(u)}else if(4!==o.tag&&null!==o.child){o.child.return=o,o=o.child;continue}if(o===e)break;for(;null===o.sibling;){if(null===o.return||o.return===e)return;o=o.return}o.sibling.return=o.return,o=o.sibling}}function Li(e,t){for(var n=e,r=!1,o=void 0,a=void 0;;){if(!r){r=n.return;e:for(;;){if(null===r)throw i(Error(160));switch(o=r.stateNode,r.tag){case 5:a=!1;break e;case 3:case 4:o=o.containerInfo,a=!0;break e}r=r.return}r=!0}if(5===n.tag||6===n.tag)if(Mi(n,t),a){var u=o,l=n.stateNode;8===u.nodeType?u.parentNode.removeChild(l):u.removeChild(l)}else o.removeChild(n.stateNode);else if(20===n.tag)l=n.stateNode.instance,Mi(n,t),a?8===(u=o).nodeType?u.parentNode.removeChild(l):u.removeChild(l):o.removeChild(l);else if(4===n.tag){if(null!==n.child){o=n.stateNode.containerInfo,a=!0,n.child.return=n,n=n.child;continue}}else if(Ui(n,t),null!==n.child){n.child.return=n,n=n.child;continue}if(n===e)break;for(;null===n.sibling;){if(null===n.return||n.return===e)return;4===(n=n.return).tag&&(r=!1)}n.sibling.return=n.return,n=n.sibling}}function Fi(e,t){switch(t.tag){case 0:case 11:case 14:case 15:Ai(ma,va,t);break;case 1:break;case 5:var n=t.stateNode;if(null!=n){var r=t.memoizedProps,o=null!==e?e.memoizedProps:r;e=t.type;var a=t.updateQueue;if(t.updateQueue=null,null!==a){for(n[A]=r,"input"===e&&"radio"===r.type&&null!=r.name&&xt(n,r),vr(e,o),t=vr(e,r),o=0;o<a.length;o+=2){var u=a[o],l=a[o+1];"style"===u?dr(n,l):"dangerouslySetInnerHTML"===u?lr(n,l):"children"===u?cr(n,l):bt(n,u,l,t)}switch(e){case"input":kt(n,r);break;case"textarea":nr(n,r);break;case"select":t=n._wrapperState.wasMultiple,n._wrapperState.wasMultiple=!!r.multiple,null!=(e=r.value)?Jn(n,!!r.multiple,e,!1):t!==!!r.multiple&&(null!=r.defaultValue?Jn(n,!!r.multiple,r.defaultValue,!0):Jn(n,!!r.multiple,r.multiple?[]:"",!1))}}}break;case 6:if(null===t.stateNode)throw i(Error(162));t.stateNode.nodeValue=t.memoizedProps;break;case 3:case 12:break;case 13:if(n=t,null===t.memoizedState?r=!1:(r=!0,n=t.child,pu=io()),null!==n)e:for(e=n;;){if(5===e.tag)a=e.stateNode,r?"function"==typeof(a=a.style).setProperty?a.setProperty("display","none","important"):a.display="none":(a=e.stateNode,o=null!=(o=e.memoizedProps.style)&&o.hasOwnProperty("display")?o.display:null,a.style.display=pr("display",o));else if(6===e.tag)e.stateNode.nodeValue=r?"":e.memoizedProps;else{if(13===e.tag&&null!==e.memoizedState){(a=e.child.sibling).return=e,e=a;continue}if(null!==e.child){e.child.return=e,e=e.child;continue}}if(e===n)break e;for(;null===e.sibling;){if(null===e.return||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}Wi(t);break;case 19:Wi(t);break;case 17:case 20:break;default:throw i(Error(163))}}function Wi(e){var t=e.updateQueue;if(null!==t){e.updateQueue=null;var n=e.stateNode;null===n&&(n=e.stateNode=new ji),t.forEach(function(t){var r=function(e,t){var n=e.stateNode;null!==n&&n.delete(t),n=Nu(),t=Ou(n,e,null),n=mo(n,t),null!==(e=Pu(e,t))&&ju(e,n,t)}.bind(null,e,t);n.has(t)||(n.add(t),t.then(r,r))})}}var Bi="function"==typeof WeakMap?WeakMap:Map;function $i(e,t,n){(n=Po(n,null)).tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){mu||(mu=!0,vu=r),Ri(e,t)},n}function Vi(e,t,n){(n=Po(n,null)).tag=3;var r=e.type.getDerivedStateFromError;if("function"==typeof r){var o=t.value;n.payload=function(){return Ri(e,t),r(o)}}var a=e.stateNode;return null!==a&&"function"==typeof a.componentDidCatch&&(n.callback=function(){"function"!=typeof r&&(null===yu?yu=new Set([this]):yu.add(this),Ri(e,t));var n=t.stack;this.componentDidCatch(t.value,{componentStack:null!==n?n:""})}),n}var qi=Math.ceil,Hi=qe.ReactCurrentDispatcher,Ki=qe.ReactCurrentOwner,Qi=0,Gi=8,Yi=16,Zi=32,Xi=0,Ji=1,eu=2,tu=3,nu=4,ru=Qi,ou=null,au=null,iu=0,uu=Xi,lu=1073741823,cu=1073741823,su=null,fu=!1,pu=0,du=500,hu=null,mu=!1,vu=null,yu=null,gu=!1,bu=null,Eu=90,wu=0,_u=null,xu=0,ku=null,Su=0;function Nu(){return(ru&(Yi|Zi))!==Qi?1073741821-(io()/10|0):0!==Su?Su:Su=1073741821-(io()/10|0)}function Ou(e,t,n){if(0==(2&(t=t.mode)))return 1073741823;var r=uo();if(0==(4&t))return 99===r?1073741823:1073741822;if((ru&Yi)!==Qi)return iu;if(null!==n)e=1073741821-25*(1+((1073741821-e+(0|n.timeoutMs||5e3)/10)/25|0));else switch(r){case 99:e=1073741823;break;case 98:e=1073741821-10*(1+((1073741821-e+15)/10|0));break;case 97:case 96:e=1073741821-25*(1+((1073741821-e+500)/25|0));break;case 95:e=1;break;default:throw i(Error(326))}return null!==ou&&e===iu&&--e,e}var Tu=0;function Cu(e,t){if(50<xu)throw xu=0,ku=null,i(Error(185));if(null!==(e=Pu(e,t))){e.pingTime=0;var n=uo();if(1073741823===t)if((ru&Gi)!==Qi&&(ru&(Yi|Zi))===Qi)for(var r=Du(e,1073741823,!0);null!==r;)r=r(!0);else ju(e,99,1073741823),ru===Qi&&po();else ju(e,n,t);(4&ru)===Qi||98!==n&&99!==n||(null===_u?_u=new Map([[e,t]]):(void 0===(n=_u.get(e))||n>t)&&_u.set(e,t))}}function Pu(e,t){e.expirationTime<t&&(e.expirationTime=t);var n=e.alternate;null!==n&&n.expirationTime<t&&(n.expirationTime=t);var r=e.return,o=null;if(null===r&&3===e.tag)o=e.stateNode;else for(;null!==r;){if(n=r.alternate,r.childExpirationTime<t&&(r.childExpirationTime=t),null!==n&&n.childExpirationTime<t&&(n.childExpirationTime=t),null===r.return&&3===r.tag){o=r.stateNode;break}r=r.return}return null!==o&&(t>o.firstPendingTime&&(o.firstPendingTime=t),0===(e=o.lastPendingTime)||t<e)&&(o.lastPendingTime=t),o}function ju(e,t,n){if(e.callbackExpirationTime<n){var r=e.callbackNode;null!==r&&r!==eo&&Vr(r),e.callbackExpirationTime=n,1073741823===n?e.callbackNode=fo(Ru.bind(null,e,Du.bind(null,e,n))):(r=null,1!==n&&(r={timeout:10*(1073741821-n)-io()}),e.callbackNode=so(t,Ru.bind(null,e,Du.bind(null,e,n)),r))}}function Ru(e,t,n){var r=e.callbackNode,o=null;try{return null!==(o=t(n))?Ru.bind(null,e,o):null}finally{null===o&&r===e.callbackNode&&(e.callbackNode=null,e.callbackExpirationTime=0)}}function Iu(){(ru&(1|Yi|Zi))===Qi&&(function(){if(null!==_u){var e=_u;_u=null,e.forEach(function(e,t){fo(Du.bind(null,t,e))}),po()}}(),$u())}function Au(e,t){var n=ru;ru|=1;try{return e(t)}finally{(ru=n)===Qi&&po()}}function Uu(e,t,n,r){var o=ru;ru|=4;try{return co(98,e.bind(null,t,n,r))}finally{(ru=o)===Qi&&po()}}function Mu(e,t){var n=ru;ru&=-2,ru|=Gi;try{return e(t)}finally{(ru=n)===Qi&&po()}}function zu(e,t){e.finishedWork=null,e.finishedExpirationTime=0;var n=e.timeoutHandle;if(-1!==n&&(e.timeoutHandle=-1,kr(n)),null!==au)for(n=au.return;null!==n;){var r=n;switch(r.tag){case 1:var o=r.type.childContextTypes;null!=o&&Mr();break;case 3:aa(),zr();break;case 5:ua(r);break;case 4:aa();break;case 13:case 19:Tr(fa);break;case 10:xo(r)}n=n.return}ou=e,au=Ju(e.current,null),iu=t,uu=Xi,cu=lu=1073741823,su=null,fu=!1}function Du(e,t,n){if((ru&(Yi|Zi))!==Qi)throw i(Error(327));if(e.firstPendingTime<t)return null;if(n&&e.finishedExpirationTime===t)return Bu.bind(null,e);if($u(),e!==ou||t!==iu)zu(e,t);else if(uu===tu)if(fu)zu(e,t);else{var r=e.lastPendingTime;if(r<t)return Du.bind(null,e,r)}if(null!==au){r=ru,ru|=Yi;var o=Hi.current;if(null===o&&(o=Ga),Hi.current=Ga,n){if(1073741823!==t){var a=Nu();if(a<t)return ru=r,wo(),Hi.current=o,Du.bind(null,e,a)}}else Su=0;for(;;)try{if(n)for(;null!==au;)au=Fu(au);else for(;null!==au&&!qr();)au=Fu(au);break}catch(n){if(wo(),Da(),null===(a=au)||null===a.return)throw zu(e,t),ru=r,n;e:{var u=e,l=a.return,c=a,s=n,f=iu;if(c.effectTag|=1024,c.firstEffect=c.lastEffect=null,null!==s&&"object"==typeof s&&"function"==typeof s.then){var p=s,d=0!=(fa.current&ca);s=l;do{var h;if((h=13===s.tag)&&(null!==s.memoizedState?h=!1:h=void 0!==(h=s.memoizedProps).fallback&&(!0!==h.unstable_avoidThisFallback||!d)),h){if(null===(l=s.updateQueue)?((l=new Set).add(p),s.updateQueue=l):l.add(p),0==(2&s.mode)){s.effectTag|=64,c.effectTag&=-1957,1===c.tag&&(null===c.alternate?c.tag=17:((f=Po(1073741823,null)).tag=2,Ro(c,f))),c.expirationTime=1073741823;break e}c=u,u=f,null===(d=c.pingCache)?(d=c.pingCache=new Bi,l=new Set,d.set(p,l)):void 0===(l=d.get(p))&&(l=new Set,d.set(p,l)),l.has(u)||(l.add(u),c=Hu.bind(null,c,p,u),p.then(c,c)),s.effectTag|=2048,s.expirationTime=f;break e}s=s.return}while(null!==s);s=Error((ct(c.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display."+st(c))}uu!==nu&&(uu=Ji),s=Pi(s,c),c=l;do{switch(c.tag){case 3:c.effectTag|=2048,c.expirationTime=f,Io(c,f=$i(c,s,f));break e;case 1:if(p=s,u=c.type,l=c.stateNode,0==(64&c.effectTag)&&("function"==typeof u.getDerivedStateFromError||null!==l&&"function"==typeof l.componentDidCatch&&(null===yu||!yu.has(l)))){c.effectTag|=2048,c.expirationTime=f,Io(c,f=Vi(c,p,f));break e}}c=c.return}while(null!==c)}au=Wu(a)}if(ru=r,wo(),Hi.current=o,null!==au)return Du.bind(null,e,t)}if(e.finishedWork=e.current.alternate,e.finishedExpirationTime=t,function(e,t){var n=e.firstBatch;return!!(null!==n&&n._defer&&n._expirationTime>=t)&&(so(97,function(){return n._onComplete(),null}),!0)}(e,t))return null;switch(ou=null,uu){case Xi:throw i(Error(328));case Ji:return(r=e.lastPendingTime)<t?Du.bind(null,e,r):n?Bu.bind(null,e):(zu(e,t),fo(Du.bind(null,e,t)),null);case eu:return 1073741823===lu&&!n&&10<(n=pu+du-io())?fu?(zu(e,t),Du.bind(null,e,t)):(r=e.lastPendingTime)<t?Du.bind(null,e,r):(e.timeoutHandle=xr(Bu.bind(null,e),n),null):Bu.bind(null,e);case tu:if(!n){if(fu)return zu(e,t),Du.bind(null,e,t);if((n=e.lastPendingTime)<t)return Du.bind(null,e,n);if(1073741823!==cu?n=10*(1073741821-cu)-io():1073741823===lu?n=0:(n=10*(1073741821-lu)-5e3,0>(n=(r=io())-n)&&(n=0),(t=10*(1073741821-t)-r)<(n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*qi(n/1960))-n)&&(n=t)),10<n)return e.timeoutHandle=xr(Bu.bind(null,e),n),null}return Bu.bind(null,e);case nu:return!n&&1073741823!==lu&&null!==su&&(r=lu,0>=(t=0|(o=su).busyMinDurationMs)?t=0:(n=0|o.busyDelayMs,t=(r=io()-(10*(1073741821-r)-(0|o.timeoutMs||5e3)))<=n?0:n+t-r),10<t)?(e.timeoutHandle=xr(Bu.bind(null,e),t),null):Bu.bind(null,e);default:throw i(Error(329))}}function Lu(e,t){e<lu&&1<e&&(lu=e),null!==t&&e<cu&&1<e&&(cu=e,su=t)}function Fu(e){var t=Ku(e.alternate,e,iu);return e.memoizedProps=e.pendingProps,null===t&&(t=Wu(e)),Ki.current=null,t}function Wu(e){au=e;do{var t=au.alternate;if(e=au.return,0==(1024&au.effectTag)){e:{var n=t,r=iu,a=(t=au).pendingProps;switch(t.tag){case 2:case 16:break;case 15:case 0:break;case 1:Ur(t.type)&&Mr();break;case 3:aa(),zr(),(r=t.stateNode).pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),null!==n&&null!==n.child||(ai(t),t.effectTag&=-3),Si(t);break;case 5:ua(t),r=ra(na.current);var u=t.type;if(null!==n&&null!=t.stateNode)Ni(n,t,u,a,r),n.ref!==t.ref&&(t.effectTag|=128);else if(a){var l=ra(ea.current);if(ai(t)){a=void 0,u=(n=t).stateNode;var c=n.type,s=n.memoizedProps;switch(u[I]=n,u[A]=s,c){case"iframe":case"object":case"embed":An("load",u);break;case"video":case"audio":for(var f=0;f<te.length;f++)An(te[f],u);break;case"source":An("error",u);break;case"img":case"image":case"link":An("error",u),An("load",u);break;case"form":An("reset",u),An("submit",u);break;case"details":An("toggle",u);break;case"input":_t(u,s),An("invalid",u),yr(r,"onChange");break;case"select":u._wrapperState={wasMultiple:!!s.multiple},An("invalid",u),yr(r,"onChange");break;case"textarea":tr(u,s),An("invalid",u),yr(r,"onChange")}for(a in mr(c,s),f=null,s)s.hasOwnProperty(a)&&(l=s[a],"children"===a?"string"==typeof l?u.textContent!==l&&(f=["children",l]):"number"==typeof l&&u.textContent!==""+l&&(f=["children",""+l]):d.hasOwnProperty(a)&&null!=l&&yr(r,a));switch(c){case"input":$e(u),St(u,s,!0);break;case"textarea":$e(u),rr(u);break;case"select":case"option":break;default:"function"==typeof s.onClick&&(u.onclick=gr)}r=f,n.updateQueue=r,null!==r&&xi(t)}else{s=u,n=a,c=t,f=9===r.nodeType?r:r.ownerDocument,l===or.html&&(l=ar(s)),l===or.html?"script"===s?((s=f.createElement("div")).innerHTML="<script><\/script>",f=s.removeChild(s.firstChild)):"string"==typeof n.is?f=f.createElement(s,{is:n.is}):(f=f.createElement(s),"select"===s&&(s=f,n.multiple?s.multiple=!0:n.size&&(s.size=n.size))):f=f.createElementNS(l,s),(s=f)[I]=c,s[A]=n,ki(n=s,t,!1,!1),c=n;var p=r,h=vr(u,a);switch(u){case"iframe":case"object":case"embed":An("load",c),r=a;break;case"video":case"audio":for(r=0;r<te.length;r++)An(te[r],c);r=a;break;case"source":An("error",c),r=a;break;case"img":case"image":case"link":An("error",c),An("load",c),r=a;break;case"form":An("reset",c),An("submit",c),r=a;break;case"details":An("toggle",c),r=a;break;case"input":_t(c,a),r=wt(c,a),An("invalid",c),yr(p,"onChange");break;case"option":r=Xn(c,a);break;case"select":c._wrapperState={wasMultiple:!!a.multiple},r=o({},a,{value:void 0}),An("invalid",c),yr(p,"onChange");break;case"textarea":tr(c,a),r=er(c,a),An("invalid",c),yr(p,"onChange");break;default:r=a}mr(u,r),s=void 0,f=u,l=c;var m=r;for(s in m)if(m.hasOwnProperty(s)){var v=m[s];"style"===s?dr(l,v):"dangerouslySetInnerHTML"===s?null!=(v=v?v.__html:void 0)&&lr(l,v):"children"===s?"string"==typeof v?("textarea"!==f||""!==v)&&cr(l,v):"number"==typeof v&&cr(l,""+v):"suppressContentEditableWarning"!==s&&"suppressHydrationWarning"!==s&&"autoFocus"!==s&&(d.hasOwnProperty(s)?null!=v&&yr(p,s):null!=v&&bt(l,s,v,h))}switch(u){case"input":$e(c),St(c,a,!1);break;case"textarea":$e(c),rr(c);break;case"option":null!=a.value&&c.setAttribute("value",""+Et(a.value));break;case"select":r=c,c=a,r.multiple=!!c.multiple,null!=(s=c.value)?Jn(r,!!c.multiple,s,!1):null!=c.defaultValue&&Jn(r,!!c.multiple,c.defaultValue,!0);break;default:"function"==typeof r.onClick&&(c.onclick=gr)}wr(u,a)&&xi(t),t.stateNode=n}null!==t.ref&&(t.effectTag|=128)}else if(null===t.stateNode)throw i(Error(166));break;case 6:if(n&&null!=t.stateNode)Oi(n,t,n.memoizedProps,a);else{if("string"!=typeof a&&null===t.stateNode)throw i(Error(166));n=ra(na.current),ra(ea.current),ai(t)?(r=t.stateNode,n=t.memoizedProps,r[I]=t,r.nodeValue!==n&&xi(t)):(r=t,(n=(9===n.nodeType?n:n.ownerDocument).createTextNode(a))[I]=t,r.stateNode=n)}break;case 11:break;case 13:if(Tr(fa),a=t.memoizedState,0!=(64&t.effectTag)){t.expirationTime=r;break e}r=null!==a,a=!1,null===n?ai(t):(a=null!==(u=n.memoizedState),r||null===u||null!==(u=n.child.sibling)&&(null!==(c=t.firstEffect)?(t.firstEffect=u,u.nextEffect=c):(t.firstEffect=t.lastEffect=u,u.nextEffect=null),u.effectTag=8)),r&&!a&&0!=(2&t.mode)&&(null===n&&!0!==t.memoizedProps.unstable_avoidThisFallback||0!=(fa.current&ca)?uu===Xi&&(uu=eu):uu!==Xi&&uu!==eu||(uu=tu)),(r||a)&&(t.effectTag|=4);break;case 7:case 8:case 12:break;case 4:aa(),Si(t);break;case 10:xo(t);break;case 9:case 14:break;case 17:Ur(t.type)&&Mr();break;case 18:break;case 19:if(Tr(fa),null===(a=t.memoizedState))break;if(u=0!=(64&t.effectTag),null===(c=a.rendering)){if(u)Ti(a,!1);else if(uu!==Xi||null!==n&&0!=(64&n.effectTag))for(n=t.child;null!==n;){if(null!==(c=pa(n))){for(t.effectTag|=64,Ti(a,!1),null!==(n=c.updateQueue)&&(t.updateQueue=n,t.effectTag|=4),t.firstEffect=t.lastEffect=null,n=t.child;null!==n;)u=r,(a=n).effectTag&=2,a.nextEffect=null,a.firstEffect=null,a.lastEffect=null,null===(c=a.alternate)?(a.childExpirationTime=0,a.expirationTime=u,a.child=null,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null):(a.childExpirationTime=c.childExpirationTime,a.expirationTime=c.expirationTime,a.child=c.child,a.memoizedProps=c.memoizedProps,a.memoizedState=c.memoizedState,a.updateQueue=c.updateQueue,u=c.dependencies,a.dependencies=null===u?null:{expirationTime:u.expirationTime,firstContext:u.firstContext,responders:u.responders}),n=n.sibling;Cr(fa,fa.current&la|sa),t=t.child;break e}n=n.sibling}}else{if(!u)if(null!==(n=pa(c))){if(t.effectTag|=64,u=!0,Ti(a,!0),null===a.tail&&"hidden"===a.tailMode){null!==(r=n.updateQueue)&&(t.updateQueue=r,t.effectTag|=4),null!==(t=t.lastEffect=a.lastEffect)&&(t.nextEffect=null);break}}else io()>a.tailExpiration&&1<r&&(t.effectTag|=64,u=!0,Ti(a,!1),t.expirationTime=t.childExpirationTime=r-1);a.isBackwards?(c.sibling=t.child,t.child=c):(null!==(r=a.last)?r.sibling=c:t.child=c,a.last=c)}if(null!==a.tail){0===a.tailExpiration&&(a.tailExpiration=io()+500),r=a.tail,a.rendering=r,a.tail=r.sibling,a.lastEffect=t.lastEffect,r.sibling=null,n=fa.current,Cr(fa,n=u?n&la|sa:n&la),t=r;break e}break;case 20:break;default:throw i(Error(156))}t=null}if(r=au,1===iu||1!==r.childExpirationTime){for(n=0,a=r.child;null!==a;)(u=a.expirationTime)>n&&(n=u),(c=a.childExpirationTime)>n&&(n=c),a=a.sibling;r.childExpirationTime=n}if(null!==t)return t;null!==e&&0==(1024&e.effectTag)&&(null===e.firstEffect&&(e.firstEffect=au.firstEffect),null!==au.lastEffect&&(null!==e.lastEffect&&(e.lastEffect.nextEffect=au.firstEffect),e.lastEffect=au.lastEffect),1<au.effectTag&&(null!==e.lastEffect?e.lastEffect.nextEffect=au:e.firstEffect=au,e.lastEffect=au))}else{if(null!==(t=Ci(au)))return t.effectTag&=1023,t;null!==e&&(e.firstEffect=e.lastEffect=null,e.effectTag|=1024)}if(null!==(t=au.sibling))return t;au=e}while(null!==au);return uu===Xi&&(uu=nu),null}function Bu(e){var t=uo();return co(99,function(e,t){if($u(),(ru&(Yi|Zi))!==Qi)throw i(Error(327));var n=e.finishedWork,r=e.finishedExpirationTime;if(null===n)return null;if(e.finishedWork=null,e.finishedExpirationTime=0,n===e.current)throw i(Error(177));e.callbackNode=null,e.callbackExpirationTime=0;var o=n.expirationTime,a=n.childExpirationTime;if(o=a>o?a:o,e.firstPendingTime=o,o<e.lastPendingTime&&(e.lastPendingTime=o),e===ou&&(au=ou=null,iu=0),1<n.effectTag?null!==n.lastEffect?(n.lastEffect.nextEffect=n,o=n.firstEffect):o=n:o=n.firstEffect,null!==o){a=ru,ru|=Zi,Ki.current=null,br=In;var u=Bn();if($n(u)){if("selectionStart"in u)var l={start:u.selectionStart,end:u.selectionEnd};else e:{var c=(l=(l=u.ownerDocument)&&l.defaultView||window).getSelection&&l.getSelection();if(c&&0!==c.rangeCount){l=c.anchorNode;var s=c.anchorOffset,f=c.focusNode;c=c.focusOffset;try{l.nodeType,f.nodeType}catch(e){l=null;break e}var p=0,d=-1,h=-1,m=0,v=0,y=u,g=null;t:for(;;){for(var b;y!==l||0!==s&&3!==y.nodeType||(d=p+s),y!==f||0!==c&&3!==y.nodeType||(h=p+c),3===y.nodeType&&(p+=y.nodeValue.length),null!==(b=y.firstChild);)g=y,y=b;for(;;){if(y===u)break t;if(g===l&&++m===s&&(d=p),g===f&&++v===c&&(h=p),null!==(b=y.nextSibling))break;g=(y=g).parentNode}y=b}l=-1===d||-1===h?null:{start:d,end:h}}else l=null}l=l||{start:0,end:0}}else l=null;Er={focusedElem:u,selectionRange:l},In=!1,hu=o;do{try{for(;null!==hu;){if(0!=(256&hu.effectTag)){var E=hu.alternate;switch((u=hu).tag){case 0:case 11:case 15:Ai(ha,da,u);break;case 1:if(256&u.effectTag&&null!==E){var w=E.memoizedProps,_=E.memoizedState,x=u.stateNode,k=x.getSnapshotBeforeUpdate(u.elementType===u.type?w:vo(u.type,w),_);x.__reactInternalSnapshotBeforeUpdate=k}break;case 3:case 5:case 6:case 4:case 17:break;default:throw i(Error(163))}}hu=hu.nextEffect}}catch(e){if(null===hu)throw i(Error(330));qu(hu,e),hu=hu.nextEffect}}while(null!==hu);hu=o;do{try{for(E=t;null!==hu;){var S=hu.effectTag;if(16&S&&cr(hu.stateNode,""),128&S){var N=hu.alternate;if(null!==N){var O=N.ref;null!==O&&("function"==typeof O?O(null):O.current=null)}}switch(14&S){case 2:Di(hu),hu.effectTag&=-3;break;case 6:Di(hu),hu.effectTag&=-3,Fi(hu.alternate,hu);break;case 4:Fi(hu.alternate,hu);break;case 8:Li(w=hu,E),w.return=null,w.child=null,w.memoizedState=null,w.updateQueue=null,w.dependencies=null;var T=w.alternate;null!==T&&(T.return=null,T.child=null,T.memoizedState=null,T.updateQueue=null,T.dependencies=null)}hu=hu.nextEffect}}catch(e){if(null===hu)throw i(Error(330));qu(hu,e),hu=hu.nextEffect}}while(null!==hu);if(O=Er,N=Bn(),S=O.focusedElem,E=O.selectionRange,N!==S&&S&&S.ownerDocument&&function e(t,n){return!(!t||!n)&&(t===n||(!t||3!==t.nodeType)&&(n&&3===n.nodeType?e(t,n.parentNode):"contains"in t?t.contains(n):!!t.compareDocumentPosition&&!!(16&t.compareDocumentPosition(n))))}(S.ownerDocument.documentElement,S)){null!==E&&$n(S)&&(N=E.start,void 0===(O=E.end)&&(O=N),"selectionStart"in S?(S.selectionStart=N,S.selectionEnd=Math.min(O,S.value.length)):(O=(N=S.ownerDocument||document)&&N.defaultView||window).getSelection&&(O=O.getSelection(),w=S.textContent.length,T=Math.min(E.start,w),E=void 0===E.end?T:Math.min(E.end,w),!O.extend&&T>E&&(w=E,E=T,T=w),w=Wn(S,T),_=Wn(S,E),w&&_&&(1!==O.rangeCount||O.anchorNode!==w.node||O.anchorOffset!==w.offset||O.focusNode!==_.node||O.focusOffset!==_.offset)&&((N=N.createRange()).setStart(w.node,w.offset),O.removeAllRanges(),T>E?(O.addRange(N),O.extend(_.node,_.offset)):(N.setEnd(_.node,_.offset),O.addRange(N))))),N=[];for(O=S;O=O.parentNode;)1===O.nodeType&&N.push({element:O,left:O.scrollLeft,top:O.scrollTop});for("function"==typeof S.focus&&S.focus(),S=0;S<N.length;S++)(O=N[S]).element.scrollLeft=O.left,O.element.scrollTop=O.top}Er=null,In=!!br,br=null,e.current=n,hu=o;do{try{for(S=r;null!==hu;){var C=hu.effectTag;if(36&C){var P=hu.alternate;switch(O=S,(N=hu).tag){case 0:case 11:case 15:Ai(ya,ga,N);break;case 1:var j=N.stateNode;if(4&N.effectTag)if(null===P)j.componentDidMount();else{var R=N.elementType===N.type?P.memoizedProps:vo(N.type,P.memoizedProps);j.componentDidUpdate(R,P.memoizedState,j.__reactInternalSnapshotBeforeUpdate)}var I=N.updateQueue;null!==I&&zo(0,I,j);break;case 3:var A=N.updateQueue;if(null!==A){if(T=null,null!==N.child)switch(N.child.tag){case 5:T=N.child.stateNode;break;case 1:T=N.child.stateNode}zo(0,A,T)}break;case 5:var U=N.stateNode;null===P&&4&N.effectTag&&(O=U,wr(N.type,N.memoizedProps)&&O.focus());break;case 6:case 4:case 12:break;case 13:case 19:case 17:case 20:break;default:throw i(Error(163))}}if(128&C){var M=hu.ref;if(null!==M){var z=hu.stateNode;switch(hu.tag){case 5:var D=z;break;default:D=z}"function"==typeof M?M(D):M.current=D}}512&C&&(gu=!0),hu=hu.nextEffect}}catch(e){if(null===hu)throw i(Error(330));qu(hu,e),hu=hu.nextEffect}}while(null!==hu);hu=null,to(),ru=a}else e.current=n;if(gu)gu=!1,bu=e,wu=r,Eu=t;else for(hu=o;null!==hu;)t=hu.nextEffect,hu.nextEffect=null,hu=t;if(0!==(t=e.firstPendingTime)?(C=mo(C=Nu(),t),ju(e,C,t)):yu=null,"function"==typeof Qu&&Qu(n.stateNode,r),1073741823===t?e===ku?xu++:(xu=0,ku=e):xu=0,mu)throw mu=!1,e=vu,vu=null,e;return(ru&Gi)!==Qi?null:(po(),null)}.bind(null,e,t)),null!==bu&&so(97,function(){return $u(),null}),null}function $u(){if(null===bu)return!1;var e=bu,t=wu,n=Eu;return bu=null,wu=0,Eu=90,co(97<n?97:n,function(e){if((ru&(Yi|Zi))!==Qi)throw i(Error(331));var t=ru;for(ru|=Zi,e=e.current.firstEffect;null!==e;){try{var n=e;if(0!=(512&n.effectTag))switch(n.tag){case 0:case 11:case 15:Ai(Ea,da,n),Ai(da,ba,n)}}catch(t){if(null===e)throw i(Error(330));qu(e,t)}n=e.nextEffect,e.nextEffect=null,e=n}return ru=t,po(),!0}.bind(null,e,t))}function Vu(e,t,n){Ro(e,t=$i(e,t=Pi(n,t),1073741823)),null!==(e=Pu(e,1073741823))&&ju(e,99,1073741823)}function qu(e,t){if(3===e.tag)Vu(e,e,t);else for(var n=e.return;null!==n;){if(3===n.tag){Vu(n,e,t);break}if(1===n.tag){var r=n.stateNode;if("function"==typeof n.type.getDerivedStateFromError||"function"==typeof r.componentDidCatch&&(null===yu||!yu.has(r))){Ro(n,e=Vi(n,e=Pi(t,e),1073741823)),null!==(n=Pu(n,1073741823))&&ju(n,99,1073741823);break}}n=n.return}}function Hu(e,t,n){var r=e.pingCache;null!==r&&r.delete(t),ou===e&&iu===n?uu===tu||uu===eu&&1073741823===lu&&io()-pu<du?zu(e,iu):fu=!0:e.lastPendingTime<n||(0!==(t=e.pingTime)&&t<n||(e.pingTime=n,e.finishedExpirationTime===n&&(e.finishedExpirationTime=0,e.finishedWork=null),ju(e,t=mo(t=Nu(),n),n)))}var Ku=void 0;Ku=function(e,t,n){var r=t.expirationTime;if(null!==e){var o=t.pendingProps;if(e.memoizedProps!==o||Rr.current)li=!0;else if(r<n){switch(li=!1,t.tag){case 3:yi(t),ii();break;case 5:if(ia(t),4&t.mode&&1!==n&&o.hidden)return t.expirationTime=t.childExpirationTime=1,null;break;case 1:Ur(t.type)&&Fr(t);break;case 4:oa(t,t.stateNode.containerInfo);break;case 10:_o(t,t.memoizedProps.value);break;case 13:if(null!==t.memoizedState)return 0!==(r=t.child.childExpirationTime)&&r>=n?bi(e,t,n):(Cr(fa,fa.current&la),null!==(t=_i(e,t,n))?t.sibling:null);Cr(fa,fa.current&la);break;case 19:if(r=t.childExpirationTime>=n,0!=(64&e.effectTag)){if(r)return wi(e,t,n);t.effectTag|=64}if(null!==(o=t.memoizedState)&&(o.rendering=null,o.tail=null),Cr(fa,fa.current),!r)return null}return _i(e,t,n)}}else li=!1;switch(t.expirationTime=0,t.tag){case 2:if(r=t.type,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),e=t.pendingProps,o=Ar(t,jr.current),So(t,n),o=za(null,t,r,e,o,n),t.effectTag|=1,"object"==typeof o&&null!==o&&"function"==typeof o.render&&void 0===o.$$typeof){if(t.tag=1,Da(),Ur(r)){var a=!0;Fr(t)}else a=!1;t.memoizedState=null!==o.state&&void 0!==o.state?o.state:null;var u=r.getDerivedStateFromProps;"function"==typeof u&&Wo(t,r,u,e),o.updater=Bo,t.stateNode=o,o._reactInternalFiber=t,Ho(t,r,e,n),t=vi(null,t,r,!0,a,n)}else t.tag=0,ci(null,t,o,n),t=t.child;return t;case 16:switch(o=t.elementType,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),e=t.pendingProps,o=function(e){var t=e._result;switch(e._status){case 1:return t;case 2:case 0:throw t;default:switch(e._status=0,(t=(t=e._ctor)()).then(function(t){0===e._status&&(t=t.default,e._status=1,e._result=t)},function(t){0===e._status&&(e._status=2,e._result=t)}),e._status){case 1:return e._result;case 2:throw e._result}throw e._result=t,t}}(o),t.type=o,a=t.tag=function(e){if("function"==typeof e)return Xu(e)?1:0;if(null!=e){if((e=e.$$typeof)===nt)return 11;if(e===at)return 14}return 2}(o),e=vo(o,e),a){case 0:t=hi(null,t,o,e,n);break;case 1:t=mi(null,t,o,e,n);break;case 11:t=si(null,t,o,e,n);break;case 14:t=fi(null,t,o,vo(o.type,e),r,n);break;default:throw i(Error(306),o,"")}return t;case 0:return r=t.type,o=t.pendingProps,hi(e,t,r,o=t.elementType===r?o:vo(r,o),n);case 1:return r=t.type,o=t.pendingProps,mi(e,t,r,o=t.elementType===r?o:vo(r,o),n);case 3:if(yi(t),null===(r=t.updateQueue))throw i(Error(282));return o=null!==(o=t.memoizedState)?o.element:null,Mo(t,r,t.pendingProps,null,n),(r=t.memoizedState.element)===o?(ii(),t=_i(e,t,n)):(o=t.stateNode,(o=(null===e||null===e.child)&&o.hydrate)&&(Ja=Sr(t.stateNode.containerInfo.firstChild),Xa=t,o=ei=!0),o?(t.effectTag|=2,t.child=Xo(t,null,r,n)):(ci(e,t,r,n),ii()),t=t.child),t;case 5:return ia(t),null===e&&ri(t),r=t.type,o=t.pendingProps,a=null!==e?e.memoizedProps:null,u=o.children,_r(r,o)?u=null:null!==a&&_r(r,a)&&(t.effectTag|=16),di(e,t),4&t.mode&&1!==n&&o.hidden?(t.expirationTime=t.childExpirationTime=1,t=null):(ci(e,t,u,n),t=t.child),t;case 6:return null===e&&ri(t),null;case 13:return bi(e,t,n);case 4:return oa(t,t.stateNode.containerInfo),r=t.pendingProps,null===e?t.child=Zo(t,null,r,n):ci(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,si(e,t,r,o=t.elementType===r?o:vo(r,o),n);case 7:return ci(e,t,t.pendingProps,n),t.child;case 8:case 12:return ci(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,u=t.memoizedProps,_o(t,a=o.value),null!==u){var l=u.value;if(0===(a=en(l,a)?0:0|("function"==typeof r._calculateChangedBits?r._calculateChangedBits(l,a):1073741823))){if(u.children===o.children&&!Rr.current){t=_i(e,t,n);break e}}else for(null!==(l=t.child)&&(l.return=t);null!==l;){var c=l.dependencies;if(null!==c){u=l.child;for(var s=c.firstContext;null!==s;){if(s.context===r&&0!=(s.observedBits&a)){1===l.tag&&((s=Po(n,null)).tag=2,Ro(l,s)),l.expirationTime<n&&(l.expirationTime=n),null!==(s=l.alternate)&&s.expirationTime<n&&(s.expirationTime=n),ko(l.return,n),c.expirationTime<n&&(c.expirationTime=n);break}s=s.next}}else u=10===l.tag&&l.type===t.type?null:l.child;if(null!==u)u.return=l;else for(u=l;null!==u;){if(u===t){u=null;break}if(null!==(l=u.sibling)){l.return=u.return,u=l;break}u=u.return}l=u}}ci(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=(a=t.pendingProps).children,So(t,n),r=r(o=No(o,a.unstable_observedBits)),t.effectTag|=1,ci(e,t,r,n),t.child;case 14:return a=vo(o=t.type,t.pendingProps),fi(e,t,o,a=vo(o.type,a),r,n);case 15:return pi(e,t,t.type,t.pendingProps,r,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:vo(r,o),null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),t.tag=1,Ur(r)?(e=!0,Fr(t)):e=!1,So(t,n),Vo(t,r,o),Ho(t,r,o,n),vi(null,t,r,!0,e,n);case 19:return wi(e,t,n)}throw i(Error(156))};var Qu=null,Gu=null;function Yu(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.childExpirationTime=this.expirationTime=0,this.alternate=null}function Zu(e,t,n,r){return new Yu(e,t,n,r)}function Xu(e){return!(!(e=e.prototype)||!e.isReactComponent)}function Ju(e,t){var n=e.alternate;return null===n?((n=Zu(e.tag,t,e.key,e.mode)).elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.effectTag=0,n.nextEffect=null,n.firstEffect=null,n.lastEffect=null),n.childExpirationTime=e.childExpirationTime,n.expirationTime=e.expirationTime,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=null===t?null:{expirationTime:t.expirationTime,firstContext:t.firstContext,responders:t.responders},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function el(e,t,n,r,o,a){var u=2;if(r=e,"function"==typeof e)Xu(e)&&(u=1);else if("string"==typeof e)u=5;else e:switch(e){case Ye:return tl(n.children,o,a,t);case tt:u=8,o|=7;break;case Ze:u=8,o|=1;break;case Xe:return(e=Zu(12,n,t,8|o)).elementType=Xe,e.type=Xe,e.expirationTime=a,e;case rt:return(e=Zu(13,n,t,o)).type=rt,e.elementType=rt,e.expirationTime=a,e;case ot:return(e=Zu(19,n,t,o)).elementType=ot,e.expirationTime=a,e;default:if("object"==typeof e&&null!==e)switch(e.$$typeof){case Je:u=10;break e;case et:u=9;break e;case nt:u=11;break e;case at:u=14;break e;case it:u=16,r=null;break e}throw i(Error(130),null==e?e:typeof e,"")}return(t=Zu(u,n,t,o)).elementType=e,t.type=r,t.expirationTime=a,t}function tl(e,t,n,r){return(e=Zu(7,e,r,t)).expirationTime=n,e}function nl(e,t,n){return(e=Zu(6,e,null,t)).expirationTime=n,e}function rl(e,t,n){return(t=Zu(4,null!==e.children?e.children:[],e.key,t)).expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function ol(e,t,n){this.tag=t,this.current=null,this.containerInfo=e,this.pingCache=this.pendingChildren=null,this.finishedExpirationTime=0,this.finishedWork=null,this.timeoutHandle=-1,this.pendingContext=this.context=null,this.hydrate=n,this.callbackNode=this.firstBatch=null,this.pingTime=this.lastPendingTime=this.firstPendingTime=this.callbackExpirationTime=0}function al(e,t,n){return e=new ol(e,t,n),t=Zu(3,null,null,2===t?7:1===t?3:0),e.current=t,t.stateNode=e}function il(e,t,n,r,o,a){var u=t.current;e:if(n){t:{if(2!==on(n=n._reactInternalFiber)||1!==n.tag)throw i(Error(170));var l=n;do{switch(l.tag){case 3:l=l.stateNode.context;break t;case 1:if(Ur(l.type)){l=l.stateNode.__reactInternalMemoizedMergedChildContext;break t}}l=l.return}while(null!==l);throw i(Error(171))}if(1===n.tag){var c=n.type;if(Ur(c)){n=Lr(n,c,l);break e}}n=l}else n=Pr;return null===t.context?t.context=n:t.pendingContext=n,t=a,(o=Po(r,o)).payload={element:e},null!==(t=void 0===t?null:t)&&(o.callback=t),Ro(u,o),Cu(u,r),r}function ul(e,t,n,r){var o=t.current,a=Nu(),i=Lo.suspense;return il(e,t,n,o=Ou(a,o,i),i,r)}function ll(e){if(!(e=e.current).child)return null;switch(e.child.tag){case 5:default:return e.child.stateNode}}function cl(e){var t=1073741821-25*(1+((1073741821-Nu()+500)/25|0));t<=Tu&&--t,this._expirationTime=Tu=t,this._root=e,this._callbacks=this._next=null,this._hasChildren=this._didComplete=!1,this._children=null,this._defer=!0}function sl(){this._callbacks=null,this._didCommit=!1,this._onCommit=this._onCommit.bind(this)}function fl(e,t,n){this._internalRoot=al(e,t,n)}function pl(e,t){this._internalRoot=al(e,2,t)}function dl(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function hl(e,t,n,r,o){var a=n._reactRootContainer,i=void 0;if(a){if(i=a._internalRoot,"function"==typeof o){var u=o;o=function(){var e=ll(i);u.call(e)}}ul(t,i,e,o)}else{if(a=n._reactRootContainer=function(e,t){if(t||(t=!(!(t=e?9===e.nodeType?e.documentElement:e.firstChild:null)||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new fl(e,0,t)}(n,r),i=a._internalRoot,"function"==typeof o){var l=o;o=function(){var e=ll(i);l.call(e)}}Mu(function(){ul(t,i,e,o)})}return ll(i)}function ml(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!dl(t))throw i(Error(200));return function(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:Ge,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}(e,t,null,n)}Ne=function(e,t,n){switch(t){case"input":if(kt(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=D(r);if(!o)throw i(Error(90));Ve(r),kt(r,o)}}}break;case"textarea":nr(e,n);break;case"select":null!=(t=n.value)&&Jn(e,!!n.multiple,t,!1)}},cl.prototype.render=function(e){if(!this._defer)throw i(Error(250));this._hasChildren=!0,this._children=e;var t=this._root._internalRoot,n=this._expirationTime,r=new sl;return il(e,t,null,n,null,r._onCommit),r},cl.prototype.then=function(e){if(this._didComplete)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},cl.prototype.commit=function(){var e=this._root._internalRoot,t=e.firstBatch;if(!this._defer||null===t)throw i(Error(251));if(this._hasChildren){var n=this._expirationTime;if(t!==this){this._hasChildren&&(n=this._expirationTime=t._expirationTime,this.render(this._children));for(var r=null,o=t;o!==this;)r=o,o=o._next;if(null===r)throw i(Error(251));r._next=o._next,this._next=t,e.firstBatch=this}if(this._defer=!1,t=n,(ru&(Yi|Zi))!==Qi)throw i(Error(253));fo(Du.bind(null,e,t)),po(),t=this._next,this._next=null,null!==(t=e.firstBatch=t)&&t._hasChildren&&t.render(t._children)}else this._next=null,this._defer=!1},cl.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++)(0,e[t])()}},sl.prototype.then=function(e){if(this._didCommit)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},sl.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++){var n=e[t];if("function"!=typeof n)throw i(Error(191),n);n()}}},pl.prototype.render=fl.prototype.render=function(e,t){var n=this._internalRoot,r=new sl;return null!==(t=void 0===t?null:t)&&r.then(t),ul(e,n,null,r._onCommit),r},pl.prototype.unmount=fl.prototype.unmount=function(e){var t=this._internalRoot,n=new sl;return null!==(e=void 0===e?null:e)&&n.then(e),ul(null,t,null,n._onCommit),n},pl.prototype.createBatch=function(){var e=new cl(this),t=e._expirationTime,n=this._internalRoot,r=n.firstBatch;if(null===r)n.firstBatch=e,e._next=null;else{for(n=null;null!==r&&r._expirationTime>=t;)n=r,r=r._next;e._next=r,null!==n&&(n._next=e)}return e},Re=Au,Ie=Uu,Ae=Iu,Ue=function(e,t){var n=ru;ru|=2;try{return e(t)}finally{(ru=n)===Qi&&po()}};var vl,yl,gl={createPortal:ml,findDOMNode:function(e){if(null==e)e=null;else if(1!==e.nodeType){var t=e._reactInternalFiber;if(void 0===t){if("function"==typeof e.render)throw i(Error(188));throw i(Error(268),Object.keys(e))}e=null===(e=un(t))?null:e.stateNode}return e},hydrate:function(e,t,n){if(!dl(t))throw i(Error(200));return hl(null,e,t,!0,n)},render:function(e,t,n){if(!dl(t))throw i(Error(200));return hl(null,e,t,!1,n)},unstable_renderSubtreeIntoContainer:function(e,t,n,r){if(!dl(n))throw i(Error(200));if(null==e||void 0===e._reactInternalFiber)throw i(Error(38));return hl(e,t,n,!1,r)},unmountComponentAtNode:function(e){if(!dl(e))throw i(Error(40));return!!e._reactRootContainer&&(Mu(function(){hl(null,null,e,!1,function(){e._reactRootContainer=null})}),!0)},unstable_createPortal:function(){return ml.apply(void 0,arguments)},unstable_batchedUpdates:Au,unstable_interactiveUpdates:function(e,t,n,r){return Iu(),Uu(e,t,n,r)},unstable_discreteUpdates:Uu,unstable_flushDiscreteUpdates:Iu,flushSync:function(e,t){if((ru&(Yi|Zi))!==Qi)throw i(Error(187));var n=ru;ru|=1;try{return co(99,e.bind(null,t))}finally{ru=n,po()}},unstable_createRoot:function(e,t){if(!dl(e))throw i(Error(299),"unstable_createRoot");return new pl(e,null!=t&&!0===t.hydrate)},unstable_createSyncRoot:function(e,t){if(!dl(e))throw i(Error(299),"unstable_createRoot");return new fl(e,1,null!=t&&!0===t.hydrate)},unstable_flushControlled:function(e){var t=ru;ru|=1;try{co(99,e)}finally{(ru=t)===Qi&&po()}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{Events:[M,z,D,P.injectEventPluginsByName,p,V,function(e){N(e,$)},Pe,je,Mn,C,$u,{current:!1}]}};yl=(vl={findFiberByHostInstance:U,bundleType:0,version:"16.9.0",rendererPackageName:"react-dom"}).findFiberByHostInstance,function(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);Qu=function(e){try{t.onCommitFiberRoot(n,e,void 0,64==(64&e.current.effectTag))}catch(e){}},Gu=function(e){try{t.onCommitFiberUnmount(n,e)}catch(e){}}}catch(e){}}(o({},vl,{overrideHookState:null,overrideProps:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:qe.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return null===(e=un(e))?null:e.stateNode},findFiberByHostInstance:function(e){return yl?yl(e):null},findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null}));var bl={default:gl},El=bl&&gl||bl;e.exports=El.default||El},function(e,t,n){"use strict";e.exports=n(49)},function(e,t,n){"use strict";
/** @license React v0.15.0
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */Object.defineProperty(t,"__esModule",{value:!0});var r=void 0,o=void 0,a=void 0,i=void 0,u=void 0;if(t.unstable_now=void 0,t.unstable_forceFrameRate=void 0,"undefined"==typeof window||"function"!=typeof MessageChannel){var l=null,c=null,s=function(){if(null!==l)try{var e=t.unstable_now();l(!0,e),l=null}catch(e){throw setTimeout(s,0),e}};t.unstable_now=function(){return Date.now()},r=function(e){null!==l?setTimeout(r,0,e):(l=e,setTimeout(s,0))},o=function(e,t){c=setTimeout(e,t)},a=function(){clearTimeout(c)},i=function(){return!1},u=t.unstable_forceFrameRate=function(){}}else{var f=window.performance,p=window.Date,d=window.setTimeout,h=window.clearTimeout,m=window.requestAnimationFrame,v=window.cancelAnimationFrame;"undefined"!=typeof console&&("function"!=typeof m&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),"function"!=typeof v&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills")),t.unstable_now="object"==typeof f&&"function"==typeof f.now?function(){return f.now()}:function(){return p.now()};var y=!1,g=null,b=-1,E=-1,w=33.33,_=-1,x=-1,k=0,S=!1;i=function(){return t.unstable_now()>=k},u=function(){},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported"):0<e?(w=Math.floor(1e3/e),S=!0):(w=33.33,S=!1)};var N=function(){if(null!==g){var e=t.unstable_now(),n=0<k-e;try{g(n,e)||(g=null)}catch(e){throw T.postMessage(null),e}}},O=new MessageChannel,T=O.port2;O.port1.onmessage=N;var C=function(e){if(null===g)x=_=-1,y=!1;else{y=!0,m(function(e){h(b),C(e)});var n=function(){k=t.unstable_now()+w/2,N(),b=d(n,3*w)};if(b=d(n,3*w),-1!==_&&.1<e-_){var r=e-_;!S&&-1!==x&&r<w&&x<w&&(8.33>(w=r<x?x:r)&&(w=8.33)),x=r}_=e,k=e+w,T.postMessage(null)}};r=function(e){g=e,y||(y=!0,m(function(e){C(e)}))},o=function(e,n){E=d(function(){e(t.unstable_now())},n)},a=function(){h(E),E=-1}}var P=null,j=null,R=null,I=3,A=!1,U=!1,M=!1;function z(e,t){var n=e.next;if(n===e)P=null;else{e===P&&(P=n);var r=e.previous;r.next=n,n.previous=r}e.next=e.previous=null,n=e.callback,r=I;var o=R;I=e.priorityLevel,R=e;try{var a=e.expirationTime<=t;switch(I){case 1:var i=n(a);break;case 2:case 3:case 4:i=n(a);break;case 5:i=n(a)}}catch(e){throw e}finally{I=r,R=o}if("function"==typeof i)if(t=e.expirationTime,e.callback=i,null===P)P=e.next=e.previous=e;else{i=null,a=P;do{if(t<=a.expirationTime){i=a;break}a=a.next}while(a!==P);null===i?i=P:i===P&&(P=e),(t=i.previous).next=i.previous=e,e.next=i,e.previous=t}}function D(e){if(null!==j&&j.startTime<=e)do{var t=j,n=t.next;if(t===n)j=null;else{j=n;var r=t.previous;r.next=n,n.previous=r}t.next=t.previous=null,B(t,t.expirationTime)}while(null!==j&&j.startTime<=e)}function L(e){M=!1,D(e),U||(null!==P?(U=!0,r(F)):null!==j&&o(L,j.startTime-e))}function F(e,n){U=!1,M&&(M=!1,a()),D(n),A=!0;try{if(e){if(null!==P)do{z(P,n),D(n=t.unstable_now())}while(null!==P&&!i())}else for(;null!==P&&P.expirationTime<=n;)z(P,n),D(n=t.unstable_now());return null!==P||(null!==j&&o(L,j.startTime-n),!1)}finally{A=!1}}function W(e){switch(e){case 1:return-1;case 2:return 250;case 5:return 1073741823;case 4:return 1e4;default:return 5e3}}function B(e,t){if(null===P)P=e.next=e.previous=e;else{var n=null,r=P;do{if(t<r.expirationTime){n=r;break}r=r.next}while(r!==P);null===n?n=P:n===P&&(P=e),(t=n.previous).next=n.previous=e,e.next=n,e.previous=t}}var $=u;t.unstable_ImmediatePriority=1,t.unstable_UserBlockingPriority=2,t.unstable_NormalPriority=3,t.unstable_IdlePriority=5,t.unstable_LowPriority=4,t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=I;I=e;try{return t()}finally{I=n}},t.unstable_next=function(e){switch(I){case 1:case 2:case 3:var t=3;break;default:t=I}var n=I;I=t;try{return e()}finally{I=n}},t.unstable_scheduleCallback=function(e,n,i){var u=t.unstable_now();if("object"==typeof i&&null!==i){var l=i.delay;l="number"==typeof l&&0<l?u+l:u,i="number"==typeof i.timeout?i.timeout:W(e)}else i=W(e),l=u;if(e={callback:n,priorityLevel:e,startTime:l,expirationTime:i=l+i,next:null,previous:null},l>u){if(i=l,null===j)j=e.next=e.previous=e;else{n=null;var c=j;do{if(i<c.startTime){n=c;break}c=c.next}while(c!==j);null===n?n=j:n===j&&(j=e),(i=n.previous).next=n.previous=e,e.next=n,e.previous=i}null===P&&j===e&&(M?a():M=!0,o(L,l-u))}else B(e,i),U||A||(U=!0,r(F));return e},t.unstable_cancelCallback=function(e){var t=e.next;if(null!==t){if(e===t)e===P?P=null:e===j&&(j=null);else{e===P?P=t:e===j&&(j=t);var n=e.previous;n.next=t,t.previous=n}e.next=e.previous=null}},t.unstable_wrapCallback=function(e){var t=I;return function(){var n=I;I=t;try{return e.apply(this,arguments)}finally{I=n}}},t.unstable_getCurrentPriorityLevel=function(){return I},t.unstable_shouldYield=function(){var e=t.unstable_now();return D(e),null!==R&&null!==P&&P.startTime<=e&&P.expirationTime<R.expirationTime||i()},t.unstable_requestPaint=$,t.unstable_continueExecution=function(){U||A||(U=!0,r(F))},t.unstable_pauseExecution=function(){},t.unstable_getFirstCallbackNode=function(){return P}},function(e,t,n){var r=n(51),o=n(108)(function(e,t,n){r(e,t,n)});e.exports=o},function(e,t,n){var r=n(52),o=n(30),a=n(83),i=n(85),u=n(4),l=n(40),c=n(39);e.exports=function e(t,n,s,f,p){t!==n&&a(n,function(a,l){if(p||(p=new r),u(a))i(t,n,l,s,e,f,p);else{var d=f?f(c(t,l),a,l+"",t,n,p):void 0;void 0===d&&(d=a),o(t,l,d)}},l)}},function(e,t,n){var r=n(9),o=n(58),a=n(59),i=n(60),u=n(61),l=n(62);function c(e){var t=this.__data__=new r(e);this.size=t.size}c.prototype.clear=o,c.prototype.delete=a,c.prototype.get=i,c.prototype.has=u,c.prototype.set=l,e.exports=c},function(e,t){e.exports=function(){this.__data__=[],this.size=0}},function(e,t,n){var r=n(10),o=Array.prototype.splice;e.exports=function(e){var t=this.__data__,n=r(t,e);return!(n<0)&&(n==t.length-1?t.pop():o.call(t,n,1),--this.size,!0)}},function(e,t,n){var r=n(10);e.exports=function(e){var t=this.__data__,n=r(t,e);return n<0?void 0:t[n][1]}},function(e,t,n){var r=n(10);e.exports=function(e){return r(this.__data__,e)>-1}},function(e,t,n){var r=n(10);e.exports=function(e,t){var n=this.__data__,o=r(n,e);return o<0?(++this.size,n.push([e,t])):n[o][1]=t,this}},function(e,t,n){var r=n(9);e.exports=function(){this.__data__=new r,this.size=0}},function(e,t){e.exports=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}},function(e,t){e.exports=function(e){return this.__data__.get(e)}},function(e,t){e.exports=function(e){return this.__data__.has(e)}},function(e,t,n){var r=n(9),o=n(27),a=n(70),i=200;e.exports=function(e,t){var n=this.__data__;if(n instanceof r){var u=n.__data__;if(!o||u.length<i-1)return u.push([e,t]),this.size=++n.size,this;n=this.__data__=new a(u)}return n.set(e,t),this.size=n.size,this}},function(e,t,n){var r=n(20),o=n(66),a=n(4),i=n(68),u=/^\[object .+?Constructor\]$/,l=Function.prototype,c=Object.prototype,s=l.toString,f=c.hasOwnProperty,p=RegExp("^"+s.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=function(e){return!(!a(e)||o(e))&&(r(e)?p:u).test(i(e))}},function(e,t,n){var r=n(28),o=Object.prototype,a=o.hasOwnProperty,i=o.toString,u=r?r.toStringTag:void 0;e.exports=function(e){var t=a.call(e,u),n=e[u];try{e[u]=void 0;var r=!0}catch(e){}var o=i.call(e);return r&&(t?e[u]=n:delete e[u]),o}},function(e,t){var n=Object.prototype.toString;e.exports=function(e){return n.call(e)}},function(e,t,n){var r,o=n(67),a=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";e.exports=function(e){return!!a&&a in e}},function(e,t,n){var r=n(5)["__core-js_shared__"];e.exports=r},function(e,t){var n=Function.prototype.toString;e.exports=function(e){if(null!=e){try{return n.call(e)}catch(e){}try{return e+""}catch(e){}}return""}},function(e,t){e.exports=function(e,t){return null==e?void 0:e[t]}},function(e,t,n){var r=n(71),o=n(78),a=n(80),i=n(81),u=n(82);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=a,l.prototype.has=i,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(72),o=n(9),a=n(27);e.exports=function(){this.size=0,this.__data__={hash:new r,map:new(a||o),string:new r}}},function(e,t,n){var r=n(73),o=n(74),a=n(75),i=n(76),u=n(77);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=a,l.prototype.has=i,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(13);e.exports=function(){this.__data__=r?r(null):{},this.size=0}},function(e,t){e.exports=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}},function(e,t,n){var r=n(13),o="__lodash_hash_undefined__",a=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;if(r){var n=t[e];return n===o?void 0:n}return a.call(t,e)?t[e]:void 0}},function(e,t,n){var r=n(13),o=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;return r?void 0!==t[e]:o.call(t,e)}},function(e,t,n){var r=n(13),o="__lodash_hash_undefined__";e.exports=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=r&&void 0===t?o:t,this}},function(e,t,n){var r=n(14);e.exports=function(e){var t=r(this,e).delete(e);return this.size-=t?1:0,t}},function(e,t){e.exports=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}},function(e,t,n){var r=n(14);e.exports=function(e){return r(this,e).get(e)}},function(e,t,n){var r=n(14);e.exports=function(e){return r(this,e).has(e)}},function(e,t,n){var r=n(14);e.exports=function(e,t){var n=r(this,e),o=n.size;return n.set(e,t),this.size+=n.size==o?0:1,this}},function(e,t,n){var r=n(84)();e.exports=r},function(e,t){e.exports=function(e){return function(t,n,r){for(var o=-1,a=Object(t),i=r(t),u=i.length;u--;){var l=i[e?u:++o];if(!1===n(a[l],l,a))break}return t}}},function(e,t,n){var r=n(30),o=n(86),a=n(87),i=n(90),u=n(91),l=n(34),c=n(35),s=n(95),f=n(37),p=n(20),d=n(4),h=n(97),m=n(38),v=n(39),y=n(101);e.exports=function(e,t,n,g,b,E,w){var _=v(e,n),x=v(t,n),k=w.get(x);if(k)r(e,n,k);else{var S=E?E(_,x,n+"",e,t,w):void 0,N=void 0===S;if(N){var O=c(x),T=!O&&f(x),C=!O&&!T&&m(x);S=x,O||T||C?c(_)?S=_:s(_)?S=i(_):T?(N=!1,S=o(x,!0)):C?(N=!1,S=a(x,!0)):S=[]:h(x)||l(x)?(S=_,l(_)?S=y(_):d(_)&&!p(_)||(S=u(x))):N=!1}N&&(w.set(x,S),b(S,x,g,E,w),w.delete(x)),r(e,n,S)}}},function(e,t,n){(function(e){var r=n(5),o=t&&!t.nodeType&&t,a=o&&"object"==typeof e&&e&&!e.nodeType&&e,i=a&&a.exports===o?r.Buffer:void 0,u=i?i.allocUnsafe:void 0;e.exports=function(e,t){if(t)return e.slice();var n=e.length,r=u?u(n):new e.constructor(n);return e.copy(r),r}}).call(this,n(15)(e))},function(e,t,n){var r=n(88);e.exports=function(e,t){var n=t?r(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}},function(e,t,n){var r=n(89);e.exports=function(e){var t=new e.constructor(e.byteLength);return new r(t).set(new r(e)),t}},function(e,t,n){var r=n(5).Uint8Array;e.exports=r},function(e,t){e.exports=function(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}},function(e,t,n){var r=n(92),o=n(32),a=n(33);e.exports=function(e){return"function"!=typeof e.constructor||a(e)?{}:r(o(e))}},function(e,t,n){var r=n(4),o=Object.create,a=function(){function e(){}return function(t){if(!r(t))return{};if(o)return o(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();e.exports=a},function(e,t){e.exports=function(e,t){return function(n){return e(t(n))}}},function(e,t,n){var r=n(12),o=n(7),a="[object Arguments]";e.exports=function(e){return o(e)&&r(e)==a}},function(e,t,n){var r=n(22),o=n(7);e.exports=function(e){return o(e)&&r(e)}},function(e,t){e.exports=function(){return!1}},function(e,t,n){var r=n(12),o=n(32),a=n(7),i="[object Object]",u=Function.prototype,l=Object.prototype,c=u.toString,s=l.hasOwnProperty,f=c.call(Object);e.exports=function(e){if(!a(e)||r(e)!=i)return!1;var t=o(e);if(null===t)return!0;var n=s.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==f}},function(e,t,n){var r=n(12),o=n(36),a=n(7),i={};i["[object Float32Array]"]=i["[object Float64Array]"]=i["[object Int8Array]"]=i["[object Int16Array]"]=i["[object Int32Array]"]=i["[object Uint8Array]"]=i["[object Uint8ClampedArray]"]=i["[object Uint16Array]"]=i["[object Uint32Array]"]=!0,i["[object Arguments]"]=i["[object Array]"]=i["[object ArrayBuffer]"]=i["[object Boolean]"]=i["[object DataView]"]=i["[object Date]"]=i["[object Error]"]=i["[object Function]"]=i["[object Map]"]=i["[object Number]"]=i["[object Object]"]=i["[object RegExp]"]=i["[object Set]"]=i["[object String]"]=i["[object WeakMap]"]=!1,e.exports=function(e){return a(e)&&o(e.length)&&!!i[r(e)]}},function(e,t){e.exports=function(e){return function(t){return e(t)}}},function(e,t,n){(function(e){var r=n(29),o=t&&!t.nodeType&&t,a=o&&"object"==typeof e&&e&&!e.nodeType&&e,i=a&&a.exports===o&&r.process,u=function(){try{var e=a&&a.require&&a.require("util").types;return e||i&&i.binding&&i.binding("util")}catch(e){}}();e.exports=u}).call(this,n(15)(e))},function(e,t,n){var r=n(102),o=n(40);e.exports=function(e){return r(e,o(e))}},function(e,t,n){var r=n(103),o=n(21);e.exports=function(e,t,n,a){var i=!n;n||(n={});for(var u=-1,l=t.length;++u<l;){var c=t[u],s=a?a(n[c],e[c],c,n,e):void 0;void 0===s&&(s=e[c]),i?o(n,c,s):r(n,c,s)}return n}},function(e,t,n){var r=n(21),o=n(11),a=Object.prototype.hasOwnProperty;e.exports=function(e,t,n){var i=e[t];a.call(e,t)&&o(i,n)&&(void 0!==n||t in e)||r(e,t,n)}},function(e,t,n){var r=n(105),o=n(34),a=n(35),i=n(37),u=n(41),l=n(38),c=Object.prototype.hasOwnProperty;e.exports=function(e,t){var n=a(e),s=!n&&o(e),f=!n&&!s&&i(e),p=!n&&!s&&!f&&l(e),d=n||s||f||p,h=d?r(e.length,String):[],m=h.length;for(var v in e)!t&&!c.call(e,v)||d&&("length"==v||f&&("offset"==v||"parent"==v)||p&&("buffer"==v||"byteLength"==v||"byteOffset"==v)||u(v,m))||h.push(v);return h}},function(e,t){e.exports=function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}},function(e,t,n){var r=n(4),o=n(33),a=n(107),i=Object.prototype.hasOwnProperty;e.exports=function(e){if(!r(e))return a(e);var t=o(e),n=[];for(var u in e)("constructor"!=u||!t&&i.call(e,u))&&n.push(u);return n}},function(e,t){e.exports=function(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}},function(e,t,n){var r=n(109),o=n(116);e.exports=function(e){return r(function(t,n){var r=-1,a=n.length,i=a>1?n[a-1]:void 0,u=a>2?n[2]:void 0;for(i=e.length>3&&"function"==typeof i?(a--,i):void 0,u&&o(n[0],n[1],u)&&(i=a<3?void 0:i,a=1),t=Object(t);++r<a;){var l=n[r];l&&e(t,l,r,i)}return t})}},function(e,t,n){var r=n(42),o=n(110),a=n(112);e.exports=function(e,t){return a(o(e,t,r),e+"")}},function(e,t,n){var r=n(111),o=Math.max;e.exports=function(e,t,n){return t=o(void 0===t?e.length-1:t,0),function(){for(var a=arguments,i=-1,u=o(a.length-t,0),l=Array(u);++i<u;)l[i]=a[t+i];i=-1;for(var c=Array(t+1);++i<t;)c[i]=a[i];return c[t]=n(l),r(e,this,c)}}},function(e,t){e.exports=function(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}},function(e,t,n){var r=n(113),o=n(115)(r);e.exports=o},function(e,t,n){var r=n(114),o=n(31),a=n(42),i=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:a;e.exports=i},function(e,t){e.exports=function(e){return function(){return e}}},function(e,t){var n=800,r=16,o=Date.now;e.exports=function(e){var t=0,a=0;return function(){var i=o(),u=r-(i-a);if(a=i,u>0){if(++t>=n)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}},function(e,t,n){var r=n(11),o=n(22),a=n(41),i=n(4);e.exports=function(e,t,n){if(!i(n))return!1;var u=typeof t;return!!("number"==u?o(n)&&a(t,n.length):"string"==u&&t in n)&&r(n[t],e)}},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t,n){"use strict";var r=n(119);function o(){}function a(){}a.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,a,i){if(i!==r){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:a,resetWarningCache:o};return n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";
/** @license React v16.9.0
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&Symbol.for,o=r?Symbol.for("react.element"):60103,a=r?Symbol.for("react.portal"):60106,i=r?Symbol.for("react.fragment"):60107,u=r?Symbol.for("react.strict_mode"):60108,l=r?Symbol.for("react.profiler"):60114,c=r?Symbol.for("react.provider"):60109,s=r?Symbol.for("react.context"):60110,f=r?Symbol.for("react.async_mode"):60111,p=r?Symbol.for("react.concurrent_mode"):60111,d=r?Symbol.for("react.forward_ref"):60112,h=r?Symbol.for("react.suspense"):60113,m=r?Symbol.for("react.suspense_list"):60120,v=r?Symbol.for("react.memo"):60115,y=r?Symbol.for("react.lazy"):60116,g=r?Symbol.for("react.fundamental"):60117,b=r?Symbol.for("react.responder"):60118;function E(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case o:switch(e=e.type){case f:case p:case i:case l:case u:case h:return e;default:switch(e=e&&e.$$typeof){case s:case d:case c:return e;default:return t}}case y:case v:case a:return t}}}function w(e){return E(e)===p}t.typeOf=E,t.AsyncMode=f,t.ConcurrentMode=p,t.ContextConsumer=s,t.ContextProvider=c,t.Element=o,t.ForwardRef=d,t.Fragment=i,t.Lazy=y,t.Memo=v,t.Portal=a,t.Profiler=l,t.StrictMode=u,t.Suspense=h,t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===i||e===p||e===l||e===u||e===h||e===m||"object"==typeof e&&null!==e&&(e.$$typeof===y||e.$$typeof===v||e.$$typeof===c||e.$$typeof===s||e.$$typeof===d||e.$$typeof===g||e.$$typeof===b)},t.isAsyncMode=function(e){return w(e)||E(e)===f},t.isConcurrentMode=w,t.isContextConsumer=function(e){return E(e)===s},t.isContextProvider=function(e){return E(e)===c},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===o},t.isForwardRef=function(e){return E(e)===d},t.isFragment=function(e){return E(e)===i},t.isLazy=function(e){return E(e)===y},t.isMemo=function(e){return E(e)===v},t.isPortal=function(e){return E(e)===a},t.isProfiler=function(e){return E(e)===l},t.isStrictMode=function(e){return E(e)===u},t.isSuspense=function(e){return E(e)===h}},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(16),i=n.n(a),u=n(23),l=function(){return Math.random().toString(36).substring(7).split("").join(".")},c={INIT:"@@redux/INIT"+l(),REPLACE:"@@redux/REPLACE"+l(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+l()}};function s(e){if("object"!=typeof e||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function f(e,t,n){var r;if("function"==typeof t&&"function"==typeof n||"function"==typeof n&&"function"==typeof arguments[3])throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function.");if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(f)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var o=e,a=t,i=[],l=i,p=!1;function d(){l===i&&(l=i.slice())}function h(){if(p)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return a}function m(e){if("function"!=typeof e)throw new Error("Expected the listener to be a function.");if(p)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");var t=!0;return d(),l.push(e),function(){if(t){if(p)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");t=!1,d();var n=l.indexOf(e);l.splice(n,1)}}}function v(e){if(!s(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(p)throw new Error("Reducers may not dispatch actions.");try{p=!0,a=o(a,e)}finally{p=!1}for(var t=i=l,n=0;n<t.length;n++){(0,t[n])()}return e}return v({type:c.INIT}),(r={dispatch:v,subscribe:m,getState:h,replaceReducer:function(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");o=e,v({type:c.REPLACE})}})[u.a]=function(){var e,t=m;return(e={subscribe:function(e){if("object"!=typeof e||null===e)throw new TypeError("Expected the observer to be an object.");function n(){e.next&&e.next(h())}return n(),{unsubscribe:t(n)}}})[u.a]=function(){return this},e},r}function p(e,t){var n=t&&t.type;return"Given "+(n&&'action "'+String(n)+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function d(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var o=t[r];0,"function"==typeof e[o]&&(n[o]=e[o])}var a,i=Object.keys(n);try{!function(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:c.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:c.PROBE_UNKNOWN_ACTION()}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+c.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}(n)}catch(e){a=e}return function(e,t){if(void 0===e&&(e={}),a)throw a;for(var r=!1,o={},u=0;u<i.length;u++){var l=i[u],c=n[l],s=e[l],f=c(s,t);if(void 0===f){var d=p(l,t);throw new Error(d)}o[l]=f,r=r||f!==s}return r?o:e}}function h(e,t){return function(){return t(e.apply(this,arguments))}}function m(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e,t){var n=Object.keys(e);return Object.getOwnPropertySymbols&&n.push.apply(n,Object.getOwnPropertySymbols(e)),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?v(n,!0).forEach(function(t){m(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):v(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function g(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}function b(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(){var n=e.apply(void 0,arguments),r=function(){throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")},o={getState:n.getState,dispatch:function(){return r.apply(void 0,arguments)}},a=t.map(function(e){return e(o)});return y({},n,{dispatch:r=g.apply(void 0,a)(n.dispatch)})}}}var E=n(43),w=n.n(E),_=function(e){return{type:"RECEIVE_CURRENT_USER",user:e}},x=function(){return{type:"CLEAR_ERRORS"}},k=function(e){return function(t){return(n=e,$.ajax({url:"/api/session",method:"POST",data:{user:n}})).then(function(e){return t(_(e))},function(e){return t(function(e){return{type:"RECEIVE_ERRORS",errors:e}}(e.responseJSON))});var n}},S=function(){return function(e){return $.ajax({url:"/api/session",method:"DELETE"}).then(function(){return e({type:"LOGOUT_CURRENT_USER"})})}},N={currentUser:null},O=function(){return function(e){return $.ajax({method:"GET",url:"api/products/"}).then(function(t){return e(function(e){return{type:"RECEIVE_PRODUCTS",products:e}}(t))})}},T=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"api/products/".concat(e)})}(e).then(function(e){return t({type:"RECEIVE_PRODUCT",payload:e}),e})}},C=function(e){return{type:"RECEIVE_ORDER",order:e.order,orderItems:e.orderItems,products:e.products,productItems:e.productItems,users:e.users}},P=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"api/orders/".concat(e)})}(e).then(function(e){return t(C(e))})}};window.fetchOrder=P;var j=function(e){return{type:"RECEIVE_ORDER_ITEM",orderItem:e.orderItems}},R=function(e,t){return function(e){return function(e,t){return $.ajax({method:"POST",url:"api/orders/".concat(t.order_id,"/order_items"),data:{orderItem:t}})}(0,t).then(function(t){return e(j(t))})}},I=function(e,t,n){return function(t){return function(e,t,n){return $.ajax({method:"DELETE",url:"api/orders/".concat(n,"/order_items/").concat(e),orderItem:{order_id:n,id:e}})}(e,0,n).then(function(e){return t(function(e){return{type:"REMOVE_ORDER_ITEM",orderItemId:Object.keys(e.orderItems)}}(e))})}};n(50);function A(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var U=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;Object.freeze(e);var n,r=Object.assign({},e);switch(t.type){case"RECEIVE_PRODUCTS":return Object.assign(r,t.products);case"RECEIVE_PRODUCT":return n=t.payload.product,Object.assign(r,A({},n.id,n));case"RECEIVE_ORDER":return Object.assign(r,t.products);default:return e}},M=function(e){return{type:"RECEIVE_PRODUCT_ITEM",productItem:e}},z=function(e){return function(t){return(n=e,$.ajax({method:"PATCH",url:"api/product_items/".concat(n.id),data:{product_item:n}})).then(function(e){return t(M(e))});var n}},D=n(3);function L(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function F(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var W=d({products:U,productItems:function(){var e,t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(n),r.type){case"RECEIVE_PRODUCT_ITEM":return e=Object(D.merge)({},n,L({},r.productItem.id,r.productItem));case"RECEIVE_PRODUCT":return t=r.payload.product_items,Object(D.merge)({},n,t);case"RECEIVE_ORDER":return e=Object(D.merge)({},e,r.productItems);default:return n}},orders:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_ORDER":return Object(D.merge)({},e,t.order);case"RECEIVE_PRODUCT":return Object(D.merge)({},e,t.payload.orders);case"LOGOUT_CURRENT_USER":return{};default:return e}},orderItems:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1?arguments[1]:void 0,r=Object.assign({},t);switch(Object.freeze(t),n.type){case"RECEIVE_ORDER_ITEM":return r=Object.assign(r,F({},n.orderItem.id,n.orderItem));case"REMOVE_ORDER_ITEM":return delete r[n.orderItemId],r;case"RECEIVE_ORDER":return r=Object.assign(r,n.orderItems);case"RECEIVE_PRODUCT":return e=n.payload.order_items,Object.assign(r,e);case"LOGOUT_CURRENT_USER":return{};default:return t}}}),B=function(e){return function(t){return(n=e,$.ajax({url:"/api/users",method:"POST",data:{user:n}})).then(function(e){return t(function(e){return{type:"RECEIVE_CURRENT_USER",user:e}}(e))},function(e){return t(function(e){return{type:"RECEIVE_SIGNUP_ERRORS",errors:e}}(e.responseJSON))});var n}},V=d({session:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":return[];case"RECEIVE_ERRORS":return t.errors;case"CLEAR_ERRORS":return[];default:return e}},signup:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":return[];case"RECEIVE_SIGNUP_ERRORS":return t.errors;default:return e}}}),q=d({entities:W,session:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:N,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":var n=t.user;return Object.assign({},{currentUser:n});case"LOGOUT_CURRENT_USER":return N;default:return e}},errors:V}),H=function(e){var t=e.dispatch,n=e.getState;return function(e){return function(r){return"function"==typeof r?r(t,n):e(r)}}};function K(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var Q=n(1),G=n.n(Q),Y=o.a.createContext(null);var Z=function(e){e()},X=function(){return Z},J=null,ee={notify:function(){}};var te=function(){function e(e,t){this.store=e,this.parentSub=t,this.unsubscribe=null,this.listeners=ee,this.handleChangeWrapper=this.handleChangeWrapper.bind(this)}var t=e.prototype;return t.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},t.notifyNestedSubs=function(){this.listeners.notify()},t.handleChangeWrapper=function(){this.onStateChange&&this.onStateChange()},t.isSubscribed=function(){return Boolean(this.unsubscribe)},t.trySubscribe=function(){var e,t,n;this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.handleChangeWrapper):this.store.subscribe(this.handleChangeWrapper),this.listeners=(e=X(),t=[],n=[],{clear:function(){n=J,t=J},notify:function(){var r=t=n;e(function(){for(var e=0;e<r.length;e++)r[e]()})},get:function(){return n},subscribe:function(e){var r=!0;return n===t&&(n=t.slice()),n.push(e),function(){r&&t!==J&&(r=!1,n===t&&(n=t.slice()),n.splice(n.indexOf(e),1))}}}))},t.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=ee)},e}(),ne=function(e){function t(t){var n;n=e.call(this,t)||this;var r=t.store;n.notifySubscribers=n.notifySubscribers.bind(function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(n));var o=new te(r);return o.onStateChange=n.notifySubscribers,n.state={store:r,subscription:o},n.previousState=r.getState(),n}K(t,e);var n=t.prototype;return n.componentDidMount=function(){this._isMounted=!0,this.state.subscription.trySubscribe(),this.previousState!==this.props.store.getState()&&this.state.subscription.notifyNestedSubs()},n.componentWillUnmount=function(){this.unsubscribe&&this.unsubscribe(),this.state.subscription.tryUnsubscribe(),this._isMounted=!1},n.componentDidUpdate=function(e){if(this.props.store!==e.store){this.state.subscription.tryUnsubscribe();var t=new te(this.props.store);t.onStateChange=this.notifySubscribers,this.setState({store:this.props.store,subscription:t})}},n.notifySubscribers=function(){this.state.subscription.notifyNestedSubs()},n.render=function(){var e=this.props.context||Y;return o.a.createElement(e.Provider,{value:this.state},this.props.children)},t}(r.Component);ne.propTypes={store:G.a.shape({subscribe:G.a.func.isRequired,dispatch:G.a.func.isRequired,getState:G.a.func.isRequired}),context:G.a.object,children:G.a.any};var re=ne;function oe(){return(oe=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function ae(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}var ie=n(8),ue=n.n(ie),le=n(2),ce=n.n(le),se=n(17),fe=[],pe=[null,null];function de(e,t){var n=e[1];return[t.payload,n+1]}var he=function(){return[null,0]},me="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?r.useLayoutEffect:r.useEffect;function ve(e,t){void 0===t&&(t={});var n=t,a=n.getDisplayName,i=void 0===a?function(e){return"ConnectAdvanced("+e+")"}:a,u=n.methodName,l=void 0===u?"connectAdvanced":u,c=n.renderCountProp,s=void 0===c?void 0:c,f=n.shouldHandleStateChanges,p=void 0===f||f,d=n.storeKey,h=void 0===d?"store":d,m=n.withRef,v=void 0!==m&&m,y=n.forwardRef,g=void 0!==y&&y,b=n.context,E=void 0===b?Y:b,w=ae(n,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef","forwardRef","context"]);ce()(void 0===s,"renderCountProp is removed. render counting is built into the latest React Dev Tools profiling extension"),ce()(!v,"withRef is removed. To access the wrapped instance, use a ref on the connected component");ce()("store"===h,"storeKey has been removed and does not do anything. To use a custom Redux store for specific components, create a custom React context with React.createContext(), and pass the context object to React Redux's Provider and specific components like: <Provider context={MyContext}><ConnectedComponent context={MyContext} /></Provider>. You may also pass a {context : MyContext} option to connect");var _=E;return function(t){var n=t.displayName||t.name||"Component",a=i(n),u=oe({},w,{getDisplayName:i,methodName:l,renderCountProp:s,shouldHandleStateChanges:p,storeKey:h,displayName:a,wrappedComponentName:n,WrappedComponent:t}),c=w.pure;var f=c?r.useMemo:function(e){return e()};function d(n){var i=Object(r.useMemo)(function(){var e=n.forwardedRef,t=ae(n,["forwardedRef"]);return[n.context,e,t]},[n]),l=i[0],c=i[1],s=i[2],d=Object(r.useMemo)(function(){return l&&l.Consumer&&Object(se.isContextConsumer)(o.a.createElement(l.Consumer,null))?l:_},[l,_]),h=Object(r.useContext)(d),m=Boolean(n.store),v=Boolean(h)&&Boolean(h.store);ce()(m||v,'Could not find "store" in the context of "'+a+'". Either wrap the root component in a <Provider>, or pass a custom React context provider to <Provider> and the corresponding React context consumer to '+a+" in connect options.");var y=n.store||h.store,g=Object(r.useMemo)(function(){return function(t){return e(t.dispatch,u)}(y)},[y]),b=Object(r.useMemo)(function(){if(!p)return pe;var e=new te(y,m?null:h.subscription),t=e.notifyNestedSubs.bind(e);return[e,t]},[y,m,h]),E=b[0],w=b[1],x=Object(r.useMemo)(function(){return m?h:oe({},h,{subscription:E})},[m,h,E]),k=Object(r.useReducer)(de,fe,he),S=k[0][0],N=k[1];if(S&&S.error)throw S.error;var O=Object(r.useRef)(),T=Object(r.useRef)(s),C=Object(r.useRef)(),P=Object(r.useRef)(!1),j=f(function(){return C.current&&s===T.current?C.current:g(y.getState(),s)},[y,S,s]);me(function(){T.current=s,O.current=j,P.current=!1,C.current&&(C.current=null,w())}),me(function(){if(p){var e=!1,t=null,n=function(){if(!e){var n,r,o=y.getState();try{n=g(o,T.current)}catch(e){r=e,t=e}r||(t=null),n===O.current?P.current||w():(O.current=n,C.current=n,P.current=!0,N({type:"STORE_UPDATED",payload:{latestStoreState:o,error:r}}))}};E.onStateChange=n,E.trySubscribe(),n();return function(){if(e=!0,E.tryUnsubscribe(),t)throw t}}},[y,E,g]);var R=Object(r.useMemo)(function(){return o.a.createElement(t,oe({},j,{ref:c}))},[c,t,j]);return Object(r.useMemo)(function(){return p?o.a.createElement(d.Provider,{value:x},R):R},[d,R,x])}var m=c?o.a.memo(d):d;if(m.WrappedComponent=t,m.displayName=a,g){var v=o.a.forwardRef(function(e,t){return o.a.createElement(m,oe({},e,{forwardedRef:t}))});return v.displayName=a,v.WrappedComponent=t,ue()(v,t)}return ue()(m,t)}}var ye=Object.prototype.hasOwnProperty;function ge(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function be(e,t){if(ge(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var o=0;o<n.length;o++)if(!ye.call(t,n[o])||!ge(e[n[o]],t[n[o]]))return!1;return!0}function Ee(e){return function(t,n){var r=e(t,n);function o(){return r}return o.dependsOnOwnProps=!1,o}}function we(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function _e(e,t){return function(t,n){n.displayName;var r=function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)};return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=we(e);var o=r(t,n);return"function"==typeof o&&(r.mapToProps=o,r.dependsOnOwnProps=we(o),o=r(t,n)),o},r}}var xe=[function(e){return"function"==typeof e?_e(e):void 0},function(e){return e?void 0:Ee(function(e){return{dispatch:e}})},function(e){return e&&"object"==typeof e?Ee(function(t){return function(e,t){if("function"==typeof e)return h(e,t);if("object"!=typeof e||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');var n={};for(var r in e){var o=e[r];"function"==typeof o&&(n[r]=h(o,t))}return n}(e,t)}):void 0}];var ke=[function(e){return"function"==typeof e?_e(e):void 0},function(e){return e?void 0:Ee(function(){return{}})}];function Se(e,t,n){return oe({},n,e,t)}var Ne=[function(e){return"function"==typeof e?function(e){return function(t,n){n.displayName;var r,o=n.pure,a=n.areMergedPropsEqual,i=!1;return function(t,n,u){var l=e(t,n,u);return i?o&&a(l,r)||(r=l):(i=!0,r=l),r}}}(e):void 0},function(e){return e?void 0:function(){return Se}}];function Oe(e,t,n,r){return function(o,a){return n(e(o,a),t(r,a),a)}}function Te(e,t,n,r,o){var a,i,u,l,c,s=o.areStatesEqual,f=o.areOwnPropsEqual,p=o.areStatePropsEqual,d=!1;function h(o,d){var h,m,v=!f(d,i),y=!s(o,a);return a=o,i=d,v&&y?(u=e(a,i),t.dependsOnOwnProps&&(l=t(r,i)),c=n(u,l,i)):v?(e.dependsOnOwnProps&&(u=e(a,i)),t.dependsOnOwnProps&&(l=t(r,i)),c=n(u,l,i)):y?(h=e(a,i),m=!p(h,u),u=h,m&&(c=n(u,l,i)),c):c}return function(o,s){return d?h(o,s):(u=e(a=o,i=s),l=t(r,i),c=n(u,l,i),d=!0,c)}}function Ce(e,t){var n=t.initMapStateToProps,r=t.initMapDispatchToProps,o=t.initMergeProps,a=ae(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),i=n(e,a),u=r(e,a),l=o(e,a);return(a.pure?Te:Oe)(i,u,l,e,a)}function Pe(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function je(e,t){return e===t}var Re,Ie,Ae,Ue,Me,ze,De,Le,Fe,We,Be,$e,Ve=(Ae=(Ie=void 0===Re?{}:Re).connectHOC,Ue=void 0===Ae?ve:Ae,Me=Ie.mapStateToPropsFactories,ze=void 0===Me?ke:Me,De=Ie.mapDispatchToPropsFactories,Le=void 0===De?xe:De,Fe=Ie.mergePropsFactories,We=void 0===Fe?Ne:Fe,Be=Ie.selectorFactory,$e=void 0===Be?Ce:Be,function(e,t,n,r){void 0===r&&(r={});var o=r,a=o.pure,i=void 0===a||a,u=o.areStatesEqual,l=void 0===u?je:u,c=o.areOwnPropsEqual,s=void 0===c?be:c,f=o.areStatePropsEqual,p=void 0===f?be:f,d=o.areMergedPropsEqual,h=void 0===d?be:d,m=ae(o,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),v=Pe(e,ze,"mapStateToProps"),y=Pe(t,Le,"mapDispatchToProps"),g=Pe(n,We,"mergeProps");return Ue($e,oe({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:v,initMapDispatchToProps:y,initMergeProps:g,pure:i,areStatesEqual:l,areOwnPropsEqual:s,areStatePropsEqual:p,areMergedPropsEqual:h},m))});var qe;"undefined"!=typeof window?r.useLayoutEffect:r.useEffect;qe=a.unstable_batchedUpdates,Z=qe;var He=n(24),Ke=n.n(He),Qe=n(45),Ge=n.n(Qe),Ye=1073741823;var Ze=o.a.createContext||function(e,t){var n,o,a="__create-react-context-"+Ge()()+"__",i=function(e){function n(){var t,n,r;return(t=e.apply(this,arguments)||this).emitter=(n=t.props.value,r=[],{on:function(e){r.push(e)},off:function(e){r=r.filter(function(t){return t!==e})},get:function(){return n},set:function(e,t){n=e,r.forEach(function(e){return e(n,t)})}}),t}Ke()(n,e);var r=n.prototype;return r.getChildContext=function(){var e;return(e={})[a]=this.emitter,e},r.componentWillReceiveProps=function(e){if(this.props.value!==e.value){var n,r=this.props.value,o=e.value;((a=r)===(i=o)?0!==a||1/a==1/i:a!=a&&i!=i)?n=0:(n="function"==typeof t?t(r,o):Ye,0!==(n|=0)&&this.emitter.set(e.value,n))}var a,i},r.render=function(){return this.props.children},n}(r.Component);i.childContextTypes=((n={})[a]=G.a.object.isRequired,n);var u=function(t){function n(){var e;return(e=t.apply(this,arguments)||this).state={value:e.getValue()},e.onUpdate=function(t,n){0!=((0|e.observedBits)&n)&&e.setState({value:e.getValue()})},e}Ke()(n,t);var r=n.prototype;return r.componentWillReceiveProps=function(e){var t=e.observedBits;this.observedBits=null==t?Ye:t},r.componentDidMount=function(){this.context[a]&&this.context[a].on(this.onUpdate);var e=this.props.observedBits;this.observedBits=null==e?Ye:e},r.componentWillUnmount=function(){this.context[a]&&this.context[a].off(this.onUpdate)},r.getValue=function(){return this.context[a]?this.context[a].get():e},r.render=function(){return(e=this.props.children,Array.isArray(e)?e[0]:e)(this.state.value);var e},n}(r.Component);return u.contextTypes=((o={})[a]=G.a.object,o),{Provider:i,Consumer:u}};function Xe(e){return"/"===e.charAt(0)}function Je(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}var et=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],r=t&&t.split("/")||[],o=e&&Xe(e),a=t&&Xe(t),i=o||a;if(e&&Xe(e)?r=n:n.length&&(r.pop(),r=r.concat(n)),!r.length)return"/";var u=void 0;if(r.length){var l=r[r.length-1];u="."===l||".."===l||""===l}else u=!1;for(var c=0,s=r.length;s>=0;s--){var f=r[s];"."===f?Je(r,s):".."===f?(Je(r,s),c++):c&&(Je(r,s),c--)}if(!i)for(;c--;c)r.unshift("..");!i||""===r[0]||r[0]&&Xe(r[0])||r.unshift("");var p=r.join("/");return u&&"/"!==p.substr(-1)&&(p+="/"),p},tt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var nt=function e(t,n){if(t===n)return!0;if(null==t||null==n)return!1;if(Array.isArray(t))return Array.isArray(n)&&t.length===n.length&&t.every(function(t,r){return e(t,n[r])});var r=void 0===t?"undefined":tt(t);if(r!==(void 0===n?"undefined":tt(n)))return!1;if("object"===r){var o=t.valueOf(),a=n.valueOf();if(o!==t||a!==n)return e(o,a);var i=Object.keys(t),u=Object.keys(n);return i.length===u.length&&i.every(function(r){return e(t[r],n[r])})}return!1},rt=!0,ot="Invariant failed";var at=function(e,t){if(!e)throw rt?new Error(ot):new Error(ot+": "+(t||""))};function it(e){return"/"===e.charAt(0)?e:"/"+e}function ut(e){return"/"===e.charAt(0)?e.substr(1):e}function lt(e,t){return function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)}(e,t)?e.substr(t.length):e}function ct(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e}function st(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}function ft(e,t,n,r){var o;"string"==typeof e?(o=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var a=t.indexOf("?");return-1!==a&&(n=t.substr(a),t=t.substr(0,a)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}}(e)).state=t:(void 0===(o=oe({},e)).pathname&&(o.pathname=""),o.search?"?"!==o.search.charAt(0)&&(o.search="?"+o.search):o.search="",o.hash?"#"!==o.hash.charAt(0)&&(o.hash="#"+o.hash):o.hash="",void 0!==t&&void 0===o.state&&(o.state=t));try{o.pathname=decodeURI(o.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+o.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(o.key=n),r?o.pathname?"/"!==o.pathname.charAt(0)&&(o.pathname=et(o.pathname,r.pathname)):o.pathname=r.pathname:o.pathname||(o.pathname="/"),o}function pt(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&nt(e.state,t.state)}function dt(){var e=null;var t=[];return{setPrompt:function(t){return e=t,function(){e===t&&(e=null)}},confirmTransitionTo:function(t,n,r,o){if(null!=e){var a="function"==typeof e?e(t,n):e;"string"==typeof a?"function"==typeof r?r(a,o):o(!0):o(!1!==a)}else o(!0)},appendListener:function(e){var n=!0;function r(){n&&e.apply(void 0,arguments)}return t.push(r),function(){n=!1,t=t.filter(function(e){return e!==r})}},notifyListeners:function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];t.forEach(function(e){return e.apply(void 0,n)})}}}var ht=!("undefined"==typeof window||!window.document||!window.document.createElement);function mt(e,t){t(window.confirm(e))}var vt="popstate",yt="hashchange";function gt(){try{return window.history.state||{}}catch(e){return{}}}function bt(e){void 0===e&&(e={}),ht||at(!1);var t,n=window.history,r=(-1===(t=window.navigator.userAgent).indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone"))&&window.history&&"pushState"in window.history,o=!(-1===window.navigator.userAgent.indexOf("Trident")),a=e,i=a.forceRefresh,u=void 0!==i&&i,l=a.getUserConfirmation,c=void 0===l?mt:l,s=a.keyLength,f=void 0===s?6:s,p=e.basename?ct(it(e.basename)):"";function d(e){var t=e||{},n=t.key,r=t.state,o=window.location,a=o.pathname+o.search+o.hash;return p&&(a=lt(a,p)),ft(a,r,n)}function h(){return Math.random().toString(36).substr(2,f)}var m=dt();function v(e){oe(T,e),T.length=n.length,m.notifyListeners(T.location,T.action)}function y(e){(function(e){void 0===e.state&&navigator.userAgent.indexOf("CriOS")})(e)||E(d(e.state))}function g(){E(d(gt()))}var b=!1;function E(e){if(b)b=!1,v();else{m.confirmTransitionTo(e,"POP",c,function(t){t?v({action:"POP",location:e}):function(e){var t=T.location,n=_.indexOf(t.key);-1===n&&(n=0);var r=_.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(b=!0,k(o))}(e)})}}var w=d(gt()),_=[w.key];function x(e){return p+st(e)}function k(e){n.go(e)}var S=0;function N(e){1===(S+=e)&&1===e?(window.addEventListener(vt,y),o&&window.addEventListener(yt,g)):0===S&&(window.removeEventListener(vt,y),o&&window.removeEventListener(yt,g))}var O=!1;var T={length:n.length,action:"POP",location:w,createHref:x,push:function(e,t){var o=ft(e,t,h(),T.location);m.confirmTransitionTo(o,"PUSH",c,function(e){if(e){var t=x(o),a=o.key,i=o.state;if(r)if(n.pushState({key:a,state:i},null,t),u)window.location.href=t;else{var l=_.indexOf(T.location.key),c=_.slice(0,-1===l?0:l+1);c.push(o.key),_=c,v({action:"PUSH",location:o})}else window.location.href=t}})},replace:function(e,t){var o=ft(e,t,h(),T.location);m.confirmTransitionTo(o,"REPLACE",c,function(e){if(e){var t=x(o),a=o.key,i=o.state;if(r)if(n.replaceState({key:a,state:i},null,t),u)window.location.replace(t);else{var l=_.indexOf(T.location.key);-1!==l&&(_[l]=o.key),v({action:"REPLACE",location:o})}else window.location.replace(t)}})},go:k,goBack:function(){k(-1)},goForward:function(){k(1)},block:function(e){void 0===e&&(e=!1);var t=m.setPrompt(e);return O||(N(1),O=!0),function(){return O&&(O=!1,N(-1)),t()}},listen:function(e){var t=m.appendListener(e);return N(1),function(){N(-1),t()}}};return T}var Et="hashchange",wt={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+ut(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:ut,decodePath:it},slash:{encodePath:it,decodePath:it}};function _t(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)}function xt(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)}function kt(e){void 0===e&&(e={}),ht||at(!1);var t=window.history,n=(window.navigator.userAgent.indexOf("Firefox"),e),r=n.getUserConfirmation,o=void 0===r?mt:r,a=n.hashType,i=void 0===a?"slash":a,u=e.basename?ct(it(e.basename)):"",l=wt[i],c=l.encodePath,s=l.decodePath;function f(){var e=s(_t());return u&&(e=lt(e,u)),ft(e)}var p=dt();function d(e){oe(S,e),S.length=t.length,p.notifyListeners(S.location,S.action)}var h=!1,m=null;function v(){var e=_t(),t=c(e);if(e!==t)xt(t);else{var n=f(),r=S.location;if(!h&&pt(r,n))return;if(m===st(n))return;m=null,function(e){if(h)h=!1,d();else{p.confirmTransitionTo(e,"POP",o,function(t){t?d({action:"POP",location:e}):function(e){var t=S.location,n=E.lastIndexOf(st(t));-1===n&&(n=0);var r=E.lastIndexOf(st(e));-1===r&&(r=0);var o=n-r;o&&(h=!0,w(o))}(e)})}}(n)}}var y=_t(),g=c(y);y!==g&&xt(g);var b=f(),E=[st(b)];function w(e){t.go(e)}var _=0;function x(e){1===(_+=e)&&1===e?window.addEventListener(Et,v):0===_&&window.removeEventListener(Et,v)}var k=!1;var S={length:t.length,action:"POP",location:b,createHref:function(e){return"#"+c(u+st(e))},push:function(e,t){var n=ft(e,void 0,void 0,S.location);p.confirmTransitionTo(n,"PUSH",o,function(e){if(e){var t=st(n),r=c(u+t);if(_t()!==r){m=t,function(e){window.location.hash=e}(r);var o=E.lastIndexOf(st(S.location)),a=E.slice(0,-1===o?0:o+1);a.push(t),E=a,d({action:"PUSH",location:n})}else d()}})},replace:function(e,t){var n=ft(e,void 0,void 0,S.location);p.confirmTransitionTo(n,"REPLACE",o,function(e){if(e){var t=st(n),r=c(u+t);_t()!==r&&(m=t,xt(r));var o=E.indexOf(st(S.location));-1!==o&&(E[o]=t),d({action:"REPLACE",location:n})}})},go:w,goBack:function(){w(-1)},goForward:function(){w(1)},block:function(e){void 0===e&&(e=!1);var t=p.setPrompt(e);return k||(x(1),k=!0),function(){return k&&(k=!1,x(-1)),t()}},listen:function(e){var t=p.appendListener(e);return x(1),function(){x(-1),t()}}};return S}function St(e,t,n){return Math.min(Math.max(e,t),n)}var Nt=n(25),Ot=n.n(Nt),Tt=function(e){var t=Ze();return t.displayName=e,t}("Router"),Ct=function(e){function t(t){var n;return(n=e.call(this,t)||this).state={location:t.history.location},n._isMounted=!1,n._pendingLocation=null,t.staticContext||(n.unlisten=t.history.listen(function(e){n._isMounted?n.setState({location:e}):n._pendingLocation=e})),n}K(t,e),t.computeRootMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}};var n=t.prototype;return n.componentDidMount=function(){this._isMounted=!0,this._pendingLocation&&this.setState({location:this._pendingLocation})},n.componentWillUnmount=function(){this.unlisten&&this.unlisten()},n.render=function(){return o.a.createElement(Tt.Provider,{children:this.props.children||null,value:{history:this.props.history,location:this.state.location,match:t.computeRootMatch(this.state.location.pathname),staticContext:this.props.staticContext}})},t}(o.a.Component);o.a.Component;var Pt=function(e){function t(){return e.apply(this,arguments)||this}K(t,e);var n=t.prototype;return n.componentDidMount=function(){this.props.onMount&&this.props.onMount.call(this,this)},n.componentDidUpdate=function(e){this.props.onUpdate&&this.props.onUpdate.call(this,this,e)},n.componentWillUnmount=function(){this.props.onUnmount&&this.props.onUnmount.call(this,this)},n.render=function(){return null},t}(o.a.Component);var jt={},Rt=1e4,It=0;function At(e,t){return void 0===e&&(e="/"),void 0===t&&(t={}),"/"===e?e:function(e){if(jt[e])return jt[e];var t=Ot.a.compile(e);return It<Rt&&(jt[e]=t,It++),t}(e)(t,{pretty:!0})}function Ut(e){var t=e.computedMatch,n=e.to,r=e.push,a=void 0!==r&&r;return o.a.createElement(Tt.Consumer,null,function(e){e||at(!1);var r=e.history,i=e.staticContext,u=a?r.push:r.replace,l=ft(t?"string"==typeof n?At(n,t.params):oe({},n,{pathname:At(n.pathname,t.params)}):n);return i?(u(l),null):o.a.createElement(Pt,{onMount:function(){u(l)},onUpdate:function(e,t){var n=ft(t.to);pt(n,oe({},l,{key:n.key}))||u(l)},to:n})})}var Mt={},zt=1e4,Dt=0;function Lt(e,t){void 0===t&&(t={}),"string"==typeof t&&(t={path:t});var n=t,r=n.path,o=n.exact,a=void 0!==o&&o,i=n.strict,u=void 0!==i&&i,l=n.sensitive,c=void 0!==l&&l;return[].concat(r).reduce(function(t,n){if(!n)return null;if(t)return t;var r=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=Mt[n]||(Mt[n]={});if(r[e])return r[e];var o=[],a={regexp:Ot()(e,o,t),keys:o};return Dt<zt&&(r[e]=a,Dt++),a}(n,{end:a,strict:u,sensitive:c}),o=r.regexp,i=r.keys,l=o.exec(e);if(!l)return null;var s=l[0],f=l.slice(1),p=e===s;return a&&!p?null:{path:n,url:"/"===n&&""===s?"/":s,isExact:p,params:i.reduce(function(e,t,n){return e[t.name]=f[n],e},{})}},null)}var Ft=function(e){function t(){return e.apply(this,arguments)||this}return K(t,e),t.prototype.render=function(){var e=this;return o.a.createElement(Tt.Consumer,null,function(t){t||at(!1);var n=e.props.location||t.location,r=oe({},t,{location:n,match:e.props.computedMatch?e.props.computedMatch:e.props.path?Lt(n.pathname,e.props):t.match}),a=e.props,i=a.children,u=a.component,l=a.render;(Array.isArray(i)&&0===i.length&&(i=null),"function"==typeof i)&&(void 0===(i=i(r))&&(i=null));return o.a.createElement(Tt.Provider,{value:r},i&&!function(e){return 0===o.a.Children.count(e)}(i)?i:r.match?u?o.a.createElement(u,r):l?l(r):null:null)})},t}(o.a.Component);function Wt(e){return"/"===e.charAt(0)?e:"/"+e}function Bt(e,t){if(!e)return t;var n=Wt(e);return 0!==t.pathname.indexOf(n)?t:oe({},t,{pathname:t.pathname.substr(n.length)})}function $t(e){return"string"==typeof e?e:st(e)}function Vt(e){return function(){at(!1)}}function qt(){}o.a.Component;var Ht=function(e){function t(){return e.apply(this,arguments)||this}return K(t,e),t.prototype.render=function(){var e=this;return o.a.createElement(Tt.Consumer,null,function(t){t||at(!1);var n,r,a=e.props.location||t.location;return o.a.Children.forEach(e.props.children,function(e){if(null==r&&o.a.isValidElement(e)){n=e;var i=e.props.path||e.props.from;r=i?Lt(a.pathname,oe({},e.props,{path:i})):t.match}}),r?o.a.cloneElement(n,{location:a,computedMatch:r}):null})},t}(o.a.Component);function Kt(e){var t="withRouter("+(e.displayName||e.name)+")",n=function(t){var n=t.wrappedComponentRef,r=ae(t,["wrappedComponentRef"]);return o.a.createElement(Tt.Consumer,null,function(t){return t||at(!1),o.a.createElement(e,oe({},r,t,{ref:n}))})};return n.displayName=t,n.WrappedComponent=e,ue()(n,e)}o.a.Component;var Qt=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(t=e.call.apply(e,[this].concat(r))||this).history=kt(t.props),t}return K(t,e),t.prototype.render=function(){return o.a.createElement(Ct,{history:this.history,children:this.props.children})},t}(o.a.Component);var Gt=function(e){function t(){return e.apply(this,arguments)||this}K(t,e);var n=t.prototype;return n.handleClick=function(e,t){try{this.props.onClick&&this.props.onClick(e)}catch(t){throw e.preventDefault(),t}e.defaultPrevented||0!==e.button||this.props.target&&"_self"!==this.props.target||function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}(e)||(e.preventDefault(),(this.props.replace?t.replace:t.push)(this.props.to))},n.render=function(){var e=this,t=this.props,n=t.innerRef,r=(t.replace,t.to),a=ae(t,["innerRef","replace","to"]);return o.a.createElement(Tt.Consumer,null,function(t){t||at(!1);var i="string"==typeof r?ft(r,null,null,t.location):r,u=i?t.history.createHref(i):"";return o.a.createElement("a",oe({},a,{onClick:function(n){return e.handleClick(n,t.history)},href:u,ref:n}))})},t}(o.a.Component);var Yt=function(e){return{loggedIn:Boolean(e.session.currentUser)}},Zt=Kt(Ve(Yt)(function(e){var t=e.loggedIn,n=e.path,r=e.component;return o.a.createElement(Ft,{path:n,render:function(e){return t?o.a.createElement(Ut,{to:"/"}):o.a.createElement(r,e)}})}));Kt(Ve(Yt)(function(e){var t=e.loggedIn,n=e.path,r=e.component;return o.a.createElement(Ft,{path:n,render:function(e){return t?o.a.createElement(r,e):o.a.createElement(Ut,{to:"/login"})}})}));function Xt(e){return(Xt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Jt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function en(e){return(en=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function tn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function nn(e,t){return(nn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var rn=Kt(function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Xt(t)&&"function"!=typeof t?tn(e):t}(this,en(t).call(this,e))).state={email:"",password:""},n.handleSubmit=n.handleSubmit.bind(tn(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&nn(e,t)}(t,o.a.Component),n=t,(r=[{key:"handleInput",value:function(e){var t=this;return function(n){var r,o,a;t.setState((r={},o=e,a=n.target.value,o in r?Object.defineProperty(r,o,{value:a,enumerable:!0,configurable:!0,writable:!0}):r[o]=a,r))}}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.login({email:"demo@gmail.com",password:"password"}).then(function(){return t.props.history.push("/")})}},{key:"renderErrors",value:function(){var e=this.props.errors.map(function(e,t){return o.a.createElement("li",{className:"auth--form-error",key:t},e)});return 0===e.length?o.a.createElement("div",null):o.a.createElement("ul",{className:"auth--login--form-errors"},e)}},{key:"render",value:function(){return o.a.createElement("section",{className:"auth"},o.a.createElement("ul",{className:"auth--container"},o.a.createElement("section",{className:"auth--header"},o.a.createElement("a",{"class-name":"auth--logo",href:"#/"},o.a.createElement("img",{src:"https://66.media.tumblr.com/a1f4e385d907cf5bdc70bf919143ca2d/tumblr_pqt9m9O3uK1wyb2l8o1_100.png",height:"28",width:"95",alt:"ASOS logo"}))),o.a.createElement("section",{className:"auth--form-container"},o.a.createElement("section",{className:"auth--register"},o.a.createElement("ul",{className:"auth--register--options"},o.a.createElement("a",{href:"#/signup",className:"auth--register--not-selected-left"},"NEW TO ASOS?"),o.a.createElement("p",{className:"auth--register--selected-right"},"ALREADY REGISTERED?"))),o.a.createElement("main",{className:"auth--form--main"},o.a.createElement("h2",{className:"auth--title"},"SIGN IN WITH EMAIL"),o.a.createElement("form",{className:"auth--login-form"},this.renderErrors(),o.a.createElement("label",{className:"auth--form-label"},"EMAIL ADDRESS:",o.a.createElement("input",{className:"auth--form-input",type:"text",value:this.state.email,onChange:this.handleInput("email")})),o.a.createElement("label",{className:"auth--form-label"},"PASSWORD",o.a.createElement("input",{className:"auth--form-input-password",type:"password:",value:this.state.password,onChange:this.handleInput("password")})),o.a.createElement("button",{className:"auth--button",onClick:this.handleSubmit},"Demo"))))))}}])&&Jt(n.prototype,r),a&&Jt(n,a),t}()),on=Ve(function(e){return{errors:e.errors.session,formType:"login"}},function(e){return{login:function(t){return e(k(t))},clearErrors:function(){return e(x)}}})(rn);function an(e){return(an="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function un(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ln(e){return(ln=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function cn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function sn(e,t){return(sn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var fn=Kt(function(e){function t(e){var n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),n=function(e,t){return!t||"object"!==an(t)&&"function"!=typeof t?cn(e):t}(this,ln(t).call(this,e));var r=new Date;return n.state={email:"",password:"",first_name:"",last_name:"",date_of_birth:r,gender:"Female",country:"United States",email_lists:[]},n.handleSubmit=n.handleSubmit.bind(cn(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&sn(e,t)}(t,o.a.Component),n=t,(r=[{key:"handleInput",value:function(e){var t=this;return function(n){var r,o,a;t.setState((r={},o=e,a=n.target.value,o in r?Object.defineProperty(r,o,{value:a,enumerable:!0,configurable:!0,writable:!0}):r[o]=a,r))}}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.createNewUser(this.state).then(function(){return t.props.history.push("/")})}},{key:"renderErrors",value:function(e){var t=this.props.errors[e];if(void 0!==t)return t=t.map(function(e,t){return o.a.createElement("li",{className:"auth--form-error",key:t},e)}),o.a.createElement("ul",{className:"auth--form-errors"},t,o.a.createElement("div",{className:"arrow-down"}),o.a.createElement("div",{className:"arrow-down-2"}))}},{key:"render",value:function(){return o.a.createElement("section",{className:"auth"},o.a.createElement("ul",{className:"auth--container"},o.a.createElement("section",{className:"auth--header"},o.a.createElement("a",{"class-name":"auth--logo",href:"#/"},o.a.createElement("img",{src:"https://66.media.tumblr.com/a1f4e385d907cf5bdc70bf919143ca2d/tumblr_pqt9m9O3uK1wyb2l8o1_100.png",height:"28",width:"95",alt:"ASOS logo"}))),o.a.createElement("section",{className:"auth--form-container"},o.a.createElement("section",{className:"auth--register"},o.a.createElement("ul",{className:"auth--register--options"},o.a.createElement("p",{className:"auth--register--selected-left"},"NEW TO ASOS?"),o.a.createElement("a",{href:"#/login",className:"auth--register--not-selected-right"},"ALREADY REGISTERED?"))),o.a.createElement("h2",{className:"auth--title"},"SIGN UP USING YOUR EMAIL ADDRESS"),o.a.createElement("main",{className:"auth--form--main--sign-up"},o.a.createElement("form",{class:"auth--signup-form"},o.a.createElement("label",{className:"auth--form-label"},"EMAIL ADDRESS:",this.renderErrors("email"),o.a.createElement("input",{className:"auth--form-input",type:"text",value:this.state.email,onChange:this.handleInput("email")})),o.a.createElement("label",{className:"auth--form-label"},"FIRST NAME:",this.renderErrors("first_name"),o.a.createElement("input",{className:"auth--form-input",type:"text",value:this.state.first_name,onChange:this.handleInput("first_name")})),o.a.createElement("label",{className:"auth--form-label"},"LAST NAME:",this.renderErrors("last_name"),o.a.createElement("input",{className:"auth--form-input",type:"text",value:this.state.last_name,onChange:this.handleInput("last_name")})),o.a.createElement("label",{className:"auth--form-label"},"PASSWORD:",this.renderErrors("password"),o.a.createElement("input",{className:"auth--form-input-password",type:"password",value:this.state.password,onChange:this.handleInput("password")}))),o.a.createElement("button",{className:"auth--button",onClick:this.handleSubmit},"JOIN ASOS")))))}}])&&un(n.prototype,r),a&&un(n,a),t}()),pn=Ve(function(e){return{formType:"signup",errors:e.errors.signup}},function(e){return{createNewUser:function(t){return e(B(t))}}})(fn),dn=function(){return o.a.createElement("ul",{className:"footer--icon-bar"},o.a.createElement("li",{className:"footer--icon-bar--social"},o.a.createElement("img",{className:"social-icon",src:"https://66.media.tumblr.com/0b59e1312ae799a1c73deb04cc3708b8/tumblr_pqta9kzoNK1wyb2l8o1_250.png"}),o.a.createElement("img",{className:"social-icon",src:"https://66.media.tumblr.com/9796c1b33f6bd8a92b47a71f6f5a3ccb/tumblr_pqta9kzoNK1wyb2l8o2_250.png"}),o.a.createElement("img",{className:"social-icon",src:"https://66.media.tumblr.com/03f2bc232fc3ffd7da2795e049680acb/tumblr_pqta9kzoNK1wyb2l8o3_250.png"})),o.a.createElement("li",{className:"footer--icon-bar--payment"},o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/visa-png",alt:"visa"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/mastercard-png",alt:"mastercard"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/pay-pal-png",alt:"paypal"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/american-express-png",alt:"americanexpress"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/visa-electron-png",alt:"visaelectron"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/apple-pay-png",alt:"applepay"})))};var hn=function(){return o.a.createElement("section",{className:"footer--nav-links"},o.a.createElement("ul",{className:"footer--nav-links--col"},o.a.createElement("h4",{className:"footer--nav-links--title"},"HELP AND INFORMATION"),o.a.createElement("li",{className:"footer--nav-links--item"},"Help"),o.a.createElement("li",{className:"footer--nav-links--item"},"Track Order"),o.a.createElement("li",{className:"footer--nav-links--item"},"Delivery & Returns"),o.a.createElement("li",{className:"footer--nav-links--item"},"Premier Delivery"),o.a.createElement("li",{className:"footer--nav-links--item"},"10% Student Discount")),o.a.createElement("ul",{className:"footer--nav-links--col"},o.a.createElement("h4",{className:"footer--nav-links--title"},"ABOUT ASOS"),o.a.createElement("li",{className:"footer--nav-links--item"},"About Us"),o.a.createElement("li",{className:"footer--nav-links--item"},"Careers at ASOS"),o.a.createElement("li",{className:"footer--nav-links--item"},"Corporate Responsibility"),o.a.createElement("li",{className:"footer--nav-links--item"},"Investors Site")),o.a.createElement("ul",{className:"footer--nav-links--col"},o.a.createElement("h4",{className:"footer--nav-links--title"},"MORE FROM ASOS"),o.a.createElement("li",{className:"footer--nav-links--item"},"E-gift cards"),o.a.createElement("li",{className:"footer--nav-links--item"},"Mobile and ASOS Apps"),o.a.createElement("li",{className:"footer--nav-links--item"},"ASOS Marketplace")),o.a.createElement("ul",{className:"footer--nav-links--col"},o.a.createElement("h4",{className:"footer--nav-links--title"},"SHOPPING FROM:"),o.a.createElement("li",{className:"footer--nav-links--shipping"},o.a.createElement("span",{className:"footer--nav-links--shipping-country"},"You're in"),o.a.createElement("img",(n="United States",(t="alt")in(e={className:"shipping-icon",alt:"United States",src:"https://assets.asosservices.com/storesa/images/flags/us.png"})?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e)),o.a.createElement("span",{className:"footer--nav-links--shipping-change"},"| CHANGE"))));var e,t,n},mn=function(){return o.a.createElement("section",{className:"footer--ecom"},o.a.createElement("p",{className:"footer--ecom-copy"},"© 2019 ASOS"),o.a.createElement("ul",{className:"footer--ecom--terms"},o.a.createElement("li",{className:"footer--ecom--terms-item"},"Privacy & Cookies"),o.a.createElement("li",{className:"footer--ecom--terms-item"},"Ts&Cs"),o.a.createElement("li",{className:"footer--ecom--terms-item"},"Accessibility")))},vn=function(){return o.a.createElement("div",{className:"footer"},o.a.createElement(dn,null),o.a.createElement(hn,null),o.a.createElement(mn,null))},yn=function(){return o.a.createElement("div",{className:"home--banner"},o.a.createElement("div",{className:"home--banner-bar"},o.a.createElement("p",{className:"home--banner-bar--item"},"WOMEN"),o.a.createElement("span",{className:"home--banner-bar-item"},o.a.createElement("b",{className:"home--banner-bar-item"},o.a.createElement("strong",null,"SPEND MORE. SAVE MORE.")),o.a.createElement("b",{className:"home--banner-bar-item"},o.a.createElement("strong",null,"$200 get $50, $250 get $70, $350 get $100."))),o.a.createElement("p",{className:"home--banner-bar--item"},"MEN")),o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--banner-img",alt:"",src:"https://66.media.tumblr.com/406d7ef67095e7c0f71ec731d99b220c/tumblr_pqt6uwiL6G1wyb2l8o1_1280.gif"})))},gn=function(){return o.a.createElement("section",{className:"home--feature"},o.a.createElement("a",{href:"",className:"home--feature-img"},o.a.createElement("img",{alt:"",src:"https://content.asos-media.com/-/media/homepages/ww/2019/04/29/gbl-utility-surf-hero.jpg"})),o.a.createElement("section",{className:"home--feature--buttons"},o.a.createElement("a",{href:"",className:"home--large-feature-title"},"Surfer vibes"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW")),o.a.createElement("ul",{className:"home--double--feature"},o.a.createElement("li",{className:"home--double-feature--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{id:"home--double-feature--item--img",alt:"",src:"https://66.media.tumblr.com/8ec52eef708032a1eeefe1c7fa67154e/tumblr_pqt7mrVxZW1wyb2l8o2_1280.jpg"})),o.a.createElement("h3",{className:"double-feature--item--title"},"Festival"),o.a.createElement("p",{className:"double-feature--item--body"},"Be centre stage"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW")),o.a.createElement("li",{className:"home--double-feature--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{alt:"",id:"home--double-feature--item--img",src:"https://66.media.tumblr.com/bfa10e4c7c2d6d97b0436c732cbb2c00/tumblr_pqt7mrVxZW1wyb2l8o1_540.jpg"})),o.a.createElement("h3",{className:"double-feature--item--title"},"Sandals"),o.a.createElement("p",{className:"double-feature--item--body"},"Fresh styles for warm climates"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW"))),o.a.createElement("div",{className:"home--feature-banner"},o.a.createElement("a",{href:""})))},bn=function(){return o.a.createElement("section",{className:"home--style-feed"},o.a.createElement("h2",{className:"home--style-feed--title"},"STYLE FEED"),o.a.createElement("p",{className:"home--style-feed--body"},"Outfit ideas, editor picks, styling inspiration and Face + Body tips"),o.a.createElement("section",{className:"home--style-feed-carousel"},o.a.createElement("section",{className:"home--carousel-controls"},o.a.createElement("button",{className:"prev-btn"}),o.a.createElement("button",{className:"next-btn"})),o.a.createElement("ul",{className:"home--carousel-list"},o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--style-feed-carousel--img",alt:"",src:"https://66.media.tumblr.com/1befbe60f6baf4c2bcdb7b27efb4c720/tumblr_pqt6uwiL6G1wyb2l8o10_400.jpg"}),o.a.createElement("div",{className:"style-feed-carousel-content"},o.a.createElement("h3",{className:"home--style-feed-carousel--title"},"WHAT TO WEAR TO A DESTINATION WEDDING"),o.a.createElement("p",{className:"home--style-feed-carousel--body"},"Be best-dressed guest"),o.a.createElement("p",{className:"home--style-feed-carousel--date"},"April 25, 2019")))),o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--style-feed-carousel--img",alt:"",src:"https://66.media.tumblr.com/1b5f04ef58b7367ee5ba92969547e7bc/tumblr_pqt81iVKhd1wyb2l8o1_400.jpg"}),o.a.createElement("div",{className:"style-feed-carousel-content"},o.a.createElement("h3",{className:"home--style-feed-carousel--title"},"BEST OF NEW IN: PINK & PATCHWORK"),o.a.createElement("p",{className:"home--style-feed-carousel--body"},"The fashion team have spoken"),o.a.createElement("p",{className:"home--style-feed-carousel--date"},"April 27, 2019")))),o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--style-feed-carousel--img",alt:"",src:"https://66.media.tumblr.com/d3be3c801032ae3f2ff4debfde6900ff/tumblr_pqt84mKP4N1wyb2l8o1_400.jpg"}),o.a.createElement("div",{className:"style-feed-carousel-content"},o.a.createElement("h3",{className:"home--style-feed-carousel--title"},"THE ASOS + LIFE IS BEAUTIFUL COLLECTION IS HERE"),o.a.createElement("p",{className:"home--style-feed-carousel--body"},"Get festival fresh"),o.a.createElement("p",{className:"home--style-feed-carousel--date"},"April 26, 2019")))),o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--style-feed-carousel--img",alt:"",src:"https://66.media.tumblr.com/74df3ad7ab0196f75f21e44c0ade47bd/tumblr_pqt6uwiL6G1wyb2l8o8_400.jpg"}),o.a.createElement("div",{className:"style-feed-carousel-content"},o.a.createElement("h3",{className:"home--style-feed-carousel--title"},"5 OF THE MOST EXTRA ADD-ONS"),o.a.createElement("p",{className:"home--style-feed-carousel--body"},"It's all in the details"),o.a.createElement("p",{className:"home--style-feed-carousel--date"},"April 25, 2019")))),o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("span",{className:"home-style-feed-carousel-view-btn"},"VIEW ALL")))),o.a.createElement("a",{href:"",className:"general-btn"},"VIEW ALL")))},En=function(){return o.a.createElement("section",{className:"home--double--feature"},o.a.createElement("ul",{className:"home--double--feature"},o.a.createElement("li",{className:"home--double-feature--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--double-feature--img",alt:"",src:"https://66.media.tumblr.com/89ac10d7a313e5f8b6bc3d3d6a0cbd13/tumblr_pqt6uwiL6G1wyb2l8o5_400.jpg"})),o.a.createElement("h3",{className:"home--double-feature--item-title"},"SWIM WINS"),o.a.createElement("p",{className:"home--double-feature--item-body"},"Be a one-piece wonder"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW")),o.a.createElement("li",{className:"home--double--feature--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--double-feature--img",alt:"",src:"https://66.media.tumblr.com/ba92984adf698db7d303acb9d9407542/tumblr_pqwc89O6G91wyb2l8o1_500.png"})),o.a.createElement("h3",{className:"home--double-feature--item-title"},"OCCASIONWEAR"),o.a.createElement("p",{className:"home--double-feature--item-body"},"Be iconic"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW"))))},wn=function(){return o.a.createElement("section",{className:"home--category-carousel"},o.a.createElement("h2",{className:"home--category-carousel--title"},"SHOP BY CATEGORY"),o.a.createElement("section",{className:"home--carousel-controls"},o.a.createElement("button",{className:"prev-btn"}),o.a.createElement("button",{className:"next-btn"})),o.a.createElement("ul",{className:"home--carousel-list"},o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/fb98a108678d783456b8cbc0348c0218/tumblr_pqt8zg7Ptn1wyb2l8o4_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"DRESSES"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/b6c6b2e0d89b61ba51250fb286509ddd/tumblr_pqt8zg7Ptn1wyb2l8o2_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"SHOES"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/d371209ec9e6320a26bf35c6c5be6857/tumblr_pqt8zg7Ptn1wyb2l8o8_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"TOPS"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/ccd7f6ebd80b76b344aa33d06264715a/tumblr_pqt8zg7Ptn1wyb2l8o9_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"SKIRTS"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/c89d097f46189e86a0e6528c9dcc7134/tumblr_pqt8zg7Ptn1wyb2l8o5_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"SWIMWEAR"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/059dc3f6d3e11ef4fd6638a9225b959e/tumblr_pqt8zg7Ptn1wyb2l8o6_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"MATERNITY"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/e45cfe5f981c0e51b00c867838fd5204/tumblr_pqt8zg7Ptn1wyb2l8o7_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"PETITE"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/d8614815c01648217286faad2aa57971/tumblr_pqt8zg7Ptn1wyb2l8o3_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"TALL")))),o.a.createElement("section",{className:"home--banner"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--banner--img",alt:"",src:"https://66.media.tumblr.com/36b2bd39dcca9dcfcea356279b12db62/tumblr_pqt9a34ys41wyb2l8o1_1280.jpg"}))))},_n=function(){return o.a.createElement("div",{className:"home"},o.a.createElement(yn,null),o.a.createElement(gn,null),o.a.createElement(bn,null),o.a.createElement(En,null),o.a.createElement(wn,null))},xn=function(){return o.a.createElement("section",{className:"ecom-bar"},o.a.createElement("ul",{className:"ecom--list"},o.a.createElement("li",{className:"ecom-list--item"},"Marketplace"),o.a.createElement("li",{className:"ecom-list--item"},"Help & FAQs"),o.a.createElement("li",{className:"ecom-list--item-img"},o.a.createElement("img",{className:"shipping--icon",src:"https://assets.asosservices.com/storesa/images/flags/us.png",alt:"United States"}))))};function kn(e){return(kn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Sn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Nn(e,t){return!t||"object"!==kn(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function On(e){return(On=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Tn(e,t){return(Tn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Cn=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Nn(this,On(t).call(this,e))}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Tn(e,t)}(t,o.a.Component),n=t,(r=[{key:"render",value:function(){var e=this.props.currentUser?o.a.createElement("section",{className:"account-dropdown"},o.a.createElement("ul",{className:"account-dropdown--auth"},o.a.createElement("p",{className:"account-dropdown--auth--user"},"Hello ".concat(this.props.currentUser.first_name)),o.a.createElement("button",{className:"account-dropdown--auth--logout",onClick:this.props.logout},"Log Out!")),o.a.createElement("ul",{className:"account-dropdown--options"},o.a.createElement("p",{"class-name":"account-dropdown--option"},"My Account"),o.a.createElement("a",{href:"#/orders/".concat(this.props.orders.id)},o.a.createElement("p",{"class-name":"account-dropdown--option"},"My Orders")),o.a.createElement("p",{"class-name":"account-dropdown--option"},"Returns Information"),o.a.createElement("p",{"class-name":"account-dropdown--option"},"Contact Preferences"))):o.a.createElement("section",{className:"account-dropdown"},o.a.createElement("ul",{className:"account-dropdown--auth"},o.a.createElement("p",{className:"account-dropdown--auth--auth-links"},o.a.createElement(Gt,{to:"/signup"},"Sign Up")),o.a.createElement("p",{className:"account-dropdown--auth--auth-links"},o.a.createElement(Gt,{to:"/login"},"Log In"))),o.a.createElement("ul",{className:"account-dropdown--options"},o.a.createElement("p",{className:"account-dropdown--option"},"My Account"),o.a.createElement("p",{className:"account-dropdown--option"},"My Orders"),o.a.createElement("p",{className:"account-dropdown--option"},"Returns Information"),o.a.createElement("p",{className:"account-dropdown--option"},"Contact Preferences")));return o.a.createElement("section",{className:"toolbar"},o.a.createElement("ul",{className:"toolbar--business"},o.a.createElement("a",{"class-name":"auth--logo",href:"#/"},o.a.createElement("svg",{className:"toolbar--business--logo",width:"104",height:"30",viewBox:"0 0 104 30",role:"img","aria-labelledby":"home-logo"},o.a.createElement("title",{id:"home-logo"},"ASOS logo, back to the Home Page"),o.a.createElement("path",{fill:"#FFF",fillRule:"evenodd",d:"M71.83 21.983c-1.558 1.666-3.56 2.51-5.95 2.51-2.387 0-4.39-.844-5.947-2.51-1.488-1.587-2.343-4.124-2.343-6.96 0-2.766.864-5.27 2.37-6.867 1.572-1.667 3.565-2.516 5.92-2.523 2.36.007 4.35.856 5.924 2.523 1.506 1.598 2.37 4.1 2.37 6.867 0 2.836-.855 5.373-2.343 6.96zm-20.915-6.96c0 .128.005.255.008.38-2.39-2.166-5.845-2.974-7.957-3.394-3.907-.82-6.89-1.58-6.89-4.35 0-1.96 1.757-3.38 5.132-3.14 3.085.224 4.384 2.102 4.74 3.914.05.3.19.515.53.517l5.547.05c.026 0 .048-.003.072-.004-.783 1.816-1.182 3.84-1.182 6.015zM41.48 25.19c-2.683 0-5.64-.95-6.32-4.624-.06-.35-.225-.496-.495-.503l-5.364-.07v-9.446c.71 2.768 3.04 4.684 8.09 5.816 3.38.806 9.24 1.318 9.24 4.774 0 2.408-1.78 4.11-5.15 4.054zm-26.714-.69c-4.327 0-8.29-3.394-8.29-9.47 0-4.77 2.97-9.39 8.32-9.39 2.315 0 8.188.79 8.188 9.39 0 8.62-6.132 9.47-8.218 9.47zm65.922-11.792c1.232 1.636 3.453 2.848 7.063 3.657 3.38.805 9.25 1.318 9.25 4.775 0 2.403-1.78 4.11-5.15 4.05-2.68 0-5.64-.95-6.32-4.625-.052-.35-.22-.497-.49-.504L80.06 20c.523-1.54.79-3.21.79-4.974 0-.793-.056-1.566-.16-2.317zM91.474 30c5.95 0 12.965-2.208 12.416-9.366-.606-6.355-7.244-7.964-10.562-8.625-3.907-.82-6.892-1.58-6.892-4.35 0-1.96 1.758-3.38 5.134-3.14 3.084.224 4.384 2.102 4.74 3.914.05.3.19.515.53.517l5.546.048c.422.002.554-.216.5-.516C101.8 1.874 96.246 0 91.133 0 86.03 0 79.88 1.43 79.443 7.754c-.015.246-.02.486-.02.722-.814-1.683-1.985-3.23-3.495-4.597C73.142 1.37 69.666.03 65.878 0h-.127c-1.81 0-3.58.333-5.26.99a15.26 15.26 0 0 0-4.65 2.888c-1.43 1.295-2.56 2.747-3.36 4.327C51.27 1.822 45.81 0 40.77 0 36.084 0 30.517 1.208 29.3 6.305v-5.06a.49.49 0 0 0-.49-.488h-5.224c-.27 0-.49.22-.49.49V2.61c0 .23-.155.31-.343.175-1.858-1.34-4.607-2.782-7.915-2.782-1.86 0-3.635.326-5.277.968-1.64.65-3.2 1.63-4.64 2.92C3.29 5.37 2.05 7.05 1.23 8.9.417 10.742 0 12.807 0 15.027 0 17.1.367 19.043 1.088 20.8c.722 1.756 1.82 3.382 3.267 4.83 1.446 1.45 3.063 2.553 4.804 3.276 1.74.722 3.66 1.09 5.7 1.09 3.51 0 6.15-1.493 7.88-2.85.19-.144.342-.067.342.17v1.435c0 .27.22.49.49.49H28.8c.27 0 .49-.22.49-.49v-4.83C31.766 29.7 38.04 30 41.113 30c5.137 0 11.06-1.647 12.234-6.7.55.818 1.192 1.597 1.924 2.33 2.8 2.807 6.47 4.316 10.62 4.362h.17c1.97 0 3.87-.377 5.648-1.12a14.82 14.82 0 0 0 4.79-3.242 15.25 15.25 0 0 0 2.594-3.43c1.86 7.438 9.035 7.8 12.387 7.8z"}))),o.a.createElement("li",{className:"toolbar--busienss--item"},"WOMEN"),o.a.createElement("li",{className:"toolbar--busienss--item"},"MEN")),o.a.createElement("form",{className:"toolbar--search"},o.a.createElement("input",{className:"toolbar--search--input",type:"text",value:"search text"})),o.a.createElement("ul",{className:"toolbar--profile"},o.a.createElement("li",{className:"toolbar--profile--icons"},o.a.createElement("button",{className:"toolbar--profile--icons--icon",onClick:this.showMenu},o.a.createElement("i",{className:"fa fa-user",id:"account-dropdown-button"})),o.a.createElement("i",{className:"fa fa-heart","aria-hidden":"true"}),o.a.createElement("i",{className:"fa fa-shopping-bag","aria-hidden":"true"}),o.a.createElement("p",null,this.props.orderItems.length)),e))}}])&&Sn(n.prototype,r),a&&Sn(n,a),t}(),Pn=Ve(function(e){return{currentUser:e.session.currentUser,orders:e.entities.orders,orderItems:e.entities.orderItems}},function(e){return{logout:function(){return e(S())}}})(Cn),jn=function(){return o.a.createElement("section",{className:"category-bar"},o.a.createElement("ul",{className:"category-bar--options"},o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"New In")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Clothing")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Shoes")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Accessories")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Activewear")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Face + Body")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Brands")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--feature"},o.a.createElement("p",null,"Outlet"))),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Marketplace")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Inspiration"))))},Rn=Ve(function(e){return{currentUser:e.session.currentUser}},function(e){return{logout:function(){return e(S())}}})(function(){return o.a.createElement("section",{className:"nav-bar"},o.a.createElement(xn,null),o.a.createElement(Pn,null),o.a.createElement(jn,null))}),In=function(e){var t=e.product,n=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2});return o.a.createElement(Gt,{to:"/products/".concat(t.id)},o.a.createElement("li",{className:"listings--product"},o.a.createElement("img",{className:"listings--product-img",src:t.photoUrls[0],alt:""}),o.a.createElement("p",{className:"listings--product-title"},t.title),o.a.createElement("p",{className:"listings--product-price"},n.format(t.price))))};function An(e){return(An="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Un(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Mn(e,t){return!t||"object"!==An(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function zn(e){return(zn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Dn(e,t){return(Dn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Ln=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Mn(this,zn(t).apply(this,arguments))}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Dn(e,t)}(t,o.a.Component),n=t,(r=[{key:"componentDidMount",value:function(){this.props.requestProducts()}},{key:"render",value:function(){var e=this.props.products.map(function(e){return o.a.createElement(In,{key:e.id,product:e})});return o.a.createElement("section",{className:"listings"},o.a.createElement("section",{className:"listings--category-banner"},o.a.createElement("h2",{className:"listings--category-banner--text"},"breadcrumb last item")),o.a.createElement("section",{className:"listings--wrapper"},o.a.createElement("section",{className:"listings--filters-wrapper"},o.a.createElement("ul",{className:"listings--filters"},o.a.createElement("ul",{className:"listings--filter--item"},o.a.createElement("li",{className:"listings--filters--item--options"})))),o.a.createElement("section",{className:"listings--wrapper--grid-wrapper"},o.a.createElement("section",{className:"listings--count"},o.a.createElement("h3",null,"this is a style count holder")),o.a.createElement("ul",{className:"listings--products"},e),o.a.createElement("section",{className:"listings--viewed"},o.a.createElement("h3",null,"this is a viewed count holder")),o.a.createElement("section",{className:"listings--load-more"},o.a.createElement("h3",null,"load more")))))}}])&&Un(n.prototype,r),a&&Un(n,a),t}(),Fn=Ve(function(e){var t=e.entities;return{products:Object.values(t.products)}},function(e){return{requestProducts:function(){return e(O())}}})(Ln),Wn=function(e){for(var t=e.entities,n=Object.values(t.productItems),r={},o=0;o<n.length;o++){var a=n["".concat(o)].size;void 0===r["".concat(o)]&&(r["".concat(a)]=0),"Available"===n["".concat(o)].state&&(r["".concat(a)]+=1)}return r},Bn=function(e){var t=e.entities,n=Object.values(t.orderItems),r=0;if(n.length>0)for(var o=0;o<n.length;o++){r+=parseInt(n["".concat(o)].unitPrice)}return r};function $n(e){return($n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Vn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function qn(e){return(qn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Hn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Kn(e,t){return(Kn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Qn=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==$n(t)&&"function"!=typeof t?Hn(e):t}(this,qn(t).call(this,e))).state={productId:n.props.match.params.productId,size:""},n.handleSubmit=n.handleSubmit.bind(Hn(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Kn(e,t)}(t,o.a.Component),n=t,(r=[{key:"componentDidMount",value:function(){var e=this.props.match.params.productId;this.props.requestProduct(e)}},{key:"handleInput",value:function(e){var t=this;return function(n){var r,o,a;t.setState((r={},o=e,a=n.target.value,o in r?Object.defineProperty(r,o,{value:a,enumerable:!0,configurable:!0,writable:!0}):r[o]=a,r))}}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=function(e,t){var n=Object.values(e).filter(function(e){return e.size===t&&"Available"===e.state});return n.length>0?parseInt(n[0].id):void 0}(this.props.productItems,this.state.size),n={id:t,product_id:this.state.productId,size:this.state.size,state:"pending_order"},r={product_item_id:t,order_id:parseInt(this.props.orders.id)},o=this.props.currentUser;this.props.createOrderItem(o,r),this.props.updateProductItem(n)}},{key:"render",value:function(){console.log("rendering");var e=this.props.product;if(void 0===e)return null;var t=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}),n=this.props.selectedSizes.map(function(e){return e[1]>0?o.a.createElement("option",{key:e,className:"size--available"},e[0]):o.a.createElement("option",{key:e,className:"size--not-available",disabled:!0},e[0])}),r=o.a.createElement("section",{className:"product-show--photos-wrapper"},o.a.createElement("section",{className:"product-show--photos-aside-wrapper"},o.a.createElement("ul",{className:"product-show--aside--photos"},o.a.createElement("li",{className:"product-show--photos--item"},o.a.createElement("img",{className:"listings--product--show--img",src:e.photoUrls[0],alt:""})),o.a.createElement("li",{className:"product-show--photos--item"},o.a.createElement("img",{className:"listings--product--show--img",src:e.photoUrls[1],alt:""}))),o.a.createElement("img",{className:"product-show--photos--social"})),o.a.createElement("section",{className:"product-show--photo-carousel-wrapper"},o.a.createElement("img",{className:"product-show--photo-carousel--product-img",src:e.photoUrls[0],alt:""}),o.a.createElement("button",{className:"prev-btn"}),o.a.createElement("button",{className:"prev-btn"}))),a=o.a.createElement("section",{className:"product--show--cart-aside-wrapper"},o.a.createElement("section",{className:"product-show--cart-aside"},o.a.createElement("ul",{className:"product-show--cart-aside-items"},o.a.createElement("h3",{className:"product-show--cart-aside-items--title"},e.title),o.a.createElement("ul",{className:"product-show--cart-aside-items--price-wrapper"},o.a.createElement("li",{className:"product-show--cart-aside-items--price"},t.format(e.price)),o.a.createElement("p",{className:"product-show--cart-aside-items--shipping"},"Free Shipping & Returns")),o.a.createElement("ul",{className:"product-show--cart-aside-items--color-wrapper"},o.a.createElement("li",{className:"product-show--cart-aside-items--color-title"},"Color: "),o.a.createElement("li",{className:"product-show--cart-aside-items--color"},"Some color")),o.a.createElement("section",{className:"product-show--cart-aside--form"},o.a.createElement("label",{className:"product-show--cart-aside--form--sizing--label"},o.a.createElement("select",{className:"product-show--cart-aside--form--sizing",value:this.state.size,name:"size",onChange:this.handleInput("size")},o.a.createElement("option",{className:"dropdown-helper",selected:!0,disabled:!0},"Select a size"),n)),o.a.createElement("button",{className:"product-show--cart-aside--form--add-to-cart",onClick:this.handleSubmit},"ADD TO CART"))))),i=o.a.createElement("section",{className:"product-show--deatil-wrapper"},o.a.createElement("ul",{className:"product-show--deatil--items"},o.a.createElement("ul",{className:"product-show--detail--item"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"PRODUCT DETAILS"),o.a.createElement("p",{className:"product-show--detail--item--subtitle"},"Category by brand"),o.a.createElement("ul",{className:"product-show--detail--item--details"},o.a.createElement("li",{className:"product-show--detail--item--details--item"},"details here"))),o.a.createElement("ul",{className:"product-show--detail--item"},o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"PRODUCT CODE"),o.a.createElement("p",null,e.code),o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"BRAND"),o.a.createElement("p",null,"brand here")))),o.a.createElement("ul",{className:"product-show--detail--item"},o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"SIZE & FIT"),o.a.createElement("ul",{className:"product-show--detail--item--design-specs"},o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.model_size),o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.model_height))),o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"LOOK AFTER ME"),o.a.createElement("ul",{className:"product-show--detail--item--design-specs"},o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.care_instructions),o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.care_advice))),o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"ABOUT ME"),o.a.createElement("ul",{className:"product-show--detail--item--design-specs"},o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.fabric_stretch),o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.fabric_material),o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.main_fiber_content))))));return o.a.createElement("section",{className:"product-show"},o.a.createElement("section",{className:"product-show--wrapper"},r,a),o.a.createElement("section",{className:"product-show--detail-wrapper"},i))}}])&&Vn(n.prototype,r),a&&Vn(n,a),t}(),Gn=Ve(function(e,t){var n=t.match.params.productId;return{product:e.entities.products[n],currentUser:e.session.currentUser,orders:e.entities.orders,productItems:e.entities.productItems,selectedSizes:Object.entries(Wn(e))}},function(e){return{requestProduct:function(t){return e(T(t))},createOrderItem:function(t,n,r){return e(R(0,n))},updateProductItem:function(t){return e(z(t))}}})(Qn);function Yn(e){return(Yn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Zn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Xn(e){return(Xn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Jn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function er(e,t){return(er=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var tr=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Yn(t)&&"function"!=typeof t?Jn(e):t}(this,Xn(t).call(this,e))).state={orderId:n.props.match.params.orderId,subTotal:0,listings:[]},n.handleSubmit=n.handleSubmit.bind(Jn(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&er(e,t)}(t,o.a.Component),n=t,(r=[{key:"componentDidMount",value:function(){var e=parseInt(this.props.match.params.orderId);this.props.fetchOrder(e)}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=e.target.attributes.orderItemId.value,n=this.props.orderItems[t].product_item_id,r={id:n,product_id:[this.props.productItems[n].product_item_id].product_id,size:this.props.productItems[n].size,state:"Available"};this.props.deleteOrderItem(t,this.props.currentUser.id,this.state.orderId),this.props.updateProductItem(r)}},{key:"render",value:function(){var e,t=this,n=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2});this.props.orderListItems.length>0?e=this.props.orderListItems.map(function(e,r){return o.a.createElement("section",{className:"listing--item--wrapper",key:r},o.a.createElement("section",{className:"listing--item--photos"},o.a.createElement("img",{src:e.photosUrl,className:"listing--item--img"})),o.a.createElement("section",{className:"listing--details--wrapper"},o.a.createElement("ul",{className:"listing--details"},o.a.createElement("h3",{className:"listing--details--header"},n.format(e.price)),o.a.createElement("p",{className:"listing--details--brand"},e.brand),o.a.createElement("p",{className:"listing--title"},e.shortTitle),o.a.createElement("ul",{className:"listing--details--specs--wrapper"},o.a.createElement("li",{className:"listing--details--specs--color"},"Color"),o.a.createElement("li",{className:"listing--details--specs--size"},e.size),o.a.createElement("p",{className:"listing--details--specs--qty"},"Qty")))),o.a.createElement("button",{className:"listing--remove--btn",orderItemId:e.id,onClick:t.handleSubmit},"x"))}):o.a.createElement("div",null);var r=o.a.createElement("section",{className:"order--container"},o.a.createElement("ul",{className:"order--wrapper"},o.a.createElement("ul",{className:"order--main"},o.a.createElement("section",{className:"order--listings--wrapper"},o.a.createElement("h3",{className:"order--listings--header"},"My Cart"),o.a.createElement("ul",{className:"order--listings"},e),o.a.createElement("ul",{className:"order--listings--subtotal"},o.a.createElement("h3",{className:"order--listings--subtotal--title"},"SUB-TOTAL"),o.a.createElement("h3",{className:"order--listings--subtotal--price"},n.format(this.props.subTotal)))),o.a.createElement("ul",{className:"order--delivery--wrapper"})),o.a.createElement("section",{className:"order--aside"})));return o.a.createElement("div",{className:"order"},r)}}])&&Zn(n.prototype,r),a&&Zn(n,a),t}(),nr=Ve(function(e,t){var n,r,o,a,i,u=t.match.params.orderId;return{orders:e.entities.orders[u],currentUser:e.session.currentUser,products:e.entities.products,productItems:e.entities.productItems,orderItems:e.entities.orderItems,orderListItems:(n=e.entities.orderItems,r=e.entities.products,o=e.entities.productItems,a=Object.entries(n),i=[],a.length>0&&(i=a.map(function(e){return{id:e[1].id,price:e[1].unitPrice,brand:"some",color:"some",size:o[e[1].product_item_id].size,shortTitle:r[o[e[1].product_item_id].product_id].title,photosUrl:r[o[e[1].product_item_id].product_id].photoUrls[0]}})),i),subTotal:Bn(e)}},function(e){return{fetchOrder:function(t){return e(P(t))},deleteOrderItem:function(t){return e(I(t))},updateProductItem:function(t){return e(z(t))}}})(tr),rr=function(e){return o.a.createElement("div",{id:"main"},o.a.createElement(Ft,{path:"/",component:Rn}),o.a.createElement(Ht,null,o.a.createElement(Ft,{exact:!0,path:"/",component:_n}),o.a.createElement(Ft,{exact:!0,path:"/products",component:Fn}),o.a.createElement(Ft,{exact:!0,path:"/products/:productId",component:Gn}),o.a.createElement(Ft,{exact:!0,path:"/orders/:orderId",component:nr}),o.a.createElement(Ft,{render:function(){return o.a.createElement(Ut,{to:{pathname:"/"}})}})),o.a.createElement(Ft,{path:"/",component:vn}))},or=function(){return o.a.createElement("div",{id:"app"},o.a.createElement(Ht,null,o.a.createElement(Zt,{exact:!0,path:"/login",component:on}),o.a.createElement(Zt,{exact:!0,path:"/signup",component:pn}),o.a.createElement(Ft,{path:"/",component:rr})))},ar=function(e){var t=e.store;return o.a.createElement(re,{store:t},o.a.createElement(Qt,null,o.a.createElement(or,null)))};document.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("root"),t=void 0;window.currentUser&&(t={session:{currentUser:window.currentUser}});var n=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return f(q,e,b(H,w.a))}(t);window.store=n,i.a.render(o.a.createElement(ar,{store:n}),e),window.getState=n.getState})}]);
;
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//






;