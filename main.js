const form = document.getElementById('forma');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let title = document.getElementById('task__title').value;
    let description = document.getElementById('task__description').value;
    let date = document.getElementById('taskDate').value;
    let priority = document.getElementById('taskPriority').value;
    console.log(title + ' | ' + description + ' | ' + date + ' | ' + priority)
    date = date.split("T");
    console.log(date);
    let item = new todoItem(title, description, date, priority);
    console.log(item.title)
})

myForm.addEventListener("change", ()=> {
    let item = myForm.taskProject.options[myForm.taskProject.selectedIndex].value;
    let input = document.getElementById('projectTitleInput');
    if (item == 'new') {
        input.style.display = 'flex'
        return
    }
    input.style.display = 'none'
})

class todoItem {
    constructor(title, description, date, priority) {
        this._title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
    }

    get title(){
        return this._title
    }
};