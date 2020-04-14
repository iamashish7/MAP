function pad(num) {
    var s = num + "";
    while (s.length < 3) s = "0" + s;
    return s;
}

function addGRID() {

    //1st row
    var myTableDiv = document.getElementById("grid");

    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 17; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th2 td2');
        th.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif');
        th.setAttribute('colspan', '3');
        th.appendChild(document.createTextNode("ENC " + (j + 1).toString()));
        tr.appendChild(th);
    }
    
    for (var i = 0; i < 6; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 17; ++j) {
            for (var k = 0; k < 3; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'pc' + pad(i * 3 + j * 18 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv.appendChild(table);


    //2nd row
    var myTableDiv = document.getElementById("grid2");

    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 17; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th2 td2');
        th.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif');
        th.setAttribute('colspan', '3');
        th.appendChild(document.createTextNode("ENC " + (17+j + 1).toString()));
        tr.appendChild(th);
    }
    
    for (var i = 0; i < 6; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 17; ++j) {
            for (var k = 0; k < 3; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'pc' + pad(306+i * 3 + j * 18 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv.appendChild(table);

    //3rd row
    var myTableDiv2 = document.getElementById("grid3");
    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    for (var j = 0; j < 16; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th2 td2');
        th.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif');
        th.setAttribute('colspan', '3');
        th.appendChild(document.createTextNode("ENC " + (34 + j + 1).toString()));
        tr.appendChild(th);
    }
    for (var i = 0; i < 6; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 16; ++j) {
            for (var k = 0; k < 3; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'pc' + pad(612 + i * 3 + j * 18 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv2.appendChild(table);
}