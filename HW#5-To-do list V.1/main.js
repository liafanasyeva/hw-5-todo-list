var todoItems = [];

function addItem(text,deadline) {

    var item = {
        text,
        done: false,
        id: Date.now(),
        deadline
    }
    todoItems.push(item);

    var list = document.querySelector('.todo__list');
    list.insertAdjacentHTML('beforeend',
    `<li class="todo__list-item" data-key="${item.id}">
        <input id="${item.id}" type="checkbox"/>
        <label for="${item.id}" class="todo__item-tick"></label>
        <span class="todo__list-item__text">${item.text}</span>
        <span class="todo__list-item__text">${item.deadline}</span>
        <button class="todo__delete-button">
            <svg><use href="#delete-icon"></use></svg>
        </button>
    </li>
    `)
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
}

function deleteTodo(key) {
    todoItems = todoItems.filter(item => item.id !== Number(key));
    var item = document.querySelector(`[data-key='${key}']`);
    item.remove();
}

//datepicker jQuery
$( function() {
    $( "#datepicker" ).datepicker();
});

var btnAddTasks = document.querySelector('.addTask');
btnAddTasks.addEventListener('click', event => {
    //to stop refreshing page
    event.preventDefault();
    var input = document.querySelector('.todo__form-input');
    var deadline = document.querySelector('.todo__form-deadline');
    if((input.value.trim() !== '') && (deadline.value !== '')){
        addItem(input.value,deadline.value);
        input.value = '';  
        deadline.value = '';
    }       else {
        alert('Enter data')
    } 

})

var list = document.querySelector('.todo__list');
list.addEventListener('click',event =>{
    if(event.target.classList.contains('todo__item-tick')){
        var itemKey = event.target.parentElement.dataset.key;
        isDone(itemKey);
    }

    if (event.target.classList.contains('todo__delete-button')) {
        var itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
    }
})

// Filter

var fActive = '';
 
function filterDone(criteria){
 if(fActive != criteria){
 $('li').filter('.' + criteria).slideDown();
 $('li').filter(':not(.' + criteria + ')').slideUp();
 fActive = criteria;
 }
}
 
$('.done').click(function(){ filterDone('done'); });

$('.allTasks').click(function(){
    $('li').slideDown();
    fActive = 'all';
});

$('.tomorrow').click(function(){
    for(var i = 0; i<todoItems.length; i++){
        var tomorrow = new Date(Date.parse(new Date()) + 1 * 24 * 60 * 60 * 1000).getDate();
        if(todoItems[i].deadline.split('/')[1] != tomorrow){
            $('[data-key=' + todoItems[i].id +']').slideUp();
        } else {
            console.log('error')
        };

    }
});
