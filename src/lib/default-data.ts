import { CVData } from './types';

export const defaultCVData: CVData = {
  personal: {
    firstName: 'Alex',
    lastName: 'Chen',
    title: 'Full Stack Developer',
    email: 'alex.chen@dev.io',
    phone: '+1 555 0142',
    location: 'San Francisco, CA',
    age: 28,
  },
  summary:
    'Passionate full-stack developer with 6 years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Open source contributor and tech community speaker.',
  skills: {
    platforms: ['Linux', 'macOS', 'Docker', 'AWS', 'Vercel'],
    programmingLanguages: ['TypeScript', 'Python', 'Rust', 'Go', 'SQL'],
    software: ['VS Code', 'Figma', 'PostgreSQL', 'Redis', 'Git'],
  },
  education: [
    {
      id: '1',
      school: 'Stanford University',
      degree: 'Master',
      field: 'Computer Science',
      startYear: 2018,
      endYear: 2020,
      description: 'Focus on distributed systems and machine learning.',
    },
    {
      id: '2',
      school: 'UC Berkeley',
      degree: 'Bachelor',
      field: 'Software Engineering',
      startYear: 2014,
      endYear: 2018,
      description: 'Graduated with honors. Led the university hackathon team.',
    },
  ],
  experience: [
    {
      id: '1',
      company: 'Vercel',
      role: 'Senior Frontend Engineer',
      startDate: '03/2022',
      endDate: null,
      description:
        'Building the next generation of web deployment tools. Leading a team of 5 engineers working on the dashboard and CLI.',
      technologies: ['Next.js', 'TypeScript', 'React', 'Turborepo'],
    },
    {
      id: '2',
      company: 'Stripe',
      role: 'Software Engineer',
      startDate: '06/2020',
      endDate: '02/2022',
      description:
        'Developed payment processing APIs handling millions of transactions daily. Improved API response times by 40%.',
      technologies: ['Ruby', 'Go', 'PostgreSQL', 'gRPC'],
    },
  ],
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Mandarin', level: 'Fluent' },
    { name: 'Spanish', level: 'Intermediate' },
  ],
  personality: ['Problem Solver', 'Team Player', 'Detail Oriented', 'Creative', 'Curious'],
  media: [
    { platform: 'GitHub', url: 'github.com/alexchen' },
    { platform: 'LinkedIn', url: 'linkedin.com/in/alexchen' },
    { platform: 'Portfolio', url: 'alexchen.dev' },
  ],
  photo: null,
  codeLanguage: 'csharp',
};

export const emptyCVData: CVData = {
  personal: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    age: null,
  },
  summary: '',
  skills: {
    platforms: [],
    programmingLanguages: [],
    software: [],
  },
  education: [],
  experience: [],
  languages: [],
  personality: [],
  media: [],
  photo: null,
  codeLanguage: 'typescript',
};
