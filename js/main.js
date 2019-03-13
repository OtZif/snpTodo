let mass = JSON.parse(localStorage.getItem('todo')) == null ? [] : JSON.parse(localStorage.getItem('todo'));

function $(query) {
  return document.querySelector(query);
}

function $All(query) {
  return document.querySelectorAll(query);
}

// Счетчик задач
function countTasks() {
  const xx = $('#mainList').getElementsByTagName('li').length;
  const dxq = $('#mainList').getElementsByClassName('checked').length;
  const cdx = $('#ssds');

  if (xx === 1) {
    cdx.innerHTML = `${xx - dxq} item left`;
  } else if (xx > 1 || xx < 1) {
    cdx.innerHTML = `${xx - dxq} items left`;
  }
  return cdx;
}

// Карандаш выделения всехзадач
function modeOnToogle() {
  const allLi = $All('li');
  const liChecked = $All('.checked');

  if (allLi.length === 0) {
    $('#toggle-all').checked = false;
    $('.footer').style.display = 'none';
    $('.pen').style.display = 'none';
    return;
  }
  if (allLi.length > 0) {
    $('.pen').style.display = 'block';
    $('.footer').style.display = 'flex';
  }
  if (allLi.length === liChecked.length) {
    $('#toggle-all').checked = true;
    countTasks();
  } else {
    $('#toggle-all').checked = false;
    countTasks();
  }
}

// Фильтры
function changeMode() {
  const massClass = $All('.control--item');
  massClass.forEach(function (element) {
    if (element.classList.contains('selected')) {
      element.classList.remove('selected');
    }
  });
}

// Все задачи
function getAllTasks() {
  const tagLi = $All('li');
  tagLi.forEach(element => element.style.display = 'block');
}

// Активные задачи
function getActiveTasks() {
  const tagLi = $All('li');

  tagLi.forEach(function (element) {
    if (element.classList.contains('checked')) {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
    }
  });
}

// Завершенные задачи
function getCompletedTasks() {
  const tagLi = $All('li');

  tagLi.forEach(function (element) {
    if (element.classList.contains('checked') !== true) {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
    }
  });
}

// Все задачи
$('#filter-all').addEventListener('click', function () {
  changeMode();
  $('#filter-all').classList.add('selected');
  getAllTasks();
});

// Активные задачи
$('#filter-active').addEventListener('click', function () {
  changeMode();
  $('#filter-active').classList.add('selected');
  getActiveTasks();
});

// Завершенные задачи
$('#filter-completed').addEventListener('click', function () {
  changeMode();
  $('#filter-completed').classList.add('selected');
  getCompletedTasks();
});

// Показ кнопки - clearCompleted
function clearCompleted() {
  const listItems = $All('li');
  let x = 0;
  listItems.forEach(function (element) {
    if (element.classList.contains('checked') === true) {
      x += 1;
    }
  });
  if (x > 0) {
    $('#clearCompleted').style.visibility = 'visible';
  } else {
    $('#clearCompleted').style.visibility = 'hidden';
  }
}

// Выбор всех задач
function toggleAll() {
  function check() {
    const itemToggle = $All('.toggle');
    const thatLi = $All('li');

    itemToggle.forEach(element => element.checked = true);
    thatLi.forEach(element => element.classList.add('checked'));

    mass.forEach(function (item) {
      item.check = true;
    });
  }

  function uncheck() {
    const itemToggle = $All('.toggle');
    const thatLi = $All('li');

    itemToggle.forEach(element => element.checked = false);
    thatLi.forEach(element => element.classList.remove('checked'));

    mass.forEach(function (item) {
      item.check = false;
    });
  }

  // Выделяем все
  $('#toggle-all').addEventListener('click', function () {
    if ($('#toggle-all').checked === true) {
      check();
    } else {
      uncheck();
    }
    if ($('#filter-active').classList.contains('selected')) {
      getActiveTasks();
    }
    if ($('#filter-completed').classList.contains('selected')) {
      getCompletedTasks();
    }

    countTasks();
    clearCompleted();
    addLocal();
  });
}

function generateItems(mass) {
  const element = $('#newTask');

  mass.forEach(function (item) {
    element.value = item.label;

    if ('createEvent' in document) {
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', false, true);
      element.dispatchEvent(evt);
    } else {
      element.fireEvent('onchange');
    }
    const lastLi = $('#mainList').lastChild;
    lastLi.setAttribute('data-stamp', item.timeStamp);
    lastLi.dataset.stamp = item.timeStamp;

    if (item.check) {
      lastLi.classList.add('checked');
      lastLi.querySelector('.toggle').checked = true;
    }
  });

  countTasks();
  modeOnToogle();
  clearCompleted();
}

// Добавление задач
function addList(isOriginal) {
  if ($('#newTask').value.trim() === '') {
    return;
  }
  const newLi = document.createElement('li');
  const newDiv = document.createElement('div');
  const newInp = document.createElement('input');
  const newLab = document.createElement('label');
  const newButt = document.createElement('button');

  newLi.setAttribute('data-stamp', (new Date()).valueOf());
  newLi.dataset.stamp = (new Date()).valueOf();
  newButt.className = 'destroy';
  newInp.className = 'toggle';
  newInp.type = 'checkbox';
  newDiv.className = 'view';
  newLab.innerHTML = $('#newTask').value;
  $('#mainList').appendChild(newLi);
  newLi.appendChild(newDiv);
  newDiv.appendChild(newInp);
  newDiv.appendChild(newLab);
  newDiv.appendChild(newButt);

  function App() {
    this.label = newLab.textContent;
    this.check = newInp.checked === true;
    this.timeStamp = newLi.dataset.stamp;

    function Obj(label, check, timeStamp) {
      this.label = label;
      this.check = check;
      this.timeStamp = timeStamp;
    }

    const z = new Obj(this.label, this.check, this.timeStamp);
    mass.push(z);
  }

  if (isOriginal) {
    App();
    addLocal();
    countTasks();
  }

  // Удалить задачу по - х
  newButt.onclick = function () {
    const stamp = newLi.dataset.stamp;
    newLi.remove();
    mass = mass.filter(function (element) {
      return element.timeStamp != stamp;
    });

    addLocal();
    countTasks();
    modeOnToogle();
  };
  if ($('#filter-completed').classList.contains('selected')) {
    getCompletedTasks();
  }

  // Редактирование задачи
  newLab.addEventListener('dblclick', function () {
    newLi.classList.add('editing');
    const stamp = newLi.dataset.stamp;
    const edit = document.createElement('input');
    edit.className = 'edit';
    edit.value = newLab.textContent;
    newLi.appendChild(edit).focus();

    // Добавление задачи при нажатии Enter
    $('.edit').addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        if (edit.value !== '') {
          newLab.innerHTML = edit.value;
          newLi.classList.remove('editing');
          mass.forEach(function (item) {
            if (item.timeStamp == stamp) {
              item.label = edit.value;
            }
          });
          edit.remove();
        } else {
          newLi.remove();
          mass = mass.filter(function (element) {
            return element.timeStamp != stamp;
          });
        }

        addLocal();
        modeOnToogle();
      }
    });

    // Добавление задачи при клике в сторону(уход фокуса с input)
    $('body:not(li)').addEventListener('click', function () {
      if (edit.value !== '') {
        newLab.innerHTML = edit.value;
        newLi.classList.remove('editing');
        mass.forEach(function (item) {
          if (item.timeStamp == stamp) {
            item.label = edit.value;
          }
        });
        edit.remove();
      } else {
        newLi.remove();
        mass = mass.filter(function (element) {
          return element.timeStamp != stamp;
        });
      }

      addLocal();
      modeOnToogle();
      $('body:not(li)').removeEventListener('click', arguments.callee);
    });
  });
  // Добавление класса для отдельных задач
  newInp.addEventListener('change', function () {
    if (newLi.classList.contains('checked')) {
      newLi.classList.remove('checked');
      const stamp = newLi.dataset.stamp;
      mass.forEach(function (item) {
        if (item.timeStamp == stamp) {
          item.check = false;
        }
      });
      if ($('#filter-completed').classList.contains('selected')) {
        getCompletedTasks();
      }
    } else {
      newLi.classList.add('checked');
      const stamp = newLi.dataset.stamp;
      mass.forEach(function (item) {
        if (item.timeStamp == stamp) {
          item.check = true;
        }
      });
      if ($('#filter-active').classList.contains('selected')) {
        getActiveTasks();
      }
    }

    countTasks();
    modeOnToogle();
    clearCompleted();
    addLocal();
  });
}

function getSome() {
  $('#newTask').value = '';
  countTasks();
  modeOnToogle();
}

// Добавление задачи при нажатии Enter
$('#newTask').addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    addList();
    getSome();
  }
});

// Добавление задачи при клике в сторону(уход фокуса с input)
$('#newTask').addEventListener('change', function (event) {
  addList(event.isTrusted);
  getSome();
});

// Удаление Завершенных задач
$('#clearCompleted').addEventListener('click', function () {
  const completedLi = $All('li');

  completedLi.forEach(function (item) {
    if (item.classList.contains('checked')) {
      const stamp = item.dataset.stamp;

      mass = mass.filter(function (element) {
        return element.timeStamp != stamp;
      });

      addLocal();
      item.remove();
    }
  });

  clearCompleted();
  modeOnToogle();
});

function addLocal() {
  localStorage.setItem('todo', JSON.stringify(mass));
}

countTasks();
toggleAll();
modeOnToogle();
generateItems(mass);

