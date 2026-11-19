/** Only links explicitly approved for the public portfolio belong here. */
export const approvedRepositoryUrls = [
  'https://github.com/SergeyMotynga/daily_organizer/tree/develop',
  'https://github.com/SergeyMotynga/AutomationML/tree/develop',
  'https://github.com/SergeyMotynga/Chess_Hackathon_backend/tree/develop',
  'https://github.com/SergeyMotynga/NLP_project',
  'https://github.com/SergeyMotynga/T-assistant_backend',
  'https://github.com/SergeyMotynga/Royality_backend/tree/develop',
  'https://github.com/SergeyMotynga/SPAS_system/tree/develop',
  'https://github.com/SergeyMotynga/Time_series_task',
] as const;

export function isApprovedRepository(url: string): boolean {
  return approvedRepositoryUrls.some((approved) => approved === url);
}
