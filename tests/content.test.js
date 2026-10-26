import test from 'node:test';
import assert from 'node:assert/strict';
import { profile, projects, safeDestination } from '../src/content.js';

test('portfolio contains four uniquely identified projects with no live URLs', () => {
  assert.equal(projects.length, 4);
  for (const field of ['id', 'number', 'title']) {
    const values = projects.map(project => project[field]);
    assert.equal(new Set(values).size, 4, `${field} values should be unique`);
  }
  assert.ok(projects.every(project => project.url === null));
});

test('profile remains an explicit placeholder without a contact destination', () => {
  assert.match(profile.name, /^\[.+\]$/);
  assert.match(profile.role, /^\[.+\]$/);
  assert.match(profile.note, /^\[.+\]$/);
  assert.equal(profile.contactUrl, null);
});

test('Solana project is clearly labeled read-only / paper trading', () => {
  const solana = projects.find(project => project.id === 'solana-scanner');
  assert.ok(solana, 'Solana Scanner project should be present');
  assert.match(solana.category, /read-only\s*\/\s*paper trading/i);
  assert.match(solana.description, /does not connect a wallet, execute trades, or handle funds/i);
  assert.match(solana.note, /read-only\s*\/\s*paper trading only/i);
});

test('safeDestination permits only HTTPS and mailto destinations', () => {
  assert.equal(safeDestination('https://example.com/path?q=1'), 'https://example.com/path?q=1');
  assert.equal(safeDestination('mailto:hello@example.com'), 'mailto:hello@example.com');
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'http://example.com',
    '//example.com/path',
  ]) {
    assert.equal(safeDestination(value), null, `${value} should be rejected`);
  }
  assert.equal(safeDestination(null), null);
});
