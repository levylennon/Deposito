/*
        Object for work with Ajax pure [ XMLHttpRequest ]
*/

// Global var, I'll use this for all files, I need call this var for use the functions, beforesend, success, error...
var xhttp = new XMLHttpRequest;



/*
    Function for GET request and will return value
*/
function xmlHttpGet(url, callback, parameters = '') {

    xhttp.onreadystatechange = callback;

    xhttp.open('GET', url + parameters, true);

    xhttp.send();
}

/*
    Function for POST request and will return value
*/
function xmlHttpPost(url, callback, parameters = '') {

    xhttp.onreadystatechange = callback;

    xhttp.open('POST', url , true);

    if (typeof (parameters) != 'object') {
        xhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    }

    xhttp.send(parameters);
}

function xmlHttpPostJson(url, callback, parameters = '') {

    xhttp.onreadystatechange = callback;

    xhttp.open('POST', url , true);

    if (typeof (parameters) != 'object') {
        xhttp.setRequestHeader("content-type", "application/json; charset=utf-8");
    }

    xhttp.send(parameters);
}
/*
    Function for use before load page
*/
function beforeSend(callback) {

    if (xhttp.readyState < 4) {

        callback();

    }

}

/*
    Function for use when the page is full load
*/
function success(callback) {

    if (xhttp.readyState == 4 && xhttp.status == 200) {

        callback();

    }

}

/*
    Function used for when an error occurs in load page 
*/
function error(callback) {

    xhttp.onerror = callback;

}