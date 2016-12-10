import {loadJournal} from './storage';

const journal = loadJournal() || [];

const temp = {
  date: null,
  old: null
};

const account = {
  'completed': 0,
  'late': 0,
  'minutes': 0,
  'wallet': 0
};

export {journal, temp, account};