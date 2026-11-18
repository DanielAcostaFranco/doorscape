'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { room101Walls, wrapWall } from '@/content/room-101/room';
import styles from './room101.module.css';

const WallScene = dynamic(() => import('./WallScene'), { ssr: false });
type IconName = 'door' | 'games' | 'music' | 'adventure' | 'compass' | 'arrow' | 'spark';

function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    door: <><path d="M5 21V3h14v18M3 21h18M9 3v18" /><circle cx="15" cy="12" r=".7" /></>,
    games: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" strokeWidth="3" /></>,
    music: <><path d="M9 18V5l11-2v13M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="2" /><ellipse cx="17" cy="16" rx="3" ry="2" /></>,
    adventure: <><path d="m2 20 7-14 4 7 3-5 6 12ZM6 12l3 2 3-2M13 14l3 2 3-2" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5ZM12 1v2M12 21v2M1 12h2M21 12h2" /></>,
    arrow: <path d="m14 6-6 6 6 6" />,
    spark: <><path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4ZM20 2v4M18 4h4" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function Room101() {
  const [turn, setTurn] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const wallIndex = wrapWall(turn);
  const wall = room101Walls[wallIndex];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  function rotate(step: number) {
    setInspecting(false);
    setTurn((previous) => previous + step);
  }

  function chooseWall(index: number) {
    const clockwise = wrapWall(index - wallIndex);
    rotate(clockwise > 2 ? clockwise - 4 : clockwise);
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      rotate(event.key === 'ArrowLeft' ? -1 : 1);
    }
    if (event.key === 'Escape') setInspecting(false);
  }

  return (
    <main className={styles.room} onKeyDown={onKeyDown}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="DoorScape home"><Icon name="door" /><span>Door<span>Scape</span></span></Link>
        <div className={styles.headerMiddle}><span className={styles.smallStar}>✦</span> THE FINAL CHAPTER <span className={styles.smallStar}>✦</span></div>
        <Link className={styles.leave} href="/"><Icon name="arrow" /> Leave room</Link>
      </header>

      <div className={styles.content}>
        <section className={styles.intro} aria-labelledby="room-title">
          <p className={styles.eyebrow}><span /> ROOM 101 <span /></p>
          <h1 id="room-title">Every world leads <em>here.</em></h1>
          <p>Five worlds, four walls, one final door. Take a look around.</p>
        </section>

        <section className={styles.roomFrame} aria-label="Explore Room 101" tabIndex={0} aria-describedby="room-controls">
          <div className={styles.stage}>
            <Image src={wall.image} alt={wall.alt} fill priority sizes="(max-width: 1400px) 100vw, 1280px" className={styles.artwork} />
            <div className={styles.canvas} aria-hidden="true"><WallScene turn={turn} reducedMotion={reducedMotion} /></div>
            <div className={styles.wallMarker}><span className={styles.markerDot} />{wall.direction} wall <span className={styles.markerDivider}>/</span> {String(wallIndex + 1).padStart(2, '0')} — 04</div>
            <button type="button" className={`${styles.turnButton} ${styles.turnLeft}`} onClick={() => rotate(-1)} aria-label={`Turn left to ${room101Walls[wrapWall(wallIndex - 1)].shortName}`}><Icon name="arrow" /></button>
            <button type="button" className={`${styles.turnButton} ${styles.turnRight}`} onClick={() => rotate(1)} aria-label={`Turn right to ${room101Walls[wrapWall(wallIndex + 1)].shortName}`}><Icon name="arrow" /></button>
            <button key={wall.id} type="button" className={styles.discovery} style={{ left: `${wall.discovery.x}%`, top: `${wall.discovery.y}%` }} onClick={() => setInspecting((open) => !open)} aria-label={wall.discovery.label} aria-expanded={inspecting} aria-controls="room-discovery"><span>+</span></button>
            <div className={styles.stageCaption}><Icon name="compass" /><span>You are in the center of the room</span></div>
          </div>

          <div className={styles.navigation}>
            <div className={styles.navLabel}><Icon name="compass" /><span>LOOK<br /><strong>AROUND</strong></span></div>
            <nav className={styles.wallNav} aria-label="Choose a wall">
              {room101Walls.map((item, index) => <button key={item.id} type="button" aria-current={wallIndex === index ? 'true' : undefined} onClick={() => chooseWall(index)} className={wallIndex === index ? styles.activeWall : ''}><Icon name={item.id} /><span>{item.shortName}</span><small>{item.direction.slice(0, 1)}</small></button>)}
            </nav>
            <span className={styles.keyboardHint}><kbd>←</kbd><kbd>→</kbd><span>to turn</span></span>
          </div>
        </section>

        <section className={styles.wallDetails} aria-live="polite" aria-atomic="true">
          <div><p className={styles.detailEyebrow}>{wall.theme}</p><h2>{wall.name}</h2></div>
          <p>{wall.description}</p>
        </section>

        {inspecting && <aside id="room-discovery" className={styles.discoveryPanel} aria-label="Object details"><Icon name="spark" /><div><h3>{wall.discovery.title}</h3><p>{wall.discovery.text}</p></div><button type="button" onClick={() => setInspecting(false)} aria-label="Close object details">×</button></aside>}

        <footer className={styles.footer}><span>ONE ROOM. A LITTLE OF EVERY WORLD.</span><span id="room-controls">Click the arrows or a wall below to turn. Select <b>+</b> to look closer.</span><span>DOOR <b>101</b></span></footer>
      </div>
    </main>
  );
}
