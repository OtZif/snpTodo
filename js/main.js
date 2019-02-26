let mass = JSON.parse(localStorage.getItem('todo')) == null ? [] : JSON.parse(localStorage.getItem('todo'));
let generateItems = function () {
  let element = document.getElementById('newTask');
  mass.forEach(function (item) {
    element.value = item.label;
    if ('createEvent' in document) {
      let evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', false, true);
      element.dispatchEvent(evt);
    } else {
      element.fireEvent('onchange');
    }
    let lastLi = document.getElementById('mainList').lastChild;
    lastLi.setAttribute('data-stamp', item.timeStamp);
    lastLi.dataset.stamp = item.timeStamp;
    if (item.check) {
      lastLi.classList.add('checked');
      lastLi.querySelector('.toggle').checked = true;
    }
  });
  siZe();
  modeOnToogle();
  clearCompleted();
};

let addList = function (isOriginal) {
  if (document.getElementById('newTask').value.trim() === '') {
    return
  }
  let newLi = document.createElement('li');
  let newDiv = document.createElement('div');
  let newInp = document.createElement('input');
  let newLab = document.createElement('label');
  let newButt = document.createElement('button');
  newLi.setAttribute('data-stamp', (new Date()).valueOf());
  newLi.dataset.stamp = (new Date()).valueOf();
  newButt.className = 'destroy';
  newInp.className = 'toggle';
  newInp.type = 'checkbox';
  newDiv.className = 'view';
  newLab.innerHTML = document.getElementById('newTask').value;
  document.getElementById('mainList').appendChild(newLi);
  newLi.appendChild(newDiv);
  newDiv.appendChild(newInp);
  newDiv.appendChild(newLab);
  newDiv.appendChild(newButt);

  const App = function () {
    this.label = newLab.textContent;
    this.check = newInp.checked === true;
    this.timeStamp = newLi.dataset.stamp;

    function Obj(label, check, timeStamp) {
      this.label = label,
        this.check = check,
        this.timeStamp = timeStamp
    }

    const z = new Obj(this.label, this.check, this.timeStamp);
    mass.push(z);
  };

  if (isOriginal) {
    App();
    addLocal();
    siZe();
  }

  // Remove Task
  newButt.onclick = function () {
    let stamp = newLi.dataset.stamp;
    newLi.remove();
    mass = mass.filter(function (element) {
      return element.timeStamp != stamp;
    });
    addLocal();
    siZe();
    modeOnToogle();
  };
  if (showCompleted.classList.contains('selected')) {
    completedCh();
  }

  // Edit label
  newLab.addEventListener('dblclick', function () {
    newLi.classList.add('editing');
    let stamp = newLi.dataset.stamp;
    let edit = document.createElement('input');
    edit.className = 'edit';
    edit.value = newLab.textContent;
    newLi.appendChild(edit).focus();

    //Добавление задачи при нажатии Enter
    document.querySelector('.edit').addEventListener('keyup', function (event) {
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

    //Добавление задачи при клике в сторону(уход фокуса с input)
    document.querySelector('body:not(li)').addEventListener('click', function () {
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
      document.querySelector('body:not(li)').removeEventListener('click', arguments.callee);
    });

  });
// Добавление класса для отдельныхзадач
  newInp.addEventListener('change', function () {
    if (newLi.classList.contains('checked')) {
      newLi.classList.remove('checked');
      let stamp = newLi.dataset.stamp;
      mass.forEach(function (item) {
        if (item.timeStamp == stamp) {
          item.check = false;
        }
      });
      if (showCompleted.classList.contains('selected')) {
        completedCh();
      }
    } else {
      newLi.classList.add('checked');
      let stamp = newLi.dataset.stamp;
      mass.forEach(function (item) {
        if (item.timeStamp == stamp) {
          item.check = true;
        }
      });
      if (showActive.classList.contains('selected')) {
        activeCh();
      }
    }
    siZe();
    modeOnToogle();
    clearCompleted();
    addLocal();
  });
};
//карандаш выделения всехзадач
const modeOnToogle = function () {
  let allLi = document.getElementsByTagName('li');
  let liChecked = document.getElementsByClassName('checked');
  if (allLi.length === 0) {
    document.getElementById('toggle-all').checked = false;
    document.querySelector('.footer').style.display = 'none';
    document.querySelector('.pen').style.display = 'none';
    return
  }
  if (allLi.length > 0) {
    document.querySelector('.pen').style.display = 'block';
    document.querySelector('.footer').style.display = 'flex';
  }
  if (allLi.length === liChecked.length) {
    document.getElementById('toggle-all').checked = true;
    siZe();
  } else {
    document.getElementById('toggle-all').checked = false;
    siZe();
  }
};
modeOnToogle();

//Выбор всех задач
const toggleAll = function () {
  function check() {
    let itemToggle = document.getElementsByClassName('toggle');
    let thatli = document.getElementsByTagName('li');
    for (let i = 0; i < itemToggle.length; i++) {
      itemToggle[i].checked = true;
      thatli[i].classList.add('checked');
    }
    mass.forEach(function (item) {
      item.check = true;
    });
  }

  function uncheck() {
    let itemToggle = document.getElementsByClassName('toggle');
    let thatli = document.getElementsByTagName('li');
    for (let i = 0; i < itemToggle.length; i++) {
      itemToggle[i].checked = false;
      thatli[i].classList.remove('checked');
    }
    mass.forEach(function (item) {
      item.check = false;
    });
  }

  /*Выделяем все*/
  document.getElementById('toggle-all').addEventListener('click', function () {
    if (document.getElementById('toggle-all').checked === true) {
      check();
    } else {
      uncheck();
    }
    if (showActive.classList.contains('selected')) {
      activeCh();
    }
    if (showCompleted.classList.contains('selected')) {
      completedCh();
    }
    siZe();
    clearCompleted();
    addLocal();
  });
};
toggleAll();

/*Счетчик задач*/
let siZe = function () {
  let xx = document.getElementById('mainList').getElementsByTagName('li').length;
  let dxq = document.getElementById('mainList').getElementsByClassName('checked').length;
  let cdx = document.getElementById('ssds');
  if (xx === 1) {
    cdx.innerHTML = xx - dxq + ' item left';
  } else if (xx > 1 || xx < 1) {
    cdx.innerHTML = xx - dxq + ' items left'
  }
  return cdx;
};
siZe();

//Добавление задачи при нажатии Enter
document.getElementById('newTask').addEventListener('keyup', function (event) {
  //event.preventDefault();
  if (event.keyCode === 13) {
    addList();
    document.getElementById('newTask').value = '';
    siZe();
    modeOnToogle();
  }
});

//Добавление задачи при клике в сторону(уход фокуса с input)
document.getElementById('newTask').addEventListener('change', function (event) {
  addList(event.isTrusted);
  document.getElementById('newTask').value = '';
  siZe();
  modeOnToogle();
});

//Удаление Завершенных задач
document.getElementById('clearCompleted').addEventListener('click', function () {
  let compitedLi = document.getElementsByTagName('li');
  for (let j = 0; j < compitedLi.length; j++) {
    if (compitedLi[j].classList.contains('checked')) {
      let stamp = compitedLi[j].dataset.stamp;
      mass = mass.filter(function (element) {
        return element.timeStamp != stamp;
      });
      addLocal();
      compitedLi[j].remove();
      j = j - 1;
    }
  }
  clearCompleted();
  modeOnToogle();
});

// Filters
const massClass = document.getElementsByClassName('control--item');
const tagLi = document.getElementsByTagName('li');

// Show All Tasks
const showAll = document.querySelector('#filter-all');
showAll.addEventListener('click', function () {
  massPer();
  showAll.classList.add('selected');
  allCh();
});

// Show Active
const showActive = document.querySelector('#filter-active');
showActive.addEventListener('click', function () {
  massPer();
  showActive.classList.add('selected');
  activeCh();
});

// Show Completed
const showCompleted = document.querySelector('#filter-completed');
showCompleted.addEventListener('click', function () {
  massPer();
  showCompleted.classList.add('selected');
  completedCh();
});

const massPer = function () {
  for (let i = 0; i < massClass.length; i++) {
    if (massClass[i].classList.contains('selected')) {
      massClass[i].classList.remove('selected');
    }
  }
};
//Активные задачи
const activeCh = () => {
  for (let i = 0; i < tagLi.length; i++) {
    if (tagLi[i].classList.contains('checked')) {
      tagLi[i].style.display = 'none';
    } else {
      tagLi[i].style.display = 'block';
    }
  }
};
//Завершенные задачи
const completedCh = () => {
  for (let i = 0; i < tagLi.length; i++) {
    if (tagLi[i].classList.contains('checked') !== true) {
      tagLi[i].style.display = 'none';
    } else {
      tagLi[i].style.display = 'block';
    }
  }
};
//Все задачи
const allCh = () => {
  for (let i = 0; i < tagLi.length; i++) {
    tagLi[i].style.display = 'block';
  }
};

//Показ кнопки - clearCompleted
const clearCompleted = function () {
  let sas = document.getElementsByTagName('li');
  let x = 0;
  for (let i = 0; i < sas.length; i++) {
    if (sas[i].classList.contains('checked') === true) {
      x = x + 1;
    }
  }
  if (x > 0) {
    document.querySelector('#clearCompleted').style.visibility = 'visible';
  } else {
    document.querySelector('#clearCompleted').style.visibility = 'hidden';
  }
};

let addLocal = function () {
  localStorage.setItem('todo', JSON.stringify(mass));
};
generateItems();