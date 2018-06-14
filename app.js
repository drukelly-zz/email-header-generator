// disable form on submit
$('form').submit(false);

// disable callToAction click
$('#callToAction').click(false);

// populate design options
const request = new XMLHttpRequest();
request.open('GET', 'creatives.json', true);
request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // success!
    let data = JSON.parse(request.responseText);
    $('input[name=bannerText]').val(data.bannerText);
    $('#bannerText').text(data.bannerText);
    data.creatives.forEach(function(item, option) {
      $('#designOptions').append('<li class="tc dib mr2"><img alt="" data-option="' + item.label + '" src="images/btn-' + item.label + '.png" class="ba bw2 b--black-10 br2 h3 w3 dib"></li>');
    });
  }
};
request.onerror = function() {
  // there was a connection error of some sort
};
request.send();

// click handler for the selected design option
$('#designOptions').on('click', 'li', function() {
  $('li.active').removeClass('active');
  $(this).addClass('active');

  // determine color option per design
  const designColorOption = $(this).find('img').data('option');
  $('#colorOptions').empty().append('<option disabled>Please Select One</option>');
  $('#colorOptions option:first').attr('selected', 'selected');

  // remove hide class to show dropdown
  $('#colorVariant, #colorOptions').removeClass('hide');

  // reset preview window and background
  $('#previewWindow').attr('class', '');
  $('#previewWindow').addClass(designColorOption);
  $('.background').attr('class', 'background');

  // filter color options
  const colorOptions = new XMLHttpRequest();
  colorOptions.open('GET', 'creatives.json', true);
  colorOptions.onload = function() {
    if (colorOptions.status >= 200 && colorOptions.status < 400) {
      let data = JSON.parse(colorOptions.responseText);
      data.creatives.forEach(function(item) {
        if (item.label === designColorOption) {
          item.options.forEach(function(value, key) {
            let niceValue = value.replace('-', ' ');
            niceValue = titleCase(niceValue);
            $('#colorOptions').append(`<option value="${value}">${niceValue}</option>`);
          });
        }
      });
    }
  };
  colorOptions.onerror = function() { };
  colorOptions.send();
});

// change background from color variant selection
$('select').change(function() {
  $('.background').attr('class', 'background');
  $('#bannerText').attr('class', '');
  $('#bannerText, .background').addClass($(this).val());
});

// onload, trigger click
$(function(){
  $('#designOptions li:first-child').trigger('click');
});

// handlers for text change for copy and call-to-action
const copyInput = $('input[name="bannerText"]');
const copy = $('#bannerText');
$(copyInput).on('keyup blur change', function() {
  copy.text(copyInput.val());
});

// generate download links
$('#emailHeaderDownload').on('mouseover', function(e) {
  html2canvas($('#previewWindowContainer')[0]).then(canvas => {
    const image = canvas.toDataURL('image/png').replace('image/png','application/octet-stream');
    $('#emailHeaderDownload').attr('href', image);
    $('#emailHeaderDownload').attr('download', 'emailHeader-' + moment().format('X') + '.png');
  });
});

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}