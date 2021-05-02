const fs = require("fs-extra");

module.exports = class RevaPlugin {

    constructor() {
        this.tasks = {};
        this.events = [];
    }

    async loadTasks() {
        let Tasks = {};
        let CustomTasks = {};

        try {
            Tasks = await fs.readJSON("./tasks/index.json");
        } catch (e) {
            // No tasks
        }

        try {
            CustomTasks = await fs.readJSON("./tasks/custom/index.json");
        } catch (e) {
            // No custom tasks
        }

        this.tasks = { ...Tasks, ...CustomTasks };
    }

    registerEvent(evtName) {
        if (this.events.includes(evtName)) {
            throw new Error("Event name already registered");
        }

        this.tasks.push(evtName);
    }

};
