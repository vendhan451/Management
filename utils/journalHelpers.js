// Journal Entry Model and Helpers
export function getJournalEntries() {
  return JSON.parse(localStorage.getItem('journalEntries') || '[]');
}

export function saveJournalEntry(entry) {
  const entries = getJournalEntries();
  entries.push(entry);
  localStorage.setItem('journalEntries', JSON.stringify(entries));
}

export function findTodayJournal(employeeId, projectId) {
  const today = new Date().toISOString().split('T')[0];
  return getJournalEntries().find(e => e.date === today && e.employeeId === employeeId && e.projectId === projectId);
}
