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

  // Add Event listeners; since we'll be creating new elements
  function addListeners() {
    
    new Sortable($('#tasksContainer')[0], {
      animation: 150
    });

    $('input[type="checkbox"]').change(function(){
      if (editMode) return;

      const listText = $(this).prev()[0];
      const inputVal = $(listText).text();
      if (this.checked) {  
        $(listText).html(`<span class="text-muted done task-name"<del>${inputVal}</del></span>`)
      } else {
        $(listText).html(`<span class="task-name">${inputVal}</span>`)
      }
      changeCount();
    });

    $('.delete-task').click(function(){
      $(this).parent().remove();
      changeCount();
    });
  }

  // Edit and Delete
  $('#deleteAll').click(function(){
    $('#listBody div#tasksContainer').empty();
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
    if (inputVal === '') return;
    $('#listBody div#tasksContainer').append(`
    <label class="list-group-item py-2 ps-3 d-flex">
      <span class="task-name">${inputVal}</span>
      ${editMode 
        ? '<input type="checkbox" class="form-check-input ms-auto me-1 shadow-none task-done d-none" disabled/> \
        <input type="image" src="img/icon/xmark-solid.svg" class="delete-task d-block" alt="delete task" />' 
        : '<input type="checkbox" class="form-check-input ms-auto me-1 shadow-none task-done d-block" /> \
        <input type="image" src="img/icon/xmark-solid.svg" class="delete-task d-none" alt="delete task" />'}
    </label>
    `);
    
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