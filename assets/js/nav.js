(function () {
  function bindMenuToggle() {
    var menuToggle = document.getElementById("menu-toggle");
    var mobileNav = document.getElementById("mobile-nav");

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener("click", function () {
      var isHidden = mobileNav.classList.contains("hidden");
      if (isHidden) {
        mobileNav.classList.remove("hidden");
      } else {
        mobileNav.classList.add("hidden");
      }
      menuToggle.setAttribute("aria-expanded", String(isHidden));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindMenuToggle);
  } else {
    bindMenuToggle();
  }
})();
