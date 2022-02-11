// Hacked by @Ryuko :D

$(function(){
  let editMode = false;

  // Display Tasks Count
  function changeCount() {
    let tasksCount = $('#listBody div#tasksContainer').children().length;
    let doneTasksCount = $('.done').length;
    if(tasksCount === 0 && doneTasksCount === 0) {
      $('#tasksCompleted').text('Feeling productive?');
    } else if(tasksCount === doneTasksCount) {
      $('#tasksCompleted').text('All tasks completed');
    } else {
      $('#tasksCompleted').text(`${doneTasksCount} out of ${tasksCount} tasks completed`);
    }
  }

  // Generate unique id for each task even if they have the same name
  function generateId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '', length = 7;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * length));
    }

    return result;
  }

  // Add Event listeners; since we'll be creating new elements
  function addListeners() {
    
    new Sortable($('#tasksContainer')[0], {
      animation: 150
    });

    $('input[type="checkbox"]').change(function(){
      if (editMode) return;

      const taskId = $(this).parent().attr('id');
      const listText = $(this).prev()[0];
      const inputVal = $(listText).text();

      const savedList = localStorage.getItem('savedList');
      const parsedList = JSON.parse(savedList);
      
      if (this.checked) {  
        $(listText).addClass('text-muted done');
        $(listText).html(`<del>${inputVal}</del>`);
        for (let i = 0; i < parsedList.length; i++) {
          if (parsedList[i].id === taskId) {
            parsedList[i].done = true;
            break;
          }
        }
      } else {
        $(listText).removeClass('text-muted done');
        $(listText).html(inputVal);
        for (let i = 0; i < parsedList.length; i++) {
          if (parsedList[i].id === taskId) {
            parsedList[i].done = false;
            break;
          }
        }
      }

      localStorage.setItem('savedList', JSON.stringify(parsedList));
      changeCount();
    });

    $('.delete-task').click(function(){
      const savedList = localStorage.getItem('savedList');
      const parsedList = JSON.parse(savedList);
      const newList = [...parsedList];
      const taskId = $(this).parent().attr('id');

      for (let i = 0; i < newList.length; i++) {
        if (newList[i].id === taskId) {
          parsedList.splice(i, 1);
          break;
        }
      }

      $(this).parent().remove();
      localStorage.setItem('savedList', JSON.stringify(parsedList));
      changeCount();
    });
  }

  // Saved List (localStorage)
  const savedList = localStorage.getItem('savedList');
  if (savedList) {
    const parsedList = JSON.parse(savedList);
    parsedList.map(task => {
      $('#listBody div#tasksContainer').append(`
        <label class="list-group-item py-2 ps-3 d-flex" id="${task.id}">
          ${ 
            task.done 
              ? `<span class="text-muted done task-name"><del>${task.name}</del></span>` 
              : `<span class="task-name">${task.name}</span>`
          }
          <input type="checkbox" class="form-check-input ms-auto me-1 shadow-none task-done d-block" ${task.done ? "checked" : ""}/> 
          <input type="image" src="img/icon/xmark-solid.svg" class="delete-task d-none" alt="delete task" />
        </label>
      `);
    });
  }

  // Edit and Delete
  $('#deleteAll').click(function(){
    $('#listBody div#tasksContainer').empty();
    localStorage.removeItem('savedList');
    changeCount();
  })
  $('#editTasks').click(function(){
    if(!editMode) {
      $('.delete-task').removeClass('d-none');
      $('.delete-task').addClass('d-block');

      $('.task-done').removeClass('d-block');
      $('.task-done').addClass('d-none');

      $('.task-done').attr('disabled', true);
      $('.delete-task').removeAttr('disabled');

      editMode = true;
    } else {
      $('.delete-task').removeClass('d-block');
      $('.delete-task').addClass('d-none');

      $('.task-done').removeClass('d-none');
      $('.task-done').addClass('d-block');

      $('.delete-task').attr('disabled', true);
      $('.task-done').removeAttr('disabled');

      editMode = false;
    }
  });

  // Adding Tasks
  $('#addToDo').click(function(){
    const inputVal = $('#toDoInput').val();
    const eleId = generateId();
    if (inputVal === '') return;

    $('#listBody div#tasksContainer').append(`
      <label class="list-group-item py-2 ps-3 d-flex" id="${eleId}">
        <span class="task-name">${inputVal}</span>
        ${editMode 
          ? '<input type="checkbox" class="form-check-input ms-auto me-1 shadow-none task-done d-none" disabled/> \
          <input type="image" src="img/icon/xmark-solid.svg" class="delete-task d-block" alt="delete task" />' 
          : '<input type="checkbox" class="form-check-input ms-auto me-1 shadow-none task-done d-block" /> \
          <input type="image" src="img/icon/xmark-solid.svg" class="delete-task d-none" alt="delete task" />'}
      </label>
    `);

    // Saving to Local Storage
    const savedList = localStorage.getItem('savedList') || JSON.stringify([]);
    const parsedList = JSON.parse(savedList);
    parsedList.push({
      id: eleId,
      name: inputVal,
      done: false
    });
    localStorage.setItem('savedList', JSON.stringify(parsedList));

    addListeners();
    changeCount();

    $('#toDoInput').val('');
  });
  $('#toDoInput').keypress(function(e){
    if (e.key === 'Enter') $('#addToDo').click();
  });

  addListeners();
  changeCount();
});