import { describe, it, expect } from 'vitest';

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  let cleaned = priceStr.replace(/MT|MZN/gi, '').trim();
  cleaned = cleaned.replace(/\./g, '');
  cleaned = cleaned.replace(',', '.');
  return parseFloat(cleaned) || 0;
};

describe('parsePrice', () => {
  it('parses 1.100 MT as 1100', () => {
    expect(parsePrice('1.100 MT')).toBe(1100);
  });

  it('parses 1.490 MT as 1490', () => {
    expect(parsePrice('1.490 MT')).toBe(1490);
  });

  it('parses 1.800 MT as 1800', () => {
    expect(parsePrice('1.800 MT')).toBe(1800);
  });

  it('parses 350 MT as 350', () => {
    expect(parsePrice('350 MT')).toBe(350);
  });

  it('handles MZN currency', () => {
    expect(parsePrice('2.500 MZN')).toBe(2500);
  });

  it('handles comma decimals', () => {
    expect(parsePrice('1.200,50 MT')).toBe(1200.5);
  });

  it('returns 0 for empty string', () => {
    expect(parsePrice('')).toBe(0);
  });
});