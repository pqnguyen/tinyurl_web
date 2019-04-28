import pagePaths from "src/constants/pagePaths";
import Home from "src/pages/Home/HomePage";
import Hash from "src/pages/Hash/HashPage";

const routeMapping = [
    {
        "path": pagePaths.HOME,
        "component": Home
    },
    {
        "path": pagePaths.HASH,
        "component": Hash
    }
];

export default routeMapping;
