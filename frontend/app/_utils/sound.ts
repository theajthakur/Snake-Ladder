class SoundManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Preload sound files
      this.sounds.ladder = new Audio('/effects/ladder-climb.wav');
      this.sounds.firstSix = new Audio('/effects/marker-enabled.wav');
      this.sounds.step = new Audio('/effects/moving-marker.wav');
      this.sounds.snake = new Audio('/effects/snake-bite.wav');
      this.sounds.win = new Audio('/effects/winner.wav');
      this.sounds.click = new Audio('/effects/game-click.wav');
      this.sounds.diceRoll = new Audio('/effects/rolling-dice.mp3');

      // Preload them explicitly
      Object.values(this.sounds).forEach(audio => {
        audio.load();
      });

      // Load mute settings from localStorage
      try {
        const storedMute = localStorage.getItem('game_sound_muted');
        if (storedMute !== null) {
          this.muted = storedMute === 'true';
        }
      } catch (e) {
        console.error('Failed to access localStorage for sound settings:', e);
      }
    }
  }

  public play(soundName: 'ladder' | 'firstSix' | 'step' | 'snake' | 'win' | 'click') {
    if (this.muted) return;
    const audio = this.sounds[soundName];
    if (audio) {
      try {
        // Reset playhead to allow rapid successive plays (crucial for stepping)
        audio.currentTime = 0;
        audio.play().catch(err => {
          // Play might be blocked by browser autoplay policy until user interacts
          console.warn(`Failed to play sound: ${soundName}`, err);
        });
      } catch (e) {
        console.error(`Error playing sound: ${soundName}`, e);
      }
    }
  }

  public playDiceRoll() {
    if (this.muted) return;
    const audio = this.sounds.diceRoll;
    if (audio) {
      try {
        audio.loop = true;
        audio.currentTime = 0;
        audio.play().catch(err => {
          console.warn('Failed to play dice roll loop sound:', err);
        });
      } catch (e) {
        console.error('Error playing dice roll loop sound:', e);
      }
    }
  }

  public stopDiceRoll() {
    const audio = this.sounds.diceRoll;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        console.error('Error stopping dice roll loop sound:', e);
      }
    }
  }

  public setMute(mute: boolean) {
    this.muted = mute;
    if (mute) {
      this.stopDiceRoll();
    }
    try {
      localStorage.setItem('game_sound_muted', String(mute));
    } catch (e) {
      console.error('Failed to save sound settings to localStorage:', e);
    }
  }

  public isMuted() {
    return this.muted;
  }
}

export const soundManager = new SoundManager();
