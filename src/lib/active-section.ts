interface SectionPosition { id: string; top: number }

// Positions are in document order, measured from stationary scene frames.
export function selectActiveSection(sections: readonly SectionPosition[], activationLine: number, atEnd: boolean): string | null {
  if (atEnd) return sections.at(-1)?.id ?? null;
  let active: string | null = null;
  for (const section of sections) if (section.top <= activationLine) active = section.id;
  return active;
}
