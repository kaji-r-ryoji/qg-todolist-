// 获取元素
const todoInput = document.getElementById('todo-input');
const submitBtn = document.querySelector('.input_button');
const todoList = document.querySelector('.todo-list');

// 添加待办事项
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        return;
    }
    
    // 隐藏空状态提示
    const emptyHint = document.querySelector('.empty-hint');
    if (emptyHint) {
        emptyHint.style.display = 'none';
    }
    
    // 创建新的待办卡片
    const todoCard = document.createElement('div');
    todoCard.className = 'todo-card';
    todoCard.innerHTML = `
        <div class="checkbox-wrapper">
            <input type="checkbox" class="round-checkbox">
        </div>
        <span class="todo-text">${text}</span>
        <button class="btn-delete" title="删除">×</button>
    `;
    
    // 添加到列表
    todoList.appendChild(todoCard);
    
    // 清空输入框
    todoInput.value = '';
    
    // 绑定新卡片的事件
    bindDeleteEvent(todoCard);
    bindCheckboxEvent(todoCard);
}

// 绑定删除事件
function bindDeleteEvent(todoCard) {
    const deleteBtn = todoCard.querySelector('.btn-delete');
    // 如果找不到删除按钮（如空状态提示卡片），直接返回
    if (!deleteBtn) return;
    
    deleteBtn.addEventListener('click', function() {
        // 添加 recycle 类标记为已删除
        todoCard.classList.add('recycle');
        // 从当前列表隐藏（移到回收站）
        todoCard.style.display = 'none';
    });
}

// 绑定复选框事件
function bindCheckboxEvent(todoCard) {
    const checkbox = todoCard.querySelector('.round-checkbox');
    // 如果找不到复选框（如空状态提示卡片），直接返回
    if (!checkbox) return;
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            todoCard.classList.add('completed');
        } else {
            todoCard.classList.remove('completed');
        }
    });
}

// 点击提交按钮
submitBtn.addEventListener('click', addTodo);

// 按回车键提交
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 为已有卡片绑定事件
document.querySelectorAll('.todo-card').forEach(function(card) {
    bindDeleteEvent(card);
    bindCheckboxEvent(card);
});

// 绑定"全部标为完成"按钮事件（工具栏按钮）
const completeAllBtn = document.querySelector('.btn-complete-all');
if (completeAllBtn) {
    completeAllBtn.addEventListener('click', markAllAsComplete);
}

// 标记全部完成功能函数
function markAllAsComplete() {
    // 获取所有带有 .todo-card 类但不带 .empty-hint 类的元素
    const todoCards = document.querySelectorAll('.todo-card:not(.empty-hint)');
    
    //遍历每一个找到的待办卡片
    todoCards.forEach(function(card) {
        // 在当前卡片中查找复选框元素（class 为 round-checkbox）
        const checkbox = card.querySelector('.round-checkbox');
    
        // 确保不是空值
        if (checkbox) {
            // 将复选框设为勾选状态
            checkbox.checked = true;
            // 给卡片添加 completed 类
            card.classList.add('completed');
        }
    });
}

//清除全部已完成功能函数
function cleanupAllCompleted() {
    // 获取所有已完成的待办卡片（带 completed 类但不带 empty-hint 类）
    const completedCards = document.querySelectorAll('.todo-card.completed:not(.empty-hint)');

    // 遍历每一个已完成的卡片
    completedCards.forEach(function(card) {
        // 给已完成卡片添加 recycle 类，标记为已删除（移到回收站）
        card.classList.add('recycle');
        
        // 如果当前不在回收站视图，隐藏该卡片
        card.style.display = 'none';
    });
}

//清除全部的功能函数
function cleanupAll() {
    // 获取所有已完成的待办卡片（带 .todo-card类但不带 empty-hint 类）
    const allcards = document.querySelectorAll('.todo-card:not(.empty-hint)');

    // 遍历每一个已完成的卡片
    allcards.forEach(function(card) {
        // 给已完成卡片添加 recycle 类，标记为已删除（移到回收站）
        card.classList.add('recycle');
        
        // 如果当前不在回收站视图，隐藏该卡片
        card.style.display = 'none';
    });
}


//侧边栏筛选功能


//根据传入的筛选类型，控制卡片显示类型

function filterTodos(filterType) {
    // 获取所有待办卡片（排除空状态提示）
    const todoCards = document.querySelectorAll('.todo-card:not(.empty-hint)');
    
    // 获取空状态提示元素
    const emptyHint = document.querySelector('.empty-hint');
    
    // 据筛选类型遍历处理每个卡片
    todoCards.forEach(function(card) {
        // 判断当前卡片是否有 completed 类
        const isCompleted = card.classList.contains('completed');
        const recycled=card.classList.contains('recycle');
        // 根据筛选条件决定是否显示
        switch(filterType) {
            case 'all':
                // 显示不带 recycle 类）
                card.style.display = recycled ? 'none' : 'flex';
                break;
            case 'active':
                // 进行中：只显示不带 completed 类且不带 recycle 
                // 如果已完成或已删除则隐藏，否则显示
                card.style.display = (isCompleted || recycled) ? 'none' : 'flex';
                break;
            case 'completed':
                // 已完成：只显示带 completed 类且不带 recycle 
                card.style.display = (isCompleted && !recycled) ? 'flex' : 'none';
                break;
            case 'recycle':
                card.style.display= recycled ? 'flex' : 'none';
                break;
        }
    });
    
    // 处理空状态提示的显示
    // 在筛选模式下隐藏空状态提示，返回全部模式时再根据情况显示
    if (filterType !== 'all' && emptyHint) {
        emptyHint.style.display = 'none';
    }
}


/**
 * 更新侧边栏菜单项的激活状态
 * 用于高亮当前选中的菜单项
 * 
 * @param {HTMLElement} activeItem - 当前点击的菜单项元素
 */
function updateActiveMenuItem(activeItem) {
    //获取所有菜单项
    const allMenuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    
    // 遍历移除所有菜单项的 active 类
    allMenuItems.forEach(function(item) {
        item.classList.remove('active');
    });
    
    // 为当前点击的菜单项添加 active 类
    activeItem.classList.add('active');
}


// 侧边栏菜单事件绑定

// 获取侧边栏的所有菜单项
const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');

// 获取各个菜单项
const allMenuItem = menuItems[0];      // "全部"
const activeMenuItem = menuItems[1];   // "进行中"
const completedMenuItem = menuItems[2]; // "已完成"
const recycleMenuItem = menuItems[3];  // "回收站"
const cleancompleted=menuItems[5];   //"清除已完成"
const cleanALL=menuItems[6]          //“清除全部”


// 绑定"进行中"菜单项的点击事件
if (activeMenuItem) {
    activeMenuItem.addEventListener('click', function() {
        //调用筛选函数，只显示active类的待办事项
        filterTodos('active');
        
        // 更新菜单项的激活状态（高亮当前选中项）
        updateActiveMenuItem(activeMenuItem);
    });
}

//绑定“全部”菜单项的点击事件
if(allMenuItem) {
    allMenuItem.addEventListener('click',function() {
        //调用筛选函数，显示所有的待办事项
        filterTodos('all')

        //更新侧边栏的显示状态
        updateActiveMenuItem(allMenuItem)
    })
}

//绑定“已完成”菜单项的点击事件
if(completedMenuItem) {
    completedMenuItem.addEventListener('click',function(){
        //调用筛选函数，只显示带compeleted类的待办事项
        filterTodos('completed')

        //更新侧边栏的显示状态
        updateActiveMenuItem(completedMenuItem)
    })
}

//绑定“回收站”菜单项的点击事件
if(recycleMenuItem) {
    recycleMenuItem.addEventListener('click',function(){
        //调用筛选函数，显示带有recycle类的待办事项
        filterTodos('recycle')

        // 为回收站中的卡片绑定恢复事件（切换按钮功能）
        const recycleCards = document.querySelectorAll('.todo-card.recycle:not(.empty-hint)');
        recycleCards.forEach(function(card) {
            bindRestoreEvent(card);
        });

        //更新侧边栏的显示状态
        updateActiveMenuItem(recycleMenuItem)
    })
}

//绑定“清除已完成”菜单项的点击事件
if(cleancompleted) {
    cleancompleted.addEventListener('click',function(){
        //调用清除已完成函数，将所有带有completed类的待办事项清除
        cleanupAllCompleted()
    })
}


//绑定侧边栏“清除全部”菜单项事件
if(cleanALL) {
    cleanALL.addEventListener('click',function(){
        //调用清除全部函数，将所有待办事项清除
        cleanupAll()
    })    
}



// 回收站恢复功能 

/**
 * 恢复已删除的待办事项
 * 将卡片从回收站恢复到正常列表
 * 
 * @param {HTMLElement} todoCard - 要恢复的待办卡片
 */
function restoreTodo(todoCard) {
    // 移除 recycle 类，标记为未删除
    todoCard.classList.remove('recycle');
    
    // 隐藏卡片（当前在回收站视图）
    todoCard.style.display = 'none';
    
}


/**
 * 将删除按钮切换为恢复按钮（用于回收站视图）
 * 再次点击删除按钮恢复
 * 
 * @param {HTMLElement} todoCard - 要处理的待办卡片
 */
function bindRestoreEvent(todoCard) {
    const deleteBtn = todoCard.querySelector('.btn-delete');
    if (!deleteBtn) return;
    
    // 克隆按钮以移除之前绑定的事件
    const newBtn = deleteBtn.cloneNode(true);
    deleteBtn.parentNode.replaceChild(newBtn, deleteBtn);
    
    // 绑定恢复事件
    newBtn.addEventListener('click', function() {
        restoreTodo(todoCard);
        // 恢复后隐藏该卡片（因为在回收站视图）
        todoCard.style.display = 'none';
    });
}

// 绑定侧边栏"全部标为已完成"菜单项事件
const sidebarCompleteAll = document.querySelector('.menu-item.divider');
if (sidebarCompleteAll) {
    sidebarCompleteAll.addEventListener('click', markAllAsComplete);
}



// 侧边栏展开/收起

/**
 * 切换侧边栏菜单的显示/隐藏状态
 * 点击按钮时展开或收起侧边栏菜单（保留顶部header）
 * 默认为展开状态
 */
const toggleBtn = document.querySelector('.toggle-btn');
const sidebarMenu = document.querySelector('.sidebar-menu');

if (toggleBtn && sidebarMenu) {
    // 默认展开状态，按钮显示"关"（表示点击后收起）
    toggleBtn.textContent = '关';
    
    toggleBtn.addEventListener('click', function() {
        // 切换菜单的 collapsed 类
        sidebarMenu.classList.toggle('collapsed');
        
        // 根据状态改变按钮文字
        if (sidebarMenu.classList.contains('collapsed')) {
            // 菜单已收起，显示"开"（表示点击后展开）
            toggleBtn.textContent = '开';
        } else {
            // 菜单已展开，显示"关"（表示点击后收起）
            toggleBtn.textContent = '关';
        }
    });
}
