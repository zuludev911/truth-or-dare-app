/**
 * Registro compartido de anuncios a pantalla completa. Al cerrar un intersticial
 * o un video la app vuelve a primer plano, y sin esto el anuncio de apertura se
 * mostraría justo después de otro anuncio (Google lo penaliza).
 */
let lastFullscreenAdAt = 0;
let isFullscreenAdShowing = false;

export const markFullscreenAdOpened = () => {
  isFullscreenAdShowing = true;
};

export const markFullscreenAdClosed = () => {
  isFullscreenAdShowing = false;
  lastFullscreenAdAt = Date.now();
};

export const wasFullscreenAdRecent = (withinMs = 60 * 1000) =>
  isFullscreenAdShowing || Date.now() - lastFullscreenAdAt < withinMs;
