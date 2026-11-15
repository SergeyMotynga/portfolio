# Визуальные адаптации

React Bits (David Haz, 2026), https://reactbits.dev/: ElasticMesh и Lanyard перенесены из предоставленного владельцем JavaScript/CSS-кода в нативные DOM/WebGL-модули. Сохранены shader/physics реализации; React lifecycle заменён mount/dispose, добавлены fallback, ограничения DPR, отсутствие breeze, клавиатурный flip и нативный touch-scroll. Портфолио использует компоненты в составе сайта. Полный MIT + Commons Clause — `public/licenses/react-bits.txt`; компоненты и их порты нельзя распространять как самостоятельный набор.

FlipCard, GlareHover и Magnet из тех же примеров использованы как ориентир нативных CSS/TypeScript-взаимодействий: две стороны карточки, блик, наклон и ограниченное притяжение к курсору.

Motion Primitives TextEffect (Julien Thibeaut / ibelick, 2024), https://motion-primitives.com/docs/text-effect: preset blur реализован средствами Web Animations API без React/Motion; MIT — `public/licenses/motion-primitives.txt`.

Three.js поставляется зависимостью npm со своей MIT-лицензией. Модуль бейджа (~590 КБ до сжатия в текущей сборке) загружается отдельно от базового скрипта, поэтому HTML, ссылки и статичный котик доступны раньше. При reduced motion 3D не загружается. ElasticMesh также отдельный модуль; на coarse-pointer остаётся обычный текст. Это осознанная стоимость запрошенной физической 3D-сцены.

Картинки котика и обратной стороны — собственные SVG проекта. Для замены фотографией меняется `data-front` в `HeroBadge.astro`.
