import {loadJournal} from './local-storage';

const journal = loadJournal() || [];

export {journal};