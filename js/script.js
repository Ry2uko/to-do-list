// Hacked by @Ryuko :D

$(function(){
  let editMode = false;

  function changeCount() {
    let tasksCount = $('#listBody ul').children().length;
    let doneTasksCount = $('.done').length;
    if(tasksCount === 0 && doneTasksCount === 0) {
      $('#tasksCompleted').text('Feeling productive?');
    } else if(tasksCount === doneTasksCount) {
      $('#tasksCompleted').text('All tasks completed');
    } else {
      $('#tasksCompleted').text(`${doneTasksCount} out of ${tasksCount} tasks completed`);
    }
  }

  changeCount();

  $('#deleteAll').click(function(){
    $('#listBody ul').empty();
    changeCount();
  })

  $('#editTasks').click(function(){
    if(!editMode) {
      $('.delete-task').removeClass('d-none');
      $('.delete-task').addClass('d-block');

      $('.task-done').removeClass('d-block');
      $('.task-done').addClass('d-none');

      $('.task-name').removeAttr('readonly');
      $('.task-name').parent().addClass('edit-input');

      $('.task-done').attr('disabled', true);
      $('.delete-task').removeAttr('disabled');

      editMode = true;
    } else {
      $('.delete-task').removeClass('d-block');
      $('.delete-task').addClass('d-none');

      $('.task-done').removeClass('d-none');
      $('.task-done').addClass('d-block');

      $('.task-name').parent().removeClass('edit-input');
      $('.task-name').attr('readonly', true);

      $('.delete-task').attr('disabled', true);
      $('.task-done').removeAttr('disabled');

      editMode = false;
    }
  });

  $('#addToDo').click(function(){
    const inputVal = $('#toDoInput').val();
    if (inputVal === '') return;
    
    $('#listBody ul').append(`
    <label class="list-group-item py-2 ps-3 d-flex">
      <div class="${editMode ? "edit-input" : ""}"><input type="text" value="${inputVal}" maxlength="50" class="task-name" ${editMode ? "" : "readonly"} /></div>
      ${editMode 
        ? '<input type="checkbox" class="form-check-input ms-auto me-1 shadow-none task-done d-none" disabled/> \
        <input type="image" src="img/icon/xmark-solid.svg" class="delete-task d-block" alt="delete task" />' 
        : '<input type="checkbox" class="form-check-input ms-auto me-1 shadow-none task-done d-block" /> \
        <input type="image" src="img/icon/xmark-solid.svg" class="delete-task d-none" alt="delete task" />'}
    </label>
    `);
    
    $('input[type="checkbox"]').change(function(){
      if (editMode) return;

      const listText = $(this).prev()[0];
      const inputVal = $($(listText).children()[0]).val();
      if (this.checked) {  
        $(listText).html(`<input type="text" value="${inputVal}" maxlength="50" class="text-muted done task-name" readonly />`)
      } else {
        $(listText).html(`<input type="text" value="${inputVal}" maxlength="50" class="task-name" readonly />`)
      }
      changeCount();
    });

    $('.delete-task').click(function(){
      $(this).parent().remove();
      changeCount();
    });

    changeCount();
    $('#toDoInput').val('');
  });
  
  // saved list
  $('input[type="checkbox"]').change(function(){
      if (editMode) return;
      
      const listText = $(this).prev()[0];
      const inputVal = $($(listText).children()[0]).val();
      if (this.checked) {  
        $(listText).html(`<input type="text" value="${inputVal}" maxlength="50" class="text-muted done task-name" readonly />`)
      } else {
        $(listText).html(`<input type="text" value="${inputVal}" maxlength="50" class="task-name" readonly />`)
      }
      changeCount();
    });

  $('.delete-task').click(function(){
    $(this).parent().remove();
    changeCount();
  });
  
  $('#toDoInput').keypress(function(e){
    if (e.key === 'Enter') $('#addToDo').click();
  });
});