const Clone = SuperClass => class extends SuperClass {
  cloneDeep(orig) {
    function cloneObj(obj) {
      const o = {},
        switchCaseObj = switchCase.bind(null, o, obj);

      for (let key in obj) {

        if (obj.hasOwnProperty(key)) switchCaseObj(key);

      }

      return o;
    }

    function cloneArr(arr) {
      const a = [],
        switchCaseArr = switchCase.bind(null, a, arr);

      for (let i = 0; i < arr.length; i += 1) switchCaseArr(i);

      return a;
    }

    function switchCase(copy, orig, prop) {
      switch (checkType(orig[prop])) {
      case 1:
        copy[prop] = orig[prop];
        break;
      case 2:
        copy[prop] = cloneArr(orig[prop]);
        break;
      case 3:
        copy[prop] = cloneObj(orig[prop]);
        break;
      }
    }

    function checkType(orig) {
      if (typeof orig !== 'object'
        || orig === null
        || orig instanceof Date) {
        return 1;
      }

      if (Array.isArray(orig)) return 2;
      else return 3;
    }

    switch (checkType(orig)) {
    case 1:
      return orig;
    case 2:
      return cloneArr(orig);
    case 3:
      return cloneObj(orig);
    }
  }
};

export default Clone;