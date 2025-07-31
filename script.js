// In-memory storage instead of localStorage
let taskStorage = {};
let taskCount = 0;

// Initial references
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
const taskCountDiv = document.querySelector("#task-count");
let updateNote = "";

// Function on window load
window.onload = () => {
    updateNote = "";
    displayTasks();
};

// Function to display tasks
const displayTasks = () => {
    const taskKeys = Object.keys(taskStorage);
    
    if (taskKeys.length > 0) {
        tasksDiv.style.display = "block";
    } else {
        tasksDiv.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-seedling"></i>
                <p>No tasks yet. Plant the seed of productivity!</p>
            </div>
        `;
        updateTaskCount();
        return;
    }

    // Clear tasks
    tasksDiv.innerHTML = "";

    // Sort tasks
    const sortedTasks = taskKeys.sort();

    for (let key of sortedTasks) {
        const value = taskStorage[key];
        const taskInnerDiv = document.createElement("div");
        taskInnerDiv.classList.add("task");
        taskInnerDiv.setAttribute("id", key);
        
        // Create completion checkbox/button
        const completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = value ? `<i class="fas fa-check"></i>` : `<i class="far fa-circle"></i>`;
        taskInnerDiv.appendChild(completeButton);
        
        // Task name span
        const taskNameSpan = document.createElement("span");
        taskNameSpan.id = "taskname";
        taskNameSpan.textContent = key.split("_")[1];
        taskInnerDiv.appendChild(taskNameSpan);

        // Edit button
        const editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        
        if (!value) {
            editButton.style.visibility = "visible";
        } else {
            editButton.style.visibility = "hidden";
            taskInnerDiv.classList.add("completed");
        }
        
        taskInnerDiv.appendChild(editButton);
        
        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        taskInnerDiv.appendChild(deleteButton);
        
        tasksDiv.appendChild(taskInnerDiv);
    }

    // Add click events for task completion via complete button
    const completeTasks = document.getElementsByClassName("complete");
    Array.from(completeTasks).forEach((element) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            const parent = element.parentElement;
            const taskName = parent.querySelector("#taskname").innerText;
            const taskId = parent.id.split("_")[0];
            const isCompleted = parent.classList.contains("completed");
            
            updateStorage(taskId, taskName, !isCompleted);
        });
    });

    // Remove old task completion click events from task div
    const tasks = document.querySelectorAll(".task");
    tasks.forEach((element) => {
        // Only allow clicking on the task name to complete, not the whole div
        const taskNameSpan = element.querySelector("#taskname");
        if (taskNameSpan) {
            taskNameSpan.onclick = (e) => {
                e.stopPropagation();
                const taskName = taskNameSpan.innerText;
                const taskId = element.id.split("_")[0];
                const isCompleted = element.classList.contains("completed");
                
                updateStorage(taskId, taskName, !isCompleted);
            };
        }
    });

    // Edit task events
    const editTasks = document.getElementsByClassName("edit");
    Array.from(editTasks).forEach((element) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            disableButtons(true);
            
            const parent = element.parentElement;
            newTaskInput.value = parent.querySelector("#taskname").innerText;
            updateNote = parent.id;
            parent.remove();
        });
    });

    // Delete task events
    const deleteTasks = document.getElementsByClassName("delete");
    Array.from(deleteTasks).forEach((element) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            
            const parent = element.parentElement;
            removeTask(parent.id);
            parent.remove();
        });
    });

    updateTaskCount();
};

// Update task count display
const updateTaskCount = () => {
    const total = Object.keys(taskStorage).length;
    const completed = Object.values(taskStorage).filter(v => v === true).length;
    const remaining = total - completed;
    
    if (total === 0) {
        taskCountDiv.textContent = "";
    } else {
        taskCountDiv.textContent = `${remaining} remaining • ${completed} completed • ${total} total`;
    }
};

// Disable edit buttons
const disableButtons = (bool) => {
    const editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

// Remove task from storage
const removeTask = (taskValue) => {
    delete taskStorage[taskValue];
    displayTasks();
};

// Add/update tasks in storage
const updateStorage = (index, taskValue, completed) => {
    taskStorage[`${index}_${taskValue}`] = completed;
    displayTasks();
};

// Add new task
document.querySelector("#push").addEventListener("click", () => {
    disableButtons(false);
    
    if (newTaskInput.value.trim().length === 0) {
        alert("Please enter a task!");
        return;
    }

    if (updateNote === "") {
        // New task
        updateStorage(taskCount, newTaskInput.value, false);
        taskCount++;
    } else {
        // Update existing task
        const existingCount = updateNote.split("_")[0];
        removeTask(updateNote);
        updateStorage(existingCount, newTaskInput.value, false);
        updateNote = "";
    }
    
    newTaskInput.value = "";
});

// Add task on Enter key
newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.querySelector("#push").click();
    }
});

// Initialize
displayTasks();