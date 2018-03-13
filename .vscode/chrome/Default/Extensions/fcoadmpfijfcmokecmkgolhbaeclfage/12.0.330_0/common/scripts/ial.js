/*******************************************************************************
 *
 *  avast! Online Security plugin
 *  (c) 2013 Avast Corp.
 *
 *  @author: Lucian Corlaciu
 *
 *  Injected Core - cross browser
 *
 ******************************************************************************/

(function($, EventEmitter) {

  if (typeof AvastWRC == 'undefined') { AvastWRC = {}; }//AVAST Online Security

  AvastWRC.ial = AvastWRC.ial || {
    /**
     * Background script instance - browser specific
     * @type {Object}
     */
    bs: null,
    /**
     * DNT settings used to determine if a page needs to be refreshed or not
     * @type {Object}
     */
    _CHANGED_FIELDS: {},
    /**
     * Initialization
     * @param  {Object} _bs instance of browser specifics
     * @return {Object} AvastWRC.ial instance - browser agnostic
     */
    init: function(_bs){
      this.bs = _bs;
      //this.initPage();
      this.attachHandlers();
      this.bs.messageHandler('initMe');

      return this;
    },
    /**
     * EventEmitter instance to hangle injected layer events.
     * @type {Object}
     */
    _ee: new EventEmitter(),

    _isOldGui : true,
    /**
     * Register events with instance of EventEmitter.
     * @param  {Object} callback to register with instance of eventEmitter
     * @return {void}
     */
    registerEvents: function(registerCallback, thisArg) {
      if (typeof registerCallback === 'function') {
        registerCallback.call(thisArg, this._ee);
      }
    },
    /**
     * Initializes the page where this script is injected
     * @return {void}
     */
    initPage: function() {
      if($('head').length === 0) {
        $('html').prepend("<head></head>");
      }
      AvastWRC.ial.injectFonts();     
    },
    /**
     * Injects custom fonts
     * @return {void}
     */
    injectFonts: function() {
      if($('#avast_os_ext_custom_font').length === 0) {
        $('head')
          .append("<link id='avast_os_ext_custom_font' href='//fonts.googleapis.com/css?family=Source+Sans+Pro' rel='stylesheet' type='text/css'>")
          .append("<link href='//fonts.googleapis.com/css?family=Lato:400,900' rel='stylesheet' type='text/css'>")
          .append("<link href='//fonts.googleapis.com/css?family=Open+Sans:300,400,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>")
          .append("<link href='//fonts.googleapis.com/css?family=Gloria+Hallelujah' rel='stylesheet' type='text/css'>");
        }
    },
    /**
     * Message hub - handles all the messages from the background script
     * @param  {String} message
     * @param  {Object} data
     * @param  {Function} reply
     * @return {void}
     */
    messageHub: function(message, data, reply) {
      // emit messages in specific namespace
      this._ee.emit('message.' + message, data, reply);
    },
    /**
     * Reinitialize the page. Handle 'reInit' message from background.
     */
    reInitPage: function (data) {
      AvastWRC.ial.initPage();
      AvastWRC.ial.attachHandlers();
    },
    /**
     * Attaches DOM handlers
     * @return {void}
     */
    attachHandlers: function() {
      typeof $ !== 'undefined' && $(document).ready(function() {
        window.onunload = AvastWRC.ial.onUnload;     
      });
    },
    /**
     * Notifies the background script
     * @return {void}
     */
    onUnload: function() {
      AvastWRC.ial.bs.messageHandler('unload');
    },
    /**
     * Hides the message box, if present, and restores the page to its initial state
     * @return {void}
     */
    clearBoxes: function() {
      $("body").removeClass("avast-overlay-on").removeClass("avast-bar-on").removeClass("avast-install-on");
    },
    /**
     * Retrive the top element of the page.
     * See: http://stackoverflow.com/questions/10100540/chrome-extension-inject-sidebar-into-page
     * @return retrieved top element to inject ext. HTML into
     */
    getTopHtmlElement: function () {
      var docElement = document.documentElement;
      if (docElement) {
        return $(docElement); //just drop $ wrapper if no jQuery
      } else {
        docElement = document.getElementsByTagName('html');
        if (docElement && docElement[0]) {
          return $(docElement[0]);
        } else {
          docElement = $('html');
          if (docElement.length > -1) {//drop this branch if no jQuery
            return docElement;
          } else {
            throw new Error('Cannot insert the bar.');
          }
        }
      }
    },

    /**
     * Create a top bar instance
     * @param {String} bar template HTML to be injected
     * @param {String} selector of the injected bar template
     * @param {String} bar height styling ('40px')
     * @return {Object} a wrapper for the bar
     */
    topBar: function (barHtml, barElementSelector, barHeight, topBarRules) {
        var _oldHtmlTopMargin = null;
	      var _oldGoogleTopElem = [];
        var _oldFixed = [];

        AvastWRC.ial.getTopHtmlElement().prepend(barHtml);

        return {
          /**
           * Display the bar.
           */
            show: function () {
                $(barElementSelector).css({top: '0px', left: '0px'});
                // slide page down
                AvastWRC.ial.getTopHtmlElement().css('margin-top',
                  function (index, value) {
                      _oldHtmlTopMargin =  value;
                      return barHeight;
                  }
                );
                if (!RegExp("^http(s)?\\:\\/\\/\\www\\.chase\\.com\\/?").test(document.URL)){
                  // fix for elements with position fixed
                  $("*").each(function(){
                      var $node = $(this);
                      if($node.css("position") == "fixed") {
                          var top = parseInt($node.css("top"));
                          if(typeof(top) == "number" && !isNaN(top)) {
                              var newValue = top + parseInt(barHeight);
                              newValue += "px";
                              $node.css("top", newValue);
                              _oldFixed.push({$node : $node, top: top});
                          }
                      }
                  });
                }
                
                var appliedRule = 0;
                if(topBarRules != null && topBarRules != undefined && topBarRules.rulesToApply >0 && topBarRules.specifics != []){
                    $(topBarRules.specifics).each(function(i,specific) {
                        if(topBarRules.rulesToApply > appliedRule){
                          var propVal = 0;
                          var newValue = 0;
                          if(specific.computedStyle){
                            var elem = document.getElementsByClassName(specific.styleName);
                            if(elem[0]){
                              propVal = window.getComputedStyle(elem[0], specific.computedStyle).getPropertyValue(specific.styleProperty);
                            }                            
                          }
                          else{
                            propVal = parseInt($(specific.styleName).css(specific.styleProperty));
                          }
                          if (propVal == "auto"){
                            newValue = parseInt(barHeight);
                            newValue += "px";
                          }
                          else{
                            propVal = parseInt(propVal);
                            if(typeof(propVal) == "number" && !isNaN(propVal)) {
                              newValue = propVal + parseInt(barHeight);
                              newValue += "px";
                            }
                          }
                          if(newValue != 0){
                            if(specific.computedStyle){
                              var rule = "." + specific.styleName + "::" + specific.computedStyle;
                              var value = specific.styleProperty + ": " +newValue;
                              document.styleSheets[0].addRule(rule,value);
                              document.styleSheets[0].insertRule(rule +' { ' + value + ' }', 0);
                              _oldGoogleTopElem.push({styleName: specific.styleName, 
                                                      styleProperty: specific.styleProperty,
                                                      computedStyle: specific.computedStyle,
                                                      oldValue: propVal});
                              appliedRule ++;	
                            }
                            else{
                              $(specific.styleName).css(specific.styleProperty, newValue);
                              _oldGoogleTopElem.push({styleName: specific.styleName, 
                                                      styleProperty: specific.styleProperty,
                                                      oldValue: propVal});
                              appliedRule ++;	
                            }
                          }                      
                        }							                
                    });
                } 
                return true;  
            },
          /**
           * Remove/close the top bar and reset relevant CSS.
           */
            remove: function() {
                $(barElementSelector).remove();
                // restore page position
                if (_oldHtmlTopMargin)
                    AvastWRC.ial.getTopHtmlElement().css('margin-top', _oldHtmlTopMargin);

                // revert altered fixed positions.
                if(_oldFixed.length > 0){
                    for(var i=0, j=_oldFixed.length; i<j; i++){
                        _oldFixed[i].$node.css("top",_oldFixed[i].top+"px");
                    }
                }
                if(_oldGoogleTopElem != null){
                    for(var i=0, j=_oldGoogleTopElem.length; i<j; i++){
                      if(_oldGoogleTopElem[i].computedStyle){
                        var rule = "." + _oldGoogleTopElem[i].styleName + "::" + _oldGoogleTopElem[i].computedStyle;
                        var value = _oldGoogleTopElem[i].styleProperty + ": " + _oldGoogleTopElem[i].oldValue;
                        document.styleSheets[0].addRule(rule,value);
                        document.styleSheets[0].insertRule(rule + ' { ' + value + ' }', 0);
                      }
                      else{
                        $(_oldGoogleTopElem[i].styleName).css(_oldGoogleTopElem[i].styleProperty,_oldGoogleTopElem[i].oldValue+"px");
                      }                        
                    }
                }
            }
        };
    }
  }; // AvastWRC.ial

  AvastWRC.ial.registerEvents(function(ee) {
    ee.on('message.reInit',          AvastWRC.ial.reInitPage);
  });

}).call(this, $, EventEmitter2);

/*******************************************************************************
 *
 *  avast! Online Security plugin
 *  (c) 2014 Avast Corp.
 *
 *  @author:
 *
 *  Injected Layer - SafePrice - cross browser
 *
 ******************************************************************************/

(function($) {

  var SAFESHOP_REFRESH_INTERVAL = 45 * 60 * 1000;

  var safeShopRefreshIID = null;

  if (typeof AvastWRC === 'undefined' || typeof AvastWRC.ial === 'undefined') {
    console.error('AvastWRC.ial instance not initialised to add SafePrice component');
    return;
  } else if (typeof AvastWRC.ial.sp !== 'undefined') {
    return;
  }

  AvastWRC.ial.sp = {

    /**
     * Check the current page using the received selector.
     * @param {Object} page related data
     */
    checkSafeShop: function (data) {
      var safeShopData = $.extend({ scan: null }, data);
      if(data.csl){
        switch (data.providerId) {
          case "ciuvo":
            var ciuvoCoupons = false, ciuvoSearch = false;
            safeShopData.csl.plugins.forEach(function(element) {
              if(element.indexOf("CiuvoSearch") > -1){
                ciuvoSearch = true;
              }
              else if(element.indexOf("VoucherSearch") > -1){
                ciuvoCoupons = true;
              }
            }, this);
            if(ciuvoSearch){ // 
              // product scan - to retrieve page data
              AvastWRC.ial.productScan(data.csl, function(response) {
                safeShopData.scan = response;
                safeShopData.referrer = document.referrer;
                AvastWRC.ial.bs.messageHandler('safeShopOffersFound', safeShopData);
              });
            }else if(ciuvoCoupons){ 
              safeShopData.scan = "ONLY COUPONS: Site not parsed (only VoucherSearch)";
              safeShopData.referrer = document.referrer;
              AvastWRC.ial.bs.messageHandler('safeShopOffersFound', safeShopData);
            }
            break;
          case "comprigo":
            // product scan - to retrieve page data
            AvastWRC.ial.comprigoRun(data.csl, data.url, function(response) {
              safeShopData.scan = response;
              safeShopData.referrer = document.referrer;
              AvastWRC.ial.bs.messageHandler('safeShopOffersFound', safeShopData);
            });
            break;
            /*case "firstoffer":
              // product scan - to retrieve page data
              runScrapper(data.csl, function(response) {
                safeShopData.scan = response;
                safeShopData.referrer = document.referrer;
                AvastWRC.ial.bs.messageHandler('safeShopOffersFound', safeShopData);
              });
            break;*/
        }
      }else if(safeShopData.onlyCoupons){ 
        safeShopData.scan = "ONLY COUPONS: Site not parsed (no selector)";
        safeShopData.referrer = document.referrer;
        AvastWRC.ial.bs.messageHandler('safeShopOffersFound', safeShopData);
      }      
    },

    createSafeShopBarCoupon : function(data) {
      this.createSafeShopBar(data);
    },

    /**
     * Creates UI for the Top Bar (SafeZone)
     * @param  {Object} data
     * @return {[type]}
     */
    createSafeShopBar: function(data) {
      var pop_elements = ['#avast-sas-offers-drop','#avast-sas-coupons-drop','#avast-sas-accommodations-drop',
        '#avast-sas-help-drop','#avast-sas-settings-drop'];
            
      function toggleBlockShow (id) { 
          $(id).toggleClass('avast-sas-drop-show'); 
          var closed_element_id = id.substr(0, id.indexOf("-drop"));
          if (id.indexOf("offers") != -1 || id.indexOf("coupons") != -1 || id.indexOf("accommodations") != -1){
              $(closed_element_id + " i").toggleClass('avast-sas-shut-icon');
          }                    
      }
      function showBlock (id) { 
        $(id).addClass('avast-sas-drop-show'); 
        if(data.showABTest){
          if(id.indexOf("-help-drop") != -1){
            $('#avast-sas-help').addClass('help-hover');
          }
          if(id.indexOf("-settings-drop") != -1){
            $('#avast-sas-settings').addClass('settings-hover');
          }
          if(id.indexOf("-offers-drop") != -1){
            $('#avast-sas-offers').addClass('drop-hover');
          }
          if(id.indexOf("-accommodations-drop") != -1){
            $('#avast-sas-accommodations').addClass('drop-hover');
          }
          if(id.indexOf("-coupons-drop") != -1){
            $('#avast-sas-coupons').addClass('drop-hover');
          }
        }       
      }
      function hideBlock (id) { 
        $(id).removeClass('avast-sas-drop-show'); 
        var closed_element_id = id.substr(0, id.indexOf("-drop"));
        if (id.indexOf("offers") != -1 || id.indexOf("coupons") != -1 || id.indexOf("accommodations") != -1){
            $(closed_element_id + " i").removeClass('avast-sas-shut-icon'); 
        } 
        if(data.showABTest){
          if(id.indexOf("-help-drop") != -1){
            $('#avast-sas-help').removeClass('help-hover');
          }
          if(id.indexOf("-settings-drop") != -1){
            $('#avast-sas-settings').removeClass('settings-hover');
          }
          if(id.indexOf("-offers-drop") != -1){
            $('#avast-sas-offers').removeClass('drop-hover');
          }
          if(id.indexOf("-accommodations-drop") != -1){
            $('#avast-sas-accommodations').removeClass('drop-hover');
          }
          if(id.indexOf("-coupons-drop") != -1){
            $('#avast-sas-coupons').removeClass('drop-hover');
          }
        }               
      }
      function feedback (data) { AvastWRC.ial.bs.messageHandler('safeShopFeedback', data); }
      function showBlockExcl (id) {
        toggleBlockShow(id);
        for (var i=0; i < pop_elements.length; i++) {
          if (id !== pop_elements[i]) {
                        hideBlock(pop_elements[i]);                        
          }
        }
      }
      function alignPosition(elementSel, alignToSel, toRight, offset) {
        var $elm = $(elementSel);
        var $aTo = $(alignToSel);
        if ($elm.length && $aTo.length) {
          var pos = $aTo.position().left;
          if (toRight) {
            pos += $aTo.width();
          }
          $elm.css('left', pos + offset + 'px');
        }
      }


      function helpShow (event) {
        if (event) event.stopPropagation();

        if(data.showABTest){
          if(document.getElementsByClassName('settings-hover').length != 0){
            $('#avast-sas-settings').removeClass('settings-hover');
          }          
          if(document.getElementsByClassName('help-hover').length == 0){
            $('#avast-sas-help').addClass('help-hover');
          }
          else{
                $('#avast-sas-help').removeClass('help-hover');    
          }    
        }

        showBlockExcl('#avast-sas-help-drop');
        if(data.showABTest){
          alignPosition('#avast-sas-hint-best-offer', '#avast-sas-best-offer-link>div', true, 0);
          if($('#avast-sas-offers').length){
            alignPosition('#avast-sas-hint-compare-prices', '#avast-sas-offers', false, -260);
            alignPosition('#avast-sas-hint-coupons', '#avast-sas-coupons', false, -560);
          }
          else if($('#avast-sas-accommodations').length){
            alignPosition('#avast-sas-hint-compare-prices', '#avast-sas-accommodations', false, -260);
            alignPosition('#avast-sas-hint-coupons', '#avast-sas-coupons', false, -560);
          }
          else{
            alignPosition('#avast-sas-hint-coupons', '#avast-sas-coupons', false, 0);
          }          
        }
        else{
          alignPosition('#avast-sas-hint-best-offer', '#avast-sas-best-offer-link>div', false, 0);
          alignPosition('#avast-sas-hint-compare-prices', '#avast-sas-offers', false, 0);
          alignPosition('#avast-sas-hint-compare-prices', '#avast-sas-accommodations', false, 0);
          alignPosition('#avast-sas-hint-coupons', '#avast-sas-coupons', true, -70);
        }

        $("html").bind("click", helpConfirm );
      }

      function helpAction (event, optin) {
        event.stopPropagation();
        $("html").unbind("click", helpConfirm );
        feedback({
          type: 'safeShopOptin',
          optin: optin,
          campaignId: data.campaignId,
          showABTest: data.showABTest });
        hideBlock('#avast-sas-help-drop');
      }

      function helpConfirm (event) {
        helpAction(event, true);
      }

      function helpCancel (event) {
        helpAction(event, false);
        bar.remove();
      }

      function openSettings (event) {
        event.stopPropagation();
        $("html").unbind("click", helpConfirm );
        AvastWRC.ial.bs.messageHandler('openSettings', {});
        hideBlock('#avast-sas-help-drop');
      }

      function dropControl (buttonId, dropId) {
        var active = false;
        var timeoutId = null;

        function hideOnTimeout () {
          hideBlock(dropId);
          timeoutId = null;
          active = false;
        }

        function hoverIn (e) {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          } else {
            showBlockExcl(dropId);
            $(dropId).css('left', $(buttonId).position().left+'px');
            active = true;
          }
        }

        function hoverOut (e) {
          if (!timeoutId && active) {
            timeoutId = setTimeout(hideOnTimeout, 200);
          }
        }

        $(buttonId).hover(hoverIn, hoverOut);
        $(buttonId).click( function(e) {
          if (active) {
            hideBlock(dropId); active = false;
          } else {
            showBlockExcl(dropId);
            $(dropId).css('left', $(buttonId).position().left+'px');
          }
        });
        $(dropId).hover(hoverIn, hoverOut);
      }

      var bar;
      var domain = data.domain;

      AvastWRC.ial.initPage();

      if($('.avast-extension-safeshop-bar').length > 0) {
        return;
      }

      var height = 40;
      if(data.showABTest){
        height = 51;
        bar = AvastWRC.ial.topBar(
          Mustache.render(AvastWRC.Templates.safeShopBarAB1, data),
          '.avast-extension-safeshop-bar',
          height+'px',
          data.topBarRules
        );
      }else{
        bar = AvastWRC.ial.topBar(
          Mustache.render(AvastWRC.Templates.safeShopBar, data),
          '.avast-extension-safeshop-bar',
          height+'px',
          data.topBarRules
        );
      }     

      dropControl('#avast-sas-offers', '#avast-sas-offers-drop');
      dropControl('#avast-sas-coupons', '#avast-sas-coupons-drop');
      dropControl('#avast-sas-accommodations', '#avast-sas-accommodations-drop');

      $('#avast-sas-help').click(helpShow);

      $('#avast-sas-promo-action').click(helpConfirm);

      $('#avast-sas-promo-settings').click(openSettings);

      $('#avast-sas-settings').click(function(e) {
        showBlockExcl('#avast-sas-settings-drop');
        if(data.showABTest){
          if(document.getElementsByClassName('help-hover').length != 0){
            $('#avast-sas-help').removeClass('help-hover');
          }          
          if(document.getElementsByClassName('settings-hover').length == 0){
            $('#avast-sas-settings').addClass('settings-hover');
          }
          else{
            $('#avast-sas-settings').removeClass('settings-hover');
          }  
        }
      });

      $('#avast-sas-close').click(function() {
        feedback({
          type: 'avast-sas-close',
          campaignId: data.campaignId,
          showABTest: data.showABTest
        });        
        bar.remove();
      });

      $('#avastpay-checkbox').click(function() {
        feedback({type: 'avast-sas-avastpay'});
      });

      /*$('.avast-sas').mouseenter(function(event){
          $(event.currentTarget).removeClass("avast-sas-discreet");
      });*/

      setTimeout(function(){
          $('.avast-sas').removeClass("avast-sas-discreet");
      },100);

      $('.avast-sas-settings-list').click(function(e) {
        hideBlock('#avast-sas-settings-drop');
        var action = e.currentTarget.id;
        feedback ({type: 'safeShopSettings', 
        action: action, 
        domain: domain,
        campaignId: data.campaignId,
        showABTest: data.showABTest
      });
        if(action == 'sas-hide-domain' || action == 'sas-hide-all'){ 
         	bar.remove();
        }
        else if(action == 'sas-show-domain'){
        	$('#sas-show-domain').removeClass('individial-setting-show');
          $('#sas-show-domain').addClass('individial-setting-hide');
          $('#sas-hide-domain').removeClass('individial-setting-hide');
          $('#sas-hide-domain').addClass('individial-setting-show');
        }
        else if(action == 'sas-show-all'){
        	$('#sas-show-all').removeClass('individial-setting-show');
        	$('#sas-show-all').addClass('individial-setting-hide');
        	$('#sas-hide-all').removeClass('individial-setting-hide');
 			    $('#sas-hide-all').addClass('individial-setting-show');
        }
      });

      if(data.showABTest){
        $('.avast-sas-offer-link').hover(function(){
          $('#avast-sas-offers').addClass('drop-hover');
          $('#avast-sas-accommodations').addClass('drop-hover');
          }, function(){
            $('#avast-sas-offers').removeClass('drop-hover');
            $('#avast-sas-accommodations').removeClass('drop-hover');
        });
        $('.avast-sas-coupon-link').hover(function(){
          $('#avast-sas-coupons').addClass('drop-hover');
          }, function(){
            $('#avast-sas-coupons').removeClass('drop-hover');
        });
      }      

      $('.avast-sas-offer-link, .avast-sas-offer-link-recommended-offer, .avast-sas-best-offer-link').click(function(e) {
        e.preventDefault();
        var url = e.currentTarget.href;
        var offers = [];          
        var offer = null;
        var offerCategory = "";
        var bestOffer = false;
        if ((e.currentTarget.firstElementChild.className.indexOf("avast-sas-button") == 0)||
            (e.currentTarget.firstElementChild.className.indexOf("avast-sas-first-offer-button") == 0)){
          bestOffer = true;
        }          
        if (data.products.length > 0){
          offers = data.products;
          offerCategory = "PRODUCT";
        }else if(data.accommodations.length > 0){
          offers = data.accommodations;
          offerCategory = "ACCOMMODATION";
        }
        for (var i=0; i<offers.length; i++) {
          if (offers[i].url === url) {
            offer = offers[i];
            break;
          }
        }
              
        if (url) {
          feedback({type: 'offerRedirect',
            url: url,
            offer: offer,
            offerCategory: offerCategory,
            providerId: data.safeShopData.providerId?data.safeShopData.providerId:"",
            query: data.safeShopData.scan?JSON.stringify(data.safeShopData.scan):"",
            bestOffer: bestOffer,
            campaignId: data.campaignId,
            showABTest: data.showABTest
          });
        }
      });

      $('.avast-sas-coupon-link, .avast-sas-best-coupon-link').click(function(e) {
        var url = e.currentTarget.href,
          coupons = data.coupons,
          coupon = null, 
          bestOffer = false;
        
        if ((e.currentTarget.firstElementChild.className.indexOf("avast-sas-button") == 0)||
            (e.currentTarget.firstElementChild.className.indexOf("avast-sas-first-offer-button") == 0)){
          bestOffer = true;
        } 

        for (var i=0; i<coupons.length; i++) {
          if (coupons[i].url === url) {
            coupon = coupons[i];
            break;
          }
        }
        if (url) {
          feedback({type: 'couponRedirect',
            url: url,
            //originalRequest: data.originalQuery,
            coupon: coupon,
            providerId: data.safeShopData.providerId?data.safeShopData.providerId:"",
            query: data.safeShopData.scan?JSON.stringify(data.safeShopData.scan):"",
            bestOffer: bestOffer,
            campaignId: data.campaignId,
            showABTest: data.showABTest
          });
        }
      });


      /**
       * Handle Coupon links. Block link and pass event back to extension.
       * @param  {event} e click event
       */
      $('.avast-sas-coupon-link, .avast-sas-best-coupon-link').click(function(e){
          var url = e.currentTarget.href,
              coupons = data.coupons,
              coupon = null;

          for (var i=0; i<coupons.length; i++) {
            if (coupons[i].url === url) {
              coupon = coupons[i];
              break;
            }
          }

          e.preventDefault();

          feedback({
            type : 'safeShopCouponClick',
            url  : url,
            coupon : coupon,
            campaignId: data.campaignId,
            showABTest: data.showABTest
          });
      });

      $('.avast-sas-logo').click(function(e){
        feedback({
          type: 'avast-sas-logo',
          campaignId: data.campaignId,
          showABTest: data.showABTest
        }); 
      });

      $('.avast-sas-code-button').click(function(e) {
        e.preventDefault();
        var text = e.currentTarget.textContent;
        AvastWRC.ial.bs.messageHandler('copyToClipboard', {text: text});
        $('#avast-sas-copied-confirm').addClass('avast-sas-confirm-show');
        setTimeout(function() {
          $('#avast-sas-copied-confirm').removeClass('avast-sas-confirm-show');
        }, 2000);
      });


      if (bar.show()){
        feedback({
          type: 'avast-sas-shown',
          campaignId: data.campaignId,
          showABTest: data.showABTest
        }); 
      }
      
      if (data.showHelp) {
        helpShow();
      }

      // set refresh interval
      if (!safeShopRefreshIID) {
        safeShopRefreshIID = setInterval(
          function () {
            AvastWRC.ial.bs.messageHandler('safeShopOffersFound', data.safeShopData);
          },
          SAFESHOP_REFRESH_INTERVAL
        );
      }

    }//createSafeShopBar

  };

  /* Register SafePrice Event handlers */
  AvastWRC.ial.registerEvents(function(ee) {
    ee.on('message.checkSafeShop',
      AvastWRC.ial.sp.checkSafeShop.bind(AvastWRC.ial.sp));
    ee.on('message.showSafeShopCoupon',
      AvastWRC.ial.sp.createSafeShopBarCoupon.bind(AvastWRC.ial.sp));
    ee.on('message.showSafeShop',
      AvastWRC.ial.sp.createSafeShopBar.bind(AvastWRC.ial.sp));
  });

}).call(this, $);
