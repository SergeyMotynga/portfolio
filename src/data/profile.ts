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

export const experience = [
  {
    ru: {
      company: 'AIMY',
      contribution: 'Backend коммерческих сервисов',
      description: 'Разрабатывал серверную логику и REST API, работал с базами данных и участвовал в интеграции ML-компонентов.',
      period: '4 месяца · стажировка и проекты по ГПХ',
    },
    en: {
      company: 'AIMY',
      contribution: 'Backend development for commercial services',
      description: 'Developed backend logic and REST APIs, worked with databases and helped integrate ML components.',
      period: '4 months · internship and contract work',
    },
  },
  {
    ru: {
      company: 'Автоматика-Сервис',
      contribution: 'Промышленный мониторинг',
      description: 'Обрабатывал временные ряды, разрабатывал дашборды и тестировал модели обнаружения аномалий. Готовил технические отчёты по требованиям к серверу.',
      period: '8 месяцев · работа и практика. Часть задач выполнял как лаборант ОмГТУ.',
    },
    en: {
      company: 'Avtomatika-Service',
      contribution: 'Industrial monitoring',
      description: 'Processed time-series data, developed dashboards and tested anomaly detection models. Prepared technical reports on server requirements.',
      period: '8 months · work and placements. I handled some of this work as a lab assistant at OmSTU.',
    },
  },
] as const;

export interface Achievement {
  key: string;
  document?: {
    preview: string;
    width: number;
    height: number;
    caption: Record<Language, string>;
  };
  project: string;
  labels: Record<Language, { type: string; title: string; description: string }>;
}

export const achievements: Achievement[] = [
  {
    key: 'bdai',
    document: {
      preview: '/documents/achievements/bdai-diploma.jpg',
      width: 1132, height: 1600,
      caption: {
        ru: 'Диплом за II место в чемпионате «Технологии больших данных и искусственного интеллекта». Команда «СМС», кейс ИИ-ассистента для повышения финансовой грамотности молодёжи.',
        en: 'Diploma for second place in the Big Data and Artificial Intelligence Technologies championship. Team «СМС», AI assistant for improving financial literacy among young people.',
      },
    },
    project: 'finguru',
    labels: {
      ru: { type: 'Чемпионат · II место · ПМиФИ ОмГТУ', title: 'BDAI', description: 'Занял II место в составе команды «СМС» с финансовым ассистентом FinGuru. Разрабатывал backend бюджета, транзакций и целей накопления, участвовал в интеграции мобильного клиента.' },
      en: { type: 'Championship · 2nd place · OmSTU', title: 'BDAI', description: 'Placed second with team «СМС» and our financial assistant, FinGuru. Developed the backend for budgets, transactions and savings goals, and contributed to mobile integration.' },
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
    document: {
      preview: '/documents/achievements/data-match-certificate-preview.webp',
      width: 1754, height: 1240,
      caption: {
        ru: 'Сертификат участника технического трека хоккейного хакатона Data Match. Омск, 2026.',
        en: 'Participation certificate for the technical track of the Data Match hockey hackathon. Omsk, 2026.',
      },
    },
    project: 'demand-forecasting',
    labels: {
      ru: { type: 'Хакатон · технический трек', title: 'Data Match · ХК «Авангард»', description: 'Представил проект по исследованию спроса. Работал над признаками, сравнением моделей и проверкой на временных выборках. Данные, код и численные результаты не публикуются.' },
      en: { type: 'Hackathon · technical track', title: 'Data Match · Avangard hockey club', description: 'Presented a demand research project. Worked on features, model comparison and time-based evaluation. Data, code and numerical results are not published.' },
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
