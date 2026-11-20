import { z } from 'astro/zod';
import { isApprovedRepository } from './publication-policy.ts';

export const projectSchema = z.object({
  key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  lang: z.enum(['ru', 'en']),
  title: z.string().min(1),
  summary: z.string().min(1),
  contribution: z.string().min(1),
  category: z.enum(['commercial', 'corporate', 'personal', 'team', 'library', 'academic', 'competition']),
  disclosure: z.enum(['open', 'anonymised', 'restricted']),
  order: z.number().int().nonnegative(),
  featured: z.boolean().default(false),
  stack: z.array(z.string().min(1)).min(1),
  repository: z.url().optional(),
}).superRefine((project, context) => {
  if (project.repository && (project.disclosure !== 'open' || !isApprovedRepository(project.repository))) {
    context.addIssue({ code: 'custom', path: ['repository'], message: 'This repository link is not approved for publication.' });
  }
  if (['commercial', 'corporate'].includes(project.category) && project.disclosure === 'open') {
    context.addIssue({ code: 'custom', path: ['disclosure'], message: 'Commercial and corporate cases must be anonymised.' });
  }
  if (project.disclosure === 'restricted' && project.featured) {
    context.addIssue({ code: 'custom', path: ['featured'], message: 'Restricted cases are not featured.' });
  }
});
