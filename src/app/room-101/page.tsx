import type { Metadata } from 'next';
import { Room101 } from '@/game/rooms/room-101/Room101';

export const metadata: Metadata = {
  title: 'Door 101 · The Final Chapter | DoorScape',
  description: 'Explore four illustrated walls in the final DoorScape room, where sports, nature, music, storybooks, and mystery meet.',
};

export default function Room101Page() {
  return <Room101 />;
}
