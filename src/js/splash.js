setTimeout(splash, 2000);

function splash() {
  if (!!localStorage.getItem('Token')) {
    location.href = "home.html";
  }
}