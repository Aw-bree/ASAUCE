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
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=125)}([function(e,t,n){"use strict";e.exports=n(45)},function(e,t,n){e.exports=n(117)()},function(e,t,n){(function(e,r){var o;
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */(function(){var a,i=200,u="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",l="Expected a function",c="__lodash_hash_undefined__",s=500,f="__lodash_placeholder__",p=1,d=2,m=4,h=1,v=2,y=1,g=2,b=4,_=8,E=16,w=32,x=64,S=128,k=256,N=512,T=30,O="...",C=800,P=16,j=1,R=2,I=1/0,A=9007199254740991,U=1.7976931348623157e308,D=NaN,M=4294967295,z=M-1,L=M>>>1,F=[["ary",S],["bind",y],["bindKey",g],["curry",_],["curryRight",E],["flip",N],["partial",w],["partialRight",x],["rearg",k]],W="[object Arguments]",$="[object Array]",B="[object AsyncFunction]",V="[object Boolean]",q="[object Date]",H="[object DOMException]",K="[object Error]",G="[object Function]",Q="[object GeneratorFunction]",Y="[object Map]",Z="[object Number]",X="[object Null]",J="[object Object]",ee="[object Proxy]",te="[object RegExp]",ne="[object Set]",re="[object String]",oe="[object Symbol]",ae="[object Undefined]",ie="[object WeakMap]",ue="[object WeakSet]",le="[object ArrayBuffer]",ce="[object DataView]",se="[object Float32Array]",fe="[object Float64Array]",pe="[object Int8Array]",de="[object Int16Array]",me="[object Int32Array]",he="[object Uint8Array]",ve="[object Uint8ClampedArray]",ye="[object Uint16Array]",ge="[object Uint32Array]",be=/\b__p \+= '';/g,_e=/\b(__p \+=) '' \+/g,Ee=/(__e\(.*?\)|\b__t\)) \+\n'';/g,we=/&(?:amp|lt|gt|quot|#39);/g,xe=/[&<>"']/g,Se=RegExp(we.source),ke=RegExp(xe.source),Ne=/<%-([\s\S]+?)%>/g,Te=/<%([\s\S]+?)%>/g,Oe=/<%=([\s\S]+?)%>/g,Ce=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Pe=/^\w*$/,je=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Re=/[\\^$.*+?()[\]{}|]/g,Ie=RegExp(Re.source),Ae=/^\s+|\s+$/g,Ue=/^\s+/,De=/\s+$/,Me=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ze=/\{\n\/\* \[wrapped with (.+)\] \*/,Le=/,? & /,Fe=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,We=/\\(\\)?/g,$e=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Be=/\w*$/,Ve=/^[-+]0x[0-9a-f]+$/i,qe=/^0b[01]+$/i,He=/^\[object .+?Constructor\]$/,Ke=/^0o[0-7]+$/i,Ge=/^(?:0|[1-9]\d*)$/,Qe=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Ye=/($^)/,Ze=/['\n\r\u2028\u2029\\]/g,Xe="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",Je="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",et="[\\ud800-\\udfff]",tt="["+Je+"]",nt="["+Xe+"]",rt="\\d+",ot="[\\u2700-\\u27bf]",at="[a-z\\xdf-\\xf6\\xf8-\\xff]",it="[^\\ud800-\\udfff"+Je+rt+"\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",ut="\\ud83c[\\udffb-\\udfff]",lt="[^\\ud800-\\udfff]",ct="(?:\\ud83c[\\udde6-\\uddff]){2}",st="[\\ud800-\\udbff][\\udc00-\\udfff]",ft="[A-Z\\xc0-\\xd6\\xd8-\\xde]",pt="(?:"+at+"|"+it+")",dt="(?:"+ft+"|"+it+")",mt="(?:"+nt+"|"+ut+")"+"?",ht="[\\ufe0e\\ufe0f]?"+mt+("(?:\\u200d(?:"+[lt,ct,st].join("|")+")[\\ufe0e\\ufe0f]?"+mt+")*"),vt="(?:"+[ot,ct,st].join("|")+")"+ht,yt="(?:"+[lt+nt+"?",nt,ct,st,et].join("|")+")",gt=RegExp("['’]","g"),bt=RegExp(nt,"g"),_t=RegExp(ut+"(?="+ut+")|"+yt+ht,"g"),Et=RegExp([ft+"?"+at+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[tt,ft,"$"].join("|")+")",dt+"+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[tt,ft+pt,"$"].join("|")+")",ft+"?"+pt+"+(?:['’](?:d|ll|m|re|s|t|ve))?",ft+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",rt,vt].join("|"),"g"),wt=RegExp("[\\u200d\\ud800-\\udfff"+Xe+"\\ufe0e\\ufe0f]"),xt=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,St=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],kt=-1,Nt={};Nt[se]=Nt[fe]=Nt[pe]=Nt[de]=Nt[me]=Nt[he]=Nt[ve]=Nt[ye]=Nt[ge]=!0,Nt[W]=Nt[$]=Nt[le]=Nt[V]=Nt[ce]=Nt[q]=Nt[K]=Nt[G]=Nt[Y]=Nt[Z]=Nt[J]=Nt[te]=Nt[ne]=Nt[re]=Nt[ie]=!1;var Tt={};Tt[W]=Tt[$]=Tt[le]=Tt[ce]=Tt[V]=Tt[q]=Tt[se]=Tt[fe]=Tt[pe]=Tt[de]=Tt[me]=Tt[Y]=Tt[Z]=Tt[J]=Tt[te]=Tt[ne]=Tt[re]=Tt[oe]=Tt[he]=Tt[ve]=Tt[ye]=Tt[ge]=!0,Tt[K]=Tt[G]=Tt[ie]=!1;var Ot={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Ct=parseFloat,Pt=parseInt,jt="object"==typeof e&&e&&e.Object===Object&&e,Rt="object"==typeof self&&self&&self.Object===Object&&self,It=jt||Rt||Function("return this")(),At=t&&!t.nodeType&&t,Ut=At&&"object"==typeof r&&r&&!r.nodeType&&r,Dt=Ut&&Ut.exports===At,Mt=Dt&&jt.process,zt=function(){try{var e=Ut&&Ut.require&&Ut.require("util").types;return e||Mt&&Mt.binding&&Mt.binding("util")}catch(e){}}(),Lt=zt&&zt.isArrayBuffer,Ft=zt&&zt.isDate,Wt=zt&&zt.isMap,$t=zt&&zt.isRegExp,Bt=zt&&zt.isSet,Vt=zt&&zt.isTypedArray;function qt(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function Ht(e,t,n,r){for(var o=-1,a=null==e?0:e.length;++o<a;){var i=e[o];t(r,i,n(i),e)}return r}function Kt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&!1!==t(e[n],n,e););return e}function Gt(e,t){for(var n=null==e?0:e.length;n--&&!1!==t(e[n],n,e););return e}function Qt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(!t(e[n],n,e))return!1;return!0}function Yt(e,t){for(var n=-1,r=null==e?0:e.length,o=0,a=[];++n<r;){var i=e[n];t(i,n,e)&&(a[o++]=i)}return a}function Zt(e,t){return!!(null==e?0:e.length)&&ln(e,t,0)>-1}function Xt(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0;return!1}function Jt(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}function en(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}function tn(e,t,n,r){var o=-1,a=null==e?0:e.length;for(r&&a&&(n=e[++o]);++o<a;)n=t(n,e[o],o,e);return n}function nn(e,t,n,r){var o=null==e?0:e.length;for(r&&o&&(n=e[--o]);o--;)n=t(n,e[o],o,e);return n}function rn(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}var on=pn("length");function an(e,t,n){var r;return n(e,function(e,n,o){if(t(e,n,o))return r=n,!1}),r}function un(e,t,n,r){for(var o=e.length,a=n+(r?1:-1);r?a--:++a<o;)if(t(e[a],a,e))return a;return-1}function ln(e,t,n){return t==t?function(e,t,n){var r=n-1,o=e.length;for(;++r<o;)if(e[r]===t)return r;return-1}(e,t,n):un(e,sn,n)}function cn(e,t,n,r){for(var o=n-1,a=e.length;++o<a;)if(r(e[o],t))return o;return-1}function sn(e){return e!=e}function fn(e,t){var n=null==e?0:e.length;return n?hn(e,t)/n:D}function pn(e){return function(t){return null==t?a:t[e]}}function dn(e){return function(t){return null==e?a:e[t]}}function mn(e,t,n,r,o){return o(e,function(e,o,a){n=r?(r=!1,e):t(n,e,o,a)}),n}function hn(e,t){for(var n,r=-1,o=e.length;++r<o;){var i=t(e[r]);i!==a&&(n=n===a?i:n+i)}return n}function vn(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}function yn(e){return function(t){return e(t)}}function gn(e,t){return Jt(t,function(t){return e[t]})}function bn(e,t){return e.has(t)}function _n(e,t){for(var n=-1,r=e.length;++n<r&&ln(t,e[n],0)>-1;);return n}function En(e,t){for(var n=e.length;n--&&ln(t,e[n],0)>-1;);return n}var wn=dn({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),xn=dn({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function Sn(e){return"\\"+Ot[e]}function kn(e){return wt.test(e)}function Nn(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function Tn(e,t){return function(n){return e(t(n))}}function On(e,t){for(var n=-1,r=e.length,o=0,a=[];++n<r;){var i=e[n];i!==t&&i!==f||(e[n]=f,a[o++]=n)}return a}function Cn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function Pn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=[e,e]}),n}function jn(e){return kn(e)?function(e){var t=_t.lastIndex=0;for(;_t.test(e);)++t;return t}(e):on(e)}function Rn(e){return kn(e)?function(e){return e.match(_t)||[]}(e):function(e){return e.split("")}(e)}var In=dn({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});var An=function e(t){var n,r=(t=null==t?It:An.defaults(It.Object(),t,An.pick(It,St))).Array,o=t.Date,Xe=t.Error,Je=t.Function,et=t.Math,tt=t.Object,nt=t.RegExp,rt=t.String,ot=t.TypeError,at=r.prototype,it=Je.prototype,ut=tt.prototype,lt=t["__core-js_shared__"],ct=it.toString,st=ut.hasOwnProperty,ft=0,pt=(n=/[^.]+$/.exec(lt&&lt.keys&&lt.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"",dt=ut.toString,mt=ct.call(tt),ht=It._,vt=nt("^"+ct.call(st).replace(Re,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),yt=Dt?t.Buffer:a,_t=t.Symbol,wt=t.Uint8Array,Ot=yt?yt.allocUnsafe:a,jt=Tn(tt.getPrototypeOf,tt),Rt=tt.create,At=ut.propertyIsEnumerable,Ut=at.splice,Mt=_t?_t.isConcatSpreadable:a,zt=_t?_t.iterator:a,on=_t?_t.toStringTag:a,dn=function(){try{var e=La(tt,"defineProperty");return e({},"",{}),e}catch(e){}}(),Un=t.clearTimeout!==It.clearTimeout&&t.clearTimeout,Dn=o&&o.now!==It.Date.now&&o.now,Mn=t.setTimeout!==It.setTimeout&&t.setTimeout,zn=et.ceil,Ln=et.floor,Fn=tt.getOwnPropertySymbols,Wn=yt?yt.isBuffer:a,$n=t.isFinite,Bn=at.join,Vn=Tn(tt.keys,tt),qn=et.max,Hn=et.min,Kn=o.now,Gn=t.parseInt,Qn=et.random,Yn=at.reverse,Zn=La(t,"DataView"),Xn=La(t,"Map"),Jn=La(t,"Promise"),er=La(t,"Set"),tr=La(t,"WeakMap"),nr=La(tt,"create"),rr=tr&&new tr,or={},ar=fi(Zn),ir=fi(Xn),ur=fi(Jn),lr=fi(er),cr=fi(tr),sr=_t?_t.prototype:a,fr=sr?sr.valueOf:a,pr=sr?sr.toString:a;function dr(e){if(Ou(e)&&!yu(e)&&!(e instanceof yr)){if(e instanceof vr)return e;if(st.call(e,"__wrapped__"))return pi(e)}return new vr(e)}var mr=function(){function e(){}return function(t){if(!Tu(t))return{};if(Rt)return Rt(t);e.prototype=t;var n=new e;return e.prototype=a,n}}();function hr(){}function vr(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=a}function yr(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=M,this.__views__=[]}function gr(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function br(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function _r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Er(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new _r;++t<n;)this.add(e[t])}function wr(e){var t=this.__data__=new br(e);this.size=t.size}function xr(e,t){var n=yu(e),r=!n&&vu(e),o=!n&&!r&&Eu(e),a=!n&&!r&&!o&&Du(e),i=n||r||o||a,u=i?vn(e.length,rt):[],l=u.length;for(var c in e)!t&&!st.call(e,c)||i&&("length"==c||o&&("offset"==c||"parent"==c)||a&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||Ha(c,l))||u.push(c);return u}function Sr(e){var t=e.length;return t?e[wo(0,t-1)]:a}function kr(e,t){return li(ra(e),Ar(t,0,e.length))}function Nr(e){return li(ra(e))}function Tr(e,t,n){(n===a||du(e[t],n))&&(n!==a||t in e)||Rr(e,t,n)}function Or(e,t,n){var r=e[t];st.call(e,t)&&du(r,n)&&(n!==a||t in e)||Rr(e,t,n)}function Cr(e,t){for(var n=e.length;n--;)if(du(e[n][0],t))return n;return-1}function Pr(e,t,n,r){return Lr(e,function(e,o,a){t(r,e,n(e),a)}),r}function jr(e,t){return e&&oa(t,ol(t),e)}function Rr(e,t,n){"__proto__"==t&&dn?dn(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}function Ir(e,t){for(var n=-1,o=t.length,i=r(o),u=null==e;++n<o;)i[n]=u?a:Ju(e,t[n]);return i}function Ar(e,t,n){return e==e&&(n!==a&&(e=e<=n?e:n),t!==a&&(e=e>=t?e:t)),e}function Ur(e,t,n,r,o,i){var u,l=t&p,c=t&d,s=t&m;if(n&&(u=o?n(e,r,o,i):n(e)),u!==a)return u;if(!Tu(e))return e;var f=yu(e);if(f){if(u=function(e){var t=e.length,n=new e.constructor(t);return t&&"string"==typeof e[0]&&st.call(e,"index")&&(n.index=e.index,n.input=e.input),n}(e),!l)return ra(e,u)}else{var h=$a(e),v=h==G||h==Q;if(Eu(e))return Zo(e,l);if(h==J||h==W||v&&!o){if(u=c||v?{}:Va(e),!l)return c?function(e,t){return oa(e,Wa(e),t)}(e,function(e,t){return e&&oa(t,al(t),e)}(u,e)):function(e,t){return oa(e,Fa(e),t)}(e,jr(u,e))}else{if(!Tt[h])return o?e:{};u=function(e,t,n){var r,o,a,i=e.constructor;switch(t){case le:return Xo(e);case V:case q:return new i(+e);case ce:return function(e,t){var n=t?Xo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}(e,n);case se:case fe:case pe:case de:case me:case he:case ve:case ye:case ge:return Jo(e,n);case Y:return new i;case Z:case re:return new i(e);case te:return(a=new(o=e).constructor(o.source,Be.exec(o))).lastIndex=o.lastIndex,a;case ne:return new i;case oe:return r=e,fr?tt(fr.call(r)):{}}}(e,h,l)}}i||(i=new wr);var y=i.get(e);if(y)return y;if(i.set(e,u),Iu(e))return e.forEach(function(r){u.add(Ur(r,t,n,r,e,i))}),u;if(Cu(e))return e.forEach(function(r,o){u.set(o,Ur(r,t,n,o,e,i))}),u;var g=f?a:(s?c?Ra:ja:c?al:ol)(e);return Kt(g||e,function(r,o){g&&(r=e[o=r]),Or(u,o,Ur(r,t,n,o,e,i))}),u}function Dr(e,t,n){var r=n.length;if(null==e)return!r;for(e=tt(e);r--;){var o=n[r],i=t[o],u=e[o];if(u===a&&!(o in e)||!i(u))return!1}return!0}function Mr(e,t,n){if("function"!=typeof e)throw new ot(l);return oi(function(){e.apply(a,n)},t)}function zr(e,t,n,r){var o=-1,a=Zt,u=!0,l=e.length,c=[],s=t.length;if(!l)return c;n&&(t=Jt(t,yn(n))),r?(a=Xt,u=!1):t.length>=i&&(a=bn,u=!1,t=new Er(t));e:for(;++o<l;){var f=e[o],p=null==n?f:n(f);if(f=r||0!==f?f:0,u&&p==p){for(var d=s;d--;)if(t[d]===p)continue e;c.push(f)}else a(t,p,r)||c.push(f)}return c}dr.templateSettings={escape:Ne,evaluate:Te,interpolate:Oe,variable:"",imports:{_:dr}},dr.prototype=hr.prototype,dr.prototype.constructor=dr,vr.prototype=mr(hr.prototype),vr.prototype.constructor=vr,yr.prototype=mr(hr.prototype),yr.prototype.constructor=yr,gr.prototype.clear=function(){this.__data__=nr?nr(null):{},this.size=0},gr.prototype.delete=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},gr.prototype.get=function(e){var t=this.__data__;if(nr){var n=t[e];return n===c?a:n}return st.call(t,e)?t[e]:a},gr.prototype.has=function(e){var t=this.__data__;return nr?t[e]!==a:st.call(t,e)},gr.prototype.set=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=nr&&t===a?c:t,this},br.prototype.clear=function(){this.__data__=[],this.size=0},br.prototype.delete=function(e){var t=this.__data__,n=Cr(t,e);return!(n<0||(n==t.length-1?t.pop():Ut.call(t,n,1),--this.size,0))},br.prototype.get=function(e){var t=this.__data__,n=Cr(t,e);return n<0?a:t[n][1]},br.prototype.has=function(e){return Cr(this.__data__,e)>-1},br.prototype.set=function(e,t){var n=this.__data__,r=Cr(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this},_r.prototype.clear=function(){this.size=0,this.__data__={hash:new gr,map:new(Xn||br),string:new gr}},_r.prototype.delete=function(e){var t=Ma(this,e).delete(e);return this.size-=t?1:0,t},_r.prototype.get=function(e){return Ma(this,e).get(e)},_r.prototype.has=function(e){return Ma(this,e).has(e)},_r.prototype.set=function(e,t){var n=Ma(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this},Er.prototype.add=Er.prototype.push=function(e){return this.__data__.set(e,c),this},Er.prototype.has=function(e){return this.__data__.has(e)},wr.prototype.clear=function(){this.__data__=new br,this.size=0},wr.prototype.delete=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n},wr.prototype.get=function(e){return this.__data__.get(e)},wr.prototype.has=function(e){return this.__data__.has(e)},wr.prototype.set=function(e,t){var n=this.__data__;if(n instanceof br){var r=n.__data__;if(!Xn||r.length<i-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new _r(r)}return n.set(e,t),this.size=n.size,this};var Lr=ua(Kr),Fr=ua(Gr,!0);function Wr(e,t){var n=!0;return Lr(e,function(e,r,o){return n=!!t(e,r,o)}),n}function $r(e,t,n){for(var r=-1,o=e.length;++r<o;){var i=e[r],u=t(i);if(null!=u&&(l===a?u==u&&!Uu(u):n(u,l)))var l=u,c=i}return c}function Br(e,t){var n=[];return Lr(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}function Vr(e,t,n,r,o){var a=-1,i=e.length;for(n||(n=qa),o||(o=[]);++a<i;){var u=e[a];t>0&&n(u)?t>1?Vr(u,t-1,n,r,o):en(o,u):r||(o[o.length]=u)}return o}var qr=la(),Hr=la(!0);function Kr(e,t){return e&&qr(e,t,ol)}function Gr(e,t){return e&&Hr(e,t,ol)}function Qr(e,t){return Yt(t,function(t){return Su(e[t])})}function Yr(e,t){for(var n=0,r=(t=Ko(t,e)).length;null!=e&&n<r;)e=e[si(t[n++])];return n&&n==r?e:a}function Zr(e,t,n){var r=t(e);return yu(e)?r:en(r,n(e))}function Xr(e){return null==e?e===a?ae:X:on&&on in tt(e)?function(e){var t=st.call(e,on),n=e[on];try{e[on]=a;var r=!0}catch(e){}var o=dt.call(e);return r&&(t?e[on]=n:delete e[on]),o}(e):function(e){return dt.call(e)}(e)}function Jr(e,t){return e>t}function eo(e,t){return null!=e&&st.call(e,t)}function to(e,t){return null!=e&&t in tt(e)}function no(e,t,n){for(var o=n?Xt:Zt,i=e[0].length,u=e.length,l=u,c=r(u),s=1/0,f=[];l--;){var p=e[l];l&&t&&(p=Jt(p,yn(t))),s=Hn(p.length,s),c[l]=!n&&(t||i>=120&&p.length>=120)?new Er(l&&p):a}p=e[0];var d=-1,m=c[0];e:for(;++d<i&&f.length<s;){var h=p[d],v=t?t(h):h;if(h=n||0!==h?h:0,!(m?bn(m,v):o(f,v,n))){for(l=u;--l;){var y=c[l];if(!(y?bn(y,v):o(e[l],v,n)))continue e}m&&m.push(v),f.push(h)}}return f}function ro(e,t,n){var r=null==(e=ti(e,t=Ko(t,e)))?e:e[si(xi(t))];return null==r?a:qt(r,e,n)}function oo(e){return Ou(e)&&Xr(e)==W}function ao(e,t,n,r,o){return e===t||(null==e||null==t||!Ou(e)&&!Ou(t)?e!=e&&t!=t:function(e,t,n,r,o,i){var u=yu(e),l=yu(t),c=u?$:$a(e),s=l?$:$a(t),f=(c=c==W?J:c)==J,p=(s=s==W?J:s)==J,d=c==s;if(d&&Eu(e)){if(!Eu(t))return!1;u=!0,f=!1}if(d&&!f)return i||(i=new wr),u||Du(e)?Ca(e,t,n,r,o,i):function(e,t,n,r,o,a,i){switch(n){case ce:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case le:return!(e.byteLength!=t.byteLength||!a(new wt(e),new wt(t)));case V:case q:case Z:return du(+e,+t);case K:return e.name==t.name&&e.message==t.message;case te:case re:return e==t+"";case Y:var u=Nn;case ne:var l=r&h;if(u||(u=Cn),e.size!=t.size&&!l)return!1;var c=i.get(e);if(c)return c==t;r|=v,i.set(e,t);var s=Ca(u(e),u(t),r,o,a,i);return i.delete(e),s;case oe:if(fr)return fr.call(e)==fr.call(t)}return!1}(e,t,c,n,r,o,i);if(!(n&h)){var m=f&&st.call(e,"__wrapped__"),y=p&&st.call(t,"__wrapped__");if(m||y){var g=m?e.value():e,b=y?t.value():t;return i||(i=new wr),o(g,b,n,r,i)}}return!!d&&(i||(i=new wr),function(e,t,n,r,o,i){var u=n&h,l=ja(e),c=l.length,s=ja(t).length;if(c!=s&&!u)return!1;for(var f=c;f--;){var p=l[f];if(!(u?p in t:st.call(t,p)))return!1}var d=i.get(e);if(d&&i.get(t))return d==t;var m=!0;i.set(e,t),i.set(t,e);for(var v=u;++f<c;){p=l[f];var y=e[p],g=t[p];if(r)var b=u?r(g,y,p,t,e,i):r(y,g,p,e,t,i);if(!(b===a?y===g||o(y,g,n,r,i):b)){m=!1;break}v||(v="constructor"==p)}if(m&&!v){var _=e.constructor,E=t.constructor;_!=E&&"constructor"in e&&"constructor"in t&&!("function"==typeof _&&_ instanceof _&&"function"==typeof E&&E instanceof E)&&(m=!1)}return i.delete(e),i.delete(t),m}(e,t,n,r,o,i))}(e,t,n,r,ao,o))}function io(e,t,n,r){var o=n.length,i=o,u=!r;if(null==e)return!i;for(e=tt(e);o--;){var l=n[o];if(u&&l[2]?l[1]!==e[l[0]]:!(l[0]in e))return!1}for(;++o<i;){var c=(l=n[o])[0],s=e[c],f=l[1];if(u&&l[2]){if(s===a&&!(c in e))return!1}else{var p=new wr;if(r)var d=r(s,f,c,e,t,p);if(!(d===a?ao(f,s,h|v,r,p):d))return!1}}return!0}function uo(e){return!(!Tu(e)||(t=e,pt&&pt in t))&&(Su(e)?vt:He).test(fi(e));var t}function lo(e){return"function"==typeof e?e:null==e?Pl:"object"==typeof e?yu(e)?ho(e[0],e[1]):mo(e):Ll(e)}function co(e){if(!Za(e))return Vn(e);var t=[];for(var n in tt(e))st.call(e,n)&&"constructor"!=n&&t.push(n);return t}function so(e){if(!Tu(e))return function(e){var t=[];if(null!=e)for(var n in tt(e))t.push(n);return t}(e);var t=Za(e),n=[];for(var r in e)("constructor"!=r||!t&&st.call(e,r))&&n.push(r);return n}function fo(e,t){return e<t}function po(e,t){var n=-1,o=bu(e)?r(e.length):[];return Lr(e,function(e,r,a){o[++n]=t(e,r,a)}),o}function mo(e){var t=za(e);return 1==t.length&&t[0][2]?Ja(t[0][0],t[0][1]):function(n){return n===e||io(n,e,t)}}function ho(e,t){return Ga(e)&&Xa(t)?Ja(si(e),t):function(n){var r=Ju(n,e);return r===a&&r===t?el(n,e):ao(t,r,h|v)}}function vo(e,t,n,r,o){e!==t&&qr(t,function(i,u){if(Tu(i))o||(o=new wr),function(e,t,n,r,o,i,u){var l=ni(e,n),c=ni(t,n),s=u.get(c);if(s)Tr(e,n,s);else{var f=i?i(l,c,n+"",e,t,u):a,p=f===a;if(p){var d=yu(c),m=!d&&Eu(c),h=!d&&!m&&Du(c);f=c,d||m||h?yu(l)?f=l:_u(l)?f=ra(l):m?(p=!1,f=Zo(c,!0)):h?(p=!1,f=Jo(c,!0)):f=[]:ju(c)||vu(c)?(f=l,vu(l)?f=Vu(l):Tu(l)&&!Su(l)||(f=Va(c))):p=!1}p&&(u.set(c,f),o(f,c,r,i,u),u.delete(c)),Tr(e,n,f)}}(e,t,u,n,vo,r,o);else{var l=r?r(ni(e,u),i,u+"",e,t,o):a;l===a&&(l=i),Tr(e,u,l)}},al)}function yo(e,t){var n=e.length;if(n)return Ha(t+=t<0?n:0,n)?e[t]:a}function go(e,t,n){var r=-1;return t=Jt(t.length?t:[Pl],yn(Da())),function(e,t){var n=e.length;for(e.sort(t);n--;)e[n]=e[n].value;return e}(po(e,function(e,n,o){return{criteria:Jt(t,function(t){return t(e)}),index:++r,value:e}}),function(e,t){return function(e,t,n){for(var r=-1,o=e.criteria,a=t.criteria,i=o.length,u=n.length;++r<i;){var l=ea(o[r],a[r]);if(l){if(r>=u)return l;var c=n[r];return l*("desc"==c?-1:1)}}return e.index-t.index}(e,t,n)})}function bo(e,t,n){for(var r=-1,o=t.length,a={};++r<o;){var i=t[r],u=Yr(e,i);n(u,i)&&To(a,Ko(i,e),u)}return a}function _o(e,t,n,r){var o=r?cn:ln,a=-1,i=t.length,u=e;for(e===t&&(t=ra(t)),n&&(u=Jt(e,yn(n)));++a<i;)for(var l=0,c=t[a],s=n?n(c):c;(l=o(u,s,l,r))>-1;)u!==e&&Ut.call(u,l,1),Ut.call(e,l,1);return e}function Eo(e,t){for(var n=e?t.length:0,r=n-1;n--;){var o=t[n];if(n==r||o!==a){var a=o;Ha(o)?Ut.call(e,o,1):Lo(e,o)}}return e}function wo(e,t){return e+Ln(Qn()*(t-e+1))}function xo(e,t){var n="";if(!e||t<1||t>A)return n;do{t%2&&(n+=e),(t=Ln(t/2))&&(e+=e)}while(t);return n}function So(e,t){return ai(ei(e,t,Pl),e+"")}function ko(e){return Sr(dl(e))}function No(e,t){var n=dl(e);return li(n,Ar(t,0,n.length))}function To(e,t,n,r){if(!Tu(e))return e;for(var o=-1,i=(t=Ko(t,e)).length,u=i-1,l=e;null!=l&&++o<i;){var c=si(t[o]),s=n;if(o!=u){var f=l[c];(s=r?r(f,c,l):a)===a&&(s=Tu(f)?f:Ha(t[o+1])?[]:{})}Or(l,c,s),l=l[c]}return e}var Oo=rr?function(e,t){return rr.set(e,t),e}:Pl,Co=dn?function(e,t){return dn(e,"toString",{configurable:!0,enumerable:!1,value:Tl(t),writable:!0})}:Pl;function Po(e){return li(dl(e))}function jo(e,t,n){var o=-1,a=e.length;t<0&&(t=-t>a?0:a+t),(n=n>a?a:n)<0&&(n+=a),a=t>n?0:n-t>>>0,t>>>=0;for(var i=r(a);++o<a;)i[o]=e[o+t];return i}function Ro(e,t){var n;return Lr(e,function(e,r,o){return!(n=t(e,r,o))}),!!n}function Io(e,t,n){var r=0,o=null==e?r:e.length;if("number"==typeof t&&t==t&&o<=L){for(;r<o;){var a=r+o>>>1,i=e[a];null!==i&&!Uu(i)&&(n?i<=t:i<t)?r=a+1:o=a}return o}return Ao(e,t,Pl,n)}function Ao(e,t,n,r){t=n(t);for(var o=0,i=null==e?0:e.length,u=t!=t,l=null===t,c=Uu(t),s=t===a;o<i;){var f=Ln((o+i)/2),p=n(e[f]),d=p!==a,m=null===p,h=p==p,v=Uu(p);if(u)var y=r||h;else y=s?h&&(r||d):l?h&&d&&(r||!m):c?h&&d&&!m&&(r||!v):!m&&!v&&(r?p<=t:p<t);y?o=f+1:i=f}return Hn(i,z)}function Uo(e,t){for(var n=-1,r=e.length,o=0,a=[];++n<r;){var i=e[n],u=t?t(i):i;if(!n||!du(u,l)){var l=u;a[o++]=0===i?0:i}}return a}function Do(e){return"number"==typeof e?e:Uu(e)?D:+e}function Mo(e){if("string"==typeof e)return e;if(yu(e))return Jt(e,Mo)+"";if(Uu(e))return pr?pr.call(e):"";var t=e+"";return"0"==t&&1/e==-I?"-0":t}function zo(e,t,n){var r=-1,o=Zt,a=e.length,u=!0,l=[],c=l;if(n)u=!1,o=Xt;else if(a>=i){var s=t?null:xa(e);if(s)return Cn(s);u=!1,o=bn,c=new Er}else c=t?[]:l;e:for(;++r<a;){var f=e[r],p=t?t(f):f;if(f=n||0!==f?f:0,u&&p==p){for(var d=c.length;d--;)if(c[d]===p)continue e;t&&c.push(p),l.push(f)}else o(c,p,n)||(c!==l&&c.push(p),l.push(f))}return l}function Lo(e,t){return null==(e=ti(e,t=Ko(t,e)))||delete e[si(xi(t))]}function Fo(e,t,n,r){return To(e,t,n(Yr(e,t)),r)}function Wo(e,t,n,r){for(var o=e.length,a=r?o:-1;(r?a--:++a<o)&&t(e[a],a,e););return n?jo(e,r?0:a,r?a+1:o):jo(e,r?a+1:0,r?o:a)}function $o(e,t){var n=e;return n instanceof yr&&(n=n.value()),tn(t,function(e,t){return t.func.apply(t.thisArg,en([e],t.args))},n)}function Bo(e,t,n){var o=e.length;if(o<2)return o?zo(e[0]):[];for(var a=-1,i=r(o);++a<o;)for(var u=e[a],l=-1;++l<o;)l!=a&&(i[a]=zr(i[a]||u,e[l],t,n));return zo(Vr(i,1),t,n)}function Vo(e,t,n){for(var r=-1,o=e.length,i=t.length,u={};++r<o;){var l=r<i?t[r]:a;n(u,e[r],l)}return u}function qo(e){return _u(e)?e:[]}function Ho(e){return"function"==typeof e?e:Pl}function Ko(e,t){return yu(e)?e:Ga(e,t)?[e]:ci(qu(e))}var Go=So;function Qo(e,t,n){var r=e.length;return n=n===a?r:n,!t&&n>=r?e:jo(e,t,n)}var Yo=Un||function(e){return It.clearTimeout(e)};function Zo(e,t){if(t)return e.slice();var n=e.length,r=Ot?Ot(n):new e.constructor(n);return e.copy(r),r}function Xo(e){var t=new e.constructor(e.byteLength);return new wt(t).set(new wt(e)),t}function Jo(e,t){var n=t?Xo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function ea(e,t){if(e!==t){var n=e!==a,r=null===e,o=e==e,i=Uu(e),u=t!==a,l=null===t,c=t==t,s=Uu(t);if(!l&&!s&&!i&&e>t||i&&u&&c&&!l&&!s||r&&u&&c||!n&&c||!o)return 1;if(!r&&!i&&!s&&e<t||s&&n&&o&&!r&&!i||l&&n&&o||!u&&o||!c)return-1}return 0}function ta(e,t,n,o){for(var a=-1,i=e.length,u=n.length,l=-1,c=t.length,s=qn(i-u,0),f=r(c+s),p=!o;++l<c;)f[l]=t[l];for(;++a<u;)(p||a<i)&&(f[n[a]]=e[a]);for(;s--;)f[l++]=e[a++];return f}function na(e,t,n,o){for(var a=-1,i=e.length,u=-1,l=n.length,c=-1,s=t.length,f=qn(i-l,0),p=r(f+s),d=!o;++a<f;)p[a]=e[a];for(var m=a;++c<s;)p[m+c]=t[c];for(;++u<l;)(d||a<i)&&(p[m+n[u]]=e[a++]);return p}function ra(e,t){var n=-1,o=e.length;for(t||(t=r(o));++n<o;)t[n]=e[n];return t}function oa(e,t,n,r){var o=!n;n||(n={});for(var i=-1,u=t.length;++i<u;){var l=t[i],c=r?r(n[l],e[l],l,n,e):a;c===a&&(c=e[l]),o?Rr(n,l,c):Or(n,l,c)}return n}function aa(e,t){return function(n,r){var o=yu(n)?Ht:Pr,a=t?t():{};return o(n,e,Da(r,2),a)}}function ia(e){return So(function(t,n){var r=-1,o=n.length,i=o>1?n[o-1]:a,u=o>2?n[2]:a;for(i=e.length>3&&"function"==typeof i?(o--,i):a,u&&Ka(n[0],n[1],u)&&(i=o<3?a:i,o=1),t=tt(t);++r<o;){var l=n[r];l&&e(t,l,r,i)}return t})}function ua(e,t){return function(n,r){if(null==n)return n;if(!bu(n))return e(n,r);for(var o=n.length,a=t?o:-1,i=tt(n);(t?a--:++a<o)&&!1!==r(i[a],a,i););return n}}function la(e){return function(t,n,r){for(var o=-1,a=tt(t),i=r(t),u=i.length;u--;){var l=i[e?u:++o];if(!1===n(a[l],l,a))break}return t}}function ca(e){return function(t){var n=kn(t=qu(t))?Rn(t):a,r=n?n[0]:t.charAt(0),o=n?Qo(n,1).join(""):t.slice(1);return r[e]()+o}}function sa(e){return function(t){return tn(Sl(vl(t).replace(gt,"")),e,"")}}function fa(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=mr(e.prototype),r=e.apply(n,t);return Tu(r)?r:n}}function pa(e){return function(t,n,r){var o=tt(t);if(!bu(t)){var i=Da(n,3);t=ol(t),n=function(e){return i(o[e],e,o)}}var u=e(t,n,r);return u>-1?o[i?t[u]:u]:a}}function da(e){return Pa(function(t){var n=t.length,r=n,o=vr.prototype.thru;for(e&&t.reverse();r--;){var i=t[r];if("function"!=typeof i)throw new ot(l);if(o&&!u&&"wrapper"==Aa(i))var u=new vr([],!0)}for(r=u?r:n;++r<n;){var c=Aa(i=t[r]),s="wrapper"==c?Ia(i):a;u=s&&Qa(s[0])&&s[1]==(S|_|w|k)&&!s[4].length&&1==s[9]?u[Aa(s[0])].apply(u,s[3]):1==i.length&&Qa(i)?u[c]():u.thru(i)}return function(){var e=arguments,r=e[0];if(u&&1==e.length&&yu(r))return u.plant(r).value();for(var o=0,a=n?t[o].apply(this,e):r;++o<n;)a=t[o].call(this,a);return a}})}function ma(e,t,n,o,i,u,l,c,s,f){var p=t&S,d=t&y,m=t&g,h=t&(_|E),v=t&N,b=m?a:fa(e);return function y(){for(var g=arguments.length,_=r(g),E=g;E--;)_[E]=arguments[E];if(h)var w=Ua(y),x=function(e,t){for(var n=e.length,r=0;n--;)e[n]===t&&++r;return r}(_,w);if(o&&(_=ta(_,o,i,h)),u&&(_=na(_,u,l,h)),g-=x,h&&g<f){var S=On(_,w);return Ea(e,t,ma,y.placeholder,n,_,S,c,s,f-g)}var k=d?n:this,N=m?k[e]:e;return g=_.length,c?_=function(e,t){for(var n=e.length,r=Hn(t.length,n),o=ra(e);r--;){var i=t[r];e[r]=Ha(i,n)?o[i]:a}return e}(_,c):v&&g>1&&_.reverse(),p&&s<g&&(_.length=s),this&&this!==It&&this instanceof y&&(N=b||fa(N)),N.apply(k,_)}}function ha(e,t){return function(n,r){return function(e,t,n,r){return Kr(e,function(e,o,a){t(r,n(e),o,a)}),r}(n,e,t(r),{})}}function va(e,t){return function(n,r){var o;if(n===a&&r===a)return t;if(n!==a&&(o=n),r!==a){if(o===a)return r;"string"==typeof n||"string"==typeof r?(n=Mo(n),r=Mo(r)):(n=Do(n),r=Do(r)),o=e(n,r)}return o}}function ya(e){return Pa(function(t){return t=Jt(t,yn(Da())),So(function(n){var r=this;return e(t,function(e){return qt(e,r,n)})})})}function ga(e,t){var n=(t=t===a?" ":Mo(t)).length;if(n<2)return n?xo(t,e):t;var r=xo(t,zn(e/jn(t)));return kn(t)?Qo(Rn(r),0,e).join(""):r.slice(0,e)}function ba(e){return function(t,n,o){return o&&"number"!=typeof o&&Ka(t,n,o)&&(n=o=a),t=Fu(t),n===a?(n=t,t=0):n=Fu(n),function(e,t,n,o){for(var a=-1,i=qn(zn((t-e)/(n||1)),0),u=r(i);i--;)u[o?i:++a]=e,e+=n;return u}(t,n,o=o===a?t<n?1:-1:Fu(o),e)}}function _a(e){return function(t,n){return"string"==typeof t&&"string"==typeof n||(t=Bu(t),n=Bu(n)),e(t,n)}}function Ea(e,t,n,r,o,i,u,l,c,s){var f=t&_;t|=f?w:x,(t&=~(f?x:w))&b||(t&=~(y|g));var p=[e,t,o,f?i:a,f?u:a,f?a:i,f?a:u,l,c,s],d=n.apply(a,p);return Qa(e)&&ri(d,p),d.placeholder=r,ii(d,e,t)}function wa(e){var t=et[e];return function(e,n){if(e=Bu(e),n=null==n?0:Hn(Wu(n),292)){var r=(qu(e)+"e").split("e");return+((r=(qu(t(r[0]+"e"+(+r[1]+n)))+"e").split("e"))[0]+"e"+(+r[1]-n))}return t(e)}}var xa=er&&1/Cn(new er([,-0]))[1]==I?function(e){return new er(e)}:Ul;function Sa(e){return function(t){var n=$a(t);return n==Y?Nn(t):n==ne?Pn(t):function(e,t){return Jt(t,function(t){return[t,e[t]]})}(t,e(t))}}function ka(e,t,n,o,i,u,c,s){var p=t&g;if(!p&&"function"!=typeof e)throw new ot(l);var d=o?o.length:0;if(d||(t&=~(w|x),o=i=a),c=c===a?c:qn(Wu(c),0),s=s===a?s:Wu(s),d-=i?i.length:0,t&x){var m=o,h=i;o=i=a}var v=p?a:Ia(e),N=[e,t,n,o,i,m,h,u,c,s];if(v&&function(e,t){var n=e[1],r=t[1],o=n|r,a=o<(y|g|S),i=r==S&&n==_||r==S&&n==k&&e[7].length<=t[8]||r==(S|k)&&t[7].length<=t[8]&&n==_;if(!a&&!i)return e;r&y&&(e[2]=t[2],o|=n&y?0:b);var u=t[3];if(u){var l=e[3];e[3]=l?ta(l,u,t[4]):u,e[4]=l?On(e[3],f):t[4]}(u=t[5])&&(l=e[5],e[5]=l?na(l,u,t[6]):u,e[6]=l?On(e[5],f):t[6]),(u=t[7])&&(e[7]=u),r&S&&(e[8]=null==e[8]?t[8]:Hn(e[8],t[8])),null==e[9]&&(e[9]=t[9]),e[0]=t[0],e[1]=o}(N,v),e=N[0],t=N[1],n=N[2],o=N[3],i=N[4],!(s=N[9]=N[9]===a?p?0:e.length:qn(N[9]-d,0))&&t&(_|E)&&(t&=~(_|E)),t&&t!=y)T=t==_||t==E?function(e,t,n){var o=fa(e);return function i(){for(var u=arguments.length,l=r(u),c=u,s=Ua(i);c--;)l[c]=arguments[c];var f=u<3&&l[0]!==s&&l[u-1]!==s?[]:On(l,s);return(u-=f.length)<n?Ea(e,t,ma,i.placeholder,a,l,f,a,a,n-u):qt(this&&this!==It&&this instanceof i?o:e,this,l)}}(e,t,s):t!=w&&t!=(y|w)||i.length?ma.apply(a,N):function(e,t,n,o){var a=t&y,i=fa(e);return function t(){for(var u=-1,l=arguments.length,c=-1,s=o.length,f=r(s+l),p=this&&this!==It&&this instanceof t?i:e;++c<s;)f[c]=o[c];for(;l--;)f[c++]=arguments[++u];return qt(p,a?n:this,f)}}(e,t,n,o);else var T=function(e,t,n){var r=t&y,o=fa(e);return function t(){return(this&&this!==It&&this instanceof t?o:e).apply(r?n:this,arguments)}}(e,t,n);return ii((v?Oo:ri)(T,N),e,t)}function Na(e,t,n,r){return e===a||du(e,ut[n])&&!st.call(r,n)?t:e}function Ta(e,t,n,r,o,i){return Tu(e)&&Tu(t)&&(i.set(t,e),vo(e,t,a,Ta,i),i.delete(t)),e}function Oa(e){return ju(e)?a:e}function Ca(e,t,n,r,o,i){var u=n&h,l=e.length,c=t.length;if(l!=c&&!(u&&c>l))return!1;var s=i.get(e);if(s&&i.get(t))return s==t;var f=-1,p=!0,d=n&v?new Er:a;for(i.set(e,t),i.set(t,e);++f<l;){var m=e[f],y=t[f];if(r)var g=u?r(y,m,f,t,e,i):r(m,y,f,e,t,i);if(g!==a){if(g)continue;p=!1;break}if(d){if(!rn(t,function(e,t){if(!bn(d,t)&&(m===e||o(m,e,n,r,i)))return d.push(t)})){p=!1;break}}else if(m!==y&&!o(m,y,n,r,i)){p=!1;break}}return i.delete(e),i.delete(t),p}function Pa(e){return ai(ei(e,a,gi),e+"")}function ja(e){return Zr(e,ol,Fa)}function Ra(e){return Zr(e,al,Wa)}var Ia=rr?function(e){return rr.get(e)}:Ul;function Aa(e){for(var t=e.name+"",n=or[t],r=st.call(or,t)?n.length:0;r--;){var o=n[r],a=o.func;if(null==a||a==e)return o.name}return t}function Ua(e){return(st.call(dr,"placeholder")?dr:e).placeholder}function Da(){var e=dr.iteratee||jl;return e=e===jl?lo:e,arguments.length?e(arguments[0],arguments[1]):e}function Ma(e,t){var n,r,o=e.__data__;return("string"==(r=typeof(n=t))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof t?"string":"hash"]:o.map}function za(e){for(var t=ol(e),n=t.length;n--;){var r=t[n],o=e[r];t[n]=[r,o,Xa(o)]}return t}function La(e,t){var n=function(e,t){return null==e?a:e[t]}(e,t);return uo(n)?n:a}var Fa=Fn?function(e){return null==e?[]:(e=tt(e),Yt(Fn(e),function(t){return At.call(e,t)}))}:$l,Wa=Fn?function(e){for(var t=[];e;)en(t,Fa(e)),e=jt(e);return t}:$l,$a=Xr;function Ba(e,t,n){for(var r=-1,o=(t=Ko(t,e)).length,a=!1;++r<o;){var i=si(t[r]);if(!(a=null!=e&&n(e,i)))break;e=e[i]}return a||++r!=o?a:!!(o=null==e?0:e.length)&&Nu(o)&&Ha(i,o)&&(yu(e)||vu(e))}function Va(e){return"function"!=typeof e.constructor||Za(e)?{}:mr(jt(e))}function qa(e){return yu(e)||vu(e)||!!(Mt&&e&&e[Mt])}function Ha(e,t){var n=typeof e;return!!(t=null==t?A:t)&&("number"==n||"symbol"!=n&&Ge.test(e))&&e>-1&&e%1==0&&e<t}function Ka(e,t,n){if(!Tu(n))return!1;var r=typeof t;return!!("number"==r?bu(n)&&Ha(t,n.length):"string"==r&&t in n)&&du(n[t],e)}function Ga(e,t){if(yu(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!Uu(e))||Pe.test(e)||!Ce.test(e)||null!=t&&e in tt(t)}function Qa(e){var t=Aa(e),n=dr[t];if("function"!=typeof n||!(t in yr.prototype))return!1;if(e===n)return!0;var r=Ia(n);return!!r&&e===r[0]}(Zn&&$a(new Zn(new ArrayBuffer(1)))!=ce||Xn&&$a(new Xn)!=Y||Jn&&"[object Promise]"!=$a(Jn.resolve())||er&&$a(new er)!=ne||tr&&$a(new tr)!=ie)&&($a=function(e){var t=Xr(e),n=t==J?e.constructor:a,r=n?fi(n):"";if(r)switch(r){case ar:return ce;case ir:return Y;case ur:return"[object Promise]";case lr:return ne;case cr:return ie}return t});var Ya=lt?Su:Bl;function Za(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||ut)}function Xa(e){return e==e&&!Tu(e)}function Ja(e,t){return function(n){return null!=n&&n[e]===t&&(t!==a||e in tt(n))}}function ei(e,t,n){return t=qn(t===a?e.length-1:t,0),function(){for(var o=arguments,a=-1,i=qn(o.length-t,0),u=r(i);++a<i;)u[a]=o[t+a];a=-1;for(var l=r(t+1);++a<t;)l[a]=o[a];return l[t]=n(u),qt(e,this,l)}}function ti(e,t){return t.length<2?e:Yr(e,jo(t,0,-1))}function ni(e,t){if("__proto__"!=t)return e[t]}var ri=ui(Oo),oi=Mn||function(e,t){return It.setTimeout(e,t)},ai=ui(Co);function ii(e,t,n){var r=t+"";return ai(e,function(e,t){var n=t.length;if(!n)return e;var r=n-1;return t[r]=(n>1?"& ":"")+t[r],t=t.join(n>2?", ":" "),e.replace(Me,"{\n/* [wrapped with "+t+"] */\n")}(r,function(e,t){return Kt(F,function(n){var r="_."+n[0];t&n[1]&&!Zt(e,r)&&e.push(r)}),e.sort()}(function(e){var t=e.match(ze);return t?t[1].split(Le):[]}(r),n)))}function ui(e){var t=0,n=0;return function(){var r=Kn(),o=P-(r-n);if(n=r,o>0){if(++t>=C)return arguments[0]}else t=0;return e.apply(a,arguments)}}function li(e,t){var n=-1,r=e.length,o=r-1;for(t=t===a?r:t;++n<t;){var i=wo(n,o),u=e[i];e[i]=e[n],e[n]=u}return e.length=t,e}var ci=function(e){var t=uu(e,function(e){return n.size===s&&n.clear(),e}),n=t.cache;return t}(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(je,function(e,n,r,o){t.push(r?o.replace(We,"$1"):n||e)}),t});function si(e){if("string"==typeof e||Uu(e))return e;var t=e+"";return"0"==t&&1/e==-I?"-0":t}function fi(e){if(null!=e){try{return ct.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function pi(e){if(e instanceof yr)return e.clone();var t=new vr(e.__wrapped__,e.__chain__);return t.__actions__=ra(e.__actions__),t.__index__=e.__index__,t.__values__=e.__values__,t}var di=So(function(e,t){return _u(e)?zr(e,Vr(t,1,_u,!0)):[]}),mi=So(function(e,t){var n=xi(t);return _u(n)&&(n=a),_u(e)?zr(e,Vr(t,1,_u,!0),Da(n,2)):[]}),hi=So(function(e,t){var n=xi(t);return _u(n)&&(n=a),_u(e)?zr(e,Vr(t,1,_u,!0),a,n):[]});function vi(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Wu(n);return o<0&&(o=qn(r+o,0)),un(e,Da(t,3),o)}function yi(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r-1;return n!==a&&(o=Wu(n),o=n<0?qn(r+o,0):Hn(o,r-1)),un(e,Da(t,3),o,!0)}function gi(e){return null!=e&&e.length?Vr(e,1):[]}function bi(e){return e&&e.length?e[0]:a}var _i=So(function(e){var t=Jt(e,qo);return t.length&&t[0]===e[0]?no(t):[]}),Ei=So(function(e){var t=xi(e),n=Jt(e,qo);return t===xi(n)?t=a:n.pop(),n.length&&n[0]===e[0]?no(n,Da(t,2)):[]}),wi=So(function(e){var t=xi(e),n=Jt(e,qo);return(t="function"==typeof t?t:a)&&n.pop(),n.length&&n[0]===e[0]?no(n,a,t):[]});function xi(e){var t=null==e?0:e.length;return t?e[t-1]:a}var Si=So(ki);function ki(e,t){return e&&e.length&&t&&t.length?_o(e,t):e}var Ni=Pa(function(e,t){var n=null==e?0:e.length,r=Ir(e,t);return Eo(e,Jt(t,function(e){return Ha(e,n)?+e:e}).sort(ea)),r});function Ti(e){return null==e?e:Yn.call(e)}var Oi=So(function(e){return zo(Vr(e,1,_u,!0))}),Ci=So(function(e){var t=xi(e);return _u(t)&&(t=a),zo(Vr(e,1,_u,!0),Da(t,2))}),Pi=So(function(e){var t=xi(e);return t="function"==typeof t?t:a,zo(Vr(e,1,_u,!0),a,t)});function ji(e){if(!e||!e.length)return[];var t=0;return e=Yt(e,function(e){if(_u(e))return t=qn(e.length,t),!0}),vn(t,function(t){return Jt(e,pn(t))})}function Ri(e,t){if(!e||!e.length)return[];var n=ji(e);return null==t?n:Jt(n,function(e){return qt(t,a,e)})}var Ii=So(function(e,t){return _u(e)?zr(e,t):[]}),Ai=So(function(e){return Bo(Yt(e,_u))}),Ui=So(function(e){var t=xi(e);return _u(t)&&(t=a),Bo(Yt(e,_u),Da(t,2))}),Di=So(function(e){var t=xi(e);return t="function"==typeof t?t:a,Bo(Yt(e,_u),a,t)}),Mi=So(ji);var zi=So(function(e){var t=e.length,n=t>1?e[t-1]:a;return n="function"==typeof n?(e.pop(),n):a,Ri(e,n)});function Li(e){var t=dr(e);return t.__chain__=!0,t}function Fi(e,t){return t(e)}var Wi=Pa(function(e){var t=e.length,n=t?e[0]:0,r=this.__wrapped__,o=function(t){return Ir(t,e)};return!(t>1||this.__actions__.length)&&r instanceof yr&&Ha(n)?((r=r.slice(n,+n+(t?1:0))).__actions__.push({func:Fi,args:[o],thisArg:a}),new vr(r,this.__chain__).thru(function(e){return t&&!e.length&&e.push(a),e})):this.thru(o)});var $i=aa(function(e,t,n){st.call(e,n)?++e[n]:Rr(e,n,1)});var Bi=pa(vi),Vi=pa(yi);function qi(e,t){return(yu(e)?Kt:Lr)(e,Da(t,3))}function Hi(e,t){return(yu(e)?Gt:Fr)(e,Da(t,3))}var Ki=aa(function(e,t,n){st.call(e,n)?e[n].push(t):Rr(e,n,[t])});var Gi=So(function(e,t,n){var o=-1,a="function"==typeof t,i=bu(e)?r(e.length):[];return Lr(e,function(e){i[++o]=a?qt(t,e,n):ro(e,t,n)}),i}),Qi=aa(function(e,t,n){Rr(e,n,t)});function Yi(e,t){return(yu(e)?Jt:po)(e,Da(t,3))}var Zi=aa(function(e,t,n){e[n?0:1].push(t)},function(){return[[],[]]});var Xi=So(function(e,t){if(null==e)return[];var n=t.length;return n>1&&Ka(e,t[0],t[1])?t=[]:n>2&&Ka(t[0],t[1],t[2])&&(t=[t[0]]),go(e,Vr(t,1),[])}),Ji=Dn||function(){return It.Date.now()};function eu(e,t,n){return t=n?a:t,t=e&&null==t?e.length:t,ka(e,S,a,a,a,a,t)}function tu(e,t){var n;if("function"!=typeof t)throw new ot(l);return e=Wu(e),function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=a),n}}var nu=So(function(e,t,n){var r=y;if(n.length){var o=On(n,Ua(nu));r|=w}return ka(e,r,t,n,o)}),ru=So(function(e,t,n){var r=y|g;if(n.length){var o=On(n,Ua(ru));r|=w}return ka(t,r,e,n,o)});function ou(e,t,n){var r,o,i,u,c,s,f=0,p=!1,d=!1,m=!0;if("function"!=typeof e)throw new ot(l);function h(t){var n=r,i=o;return r=o=a,f=t,u=e.apply(i,n)}function v(e){var n=e-s;return s===a||n>=t||n<0||d&&e-f>=i}function y(){var e=Ji();if(v(e))return g(e);c=oi(y,function(e){var n=t-(e-s);return d?Hn(n,i-(e-f)):n}(e))}function g(e){return c=a,m&&r?h(e):(r=o=a,u)}function b(){var e=Ji(),n=v(e);if(r=arguments,o=this,s=e,n){if(c===a)return function(e){return f=e,c=oi(y,t),p?h(e):u}(s);if(d)return c=oi(y,t),h(s)}return c===a&&(c=oi(y,t)),u}return t=Bu(t)||0,Tu(n)&&(p=!!n.leading,i=(d="maxWait"in n)?qn(Bu(n.maxWait)||0,t):i,m="trailing"in n?!!n.trailing:m),b.cancel=function(){c!==a&&Yo(c),f=0,r=s=o=c=a},b.flush=function(){return c===a?u:g(Ji())},b}var au=So(function(e,t){return Mr(e,1,t)}),iu=So(function(e,t,n){return Mr(e,Bu(t)||0,n)});function uu(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new ot(l);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],a=n.cache;if(a.has(o))return a.get(o);var i=e.apply(this,r);return n.cache=a.set(o,i)||a,i};return n.cache=new(uu.Cache||_r),n}function lu(e){if("function"!=typeof e)throw new ot(l);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}uu.Cache=_r;var cu=Go(function(e,t){var n=(t=1==t.length&&yu(t[0])?Jt(t[0],yn(Da())):Jt(Vr(t,1),yn(Da()))).length;return So(function(r){for(var o=-1,a=Hn(r.length,n);++o<a;)r[o]=t[o].call(this,r[o]);return qt(e,this,r)})}),su=So(function(e,t){var n=On(t,Ua(su));return ka(e,w,a,t,n)}),fu=So(function(e,t){var n=On(t,Ua(fu));return ka(e,x,a,t,n)}),pu=Pa(function(e,t){return ka(e,k,a,a,a,t)});function du(e,t){return e===t||e!=e&&t!=t}var mu=_a(Jr),hu=_a(function(e,t){return e>=t}),vu=oo(function(){return arguments}())?oo:function(e){return Ou(e)&&st.call(e,"callee")&&!At.call(e,"callee")},yu=r.isArray,gu=Lt?yn(Lt):function(e){return Ou(e)&&Xr(e)==le};function bu(e){return null!=e&&Nu(e.length)&&!Su(e)}function _u(e){return Ou(e)&&bu(e)}var Eu=Wn||Bl,wu=Ft?yn(Ft):function(e){return Ou(e)&&Xr(e)==q};function xu(e){if(!Ou(e))return!1;var t=Xr(e);return t==K||t==H||"string"==typeof e.message&&"string"==typeof e.name&&!ju(e)}function Su(e){if(!Tu(e))return!1;var t=Xr(e);return t==G||t==Q||t==B||t==ee}function ku(e){return"number"==typeof e&&e==Wu(e)}function Nu(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=A}function Tu(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function Ou(e){return null!=e&&"object"==typeof e}var Cu=Wt?yn(Wt):function(e){return Ou(e)&&$a(e)==Y};function Pu(e){return"number"==typeof e||Ou(e)&&Xr(e)==Z}function ju(e){if(!Ou(e)||Xr(e)!=J)return!1;var t=jt(e);if(null===t)return!0;var n=st.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&ct.call(n)==mt}var Ru=$t?yn($t):function(e){return Ou(e)&&Xr(e)==te};var Iu=Bt?yn(Bt):function(e){return Ou(e)&&$a(e)==ne};function Au(e){return"string"==typeof e||!yu(e)&&Ou(e)&&Xr(e)==re}function Uu(e){return"symbol"==typeof e||Ou(e)&&Xr(e)==oe}var Du=Vt?yn(Vt):function(e){return Ou(e)&&Nu(e.length)&&!!Nt[Xr(e)]};var Mu=_a(fo),zu=_a(function(e,t){return e<=t});function Lu(e){if(!e)return[];if(bu(e))return Au(e)?Rn(e):ra(e);if(zt&&e[zt])return function(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}(e[zt]());var t=$a(e);return(t==Y?Nn:t==ne?Cn:dl)(e)}function Fu(e){return e?(e=Bu(e))===I||e===-I?(e<0?-1:1)*U:e==e?e:0:0===e?e:0}function Wu(e){var t=Fu(e),n=t%1;return t==t?n?t-n:t:0}function $u(e){return e?Ar(Wu(e),0,M):0}function Bu(e){if("number"==typeof e)return e;if(Uu(e))return D;if(Tu(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=Tu(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(Ae,"");var n=qe.test(e);return n||Ke.test(e)?Pt(e.slice(2),n?2:8):Ve.test(e)?D:+e}function Vu(e){return oa(e,al(e))}function qu(e){return null==e?"":Mo(e)}var Hu=ia(function(e,t){if(Za(t)||bu(t))oa(t,ol(t),e);else for(var n in t)st.call(t,n)&&Or(e,n,t[n])}),Ku=ia(function(e,t){oa(t,al(t),e)}),Gu=ia(function(e,t,n,r){oa(t,al(t),e,r)}),Qu=ia(function(e,t,n,r){oa(t,ol(t),e,r)}),Yu=Pa(Ir);var Zu=So(function(e,t){e=tt(e);var n=-1,r=t.length,o=r>2?t[2]:a;for(o&&Ka(t[0],t[1],o)&&(r=1);++n<r;)for(var i=t[n],u=al(i),l=-1,c=u.length;++l<c;){var s=u[l],f=e[s];(f===a||du(f,ut[s])&&!st.call(e,s))&&(e[s]=i[s])}return e}),Xu=So(function(e){return e.push(a,Ta),qt(ul,a,e)});function Ju(e,t,n){var r=null==e?a:Yr(e,t);return r===a?n:r}function el(e,t){return null!=e&&Ba(e,t,to)}var tl=ha(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=dt.call(t)),e[t]=n},Tl(Pl)),nl=ha(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=dt.call(t)),st.call(e,t)?e[t].push(n):e[t]=[n]},Da),rl=So(ro);function ol(e){return bu(e)?xr(e):co(e)}function al(e){return bu(e)?xr(e,!0):so(e)}var il=ia(function(e,t,n){vo(e,t,n)}),ul=ia(function(e,t,n,r){vo(e,t,n,r)}),ll=Pa(function(e,t){var n={};if(null==e)return n;var r=!1;t=Jt(t,function(t){return t=Ko(t,e),r||(r=t.length>1),t}),oa(e,Ra(e),n),r&&(n=Ur(n,p|d|m,Oa));for(var o=t.length;o--;)Lo(n,t[o]);return n});var cl=Pa(function(e,t){return null==e?{}:function(e,t){return bo(e,t,function(t,n){return el(e,n)})}(e,t)});function sl(e,t){if(null==e)return{};var n=Jt(Ra(e),function(e){return[e]});return t=Da(t),bo(e,n,function(e,n){return t(e,n[0])})}var fl=Sa(ol),pl=Sa(al);function dl(e){return null==e?[]:gn(e,ol(e))}var ml=sa(function(e,t,n){return t=t.toLowerCase(),e+(n?hl(t):t)});function hl(e){return xl(qu(e).toLowerCase())}function vl(e){return(e=qu(e))&&e.replace(Qe,wn).replace(bt,"")}var yl=sa(function(e,t,n){return e+(n?"-":"")+t.toLowerCase()}),gl=sa(function(e,t,n){return e+(n?" ":"")+t.toLowerCase()}),bl=ca("toLowerCase");var _l=sa(function(e,t,n){return e+(n?"_":"")+t.toLowerCase()});var El=sa(function(e,t,n){return e+(n?" ":"")+xl(t)});var wl=sa(function(e,t,n){return e+(n?" ":"")+t.toUpperCase()}),xl=ca("toUpperCase");function Sl(e,t,n){return e=qu(e),(t=n?a:t)===a?function(e){return xt.test(e)}(e)?function(e){return e.match(Et)||[]}(e):function(e){return e.match(Fe)||[]}(e):e.match(t)||[]}var kl=So(function(e,t){try{return qt(e,a,t)}catch(e){return xu(e)?e:new Xe(e)}}),Nl=Pa(function(e,t){return Kt(t,function(t){t=si(t),Rr(e,t,nu(e[t],e))}),e});function Tl(e){return function(){return e}}var Ol=da(),Cl=da(!0);function Pl(e){return e}function jl(e){return lo("function"==typeof e?e:Ur(e,p))}var Rl=So(function(e,t){return function(n){return ro(n,e,t)}}),Il=So(function(e,t){return function(n){return ro(e,n,t)}});function Al(e,t,n){var r=ol(t),o=Qr(t,r);null!=n||Tu(t)&&(o.length||!r.length)||(n=t,t=e,e=this,o=Qr(t,ol(t)));var a=!(Tu(n)&&"chain"in n&&!n.chain),i=Su(e);return Kt(o,function(n){var r=t[n];e[n]=r,i&&(e.prototype[n]=function(){var t=this.__chain__;if(a||t){var n=e(this.__wrapped__);return(n.__actions__=ra(this.__actions__)).push({func:r,args:arguments,thisArg:e}),n.__chain__=t,n}return r.apply(e,en([this.value()],arguments))})}),e}function Ul(){}var Dl=ya(Jt),Ml=ya(Qt),zl=ya(rn);function Ll(e){return Ga(e)?pn(si(e)):function(e){return function(t){return Yr(t,e)}}(e)}var Fl=ba(),Wl=ba(!0);function $l(){return[]}function Bl(){return!1}var Vl=va(function(e,t){return e+t},0),ql=wa("ceil"),Hl=va(function(e,t){return e/t},1),Kl=wa("floor");var Gl,Ql=va(function(e,t){return e*t},1),Yl=wa("round"),Zl=va(function(e,t){return e-t},0);return dr.after=function(e,t){if("function"!=typeof t)throw new ot(l);return e=Wu(e),function(){if(--e<1)return t.apply(this,arguments)}},dr.ary=eu,dr.assign=Hu,dr.assignIn=Ku,dr.assignInWith=Gu,dr.assignWith=Qu,dr.at=Yu,dr.before=tu,dr.bind=nu,dr.bindAll=Nl,dr.bindKey=ru,dr.castArray=function(){if(!arguments.length)return[];var e=arguments[0];return yu(e)?e:[e]},dr.chain=Li,dr.chunk=function(e,t,n){t=(n?Ka(e,t,n):t===a)?1:qn(Wu(t),0);var o=null==e?0:e.length;if(!o||t<1)return[];for(var i=0,u=0,l=r(zn(o/t));i<o;)l[u++]=jo(e,i,i+=t);return l},dr.compact=function(e){for(var t=-1,n=null==e?0:e.length,r=0,o=[];++t<n;){var a=e[t];a&&(o[r++]=a)}return o},dr.concat=function(){var e=arguments.length;if(!e)return[];for(var t=r(e-1),n=arguments[0],o=e;o--;)t[o-1]=arguments[o];return en(yu(n)?ra(n):[n],Vr(t,1))},dr.cond=function(e){var t=null==e?0:e.length,n=Da();return e=t?Jt(e,function(e){if("function"!=typeof e[1])throw new ot(l);return[n(e[0]),e[1]]}):[],So(function(n){for(var r=-1;++r<t;){var o=e[r];if(qt(o[0],this,n))return qt(o[1],this,n)}})},dr.conforms=function(e){return function(e){var t=ol(e);return function(n){return Dr(n,e,t)}}(Ur(e,p))},dr.constant=Tl,dr.countBy=$i,dr.create=function(e,t){var n=mr(e);return null==t?n:jr(n,t)},dr.curry=function e(t,n,r){var o=ka(t,_,a,a,a,a,a,n=r?a:n);return o.placeholder=e.placeholder,o},dr.curryRight=function e(t,n,r){var o=ka(t,E,a,a,a,a,a,n=r?a:n);return o.placeholder=e.placeholder,o},dr.debounce=ou,dr.defaults=Zu,dr.defaultsDeep=Xu,dr.defer=au,dr.delay=iu,dr.difference=di,dr.differenceBy=mi,dr.differenceWith=hi,dr.drop=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,(t=n||t===a?1:Wu(t))<0?0:t,r):[]},dr.dropRight=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,0,(t=r-(t=n||t===a?1:Wu(t)))<0?0:t):[]},dr.dropRightWhile=function(e,t){return e&&e.length?Wo(e,Da(t,3),!0,!0):[]},dr.dropWhile=function(e,t){return e&&e.length?Wo(e,Da(t,3),!0):[]},dr.fill=function(e,t,n,r){var o=null==e?0:e.length;return o?(n&&"number"!=typeof n&&Ka(e,t,n)&&(n=0,r=o),function(e,t,n,r){var o=e.length;for((n=Wu(n))<0&&(n=-n>o?0:o+n),(r=r===a||r>o?o:Wu(r))<0&&(r+=o),r=n>r?0:$u(r);n<r;)e[n++]=t;return e}(e,t,n,r)):[]},dr.filter=function(e,t){return(yu(e)?Yt:Br)(e,Da(t,3))},dr.flatMap=function(e,t){return Vr(Yi(e,t),1)},dr.flatMapDeep=function(e,t){return Vr(Yi(e,t),I)},dr.flatMapDepth=function(e,t,n){return n=n===a?1:Wu(n),Vr(Yi(e,t),n)},dr.flatten=gi,dr.flattenDeep=function(e){return null!=e&&e.length?Vr(e,I):[]},dr.flattenDepth=function(e,t){return null!=e&&e.length?Vr(e,t=t===a?1:Wu(t)):[]},dr.flip=function(e){return ka(e,N)},dr.flow=Ol,dr.flowRight=Cl,dr.fromPairs=function(e){for(var t=-1,n=null==e?0:e.length,r={};++t<n;){var o=e[t];r[o[0]]=o[1]}return r},dr.functions=function(e){return null==e?[]:Qr(e,ol(e))},dr.functionsIn=function(e){return null==e?[]:Qr(e,al(e))},dr.groupBy=Ki,dr.initial=function(e){return null!=e&&e.length?jo(e,0,-1):[]},dr.intersection=_i,dr.intersectionBy=Ei,dr.intersectionWith=wi,dr.invert=tl,dr.invertBy=nl,dr.invokeMap=Gi,dr.iteratee=jl,dr.keyBy=Qi,dr.keys=ol,dr.keysIn=al,dr.map=Yi,dr.mapKeys=function(e,t){var n={};return t=Da(t,3),Kr(e,function(e,r,o){Rr(n,t(e,r,o),e)}),n},dr.mapValues=function(e,t){var n={};return t=Da(t,3),Kr(e,function(e,r,o){Rr(n,r,t(e,r,o))}),n},dr.matches=function(e){return mo(Ur(e,p))},dr.matchesProperty=function(e,t){return ho(e,Ur(t,p))},dr.memoize=uu,dr.merge=il,dr.mergeWith=ul,dr.method=Rl,dr.methodOf=Il,dr.mixin=Al,dr.negate=lu,dr.nthArg=function(e){return e=Wu(e),So(function(t){return yo(t,e)})},dr.omit=ll,dr.omitBy=function(e,t){return sl(e,lu(Da(t)))},dr.once=function(e){return tu(2,e)},dr.orderBy=function(e,t,n,r){return null==e?[]:(yu(t)||(t=null==t?[]:[t]),yu(n=r?a:n)||(n=null==n?[]:[n]),go(e,t,n))},dr.over=Dl,dr.overArgs=cu,dr.overEvery=Ml,dr.overSome=zl,dr.partial=su,dr.partialRight=fu,dr.partition=Zi,dr.pick=cl,dr.pickBy=sl,dr.property=Ll,dr.propertyOf=function(e){return function(t){return null==e?a:Yr(e,t)}},dr.pull=Si,dr.pullAll=ki,dr.pullAllBy=function(e,t,n){return e&&e.length&&t&&t.length?_o(e,t,Da(n,2)):e},dr.pullAllWith=function(e,t,n){return e&&e.length&&t&&t.length?_o(e,t,a,n):e},dr.pullAt=Ni,dr.range=Fl,dr.rangeRight=Wl,dr.rearg=pu,dr.reject=function(e,t){return(yu(e)?Yt:Br)(e,lu(Da(t,3)))},dr.remove=function(e,t){var n=[];if(!e||!e.length)return n;var r=-1,o=[],a=e.length;for(t=Da(t,3);++r<a;){var i=e[r];t(i,r,e)&&(n.push(i),o.push(r))}return Eo(e,o),n},dr.rest=function(e,t){if("function"!=typeof e)throw new ot(l);return So(e,t=t===a?t:Wu(t))},dr.reverse=Ti,dr.sampleSize=function(e,t,n){return t=(n?Ka(e,t,n):t===a)?1:Wu(t),(yu(e)?kr:No)(e,t)},dr.set=function(e,t,n){return null==e?e:To(e,t,n)},dr.setWith=function(e,t,n,r){return r="function"==typeof r?r:a,null==e?e:To(e,t,n,r)},dr.shuffle=function(e){return(yu(e)?Nr:Po)(e)},dr.slice=function(e,t,n){var r=null==e?0:e.length;return r?(n&&"number"!=typeof n&&Ka(e,t,n)?(t=0,n=r):(t=null==t?0:Wu(t),n=n===a?r:Wu(n)),jo(e,t,n)):[]},dr.sortBy=Xi,dr.sortedUniq=function(e){return e&&e.length?Uo(e):[]},dr.sortedUniqBy=function(e,t){return e&&e.length?Uo(e,Da(t,2)):[]},dr.split=function(e,t,n){return n&&"number"!=typeof n&&Ka(e,t,n)&&(t=n=a),(n=n===a?M:n>>>0)?(e=qu(e))&&("string"==typeof t||null!=t&&!Ru(t))&&!(t=Mo(t))&&kn(e)?Qo(Rn(e),0,n):e.split(t,n):[]},dr.spread=function(e,t){if("function"!=typeof e)throw new ot(l);return t=null==t?0:qn(Wu(t),0),So(function(n){var r=n[t],o=Qo(n,0,t);return r&&en(o,r),qt(e,this,o)})},dr.tail=function(e){var t=null==e?0:e.length;return t?jo(e,1,t):[]},dr.take=function(e,t,n){return e&&e.length?jo(e,0,(t=n||t===a?1:Wu(t))<0?0:t):[]},dr.takeRight=function(e,t,n){var r=null==e?0:e.length;return r?jo(e,(t=r-(t=n||t===a?1:Wu(t)))<0?0:t,r):[]},dr.takeRightWhile=function(e,t){return e&&e.length?Wo(e,Da(t,3),!1,!0):[]},dr.takeWhile=function(e,t){return e&&e.length?Wo(e,Da(t,3)):[]},dr.tap=function(e,t){return t(e),e},dr.throttle=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw new ot(l);return Tu(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),ou(e,t,{leading:r,maxWait:t,trailing:o})},dr.thru=Fi,dr.toArray=Lu,dr.toPairs=fl,dr.toPairsIn=pl,dr.toPath=function(e){return yu(e)?Jt(e,si):Uu(e)?[e]:ra(ci(qu(e)))},dr.toPlainObject=Vu,dr.transform=function(e,t,n){var r=yu(e),o=r||Eu(e)||Du(e);if(t=Da(t,4),null==n){var a=e&&e.constructor;n=o?r?new a:[]:Tu(e)&&Su(a)?mr(jt(e)):{}}return(o?Kt:Kr)(e,function(e,r,o){return t(n,e,r,o)}),n},dr.unary=function(e){return eu(e,1)},dr.union=Oi,dr.unionBy=Ci,dr.unionWith=Pi,dr.uniq=function(e){return e&&e.length?zo(e):[]},dr.uniqBy=function(e,t){return e&&e.length?zo(e,Da(t,2)):[]},dr.uniqWith=function(e,t){return t="function"==typeof t?t:a,e&&e.length?zo(e,a,t):[]},dr.unset=function(e,t){return null==e||Lo(e,t)},dr.unzip=ji,dr.unzipWith=Ri,dr.update=function(e,t,n){return null==e?e:Fo(e,t,Ho(n))},dr.updateWith=function(e,t,n,r){return r="function"==typeof r?r:a,null==e?e:Fo(e,t,Ho(n),r)},dr.values=dl,dr.valuesIn=function(e){return null==e?[]:gn(e,al(e))},dr.without=Ii,dr.words=Sl,dr.wrap=function(e,t){return su(Ho(t),e)},dr.xor=Ai,dr.xorBy=Ui,dr.xorWith=Di,dr.zip=Mi,dr.zipObject=function(e,t){return Vo(e||[],t||[],Or)},dr.zipObjectDeep=function(e,t){return Vo(e||[],t||[],To)},dr.zipWith=zi,dr.entries=fl,dr.entriesIn=pl,dr.extend=Ku,dr.extendWith=Gu,Al(dr,dr),dr.add=Vl,dr.attempt=kl,dr.camelCase=ml,dr.capitalize=hl,dr.ceil=ql,dr.clamp=function(e,t,n){return n===a&&(n=t,t=a),n!==a&&(n=(n=Bu(n))==n?n:0),t!==a&&(t=(t=Bu(t))==t?t:0),Ar(Bu(e),t,n)},dr.clone=function(e){return Ur(e,m)},dr.cloneDeep=function(e){return Ur(e,p|m)},dr.cloneDeepWith=function(e,t){return Ur(e,p|m,t="function"==typeof t?t:a)},dr.cloneWith=function(e,t){return Ur(e,m,t="function"==typeof t?t:a)},dr.conformsTo=function(e,t){return null==t||Dr(e,t,ol(t))},dr.deburr=vl,dr.defaultTo=function(e,t){return null==e||e!=e?t:e},dr.divide=Hl,dr.endsWith=function(e,t,n){e=qu(e),t=Mo(t);var r=e.length,o=n=n===a?r:Ar(Wu(n),0,r);return(n-=t.length)>=0&&e.slice(n,o)==t},dr.eq=du,dr.escape=function(e){return(e=qu(e))&&ke.test(e)?e.replace(xe,xn):e},dr.escapeRegExp=function(e){return(e=qu(e))&&Ie.test(e)?e.replace(Re,"\\$&"):e},dr.every=function(e,t,n){var r=yu(e)?Qt:Wr;return n&&Ka(e,t,n)&&(t=a),r(e,Da(t,3))},dr.find=Bi,dr.findIndex=vi,dr.findKey=function(e,t){return an(e,Da(t,3),Kr)},dr.findLast=Vi,dr.findLastIndex=yi,dr.findLastKey=function(e,t){return an(e,Da(t,3),Gr)},dr.floor=Kl,dr.forEach=qi,dr.forEachRight=Hi,dr.forIn=function(e,t){return null==e?e:qr(e,Da(t,3),al)},dr.forInRight=function(e,t){return null==e?e:Hr(e,Da(t,3),al)},dr.forOwn=function(e,t){return e&&Kr(e,Da(t,3))},dr.forOwnRight=function(e,t){return e&&Gr(e,Da(t,3))},dr.get=Ju,dr.gt=mu,dr.gte=hu,dr.has=function(e,t){return null!=e&&Ba(e,t,eo)},dr.hasIn=el,dr.head=bi,dr.identity=Pl,dr.includes=function(e,t,n,r){e=bu(e)?e:dl(e),n=n&&!r?Wu(n):0;var o=e.length;return n<0&&(n=qn(o+n,0)),Au(e)?n<=o&&e.indexOf(t,n)>-1:!!o&&ln(e,t,n)>-1},dr.indexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Wu(n);return o<0&&(o=qn(r+o,0)),ln(e,t,o)},dr.inRange=function(e,t,n){return t=Fu(t),n===a?(n=t,t=0):n=Fu(n),function(e,t,n){return e>=Hn(t,n)&&e<qn(t,n)}(e=Bu(e),t,n)},dr.invoke=rl,dr.isArguments=vu,dr.isArray=yu,dr.isArrayBuffer=gu,dr.isArrayLike=bu,dr.isArrayLikeObject=_u,dr.isBoolean=function(e){return!0===e||!1===e||Ou(e)&&Xr(e)==V},dr.isBuffer=Eu,dr.isDate=wu,dr.isElement=function(e){return Ou(e)&&1===e.nodeType&&!ju(e)},dr.isEmpty=function(e){if(null==e)return!0;if(bu(e)&&(yu(e)||"string"==typeof e||"function"==typeof e.splice||Eu(e)||Du(e)||vu(e)))return!e.length;var t=$a(e);if(t==Y||t==ne)return!e.size;if(Za(e))return!co(e).length;for(var n in e)if(st.call(e,n))return!1;return!0},dr.isEqual=function(e,t){return ao(e,t)},dr.isEqualWith=function(e,t,n){var r=(n="function"==typeof n?n:a)?n(e,t):a;return r===a?ao(e,t,a,n):!!r},dr.isError=xu,dr.isFinite=function(e){return"number"==typeof e&&$n(e)},dr.isFunction=Su,dr.isInteger=ku,dr.isLength=Nu,dr.isMap=Cu,dr.isMatch=function(e,t){return e===t||io(e,t,za(t))},dr.isMatchWith=function(e,t,n){return n="function"==typeof n?n:a,io(e,t,za(t),n)},dr.isNaN=function(e){return Pu(e)&&e!=+e},dr.isNative=function(e){if(Ya(e))throw new Xe(u);return uo(e)},dr.isNil=function(e){return null==e},dr.isNull=function(e){return null===e},dr.isNumber=Pu,dr.isObject=Tu,dr.isObjectLike=Ou,dr.isPlainObject=ju,dr.isRegExp=Ru,dr.isSafeInteger=function(e){return ku(e)&&e>=-A&&e<=A},dr.isSet=Iu,dr.isString=Au,dr.isSymbol=Uu,dr.isTypedArray=Du,dr.isUndefined=function(e){return e===a},dr.isWeakMap=function(e){return Ou(e)&&$a(e)==ie},dr.isWeakSet=function(e){return Ou(e)&&Xr(e)==ue},dr.join=function(e,t){return null==e?"":Bn.call(e,t)},dr.kebabCase=yl,dr.last=xi,dr.lastIndexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r;return n!==a&&(o=(o=Wu(n))<0?qn(r+o,0):Hn(o,r-1)),t==t?function(e,t,n){for(var r=n+1;r--;)if(e[r]===t)return r;return r}(e,t,o):un(e,sn,o,!0)},dr.lowerCase=gl,dr.lowerFirst=bl,dr.lt=Mu,dr.lte=zu,dr.max=function(e){return e&&e.length?$r(e,Pl,Jr):a},dr.maxBy=function(e,t){return e&&e.length?$r(e,Da(t,2),Jr):a},dr.mean=function(e){return fn(e,Pl)},dr.meanBy=function(e,t){return fn(e,Da(t,2))},dr.min=function(e){return e&&e.length?$r(e,Pl,fo):a},dr.minBy=function(e,t){return e&&e.length?$r(e,Da(t,2),fo):a},dr.stubArray=$l,dr.stubFalse=Bl,dr.stubObject=function(){return{}},dr.stubString=function(){return""},dr.stubTrue=function(){return!0},dr.multiply=Ql,dr.nth=function(e,t){return e&&e.length?yo(e,Wu(t)):a},dr.noConflict=function(){return It._===this&&(It._=ht),this},dr.noop=Ul,dr.now=Ji,dr.pad=function(e,t,n){e=qu(e);var r=(t=Wu(t))?jn(e):0;if(!t||r>=t)return e;var o=(t-r)/2;return ga(Ln(o),n)+e+ga(zn(o),n)},dr.padEnd=function(e,t,n){e=qu(e);var r=(t=Wu(t))?jn(e):0;return t&&r<t?e+ga(t-r,n):e},dr.padStart=function(e,t,n){e=qu(e);var r=(t=Wu(t))?jn(e):0;return t&&r<t?ga(t-r,n)+e:e},dr.parseInt=function(e,t,n){return n||null==t?t=0:t&&(t=+t),Gn(qu(e).replace(Ue,""),t||0)},dr.random=function(e,t,n){if(n&&"boolean"!=typeof n&&Ka(e,t,n)&&(t=n=a),n===a&&("boolean"==typeof t?(n=t,t=a):"boolean"==typeof e&&(n=e,e=a)),e===a&&t===a?(e=0,t=1):(e=Fu(e),t===a?(t=e,e=0):t=Fu(t)),e>t){var r=e;e=t,t=r}if(n||e%1||t%1){var o=Qn();return Hn(e+o*(t-e+Ct("1e-"+((o+"").length-1))),t)}return wo(e,t)},dr.reduce=function(e,t,n){var r=yu(e)?tn:mn,o=arguments.length<3;return r(e,Da(t,4),n,o,Lr)},dr.reduceRight=function(e,t,n){var r=yu(e)?nn:mn,o=arguments.length<3;return r(e,Da(t,4),n,o,Fr)},dr.repeat=function(e,t,n){return t=(n?Ka(e,t,n):t===a)?1:Wu(t),xo(qu(e),t)},dr.replace=function(){var e=arguments,t=qu(e[0]);return e.length<3?t:t.replace(e[1],e[2])},dr.result=function(e,t,n){var r=-1,o=(t=Ko(t,e)).length;for(o||(o=1,e=a);++r<o;){var i=null==e?a:e[si(t[r])];i===a&&(r=o,i=n),e=Su(i)?i.call(e):i}return e},dr.round=Yl,dr.runInContext=e,dr.sample=function(e){return(yu(e)?Sr:ko)(e)},dr.size=function(e){if(null==e)return 0;if(bu(e))return Au(e)?jn(e):e.length;var t=$a(e);return t==Y||t==ne?e.size:co(e).length},dr.snakeCase=_l,dr.some=function(e,t,n){var r=yu(e)?rn:Ro;return n&&Ka(e,t,n)&&(t=a),r(e,Da(t,3))},dr.sortedIndex=function(e,t){return Io(e,t)},dr.sortedIndexBy=function(e,t,n){return Ao(e,t,Da(n,2))},dr.sortedIndexOf=function(e,t){var n=null==e?0:e.length;if(n){var r=Io(e,t);if(r<n&&du(e[r],t))return r}return-1},dr.sortedLastIndex=function(e,t){return Io(e,t,!0)},dr.sortedLastIndexBy=function(e,t,n){return Ao(e,t,Da(n,2),!0)},dr.sortedLastIndexOf=function(e,t){if(null!=e&&e.length){var n=Io(e,t,!0)-1;if(du(e[n],t))return n}return-1},dr.startCase=El,dr.startsWith=function(e,t,n){return e=qu(e),n=null==n?0:Ar(Wu(n),0,e.length),t=Mo(t),e.slice(n,n+t.length)==t},dr.subtract=Zl,dr.sum=function(e){return e&&e.length?hn(e,Pl):0},dr.sumBy=function(e,t){return e&&e.length?hn(e,Da(t,2)):0},dr.template=function(e,t,n){var r=dr.templateSettings;n&&Ka(e,t,n)&&(t=a),e=qu(e),t=Gu({},t,r,Na);var o,i,u=Gu({},t.imports,r.imports,Na),l=ol(u),c=gn(u,l),s=0,f=t.interpolate||Ye,p="__p += '",d=nt((t.escape||Ye).source+"|"+f.source+"|"+(f===Oe?$e:Ye).source+"|"+(t.evaluate||Ye).source+"|$","g"),m="//# sourceURL="+("sourceURL"in t?t.sourceURL:"lodash.templateSources["+ ++kt+"]")+"\n";e.replace(d,function(t,n,r,a,u,l){return r||(r=a),p+=e.slice(s,l).replace(Ze,Sn),n&&(o=!0,p+="' +\n__e("+n+") +\n'"),u&&(i=!0,p+="';\n"+u+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),s=l+t.length,t}),p+="';\n";var h=t.variable;h||(p="with (obj) {\n"+p+"\n}\n"),p=(i?p.replace(be,""):p).replace(_e,"$1").replace(Ee,"$1;"),p="function("+(h||"obj")+") {\n"+(h?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(i?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var v=kl(function(){return Je(l,m+"return "+p).apply(a,c)});if(v.source=p,xu(v))throw v;return v},dr.times=function(e,t){if((e=Wu(e))<1||e>A)return[];var n=M,r=Hn(e,M);t=Da(t),e-=M;for(var o=vn(r,t);++n<e;)t(n);return o},dr.toFinite=Fu,dr.toInteger=Wu,dr.toLength=$u,dr.toLower=function(e){return qu(e).toLowerCase()},dr.toNumber=Bu,dr.toSafeInteger=function(e){return e?Ar(Wu(e),-A,A):0===e?e:0},dr.toString=qu,dr.toUpper=function(e){return qu(e).toUpperCase()},dr.trim=function(e,t,n){if((e=qu(e))&&(n||t===a))return e.replace(Ae,"");if(!e||!(t=Mo(t)))return e;var r=Rn(e),o=Rn(t);return Qo(r,_n(r,o),En(r,o)+1).join("")},dr.trimEnd=function(e,t,n){if((e=qu(e))&&(n||t===a))return e.replace(De,"");if(!e||!(t=Mo(t)))return e;var r=Rn(e);return Qo(r,0,En(r,Rn(t))+1).join("")},dr.trimStart=function(e,t,n){if((e=qu(e))&&(n||t===a))return e.replace(Ue,"");if(!e||!(t=Mo(t)))return e;var r=Rn(e);return Qo(r,_n(r,Rn(t))).join("")},dr.truncate=function(e,t){var n=T,r=O;if(Tu(t)){var o="separator"in t?t.separator:o;n="length"in t?Wu(t.length):n,r="omission"in t?Mo(t.omission):r}var i=(e=qu(e)).length;if(kn(e)){var u=Rn(e);i=u.length}if(n>=i)return e;var l=n-jn(r);if(l<1)return r;var c=u?Qo(u,0,l).join(""):e.slice(0,l);if(o===a)return c+r;if(u&&(l+=c.length-l),Ru(o)){if(e.slice(l).search(o)){var s,f=c;for(o.global||(o=nt(o.source,qu(Be.exec(o))+"g")),o.lastIndex=0;s=o.exec(f);)var p=s.index;c=c.slice(0,p===a?l:p)}}else if(e.indexOf(Mo(o),l)!=l){var d=c.lastIndexOf(o);d>-1&&(c=c.slice(0,d))}return c+r},dr.unescape=function(e){return(e=qu(e))&&Se.test(e)?e.replace(we,In):e},dr.uniqueId=function(e){var t=++ft;return qu(e)+t},dr.upperCase=wl,dr.upperFirst=xl,dr.each=qi,dr.eachRight=Hi,dr.first=bi,Al(dr,(Gl={},Kr(dr,function(e,t){st.call(dr.prototype,t)||(Gl[t]=e)}),Gl),{chain:!1}),dr.VERSION="4.17.11",Kt(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){dr[e].placeholder=dr}),Kt(["drop","take"],function(e,t){yr.prototype[e]=function(n){n=n===a?1:qn(Wu(n),0);var r=this.__filtered__&&!t?new yr(this):this.clone();return r.__filtered__?r.__takeCount__=Hn(n,r.__takeCount__):r.__views__.push({size:Hn(n,M),type:e+(r.__dir__<0?"Right":"")}),r},yr.prototype[e+"Right"]=function(t){return this.reverse()[e](t).reverse()}}),Kt(["filter","map","takeWhile"],function(e,t){var n=t+1,r=n==j||3==n;yr.prototype[e]=function(e){var t=this.clone();return t.__iteratees__.push({iteratee:Da(e,3),type:n}),t.__filtered__=t.__filtered__||r,t}}),Kt(["head","last"],function(e,t){var n="take"+(t?"Right":"");yr.prototype[e]=function(){return this[n](1).value()[0]}}),Kt(["initial","tail"],function(e,t){var n="drop"+(t?"":"Right");yr.prototype[e]=function(){return this.__filtered__?new yr(this):this[n](1)}}),yr.prototype.compact=function(){return this.filter(Pl)},yr.prototype.find=function(e){return this.filter(e).head()},yr.prototype.findLast=function(e){return this.reverse().find(e)},yr.prototype.invokeMap=So(function(e,t){return"function"==typeof e?new yr(this):this.map(function(n){return ro(n,e,t)})}),yr.prototype.reject=function(e){return this.filter(lu(Da(e)))},yr.prototype.slice=function(e,t){e=Wu(e);var n=this;return n.__filtered__&&(e>0||t<0)?new yr(n):(e<0?n=n.takeRight(-e):e&&(n=n.drop(e)),t!==a&&(n=(t=Wu(t))<0?n.dropRight(-t):n.take(t-e)),n)},yr.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},yr.prototype.toArray=function(){return this.take(M)},Kr(yr.prototype,function(e,t){var n=/^(?:filter|find|map|reject)|While$/.test(t),r=/^(?:head|last)$/.test(t),o=dr[r?"take"+("last"==t?"Right":""):t],i=r||/^find/.test(t);o&&(dr.prototype[t]=function(){var t=this.__wrapped__,u=r?[1]:arguments,l=t instanceof yr,c=u[0],s=l||yu(t),f=function(e){var t=o.apply(dr,en([e],u));return r&&p?t[0]:t};s&&n&&"function"==typeof c&&1!=c.length&&(l=s=!1);var p=this.__chain__,d=!!this.__actions__.length,m=i&&!p,h=l&&!d;if(!i&&s){t=h?t:new yr(this);var v=e.apply(t,u);return v.__actions__.push({func:Fi,args:[f],thisArg:a}),new vr(v,p)}return m&&h?e.apply(this,u):(v=this.thru(f),m?r?v.value()[0]:v.value():v)})}),Kt(["pop","push","shift","sort","splice","unshift"],function(e){var t=at[e],n=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",r=/^(?:pop|shift)$/.test(e);dr.prototype[e]=function(){var e=arguments;if(r&&!this.__chain__){var o=this.value();return t.apply(yu(o)?o:[],e)}return this[n](function(n){return t.apply(yu(n)?n:[],e)})}}),Kr(yr.prototype,function(e,t){var n=dr[t];if(n){var r=n.name+"";(or[r]||(or[r]=[])).push({name:t,func:n})}}),or[ma(a,g).name]=[{name:"wrapper",func:a}],yr.prototype.clone=function(){var e=new yr(this.__wrapped__);return e.__actions__=ra(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=ra(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=ra(this.__views__),e},yr.prototype.reverse=function(){if(this.__filtered__){var e=new yr(this);e.__dir__=-1,e.__filtered__=!0}else(e=this.clone()).__dir__*=-1;return e},yr.prototype.value=function(){var e=this.__wrapped__.value(),t=this.__dir__,n=yu(e),r=t<0,o=n?e.length:0,a=function(e,t,n){for(var r=-1,o=n.length;++r<o;){var a=n[r],i=a.size;switch(a.type){case"drop":e+=i;break;case"dropRight":t-=i;break;case"take":t=Hn(t,e+i);break;case"takeRight":e=qn(e,t-i)}}return{start:e,end:t}}(0,o,this.__views__),i=a.start,u=a.end,l=u-i,c=r?u:i-1,s=this.__iteratees__,f=s.length,p=0,d=Hn(l,this.__takeCount__);if(!n||!r&&o==l&&d==l)return $o(e,this.__actions__);var m=[];e:for(;l--&&p<d;){for(var h=-1,v=e[c+=t];++h<f;){var y=s[h],g=y.iteratee,b=y.type,_=g(v);if(b==R)v=_;else if(!_){if(b==j)continue e;break e}}m[p++]=v}return m},dr.prototype.at=Wi,dr.prototype.chain=function(){return Li(this)},dr.prototype.commit=function(){return new vr(this.value(),this.__chain__)},dr.prototype.next=function(){this.__values__===a&&(this.__values__=Lu(this.value()));var e=this.__index__>=this.__values__.length;return{done:e,value:e?a:this.__values__[this.__index__++]}},dr.prototype.plant=function(e){for(var t,n=this;n instanceof hr;){var r=pi(n);r.__index__=0,r.__values__=a,t?o.__wrapped__=r:t=r;var o=r;n=n.__wrapped__}return o.__wrapped__=e,t},dr.prototype.reverse=function(){var e=this.__wrapped__;if(e instanceof yr){var t=e;return this.__actions__.length&&(t=new yr(this)),(t=t.reverse()).__actions__.push({func:Fi,args:[Ti],thisArg:a}),new vr(t,this.__chain__)}return this.thru(Ti)},dr.prototype.toJSON=dr.prototype.valueOf=dr.prototype.value=function(){return $o(this.__wrapped__,this.__actions__)},dr.prototype.first=dr.prototype.head,zt&&(dr.prototype[zt]=function(){return this}),dr}();It._=An,(o=function(){return An}.call(t,n,t,r))===a||(r.exports=o)}).call(this)}).call(this,n(4),n(15)(e))},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){var r=n(28),o="object"==typeof self&&self&&self.Object===Object&&self,a=r||o||Function("return this")();e.exports=a},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t,n){"use strict";var r=n(17),o={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},a={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},i={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},u={};function l(e){return r.isMemo(e)?i:u[e.$$typeof]||o}u[r.ForwardRef]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0};var c=Object.defineProperty,s=Object.getOwnPropertyNames,f=Object.getOwnPropertySymbols,p=Object.getOwnPropertyDescriptor,d=Object.getPrototypeOf,m=Object.prototype;e.exports=function e(t,n,r){if("string"!=typeof n){if(m){var o=d(n);o&&o!==m&&e(t,o,r)}var i=s(n);f&&(i=i.concat(f(n)));for(var u=l(t),h=l(n),v=0;v<i.length;++v){var y=i[v];if(!(a[y]||r&&r[y]||h&&h[y]||u&&u[y])){var g=p(n,y);try{c(t,y,g)}catch(e){}}}return t}return t}},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o,a,i,u){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,o,a,i,u],s=0;(l=new Error(t.replace(/%s/g,function(){return c[s++]}))).name="Invariant Violation"}throw l.framesToPop=1,l}}},function(e,t,n){var r=n(52),o=n(53),a=n(54),i=n(55),u=n(56);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=a,l.prototype.has=i,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(11);e.exports=function(e,t){for(var n=e.length;n--;)if(r(e[n][0],t))return n;return-1}},function(e,t){e.exports=function(e,t){return e===t||e!=e&&t!=t}},function(e,t,n){var r=n(27),o=n(63),a=n(64),i="[object Null]",u="[object Undefined]",l=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?u:i:l&&l in Object(e)?o(e):a(e)}},function(e,t,n){var r=n(18)(Object,"create");e.exports=r},function(e,t,n){var r=n(78);e.exports=function(e,t){var n=e.__data__;return r(t)?n["string"==typeof t?"string":"hash"]:n.map}},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";!function e(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)}catch(e){console.error(e)}}(),e.exports=n(46)},function(e,t,n){"use strict";e.exports=n(119)},function(e,t,n){var r=n(62),o=n(68);e.exports=function(e,t){var n=o(e,t);return r(n)?n:void 0}},function(e,t,n){var r=n(12),o=n(3),a="[object AsyncFunction]",i="[object Function]",u="[object GeneratorFunction]",l="[object Proxy]";e.exports=function(e){if(!o(e))return!1;var t=r(e);return t==i||t==u||t==a||t==l}},function(e,t,n){var r=n(30);e.exports=function(e,t,n){"__proto__"==t&&r?r(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}},function(e,t,n){var r=n(19),o=n(35);e.exports=function(e){return null!=e&&o(e.length)&&!r(e)}},function(e,t,n){"use strict";(function(e,r){var o,a=n(43);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var i=Object(a.a)(o);t.a=i}).call(this,n(4),n(116)(e))},function(e,t,n){var r=n(124);e.exports=d,e.exports.parse=a,e.exports.compile=function(e,t){return u(a(e,t))},e.exports.tokensToFunction=u,e.exports.tokensToRegExp=p;var o=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function a(e,t){for(var n,r=[],a=0,i=0,u="",s=t&&t.delimiter||"/";null!=(n=o.exec(e));){var f=n[0],p=n[1],d=n.index;if(u+=e.slice(i,d),i=d+f.length,p)u+=p[1];else{var m=e[i],h=n[2],v=n[3],y=n[4],g=n[5],b=n[6],_=n[7];u&&(r.push(u),u="");var E=null!=h&&null!=m&&m!==h,w="+"===b||"*"===b,x="?"===b||"*"===b,S=n[2]||s,k=y||g;r.push({name:v||a++,prefix:h||"",delimiter:S,optional:x,repeat:w,partial:E,asterisk:!!_,pattern:k?c(k):_?".*":"[^"+l(S)+"]+?"})}}return i<e.length&&(u+=e.substr(i)),u&&r.push(u),r}function i(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function u(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,o){for(var a="",u=n||{},l=(o||{}).pretty?i:encodeURIComponent,c=0;c<e.length;c++){var s=e[c];if("string"!=typeof s){var f,p=u[s.name];if(null==p){if(s.optional){s.partial&&(a+=s.prefix);continue}throw new TypeError('Expected "'+s.name+'" to be defined')}if(r(p)){if(!s.repeat)throw new TypeError('Expected "'+s.name+'" to not repeat, but received `'+JSON.stringify(p)+"`");if(0===p.length){if(s.optional)continue;throw new TypeError('Expected "'+s.name+'" to not be empty')}for(var d=0;d<p.length;d++){if(f=l(p[d]),!t[c].test(f))throw new TypeError('Expected all "'+s.name+'" to match "'+s.pattern+'", but received `'+JSON.stringify(f)+"`");a+=(0===d?s.prefix:s.delimiter)+f}}else{if(f=s.asterisk?encodeURI(p).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}):l(p),!t[c].test(f))throw new TypeError('Expected "'+s.name+'" to match "'+s.pattern+'", but received "'+f+'"');a+=s.prefix+f}}else a+=s}return a}}function l(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function c(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function s(e,t){return e.keys=t,e}function f(e){return e.sensitive?"":"i"}function p(e,t,n){r(t)||(n=t||n,t=[]);for(var o=(n=n||{}).strict,a=!1!==n.end,i="",u=0;u<e.length;u++){var c=e[u];if("string"==typeof c)i+=l(c);else{var p=l(c.prefix),d="(?:"+c.pattern+")";t.push(c),c.repeat&&(d+="(?:"+p+d+")*"),i+=d=c.optional?c.partial?p+"("+d+")?":"(?:"+p+"("+d+"))?":p+"("+d+")"}}var m=l(n.delimiter||"/"),h=i.slice(-m.length)===m;return o||(i=(h?i.slice(0,-m.length):i)+"(?:"+m+"(?=$))?"),i+=a?"$":o&&h?"":"(?="+m+"|$)",s(new RegExp("^"+i,f(n)),t)}function d(e,t,n){return r(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return s(e,t)}(e,t):r(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(d(e[o],t,n).source);return s(new RegExp("(?:"+r.join("|")+")",f(n)),t)}(e,t,n):function(e,t,n){return p(a(e,n),t,n)}(e,t,n)}},,function(e,t,n){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,i,u=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),l=1;l<arguments.length;l++){for(var c in n=Object(arguments[l]))o.call(n,c)&&(u[c]=n[c]);if(r){i=r(n);for(var s=0;s<i.length;s++)a.call(n,i[s])&&(u[i[s]]=n[i[s]])}}return u}},function(e,t,n){var r=n(18)(n(5),"Map");e.exports=r},function(e,t,n){var r=n(5).Symbol;e.exports=r},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(this,n(4))},function(e,t,n){var r=n(20),o=n(11);e.exports=function(e,t,n){(void 0===n||o(e[t],n))&&(void 0!==n||t in e)||r(e,t,n)}},function(e,t,n){var r=n(18),o=function(){try{var e=r(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,n){var r=n(92)(Object.getPrototypeOf,Object);e.exports=r},function(e,t){var n=Object.prototype;e.exports=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||n)}},function(e,t,n){var r=n(93),o=n(6),a=Object.prototype,i=a.hasOwnProperty,u=a.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&i.call(e,"callee")&&!u.call(e,"callee")};e.exports=l},function(e,t){var n=Array.isArray;e.exports=n},function(e,t){var n=9007199254740991;e.exports=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=n}},function(e,t,n){(function(e){var r=n(5),o=n(95),a=t&&!t.nodeType&&t,i=a&&"object"==typeof e&&e&&!e.nodeType&&e,u=i&&i.exports===a?r.Buffer:void 0,l=(u?u.isBuffer:void 0)||o;e.exports=l}).call(this,n(15)(e))},function(e,t,n){var r=n(97),o=n(98),a=n(99),i=a&&a.isTypedArray,u=i?o(i):r;e.exports=u},function(e,t){e.exports=function(e,t){if("__proto__"!=t)return e[t]}},function(e,t,n){var r=n(103),o=n(105),a=n(21);e.exports=function(e){return a(e)?r(e,!0):o(e)}},function(e,t){var n=9007199254740991,r=/^(?:0|[1-9]\d*)$/;e.exports=function(e,t){var o=typeof e;return!!(t=null==t?n:t)&&("number"==o||"symbol"!=o&&r.test(e))&&e>-1&&e%1==0&&e<t}},function(e,t){e.exports=function(e){return e}},function(e,t,n){(function(e){!function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function a(e,t){a.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function u(e,t,n){u.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function l(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function c(e){var t=void 0===e?"undefined":x(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function s(e,t,n,r,f,p,d){d=d||[];var m=(f=f||[]).slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(m,p))return;if("object"===(void 0===r?"undefined":x(r))){if(r.prefilter&&r.prefilter(m,p))return;if(r.normalize){var h=r.normalize(m,p,e,t);h&&(e=h[0],t=h[1])}}}m.push(p)}"regexp"===c(e)&&"regexp"===c(t)&&(e=e.toString(),t=t.toString());var v=void 0===e?"undefined":x(e),y=void 0===t?"undefined":x(t),g="undefined"!==v||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),b="undefined"!==y||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!g&&b)n(new a(m,t));else if(!b&&g)n(new i(m,e));else if(c(e)!==c(t))n(new o(m,e,t));else if("date"===c(e)&&e-t!=0)n(new o(m,e,t));else if("object"===v&&null!==e&&null!==t)if(d.filter(function(t){return t.lhs===e}).length)e!==t&&n(new o(m,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var _;for(e.length,_=0;_<e.length;_++)_>=t.length?n(new u(m,_,new i(void 0,e[_]))):s(e[_],t[_],n,r,m,_,d);for(;_<t.length;)n(new u(m,_,new a(void 0,t[_++])))}else{var E=Object.keys(e),w=Object.keys(t);E.forEach(function(o,a){var i=w.indexOf(o);i>=0?(s(e[o],t[o],n,r,m,o,d),w=l(w,i)):s(e[o],void 0,n,r,m,o,d)}),w.forEach(function(e){s(void 0,t[e],n,r,m,e,d)})}d.length=d.length-1}else e!==t&&("number"===v&&isNaN(e)&&isNaN(t)||n(new o(m,e,t)))}function f(e,t,n,r){return r=r||[],s(e,t,function(e){e&&r.push(e)},n),r.length?r:void 0}function p(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,a=n.path?n.path.length-1:0;++o<a;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,a=t[n],i=r.path.length-1;for(o=0;o<i;o++)a=a[r.path[o]];switch(r.kind){case"A":e(a[r.path[o]],r.index,r.item);break;case"D":delete a[r.path[o]];break;case"E":case"N":a[r.path[o]]=r.rhs}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":t=l(t,n);break;case"E":case"N":t[n]=r.rhs}return t}(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function d(e){return"color: "+N[e].color+"; font-weight: bold"}function m(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach(function(e){var t=e.kind,r=function(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,a=e.index,i=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+a+"]",i];default:return[]}}(e);n.log.apply(n,["%c "+N[t].text,d(t)].concat(S(r)))}):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function h(e,t,n,r){switch(void 0===e?"undefined":x(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,S(n)):e[r];case"function":return e(t);default:return e}}function v(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,a=void 0===o?function(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var a=["action"];return a.push("%c"+String(e.type)),t&&a.push("%c@ "+r),n&&a.push("%c(in "+o.toFixed(2)+" ms)"),a.join(" ")}}(t):o,i=t.collapsed,u=t.colors,l=t.level,c=t.diff,s=void 0===t.titleFormatter;e.forEach(function(o,f){var p=o.started,d=o.startedTime,v=o.action,y=o.prevState,g=o.error,b=o.took,_=o.nextState,w=e[f+1];w&&(_=w.prevState,b=w.started-p);var x=r(v),S="function"==typeof i?i(function(){return _},v,o):i,k=E(d),N=u.title?"color: "+u.title(x)+";":"",T=["color: gray; font-weight: lighter;"];T.push(N),t.timestamp&&T.push("color: gray; font-weight: lighter;"),t.duration&&T.push("color: gray; font-weight: lighter;");var O=a(x,k,b);try{S?u.title&&s?n.groupCollapsed.apply(n,["%c "+O].concat(T)):n.groupCollapsed(O):u.title&&s?n.group.apply(n,["%c "+O].concat(T)):n.group(O)}catch(e){n.log(O)}var C=h(l,x,[y],"prevState"),P=h(l,x,[x],"action"),j=h(l,x,[g,y],"error"),R=h(l,x,[_],"nextState");if(C)if(u.prevState){var I="color: "+u.prevState(y)+"; font-weight: bold";n[C]("%c prev state",I,y)}else n[C]("prev state",y);if(P)if(u.action){var A="color: "+u.action(x)+"; font-weight: bold";n[P]("%c action    ",A,x)}else n[P]("action    ",x);if(g&&j)if(u.error){var U="color: "+u.error(g,y)+"; font-weight: bold;";n[j]("%c error     ",U,g)}else n[j]("error     ",g);if(R)if(u.nextState){var D="color: "+u.nextState(_)+"; font-weight: bold";n[R]("%c next state",D,_)}else n[R]("next state",_);c&&m(y,_,n,S);try{n.groupEnd()}catch(e){n.log("—— log end ——")}})}function y(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},T,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,a=t.predicate,i=t.logErrors,u=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var l=[];return function(e){var n=e.getState;return function(e){return function(c){if("function"==typeof a&&!a(n,c))return e(c);var s={};l.push(s),s.started=w.now(),s.startedTime=new Date,s.prevState=r(n()),s.action=c;var f=void 0;if(i)try{f=e(c)}catch(e){s.error=o(e)}else f=e(c);s.took=w.now()-s.started,s.nextState=r(n());var p=t.diff&&"function"==typeof u?u(n,c):t.diff;if(v(l,Object.assign({},t,{diff:p})),l.length=0,s.error)throw s.error;return f}}}}var g,b,_=function(e,t){return function(e,t){return new Array(t+1).join(e)}("0",t-e.toString().length)+e},E=function(e){return _(e.getHours(),2)+":"+_(e.getMinutes(),2)+":"+_(e.getSeconds(),2)+"."+_(e.getMilliseconds(),3)},w="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,x="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},S=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},k=[];g="object"===(void 0===e?"undefined":x(e))&&e?e:"undefined"!=typeof window?window:{},(b=g.DeepDiff)&&k.push(function(){void 0!==b&&g.DeepDiff===f&&(g.DeepDiff=b,b=void 0)}),n(o,r),n(a,r),n(i,r),n(u,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:s,enumerable:!0},applyDiff:{value:function(e,t,n){e&&t&&s(e,t,function(r){n&&!n(e,t,r)||p(e,t,r)})},enumerable:!0},applyChange:{value:p,enumerable:!0},revertChange:{value:function(e,t,n){if(e&&t&&n&&n.kind){var r,o,a=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===a[n.path[r]]&&(a[n.path[r]]={}),a=a[n.path[r]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,a=t[n],i=r.path.length-1;for(o=0;o<i;o++)a=a[r.path[o]];switch(r.kind){case"A":e(a[r.path[o]],r.index,r.item);break;case"D":case"E":a[r.path[o]]=r.lhs;break;case"N":delete a[r.path[o]]}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":case"E":t[n]=r.lhs;break;case"N":t=l(t,n)}return t}(a[n.path[r]],n.index,n.item);break;case"D":case"E":a[n.path[r]]=n.lhs;break;case"N":delete a[n.path[r]]}}},enumerable:!0},isConflict:{value:function(){return void 0!==b},enumerable:!0},noConflict:{value:function(){return k&&(k.forEach(function(e){e()}),k=null),f},enumerable:!0}});var N={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},T={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},O=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?y()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=T,t.createLogger=y,t.logger=O,t.default=O,Object.defineProperty(t,"__esModule",{value:!0})}(t)}).call(this,n(4))},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}n.d(t,"a",function(){return r})},function(e,t,n){"use strict";t.__esModule=!0;var r=a(n(0)),o=a(n(120));function a(e){return e&&e.__esModule?e:{default:e}}t.default=r.default.createContext||o.default,e.exports=t.default},function(e,t,n){"use strict";
/** @license React v16.8.6
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(25),o="function"==typeof Symbol&&Symbol.for,a=o?Symbol.for("react.element"):60103,i=o?Symbol.for("react.portal"):60106,u=o?Symbol.for("react.fragment"):60107,l=o?Symbol.for("react.strict_mode"):60108,c=o?Symbol.for("react.profiler"):60114,s=o?Symbol.for("react.provider"):60109,f=o?Symbol.for("react.context"):60110,p=o?Symbol.for("react.concurrent_mode"):60111,d=o?Symbol.for("react.forward_ref"):60112,m=o?Symbol.for("react.suspense"):60113,h=o?Symbol.for("react.memo"):60115,v=o?Symbol.for("react.lazy"):60116,y="function"==typeof Symbol&&Symbol.iterator;function g(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);!function(e,t,n,r,o,a,i,u){if(!e){if(e=void 0,void 0===t)e=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,o,a,i,u],c=0;(e=Error(t.replace(/%s/g,function(){return l[c++]}))).name="Invariant Violation"}throw e.framesToPop=1,e}}(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}var b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_={};function E(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||b}function w(){}function x(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||b}E.prototype.isReactComponent={},E.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&g("85"),this.updater.enqueueSetState(this,e,t,"setState")},E.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},w.prototype=E.prototype;var S=x.prototype=new w;S.constructor=x,r(S,E.prototype),S.isPureReactComponent=!0;var k={current:null},N={current:null},T=Object.prototype.hasOwnProperty,O={key:!0,ref:!0,__self:!0,__source:!0};function C(e,t,n){var r=void 0,o={},i=null,u=null;if(null!=t)for(r in void 0!==t.ref&&(u=t.ref),void 0!==t.key&&(i=""+t.key),t)T.call(t,r)&&!O.hasOwnProperty(r)&&(o[r]=t[r]);var l=arguments.length-2;if(1===l)o.children=n;else if(1<l){for(var c=Array(l),s=0;s<l;s++)c[s]=arguments[s+2];o.children=c}if(e&&e.defaultProps)for(r in l=e.defaultProps)void 0===o[r]&&(o[r]=l[r]);return{$$typeof:a,type:e,key:i,ref:u,props:o,_owner:N.current}}function P(e){return"object"==typeof e&&null!==e&&e.$$typeof===a}var j=/\/+/g,R=[];function I(e,t,n,r){if(R.length){var o=R.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function A(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>R.length&&R.push(e)}function U(e,t,n){return null==e?0:function e(t,n,r,o){var u=typeof t;"undefined"!==u&&"boolean"!==u||(t=null);var l=!1;if(null===t)l=!0;else switch(u){case"string":case"number":l=!0;break;case"object":switch(t.$$typeof){case a:case i:l=!0}}if(l)return r(o,t,""===n?"."+D(t,0):n),1;if(l=0,n=""===n?".":n+":",Array.isArray(t))for(var c=0;c<t.length;c++){var s=n+D(u=t[c],c);l+=e(u,s,r,o)}else if(s=null===t||"object"!=typeof t?null:"function"==typeof(s=y&&t[y]||t["@@iterator"])?s:null,"function"==typeof s)for(t=s.call(t),c=0;!(u=t.next()).done;)l+=e(u=u.value,s=n+D(u,c++),r,o);else"object"===u&&g("31","[object Object]"==(r=""+t)?"object with keys {"+Object.keys(t).join(", ")+"}":r,"");return l}(e,"",t,n)}function D(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}(e.key):t.toString(36)}function M(e,t){e.func.call(e.context,t,e.count++)}function z(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?L(e,r,n,function(e){return e}):null!=e&&(P(e)&&(e=function(e,t){return{$$typeof:a,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(e,o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(j,"$&/")+"/")+n)),r.push(e))}function L(e,t,n,r,o){var a="";null!=n&&(a=(""+n).replace(j,"$&/")+"/"),U(e,z,t=I(t,a,r,o)),A(t)}function F(){var e=k.current;return null===e&&g("321"),e}var W={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return L(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;U(e,M,t=I(null,null,t,n)),A(t)},count:function(e){return U(e,function(){return null},null)},toArray:function(e){var t=[];return L(e,t,null,function(e){return e}),t},only:function(e){return P(e)||g("143"),e}},createRef:function(){return{current:null}},Component:E,PureComponent:x,createContext:function(e,t){return void 0===t&&(t=null),(e={$$typeof:f,_calculateChangedBits:t,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:s,_context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:d,render:e}},lazy:function(e){return{$$typeof:v,_ctor:e,_status:-1,_result:null}},memo:function(e,t){return{$$typeof:h,type:e,compare:void 0===t?null:t}},useCallback:function(e,t){return F().useCallback(e,t)},useContext:function(e,t){return F().useContext(e,t)},useEffect:function(e,t){return F().useEffect(e,t)},useImperativeHandle:function(e,t,n){return F().useImperativeHandle(e,t,n)},useDebugValue:function(){},useLayoutEffect:function(e,t){return F().useLayoutEffect(e,t)},useMemo:function(e,t){return F().useMemo(e,t)},useReducer:function(e,t,n){return F().useReducer(e,t,n)},useRef:function(e){return F().useRef(e)},useState:function(e){return F().useState(e)},Fragment:u,StrictMode:l,Suspense:m,createElement:C,cloneElement:function(e,t,n){null==e&&g("267",e);var o=void 0,i=r({},e.props),u=e.key,l=e.ref,c=e._owner;if(null!=t){void 0!==t.ref&&(l=t.ref,c=N.current),void 0!==t.key&&(u=""+t.key);var s=void 0;for(o in e.type&&e.type.defaultProps&&(s=e.type.defaultProps),t)T.call(t,o)&&!O.hasOwnProperty(o)&&(i[o]=void 0===t[o]&&void 0!==s?s[o]:t[o])}if(1===(o=arguments.length-2))i.children=n;else if(1<o){s=Array(o);for(var f=0;f<o;f++)s[f]=arguments[f+2];i.children=s}return{$$typeof:a,type:e.type,key:u,ref:l,props:i,_owner:c}},createFactory:function(e){var t=C.bind(null,e);return t.type=e,t},isValidElement:P,version:"16.8.6",unstable_ConcurrentMode:p,unstable_Profiler:c,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentDispatcher:k,ReactCurrentOwner:N,assign:r}},$={default:W},B=$&&W||$;e.exports=B.default||B},function(e,t,n){"use strict";
/** @license React v16.8.6
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(0),o=n(25),a=n(47);function i(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);!function(e,t,n,r,o,a,i,u){if(!e){if(e=void 0,void 0===t)e=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,o,a,i,u],c=0;(e=Error(t.replace(/%s/g,function(){return l[c++]}))).name="Invariant Violation"}throw e.framesToPop=1,e}}(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}r||i("227");var u=!1,l=null,c=!1,s=null,f={onError:function(e){u=!0,l=e}};function p(e,t,n,r,o,a,i,c,s){u=!1,l=null,function(e,t,n,r,o,a,i,u,l){var c=Array.prototype.slice.call(arguments,3);try{t.apply(n,c)}catch(e){this.onError(e)}}.apply(f,arguments)}var d=null,m={};function h(){if(d)for(var e in m){var t=m[e],n=d.indexOf(e);if(-1<n||i("96",e),!y[n])for(var r in t.extractEvents||i("97",e),y[n]=t,n=t.eventTypes){var o=void 0,a=n[r],u=t,l=r;g.hasOwnProperty(l)&&i("99",l),g[l]=a;var c=a.phasedRegistrationNames;if(c){for(o in c)c.hasOwnProperty(o)&&v(c[o],u,l);o=!0}else a.registrationName?(v(a.registrationName,u,l),o=!0):o=!1;o||i("98",r,e)}}}function v(e,t,n){b[e]&&i("100",e),b[e]=t,_[e]=t.eventTypes[n].dependencies}var y=[],g={},b={},_={},E=null,w=null,x=null;function S(e,t,n){var r=e.type||"unknown-event";e.currentTarget=x(n),function(e,t,n,r,o,a,f,d,m){if(p.apply(this,arguments),u){if(u){var h=l;u=!1,l=null}else i("198"),h=void 0;c||(c=!0,s=h)}}(r,t,void 0,e),e.currentTarget=null}function k(e,t){return null==t&&i("30"),null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function N(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}var T=null;function O(e){if(e){var t=e._dispatchListeners,n=e._dispatchInstances;if(Array.isArray(t))for(var r=0;r<t.length&&!e.isPropagationStopped();r++)S(e,t[r],n[r]);else t&&S(e,t,n);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}var C={injectEventPluginOrder:function(e){d&&i("101"),d=Array.prototype.slice.call(e),h()},injectEventPluginsByName:function(e){var t,n=!1;for(t in e)if(e.hasOwnProperty(t)){var r=e[t];m.hasOwnProperty(t)&&m[t]===r||(m[t]&&i("102",t),m[t]=r,n=!0)}n&&h()}};function P(e,t){var n=e.stateNode;if(!n)return null;var r=E(n);if(!r)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":(r=!r.disabled)||(r=!("button"===(e=e.type)||"input"===e||"select"===e||"textarea"===e)),e=!r;break e;default:e=!1}return e?null:(n&&"function"!=typeof n&&i("231",t,typeof n),n)}function j(e){if(null!==e&&(T=k(T,e)),e=T,T=null,e&&(N(e,O),T&&i("95"),c))throw e=s,c=!1,s=null,e}var R=Math.random().toString(36).slice(2),I="__reactInternalInstance$"+R,A="__reactEventHandlers$"+R;function U(e){if(e[I])return e[I];for(;!e[I];){if(!e.parentNode)return null;e=e.parentNode}return 5===(e=e[I]).tag||6===e.tag?e:null}function D(e){return!(e=e[I])||5!==e.tag&&6!==e.tag?null:e}function M(e){if(5===e.tag||6===e.tag)return e.stateNode;i("33")}function z(e){return e[A]||null}function L(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function F(e,t,n){(t=P(e,n.dispatchConfig.phasedRegistrationNames[t]))&&(n._dispatchListeners=k(n._dispatchListeners,t),n._dispatchInstances=k(n._dispatchInstances,e))}function W(e){if(e&&e.dispatchConfig.phasedRegistrationNames){for(var t=e._targetInst,n=[];t;)n.push(t),t=L(t);for(t=n.length;0<t--;)F(n[t],"captured",e);for(t=0;t<n.length;t++)F(n[t],"bubbled",e)}}function $(e,t,n){e&&n&&n.dispatchConfig.registrationName&&(t=P(e,n.dispatchConfig.registrationName))&&(n._dispatchListeners=k(n._dispatchListeners,t),n._dispatchInstances=k(n._dispatchInstances,e))}function B(e){e&&e.dispatchConfig.registrationName&&$(e._targetInst,null,e)}function V(e){N(e,W)}var q=!("undefined"==typeof window||!window.document||!window.document.createElement);function H(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var K={animationend:H("Animation","AnimationEnd"),animationiteration:H("Animation","AnimationIteration"),animationstart:H("Animation","AnimationStart"),transitionend:H("Transition","TransitionEnd")},G={},Q={};function Y(e){if(G[e])return G[e];if(!K[e])return e;var t,n=K[e];for(t in n)if(n.hasOwnProperty(t)&&t in Q)return G[e]=n[t];return e}q&&(Q=document.createElement("div").style,"AnimationEvent"in window||(delete K.animationend.animation,delete K.animationiteration.animation,delete K.animationstart.animation),"TransitionEvent"in window||delete K.transitionend.transition);var Z=Y("animationend"),X=Y("animationiteration"),J=Y("animationstart"),ee=Y("transitionend"),te="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ne=null,re=null,oe=null;function ae(){if(oe)return oe;var e,t,n=re,r=n.length,o="value"in ne?ne.value:ne.textContent,a=o.length;for(e=0;e<r&&n[e]===o[e];e++);var i=r-e;for(t=1;t<=i&&n[r-t]===o[a-t];t++);return oe=o.slice(e,1<t?1-t:void 0)}function ie(){return!0}function ue(){return!1}function le(e,t,n,r){for(var o in this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n,e=this.constructor.Interface)e.hasOwnProperty(o)&&((t=e[o])?this[o]=t(n):"target"===o?this.target=r:this[o]=n[o]);return this.isDefaultPrevented=(null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue)?ie:ue,this.isPropagationStopped=ue,this}function ce(e,t,n,r){if(this.eventPool.length){var o=this.eventPool.pop();return this.call(o,e,t,n,r),o}return new this(e,t,n,r)}function se(e){e instanceof this||i("279"),e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function fe(e){e.eventPool=[],e.getPooled=ce,e.release=se}o(le.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=ie)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=ie)},persist:function(){this.isPersistent=ie},isPersistent:ue,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;this.nativeEvent=this._targetInst=this.dispatchConfig=null,this.isPropagationStopped=this.isDefaultPrevented=ue,this._dispatchInstances=this._dispatchListeners=null}}),le.Interface={type:null,target:null,currentTarget:function(){return null},eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null},le.extend=function(e){function t(){}function n(){return r.apply(this,arguments)}var r=this;t.prototype=r.prototype;var a=new t;return o(a,n.prototype),n.prototype=a,n.prototype.constructor=n,n.Interface=o({},r.Interface,e),n.extend=r.extend,fe(n),n},fe(le);var pe=le.extend({data:null}),de=le.extend({data:null}),me=[9,13,27,32],he=q&&"CompositionEvent"in window,ve=null;q&&"documentMode"in document&&(ve=document.documentMode);var ye=q&&"TextEvent"in window&&!ve,ge=q&&(!he||ve&&8<ve&&11>=ve),be=String.fromCharCode(32),_e={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},Ee=!1;function we(e,t){switch(e){case"keyup":return-1!==me.indexOf(t.keyCode);case"keydown":return 229!==t.keyCode;case"keypress":case"mousedown":case"blur":return!0;default:return!1}}function xe(e){return"object"==typeof(e=e.detail)&&"data"in e?e.data:null}var Se=!1;var ke={eventTypes:_e,extractEvents:function(e,t,n,r){var o=void 0,a=void 0;if(he)e:{switch(e){case"compositionstart":o=_e.compositionStart;break e;case"compositionend":o=_e.compositionEnd;break e;case"compositionupdate":o=_e.compositionUpdate;break e}o=void 0}else Se?we(e,n)&&(o=_e.compositionEnd):"keydown"===e&&229===n.keyCode&&(o=_e.compositionStart);return o?(ge&&"ko"!==n.locale&&(Se||o!==_e.compositionStart?o===_e.compositionEnd&&Se&&(a=ae()):(re="value"in(ne=r)?ne.value:ne.textContent,Se=!0)),o=pe.getPooled(o,t,n,r),a?o.data=a:null!==(a=xe(n))&&(o.data=a),V(o),a=o):a=null,(e=ye?function(e,t){switch(e){case"compositionend":return xe(t);case"keypress":return 32!==t.which?null:(Ee=!0,be);case"textInput":return(e=t.data)===be&&Ee?null:e;default:return null}}(e,n):function(e,t){if(Se)return"compositionend"===e||!he&&we(e,t)?(e=ae(),oe=re=ne=null,Se=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return ge&&"ko"!==t.locale?null:t.data;default:return null}}(e,n))?((t=de.getPooled(_e.beforeInput,t,n,r)).data=e,V(t)):t=null,null===a?t:null===t?a:[a,t]}},Ne=null,Te=null,Oe=null;function Ce(e){if(e=w(e)){"function"!=typeof Ne&&i("280");var t=E(e.stateNode);Ne(e.stateNode,e.type,t)}}function Pe(e){Te?Oe?Oe.push(e):Oe=[e]:Te=e}function je(){if(Te){var e=Te,t=Oe;if(Oe=Te=null,Ce(e),t)for(e=0;e<t.length;e++)Ce(t[e])}}function Re(e,t){return e(t)}function Ie(e,t,n){return e(t,n)}function Ae(){}var Ue=!1;function De(e,t){if(Ue)return e(t);Ue=!0;try{return Re(e,t)}finally{Ue=!1,(null!==Te||null!==Oe)&&(Ae(),je())}}var Me={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ze(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!Me[e.type]:"textarea"===t}function Le(e){return(e=e.target||e.srcElement||window).correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function Fe(e){if(!q)return!1;var t=(e="on"+e)in document;return t||((t=document.createElement("div")).setAttribute(e,"return;"),t="function"==typeof t[e]),t}function We(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function $e(e){e._valueTracker||(e._valueTracker=function(e){var t=We(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&void 0!==n&&"function"==typeof n.get&&"function"==typeof n.set){var o=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(e){r=""+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}(e))}function Be(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=We(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}var Ve=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;Ve.hasOwnProperty("ReactCurrentDispatcher")||(Ve.ReactCurrentDispatcher={current:null});var qe=/^(.*)[\\\/]/,He="function"==typeof Symbol&&Symbol.for,Ke=He?Symbol.for("react.element"):60103,Ge=He?Symbol.for("react.portal"):60106,Qe=He?Symbol.for("react.fragment"):60107,Ye=He?Symbol.for("react.strict_mode"):60108,Ze=He?Symbol.for("react.profiler"):60114,Xe=He?Symbol.for("react.provider"):60109,Je=He?Symbol.for("react.context"):60110,et=He?Symbol.for("react.concurrent_mode"):60111,tt=He?Symbol.for("react.forward_ref"):60112,nt=He?Symbol.for("react.suspense"):60113,rt=He?Symbol.for("react.memo"):60115,ot=He?Symbol.for("react.lazy"):60116,at="function"==typeof Symbol&&Symbol.iterator;function it(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=at&&e[at]||e["@@iterator"])?e:null}function ut(e){if(null==e)return null;if("function"==typeof e)return e.displayName||e.name||null;if("string"==typeof e)return e;switch(e){case et:return"ConcurrentMode";case Qe:return"Fragment";case Ge:return"Portal";case Ze:return"Profiler";case Ye:return"StrictMode";case nt:return"Suspense"}if("object"==typeof e)switch(e.$$typeof){case Je:return"Context.Consumer";case Xe:return"Context.Provider";case tt:var t=e.render;return t=t.displayName||t.name||"",e.displayName||(""!==t?"ForwardRef("+t+")":"ForwardRef");case rt:return ut(e.type);case ot:if(e=1===e._status?e._result:null)return ut(e)}return null}function lt(e){var t="";do{e:switch(e.tag){case 3:case 4:case 6:case 7:case 10:case 9:var n="";break e;default:var r=e._debugOwner,o=e._debugSource,a=ut(e.type);n=null,r&&(n=ut(r.type)),r=a,a="",o?a=" (at "+o.fileName.replace(qe,"")+":"+o.lineNumber+")":n&&(a=" (created by "+n+")"),n="\n    in "+(r||"Unknown")+a}t+=n,e=e.return}while(e);return t}var ct=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,st=Object.prototype.hasOwnProperty,ft={},pt={};function dt(e,t,n,r,o){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t}var mt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){mt[e]=new dt(e,0,!1,e,null)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];mt[t]=new dt(t,1,!1,e[1],null)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){mt[e]=new dt(e,2,!1,e.toLowerCase(),null)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){mt[e]=new dt(e,2,!1,e,null)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){mt[e]=new dt(e,3,!1,e.toLowerCase(),null)}),["checked","multiple","muted","selected"].forEach(function(e){mt[e]=new dt(e,3,!0,e,null)}),["capture","download"].forEach(function(e){mt[e]=new dt(e,4,!1,e,null)}),["cols","rows","size","span"].forEach(function(e){mt[e]=new dt(e,6,!1,e,null)}),["rowSpan","start"].forEach(function(e){mt[e]=new dt(e,5,!1,e.toLowerCase(),null)});var ht=/[\-:]([a-z])/g;function vt(e){return e[1].toUpperCase()}function yt(e,t,n,r){var o=mt.hasOwnProperty(t)?mt[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(function(e,t,n,r){if(null==t||function(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}(e,t,n,r))return!0;if(r)return!1;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}(t,n,o,r)&&(n=null),r||null===o?function(e){return!!st.call(pt,e)||!st.call(ft,e)&&(ct.test(e)?pt[e]=!0:(ft[e]=!0,!1))}(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(n=3===(o=o.type)||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}function gt(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}function bt(e,t){var n=t.checked;return o({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function _t(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=gt(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function Et(e,t){null!=(t=t.checked)&&yt(e,"checked",t,!1)}function wt(e,t){Et(e,t);var n=gt(t.value),r=t.type;if(null!=n)"number"===r?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if("submit"===r||"reset"===r)return void e.removeAttribute("value");t.hasOwnProperty("value")?St(e,t.type,n):t.hasOwnProperty("defaultValue")&&St(e,t.type,gt(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function xt(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!("submit"!==r&&"reset"!==r||void 0!==t.value&&null!==t.value))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}""!==(n=e.name)&&(e.name=""),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!!e._wrapperState.initialChecked,""!==n&&(e.name=n)}function St(e,t,n){"number"===t&&e.ownerDocument.activeElement===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ht,vt);mt[t]=new dt(t,1,!1,e,null)}),"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ht,vt);mt[t]=new dt(t,1,!1,e,"http://www.w3.org/1999/xlink")}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ht,vt);mt[t]=new dt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace")}),["tabIndex","crossOrigin"].forEach(function(e){mt[e]=new dt(e,1,!1,e.toLowerCase(),null)});var kt={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Nt(e,t,n){return(e=le.getPooled(kt.change,e,t,n)).type="change",Pe(n),V(e),e}var Tt=null,Ot=null;function Ct(e){j(e)}function Pt(e){if(Be(M(e)))return e}function jt(e,t){if("change"===e)return t}var Rt=!1;function It(){Tt&&(Tt.detachEvent("onpropertychange",At),Ot=Tt=null)}function At(e){"value"===e.propertyName&&Pt(Ot)&&De(Ct,e=Nt(Ot,e,Le(e)))}function Ut(e,t,n){"focus"===e?(It(),Ot=n,(Tt=t).attachEvent("onpropertychange",At)):"blur"===e&&It()}function Dt(e){if("selectionchange"===e||"keyup"===e||"keydown"===e)return Pt(Ot)}function Mt(e,t){if("click"===e)return Pt(t)}function zt(e,t){if("input"===e||"change"===e)return Pt(t)}q&&(Rt=Fe("input")&&(!document.documentMode||9<document.documentMode));var Lt={eventTypes:kt,_isInputEventSupported:Rt,extractEvents:function(e,t,n,r){var o=t?M(t):window,a=void 0,i=void 0,u=o.nodeName&&o.nodeName.toLowerCase();if("select"===u||"input"===u&&"file"===o.type?a=jt:ze(o)?Rt?a=zt:(a=Dt,i=Ut):(u=o.nodeName)&&"input"===u.toLowerCase()&&("checkbox"===o.type||"radio"===o.type)&&(a=Mt),a&&(a=a(e,t)))return Nt(a,n,r);i&&i(e,o,t),"blur"===e&&(e=o._wrapperState)&&e.controlled&&"number"===o.type&&St(o,"number",o.value)}},Ft=le.extend({view:null,detail:null}),Wt={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function $t(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=Wt[e])&&!!t[e]}function Bt(){return $t}var Vt=0,qt=0,Ht=!1,Kt=!1,Gt=Ft.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Bt,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},movementX:function(e){if("movementX"in e)return e.movementX;var t=Vt;return Vt=e.screenX,Ht?"mousemove"===e.type?e.screenX-t:0:(Ht=!0,0)},movementY:function(e){if("movementY"in e)return e.movementY;var t=qt;return qt=e.screenY,Kt?"mousemove"===e.type?e.screenY-t:0:(Kt=!0,0)}}),Qt=Gt.extend({pointerId:null,width:null,height:null,pressure:null,tangentialPressure:null,tiltX:null,tiltY:null,twist:null,pointerType:null,isPrimary:null}),Yt={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",dependencies:["pointerout","pointerover"]}},Zt={eventTypes:Yt,extractEvents:function(e,t,n,r){var o="mouseover"===e||"pointerover"===e,a="mouseout"===e||"pointerout"===e;if(o&&(n.relatedTarget||n.fromElement)||!a&&!o)return null;if(o=r.window===r?r:(o=r.ownerDocument)?o.defaultView||o.parentWindow:window,a?(a=t,t=(t=n.relatedTarget||n.toElement)?U(t):null):a=null,a===t)return null;var i=void 0,u=void 0,l=void 0,c=void 0;"mouseout"===e||"mouseover"===e?(i=Gt,u=Yt.mouseLeave,l=Yt.mouseEnter,c="mouse"):"pointerout"!==e&&"pointerover"!==e||(i=Qt,u=Yt.pointerLeave,l=Yt.pointerEnter,c="pointer");var s=null==a?o:M(a);if(o=null==t?o:M(t),(e=i.getPooled(u,a,n,r)).type=c+"leave",e.target=s,e.relatedTarget=o,(n=i.getPooled(l,t,n,r)).type=c+"enter",n.target=o,n.relatedTarget=s,r=t,a&&r)e:{for(o=r,c=0,i=t=a;i;i=L(i))c++;for(i=0,l=o;l;l=L(l))i++;for(;0<c-i;)t=L(t),c--;for(;0<i-c;)o=L(o),i--;for(;c--;){if(t===o||t===o.alternate)break e;t=L(t),o=L(o)}t=null}else t=null;for(o=t,t=[];a&&a!==o&&(null===(c=a.alternate)||c!==o);)t.push(a),a=L(a);for(a=[];r&&r!==o&&(null===(c=r.alternate)||c!==o);)a.push(r),r=L(r);for(r=0;r<t.length;r++)$(t[r],"bubbled",e);for(r=a.length;0<r--;)$(a[r],"captured",n);return[e,n]}};function Xt(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t}var Jt=Object.prototype.hasOwnProperty;function en(e,t){if(Xt(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++)if(!Jt.call(t,n[r])||!Xt(e[n[r]],t[n[r]]))return!1;return!0}function tn(e){var t=e;if(e.alternate)for(;t.return;)t=t.return;else{if(0!=(2&t.effectTag))return 1;for(;t.return;)if(0!=(2&(t=t.return).effectTag))return 1}return 3===t.tag?2:3}function nn(e){2!==tn(e)&&i("188")}function rn(e){if(!(e=function(e){var t=e.alternate;if(!t)return 3===(t=tn(e))&&i("188"),1===t?null:e;for(var n=e,r=t;;){var o=n.return,a=o?o.alternate:null;if(!o||!a)break;if(o.child===a.child){for(var u=o.child;u;){if(u===n)return nn(o),e;if(u===r)return nn(o),t;u=u.sibling}i("188")}if(n.return!==r.return)n=o,r=a;else{u=!1;for(var l=o.child;l;){if(l===n){u=!0,n=o,r=a;break}if(l===r){u=!0,r=o,n=a;break}l=l.sibling}if(!u){for(l=a.child;l;){if(l===n){u=!0,n=a,r=o;break}if(l===r){u=!0,r=a,n=o;break}l=l.sibling}u||i("189")}}n.alternate!==r&&i("190")}return 3!==n.tag&&i("188"),n.stateNode.current===n?e:t}(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}var on=le.extend({animationName:null,elapsedTime:null,pseudoElement:null}),an=le.extend({clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),un=Ft.extend({relatedTarget:null});function ln(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}var cn={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},sn={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},fn=Ft.extend({key:function(e){if(e.key){var t=cn[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?13===(e=ln(e))?"Enter":String.fromCharCode(e):"keydown"===e.type||"keyup"===e.type?sn[e.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Bt,charCode:function(e){return"keypress"===e.type?ln(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?ln(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),pn=Gt.extend({dataTransfer:null}),dn=Ft.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Bt}),mn=le.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),hn=Gt.extend({deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null}),vn=[["abort","abort"],[Z,"animationEnd"],[X,"animationIteration"],[J,"animationStart"],["canplay","canPlay"],["canplaythrough","canPlayThrough"],["drag","drag"],["dragenter","dragEnter"],["dragexit","dragExit"],["dragleave","dragLeave"],["dragover","dragOver"],["durationchange","durationChange"],["emptied","emptied"],["encrypted","encrypted"],["ended","ended"],["error","error"],["gotpointercapture","gotPointerCapture"],["load","load"],["loadeddata","loadedData"],["loadedmetadata","loadedMetadata"],["loadstart","loadStart"],["lostpointercapture","lostPointerCapture"],["mousemove","mouseMove"],["mouseout","mouseOut"],["mouseover","mouseOver"],["playing","playing"],["pointermove","pointerMove"],["pointerout","pointerOut"],["pointerover","pointerOver"],["progress","progress"],["scroll","scroll"],["seeking","seeking"],["stalled","stalled"],["suspend","suspend"],["timeupdate","timeUpdate"],["toggle","toggle"],["touchmove","touchMove"],[ee,"transitionEnd"],["waiting","waiting"],["wheel","wheel"]],yn={},gn={};function bn(e,t){var n=e[0],r="on"+((e=e[1])[0].toUpperCase()+e.slice(1));t={phasedRegistrationNames:{bubbled:r,captured:r+"Capture"},dependencies:[n],isInteractive:t},yn[e]=t,gn[n]=t}[["blur","blur"],["cancel","cancel"],["click","click"],["close","close"],["contextmenu","contextMenu"],["copy","copy"],["cut","cut"],["auxclick","auxClick"],["dblclick","doubleClick"],["dragend","dragEnd"],["dragstart","dragStart"],["drop","drop"],["focus","focus"],["input","input"],["invalid","invalid"],["keydown","keyDown"],["keypress","keyPress"],["keyup","keyUp"],["mousedown","mouseDown"],["mouseup","mouseUp"],["paste","paste"],["pause","pause"],["play","play"],["pointercancel","pointerCancel"],["pointerdown","pointerDown"],["pointerup","pointerUp"],["ratechange","rateChange"],["reset","reset"],["seeked","seeked"],["submit","submit"],["touchcancel","touchCancel"],["touchend","touchEnd"],["touchstart","touchStart"],["volumechange","volumeChange"]].forEach(function(e){bn(e,!0)}),vn.forEach(function(e){bn(e,!1)});var _n={eventTypes:yn,isInteractiveTopLevelEventType:function(e){return void 0!==(e=gn[e])&&!0===e.isInteractive},extractEvents:function(e,t,n,r){var o=gn[e];if(!o)return null;switch(e){case"keypress":if(0===ln(n))return null;case"keydown":case"keyup":e=fn;break;case"blur":case"focus":e=un;break;case"click":if(2===n.button)return null;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":e=Gt;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":e=pn;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":e=dn;break;case Z:case X:case J:e=on;break;case ee:e=mn;break;case"scroll":e=Ft;break;case"wheel":e=hn;break;case"copy":case"cut":case"paste":e=an;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":e=Qt;break;default:e=le}return V(t=e.getPooled(o,t,n,r)),t}},En=_n.isInteractiveTopLevelEventType,wn=[];function xn(e){var t=e.targetInst,n=t;do{if(!n){e.ancestors.push(n);break}var r;for(r=n;r.return;)r=r.return;if(!(r=3!==r.tag?null:r.stateNode.containerInfo))break;e.ancestors.push(n),n=U(r)}while(n);for(n=0;n<e.ancestors.length;n++){t=e.ancestors[n];var o=Le(e.nativeEvent);r=e.topLevelType;for(var a=e.nativeEvent,i=null,u=0;u<y.length;u++){var l=y[u];l&&(l=l.extractEvents(r,t,a,o))&&(i=k(i,l))}j(i)}}var Sn=!0;function kn(e,t){if(!t)return null;var n=(En(e)?Tn:On).bind(null,e);t.addEventListener(e,n,!1)}function Nn(e,t){if(!t)return null;var n=(En(e)?Tn:On).bind(null,e);t.addEventListener(e,n,!0)}function Tn(e,t){Ie(On,e,t)}function On(e,t){if(Sn){var n=Le(t);if(null===(n=U(n))||"number"!=typeof n.tag||2===tn(n)||(n=null),wn.length){var r=wn.pop();r.topLevelType=e,r.nativeEvent=t,r.targetInst=n,e=r}else e={topLevelType:e,nativeEvent:t,targetInst:n,ancestors:[]};try{De(xn,e)}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,10>wn.length&&wn.push(e)}}}var Cn={},Pn=0,jn="_reactListenersID"+(""+Math.random()).slice(2);function Rn(e){return Object.prototype.hasOwnProperty.call(e,jn)||(e[jn]=Pn++,Cn[e[jn]]={}),Cn[e[jn]]}function In(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}function An(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Un(e,t){var n,r=An(e);for(e=0;r;){if(3===r.nodeType){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=An(r)}}function Dn(){for(var e=window,t=In();t instanceof e.HTMLIFrameElement;){try{var n="string"==typeof t.contentWindow.location.href}catch(e){n=!1}if(!n)break;t=In((e=t.contentWindow).document)}return t}function Mn(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&("text"===e.type||"search"===e.type||"tel"===e.type||"url"===e.type||"password"===e.type)||"textarea"===t||"true"===e.contentEditable)}function zn(e){var t=Dn(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&function e(t,n){return!(!t||!n)&&(t===n||(!t||3!==t.nodeType)&&(n&&3===n.nodeType?e(t,n.parentNode):"contains"in t?t.contains(n):!!t.compareDocumentPosition&&!!(16&t.compareDocumentPosition(n))))}(n.ownerDocument.documentElement,n)){if(null!==r&&Mn(n))if(t=r.start,void 0===(e=r.end)&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if((e=(t=n.ownerDocument||document)&&t.defaultView||window).getSelection){e=e.getSelection();var o=n.textContent.length,a=Math.min(r.start,o);r=void 0===r.end?a:Math.min(r.end,o),!e.extend&&a>r&&(o=r,r=a,a=o),o=Un(n,a);var i=Un(n,r);o&&i&&(1!==e.rangeCount||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&((t=t.createRange()).setStart(o.node,o.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}for(t=[],e=n;e=e.parentNode;)1===e.nodeType&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for("function"==typeof n.focus&&n.focus(),n=0;n<t.length;n++)(e=t[n]).element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Ln=q&&"documentMode"in document&&11>=document.documentMode,Fn={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")}},Wn=null,$n=null,Bn=null,Vn=!1;function qn(e,t){var n=t.window===t?t.document:9===t.nodeType?t:t.ownerDocument;return Vn||null==Wn||Wn!==In(n)?null:("selectionStart"in(n=Wn)&&Mn(n)?n={start:n.selectionStart,end:n.selectionEnd}:n={anchorNode:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection()).anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset},Bn&&en(Bn,n)?null:(Bn=n,(e=le.getPooled(Fn.select,$n,e,t)).type="select",e.target=Wn,V(e),e))}var Hn={eventTypes:Fn,extractEvents:function(e,t,n,r){var o,a=r.window===r?r.document:9===r.nodeType?r:r.ownerDocument;if(!(o=!a)){e:{a=Rn(a),o=_.onSelect;for(var i=0;i<o.length;i++){var u=o[i];if(!a.hasOwnProperty(u)||!a[u]){a=!1;break e}}a=!0}o=!a}if(o)return null;switch(a=t?M(t):window,e){case"focus":(ze(a)||"true"===a.contentEditable)&&(Wn=a,$n=t,Bn=null);break;case"blur":Bn=$n=Wn=null;break;case"mousedown":Vn=!0;break;case"contextmenu":case"mouseup":case"dragend":return Vn=!1,qn(n,r);case"selectionchange":if(Ln)break;case"keydown":case"keyup":return qn(n,r)}return null}};function Kn(e,t){return e=o({children:void 0},t),(t=function(e){var t="";return r.Children.forEach(e,function(e){null!=e&&(t+=e)}),t}(t.children))&&(e.children=t),e}function Gn(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+gt(n),t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function Qn(e,t){return null!=t.dangerouslySetInnerHTML&&i("91"),o({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Yn(e,t){var n=t.value;null==n&&(n=t.defaultValue,null!=(t=t.children)&&(null!=n&&i("92"),Array.isArray(t)&&(1>=t.length||i("93"),t=t[0]),n=t),null==n&&(n="")),e._wrapperState={initialValue:gt(n)}}function Zn(e,t){var n=gt(t.value),r=gt(t.defaultValue);null!=n&&((n=""+n)!==e.value&&(e.value=n),null==t.defaultValue&&e.defaultValue!==n&&(e.defaultValue=n)),null!=r&&(e.defaultValue=""+r)}function Xn(e){var t=e.textContent;t===e._wrapperState.initialValue&&(e.value=t)}C.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")),E=z,w=D,x=M,C.injectEventPluginsByName({SimpleEventPlugin:_n,EnterLeaveEventPlugin:Zt,ChangeEventPlugin:Lt,SelectEventPlugin:Hn,BeforeInputEventPlugin:ke});var Jn={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function er(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function tr(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?er(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}var nr,rr=void 0,or=(nr=function(e,t){if(e.namespaceURI!==Jn.svg||"innerHTML"in e)e.innerHTML=t;else{for((rr=rr||document.createElement("div")).innerHTML="<svg>"+t+"</svg>",t=rr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}},"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(e,t,n,r){MSApp.execUnsafeLocalFunction(function(){return nr(e,t)})}:nr);function ar(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}var ir={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ur=["Webkit","ms","Moz","O"];function lr(e,t,n){return null==t||"boolean"==typeof t||""===t?"":n||"number"!=typeof t||0===t||ir.hasOwnProperty(e)&&ir[e]?(""+t).trim():t+"px"}function cr(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=lr(n,t[n],r);"float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}Object.keys(ir).forEach(function(e){ur.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),ir[t]=ir[e]})});var sr=o({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function fr(e,t){t&&(sr[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML)&&i("137",e,""),null!=t.dangerouslySetInnerHTML&&(null!=t.children&&i("60"),"object"==typeof t.dangerouslySetInnerHTML&&"__html"in t.dangerouslySetInnerHTML||i("61")),null!=t.style&&"object"!=typeof t.style&&i("62",""))}function pr(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}function dr(e,t){var n=Rn(e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument);t=_[t];for(var r=0;r<t.length;r++){var o=t[r];if(!n.hasOwnProperty(o)||!n[o]){switch(o){case"scroll":Nn("scroll",e);break;case"focus":case"blur":Nn("focus",e),Nn("blur",e),n.blur=!0,n.focus=!0;break;case"cancel":case"close":Fe(o)&&Nn(o,e);break;case"invalid":case"submit":case"reset":break;default:-1===te.indexOf(o)&&kn(o,e)}n[o]=!0}}}function mr(){}var hr=null,vr=null;function yr(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function gr(e,t){return"textarea"===e||"option"===e||"noscript"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&null!=t.dangerouslySetInnerHTML.__html}var br="function"==typeof setTimeout?setTimeout:void 0,_r="function"==typeof clearTimeout?clearTimeout:void 0,Er=a.unstable_scheduleCallback,wr=a.unstable_cancelCallback;function xr(e){for(e=e.nextSibling;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e}function Sr(e){for(e=e.firstChild;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e}new Set;var kr=[],Nr=-1;function Tr(e){0>Nr||(e.current=kr[Nr],kr[Nr]=null,Nr--)}function Or(e,t){kr[++Nr]=e.current,e.current=t}var Cr={},Pr={current:Cr},jr={current:!1},Rr=Cr;function Ir(e,t){var n=e.type.contextTypes;if(!n)return Cr;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o,a={};for(o in n)a[o]=t[o];return r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=a),a}function Ar(e){return null!=(e=e.childContextTypes)}function Ur(e){Tr(jr),Tr(Pr)}function Dr(e){Tr(jr),Tr(Pr)}function Mr(e,t,n){Pr.current!==Cr&&i("168"),Or(Pr,t),Or(jr,n)}function zr(e,t,n){var r=e.stateNode;if(e=t.childContextTypes,"function"!=typeof r.getChildContext)return n;for(var a in r=r.getChildContext())a in e||i("108",ut(t)||"Unknown",a);return o({},n,r)}function Lr(e){var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||Cr,Rr=Pr.current,Or(Pr,t),Or(jr,jr.current),!0}function Fr(e,t,n){var r=e.stateNode;r||i("169"),n?(t=zr(e,t,Rr),r.__reactInternalMemoizedMergedChildContext=t,Tr(jr),Tr(Pr),Or(Pr,t)):Tr(jr),Or(jr,n)}var Wr=null,$r=null;function Br(e){return function(t){try{return e(t)}catch(e){}}}function Vr(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.contextDependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.childExpirationTime=this.expirationTime=0,this.alternate=null}function qr(e,t,n,r){return new Vr(e,t,n,r)}function Hr(e){return!(!(e=e.prototype)||!e.isReactComponent)}function Kr(e,t){var n=e.alternate;return null===n?((n=qr(e.tag,t,e.key,e.mode)).elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.effectTag=0,n.nextEffect=null,n.firstEffect=null,n.lastEffect=null),n.childExpirationTime=e.childExpirationTime,n.expirationTime=e.expirationTime,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,n.contextDependencies=e.contextDependencies,n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Gr(e,t,n,r,o,a){var u=2;if(r=e,"function"==typeof e)Hr(e)&&(u=1);else if("string"==typeof e)u=5;else e:switch(e){case Qe:return Qr(n.children,o,a,t);case et:return Yr(n,3|o,a,t);case Ye:return Yr(n,2|o,a,t);case Ze:return(e=qr(12,n,t,4|o)).elementType=Ze,e.type=Ze,e.expirationTime=a,e;case nt:return(e=qr(13,n,t,o)).elementType=nt,e.type=nt,e.expirationTime=a,e;default:if("object"==typeof e&&null!==e)switch(e.$$typeof){case Xe:u=10;break e;case Je:u=9;break e;case tt:u=11;break e;case rt:u=14;break e;case ot:u=16,r=null;break e}i("130",null==e?e:typeof e,"")}return(t=qr(u,n,t,o)).elementType=e,t.type=r,t.expirationTime=a,t}function Qr(e,t,n,r){return(e=qr(7,e,r,t)).expirationTime=n,e}function Yr(e,t,n,r){return e=qr(8,e,r,t),t=0==(1&t)?Ye:et,e.elementType=t,e.type=t,e.expirationTime=n,e}function Zr(e,t,n){return(e=qr(6,e,null,t)).expirationTime=n,e}function Xr(e,t,n){return(t=qr(4,null!==e.children?e.children:[],e.key,t)).expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Jr(e,t){e.didError=!1;var n=e.earliestPendingTime;0===n?e.earliestPendingTime=e.latestPendingTime=t:n<t?e.earliestPendingTime=t:e.latestPendingTime>t&&(e.latestPendingTime=t),no(t,e)}function eo(e,t){e.didError=!1,e.latestPingedTime>=t&&(e.latestPingedTime=0);var n=e.earliestPendingTime,r=e.latestPendingTime;n===t?e.earliestPendingTime=r===t?e.latestPendingTime=0:r:r===t&&(e.latestPendingTime=n),n=e.earliestSuspendedTime,r=e.latestSuspendedTime,0===n?e.earliestSuspendedTime=e.latestSuspendedTime=t:n<t?e.earliestSuspendedTime=t:r>t&&(e.latestSuspendedTime=t),no(t,e)}function to(e,t){var n=e.earliestPendingTime;return n>t&&(t=n),(e=e.earliestSuspendedTime)>t&&(t=e),t}function no(e,t){var n=t.earliestSuspendedTime,r=t.latestSuspendedTime,o=t.earliestPendingTime,a=t.latestPingedTime;0===(o=0!==o?o:a)&&(0===e||r<e)&&(o=r),0!==(e=o)&&n>e&&(e=n),t.nextExpirationTimeToWorkOn=o,t.expirationTime=e}function ro(e,t){if(e&&e.defaultProps)for(var n in t=o({},t),e=e.defaultProps)void 0===t[n]&&(t[n]=e[n]);return t}var oo=(new r.Component).refs;function ao(e,t,n,r){n=null==(n=n(r,t=e.memoizedState))?t:o({},t,n),e.memoizedState=n,null!==(r=e.updateQueue)&&0===e.expirationTime&&(r.baseState=n)}var io={isMounted:function(e){return!!(e=e._reactInternalFiber)&&2===tn(e)},enqueueSetState:function(e,t,n){e=e._reactInternalFiber;var r=wu(),o=Ya(r=Qi(r,e));o.payload=t,null!=n&&(o.callback=n),Bi(),Xa(e,o),Xi(e,r)},enqueueReplaceState:function(e,t,n){e=e._reactInternalFiber;var r=wu(),o=Ya(r=Qi(r,e));o.tag=Va,o.payload=t,null!=n&&(o.callback=n),Bi(),Xa(e,o),Xi(e,r)},enqueueForceUpdate:function(e,t){e=e._reactInternalFiber;var n=wu(),r=Ya(n=Qi(n,e));r.tag=qa,null!=t&&(r.callback=t),Bi(),Xa(e,r),Xi(e,n)}};function uo(e,t,n,r,o,a,i){return"function"==typeof(e=e.stateNode).shouldComponentUpdate?e.shouldComponentUpdate(r,a,i):!t.prototype||!t.prototype.isPureReactComponent||(!en(n,r)||!en(o,a))}function lo(e,t,n){var r=!1,o=Cr,a=t.contextType;return"object"==typeof a&&null!==a?a=$a(a):(o=Ar(t)?Rr:Pr.current,a=(r=null!=(r=t.contextTypes))?Ir(e,o):Cr),t=new t(n,a),e.memoizedState=null!==t.state&&void 0!==t.state?t.state:null,t.updater=io,e.stateNode=t,t._reactInternalFiber=e,r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=a),t}function co(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&io.enqueueReplaceState(t,t.state,null)}function so(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs=oo;var a=t.contextType;"object"==typeof a&&null!==a?o.context=$a(a):(a=Ar(t)?Rr:Pr.current,o.context=Ir(e,a)),null!==(a=e.updateQueue)&&(ni(e,a,n,o,r),o.state=e.memoizedState),"function"==typeof(a=t.getDerivedStateFromProps)&&(ao(e,t,a,n),o.state=e.memoizedState),"function"==typeof t.getDerivedStateFromProps||"function"==typeof o.getSnapshotBeforeUpdate||"function"!=typeof o.UNSAFE_componentWillMount&&"function"!=typeof o.componentWillMount||(t=o.state,"function"==typeof o.componentWillMount&&o.componentWillMount(),"function"==typeof o.UNSAFE_componentWillMount&&o.UNSAFE_componentWillMount(),t!==o.state&&io.enqueueReplaceState(o,o.state,null),null!==(a=e.updateQueue)&&(ni(e,a,n,o,r),o.state=e.memoizedState)),"function"==typeof o.componentDidMount&&(e.effectTag|=4)}var fo=Array.isArray;function po(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){n=n._owner;var r=void 0;n&&(1!==n.tag&&i("309"),r=n.stateNode),r||i("147",e);var o=""+e;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===o?t.ref:((t=function(e){var t=r.refs;t===oo&&(t=r.refs={}),null===e?delete t[o]:t[o]=e})._stringRef=o,t)}"string"!=typeof e&&i("284"),n._owner||i("290",e)}return e}function mo(e,t){"textarea"!==e.type&&i("31","[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,"")}function ho(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function o(e,t,n){return(e=Kr(e,t)).index=0,e.sibling=null,e}function a(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index)<n?(t.effectTag=2,n):r:(t.effectTag=2,n):n}function u(t){return e&&null===t.alternate&&(t.effectTag=2),t}function l(e,t,n,r){return null===t||6!==t.tag?((t=Zr(n,e.mode,r)).return=e,t):((t=o(t,n)).return=e,t)}function c(e,t,n,r){return null!==t&&t.elementType===n.type?((r=o(t,n.props)).ref=po(e,t,n),r.return=e,r):((r=Gr(n.type,n.key,n.props,null,e.mode,r)).ref=po(e,t,n),r.return=e,r)}function s(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?((t=Xr(n,e.mode,r)).return=e,t):((t=o(t,n.children||[])).return=e,t)}function f(e,t,n,r,a){return null===t||7!==t.tag?((t=Qr(n,e.mode,r,a)).return=e,t):((t=o(t,n)).return=e,t)}function p(e,t,n){if("string"==typeof t||"number"==typeof t)return(t=Zr(""+t,e.mode,n)).return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case Ke:return(n=Gr(t.type,t.key,t.props,null,e.mode,n)).ref=po(e,null,t),n.return=e,n;case Ge:return(t=Xr(t,e.mode,n)).return=e,t}if(fo(t)||it(t))return(t=Qr(t,e.mode,n,null)).return=e,t;mo(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:l(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case Ke:return n.key===o?n.type===Qe?f(e,t,n.props.children,r,o):c(e,t,n,r):null;case Ge:return n.key===o?s(e,t,n,r):null}if(fo(n)||it(n))return null!==o?null:f(e,t,n,r,null);mo(e,n)}return null}function m(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return l(t,e=e.get(n)||null,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case Ke:return e=e.get(null===r.key?n:r.key)||null,r.type===Qe?f(t,e,r.props.children,o,r.key):c(t,e,r,o);case Ge:return s(t,e=e.get(null===r.key?n:r.key)||null,r,o)}if(fo(r)||it(r))return f(t,e=e.get(n)||null,r,o,null);mo(t,r)}return null}function h(o,i,u,l){for(var c=null,s=null,f=i,h=i=0,v=null;null!==f&&h<u.length;h++){f.index>h?(v=f,f=null):v=f.sibling;var y=d(o,f,u[h],l);if(null===y){null===f&&(f=v);break}e&&f&&null===y.alternate&&t(o,f),i=a(y,i,h),null===s?c=y:s.sibling=y,s=y,f=v}if(h===u.length)return n(o,f),c;if(null===f){for(;h<u.length;h++)(f=p(o,u[h],l))&&(i=a(f,i,h),null===s?c=f:s.sibling=f,s=f);return c}for(f=r(o,f);h<u.length;h++)(v=m(f,o,h,u[h],l))&&(e&&null!==v.alternate&&f.delete(null===v.key?h:v.key),i=a(v,i,h),null===s?c=v:s.sibling=v,s=v);return e&&f.forEach(function(e){return t(o,e)}),c}function v(o,u,l,c){var s=it(l);"function"!=typeof s&&i("150"),null==(l=s.call(l))&&i("151");for(var f=s=null,h=u,v=u=0,y=null,g=l.next();null!==h&&!g.done;v++,g=l.next()){h.index>v?(y=h,h=null):y=h.sibling;var b=d(o,h,g.value,c);if(null===b){h||(h=y);break}e&&h&&null===b.alternate&&t(o,h),u=a(b,u,v),null===f?s=b:f.sibling=b,f=b,h=y}if(g.done)return n(o,h),s;if(null===h){for(;!g.done;v++,g=l.next())null!==(g=p(o,g.value,c))&&(u=a(g,u,v),null===f?s=g:f.sibling=g,f=g);return s}for(h=r(o,h);!g.done;v++,g=l.next())null!==(g=m(h,o,v,g.value,c))&&(e&&null!==g.alternate&&h.delete(null===g.key?v:g.key),u=a(g,u,v),null===f?s=g:f.sibling=g,f=g);return e&&h.forEach(function(e){return t(o,e)}),s}return function(e,r,a,l){var c="object"==typeof a&&null!==a&&a.type===Qe&&null===a.key;c&&(a=a.props.children);var s="object"==typeof a&&null!==a;if(s)switch(a.$$typeof){case Ke:e:{for(s=a.key,c=r;null!==c;){if(c.key===s){if(7===c.tag?a.type===Qe:c.elementType===a.type){n(e,c.sibling),(r=o(c,a.type===Qe?a.props.children:a.props)).ref=po(e,c,a),r.return=e,e=r;break e}n(e,c);break}t(e,c),c=c.sibling}a.type===Qe?((r=Qr(a.props.children,e.mode,l,a.key)).return=e,e=r):((l=Gr(a.type,a.key,a.props,null,e.mode,l)).ref=po(e,r,a),l.return=e,e=l)}return u(e);case Ge:e:{for(c=a.key;null!==r;){if(r.key===c){if(4===r.tag&&r.stateNode.containerInfo===a.containerInfo&&r.stateNode.implementation===a.implementation){n(e,r.sibling),(r=o(r,a.children||[])).return=e,e=r;break e}n(e,r);break}t(e,r),r=r.sibling}(r=Xr(a,e.mode,l)).return=e,e=r}return u(e)}if("string"==typeof a||"number"==typeof a)return a=""+a,null!==r&&6===r.tag?(n(e,r.sibling),(r=o(r,a)).return=e,e=r):(n(e,r),(r=Zr(a,e.mode,l)).return=e,e=r),u(e);if(fo(a))return h(e,r,a,l);if(it(a))return v(e,r,a,l);if(s&&mo(e,a),void 0===a&&!c)switch(e.tag){case 1:case 0:i("152",(l=e.type).displayName||l.name||"Component")}return n(e,r)}}var vo=ho(!0),yo=ho(!1),go={},bo={current:go},_o={current:go},Eo={current:go};function wo(e){return e===go&&i("174"),e}function xo(e,t){Or(Eo,t),Or(_o,e),Or(bo,go);var n=t.nodeType;switch(n){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:tr(null,"");break;default:t=tr(t=(n=8===n?t.parentNode:t).namespaceURI||null,n=n.tagName)}Tr(bo),Or(bo,t)}function So(e){Tr(bo),Tr(_o),Tr(Eo)}function ko(e){wo(Eo.current);var t=wo(bo.current),n=tr(t,e.type);t!==n&&(Or(_o,e),Or(bo,n))}function No(e){_o.current===e&&(Tr(bo),Tr(_o))}var To=0,Oo=2,Co=4,Po=8,jo=16,Ro=32,Io=64,Ao=128,Uo=Ve.ReactCurrentDispatcher,Do=0,Mo=null,zo=null,Lo=null,Fo=null,Wo=null,$o=null,Bo=0,Vo=null,qo=0,Ho=!1,Ko=null,Go=0;function Qo(){i("321")}function Yo(e,t){if(null===t)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Xt(e[n],t[n]))return!1;return!0}function Zo(e,t,n,r,o,a){if(Do=a,Mo=t,Lo=null!==e?e.memoizedState:null,Uo.current=null===Lo?sa:fa,t=n(r,o),Ho){do{Ho=!1,Go+=1,Lo=null!==e?e.memoizedState:null,$o=Fo,Vo=Wo=zo=null,Uo.current=fa,t=n(r,o)}while(Ho);Ko=null,Go=0}return Uo.current=ca,(e=Mo).memoizedState=Fo,e.expirationTime=Bo,e.updateQueue=Vo,e.effectTag|=qo,e=null!==zo&&null!==zo.next,Do=0,$o=Wo=Fo=Lo=zo=Mo=null,Bo=0,Vo=null,qo=0,e&&i("300"),t}function Xo(){Uo.current=ca,Do=0,$o=Wo=Fo=Lo=zo=Mo=null,Bo=0,Vo=null,qo=0,Ho=!1,Ko=null,Go=0}function Jo(){var e={memoizedState:null,baseState:null,queue:null,baseUpdate:null,next:null};return null===Wo?Fo=Wo=e:Wo=Wo.next=e,Wo}function ea(){if(null!==$o)$o=(Wo=$o).next,Lo=null!==(zo=Lo)?zo.next:null;else{null===Lo&&i("310");var e={memoizedState:(zo=Lo).memoizedState,baseState:zo.baseState,queue:zo.queue,baseUpdate:zo.baseUpdate,next:null};Wo=null===Wo?Fo=e:Wo.next=e,Lo=zo.next}return Wo}function ta(e,t){return"function"==typeof t?t(e):t}function na(e){var t=ea(),n=t.queue;if(null===n&&i("311"),n.lastRenderedReducer=e,0<Go){var r=n.dispatch;if(null!==Ko){var o=Ko.get(n);if(void 0!==o){Ko.delete(n);var a=t.memoizedState;do{a=e(a,o.action),o=o.next}while(null!==o);return Xt(a,t.memoizedState)||(wa=!0),t.memoizedState=a,t.baseUpdate===n.last&&(t.baseState=a),n.lastRenderedState=a,[a,r]}}return[t.memoizedState,r]}r=n.last;var u=t.baseUpdate;if(a=t.baseState,null!==u?(null!==r&&(r.next=null),r=u.next):r=null!==r?r.next:null,null!==r){var l=o=null,c=r,s=!1;do{var f=c.expirationTime;f<Do?(s||(s=!0,l=u,o=a),f>Bo&&(Bo=f)):a=c.eagerReducer===e?c.eagerState:e(a,c.action),u=c,c=c.next}while(null!==c&&c!==r);s||(l=u,o=a),Xt(a,t.memoizedState)||(wa=!0),t.memoizedState=a,t.baseUpdate=l,t.baseState=o,n.lastRenderedState=a}return[t.memoizedState,n.dispatch]}function ra(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},null===Vo?(Vo={lastEffect:null}).lastEffect=e.next=e:null===(t=Vo.lastEffect)?Vo.lastEffect=e.next=e:(n=t.next,t.next=e,e.next=n,Vo.lastEffect=e),e}function oa(e,t,n,r){var o=Jo();qo|=e,o.memoizedState=ra(t,n,void 0,void 0===r?null:r)}function aa(e,t,n,r){var o=ea();r=void 0===r?null:r;var a=void 0;if(null!==zo){var i=zo.memoizedState;if(a=i.destroy,null!==r&&Yo(r,i.deps))return void ra(To,n,a,r)}qo|=e,o.memoizedState=ra(t,n,a,r)}function ia(e,t){return"function"==typeof t?(e=e(),t(e),function(){t(null)}):null!=t?(e=e(),t.current=e,function(){t.current=null}):void 0}function ua(){}function la(e,t,n){25>Go||i("301");var r=e.alternate;if(e===Mo||null!==r&&r===Mo)if(Ho=!0,e={expirationTime:Do,action:n,eagerReducer:null,eagerState:null,next:null},null===Ko&&(Ko=new Map),void 0===(n=Ko.get(t)))Ko.set(t,e);else{for(t=n;null!==t.next;)t=t.next;t.next=e}else{Bi();var o=wu(),a={expirationTime:o=Qi(o,e),action:n,eagerReducer:null,eagerState:null,next:null},u=t.last;if(null===u)a.next=a;else{var l=u.next;null!==l&&(a.next=l),u.next=a}if(t.last=a,0===e.expirationTime&&(null===r||0===r.expirationTime)&&null!==(r=t.lastRenderedReducer))try{var c=t.lastRenderedState,s=r(c,n);if(a.eagerReducer=r,a.eagerState=s,Xt(s,c))return}catch(e){}Xi(e,o)}}var ca={readContext:$a,useCallback:Qo,useContext:Qo,useEffect:Qo,useImperativeHandle:Qo,useLayoutEffect:Qo,useMemo:Qo,useReducer:Qo,useRef:Qo,useState:Qo,useDebugValue:Qo},sa={readContext:$a,useCallback:function(e,t){return Jo().memoizedState=[e,void 0===t?null:t],e},useContext:$a,useEffect:function(e,t){return oa(516,Ao|Io,e,t)},useImperativeHandle:function(e,t,n){return n=null!=n?n.concat([e]):null,oa(4,Co|Ro,ia.bind(null,t,e),n)},useLayoutEffect:function(e,t){return oa(4,Co|Ro,e,t)},useMemo:function(e,t){var n=Jo();return t=void 0===t?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Jo();return t=void 0!==n?n(t):t,r.memoizedState=r.baseState=t,e=(e=r.queue={last:null,dispatch:null,lastRenderedReducer:e,lastRenderedState:t}).dispatch=la.bind(null,Mo,e),[r.memoizedState,e]},useRef:function(e){return e={current:e},Jo().memoizedState=e},useState:function(e){var t=Jo();return"function"==typeof e&&(e=e()),t.memoizedState=t.baseState=e,e=(e=t.queue={last:null,dispatch:null,lastRenderedReducer:ta,lastRenderedState:e}).dispatch=la.bind(null,Mo,e),[t.memoizedState,e]},useDebugValue:ua},fa={readContext:$a,useCallback:function(e,t){var n=ea();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&Yo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)},useContext:$a,useEffect:function(e,t){return aa(516,Ao|Io,e,t)},useImperativeHandle:function(e,t,n){return n=null!=n?n.concat([e]):null,aa(4,Co|Ro,ia.bind(null,t,e),n)},useLayoutEffect:function(e,t){return aa(4,Co|Ro,e,t)},useMemo:function(e,t){var n=ea();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&Yo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)},useReducer:na,useRef:function(){return ea().memoizedState},useState:function(e){return na(ta)},useDebugValue:ua},pa=null,da=null,ma=!1;function ha(e,t){var n=qr(5,null,null,0);n.elementType="DELETED",n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function va(e,t){switch(e.tag){case 5:var n=e.type;return null!==(t=1!==t.nodeType||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t)&&(e.stateNode=t,!0);case 6:return null!==(t=""===e.pendingProps||3!==t.nodeType?null:t)&&(e.stateNode=t,!0);case 13:default:return!1}}function ya(e){if(ma){var t=da;if(t){var n=t;if(!va(e,t)){if(!(t=xr(n))||!va(e,t))return e.effectTag|=2,ma=!1,void(pa=e);ha(pa,n)}pa=e,da=Sr(t)}else e.effectTag|=2,ma=!1,pa=e}}function ga(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag&&18!==e.tag;)e=e.return;pa=e}function ba(e){if(e!==pa)return!1;if(!ma)return ga(e),ma=!0,!1;var t=e.type;if(5!==e.tag||"head"!==t&&"body"!==t&&!gr(t,e.memoizedProps))for(t=da;t;)ha(e,t),t=xr(t);return ga(e),da=pa?xr(e.stateNode):null,!0}function _a(){da=pa=null,ma=!1}var Ea=Ve.ReactCurrentOwner,wa=!1;function xa(e,t,n,r){t.child=null===e?yo(t,null,n,r):vo(t,e.child,n,r)}function Sa(e,t,n,r,o){n=n.render;var a=t.ref;return Wa(t,o),r=Zo(e,t,n,r,a,o),null===e||wa?(t.effectTag|=1,xa(e,t,r,o),t.child):(t.updateQueue=e.updateQueue,t.effectTag&=-517,e.expirationTime<=o&&(e.expirationTime=0),Ia(e,t,o))}function ka(e,t,n,r,o,a){if(null===e){var i=n.type;return"function"!=typeof i||Hr(i)||void 0!==i.defaultProps||null!==n.compare||void 0!==n.defaultProps?((e=Gr(n.type,null,r,null,t.mode,a)).ref=t.ref,e.return=t,t.child=e):(t.tag=15,t.type=i,Na(e,t,i,r,o,a))}return i=e.child,o<a&&(o=i.memoizedProps,(n=null!==(n=n.compare)?n:en)(o,r)&&e.ref===t.ref)?Ia(e,t,a):(t.effectTag|=1,(e=Kr(i,r)).ref=t.ref,e.return=t,t.child=e)}function Na(e,t,n,r,o,a){return null!==e&&en(e.memoizedProps,r)&&e.ref===t.ref&&(wa=!1,o<a)?Ia(e,t,a):Oa(e,t,n,r,a)}function Ta(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function Oa(e,t,n,r,o){var a=Ar(n)?Rr:Pr.current;return a=Ir(t,a),Wa(t,o),n=Zo(e,t,n,r,a,o),null===e||wa?(t.effectTag|=1,xa(e,t,n,o),t.child):(t.updateQueue=e.updateQueue,t.effectTag&=-517,e.expirationTime<=o&&(e.expirationTime=0),Ia(e,t,o))}function Ca(e,t,n,r,o){if(Ar(n)){var a=!0;Lr(t)}else a=!1;if(Wa(t,o),null===t.stateNode)null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),lo(t,n,r),so(t,n,r,o),r=!0;else if(null===e){var i=t.stateNode,u=t.memoizedProps;i.props=u;var l=i.context,c=n.contextType;"object"==typeof c&&null!==c?c=$a(c):c=Ir(t,c=Ar(n)?Rr:Pr.current);var s=n.getDerivedStateFromProps,f="function"==typeof s||"function"==typeof i.getSnapshotBeforeUpdate;f||"function"!=typeof i.UNSAFE_componentWillReceiveProps&&"function"!=typeof i.componentWillReceiveProps||(u!==r||l!==c)&&co(t,i,r,c),Ka=!1;var p=t.memoizedState;l=i.state=p;var d=t.updateQueue;null!==d&&(ni(t,d,r,i,o),l=t.memoizedState),u!==r||p!==l||jr.current||Ka?("function"==typeof s&&(ao(t,n,s,r),l=t.memoizedState),(u=Ka||uo(t,n,u,r,p,l,c))?(f||"function"!=typeof i.UNSAFE_componentWillMount&&"function"!=typeof i.componentWillMount||("function"==typeof i.componentWillMount&&i.componentWillMount(),"function"==typeof i.UNSAFE_componentWillMount&&i.UNSAFE_componentWillMount()),"function"==typeof i.componentDidMount&&(t.effectTag|=4)):("function"==typeof i.componentDidMount&&(t.effectTag|=4),t.memoizedProps=r,t.memoizedState=l),i.props=r,i.state=l,i.context=c,r=u):("function"==typeof i.componentDidMount&&(t.effectTag|=4),r=!1)}else i=t.stateNode,u=t.memoizedProps,i.props=t.type===t.elementType?u:ro(t.type,u),l=i.context,"object"==typeof(c=n.contextType)&&null!==c?c=$a(c):c=Ir(t,c=Ar(n)?Rr:Pr.current),(f="function"==typeof(s=n.getDerivedStateFromProps)||"function"==typeof i.getSnapshotBeforeUpdate)||"function"!=typeof i.UNSAFE_componentWillReceiveProps&&"function"!=typeof i.componentWillReceiveProps||(u!==r||l!==c)&&co(t,i,r,c),Ka=!1,l=t.memoizedState,p=i.state=l,null!==(d=t.updateQueue)&&(ni(t,d,r,i,o),p=t.memoizedState),u!==r||l!==p||jr.current||Ka?("function"==typeof s&&(ao(t,n,s,r),p=t.memoizedState),(s=Ka||uo(t,n,u,r,l,p,c))?(f||"function"!=typeof i.UNSAFE_componentWillUpdate&&"function"!=typeof i.componentWillUpdate||("function"==typeof i.componentWillUpdate&&i.componentWillUpdate(r,p,c),"function"==typeof i.UNSAFE_componentWillUpdate&&i.UNSAFE_componentWillUpdate(r,p,c)),"function"==typeof i.componentDidUpdate&&(t.effectTag|=4),"function"==typeof i.getSnapshotBeforeUpdate&&(t.effectTag|=256)):("function"!=typeof i.componentDidUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof i.getSnapshotBeforeUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),t.memoizedProps=r,t.memoizedState=p),i.props=r,i.state=p,i.context=c,r=s):("function"!=typeof i.componentDidUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof i.getSnapshotBeforeUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),r=!1);return Pa(e,t,n,r,a,o)}function Pa(e,t,n,r,o,a){Ta(e,t);var i=0!=(64&t.effectTag);if(!r&&!i)return o&&Fr(t,n,!1),Ia(e,t,a);r=t.stateNode,Ea.current=t;var u=i&&"function"!=typeof n.getDerivedStateFromError?null:r.render();return t.effectTag|=1,null!==e&&i?(t.child=vo(t,e.child,null,a),t.child=vo(t,null,u,a)):xa(e,t,u,a),t.memoizedState=r.state,o&&Fr(t,n,!0),t.child}function ja(e){var t=e.stateNode;t.pendingContext?Mr(0,t.pendingContext,t.pendingContext!==t.context):t.context&&Mr(0,t.context,!1),xo(e,t.containerInfo)}function Ra(e,t,n){var r=t.mode,o=t.pendingProps,a=t.memoizedState;if(0==(64&t.effectTag)){a=null;var i=!1}else a={timedOutAt:null!==a?a.timedOutAt:0},i=!0,t.effectTag&=-65;if(null===e)if(i){var u=o.fallback;e=Qr(null,r,0,null),0==(1&t.mode)&&(e.child=null!==t.memoizedState?t.child.child:t.child),r=Qr(u,r,n,null),e.sibling=r,(n=e).return=r.return=t}else n=r=yo(t,null,o.children,n);else null!==e.memoizedState?(u=(r=e.child).sibling,i?(n=o.fallback,o=Kr(r,r.pendingProps),0==(1&t.mode)&&((i=null!==t.memoizedState?t.child.child:t.child)!==r.child&&(o.child=i)),r=o.sibling=Kr(u,n,u.expirationTime),n=o,o.childExpirationTime=0,n.return=r.return=t):n=r=vo(t,r.child,o.children,n)):(u=e.child,i?(i=o.fallback,(o=Qr(null,r,0,null)).child=u,0==(1&t.mode)&&(o.child=null!==t.memoizedState?t.child.child:t.child),(r=o.sibling=Qr(i,r,n,null)).effectTag|=2,n=o,o.childExpirationTime=0,n.return=r.return=t):r=n=vo(t,u,o.children,n)),t.stateNode=e.stateNode;return t.memoizedState=a,t.child=n,r}function Ia(e,t,n){if(null!==e&&(t.contextDependencies=e.contextDependencies),t.childExpirationTime<n)return null;if(null!==e&&t.child!==e.child&&i("153"),null!==t.child){for(n=Kr(e=t.child,e.pendingProps,e.expirationTime),t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,(n=n.sibling=Kr(e,e.pendingProps,e.expirationTime)).return=t;n.sibling=null}return t.child}function Aa(e,t,n){var r=t.expirationTime;if(null!==e){if(e.memoizedProps!==t.pendingProps||jr.current)wa=!0;else if(r<n){switch(wa=!1,t.tag){case 3:ja(t),_a();break;case 5:ko(t);break;case 1:Ar(t.type)&&Lr(t);break;case 4:xo(t,t.stateNode.containerInfo);break;case 10:La(t,t.memoizedProps.value);break;case 13:if(null!==t.memoizedState)return 0!==(r=t.child.childExpirationTime)&&r>=n?Ra(e,t,n):null!==(t=Ia(e,t,n))?t.sibling:null}return Ia(e,t,n)}}else wa=!1;switch(t.expirationTime=0,t.tag){case 2:r=t.elementType,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),e=t.pendingProps;var o=Ir(t,Pr.current);if(Wa(t,n),o=Zo(null,t,r,e,o,n),t.effectTag|=1,"object"==typeof o&&null!==o&&"function"==typeof o.render&&void 0===o.$$typeof){if(t.tag=1,Xo(),Ar(r)){var a=!0;Lr(t)}else a=!1;t.memoizedState=null!==o.state&&void 0!==o.state?o.state:null;var u=r.getDerivedStateFromProps;"function"==typeof u&&ao(t,r,u,e),o.updater=io,t.stateNode=o,o._reactInternalFiber=t,so(t,r,e,n),t=Pa(null,t,r,!0,a,n)}else t.tag=0,xa(null,t,o,n),t=t.child;return t;case 16:switch(o=t.elementType,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),a=t.pendingProps,e=function(e){var t=e._result;switch(e._status){case 1:return t;case 2:case 0:throw t;default:switch(e._status=0,(t=(t=e._ctor)()).then(function(t){0===e._status&&(t=t.default,e._status=1,e._result=t)},function(t){0===e._status&&(e._status=2,e._result=t)}),e._status){case 1:return e._result;case 2:throw e._result}throw e._result=t,t}}(o),t.type=e,o=t.tag=function(e){if("function"==typeof e)return Hr(e)?1:0;if(null!=e){if((e=e.$$typeof)===tt)return 11;if(e===rt)return 14}return 2}(e),a=ro(e,a),u=void 0,o){case 0:u=Oa(null,t,e,a,n);break;case 1:u=Ca(null,t,e,a,n);break;case 11:u=Sa(null,t,e,a,n);break;case 14:u=ka(null,t,e,ro(e.type,a),r,n);break;default:i("306",e,"")}return u;case 0:return r=t.type,o=t.pendingProps,Oa(e,t,r,o=t.elementType===r?o:ro(r,o),n);case 1:return r=t.type,o=t.pendingProps,Ca(e,t,r,o=t.elementType===r?o:ro(r,o),n);case 3:return ja(t),null===(r=t.updateQueue)&&i("282"),o=null!==(o=t.memoizedState)?o.element:null,ni(t,r,t.pendingProps,null,n),(r=t.memoizedState.element)===o?(_a(),t=Ia(e,t,n)):(o=t.stateNode,(o=(null===e||null===e.child)&&o.hydrate)&&(da=Sr(t.stateNode.containerInfo),pa=t,o=ma=!0),o?(t.effectTag|=2,t.child=yo(t,null,r,n)):(xa(e,t,r,n),_a()),t=t.child),t;case 5:return ko(t),null===e&&ya(t),r=t.type,o=t.pendingProps,a=null!==e?e.memoizedProps:null,u=o.children,gr(r,o)?u=null:null!==a&&gr(r,a)&&(t.effectTag|=16),Ta(e,t),1!==n&&1&t.mode&&o.hidden?(t.expirationTime=t.childExpirationTime=1,t=null):(xa(e,t,u,n),t=t.child),t;case 6:return null===e&&ya(t),null;case 13:return Ra(e,t,n);case 4:return xo(t,t.stateNode.containerInfo),r=t.pendingProps,null===e?t.child=vo(t,null,r,n):xa(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,Sa(e,t,r,o=t.elementType===r?o:ro(r,o),n);case 7:return xa(e,t,t.pendingProps,n),t.child;case 8:case 12:return xa(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,u=t.memoizedProps,La(t,a=o.value),null!==u){var l=u.value;if(0===(a=Xt(l,a)?0:0|("function"==typeof r._calculateChangedBits?r._calculateChangedBits(l,a):1073741823))){if(u.children===o.children&&!jr.current){t=Ia(e,t,n);break e}}else for(null!==(l=t.child)&&(l.return=t);null!==l;){var c=l.contextDependencies;if(null!==c){u=l.child;for(var s=c.first;null!==s;){if(s.context===r&&0!=(s.observedBits&a)){1===l.tag&&((s=Ya(n)).tag=qa,Xa(l,s)),l.expirationTime<n&&(l.expirationTime=n),null!==(s=l.alternate)&&s.expirationTime<n&&(s.expirationTime=n),s=n;for(var f=l.return;null!==f;){var p=f.alternate;if(f.childExpirationTime<s)f.childExpirationTime=s,null!==p&&p.childExpirationTime<s&&(p.childExpirationTime=s);else{if(!(null!==p&&p.childExpirationTime<s))break;p.childExpirationTime=s}f=f.return}c.expirationTime<n&&(c.expirationTime=n);break}s=s.next}}else u=10===l.tag&&l.type===t.type?null:l.child;if(null!==u)u.return=l;else for(u=l;null!==u;){if(u===t){u=null;break}if(null!==(l=u.sibling)){l.return=u.return,u=l;break}u=u.return}l=u}}xa(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=(a=t.pendingProps).children,Wa(t,n),r=r(o=$a(o,a.unstable_observedBits)),t.effectTag|=1,xa(e,t,r,n),t.child;case 14:return a=ro(o=t.type,t.pendingProps),ka(e,t,o,a=ro(o.type,a),r,n);case 15:return Na(e,t,t.type,t.pendingProps,r,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:ro(r,o),null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),t.tag=1,Ar(r)?(e=!0,Lr(t)):e=!1,Wa(t,n),lo(t,r,o),so(t,r,o,n),Pa(null,t,r,!0,e,n)}i("156")}var Ua={current:null},Da=null,Ma=null,za=null;function La(e,t){var n=e.type._context;Or(Ua,n._currentValue),n._currentValue=t}function Fa(e){var t=Ua.current;Tr(Ua),e.type._context._currentValue=t}function Wa(e,t){Da=e,za=Ma=null;var n=e.contextDependencies;null!==n&&n.expirationTime>=t&&(wa=!0),e.contextDependencies=null}function $a(e,t){return za!==e&&!1!==t&&0!==t&&("number"==typeof t&&1073741823!==t||(za=e,t=1073741823),t={context:e,observedBits:t,next:null},null===Ma?(null===Da&&i("308"),Ma=t,Da.contextDependencies={first:t,expirationTime:0}):Ma=Ma.next=t),e._currentValue}var Ba=0,Va=1,qa=2,Ha=3,Ka=!1;function Ga(e){return{baseState:e,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function Qa(e){return{baseState:e.baseState,firstUpdate:e.firstUpdate,lastUpdate:e.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function Ya(e){return{expirationTime:e,tag:Ba,payload:null,callback:null,next:null,nextEffect:null}}function Za(e,t){null===e.lastUpdate?e.firstUpdate=e.lastUpdate=t:(e.lastUpdate.next=t,e.lastUpdate=t)}function Xa(e,t){var n=e.alternate;if(null===n){var r=e.updateQueue,o=null;null===r&&(r=e.updateQueue=Ga(e.memoizedState))}else r=e.updateQueue,o=n.updateQueue,null===r?null===o?(r=e.updateQueue=Ga(e.memoizedState),o=n.updateQueue=Ga(n.memoizedState)):r=e.updateQueue=Qa(o):null===o&&(o=n.updateQueue=Qa(r));null===o||r===o?Za(r,t):null===r.lastUpdate||null===o.lastUpdate?(Za(r,t),Za(o,t)):(Za(r,t),o.lastUpdate=t)}function Ja(e,t){var n=e.updateQueue;null===(n=null===n?e.updateQueue=Ga(e.memoizedState):ei(e,n)).lastCapturedUpdate?n.firstCapturedUpdate=n.lastCapturedUpdate=t:(n.lastCapturedUpdate.next=t,n.lastCapturedUpdate=t)}function ei(e,t){var n=e.alternate;return null!==n&&t===n.updateQueue&&(t=e.updateQueue=Qa(t)),t}function ti(e,t,n,r,a,i){switch(n.tag){case Va:return"function"==typeof(e=n.payload)?e.call(i,r,a):e;case Ha:e.effectTag=-2049&e.effectTag|64;case Ba:if(null==(a="function"==typeof(e=n.payload)?e.call(i,r,a):e))break;return o({},r,a);case qa:Ka=!0}return r}function ni(e,t,n,r,o){Ka=!1;for(var a=(t=ei(e,t)).baseState,i=null,u=0,l=t.firstUpdate,c=a;null!==l;){var s=l.expirationTime;s<o?(null===i&&(i=l,a=c),u<s&&(u=s)):(c=ti(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastEffect?t.firstEffect=t.lastEffect=l:(t.lastEffect.nextEffect=l,t.lastEffect=l))),l=l.next}for(s=null,l=t.firstCapturedUpdate;null!==l;){var f=l.expirationTime;f<o?(null===s&&(s=l,null===i&&(a=c)),u<f&&(u=f)):(c=ti(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastCapturedEffect?t.firstCapturedEffect=t.lastCapturedEffect=l:(t.lastCapturedEffect.nextEffect=l,t.lastCapturedEffect=l))),l=l.next}null===i&&(t.lastUpdate=null),null===s?t.lastCapturedUpdate=null:e.effectTag|=32,null===i&&null===s&&(a=c),t.baseState=a,t.firstUpdate=i,t.firstCapturedUpdate=s,e.expirationTime=u,e.memoizedState=c}function ri(e,t,n){null!==t.firstCapturedUpdate&&(null!==t.lastUpdate&&(t.lastUpdate.next=t.firstCapturedUpdate,t.lastUpdate=t.lastCapturedUpdate),t.firstCapturedUpdate=t.lastCapturedUpdate=null),oi(t.firstEffect,n),t.firstEffect=t.lastEffect=null,oi(t.firstCapturedEffect,n),t.firstCapturedEffect=t.lastCapturedEffect=null}function oi(e,t){for(;null!==e;){var n=e.callback;if(null!==n){e.callback=null;var r=t;"function"!=typeof n&&i("191",n),n.call(r)}e=e.nextEffect}}function ai(e,t){return{value:e,source:t,stack:lt(t)}}function ii(e){e.effectTag|=4}var ui=void 0,li=void 0,ci=void 0,si=void 0;ui=function(e,t){for(var n=t.child;null!==n;){if(5===n.tag||6===n.tag)e.appendChild(n.stateNode);else if(4!==n.tag&&null!==n.child){n.child.return=n,n=n.child;continue}if(n===t)break;for(;null===n.sibling;){if(null===n.return||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},li=function(){},ci=function(e,t,n,r,a){var i=e.memoizedProps;if(i!==r){var u=t.stateNode;switch(wo(bo.current),e=null,n){case"input":i=bt(u,i),r=bt(u,r),e=[];break;case"option":i=Kn(u,i),r=Kn(u,r),e=[];break;case"select":i=o({},i,{value:void 0}),r=o({},r,{value:void 0}),e=[];break;case"textarea":i=Qn(u,i),r=Qn(u,r),e=[];break;default:"function"!=typeof i.onClick&&"function"==typeof r.onClick&&(u.onclick=mr)}fr(n,r),u=n=void 0;var l=null;for(n in i)if(!r.hasOwnProperty(n)&&i.hasOwnProperty(n)&&null!=i[n])if("style"===n){var c=i[n];for(u in c)c.hasOwnProperty(u)&&(l||(l={}),l[u]="")}else"dangerouslySetInnerHTML"!==n&&"children"!==n&&"suppressContentEditableWarning"!==n&&"suppressHydrationWarning"!==n&&"autoFocus"!==n&&(b.hasOwnProperty(n)?e||(e=[]):(e=e||[]).push(n,null));for(n in r){var s=r[n];if(c=null!=i?i[n]:void 0,r.hasOwnProperty(n)&&s!==c&&(null!=s||null!=c))if("style"===n)if(c){for(u in c)!c.hasOwnProperty(u)||s&&s.hasOwnProperty(u)||(l||(l={}),l[u]="");for(u in s)s.hasOwnProperty(u)&&c[u]!==s[u]&&(l||(l={}),l[u]=s[u])}else l||(e||(e=[]),e.push(n,l)),l=s;else"dangerouslySetInnerHTML"===n?(s=s?s.__html:void 0,c=c?c.__html:void 0,null!=s&&c!==s&&(e=e||[]).push(n,""+s)):"children"===n?c===s||"string"!=typeof s&&"number"!=typeof s||(e=e||[]).push(n,""+s):"suppressContentEditableWarning"!==n&&"suppressHydrationWarning"!==n&&(b.hasOwnProperty(n)?(null!=s&&dr(a,n),e||c===s||(e=[])):(e=e||[]).push(n,s))}l&&(e=e||[]).push("style",l),a=e,(t.updateQueue=a)&&ii(t)}},si=function(e,t,n,r){n!==r&&ii(t)};var fi="function"==typeof WeakSet?WeakSet:Set;function pi(e,t){var n=t.source,r=t.stack;null===r&&null!==n&&(r=lt(n)),null!==n&&ut(n.type),t=t.value,null!==e&&1===e.tag&&ut(e.type);try{console.error(t)}catch(e){setTimeout(function(){throw e})}}function di(e){var t=e.ref;if(null!==t)if("function"==typeof t)try{t(null)}catch(t){Gi(e,t)}else t.current=null}function mi(e,t,n){if(null!==(n=null!==(n=n.updateQueue)?n.lastEffect:null)){var r=n=n.next;do{if((r.tag&e)!==To){var o=r.destroy;r.destroy=void 0,void 0!==o&&o()}(r.tag&t)!==To&&(o=r.create,r.destroy=o()),r=r.next}while(r!==n)}}function hi(e){switch("function"==typeof $r&&$r(e),e.tag){case 0:case 11:case 14:case 15:var t=e.updateQueue;if(null!==t&&null!==(t=t.lastEffect)){var n=t=t.next;do{var r=n.destroy;if(void 0!==r){var o=e;try{r()}catch(e){Gi(o,e)}}n=n.next}while(n!==t)}break;case 1:if(di(e),"function"==typeof(t=e.stateNode).componentWillUnmount)try{t.props=e.memoizedProps,t.state=e.memoizedState,t.componentWillUnmount()}catch(t){Gi(e,t)}break;case 5:di(e);break;case 4:gi(e)}}function vi(e){return 5===e.tag||3===e.tag||4===e.tag}function yi(e){e:{for(var t=e.return;null!==t;){if(vi(t)){var n=t;break e}t=t.return}i("160"),n=void 0}var r=t=void 0;switch(n.tag){case 5:t=n.stateNode,r=!1;break;case 3:case 4:t=n.stateNode.containerInfo,r=!0;break;default:i("161")}16&n.effectTag&&(ar(t,""),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||vi(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag&&18!==n.tag;){if(2&n.effectTag)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.effectTag)){n=n.stateNode;break e}}for(var o=e;;){if(5===o.tag||6===o.tag)if(n)if(r){var a=t,u=o.stateNode,l=n;8===a.nodeType?a.parentNode.insertBefore(u,l):a.insertBefore(u,l)}else t.insertBefore(o.stateNode,n);else r?(u=t,l=o.stateNode,8===u.nodeType?(a=u.parentNode).insertBefore(l,u):(a=u).appendChild(l),null!=(u=u._reactRootContainer)||null!==a.onclick||(a.onclick=mr)):t.appendChild(o.stateNode);else if(4!==o.tag&&null!==o.child){o.child.return=o,o=o.child;continue}if(o===e)break;for(;null===o.sibling;){if(null===o.return||o.return===e)return;o=o.return}o.sibling.return=o.return,o=o.sibling}}function gi(e){for(var t=e,n=!1,r=void 0,o=void 0;;){if(!n){n=t.return;e:for(;;){switch(null===n&&i("160"),n.tag){case 5:r=n.stateNode,o=!1;break e;case 3:case 4:r=n.stateNode.containerInfo,o=!0;break e}n=n.return}n=!0}if(5===t.tag||6===t.tag){e:for(var a=t,u=a;;)if(hi(u),null!==u.child&&4!==u.tag)u.child.return=u,u=u.child;else{if(u===a)break;for(;null===u.sibling;){if(null===u.return||u.return===a)break e;u=u.return}u.sibling.return=u.return,u=u.sibling}o?(a=r,u=t.stateNode,8===a.nodeType?a.parentNode.removeChild(u):a.removeChild(u)):r.removeChild(t.stateNode)}else if(4===t.tag){if(null!==t.child){r=t.stateNode.containerInfo,o=!0,t.child.return=t,t=t.child;continue}}else if(hi(t),null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;4===(t=t.return).tag&&(n=!1)}t.sibling.return=t.return,t=t.sibling}}function bi(e,t){switch(t.tag){case 0:case 11:case 14:case 15:mi(Co,Po,t);break;case 1:break;case 5:var n=t.stateNode;if(null!=n){var r=t.memoizedProps;e=null!==e?e.memoizedProps:r;var o=t.type,a=t.updateQueue;t.updateQueue=null,null!==a&&function(e,t,n,r,o){e[A]=o,"input"===n&&"radio"===o.type&&null!=o.name&&Et(e,o),pr(n,r),r=pr(n,o);for(var a=0;a<t.length;a+=2){var i=t[a],u=t[a+1];"style"===i?cr(e,u):"dangerouslySetInnerHTML"===i?or(e,u):"children"===i?ar(e,u):yt(e,i,u,r)}switch(n){case"input":wt(e,o);break;case"textarea":Zn(e,o);break;case"select":t=e._wrapperState.wasMultiple,e._wrapperState.wasMultiple=!!o.multiple,null!=(n=o.value)?Gn(e,!!o.multiple,n,!1):t!==!!o.multiple&&(null!=o.defaultValue?Gn(e,!!o.multiple,o.defaultValue,!0):Gn(e,!!o.multiple,o.multiple?[]:"",!1))}}(n,a,o,e,r)}break;case 6:null===t.stateNode&&i("162"),t.stateNode.nodeValue=t.memoizedProps;break;case 3:case 12:break;case 13:if(n=t.memoizedState,r=void 0,e=t,null===n?r=!1:(r=!0,e=t.child,0===n.timedOutAt&&(n.timedOutAt=wu())),null!==e&&function(e,t){for(var n=e;;){if(5===n.tag){var r=n.stateNode;if(t)r.style.display="none";else{r=n.stateNode;var o=n.memoizedProps.style;o=null!=o&&o.hasOwnProperty("display")?o.display:null,r.style.display=lr("display",o)}}else if(6===n.tag)n.stateNode.nodeValue=t?"":n.memoizedProps;else{if(13===n.tag&&null!==n.memoizedState){(r=n.child.sibling).return=n,n=r;continue}if(null!==n.child){n.child.return=n,n=n.child;continue}}if(n===e)break;for(;null===n.sibling;){if(null===n.return||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}}(e,r),null!==(n=t.updateQueue)){t.updateQueue=null;var u=t.stateNode;null===u&&(u=t.stateNode=new fi),n.forEach(function(e){var n=function(e,t){var n=e.stateNode;null!==n&&n.delete(t),t=Qi(t=wu(),e),null!==(e=Zi(e,t))&&(Jr(e,t),0!==(t=e.expirationTime)&&xu(e,t))}.bind(null,t,e);u.has(e)||(u.add(e),e.then(n,n))})}break;case 17:break;default:i("163")}}var _i="function"==typeof WeakMap?WeakMap:Map;function Ei(e,t,n){(n=Ya(n)).tag=Ha,n.payload={element:null};var r=t.value;return n.callback=function(){Ru(r),pi(e,t)},n}function wi(e,t,n){(n=Ya(n)).tag=Ha;var r=e.type.getDerivedStateFromError;if("function"==typeof r){var o=t.value;n.payload=function(){return r(o)}}var a=e.stateNode;return null!==a&&"function"==typeof a.componentDidCatch&&(n.callback=function(){"function"!=typeof r&&(null===zi?zi=new Set([this]):zi.add(this));var n=t.value,o=t.stack;pi(e,t),this.componentDidCatch(n,{componentStack:null!==o?o:""})}),n}function xi(e){switch(e.tag){case 1:Ar(e.type)&&Ur();var t=e.effectTag;return 2048&t?(e.effectTag=-2049&t|64,e):null;case 3:return So(),Dr(),0!=(64&(t=e.effectTag))&&i("285"),e.effectTag=-2049&t|64,e;case 5:return No(e),null;case 13:return 2048&(t=e.effectTag)?(e.effectTag=-2049&t|64,e):null;case 18:return null;case 4:return So(),null;case 10:return Fa(e),null;default:return null}}var Si=Ve.ReactCurrentDispatcher,ki=Ve.ReactCurrentOwner,Ni=1073741822,Ti=!1,Oi=null,Ci=null,Pi=0,ji=-1,Ri=!1,Ii=null,Ai=!1,Ui=null,Di=null,Mi=null,zi=null;function Li(){if(null!==Oi)for(var e=Oi.return;null!==e;){var t=e;switch(t.tag){case 1:var n=t.type.childContextTypes;null!=n&&Ur();break;case 3:So(),Dr();break;case 5:No(t);break;case 4:So();break;case 10:Fa(t)}e=e.return}Ci=null,Pi=0,ji=-1,Ri=!1,Oi=null}function Fi(){for(;null!==Ii;){var e=Ii.effectTag;if(16&e&&ar(Ii.stateNode,""),128&e){var t=Ii.alternate;null!==t&&(null!==(t=t.ref)&&("function"==typeof t?t(null):t.current=null))}switch(14&e){case 2:yi(Ii),Ii.effectTag&=-3;break;case 6:yi(Ii),Ii.effectTag&=-3,bi(Ii.alternate,Ii);break;case 4:bi(Ii.alternate,Ii);break;case 8:gi(e=Ii),e.return=null,e.child=null,e.memoizedState=null,e.updateQueue=null,null!==(e=e.alternate)&&(e.return=null,e.child=null,e.memoizedState=null,e.updateQueue=null)}Ii=Ii.nextEffect}}function Wi(){for(;null!==Ii;){if(256&Ii.effectTag)e:{var e=Ii.alternate,t=Ii;switch(t.tag){case 0:case 11:case 15:mi(Oo,To,t);break e;case 1:if(256&t.effectTag&&null!==e){var n=e.memoizedProps,r=e.memoizedState;t=(e=t.stateNode).getSnapshotBeforeUpdate(t.elementType===t.type?n:ro(t.type,n),r),e.__reactInternalSnapshotBeforeUpdate=t}break e;case 3:case 5:case 6:case 4:case 17:break e;default:i("163")}}Ii=Ii.nextEffect}}function $i(e,t){for(;null!==Ii;){var n=Ii.effectTag;if(36&n){var r=Ii.alternate,o=Ii,a=t;switch(o.tag){case 0:case 11:case 15:mi(jo,Ro,o);break;case 1:var u=o.stateNode;if(4&o.effectTag)if(null===r)u.componentDidMount();else{var l=o.elementType===o.type?r.memoizedProps:ro(o.type,r.memoizedProps);u.componentDidUpdate(l,r.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}null!==(r=o.updateQueue)&&ri(0,r,u);break;case 3:if(null!==(r=o.updateQueue)){if(u=null,null!==o.child)switch(o.child.tag){case 5:u=o.child.stateNode;break;case 1:u=o.child.stateNode}ri(0,r,u)}break;case 5:a=o.stateNode,null===r&&4&o.effectTag&&yr(o.type,o.memoizedProps)&&a.focus();break;case 6:case 4:case 12:case 13:case 17:break;default:i("163")}}128&n&&(null!==(o=Ii.ref)&&(a=Ii.stateNode,"function"==typeof o?o(a):o.current=a)),512&n&&(Ui=e),Ii=Ii.nextEffect}}function Bi(){null!==Di&&wr(Di),null!==Mi&&Mi()}function Vi(e,t){Ai=Ti=!0,e.current===t&&i("177");var n=e.pendingCommitExpirationTime;0===n&&i("261"),e.pendingCommitExpirationTime=0;var r=t.expirationTime,o=t.childExpirationTime;for(function(e,t){if(e.didError=!1,0===t)e.earliestPendingTime=0,e.latestPendingTime=0,e.earliestSuspendedTime=0,e.latestSuspendedTime=0,e.latestPingedTime=0;else{t<e.latestPingedTime&&(e.latestPingedTime=0);var n=e.latestPendingTime;0!==n&&(n>t?e.earliestPendingTime=e.latestPendingTime=0:e.earliestPendingTime>t&&(e.earliestPendingTime=e.latestPendingTime)),0===(n=e.earliestSuspendedTime)?Jr(e,t):t<e.latestSuspendedTime?(e.earliestSuspendedTime=0,e.latestSuspendedTime=0,e.latestPingedTime=0,Jr(e,t)):t>n&&Jr(e,t)}no(0,e)}(e,o>r?o:r),ki.current=null,r=void 0,1<t.effectTag?null!==t.lastEffect?(t.lastEffect.nextEffect=t,r=t.firstEffect):r=t:r=t.firstEffect,hr=Sn,vr=function(){var e=Dn();if(Mn(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{var n=(t=(t=e.ownerDocument)&&t.defaultView||window).getSelection&&t.getSelection();if(n&&0!==n.rangeCount){t=n.anchorNode;var r=n.anchorOffset,o=n.focusNode;n=n.focusOffset;try{t.nodeType,o.nodeType}catch(e){t=null;break e}var a=0,i=-1,u=-1,l=0,c=0,s=e,f=null;t:for(;;){for(var p;s!==t||0!==r&&3!==s.nodeType||(i=a+r),s!==o||0!==n&&3!==s.nodeType||(u=a+n),3===s.nodeType&&(a+=s.nodeValue.length),null!==(p=s.firstChild);)f=s,s=p;for(;;){if(s===e)break t;if(f===t&&++l===r&&(i=a),f===o&&++c===n&&(u=a),null!==(p=s.nextSibling))break;f=(s=f).parentNode}s=p}t=-1===i||-1===u?null:{start:i,end:u}}else t=null}t=t||{start:0,end:0}}else t=null;return{focusedElem:e,selectionRange:t}}(),Sn=!1,Ii=r;null!==Ii;){o=!1;var u=void 0;try{Wi()}catch(e){o=!0,u=e}o&&(null===Ii&&i("178"),Gi(Ii,u),null!==Ii&&(Ii=Ii.nextEffect))}for(Ii=r;null!==Ii;){o=!1,u=void 0;try{Fi()}catch(e){o=!0,u=e}o&&(null===Ii&&i("178"),Gi(Ii,u),null!==Ii&&(Ii=Ii.nextEffect))}for(zn(vr),vr=null,Sn=!!hr,hr=null,e.current=t,Ii=r;null!==Ii;){o=!1,u=void 0;try{$i(e,n)}catch(e){o=!0,u=e}o&&(null===Ii&&i("178"),Gi(Ii,u),null!==Ii&&(Ii=Ii.nextEffect))}if(null!==r&&null!==Ui){var l=function(e,t){Mi=Di=Ui=null;var n=ou;ou=!0;do{if(512&t.effectTag){var r=!1,o=void 0;try{var a=t;mi(Ao,To,a),mi(To,Io,a)}catch(e){r=!0,o=e}r&&Gi(t,o)}t=t.nextEffect}while(null!==t);ou=n,0!==(n=e.expirationTime)&&xu(e,n),su||ou||Ou(1073741823,!1)}.bind(null,e,r);Di=a.unstable_runWithPriority(a.unstable_NormalPriority,function(){return Er(l)}),Mi=l}Ti=Ai=!1,"function"==typeof Wr&&Wr(t.stateNode),n=t.expirationTime,0===(t=(t=t.childExpirationTime)>n?t:n)&&(zi=null),function(e,t){e.expirationTime=t,e.finishedWork=null}(e,t)}function qi(e){for(;;){var t=e.alternate,n=e.return,r=e.sibling;if(0==(1024&e.effectTag)){Oi=e;e:{var a=t,u=Pi,l=(t=e).pendingProps;switch(t.tag){case 2:case 16:break;case 15:case 0:break;case 1:Ar(t.type)&&Ur();break;case 3:So(),Dr(),(l=t.stateNode).pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),null!==a&&null!==a.child||(ba(t),t.effectTag&=-3),li(t);break;case 5:No(t);var c=wo(Eo.current);if(u=t.type,null!==a&&null!=t.stateNode)ci(a,t,u,l,c),a.ref!==t.ref&&(t.effectTag|=128);else if(l){var s=wo(bo.current);if(ba(t)){a=(l=t).stateNode;var f=l.type,p=l.memoizedProps,d=c;switch(a[I]=l,a[A]=p,u=void 0,c=f){case"iframe":case"object":kn("load",a);break;case"video":case"audio":for(f=0;f<te.length;f++)kn(te[f],a);break;case"source":kn("error",a);break;case"img":case"image":case"link":kn("error",a),kn("load",a);break;case"form":kn("reset",a),kn("submit",a);break;case"details":kn("toggle",a);break;case"input":_t(a,p),kn("invalid",a),dr(d,"onChange");break;case"select":a._wrapperState={wasMultiple:!!p.multiple},kn("invalid",a),dr(d,"onChange");break;case"textarea":Yn(a,p),kn("invalid",a),dr(d,"onChange")}for(u in fr(c,p),f=null,p)p.hasOwnProperty(u)&&(s=p[u],"children"===u?"string"==typeof s?a.textContent!==s&&(f=["children",s]):"number"==typeof s&&a.textContent!==""+s&&(f=["children",""+s]):b.hasOwnProperty(u)&&null!=s&&dr(d,u));switch(c){case"input":$e(a),xt(a,p,!0);break;case"textarea":$e(a),Xn(a);break;case"select":case"option":break;default:"function"==typeof p.onClick&&(a.onclick=mr)}u=f,l.updateQueue=u,(l=null!==u)&&ii(t)}else{p=t,d=u,a=l,f=9===c.nodeType?c:c.ownerDocument,s===Jn.html&&(s=er(d)),s===Jn.html?"script"===d?((a=f.createElement("div")).innerHTML="<script><\/script>",f=a.removeChild(a.firstChild)):"string"==typeof a.is?f=f.createElement(d,{is:a.is}):(f=f.createElement(d),"select"===d&&(d=f,a.multiple?d.multiple=!0:a.size&&(d.size=a.size))):f=f.createElementNS(s,d),(a=f)[I]=p,a[A]=l,ui(a,t,!1,!1),d=a;var m=c,h=pr(f=u,p=l);switch(f){case"iframe":case"object":kn("load",d),c=p;break;case"video":case"audio":for(c=0;c<te.length;c++)kn(te[c],d);c=p;break;case"source":kn("error",d),c=p;break;case"img":case"image":case"link":kn("error",d),kn("load",d),c=p;break;case"form":kn("reset",d),kn("submit",d),c=p;break;case"details":kn("toggle",d),c=p;break;case"input":_t(d,p),c=bt(d,p),kn("invalid",d),dr(m,"onChange");break;case"option":c=Kn(d,p);break;case"select":d._wrapperState={wasMultiple:!!p.multiple},c=o({},p,{value:void 0}),kn("invalid",d),dr(m,"onChange");break;case"textarea":Yn(d,p),c=Qn(d,p),kn("invalid",d),dr(m,"onChange");break;default:c=p}fr(f,c),s=void 0;var v=f,y=d,g=c;for(s in g)if(g.hasOwnProperty(s)){var _=g[s];"style"===s?cr(y,_):"dangerouslySetInnerHTML"===s?null!=(_=_?_.__html:void 0)&&or(y,_):"children"===s?"string"==typeof _?("textarea"!==v||""!==_)&&ar(y,_):"number"==typeof _&&ar(y,""+_):"suppressContentEditableWarning"!==s&&"suppressHydrationWarning"!==s&&"autoFocus"!==s&&(b.hasOwnProperty(s)?null!=_&&dr(m,s):null!=_&&yt(y,s,_,h))}switch(f){case"input":$e(d),xt(d,p,!1);break;case"textarea":$e(d),Xn(d);break;case"option":null!=p.value&&d.setAttribute("value",""+gt(p.value));break;case"select":(c=d).multiple=!!p.multiple,null!=(d=p.value)?Gn(c,!!p.multiple,d,!1):null!=p.defaultValue&&Gn(c,!!p.multiple,p.defaultValue,!0);break;default:"function"==typeof c.onClick&&(d.onclick=mr)}(l=yr(u,l))&&ii(t),t.stateNode=a}null!==t.ref&&(t.effectTag|=128)}else null===t.stateNode&&i("166");break;case 6:a&&null!=t.stateNode?si(a,t,a.memoizedProps,l):("string"!=typeof l&&(null===t.stateNode&&i("166")),a=wo(Eo.current),wo(bo.current),ba(t)?(u=(l=t).stateNode,a=l.memoizedProps,u[I]=l,(l=u.nodeValue!==a)&&ii(t)):(u=t,(l=(9===a.nodeType?a:a.ownerDocument).createTextNode(l))[I]=t,u.stateNode=l));break;case 11:break;case 13:if(l=t.memoizedState,0!=(64&t.effectTag)){t.expirationTime=u,Oi=t;break e}l=null!==l,u=null!==a&&null!==a.memoizedState,null!==a&&!l&&u&&(null!==(a=a.child.sibling)&&(null!==(c=t.firstEffect)?(t.firstEffect=a,a.nextEffect=c):(t.firstEffect=t.lastEffect=a,a.nextEffect=null),a.effectTag=8)),(l||u)&&(t.effectTag|=4);break;case 7:case 8:case 12:break;case 4:So(),li(t);break;case 10:Fa(t);break;case 9:case 14:break;case 17:Ar(t.type)&&Ur();break;case 18:break;default:i("156")}Oi=null}if(t=e,1===Pi||1!==t.childExpirationTime){for(l=0,u=t.child;null!==u;)(a=u.expirationTime)>l&&(l=a),(c=u.childExpirationTime)>l&&(l=c),u=u.sibling;t.childExpirationTime=l}if(null!==Oi)return Oi;null!==n&&0==(1024&n.effectTag)&&(null===n.firstEffect&&(n.firstEffect=e.firstEffect),null!==e.lastEffect&&(null!==n.lastEffect&&(n.lastEffect.nextEffect=e.firstEffect),n.lastEffect=e.lastEffect),1<e.effectTag&&(null!==n.lastEffect?n.lastEffect.nextEffect=e:n.firstEffect=e,n.lastEffect=e))}else{if(null!==(e=xi(e)))return e.effectTag&=1023,e;null!==n&&(n.firstEffect=n.lastEffect=null,n.effectTag|=1024)}if(null!==r)return r;if(null===n)break;e=n}return null}function Hi(e){var t=Aa(e.alternate,e,Pi);return e.memoizedProps=e.pendingProps,null===t&&(t=qi(e)),ki.current=null,t}function Ki(e,t){Ti&&i("243"),Bi(),Ti=!0;var n=Si.current;Si.current=ca;var r=e.nextExpirationTimeToWorkOn;r===Pi&&e===Ci&&null!==Oi||(Li(),Pi=r,Oi=Kr((Ci=e).current,null),e.pendingCommitExpirationTime=0);for(var o=!1;;){try{if(t)for(;null!==Oi&&!Nu();)Oi=Hi(Oi);else for(;null!==Oi;)Oi=Hi(Oi)}catch(t){if(za=Ma=Da=null,Xo(),null===Oi)o=!0,Ru(t);else{null===Oi&&i("271");var a=Oi,u=a.return;if(null!==u){e:{var l=e,c=u,s=a,f=t;if(u=Pi,s.effectTag|=1024,s.firstEffect=s.lastEffect=null,null!==f&&"object"==typeof f&&"function"==typeof f.then){var p=f;f=c;var d=-1,m=-1;do{if(13===f.tag){var h=f.alternate;if(null!==h&&null!==(h=h.memoizedState)){m=10*(1073741822-h.timedOutAt);break}"number"==typeof(h=f.pendingProps.maxDuration)&&(0>=h?d=0:(-1===d||h<d)&&(d=h))}f=f.return}while(null!==f);f=c;do{if((h=13===f.tag)&&(h=void 0!==f.memoizedProps.fallback&&null===f.memoizedState),h){if(null===(c=f.updateQueue)?((c=new Set).add(p),f.updateQueue=c):c.add(p),0==(1&f.mode)){f.effectTag|=64,s.effectTag&=-1957,1===s.tag&&(null===s.alternate?s.tag=17:((u=Ya(1073741823)).tag=qa,Xa(s,u))),s.expirationTime=1073741823;break e}c=u;var v=(s=l).pingCache;null===v?(v=s.pingCache=new _i,h=new Set,v.set(p,h)):void 0===(h=v.get(p))&&(h=new Set,v.set(p,h)),h.has(c)||(h.add(c),s=Yi.bind(null,s,p,c),p.then(s,s)),-1===d?l=1073741823:(-1===m&&(m=10*(1073741822-to(l,u))-5e3),l=m+d),0<=l&&ji<l&&(ji=l),f.effectTag|=2048,f.expirationTime=u;break e}f=f.return}while(null!==f);f=Error((ut(s.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display."+lt(s))}Ri=!0,f=ai(f,s),l=c;do{switch(l.tag){case 3:l.effectTag|=2048,l.expirationTime=u,Ja(l,u=Ei(l,f,u));break e;case 1:if(d=f,m=l.type,s=l.stateNode,0==(64&l.effectTag)&&("function"==typeof m.getDerivedStateFromError||null!==s&&"function"==typeof s.componentDidCatch&&(null===zi||!zi.has(s)))){l.effectTag|=2048,l.expirationTime=u,Ja(l,u=wi(l,d,u));break e}}l=l.return}while(null!==l)}Oi=qi(a);continue}o=!0,Ru(t)}}break}if(Ti=!1,Si.current=n,za=Ma=Da=null,Xo(),o)Ci=null,e.finishedWork=null;else if(null!==Oi)e.finishedWork=null;else{if(null===(n=e.current.alternate)&&i("281"),Ci=null,Ri){if(o=e.latestPendingTime,a=e.latestSuspendedTime,u=e.latestPingedTime,0!==o&&o<r||0!==a&&a<r||0!==u&&u<r)return eo(e,r),void Eu(e,n,r,e.expirationTime,-1);if(!e.didError&&t)return e.didError=!0,r=e.nextExpirationTimeToWorkOn=r,t=e.expirationTime=1073741823,void Eu(e,n,r,t,-1)}t&&-1!==ji?(eo(e,r),(t=10*(1073741822-to(e,r)))<ji&&(ji=t),t=10*(1073741822-wu()),t=ji-t,Eu(e,n,r,e.expirationTime,0>t?0:t)):(e.pendingCommitExpirationTime=r,e.finishedWork=n)}}function Gi(e,t){for(var n=e.return;null!==n;){switch(n.tag){case 1:var r=n.stateNode;if("function"==typeof n.type.getDerivedStateFromError||"function"==typeof r.componentDidCatch&&(null===zi||!zi.has(r)))return Xa(n,e=wi(n,e=ai(t,e),1073741823)),void Xi(n,1073741823);break;case 3:return Xa(n,e=Ei(n,e=ai(t,e),1073741823)),void Xi(n,1073741823)}n=n.return}3===e.tag&&(Xa(e,n=Ei(e,n=ai(t,e),1073741823)),Xi(e,1073741823))}function Qi(e,t){var n=a.unstable_getCurrentPriorityLevel(),r=void 0;if(0==(1&t.mode))r=1073741823;else if(Ti&&!Ai)r=Pi;else{switch(n){case a.unstable_ImmediatePriority:r=1073741823;break;case a.unstable_UserBlockingPriority:r=1073741822-10*(1+((1073741822-e+15)/10|0));break;case a.unstable_NormalPriority:r=1073741822-25*(1+((1073741822-e+500)/25|0));break;case a.unstable_LowPriority:case a.unstable_IdlePriority:r=1;break;default:i("313")}null!==Ci&&r===Pi&&--r}return n===a.unstable_UserBlockingPriority&&(0===uu||r<uu)&&(uu=r),r}function Yi(e,t,n){var r=e.pingCache;null!==r&&r.delete(t),null!==Ci&&Pi===n?Ci=null:(t=e.earliestSuspendedTime,r=e.latestSuspendedTime,0!==t&&n<=t&&n>=r&&(e.didError=!1,(0===(t=e.latestPingedTime)||t>n)&&(e.latestPingedTime=n),no(n,e),0!==(n=e.expirationTime)&&xu(e,n)))}function Zi(e,t){e.expirationTime<t&&(e.expirationTime=t);var n=e.alternate;null!==n&&n.expirationTime<t&&(n.expirationTime=t);var r=e.return,o=null;if(null===r&&3===e.tag)o=e.stateNode;else for(;null!==r;){if(n=r.alternate,r.childExpirationTime<t&&(r.childExpirationTime=t),null!==n&&n.childExpirationTime<t&&(n.childExpirationTime=t),null===r.return&&3===r.tag){o=r.stateNode;break}r=r.return}return o}function Xi(e,t){null!==(e=Zi(e,t))&&(!Ti&&0!==Pi&&t>Pi&&Li(),Jr(e,t),Ti&&!Ai&&Ci===e||xu(e,e.expirationTime),yu>vu&&(yu=0,i("185")))}function Ji(e,t,n,r,o){return a.unstable_runWithPriority(a.unstable_ImmediatePriority,function(){return e(t,n,r,o)})}var eu=null,tu=null,nu=0,ru=void 0,ou=!1,au=null,iu=0,uu=0,lu=!1,cu=null,su=!1,fu=!1,pu=null,du=a.unstable_now(),mu=1073741822-(du/10|0),hu=mu,vu=50,yu=0,gu=null;function bu(){mu=1073741822-((a.unstable_now()-du)/10|0)}function _u(e,t){if(0!==nu){if(t<nu)return;null!==ru&&a.unstable_cancelCallback(ru)}nu=t,e=a.unstable_now()-du,ru=a.unstable_scheduleCallback(Tu,{timeout:10*(1073741822-t)-e})}function Eu(e,t,n,r,o){e.expirationTime=r,0!==o||Nu()?0<o&&(e.timeoutHandle=br(function(e,t,n){e.pendingCommitExpirationTime=n,e.finishedWork=t,bu(),hu=mu,Cu(e,n)}.bind(null,e,t,n),o)):(e.pendingCommitExpirationTime=n,e.finishedWork=t)}function wu(){return ou?hu:(Su(),0!==iu&&1!==iu||(bu(),hu=mu),hu)}function xu(e,t){null===e.nextScheduledRoot?(e.expirationTime=t,null===tu?(eu=tu=e,e.nextScheduledRoot=e):(tu=tu.nextScheduledRoot=e).nextScheduledRoot=eu):t>e.expirationTime&&(e.expirationTime=t),ou||(su?fu&&(au=e,iu=1073741823,Pu(e,1073741823,!1)):1073741823===t?Ou(1073741823,!1):_u(e,t))}function Su(){var e=0,t=null;if(null!==tu)for(var n=tu,r=eu;null!==r;){var o=r.expirationTime;if(0===o){if((null===n||null===tu)&&i("244"),r===r.nextScheduledRoot){eu=tu=r.nextScheduledRoot=null;break}if(r===eu)eu=o=r.nextScheduledRoot,tu.nextScheduledRoot=o,r.nextScheduledRoot=null;else{if(r===tu){(tu=n).nextScheduledRoot=eu,r.nextScheduledRoot=null;break}n.nextScheduledRoot=r.nextScheduledRoot,r.nextScheduledRoot=null}r=n.nextScheduledRoot}else{if(o>e&&(e=o,t=r),r===tu)break;if(1073741823===e)break;n=r,r=r.nextScheduledRoot}}au=t,iu=e}var ku=!1;function Nu(){return!!ku||!!a.unstable_shouldYield()&&(ku=!0)}function Tu(){try{if(!Nu()&&null!==eu){bu();var e=eu;do{var t=e.expirationTime;0!==t&&mu<=t&&(e.nextExpirationTimeToWorkOn=mu),e=e.nextScheduledRoot}while(e!==eu)}Ou(0,!0)}finally{ku=!1}}function Ou(e,t){if(Su(),t)for(bu(),hu=mu;null!==au&&0!==iu&&e<=iu&&!(ku&&mu>iu);)Pu(au,iu,mu>iu),Su(),bu(),hu=mu;else for(;null!==au&&0!==iu&&e<=iu;)Pu(au,iu,!1),Su();if(t&&(nu=0,ru=null),0!==iu&&_u(au,iu),yu=0,gu=null,null!==pu)for(e=pu,pu=null,t=0;t<e.length;t++){var n=e[t];try{n._onComplete()}catch(e){lu||(lu=!0,cu=e)}}if(lu)throw e=cu,cu=null,lu=!1,e}function Cu(e,t){ou&&i("253"),au=e,iu=t,Pu(e,t,!1),Ou(1073741823,!1)}function Pu(e,t,n){if(ou&&i("245"),ou=!0,n){var r=e.finishedWork;null!==r?ju(e,r,t):(e.finishedWork=null,-1!==(r=e.timeoutHandle)&&(e.timeoutHandle=-1,_r(r)),Ki(e,n),null!==(r=e.finishedWork)&&(Nu()?e.finishedWork=r:ju(e,r,t)))}else null!==(r=e.finishedWork)?ju(e,r,t):(e.finishedWork=null,-1!==(r=e.timeoutHandle)&&(e.timeoutHandle=-1,_r(r)),Ki(e,n),null!==(r=e.finishedWork)&&ju(e,r,t));ou=!1}function ju(e,t,n){var r=e.firstBatch;if(null!==r&&r._expirationTime>=n&&(null===pu?pu=[r]:pu.push(r),r._defer))return e.finishedWork=t,void(e.expirationTime=0);e.finishedWork=null,e===gu?yu++:(gu=e,yu=0),a.unstable_runWithPriority(a.unstable_ImmediatePriority,function(){Vi(e,t)})}function Ru(e){null===au&&i("246"),au.expirationTime=0,lu||(lu=!0,cu=e)}function Iu(e,t){var n=su;su=!0;try{return e(t)}finally{(su=n)||ou||Ou(1073741823,!1)}}function Au(e,t){if(su&&!fu){fu=!0;try{return e(t)}finally{fu=!1}}return e(t)}function Uu(e,t,n){su||ou||0===uu||(Ou(uu,!1),uu=0);var r=su;su=!0;try{return a.unstable_runWithPriority(a.unstable_UserBlockingPriority,function(){return e(t,n)})}finally{(su=r)||ou||Ou(1073741823,!1)}}function Du(e,t,n,r,o){var a=t.current;e:if(n){t:{2===tn(n=n._reactInternalFiber)&&1===n.tag||i("170");var u=n;do{switch(u.tag){case 3:u=u.stateNode.context;break t;case 1:if(Ar(u.type)){u=u.stateNode.__reactInternalMemoizedMergedChildContext;break t}}u=u.return}while(null!==u);i("171"),u=void 0}if(1===n.tag){var l=n.type;if(Ar(l)){n=zr(n,l,u);break e}}n=u}else n=Cr;return null===t.context?t.context=n:t.pendingContext=n,t=o,(o=Ya(r)).payload={element:e},null!==(t=void 0===t?null:t)&&(o.callback=t),Bi(),Xa(a,o),Xi(a,r),r}function Mu(e,t,n,r){var o=t.current;return Du(e,t,n,o=Qi(wu(),o),r)}function zu(e){if(!(e=e.current).child)return null;switch(e.child.tag){case 5:default:return e.child.stateNode}}function Lu(e){var t=1073741822-25*(1+((1073741822-wu()+500)/25|0));t>=Ni&&(t=Ni-1),this._expirationTime=Ni=t,this._root=e,this._callbacks=this._next=null,this._hasChildren=this._didComplete=!1,this._children=null,this._defer=!0}function Fu(){this._callbacks=null,this._didCommit=!1,this._onCommit=this._onCommit.bind(this)}function Wu(e,t,n){e={current:t=qr(3,null,null,t?3:0),containerInfo:e,pendingChildren:null,pingCache:null,earliestPendingTime:0,latestPendingTime:0,earliestSuspendedTime:0,latestSuspendedTime:0,latestPingedTime:0,didError:!1,pendingCommitExpirationTime:0,finishedWork:null,timeoutHandle:-1,context:null,pendingContext:null,hydrate:n,nextExpirationTimeToWorkOn:0,expirationTime:0,firstBatch:null,nextScheduledRoot:null},this._internalRoot=t.stateNode=e}function $u(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function Bu(e,t,n,r,o){var a=n._reactRootContainer;if(a){if("function"==typeof o){var i=o;o=function(){var e=zu(a._internalRoot);i.call(e)}}null!=e?a.legacy_renderSubtreeIntoContainer(e,t,o):a.render(t,o)}else{if(a=n._reactRootContainer=function(e,t){if(t||(t=!(!(t=e?9===e.nodeType?e.documentElement:e.firstChild:null)||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new Wu(e,!1,t)}(n,r),"function"==typeof o){var u=o;o=function(){var e=zu(a._internalRoot);u.call(e)}}Au(function(){null!=e?a.legacy_renderSubtreeIntoContainer(e,t,o):a.render(t,o)})}return zu(a._internalRoot)}function Vu(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;return $u(t)||i("200"),function(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:Ge,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}(e,t,null,n)}Ne=function(e,t,n){switch(t){case"input":if(wt(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=z(r);o||i("90"),Be(r),wt(r,o)}}}break;case"textarea":Zn(e,n);break;case"select":null!=(t=n.value)&&Gn(e,!!n.multiple,t,!1)}},Lu.prototype.render=function(e){this._defer||i("250"),this._hasChildren=!0,this._children=e;var t=this._root._internalRoot,n=this._expirationTime,r=new Fu;return Du(e,t,null,n,r._onCommit),r},Lu.prototype.then=function(e){if(this._didComplete)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},Lu.prototype.commit=function(){var e=this._root._internalRoot,t=e.firstBatch;if(this._defer&&null!==t||i("251"),this._hasChildren){var n=this._expirationTime;if(t!==this){this._hasChildren&&(n=this._expirationTime=t._expirationTime,this.render(this._children));for(var r=null,o=t;o!==this;)r=o,o=o._next;null===r&&i("251"),r._next=o._next,this._next=t,e.firstBatch=this}this._defer=!1,Cu(e,n),t=this._next,this._next=null,null!==(t=e.firstBatch=t)&&t._hasChildren&&t.render(t._children)}else this._next=null,this._defer=!1},Lu.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++)(0,e[t])()}},Fu.prototype.then=function(e){if(this._didCommit)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},Fu.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++){var n=e[t];"function"!=typeof n&&i("191",n),n()}}},Wu.prototype.render=function(e,t){var n=this._internalRoot,r=new Fu;return null!==(t=void 0===t?null:t)&&r.then(t),Mu(e,n,null,r._onCommit),r},Wu.prototype.unmount=function(e){var t=this._internalRoot,n=new Fu;return null!==(e=void 0===e?null:e)&&n.then(e),Mu(null,t,null,n._onCommit),n},Wu.prototype.legacy_renderSubtreeIntoContainer=function(e,t,n){var r=this._internalRoot,o=new Fu;return null!==(n=void 0===n?null:n)&&o.then(n),Mu(t,r,e,o._onCommit),o},Wu.prototype.createBatch=function(){var e=new Lu(this),t=e._expirationTime,n=this._internalRoot,r=n.firstBatch;if(null===r)n.firstBatch=e,e._next=null;else{for(n=null;null!==r&&r._expirationTime>=t;)n=r,r=r._next;e._next=r,null!==n&&(n._next=e)}return e},Re=Iu,Ie=Uu,Ae=function(){ou||0===uu||(Ou(uu,!1),uu=0)};var qu={createPortal:Vu,findDOMNode:function(e){if(null==e)return null;if(1===e.nodeType)return e;var t=e._reactInternalFiber;return void 0===t&&("function"==typeof e.render?i("188"):i("268",Object.keys(e))),e=null===(e=rn(t))?null:e.stateNode},hydrate:function(e,t,n){return $u(t)||i("200"),Bu(null,e,t,!0,n)},render:function(e,t,n){return $u(t)||i("200"),Bu(null,e,t,!1,n)},unstable_renderSubtreeIntoContainer:function(e,t,n,r){return $u(n)||i("200"),(null==e||void 0===e._reactInternalFiber)&&i("38"),Bu(e,t,n,!1,r)},unmountComponentAtNode:function(e){return $u(e)||i("40"),!!e._reactRootContainer&&(Au(function(){Bu(null,null,e,!1,function(){e._reactRootContainer=null})}),!0)},unstable_createPortal:function(){return Vu.apply(void 0,arguments)},unstable_batchedUpdates:Iu,unstable_interactiveUpdates:Uu,flushSync:function(e,t){ou&&i("187");var n=su;su=!0;try{return Ji(e,t)}finally{su=n,Ou(1073741823,!1)}},unstable_createRoot:function(e,t){return $u(e)||i("299","unstable_createRoot"),new Wu(e,!0,null!=t&&!0===t.hydrate)},unstable_flushControlled:function(e){var t=su;su=!0;try{Ji(e)}finally{(su=t)||ou||Ou(1073741823,!1)}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{Events:[D,M,z,C.injectEventPluginsByName,g,V,function(e){N(e,B)},Pe,je,On,j]}};!function(e){var t=e.findFiberByHostInstance;(function(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);Wr=Br(function(e){return t.onCommitFiberRoot(n,e)}),$r=Br(function(e){return t.onCommitFiberUnmount(n,e)})}catch(e){}})(o({},e,{overrideProps:null,currentDispatcherRef:Ve.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return null===(e=rn(e))?null:e.stateNode},findFiberByHostInstance:function(e){return t?t(e):null}}))}({findFiberByHostInstance:U,bundleType:0,version:"16.8.6",rendererPackageName:"react-dom"});var Hu={default:qu},Ku=Hu&&qu||Hu;e.exports=Ku.default||Ku},function(e,t,n){"use strict";e.exports=n(48)},function(e,t,n){"use strict";(function(e){
/** @license React v0.13.6
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(t,"__esModule",{value:!0});var n=null,r=!1,o=3,a=-1,i=-1,u=!1,l=!1;function c(){if(!u){var e=n.expirationTime;l?x():l=!0,w(p,e)}}function s(){var e=n,t=n.next;if(n===t)n=null;else{var r=n.previous;n=r.next=t,t.previous=r}e.next=e.previous=null,r=e.callback,t=e.expirationTime,e=e.priorityLevel;var a=o,u=i;o=e,i=t;try{var l=r()}finally{o=a,i=u}if("function"==typeof l)if(l={callback:l,priorityLevel:e,expirationTime:t,next:null,previous:null},null===n)n=l.next=l.previous=l;else{r=null,e=n;do{if(e.expirationTime>=t){r=e;break}e=e.next}while(e!==n);null===r?r=n:r===n&&(n=l,c()),(t=r.previous).next=r.previous=l,l.next=r,l.previous=t}}function f(){if(-1===a&&null!==n&&1===n.priorityLevel){u=!0;try{do{s()}while(null!==n&&1===n.priorityLevel)}finally{u=!1,null!==n?c():l=!1}}}function p(e){u=!0;var o=r;r=e;try{if(e)for(;null!==n;){var a=t.unstable_now();if(!(n.expirationTime<=a))break;do{s()}while(null!==n&&n.expirationTime<=a)}else if(null!==n)do{s()}while(null!==n&&!S())}finally{u=!1,r=o,null!==n?c():l=!1,f()}}var d,m,h=Date,v="function"==typeof setTimeout?setTimeout:void 0,y="function"==typeof clearTimeout?clearTimeout:void 0,g="function"==typeof requestAnimationFrame?requestAnimationFrame:void 0,b="function"==typeof cancelAnimationFrame?cancelAnimationFrame:void 0;function _(e){d=g(function(t){y(m),e(t)}),m=v(function(){b(d),e(t.unstable_now())},100)}if("object"==typeof performance&&"function"==typeof performance.now){var E=performance;t.unstable_now=function(){return E.now()}}else t.unstable_now=function(){return h.now()};var w,x,S,k=null;if("undefined"!=typeof window?k=window:void 0!==e&&(k=e),k&&k._schedMock){var N=k._schedMock;w=N[0],x=N[1],S=N[2],t.unstable_now=N[3]}else if("undefined"==typeof window||"function"!=typeof MessageChannel){var T=null,O=function(e){if(null!==T)try{T(e)}finally{T=null}};w=function(e){null!==T?setTimeout(w,0,e):(T=e,setTimeout(O,0,!1))},x=function(){T=null},S=function(){return!1}}else{"undefined"!=typeof console&&("function"!=typeof g&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),"function"!=typeof b&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));var C=null,P=!1,j=-1,R=!1,I=!1,A=0,U=33,D=33;S=function(){return A<=t.unstable_now()};var M=new MessageChannel,z=M.port2;M.port1.onmessage=function(){P=!1;var e=C,n=j;C=null,j=-1;var r=t.unstable_now(),o=!1;if(0>=A-r){if(!(-1!==n&&n<=r))return R||(R=!0,_(L)),C=e,void(j=n);o=!0}if(null!==e){I=!0;try{e(o)}finally{I=!1}}};var L=function(e){if(null!==C){_(L);var t=e-A+D;t<D&&U<D?(8>t&&(t=8),D=t<U?U:t):U=t,A=e+D,P||(P=!0,z.postMessage(void 0))}else R=!1};w=function(e,t){C=e,j=t,I||0>t?z.postMessage(void 0):R||(R=!0,_(L))},x=function(){C=null,P=!1,j=-1}}t.unstable_ImmediatePriority=1,t.unstable_UserBlockingPriority=2,t.unstable_NormalPriority=3,t.unstable_IdlePriority=5,t.unstable_LowPriority=4,t.unstable_runWithPriority=function(e,n){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var r=o,i=a;o=e,a=t.unstable_now();try{return n()}finally{o=r,a=i,f()}},t.unstable_next=function(e){switch(o){case 1:case 2:case 3:var n=3;break;default:n=o}var r=o,i=a;o=n,a=t.unstable_now();try{return e()}finally{o=r,a=i,f()}},t.unstable_scheduleCallback=function(e,r){var i=-1!==a?a:t.unstable_now();if("object"==typeof r&&null!==r&&"number"==typeof r.timeout)r=i+r.timeout;else switch(o){case 1:r=i+-1;break;case 2:r=i+250;break;case 5:r=i+1073741823;break;case 4:r=i+1e4;break;default:r=i+5e3}if(e={callback:e,priorityLevel:o,expirationTime:r,next:null,previous:null},null===n)n=e.next=e.previous=e,c();else{i=null;var u=n;do{if(u.expirationTime>r){i=u;break}u=u.next}while(u!==n);null===i?i=n:i===n&&(n=e,c()),(r=i.previous).next=i.previous=e,e.next=i,e.previous=r}return e},t.unstable_cancelCallback=function(e){var t=e.next;if(null!==t){if(t===e)n=null;else{e===n&&(n=t);var r=e.previous;r.next=t,t.previous=r}e.next=e.previous=null}},t.unstable_wrapCallback=function(e){var n=o;return function(){var r=o,i=a;o=n,a=t.unstable_now();try{return e.apply(this,arguments)}finally{o=r,a=i,f()}}},t.unstable_getCurrentPriorityLevel=function(){return o},t.unstable_shouldYield=function(){return!r&&(null!==n&&n.expirationTime<i||S())},t.unstable_continueExecution=function(){null!==n&&c()},t.unstable_pauseExecution=function(){},t.unstable_getFirstCallbackNode=function(){return n}}).call(this,n(4))},function(e,t,n){var r=n(50),o=n(107)(function(e,t,n){r(e,t,n)});e.exports=o},function(e,t,n){var r=n(51),o=n(29),a=n(82),i=n(84),u=n(3),l=n(39),c=n(38);e.exports=function e(t,n,s,f,p){t!==n&&a(n,function(a,l){if(u(a))p||(p=new r),i(t,n,l,s,e,f,p);else{var d=f?f(c(t,l),a,l+"",t,n,p):void 0;void 0===d&&(d=a),o(t,l,d)}},l)}},function(e,t,n){var r=n(9),o=n(57),a=n(58),i=n(59),u=n(60),l=n(61);function c(e){var t=this.__data__=new r(e);this.size=t.size}c.prototype.clear=o,c.prototype.delete=a,c.prototype.get=i,c.prototype.has=u,c.prototype.set=l,e.exports=c},function(e,t){e.exports=function(){this.__data__=[],this.size=0}},function(e,t,n){var r=n(10),o=Array.prototype.splice;e.exports=function(e){var t=this.__data__,n=r(t,e);return!(n<0||(n==t.length-1?t.pop():o.call(t,n,1),--this.size,0))}},function(e,t,n){var r=n(10);e.exports=function(e){var t=this.__data__,n=r(t,e);return n<0?void 0:t[n][1]}},function(e,t,n){var r=n(10);e.exports=function(e){return r(this.__data__,e)>-1}},function(e,t,n){var r=n(10);e.exports=function(e,t){var n=this.__data__,o=r(n,e);return o<0?(++this.size,n.push([e,t])):n[o][1]=t,this}},function(e,t,n){var r=n(9);e.exports=function(){this.__data__=new r,this.size=0}},function(e,t){e.exports=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}},function(e,t){e.exports=function(e){return this.__data__.get(e)}},function(e,t){e.exports=function(e){return this.__data__.has(e)}},function(e,t,n){var r=n(9),o=n(26),a=n(69),i=200;e.exports=function(e,t){var n=this.__data__;if(n instanceof r){var u=n.__data__;if(!o||u.length<i-1)return u.push([e,t]),this.size=++n.size,this;n=this.__data__=new a(u)}return n.set(e,t),this.size=n.size,this}},function(e,t,n){var r=n(19),o=n(65),a=n(3),i=n(67),u=/^\[object .+?Constructor\]$/,l=Function.prototype,c=Object.prototype,s=l.toString,f=c.hasOwnProperty,p=RegExp("^"+s.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=function(e){return!(!a(e)||o(e))&&(r(e)?p:u).test(i(e))}},function(e,t,n){var r=n(27),o=Object.prototype,a=o.hasOwnProperty,i=o.toString,u=r?r.toStringTag:void 0;e.exports=function(e){var t=a.call(e,u),n=e[u];try{e[u]=void 0;var r=!0}catch(e){}var o=i.call(e);return r&&(t?e[u]=n:delete e[u]),o}},function(e,t){var n=Object.prototype.toString;e.exports=function(e){return n.call(e)}},function(e,t,n){var r,o=n(66),a=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";e.exports=function(e){return!!a&&a in e}},function(e,t,n){var r=n(5)["__core-js_shared__"];e.exports=r},function(e,t){var n=Function.prototype.toString;e.exports=function(e){if(null!=e){try{return n.call(e)}catch(e){}try{return e+""}catch(e){}}return""}},function(e,t){e.exports=function(e,t){return null==e?void 0:e[t]}},function(e,t,n){var r=n(70),o=n(77),a=n(79),i=n(80),u=n(81);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=a,l.prototype.has=i,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(71),o=n(9),a=n(26);e.exports=function(){this.size=0,this.__data__={hash:new r,map:new(a||o),string:new r}}},function(e,t,n){var r=n(72),o=n(73),a=n(74),i=n(75),u=n(76);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=a,l.prototype.has=i,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(13);e.exports=function(){this.__data__=r?r(null):{},this.size=0}},function(e,t){e.exports=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}},function(e,t,n){var r=n(13),o="__lodash_hash_undefined__",a=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;if(r){var n=t[e];return n===o?void 0:n}return a.call(t,e)?t[e]:void 0}},function(e,t,n){var r=n(13),o=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;return r?void 0!==t[e]:o.call(t,e)}},function(e,t,n){var r=n(13),o="__lodash_hash_undefined__";e.exports=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=r&&void 0===t?o:t,this}},function(e,t,n){var r=n(14);e.exports=function(e){var t=r(this,e).delete(e);return this.size-=t?1:0,t}},function(e,t){e.exports=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}},function(e,t,n){var r=n(14);e.exports=function(e){return r(this,e).get(e)}},function(e,t,n){var r=n(14);e.exports=function(e){return r(this,e).has(e)}},function(e,t,n){var r=n(14);e.exports=function(e,t){var n=r(this,e),o=n.size;return n.set(e,t),this.size+=n.size==o?0:1,this}},function(e,t,n){var r=n(83)();e.exports=r},function(e,t){e.exports=function(e){return function(t,n,r){for(var o=-1,a=Object(t),i=r(t),u=i.length;u--;){var l=i[e?u:++o];if(!1===n(a[l],l,a))break}return t}}},function(e,t,n){var r=n(29),o=n(85),a=n(86),i=n(89),u=n(90),l=n(33),c=n(34),s=n(94),f=n(36),p=n(19),d=n(3),m=n(96),h=n(37),v=n(38),y=n(100);e.exports=function(e,t,n,g,b,_,E){var w=v(e,n),x=v(t,n),S=E.get(x);if(S)r(e,n,S);else{var k=_?_(w,x,n+"",e,t,E):void 0,N=void 0===k;if(N){var T=c(x),O=!T&&f(x),C=!T&&!O&&h(x);k=x,T||O||C?c(w)?k=w:s(w)?k=i(w):O?(N=!1,k=o(x,!0)):C?(N=!1,k=a(x,!0)):k=[]:m(x)||l(x)?(k=w,l(w)?k=y(w):d(w)&&!p(w)||(k=u(x))):N=!1}N&&(E.set(x,k),b(k,x,g,_,E),E.delete(x)),r(e,n,k)}}},function(e,t,n){(function(e){var r=n(5),o=t&&!t.nodeType&&t,a=o&&"object"==typeof e&&e&&!e.nodeType&&e,i=a&&a.exports===o?r.Buffer:void 0,u=i?i.allocUnsafe:void 0;e.exports=function(e,t){if(t)return e.slice();var n=e.length,r=u?u(n):new e.constructor(n);return e.copy(r),r}}).call(this,n(15)(e))},function(e,t,n){var r=n(87);e.exports=function(e,t){var n=t?r(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}},function(e,t,n){var r=n(88);e.exports=function(e){var t=new e.constructor(e.byteLength);return new r(t).set(new r(e)),t}},function(e,t,n){var r=n(5).Uint8Array;e.exports=r},function(e,t){e.exports=function(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}},function(e,t,n){var r=n(91),o=n(31),a=n(32);e.exports=function(e){return"function"!=typeof e.constructor||a(e)?{}:r(o(e))}},function(e,t,n){var r=n(3),o=Object.create,a=function(){function e(){}return function(t){if(!r(t))return{};if(o)return o(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();e.exports=a},function(e,t){e.exports=function(e,t){return function(n){return e(t(n))}}},function(e,t,n){var r=n(12),o=n(6),a="[object Arguments]";e.exports=function(e){return o(e)&&r(e)==a}},function(e,t,n){var r=n(21),o=n(6);e.exports=function(e){return o(e)&&r(e)}},function(e,t){e.exports=function(){return!1}},function(e,t,n){var r=n(12),o=n(31),a=n(6),i="[object Object]",u=Function.prototype,l=Object.prototype,c=u.toString,s=l.hasOwnProperty,f=c.call(Object);e.exports=function(e){if(!a(e)||r(e)!=i)return!1;var t=o(e);if(null===t)return!0;var n=s.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==f}},function(e,t,n){var r=n(12),o=n(35),a=n(6),i={};i["[object Float32Array]"]=i["[object Float64Array]"]=i["[object Int8Array]"]=i["[object Int16Array]"]=i["[object Int32Array]"]=i["[object Uint8Array]"]=i["[object Uint8ClampedArray]"]=i["[object Uint16Array]"]=i["[object Uint32Array]"]=!0,i["[object Arguments]"]=i["[object Array]"]=i["[object ArrayBuffer]"]=i["[object Boolean]"]=i["[object DataView]"]=i["[object Date]"]=i["[object Error]"]=i["[object Function]"]=i["[object Map]"]=i["[object Number]"]=i["[object Object]"]=i["[object RegExp]"]=i["[object Set]"]=i["[object String]"]=i["[object WeakMap]"]=!1,e.exports=function(e){return a(e)&&o(e.length)&&!!i[r(e)]}},function(e,t){e.exports=function(e){return function(t){return e(t)}}},function(e,t,n){(function(e){var r=n(28),o=t&&!t.nodeType&&t,a=o&&"object"==typeof e&&e&&!e.nodeType&&e,i=a&&a.exports===o&&r.process,u=function(){try{var e=a&&a.require&&a.require("util").types;return e||i&&i.binding&&i.binding("util")}catch(e){}}();e.exports=u}).call(this,n(15)(e))},function(e,t,n){var r=n(101),o=n(39);e.exports=function(e){return r(e,o(e))}},function(e,t,n){var r=n(102),o=n(20);e.exports=function(e,t,n,a){var i=!n;n||(n={});for(var u=-1,l=t.length;++u<l;){var c=t[u],s=a?a(n[c],e[c],c,n,e):void 0;void 0===s&&(s=e[c]),i?o(n,c,s):r(n,c,s)}return n}},function(e,t,n){var r=n(20),o=n(11),a=Object.prototype.hasOwnProperty;e.exports=function(e,t,n){var i=e[t];a.call(e,t)&&o(i,n)&&(void 0!==n||t in e)||r(e,t,n)}},function(e,t,n){var r=n(104),o=n(33),a=n(34),i=n(36),u=n(40),l=n(37),c=Object.prototype.hasOwnProperty;e.exports=function(e,t){var n=a(e),s=!n&&o(e),f=!n&&!s&&i(e),p=!n&&!s&&!f&&l(e),d=n||s||f||p,m=d?r(e.length,String):[],h=m.length;for(var v in e)!t&&!c.call(e,v)||d&&("length"==v||f&&("offset"==v||"parent"==v)||p&&("buffer"==v||"byteLength"==v||"byteOffset"==v)||u(v,h))||m.push(v);return m}},function(e,t){e.exports=function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}},function(e,t,n){var r=n(3),o=n(32),a=n(106),i=Object.prototype.hasOwnProperty;e.exports=function(e){if(!r(e))return a(e);var t=o(e),n=[];for(var u in e)("constructor"!=u||!t&&i.call(e,u))&&n.push(u);return n}},function(e,t){e.exports=function(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}},function(e,t,n){var r=n(108),o=n(115);e.exports=function(e){return r(function(t,n){var r=-1,a=n.length,i=a>1?n[a-1]:void 0,u=a>2?n[2]:void 0;for(i=e.length>3&&"function"==typeof i?(a--,i):void 0,u&&o(n[0],n[1],u)&&(i=a<3?void 0:i,a=1),t=Object(t);++r<a;){var l=n[r];l&&e(t,l,r,i)}return t})}},function(e,t,n){var r=n(41),o=n(109),a=n(111);e.exports=function(e,t){return a(o(e,t,r),e+"")}},function(e,t,n){var r=n(110),o=Math.max;e.exports=function(e,t,n){return t=o(void 0===t?e.length-1:t,0),function(){for(var a=arguments,i=-1,u=o(a.length-t,0),l=Array(u);++i<u;)l[i]=a[t+i];i=-1;for(var c=Array(t+1);++i<t;)c[i]=a[i];return c[t]=n(l),r(e,this,c)}}},function(e,t){e.exports=function(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}},function(e,t,n){var r=n(112),o=n(114)(r);e.exports=o},function(e,t,n){var r=n(113),o=n(30),a=n(41),i=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:a;e.exports=i},function(e,t){e.exports=function(e){return function(){return e}}},function(e,t){var n=800,r=16,o=Date.now;e.exports=function(e){var t=0,a=0;return function(){var i=o(),u=r-(i-a);if(a=i,u>0){if(++t>=n)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}},function(e,t,n){var r=n(11),o=n(21),a=n(40),i=n(3);e.exports=function(e,t,n){if(!i(n))return!1;var u=typeof t;return!!("number"==u?o(n)&&a(t,n.length):"string"==u&&t in n)&&r(n[t],e)}},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t,n){"use strict";var r=n(118);function o(){}function a(){}a.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,a,i){if(i!==r){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:a,resetWarningCache:o};return n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";
/** @license React v16.8.6
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&Symbol.for,o=r?Symbol.for("react.element"):60103,a=r?Symbol.for("react.portal"):60106,i=r?Symbol.for("react.fragment"):60107,u=r?Symbol.for("react.strict_mode"):60108,l=r?Symbol.for("react.profiler"):60114,c=r?Symbol.for("react.provider"):60109,s=r?Symbol.for("react.context"):60110,f=r?Symbol.for("react.async_mode"):60111,p=r?Symbol.for("react.concurrent_mode"):60111,d=r?Symbol.for("react.forward_ref"):60112,m=r?Symbol.for("react.suspense"):60113,h=r?Symbol.for("react.memo"):60115,v=r?Symbol.for("react.lazy"):60116;function y(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case o:switch(e=e.type){case f:case p:case i:case l:case u:case m:return e;default:switch(e=e&&e.$$typeof){case s:case d:case c:return e;default:return t}}case v:case h:case a:return t}}}function g(e){return y(e)===p}t.typeOf=y,t.AsyncMode=f,t.ConcurrentMode=p,t.ContextConsumer=s,t.ContextProvider=c,t.Element=o,t.ForwardRef=d,t.Fragment=i,t.Lazy=v,t.Memo=h,t.Portal=a,t.Profiler=l,t.StrictMode=u,t.Suspense=m,t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===i||e===p||e===l||e===u||e===m||"object"==typeof e&&null!==e&&(e.$$typeof===v||e.$$typeof===h||e.$$typeof===c||e.$$typeof===s||e.$$typeof===d)},t.isAsyncMode=function(e){return g(e)||y(e)===f},t.isConcurrentMode=g,t.isContextConsumer=function(e){return y(e)===s},t.isContextProvider=function(e){return y(e)===c},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===o},t.isForwardRef=function(e){return y(e)===d},t.isFragment=function(e){return y(e)===i},t.isLazy=function(e){return y(e)===v},t.isMemo=function(e){return y(e)===h},t.isPortal=function(e){return y(e)===a},t.isProfiler=function(e){return y(e)===l},t.isStrictMode=function(e){return y(e)===u},t.isSuspense=function(e){return y(e)===m}},function(e,t,n){"use strict";t.__esModule=!0;var r=n(0),o=(i(r),i(n(1))),a=i(n(121));i(n(122));function i(e){return e&&e.__esModule?e:{default:e}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=1073741823;t.default=function(e,t){var n,i,f="__create-react-context-"+(0,a.default)()+"__",p=function(e){function n(){var t,r,o,a;u(this,n);for(var i=arguments.length,c=Array(i),s=0;s<i;s++)c[s]=arguments[s];return t=r=l(this,e.call.apply(e,[this].concat(c))),r.emitter=(o=r.props.value,a=[],{on:function(e){a.push(e)},off:function(e){a=a.filter(function(t){return t!==e})},get:function(){return o},set:function(e,t){o=e,a.forEach(function(e){return e(o,t)})}}),l(r,t)}return c(n,e),n.prototype.getChildContext=function(){var e;return(e={})[f]=this.emitter,e},n.prototype.componentWillReceiveProps=function(e){if(this.props.value!==e.value){var n=this.props.value,r=e.value,o=void 0;((a=n)===(i=r)?0!==a||1/a==1/i:a!=a&&i!=i)?o=0:(o="function"==typeof t?t(n,r):s,0!=(o|=0)&&this.emitter.set(e.value,o))}var a,i},n.prototype.render=function(){return this.props.children},n}(r.Component);p.childContextTypes=((n={})[f]=o.default.object.isRequired,n);var d=function(t){function n(){var e,r;u(this,n);for(var o=arguments.length,a=Array(o),i=0;i<o;i++)a[i]=arguments[i];return e=r=l(this,t.call.apply(t,[this].concat(a))),r.state={value:r.getValue()},r.onUpdate=function(e,t){0!=((0|r.observedBits)&t)&&r.setState({value:r.getValue()})},l(r,e)}return c(n,t),n.prototype.componentWillReceiveProps=function(e){var t=e.observedBits;this.observedBits=null==t?s:t},n.prototype.componentDidMount=function(){this.context[f]&&this.context[f].on(this.onUpdate);var e=this.props.observedBits;this.observedBits=null==e?s:e},n.prototype.componentWillUnmount=function(){this.context[f]&&this.context[f].off(this.onUpdate)},n.prototype.getValue=function(){return this.context[f]?this.context[f].get():e},n.prototype.render=function(){return(e=this.props.children,Array.isArray(e)?e[0]:e)(this.state.value);var e},n}(r.Component);return d.contextTypes=((i={})[f]=o.default.object,i),{Provider:p,Consumer:d}},e.exports=t.default},function(e,t,n){"use strict";(function(t){var n="__global_unique_id__";e.exports=function(){return t[n]=(t[n]||0)+1}}).call(this,n(4))},function(e,t,n){"use strict";var r=n(123);e.exports=r},function(e,t,n){"use strict";function r(e){return function(){return e}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},e.exports=o},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(16),i=n.n(a),u=n(22),l=function(){return Math.random().toString(36).substring(7).split("").join(".")},c={INIT:"@@redux/INIT"+l(),REPLACE:"@@redux/REPLACE"+l(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+l()}};function s(e){if("object"!=typeof e||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function f(e,t,n){var r;if("function"==typeof t&&"function"==typeof n||"function"==typeof n&&"function"==typeof arguments[3])throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function");if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(f)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var o=e,a=t,i=[],l=i,p=!1;function d(){l===i&&(l=i.slice())}function m(){if(p)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return a}function h(e){if("function"!=typeof e)throw new Error("Expected the listener to be a function.");if(p)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");var t=!0;return d(),l.push(e),function(){if(t){if(p)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");t=!1,d();var n=l.indexOf(e);l.splice(n,1)}}}function v(e){if(!s(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(p)throw new Error("Reducers may not dispatch actions.");try{p=!0,a=o(a,e)}finally{p=!1}for(var t=i=l,n=0;n<t.length;n++){(0,t[n])()}return e}return v({type:c.INIT}),(r={dispatch:v,subscribe:h,getState:m,replaceReducer:function(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");o=e,v({type:c.REPLACE})}})[u.a]=function(){var e,t=h;return(e={subscribe:function(e){if("object"!=typeof e||null===e)throw new TypeError("Expected the observer to be an object.");function n(){e.next&&e.next(m())}return n(),{unsubscribe:t(n)}}})[u.a]=function(){return this},e},r}function p(e,t){var n=t&&t.type;return"Given "+(n&&'action "'+String(n)+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function d(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var o=t[r];0,"function"==typeof e[o]&&(n[o]=e[o])}var a,i=Object.keys(n);try{!function(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:c.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:c.PROBE_UNKNOWN_ACTION()}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+c.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}(n)}catch(e){a=e}return function(e,t){if(void 0===e&&(e={}),a)throw a;for(var r=!1,o={},u=0;u<i.length;u++){var l=i[u],c=n[l],s=e[l],f=c(s,t);if(void 0===f){var d=p(l,t);throw new Error(d)}o[l]=f,r=r||f!==s}return r?o:e}}function m(e,t){return function(){return t(e.apply(this,arguments))}}function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(){var n=e.apply(void 0,arguments),r=function(){throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")},o={getState:n.getState,dispatch:function(){return r.apply(void 0,arguments)}},a=t.map(function(e){return e(o)});return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){h(e,t,n[t])})}return e}({},n,{dispatch:r=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}.apply(void 0,a)(n.dispatch)})}}}var y=n(42),g=n.n(y),b=function(e){return{type:"RECEIVE_CURRENT_USER",user:e}},_=function(e){return{type:"RECEIVE_ERRORS",errors:e}},E=function(){return{type:"CLEAR_ERRORS"}},w=function(e){return function(t){return(n=e,$.ajax({url:"/api/session",method:"POST",data:{user:n}})).then(function(e){return t(b(e))},function(e){return t(_(e.responseJSON))});var n}},x=function(){return function(e){return $.ajax({url:"/api/session",method:"DELETE"}).then(function(){return e({type:"LOGOUT_CURRENT_USER"})})}},S=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"api/users/".concat(e)})}(e).then(function(e){return t(b(e))},function(e){return t(_(e.responseJSON))})}},k={currentUser:null},N=function(){return function(e){return $.ajax({method:"GET",url:"api/products/"}).then(function(t){return e(function(e){return{type:"RECEIVE_PRODUCTS",products:e}}(t))})}},T=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"api/products/".concat(e)})}(e).then(function(e){return t({type:"RECEIVE_PRODUCT",payload:e}),e})}},O=function(e){return{type:"RECEIVE_ORDER",order:e.order,orderItems:e.orderItems,products:e.products,productItems:e.productItems,users:e.users}},C=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"api/orders/".concat(e)})}(e).then(function(e){return t(O(e))})}};window.fetchOrder=C;var P=function(e){return{type:"RECEIVE_ORDER_ITEM",orderItem:e.orderItems}},j=function(e,t){return function(e){return function(e,t){return $.ajax({method:"POST",url:"api/orders/".concat(t.order_id,"/order_items"),data:{orderItem:t}})}(0,t).then(function(t){return e(P(t))})}},R=function(e,t,n){return function(t){return(r=e,o=n,$.ajax({method:"DELETE",url:"api/orders/".concat(o,"/order_items/").concat(r),orderItem:{order_id:o,id:r}})).then(function(e){return t(function(e){return{type:"REMOVE_ORDER_ITEM",orderItemId:e.orderItems.id}}(e))});var r,o}};n(49);var I=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;Object.freeze(e);var n,r,o,a,i=Object.assign({},e);switch(t.type){case"RECEIVE_PRODUCTS":return Object.assign(i,t.products);case"RECEIVE_PRODUCT":return n=t.payload.product,Object.assign(i,(r={},o=n.id,a=n,o in r?Object.defineProperty(r,o,{value:a,enumerable:!0,configurable:!0,writable:!0}):r[o]=a,r));case"RECEIVE_ORDER":return Object.assign(i,t.products);default:return e}},A=function(e){return{type:"RECEIVE_PRODUCT_ITEM",productItem:e}},U=function(e){return function(t){return(n=e,$.ajax({method:"PATCH",url:"api/product_items/".concat(n.id),data:{product_item:n}})).then(function(e){return t(A(e))});var n}},D=n(2);var M=d({products:I,productItems:function(){var e,t,n,r,o,a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(a),i.type){case"RECEIVE_PRODUCT_ITEM":return e=Object(D.merge)({},a,(n={},r=i.productItem.id,o=i.productItem,r in n?Object.defineProperty(n,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):n[r]=o,n));case"RECEIVE_PRODUCT":return t=i.payload.product_items,Object(D.merge)({},a,t);case"RECEIVE_ORDER":return e=Object(D.merge)({},e,i.productItems);default:return a}},orders:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_ORDER":return Object(D.merge)({},e,t.order);case"RECEIVE_PRODUCT":return Object(D.merge)({},e,t.payload.orders);case"LOGOUT_CURRENT_USER":return{};default:return e}},orderItems:function(){var e,t,n,r,o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments.length>1?arguments[1]:void 0,i=Object.assign({},o);switch(Object.freeze(o),a.type){case"RECEIVE_ORDER_ITEM":return i=Object.assign(i,(t={},n=a.orderItem.id,r=a.orderItem,n in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r,t));case"REMOVE_ORDER_ITEM":return delete(i=Object(D.merge)({},o))[a.orderItemId],i;case"RECEIVE_ORDER":return i=Object.assign(i,a.orderItems);case"RECEIVE_PRODUCT":return e=a.payload.order_items,Object.assign(i,e);case"LOGOUT_CURRENT_USER":return{};default:return o}}}),z=function(e){return function(t){return(n=e,$.ajax({url:"/api/users",method:"POST",data:{user:n}})).then(function(e){return t(function(e){return{type:"RECEIVE_CURRENT_USER",user:e}}(e))},function(e){return t(function(e){return{type:"RECEIVE_SIGNUP_ERRORS",errors:e}}(e.responseJSON))});var n}},L=d({session:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":return[];case"RECEIVE_ERRORS":return t.errors;case"CLEAR_ERRORS":return[];default:return e}},signup:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":return[];case"RECEIVE_SIGNUP_ERRORS":return t.errors;default:return e}}}),F=d({entities:M,session:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:k,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":var n;return n=t.user,Object.assign({},{currentUser:n});case"LOGOUT_CURRENT_USER":return k;default:return e}},errors:L}),W=function(e){var t=e.dispatch,n=e.getState;return function(e){return function(r){return"function"==typeof r?r(t,n):e(r)}}},B=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return f(F,e,v(W,g.a))};function V(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var q=n(1),H=n.n(q),K=o.a.createContext(null);var G=function(e){e()},Q=function(){return G},Y=null,Z={notify:function(){}};var X=function(){function e(e,t){this.store=e,this.parentSub=t,this.unsubscribe=null,this.listeners=Z,this.handleChangeWrapper=this.handleChangeWrapper.bind(this)}var t=e.prototype;return t.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},t.notifyNestedSubs=function(){this.listeners.notify()},t.handleChangeWrapper=function(){this.onStateChange&&this.onStateChange()},t.isSubscribed=function(){return Boolean(this.unsubscribe)},t.trySubscribe=function(){var e,t,n;this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.handleChangeWrapper):this.store.subscribe(this.handleChangeWrapper),this.listeners=(e=Q(),t=[],n=[],{clear:function(){n=Y,t=Y},notify:function(){var r=t=n;e(function(){for(var e=0;e<r.length;e++)r[e]()})},get:function(){return n},subscribe:function(e){var r=!0;return n===t&&(n=t.slice()),n.push(e),function(){r&&t!==Y&&(r=!1,n===t&&(n=t.slice()),n.splice(n.indexOf(e),1))}}}))},t.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=Z)},e}(),J=function(e){function t(t){var n;n=e.call(this,t)||this;var r=t.store;n.notifySubscribers=n.notifySubscribers.bind(function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(n));var o=new X(r);return o.onStateChange=n.notifySubscribers,n.state={store:r,subscription:o},n.previousState=r.getState(),n}V(t,e);var n=t.prototype;return n.componentDidMount=function(){this._isMounted=!0,this.state.subscription.trySubscribe(),this.previousState!==this.props.store.getState()&&this.state.subscription.notifyNestedSubs()},n.componentWillUnmount=function(){this.unsubscribe&&this.unsubscribe(),this.state.subscription.tryUnsubscribe(),this._isMounted=!1},n.componentDidUpdate=function(e){if(this.props.store!==e.store){this.state.subscription.tryUnsubscribe();var t=new X(this.props.store);t.onStateChange=this.notifySubscribers,this.setState({store:this.props.store,subscription:t})}},n.notifySubscribers=function(){this.state.subscription.notifyNestedSubs()},n.render=function(){var e=this.props.context||K;return o.a.createElement(e.Provider,{value:this.state},this.props.children)},t}(r.Component);J.propTypes={store:H.a.shape({subscribe:H.a.func.isRequired,dispatch:H.a.func.isRequired,getState:H.a.func.isRequired}),context:H.a.object,children:H.a.any};var ee=J;function te(){return(te=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function ne(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}var re=n(7),oe=n.n(re),ae=n(8),ie=n.n(ae),ue=n(17),le=[],ce=[null,null];function se(e,t){var n=e[1];return[t.payload,n+1]}var fe=function(){return[null,0]},pe="undefined"!=typeof window?r.useLayoutEffect:r.useEffect;function de(e,t){void 0===t&&(t={});var n=t,a=n.getDisplayName,i=void 0===a?function(e){return"ConnectAdvanced("+e+")"}:a,u=n.methodName,l=void 0===u?"connectAdvanced":u,c=n.renderCountProp,s=void 0===c?void 0:c,f=n.shouldHandleStateChanges,p=void 0===f||f,d=n.storeKey,m=void 0===d?"store":d,h=n.withRef,v=void 0!==h&&h,y=n.forwardRef,g=void 0!==y&&y,b=n.context,_=void 0===b?K:b,E=ne(n,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef","forwardRef","context"]);ie()(void 0===s,"renderCountProp is removed. render counting is built into the latest React Dev Tools profiling extension"),ie()(!v,"withRef is removed. To access the wrapped instance, use a ref on the connected component");ie()("store"===m,"storeKey has been removed and does not do anything. To use a custom Redux store for specific components, create a custom React context with React.createContext(), and pass the context object to React Redux's Provider and specific components like: <Provider context={MyContext}><ConnectedComponent context={MyContext} /></Provider>. You may also pass a {context : MyContext} option to connect");var w=_;return function(t){var n=t.displayName||t.name||"Component",a=i(n),u=te({},E,{getDisplayName:i,methodName:l,renderCountProp:s,shouldHandleStateChanges:p,storeKey:m,displayName:a,wrappedComponentName:n,WrappedComponent:t}),c=E.pure;var f=c?r.useMemo:function(e){return e()};function d(n){var i=Object(r.useMemo)(function(){return[n.context,n.forwardedRef,ne(n,["context","forwardedRef"])]},[n]),l=i[0],c=i[1],s=i[2],d=Object(r.useMemo)(function(){return l&&l.Consumer&&Object(ue.isContextConsumer)(o.a.createElement(l.Consumer,null))?l:w},[l,w]),m=Object(r.useContext)(d),h=Boolean(n.store),v=Boolean(m)&&Boolean(m.store);ie()(h||v,'Could not find "store" in the context of "'+a+'". Either wrap the root component in a <Provider>, or pass a custom React context provider to <Provider> and the corresponding React context consumer to '+a+" in connect options.");var y=n.store||m.store,g=Object(r.useMemo)(function(){return function(t){return e(t.dispatch,u)}(y)},[y]),b=Object(r.useMemo)(function(){if(!p)return ce;var e=new X(y,h?null:m.subscription),t=e.notifyNestedSubs.bind(e);return[e,t]},[y,h,m]),_=b[0],E=b[1],x=Object(r.useMemo)(function(){return h?m:te({},m,{subscription:_})},[h,m,_]),S=Object(r.useReducer)(se,le,fe),k=S[0][0],N=S[1];if(k&&k.error)throw k.error;var T=Object(r.useRef)(),O=Object(r.useRef)(s),C=Object(r.useRef)(),P=Object(r.useRef)(!1),j=f(function(){return C.current&&s===O.current?C.current:g(y.getState(),s)},[y,k,s]);pe(function(){O.current=s,T.current=j,P.current=!1,C.current&&(C.current=null,E())}),pe(function(){if(p){var e=!1,t=null,n=function(){if(!e){var n,r,o=y.getState();try{n=g(o,O.current)}catch(e){r=e,t=e}r||(t=null),n===T.current?P.current||E():(T.current=n,C.current=n,P.current=!0,N({type:"STORE_UPDATED",payload:{latestStoreState:o,error:r}}))}};_.onStateChange=n,_.trySubscribe(),n();return function(){if(e=!0,_.tryUnsubscribe(),t)throw t}}},[y,_,g]);var R=Object(r.useMemo)(function(){return o.a.createElement(t,te({},j,{ref:c}))},[c,t,j]);return Object(r.useMemo)(function(){return p?o.a.createElement(d.Provider,{value:x},R):R},[d,R,x])}var h=c?o.a.memo(d):d;if(h.WrappedComponent=t,h.displayName=a,g){var v=o.a.forwardRef(function(e,t){return o.a.createElement(h,te({},e,{forwardedRef:t}))});return v.displayName=a,v.WrappedComponent=t,oe()(v,t)}return oe()(h,t)}}var me=Object.prototype.hasOwnProperty;function he(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function ve(e,t){if(he(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var o=0;o<n.length;o++)if(!me.call(t,n[o])||!he(e[n[o]],t[n[o]]))return!1;return!0}function ye(e){return function(t,n){var r=e(t,n);function o(){return r}return o.dependsOnOwnProps=!1,o}}function ge(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function be(e,t){return function(t,n){n.displayName;var r=function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)};return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=ge(e);var o=r(t,n);return"function"==typeof o&&(r.mapToProps=o,r.dependsOnOwnProps=ge(o),o=r(t,n)),o},r}}var _e=[function(e){return"function"==typeof e?be(e):void 0},function(e){return e?void 0:ye(function(e){return{dispatch:e}})},function(e){return e&&"object"==typeof e?ye(function(t){return function(e,t){if("function"==typeof e)return m(e,t);if("object"!=typeof e||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),r={},o=0;o<n.length;o++){var a=n[o],i=e[a];"function"==typeof i&&(r[a]=m(i,t))}return r}(e,t)}):void 0}];var Ee=[function(e){return"function"==typeof e?be(e):void 0},function(e){return e?void 0:ye(function(){return{}})}];function we(e,t,n){return te({},n,e,t)}var xe=[function(e){return"function"==typeof e?function(e){return function(t,n){n.displayName;var r,o=n.pure,a=n.areMergedPropsEqual,i=!1;return function(t,n,u){var l=e(t,n,u);return i?o&&a(l,r)||(r=l):(i=!0,r=l),r}}}(e):void 0},function(e){return e?void 0:function(){return we}}];function Se(e,t,n,r){return function(o,a){return n(e(o,a),t(r,a),a)}}function ke(e,t,n,r,o){var a,i,u,l,c,s=o.areStatesEqual,f=o.areOwnPropsEqual,p=o.areStatePropsEqual,d=!1;function m(o,d){var m,h,v=!f(d,i),y=!s(o,a);return a=o,i=d,v&&y?(u=e(a,i),t.dependsOnOwnProps&&(l=t(r,i)),c=n(u,l,i)):v?(e.dependsOnOwnProps&&(u=e(a,i)),t.dependsOnOwnProps&&(l=t(r,i)),c=n(u,l,i)):y?(m=e(a,i),h=!p(m,u),u=m,h&&(c=n(u,l,i)),c):c}return function(o,s){return d?m(o,s):(u=e(a=o,i=s),l=t(r,i),c=n(u,l,i),d=!0,c)}}function Ne(e,t){var n=t.initMapStateToProps,r=t.initMapDispatchToProps,o=t.initMergeProps,a=ne(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),i=n(e,a),u=r(e,a),l=o(e,a);return(a.pure?ke:Se)(i,u,l,e,a)}function Te(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function Oe(e,t){return e===t}var Ce,Pe,je,Re,Ie,Ae,Ue,De,Me,ze,Le,Fe,We,$e=(je=(Pe=void 0===Ce?{}:Ce).connectHOC,Re=void 0===je?de:je,Ie=Pe.mapStateToPropsFactories,Ae=void 0===Ie?Ee:Ie,Ue=Pe.mapDispatchToPropsFactories,De=void 0===Ue?_e:Ue,Me=Pe.mergePropsFactories,ze=void 0===Me?xe:Me,Le=Pe.selectorFactory,Fe=void 0===Le?Ne:Le,function(e,t,n,r){void 0===r&&(r={});var o=r,a=o.pure,i=void 0===a||a,u=o.areStatesEqual,l=void 0===u?Oe:u,c=o.areOwnPropsEqual,s=void 0===c?ve:c,f=o.areStatePropsEqual,p=void 0===f?ve:f,d=o.areMergedPropsEqual,m=void 0===d?ve:d,h=ne(o,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),v=Te(e,Ae,"mapStateToProps"),y=Te(t,De,"mapDispatchToProps"),g=Te(n,ze,"mergeProps");return Re(Fe,te({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:v,initMapDispatchToProps:y,initMergeProps:g,pure:i,areStatesEqual:l,areOwnPropsEqual:s,areStatePropsEqual:p,areMergedPropsEqual:m},h))});We=a.unstable_batchedUpdates,G=We;var Be=n(44),Ve=n.n(Be);function qe(e){return"/"===e.charAt(0)}function He(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}var Ke=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],r=t&&t.split("/")||[],o=e&&qe(e),a=t&&qe(t),i=o||a;if(e&&qe(e)?r=n:n.length&&(r.pop(),r=r.concat(n)),!r.length)return"/";var u=void 0;if(r.length){var l=r[r.length-1];u="."===l||".."===l||""===l}else u=!1;for(var c=0,s=r.length;s>=0;s--){var f=r[s];"."===f?He(r,s):".."===f?(He(r,s),c++):c&&(He(r,s),c--)}if(!i)for(;c--;c)r.unshift("..");!i||""===r[0]||r[0]&&qe(r[0])||r.unshift("");var p=r.join("/");return u&&"/"!==p.substr(-1)&&(p+="/"),p},Ge="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var Qe=function e(t,n){if(t===n)return!0;if(null==t||null==n)return!1;if(Array.isArray(t))return Array.isArray(n)&&t.length===n.length&&t.every(function(t,r){return e(t,n[r])});var r=void 0===t?"undefined":Ge(t);if(r!==(void 0===n?"undefined":Ge(n)))return!1;if("object"===r){var o=t.valueOf(),a=n.valueOf();if(o!==t||a!==n)return e(o,a);var i=Object.keys(t),u=Object.keys(n);return i.length===u.length&&i.every(function(r){return e(t[r],n[r])})}return!1},Ye=!0,Ze="Invariant failed";var Xe=function(e,t){if(!e)throw Ye?new Error(Ze):new Error(Ze+": "+(t||""))};function Je(e){return"/"===e.charAt(0)?e:"/"+e}function et(e){return"/"===e.charAt(0)?e.substr(1):e}function tt(e,t){return function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)}(e,t)?e.substr(t.length):e}function nt(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e}function rt(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}function ot(e,t,n,r){var o;"string"==typeof e?(o=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var a=t.indexOf("?");return-1!==a&&(n=t.substr(a),t=t.substr(0,a)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}}(e)).state=t:(void 0===(o=te({},e)).pathname&&(o.pathname=""),o.search?"?"!==o.search.charAt(0)&&(o.search="?"+o.search):o.search="",o.hash?"#"!==o.hash.charAt(0)&&(o.hash="#"+o.hash):o.hash="",void 0!==t&&void 0===o.state&&(o.state=t));try{o.pathname=decodeURI(o.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+o.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(o.key=n),r?o.pathname?"/"!==o.pathname.charAt(0)&&(o.pathname=Ke(o.pathname,r.pathname)):o.pathname=r.pathname:o.pathname||(o.pathname="/"),o}function at(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&Qe(e.state,t.state)}function it(){var e=null;var t=[];return{setPrompt:function(t){return e=t,function(){e===t&&(e=null)}},confirmTransitionTo:function(t,n,r,o){if(null!=e){var a="function"==typeof e?e(t,n):e;"string"==typeof a?"function"==typeof r?r(a,o):o(!0):o(!1!==a)}else o(!0)},appendListener:function(e){var n=!0;function r(){n&&e.apply(void 0,arguments)}return t.push(r),function(){n=!1,t=t.filter(function(e){return e!==r})}},notifyListeners:function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];t.forEach(function(e){return e.apply(void 0,n)})}}}var ut=!("undefined"==typeof window||!window.document||!window.document.createElement);function lt(e,t){t(window.confirm(e))}var ct="popstate",st="hashchange";function ft(){try{return window.history.state||{}}catch(e){return{}}}function pt(e){void 0===e&&(e={}),ut||Xe(!1);var t,n=window.history,r=(-1===(t=window.navigator.userAgent).indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone"))&&window.history&&"pushState"in window.history,o=!(-1===window.navigator.userAgent.indexOf("Trident")),a=e,i=a.forceRefresh,u=void 0!==i&&i,l=a.getUserConfirmation,c=void 0===l?lt:l,s=a.keyLength,f=void 0===s?6:s,p=e.basename?nt(Je(e.basename)):"";function d(e){var t=e||{},n=t.key,r=t.state,o=window.location,a=o.pathname+o.search+o.hash;return p&&(a=tt(a,p)),ot(a,r,n)}function m(){return Math.random().toString(36).substr(2,f)}var h=it();function v(e){te(O,e),O.length=n.length,h.notifyListeners(O.location,O.action)}function y(e){(function(e){void 0===e.state&&navigator.userAgent.indexOf("CriOS")})(e)||_(d(e.state))}function g(){_(d(ft()))}var b=!1;function _(e){if(b)b=!1,v();else{h.confirmTransitionTo(e,"POP",c,function(t){t?v({action:"POP",location:e}):function(e){var t=O.location,n=w.indexOf(t.key);-1===n&&(n=0);var r=w.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(b=!0,S(o))}(e)})}}var E=d(ft()),w=[E.key];function x(e){return p+rt(e)}function S(e){n.go(e)}var k=0;function N(e){1===(k+=e)&&1===e?(window.addEventListener(ct,y),o&&window.addEventListener(st,g)):0===k&&(window.removeEventListener(ct,y),o&&window.removeEventListener(st,g))}var T=!1;var O={length:n.length,action:"POP",location:E,createHref:x,push:function(e,t){var o=ot(e,t,m(),O.location);h.confirmTransitionTo(o,"PUSH",c,function(e){if(e){var t=x(o),a=o.key,i=o.state;if(r)if(n.pushState({key:a,state:i},null,t),u)window.location.href=t;else{var l=w.indexOf(O.location.key),c=w.slice(0,-1===l?0:l+1);c.push(o.key),w=c,v({action:"PUSH",location:o})}else window.location.href=t}})},replace:function(e,t){var o=ot(e,t,m(),O.location);h.confirmTransitionTo(o,"REPLACE",c,function(e){if(e){var t=x(o),a=o.key,i=o.state;if(r)if(n.replaceState({key:a,state:i},null,t),u)window.location.replace(t);else{var l=w.indexOf(O.location.key);-1!==l&&(w[l]=o.key),v({action:"REPLACE",location:o})}else window.location.replace(t)}})},go:S,goBack:function(){S(-1)},goForward:function(){S(1)},block:function(e){void 0===e&&(e=!1);var t=h.setPrompt(e);return T||(N(1),T=!0),function(){return T&&(T=!1,N(-1)),t()}},listen:function(e){var t=h.appendListener(e);return N(1),function(){N(-1),t()}}};return O}var dt="hashchange",mt={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+et(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:et,decodePath:Je},slash:{encodePath:Je,decodePath:Je}};function ht(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)}function vt(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)}function yt(e){void 0===e&&(e={}),ut||Xe(!1);var t=window.history,n=(window.navigator.userAgent.indexOf("Firefox"),e),r=n.getUserConfirmation,o=void 0===r?lt:r,a=n.hashType,i=void 0===a?"slash":a,u=e.basename?nt(Je(e.basename)):"",l=mt[i],c=l.encodePath,s=l.decodePath;function f(){var e=s(ht());return u&&(e=tt(e,u)),ot(e)}var p=it();function d(e){te(k,e),k.length=t.length,p.notifyListeners(k.location,k.action)}var m=!1,h=null;function v(){var e=ht(),t=c(e);if(e!==t)vt(t);else{var n=f(),r=k.location;if(!m&&at(r,n))return;if(h===rt(n))return;h=null,function(e){if(m)m=!1,d();else{p.confirmTransitionTo(e,"POP",o,function(t){t?d({action:"POP",location:e}):function(e){var t=k.location,n=_.lastIndexOf(rt(t));-1===n&&(n=0);var r=_.lastIndexOf(rt(e));-1===r&&(r=0);var o=n-r;o&&(m=!0,E(o))}(e)})}}(n)}}var y=ht(),g=c(y);y!==g&&vt(g);var b=f(),_=[rt(b)];function E(e){t.go(e)}var w=0;function x(e){1===(w+=e)&&1===e?window.addEventListener(dt,v):0===w&&window.removeEventListener(dt,v)}var S=!1;var k={length:t.length,action:"POP",location:b,createHref:function(e){return"#"+c(u+rt(e))},push:function(e,t){var n=ot(e,void 0,void 0,k.location);p.confirmTransitionTo(n,"PUSH",o,function(e){if(e){var t=rt(n),r=c(u+t);if(ht()!==r){h=t,function(e){window.location.hash=e}(r);var o=_.lastIndexOf(rt(k.location)),a=_.slice(0,-1===o?0:o+1);a.push(t),_=a,d({action:"PUSH",location:n})}else d()}})},replace:function(e,t){var n=ot(e,void 0,void 0,k.location);p.confirmTransitionTo(n,"REPLACE",o,function(e){if(e){var t=rt(n),r=c(u+t);ht()!==r&&(h=t,vt(r));var o=_.indexOf(rt(k.location));-1!==o&&(_[o]=t),d({action:"REPLACE",location:n})}})},go:E,goBack:function(){E(-1)},goForward:function(){E(1)},block:function(e){void 0===e&&(e=!1);var t=p.setPrompt(e);return S||(x(1),S=!0),function(){return S&&(S=!1,x(-1)),t()}},listen:function(e){var t=p.appendListener(e);return x(1),function(){x(-1),t()}}};return k}function gt(e,t,n){return Math.min(Math.max(e,t),n)}var bt=n(23),_t=n.n(bt),Et=function(e){var t=Ve()();return t.Provider.displayName=e+".Provider",t.Consumer.displayName=e+".Consumer",t}("Router"),wt=function(e){function t(t){var n;return(n=e.call(this,t)||this).state={location:t.history.location},n._isMounted=!1,n._pendingLocation=null,t.staticContext||(n.unlisten=t.history.listen(function(e){n._isMounted?n.setState({location:e}):n._pendingLocation=e})),n}V(t,e),t.computeRootMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}};var n=t.prototype;return n.componentDidMount=function(){this._isMounted=!0,this._pendingLocation&&this.setState({location:this._pendingLocation})},n.componentWillUnmount=function(){this.unlisten&&this.unlisten()},n.render=function(){return o.a.createElement(Et.Provider,{children:this.props.children||null,value:{history:this.props.history,location:this.state.location,match:t.computeRootMatch(this.state.location.pathname),staticContext:this.props.staticContext}})},t}(o.a.Component);o.a.Component;var xt=function(e){function t(){return e.apply(this,arguments)||this}V(t,e);var n=t.prototype;return n.componentDidMount=function(){this.props.onMount&&this.props.onMount.call(this,this)},n.componentDidUpdate=function(e){this.props.onUpdate&&this.props.onUpdate.call(this,this,e)},n.componentWillUnmount=function(){this.props.onUnmount&&this.props.onUnmount.call(this,this)},n.render=function(){return null},t}(o.a.Component);var St={},kt=1e4,Nt=0;function Tt(e,t){return void 0===e&&(e="/"),void 0===t&&(t={}),"/"===e?e:function(e){if(St[e])return St[e];var t=_t.a.compile(e);return Nt<kt&&(St[e]=t,Nt++),t}(e)(t,{pretty:!0})}function Ot(e){var t=e.computedMatch,n=e.to,r=e.push,a=void 0!==r&&r;return o.a.createElement(Et.Consumer,null,function(e){e||Xe(!1);var r=e.history,i=e.staticContext,u=a?r.push:r.replace,l=ot(t?"string"==typeof n?Tt(n,t.params):te({},n,{pathname:Tt(n.pathname,t.params)}):n);return i?(u(l),null):o.a.createElement(xt,{onMount:function(){u(l)},onUpdate:function(e,t){at(t.to,l)||u(l)},to:n})})}var Ct={},Pt=1e4,jt=0;function Rt(e,t){void 0===t&&(t={}),"string"==typeof t&&(t={path:t});var n=t,r=n.path,o=n.exact,a=void 0!==o&&o,i=n.strict,u=void 0!==i&&i,l=n.sensitive,c=void 0!==l&&l;return[].concat(r).reduce(function(t,n){if(t)return t;var r=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=Ct[n]||(Ct[n]={});if(r[e])return r[e];var o=[],a={regexp:_t()(e,o,t),keys:o};return jt<Pt&&(r[e]=a,jt++),a}(n,{end:a,strict:u,sensitive:c}),o=r.regexp,i=r.keys,l=o.exec(e);if(!l)return null;var s=l[0],f=l.slice(1),p=e===s;return a&&!p?null:{path:n,url:"/"===n&&""===s?"/":s,isExact:p,params:i.reduce(function(e,t,n){return e[t.name]=f[n],e},{})}},null)}var It=function(e){function t(){return e.apply(this,arguments)||this}return V(t,e),t.prototype.render=function(){var e=this;return o.a.createElement(Et.Consumer,null,function(t){t||Xe(!1);var n=e.props.location||t.location,r=te({},t,{location:n,match:e.props.computedMatch?e.props.computedMatch:e.props.path?Rt(n.pathname,e.props):t.match}),a=e.props,i=a.children,u=a.component,l=a.render;(Array.isArray(i)&&0===i.length&&(i=null),"function"==typeof i)&&(void 0===(i=i(r))&&(i=null));return o.a.createElement(Et.Provider,{value:r},i&&!function(e){return 0===o.a.Children.count(e)}(i)?i:r.match?u?o.a.createElement(u,r):l?l(r):null:null)})},t}(o.a.Component);function At(e){return"/"===e.charAt(0)?e:"/"+e}function Ut(e,t){if(!e)return t;var n=At(e);return 0!==t.pathname.indexOf(n)?t:te({},t,{pathname:t.pathname.substr(n.length)})}function Dt(e){return"string"==typeof e?e:rt(e)}function Mt(e){return function(){Xe(!1)}}function zt(){}o.a.Component;var Lt=function(e){function t(){return e.apply(this,arguments)||this}return V(t,e),t.prototype.render=function(){var e=this;return o.a.createElement(Et.Consumer,null,function(t){t||Xe(!1);var n,r,a=e.props.location||t.location;return o.a.Children.forEach(e.props.children,function(e){if(null==r&&o.a.isValidElement(e)){n=e;var i=e.props.path||e.props.from;r=i?Rt(a.pathname,te({},e.props,{path:i})):t.match}}),r?o.a.cloneElement(n,{location:a,computedMatch:r}):null})},t}(o.a.Component);function Ft(e){var t=function(t){var n=t.wrappedComponentRef,r=ne(t,["wrappedComponentRef"]);return o.a.createElement(It,{children:function(t){return o.a.createElement(e,te({},r,t,{ref:n}))}})};return t.displayName="withRouter("+(e.displayName||e.name)+")",t.WrappedComponent=e,oe()(t,e)}o.a.Component;var Wt=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(t=e.call.apply(e,[this].concat(r))||this).history=yt(t.props),t}return V(t,e),t.prototype.render=function(){return o.a.createElement(wt,{history:this.history,children:this.props.children})},t}(o.a.Component);var $t=function(e){function t(){return e.apply(this,arguments)||this}V(t,e);var n=t.prototype;return n.handleClick=function(e,t){(this.props.onClick&&this.props.onClick(e),e.defaultPrevented||0!==e.button||this.props.target&&"_self"!==this.props.target||function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}(e))||(e.preventDefault(),(this.props.replace?t.replace:t.push)(this.props.to))},n.render=function(){var e=this,t=this.props,n=t.innerRef,r=(t.replace,t.to),a=ne(t,["innerRef","replace","to"]);return o.a.createElement(Et.Consumer,null,function(t){t||Xe(!1);var i="string"==typeof r?ot(r,null,null,t.location):r,u=i?t.history.createHref(i):"";return o.a.createElement("a",te({},a,{onClick:function(n){return e.handleClick(n,t.history)},href:u,ref:n}))})},t}(o.a.Component);var Bt=function(e){return{loggedIn:Boolean(e.session.currentUser)}},Vt=Ft($e(Bt)(function(e){var t=e.loggedIn,n=e.path,r=e.component;return o.a.createElement(It,{path:n,render:function(e){return t?o.a.createElement(Ot,{to:"/"}):o.a.createElement(r,e)}})}));Ft($e(Bt)(function(e){var t=e.loggedIn,n=e.path,r=e.component;return o.a.createElement(It,{path:n,render:function(e){return t?o.a.createElement(r,e):o.a.createElement(Ot,{to:"/login"})}})}));function qt(e){return(qt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Ht(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Kt(e){return(Kt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Gt(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Qt(e,t){return(Qt=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Yt=Ft(function(e){function t(e){var n,r,o;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,(n=!(o=Kt(t).call(this,e))||"object"!==qt(o)&&"function"!=typeof o?Gt(r):o).state={email:"",password:""},n.handleSubmit=n.handleSubmit.bind(Gt(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Qt(e,t)}(t,o.a.Component),n=t,(r=[{key:"handleInput",value:function(e){var t=this;return function(n){var r,o,a;t.setState((r={},o=e,a=n.target.value,o in r?Object.defineProperty(r,o,{value:a,enumerable:!0,configurable:!0,writable:!0}):r[o]=a,r))}}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.login({email:"demo@gmail.com",password:"password"}).then(function(){return t.props.history.push("/")})}},{key:"renderErrors",value:function(){var e=this.props.errors.map(function(e,t){return o.a.createElement("li",{className:"auth--form-error",key:t},e)});return 0===e.length?o.a.createElement("div",null):o.a.createElement("ul",{className:"auth--login--form-errors"},e)}},{key:"render",value:function(){return o.a.createElement("section",{className:"auth"},o.a.createElement("ul",{className:"auth--container"},o.a.createElement("section",{className:"auth--header"},o.a.createElement("a",{className:"auth--logo",href:"#/"},o.a.createElement("img",{src:"https://66.media.tumblr.com/a1f4e385d907cf5bdc70bf919143ca2d/tumblr_pqt9m9O3uK1wyb2l8o1_100.png",height:"28",width:"95",alt:"ASOS logo"}))),o.a.createElement("section",{className:"auth--form-container"},o.a.createElement("section",{className:"auth--register"},o.a.createElement("ul",{className:"auth--register--options"},o.a.createElement("a",{href:"#/signup",className:"auth--register--not-selected-left"},"NEW TO ASOS?"),o.a.createElement("p",{className:"auth--register--selected-right"},"ALREADY REGISTERED?"))),o.a.createElement("main",{className:"auth--form--main"},o.a.createElement("h2",{className:"auth--title"},"SIGN IN WITH EMAIL"),o.a.createElement("form",{className:"auth--login-form"},this.renderErrors(),o.a.createElement("label",{className:"auth--form-label"},"EMAIL ADDRESS:",o.a.createElement("input",{className:"auth--form-input",type:"text",value:this.state.email,onChange:this.handleInput("email")})),o.a.createElement("label",{className:"auth--form-label"},"PASSWORD",o.a.createElement("input",{className:"auth--form-input-password",type:"password:",value:this.state.password,onChange:this.handleInput("password")})),o.a.createElement("button",{className:"auth--button",onClick:this.handleSubmit},"Demo"))))))}}])&&Ht(n.prototype,r),a&&Ht(n,a),t}()),Zt=$e(function(e){return{errors:e.errors.session,formType:"login"}},function(e){return{login:function(t){return e(w(t))},clearErrors:function(){return e(E)}}})(Yt);function Xt(e){return(Xt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Jt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function en(e){return(en=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function tn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function nn(e,t){return(nn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var rn=Ft(function(e){function t(e){var n,r,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,n=!(o=en(t).call(this,e))||"object"!==Xt(o)&&"function"!=typeof o?tn(r):o;var a=new Date;return n.state={email:"",password:"",first_name:"",last_name:"",date_of_birth:a,gender:"Female",country:"United States",email_lists:[]},n.handleSubmit=n.handleSubmit.bind(tn(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&nn(e,t)}(t,o.a.Component),n=t,(r=[{key:"handleInput",value:function(e){var t=this;return function(n){var r,o,a;t.setState((r={},o=e,a=n.target.value,o in r?Object.defineProperty(r,o,{value:a,enumerable:!0,configurable:!0,writable:!0}):r[o]=a,r))}}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.createNewUser(this.state).then(function(){return t.props.history.push("/")})}},{key:"renderErrors",value:function(e){var t=this.props.errors[e];if(void 0!==t)return t=t.map(function(e,t){return o.a.createElement("li",{className:"auth--form-error",key:t},e)}),o.a.createElement("ul",{className:"auth--form-errors"},t,o.a.createElement("div",{className:"arrow-down"}),o.a.createElement("div",{className:"arrow-down-2"}))}},{key:"render",value:function(){return o.a.createElement("section",{className:"auth"},o.a.createElement("ul",{className:"auth--container"},o.a.createElement("section",{className:"auth--header"},o.a.createElement("a",{"class-name":"auth--logo",href:"#/"},o.a.createElement("img",{src:"https://66.media.tumblr.com/a1f4e385d907cf5bdc70bf919143ca2d/tumblr_pqt9m9O3uK1wyb2l8o1_100.png",height:"28",width:"95",alt:"ASOS logo"}))),o.a.createElement("section",{className:"auth--form-container"},o.a.createElement("section",{className:"auth--register"},o.a.createElement("ul",{className:"auth--register--options"},o.a.createElement("p",{className:"auth--register--selected-left"},"NEW TO ASOS?"),o.a.createElement("a",{href:"#/login",className:"auth--register--not-selected-right"},"ALREADY REGISTERED?"))),o.a.createElement("h2",{className:"auth--title"},"SIGN UP USING YOUR EMAIL ADDRESS"),o.a.createElement("main",{className:"auth--form--main--sign-up"},o.a.createElement("form",{className:"auth--signup-form"},o.a.createElement("label",{className:"auth--form-label"},"EMAIL ADDRESS:",this.renderErrors("email"),o.a.createElement("input",{className:"auth--form-input",type:"text",value:this.state.email,onChange:this.handleInput("email")})),o.a.createElement("label",{className:"auth--form-label"},"FIRST NAME:",this.renderErrors("first_name"),o.a.createElement("input",{className:"auth--form-input",type:"text",value:this.state.first_name,onChange:this.handleInput("first_name")})),o.a.createElement("label",{className:"auth--form-label"},"LAST NAME:",this.renderErrors("last_name"),o.a.createElement("input",{className:"auth--form-input",type:"text",value:this.state.last_name,onChange:this.handleInput("last_name")})),o.a.createElement("label",{className:"auth--form-label"},"PASSWORD:",this.renderErrors("password"),o.a.createElement("input",{className:"auth--form-input-password",type:"password",value:this.state.password,onChange:this.handleInput("password")}))),o.a.createElement("button",{className:"auth--button",onClick:this.handleSubmit},"JOIN ASOS")))))}}])&&Jt(n.prototype,r),a&&Jt(n,a),t}()),on=$e(function(e){return{formType:"signup",errors:e.errors.signup}},function(e){return{createNewUser:function(t){return e(z(t))}}})(rn),an=function(){return o.a.createElement("ul",{className:"footer--icon-bar"},o.a.createElement("li",{className:"footer--icon-bar--social"},o.a.createElement("img",{className:"social-icon",src:"https://66.media.tumblr.com/0b59e1312ae799a1c73deb04cc3708b8/tumblr_pqta9kzoNK1wyb2l8o1_250.png"}),o.a.createElement("img",{className:"social-icon",src:"https://66.media.tumblr.com/9796c1b33f6bd8a92b47a71f6f5a3ccb/tumblr_pqta9kzoNK1wyb2l8o2_250.png"}),o.a.createElement("img",{className:"social-icon",src:"https://66.media.tumblr.com/03f2bc232fc3ffd7da2795e049680acb/tumblr_pqta9kzoNK1wyb2l8o3_250.png"})),o.a.createElement("li",{className:"footer--icon-bar--payment"},o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/visa-png",alt:"visa"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/mastercard-png",alt:"mastercard"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/pay-pal-png",alt:"paypal"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/american-express-png",alt:"americanexpress"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/visa-electron-png",alt:"visaelectron"}),o.a.createElement("img",{className:"payment-icon",src:"https://images.asos-media.com/navigation/apple-pay-png",alt:"applepay"})))};var un=function(){return o.a.createElement("section",{className:"footer--nav-links"},o.a.createElement("ul",{className:"footer--nav-links--col"},o.a.createElement("h4",{className:"footer--nav-links--title"},"HELP AND INFORMATION"),o.a.createElement("li",{className:"footer--nav-links--item"},"Help"),o.a.createElement("li",{className:"footer--nav-links--item"},"Track Order"),o.a.createElement("li",{className:"footer--nav-links--item"},"Delivery & Returns"),o.a.createElement("li",{className:"footer--nav-links--item"},"Premier Delivery"),o.a.createElement("li",{className:"footer--nav-links--item"},"10% Student Discount")),o.a.createElement("ul",{className:"footer--nav-links--col"},o.a.createElement("h4",{className:"footer--nav-links--title"},"ABOUT ASOS"),o.a.createElement("li",{className:"footer--nav-links--item"},"About Us"),o.a.createElement("li",{className:"footer--nav-links--item"},"Careers at ASOS"),o.a.createElement("li",{className:"footer--nav-links--item"},"Corporate Responsibility"),o.a.createElement("li",{className:"footer--nav-links--item"},"Investors Site")),o.a.createElement("ul",{className:"footer--nav-links--col"},o.a.createElement("h4",{className:"footer--nav-links--title"},"MORE FROM ASOS"),o.a.createElement("li",{className:"footer--nav-links--item"},"E-gift cards"),o.a.createElement("li",{className:"footer--nav-links--item"},"Mobile and ASOS Apps"),o.a.createElement("li",{className:"footer--nav-links--item"},"ASOS Marketplace")),o.a.createElement("ul",{className:"footer--nav-links--col"},o.a.createElement("h4",{className:"footer--nav-links--title"},"SHOPPING FROM:"),o.a.createElement("li",{className:"footer--nav-links--shipping"},o.a.createElement("span",{className:"footer--nav-links--shipping-country"},"You're in"),o.a.createElement("img",(n="United States",(t="alt")in(e={className:"shipping-icon",alt:"United States",src:"https://assets.asosservices.com/storesa/images/flags/us.png"})?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e)),o.a.createElement("span",{className:"footer--nav-links--shipping-change"},"| CHANGE"))));var e,t,n},ln=function(){return o.a.createElement("section",{className:"footer--ecom"},o.a.createElement("p",{className:"footer--ecom-copy"},"© 2019 ASOS"),o.a.createElement("ul",{className:"footer--ecom--terms"},o.a.createElement("li",{className:"footer--ecom--terms-item"},"Privacy & Cookies"),o.a.createElement("li",{className:"footer--ecom--terms-item"},"Ts&Cs"),o.a.createElement("li",{className:"footer--ecom--terms-item"},"Accessibility")))},cn=function(){return o.a.createElement("div",{className:"footer"},o.a.createElement(an,null),o.a.createElement(un,null),o.a.createElement(ln,null))},sn=function(){return o.a.createElement("div",{className:"home--banner"},o.a.createElement("div",{className:"home--banner-bar"},o.a.createElement("p",{className:"home--banner-bar--item"},"WOMEN"),o.a.createElement("span",{className:"home--banner-bar-item"},o.a.createElement("b",{className:"home--banner-bar-item"},o.a.createElement("strong",null,"SPEND MORE. SAVE MORE.")),o.a.createElement("b",{className:"home--banner-bar-item"},o.a.createElement("strong",null,"$200 get $50, $250 get $70, $350 get $100."))),o.a.createElement("p",{className:"home--banner-bar--item"},"MEN")),o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--banner-img",alt:"",src:"https://66.media.tumblr.com/406d7ef67095e7c0f71ec731d99b220c/tumblr_pqt6uwiL6G1wyb2l8o1_1280.gif"})))},fn=function(){return o.a.createElement("section",{className:"home--feature"},o.a.createElement("a",{href:"",className:"home--feature-img"},o.a.createElement("img",{alt:"",src:"https://content.asos-media.com/-/media/homepages/ww/2019/04/29/gbl-utility-surf-hero.jpg"})),o.a.createElement("section",{className:"home--feature--buttons"},o.a.createElement("a",{href:"",className:"home--large-feature-title"},"Surfer vibes"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW")),o.a.createElement("ul",{className:"home--double--feature"},o.a.createElement("li",{className:"home--double-feature--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{id:"home--double-feature--item--img",alt:"",src:"https://66.media.tumblr.com/8ec52eef708032a1eeefe1c7fa67154e/tumblr_pqt7mrVxZW1wyb2l8o2_1280.jpg"})),o.a.createElement("h3",{className:"double-feature--item--title"},"Festival"),o.a.createElement("p",{className:"double-feature--item--body"},"Be centre stage"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW")),o.a.createElement("li",{className:"home--double-feature--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{alt:"",id:"home--double-feature--item--img",src:"https://66.media.tumblr.com/bfa10e4c7c2d6d97b0436c732cbb2c00/tumblr_pqt7mrVxZW1wyb2l8o1_540.jpg"})),o.a.createElement("h3",{className:"double-feature--item--title"},"Sandals"),o.a.createElement("p",{className:"double-feature--item--body"},"Fresh styles for warm climates"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW"))),o.a.createElement("div",{className:"home--feature-banner"},o.a.createElement("a",{href:""})))},pn=function(){return o.a.createElement("section",{className:"home--style-feed"},o.a.createElement("h2",{className:"home--style-feed--title"},"STYLE FEED"),o.a.createElement("p",{className:"home--style-feed--body"},"Outfit ideas, editor picks, styling inspiration and Face + Body tips"),o.a.createElement("section",{className:"home--style-feed-carousel"},o.a.createElement("section",{className:"home--carousel-controls"},o.a.createElement("button",{className:"prev-btn"}),o.a.createElement("button",{className:"next-btn"})),o.a.createElement("ul",{className:"home--carousel-list"},o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--style-feed-carousel--img",alt:"",src:"https://66.media.tumblr.com/1befbe60f6baf4c2bcdb7b27efb4c720/tumblr_pqt6uwiL6G1wyb2l8o10_400.jpg"}),o.a.createElement("div",{className:"style-feed-carousel-content"},o.a.createElement("h3",{className:"home--style-feed-carousel--title"},"WHAT TO WEAR TO A DESTINATION WEDDING"),o.a.createElement("p",{className:"home--style-feed-carousel--body"},"Be best-dressed guest"),o.a.createElement("p",{className:"home--style-feed-carousel--date"},"April 25, 2019")))),o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--style-feed-carousel--img",alt:"",src:"https://66.media.tumblr.com/1b5f04ef58b7367ee5ba92969547e7bc/tumblr_pqt81iVKhd1wyb2l8o1_400.jpg"}),o.a.createElement("div",{className:"style-feed-carousel-content"},o.a.createElement("h3",{className:"home--style-feed-carousel--title"},"BEST OF NEW IN: PINK & PATCHWORK"),o.a.createElement("p",{className:"home--style-feed-carousel--body"},"The fashion team have spoken"),o.a.createElement("p",{className:"home--style-feed-carousel--date"},"April 27, 2019")))),o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--style-feed-carousel--img",alt:"",src:"https://66.media.tumblr.com/d3be3c801032ae3f2ff4debfde6900ff/tumblr_pqt84mKP4N1wyb2l8o1_400.jpg"}),o.a.createElement("div",{className:"style-feed-carousel-content"},o.a.createElement("h3",{className:"home--style-feed-carousel--title"},"THE ASOS + LIFE IS BEAUTIFUL COLLECTION IS HERE"),o.a.createElement("p",{className:"home--style-feed-carousel--body"},"Get festival fresh"),o.a.createElement("p",{className:"home--style-feed-carousel--date"},"April 26, 2019")))),o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--style-feed-carousel--img",alt:"",src:"https://66.media.tumblr.com/74df3ad7ab0196f75f21e44c0ade47bd/tumblr_pqt6uwiL6G1wyb2l8o8_400.jpg"}),o.a.createElement("div",{className:"style-feed-carousel-content"},o.a.createElement("h3",{className:"home--style-feed-carousel--title"},"5 OF THE MOST EXTRA ADD-ONS"),o.a.createElement("p",{className:"home--style-feed-carousel--body"},"It's all in the details"),o.a.createElement("p",{className:"home--style-feed-carousel--date"},"April 25, 2019")))),o.a.createElement("li",{className:"home--style-feed-carousel--item"},o.a.createElement("a",{href:"",className:"btn--view-all"},o.a.createElement("span",{className:"home-style-feed-carousel-view-btn"},"VIEW ALL")))),o.a.createElement("a",{href:"",className:"general-btn"},"VIEW ALL")))},dn=function(){return o.a.createElement("section",{className:"home--feature"},o.a.createElement("ul",{className:"home--double--feature"},o.a.createElement("div",{className:"margin-25"},o.a.createElement("li",{className:"home--double-feature--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--double-feature--img",alt:"",src:"https://66.media.tumblr.com/89ac10d7a313e5f8b6bc3d3d6a0cbd13/tumblr_pqt6uwiL6G1wyb2l8o5_400.jpg"})),o.a.createElement("h3",{className:"home--double-feature--item-title"},"SWIM WINS"),o.a.createElement("p",{className:"home--double-feature--item-body"},"Be a one-piece wonder"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW"))),o.a.createElement("div",{className:"margin-25"},o.a.createElement("li",{className:"home--double-feature--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--double-feature--img",alt:"",src:"https://66.media.tumblr.com/ba92984adf698db7d303acb9d9407542/tumblr_pqwc89O6G91wyb2l8o1_500.png"})),o.a.createElement("h3",{className:"home--double-feature--item-title"},"OCCASIONWEAR"),o.a.createElement("p",{className:"home--double-feature--item-body"},"Be iconic"),o.a.createElement("a",{href:"",className:"general-btn"},"SHOP NOW")))))},mn=function(){return o.a.createElement("section",{className:"home--category-carousel"},o.a.createElement("h2",{className:"home--category-carousel--title"},"SHOP BY CATEGORY"),o.a.createElement("section",{className:"home--carousel-controls"},o.a.createElement("button",{className:"prev-btn"}),o.a.createElement("button",{className:"next-btn"})),o.a.createElement("ul",{className:"home--carousel-list"},o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/fb98a108678d783456b8cbc0348c0218/tumblr_pqt8zg7Ptn1wyb2l8o4_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"DRESSES"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/b6c6b2e0d89b61ba51250fb286509ddd/tumblr_pqt8zg7Ptn1wyb2l8o2_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"SHOES"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/d371209ec9e6320a26bf35c6c5be6857/tumblr_pqt8zg7Ptn1wyb2l8o8_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"TOPS"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/ccd7f6ebd80b76b344aa33d06264715a/tumblr_pqt8zg7Ptn1wyb2l8o9_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"SKIRTS"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/c89d097f46189e86a0e6528c9dcc7134/tumblr_pqt8zg7Ptn1wyb2l8o5_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"SWIMWEAR"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/059dc3f6d3e11ef4fd6638a9225b959e/tumblr_pqt8zg7Ptn1wyb2l8o6_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"MATERNITY"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/e45cfe5f981c0e51b00c867838fd5204/tumblr_pqt8zg7Ptn1wyb2l8o7_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"PETITE"))),o.a.createElement("li",{className:"home--category-carousel--item"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--category-carousel--item--img",alt:"",src:"https://66.media.tumblr.com/d8614815c01648217286faad2aa57971/tumblr_pqt8zg7Ptn1wyb2l8o3_250.jpg"}),o.a.createElement("p",{className:"home--category-carousel--item--title"},"TALL")))),o.a.createElement("section",{className:"home--banner"},o.a.createElement("a",{href:""},o.a.createElement("img",{className:"home--banner--img",alt:"",src:"https://66.media.tumblr.com/36b2bd39dcca9dcfcea356279b12db62/tumblr_pqt9a34ys41wyb2l8o1_1280.jpg"}))))},hn=function(){return o.a.createElement("div",{className:"home"},o.a.createElement(sn,null),o.a.createElement(fn,null),o.a.createElement(pn,null),o.a.createElement(dn,null),o.a.createElement(mn,null))},vn=function(){return o.a.createElement("section",{className:"ecom-bar"},o.a.createElement("ul",{className:"ecom--list"},o.a.createElement("li",{className:"ecom-list--item"},"Marketplace"),o.a.createElement("li",{className:"ecom-list--item"},"Help & FAQs"),o.a.createElement("li",{className:"ecom-list--item-img"},o.a.createElement("img",{className:"shipping--icon",src:"https://assets.asosservices.com/storesa/images/flags/us.png",alt:"United States"}))))};function yn(e){return(yn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function gn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function bn(e,t){return!t||"object"!==yn(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function _n(e){return(_n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function En(e,t){return(En=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var wn=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),bn(this,_n(t).call(this,e))}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&En(e,t)}(t,o.a.Component),n=t,(r=[{key:"render",value:function(){var e=this.props.currentUser?o.a.createElement("section",{className:"account-dropdown"},o.a.createElement("ul",{className:"account-dropdown--auth"},o.a.createElement("p",{className:"account-dropdown--auth--user"},"Hello ".concat(this.props.currentUser.first_name)),o.a.createElement("button",{className:"account-dropdown--auth--logout",onClick:this.props.logout},"Log Out!")),o.a.createElement("ul",{className:"account-dropdown--options"},o.a.createElement("p",{"class-name":"account-dropdown--option"},"My Account"),o.a.createElement("a",{href:"#/orders/".concat(this.props.currentUser.currentOrderId)},o.a.createElement("p",{"class-name":"account-dropdown--option"},"My Orders")),o.a.createElement("p",{"class-name":"account-dropdown--option"},"Returns Information"),o.a.createElement("p",{"class-name":"account-dropdown--option"},"Contact Preferences"))):o.a.createElement("section",{className:"account-dropdown"},o.a.createElement("ul",{className:"account-dropdown--auth"},o.a.createElement("p",{className:"account-dropdown--auth--auth-links"},o.a.createElement($t,{to:"/signup"},"Sign Up")),o.a.createElement("p",{className:"account-dropdown--auth--auth-links"},o.a.createElement($t,{to:"/login"},"Log In"))),o.a.createElement("ul",{className:"account-dropdown--options"},o.a.createElement("p",{className:"account-dropdown--option"},"My Account"),o.a.createElement("p",{className:"account-dropdown--option"},"My Orders"),o.a.createElement("p",{className:"account-dropdown--option"},"Returns Information"),o.a.createElement("p",{className:"account-dropdown--option"},"Contact Preferences")));return o.a.createElement("section",{className:"toolbar"},o.a.createElement("ul",{className:"toolbar--business"},o.a.createElement("a",{"class-name":"auth--logo",href:"#/"},o.a.createElement("svg",{className:"toolbar--business--logo",width:"104",height:"30",viewBox:"0 0 104 30",role:"img","aria-labelledby":"home-logo"},o.a.createElement("title",{id:"home-logo"},"ASOS logo, back to the Home Page"),o.a.createElement("path",{fill:"#FFF",fillRule:"evenodd",d:"M71.83 21.983c-1.558 1.666-3.56 2.51-5.95 2.51-2.387 0-4.39-.844-5.947-2.51-1.488-1.587-2.343-4.124-2.343-6.96 0-2.766.864-5.27 2.37-6.867 1.572-1.667 3.565-2.516 5.92-2.523 2.36.007 4.35.856 5.924 2.523 1.506 1.598 2.37 4.1 2.37 6.867 0 2.836-.855 5.373-2.343 6.96zm-20.915-6.96c0 .128.005.255.008.38-2.39-2.166-5.845-2.974-7.957-3.394-3.907-.82-6.89-1.58-6.89-4.35 0-1.96 1.757-3.38 5.132-3.14 3.085.224 4.384 2.102 4.74 3.914.05.3.19.515.53.517l5.547.05c.026 0 .048-.003.072-.004-.783 1.816-1.182 3.84-1.182 6.015zM41.48 25.19c-2.683 0-5.64-.95-6.32-4.624-.06-.35-.225-.496-.495-.503l-5.364-.07v-9.446c.71 2.768 3.04 4.684 8.09 5.816 3.38.806 9.24 1.318 9.24 4.774 0 2.408-1.78 4.11-5.15 4.054zm-26.714-.69c-4.327 0-8.29-3.394-8.29-9.47 0-4.77 2.97-9.39 8.32-9.39 2.315 0 8.188.79 8.188 9.39 0 8.62-6.132 9.47-8.218 9.47zm65.922-11.792c1.232 1.636 3.453 2.848 7.063 3.657 3.38.805 9.25 1.318 9.25 4.775 0 2.403-1.78 4.11-5.15 4.05-2.68 0-5.64-.95-6.32-4.625-.052-.35-.22-.497-.49-.504L80.06 20c.523-1.54.79-3.21.79-4.974 0-.793-.056-1.566-.16-2.317zM91.474 30c5.95 0 12.965-2.208 12.416-9.366-.606-6.355-7.244-7.964-10.562-8.625-3.907-.82-6.892-1.58-6.892-4.35 0-1.96 1.758-3.38 5.134-3.14 3.084.224 4.384 2.102 4.74 3.914.05.3.19.515.53.517l5.546.048c.422.002.554-.216.5-.516C101.8 1.874 96.246 0 91.133 0 86.03 0 79.88 1.43 79.443 7.754c-.015.246-.02.486-.02.722-.814-1.683-1.985-3.23-3.495-4.597C73.142 1.37 69.666.03 65.878 0h-.127c-1.81 0-3.58.333-5.26.99a15.26 15.26 0 0 0-4.65 2.888c-1.43 1.295-2.56 2.747-3.36 4.327C51.27 1.822 45.81 0 40.77 0 36.084 0 30.517 1.208 29.3 6.305v-5.06a.49.49 0 0 0-.49-.488h-5.224c-.27 0-.49.22-.49.49V2.61c0 .23-.155.31-.343.175-1.858-1.34-4.607-2.782-7.915-2.782-1.86 0-3.635.326-5.277.968-1.64.65-3.2 1.63-4.64 2.92C3.29 5.37 2.05 7.05 1.23 8.9.417 10.742 0 12.807 0 15.027 0 17.1.367 19.043 1.088 20.8c.722 1.756 1.82 3.382 3.267 4.83 1.446 1.45 3.063 2.553 4.804 3.276 1.74.722 3.66 1.09 5.7 1.09 3.51 0 6.15-1.493 7.88-2.85.19-.144.342-.067.342.17v1.435c0 .27.22.49.49.49H28.8c.27 0 .49-.22.49-.49v-4.83C31.766 29.7 38.04 30 41.113 30c5.137 0 11.06-1.647 12.234-6.7.55.818 1.192 1.597 1.924 2.33 2.8 2.807 6.47 4.316 10.62 4.362h.17c1.97 0 3.87-.377 5.648-1.12a14.82 14.82 0 0 0 4.79-3.242 15.25 15.25 0 0 0 2.594-3.43c1.86 7.438 9.035 7.8 12.387 7.8z"}))),o.a.createElement("li",{className:"toolbar--busienss--item"},"WOMEN"),o.a.createElement("li",{className:"toolbar--busienss--item"},"MEN")),o.a.createElement("form",{className:"toolbar--search"}),o.a.createElement("ul",{className:"toolbar--profile"},o.a.createElement("li",{className:"toolbar--profile--icons"},o.a.createElement("button",{className:"toolbar--profile--icons--icon",onClick:this.showMenu},o.a.createElement("i",{className:"fa fa-user",id:"account-dropdown-button"})),o.a.createElement("i",{className:"fa fa-heart","aria-hidden":"true"}),o.a.createElement("i",{className:"fa fa-shopping-bag","aria-hidden":"true"})),e))}}])&&gn(n.prototype,r),a&&gn(n,a),t}(),xn=$e(function(e){return{currentUser:e.session.currentUser}},function(e){return{logout:function(){return e(x())},requestUser:function(t){return e(S(t))}}})(wn),Sn=function(){return o.a.createElement("section",{className:"category-bar"},o.a.createElement("ul",{className:"category-bar--options"},o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"New In")),o.a.createElement("a",{"class-name":"",href:"#/products"},o.a.createElement("li",{className:"category-bar--option"},"Clothing")),o.a.createElement("li",{className:"category-bar--option"},"Shoes"),o.a.createElement("li",{className:"category-bar--option"},"Accessories"),o.a.createElement("li",{className:"category-bar--option"},"Activewear"),o.a.createElement("li",{className:"category-bar--option"},"Beauty"),o.a.createElement("li",{className:"category-bar--option"},"Brands"),o.a.createElement("li",{className:"category-bar--feature"},o.a.createElement("p",null,"Outlet")),o.a.createElement("li",{className:"category-bar--option"},"Marketplace"),o.a.createElement("li",{className:"category-bar--option"},"Inspiration")))},kn=$e(function(e){return{currentUser:e.session.currentUser}},function(e){return{logout:function(){return e(x())}}})(function(){return o.a.createElement("section",{className:"nav-bar"},o.a.createElement(vn,null),o.a.createElement(xn,null),o.a.createElement(Sn,null))}),Nn=function(e){var t=e.product,n=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2});return o.a.createElement($t,{to:"/products/".concat(t.id)},o.a.createElement("li",{className:"listings--product"},o.a.createElement("img",{className:"listings--product-img",src:t.photoUrls[0],alt:""}),o.a.createElement("p",{className:"listings--product-title"},t.title),o.a.createElement("p",{className:"listings--product-price"},n.format(t.price))))};function Tn(e){return(Tn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function On(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Cn(e,t){return!t||"object"!==Tn(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Pn(e){return(Pn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function jn(e,t){return(jn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Rn=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Cn(this,Pn(t).apply(this,arguments))}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&jn(e,t)}(t,o.a.Component),n=t,(r=[{key:"componentDidMount",value:function(){this.props.requestProducts()}},{key:"render",value:function(){var e=this.props.products.map(function(e){return o.a.createElement(Nn,{key:e.id,product:e})});return o.a.createElement("section",{className:"listings"},o.a.createElement("section",{className:"listings--category-banner"},o.a.createElement("h2",{className:"listings--category-banner--text"},"breadcrumb last item")),o.a.createElement("section",{className:"listings--wrapper"},o.a.createElement("section",{className:"listings--filters-wrapper"},o.a.createElement("ul",{className:"listings--filters"},o.a.createElement("ul",{className:"listings--filter--item"},o.a.createElement("li",{className:"listings--filters--item--options"})))),o.a.createElement("section",{className:"listings--wrapper--grid-wrapper"},o.a.createElement("section",{className:"listings--count"},o.a.createElement("h3",null,"this is a style count holder")),o.a.createElement("ul",{className:"listings--products"},e),o.a.createElement("section",{className:"listings--viewed"},o.a.createElement("h3",null,"this is a viewed count holder")),o.a.createElement("section",{className:"listings--load-more"},o.a.createElement("h3",null,"load more")))))}}])&&On(n.prototype,r),a&&On(n,a),t}(),In=$e(function(e){var t=e.entities;return{products:Object.values(t.products)}},function(e){return{requestProducts:function(){return e(N())}}})(Rn),An=function(e){for(var t=e.entities,n=Object.values(t.productItems),r={"Select a size":0},o=0;o<n.length;o++){var a=n["".concat(o)].size;void 0===r["".concat(o)]&&(r["".concat(a)]=0),"Available"===n["".concat(o)].state&&(r["".concat(a)]+=1)}return r},Un=function(e){var t=e.entities,n=Object.values(t.orderItems),r=0;if(n.length>0)for(var o=0;o<n.length;o++){r+=parseInt(n["".concat(o)].unitPrice)}return r};function Dn(e){return(Dn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Mn(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function zn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Ln(e){return(Ln=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Fn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Wn(e,t){return(Wn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var $n=function(e){function t(e){var n,r,o;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,(n=!(o=Ln(t).call(this,e))||"object"!==Dn(o)&&"function"!=typeof o?Fn(r):o).state={productId:n.props.match.params.productId,size:"Select a size",currentUserError:!1,sizeError:!1},n.handleSubmit=n.handleSubmit.bind(Fn(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Wn(e,t)}(t,o.a.Component),n=t,(r=[{key:"componentDidMount",value:function(){var e=this.props.match.params.productId;this.props.requestProduct(e)}},{key:"componentDidUpdate",value:function(e){var t=this.props.match.params.productId;this.props.location.pathname!==e.location.pathname&&this.props.requestProduct(t)}},{key:"handleInput",value:function(e){var t=this;return function(n){var r;t.setState((Mn(r={},e,n.target.value),Mn(r,"sizeError",!1),r))}}},{key:"handleSizeError",value:function(){return this.setState({sizeError:!1})}},{key:"handleSubmit",value:function(e){e.preventDefault();var t,n,r,o=this.props.currentUser;if(o||this.setState({currentUserError:!0}),"Select a size"===this.state.size&&this.setState({sizeError:!0}),o&&!this.state.sizeError){var a=(t=this.props.productItems,n=this.state.size,(r=Object.values(t).filter(function(e){return e.size===n&&"Available"===e.state})).length>0?parseInt(r[0].id):void 0),i={id:a,product_id:this.state.productId,size:this.state.size,state:"pending_order"},u={product_item_id:a,order_id:this.props.orders.currentOrderId};this.props.createOrderItem(o,u),this.props.updateProductItem(i)}}},{key:"render",value:function(){var e=this.props.product;if(void 0===e)return null;var t=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}),n=this.props.selectedSizes.map(function(e){return e[1]>0?o.a.createElement("option",{key:e,className:"size--available"},e[0]):o.a.createElement("option",{key:e,className:"size--not-available",disabled:!0},e[0])}),r=o.a.createElement("section",{className:"product-show--photos-wrapper"},o.a.createElement("section",{className:"product-show--photos-aside-wrapper"},o.a.createElement("ul",{className:"product-show--aside--photos"},o.a.createElement("li",{className:"product-show--photos--item"},o.a.createElement("img",{className:"listings--product--show--img",src:e.photoUrls[0],alt:""})),o.a.createElement("li",{className:"product-show--photos--item"},o.a.createElement("img",{className:"listings--product--show--img",src:e.photoUrls[1],alt:""}))),o.a.createElement("img",{className:"product-show--photos--social"})),o.a.createElement("section",{className:"product-show--photo-carousel-wrapper"},o.a.createElement("img",{className:"product-show--photo-carousel--product-img",src:e.photoUrls[0],alt:""}),o.a.createElement("button",{className:"prev-btn"}),o.a.createElement("button",{className:"prev-btn"}))),a=this.state.currentUserError?o.a.createElement("section",{className:"basic-error-box"},o.a.createElement("p",null,"Please sign in to add to your cart")):null,i=this.state.sizeError?o.a.createElement("section",{className:"basic-error-box"},o.a.createElement("p",null,"Please select a size to add to your cart")):null,u=o.a.createElement("section",{className:"product--show--cart-aside-wrapper"},o.a.createElement("section",{className:"product-show--cart-aside"},o.a.createElement("ul",{className:"product-show--cart-aside-items"},o.a.createElement("h3",{className:"product-show--cart-aside-items--title"},e.title),o.a.createElement("ul",{className:"product-show--cart-aside-items--price-wrapper"},o.a.createElement("li",{className:"product-show--cart-aside-items--price"},t.format(e.price)),o.a.createElement("p",{className:"product-show--cart-aside-items--shipping"},"Free Shipping & Returns")),o.a.createElement("ul",{className:"product-show--cart-aside-items--color-wrapper"},o.a.createElement("li",{className:"product-show--cart-aside-items--color-title"},"Color: "),o.a.createElement("li",{className:"product-show--cart-aside-items--color"},e.color)),o.a.createElement("section",{className:"product-show--cart-aside--form"},o.a.createElement("label",{className:"product-show--cart-aside--form--sizing--label"},o.a.createElement("select",{className:"product-show--cart-aside--form--sizing",value:this.state.size,name:"size",onChange:this.handleInput("size")},n)),"Select a size"===this.state.size?i:null,a,o.a.createElement("button",{className:"product-show--cart-aside--form--add-to-cart",onClick:this.handleSubmit},"ADD TO CART"))))),l=o.a.createElement("section",{className:"product-show--deatil-wrapper"},o.a.createElement("ul",{className:"product-show--deatil--items"},o.a.createElement("ul",{className:"product-show--detail--item"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"PRODUCT DETAILS"),o.a.createElement("p",{className:"product-show--detail--item--subtitle"},e.category," by ",e.brand),o.a.createElement("ul",{className:"product-show--detail--item--details"},o.a.createElement("li",{className:"product-show--detail--item--details--item"},e.subCategory))),o.a.createElement("ul",{className:"product-show--detail--item"},o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"PRODUCT CODE"),o.a.createElement("p",null,e.product_code),o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"BRAND"),o.a.createElement("p",null,e.brand)))),o.a.createElement("ul",{className:"product-show--detail--item"},o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"SIZE & FIT"),o.a.createElement("ul",{className:"product-show--detail--item--design-specs"},o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.model_size),o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.model_height))),o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"LOOK AFTER ME"),o.a.createElement("ul",{className:"product-show--detail--item--design-specs"},o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.care_instructions),o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.care_advice))),o.a.createElement("ul",{className:"product-show--detail--area"},o.a.createElement("h3",{className:"product-show--detail--item--title"},"ABOUT ME"),o.a.createElement("ul",{className:"product-show--detail--item--design-specs"},o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.fabric_stretch),o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.fabric_material),o.a.createElement("li",{className:"product-show--detail--item--design-specs--item"},e.main_fiber_content))))));return o.a.createElement("section",{className:"product-show"},o.a.createElement("section",{className:"product-show--wrapper"},r,u),o.a.createElement("section",{className:"product-show--detail-wrapper"},l))}}])&&zn(n.prototype,r),a&&zn(n,a),t}(),Bn=$e(function(e,t){var n=t.match.params.productId;return{product:e.entities.products[n],currentUser:e.session.currentUser,orders:e.entities.orders,productItems:e.entities.productItems,selectedSizes:Object.entries(An(e))}},function(e){return{requestProduct:function(t){return e(T(t))},createOrderItem:function(t,n,r){return e(j(0,n))},updateProductItem:function(t){return e(U(t))}}})($n);function Vn(e){return(Vn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function qn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Hn(e){return(Hn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Kn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Gn(e,t){return(Gn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Qn=function(e){function t(e){var n,r,o;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,(n=!(o=Hn(t).call(this,e))||"object"!==Vn(o)&&"function"!=typeof o?Kn(r):o).state={orderId:n.props.match.params.orderId,subTotal:0,listings:[]},n.handleSubmit=n.handleSubmit.bind(Kn(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Gn(e,t)}(t,o.a.Component),n=t,(r=[{key:"componentDidMount",value:function(){var e=parseInt(this.props.match.params.orderId);this.props.fetchOrder(e)}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=e.target.attributes.orderitemid.value,n=this.props.orderItems[t].product_item_id,r={id:n,product_id:[this.props.productItems[n].product_item_id].product_id,size:this.props.productItems[n].size,state:"Available"};this.props.deleteOrderItem(t,this.props.currentUser.id,this.state.orderId),this.props.updateProductItem(r)}},{key:"render",value:function(){var e,t=this,n=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2});this.props.orderListItems.length>0?e=this.props.orderListItems.map(function(e,r){return o.a.createElement("section",{className:"listing--item--wrapper",key:r},o.a.createElement("section",{className:"listing--item--photos"},o.a.createElement("img",{src:e.photosUrl,className:"listing--item--img"})),o.a.createElement("section",{className:"listing--details--wrapper"},o.a.createElement("ul",{className:"listing--details"},o.a.createElement("h3",{className:"listing--details--header"},n.format(e.price)),o.a.createElement("p",{className:"listing--details--brand"},e.brand),o.a.createElement("p",{className:"listing--title"},e.shortTitle),o.a.createElement("ul",{className:"listing--details--specs--wrapper"},o.a.createElement("li",{className:"listing--details--specs--color"},"Color"),o.a.createElement("li",{className:"listing--details--specs--size"},e.size),o.a.createElement("p",{className:"listing--details--specs--qty"},"Qty")))),o.a.createElement("button",{className:"listing--remove--btn",orderitemid:e.id,onClick:t.handleSubmit},"x"))}):o.a.createElement("div",null);var r=o.a.createElement("section",{className:"order--container"},o.a.createElement("ul",{className:"order--wrapper"},o.a.createElement("ul",{className:"order--main"},o.a.createElement("section",{className:"order--listings--wrapper"},o.a.createElement("h3",{className:"order--listings--header"},"My Cart"),o.a.createElement("ul",{className:"order--listings"},e),o.a.createElement("ul",{className:"order--listings--subtotal"},o.a.createElement("h3",{className:"order--listings--subtotal--title"},"SUB-TOTAL"),o.a.createElement("h3",{className:"order--listings--subtotal--price"},n.format(this.props.subTotal)))),o.a.createElement("ul",{className:"order--delivery--wrapper"})),o.a.createElement("section",{className:"order--aside"})));return o.a.createElement("div",{className:"order"},r)}}])&&qn(n.prototype,r),a&&qn(n,a),t}(),Yn=$e(function(e,t){var n,r,o,a,i,u=t.match.params.orderId;return{orders:e.entities.orders[u],currentUser:e.session.currentUser,products:e.entities.products,productItems:e.entities.productItems,orderItems:e.entities.orderItems,orderListItems:(n=e.entities.orderItems,r=e.entities.products,o=e.entities.productItems,a=Object.entries(n),i=[],a.length>0&&(i=a.map(function(e){return{id:e[1].id,price:e[1].unitPrice,brand:"some",color:"some",size:o[e[1].product_item_id].size,shortTitle:r[o[e[1].product_item_id].product_id].title,photosUrl:r[o[e[1].product_item_id].product_id].photoUrls[0]}})),i),subTotal:Un(e)}},function(e){return{fetchOrder:function(t){return e(C(t))},deleteOrderItem:function(t){return e(R(t))},updateProductItem:function(t){return e(U(t))}}})(Qn),Zn=function(e){return o.a.createElement("div",{id:"main"},o.a.createElement(It,{path:"/",component:kn}),o.a.createElement(Lt,null,o.a.createElement(It,{exact:!0,path:"/",component:hn}),o.a.createElement(It,{exact:!0,path:"/products",component:In}),o.a.createElement(It,{exact:!0,path:"/products/:productId",component:Bn}),o.a.createElement(It,{exact:!0,path:"/orders/:orderId",component:Yn}),o.a.createElement(It,{render:function(){return o.a.createElement(Ot,{to:{pathname:"/"}})}})),o.a.createElement(It,{path:"/",component:cn}))},Xn=function(){return o.a.createElement("div",{id:"app"},o.a.createElement(Lt,null,o.a.createElement(Vt,{exact:!0,path:"/login",component:Zt}),o.a.createElement(Vt,{exact:!0,path:"/signup",component:on}),o.a.createElement(It,{path:"/",component:Zn})))},Jn=function(e){var t=e.store;return o.a.createElement(ee,{store:t},o.a.createElement(Wt,null,o.a.createElement(Xn,null)))};document.addEventListener("DOMContentLoaded",function(){var e,t=document.getElementById("root"),n=void 0;window.currentUser?(n={session:{currentUser:window.currentUser}},e=B(n)):e=B(),window.store=e,window.getState=e.getState,i.a.render(o.a.createElement(Jn,{store:e}),t)})}]);
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