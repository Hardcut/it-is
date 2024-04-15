document.addEventListener("DOMContentLoaded", function() {

  $('.form__block .btn-submit').each(function() {
    $(this).click(function(event) {
      event.preventDefault();
      if ($(this).parents('.form__block').find('.form__reminder')) {
        $(this).parents('.form__block').find('.form__content').addClass('hidden');
        $(this).parents('.form__block').find('.form__reminder').addClass('visible');
      }
    })
  });
  
});