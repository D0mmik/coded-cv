'use client';

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CVData, CodeLanguage, PersonalInfo, Skills, Education, Experience, SpokenLanguage, MediaLink } from './types';
import { defaultCVData } from './default-data';

type CVAction =
  | { type: 'SET_PERSONAL'; payload: Partial<PersonalInfo> }
  | { type: 'SET_SUMMARY'; payload: string }
  | { type: 'SET_SKILLS'; payload: Partial<Skills> }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string } & Partial<Education> }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string } & Partial<Experience> }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'SET_LANGUAGES'; payload: SpokenLanguage[] }
  | { type: 'SET_PERSONALITY'; payload: string[] }
  | { type: 'SET_MEDIA'; payload: MediaLink[] }
  | { type: 'SET_PHOTO'; payload: string | null }
  | { type: 'SET_CODE_LANGUAGE'; payload: CodeLanguage }
  | { type: 'LOAD_DATA'; payload: CVData };

function cvReducer(state: CVData, action: CVAction): CVData {
  switch (action.type) {
    case 'SET_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'SET_SKILLS':
      return { ...state, skills: { ...state.skills, ...action.payload } };
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };
    case 'REMOVE_EDUCATION':
      return { ...state, education: state.education.filter((e) => e.id !== action.payload) };
    case 'ADD_EXPERIENCE':
      return { ...state, experience: [...state.experience, action.payload] };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };
    case 'REMOVE_EXPERIENCE':
      return { ...state, experience: state.experience.filter((e) => e.id !== action.payload) };
    case 'SET_LANGUAGES':
      return { ...state, languages: action.payload };
    case 'SET_PERSONALITY':
      return { ...state, personality: action.payload };
    case 'SET_MEDIA':
      return { ...state, media: action.payload };
    case 'SET_PHOTO':
      return { ...state, photo: action.payload };
    case 'SET_CODE_LANGUAGE':
      return { ...state, codeLanguage: action.payload };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

const CVContext = createContext<{
  data: CVData;
  dispatch: React.Dispatch<CVAction>;
} | null>(null);

export function CVProvider({ children, initialData }: { children: ReactNode; initialData?: CVData }) {
  const [data, dispatch] = useReducer(cvReducer, initialData ?? defaultCVData);

  return <CVContext.Provider value={{ data, dispatch }}>{children}</CVContext.Provider>;
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}
