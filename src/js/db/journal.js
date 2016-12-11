import {loadJournal} from './storage';

const journal = loadJournal() || [];

export default journal;
