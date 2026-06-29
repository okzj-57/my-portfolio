    // 主题初始化
    (function () {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    })();

    // 页面元素
    const themeToggle = document.getElementById("themeToggle");
    const projectScrollButton = document.getElementById("projectScrollButton");
    const projectsSection = document.getElementById("projects");
    const todoForm = document.getElementById("todoForm");
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const todoFilterButtons = document.querySelectorAll(".todo-filter-button");
    const projectCards = document.querySelectorAll(".project-card");

    // 主题切换
    function updateThemeButton() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      themeToggle.textContent = isDark ? "🌙" : "☀️";
      themeToggle.setAttribute("aria-label", isDark ? "当前是深色模式，点击切换主题" : "当前是浅色模式，点击切换主题");
    }

    themeToggle.addEventListener("click", function () {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";

      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }

      updateThemeButton();
    });

    updateThemeButton();

    // Hero 按钮滚动到项目区
    projectScrollButton.addEventListener("click", function () {
      projectsSection.scrollIntoView({
        behavior: "smooth"
      });
    });

    // Todo List
    let currentFilter = "all";
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    function normalizeTodos() {
      todos = todos.map(function (todo) {
        if (typeof todo === "string") {
          return {
            text: todo,
            completed: false
          };
        }

        return todo;
      });
    }

    function saveTodos() {
      localStorage.setItem("todos", JSON.stringify(todos));
    }

    function getFilteredTodos() {
      const todosWithIndex = todos.map(function (todo, index) {
        return {
          todo: todo,
          index: index
        };
      });

      if (currentFilter === "active") {
        return todosWithIndex.filter(function (item) {
          return !item.todo.completed;
        });
      }

      if (currentFilter === "completed") {
        return todosWithIndex.filter(function (item) {
          return item.todo.completed;
        });
      }

      return todosWithIndex;
    }

    function updateFilterButtons() {
      todoFilterButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.filter === currentFilter);
      });
    }

    function renderTodos() {
      todoList.innerHTML = "";
      updateFilterButtons();

      getFilteredTodos().forEach(function (filteredItem) {
        const todo = filteredItem.todo;
        const index = filteredItem.index;
        const item = document.createElement("li");
        const checkbox = document.createElement("input");
        const text = document.createElement("span");
        const deleteButton = document.createElement("button");

        item.className = "todo-item";
        checkbox.className = "todo-checkbox";
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        text.className = "todo-text";
        text.textContent = todo.text;
        deleteButton.className = "todo-delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "删除";

        if (todo.completed) {
          item.classList.add("completed");
        }

        checkbox.addEventListener("change", function () {
          todos[index].completed = checkbox.checked;
          saveTodos();
          renderTodos();
        });

        deleteButton.addEventListener("click", function () {
          todos.splice(index, 1);
          saveTodos();
          renderTodos();
        });

        item.appendChild(checkbox);
        item.appendChild(text);
        item.appendChild(deleteButton);
        todoList.appendChild(item);
      });
    }

    todoFilterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;
        renderTodos();
      });
    });

    todoForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const newTodo = todoInput.value.trim();

      if (newTodo === "") {
        return;
      }

      todos.push({
        text: newTodo,
        completed: false
      });
      saveTodos();
      renderTodos();
      todoInput.value = "";
      todoInput.focus();
    });

    normalizeTodos();
    renderTodos();

    // 项目详情展开/收起
    const projectDetails = [
      "这个项目整合了作品集网站的基础模块，用来展示个人介绍、技能、项目内容和主题切换效果。",
      "这个项目练习了表单输入、任务列表渲染、删除操作和 localStorage 本地保存。",
      "这个项目通过 CSS 和 JavaScript 实现主题切换，并使用 localStorage 记住用户选择。"
    ];

    projectCards.forEach(function (card, index) {
      const button = document.createElement("button");
      const detail = document.createElement("div");

      button.className = "project-detail-button";
      button.type = "button";
      button.textContent = "查看详情";

      detail.className = "project-detail";
      detail.textContent = projectDetails[index];

      button.addEventListener("click", function () {
        detail.classList.toggle("show");
        button.textContent = detail.classList.contains("show") ? "收起详情" : "查看详情";
      });

      card.appendChild(button);
      card.appendChild(detail);
    });
