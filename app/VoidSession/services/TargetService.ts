import { Target, TargetDetails } from '../types';

export function mapTargets(data: unknown): Target[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of targets');
  }

  return data.map((item) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error('Expected each target to be an object');
    }
    // Here you would typically validate the properties of each target object maybe with zod or a similar library, but for simplicity, we'll just cast it

    return item as Target;
  });
}

export function getTargetDetails(target: Target): TargetDetails {
  const base = {
    id: target.id,
    targetName: target.name,
    avatar: target.avatar,
  };

  if (target.signalClarity < 0.3 || target.duration > 1200) {
    return {
      ...base,
      connectionStatus: 'Lost',
      copy: 'Connection severed. Eleven needs to rest.',
    };
  }

  if (target.signalClarity >= 0.8 && target.dimension === 'hawkins') {
    return {
      ...base,
      connectionStatus: 'Connected',
      copy: 'Target located. Signal is strong.',
      lastKnownLocation: target.lastKnownLocation,
    };
  }

  return {
    ...base,
    connectionStatus: 'Interference',
    copy: 'Something is blocking the signal. The Upside Down is interfering.',
  };
}

export function getDimensionColor(dimension: string): 'green' | 'red' {
  return dimension === 'Upside Down' ? 'red' : 'green';
}
