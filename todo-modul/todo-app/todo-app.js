


  let arrItems = [];
  let keyName= ""

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

  // создадим функцию для сохранения списков

  function saveList(arr, listName ){
    localStorage.setItem(listName, JSON.stringify(arr))
  }


  function createTodoAppLocalServer(container, title = 'Список дел', listName) {


    // задаем переменную для каждой функции переменная todoAppTitle для функции создания заголовка, todoItemForm для формы и todoList для списка дел
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    keyName = listName;

    // добавляем в контейнер созданные с помощью функций элементы В контейнер добавляем заголовок, форму (обращаем внимание todoItemForm.form) и лист
console.log(container)
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(keyName)
    console.log(localData)

    if(localData !==null && localData !== '') arrItems = JSON.parse(localData)

    for(const arrItem of arrItems){
      let todoItem = createTodoItem(arrItem);
      todoList.append(todoItem.item)
    }

    console.log(arrItems)

    todoItemForm.form.addEventListener('input', function () {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      }
    })

    // браузер создает событие submit на форме по нажатию на enter или на кнопку создание дела

    todoItemForm.form.addEventListener('submit', function (e) {
      // при нажатии кнопки (для отправки информации) мы используем submit а не click для того чтоб можно было совершить действие
      // не только кликом мыши но и клавишей enter
      // эта строчка предотвращает стандартное действие браузера, а имеено перезагрузку страницы при отправке формы
      e.preventDefault();

      // игнорируем создание элемента если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = true;
        return;
      }

      let objectItem = {
        id: createId(arrItems),
        name: todoItemForm.input.value,
        done: false,
      }

      arrItems.push(objectItem);

      saveList(arrItems, keyName)
      console.log(arrItems)

      // запишем в переменную значение введенных данных в импут
      let todoItem = createTodoItem(objectItem)
      // //  добавляем обработчики событий на кнопки

      // создаем и добавляем в список новое дело с названием из поля для ввода

      todoList.append(todoItem.item)

      // обнуляем значение в поле чтоб не пришлось стирать его вручную и деактивируем кнопку
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
    })
  }



  // создаем функцию которая будет добавлять дело, отмечать что дело сделано и удалять дело. В name будет хранится информация введенная пользователем


  function createTodoItem(obj) {

    // создаем элемент списка т.е. введенное дело
    let item = document.createElement('li');

    // кнопки помещаем в элемент, который красиво покажет их в одной группе

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // Устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = "Готово";
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = "Удалить";

    if (obj.done == true) {
      item.classList.add('list-group-item-success')
    }


    // в импуте есть кнопка 'готово ' при нажатии на которую добавляется класс list-group-item-success который окрашивает строчку с делом в зеленый цвет
    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      console.log(item.classList.contains('list-group-item-success'))


      for (const arrItem of arrItems) {

        if (obj.id == arrItem.id) {
          arrItem.done = !arrItem.done;
        }
        saveList(arrItems, keyName)
      }
    });

    // при нажатии на кнопку "удалить" всплывает сообщение с вопросом если ответ положительный "ок" значит это true  и  строка с делом удаляется

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();

        let currentName = item.firstChild.textContent
        console.log(obj.id)
        for (let i = 0; i < arrItems.length; i++) {
          console.log(obj.id)
          if (obj.id == arrItems[i].id) {
            arrItems.splice(i, 1)
          }
          saveList(arrItems, keyName)
        }
      }

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

  // функция создания массива дел. При добавлении объекта Дело добавляем его в наш массив дел


  // function createArrItem() {
  //   let arrItems = [];
  //   arrItems.push(createTodoItem.objectItem);
  //   console.log(createTodoItem.objectItem)
  //   console.log(arrItems)
  // }

  // Создадим функцию которая будет перебирать объекты в массиве и менять им свойство id прибавляя 1
  function createId(arr) {
    let id = 1;
    for (const item of arr) {
      id = Math.max(item.id) + 1;
    }
    return id
  }

  export {createTodoAppLocalServer};



