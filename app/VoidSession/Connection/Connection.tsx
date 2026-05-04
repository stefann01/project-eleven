import { getTargetDetails } from '../services/TargetService';
import Image from 'next/image';
import { Target } from '../types';

export default function Connection({
  target,
  onRelease,
}: {
  target: Target;
  onRelease: () => void;
}) {
  const {
    avatar: avatarUrl,
    connectionStatus,
    copy,
    lastKnownLocation,
  } = getTargetDetails(target);
  return (
    <div
      data-testid="selected-target"
      className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-16"
    >
      <h1 className="text-2xl font-bold" data-testid="selected-target-name">
        Eleven connects to {target.name}
      </h1>

      <div className="flex items-center gap-4">
        <Image
          src={
            'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/eleven.png'
          }
          width={100}
          height={100}
          alt="Eleven's avatar"
          className="rounded-full"
        />
        <span className="text-2xl text-gray-400">→</span>
        <Image
          src={avatarUrl}
          width={100}
          height={100}
          alt={`${target.name}'s avatar`}
          className="rounded-full"
        />
      </div>

      <p>
        Status: <span data-testid="connection-status">{connectionStatus}</span>
      </p>
      <p data-testid="copy">{copy}</p>
      {connectionStatus === 'Connected' && (
        <p>Last Known Location: {lastKnownLocation}</p>
      )}

      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 w-max"
        onClick={onRelease}
      >
        Release
      </button>
    </div>
  );
}
