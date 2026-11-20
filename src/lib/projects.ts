import { getCollection, type CollectionEntry } from 'astro:content';
import { languages, type Language } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;

export async function getProjects(language: Language): Promise<Project[]> {
  const entries = await getCollection('projects');
  assertTranslations(entries);
  return entries.filter(({ data }) => data.lang === language).sort((a, b) => a.data.order - b.data.order);
}

function assertTranslations(projects: Project[]): void {
  const keys = new Map<string, Set<string>>();
  for (const { data } of projects) {
    const translated = keys.get(data.key) ?? new Set<string>();
    if (translated.has(data.lang)) throw new Error(`Duplicate project translation: ${data.key}/${data.lang}`);
    translated.add(data.lang);
    keys.set(data.key, translated);
  }
  for (const [key, translated] of keys) {
    if (languages.some((language) => !translated.has(language))) throw new Error(`Missing project translation: ${key}`);
  }
}
