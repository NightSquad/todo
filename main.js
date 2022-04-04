const projects = [];

const form = document.getElementById('forma');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let title = document.getElementById('task__title').value;
    let description = document.getElementById('task__description').value;
    let date = document.getElementById('taskDate').value;
    let priority = document.getElementById('taskPriority').value;
    let projectSelect = document.getElementById('taskProject');
    let projectTitle = document.getElementById('projectTitle').value;

    date = date.split("T");

    if (projectSelect.value == 'new') {
        let newProject = new project(projectTitle);
        let item = new todoItem(title, description, date[0] + ' ' + date[1], priority);
        newProject.addToDO(item);
        newProject.render();
        projects.push(newProject);
        projectSelect.options[projects.length] = new Option(projectTitle, projects.length - 1);
        projectSelect.options[projects.length].selected = 'selected'
        let input = document.getElementById('projectTitleInput');
        input.style.display = 'none';
        return
    }

    let item = new todoItem(title, description, date, priority);
    projects[projectSelect.value].addToDO(item);
    item.render(projects[projectSelect.value].title)
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

class project{
    constructor(title) {
        this._title = title;
        this._todos = [];
    }
    get title(){ return this._title }

    get todos() {
        return this._todos
    }

    addToDO(item) {
        this._todos.push(item);
    }

    switchState(e) {
        let project = e.currentTarget.parentElement.parentElement
        let taskList = project.getElementsByClassName('taskList')[0];
        if (taskList.style.display == 'block') {
            taskList.style.display = 'none';
            e.currentTarget.classList.remove('rotate');
            return
        }
        taskList.style.display = 'block';
        e.currentTarget.classList.add('rotate');
    }

    render() {
        let project = document.createElement('div')
        project.className = 'project';
        project.id = this._title;

        let projectTitleDiv = document.createElement('div')
        projectTitleDiv.className = 'projectTitle';
        let projectTitle = document.createElement('p');
        projectTitle.textContent = this._title;
        let projectTitleButton = document.createElement('button');
        projectTitleButton.className = 'projectViewButton';
        projectTitleButton.textContent = '>'
        projectTitleButton.addEventListener('click', (e) => {this.switchState(e)})
        projectTitleDiv.append(projectTitle, projectTitleButton);
        let projectTasksList = document.createElement('div');
        projectTasksList.className = 'taskList'; 
        project.append(projectTitleDiv, projectTasksList);
        projectList.append(project)
        this._todos.forEach(element => {
            element.render(this._title);
        })
    }
}

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

    edit(e) {
        let parent = e.currentTarget.parentElement;
        let item = e.currentTarget;
        item.style.display = 'none';
        let select = document.createElement('select');
        select.options[0] = new Option('Высокий', 'high')
        select.options[1] = new Option('Средний', 'medium') 
        select.options[2] = new Option('Низкий', 'low')  
        select.addEventListener('change', () => {
            let task = parent.parentElement
            task.classList.remove(this.priority);
            this.priority = select.value;
            task.classList.add(this.priority);
        })
        select.addEventListener('blur', () => {
            item.style.display = 'block';
            select.remove();
        })
        parent.append(select)
    }

    render(title) {
        let project = document.getElementById(title);
        let taskList = project.getElementsByClassName('taskList')[0];
        let task = document.createElement('div');
        task.classList.add('task', this.priority);
        task.setAttribute('name', this._title)

        let taskTitle = document.createElement('input');
        taskTitle.className = 'taskTitle';
        taskTitle.value = this._title;
        taskTitle.addEventListener('blur', (e) => {this._title = e.currentTarget.value})

        let taskDescription = document.createElement('input');
        taskDescription.value = this.description;
        taskDescription.className = 'taskDescription';
        taskDescription.addEventListener('blur', (e) => {this.description = e.currentTarget.value})

        let taskDate = document.createElement('input');
        taskDate.value = this.date;
        taskDate.className = 'taskDate';
        taskDate.addEventListener('blur', (e) => {this.date = e.currentTarget.value})

        let editButton = document.createElement('button')
        editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editButton.className = 'taskEdit';
        editButton.addEventListener('click', (e) => {this.edit(e)})

        let editPriority = document.createElement('div');
        editPriority.className = 'editPriority';

        editPriority.append(editButton)

        task.append(taskTitle, taskDescription, taskDate, editPriority);
        taskList.append(task);
        return task
    }
};