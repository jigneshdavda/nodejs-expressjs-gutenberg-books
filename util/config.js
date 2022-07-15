const path = require('path');
const rootDir = path.dirname(require.main.filename);

module.exports = {
    APP_DIRECTORY: rootDir,
    APP_PUBLIC_DIRECTORY: path.join(rootDir, 'public'),
    APP_IMAGES_DIRECTORY: path.join(rootDir, 'images'),
    APP_FILES_DIRECTORY: path.join(rootDir, 'files'),
    APP_NAME: "Gutenberg App",
    APP_LOGO: "",
    APP_URL: "http://localhost/gutenberg-app/",
    DB_HOST: "localhost",
    DB_NAME: "guternberg-db",
    DB_USER: "root",
    DB_PASSWORD: "root",
    SECRET_KEY: ""
}