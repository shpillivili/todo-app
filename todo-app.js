(function() {

    let todoArray = [];

    //Создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        const appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //создаём и возврааем форму для создания дела
    function createTodoItemForm() {
        const form = document.createElement('form');
        const input = document.createElement('input');
        const buttonWrapper = document.createElement('div');
        const btn = document.createElement('button');

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
        const list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        const item = document.createElement('li');
        //Помещаем кнопки в элемент
        const buttonGroup = document.createElement('div');
        const doneButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        const randomId = Math.round(Math.random() * 1000);
        item.id = randomId;
    
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
            buttonGroup,
            doneButton,
            deleteButton
        };
    };

    // Перезаписываем состояние дел в массиве
    function recirculation(arr, item) {
        for (let obj of arr) {
            if (obj.id === item.id && obj.done === false) {
                obj.done = true;
            } else if (obj.id === item.id && obj.done === true) {
                obj.done = false;
            };
        };
    };

    // Обработчик состояния дела
    function doneBtn(btn, item, arr) {
        btn.addEventListener('click', function() {
            arr = JSON.parse(localStorage.getItem(key));
            item.classList.toggle('list-group-item-success');
            recirculation(arr, item);
            localStorage.setItem(key, JSON.stringify(arr));
        });
    };

    // Обработчик удаления дела
    function removeBtn (btn, item, arr) {
        btn.addEventListener('click', function() {
            if(confirm('Вы уверены?')) {
                arr = JSON.parse(localStorage.getItem(key));
                const newList = todoArray.filter(obj => obj.id !== item.id);
                localStorage.setItem(key, JSON.stringify(newList))
                console.log(newList);
                item.remove();
                location.reload();         
            }
        });
    };

    function createTodoApp (container, title, key) {
        const todeAppTitle = createAppTitle(title);
        const todoItemForm = createTodoItemForm();
        const todoList = createTodoList();

        container.append(todeAppTitle, todoItemForm.form, todoList);
      
        if (casesArr) {
            for (let obj of casesArr) {
                let todoItemMy = createTodoItem(todoItemForm.input.value);
                todoItemMy.item.textContent = obj.name;
                todoItemMy.item.id = obj.id;
                // todoItem.item.name = obj.name
    
                if (obj.done == true) {
                    todoItemMy.item.classList.toggle('list-group-item-success');
                } else if (obj.done == false) {
                    todoItemMy.item.classList.remove('list-group-item-success');
                };
                    
                doneBtn(todoItemMy.doneButton, todoItemMy.item, casesArr);
                removeBtn(todoItemMy.deleteButton, todoItemMy.item, casesArr);

                todoList.append(todoItemMy.item);
                todoItemMy.item.append(todoItemMy.buttonGroup)
            };
        };
        

        // Проверяем, если массив в хранилище не пустой, то обращаемся к нему,
        // задаём состояние объектам, реализуем взаимодействие с объектоми,
        // и отрисовываем их на странице.
        if (localStorage.getItem(key) !== null) {
            todoArray = JSON.parse(localStorage.getItem(key))
          }
          for (const obj of todoArray) {
            const todoItem = createTodoItem(todoItemForm.input.value);
            todoItem.item.textContent = obj.name;
            todoItem.item.id = obj.id;

            if (obj.done == true) {
                todoItem.item.classList.toggle('list-group-item-success');
            } else if (obj.done == false) {
                todoItem.item.classList.remove('list-group-item-success');
            };
            
            doneBtn(todoItem.doneButton, todoItem.item, todoArray);
            removeBtn(todoItem.deleteButton, todoItem.item, todoArray);

            todoList.append(todoItem.item);
            todoItem.item.append(todoItem.buttonGroup);
          };
        
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

            // Создаёю ключи для объектов, пушу в массив и записываю в localStorage
            const temp = {};
            temp.name = todoItemForm.input.value;
            temp.id = todoItem.item.id;
            temp.done = false;
            todoArray.push(temp);
            console.log(todoArray);
            localStorage.setItem(key, JSON.stringify(todoArray));

            //добавляем обработчики
            doneBtn(todoItem.doneButton, todoItem.item, todoArray);
            removeBtn(todoItem.deleteButton, todoItem.item, todoArray);

            // создаём и добавляем в список новое дело, с названием и поля
            todoList.append(todoItem.item);

            // обнуляем значение в поле, что бы не пришлось стирать его в ручную
            todoItemForm.input.value = '';

    
        });
    };

    window.createTodoApp = createTodoApp;

})();