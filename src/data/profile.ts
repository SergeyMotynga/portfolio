import type { Language } from '../i18n/ui';

export const profile: {
  github: string;
  email?: string;
  telegram?: string;
  resume?: Partial<Record<Language, string>>;
} = {
  github: 'https://github.com/SergeyMotynga',
};

export const skills = {
  backend: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic'],
  data: ['PostgreSQL', 'Redis', 'SQLite'],
  ml: ['scikit-learn', 'pandas', 'Optuna', 'RAG'],
  tools: ['Git', 'Docker', 'Linux'],
} as const;

interface Presentation {
  project: string;
  labels: Record<Language, { type: string; title: string; description: string }>;
}

export const presentations: Presentation[] = [
  {
    project: 'finguru',
    labels: {
      ru: { type: 'Хакатон · презентация проекта', title: 'FinGuru', description: 'Представлял финансового помощника на хакатоне: бюджет, транзакции и цели накопления.' },
      en: { type: 'Hackathon · project presentation', title: 'FinGuru', description: 'Presented a financial assistant at a hackathon, covering budgets, transactions and savings goals.' },
    },
  },
  {
    project: 'spas-system',
    labels: {
      ru: { type: 'Конференция · выступление по приглашению', title: 'SPAS System', description: 'По приглашению представил на конференции систему обнаружения аномалий временных рядов.' },
      en: { type: 'Conference · invited presentation', title: 'SPAS System', description: 'Invited to present a time-series anomaly detection system at a conference.' },
    },
  },
  {
    project: 'chess-broadcast',
    labels: {
      ru: { type: 'Хакатон · командная работа', title: 'Оцифровка шахматной партии', description: 'Командная работа над распознаванием доски и трансляцией партии. Моя часть — backend и интеграция результатов компьютерного зрения.' },
      en: { type: 'Hackathon · team project', title: 'Chess game digitisation', description: 'A team project combining board recognition and live game broadcasting. My work focused on the backend and computer-vision result integration.' },
    },
  },
  {
    project: 'demand-forecasting',
    labels: {
      ru: { type: 'ML-соревнование · обезличено', title: 'Прогнозирование спроса', description: 'Подготовка данных, сравнение моделей и проверка на временных выборках. Материалы и участники кейса обезличены.' },
      en: { type: 'ML competition · anonymised', title: 'Demand forecasting', description: 'Data preparation, model comparison and time-based evaluation. Project materials and participants are anonymised.' },
    },
  },
];
