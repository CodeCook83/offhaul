// for toggling the background-color on listProvider
var lastClickedProvider;

// bool for enable/disable the next step
var connTestOldProvider = false;
var connTestNewProvider = false;

$(document).ready(() => {

  $('.customOldProvider').css('display', 'none');
  $('.customNewProvider').css('display', 'none');
  $('.formAuthOld').css('display', 'none');
  $('.formAuthNew').css('display', 'none');
  $('#formProvider :input').not('#openForEditBtn').prop('disabled', true);

  // Add left indenting to sub mailboxes
  $('#selectFolder').find('a').each(function () {
    var depth = $(this).parents('.mbRoot').length;

    if ($(this).closest('.mbRoot').children('.collapse').length > 0) {
      $(this).prepend('<i id="treeIcon" class="far fa-folder fa-lg"></i>&nbsp;');
      $(this).prepend('<i id="treeExpand" class="far fa-plus-square"></i>&nbsp;&nbsp;');
      
    } else {
      $(this).prepend('<i id="treeIcon" class="far fa-folder-open fa-lg"></i>&nbsp;');
    }
    var padding = 0;
    for (i = 0; i < depth; i++) {
      $(this).css('padding-left', padding);
      padding += 20;
    }

  })

}) // document.ready

$('#selectFolder').find('a').click(function (e) {
  e.preventDefault();
  if ($(this).closest('.mbRoot').children('.collapse').length > 0) {
    $(this).find('#treeExpand').toggleClass('fa-plus-square fa-minus-square');
    $(this).find('#treeIcon').toggleClass('fa-folder-open fa-folder');
    
  } else {
  }
})

// Confirm profile delete btn 
$('#deleteProfileSubmitBtn').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  $('#formDelete').submit();
});

// Show the correct form by selecting the OLD provider
$('.selectOldProvider').on('change', function (e) {
  e.preventDefault();
  e.stopPropagation();
  switch ($(this).val()) {
    case 'custom':
      $('.customOldProvider').fadeIn('show');
      $('.formAuthOld').fadeIn('show');
      break;
    case '...':
      $('.customOldProvider').fadeOut('show');
      $('.formAuthOld').fadeOut('show');
      break;
    default:
      $('.customOldProvider').fadeOut('show');
      $('.formAuthOld').fadeIn('show');
      break;
  }
})

// Show the correct form by selecting the NEW provider
$('.selectNewProvider').on('change', function (e) {
  e.preventDefault();
  e.stopPropagation();
  switch ($(this).val()) {
    case 'custom':
      $('.customNewProvider').fadeIn('show');
      $('.formAuthNew').fadeIn('show');
      break;
    case '...':
      $('.customNewProvider').fadeOut('show');
      $('.formAuthNew').fadeOut('show');
      break;
    default:
      $('.customNewProvider').fadeOut('show');
      $('.formAuthNew').fadeIn('show');
      break;
  }
})

// Btn: test the connection (OLD provider)
$('.connTestOldProvider').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  $('.spinner-connection-old').show();
  $('.connTestOldProvider').prop('disabled', 'true');
  var data = $('.oldProvider').find('select, input').serialize();
  $.get('/migration/testconnection', data, function (data) {
    switch (data) {
      case 'Connection Ok':
        $('.connTestOldProvider').removeClass('btn-warning').
        addClass('btn-success').prop('disabled', true).text(" " + data).prepend("<i class='fas fa-check'></i>");
        if (connTestOldProvider == false) {
          connTestOldProvider = true;
          if (connTestNewProvider == true) {
            // $('.secondStep').prop('disabled', false);
          }
        }
        $('.emailOld').prop('disabled', true);
        $('.passwordOld').prop('disabled', true);
        $('.selectOldProvider').prop('disabled', true);
        break;
      case 'Username or password are incorrect':
        setBtnChangesAndAlert('old', data);
        break;
      case 'Server timed out. Check your email address':
        setBtnChangesAndAlert('old', data);
        break;
      case 'Server settings are incorrect':
        setBtnChangesAndAlert('old', data);
        break;
    }
  }).fail(function (jqXHR) {
    console.log(jqXHR);
  });
})

// Btn: test the connection (NEW provider)
$('.connTestNewProvider').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  $('.spinner-connection-new').show();
  $('.connTestNewProvider').prop('disabled', 'true');
  var data = $('.newProvider').find('select, input').serialize();
  $.get('/migration/testconnection', data, function (data) {
    switch (data) {
      case 'Connection Ok':
        $('.connTestNewProvider').removeClass('btn-warning').
        addClass('btn-success').prop('disabled', true).text(" " + data).prepend("<i class='fas fa-check'></i>");
        if (connTestNewProvider == false) {
          connTestNewProvider = true;
          if (connTestOldProvider == true) {
            // $('.secondStep').prop('disabled', false);
          }
        }
        $('.emailNew').prop('disabled', true);
        $('.passwordNew').prop('disabled', true);
        $('.selectNewProvider').prop('disabled', true);
        break;
      case 'Username or password are incorrect':
        setBtnChangesAndAlert('new', data);
        break;
      case 'Server timed out. Check your email address':
        setBtnChangesAndAlert('new', data);
        break;
      case 'Server settings are incorrect':
        setBtnChangesAndAlert('new', data);
        break;
    }
  }).fail(function (jqXHR) {
    console.log(jqXHR);
  });
})

// Selector for the mail protocol
$('.selectProtocol').change(function (e) {
  e.preventDefault();
  e.stopPropagation();
  if (this.value == 'imap') {
    $('form').submit();
  }
})

// Select all Mailboxes
$('#selectAll').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  $('#selectFolder').find('input[type="checkbox"]').prop({
    indeterminate: false,
    checked: true
  });
});

// Deselect all Mailboxes
$('#unselectAll').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  $('#selectFolder').find('input[type="checkbox"]').prop({
    indeterminate: false,
    checked: false
  });
});

// Open and reset the provider form by clicking "Open for edit"
$('#openForEditBtn').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  $('#formProvider :input').not('#createdAt, #updatedAt, input[name=owner]').prop('disabled', false);
})

// Card Add (plus) btn: Open and reset the provider form
$('.addProviderCardBtn').on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  clearProviderForm();
  $('#formProvider :input').not('#createdAt, #updatedAt, input[name=owner]').prop('disabled', false);
})
// Ajax: Load a clicked provider into the provider form
$('#listProvider > a').on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  disableProviderForm();
  if (lastClickedProvider) {
    lastClickedProvider.css('background-color', '');
  }
  $(this).css('background-color', '#e1f5fe');
  lastClickedProvider = $(this);
  var url = this.pathname;

  $.ajax({
    type: "GET",
    url: url
  }).done(function (data) {
    var result = $.parseJSON(data);
    $(this).addClass('card-delete');
    $('#formProvider input[name="id"]').val(result.id);
    $('#formProvider input[name="providername"]').val(result.providername);
    $('#formProvider input[name="owner"]').val(result.owner);
    $('#formProvider input[name="incoming"]').val(result.incoming);
    $('#formProvider input[name="incomingPort"]').val(result.incomingPort);
    $('#formProvider input[name="outgoing"]').val(result.outgoing);
    $('#formProvider input[name="outgoingPort"]').val(result.outgoingPort);
    if (result.testAccounts.length > 0) {
      $('#formProvider input[name="email"]').val(result.testAccounts[0].email);
      $('#formProvider input[name="password"]').val(result.testAccounts[0].password);
    } else {
      $('#formProvider input[name="email"]').val('');
      $('#formProvider input[name="password"]').val('');
    }
    $('#formProvider input[name="createdAt"]').val(result.createdAtMomentjs);
    $('#formProvider input[name="updatedAt"]').val(result.updatedAtMomentjs);
    $('#formProvider input[name="haveContacts"]').prop('checked', result.haveContacts == true ? true : false);
    $('#formProvider input[name="haveCalender"]').prop('checked', result.haveCalender == true ? true : false);
    $('#formProvider input[name="tested"]').prop('checked', result.tested == true ? true : false);
  });
})

// Basic validation the provider form
function checkProviderInputs() {
  if (!$('#formProvider input[name="providername"]').val().trim() == '' ||
    !$('#formProvider input[name="incoming"]').val().trim() == '' ||
    !$('#formProvider input[name="incomingPort"]').val().trim() == '' ||
    !$('#formProvider input[name="outgoing"]').val().trim() == '' ||
    !$('#formProvider input[name="outgoingPort"]').val().trim() == '') {
    return true;
  } else {
    return false;
  }
}

// Method: Clear the provider form by changing/clicking 
function clearProviderForm() {
  $('#formProvider input[name="id"]').val('');
  $('#formProvider input[name="providername"]').val('');
  $('#formProvider input[name="owner"]').val('');
  $('#formProvider input[name="incoming"]').val('');
  $('#formProvider input[name="incomingPort"]').val('');
  $('#formProvider input[name="outgoing"]').val('');
  $('#formProvider input[name="outgoingPort"]').val('');
  $('#formProvider input[name="email"]').val('');
  $('#formProvider input[name="password"]').val('');
  $('#formProvider input[name="createdAt"]').val('');
  $('#formProvider input[name="updatedAt"]').val('');
  $('#formProvider input[name="haveContacts"]').prop('checked', false);
  $('#formProvider input[name="haveCalender"]').prop('checked', false);
  $('#formProvider input[name="tested"]').prop('checked', false);
}

function disableProviderForm() {
  $('#formProvider input, #deleteProviderBtn, #addOrUpdateProviderBtn').not('#createdAt, #updatedAt, input[name=owner]').prop('disabled', true);
}

// Init tri state checkbox tree
$('#selectFolder').on('change', 'input[type="checkbox"]', function (e) {
  e.preventDefault();
  e.stopPropagation();
  var checked = $(this).prop("checked");
  var container = $(this).parents('.mbRoot:first');
  var siblings = container.siblings();

  container.find('input[type="checkbox"]').prop({
    indeterminate: false,
    checked: checked
  });
  checkSiblings(container);

  function checkSiblings(element) {
    var parent1 = element.parent();
    var parent = parent1.parent();
    var all = true;
    var test1 = element.siblings();
    test1.each(function () {
      var child1 = $(this);
      var child2 = child1.find('input[type="checkbox"]');
      var child3 = child2.prop("checked");
      var childtest = child3 === checked;
      return all = ($(this).find('input[type="checkbox"]').prop("checked") === checked);
    });
    if (all && checked) {
      parent.find('input[type="checkbox"]').prop({
        indeterminate: false,
        checked: checked
      });
      checkSiblings(parent)
    } else if (all && !checked) {
      parent.find('input[type="checkbox"]').prop("checked", checked);
      parent.find('input[type="checkbox"]').prop("indeterminate", (parent.find(
        'input[type="checkbox"]:checked').length > 0));
      checkSiblings(parent);
    } else {
      element.parents('div.mbRoot').children('.list-group-item').find('input[type="checkbox"]').prop({
        indeterminate: true,
        checked: false
      });
    }
  }
});

// Ajax: Delete a provider from the provider list
$('#deleteProviderBtn').on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  var idToDelete = $('#formProvider input[name="id"]').val();

  if (checkProviderInputs()) {
    $.ajax({
      type: "DELETE",
      url: `/provider/${idToDelete}`
    }).done(function (data) {
      disableProviderForm();
      clearProviderForm();
      $('#listProvider a[href="/provider/' + idToDelete + '"]').remove();
    });
  }
})

// test connection: show alert notification
function setBtnChangesAndAlert(btn, data) {
  var myBtn = btn;
  var firstChar = myBtn.substring(0, 1);
  firstChar = firstChar.toUpperCase();
  var tail = myBtn.substring(1);
  myBtn = firstChar + tail;
  $('.spinner-connection-' + btn).hide();
  $('.connTest' + myBtn + 'Provider').prop('disabled', false);
  $('.alert-connection-' + btn).text(data);
  $('.alert-connection-' + btn).show().delay(3000).fadeOut();
}