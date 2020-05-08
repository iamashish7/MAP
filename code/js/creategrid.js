function pad(num) {
    var s = num + "";
    while (s.length < 3) s = "0" + s;
    return s;
}

function addGRID() {

    //Nehelam GRID row 1
    var myTableDiv = document.getElementById("grid");

    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading(Line 1)
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 6; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th2 td');
        th.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif');
        th.setAttribute('colspan', '4');
        th.appendChild(document.createTextNode("ENC " + (j + 1).toString()));
        tr.appendChild(th);
    }
    for (var i = 0; i < 4; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (var j = 0; j < 6; ++j) {
            for (var k = 0; k < 4; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'cn' + pad(i * 4 + j * 16 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv.appendChild(table);
    
    // For Nehelam Second row
    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading(Line 2)
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 6; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th2 td');
        th.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif');
        th.setAttribute('colspan', '4');
        th.appendChild(document.createTextNode("ENC " + (6 + j + 1).toString()));
        tr.appendChild(th);
    }
    for (var i = 0; i < 4; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 6; ++j) {
            for (var k = 0; k < 4; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'cn' + pad(96 + i * 4 + j * 16 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv.appendChild(table);
    
    // For Nehelam Third row
    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading(Line 3)
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 6; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th2 td');
        th.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif');
        th.setAttribute('colspan', '4');
        th.appendChild(document.createTextNode("ENC " + (12 + j + 1).toString()));
        tr.appendChild(th);
    }
    for (var i = 0; i < 4; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 6; ++j) {
            for (var k = 0; k < 4; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'cn' + pad(192 + i * 4 + j * 16 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv.appendChild(table);
    
    //myTableDiv.appendChild(document.createElement('BR'));

    //Nehelam GRID row 2
    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 5; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th2 td');
        th.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif');
        th.setAttribute('colspan', '4');
        th.appendChild(document.createTextNode("ENC " + (18 + j + 1).toString()));
        tr.appendChild(th);
    }

    for (var i = 0; i < 4; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 5; ++j) {
            for (var k = 0; k < 4; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'cn' + pad(288 + i * 4 + j * 16 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv.appendChild(table);

    /*
    //Nehelam GRID
    var myTableDiv = document.getElementById("grid");

    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 23; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th td');
        th.setAttribute('colspan', '4');
        th.appendChild(document.createTextNode("ENC " + (j + 1).toString()));
        tr.appendChild(th);
    }
    
    for (var i = 0; i < 4; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 23; ++j) {
            for (var k = 0; k < 4; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'cn' + pad(i * 4 + j * 16 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv.appendChild(table);
    */


    //Sandy Bridge Grid
    var myTableDiv2 = document.getElementById("grid2");
    var table = document.createElement('TABLE');
    table.setAttribute('class', 'table2');
    table.setAttribute('style', 'border: 4px solid;border-color:rgb(0, 0, 0)');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    //For heading
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    for (var j = 0; j < 6; ++j) {
        var th = document.createElement('TH');
        th.setAttribute('class', 'th2 td');
        th.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif');
        th.setAttribute('colspan', '4');
        th.appendChild(document.createTextNode("ENC " + (23 + j + 1).toString()));
        tr.appendChild(th);
    }
    for (var i = 0; i < 4; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 6; ++j) {
            for (var k = 0; k < 4; ++k) {
                var td = document.createElement('TD');
                td.setAttribute('class', 'td');
                td.setAttribute('id', 'cn' + pad(368 + i * 4 + j * 16 + k));
                tr.appendChild(td);
            }
        }
    }
    myTableDiv2.appendChild(table);
}

