
window.onload = function () {
  const h_box = document.querySelector('.h');
  const m_box = document.querySelector('.m');
  const s_box = document.querySelector('.s');
  const h_arr = document.querySelectorAll('.h div');
  const m_arr = document.querySelectorAll('.m div');
  const s_arr = document.querySelectorAll('.s div');

  for (var i = 0; i < 24; i++) {
    var v = 360 - 360 / 24 * (i);
    h_arr[i].style.transform = `rotate(${v}deg)`;
  }

  for (var i = 0; i < 60; i++) {
    var v = 360 - 360 / 60 * i;
    m_arr[i].style.transform = `rotate(${v}deg)`;
    s_arr[i].style.transform = `rotate(${v}deg)`;
  }

  setInterval(function () {
    var time = new Date();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    h_box.style.transform = `rotate(${360 / 24 * h}deg)`;
    m_box.style.transform = `rotate(${360 / 60 * m}deg)`;
    s_box.style.transform = `rotate(${360 / 60 * s}deg)`;
  }, 1000)
}