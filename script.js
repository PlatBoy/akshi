const defaultSkills = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'Responsive Design',
  'Accessibility',
  'Git & GitHub',
  'Performance Optimization',
];

const defaultProjects = [
  {
    title: 'Finance Dashboard',
    description: 'Analytics interface with reusable chart widgets and dark/light mode support.',
    tags: 'HTML • CSS • JavaScript',
  },
  {
    title: 'Restaurant Landing Page',
    description: 'High-conversion landing page with smooth scrolling and responsive menu layout.',
    tags: 'Responsive Design • UI/UX',
  },
  {
    title: 'Task Planner App',
    description: 'Productivity app with drag-and-drop task organization and local storage persistence.',
    tags: 'JavaScript • LocalStorage',
  },
];

let currentSkills = [...defaultSkills];
let currentProjects = [...defaultProjects];

const skillsList = document.getElementById('skillsList');
const projectsGrid = document.getElementById('projectsGrid');
const year = document.getElementById('year');
const themeToggle = document.getElementById('themeToggle');
const linkedinFiles = document.getElementById('linkedinFiles');
const importStatus = document.getElementById('importStatus');

function renderSkills(skills) {
  skillsList.innerHTML = '';
  skills.forEach((skill) => {
    const li = document.createElement('li');
    li.textContent = skill;
    skillsList.appendChild(li);
  });
}

function renderProjects(projects) {
  projectsGrid.innerHTML = '';
  projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <span>${project.tags}</span>
    `;
    projectsGrid.appendChild(card);
  });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value.trim());
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      row.push(value.trim());
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.trim());
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

function mapRows(headers, rows) {
  return rows.map((cells) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header.toLowerCase()] = cells[index] || '';
    });
    return item;
  });
}

function parseSkillsCsv(fileName, text) {
  if (!fileName.toLowerCase().includes('skills')) {
    return [];
  }

  const csv = parseCsv(text);
  if (csv.length < 2) {
    return [];
  }

  const headers = csv[0].map((h) => h.toLowerCase());
  const nameIndex = headers.findIndex((h) => h.includes('name') || h.includes('skill'));
  if (nameIndex === -1) {
    return [];
  }

  return csv
    .slice(1)
    .map((row) => row[nameIndex])
    .filter(Boolean);
}

function parsePositionsCsv(fileName, text) {
  if (!fileName.toLowerCase().includes('position')) {
    return [];
  }

  const csv = parseCsv(text);
  if (csv.length < 2) {
    return [];
  }

  const headers = csv[0];
  const records = mapRows(headers, csv.slice(1));

  return records.slice(0, 6).map((record) => {
    const title = record['title'] || record['position'] || 'Professional Experience';
    const company = record['company name'] || record['company'] || 'Company';
    const description = record['description'] || 'Experience imported from LinkedIn export.';

    return {
      title,
      description,
      tags: company,
    };
  });
}

async function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsText(file);
  });
}

async function importLinkedInFiles(files) {
  const importedSkills = [];
  const importedProjects = [];

  for (const file of files) {
    const text = await readFileText(file);
    importedSkills.push(...parseSkillsCsv(file.name, text));
    importedProjects.push(...parsePositionsCsv(file.name, text));
  }

  if (importedSkills.length > 0) {
    currentSkills = [...new Set(importedSkills)];
    renderSkills(currentSkills);
  }

  if (importedProjects.length > 0) {
    currentProjects = importedProjects;
    renderProjects(currentProjects);
  }

  if (importedSkills.length === 0 && importedProjects.length === 0) {
    importStatus.textContent = 'No matching LinkedIn CSV content found. Please upload Skills.csv and/or Positions.csv.';
    return;
  }

  importStatus.textContent = `Imported ${importedSkills.length} skills and ${importedProjects.length} experience entries from LinkedIn export.`;
}

renderSkills(currentSkills);
renderProjects(currentProjects);
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

linkedinFiles.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) {
    return;
  }

  importStatus.textContent = 'Importing LinkedIn files...';

  try {
    await importLinkedInFiles(files);
  } catch (error) {
    importStatus.textContent = 'Import failed. Please try exporting LinkedIn data again and re-upload the CSV files.';
  }
});
