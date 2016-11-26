import {loadJournal} from './local-storage';

const journal = loadJournal() || [];

const tmp = {
  date: 0,
  old: 0
};

export {journal, tmp};