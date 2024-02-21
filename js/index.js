$(document).ready(function () {
    let url = window.location.href;
    $(".nav-link").removeClass("active");
  
    $(".nav-link a").each(function () {
      if (this.href === url) {
        $(this).closest(".nav-link").addClass("active");
      }
    });
    
  });