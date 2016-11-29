import {loadJournal} from './storage';

const journal = loadJournal() || [];

const temp = {
  date: null,
  old: null
};

const account = {
  'completed': 0,
  'late': 0,
  'spent time': [0, 0, 0],
  'wallet': 0
};

const DEFAULT_PRICE_TASK = 300;
const DEFAULT_PRICE_MINUTES = 60;

export {journal, temp, account};