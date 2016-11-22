import Lockr from 'lockr';

/*function getFromMsToSMH(old) {
  const s = ms => Math.round(((new Date().getTime() - ms) / 1000) % 60);
  const m = ms => Math.round(((new Date().getTime() - ms) / (1000 * 60)) % 60);
  const h = ms => {
    return Math.round(((new Date().getTime() - ms) / (1000 * 60 * 60)) % 24);
  };

  return [h(old), m(old), s(old)];
}*/

function load(db) {
  console.log(db)
  if (!db && !Lockr.get('db')) return false;

  if (db) {
    Lockr.set('db', db);
  } else {
    return Lockr.get('db');
  }

}

export {load};