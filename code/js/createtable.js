function CreateTable(_page) {
    var running_data = [];
    var queue_data = [];
    var hold_data = [];
    $.getJSON("realtime/".concat(_page).concat("/jsonoutput.json"), function (data) {
        $.each(data, function (key, value) {
            job_data = [key, value["Jobname"], value["Username"], value["Queue"], value["Elapsed_Time"], value["Nodes"], value["RequiredTime"], value["Exec_host"].join(', ')];
            job_data_Q = [key, value["Jobname"], value["Username"], value["Queue"], value["Nodes"], value["RequiredTime"]];
            job_data_H = [key, value["Jobname"], value["Username"], value["Queue"], value["Elapsed_Time"], value["Nodes"], value["RequiredTime"], value["Exec_host"].join(', ')];
            if (value["State"] == "R") {
                running_data.push(job_data);
            }
            else if (value["State"] == "Q")
                queue_data.push(job_data_Q);
            else
                hold_data.push(job_data_H);
        });
        $('#running').DataTable({
            "scrollY": "75vh",
            "scrollX": true,
            "scrollCollapse": true,
            "paging": false,
            destroy: true,
            responsive: true,
            data: running_data,
            dom: 'Bfrtip',
            buttons: {
                buttons:[
                            { 
                                text: 'Reset',
                                className: "btn btn-outline-info btn-sm",
                                action: function ( e, dt, node, config ) {
                                    clearEdges(sig);
                                }
                            },
                        ],
                dom:{
                        button:{
                                className: 'btn'
                            }
                }
            },
            columns: [
                // { title: '<input name="select_all" value="1" id="select-all" type="checkbox" />' },
                { title: "Job ID" },
                { title: "Job Name" },
                { title: "User" },
                { title: "Queue" },
                { title: "Elapsed_Time" },
                { title: "Nodes" },
                { title: "Required_Time" },
                { title: "Exec_host" }
            ],
            deferRender: true,
            columnDefs: [
                {
                    render: function (data, type, full, meta) {
                        return "<div class='text-wrap'>" + data + "</div>";
                    },
                    targets: 7
                },
                {
                    visible: false, targets: [1]
                }
            ]
        });
        $('#queue').DataTable({
            "scrollY": "75vh",
            "scrollCollapse": true,
            "paging": false,
            destroy: true,
            data: queue_data,
            // stateSave: true,
            responsive: true,
            columns: [
                { title: "Job ID" },
                { title: "Job Name" },
                { title: "User" },
                { title: "Queue" },
                { title: "Requested_Nodes" },
                { title: "Required_Time" },
            ]

        });
        $('#hold').DataTable({
            "scrollY": "75vh",
            "scrollCollapse": true,
            "paging": false,
            destroy: true,
            data: hold_data,
            // stateSave: true,
            responsive: true,
            columns: [
                { title: "Job ID" },
                { title: "Job Name" },
                { title: "User" },
                { title: "Queue" }
            ]
        });
        openRunning();
    });
}
