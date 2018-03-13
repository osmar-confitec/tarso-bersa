/*******************************************************************************
 *  avast! Online Security plugin - Mustache.js HTML Templates - cross browser
 *  (c) 2014 Avast Corp.
 ******************************************************************************/

var AvastWRC = AvastWRC || {};


AvastWRC.Templates = {
  /**
   * Process templates declaration and append templates to container
   */
  add: function (declaration) {
    function addPart(acc, part) {
      if (part instanceof Array) {
        for (var i = 0; i < part.length; i++) {
          addPart(acc, part[i]);
        }
      } else if (part instanceof Object) {
        // reference within declaration
        if (part.temp) {
          var temp = declaration[part.temp] || AvastWRC.Templates[part.temp];
          addPart(acc, (part.sect !== undefined) ? temp[part.sect] : temp);
        }
      } else {
        acc.push(part);
      }
    }

    for (var temp in declaration) {
      var parts = [];
      addPart(parts, declaration[temp]);
      this[temp] = parts.join('\n');
    }
  }
};

/*------------------------ SafeShop bar UI templates -------------------------*/
AvastWRC.Templates.add(
{ // --- Templates Declaration
  safeShopBar : [[
    '<div class="avast-extension-safeshop-bar avast-sas {{#coupon}}avast-sas-coupon{{/coupon}} {{#discreet}}avast-sas-discreet{{/discreet}} {{#discreetSlider}}avast-sas-discreet-animated{{/discreetSlider}}">',
      '<div class="avast-sas-the-bar">',
        //<!-- logo -->
        '<h1 class="avast-sas-block avast-sas-logo avast-sas-orange">',
          '<a class="avast-sas-icon" style="background-image: url({{images.logo}});">{{strings.sasProductName}}</a>',
        '</h1>',

        '{{#coupon}}',
          '<div class="avast-sas-block avast-sas-rating avast-sas-orange">',
            '{{#coupon.value}}',
              '<div class="avast-sas-rating-button">',
                '<h3 title="{{coupon.value}}">{{coupon.value}}</h3>',
              '</div>',
            '{{/coupon.value}}',
            '{{#coupon.label}}',
              '<h2 title="{{coupon.label}}">{{coupon.label}}</h2>',
            '{{/coupon.label}}',
          '</div>',

          '{{#coupon.code}}',
            '<div class="avast-sas-block avast-sas-code avast-sas-orange" id="coupon-code">',
              '<h3>{{strings.sasCouponCodeTitle}}</h3>',
              '<div class="avast-sas-code-button" title="{{coupon.text}}"><h3>{{coupon.code}}</h3></div>',
              '<span>{{strings.sasClickToCopy}}</span>',            			
            '</div>',
          '{{/coupon.code}}',

          '{{^coupon.code}}',
            '<div class="avast-sas-block avast-sas-code avast-sas-orange">',
              '<h3>{{strings.sasCouponCodeTitle}}</h3>',
              '<div class="avast-sas-nocode-button" title="{{coupon.text}}"><h3>{{strings.sasNoCouponCode}}</h3></div>',
              //'<h3 title="{{coupon.text}}"><strong>{{strings.sasNoCouponCode}}</strong></h3>',
            '</div>',
          '{{/coupon.code}}',

          //'<div class="avast-sas-block avast-sas-instructions">',
            //'<h2>{{strings.sasCouponInstructionsTitle}}</h2>',
            //'<p>{{coupon.text}}</p>',
          //'</div>',
        '{{/coupon}}',

        //<!-- best product - call2action -->
        '{{#products.length}}',
          '<div class="avast-sas-block avast-sas-orange">',
            '<h2 class="avast-sas-left avast-sas-text">{{strings.safeShopBestTitle}}</h2>',
            '<a class="avast-sas-offer-link" href="{{firstProduct.url}}" id="avast-sas-best-offer-link">',
              '<div class="avast-sas-button">{{strings.safeShopBestButton}}</div>',
            '</a>',
          '</div>',

          //<!-- other products -->
          '<div class="avast-sas-block avast-sas-drop-button" id="avast-sas-offers">',
            '<h3 class="avast-sas-left">{{strings.safeShopOffers}}</h3>',
            '<i class="avast-sas-icon avast-sas-drop-icon" style="background-image: url({{images.drop}});"></i>',
          '</div>',
        '{{/products.length}}',

        '{{#couponsTitle}}',
          '<div class="avast-sas-block avast-sas-orange" id="avast-sas-coupons-title">',
            '<a class="avast-sas-coupon-link" href="{{bestCouponUrl}}" id="avast-sas-best-offer-link">',
              '<div class="avast-sas-button" title="{{strings.safeShopCouponsTitle}} {{strings.safeShopCouponsSaving}}">{{strings.safeShopCouponsTitle}} {{strings.safeShopCouponsSaving}}</div>',
            '</a>',
          '</div>',
        '{{/couponsTitle}}',

        // <!--Accommodations-->
        '{{#accommodations.length}}',
            '<div class="avast-sas-block avast-sas-orange">',
                '<h2 class="avast-sas-left avast-sas-text">{{strings.safeShopBestTitle}}</h2>',
                '<a class="avast-sas-offer-link" href="{{firstProduct.url}}" id="avast-sas-best-offer-link">',
                    '<div class="avast-sas-button">{{strings.safeShopBestButton}}</div>',
                '</a>',
            '</div>',

            //<!-- other accommodations -->
            '<div class="avast-sas-block avast-sas-drop-button" id="avast-sas-accommodations">',
                '<h3 class="avast-sas-left">{{strings.safeShopOffers}}</h3>',
                '<i class="avast-sas-icon avast-sas-drop-icon" style="background-image: url({{images.drop}});"></i>',
            '</div>',
        '{{/accommodations.length}}',
    
        //<!-- coupons -->
        '{{#coupons.length}}',
          '<div class="avast-sas-block avast-sas-drop-button" id="avast-sas-coupons">',
            '<h3 class="avast-sas-left">{{strings.safeShopCoupons}}</h3>',
            '<i class="avast-sas-icon avast-sas-drop-icon" style="background-image: url({{images.drop}});"></i>',
          '</div>',
        '{{/coupons.length}}',

        // <!-- close -->
        '<div class="avast-sas-block avast-sas-close avast-sas-block-right" id="avast-sas-close">',
          '<i class="avast-sas-icon" style="background-image: url({{images.close}});"></i>',
        '</div>',

        // <!-- help -->
        '<div class="avast-sas-block avast-sas-help avast-sas-block-right" id="avast-sas-help">',
          '<i class="avast-sas-icon" style="background-image: url({{images.help}});"></i>',
        '</div>',

        // <!-- settings ??? -->
        '<div class="avast-sas-block avast-sas-settings avast-sas-block-right" id="avast-sas-settings">',
          '<i class="avast-sas-icon" style="background-image: url({{images.conf}});"></i>',
        '</div>',

        // <!-- AvastPay ??? -->
        '{{#showAvastPay}}',
        '<div class="avast-sas-block avast-sas-avastpay avast-sas-block-right" id="avast-sas-avastpay">',
          '<input type="checkbox" {{#avastPaychecekd}}checked{{/avastPaychecekd}} id="avastpay-checkbox">',
          '<label for="avastpay-checkbox">AvastPay</label>',
        '</div>',
        '{{/showAvastPay}}',

        // <!-- info -->
        '<div class="avast-sas-block avast-sas-info" id="avast-sas-info">',
          '<h4>{{strings.sasAddOnInfo}}</h4>',
        '</div>',
      '</div>'
    ],
    '<div class="avast-sas-confirm" id="avast-sas-copied-confirm">{{strings.sasCouponCodeCopied}}</div>',
    {temp: 'safeShopOffers'},
    {temp: 'safeShopCoupons'},
    {temp: 'safeShopAccommodations'},
    {temp: 'safeShopHelp'},
    {temp: 'safeShopSettings'},
    [
    '</div>'
  ]],
  // SafeShop Products dropdown
  safeShopOffers : [
    //<!-- other products - dropdown -->
    '<div class="avast-sas-drop" id="avast-sas-offers-drop">',
      //<!-- list item -->
      '{{#products}}',
        '{{#recommended}}',
          '<div class="avast-drop-item">',
            '<a href="{{url}}" class="avast-sas-list avast-sas-offer-link-recommended-offer" target="_blank">',
              '<p class="avast-sas-list-badge avast-sas-text">{{saving}}</p>',
              '<p class="avast-sas-list-price avast-sas-text">',
                '<strong title="{{fprice}}">{{fprice}}</strong>',
                '{{#shipping}}<span title="{{strings.sasShippingLabel}} {{shipping}}">{{strings.sasShippingLabel}} {{shipping}}</span>{{/shipping}}',
              '</p>',
              '<p class="avast-sas-list-desc avast-sas-text">',
                '<span class="avast-sas-list-description" title="{{label}}">{{label}}</span>',
                '{{#availability_code}}{{#availability}}<span class="avast-sas-list-stock avast-sas-availability-{{availability_code}}" title="{{availability}}">{{availability}}</span>{{/availability}}{{/availability_code}}',
              '</p>',	
              '<p class="avast-sas-list-logo-recommended-offer">',
                '{{#affiliate_image}}',
                  '<img src="{{affiliate_image}}">',
                  '<span title="{{strings.sasRecommendedOfferTitle}}">{{strings.sasRecommendedOfferMessage}}</span>',
                '{{/affiliate_image}}',
                '{{^affiliate_image}}',
                  '<span title="{{strings.sasRecommendedOfferTitle}}">{{strings.sasRecommendedOfferMessage}}</span>',
                '{{/affiliate_image}}',
              '</p>',
            '</a>',
          '</div>',
        '{{/recommended}}',
        '{{^recommended}}',
            '<div class="avast-drop-item">',
              '<a href="{{url}}" class="avast-sas-list avast-sas-offer-link" target="_blank">',
                '<p class="avast-sas-list-badge avast-sas-text">{{saving}}</p>',
                '<p class="avast-sas-list-price avast-sas-text">',
                  '<strong title="{{fprice}}">{{fprice}}</strong>',
                  '{{#shipping}}<span title="{{strings.sasShippingLabel}} {{shipping}}">{{strings.sasShippingLabel}} {{shipping}}</span>{{/shipping}}',
                '</p>',
                '<p class="avast-sas-list-desc avast-sas-text">',
                  '<span class="avast-sas-list-description" title="{{label}}">{{label}}</span>',
                  '{{#availability_code}}{{#availability}}<span class="avast-sas-list-stock avast-sas-availability-{{availability_code}}" title="{{availability}}">{{availability}}</span>{{/availability}}{{/availability_code}}',
                '</p>',	
                '{{#affiliate_image}}',
                  '<p class="avast-sas-list-logo">',
                    '<img src="{{affiliate_image}}">',
                  '</p>',
                '{{/affiliate_image}}',		     
              '</a>',
          '</div>',
        '{{/recommended}}', 
      '{{/products}}',
    '</div>'
  ],
  // SafeShop coupons dropdown
  safeShopCoupons : [
    //<!-- coupons - dropdown -->
    '<div class="avast-sas-drop" id="avast-sas-coupons-drop">',
      //<!-- list item -->
      '{{#coupons}}',
        '<div class="avast-drop-item">',
          '<a href="{{url}}" class="avast-sas-list avast-sas-coupon-link">',
            '<p class="avast-sas-list-badge" title="{{value}}">{{value}}</p>',
            '<p class="avast-sas-list-desc avast-sas-text">',
              '<strong title="{{coupon_text}}">{{label}}</strong>',
              //'<span title="{{desc}}">{{desc}}</span>',
            '</p>',
          '</a>',
        '</div>',
      '{{/coupons}}',
    '</div>'
  ],
  // SafeShop Accommodations dropdown
  safeShopAccommodations : [
    //<!-- other products - dropdown -->
    '<div class="avast-sas-drop" id="avast-sas-accommodations-drop">',
      //<!-- list item -->
      '{{#accommodations}}',
        '{{#recommended}}',
          '<div class="avast-drop-item">',
            '<a href="{{url}}" class="avast-sas-list avast-sas-offer-link-recommended-offer" target="_blank">',
              '<p class="avast-sas-list-badge avast-sas-text">{{saving}}</p>',
              '<p class="avast-sas-list-price avast-sas-text">',
                '{{#additional_fees}}',
                  '<strong title="{{fprice}}">{{fprice}}</strong>',
                  '<span  title="{{strings.sasAdditionalFees}}">{{strings.sasAdditionalFees}}</span>',
                '{{/additional_fees}}',
                '{{^additional_fees}}',
                  '<span  title="{{strings.sasStartingPrice}} {{fprice}}">{{strings.sasStartingPrice}}</span>',
                  '<strong title="{{strings.sasStartingPrice}} {{fprice}}">{{fprice}}</strong>',
                '{{/additional_fees}}',
              '</p>',
              '<p class="avast-sas-list-desc avast-sas-text">',
                '<span class="avast-sas-list-description" title="{{label}}">{{label}}</span>',
                '{{#stars}}<span class="avast-sas-accommodations-stars avast-sas-star-{{stars}}" style="background-image: {{starsBackgroundImg}};"></span>{{/stars}}',
              '</p>',	
              '<p class="avast-sas-list-logo-recommended-offer">',
                '{{#affiliate_image}}',
                  '<img src="{{affiliate_image}}">',
                  '<span title="{{strings.sasRecommendedOfferTitle}}">{{strings.sasRecommendedOfferMessage}}</span>',
                '{{/affiliate_image}}',
                '{{^affiliate_image}}',
                  '<span title="{{strings.sasRecommendedOfferTitle}}">{{strings.sasRecommendedOfferMessage}}</span>',
                '{{/affiliate_image}}',
              '</p>',
            '</a>',
          '</div>',
        '{{/recommended}}',
        '{{^recommended}}',
          '<div class="avast-drop-item">',
            '<a href="{{url}}" class="avast-sas-list avast-sas-offer-link" target="_blank">',
              '<p class="avast-sas-list-badge avast-sas-text">{{saving}}</p>',
              '<p class="avast-sas-list-price avast-sas-text">',
                '{{#additional_fees}}',
                  '<strong title="{{fprice}}">{{fprice}}</strong>',
                  '<span  title="{{strings.sasAdditionalFees}}">{{strings.sasAdditionalFees}}</span>',
                '{{/additional_fees}}',
                '{{^additional_fees}}',
                  '<span  title="{{strings.sasStartingPrice}} {{fprice}}">{{strings.sasStartingPrice}}</span>',
                  '<strong title="{{strings.sasStartingPrice}} {{fprice}}">{{fprice}}</strong>',
                '{{/additional_fees}}',
              '</p>',
              '<p class="avast-sas-list-desc avast-sas-text">',
                '<span class="avast-sas-list-description" title="{{label}}">{{label}}</span>',
                '{{#stars}}<span class="avast-sas-accommodations-stars avast-sas-star-{{stars}}" style="background-image: {{starsBackgroundImg}};"></span>{{/stars}}',
              '</p>',	
              '{{#affiliate_image}}',
                '{{#hotel}}',
                  '<p class="avast-sas-list-logo-hotel">',
                    '<img src="{{affiliate_image}}">',
                    '</p>',
                  '{{/hotel}}',
                  '{{^hotel}}',
                    '<p class="avast-sas-list-logo">',
                    '<img src="{{affiliate_image}}">',
                  '</p>',
                '{{/hotel}}',
              '{{/affiliate_image}}',		     
            '</a>',
          '</div>',
        '{{/recommended}}', 
      '{{/accommodations}}',
    '</div>'
  ],
  // SafeShop help overlay
  safeShopHelp : [
    // <!-- help dropdown -->
    // <!-- to show dropdown add class "avast-sas-drop-show" -->
    '<div class="avast-sas-new avast-sas-drop" id="avast-sas-help-drop">',
      // <!-- hint -->
      '<div class="avast-sas-hint" id="avast-sas-hint-best-offer">',
        '<img class="avast-sas-hint-arrow" src="{{images.arrow}}"/>',
        '<h3>{{strings.sasHintBestOffer}}</h3>',
        '<p>{{strings.sasHintBestOfferDesc}}</p>',
      '</div>',
      // <!-- hint -->
      '{{#products.length}}',
        '<div class="avast-sas-hint" id="avast-sas-hint-compare-prices">',
          '<img class="avast-sas-hint-arrow" src="{{images.arrow}}"/>',
          '<h3>{{strings.sasHintOtherOffers}}</h3>',
          '<p>{{strings.sasHintOtherOffersDesc}}</p>',
        '</div>',
      '{{/products.length}}',

      // <!-- hint -->
      '{{#coupons.length}}',
        '<div class="avast-sas-hint" id="avast-sas-hint-coupons">',
          '<img class="avast-sas-hint-arrow avast-sas-hint-arrow-left" src="{{images.arrow}}"/>',
          '<h3>{{strings.sasHintCoupons}}</h3>',
          '<p>{{strings.sasHintCouponsDesc}}</p>',
        '</div>',
      '{{/coupons.length}}',

      '<div class="avast-sas-hint-right" id="avast-sas-hint-settings">',
        '<img class="avast-sas-hint-arrow" src="{{images.arrow}}"/>',
        '<h3>{{strings.sasHintSettings}}</h3>',
        '<p>{{strings.sasHintSettingsDesc}}</p>',
      '</div>',

      // <!-- promo part -->
      '<div class="avast-sas-promo">',
        '<h2><span>{{strings.sasPromoNewBadge}}</span>{{strings.sasProductName}}</h2>',
        '<p>{{strings.sasPromoDescription}}</p>',
        '<div class="avast-sas-button avast-sas-promo-button" id="avast-sas-promo-action">{{strings.sasPromoAction}}</div>',
        '{{#showSettings}}<div class="avast-sas-optout-button"><a id="avast-sas-promo-settings">{{strings.sideSettings}}</a></div>{{/showSettings}}',
      '</div>',
    '</div>'
  ],
  // SafeShop settings drop down
  safeShopSettings : [
    //<!-- settings - dropdown -->
    '<ul class="avast-sas-right-drop" id="avast-sas-settings-drop">',
      //<!-- settings action items -->
      '{{#settings}}',
        '<li class="avast-sas-settings-list avast-sas-text avast-drop-item {{#display}}individial-setting-{{display}}{{/display}}" id="{{actionId}}">{{label}}</li>',
      '{{/settings}}',
    '</ul>'
  ],
  // -- SafeShop bar UI template - just bar for IE
  safeShopBarIE : [
    {temp: 'safeShopBar', sect: 0},
    {temp: 'safeShopBar', sect: 5}
  ],

  // -- ende default templates declaration --

  // -- A/B test templates declarations --
  safeShopBarAB1 : [[
    '<div class="avast-extension-safeshop-bar avast-sas {{#coupon}}avast-sas-coupon{{/coupon}}">',
      '<div class="avast-sas-the-bar">',
        //<!-- logo -->
        '<div class="avast-sas-logo">',
          '<a style="background-image: url({{images.logo}});"></a>',
        '</div>',
        //picked coupon bar
        '{{#coupon}}',
          '<div class="avast-sas-coupon-value-block">',
              '{{#coupon.label}}',
                '<div class="avast-sas-cupon-label-text" title="{{coupon.label}}">{{coupon.label}}</div>',
              '{{/coupon.label}}',
          '</div>',

          '{{#coupon.code}}',
            '<div class="avast-sas-coupon-code-block" id="coupon-code">',
              '<div class="avast-sas-cupon-code-title-text">{{strings.sasCouponCodeTitle}} ({{strings.sasClickToCopy}}) </div>',
              '<div class="avast-sas-code-button" title="{{coupon.text}}">{{coupon.code}}</div>',
            '</div>',
          '{{/coupon.code}}',

          '{{^coupon.code}}',
            '<div class="avast-sas-coupon-code-block">',
              '<div class="avast-sas-cupon-code-title-text"">{{strings.sasCouponCodeTitle}}</div>',
              '<div class="avast-sas-nocode-button" title="{{coupon.text}}">{{strings.sasNoCouponCode}}</div>',
            '</div>',
          '{{/coupon.code}}',

        '{{/coupon}}',

        //<!-- best product - call2action -->
        '{{#products.length}}',
          '<div class="avast-sas-first-offer-block">',
            '<div class="avast-sas-first-offer-text">{{strings.safeShopBestTitle}}</div>',
            '<a class="avast-sas-best-offer-link" href="{{firstProduct.url}}" id="avast-sas-best-offer-link">',
            '<div class="avast-sas-first-offer-button">{{strings.safeShopBestButton}}</div>',
            '</a>',
          '</div>',

          //<!-- other products -->
          '<div class="avast-sas-drop-offers-block" id="avast-sas-offers">',
            '<div class="avast-sas-drop-text">{{strings.safeShopOffers}}</div>',
            '<i class="avast-sas-drop-icon" style="background-image: url({{images.drop}});"></i>',
          '</div>',
        '{{/products.length}}',
        
        '{{#couponsTitle}}',
          '<div class="avast-sas-first-offer-block">',
            '<a class="avast-sas-best-coupon-link" href="{{bestCouponUrl}}" id="avast-sas-best-offer-link">',
              '<div class="avast-sas-first-offer-button" title="{{strings.safeShopCouponsTitle}} {{strings.safeShopCouponsSaving}}">{{strings.safeShopCouponsTitle}} {{strings.safeShopCouponsSaving}}</div>',
            '</a>',
          '</div>',
        '{{/couponsTitle}}',

        '{{#accommodations.length}}',
          '<div class="avast-sas-first-offer-block">',
            '<div class="avast-sas-first-offer-text">{{strings.safeShopBestTitle}}</div>',
            '<a class="avast-sas-best-offer-link" href="{{firstProduct.url}}" id="avast-sas-best-offer-link">',
              '<div class="avast-sas-first-offer-button">{{strings.safeShopBestButton}}</div>',
            '</a>',
          '</div>',

          //<!-- other products -->
          '<div class="avast-sas-drop-offers-block" id="avast-sas-accommodations">',
            '<div class="avast-sas-drop-text">{{strings.safeShopOffers}}</div>',
            '<i class="avast-sas-drop-icon" style="background-image: url({{images.drop}});"></i>',
          '</div>',
        '{{/accommodations.length}}',


        //<!-- coupons -->
        '{{#coupons.length}}',
          '<div class="avast-sas-drop-offers-block" id="avast-sas-coupons">',
            '<div class="avast-sas-drop-text">{{strings.safeShopCoupons}}</div>',
            '<i class="avast-sas-drop-icon" style="background-image: url({{images.drop}});"></i>',
          '</div>',
        '{{/coupons.length}}',

        // <!-- close -->
        '<div class="avast-sas-close" id="avast-sas-close">',
          '<i style="background-image: url({{images.close}});"></i>',
        '</div>',

        // <!-- help --> don't show this on coupons bar
        '{{^coupon}}',
          '<div class="avast-sas-help" id="avast-sas-help">',
            '<i style="background-image: url({{images.help}});"></i>',
          '</div>',
        '{{/coupon}}',
        // <!-- settings ??? --> don't show this on coupons bar
        '{{^coupon}}',
          '<div class="avast-sas-settings" id="avast-sas-settings">',
            '<i style="background-image: url({{images.conf}});"></i>',
          '</div>',
        '{{/coupon}}',
      '</div>'
    ],
    '<div class="avast-sas-confirm" id="avast-sas-copied-confirm">{{strings.sasCouponCodeCopied}}</div>',
    {temp: 'safeShopOffersAB1'},
    {temp: 'safeShopAccommodationsAB1'},
    {temp: 'safeShopCouponsAB1'},
    {temp: 'safeShopHelpAB1'},
    {temp: 'safeShopSettingsAB1'},
    [
    '</div>'
  ]],
   // SafeShop Products dropdown
  safeShopOffersAB1 : [
    //<!-- other products - dropdown -->
    '<div class="avast-sas-drop" id="avast-sas-offers-drop"  {{^firstProduct.saving}} style="width: 461px !important;" {{/firstProduct.saving}}>',
      //<!-- list item -->
      '{{#products}}',
        '<a href="{{url}}" class="avast-sas-drop-list avast-sas-offer-link" target="_blank" {{^firstProduct.saving}} style="width: 461px !important;" {{/firstProduct.saving}}>',
          '{{#firstProduct.saving}}',
            '<div class="avast-sas-item-badge" title="{{saving}}">{{saving}}</div>',
          '{{/firstProduct.saving}}',
          '<div class="avast-sas-container-price-shipping">',
            '<div class="avast-sas-item-price" title="{{fprice}}">{{fprice}}</div>',
            '{{#shipping}}',
              '<div class="avast-sas-item-shipping" title="{{strings.sasShippingLabel}} {{shipping}}">{{strings.sasShippingLabel}} {{shipping}}</div>',
            '{{/shipping}}',
          '</div>',
          '<div class="avast-sas-container-description-availability">',
            '<div class="avast-sas-item-description" title="{{label}}">{{label}}</div>',
            '{{#availability_code}}',
              '{{#availability}}',
                '<div class="avast-sas-item-availavility-{{availability_code}}" title="{{availability}}">{{availability}}</div>',
              '{{/availability}}',
            '{{/availability_code}}',
          '</div>',	          
          '<div class="avast-sas-item-afiliate-image">',
            '{{#affiliate_image}}',
                '<img src="{{affiliate_image}}">',
            '{{/affiliate_image}}',	
          '</div>',          	     
       '</a>',       
      '{{/products}}',
    '</div>'
  ],

   // SafeShop coupons dropdown
  safeShopCouponsAB1 : [
    //<!-- coupons - dropdown -->
    '<div class="avast-sas-drop" id="avast-sas-coupons-drop">',
      //<!-- list item -->
      '{{#coupons}}',
      '<a href="{{url}}" class="avast-sas-drop-list avast-sas-coupon-link">',
        '<div class="avast-sas-item-badge" title="{{value}}">{{value}}</div>',
        '<div class = "avast-sas-coupon-description-container">',
          '<div class="avast-sas-coupon-description" {{#coupon_text}}title="{{coupon_text}}"{{/coupon_text}}{{^coupon_text}}title="{{label}}"{{/coupon_text}}>{{label}}</div>',
        '</div>',
      '</a>',
      '{{/coupons}}',
    '</div>'
  ],

  // SafeShop Accommodations dropdown
  safeShopAccommodationsAB1 : [
    //<!-- other products - dropdown -->
    '<div class="avast-sas-drop" id="avast-sas-accommodations-drop" {{^firstProduct.saving}} style="width: 461px !important;" {{/firstProduct.saving}}>',
      //<!-- list item -->
      '{{#accommodations}}',
        '<a href="{{url}}" class="avast-sas-drop-list avast-sas-offer-link" target="_blank" {{^firstProduct.saving}} style="width: 461px !important;" {{/firstProduct.saving}}>',
          '{{#firstProduct.saving}}',
            '<div class="avast-sas-item-badge" title="{{saving}}">{{saving}}</div>',
          '{{/firstProduct.saving}}',
          '<div class="avast-sas-container-price-fees">',
            '{{#additional_fees}}',
              '<div class="avast-sas-item-price" title="{{fprice}}">{{fprice}}</div>',
              '<div class="avast-sas-item-fees" title="{{strings.sasAdditionalFees}}">{{strings.sasAdditionalFees}}</div>',
            '{{/additional_fees}}',
            '{{^additional_fees}}',
              '<div class="avast-sas-item-fees" title="{{strings.sasStartingPrice}} {{fprice}}">{{strings.sasStartingPrice}}</div>',
              '<div class="avast-sas-item-price" title="{{strings.sasStartingPrice}} {{fprice}}">{{fprice}}</div>',
            '{{/additional_fees}}',
          '</div>',
          '<div class="avast-sas-container-description-stars">',
            '<div class="avast-sas-item-description" title="{{label}}">{{label}}</div>',
            '{{#stars}}',
              '<div class="avast-sas-item-stars avast-sas-star-{{stars}}" style="background-image: {{starsBackgroundImg}};"></div>',
            '{{/stars}}',
          '</div>',	          
          '<div class="avast-sas-item-afiliate-hotel-image">',
            '{{#affiliate_image}}',
                '<img src="{{affiliate_image}}">',
            '{{/affiliate_image}}',
          '</div>',
          		     
        '</a>',       
      '{{/accommodations}}',
    '</div>'
  ],

  // SafeShop settings drop down
  safeShopSettingsAB1 : [
    //<!-- settings - dropdown -->
    '<ul class="avast-sas-right-drop" id="avast-sas-settings-drop">',
      //<!-- settings action items -->
      '{{#settings}}',
        '<li class="avast-sas-settings-list {{#display}}individial-setting-{{display}}{{/display}}" id="{{actionId}}">{{label}}</li>',
      '{{/settings}}',
    '</ul>'
  ],

  // SafeShop help overlay
  safeShopHelpAB1 : [
    // <!-- help dropdown -->
    // <!-- to show dropdown add class "avast-sas-drop-show" -->
    '<div class="avast-sas-drop avast-sas-help" id="avast-sas-help-drop">',
      // <!-- hint -->
      '{{#products.length}}',
        '<div class="avast-sas-hint" id="avast-sas-hint-best-offer">',
          '<img class="avast-sas-hint-arrow" src="{{images.arrow}}"/>',
          '<h3>{{strings.sasHintBestOffer}}</h3>',
          '<p>{{strings.sasHintBestOfferDesc}}</p>',
        '</div>',
      '{{/products.length}}',
      // <!-- hint -->
      '{{#accommodations.length}}',
        '<div class="avast-sas-hint" id="avast-sas-hint-best-offer">',
          '<img class="avast-sas-hint-arrow" src="{{images.arrow}}"/>',
          '<h3>{{strings.sasHintBestOffer}}</h3>',
          '<p>{{strings.sasHintBestOfferDesc}}</p>',
        '</div>',
      '{{/accommodations.length}}',
      // <!-- hint -->
      '{{#products.length}}',
        '<div class="avast-sas-hint" id="avast-sas-hint-compare-prices">',
          '<img class="avast-sas-hint-arrow" src="{{images.arrow}}"/>',
          '<h3>{{strings.sasHintOtherOffers}}</h3>',
          '<p>{{strings.sasHintOtherOffersDesc}}</p>',
        '</div>',
      '{{/products.length}}',
      '{{#accommodations.length}}',
        '<div class="avast-sas-hint" id="avast-sas-hint-compare-prices">',
          '<img class="avast-sas-hint-arrow" src="{{images.arrow}}"/>',
          '<h3>{{strings.sasHintOtherOffers}}</h3>',
          '<p>{{strings.sasHintOtherOffersDesc}}</p>',
        '</div>',
      '{{/accommodations.length}}',
      // <!-- hint -->
      '{{#coupons.length}}',
        '<div class="avast-sas-hint" id="avast-sas-hint-coupons">',
          '<img class="avast-sas-hint-arrow avast-sas-hint-arrow-left" src="{{images.arrow}}"/>',
          '<h3>{{strings.sasHintCoupons}}</h3>',
          '<p>{{strings.sasHintCouponsDesc}}</p>',
        '</div>',
      '{{/coupons.length}}',

      '<div class="avast-sas-hint-right" id="avast-sas-hint-settings">',
        '<img class="avast-sas-hint-arrow" src="{{images.arrow}}"/>',
        '<h3>{{strings.sasHintSettings}}</h3>',
        '<p>{{strings.sasHintSettingsDesc}}</p>',
      '</div>',

      // <!-- promo part -->
      '<div class="avast-sas-promo">',
        '<div class="avast-sas-promo-header">{{strings.sasProductName}}</div>',
        '<div class="avast-sas-promo-text">{{strings.sasPromoDescription}}</div>',
      '</div>',
    '</div>'
  ],
  // --ende  A/B test templates declarations --

});
