
var online = false;
var xterm = null;

var connected = false;

var shellid = null;
var requestid = null;

var gadgetid = null;
var cols = null;
var rows = null;

var keys = false;

function socketOnline ()
{
  wylioio.message ('login', 'befe9f8a14346e3e52c762f333395796');
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
   if (shellid)
   {
    wylioio.message ('size', {width:cols, height:rows});
   }
}

function setStatusGadget (status, text, log)
{
  var exonline = online;
  if (status == 'success')
  {
    online = true;
  }
  else
  {
    online = false;
  }
  console.log ('statusgadget');
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
