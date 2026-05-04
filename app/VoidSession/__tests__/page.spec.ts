import { test, expect } from '@playwright/test';
import { Target } from '../types';
import { BASE_TARGETS_URL } from '@/app/constants';

const TARGETS: Target[] = [
  {
    id: 'st-001',
    name: 'Mike Wheeler',
    signalClarity: 0.92,
    duration: 185,
    dimension: 'hawkins',
    lastKnownLocation: 'Wheeler residence, Maple Street',
    avatar:
      'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/mike.png',
  },
  {
    id: 'st-002',
    name: 'Will Byers',
    signalClarity: 0.41,
    duration: 720,
    dimension: 'upside_down',
    lastKnownLocation: 'Castle Byers',
    avatar:
      'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/will.png',
  },
  {
    id: 'st-003',
    name: 'Dustin',
    signalClarity: 0.78,
    duration: 300,
    dimension: 'hawkins',
    lastKnownLocation: 'Hawkins Middle School',
    avatar:
      'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/dustin.png',
  },
];

const TARGETS_DETAILS = [
  {
    id: 'st-001',
    name: 'Mike Wheeler',
    avatarUrl:
      'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/mike.png',
    connectionStatus: 'Connected',
    copy: 'Target located. Signal is strong.',
    lastKnownLocation: 'Wheeler residence, Maple Street',
  },
  {
    id: 'st-002',
    name: 'Will Byers',
    avatarUrl:
      'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/will.png',
    connectionStatus: 'Interference',
    copy: 'Something is blocking the signal. The Upside Down is interfering.',
  },
  {
    id: 'st-003',
    name: 'Dustin',
    avatarUrl:
      'https://raw.githubusercontent.com/niksumeiko/project-eleven/main/public/profiles/dustin.png',
    connectionStatus: 'Lost',
    copy: 'Connection severed. Eleven needs to rest.',
  },
];

test.describe('Void Session', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(BASE_TARGETS_URL, (route) =>
      route.fulfill({ json: TARGETS }),
    );
    await page.goto('/VoidSession');
  });

  test('displays the page title', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Void Session' }),
    ).toBeVisible();
  });

  test('handles loading state', async ({ page }) => {
    let resolveRoute: () => void = () => {};
    const routeBlocked = new Promise<void>((resolve) => {
      resolveRoute = resolve;
    });

    await page.route(BASE_TARGETS_URL, async (route) => {
      await routeBlocked;
      await route.fulfill({ json: TARGETS });
    });

    await page.goto('/VoidSession');
    await expect(page.getByText('Loading targets...')).toBeVisible();
    resolveRoute();
  });

  test('handles error state', async ({ page }) => {
    await page.route(BASE_TARGETS_URL, (route) => route.abort());
    await page.goto('/VoidSession');
    await expect(
      page.getByText('Error loading targets. Please try again later.'),
    ).toBeVisible();
  });

  test('lists targets with transformed data', async ({ page }) => {
    const DISPLAY_TARGETS = [
      {
        id: 'st-001',
        name: 'Mike Wheeler',
        signalClarityPercentage: '92%',
        sessionDuration: '3m 5s',
        dimension: 'Hawkins',
      },
      {
        id: 'st-002',
        name: 'Will Byers',
        signalClarityPercentage: '41%',
        sessionDuration: '12m 0s',
        dimension: 'Upside Down',
      },
    ];

    for (const target of DISPLAY_TARGETS) {
      const targetElement = page.getByTestId(`target-${target.id}`);
      await expect(targetElement).toBeVisible();

      await expect(targetElement.getByText(target.name)).toBeVisible();
      await expect(
        targetElement.getByText(target.signalClarityPercentage),
      ).toBeVisible();
      await expect(
        targetElement.getByText(target.sessionDuration),
      ).toBeVisible();
      await expect(targetElement.getByText(target.dimension)).toBeVisible();
      await expect(targetElement.getByText(target.dimension)).toContainClass(
        target.dimension === 'Upside Down'
          ? 'border-red-500 bg-red-100'
          : 'border-green-500 bg-green-100',
      );
    }
  });

  test('focus button is present for each target', async ({ page }) => {
    for (const target of TARGETS) {
      const targetElement = page.getByTestId(`target-${target.id}`);
      await expect(
        targetElement.getByRole('button', { name: 'Focus' }),
      ).toBeVisible();
    }
  });

  test('focus button click display the target details', async ({ page }) => {
    for (const target of TARGETS_DETAILS) {
      const targetElement = page.getByTestId(`target-${target.id}`);
      const targetsList = page.getByTestId('targets-list');

      await targetElement.getByRole('button', { name: 'Focus' }).click();

      const selectedTarget = page.getByTestId('selected-target');

      const targetName = selectedTarget.getByTestId('selected-target-name');
      const targetImage = selectedTarget.getByRole('img', {
        name: `${target.name}'s avatar`,
      });
      const connectionStatus = selectedTarget.getByTestId('connection-status');
      const copy = selectedTarget.getByTestId('copy');

      const releaseButton = selectedTarget.getByRole('button', {
        name: 'Release',
      });

      await expect(targetsList).not.toBeVisible();
      await expect(selectedTarget).toBeVisible();
      await expect(targetName).toBeVisible();
      await expect(targetImage).toBeVisible();
      await expect(connectionStatus).toBeVisible();
      await expect(copy).toBeVisible();
      await expect(releaseButton).toBeVisible();

      if (target.connectionStatus === 'Connected') {
        if (!target.lastKnownLocation) {
          throw new Error(
            'Expected lastKnownLocation to be defined for connected targets',
          );
        }
        await expect(
          selectedTarget.getByText(target.lastKnownLocation),
        ).toBeVisible();
      }

      await releaseButton.click();
    }
  });
});
