// получаем список дел по listName


export async function getTodoList(listName){
  const response = await fetch (`http://localhost:3000/api/todos?owner=${listName}`);
  return await response.json();
}

// создание дела

export async function createTodoItem({name, owner}){
  const response = await fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    body: JSON.stringify({
      name,
      owner,
    }),
    headers: {
      'Content-Type': 'aplication/json',
    }
  })

  return await response.json()
}

// отмечает что дело сделано или не сделано

export function switchTodoItemDone({todoItem}){
  todoItem.done = ! todoItem.done;
   fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done: todoItem.done}),
    headers: {
      'Content-Type': 'aplication/json',
    }
  })
}

// удаление дела

export function deleteTodoItem({element, todoItem}){

  if (!confirm('Вы уверены?')) {
    return;
  }

  element.remove();
   fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
    method: 'DELETE',
  })
}
