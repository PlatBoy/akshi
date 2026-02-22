const skills = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'Responsive Design',
  'Accessibility',
  'Git & GitHub',
  'Performance Optimization',
];

const skillsList = document.getElementById('skillsList');
const year = document.getElementById('year');
const themeToggle = document.getElementById('themeToggle');

skills.forEach((skill) => {
  const li = document.createElement('li');
  li.textContent = skill;
  skillsList.appendChild(li);
});

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
});
