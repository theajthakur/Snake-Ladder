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

  public play(soundName: 'ladder' | 'firstSix' | 'step' | 'snake' | 'win') {
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

  public setMute(mute: boolean) {
    this.muted = mute;
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
