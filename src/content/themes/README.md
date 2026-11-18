# Theme content

The five theme folders are owned by one team member each:

- `jenna-theme/`
- `brynlee-theme/`
- `daniel-theme/`
- `andrew-theme/`
- `boston-theme/`

Each theme should contain 20 room folders. Every room owns its unique puzzle:

```text
room-01/
├── room.ts
├── puzzle.ts
├── objects.ts
├── interactions.ts
└── assets.ts
```

Shared puzzle infrastructure belongs in `src/game/puzzles/`. Do not put
theme-specific puzzle logic in the shared folder.
