import Alea from "alea";

const prng = Alea("birdie");

export function getRandomInt(min: number, max: number) {
  return Math.floor(prng() * (max - min + 1)) + min;
}

export function shuffle<T extends any[]>(array: T) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(prng() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
