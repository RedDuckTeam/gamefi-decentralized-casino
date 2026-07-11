const DEFAULT_VOLUME = 0.1;

const createAudio = (src: string) => {
  const play = () => {
    const audio = new Audio(src);
    audio.volume = DEFAULT_VOLUME;
    audio.play().finally(() => {
      audio.remove();
    });
  };

  return { play };
};

export const rouletteSpinAudio = createAudio('sounds/rouletteSpin.mp3');
export const baseWinAudio = createAudio('sounds/baseWin.mp3');
export const wheelSpinAudio = createAudio('sounds/wheelSpin.mp3');
export const diceAudio = createAudio('sounds/dice.mp3');
export const flipEndAudio = createAudio('sounds/flipEnd.mp3');
export const plinkoAudio = createAudio('sounds/plinko.mp3');
export const boomAudio = createAudio('sounds/boom.mp3');
export const launchAudio = createAudio('sounds/launch.mp3');
export const limboAudio = createAudio('sounds/limbo.mp3');
export const paperAudio = createAudio('sounds/paper.mp3');
export const scissorsAudio = createAudio('sounds/scissors.mp3');
export const slotsAudio = createAudio('sounds/slots.mp3');
export const stoneAudio = createAudio('sounds/stone.mp3');
