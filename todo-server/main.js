(function () {
let students = []

const $studentList = document.getElementById("student-list"),
  $studentsTHAll = document.querySelectorAll('.studentTable th')

let column = 'birthdate',
  columDir = true

function getNewStudent(student, { onDelete }) {
  const $studentTR = document.createElement('tr');
  const $fioTD = document.createElement('td');
  const $facultyTD = document.createElement('td');
  const $birthdayTD = document.createElement('td');
  const $studyPeriodTD = document.createElement('td');
  // *************************
  const $deleteTD = document.createElement('td');
  const $deleteButton = document.createElement('button');


  $deleteButton.addEventListener('click', function (e) {
    e.preventDefault;
    onDelete({ student, element: $studentTR });
  });


  $fioTD.textContent = student.surname + ' ' + student.name + ' ' + student.lastname
  $facultyTD.textContent = student.faculty


  function addZero(num) {
    return (num < 10) ? "0" + num : num;
  }

  let birthdate = new Date(student.birthday)
  let formatDay = birthdate.getDate();
  let formatMonth = (birthdate.getMonth() + 1);
  let formatYear = birthdate.getFullYear();
  let formatBirthday = addZero(formatDay) + '.' + addZero(formatMonth) + '.' + formatYear
  const today = new Date()
  let age = (today.getFullYear() - formatYear)
  let m = today.getMonth() - formatMonth;
  if (m < 0 || (m == 0 && today.getDate() < formatDay)) {
    age--
  }
  let checkAge = String(age)
  if (checkAge.endsWith('1')) {
    age = age + ' год'
  } else
    if (checkAge.endsWith('2') || checkAge.endsWith('3') || checkAge.endsWith('4')) {
      age = age + ' года'
    } else {
      age = age + ' лет'
    }

  $birthdayTD.textContent = formatBirthday + ' ' + '(' + age + ')'

  let StudyPeriod = student.studyStart + ' - ' + (+student.studyStart + 4)
  let cours = (today.getFullYear() - + student.studyStart)
  if (today.getMonth() > 8) {
    cours = cours + 1
  }
  (cours > 4) ? cours = ('закончил') : cours = cours + ' курс'


  $studyPeriodTD.textContent = StudyPeriod + ' ' + '(' + cours + ')'
  // *************************
  $deleteButton.classList.add('btn', 'btn-danger');
  $deleteButton.textContent = "Удалить";
  // *************************
  $studentTR.append($fioTD)
  $studentTR.append($facultyTD)
  $studentTR.append($birthdayTD)
  $studentTR.append($studyPeriodTD)

  // *************************
  $studentTR.append($deleteTD)
  $deleteTD.append($deleteButton)


  // *************************
  return $studentTR
}


function createForm() {
  let form = document.querySelector('#form');
  for (let i = 1; i < 7; i++) {
    let field = document.createElement('div');
    field.classList.add("form-group");
    form.append(field)
    field.id = i
    let descr = document.createElement('label');
    let enter = document.createElement('input');
    enter.classList.add("form-control");
    enter.id = "input-value " + i
    switch (field.id) {
      case '1':
        descr.textContent = "Фамилия";
        enter.type = "text";
        enter.placeholder = "Введите фамилию студента";
        field.append(descr)
        field.append(enter)
        break
      case '2':
        descr.textContent = "Имя";
        enter.type = "text";
        enter.placeholder = "Введите имя студента";
        field.append(descr)
        field.append(enter)
        break
      case '3':
        descr.textContent = "Отчество";
        enter.type = "text";
        enter.placeholder = "Введите отчество студента";
        field.append(descr)
        field.append(enter)
        break
      case '4':
        descr.textContent = "Дата рождения";
        enter.type = "date";
        enter.placeholder = "Введите дату рождения студента";
        field.append(descr)
        field.append(enter)
        break
      case '5':
        descr.textContent = "Год начала обучения";
        enter.type = "number";
        enter.placeholder = "Введите год начала обучения студента";
        field.append(descr)
        field.append(enter)
        break
      case '6':
        descr.textContent = "Факультет";
        enter.type = "text";
        enter.placeholder = "Введите факультет";
        field.append(descr)
        field.append(enter)
        break
    }
  }
  let button = document.createElement('button')
  button.textContent = "Добавить студента";
  button.type = "submit";
  button.classList.add('btn')
  button.classList.add('btn-outline-primary')
  form.append(button)
}

createForm()

// добавление нового студента

document.getElementById("form").addEventListener('submit', async function async(e) {
  e.preventDefault();
  formValidate()

  // *************************
  const response = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify({
      name: document.getElementById('input-value 1').value.trim(),
      surname: document.getElementById('input-value 2').value.trim(),
      lastname: document.getElementById('input-value 3').value.trim(),
      birthday: new Date(document.getElementById('input-value 4').value),
      studyStart: document.getElementById('input-value 5').value.trim(),
      faculty: document.getElementById('input-value 6').value.trim(),
    }),
    headers: {
      'Content-Type': 'aplication/json',
    }
  })

  const student = await response.json();

  students.push(student)
  renderStudentsTable()

}
)

function formValidate() {
  let date = new Date()
  let error = []
  let mistake;
  let formGroups = document.querySelectorAll(".form-group")
  formGroups.forEach(function (elem) {
    // console.log(elem)
    let elemInput = elem.querySelector('input')
    let elemLabel = elem.querySelector('label')
    mistake = document.createElement('p');
    let elemMistake = elem.querySelector('p')
    mistake.classList.add("form-text");
    mistake.classList.add("text-danger");
    // все поля обязательны для заполнения после применения к значению метода trim();
    if (elemInput.value.trim() === "") {
      mistake.textContent = `Заполните поле  "${elemLabel.textContent}"`
      error.push(mistake.textContent)
      elem.append(mistake)
    }
    // // дата рождения находится в диапазоне от 01.01.1900 до текущей даты;
    if (elemInput.id === "input-value 4") {
      let startDate = new Date(1900, 0, 1)
      let birthdateStudent = new Date(elemInput.value)
      if (birthdateStudent < startDate || birthdateStudent > date) {
        mistake.textContent = "Введена неверная дата. Пожалуйста введите с 01.01.1900 до текущей даты"
        error.push(mistake.textContent)
        elem.append(mistake)
        console.log(mistake.textContent)
      }
    }
    // // год начала обучения находится в диапазоне от 2000-го до текущего года.
    if (elemInput.id === "input-value 5") {

      if (elemInput.value < 2000) {
        mistake.textContent = "Год начала обучения должень быть не ранее 2000 года"
        error.push(mistake.textContent)
        elem.append(mistake)
      }
      if (elemInput.value > date.getFullYear()) {
        mistake.textContent = "Год обучения еще не наступил"
        error.push(mistake.textContent)
        elem.append(mistake)
      }
    }
  }
  )

  if (error.length == 0) {
    document.getElementById("form").classList.add('validate')
  }
}

async function renderStudentsTable() {
  let studentsCopy = [...students]

  // удаление студента из списка и с сервера
  const onDelete = {
    onDelete({ student, element }) {
      if (!confirm('Вы уверены?')) {
        return
      }
      element.remove();
      fetch(`http://localhost:3000/api/students/${student.id}`, {
        method: 'DELETE',
      });
    }
  }

  $studentList.innerHTML = ""

  // отрисовка таблицы после перезагрузки страницы

  const response = await fetch(`http://localhost:3000/api/students`, {
    method: 'GET',
  });
  studentsCopy = await response.json();

  $studentList.innerHTML = ""

  for (const student of studentsCopy) {
    $studentList.append(getNewStudent(student, onDelete))
  }
}

renderStudentsTable()
})()
