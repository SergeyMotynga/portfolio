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

export interface Achievement {
  key: string;
  diplomaImage?: string;
  project: string;
  labels: Record<Language, { type: string; title: string; description: string }>;
}

export const achievements: Achievement[] = [
  {
    key: 'bdai',
    project: 'finguru',
    labels: {
      ru: { type: 'Хакатон · ПМиФИ ОмГТУ', title: 'BDAI', description: 'Представил командного финансового ассистента FinGuru. Разрабатывал backend бюджета, транзакций и целей накопления, участвовал в интеграции мобильного клиента.' },
      en: { type: 'Hackathon · OmSTU applied mathematics department', title: 'BDAI', description: 'Presented our team financial assistant, FinGuru. Developed the backend for budgets, transactions and savings goals, and contributed to mobile integration.' },
    },
  },
  {
    key: 'avtomatika-service',
    project: 'spas-system',
    labels: {
      ru: { type: 'Конференция · выступление по приглашению', title: 'Научно-техническая конференция ООО «Автоматика-Сервис»', description: 'По приглашению представил SPAS System — командную систему обнаружения аномалий временных рядов. Разрабатывал интерфейс анализа, графики и интеграцию с API.' },
      en: { type: 'Conference · invited presentation', title: 'Avtomatika-Service scientific and technical conference', description: 'Presented SPAS System, our team time-series anomaly detection system, by invitation. Developed the analysis interface, charts and API integration.' },
    },
  },
  {
    key: 'data-match',
    project: 'demand-forecasting',
    labels: {
      ru: { type: 'Хакатон · исследование спроса', title: 'Data Match · ХК «Авангард»', description: 'Представил проект по исследованию спроса. Работал над признаками, сравнением моделей и проверкой на временных выборках. Данные, код и численные результаты не публикуются.' },
      en: { type: 'Hackathon · demand research', title: 'Data Match · Avangard hockey club', description: 'Presented a demand research project. Worked on features, model comparison and time-based evaluation. Data, code and numerical results are not published.' },
    },
  },
  {
    key: 'it-forum-xi',
    project: 'chess-broadcast',
    labels: {
      ru: { type: 'Хакатон · защита проекта', title: 'XI Международный ИТ-форум', description: 'Представил командный проект шахматной трансляции. Разрабатывал backend обработки распознанных позиций, состояние партии и обновления для зрителей.' },
      en: { type: 'Hackathon · project presentation', title: '11th International IT Forum', description: 'Presented our team chess-broadcasting project. Developed recognised-position processing, game state and live spectator updates on the backend.' },
    },
  },
];
