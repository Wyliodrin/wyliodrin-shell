
var online = false;
var xterm = null;

var connected = false;

var shellid = false;
var requestid = null;

var gadgetid = null;
var cols = null;
var rows = null;

var keys = false;

var GADGET_NAME = '';

function getParameter(id) 
{
  id = id.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + id + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function socketOnline ()
{
  shellid = true;
  wylioio.message ('login', {password: getParameter ('password'), width:cols , height:rows});
  if (!keys)
  {
    wylioio.on ('keys', function (data)
    {
      console.log (data);
      if (xterm) xterm.write (data);
    });
    keys = true;
  }
}

function userOnline ()
{
  
}

function userOffline ()
{
  
}

function socketOffline ()
{
  // shellid = null;
  // requestid = null;
  shellid = false;
}

function xtermKeys (str)
{
  // console.log (str);
  wylioio.message ('keys', str);
}

function loadXterm (parent)
{
  cols = Math.floor(($(window).width ()-10)/10);
  rows = Math.floor(($(window).height()-90)/16);
  xterm = new Terminal ({
    cols: cols,
    rows: rows,
    useStyle: true,
    screenKeys: true
  });
  xterm.on ('data', xtermKeys);
  xterm.on ('title', function (title)
  {
    $("shelltitle").text = (GADGET_NAME+' '+title);
  });
  // xterm = new Terminal (Math.floor($(parent).width ()/6), Math.floor($(parent).height()/20), xtermKeys);

  xterm.open (parent);
}

function setSizes() 
{
   cols = Math.floor(($(window).width ()-10)/10);
  rows = Math.floor(($(window).height()-90)/16);
   xterm.resize (cols, rows);
    wylioio.message ('size', {width:cols, height:rows});
}

$(document).ready(function () {   

  $('#paste').on ('click', function ()
  {
    if (xterm) xterm.emit('request paste');
  });

  $(window).resize (function ()
  {
    setSizes ();
  });

    loadXterm ($('#shell')[0]);

    gadgetid = 'gadgetid';

    // loadDashboard ();
    // loadProjectPane ();
    // loadFolders ();
    // loadGadgets ();

    // registerWidget (LineWidget);

    // refreshWidgets ();

    // addWidget (LineWidget);

    startSocket ();

          

   });

   window.onbeforeunload = function() {
      if (shellid)
      {
        return "Are you sure you want to close the shell?";
      }
      else
      {
        return null;
      }
    };

    $(window).unload (function ()
    {
      close ();
    });
