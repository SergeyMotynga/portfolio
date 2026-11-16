import type { Language } from '../i18n/ui';

export const profile: {
  github: string;
  email?: string;
  telegram?: string;
  resume?: Partial<Record<Language, string>>;
} = {
  github: 'https://github.com/SergeyMotynga',
  email: 'Motynga12345@mail.ru',
  telegram: 'https://t.me/S1moll',
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
      ru: { type: 'Хакатон · презентация проекта', title: 'FinGuru', description: 'На хакатоне представил командного финансового помощника. Разрабатывал backend бюджета, транзакций и целей, участвовал в интеграции мобильного клиента.' },
      en: { type: 'Hackathon · project presentation', title: 'FinGuru', description: 'Presented our team financial assistant at a hackathon. Developed the backend for budgets, transactions and goals, and contributed to mobile integration.' },
    },
  },
  {
    project: 'spas-system',
    labels: {
      ru: { type: 'Конференция · выступление по приглашению', title: 'SPAS System', description: 'По приглашению выступил на конференции с командной системой обнаружения аномалий временных рядов. Моя часть — интерфейс анализа, графики и интеграция с API.' },
      en: { type: 'Conference · invited presentation', title: 'SPAS System', description: 'Presented our team time-series anomaly detection system at a conference by invitation. My work covered the analysis interface, charts and API integration.' },
    },
  },
  {
    project: 'chess-broadcast',
    labels: {
      ru: { type: 'Хакатон · командная работа', title: 'Оцифровка шахматной партии', description: 'Разрабатывал backend командной шахматной трансляции: обработку распознанных позиций, состояние партии и обновления для зрителей.' },
      en: { type: 'Hackathon · team project', title: 'Chess game digitisation', description: 'Developed the backend for a team chess-broadcasting project: recognised-position processing, game state and live spectator updates.' },
    },
  },
  {
    project: 'demand-forecasting',
    labels: {
      ru: { type: 'ML-соревнование · обезличено', title: 'Прогнозирование спроса', description: 'Работал над признаками, сравнением моделей и подбором параметров. Проверял прогнозы на временных выборках; закрытые материалы и результаты не раскрываются.' },
      en: { type: 'ML competition · anonymised', title: 'Demand forecasting', description: 'Worked on features, model comparison and parameter search. Evaluated forecasts on time-based splits; confidential materials and results are omitted.' },
    },
  },
];
