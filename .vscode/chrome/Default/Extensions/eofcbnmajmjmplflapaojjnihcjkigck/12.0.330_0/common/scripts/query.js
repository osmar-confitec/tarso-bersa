(function(_, AvastWRC, PROTO) {

  if (typeof(AvastWRC)=="undefined") { AvastWRC = {};}

  var HTTP_SERVER  = "http://ui.ff.avast.com",
      HTTP_PORT    = "80",
      HTTPS_SERVER = "https://uib.ff.avast.com",
      HTTPS_PORT   = "443",
      USE_HTTPS    = true;

  /*******************************************************************************
   *
   *  Query CONSTANTS
   *
   ******************************************************************************/
  AvastWRC.Query = {
    CONST : {
      HEADERS : {
        //"Accept": "binary",
        //dataType: 'binary',
        "Content-Type": "application/octet-stream",
        //"Connection": "keep-alive" // refused in Chrome
      },
      //SERVER : "http://lon09.ff.avast.com",
      SERVER : USE_HTTPS ? HTTPS_SERVER : HTTP_SERVER,
      PORT   : USE_HTTPS ? HTTPS_PORT   : HTTP_PORT,
      HTTPS_SERVER: "https://uib.ff.avast.com:443",
      UPDATE_SERVER: "http://ui.ff.avast.com/v5/ruleUpdate",
      VOTE_SERVER: 'http://uiv.ff.avast.com/v3/urlVote',
      TA_SERVER: 'http://ta.ff.avast.com/F/', // 'http://ta.ff.avast.com/F/AAoH2YP6qRuPTnJl7LgVp8ur',
      OFFERS_SERVER: "https://safeprice.ff.avast.com:443/offers", //"http://safeprice-test.ff.int.avast.com:8080/offers", //"http://ciuvoproxy-test2.ff.avast.com/offers",
      SAFESHOP_DOMAININFO_SERVER: "https://safeprice.ff.avast.com:443/domainInfo", //"http://safeprice-test.ff.int.avast.com:8080/domainInfo",
      SAFESHOP_BURGER_SERVER: "",
      //PICKED_OFFER_SERVER: "http://cvp.ff.avast.com/pickedOffer", // cvp-stage.ff.avast.com
      URLINFO : "urlinfo",
      URLINFO_V4 : "v4/urlinfo",
      URLINFO_V5 : "v5/urlinfo",
      LOCAL_PORTS : [27275, 18821, 7754],
      LOCAL_PORT : null,
      LOCAL_TOKEN : null,
      GAMIFICATION_SERVER : "https://gamification.ff.avast.com:8743/receiver"
    }
  };

  /*******************************************************************************
   *
   *  Query Master Class
   *
   ******************************************************************************/
  AvastWRC.Query.__MASTER__ = {
    completed : false,
    /**
     * Initialize UrlInfo request.
     * @return {[type]} [description]
     */
    init : function(){
      this.headers = _.extend({}, AvastWRC.Query.CONST.HEADERS, this.headers);
      // Populate proto message
      this.message();
      // Send it to server
      if(this.options.go) this.post();
    },
    headers : {},
    /**
     * Set an option value
     * @param {String} option Property name
     * @param {}     value  Property value
     */
    set : function (option, value) {
      this.options[option] = value;
      return this;
    },
    /**
     * Get an option value
     * @param  {String} option Property name
     * @return {}           Property value
     */
    get : function (option) {
      return this.options[option];
    },
    /**
     * return json string of the message
     * @return {Object} Json representation of the GPB message
     */
    toJSON : function(){

      // return AvastWRC.Utils.gpbToJSON(this.response);
      var protoJSON = function (p) {
        var res = {};
        for(var prop in p.values_) {
          if(p.values_[prop].length) {
            // repeated message
            res[prop] = [];
            for(var i=0, j=p.values_[prop].length; i<j; i++) {
              res[prop].push(protoJSON(p.values_[prop][i]));
            }
          } else if(p.values_[prop].properties_){
            // composite message

              res[prop] = {};
            for(var krop in p.values_[prop].values_) {
              if(p.values_[prop].values_[krop] instanceof PROTO.I64) {
                // convert PROTO.I64 to number
                res[prop][krop] = p.values_[prop].values_[krop].toNumber();
              }else {
                res[prop][krop] = p.values_[prop].values_[krop];
              }
            }
          } else {
            // value :: deprecated - remove it
            res[prop] = p.values_[prop];
          }
        }
        return res;
      };
      return protoJSON(this.response);
    },
    /**
     * Send request to server
     * @return {Object} Self reference
     */
    post : function(){
      if (this.options.server.indexOf(":null") !== -1) {
          return this;
      }
      var buffer = this.getBuffer(this.request);
      console.log("Request:", JSON.stringify(this.request.message_type_), this.options.server, JSON.stringify(this.request.values_));

      var self = this;
      var xhr = new XMLHttpRequest();
      xhr.open(this.options.method.toUpperCase(), this.options.server, true);
      xhr.responseType = "arraybuffer";
      xhr.withCredentials = true;
      xhr.timeout = this.options.timeout || 0; // default to no timeout

      for(var prop in this.headers) {
        xhr.setRequestHeader(prop, this.headers[prop]);
      }

      xhr.onload = function(e) {    	  
        var status = 0;
        if(typeof e.srcElement !== "undefined"){
          status = e.srcElement.status;
        }
        else if(typeof e.target !== "undefined"){
          status = e.target.status;
        }
        
        if(status === 403){
          self.error(xhr);
        }    
        if(status === 400){
          var bodyEncodedInString = String.fromCharCode.apply(String, new Uint8Array(xhr.response));
					console.log("Response Status: "+status  +" Error: "+ bodyEncodedInString);
        }   
        self.callback(xhr.response);
      };
      xhr.onerror = function() {
        self.error(xhr);
      };
      xhr.ontimeout = function() {
        self.error(xhr);
      };
      xhr.send(buffer);
        return this;
    },
    /**
     * Convert message to ArrayBuffer
     * @param  {Object} message Message instance
     * @return {Array}         Array Buffer
     */
    getBuffer : function(message){

      var stream = new PROTO.ByteArrayStream;
      message.SerializeToStream(stream);
      return this.baToab(stream.getArray());
    },
    /**
     * Handle server response
     * @param  {Array}   arrayBuffer Incoming message
     * @return {void}
     */
    callback : function (arrayBuffer) {
      var format = this.options.format;
      var res = null;
      if ('string' === format) {
        res = String.fromCharCode.apply(String, this.abToba(arrayBuffer));
      } else {
        this.parser(arrayBuffer);

        if(this.updateCache) { this.updateCache(); }

        if('json' === format) {
          res = this.toJSON();
        }
        else if('object' === format) {
          res = this.format();
        }
        else {
          res = this.response;
        }
      }
      
      console.log('Response:', JSON.stringify(res));
      this.options.callback(res);
      this.completed = true;
    },
    /**
     * Handle error responses
     * @param  {Object} xhr xmlhttp request object
     * @return {void}
     */
    error : function(xhr){
      if(this.options.error) this.options.error(xhr);
    },
    /**
     * Placeholder - each Instance can override this to format the message
     * @return {[type]} [description]
     */

    format : function(){
      return { error : "This call has now formatting message.", message: this.response };
    },
    /**
     * parse arrayBuffer into a ProtoJS response
     * @param  {Array} arrayBuffer
     * @return {void}
     */
    parser : function (arrayBuffer){
      this.response.ParseFromStream(new PROTO.ByteArrayStream(this.abToba(arrayBuffer)));
    },
    /**
     * ByteArray to ArrayBuffer
     * @param  {Object} data [description]
     * @return {Array}
     */
    baToab: function(data){
      var buf = new ArrayBuffer(data.length);

      var bytes = new Uint8Array(buf);
      for(var i = 0; i < bytes.length; i++) {
        bytes[i] = data[i] % 256;
      }

      return AvastWRC.Utils.getBrowserInfo().isChrome() ? bytes : buf;
    },
    /**
     * ArrayBuffer to ByteArray
     * @param  {Array} arrayBuffer [description]
     * @return {Array}             [description]
     */
    abToba: function(arrayBuffer){
      if(arrayBuffer === null) return [];
      var bytes = new Uint8Array(arrayBuffer);
          var arr = [];
      for(var i = 0; i < bytes.length; i++) {
        arr[i] = bytes[i] % 256;
      }
          return arr;
    },
    setBaseIdentityIds : function(identity) {
      if (AvastWRC.CONFIG.GUID != null) {
        identity.guid = PROTO.encodeUTF8(AvastWRC.CONFIG.GUID);
      }     
      if (AvastWRC.CONFIG.AUID != null) {
        identity.auid = PROTO.encodeUTF8(AvastWRC.CONFIG.AUID);
      }
      if (AvastWRC.CONFIG.USERID != null) {
        identity.userid = PROTO.encodeUTF8(AvastWRC.CONFIG.USERID);
      }
      return identity;
    },
    setExtIdentityIds : function(identity) {
      if (AvastWRC.CONFIG.UUID != null) {
        identity.uuid = PROTO.encodeUTF8(AvastWRC.CONFIG.UUID);
      }
      if (AvastWRC.CONFIG.PLG_GUID != null) {
        identity.plugin_guid = PROTO.encodeUTF8(AvastWRC.CONFIG.PLG_GUID);
      }
      if (AvastWRC.CONFIG.HWID != null) {
        identity.hwid = PROTO.encodeUTF8(AvastWRC.CONFIG.HWID);
      }
      return identity;
    },
    /**
     * Format Identity message (base identity)
     * @param dnl - do not log = exclude user identification
     * @return {Object} GPB Identity message
     */
    identity : function(dnl) {
      var msg = new AvastWRC.gpb.All.Identity;
      var browserInfo = AvastWRC.Utils.getBrowserInfo();

      if (!dnl) {  msg = this.setBaseIdentityIds(msg); }

      msg.browserType = AvastWRC.gpb.All.BrowserType[browserInfo.getBrowser()];

      msg.browserVersion = browserInfo.getBrowserVersion();

      return msg;
    },
    /**
     * Generate extended identity (w/ hwid + uuid) when required
     * @param dnl - do not log = exclude user identification
     */
    extIdentity : function(dnl) {
      var msg = this.identity(dnl);
      return dnl ? msg : this.setExtIdentityIds(msg);
    },
    /**
     * Generate clientIdentity for new UrlInfo format.
     * @param dnl - do not log = exclude user identification
     */
    clientIdentity : function(dnl) {
      var avIdentity = new AvastWRC.gpb.All.AvastIdentity;
      var browserInfo = AvastWRC.Utils.getBrowserInfo();

      if (!dnl) {
        avIdentity = this.setBaseIdentityIds(avIdentity);
        avIdentity = this.setExtIdentityIds(avIdentity);
      }

      var extInfo = new AvastWRC.gpb.All.BrowserExtInfo;
      extInfo.extensionType = AvastWRC.CONFIG.EXT_TYPE;
      extInfo.extensionVersion = AvastWRC.CONFIG.EXT_VER;
      extInfo.dataVersion = AvastWRC.CONFIG.DATA_VER;
      extInfo.browserType = AvastWRC.gpb.All.BrowserType[browserInfo.getBrowser()];
      extInfo.browserVersion = browserInfo.getBrowserVersion();

      var client = new AvastWRC.gpb.All.Client;
      client.id = avIdentity;
      client.type = AvastWRC.gpb.All.Client.CType.BROWSER_EXT;
      client.browserExtInfo = extInfo;
      return client;
    }
  };

  /*******************************************************************************
   *
   *  avast! Program Communication
   *
   ******************************************************************************/

  AvastWRC.Query.Avast = function(options){

      if(!options.type) {
        return;
      }

      this.options = _.extend({
        url : null,
        type : "GET_PROPERTIES",
        property : "",
        value : "",
        server : "http://localhost:"+AvastWRC.Query.CONST.LOCAL_PORT+"/command",
        method : "post",
        callback : _.noop,
        //format : "json",      // return response in JSON
        timeout: 0,
        go : true        // true = trigger the request immediately

      },options);

      if (AvastWRC.Query.CONST.LOCAL_TOKEN) {
        this.headers = _.extend({ "X-AVAST-APP-ID": AvastWRC.Query.CONST.LOCAL_TOKEN }, this.headers);
      }
      
      if(AvastWRC.Utils.getBrowserInfo().isEdge()) {
    	  this.options.timeout = 1;
      }

      this.request = new AvastWRC.gpb.All.LocalServerRequest;
      this.response = new AvastWRC.gpb.All.LocalServerResponse;
      this.init();
  };

  AvastWRC.Query.Avast.prototype = _.extend({},AvastWRC.Query.__MASTER__,{
    message : function(type){
      var i,j;
      this.request.type = AvastWRC.gpb.All.LocalServerRequest.CommandType[this.options.type];
      this.request.browser = AvastWRC.gpb.All.BrowserType[AvastWRC.Utils.getBrowserInfo().getBrowser()]; // 3

      switch(this.options.type){
        case "ACKNOWLEDGEMENT":
          this.request.params.push(PROTO.encodeUTF8(AvastWRC.CONFIG.VERSION));
          break;
        case "GET_PROPERTY":
          this.request.params.push(PROTO.encodeUTF8("avastcfg://avast5/Common/"+this.options.property));
          break;
        case "SET_PROPERTY":
          this.request.params.push(PROTO.encodeUTF8("avastcfg://avast5/Common/"+this.options.property));
          this.request.params.push(PROTO.encodeUTF8(this.options.value));
          break;
        case "GET_PROPERTIES":
          for(i=0, j=this.options.params.length; i<j; i++){
            this.request.params.push(PROTO.encodeUTF8("avastcfg://avast5/Common/"+this.options.params[i]));
          }
          break;
        case "SET_PROPERTIES":
          for(i=0, j=this.options.params.length; i<j; i++){
            this.request.params.push(PROTO.encodeUTF8(
              "avastcfg://avast5/Common/" + this.options.params[i] + '=' + this.options.values[i]
            ));
          }
          break;
        case "IS_BANKING_SITE":
        case "IS_SAFEZONE_CUSTOM_SITE":
        case "SITECORRECT":
        case "SWITCH_TO_SAFEZONE":
          this.request.params.push(PROTO.encodeUTF8(this.options.value));
        break;
      }

      return this;
    }
  });

  /*******************************************************************************
   *
   *  UrlInfo
   *
   ******************************************************************************/

  AvastWRC.Query.UrlInfo = function(options) {
      // no url, just stop right here
      if(!options.url) return false;
      if(typeof options == "string") options = {url: options};

      this.options = _.extend({
        url : null,
        visited : true,
        server : AvastWRC.Query.CONST.SERVER + ":" + AvastWRC.Query.CONST.PORT + "/" +
          (AvastWRC.CONFIG.FEATURES.newUrlInfoVersion ? AvastWRC.Query.CONST.URLINFO_V5 : AvastWRC.Query.CONST.URLINFO),
        method : "post",
        webrep : true,
        phishing : true,
        blocker : false,
        typo : false,
        safeShop: 0,        // opt-in, not in cache by default
        callback : _.noop,
        format : "object",  // return response in JSON
        go : true           // true = trigger the request immediately
      },options);

      this.request = new AvastWRC.gpb.All.UrlInfoRequest.Request;
      this.response = new AvastWRC.gpb.All.UrlInfoRequest.Response;

      this.init();
  };

  AvastWRC.Query.UrlInfo.prototype = _.extend({},AvastWRC.Query.__MASTER__,{

    // build PROTO message
    message : function() {
      var dnl = (AvastWRC.CONFIG.COMMUNITY_IQ === false);
      
      if(typeof this.options.url == "string") {
        this.request.uri.push(PROTO.encodeUTF8(this.options.url));
      } else {
        this.request.uri = this.options.url;
      }

      this.request.callerid = PROTO.I64.fromNumber(this.getCallerid());
      this.request.locale = ABEK.locale.getBrowserLocale();
      this.request.client = this.clientIdentity(dnl);
      this.request.identity = this.extIdentity(dnl);

      if (this.request.uri.length > 1) {
          this.request.visited = false;
      }
      else this.request.visited = this.options.visited; // bool
      
      this.request.referer = this.options.referer;
      this.request.tabNum = this.options.tabNum;
      this.request.windowNum = this.options.windowNum;
      this.request.windowEvent = this.options.windowEvent;

      if (_.isArray(this.options.customKeyValue)) {
          for (var i in this.options.customKeyValue) {
              var keyValue = new AvastWRC.gpb.All.KeyValue;
              keyValue.key = this.options.customKeyValue[i].key;
              keyValue.value = this.options.customKeyValue[i].value;
              this.request.customKeyValue.push(keyValue);              
          }
          console.log("customKeyValue", this.options.customKeyValue);
      }

      if (typeof this.options.originHash !== "undefined") {
            this.request.originHash = this.options.originHash;
            //console.log("UrlInfo: originHash:" + this.options.originHash);
      }

      if (typeof this.options.origin === "object" && this.options.origin !== null) {
            this.request.lastOrigin = new AvastWRC.gpb.All.Origin;
            this.request.lastOrigin.hash = this.options.origin.hash;
            this.request.lastOrigin.origin = this.options.origin.origin;
            //console.log("UrlInfo: hash:" + this.options.origin.hash + " origin:" + this.options.origin.origin);
      }

      this.request.clientTimestamp = PROTO.I64.fromNumber((new Date).getTime());
        
        // this.request.fullUris = this.options.fullUrls;

      this.request.safeShop = PROTO.I64.fromNumber(this.options.safeShop);

      // Requested service bitmask  (webrep 1, phishing 2) - webrep always, phishing not in multiple requested
      //var requestedServices = new AvastWRC.Utils.BitWriter(0);
      //requestedServices.addBitmask(AvastWRC.DEFAULTS.URLINFO_MASK.webrep);
      //if(this.options.visited) requestedServices.addBitmask(AvastWRC.DEFAULTS.URLINFO_MASK.phishing);
      //this.request.requestedServices = requestedServices.getValue();
      //TODO - use settings here
      if( this.options.reqServices === null || this.options.reqServices === undefined )
      {
          this.request.requestedServices = 0x00BF;
      }
      else
      {
          this.request.requestedServices = this.options.reqServices;
      }
      // if(this.options.visited){
      //   requestedServices |= AvastWRC.DEFAULTS.URLINFO_MASK.siteCorrect;
      // }

      if ( dnl ) { this.request.dnl = true; }

      return this;
    },
    /**
     * Create an instance(s) of AvastWRC.UrlInfo object
     * @return {Object}
     */
    format : function(){
      var json = this.toJSON();
      var res = [];
      for(var i=0, j=json.urlInfo.length; i<j; i++) {
         res[i] = new AvastWRC.UrlInfo(this.options.url[i], json.urlInfo[i], !this.options.visited);
      }
      return res;
    },
    updateCache : function(){
      // TODO: update Cache >> currently handled elswhere - should be moved here.
    },
    updateRequest : function(){
      var msg = new AvastWRC.gpb.All.UrlInfoRequest.UpdateRequest;

      return msg;
    },
    /**
     * url info message type
     * @return {Strinng} call
     */
    getCallerid : function() {
      return AvastWRC.CONFIG.CALLERID;
    }
  });

  /************************************************************************************************************ 
  *   Gamification Application Event 
  ************************************************************************************************************/
  AvastWRC.Query.ApplicationEvent = function(options) {
    var d = new Date();  
    // no url, just stop right here
    if((!AvastWRC.CONFIG.GUID && !AvastWRC.CONFIG.AUID) || !options.eventType) return false;
  
    this.options = _.extend({
      eventType : [0],
      eventTime : Math.floor(d.getTime()/1000),
      guid : AvastWRC.CONFIG.GUID,
      auid : AvastWRC.CONFIG.AUID,
      hwid : AvastWRC.CONFIG.HWID,
      uuid : AvastWRC.CONFIG.UUID,
      callerId : AvastWRC.CONFIG.CALLERID,
      source : AvastWRC.gpb.All.ApplicationEvent.Source.BROWSER_PLUGIN,
      server : AvastWRC.Query.CONST.GAMIFICATION_SERVER,
      method : "post",
      callback : _.noop,
      format : "object",  // return response in JSON
      go : true           // true = trigger the request immediately
    }, options);

    this.request = new AvastWRC.gpb.All.ApplicationEvent;
    this.response = new AvastWRC.gpb.All.GamificationResponse;

    this.init();
  };

  AvastWRC.Query.ApplicationEvent.prototype = _.extend({},AvastWRC.Query.__MASTER__,{

    // build PROTO message
    message : function() {

      this.request.identity = new AvastWRC.gpb.All.ApplicationIdentity;
      this.request.identity.type = AvastWRC.gpb.All.ApplicationIdentity.ApplicationIdentityType.HW_IDENTITY;
      this.request.identity.guid = this.options.guid;
      this.request.identity.auid = this.options.auid;
      this.request.identity.hwid = this.options.hwid;
      this.request.identity.uuid = this.options.uuid;
      
      this.request.event = new AvastWRC.gpb.All.GeneratedEvent;
      this.request.event.eventType = this.options.eventType;
      this.request.event.eventTime = PROTO.I64.fromNumber(this.options.eventTime);

      var browserPar = new AvastWRC.gpb.All.GeneratedEvent.GeneratedEventParam;
      browserPar.paramName = 'browserType';
      browserPar.value = (Math.floor(AvastWRC.CONFIG.CALLERID / 1000)).toString();
      this.request.event.params = [browserPar];

      this.request.source = this.options.source;

      this.request.productInformation = new AvastWRC.gpb.All.ProductInformation;
      this.request.productInformation.code = 'AV_AOS';
      this.request.productInformation.version = PROTO.encodeUTF8(this.options.callerId.toString());  

      return this;
    },
    /**
     * Create an instance(s) of AvastWRC.UrlInfo object
     * @return {Object}
     */
    format : function(){
      var json = this.toJSON();
      return json;
    }
  });

/*******************************************************************************
     *
     *  Query Shepherd
     * 
     ********************************************************************************/
AvastWRC.Query.Shepherd = function(onSuccess, onError) {
    var SHEPHERD_CONFIGS = "https://shepherd.ff.avast.com/?";//"https://shepherd-test-mobile.ff.avast.com/?";
    // products https://ipm.srv.int.avast.com/Products or https://ipm.srv.int.avast.com/Parameters/Detail/1
    //43	Avast SafePrice
    //72	AVG SafePrice
    //46    Avast Online Security
    //47    WebTuneUp Web Extension
    var product = 0;
    if((AvastWRC.CONFIG.EXT_TYPE == AvastWRC.EXT_TYPE_SP)){
        product = (AvastWRC.bal.brandingType == undefined || AvastWRC.bal.brandingType == AvastWRC.BRANDING_TYPE_AVAST) ? 43 : 72;
    }else if(AvastWRC.CONFIG.EXT_TYPE == AvastWRC.EXT_TYPE_AOS){
        product = 46;
    }
    else if(AvastWRC.CONFIG.EXT_TYPE == AvastWRC.EXT_TYPE_WTU){
        product = 47;
    }
    
    var guid = AvastWRC.CONFIG.GUID ? AvastWRC.CONFIG.GUID : AvastWRC.CONFIG.PLG_GUID ? AvastWRC.CONFIG.PLG_GUID : "";
    
    var version = AvastWRC.CONFIG.VERSION?AvastWRC.CONFIG.VERSION:"";
    var iniPos = 0, endPos = version.indexOf(".");
    var val = [];
    while(iniPos != -1){
		if(endPos != -1){
			val.push(version.substr(iniPos,endPos));
			version = version.substr(endPos+1);
			endPos = version.indexOf(".");
		}else{
			val.push(version.substr(iniPos));
			iniPos = -1;
		}        
    }

    if(product != 0 && val.length == 3){
        SHEPHERD_CONFIGS += "p_pro="+product+"&";
        if(guid != ""){
            SHEPHERD_CONFIGS += "p_hid="+guid+"&";
        }
        
        SHEPHERD_CONFIGS += "p_vep="+val[0]+"&";
        SHEPHERD_CONFIGS += "p_ves="+val[1]+"&";
        SHEPHERD_CONFIGS += "p_vbd="+val[2];
    }
    var xhr = new XMLHttpRequest();
    console.log("Shepherd-> Request: "+JSON.stringify(SHEPHERD_CONFIGS))
    xhr.open("GET", SHEPHERD_CONFIGS, true);
    xhr.onreadystatechange = function() {
        var status, data;
        if (xhr.readyState === 4) {
            status = xhr.status;
            if (status === 200) {
                
                var ttl = xhr.getResponseHeader("ttl");
                data = JSON.parse(xhr.responseText);
                console.log("Shepherd-> Response: "+JSON.stringify(data)+"ttl: "+ttl)
                onSuccess && onSuccess(data,ttl);
            } else {
                onError && onError(status);
            }
        }
    };
    xhr.send();  
};

/*******************************************************************************
     *
     *  ende Query Shepherd
     * 
     ********************************************************************************/
  var USERID_UPDATE = "http://ui.ff.avast.com/v3/userid/";

  /*******************************************************************************
   *
   *  SafeShopDomainInfo
   *
   ******************************************************************************/
  AvastWRC.Query.SafeShopDomainInfo = function(options) {
      if (!options.url) return false; // no page data

      this.options = _.extend({
          server: AvastWRC.Query.CONST.SAFESHOP_DOMAININFO_SERVER,
          method: "post",
          timeout: 10000, // 10s
          client_info: {},
          url: null,
          callback: _.noop,
          format: "object", // return response in JSON
          go: true, // true = trigger the request immediately
      }, options);

      this.request = new AvastWRC.gpb.All.SafeShopOffer.DomainInfoRequest;
      this.response = new AvastWRC.gpb.All.SafeShopOffer.DomainInfoResponse;

      this.init();
  };

  AvastWRC.Query.SafeShopDomainInfo.prototype = _.extend({}, AvastWRC.Query.__MASTER__, {
      /**
       * build PROTO message
       */
      message: function() {
          //-- TODO - will be served by proxy server
          this.request.client_info = AvastWRC.Utils.getClientInfo(this.options.campaignId);
          this.request.url = this.options.url;
          return this;
      },

      /**
       * Create an instance(s) of AvastWRC.SafeShopDomainInfo object
       * @return {Object}
       */
      format: function() {
          var resp = this.response.values_;
          //console.log("response from Backend not parsed: ", JSON.stringify(resp));

          var res = {
              providerId: "",
              selector: "",
              ui_adaption_rule: "",
              category: [],
              country: ""
          };
          if (resp != undefined && typeof resp === "object" && resp != null) {
              var provSpecRes = resp.provider_specific_result;
              if (provSpecRes != undefined && typeof provSpecRes === "object" && provSpecRes != null) {
                  res.providerId = provSpecRes.provider_id;
                  res.selector = provSpecRes.scraper_script;
                  if (provSpecRes.category && provSpecRes.category.length >0){
					  var category;
					  for (var m = 0, n = provSpecRes.category.length; m < n; m++) {
						  category = provSpecRes.category[m];
						  res.category.push(category); 
					  }
				  }
                  
              }
              var adaptionRule = resp.ui_adaption_rule;
			  if (adaptionRule && adaptionRule.length >0){
                var rule;
				  for (var m = 0, n = adaptionRule.length; m < n; m++) {
					  rule = adaptionRule[m];
					  res.ui_adaption_rule.push(rule); 
				  }
			  }
              res.country = resp.country || "";
          }
          return res;
      },

  });

  /*******************************************************************************
   *
   *  SafeShopOffer
   *
   ******************************************************************************/

  AvastWRC.Query.SafeShopOffer = function(options) {
      if (!options.url && !options.query) return false; // no page data

      this.options = _.extend({
          server: AvastWRC.Query.CONST.OFFERS_SERVER,
          method: "post",
          timeout: 10000, // 10s
          url: null,
          query: null,
          client_info: {},
          provider_id: null,
          category: [],
          state: null,
          explicit_request: null,
          callback: _.noop,
          format: "object", // return response in JSON
          go: true, // true = trigger the request immediately
      }, options);

      this.request = new AvastWRC.gpb.All.SafeShopOffer.OfferRequest;
      this.response = new AvastWRC.gpb.All.SafeShopOffer.OfferResponse;

      this.init();
  };

  AvastWRC.Query.SafeShopOffer.prototype = _.extend({}, AvastWRC.Query.__MASTER__, {
      /**
       * build PROTO message
       */
      message: function() {
          //-- TODO - will be served by proxy server
          this.request.url = this.options.url;
          this.request.query = JSON.stringify(this.options.query);
          this.request.client_info = AvastWRC.Utils.getClientInfo(this.options.campaignId);
          this.request.client_info.referer = this.options.referrer;
          this.request.provider_id = this.options.providerId;
          this.request.category = this.options.category;
          this.request.state = this.options.state;
          this.request.explicit_request = this.options.explicit_request;
          return this;
      },

      /**
       * Create an instance(s) of AvastWRC.SafeShopOffer object
       * @return {Object}
       */
      format: function() {
          var resp = this.response.values_;
          //console.log("response from Backend not parsed: ", JSON.stringify(resp));
          var res = {
              products: [],
              accommodations: [],
              vouchers: [],
          };
          if (resp.product && resp.product.length > 0) {
              for (var m = 0, n = resp.product.length; m < n; m++) {
                  var product = resp.product[m].values_;
                  if (product != undefined) {
                      var prodDetails = {
                          label: product.offer.values_.title || "",
                          price: product.offer.values_.price || 0,
                          fprice: product.offer.values_.formatted_price || "",
                          url: product.offer.values_.url || "",
                          affiliate: product.offer.values_.affiliate || "",
                          recommended: product.offer.values_.recommended || 0,
                          affiliate_image: product.offer.values_.image || "",
                          availability: product.availability || "",
                          availability_code: product.availability_code || "",
                          saving: product.saving || "",
                          shipping: product.shipping || ""                          
                      };
                      res.products.push(prodDetails);
                  }
              }
          }
          if (resp.accommodation && resp.accommodation.length > 0) {
              for (var m = 0, n = resp.accommodation.length; m < n; m++) {
                  var accommodation = resp.accommodation[m].values_;
                  if (accommodation != undefined) {
                      var accomDetails = {
                          label: accommodation.offer.values_.title || "",
                          price: accommodation.offer.values_.price || 0,
                          fprice: accommodation.offer.values_.formatted_price || "",
                          url: accommodation.offer.values_.url || "",
                          affiliate: accommodation.offer.values_.affiliate || "",
                          recommended: accommodation.offer.values_.recommended || 0,
                          affiliate_image: accommodation.offer.values_.image || "",
                          priority: accommodation.priority || 0,
                          address: accommodation.address || "",
                          stars: accommodation.stars || 0,
                          additional_fees: accommodation.additional_fees || 0,
                          price_netto: accommodation.price_netto || 0,
                          starsBackgroundImg: ((accommodation.stars == 1)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                :(accommodation.stars == 2)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                :(accommodation.stars == 3)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                :(accommodation.stars == 4)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                :(accommodation.stars == 5)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                : ""),
                          starsBackgroundImgHover: ((accommodation.stars == 1)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                :(accommodation.stars == 2)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                :(accommodation.stars == 3)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                :(accommodation.stars == 4)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                :(accommodation.stars == 5)? "url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + "), url("+ AvastWRC.bs.getLocalImageURL("1star.png") + ")"
                                                : ""),
                          hotel: true,
                          saving: accommodation.saving || "",
                          type: accommodation.type || 0
                      };
                      var showABTest = (AvastWRC.CONFIG.SHOW_NEW_VERSION && AvastWRC.bal.brandingType == AvastWRC.BRANDING_TYPE_AVAST)?true:false;
                      if(showABTest){
                        accomDetails.starsBackgroundImg = accomDetails.starsBackgroundImg.replace(new RegExp('1star.png','g'),'star_normal.png');
                        accomDetails.starsBackgroundImgHover = accomDetails.starsBackgroundImgHover.replace(new RegExp('1star.png','g'),'star_hover.png');
                      }
                      res.accommodations.push(accomDetails);
                  }
              }
          }
          if (resp.voucher && resp.voucher.length > 0) {
              for (var m = 0, n = resp.voucher.length; m < n; m++) {
                  var voucher = resp.voucher[m].values_;
                  if (voucher != undefined) {
                      var vouDetails = {
                          label: voucher.title || "",
                          category: voucher.category || "",
                          url: voucher.url || "",
                          affiliate: voucher.affiliate || "",
                          value: voucher.value || "",
                          expire_date: voucher.expire_date || "",
                          coupon_code: (voucher.code)?!(voucher.code.match(/No code required/gi)) ? voucher.code : "":"",
                          coupon_text: voucher.text || "",
                          free_shipping: voucher.free_shipping || 0,
                          type: voucher.type || 0
                      };
                      res.vouchers.push(vouDetails);
                  }
              }
          }
          return res;
      },

      /**
       * url info message type
       * @return {Strinng} call
       */
      getCallerid: function() {
          return AvastWRC.CONFIG.CALLERID;
      },
  });

  AvastWRC.Query.getServerUserId = function(onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", USERID_UPDATE, true);
      xhr.onreadystatechange = function() {
          var status, data;
          if (xhr.readyState === 4) {
              status = xhr.status;
              if (status === 200) {
                  data = JSON.parse(xhr.responseText);
                  onSuccess && onSuccess(data["userid"]);
              } else {
                  onError && onError(status);
              }
          }
      };
      xhr.send();
  };
}).call(this, _, AvastWRC, AvastWRC.PROTO);