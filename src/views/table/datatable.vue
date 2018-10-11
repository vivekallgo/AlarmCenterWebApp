<template>
<div class="app-container">
    <form class="form-horizontal" ref="form" :model="form">
        <div class="form-group">
            <label for="selectCamera" class="col-sm-3 control-label">Select Camera:</label>
            <div class="col-sm-3">
                <select class="form-control custom-select custom-select-sm" id="selectCamera" v-model="form.selectedCamera">
                                                                <!-- <option value="" selected>Please select</option> -->
                                                                <option v-for="camera in form.cameraNames" :value="camera.text" :key="camera.text">{{ camera.text }}</option>
                                                            </select>
            </div>
            <label for="selectAlarm" class="col-sm-3 control-label">Select AlarmType:</label>
            <div class="col-sm-3">
                <select class="form-control custom-select custom-select-sm" id="selectAlarm" v-model=form.selectedAlarmType>
                                                                   <!--  <option value="" selected>Please select</option> -->
                                                                    <option v-for="alarm in form.alarmTypes" :value="alarm.name" :key="alarm.name">{{ alarm.displayname }}</option>                                                            
                                                            </select>
            </div>
        </div>

        <div class="form-group">
            <label for="datePick1" class="col-sm-3 control-label">From:</label>
            <div class="col-sm-3">
                <input type="datetime-local" id="datePick1" placeholder="Pick a date" class="form-control" v-model="form.startDate"/>
            </div>
            <label for="datePick2" class="col-sm-3 control-label">To:</label>
            <div class="col-sm-3">
                <input type="datetime-local" id="datePick2" placeholder="Pick a date" class="form-control" v-model="form.endDate"/>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-4 col-sm-8">
                <button type="button" class="btn btn-sm btn-success" @click="onSubmit">Search</button>
                <!--  <button type="button" class="btn btn-sm btn-danger" @click="onCancel">Reset</button> -->
            </div>
        </div>
        <div class="table-responsive independent">
    <table class="table table-hover table-condensed table-bordered table-striped " id="resultTable">
        <thead>
            <tr>
                <th>TimeStamp</th>
                <th>ID</th>
                <th>Name</th>
                <th>CamName</th>
                <th>ObjectType</th>
                <th>AlarmDescription</th>
                <th>ObjectColor</th>
                <th>RegionName</th>
            </tr>
        </thead>
    </table>
</div>
    </form>
</div>

</template>


<script src = "https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js" > </script>


<script>
var now = new Date();
var prevDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
var appThis;
export default {
    data() {
        return {
            form: {
                selectedCamera: '-1',
                selectedAlarmType: '-1',
                startDate: toDatetime_Local(prevDay),
                endDate: toDatetime_Local(now),
                cameraNames: [],
                alarmTypes: []
            }
        }
    },
    created() {
        this.pullCameraNames()
        this.pullAlarmNames()
        appThis = this;
    },
    methods: {
        onSubmit() {
            this.pullAlarms();
            //console.log(this.form.selectedCamera);
            //console.log(this.form.selectedAlarmType);                 
            Snackbar.show({
                pos: 'bottom-center',
                text: 'Search completed.'
            });
        },
        onCancel() {
            Snackbar.show({
                pos: 'bottom-center',
                actionTextColor: '#ff0000',
                text: 'Reset'
            });
        },
        pullCameraNames() {

            $.ajax({
                "url": "http://192.168.10.17:9000/api/v1/channel",
                "type": "GET",
                success: function (data) {
                    var cameralist = data.result.map(o => {
                        return {
                            'text': o.name
                        };
                    });
                    //console.log(cameralist);
                    appThis.form.cameraNames = cameralist;

                },
                error: function (error) {
                    console.log(error);
                }
            })
        },
        pullAlarmNames() {

            $.ajax({
                "url": "http://192.168.10.17:9000/api/v1/alarm/name",
                "type": "GET",
                success: function (data) {
                    //Get List of Alarms                            
                    var alarmlist = data.result.map(o => {
                        return {
                            'name': o.name,
                            'displayname': o.displayname
                        };
                    });
                    appThis.form.alarmTypes = alarmlist;

                },
                error: function (error) {
                    console.log(error);
                }
            })
        },
        pullAlarms() {
            var filter = "";
            if (appThis.form.selectedCamera != "-1") {
                filter += "&cameraName=" + appThis.form.selectedCamera;
            }
            if (appThis.form.selectedAlarmType != "-1") {
                filter += "&name=" + appThis.form.selectedAlarmType;
            } +
            "&startTime=" + appThis.form.startDate +
                "&endTime=" + appThis.form.endDate

            $.ajax({
                "url": "http://192.168.10.17:9000/api/v1/event?maxEventRows=-1&offset=0" +
                    filter,
                "type": "GET",
                success: function (data) {
                    console.log("Successfull!");
                    console.log(data);
                    // We are using Datatables - https://datatables.net/examples/data_sources/ajax.html
                    // Comes with pagination, search, filter, sort, select and export!     

                    //Check if resulttable is already defined
                    if ($.fn.dataTable.isDataTable('#resultTable')) {
                        $('#resultTable').DataTable().destroy();
                    }

                    var table = $('#resultTable').DataTable({
                        "destroy": true,
                        "data": data.data,
                        "columns": [{
                                "data": "TimeStamp",
                                "width": "15%",
                                "render": function (data, type, row) {
                                    return (new Date(row.TimeStamp)).toLocaleDateString() + " " +
                                        (new Date(row.TimeStamp)).toLocaleTimeString()
                                }
                            },
                            {
                                "data": "id",
                                "width": "8%"
                            },
                            {
                                "data": "AlarmName",
                                "width": "15%"
                            },
                            {
                                "data": "CamName",
                                "width": "15%"
                            },
                            {
                                "data": "ObjectType",
                                "width": "15%"
                            },
                            {
                                "data": "AlarmDescription",
                                "width": "20%"
                            },
                            {
                                "data": "ObjectColor",
                                "width": "15%"
                            },
                            {
                                "data": "RegionName",
                                "width": "15%"
                            }
                        ],
                        dom: '<"col-sm-4"l><"col-sm-4"fr><"col-sm-4 text-right"B><t><"col-sm-4"i><"col-sm-8"p>',
                        /*buttons: ['excel', 'pdf'],*/
                        "lengthMenu": [
                            [5, 10, 20, 50, -1],
                            [5, 10, 20, 50, "All"]
                        ],
                        "order": [
                            [1, 'asc']
                        ],
                        'select': {
                            'style': 'multi'
                        },
                        buttons: [{
                                extend: 'excel',
                                className: "btn-success btn-sm",
                                text: 'Export to CSV',
                                title: createReportTitle(),
                                messageTop: createMessageTop(appThis.form.startDate, appThis.form.endDate),
                                filename: createFilename(appThis.form.startDate, appThis.form.endDate),
                                exportOptions: {
                                    columns: [1, 2, 3, 4, 5, 6]
                                }
                            },
                            {
                                extend: 'pdfHtml5',
                                className: "btn-success btn-sm",
                                text: 'Export to PDF',
                                title: createReportTitle(),
                                orientation: 'landscape',
                                messageTop: createMessageTop(appThis.form.startDate, appThis.form.endDate),
                                filename: createFilename(appThis.form.startDate, appThis.form.endDate),
                                customize: function (doc) {
                                    doc.content.splice(0, 0, {
                                        margin: [0, 0, 0, 12],
                                        alignment: 'right',
                                        image: 'data:image/png;base64,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'
                                    });
                                },
                                exportOptions: {
                                    columns: [1, 2, 3, 4, 5, 6]
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                className: "btn-success btn-sm",
                                text: 'Export to XLSX',
                                title: createReportTitle(),
                                messageTop: createMessageTop(appThis.form.startDate, appThis.form.endDate),
                                filename: createFilename(appThis.form.startDate, appThis.form.endDate),
                                exportOptions: {
                                    columns: [1, 2, 3, 4, 5, 6]
                                }
                            }
                        ],
                        // ], //Refer : https://datatables.net/reference/option/language.emptyTable
                        "language": {
                            "emptyTable": "<label>No result found. ",
                            "loadingRecords": "<label>Please wait - we're getting your results ...</label>"
                        }

                    });
                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    }
}

function toDatetime_Local(dt) {
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();
    var hh = dt.getHours();
    var mins = dt.getMinutes();

    return yyyy + "-" +
        (mm < 10 ? "0" + mm : mm) + "-" +
        (dd < 10 ? "0" + dd : dd) + "T" +
        (hh < 10 ? "0" + hh : hh) + ":" +
        (mins < 10 ? "0" + mins : mins);
}

function createMessageTop(startDate, endDate) {
    var start = new Date(startDate);
    var end = new Date(endDate);
    return "Time Interval: " + start.toLocaleDateString() +
        " " + start.toLocaleTimeString() + " to " +
        end.toLocaleDateString() +
        " " + end.toLocaleTimeString();
}

function createFilename(startDate, endDate) {
    return "Report_" + startDate + "_to_" + endDate;
}

function createReportTitle(startDate, endDate) {
    return "AllGoVision Alarm Report";
}
</script>

<style>

</style>
