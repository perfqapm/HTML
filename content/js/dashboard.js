/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 87.27818045488628, "KoPercent": 12.721819545113721};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4296009331000583, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.937992125984252, 500, 1500, "Get_Articles"], "isController": false}, {"data": [0.946313065976714, 500, 1500, "Speciality"], "isController": false}, {"data": [0.0, 500, 1500, "Get_Vitals"], "isController": false}, {"data": [0.4265770423991727, 500, 1500, "Get_Transaction_Details"], "isController": false}, {"data": [0.04281636536631779, 500, 1500, "Laboratory"], "isController": false}, {"data": [0.0388619014573213, 500, 1500, "Get_Doctor_List"], "isController": false}, {"data": [0.9122462344466273, 500, 1500, "Get_Health _Packages"], "isController": false}, {"data": [0.0, 500, 1500, "Send_OTP"], "isController": false}, {"data": [0.9265964450296248, 500, 1500, "Payment_Transaction_History"], "isController": false}, {"data": [0.314638783269962, 500, 1500, "Booking_history"], "isController": false}, {"data": [0.031217481789802288, 500, 1500, "Family_Member"], "isController": false}, {"data": [4.725897920604915E-4, 500, 1500, "Appointment_History"], "isController": false}, {"data": [0.9383202099737533, 500, 1500, "Popular_Doctor"], "isController": false}, {"data": [0.0428, 500, 1500, "Available_Slots"], "isController": false}, {"data": [0.007102272727272727, 500, 1500, "Registration"], "isController": false}, {"data": [0.02022577610536218, 500, 1500, "User_Profile"], "isController": false}, {"data": [0.04296875, 500, 1500, "Medication"], "isController": false}, {"data": [0.03543307086614173, 500, 1500, "Procedure"], "isController": false}, {"data": [0.4568854568854569, 500, 1500, "Get_AppInfo"], "isController": false}, {"data": [0.935124508519004, 500, 1500, "Get_Health_Package_Details"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24006, 3054, 12.721819545113721, 5435.038740314923, 151, 29867, 2908.5, 18227.9, 20162.0, 20309.0, 19.003183820933426, 111.23422128089818, 7.279622368518962], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get_Articles", 1524, 0, 0.0, 305.80118110236174, 160, 4178, 182.0, 341.0, 1049.5, 2844.75, 1.2542394362835667, 3.3928156626030077, 0.24374379669963847], "isController": false}, {"data": ["Speciality", 1546, 0, 0.0, 297.86869340232846, 151, 13994, 169.0, 332.29999999999995, 1044.0, 2509.7199999999993, 1.2423757825119135, 8.537740818292496, 0.21717311041956297], "isController": false}, {"data": ["Get_Vitals", 988, 488, 49.392712550607285, 17015.775303643684, 3091, 24980, 20129.5, 20269.2, 20567.549999999996, 20792.22, 0.8335154187697886, 2.9213755129325656, 0.3361736991717995], "isController": false}, {"data": ["Get_Transaction_Details", 967, 4, 0.4136504653567735, 2991.258531540845, 170, 20163, 1217.0, 8346.400000000001, 10660.399999999994, 13444.199999999997, 0.8260925650814859, 0.3738735265203905, 0.29529108416960614], "isController": false}, {"data": ["Laboratory", 1051, 107, 10.180780209324453, 12312.572787821115, 617, 20884, 12999.0, 20151.6, 20171.0, 20668.8, 0.8684845069305229, 0.22943796693437365, 0.33755550171713683], "isController": false}, {"data": ["Get_Doctor_List", 1441, 180, 12.491325468424705, 9510.87647467038, 787, 20784, 8158.0, 20158.0, 20178.0, 20288.379999999997, 1.1536860308717094, 2.513472534406424, 0.2320891819917697], "isController": false}, {"data": ["Get_Health _Packages", 1527, 0, 0.0, 432.7806155861162, 214, 4507, 270.0, 698.4000000000008, 1310.9999999999986, 2878.6800000000003, 1.233036661644081, 13.622987180698415, 0.22156127513917084], "isController": false}, {"data": ["Send_OTP", 203, 2, 0.9852216748768473, 9380.438423645322, 2698, 20174, 9304.0, 16035.199999999999, 17295.199999999997, 20149.960000000003, 0.17251562626146738, 0.06035125626218976, 0.05761752361466978], "isController": false}, {"data": ["Payment_Transaction_History", 1519, 0, 0.0, 302.24555628703115, 156, 5060, 173.0, 632.0, 852.0, 2574.199999999996, 1.248712445117074, 0.3146170027736378, 0.26461972713906745], "isController": false}, {"data": ["Booking_history", 1052, 3, 0.28517110266159695, 4951.301330798478, 176, 20739, 3875.0, 11603.900000000001, 12754.099999999999, 15048.29, 0.8732290549536658, 4.391223957209286, 2.4030854266205375], "isController": false}, {"data": ["Family_Member", 961, 644, 67.01352757544225, 6913.685744016643, 627, 29867, 5846.0, 11963.2, 13844.2, 16246.3, 0.8288541285733014, 1.4790714871592296, 0.27330192715053575], "isController": false}, {"data": ["Appointment_History", 1058, 112, 10.58601134215501, 13215.831758034044, 1492, 21077, 14304.0, 20155.1, 20180.2, 20648.41, 0.873104422628754, 40.65771159758923, 0.32911944056122955], "isController": false}, {"data": ["Popular_Doctor", 1524, 0, 0.0, 311.14107611548553, 163, 3622, 186.0, 367.5, 1071.25, 2657.25, 1.255954245026454, 5.261765460691681, 0.24407704566432067], "isController": false}, {"data": ["Available_Slots", 1250, 63, 5.04, 7178.125600000004, 650, 20309, 4963.5, 16808.9, 20148.45, 20178.49, 1.0029615448496318, 3.7159842771234906, 0.22331565647042587], "isController": false}, {"data": ["Registration", 704, 501, 71.16477272727273, 7892.866477272731, 1398, 20160, 6766.0, 14557.0, 15917.5, 18398.65000000002, 0.5869239349915046, 0.15008206201218202, 0.47744886508586265], "isController": false}, {"data": ["User_Profile", 1063, 665, 62.558795860771404, 11447.343367826927, 1103, 20696, 11001.0, 20163.0, 20171.0, 20308.44, 0.8697743986856015, 0.39584966163280305, 0.29134044799722786], "isController": false}, {"data": ["Medication", 1024, 132, 12.890625, 12153.1240234375, 616, 20988, 12826.0, 20166.5, 20366.75, 20876.0, 0.8597694239460898, 0.22993413926921277, 0.3341681940727966], "isController": false}, {"data": ["Procedure", 1524, 152, 9.973753280839896, 8428.444225721785, 942, 20749, 6047.0, 20151.0, 20171.75, 20306.5, 1.247619780504058, 23.733335777339164, 0.2851006139042476], "isController": false}, {"data": ["Get_AppInfo", 1554, 1, 0.06435006435006435, 897.6853281853286, 610, 6505, 676.0, 1259.0, 2423.0, 3771.3000000000015, 1.2360664135143262, 0.35322941117224277, 0.2569460193829372], "isController": false}, {"data": ["Get_Health_Package_Details", 1526, 0, 0.0, 315.2791612057667, 167, 4498, 187.0, 436.89999999999986, 981.4999999999986, 2796.3300000000004, 1.2324212393182756, 2.800510033158673, 0.27440629156695984], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.03274394237066143, 0.004165625260351579], "isController": false}, {"data": ["504/Gateway Time-out", 1474, 48.264571054354946, 6.1401316337582275], "isController": false}, {"data": ["400", 3, 0.09823182711198428, 0.012496875781054736], "isController": false}, {"data": ["500", 1575, 51.57170923379175, 6.5608597850537365], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to afiyaapiqa.powermindinc.com:443 [afiyaapiqa.powermindinc.com/20.31.23.53] failed: Read timed out", 1, 0.03274394237066143, 0.004165625260351579], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24006, 3054, "500", 1575, "504/Gateway Time-out", 1474, "400", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to afiyaapiqa.powermindinc.com:443 [afiyaapiqa.powermindinc.com/20.31.23.53] failed: Read timed out", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get_Vitals", 988, 488, "504/Gateway Time-out", 488, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get_Transaction_Details", 967, 4, "400", 3, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Laboratory", 1051, 107, "504/Gateway Time-out", 107, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get_Doctor_List", 1441, 180, "504/Gateway Time-out", 180, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Send_OTP", 203, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Booking_history", 1052, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Family_Member", 961, 644, "500", 641, "504/Gateway Time-out", 2, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to afiyaapiqa.powermindinc.com:443 [afiyaapiqa.powermindinc.com/20.31.23.53] failed: Read timed out", 1, "", "", "", ""], "isController": false}, {"data": ["Appointment_History", 1058, 112, "504/Gateway Time-out", 112, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Available_Slots", 1250, 63, "504/Gateway Time-out", 63, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Registration", 704, 501, "500", 499, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["User_Profile", 1063, 665, "500", 435, "504/Gateway Time-out", 230, "", "", "", "", "", ""], "isController": false}, {"data": ["Medication", 1024, 132, "504/Gateway Time-out", 132, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Procedure", 1524, 152, "504/Gateway Time-out", 152, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get_AppInfo", 1554, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
