$( document ).ready(function() {
      $('body').on('click', 'button.sidebar_trigger', function expandSidebarView() {
      var spanIcon = $('.sidebar_trigger').children('span.icon');
      var principal = $('.principal');
      var sidebar = $('.sidebar');
      var expanded = (sidebar.attr("aria-expanded") === "true");
      if (!expanded) {
         spanIcon.removeClass("icon icon-menu").addClass("icon icon-back");
         principal.attr("aria-expanded", "false");
         sidebar.attr("aria-expanded", "true");
      }else {
         spanIcon.removeClass("icon icon-back").addClass("icon icon-menu");
         principal.attr("aria-expanded", "true");
         sidebar.attr("aria-expanded", "false");
      }
   });
});
