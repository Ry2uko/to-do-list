// Hacked by @Ryuko :D
$(function(){
  $('#addToDo').click(function(){
    const inputVal = $('#toDoInput').val();
    
    if (inputVal === '') return;
    
    $('#listBody ul').append(`
    <label class="list-group-item py-2 ps-3 d-flex">
      <span class="user-select-none">${inputVal}</span>
      <input type="checkbox" class="form-check-input ms-auto me-1 mt-1 shadow-none" />
    </label>
    `);
    
    $('input[type="checkbox"]').change(function(){
      const listText = $(this).prev()[0];
      const textVal = $(listText).text();
      if (this.checked) {  
        $(listText).html(`<del class="text-muted">${textVal}</del>`)
      } else {
        $(listText).html(`${textVal}`)
      }
    });
    
    $('#toDoInput').val('');
  });
  
  $('#toDoInput').keypress(function(e){
    if (e.key === 'Enter') $('#addToDo').click();
  });
});