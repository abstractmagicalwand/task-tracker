import Lockr from 'lockr';

function load(db) {
  if (!db && !Lockr.get('db')) return false;

  if (db) Lockr.set('db', db);
  else return Lockr.get('db');
}

function loadJournal(journal) {
  if (!journal && !Lockr.get('journal')) return false;

  if (journal) Lockr.set('journal', journal);
  else return Lockr.get('journal');
}

export {load, loadJournal};