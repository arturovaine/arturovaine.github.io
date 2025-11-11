// Select Theme (toggle light/dark)

const onClickChangeTheme = () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeImg = document.querySelector(".theme-toggle-img");

  const iconGithub = document.getElementById("icon-github");
  const iconTwitter = document.getElementById("icon-twitter");
  const iconLinkedin = document.getElementById("icon-linkedin");
  const iconYoutube = document.getElementById("icon-youtube");

  const iconScrollTop = document.getElementById("scrollToTop");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      themeImg.src = "./assets/icons/themeToggle-dark.svg";

      iconGithub.src = "./assets/icons/github-dark.svg";
      iconTwitter.src = "./assets/icons/twitter-dark.svg";
      iconLinkedin.src = "./assets/icons/linkedin-dark.svg";
      iconYoutube.src = "./assets/icons/youtube-dark.svg";

      iconScrollTop.src = "./assets/icons/arrow-up_dark-mode.svg";
    } else {
      themeImg.src = "./assets/icons/themeToggle.svg";

      iconGithub.src = "./assets/icons/github.svg";
      iconTwitter.src = "./assets/icons/twitter.svg";
      iconLinkedin.src = "./assets/icons/linkedin.svg";
      iconYoutube.src = "./assets/icons/youtube.svg";

      iconScrollTop.src = "./assets/icons/arrow-up_light-mode.svg";
    }
  });
};

onClickChangeTheme();

// Select tab

const onClickSwitchTab = () => {
  const tabs = document.querySelectorAll(".tab");

  const portfolioSection = document.getElementById("portfolio");
  const profileSection = document.getElementById("profile");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.textContent.trim() === "Profile") {
        profileSection.style.display = "";
        portfolioSection.style.display = "none";
      } else {
        profileSection.style.display = "none";
        portfolioSection.style.display = "";
      }
    });
  });
};

onClickSwitchTab();

// Scroll to top

const scrollToTopBtn = document.getElementById("btnScrollToTop");

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
