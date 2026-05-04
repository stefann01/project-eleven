import { getDimensionColor } from '../services/TargetService';

interface Target {
  id: string;
  name: string;
  signalClarityPercentage: string;
  dimension: string;
  sessionDuration: string;
  onTargetFocus: () => void;
}

export default function TargetCard({
  id,
  name,
  signalClarityPercentage,
  dimension,
  sessionDuration,
  onTargetFocus,
}: Target) {
  const dimensionColor = getDimensionColor(dimension);
  const dimensionClasses =
    dimensionColor === 'red'
      ? 'rounded border border-red-500 bg-red-100'
      : 'rounded border border-green-500 bg-green-100';

  return (
    <div
      data-testid={`target-${id}`}
      className="flex flex-col border rounded p-4 max-w-sm w-full bg-gray-800 bg-white"
    >
      <div className="flex gap-2 items-center">
        <h2 className="text-foreground text-lg font-bold">{name}</h2>
        <p className={`p-2 ${dimensionClasses}`}>{dimension}</p>
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <p className="text-foreground">
            Signal Clarity: {signalClarityPercentage}
          </p>
          <p className="text-foreground">Duration: {sessionDuration}s</p>
        </div>
        <button
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition h-8"
          onClick={onTargetFocus}
        >
          Focus
        </button>
      </div>
    </div>
  );
}
