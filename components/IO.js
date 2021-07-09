const fs = require("fs-extra");

module.exports = class IO {

    static async listDirectories(path) {
        let filesAndDirectories = await fs.readdir(path);
        let directories = [];
        await Promise.all(
            filesAndDirectories.map((name) => fs.stat(path + name)
                .then((stat) => {
                    if (stat.isDirectory()) { directories.push(name); }
                })),
        );
        return directories;
    }

};
