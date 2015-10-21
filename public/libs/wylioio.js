
"use strict";

var wylioio = null;

var request = 0;

var statusRequest = null;

var exit = false;

function setStatus (status, text, log)
{
  console.log ('status '+status);
  var exonline = online;
  if (status == 'success')
  {
    online = true;
  }
  else
  {
    online = false;
  }
  var s = $("#statusgadget")[0];
  if (s)
  {
    s.innerHTML = text;
    s.className = 'label label-'+status+' label-status2';
    if (log) console.log ('status: '+log);
  }
  if (status == 'success' && !exonline) return true;
  else return false;
}

function jsonRequestGet (url, done)
{
  $.ajax ({
    url: url,
    type: 'get',
    success: function (data, status, jqXHR)
    {
      done (null, data);
    },
    error: function (jqXHR, status, err)
    {
      if (!err) err = new Error ();
      done (err);
    }
  });
}

function sendMessage (communication_token, boardid, label, message)
{
  jsonRequest ("/message", {
    communication_token: communication_token,
    gadgetid: boardid,
    label: label,
    message: message
  }, function (err, result)
  {
    if (err) console.log (err);
  });
}

function jsonRequest (url, data, done)
{
  $.ajax ({
    url: url,
    data: JSON.stringify (data),
    type: 'post',
    dataType: 'json',
    contentType: 'application/json; charset=UTF-8',
    success: function (data, status, jqXHR)
    {
      done (null, data);
    },
    error: function (jqXHR, status, err)
    {
      if (!err) err = new Error ();
      done (err);
    }
  });
}

function startStatusRequest ()
{

}

function stopStatusRequest ()
{
  clearInterval (statusRequest);
  statusRequest = null;
}

function startSocket ()
{
  console.log (window.location.origin);
  wylioio = io.connect (window.location.origin, {'connect timeout': 1000});

  wylioio.message = function (tag, object)
  {
    wylioio.emit (tag, object);
  }

  function connectUser ()
  {
    
  }

  wylioio.on ('connect', function ()
  {
    setStatus ('success', 'Online', 'connect');
    socketOnline ();
  });

  wylioio.on ('reconnect', function ()
  {
    startStatusRequest ();
    setStatus ('info', 'Connected', 'reconnect');
  });

  wylioio.on ('connecting', function ()
  {
    stopStatusRequest ();
    setStatus ('warning', 'Connecting', 'connecting');
  });

  wylioio.on ('reconnecting', function ()
  {
    stopStatusRequest ();
    setStatus ('warning', 'Connecting', 'reconnecting');
  });

  wylioio.on ('disconnect', function ()
  {
    stopStatusRequest ();
    setStatus ('important', 'Offline', 'disconnect');
    socketOffline ();
  });

  wylioio.on ('connect_failed', function ()
  {
    stopStatusRequest ();
    setStatus ('important', 'Offline', 'connect_failed');
  });

  wylioio.on ('reconnect_failed', function ()
  {
    stopStatusRequest ();
    setStatus ('important', 'Offline', 'reconnect_failed');
  });

  wylioio.on ('error', function ()
  {
    stopStatusRequest ();
    setStatus ('important', 'Offline', 'error');
    socketOffline ();
  });
}

$(document).ready(function(){     
    
})

$(window).bind('resizeEnd', function() {
     // setProfileImageSize();
});

$(window).resize(function() {
        if(this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            $(this).trigger('resizeEnd');
        }, 500);
});
