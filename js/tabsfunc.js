function opentable(evt, tablename) {
    console.log(evt);
    console.log(tablename);

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    var table = $('#' + tablename).DataTable();
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("nav-link");
    for (i = 4; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tablename).parentNode.parentNode.parentNode.parentNode.style.display = "block";
    document.getElementById(tablename).style.dispay = "block";
    evt.currentTarget.className += " active";
    table.columns.adjust().draw();
}

function openRunning() {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    var table = $('#running').DataTable();
    // console.log(table);
    for (i = 4; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("nav-link");
    // console.log(tablinks);
    tablinks[4].className += " active";

    document.getElementById('running').parentNode.parentNode.parentNode.parentNode.style.display = "block";
    document.getElementById('running').style.dispay = "block";
    table.columns.adjust().draw();
}

function plotTopology(evt)
{
    console.log(evt);

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("nav-link");
    for (i = 2; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById("graph-container").parentNode.style.display = "block";
    document.getElementById("graph-container").style.dispay = "block";
    evt.currentTarget.className += " active";

    // sigma.parsers.json('./config_json/data2010.json', {
    //     renderer: {
    //         container: document.getElementById("graph-container"),
    //         type: 'canvas'
    //     }
    // }, function(s) {
    //     s.startForceAtlas2({worker: true, barnesHutOptimize: false});
    //     setTimeout(function() { s.stopForceAtlas2(); }, 4000);
    // });
}

function openDiag(evt,diag)
{
    console.log("indiag");
    var table = $('#running').DataTable();
    if ( table.rows( '.selected' ).any() ){
        table.rows().iterator( 'row', function ( context, index ) {
            if($( this.row( index ).node() ).hasClass( 'selected' )){
                var d2 = table.row(index).data()[7].split(', ');
                remove_edges(sig,d2);
            }
        } );
    }
    table.$('tr.selected').removeClass('selected');
    console.log(evt);
    console.log(diag);

    tablinks = document.getElementsByClassName("nav-link");
    tablinks[2].className = tablinks[2].className.replace(" active", "");
    tablinks[3].className = tablinks[3].className.replace(" active", "");
    
    if(diag=='GRID')
    {
        document.getElementsByClassName('GRID')[0].style.display = "block";
        document.getElementById("graph-container").style.display = "none";
    }
    else
    {
        document.getElementsByClassName('GRID')[0].style.display = "none";
        document.getElementById("graph-container").style.display = "block";
    }
    evt.currentTarget.className += " active";
}