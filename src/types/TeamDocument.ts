interface StandUpQuestionsTypes {
  id: string;
  questions: string[];
  reminderTimes: string[];
  standupTimes: string[];
  standupDays: string[];
}

interface TeamDocumentTypes {
  id: string;
  members: string[];
  name: string;
  teamId: string;
  timeZone: string;
  teamstandupQuestions: StandUpQuestionsTypes[];
}