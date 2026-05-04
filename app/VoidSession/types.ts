export type Target = {
  id: string;
  name: string;
  signalClarity: number;
  duration: number;
  dimension: string;
  lastKnownLocation: string;
  avatar: string;
};

export type TargetConnectionStatus = 'Connected' | 'Interference' | 'Lost';
export type TargetDetails = {
  id: string;
  targetName: string;
  avatar: string;
  connectionStatus: TargetConnectionStatus;
  copy: string;
  lastKnownLocation?: string;
};
