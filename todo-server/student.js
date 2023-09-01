export default class Student {

  constructor(surname, name, patronymic , birthdate, yearStudyStart,faculty) {
    this.surname = surname
    this.name = name
    this.patronymic  = patronymic
    this.birthdate = birthdate
    this.yearStudyStart = yearStudyStart
    this.faculty = faculty
  }

  get fio(){
    return this.surname + ' ' + this.name + ' ' + this.patronymic
  }

  getBirthdayString(){
    function addZero(num) {
      return (num < 10) ? "0" + num : num;
    }

    let formatDay = this.birthdate.getDate();
    let formatMonth = (this.birthdate.getMonth() + 1);
    let formatYear = this.birthdate.getFullYear();
    let formatBirthday = addZero(formatDay) + '.' + addZero(formatMonth) + '.' + formatYear

    return formatBirthday
  }

  get YearStudyFinish(){
    return  +this.yearStudyStart  + 4
  }

  getStudyPeriod(){
    return this.yearStudyStart + ' - ' + (+this.yearStudyStart  + 4)
  }

  getAge(){
    const today = new Date()
    let age = (today.getFullYear() - this.birthdate.getFullYear())
      let m = today.getMonth() - this.birthdate.getMonth();
      if (m < 0 || (m == 0 && today.getDate() < this.birthdate.getDate())) {
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
      return age
  }

  getCours(){
    const today = new Date()
    let cours = (today.getFullYear() - + this.yearStudyStart)
    if (today.getMonth() > 8) {
      cours = cours + 1
    }
    (cours > 4) ? cours = ('закончил') : cours = cours + ' курс'
    return cours
  }

}



