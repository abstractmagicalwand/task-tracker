import {loadJournal} from './local-storage';

const journal = loadJournal() || [];

const tmp = {
  date: null,
  old: null
};
console.log(journal)
export {journal, tmp};