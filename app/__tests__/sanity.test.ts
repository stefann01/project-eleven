import { test, expect, describe } from 'vitest';
import { formatDimension, formatDuration, formatPercentage } from '../util';

test('true is equal to true', () => {
  expect(true).toBe(true);
});

describe(' Formatting utilities', () => {
  test('formatPercentage correctly formats a decimal as a percentage string', () => {
    expect(formatPercentage(0.92)).toBe('92%');
    expect(formatPercentage(0.41)).toBe('41%');
    expect(formatPercentage(0)).toBe('0%');
    expect(formatPercentage(1)).toBe('100%');
  });

  test('formatDuration correctly formats seconds into m:ss format', () => {
    expect(formatDuration(185)).toBe('3m 5s');
    expect(formatDuration(720)).toBe('12m 0s');
    expect(formatDuration(59)).toBe('0m 59s');
    expect(formatDuration(3600)).toBe('60m 0s');
  });

  test('formatDimension correctly formats dimension strings', () => {
    expect(formatDimension('hawkins')).toBe('Hawkins');
    expect(formatDimension('upside_down')).toBe('Upside Down');
    expect(formatDimension('the_void')).toBe('The Void');
  });
});
