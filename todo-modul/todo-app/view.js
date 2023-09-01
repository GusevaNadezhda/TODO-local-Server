let arrItems = [];
let keyName = ""

// создаем и возвращаем заголовок приложения
function createAppTitle(title) {
  // Создаем заголовок и записываем его в переменную appTitle
  let appTitle = document.createElement('h2');
  // обозначаем что наша переменная будет равна заголовку который можно записать в коде и изменять в случае необходимости,
  // поэтому мы не пишем тестом а создаем специальны аргумент title
  appTitle.innerHTML = title;
  // результатом работы нашей функции будет создание заголовка
  return appTitle
}

// создаем и возвращаем форму для создания дела
function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let button = document.createElement('button');

  // добавляем классы к тэгам (классы соответствуют классам bootstrap для стилизации)

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = "Введите название нового дела";
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';
  button.disabled = true;
  // далее формируем структуру разметки. В форму вкладываем input и buttonWrapper, а в buttonWrapper вложена button

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper)
  // В результате у нас получается form в котором есть input поле для ввода дела и div в котором кнопка Добавить дело
  // возвращаем что нам нужно отразить в разметке

  return {
    form,
    input,
    button
  };
}

// создаем и возвращаем список элементов
function createTodoList() {

  // тут мы создаем список в который будут попадать добавленные дела
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

// // создадим функцию для сохранения списков

// function saveList(arr, listName ){
//   localStorage.setItem(listName, JSON.stringify(arr))
// }


function createTodoApp(container, {
  title,
  listName,
  todoItemList = [],
  onCreateFormSubmit,
  onDoneClick,
  onDeleteClick }) {


  // onCreateFormSubmit - функция создания нового дела при submit формы

  // задаем переменную для каждой функции переменная todoAppTitle для функции создания заголовка, todoItemForm для формы и todoList для списка дел
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();
  const handlers = { onDone: onDoneClick, onDelete: onDeleteClick }
  keyName = listName;

  // добавляем в контейнер созданные с помощью функций элементы В контейнер добавляем заголовок, форму (обращаем внимание todoItemForm.form) и лист

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  // let localData = localStorage.getItem(keyName)

  // if(localData !==null && localData !== '') arrItems = JSON.parse(localData)

  todoItemList.forEach(todoItem => {
    let todoItemElement = createTodoItem(todoItem, handlers);
    todoList.append(todoItemElement.item)
  })


  todoItemForm.form.addEventListener('input', function () {
    if (todoItemForm.input.value) {
      todoItemForm.button.disabled = false;
    }
  })

  // браузер создает событие submit на форме по нажатию на enter или на кнопку создание дела

  todoItemForm.form.addEventListener('submit', async function (e) {
    // при нажатии кнопки (для отправки информации) мы используем submit а не click для того чтоб можно было совершить действие
    // не только кликом мыши но и клавишей enter
    // эта строчка предотвращает стандартное действие браузера, а имеено перезагрузку страницы при отправке формы
    e.preventDefault();

    // игнорируем создание элемента если пользователь ничего не ввел в поле
    if (!todoItemForm.input.value) {
      todoItemForm.button.disabled = true;
      return;
    }


    let todoItem = await onCreateFormSubmit({
      name: todoItemForm.input.value.trim(),
      owner: listName,
    })

    // let objectItem = {
    //   id: createId(arrItems),
    //   name: todoItemForm.input.value,
    //   done: false,
    // }

    arrItems.push(todoItem);

    // saveList(arrItems, keyName)
    console.log(arrItems)

    // запишем в переменную значение введенных данных в импут
    let todoItemElement = createTodoItem(todoItem, handlers)
    // //  добавляем обработчики событий на кнопки

    // создаем и добавляем в список новое дело с названием из поля для ввода

    todoList.append(todoItemElement.item)

    // обнуляем значение в поле чтоб не пришлось стирать его вручную и деактивируем кнопку
    todoItemForm.button.disabled = true;
    todoItemForm.input.value = '';
  })

}


// создаем функцию которая будет добавлять дело, отмечать что дело сделано и удалять дело. В name будет хранится информация введенная пользователем


function createTodoItem(todoItem, { onDone, onDelete }) {

  console.log(todoItem)

  // создаем элемент списка т.е. введенное дело
  let item = document.createElement('li');

  // кнопки помещаем в элемент, который красиво покажет их в одной группе

  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  // Устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex

  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  item.textContent = todoItem.name;

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = "Готово";
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = "Удалить";

  if (todoItem.done == true) {
    item.classList.add('list-group-item-success')
  }

  // в импуте есть кнопка 'готово ' при нажатии на которую добавляется класс list-group-item-success который окрашивает строчку с делом в зеленый цвет
  doneButton.addEventListener('click', () => {
    onDone({ todoItem, element: item })
    item.classList.toggle('list-group-item-success');
    console.log(item.classList.contains('list-group-item-success'))


  });

  // при нажатии на кнопку "удалить" всплывает сообщение с вопросом если ответ положительный "ок" значит это true  и  строка с делом удаляется

  deleteButton.addEventListener('click', () => {
    onDelete({ todoItem, element: item })
  });



  // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup)

  // создадим объект Дело со свойствами id которое будет принимать значение из функции createId, name которое будет принимать значение name
  // из функции createTodoItem и состояние true сделано и folse не сделано



  // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия

  return {
    item,
    doneButton,
    deleteButton,
  }
}

// Создадим функцию которая будет перебирать объекты в массиве и менять им свойство id прибавляя 1
function createId(arr) {
  let id = 1;
  for (const item of arr) {
    id = Math.max(item.id) + 1;
  }
  return id
}

export { createTodoApp };

export async function createButtonForChooseStorage(listName, title,container) {
  const chooseStorage = document.querySelector('#choose-storage');
  const chooseButon = document.createElement('button');
  // const container = container
  let { createTodoAppLocalServer } = await import('./todo-app.js')
      // chooseButon.id = 'серверное хранилище'


  // const listName = listName;

  chooseButon.classList.add('btn', 'choose-button', 'btn-warning', 'choose-local')
  chooseButon.textContent = `Перейти на серверное хранилище`

  createTodoAppLocalServer(container, title, listName);

  // chooseButon.textContent = `Перейти на ${chooseButon.id}`


  chooseButon.addEventListener('click', async () => {

    container.innerHTML = ''
    chooseButon.classList.toggle('choose-local')

    if (!chooseButon.classList.contains('choose-local')) {
      chooseButon.textContent = `Перейти на локальное хранилище`
      // createTodoApp()
      let {
        getTodoList,
        createTodoItem,
        switchTodoItemDone,
        deleteTodoItem
      } = await import('./api.js')

      // const listName = "myList";
      // (async ()=>{
      const todoItemList = await getTodoList(listName);
      console.log(todoItemList)
      createTodoApp(container, {
        title,
        listName,
        todoItemList,
        onCreateFormSubmit: createTodoItem,
        onDoneClick: switchTodoItemDone,
        onDeleteClick: deleteTodoItem
      });
      // })()
      // chooseButon.id = 'локальное хранилище'
    } else {
      chooseButon.textContent = `Перейти на серверное хранилище`
      // let { createTodoAppLocalServer } = await import('./todo-app.js')
      // chooseButon.id = 'серверное хранилище'
      createTodoAppLocalServer(container, title, listName);

    }
  })

  chooseStorage.append(chooseButon)
}

function chooseList (){

  // const myList = document.getElementsByClassName('my-list')
  // const momList = document.getElementsByClassName('mom-list')
  // const dadList = document.getElementsByClassName('dad-list')

  // console.log(myList)

  // myList.addEventListener('submit', function() {
  //   alert('мой лист')
  //   const myContainer = document.getElementById('todo-app-my')
  //   createButtonForChooseStorage("myList", "Мои дела", myContainer)
  // })

const myContainer = document.getElementById('todo-app-my')
  const momContainer = document.getElementById('todo-app-mom')
  const dadContainer = document.getElementById('todo-app-dad')

 createButtonForChooseStorage("myList", "Мои дела", myContainer)
    createButtonForChooseStorage("momList" , "Дела мамы", momContainer )
    createButtonForChooseStorage("dadList", "Дела папы", dadContainer)

}

    chooseList()
