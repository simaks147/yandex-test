export default function scroll(link, section) {
  document.getElementById(link).addEventListener('click', () => {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
