import { GameCanvas } from '@/game/GameCanvas';

export default function Room101Page() {
  return (
    <main className="room-shell">
      <header className="room-header">
        <div>
          <p className="eyebrow">Shared reference room</p>
          <h1>Room 101</h1>
        </div>
        <span className="muted">Foundation scene</span>
      </header>
      <div className="canvas-wrap"><GameCanvas /></div>
    </main>
  );
}
