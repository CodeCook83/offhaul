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

  // add indenting and icons to tri state checkbox tree
  var padding = 0;
  var ancestor = $('#selectFolder > .mbRoot');
  addPaddingToMailboxTree(ancestor, padding);

}) // document.ready

// Add left indenting to sub mailboxes
function addPaddingToMailboxTree(ancestor, padding) {
  var child = ancestor.children('.collapse');
  if (child.length == 1) {
    var descendants = child.children('.mbRoot').children().not('.collapse').find('a');
    padding += 15;
    descendants.css('padding-left', padding);
    descendants.parents('.mbRoot').each(function () {
      
      addPaddingToMailboxTree($(this), padding);
    })
  }
}

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
  var data = $('.oldProvider').find('select, input').serialize();
  $.get('/migration/testconnection', data, function (data) {
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
    $(this).prop('disabled', true);
  }).fail(function (xhr, status, error) {
    console.log(xhr);
    console.log(status);
    console.log(error);
  });
})

// Btn: test the connection (NEW provider)
$('.connTestNewProvider').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  var data = $('.newProvider').find('select, input').serialize();
  $.get('/migration/testconnection', data, function (data) {
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
    $(this).prop('disabled', true);
  }).fail(function (xhr, status, error) {
    console.log(xhr);
    console.log(status);
    console.log(error);
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