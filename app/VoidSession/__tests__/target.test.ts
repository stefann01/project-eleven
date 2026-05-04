import { describe } from 'node:test';
import {
  mapTargets,
  getTargetDetails,
  getDimensionColor,
} from '../services/TargetService';
import { expect, test } from 'vitest';
import { Target, TargetDetails } from '../types';

const TARGETS = [
  {
    raw: {
      id: 'st-001',
      name: 'Mike Wheeler',
      signalClarity: 0.92,
      duration: 185,
      dimension: 'hawkins',
      lastKnownLocation: 'Wheeler residence, Maple Street',
    },
    formatted: {
      id: 'st-001',
      name: 'Mike Wheeler',
      signalClarityPercentage: '92%',
      sessionDuration: '3m 5s',
      dimension: 'Hawkins',
    },
  },
  {
    raw: {
      id: 'st-002',
      name: 'Will Byers',
      signalClarity: 0.41,
      duration: 720,
      dimension: 'upside_down',
      lastKnownLocation: 'Castle Byers',
    },
    formatted: {
      id: 'st-002',
      name: 'Will Byers',
      signalClarityPercentage: '41%',
      sessionDuration: '12m 0s',
      dimension: 'Upside Down',
    },
  },
];

describe('Target data transformation', () => {
  test('mapTargets correctly transforms raw data into Target[]', () => {
    const rawData = TARGETS.map((t) => t.raw);
    const expected = TARGETS.map((t) => t.raw as unknown as Target);
    const result = mapTargets(rawData);
    expect(result).toEqual(expected);
  });

  test('mapTargets throws error when target is invalid', () => {
    expect(() => mapTargets({} as Target)).toThrow();
  });

  test('mapTargets throws error when target item is invalid', () => {
    expect(() => mapTargets([null])).toThrow();
  });
});

const BASE_TARGET: Target = {
  id: 'st-001',
  name: 'Mike Wheeler',
  avatar:
    'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/mike.png',
  signalClarity: 0.92,
  duration: 185,
  dimension: 'hawkins',
  lastKnownLocation: 'Wheeler residence, Maple Street',
};
const BASE_DETAILS = {
  id: 'st-001',
  targetName: 'Mike Wheeler',
  avatar:
    'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/mike.png',
};

describe('getTargetDetails', () => {
  test('returns Lost when signalClarity is below 0.3', () => {
    const target: Target = {
      ...BASE_TARGET,
      signalClarity: 0.29,
    };
    const expected: TargetDetails = {
      ...BASE_DETAILS,
      connectionStatus: 'Lost',
      copy: 'Connection severed. Eleven needs to rest.',
      avatar: BASE_TARGET.avatar,
    };
    expect(getTargetDetails(target)).toEqual(expected);
  });

  test('returns Lost when duration exceeds 1200 seconds', () => {
    const target: Target = {
      ...BASE_TARGET,
      duration: 1201,
    };
    const expected: TargetDetails = {
      ...BASE_DETAILS,
      connectionStatus: 'Lost',
      copy: 'Connection severed. Eleven needs to rest.',
    };
    expect(getTargetDetails(target)).toEqual(expected);
  });

  test('Lost takes precedence over Connected when both conditions could apply', () => {
    const target: Target = {
      ...BASE_TARGET,
      signalClarity: 0.85,
      duration: 1201,
    };
    expect(getTargetDetails(target).connectionStatus).toBe('Lost');
  });

  test('returns Connected when signalClarity >= 0.8 and dimension is hawkins', () => {
    const expected: TargetDetails = {
      ...BASE_DETAILS,
      connectionStatus: 'Connected',
      copy: 'Target located. Signal is strong.',
      lastKnownLocation: 'Wheeler residence, Maple Street',
    };
    expect(getTargetDetails(BASE_TARGET)).toEqual(expected);
  });

  test('returns Interference when signalClarity >= 0.8 but dimension is upside_down', () => {
    const target: Target = {
      ...BASE_TARGET,
      dimension: 'upside_down',
    };
    const expected: TargetDetails = {
      ...BASE_DETAILS,
      connectionStatus: 'Interference',
      copy: 'Something is blocking the signal. The Upside Down is interfering.',
    };
    expect(getTargetDetails(target)).toEqual(expected);
  });

  test('returns Interference when dimension is hawkins but signalClarity is between 0.3 and 0.8', () => {
    const target: Target = {
      ...BASE_TARGET,
      signalClarity: 0.5,
    };
    const expected: TargetDetails = {
      ...BASE_DETAILS,
      connectionStatus: 'Interference',
      copy: 'Something is blocking the signal. The Upside Down is interfering.',
    };
    expect(getTargetDetails(target)).toEqual(expected);
  });
});

describe('getDimensionColor', () => {
  test('returns red for Upside Down dimension', () => {
    expect(getDimensionColor('Upside Down')).toBe('red');
  });

  test('returns green for any dimension other than Upside Down', () => {
    expect(getDimensionColor('Hawkins')).toBe('green');
    expect(getDimensionColor('Some Other Dimension')).toBe('green');
  });
});
