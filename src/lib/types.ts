export type CodeLanguage = 'csharp' | 'python' | 'typescript' | 'go' | 'rust' | 'java';

export const CODE_LANGUAGES: { value: CodeLanguage; label: string; ext: string; fileName: string }[] = [
  { value: 'csharp', label: 'C#', ext: '.cs', fileName: 'CV.cs' },
  { value: 'python', label: 'Python', ext: '.py', fileName: 'cv.py' },
  { value: 'typescript', label: 'TypeScript', ext: '.ts', fileName: 'cv.ts' },
  { value: 'go', label: 'Go', ext: '.go', fileName: 'cv.go' },
  { value: 'rust', label: 'Rust', ext: '.rs', fileName: 'cv.rs' },
  { value: 'java', label: 'Java', ext: '.java', fileName: 'CV.java' },
];

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  age: number | null;
}

export interface Skills {
  platforms: string[];
  programmingLanguages: string[];
  software: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | null;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
}

export interface SpokenLanguage {
  name: string;
  level: string;
}

export interface MediaLink {
  platform: string;
  url: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  skills: Skills;
  education: Education[];
  experience: Experience[];
  languages: SpokenLanguage[];
  personality: string[];
  media: MediaLink[];
  photo: string | null;
  codeLanguage: CodeLanguage;
}
