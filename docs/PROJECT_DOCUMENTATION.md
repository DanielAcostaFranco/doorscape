# DoorScape: Project Documentation and Feature Specification

## Project overview

DoorScape is a browser-based 3D escape-room adventure built with Three.js. The game is organized into five distinct categories, each containing 20 sequential doors, for a total of 100 doors. Every door opens into a separate 3D room or interactive challenge. Players must complete the current puzzle or task before the next door becomes available; doors cannot be skipped.

This document defines the product requirements, recommended architecture, content model, technical direction, quality plan, and development roadmap. Confirmed requirements are stated as requirements. Recommendations and assumptions are labeled so they can be revisited as implementation progresses.

## 1. Confirmed game requirements

### Game structure

- Create five distinct categories with unique themes, environments, puzzle styles, and visual identities.
- Include 20 sequential doors in each category.
- Make each door a Three.js room or interactive 3D scene.
- Enforce linear progression within each category.
- Keep a door locked until its puzzle or task is completed.
- Track progress across all categories and doors.
- Allow players to resume progress after leaving and returning to the application.

### Door and room experience

The application must provide a category-selection interface and a door-selection interface. Door states must clearly distinguish locked, unlocked, completed, and currently active doors.

Each room must include:

- A Three.js 3D environment.
- Interactive objects.
- A puzzle, task, or discovery challenge.
- Instructions or contextual hints.
- A completion/submission method.
- Success and failure feedback.
- An exit or transition to the next unlocked door.

Completing a door triggers a success state and permanently unlocks the next door in that category.

## 2. Puzzle system

The puzzle framework should be flexible and data-driven so new doors can be added without rewriting core systems. It must support:

- Object placement.
- Sequence and pattern puzzles.
- Key and lock puzzles.
- Code or combination puzzles.
- Timed challenges.
- Hidden-object discovery.
- Switch, button, and lever interactions.
- Physics-based interactions.
- Logic and deduction challenges.

Each puzzle should expose a consistent lifecycle such as `initialized`, `inProgress`, `completed`, and `failed`, with reusable validation, hint, reset, and feedback behavior.

## 3. User experience requirements

Document and implement the following experiences:

- Main menu and onboarding flow.
- Category-selection screen.
- Door-selection screen.
- In-room HUD.
- Interaction prompts.
- Puzzle instructions.
- Hint system.
- Completion and failure states.
- Pause menu.
- Settings menu.
- Sound and music controls.
- Accessibility options.
- Responsive desktop and mobile browser behavior.
- Keyboard, mouse, touch, and optional gamepad controls.

## 4. Three.js technical requirements

The recommended Three.js architecture should cover:

- Scene and camera management.
- Renderer configuration.
- Lighting and shadows.
- Asset loading.
- GLTF/GLB model support.
- Texture and material management.
- Animation handling.
- Raycasting and object interaction.
- Collision detection.
- Optional physics integration.
- Scene cleanup and memory management.
- Loading screens and progress indicators.
- Performance optimization for a large number of rooms.
- Reusable components for doors, rooms, interactive objects, puzzles, lighting, and effects.

Rooms should be loaded lazily and disposed when no longer needed. A shared scene runtime should allow a small first release to expand to all 100 doors without duplicating infrastructure.

## 5. Application architecture

### Recommended stack

TypeScript is recommended over plain JavaScript for type-safe content schemas, puzzle contracts, and state transitions. A lightweight frontend framework such as React is recommended for menus and HUD screens, while Three.js owns the 3D room runtime. If framework overhead becomes undesirable, the same boundaries can be implemented with TypeScript and a small UI layer.

### Major modules

| Module | Responsibility |
| --- | --- |
| Application bootstrap | Initializes dependencies, routing, renderer, and global services. |
| Game state management | Owns current category, door, player state, settings, and transitions. |
| Scene manager | Creates, switches, updates, and disposes Three.js scenes. |
| Category manager | Loads category metadata and calculates category availability. |
| Door manager | Resolves door definitions, locking, unlocking, and room transitions. |
| Puzzle manager | Instantiates puzzle types and coordinates lifecycle and completion. |
| Player progress system | Tracks completed doors, hints, attempts, and session state. |
| Input manager | Normalizes keyboard, mouse, touch, and optional gamepad input. |
| Audio manager | Handles music, ambience, effects, volume, and mute settings. |
| UI system | Renders menus, HUD, prompts, instructions, feedback, and accessibility controls. |
| Asset manager | Loads, caches, tracks, and disposes models, textures, audio, and fonts. |
| Save/load system | Validates, migrates, persists, and restores player data. |
| Analytics/event tracking | Optional event instrumentation with privacy-conscious defaults. |

## 6. Data models

The following TypeScript interfaces are a recommended starting point:

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

export interface InteractiveObject {
  id: string;
  objectType: string;
  modelAsset: string;
  position: [number, number, number];
  interaction: string;
}

export interface PlayerProgress {
  schemaVersion: number;
  completedDoorIds: string[];
  activeDoorId?: string;
  hintsUsed: Record<string, number>;
  completionRecords: CompletionRecord[];
  updatedAt: string;
}

export interface Hint {
  id: string;
  order: number;
  text: string;
  penalty?: string;
}

export interface CompletionRecord {
  doorId: string;
  completedAt: string;
  attempts: number;
  elapsedSeconds: number;
}

export interface GameSettings {
  musicVolume: number;
  effectsVolume: number;
  textScale: number;
  reducedMotion: boolean;
  captions: boolean;
}
```

### Example content data

The initial five categories may be themed as follows:

| ID | Category | Theme and puzzle identity |
| --- | --- | --- |
| `clockwork` | The Clockwork Foundry | Brass machinery, sequences, gears, and timed mechanisms. |
| `deep-sea` | The Sunken Archive | Submerged ruins, hidden objects, keys, and pressure systems. |
| `arcane` | The Arcane Conservatory | Magical laboratories, deduction, symbols, and combination locks. |
| `neon` | Neon Afterlight | Cyberpunk rooms, switches, logic circuits, and pattern matching. |
| `wilds` | The Overgrown Observatory | Natural ruins, physics interactions, exploration, and discovery. |

Example door records:

```ts
const doors: Door[] = [
  {
    id: 'clockwork-01', categoryId: 'clockwork', number: 1,
    name: 'The Brass Threshold', roomId: 'room-brass-threshold',
    puzzleId: 'puzzle-gear-placement', estimatedMinutes: 8,
  },
  {
    id: 'clockwork-02', categoryId: 'clockwork', number: 2,
    name: 'Pendulum Hall', roomId: 'room-pendulum-hall',
    puzzleId: 'puzzle-pendulum-sequence', prerequisiteDoorId: 'clockwork-01',
    estimatedMinutes: 10,
  },
  {
    id: 'deep-sea-01', categoryId: 'deep-sea', number: 1,
    name: 'The Flooded Reading Room', roomId: 'room-flooded-library',
    puzzleId: 'puzzle-lost-manifest', estimatedMinutes: 12,
  },
];
```

At least five concrete puzzle implementations should be delivered in the first framework version: object placement, sequence, combination, hidden-object, and switch-logic. Additional types can reuse the same lifecycle contract.

## 7. Progression and saving

- Door completion is stored by stable door ID.
- A door is unlocked only when it is the first door in a category or its prerequisite door is completed.
- Category progress is calculated as completed doors divided by the category’s 20 doors.
- The initial release should use validated `localStorage` for simplicity; IndexedDB is recommended once save data or cached assets become larger.
- Save data must include a schema version and migration path.
- Invalid or tampered data must fail safely and must not unlock unavailable content.
- Optional backend account synchronization can be added later with server-side validation.
- Reset progress must require an explicit confirmation and should clearly describe that the action cannot be undone.

## 8. Visual and audio direction

The overall art direction should use readable silhouettes, atmospheric rooms, and strong visual differences between categories while keeping interaction affordances consistent.

| Category | Suggested palette | Lighting direction |
| --- | --- | --- |
| Clockwork Foundry | Brass, charcoal, amber | Warm practical lights and moving shadows. |
| Sunken Archive | Deep blue, teal, sea-green | Volumetric caustics and low ambient light. |
| Arcane Conservatory | Violet, indigo, gold | Magical emissive accents and dramatic contrast. |
| Neon Afterlight | Magenta, cyan, near-black | High-contrast neon and reflective surfaces. |
| Overgrown Observatory | Moss, stone, cream | Natural daylight, fog, and bioluminescent details. |

The UI should use legible typography, consistent locked/completed/error states, clear interaction highlights, and category-specific accents without sacrificing contrast. Room names should follow the pattern `[evocative location]` and door labels should always include category and number.

Audio should include ambient loops, category music, interaction sounds, puzzle feedback, success stingers, and optional captions or text alternatives. Sound and music must be independently adjustable.

## 9. Accessibility and usability

The application must provide:

- Full keyboard navigation for menus and available interactions.
- Clear visual indicators for focus, hover, selected, locked, and completed states.
- Sufficient color contrast and no color-only puzzle requirement.
- Reduced-motion support.
- Captions or text alternatives for meaningful audio cues.
- Adjustable text size.
- Non-timed alternatives where appropriate.
- Alternatives to puzzles that rely only on color, sound, or precise timing.
- Clear feedback for every interactive action.
- Responsive layouts for desktop and mobile browsers.

## 10. Performance and security targets

### Performance

- Target 60 FPS on supported desktop hardware and a usable 30 FPS fallback on low-end devices.
- Support current versions of Chrome, Edge, Firefox, and Safari where WebGL is available.
- Use compressed GLTF/GLB assets, texture atlases, mipmaps, and appropriate texture resolution limits.
- Lazy-load room assets and unload inactive scenes.
- Reuse materials and geometries where possible.
- Provide a quality setting that can reduce shadows, effects, resolution, and draw distance.
- Display loading progress and handle asset failures with recoverable errors.

### Security and integrity

- Validate all loaded content against expected schemas.
- Treat local save data as untrusted input.
- Validate puzzle completion before changing progress state.
- If a backend is introduced, enforce progression server-side and do not trust client-submitted completion claims.
- Avoid collecting analytics unless the player has been informed and the data is necessary.

## 11. Testing and acceptance criteria

### Test coverage

The testing plan must include:

- Unit tests for state, progression, schemas, and utilities.
- Puzzle logic tests for every puzzle type.
- Door locking and progression tests.
- Save/load, validation, migration, and reset tests.
- Scene loading, cleanup, and failure tests.
- Interaction and input tests.
- UI and responsive-layout tests.
- Accessibility tests.
- Browser compatibility tests.
- Performance and memory tests.
- End-to-end tests for representative category journeys.

### Acceptance criteria

**Completed door:** The player can enter an unlocked door, understand the objective, interact with required objects, receive success or failure feedback, complete the puzzle, see the success state, and persist completion after reload. The next door becomes unlocked only after successful completion.

**Completed category:** All 20 doors are completed in order, progress displays 20/20, the category completion state is shown, and progress survives leaving and returning to the application.

**Completed game:** All five categories and 100 doors are completed, the global completion state is shown, and the player can review their completion records without losing progress.

## 12. Development roadmap

| Milestone | Objectives and deliverables | Dependencies | Definition of done |
| --- | --- | --- | --- |
| Technical prototype | Bootstrap app, renderer, camera, one test scene, basic input. | None | A room renders and accepts interaction input. |
| Core interaction system | Raycasting, prompts, object states, scene lifecycle. | Prototype | Interactive objects work and clean up correctly. |
| First playable room | One polished room and one complete puzzle. | Interaction system | A player can finish one door end-to-end. |
| Puzzle framework | Data-driven puzzle contracts and five puzzle types. | First room | New puzzle data can be added without core rewrites. |
| Progression and saving | Door locks, categories, local persistence, migrations. | Puzzle framework | Progress restores correctly and invalid data is rejected. |
| Category and door UI | Menus, door states, HUD, pause, settings. | Progression | Players can navigate and resume the game. |
| Additional content | Expand rooms and categories toward the 100-door target. | Core systems | Content follows shared schemas and performance budgets. |
| Audio and visual polish | Lighting, effects, ambience, music, feedback. | Content foundation | Art and audio direction is consistent and performant. |
| Accessibility | Keyboard, captions, reduced motion, text scaling, alternatives. | UI foundation | Accessibility acceptance checks pass. |
| Testing and optimization | Automated tests, browser coverage, profiling, device QA. | Feature-complete build | Release-blocking defects are resolved. |
| Production deployment | Build pipeline, hosting, monitoring, recovery documentation. | QA complete | Production build is reproducible and launch-ready. |

## 13. Documentation deliverables

The project documentation set should ultimately include:

1. Product overview.
2. Game design document.
3. Functional requirements specification.
4. Technical architecture document.
5. Three.js implementation guide.
6. Puzzle-system specification.
7. Progression and save-system specification.
8. UI/UX specification.
9. Accessibility requirements.
10. Asset and content-production guidelines.
11. Testing and quality-assurance plan.
12. Development roadmap.
13. Risk register with likely technical and design risks.
14. Example folder structure.
15. Example TypeScript interfaces and data files.

These may begin as sections in this document and later be split into separate files when the project grows.

## 14. Example folder structure

```text
src/
  app/
  assets/
  audio/
  components/
  content/
    categories/
    doors/
    puzzles/
  game/
    managers/
    scenes/
    systems/
  state/
  styles/
  types/
  main.ts
tests/
  unit/
  integration/
  e2e/
docs/
  PROJECT_DOCUMENTATION.md
public/
```

## 15. Initial risk register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| 100 rooms create large download and memory costs | High | Lazy loading, compression, shared assets, disposal, quality settings. |
| Puzzle content becomes inconsistent | High | Data schemas, reusable puzzle contracts, content review checklist. |
| Mobile WebGL performance is inadequate | High | Early device profiling, scalable quality settings, simplified fallback scenes. |
| Progress data becomes incompatible after updates | Medium | Versioned saves, migrations, validation, safe reset/export behavior. |
| Accessibility is added too late | High | Include keyboard, captions, reduced motion, and contrast checks in every milestone. |
| Scope expands faster than content production | High | Launch with a small vertical slice and preserve a strict content schema. |

## Implementation principle

The first version should launch with a small number of polished rooms and a complete, reusable runtime. All content should be authored through stable data models and shared systems so expanding to five categories and 100 doors does not require a major architectural rewrite.
