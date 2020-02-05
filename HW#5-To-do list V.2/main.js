var myModule = (function() {

var todoItems = [];

//Get elements from DOM
var btnAddTask = document.getElementById('addTask');
var todoList = document.getElementById('todo__list');
var filters = document.getElementById('todo__filters');

//Work with Lоcal Storage
function getItems() {
    todoList.innerHTML = window.localStorage.getItem('todo_list');
    todoItems = JSON.parse(localStorage.getItem('todo_items'));  
}

function setItems() {
    window.localStorage.setItem('todo_list', todoList.innerHTML);
    window.localStorage.setItem('todo_items', JSON.stringify(todoItems));
}

function isNull() {
    if(localStorage.getItem('todo_items') != null ){
        getItems();
    }
}

//Functions
function addTask(text, deadline) {
    var item = {
        text,
        done: false,
        id: Date.now(),
        deadline
    }
    todoItems.push(item); 

    todoList.insertAdjacentHTML('beforeend',  "<li class=\"todo__item\" data-key=" + 
    item.id + "><input id=" + 
    item.id + " type='checkbox'/><label for=" +
    item.id + " class='todo__item-tick'></label><span class='todo__item-text'>" +
    item.text + "</span><span class='todo__item__deadline'>" +
    item.deadline + "</span><button class='todo__item-delete'>—</button></li>");
    setItems();
}

function isDone(key) {
    var index = todoItems.findIndex(item => item.id === Number(key));
    todoItems[index].done  = !todoItems[index].done;
    var item = document.querySelector(`[data-key='${key}']`);

    if (todoItems[index].done) {
        item.classList.add('done');
    } else {
        item.classList.remove('done');
    }
    setItems();
}

function deleteTodo(key) {
    todoItems = todoItems.filter(item => item.id !== Number(key));
    var item = document.querySelector(`[data-key='${key}']`);
    item.remove();
    setItems();
}

function showAll() {
    todoItems = JSON.parse(localStorage.getItem('todo_items'));
    for(var i = 0; i < todoItems.length; i++){
        var item = document.querySelector(`[data-key='${todoItems[i].id}']`);
        item.classList.remove('hidden');
        console.log(todoItems[i]);
    }  
    setItems();
};

var btns = filters.getElementsByTagName('button');
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";});
}


function filter(filter) {  
    switch (filter) {
        case 'done':
            for(var i = 0; i < todoItems.length; i++){
                var item = document.querySelector(`[data-key='${todoItems[i].id}']`);
                item.classList.remove('hidden')
                    if(todoItems[i].done === false ){
                    item.classList.add('hidden');} 
            } 
             setItems();
         break;

         case 'process':
            for(var i = 0; i < todoItems.length; i++){
                var item = document.querySelector(`[data-key='${todoItems[i].id}']`);
                item.classList.remove('hidden')
                    if(todoItems[i].done === true){
                    item.classList.add('hidden')
                   }
             }  
             setItems();
         break;

         case 'tomorrow':
            for(var i = 0; i < todoItems.length; i++){
                var item = document.querySelector(`[data-key='${todoItems[i].id}']`);
                item.classList.remove('hidden');

                var deadline = new Date(Date.parse(todoItems[i].deadline));
                var date = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

                var now = new Date();
                var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
                if((date > tomorrow) || (date < tomorrow)){
                    item.classList.add('hidden');
                };
            }
             setItems();
         break;

         case 'week':
            for(var i = 0; i < todoItems.length; i++){ 
                var item = document.querySelector(`[data-key='${todoItems[i].id}']`);
                item.classList.remove('hidden');

                var deadline = new Date(Date.parse(todoItems[i].deadline));
                var date = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

                var now = new Date();
                var week = new Date(now.getFullYear(), now.getMonth(), now.getDate()+7);
                if((date > week) || (date < week)){
                    item.classList.add('hidden');
                };
            } 
             setItems();
         break;

    } 
}

//Event Listeners

//Add button
btnAddTask.addEventListener('click', event => {
    event.preventDefault();
    var inputTask = document.getElementById('todo__form-input').value;
    var inputDeadline = document.getElementById('todo__form-deadline').value;
    if (( inputTask.trim() !== '' ) && ( inputDeadline !== '' )) {
        addTask(inputTask, inputDeadline);
    }
});

//Filters
filters.addEventListener('click', event => { 
    if(event.target.classList.contains('allTasks')){
        showAll();
    }

    if(event.target.classList.contains('done')){
        filter('done');
    }

    if(event.target.classList.contains('process')){
        filter('process');
    }

    if(event.target.classList.contains('tomorrow')){
        filter('tomorrow');
    }

    if(event.target.classList.contains('week')){
        filter('week');
    }
});

//List of tasks
todoList.addEventListener('click', event => {
    if(event.target.classList.contains('todo__item-tick')){
        var itemKey = event.target.parentElement.dataset.key;
        isDone(itemKey);
    }

    if (event.target.classList.contains('todo__item-delete')) {
        var itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
    }
})

return {
    init: function() {
        isNull();
    }
}

})();


myModule.init();
