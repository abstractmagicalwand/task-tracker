import Lockr from 'lockr';

function getArrSMH(old) {
  const s = ms => Math.round(((new Date().getTime() - ms) / 1000) % 60);
  const m = ms => Math.round(((new Date().getTime() - ms) / (1000 * 60)) % 60);
  const h = ms => {
    return Math.round(((new Date().getTime() - ms) / (1000 * 60 * 60)) % 24);
  };

  return [h(old), m(old), s(old)];
}

function load(db) {

  if (db) {
    Lockr.set('db', db);
  } else {
    const oldDB = Lockr.get('db');
    return oldDB;
  }

}

export {load, diffArrs, getArrSMH, addArrs};