let projects = []
let projectSelect = document.getElementById('taskProject');

const form = document.getElementById('forma');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let title = document.getElementById('task__title').value;
    let description = document.getElementById('task__description').value;
    let date = document.getElementById('taskDate').value;
    let priority = document.getElementById('taskPriority').value;
    let projectTitle = document.getElementById('projectTitle').value;

    date = date.split("T");

    if (projectSelect.value == 'new') {
        let newProject = new project(projectTitle);
        let item = new todoItem(title, description, date[0] + ' ' + date[1], priority);
        projects.push(newProject);
        newProject.addToDO(item);
        newProject.render();
        projectSelect.options[projects.length] = new Option(projectTitle, projects.length - 1);
        projectSelect.options[projects.length].selected = 'selected'
        let input = document.getElementById('projectTitleInput');
        input.style.display = 'none';
        return
    }

    let item = new todoItem(title, description, date[0] + ' ' + date[1], priority);
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
        localStorage.setItem(0, JSON.stringify(projects))
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

    removeToDo(i) {
        this._todos.splice(i, 1)
        localStorage.setItem(0, JSON.stringify(projects))
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
        projectTasksList.style.display = 'none';
        project.append(projectTitleDiv, projectTasksList);
        projectList.append(project)
        this._todos.forEach(element => {
            element.render(this._title);
        })
    }
}

function searchToDoInProjects(obj) {
    for (let i=0; i < projects.length; i++) {
        if (projects[i].todos.indexOf(obj) > -1) {
            return {
                projectIndex:i,
                toDoIndex: projects[i].todos.indexOf(obj)
            }
        }
    }
    return false
}

class todoItem {
    constructor(title, description, date, priority) {
        this._title = title;
        this._description = description;
        this._date = date;
        this._priority = priority;
    }

    get title(){
        return this._title
    }
    get description(){
        return this._description
    }
    get date(){
        return this._date
    }

    edit(e) {
        let parent = e.currentTarget.parentElement;
        let select = parent.getElementsByTagName('select')[0];
        select.style.display = 'block'
    }

    render(title) {
        let project = document.getElementById(title);
        let taskList = project.getElementsByClassName('taskList')[0];
        let task = document.createElement('div');
        task.classList.add('task', this._priority);
        task.setAttribute('name', this._title)

        let taskTitle = document.createElement('input');
        taskTitle.className = 'taskTitle';
        taskTitle.value = this._title;
        taskTitle.addEventListener('blur', (e) => {
            this._title = e.currentTarget.value
            localStorage.setItem(0, JSON.stringify(projects))
        })

        let taskDescription = document.createElement('input');
        taskDescription.value = this._description;
        taskDescription.className = 'taskDescription';
        taskDescription.addEventListener('blur', (e) => {
            this.description = e.currentTarget.value
            localStorage.setItem(0, JSON.stringify(projects))
        })

        let taskDate = document.createElement('input');
        taskDate.value = this._date;
        taskDate.className = 'taskDate';
        taskDate.addEventListener('blur', (e) => {
            this.date = e.currentTarget.value
            localStorage.setItem(0, JSON.stringify(projects))
        })

        let editButton = document.createElement('button')
        editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editButton.className = 'taskEdit';
        editButton.addEventListener('click', (e) => {this.edit(e)})

        let deleteButton = document.createElement('button')
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.className = 'taskEdit';
        deleteButton.addEventListener('click', (e) => {
            if (typeof searchToDoInProjects(this) == 'object') {
                let indexes = searchToDoInProjects(this);
                projects[indexes['projectIndex']].removeToDo(indexes['toDoIndex']);
                task.remove()
            }
        })

        let select = document.createElement('select');
        select.options[0] = new Option('Высокий', 'high');
        select.options[1] = new Option('Средний', 'medium');
        select.options[2] = new Option('Низкий', 'low');  
        select.style.display = 'none'
        select.addEventListener('change', () => {
            task.classList.remove(this._priority);
            this._priority = select.value;
            task.classList.add(this._priority);
            localStorage.setItem(0, JSON.stringify(projects))
        })
        select.addEventListener('blur', () => {
            select.style.display = 'none'
        })

        let editPriority = document.createElement('div');
        editPriority.className = 'editPriority';

        editPriority.append(editButton, deleteButton, select)

        task.append(taskTitle, taskDescription, taskDate, editPriority);
        taskList.append(task);
        return task
    }
};

if (localStorage.length > 0) {
    let cache = JSON.parse(localStorage.getItem(0));
    cache.forEach(el => {
        let cacheProject = new project(el._title)
            el._todos.forEach(element => {
                let cacheToDo = new todoItem(element._title, element._description, element._date, element._priority);
                cacheProject.addToDO(cacheToDo)
            })
        cacheProject.render();
        projects.push(cacheProject)
        projectSelect.options[projects.length] = new Option(el._title, projects.length - 1);
        localStorage.setItem(0, JSON.stringify(projects))
    })
}