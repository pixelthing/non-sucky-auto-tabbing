$.fn.autoTab = function() {
  
  autoTabOn = true; // yes, it's global. If you turn off auto tabbing on one input, you turn it off for all
  var autoTabbedInputs = this.find('input');
  var almostTabbedInputs = autoTabbedInputs.not(':last-child'); // note we don't attach tabbing event to the last of an input group. If you tab out of there, you have a reason to
  var justAutoTabbed = false;
  var tabKeyDetected = false;
  var revTabKeyDetected = false;
  var inputField = false;
  
  // init
  var init = function() {
    detectKeyDown();
    detectKeyUp();
  }
  
  // tab key detection, hijack it if it's in the fields we're looking for
  var detectKeyDown = function() {
    autoTabbedInputs.on('keydown',function(ev){
      // the field that you're in when you keydown might not be the field you're in when you keyup
      inputField = this;
      // detect keystroke in the fields (but not shift-tab)
      ev = ev || event;
      var charCode = null;
      if ("which" in ev) // NN4 & FF & Opera
        charCode = ev.which;
      else if ("keyCode" in e) // Safari & IE4+
        charCode = ev.keyCode;
      else if ("keyCode" in window.event) // IE4+
        charCode = window.event.keyCode;
      else if ("which" in window.event) // Other browsers support events
        charCode = window.event.which;
      // if tabbing forward
      if (charCode === 9 && !ev.shiftKey) {
        // if auto tabbing is off, bug out now
        if (!autoTabOn) {
          return;
        }
        if (justAutoTabbed) {
          ev.preventDefault();
          notifyAutoTabbingOff();
          autoTabOn = false;
          if ($('#autotab-toggle').length > 0) { // only used if toggle is present
            $('#autotab-toggle').removeClass('on');
          }
        }
        tabKeyDetected = true;
      // if tabbing backward
      } else if (charCode === 9 && ev.shiftKey) {
        revTabKeyDetected = true;
      // backspace key fakes reverse tab
      } else if (charCode === 8 && this.value.length == 0) {
        revTabKeyDetected = true;
        $(this).prev("input,select,textarea,a").focus();
      // fake tab keystrokes
      } else if (
        charCode === 191                  // "/" - for dates
        ||
        charCode === 111                  // "/" - for dates (numberpad)
        ||
        charCode === 190                  // "." - for IP addresses
        ||
        charCode === 110                  // "." - for IP addresses (numberpad)
        ||
        charCode === 189                  // "-" - for sortcodes
        ||
        charCode === 109                  // "-" - for sortcodes (numberpad)
      ) {
        ev.preventDefault();
        if (!hasHitMaxChars(this) && !justAutoTabbed) {
          $(this).next("input,select,textarea,a").focus();
        }
      }
      // removed any flag to say we've just auto-tabbed
      justAutoTabbed = false;
    });
  }
  
  // entering text into tabbed fields
  var detectKeyUp = function() {
    almostTabbedInputs.on('keyup',function(ev){
      // if auto tabbing is off, bug out now
      if (!autoTabOn) {
        return;
      }
      // if this keydown was a tab key, ignore this event (and reset it for the next keyup)
      if (tabKeyDetected) {
        tabKeyDetected = false;
        return;
      }
      // if we're tabbing backwards, don't jump forwards again!
      if (revTabKeyDetected) {
        revTabKeyDetected = false;
        return;
      }
      // edge case: if you've tabbed from one input group to another, the inputField that was used in keyDown hasn't yet been set
      if (!inputField) {
        return;
      }
      // removed flag to say we've just auto-tabbed
      justAutoTabbed = false;
      // else auto-tab if the field is full
      if (hasHitMaxChars(inputField)) {
        $(inputField).next().focus();
        // we've just auto-tabbed - flag it
        justAutoTabbed = true;
      }
    })
  }
  
  // detect if a field has hit max chars
  var hasHitMaxChars = function(el) {
    var elObj = $(el);
    var maxFieldLength = elObj.attr('maxlength') || elObj.attr('size');
    var valueLength = el.value.length;
    if (valueLength>=maxFieldLength) {
      return true;
    }
    return false;
  }
  
  // notify user that autotabbing is off (a popover that fades after 8secs)
  var notifyAutoTabbingOff = function() {
    // already a popover? bug out now.
    if ($('.popover').hasClass('on')) {
      return;
    }
    // last input
    var lastInput = autoTabbedInputs.last();
    // position/size of last input
    var popY = lastInput.offset().top 
      + (
        lastInput.height() 
        + parseInt(lastInput.css('border-width'))
        + parseInt(lastInput.css('padding-top'))
        + parseInt(lastInput.css('padding-bottom'))
      )/2
      - 20;
    var popX = lastInput.offset().left 
      + lastInput.width() 
      + parseInt(lastInput.css('border-width'))
      + parseInt(lastInput.css('padding-left'))
      + parseInt(lastInput.css('padding-right'))
      + 15;
    // create the pop-over (opacity 0 by default)
    $('body').append('<div class="popover" style="top:' + popY + 'px;left:' + popX + 'px">It looks like you prefer the tab key! We\'ve turned auto-tabbing off for you.</div>');
    // fade up, wait, remove pop-over
    setTimeout(function(){
      $('.popover').addClass('on')
      setTimeout(function(){
        removePopOver();
      },8000);
    },0);
    // remove pop-over on click
    $('body').on('click','.popover',function(){
      removePopOver();
    })
  }
  // remove pop-over function
  var removePopOver = function(){
    $('.popover').removeClass('on')
    setTimeout(function(){
      $('.popover').remove;
    },500);
  }
  
  // init function!
  init();
  
}

// go!
$('#example1').autoTab();
$('#example2').autoTab();
$('#example3').autoTab();
$('#example4').autoTab();

// enable toggle
var toggle = $('#autotab-toggle');
toggle.click(function(ev){
  ev.preventDefault();
  if (toggle.hasClass('on')) {
    autoTabOn = false;
    $('#autotab-toggle').removeClass('on');
  } else {
    autoTabOn = true;
    $('#autotab-toggle').addClass('on');
  }
})