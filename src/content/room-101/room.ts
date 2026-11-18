export const room101Walls = [
  {
    id: 'door',
    name: 'The final door',
    shortName: 'The door',
    direction: 'North',
    theme: 'Storybook worlds · Mystery & spooky',
    image: '/rooms/room-101/door.webp',
    description: 'An enchanted book, a watchful portrait, and a clock keeping its own time. Every story has an ending. This one has a door.',
    alt: 'A teal room wall with one wooden door, a grandfather clock, a spooky portrait, a bookshelf, and a glowing storybook castle.',
    discovery: { x: 87, y: 81, label: 'Inspect the enchanted book', title: 'A story still unfolding', text: 'A tiny castle rises from the pages. Its lantern casts the same warm glow as the one hanging across the room. Five different worlds seem to belong to the same story.' },
  },
  {
    id: 'games',
    name: 'Let the games begin',
    shortName: 'Play',
    direction: 'East',
    theme: 'Sports & games',
    image: '/rooms/room-101/games.webp',
    description: 'Trophies above, puzzles below. From the chessboard to the basketball hoop, there is a little friendly competition in every corner.',
    alt: 'A teal wall with trophies, a dartboard, a basketball hoop, dice, a chess table, board games, balls, and scattered puzzle pieces.',
    discovery: { x: 48, y: 65, label: 'Inspect the chessboard', title: 'Your next move', text: 'The pieces are ready, but nobody has made the first move. Around the table, puzzle pieces, playing dice, and well-loved games wait for another player.' },
  },
  {
    id: 'music',
    name: 'A room with rhythm',
    shortName: 'Perform',
    direction: 'South',
    theme: 'Music & performance',
    image: '/rooms/room-101/music.webp',
    description: 'The curtain is drawn, the instruments are waiting, and a score sits open at the piano. All that is missing is the first note.',
    alt: 'A teal music wall with a red stage curtain, records, guitar, saxophone, piano, microphone, speakers, drums, and a metronome.',
    discovery: { x: 33, y: 68, label: 'Inspect the piano', title: 'An unfinished melody', text: 'An open score rests above the keys. Records, drums, and a waiting microphone turn this quiet corner into a stage, ready for its next performance.' },
  },
  {
    id: 'adventure',
    name: 'The adventure awaits',
    shortName: 'Explore',
    direction: 'West',
    theme: 'Nature & adventure',
    image: '/rooms/room-101/adventure.webp',
    description: 'Follow the vines to a lantern-lit map. A compass, a packed bag, and a curious little companion promise a journey beyond these walls.',
    alt: 'A teal jungle wall with leafy vines, a monkey, a backpack, coiled rope, a glowing lantern, plants, and an explorer’s desk with a map and compass.',
    discovery: { x: 49, y: 66, label: 'Inspect the explorer’s map', title: 'All paths lead here', text: 'Mountains, forests, and winding trails cover the map. The compass beside it is a reminder: you can explore in every direction, even while standing in the same place.' },
  },
] as const;

export type Room101Wall = (typeof room101Walls)[number];

export function wrapWall(index: number) {
  return ((index % room101Walls.length) + room101Walls.length) % room101Walls.length;
}
