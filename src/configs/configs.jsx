const {REACT_APP_ENV: env = "local"} = process.env;
const config = require(`./${env}_configs`).default;

if (env === "local") {
    console.log(process.env);
    console.log("Config....................");
    console.log(config);
}

export default {
    ...config
};
