speedSliderDefaultValue = 220;
tiltAngle = 15;
driving_state = 'stopped';
canControl = true;
must_be_logged_in = 'You must be logged in to drive a robot. Please enter a valid username and password, click the "Log in" button, and try again.';
waking_state = 'other';

var _timer_start = '';

/*
 ### jQuery XML to JSON Plugin v1.1 - 2008-07-01 ###
 * http://www.fyneworks.com/ - diego@fyneworks.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 ###
 Website: http://www.fyneworks.com/jquery/xml-to-json/
*//*
 # INSPIRED BY: http://www.terracoder.com/
           AND: http://www.thomasfrank.se/xml_to_json.html
											AND: http://www.kawa.net/works/js/xml/objtree-e.html
*//*
 This simple script converts XML (document of code) into a JSON object. It is the combination of 2
 'xml to json' great parsers (see below) which allows for both 'simple' and 'extended' parsing modes.
*/
// Avoid collisions
;if(window.jQuery) (function($){
 
 // Add function to jQuery namespace
 $.extend({
  
  // converts xml documents and xml text to json object
  xml2json: function(xml, extended) {
   if(!xml) return {}; // quick fail
   
   //### PARSER LIBRARY
   // Core function
   function parseXML(node, simple){
    if(!node) return null;
    var txt = '', obj = null, att = null;
    var nt = node.nodeType, nn = jsVar(node.localName || node.nodeName);
    var nv = node.text || node.nodeValue || '';
    /*DBG*/ //if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
    if(node.childNodes){
     if(node.childNodes.length>0){
      /*DBG*/ //if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
      $.each(node.childNodes, function(n,cn){
       var cnt = cn.nodeType, cnn = jsVar(cn.localName || cn.nodeName);
       var cnv = cn.text || cn.nodeValue || '';
       /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
       if(cnt == 8){
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
        return; // ignore comment node
       }
       else if(cnt == 3 || cnt == 4 || !cnn){
        // ignore white-space in between tags
        if(cnv.match(/^\s+$/)){
         /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
         return;
        };
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
        txt += cnv.replace(/^\s+/,'').replace(/\s+$/,'');
								// make sure we ditch trailing spaces from markup
       }
       else{
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
        obj = obj || {};
        if(obj[cnn]){
         /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);
         
									// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
									if(!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
									obj[cnn] = myArr(obj[cnn]);
         
									obj[cnn][ obj[cnn].length ] = parseXML(cn, true/* simple */);
         obj[cnn].length = obj[cnn].length;
        }
        else{
         /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
         obj[cnn] = parseXML(cn);
        };
       };
      });
     };//node.childNodes.length>0
    };//node.childNodes
    if(node.attributes){
     if(node.attributes.length>0){
      /*DBG*/ //if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
      att = {}; obj = obj || {};
      $.each(node.attributes, function(a,at){
       var atn = jsVar(at.name), atv = at.value;
       att[atn] = atv;
       if(obj[atn]){
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);
        
								// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
								//if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[ atn ] ];
        obj[cnn] = myArr(obj[cnn]);
								
								obj[atn][ obj[atn].length ] = atv;
        obj[atn].length = obj[atn].length;
       }
       else{
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
        obj[atn] = atv;
       };
      });
      //obj['attributes'] = att;
     };//node.attributes.length>0
    };//node.attributes
    if(obj){
     obj = $.extend( (txt!='' ? new String(txt) : {}),/* {text:txt},*/ obj || {}/*, att || {}*/);
     txt = (obj.text) ? (typeof(obj.text)=='object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
     if(txt) obj.text = txt;
     txt = '';
    };
    var out = obj || txt;
    //console.log([extended, simple, out]);
    if(extended){
     if(txt) out = {};//new String(out);
     txt = out.text || txt || '';
     if(txt) out.text = txt;
     if(!simple) out = myArr(out);
    };
    return out;
   };// parseXML
   // Core Function End
   // Utility functions
   var jsVar = function(s){ return String(s || '').replace(/-/g,"_"); };
   
			// NEW isNum function: 01/09/2010
			// Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com, www.mygigamail.com
			function isNum(s){
				// based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
				// few bugs corrected from original function :
				// - syntax error : regexp.test(string) instead of string.test(reg)
				// - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
				// - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
				// - string is "trimmed", allowing to accept space at the beginning and end of string
				var regexp=/^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
				return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
			};
			// OLD isNum function: (for reference only)
			//var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };
																
   var myArr = function(o){
    
				// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
				//if(!o.length) o = [ o ]; o.length=o.length;
    if(!$.isArray(o)) o = [ o ]; o.length=o.length;
				
				// here is where you can attach additional functionality, such as searching and sorting...
    return o;
   };
   // Utility functions End
   //### PARSER LIBRARY END
   
   // Convert plain text to xml
   if(typeof xml=='string') xml = $.text2xml(xml);
   
   // Quick fail if not xml (or if this is a node)
   if(!xml.nodeType) return;
   if(xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;
   
   // Find xml root node
   var root = (xml.nodeType == 9) ? xml.documentElement : xml;
   
   // Convert xml to json
   var out = parseXML(root, true /* simple */);
   
   // Clean-up memory
   xml = null; root = null;
   
   // Send output
   return out;
  },
  
  // Convert text to XML DOM
  text2xml: function(str) {
   // NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
   //return $(xml)[0];
   var out;
   try{
    var xml = ($.browser.msie)?new ActiveXObject("Microsoft.XMLDOM"):new DOMParser();
    xml.async = false;
   }catch(e){ throw new Error("XML Parser could not be instantiated") };
   try{
    if($.browser.msie) out = (xml.loadXML(str))?xml:false;
    else out = xml.parseFromString(str, "text/xml");
   }catch(e){ throw new Error("Error parsing XML string") };
   return out;
  }
		
 }); // extend $

})(jQuery);

function htmlentities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function unhtmlentities(str) {
   return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g,'>');
}
function microtime (get_as_float) {
    // http://kevin.vanzonneveld.net
    // +   original by: Paulo Freitas
    // *     example 1: timeStamp = microtime(true);
    // *     results 1: timeStamp > 1000000000 && timeStamp < 2000000000
    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);

    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

var doc = document.implementation.createDocument(null, null, null);

var sequenceNumber = 1;

// function that creates the XML structure
// Very sexy solution from http://stackoverflow.com/questions/3191179/generate-xml-document-in-memory-with-javascript
function xmlIt() {
    var node = doc.createElement(arguments[0]), text, child;

    for(var i = 1; i < arguments.length; i++) {
        child = arguments[i];
        if(typeof child == 'string') {
//         	console.log(child);
            child = doc.createTextNode(child);
        } else {
//         	console.log("Can't do it with");
//         	console.log(child);
        }
        node.appendChild(child);
    }

    return node;
};

//13410994709790

   $.xmpp.connect({resource:"MyChat", jid:"boshtest@9thsense.com", password:"9thsense", url:"http://9thsense.com:5280/http-bind", 
   onDisconnect:function(){
      alert("Disconnected");
   },onConnect: function(){
        $.xmpp.setPresence(null);
        console.log("Connected");
   },
   onIq: function(iq){
       console.log(iq);
   },onMessage: function(message){
//         console.log("New message from " + message.from + ": "+$.xml2json(unhtmlentities(message.body)));
        jQuery('#response').html($.xml2json(unhtmlentities(message.body)));
   },onPresence: function(presence){
//         console.log("New presence from " + presence.from + " is "+presence.show);
   },onError: function(error){
        console.log("Error: "+error);
   }
   });
	$.xmpp.setPresence(null);
	console.log("robotAddr = " + jQuery('#robotAddr').val());


$(document).ready(function() {
// 		newDoc = 
// 					xmlIt ('m',
// 						xmlIt('t',  '0'),
// 						xmlIt('d', jQuery('#robotAddr').val()),
// 						xmlIt('dn', jQuery('#robotAddr').val()),
// 						xmlIt('r', jQuery('#robotAddr').val()),
// 						xmlIt('c', 's'),
// 						xmlIt('a', '220')
// 					);
// 		var tmp = document.createElement("div");
// 		tmp.appendChild(newDoc);
// 		//console.log(tmp.innerHTML);
// 
// 		$.xmpp.sendMessage({to:jQuery('#robotAddr').val(), resource:"a", body: htmlentities(tmp.innerHTML) },
//    function(){ return; });
	setInterval(function() {
						$.xmpp.setPresence("Online");
	}, 15000);

	$("#speed-slider").slider({
		min: 100,
		max: 250,
		step: 10,
		value: speedSliderDefaultValue
	});
	$('.clear-link').click(function() {
		$('#message').text('');
		$('.message-row').hide();
	});
	$('#set-slider-default').click(function() {
		$('#speed-slider').slider('value', speedSliderDefaultValue);
		$('.message-row').hide();
	});
	$('.commandbox').draggable();
//								<a id="powerToggle"><img alt="Put robot to sleep" id="state-image" class="sleep" src="images/sleeping.png"></a>
	$('a#power-toggle').click(function() {
		send_base_command('p');
	});
	$('.commandbox').draggable();
});

function updatePageWithJSON(data)
{
	jQuery('#latency').html(parseFloat(data.latency).toFixed(2));
	jQuery('#status').html(data.status);
	if(jQuery('#message').text().length == 0 && data.theMessage.length > 0)
	{
		jQuery('#message').html("<br />&bull; " + data.theMessage);
		$('.message-row').show();
	} else if (jQuery('#message').text().length > 0 && data.theMessage.length > 0) { // if it does have text,
		jQuery('#message').append("<br />&bull; " + data.theMessage);
		$('.message-row').show();
	}
}

function updatePageForTimeout(data)
{
	jQuery('#latency').html("Timed out");
	jQuery('#status').html("Timed out");
}


function unclick_buttons()
{
	jQuery(".control-button").removeClass('clicked');
	jQuery(".control-button").addClass('unclicked');
}

function send_base_command (cmd)
{
	if (jQuery('#robotAddr').val() == undefined)
	{
		alert (must_be_logged_in);
		return;
	}
	if (canControl == false)
	{
		return;
	}
	switch (cmd)
	{
		case 'F':
			jQuery("#button-base-forward").addClass('clicked');
			jQuery("#button-base-forward").removeClass('unclicked');
			break;
		case 'B':
			jQuery("#button-base-backward").addClass('clicked');
			jQuery("#button-base-backward").removeClass('unclicked');
			break;
		case 'L':
			jQuery("#button-base-left").addClass('clicked');
			jQuery("#button-base-left").removeClass('unclicked');
			break;
		case 'R':
			jQuery("#button-base-right").addClass('clicked');
			jQuery("#button-base-right").removeClass('unclicked');
			break;
		case 'x':
			jQuery("#button-base-stop").addClass('clicked');
			jQuery("#button-base-stop").removeClass('unclicked');
			unclick_buttons();
			break;
		case 'p':
				//var childImage = $(this).children('img');
				var childImage = $('#state-image');
				if (childImage.hasClass('sleep'))
				{
					waking_state = 'sleep';
					childImage.attr('src', 'images/awake.png').removeClass('sleep').removeClass('spinning').addClass('wake');
				} else if (childImage.hasClass('wake')) {
					childImage.attr('src', 'images/sleeping.png').removeClass('wake').removeClass('spinning').addClass('sleep');
					waking_state = 'wake';
				} else {
					waking_state = 'other';
				}
				console.log('After waking state is set, it is ' + waking_state);
// 				childImage.attr('src', 'images/spinning.gif').removeClass('sleep').removeClass('wake').addClass('spinning');
// 					if (waking_state == 'sleep')
// 					{
// 						childImage.attr('src', 'images/sleeping.png').removeClass('sleep').removeClass('spinning').addClass('wake');
// 					} else if (waking_state == 'wake') {
// 						childImage.attr('src', 'images/awake.png').removeClass('sleep').removeClass('spinning').addClass('wake');
// 					} else {
// 						childImage.attr('src', 'images/frozen.png').removeClass('sleep').removeClass('spinning').addClass('other');
// 					}
				unclick_buttons();
			break;
		default: 
			unclick_buttons();
			break;
	}
// 	console.log('driving_state is ' + driving_state);	
	if (cmd == 's' || cmd == 'x')
	{
		window.driving_state = 'stopped';
		unclick_buttons();
	}
	if (window.driving_state == 'driving' && (cmd != 's' || cmd != 'x' || cmd != 'p'))
	{
		//console.log ('driving_state = ' + driving_state + ' and cmd = ' + cmd);
		console.log ('ignoring');
		return;
	}
	if (cmd != 's' && cmd != 'x' && cmd != 'p') 
	{
		window.driving_state = 'driving';
	} else {
		window.driving_state = 'stopped';
	}
// 	console.log('driving_state is ' + driving_state);	

		if (sequenceNumber == 1)
		{
					newDoc = 
								xmlIt ('m',
									xmlIt('t',  String(sequenceNumber++)),
									xmlIt('d', jQuery('#robotAddr').val()),
									xmlIt('dn', jQuery('#robotAddr').val()),
									xmlIt('r', jQuery('#robotAddr').val()),
									xmlIt('c', 's'),
									xmlIt('a', '1')
			// 						xmlIt('co', ' ')
								);
					var tmp = document.createElement("div");
					tmp.appendChild(newDoc);
					//console.log(tmp.innerHTML);
			
					$.xmpp.sendMessage({to:jQuery('#robotAddr').val(), resource:"a", body: htmlentities(tmp.innerHTML) },
				 																			function(){ return; });
// 					$.post('c2dm-controller.php?robotAddr=' + jQuery('#robotAddr').val() + '&speed=1&cmd=s' + '&seq=' + sequenceNumber, function(data) {
// 						return;
// 					});
					newDoc = 
								xmlIt ('m',
									xmlIt('t',  String(sequenceNumber++)),
									xmlIt('d', jQuery('#robotAddr').val()),
									xmlIt('dn', jQuery('#robotAddr').val()),
									xmlIt('r', jQuery('#robotAddr').val()),
									xmlIt('c', 'p'),
									xmlIt('a', '1')
			// 						xmlIt('co', ' ')
								);
					var tmp = document.createElement("div");
					tmp.appendChild(newDoc);
					//console.log(tmp.innerHTML);
			
					$.xmpp.sendMessage({to:jQuery('#robotAddr').val(), resource:"a", body: htmlentities(tmp.innerHTML) },
				 																			function(){ return; });
					$.post('c2dm-controller.php?robotAddr=' + jQuery('#robotAddr').val() + '&speed=1&cmd=p' + '&seq=' + sequenceNumber, function(data) {
						return;
					});
		}			
		if (cmd != 'p')
		{
			speed =  String(jQuery('#speed-slider').slider('value'));
		} else {
			if (waking_state == 'wake')
			{
				speed =  '1';
			} else {
				speed =  '0';
			}
		}
		
		newDoc = 
					xmlIt ('m',
						xmlIt('t',  String(sequenceNumber++)),
						xmlIt('d', jQuery('#robotAddr').val()),
						xmlIt('dn', jQuery('#robotAddr').val()),
						xmlIt('r', jQuery('#robotAddr').val()),
						xmlIt('c', cmd),
						xmlIt('a', speed)
// 						xmlIt('co', ' ')
					);
		var tmp = document.createElement("div");
		tmp.appendChild(newDoc);
		//console.log(tmp.innerHTML);

		$.xmpp.sendMessage({to:jQuery('#robotAddr').val(), resource:"a", body: htmlentities(tmp.innerHTML) },
   																			function(){ return; });
		$.post('c2dm-controller.php?robotAddr=' + jQuery('#robotAddr').val() + '&speed=' + jQuery('#speed-slider').slider('value') + '&cmd=' + cmd + '&seq=' + sequenceNumber, function(data) {
			return;
		});
   																			
}

function send_pantilt_command (cmd)
{
	if (jQuery('#robotAddr').val() == '')
	{
		alert (must_be_logged_in);
		return;
	}
	if (canControl == false)
	{
		return;
	}
	switch (cmd)
	{
		case 'u':
			jQuery("#button-pantilt-up").addClass('clicked');
			jQuery("#button-pantilt-up").removeClass('unclicked');
			break;
		case 'n':
			jQuery("#button-pantilt-down").addClass('clicked');
			jQuery("#button-pantilt-down").removeClass('unclicked');
			break;
		case 'l':
			jQuery("#button-pantilt-left").addClass('clicked');
			jQuery("#button-pantilt-left").removeClass('unclicked');
			break;
		case 'r':
			jQuery("#button-pantilt-right").addClass('clicked');
			jQuery("#button-pantilt-right").removeClass('unclicked');
			break;
		case 'j':
			jQuery("#button-pantilt-center").addClass('clicked');
			jQuery("#button-pantilt-center").removeClass('unclicked');
			unclick_buttons();
			break;
		default: 
			unclick_buttons();
			break;
	}
		if (sequenceNumber == 1)
		{
					newDoc = 
								xmlIt ('m',
									xmlIt('t',  String(sequenceNumber++)),
									xmlIt('d', jQuery('#robotAddr').val()),
									xmlIt('dn', jQuery('#robotAddr').val()),
									xmlIt('r', jQuery('#robotAddr').val()),
									xmlIt('c', 's'),
									xmlIt('a', '1')
			// 						xmlIt('co', ' ')
								);
					var tmp = document.createElement("div");
					tmp.appendChild(newDoc);
					//console.log(tmp.innerHTML);
			
					$.xmpp.sendMessage({to:jQuery('#robotAddr').val(), resource:"a", body: htmlentities(tmp.innerHTML) },
				 																			function(){ return; });
// 					$.post('c2dm-controller.php?robotAddr=' + jQuery('#robotAddr').val() + '&speed=1&cmd=s' + '&seq=' + sequenceNumber, function(data) {
// 						return;
// 					});
					newDoc = 
								xmlIt ('m',
									xmlIt('t',  String(sequenceNumber++)),
									xmlIt('d', jQuery('#robotAddr').val()),
									xmlIt('dn', jQuery('#robotAddr').val()),
									xmlIt('r', jQuery('#robotAddr').val()),
									xmlIt('c', 'p'),
									xmlIt('a', '1')
			// 						xmlIt('co', ' ')
								);
					var tmp = document.createElement("div");
					tmp.appendChild(newDoc);
					//console.log(tmp.innerHTML);
			
					$.xmpp.sendMessage({to:jQuery('#robotAddr').val(), resource:"a", body: htmlentities(tmp.innerHTML) },
				 																			function(){ return; });
					$.post('c2dm-controller.php?robotAddr=' + jQuery('#robotAddr').val() + '&speed=1&cmd=p' + '&seq=' + sequenceNumber, function(data) {
						return;
					});
		}			
		newDoc = 
					xmlIt ('m',
						xmlIt('t', String(sequenceNumber++)),
						xmlIt('d', jQuery('#robotAddr').val()),
						xmlIt('dn', jQuery('#robotAddr').val()),
						xmlIt('r', jQuery('#robotAddr').val()),
						xmlIt('c', cmd),
						xmlIt('a', String(tiltAngle))
// 						xmlIt('co', ' ')
					);
		var tmp = document.createElement("div");
		tmp.appendChild(newDoc);
		//console.log(tmp.innerHTML);

		$.xmpp.sendMessage({to:jQuery('#robotAddr').val(), resource:"a", body: htmlentities(tmp.innerHTML) },
   function(){ return; });
		$.post('c2dm-controller.php?robotAddr=' + jQuery('#robotAddr').val() + '&speed=' + String(tiltAngle) + '&cmd=' + cmd + '&seq=' + sequenceNumber, function(data) {
			return;
		});
}

function pantilt_up()
{
	send_pantilt_command('u');
}

function pantilt_down()
{
	send_pantilt_command('n');
}

function pantilt_left()
{
	send_pantilt_command('l');
}

function pantilt_right()
{
	send_pantilt_command('r');
}

function pantilt_center()
{
	send_pantilt_command('j');
}


function base_forward()
{
	send_base_command('F');
}

function base_backward()
{
	send_base_command('B');
}

function base_left()
{
	send_base_command('L');
}

function base_right()
{
	send_base_command('R');
}

function base_stop()
{
	send_base_command('x');
}

function keyboard_clear_shortcuts()
{
	shortcut.remove("w");
	shortcut.remove("a");
	shortcut.remove("s");
	shortcut.remove("d");
	shortcut.remove("x");
	shortcut.remove("W");
	shortcut.remove("A");
	shortcut.remove("S");
	shortcut.remove("D");
	shortcut.remove("X");
	shortcut.remove("i");
	shortcut.remove("j");
	shortcut.remove("k");
	shortcut.remove("l");
	shortcut.remove("m");
	shortcut.remove("I");
	shortcut.remove("J");
	shortcut.remove("K");
	shortcut.remove("L");
	shortcut.remove("M");
	shortcut.remove("Up");
	shortcut.remove("Down");
	shortcut.remove("Right");
	shortcut.remove("Left");
	shortcut.remove("Space");
}

function keyboard_on_keydown_stop_on_keyup()
{	
	keyboard_clear_shortcuts();
	
	// pan/tilt is still done in increments, so currently no need to differentiate between
	// key down and key up
	shortcut.add("w",function() {
		pantilt_up();
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("a",function() {
		pantilt_left();
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("s",function() {
		pantilt_down();
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("d",function() {
		pantilt_right();
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("x",function() {
		pantilt_center();
// 	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
// 	shortcut.add("W",function() {
// 		pantilt_up();
// 	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
// 	shortcut.add("A",function() {
// 		pantilt_left();
// 	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
// 	shortcut.add("S",function() {
// 		pantilt_down();
// 	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
// 	shortcut.add("D",function() {
// 		pantilt_right();
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("X",function() {
		pantilt_center();
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	
	// For driving, key down initiates movement, so tie these to a keydown event

	shortcut.add("i",function() {
		send_base_command('F');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("k",function() {
		send_base_command('B');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("l",function() {
		send_base_command('R');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("j",function() {
		send_base_command('L');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("I",function() {
		send_base_command('F');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("K",function() {
		send_base_command('B');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("L",function() {
		send_base_command('R');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("J",function() {
		send_base_command('L');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});


	shortcut.add("Up",function() {
		send_base_command('F');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("Down",function() {
		send_base_command('B');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("Right",function() {
		send_base_command('R');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("Left",function() {
		send_base_command('L');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("Space",function() {
		send_base_command('x');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("m",function() {
		send_base_command('x');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});
	shortcut.add("M",function() {
		send_base_command('x');
	}, { 'type': 'keydown', 'propagate': false, 'disable_in_input': true});

	shortcut.add("i",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("k",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("l",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("j",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("I",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("K",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("L",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("J",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	// In this form of driving, releasing the key stops the robot
	shortcut.add("Up",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("Down",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("Right",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
	shortcut.add("Left",function() {
		send_base_command('x');
	}, { 'type': 'keyup', 'propagate': false, 'disable_in_input': true});
}


	jQuery(document).ready(function() {
	
		// add hover styles
		$('.header-settings').hover(function() {
			$(this).addClass('hover-background');
		}, function () {
			$(this).removeClass('hover-background');
		});
		
		$( "#dialog-form" ).dialog({
			autoOpen: false,
			height: 390,
			width: 400,
			modal: true,
			close: function() {
				canControl = true;
				jQuery('#invitation-result').html('');
			}
		});
		$("#invite-form").submit(function(event){
			event.preventDefault();		
			$.get( '/telo-control?action=invite-driver&email=' + jQuery('#invite-email').val() + '&robot=' + jQuery('#robotAddr').val(),
				function( data ) {
					$("#invitation-result").empty().append( data );
				}
			);
		});
		$( "#settings-open" ).click (function(){
			canControl = false;
			$( "#dialog-form" ).dialog( "open" );
		});
		// initialize with driving on keydown and stopping on keyup
		keyboard_on_keydown_stop_on_keyup(); 

		$("#qConnect").click(function() {
			send_base_command('c');
		});		
		$("#button-pantilt-right").click(function() {
			pantilt_right();
		});		
		$("#button-pantilt-left").click(function() {
			pantilt_left();
		});
		$("#button-pantilt-down").click(function() {
			pantilt_down();
		});
		$("#button-pantilt-up").click(function() {
			pantilt_up();
		});
		$("#button-pantilt-center").click(function() {
			pantilt_center();
		});

		$("#button-base-right").click(function() {
			base_right();
		});
		$("#button-base-left").click(function() {
			base_left();
		});
		$("#button-base-forward").click(function() {
			base_forward();
		});
		$("#button-base-backward").click(function() {
			base_backward();
		});
		$("#button-base-stop").click(function() {
			base_stop();
		});
	 });