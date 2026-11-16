# Визуальные адаптации

React Bits (David Haz, 2026), https://reactbits.dev/: ElasticMesh, Lanyard, MoltenMetal и CrystalizedBall перенесены из предоставленного владельцем JavaScript/CSS-кода в нативные DOM/WebGL-модули. Сохранены shader/physics реализации; React lifecycle заменён mount/dispose, добавлены fallback, ограничения DPR, отсутствие breeze, клавиатурный flip и нативный touch-scroll. Портфолио использует компоненты в составе сайта. Полный MIT + Commons Clause — `public/licenses/react-bits.txt`; компоненты и их порты нельзя распространять как самостоятельный набор.

FlipCard, GlareHover и Magnet из тех же примеров использованы как ориентир нативных CSS/TypeScript-взаимодействий: две стороны карточки, блик, наклон и ограниченное притяжение к курсору.

Motion Primitives TextEffect (Julien Thibeaut / ibelick, 2024), https://motion-primitives.com/docs/text-effect: preset blur реализован средствами Web Animations API без React/Motion; MIT — `public/licenses/motion-primitives.txt`.

Three.js поставляется зависимостью npm со своей MIT-лицензией. Модуль бейджа (~590 КБ до сжатия в текущей сборке) загружается отдельно от базового скрипта, поэтому HTML, ссылки и статичный котик доступны раньше. При reduced motion 3D не загружается. ElasticMesh также отдельный модуль; на coarse-pointer остаётся обычный текст. Это осознанная стоимость запрошенной физической 3D-сцены.

Картинки котика и обратной стороны — собственные SVG проекта. Для замены фотографией меняется `data-front` в `HeroBadge.astro`.

CrystalizedBall использует OGL (MIT), устанавливаемый зависимостью npm. Порты сохраняют исходные shader-эффекты, заменяя React lifecycle на mount/dispose и отключая автодвижение через четыре секунды.

Локальные Tanker Regular и Bespoke Serif Regular получены из архива владельца и распространяются с Fontshare Free Font License (`public/licenses/fontshare-ffl.txt`). Кириллица отсутствует в исходных файлах. Для неё добавлены локальные подмножества Oswald (variable 200–700) и PT Serif Regular из официального google/fonts, SIL OFL 1.1 (`public/licenses/oswald-ofl.txt`, `ptserif-ofl.txt`). Исходники: https://github.com/google/fonts/tree/main/ofl/oswald и https://github.com/google/fonts/tree/main/ofl/ptserif. Подмножества сохраняют лицензию; внутреннее имя модифицированного PT Serif заменено на Portfolio Cyrillic Serif согласно Reserved Font Names. Оригинальные TTF не включены.

ContactNumbers.ttf — подмножество цифр PT Serif Regular из того же источника и под той же OFL. Внутреннее имя изменено на Portfolio Contact Numbers согласно Reserved Font Names. Оно используется только в контактных строках, чтобы цифры имели общую базовую линию и высоту.

Обложки в public/images/projects — собственные SVG-иллюстрации портфолио. Не являются скриншотами коммерческих продуктов, не используют чужие логотипы или реальные данные. Обложка ограниченного кейса с календарём и часами не воспроизводит его графики, данные или материалы.
