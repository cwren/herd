import { expect, test } from 'vitest';
import { stateDecoder } from '@/scripts//states.ts';

test('state decoder upcase two', () => {
  expect(stateDecoder("MA")).toBe('MA');
});

test('state decoder capitalized name', () => {
  expect(stateDecoder("Massachusetts")).toBe('MA');
});

test('state decoder capitalized two', () => {
  expect(stateDecoder("Ma")).toBe('MA');
});

test('state decoder lowercase two', () => {
  expect(stateDecoder("ma")).toBe('MA');
});

test('state decoder lowercase name', () => {
  expect(stateDecoder("massachusetts")).toBe('MA');
});

test('state decoder uppercase name', () => {
  expect(stateDecoder("MASSACHUSETTS")).toBe('MA');
});

test('state decoder with spaces', () => {
  expect(stateDecoder("Palmyra ATOLL")).toBe('XL');
});

test('state decoder with punctuation', () => {
  expect(stateDecoder("U.S. ARMED forces - Pacific")).toBe('AP');
});


