import test from 'node:test';
import assert from 'node:assert/strict';
import { projectSchema } from '../src/lib/project-schema.ts';
import { approvedRepositoryUrls } from '../src/lib/publication-policy.ts';

const project = {
  key: 'example', lang: 'ru', title: 'Example', summary: 'Summary', contribution: 'Contribution',
  category: 'personal', disclosure: 'open', order: 0, featured: false, stack: ['Python'],
};

test('an approved public personal repository is accepted', () => {
  assert(projectSchema.safeParse({ ...project, repository: approvedRepositoryUrls[0] }).success);
});

test('corporate cases cannot expose a repository, including an otherwise approved URL', () => {
  for (const category of ['corporate', 'commercial']) {
    assert(!projectSchema.safeParse({ ...project, category, disclosure: 'open' }).success);
    assert(!projectSchema.safeParse({ ...project, category, disclosure: 'anonymised', repository: approvedRepositoryUrls[0] }).success);
  }
});

test('unapproved URLs and lookalike GitHub hosts are rejected', () => {
  for (const repository of ['https://gitlab.example.com/company/project', 'https://github.com/another/repo', `${approvedRepositoryUrls[0]}?private=1`, 'https://github.com.evil.example/SergeyMotynga/project']) {
    assert(!projectSchema.safeParse({ ...project, repository }).success);
  }
});

test('restricted cases cannot be featured or linked to a repository', () => {
  const restricted = { ...project, category: 'competition', disclosure: 'restricted' };
  assert(projectSchema.safeParse(restricted).success);
  assert(!projectSchema.safeParse({ ...restricted, featured: true }).success);
  assert(!projectSchema.safeParse({ ...restricted, repository: approvedRepositoryUrls[0] }).success);
});

test('project keys cannot escape their route', () => {
  for (const key of ['../private', 'a/b', 'Project Name', '<script>']) {
    assert(!projectSchema.safeParse({ ...project, key }).success);
  }
});
