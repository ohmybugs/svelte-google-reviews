import { describe, it, expect } from 'vitest';
import { displayName } from '../lib/utils/displayName';
import { getRelativeDate } from '../lib/utils/getRelativeDate';
import { trim } from '../lib/utils/trim';

describe('displayName', () => {
  it('returns fullNames unchanged', () => {
    expect(displayName('Jane Smith', 'fullNames')).toBe('Jane Smith');
  });

  it('returns firstNamesOnly', () => {
    expect(displayName('Jane Smith', 'firstNamesOnly')).toBe('Jane');
  });

  it('returns firstAndLastInitials', () => {
    expect(displayName('Jane Smith', 'firstAndLastInitials')).toBe('Jane S.');
  });

  it('returns single name unchanged regardless of mode', () => {
    expect(displayName('Madonna', 'firstAndLastInitials')).toBe('Madonna');
    expect(displayName('Madonna', 'fullNames')).toBe('Madonna');
    expect(displayName('Madonna', 'firstNamesOnly')).toBe('Madonna');
  });

  it('uses last word initial for multi-part names with firstAndLastInitials', () => {
    expect(displayName('Jane Marie Smith', 'firstAndLastInitials')).toBe('Jane S.');
  });

  it('returns first name only for multi-part names with firstNamesOnly', () => {
    expect(displayName('Jane Marie Smith', 'firstNamesOnly')).toBe('Jane');
  });
});

describe('getRelativeDate', () => {
  it('returns a string ending with "ago"', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10); // 10 days ago
    expect(getRelativeDate(date)).toMatch(/ago$/);
  });

  it('uses "days" for recent dates', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5);
    expect(getRelativeDate(date)).toMatch(/day/);
  });

  it('uses "months" for dates a few months ago', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60);
    expect(getRelativeDate(date)).toMatch(/month/);
  });

  it('uses "years" for dates over a year ago', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 400);
    expect(getRelativeDate(date)).toMatch(/year/);
  });

  it('uses singular "day" for exactly 1 day ago', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24);
    expect(getRelativeDate(date)).toBe('1 day ago');
  });

  it('uses singular "month" for exactly 1 month ago', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    expect(getRelativeDate(date)).toBe('1 month ago');
  });

  it('uses singular "year" for exactly 1 year ago', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 366);
    expect(getRelativeDate(date)).toBe('1 year ago');
  });
});

describe('trim', () => {
  it('does not truncate short strings', () => {
    expect(trim('Short text', 200)).toBe('Short text');
  });

  it('truncates long strings and adds ellipsis', () => {
    const long = 'a '.repeat(150).trim(); // 299 chars
    const result = trim(long, 200);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThan(long.length);
  });

  it('truncates at word boundary', () => {
    const text =
      'hello world this is a test string that is definitely longer than fifty characters';
    const result = trim(text, 50);
    expect(result.endsWith('...')).toBe(true);
    // The part before the ellipsis should not contain a partial word
    // (i.e. it ends on a complete word, not mid-word)
    const withoutEllipsis = result.slice(0, -3);
    // There should be no trailing partial word — the char before '...' must be
    // the last character of a complete word (no split like 'th...' from 'that')
    expect(withoutEllipsis).toBe(withoutEllipsis.trimEnd());
    // Confirm it fits within maxLength before the ellipsis was appended
    expect(withoutEllipsis.length).toBeLessThanOrEqual(50);
  });
});
