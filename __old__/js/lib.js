const lib = {
  tick(time, func) {
    let h = +time[0],
        m = +time[1],
        s = +time[2];

    [h, m, s] = func(h, m, s);

    return [
      h < 10 ? `0${h}` : `${h}`,
      m < 10 ? `0${m}` : `${m}`,
      s < 10 ? `0${s}` : `${s}`
    ];
  },

  getTask(list, id) {
    let needIndex;

    list.forEach(function(item, index) {
        if (item.id == id) needIndex = index;
    });

    return {
      list: list,
      index: needIndex
    };
  },

  getPropTask(list, field, type, task, value) {
    let f;

    switch (type) {
    case 'field':
        f = (task ?  function(item, index) {
          if (field in item)  return item;
        } : function(item, index) {
          if (field in item)  return item[field];
        });
        break;
    case 'value':
        f = (task ? function(item, index) {
          if (~item[field].indexOf(value))  return item;
        } : function(item, index) {
          if (~item[field].indexOf(value))  return item[field];
        });
        break;
    default:
        break;
    }

    return list.map(f);
  },

  getAllTask(list) {
    return list.filter(item => {
      if (~item.project.indexOf('@')) return item;
      if (~item.project.indexOf('SANS')) return item;
    }).reduce((sum, item) => {
      return sum.concat(item.tasks);
    }, []);
  },

};

const emitter = new EventEmitter();