# DoorScape: Project Documentation

## 1. Project overview

DoorScape is a browser-based 3D escape-room adventure. The game contains five
categories, each with 20 sequential doors, for a total of 100 doors. Every door
opens a separate 3D room or interactive challenge. Players must complete the
current puzzle before the next door becomes available.

The application uses **Next.js**, **React Three Fiber**, and **Three.js**:

- Next.js provides the application shell, routes, menus, door selection, HUD,
  settings, and deployment structure.
- React Three Fiber provides a React renderer for reusable Three.js scenes.
- Three.js provides the 3D renderer, cameras, lighting, models, raycasting,
  animation, and interactive room runtime.

The door-selection interface may use ordinary React components or SVG graphics.
The playable rooms use React Three Fiber and Three.js.

## 2. Confirmed game requirements

### Game structure

- Create five distinct categories with unique themes and visual identities.
- Include 20 sequential doors in each category.
- Make each door a Three.js room or interactive 3D scene.
- Keep doors locked until the previous required door is completed.
- Track progress across categories and doors.
- Allow players to resume after leaving and returning to the application.

### Door and room experience

The application must include:

- Main menu and onboarding.
- Category selection.
- Door selection with locked, unlocked, active, and completed states.
- A Three.js 3D environment for each room.
- Interactive objects and a puzzle or discovery challenge.
- Instructions, hints, success feedback, and failure feedback.
- A completion action that unlocks the next door.
- Pause, settings, sound, accessibility, and responsive browser support.

## 3. Recommended application architecture

### Next.js application layer

Next.js manages the application-level experience:

- App Router routes and layouts.
- Category and door-selection pages.
- React UI components and menus.
- HUD, instructions, hints, pause, and settings.
- Progress state and local persistence.
- Loading and error boundaries.
- Production build and deployment.

The 3D canvas must be treated as a client-side component because it depends on
the browser rendering environment and WebGL.

### React Three Fiber and Three.js layer

React Three Fiber manages reusable scene components while Three.js handles the
underlying 3D capabilities:

- Scene, camera, renderer, and render loop.
- Lighting, shadows, materials, and effects.
- GLTF/GLB asset loading.
- Raycasting and object interaction.
- Animation and optional physics.
- Room creation, switching, cleanup, and disposal.

Rooms should be lazy-loaded. Inactive room assets should be disposed so the
application can scale toward 100 rooms without keeping every scene in memory.

### Shared systems

The shared runtime should provide:

- `SceneManager` for creating and disposing room scenes.
- `AssetManager` for loading and caching models, textures, audio, and fonts.
- `InputManager` for keyboard, mouse, touch, and optional gamepad input.
- `PuzzleManager` for creating puzzles and coordinating their lifecycle.
- `ProgressStore` for validated progress and save-data migrations.
- `AudioManager` for music, ambience, effects, captions, and volume settings.
- Shared UI components for prompts, instructions, feedback, and completion.

## 4. Content model

Content should be data-driven so new rooms can be added without rewriting the
core runtime.

```ts
export type PuzzleType =
  | 'object-placement'
  | 'sequence'
  | 'key-lock'
  | 'combination'
  | 'timed'
  | 'hidden-object'
  | 'switch-logic'
  | 'physics'
  | 'deduction';

export interface Category {
  id: string;
  name: string;
  theme: string;
  description: string;
  colorPalette: string[];
  doorIds: string[];
}

export interface Door {
  id: string;
  categoryId: string;
  number: number;
  name: string;
  roomId: string;
  puzzleId: string;
  prerequisiteDoorId?: string;
  estimatedMinutes: number;
}

export interface Room {
  id: string;
  sceneAsset: string;
  environmentMap?: string;
  interactiveObjectIds: string[];
  spawnPoint: [number, number, number];
}

export interface Puzzle {
  id: string;
  type: PuzzleType;
  instructions: string;
  config: Record<string, unknown>;
  hintIds: string[];
}

export interface PlayerProgress {
  schemaVersion: number;
  completedDoorIds: string[];
  activeDoorId?: string;
  hintsUsed: Record<string, number>;
  updatedAt: string;
}
```

Every puzzle should use a consistent lifecycle:

```text
initialized → inProgress → completed
                    ↘ failed → reset → inProgress
```

The first framework version should support object placement, sequence,
combination, hidden-object, and switch-logic puzzles.

## 5. Progression and saving

- The first door in a category is unlocked by default.
- Every later door has a prerequisite door.
- A door is completed only after valid puzzle completion.
- Completion is stored using a stable door ID.
- Completing a door unlocks the next configured door only.
- Progress is validated before it is used.
- Save data includes a schema version and migration path.
- Invalid or tampered local data must not unlock unavailable content.
- Initial persistence uses validated `localStorage`.
- IndexedDB may be added later for larger saves and cached assets.
- Reset progress requires explicit confirmation.

## 6. Recommended folder structure

```text
src/
  app/
    page.tsx
    categories/page.tsx
    categories/[categoryId]/page.tsx
    doors/[doorId]/page.tsx

  components/
    CategoryCard.tsx
    DoorMap.tsx
    DoorCard.tsx
    GameHud.tsx
    PuzzleInstructions.tsx
    CompletionModal.tsx

  game/
    GameCanvas.tsx
    SceneManager.ts
    AssetManager.ts
    InputManager.ts
    AudioManager.ts
    rooms/
    puzzles/

  content/
    categories/
      clockwork/
      deep-sea/
      arcane/
      neon/
      wilds/
    doors/
      clockwork/
      deep-sea/
      arcane/
      neon/
      wilds/
    puzzles/

  state/
    progressStore.ts
    settingsStore.ts

  types/
    category.ts
    door.ts
    room.ts
    puzzle.ts
    progress.ts

public/
  models/
  textures/
  audio/

tests/
  unit/
  integration/
  e2e/

docs/
  PROJECT_DOCUMENTATION.md
```

Theme content belongs in the matching category or door directory. Shared
runtime code belongs in `src/game`, shared UI belongs in `src/components`, and
progression contracts belong in `src/types` and `src/state`.

## 7. Initial team theme structure

The starting repository separates work by team member. Each member owns one
theme directory and is responsible for 20 rooms inside that directory:

| Theme directory | Owner | Planned rooms |
| --- | --- | --- |
| `jenna-theme` | Jenna | 20 |
| `brynlee-theme` | Brynlee | 20 |
| `daniel-theme` | Daniel | 20 |
| `andrew-theme` | Andrew | 20 |
| `boston-theme` | Boston | 20 |

Each room owns its unique puzzle. A room directory should contain the room
definition, puzzle logic, interactive objects, room-specific interactions, and
asset references. Reusable puzzle infrastructure belongs in `src/game/puzzles`.

```text
src/content/themes/jenna-theme/rooms/room-01/
  room.ts
  puzzle.ts
  objects.ts
  interactions.ts
  assets.ts
```

Room 101 is stored separately in `src/content/room-101` because the whole team
creates it together as the visual and technical reference room.

## 8. Initial theme direction

| ID | Category | Theme and puzzle identity |
| --- | --- | --- |
| `clockwork` | The Clockwork Foundry | Brass machinery, sequences, gears, timed mechanisms |
| `deep-sea` | The Sunken Archive | Deep water, hidden objects, keys, pressure systems |
| `arcane` | The Arcane Conservatory | Magical laboratories, symbols, deduction, combinations |
| `neon` | Neon Afterlight | Cyberpunk rooms, switches, logic, pattern matching |
| `wilds` | The Overgrown Observatory | Natural ruins, physics interactions, exploration |

Each category should have its own palette, lighting direction, props, and
atmosphere while keeping interaction prompts, UI behavior, scale, and gameplay
rules consistent.

## 9. Visual, accessibility, and performance standards

- Use readable silhouettes and clear interaction highlights.
- Do not use color as the only way to communicate a puzzle solution.
- Support keyboard navigation for menus and available interactions.
- Provide reduced motion, adjustable text size, captions, and text alternatives.
- Provide non-timed alternatives where appropriate.
- Target 60 FPS on supported desktop hardware and a usable fallback on lower-end
  devices.
- Compress GLB assets and limit texture sizes.
- Reuse common materials, geometries, and props where practical.
- Lazy-load rooms and dispose of inactive scenes.
- Provide quality settings for shadows, effects, resolution, and draw distance.
- Test current Chrome, Edge, Firefox, and Safari versions where WebGL is
  available.

## 10. Testing plan

The project should include tests for:

- Progress state, schemas, and utilities.
- Puzzle validation and lifecycle behavior.
- Door locking, unlocking, and ordering.
- Save/load, validation, migration, and reset.
- Scene loading, cleanup, and asset failures.
- Keyboard, mouse, touch, and interaction prompts.
- Responsive layouts and accessibility.
- Browser compatibility and performance.
- Representative end-to-end journeys through each category.

Acceptance for a completed door means the player can enter an unlocked room,
understand the objective, interact with the required objects, complete the
puzzle, receive feedback, save completion, and see the next door unlock after a
reload.

## 11. Development roadmap

| Milestone | Deliverable |
| --- | --- |
| Technical prototype | Next.js app, React Three Fiber canvas, camera, input, test scene |
| Core interaction | Raycasting, prompts, object states, scene lifecycle |
| First playable room | One polished room and one complete puzzle |
| Puzzle framework | Data-driven contracts and initial puzzle types |
| Progression and saving | Locks, categories, local persistence, migrations |
| Category and door UI | Menus, door states, HUD, pause, settings |
| Additional content | Expand rooms and categories toward 100 doors |
| Audio and visual polish | Lighting, effects, ambience, music, feedback |
| Accessibility | Keyboard support, captions, reduced motion, text scaling |
| Testing and optimization | Automated tests, browser coverage, profiling |
| Production deployment | Reproducible build and launch documentation |

The first release should prioritize a small number of polished rooms and a
complete reusable runtime. Additional rooms should be added through the shared
content model rather than by duplicating application infrastructure.
