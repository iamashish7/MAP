function CreateTable(_page) {
    var running_data = [];
    var queue_data = [];
    var hold_data = [];
    if (_page == '2010') {
        $.getJSON("realtime/2010/jsonoutput.json", function (data) {
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
                // pageLength: 20,
                "scrollY": "75vh",
                "scrollX": true,
                "scrollCollapse": true,
                "paging": false,
                destroy: true,
                responsive: true,
                data: running_data,
                // stateSave: true,
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
                // select: {
                //     style: 'multi',
                //     selector: 'td:first-child'
                // },
                columnDefs: [
                    // {
                    //     orderable: false,
                    //     className: 'select-checkbox',
                    //     targets: 0
                    // },
                    // {
                    //     'targets': 0,
                    //     'checkboxes': {
                    //         'selectRow': true
                    //     }
                    // },
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
    else {
        $.getJSON("realtime/2013/jsonoutput.json", function (data) {
            $.each(data, function (key, value) {
                job_data = [key, value["Jobname"], value["Username"], value["Queue"], value["Elapsed_Time"], value["Nodes"], value["RequiredTime"], value["Exec_host"].join(', ')];
                job_data_Q = [key, value["Jobname"], value["Username"], value["Queue"], value["Nodes"], value["RequiredTime"]];

                if (value["State"] == "R") {
                    running_data.push(job_data);
                }
                else if (value["State"] == "Q")
                    queue_data.push(job_data_Q);
                else
                    hold_data.push(job_data);
            });
            $('#running').DataTable({
                destroy: true,
                responsive: false,
                data: running_data,
                stateSave: true,
                columns: [
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
                ],

            });


            $('#queue').DataTable({
                destroy: true,
                data: queue_data,
                stateSave: true,
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
                destroy: true,
                data: hold_data,
                stateSave: true,
                responsive: true,
                columns: [
                    { title: "Job ID" },
                    { title: "Job Name" },
                    { title: "User" },
                    { title: "Queue" },
                ]

            });
            openRunning();
        });
    }

}
