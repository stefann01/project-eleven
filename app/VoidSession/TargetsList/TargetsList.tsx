import { formatDimension, formatDuration, formatPercentage } from '@/app/util';
import { Target } from '../types';
import TargetCard from '../TargetCard';

export default function TargetsList({
  targets,
  onTargetFocus,
}: {
  targets: Target[];
  onTargetFocus: (target: Target) => void;
}) {
  return (
    <div
      data-testid="targets-list"
      className="flex flex-col gap-4 w-full max-w-4xl items-start"
    >
      <p className="text-foreground text-lg font-medium">Targets</p>
      {targets.map((target) => {
        return (
          <TargetCard
            key={target.id}
            id={target.id}
            name={target.name}
            signalClarityPercentage={formatPercentage(target.signalClarity)}
            dimension={formatDimension(target.dimension)}
            sessionDuration={formatDuration(target.duration)}
            onTargetFocus={() => onTargetFocus(target)}
          />
        );
      })}
    </div>
  );
}
