$( document ).ready(function() {
   $('body').on("click", 'div.toolbar > menu > li', function() {
      $('div.toolbar > menu > li').removeClass('activeTab');
      $(this).addClass("activeTab");
      revealPage(this.getAttribute("aria-controls"));
   });
});

