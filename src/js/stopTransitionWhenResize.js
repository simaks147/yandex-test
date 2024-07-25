let timer = 0;

window.addEventListener('resize', () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  } else {
    document.body.classList.add('js-stop-transitions');
  }

  timer = setTimeout(() => {
    document.body.classList.remove('js-stop-transitions');
    timer = null;
  }, 100);
});
