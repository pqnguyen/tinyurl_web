const moment = require('moment-timezone');

export function firstLetterUpper(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
}

export function toDateDisplay(dt) {
    if (!dt) return "";
    return moment(dt).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm");
}

export function getTodayObject() {
    return moment().tz("Asia/Ho_Chi_Minh");
}

export function getNextDay(dt, day) {
    if (!dt) return "";

    return dt.clone().add(day, 'days');
}

export function toTimeDisplay(dt) {
    return dt ? moment(dt).tz("Asia/Ho_Chi_Minh").format("HH:mm") : "";
}

export function toShortDateDisplay(dt) {
    return dt ? moment(dt).tz("Asia/Ho_Chi_Minh").format("DD-MM-YY HH:mm") : "";
}

export function toSimpleDate(dt) {
    return dt ? moment(dt).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD") : "";
}

export function convertStringToMoment(strDate) {
    return strDate ? moment(strDate).tz("Asia/Ho_Chi_Minh") : strDate
}

export function convertTimeStringToMoment(strTime) {
    return strTime ? moment(strTime, "HH:mm").tz("Asia/Ho_Chi_Minh") : strTime;
}

export function removeSecondFromTime(strTime) {
    return strTime ? moment(strTime, "HH:mm:ss").format("HH:mm") : strTime;
}

export function dateToStringServer(dt) {
    return dt ? dt.clone().utc().format() : "";
}

export function formatNumber(number, radio = 0) {
    if (number !== undefined) {
        if (number.toString().indexOf(",") > 0)
            return number;

        number = Number.parseFloat(number).toFixed(radio);
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    else
        return ""
}

export function formatQuantity(number) {
    return formatNumber(number, 2)
}

export function formatNumberDynamicDec(number, nDec=0) {
    const numberStr = formatNumber(number, nDec);

    return numberStr.replace(/\.{0,1}0*$/g, "");
}

export function getValueFromObject(object, keyStr) {
    const keys = keyStr.split(".");
    let ans = object;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        ans = ans[key];
    }
    return ans;
}

export function removeVietnameseAccent(vnStr) {
    return vnStr.toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
        .replace(/[èéẹẻẽêềếệểễ]/g, "e")
        .replace(/[ìíịỉĩ]/g, "i")
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
        .replace(/[ùúụủũưừứựửữ]/g, "u")
        .replace(/[ỳýỵỷỹ]/g, "y")
        .replace(/đ/g, "d")
        .replace(/[!@%^*()+=<>?/,.:;'"&#[]/g, " ")
        .replace(/ */g, "")
        .trim();
}

export function findSparsely(targetStr, pattern) {
    const regex = new RegExp(Array.from(pattern).join(".*"));
    const result = regex.exec(targetStr);
    return result ? result.index : -1;
}

export function filterOptionForVietnameseSelectBox(inputValue, option) {
    const optionTarget = removeVietnameseAccent(option.props.children);
    const patternInput = removeVietnameseAccent(inputValue);
    return findSparsely(optionTarget, patternInput) !== -1;
}

export function generateRequiredFieldRule(label) {
    return {
        rules: [{
            required: true,
            whitespace: true,
            message: label + " is required.",
        }]
    }
}

export function getUserFullName(user) {
    return user ? user.full_name : "";
}

export function isFiniteNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && (typeof(n) === "number");
}

export function getFiniteNumeric(val, altVal = 0) {
    return isFiniteNumeric(val) ? val : altVal;
}

export function roundToSecondDecimalPlace(decimalNumber) {
    if (!isFiniteNumeric(decimalNumber))
        return 0;
    return Math.round(decimalNumber * 100) / 100.0;
}

export function roundMoney(money) {
    money = parseInt(money, 10);
    const triple = money % 1000;
    const rest = Math.floor(money / 1000);
    money = rest * 1000;

    if (triple >= 500) {
        money += 500
    }
    return money;
}

export function buildMap(list) {
    let result = {};
    list.forEach((e) => {
        result[e.id] = e
    });

    return result
}

export function replaceInList(oldList, newElement) {
    for (let i in oldList) {
        if (oldList[i].id === newElement.id) {
            oldList.splice(i, 1, newElement);
            return;
        }
    }
    oldList.unshift(newElement)
}

export function removeNullValue({...object}) {
    if (typeof object !== "object") {
        return object;
    }

    Object.keys(object).forEach(key => {
        if (object[key] === null) {
            delete object[key];
        }
    });

    return object;
}

export function parseSearchString(searchString) {
    const result = {};
    searchString
        .replace("?", "")
        .split("&")
        .map(item => item.split("="))
        .forEach(([key, value]) => result[key] = value);
    return result;
}

export function buildSearchString(obj) {
    let suffix = "";
    if (obj) {
        suffix = "?";
        Object.entries(obj).forEach(([key, value]) => {
            suffix += `${key}=${value}&`;
        });
    }
    return suffix;
}

export function primitiveComparator(value1, value2) {
    if (value1 === value2) {
        return 0
    }
    return value1 < value2 ? -1 : 1;
}

export function recordComparator(fieldName, record1, record2) {
    let field1 = getValueFromObject(record1, fieldName);
    let field2 = getValueFromObject(record2, fieldName);
    const fieldType = typeof(field1);

    if (fieldType === "string") {
        if (String.prototype.localeCompare) {
            return field1.localeCompare(field2, "vi", {ignorePunctuation: true});
        }
    }

    return primitiveComparator(field1, field2);
}

export function isEmptyArray(array) {
    return !array || (array instanceof Array && array.length === 0);
}

export function isEmptyString(string) {
    return !string || (string instanceof String && string.length === 0);
}

export function setWindowTitle(title) {
    if (document) {
        document.title = title;
    }
}

export const getAccessToken = () => window.localStorage.getItem("giigaa.access_token");
