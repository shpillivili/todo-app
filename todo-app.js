(function() {

    let todoArray = [];

    //Создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //создаём и возврааем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let btn = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-appeng');
        btn.classList.add('btn', 'btn-primary');
        btn.textContent = 'Добавить дело';
        btn.disabled = true;
        
        buttonWrapper.append(btn);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function () {
            if (input.value.length == 0) {
                btn.disabled = true;
            } else if(input.value.length > 0) {
                btn.disabled = false;
            };

        })

        return {
            form,
            input,
            btn,
        }
        
    }

    //Создаём и возвращаем список элементов
    function createTodoList(){
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');
        //Помещаем кнопки в элемент
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
    
        //стили для эдемента списка, а так же для кнопок в правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'aligin-items-center');
        item.textContent = name;
    
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';
    
        //Вкладываем кнопки в отдельный элемент, что бы они объеденились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        
    
        //Приложению нужен доступ к самому эл-ту и кнопкам, чтобы обрабатывать события
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createTodoApp (container, title, key) {
        let todeAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        function recirculation (arr) {
            for (let newArr of arr){
                if (newArr.done === false) {
                    newArr.done = true;
                } else {
                    newArr.done = false;
                }
            }
        };
        
        if (localStorage.getItem('defaultCases') != undefined) {
           casesArr = JSON.parse(localStorage.getItem('defaultCases'))
           };

        for (let obj of casesArr) {
            let todoItemMy = createTodoItem(obj.name);
            todoList.append(todoItemMy.item);

            if (obj.done == true) {
                todoItemMy.item.classList.toggle('list-group-item-success');
                };
                
                todoItemMy.doneButton.addEventListener('click', function() {
                    todoItemMy.item.classList.toggle('list-group-item-success');
                  recirculation(casesArr);
                  console.log(casesArr);
                  localStorage.setItem('defaultCases', JSON.stringify(casesArr));
                });
                
                 todoItemMy.deleteButton.addEventListener('click', function() {
                  if(confirm('Вы уверены?')) {
                    todoItemMy.item.remove();
                    }
                });
            
        };

      if (localStorage.getItem(key) != undefined) {
        todoArray = JSON.parse(localStorage.getItem(key))
      }
      
  
      for (let obj of todoArray) {
        let todoItem = createTodoItem(obj.name);
        todoList.append(todoItem.item);
        
        if (obj.done == true) {
        todoItem.item.classList.toggle('list-group-item-success');
        };
        
        todoItem.doneButton.addEventListener('click', function() {
          todoItem.item.classList.toggle('list-group-item-success');
          recirculation(todoArray);
          console.log(todoArray);
          localStorage.setItem(key, JSON.stringify(todoArray));
         });
        
        todoItem.deleteButton.addEventListener('click', function() {
          if(confirm('Вы уверены?')) {
                todoItem.item.remove();
            }
        });
      }
      
        container.append(todeAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        
    // браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function(e) {
            // необходимо для того, что бы предотвратить стандартное действие браузера
            // в данном случае, мы хотим, чтобы стр перезагрузилась при нажатии
            e.preventDefault();

            //игнорируем создание эл-та, если user ничего не ввёл в поле
            if (!todoItemForm.input.value) {
                return;
            }
        
            let todoItem = createTodoItem(todoItemForm.input.value);

            let temp = {};
            temp.name = todoItemForm.input.value;
            temp.done = false;
            let i = todoArray.length;
            todoArray[i] = temp;
            console.log(todoArray);
            localStorage.setItem(key, JSON.stringify(todoArray));



        //добавляем обработчик на кнопки
        todoItem.doneButton.addEventListener('click', function() {
            todoItem.item.classList.toggle('list-group-item-success');
            recirculation(todoArray);
            console.log(todoArray);
            localStorage.setItem(key, JSON.stringify(todoArray));
        });
        todoItem.deleteButton.addEventListener('click', function() {
            if(confirm('Вы уверены?')) {
                todoItem.item.remove();
                localStorage.removeItem(key);
            }
        });

        

        // создаём и добавляем в список новое дело, с названием и поля
        todoList.append(todoItem.item);

        // обнуляем значение в поле, что бы не пришлось стирать его в ручную
        todoItemForm.input.value = '';
        });
    };

    window.createTodoApp = createTodoApp;


})();
// 1) Сделать проверку по имени для состояния дела.
// 2) Реализовать удаление объекта из дела(ключа).
// 3) Реализовать возможность прогрузки дефолтных дел для определённой страницы.