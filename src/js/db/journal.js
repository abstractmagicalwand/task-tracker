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
  'wallet(usd)': 0
};

const DEFAULT_PRICE_TASK = 300;
const DEFAULT_PRICE_MINUTES = 60;

export {journal, temp, account, DEFAULT_PRICE_TASK, DEFAULT_PRICE_MINUTES};