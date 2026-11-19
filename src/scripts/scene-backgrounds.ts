const videos = [...document.querySelectorAll<HTMLVideoElement>('[data-scene-video]')];

if (videos.length && 'IntersectionObserver' in window) {
  const staticOnly = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const visible = new Set<HTMLVideoElement>();

  function sync(video: HTMLVideoElement): void {
    if (staticOnly.matches || document.hidden || !visible.has(video)) {
      video.pause();
      return;
    }
    if (video.ended || video.error) return;
    const source = video.dataset.sceneVideo;
    if (!source) return;
    if (!video.hasAttribute('src')) video.src = source;
    void video.play().catch(() => { /* Blocked playback keeps the static background. */ });
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) visible.add(video);
      else visible.delete(video);
      sync(video);
    }
  });

  for (const video of videos) {
    video.addEventListener('playing', () => {
      if (!staticOnly.matches) video.dataset.started = '';
    });
    video.addEventListener('error', () => { delete video.dataset.started; });
    observer.observe(video);
  }
  document.addEventListener('visibilitychange', () => videos.forEach(sync));
  staticOnly.addEventListener('change', () => {
    for (const video of videos) {
      if (staticOnly.matches && video.hasAttribute('src')) {
        delete video.dataset.started;
        video.removeAttribute('src');
        video.load();
      }
      sync(video);
    }
  });
}
