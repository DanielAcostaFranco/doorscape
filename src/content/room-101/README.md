# Door 101 · The Final Chapter

Visit `/room-101`. The player stays at the center of a square room and turns
between four walls using the arrows, wall shortcuts, or the left/right keyboard
keys while focus is inside the room. Turns wrap in either direction. Reduced
motion preferences switch views immediately.

The north wall is the only wall with a door. It blends storybook worlds with
mystery and spooky details. East features sports and games, south features
music and performance, and west features nature and adventure.

`room.ts` owns wall order, descriptions, artwork paths, and inspection points.
The room components are in `src/game/rooms/room-101`. Four supplied reference
illustrations are optimized as local WebP files in `public/rooms/room-101`.
They are mapped to inward-facing Three.js walls, with a fixed central camera
that rotates in 90-degree steps. No pointer lock or movement is required.
An HTML image beneath the canvas provides a fallback when WebGL is unavailable.

This is an exploration scene. The inspection points describe objects; they do
not solve a puzzle, open the door, or alter saved game progress. A final puzzle
and door-unlock requirements can be connected once the progression is defined.
