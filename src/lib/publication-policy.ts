/** Only links explicitly approved for the public portfolio belong here. */
export const approvedRepositoryUrls = [
  'https://github.com/SergeyMotynga/daily_organizer/tree/develop',
] as const;

export function isApprovedRepository(url: string): boolean {
  return approvedRepositoryUrls.some((approved) => approved === url);
}
