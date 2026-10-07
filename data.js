const STORAGE_KEYS = {
  users: 'skillExchangeUsers',
  currentUser: 'skillExchangeCurrentUser',
  requests: 'skillExchangeRequests',
  connections: 'skillExchangeConnections',
  selectedProfile: 'skillExchangeSelectedProfile',
  session: 'skillExchangeSessionMeta'
};

const defaultUsers = [
  {
    id: 'keerthana',
    name: 'Keerthana',
    title: 'Frontend Developer & Learner',
    bio: 'I enjoy building polished interfaces and learning from experienced developers through practical sessions.',
    location: 'Chennai, India',
    education: 'B.Tech in Computer Science',
    experience: 'Intermediate',
    availability: 'Available',
    rating: 4.9,
    skills: ['Python', 'HTML', 'CSS', 'JavaScript'],
    skillsToLearn: ['React', 'Java', 'Cloud Computing'],
    certifications: [
      {
        name: 'JavaScript Fundamentals',
        issuer: 'Coursera',
        year: '2025',
        credentialId: 'JSF-2025-001',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'Portfolio Website',
        description: 'A portfolio site built with HTML, CSS, and JavaScript to showcase my work.',
        technologies: 'HTML | CSS | JavaScript',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'Frontend Workshop', type: 'Workshop', year: '2024' },
      { title: 'Hackathon Finalist', type: 'Hackathon', year: '2025' }
    ],
    experienceHistory: [
      {
        role: 'Frontend Intern',
        company: 'Pixel Labs',
        duration: '2025 – 2026',
        summary: 'Created responsive UI components and improved user experience on marketing pages.'
      }
    ],
    reviews: [
      { name: 'Aditi', text: 'Helpful guidance and a friendly approach to learning.', rating: 5 },
      { name: 'Rohit', text: 'Clear explanations and good practical examples.', rating: 5 }
    ],
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'arun-kumar',
    name: 'Arun Kumar',
    title: 'Python Developer | Machine Learning Enthusiast',
    bio: 'Passionate about helping beginners understand Python and machine learning through practical projects.',
    location: 'Bengaluru, India',
    education: 'M.Sc. in Data Science',
    experience: 'Intermediate',
    availability: 'Available',
    rating: 4.8,
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Science', 'Pandas', 'NumPy'],
    skillsToLearn: ['React', 'UI/UX'],
    certifications: [
      {
        name: 'Python Programming Certification',
        issuer: 'Google',
        year: '2025',
        credentialId: 'CERT-PY-2025-001',
        image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Machine Learning Certification',
        issuer: 'Coursera',
        year: '2024',
        credentialId: 'CERT-ML-2024-110',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'AI Student Assistant',
        description: 'An AI-based assistant designed to help students manage academic tasks.',
        technologies: 'Python | Flask | Machine Learning',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        github: '#'
      },
      {
        name: 'Student Performance Prediction',
        description: 'Model that predicts academic performance using historical student data.',
        technologies: 'Python | Pandas | Scikit-learn',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'AI Hackathon Winner', type: 'Hackathon', year: '2024' },
      { title: 'Data Science Workshop Facilitator', type: 'Workshop', year: '2023' }
    ],
    experienceHistory: [
      {
        role: 'Machine Learning Intern',
        company: 'ABC Technologies',
        duration: '2025 – 2026',
        summary: 'Worked on data preprocessing and machine learning model development.'
      },
      {
        role: 'College Research Project',
        company: 'NIT Bangalore',
        duration: '2024',
        summary: 'Built student performance prediction pipeline and evaluation dashboard.'
      }
    ],
    reviews: [
      { name: 'Priya', text: 'Arun explained Python concepts very clearly and patiently. The practical examples were really useful.', rating: 5 },
      { name: 'Aman', text: 'He helped me understand ML basics using a hands-on style that made learning easy.', rating: 5 },
      { name: 'Neha', text: 'Excellent mentor for Python and model-building fundamentals.', rating: 4 }
    ],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    title: 'Java Backend Developer',
    bio: 'I enjoy guiding learners through backend principles, clean design, and practical Java projects.',
    location: 'Delhi, India',
    education: 'B.E. in Computer Science',
    experience: 'Advanced',
    availability: 'Busy',
    rating: 4.7,
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST API'],
    skillsToLearn: ['Python'],
    certifications: [
      {
        name: 'Java Spring Boot Developer',
        issuer: 'Microsoft',
        year: '2024',
        credentialId: 'JBS-2024-024',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'Online Banking System',
        description: 'Secure transaction and account management system built for digital banking workflows.',
        technologies: 'Java | Spring Boot | MySQL',
        image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'Spring Boot Bootcamp', type: 'Workshop', year: '2024' },
      { title: 'Java Coding Challenge', type: 'Competition', year: '2023' }
    ],
    experienceHistory: [
      {
        role: 'Backend Developer',
        company: 'Zenith Systems',
        duration: '2024 – 2026',
        summary: 'Developed backend services for finance and operations platforms.'
      }
    ],
    reviews: [
      { name: 'Mohan', text: 'Very structured teaching approach and practical backend guidance.', rating: 5 },
      { name: 'Sara', text: 'Helped me understand REST APIs and Spring concepts from scratch.', rating: 4 }
    ],
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'rahul-verma',
    name: 'Rahul Verma',
    title: 'UI/UX Designer | Frontend Storyteller',
    bio: 'I create user-centered interfaces and help others design better digital experiences.',
    location: 'Jaipur, India',
    education: 'B.Des. in Interaction Design',
    experience: 'Advanced',
    availability: 'Available',
    rating: 4.9,
    skills: ['UI/UX', 'Figma', 'Frontend Development', 'Design Systems'],
    skillsToLearn: ['JavaScript'],
    certifications: [
      {
        name: 'UX Design Certification',
        issuer: 'Google',
        year: '2025',
        credentialId: 'UX-2025-101',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'Food Delivery UI',
        description: 'Design and prototype for a mobile-first food ordering experience.',
        technologies: 'Figma | Adobe XD | Design Research',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
        github: '#'
      },
      {
        name: 'Student Portal UI',
        description: 'Single-page dashboard concept for students to manage classes and tasks.',
        technologies: 'Figma | Prototyping | UI Kit',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'Product Design Award', type: 'Award', year: '2024' },
      { title: 'Design Workshop Lead', type: 'Workshop', year: '2023' }
    ],
    experienceHistory: [
      {
        role: 'Product Designer',
        company: 'Spark Studio',
        duration: '2023 – 2026',
        summary: 'Designed user flows and delivered design systems for digital products.'
      }
    ],
    reviews: [
      { name: 'Meera', text: 'Really helpful in understanding UI decision-making and user empathy.' , rating: 5 },
      { name: 'Karan', text: 'His design feedback was practical and easy to apply.', rating: 5 }
    ],
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'keerthi-nair',
    name: 'Keerthi Nair',
    title: 'JavaScript Frontend Engineer',
    bio: 'Helping others build better web experiences through interactive frontend learning and code reviews.',
    location: 'Kochi, India',
    education: 'B.Tech in Information Technology',
    experience: 'Intermediate',
    availability: 'Available',
    rating: 4.8,
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Responsive Design'],
    skillsToLearn: ['Python', 'UX Research'],
    certifications: [
      {
        name: 'Advanced JavaScript',
        issuer: 'Udemy',
        year: '2025',
        credentialId: 'JS-ADV-2025-045',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'E-commerce Website',
        description: 'A responsive storefront with dynamic product sections and cart features.',
        technologies: 'JavaScript | React | CSS',
        image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
        github: '#'
      },
      {
        name: 'Portfolio Website',
        description: 'Creative portfolio designed for personal branding and case studies.',
        technologies: 'HTML | CSS | JavaScript',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'Frontend Build Contest', type: 'Competition', year: '2024' },
      { title: 'CSS Masterclass', type: 'Workshop', year: '2024' }
    ],
    experienceHistory: [
      {
        role: 'Frontend Developer',
        company: 'Bright Horizon',
        duration: '2024 – 2026',
        summary: 'Developed interactive landing pages and reusable UI components.'
      }
    ],
    reviews: [
      { name: 'Nisha', text: 'Her explanations of frontend logic made coding much easier to follow.', rating: 5 },
      { name: 'Dev', text: 'Clear guidance and great UI insights for real projects.', rating: 4 }
    ],
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'vishal-singh',
    name: 'Vishal Singh',
    title: 'C++ Developer | DSA Mentor',
    bio: 'I guide students through problem solving, algorithms, and strong coding foundations.',
    location: 'Lucknow, India',
    education: 'B.Tech in Computer Science',
    experience: 'Advanced',
    availability: 'Available',
    rating: 4.7,
    skills: ['C++', 'Data Structures', 'Algorithms', 'Problem Solving'],
    skillsToLearn: ['Java'],
    certifications: [
      {
        name: 'C++ Programming Essentials',
        issuer: 'Microsoft',
        year: '2025',
        credentialId: 'CPP-2025-056',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'Campus Placement Prep',
        description: 'A structured platform for DSA practice and coding roadmap planning.',
        technologies: 'C++ | Data Structures | Algorithms',
        image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'Code Marathon Winner', type: 'Competition', year: '2024' },
      { title: 'Algorithm Workshop Mentor', type: 'Workshop', year: '2023' }
    ],
    experienceHistory: [
      {
        role: 'DSA Mentor',
        company: 'CodeNest',
        duration: '2024 – 2026',
        summary: 'Mentored students for coding interviews and algorithmic problem solving.'
      }
    ],
    reviews: [
      { name: 'Ritika', text: 'Very clear explanations and great focus on logic building.', rating: 5 },
      { name: 'Manav', text: 'Helped me improve my problem-solving approach quickly.', rating: 4 }
    ],
    photo: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'aisha-khan',
    name: 'Aisha Khan',
    title: 'Data Scientist | AI Mentor',
    bio: 'I love simplifying machine learning and data science for beginners through meaningful projects.',
    location: 'Hyderabad, India',
    education: 'M.Tech in AI',
    experience: 'Advanced',
    availability: 'Available',
    rating: 4.9,
    skills: ['Machine Learning', 'Data Science', 'Python', 'TensorFlow'],
    skillsToLearn: ['Cloud Computing'],
    certifications: [
      {
        name: 'Certified Data Scientist',
        issuer: 'IBM',
        year: '2025',
        credentialId: 'DS-2025-010',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'Sales Forecast Engine',
        description: 'Machine learning pipeline for forecasting trends and product demand.',
        technologies: 'Python | TensorFlow | SQL',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'AI Research Challenge', type: 'Competition', year: '2024' },
      { title: 'ML Bootcamp Trainer', type: 'Workshop', year: '2025' }
    ],
    experienceHistory: [
      {
        role: 'Data Scientist',
        company: 'DataForge Labs',
        duration: '2024 – 2026',
        summary: 'Built forecasting models and created analysis workflows for business teams.'
      }
    ],
    reviews: [
      { name: 'Jinal', text: 'She made complex ML concepts easy to understand with live examples.', rating: 5 },
      { name: 'Shubham', text: 'Very patient and practical in explaining models and datasets.', rating: 5 }
    ],
    photo: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'nandini-r',
    name: 'Nandini R',
    title: 'Cloud Engineer | DevOps Mentor',
    bio: 'I help students understand cloud architecture, deployment, and hands-on DevOps workflows.',
    location: 'Pune, India',
    education: 'B.E. in Computer Engineering',
    experience: 'Intermediate',
    availability: 'Busy',
    rating: 4.6,
    skills: ['Cloud Computing', 'AWS', 'DevOps', 'Docker'],
    skillsToLearn: ['UI/UX'],
    certifications: [
      {
        name: 'AWS Cloud Practitioner',
        issuer: 'AWS',
        year: '2025',
        credentialId: 'AWS-CP-2025-210',
        image: 'https://images.unsplash.com/photo-1558494949cc5c9de3e33f6d5e64f8f6a?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'Deployment Automation',
        description: 'CI/CD setup for application deployment with monitoring and rollback strategies.',
        technologies: 'AWS | Docker | GitHub Actions',
        image: 'https://images.unsplash.com/photo-1558494949cc5c9de3e33f6d5e64f8f6a?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'Cloud Webinar Host', type: 'Event', year: '2024' },
      { title: 'Infrastructure Workshop', type: 'Workshop', year: '2023' }
    ],
    experienceHistory: [
      {
        role: 'Cloud Engineer',
        company: 'Nimbus Cloud',
        duration: '2024 – 2026',
        summary: 'Managed cloud infrastructure deployments and monitored application health.'
      }
    ],
    reviews: [
      { name: 'Aditya', text: 'Very helpful in understanding cloud architecture and deployment basics.', rating: 5 },
      { name: 'Sonal', text: 'Good mentor for learning AWS and docker workflows in a simple way.', rating: 4 }
    ],
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'karthik-rao',
    name: 'Karthik Rao',
    title: 'Java Mentor | Full Stack Learner',
    bio: 'I love helping beginners become confident with Java, web fundamentals, and product thinking.',
    location: 'Mysuru, India',
    education: 'B.E. in Information Science',
    experience: 'Intermediate',
    availability: 'Available',
    rating: 4.7,
    skills: ['Java', 'JavaScript', 'SQL', 'Web Development'],
    skillsToLearn: ['Python'],
    certifications: [
      {
        name: 'Java Programming Certification',
        issuer: 'Oracle',
        year: '2024',
        credentialId: 'JAVA-2024-210',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
      }
    ],
    projects: [
      {
        name: 'Student Portal',
        description: 'A web portal to manage academic records and student communication.',
        technologies: 'Java | JavaScript | SQL',
        image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
        github: '#'
      }
    ],
    achievements: [
      { title: 'Java Bootcamp Mentor', type: 'Workshop', year: '2024' },
      { title: 'Student Learning Champion', type: 'Award', year: '2025' }
    ],
    experienceHistory: [
      {
        role: 'Full Stack Intern',
        company: 'CodeWorks',
        duration: '2025 – 2026',
        summary: 'Worked on student dashboards and backend integrations for academic software.'
      }
    ],
    reviews: [
      { name: 'Harini', text: 'Java concepts felt much easier to understand after speaking with him.', rating: 5 },
      { name: 'Bhavana', text: 'A patient mentor with good project-based teaching style.', rating: 4 }
    ],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
  }
];

function initializeStorage() {
  const storage = window.localStorage;

  if (!storage.getItem(STORAGE_KEYS.users)) {
    storage.setItem(STORAGE_KEYS.users, JSON.stringify(defaultUsers));
  }

  if (!storage.getItem(STORAGE_KEYS.currentUser)) {
    storage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(defaultUsers[0]));
  }

  if (!storage.getItem(STORAGE_KEYS.requests)) {
    storage.setItem(
      STORAGE_KEYS.requests,
      JSON.stringify([
        {
          id: 'demo-req-1',
          fromUserId: 'arun-kumar',
          toUserId: 'keerthana',
          skill: 'Python',
          status: 'pending',
          message: 'Hi Keerthana, I can help you with Python basics and ML projects.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo-req-2',
          fromUserId: 'keerthana',
          toUserId: 'priya-sharma',
          skill: 'Java',
          status: 'accepted',
          message: 'I want to learn Java backend concepts from you.',
          createdAt: new Date().toISOString()
        }
      ])
    );
  }

  if (!storage.getItem(STORAGE_KEYS.connections)) {
    storage.setItem(STORAGE_KEYS.connections, JSON.stringify([]));
  }

  if (!storage.getItem(STORAGE_KEYS.session)) {
    storage.setItem(STORAGE_KEYS.session, JSON.stringify({ skill: 'Python', mentorId: 'arun-kumar' }));
  }
}

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    if (!value) {
      return fallback;
    }
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readStorage(STORAGE_KEYS.users, defaultUsers);
}

function saveUsers(users) {
  writeStorage(STORAGE_KEYS.users, users);
}

function getCurrentUser() {
  return readStorage(STORAGE_KEYS.currentUser, defaultUsers[0]);
}

function setCurrentUser(user) {
  writeStorage(STORAGE_KEYS.currentUser, user);
}

function getRequests() {
  return readStorage(STORAGE_KEYS.requests, []);
}

function saveRequests(requests) {
  writeStorage(STORAGE_KEYS.requests, requests);
}

function getConnections() {
  return readStorage(STORAGE_KEYS.connections, []);
}

function saveConnections(connections) {
  writeStorage(STORAGE_KEYS.connections, connections);
}

function findUserById(userId) {
  return getUsers().find((user) => user.id === userId) || null;
}

const skillExchangeData = {
  defaultUsers,
  initializeStorage,
  getUsers,
  saveUsers,
  getCurrentUser,
  setCurrentUser,
  getRequests,
  saveRequests,
  getConnections,
  saveConnections,
  findUserById,
  STORAGE_KEYS
};

window.skillExchangeData = skillExchangeData;

initializeStorage();
