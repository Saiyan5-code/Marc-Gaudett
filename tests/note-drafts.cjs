const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: (name) => {
    if (name in mocks) return mocks[name];
    if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
    throw new Error(`Unexpected dependency: ${name}`);
  } });
  return module.exports;
}
function data(intent = 'save') {
  return new Map(Object.entries({ title: 'Private title', slug: 'private-note', snippet: 'Private summary', category: 'Leadership', date: 'September 2026', readTime: '1 min read', content: '[{"type":"p","text":"Private content"}]', intent }));
}
const redirect = () => { throw new Error('redirect'); };

test('new notes remain drafts even with forged publish intent', async () => {
  let saved;
  const actions = load('src/actions/notes.ts', {
    '@/lib/prisma': { prisma: { note: { create: async ({data}) => { saved = data; return { ...data, id: 'id' }; } } } },
    '@/lib/auth': { requireAdmin: async () => ({user: {name: 'Admin'}}) },
    'next/cache': { revalidatePath() {} }, 'next/navigation': { redirect }
  });
  await assert.rejects(actions.createNote(data('publish')), /redirect/);
  assert.equal(saved.published, false);
});

test('unauthenticated mutations fail before reading or writing the database', async () => {
  const actions = load('src/actions/notes.ts', {
    '@/lib/prisma': { prisma: new Proxy({}, {get() { throw new Error('Database was accessed'); }}) },
    '@/lib/auth': { requireAdmin: async () => { throw new Error('Unauthorized'); } },
    'next/cache': {}, 'next/navigation': { redirect }
  });
  for (const operation of [() => actions.createNote(data()), () => actions.updateNote('id', data('publish')), () => actions.deleteNote('id')]) await assert.rejects(operation(), /Unauthorized/);
});

test('saving does not publish; explicit publishing updates the saved content and visibility together', async () => {
  let saved;
  const invalidated = [];
  const actions = load('src/actions/notes.ts', {
    '@/lib/prisma': { prisma: { note: {
      findUniqueOrThrow: async () => ({slug: 'old-slug', published: false}),
      update: async ({data}) => { saved = data; return data; }
    } } },
    '@/lib/auth': { requireAdmin: async () => ({user: {name: 'Admin'}}) },
    'next/cache': { revalidatePath(path) { invalidated.push(path); } }, 'next/navigation': { redirect }
  });
  await assert.rejects(actions.updateNote('id', data()), /redirect/);
  assert.equal('published' in saved, false);
  await assert.rejects(actions.updateNote('id', data('publish')), /redirect/);
  assert.equal(saved.published, true);
  assert.equal(saved.title, 'Private title');
  assert.ok(invalidated.includes('/'));
  assert.ok(invalidated.includes('/notes/old-slug'));
});

test('homepage and archive request only published records', async () => {
  for (const [file, client] of [['src/app/page.tsx','./HomeClient'], ['src/app/notes/page.tsx','./NotesClient']]) {
    let query;
    const page = load(file, { [client]: () => {}, '@/lib/prisma': { prisma: { note: {findMany: async (args) => {query = args; return [];} } } } });
    await page.default();
    assert.equal(query.where.published, true);
  }
});

test('direct draft links and metadata do not disclose the draft', async () => {
  const page = load('src/app/notes/[slug]/page.tsx', {
    './NoteClient': () => {},
    '@/lib/prisma': { prisma: { note: {findFirst: async (query) => {
      assert.equal(query.where.published, true);
      return null;
    }} } },
    'next/navigation': {notFound() { throw new Error('404'); }}
  });
  const props = {params: Promise.resolve({slug: 'private-note'})};
  assert.equal((await page.generateMetadata(props)).title, 'Note Not Found');
  await assert.rejects(page.default(props), /404/);
});
