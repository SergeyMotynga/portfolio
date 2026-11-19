# Визуальные адаптации

React Bits (David Haz, 2026), https://reactbits.dev/: ElasticMesh, Lanyard, Silk и CrystalizedBall перенесены из предоставленного владельцем JavaScript/CSS-кода в нативные DOM/WebGL-модули. Сохранены shader/physics реализации; React lifecycle заменён mount/dispose, добавлены fallback, ограничения DPR, отсутствие breeze, клавиатурный flip и нативный touch-scroll. Портфолио использует компоненты в составе сайта. Полный MIT + Commons Clause — `public/licenses/react-bits.txt`; компоненты и их порты нельзя распространять как самостоятельный набор.

FlipCard, GlareHover и Magnet из тех же примеров использованы как ориентир нативных CSS/TypeScript-взаимодействий: две стороны карточки, блик, наклон и ограниченное притяжение к курсору.

Motion Primitives TextEffect (Julien Thibeaut / ibelick, 2024), https://motion-primitives.com/docs/text-effect: preset blur реализован средствами Web Animations API без React/Motion; MIT — `public/licenses/motion-primitives.txt`.

Three.js поставляется зависимостью npm со своей MIT-лицензией. Модуль бейджа (~590 КБ до сжатия в текущей сборке) загружается отдельно от базового скрипта, поэтому HTML, ссылки и статичный бейдж доступны раньше. При reduced motion 3D не загружается. ElasticMesh также отдельный модуль; на coarse-pointer остаётся обычный текст. Это осознанная стоимость запрошенной физической 3D-сцены.

Лицевая сторона portrait-badge.svg использует фотографию владельца, предоставленную для бейджа из outputs. Фотография встроена в SVG без внешних запросов, ретуши и изменения пропорций; подписи, рамка и обратная сторона — собственное оформление проекта. Один файл используется как текстура 3D и статичный fallback.

CrystalizedBall использует OGL (MIT), устанавливаемый зависимостью npm. Порты сохраняют исходные shader-эффекты, заменяя React lifecycle на mount/dispose и отключая автодвижение через четыре секунды.

Локальные Tanker Regular и Bespoke Serif Regular получены из архива владельца и распространяются с Fontshare Free Font License (`public/licenses/fontshare-ffl.txt`). Кириллица отсутствует в исходных файлах. Для неё добавлены локальные подмножества Oswald (variable 200–700) и PT Serif Regular из официального google/fonts, SIL OFL 1.1 (`public/licenses/oswald-ofl.txt`, `ptserif-ofl.txt`). Исходники: https://github.com/google/fonts/tree/main/ofl/oswald и https://github.com/google/fonts/tree/main/ofl/ptserif. Подмножества сохраняют лицензию; внутреннее имя модифицированного PT Serif заменено на Portfolio Cyrillic Serif согласно Reserved Font Names. Оригинальные TTF не включены.

ContactNumbers.ttf — подмножество цифр PT Serif Regular из того же источника и под той же OFL. Внутреннее имя изменено на Portfolio Contact Numbers согласно Reserved Font Names. Оно используется только в контактных строках, чтобы цифры имели общую базовую линию и высоту.

Обложки в public/images/projects — собственные SVG-иллюстрации портфолио. Не являются скриншотами коммерческих продуктов, не используют чужие логотипы или реальные данные. Обложка ограниченного кейса с календарём и часами не воспроизводит его графики, данные или материалы.

Silk: https://reactbits.dev/backgrounds/silk, исходник https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Backgrounds/Silk/Silk.tsx. Исходные shader-формулы и реакция на указатель адаптированы под mount/dispose без React; добавлены ограничение пикселей, четырёхсекундный автоход, touch/reduced-motion fallback и очистка ресурсов. Применяется та же лицензия React Bits в public/licenses/react-bits.txt.

Target Cursor: https://reactbits.dev/animations/target-cursor — ориентир поведения четырёх уголков. Реализация в src/scripts/target-cursor.ts написана на native DOM/TypeScript без React, GSAP и дополнительных зависимостей; обычный указатель остаётся видимым.

Фоны секций в `public/images/scenes/` — короткие ролики WebM и статичные кадры шейдеров React Bits [Topography](https://reactbits.dev/backgrounds/topography), [Side Rays](https://reactbits.dev/backgrounds/side-rays), [Line Waves](https://reactbits.dev/backgrounds/line-waves) и [Soft Aurora](https://reactbits.dev/backgrounds/soft-aurora), настроенных под палитру сайта. Они получены из [исходников React Bits](https://github.com/DavidHDev/react-bits/tree/d01aa914dcbe76da8b2923ebf872b5c8b1066e4c/src/ts-default/Backgrounds) и используются в составе портфолио по условиям `public/licenses/react-bits.txt`.
