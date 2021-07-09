const EventEmmiter = require("events");
const IO = require("./components/IO");

module.exports = class RevaPlugin extends EventEmmiter {

    constructor() {
        super();
        this.tasks = new Set();
        this.events = new Set();

        this.on("newListener", (eventName) => {
            this.events.add(eventName);
        });

        this.on("removeListener", (eventName) => {
            this.events.delete(eventName);
        });
    }

    registerTask(taskName, task) {
        if (task.meta.name !== taskName) {
            taskName = task.meta.name;
        }

        if (this.tasks.has(taskName)) {
            throw new Error(`Task already registered: ${taskName}`);
        }

        this[taskName] = task;
        this.tasks.add(taskName);
    }

    deregisterTask(taskName) {
        delete this[taskName];
        this.tasks.delete(taskName);
    }

    async getTasks() {
        let taskNames = await IO.listDirectories("/tasks");
        let tasks = {};
        for (let taskName of taskNames) {
            tasks[taskName] = require(`/tasks/${taskName}`);
            tasks[taskName].meta = require(`/tasks/${taskName}/meta.json`);
            if (!tasks[taskName].meta.name) {
                tasks[taskName].meta.name = taskName;
            }
        }
        return tasks;
    }

    async loadTasks() {
        let tasks = await this.getTasks();
        for (let taskName in tasks) {
            this.registerTask(taskName, tasks[taskName]);
        }
    }

};
