var jsonData;
$(document).ready(function() {
    var charts = [
        {title: "Which Faction", id: "factionChart"},
        {title: "What level are you?", id:"levelChart"},
        {title: "Do You Use IITC?", id: "IITCChart"},
        {title: "Mobile Device", id: "deviceChart"},
        {title: "Have you attended an Anomaly?", id: "anomalyChart"},
        {title: "Do you play Pokemon Go?", id: "pokemonChart"},
        {title: "How do you get around?", id: "travelChart"},
        {title: "Do you keep up with the storyline?", id: "storyLineChart"}
    ];
    charts.forEach(function (value) {
        $('.chartContainer').append(`<div class="chartHolder col-sm-12 col-md-6 col-lg-4 col-xl-3" name="${value.title}"><center><h3>${value.title}</h3></center><canvas id="${value.id}" width="700" height="385"></canvas></div>`);
    });
    $.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRiJXhV13vGxD8OrxTrgmwhHzsSTEd_Oao2V2Ufalr88aOqUMO_N9IAv1Hg1xbStZiIIC2YopZRUQMO/pub?output=csv', function (data) {
        jsonData = JSON.parse(CSV2JSON(data));
        $('h3.subheading#responses').text("Currently " + jsonData.length + " Responses");
        //console.dir(jsonData);
        var factionChart = new Chart($('canvas#factionChart'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: ComputeFactionRatio(jsonData),
                    backgroundColor: [
                        "#00c2ff",
                        "#28f428"
                    ]
                }],
                labels: [
                    'Resistance',
                    'Enlightened'
                ]

            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                }
            }
        });
        var levelChart = new Chart($('canvas#levelChart'), {
            type: 'pie',
            data: {
                datasets: [{
                    data: ComputeLevelRatio(jsonData),
                    backgroundColor: [
                        "#fece5a",
                        "#ffa630",
                        "#ff7315",
                        "#e40000",
                        "#fd2992",
                        "#eb26cd",
                        "#c124e0",
                        "#9627f4",
                        "#353b48",
                        "#dcdde1"
                    ]
                }],
                labels: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9-15",
                    "16"
                ]
            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                },
                rotation: Math.PI
            }
        });
        var IITCChart = new Chart($('canvas#IITCChart'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: ComputeIITCRatio(jsonData),
                    backgroundColor: [
                        "#ecf0f1",
                        "#34495e"
                    ]
                }],
                labels: [
                    'Yes',
                    'No'
                ]

            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                }
            }
        });
        var deviceChart = new Chart($('canvas#deviceChart'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: ComputeDeviceRatio(jsonData),
                    backgroundColor: [
                        "#33d9b2",
                        "#218c74",
                        "#706fd3",
                        "#474787",
                        "#f7f1e3"
                    ]
                }],
                labels: [
                    'Android Phone',
                    'Android Tablet',
                    'iPhone',
                    'iPad',
                    'Other'
                ]

            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                }
            }
        });
        var anomalyChart = new Chart($('canvas#anomalyChart'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: ComputeAnomalyRatio(jsonData),
                    backgroundColor: [
                        "#1B9CFC",
                        "#B33771"
                    ]
                }],
                labels: [
                    'Yes',
                    'No'
                ]
            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                },
                rotation: Math.PI
            }
        });
        var PokemonGoChart = new Chart($('canvas#pokemonChart'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: ComputePokemonGoRatio(jsonData),
                    backgroundColor: [
                        "#ee1515",
                        "#f0f0f0"
                    ]
                }],
                labels: [
                    'Yes',
                    'No'
                ]
            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                },
                rotation: Math.PI
            }
        });
        var TransportationChart = new Chart($('canvas#travelChart'), {
            type: 'pie',
            data: {
                datasets: [{
                    data: TransportationRatio(jsonData),
                    backgroundColor: [
                        "#5E9294",
                        "#04B2D9",
                        "#08C471",
                        "#984577",
                        "#7B7D7B",
                        "#21D5C2",
                        "#E8C47E",
                        "#4169E1"
                    ]
                }],
                labels: [
                    "Walking",
                    "Public Transportation",
                    "Car",
                    "Bike",
                    "Rideshare ",
                    "Skates",
                    "Motorcycle",
                    "Other"
                ]

            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                }
            }
        });
        var StoryLineChart = new Chart($('canvas#storyLineChart'), {
            type: 'pie',
            data: {
                datasets: [{
                    data: ComputeYNRatio(jsonData, "Have you kept up with the Ingress story-line?"),
                    backgroundColor: [
                        "#43AC65",
                        "#1492C0"

                    ]
                }],
                labels: [
                    "Yes",
                    "No"
                ]
            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                }
            }
        });

    });

    function CSVToArray(strData, strDelimiter) {
        strDelimiter = (strDelimiter || ",");
        var objPattern = new RegExp((
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        var arrData = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec(strData)) {
            var strMatchedDelimiter = arrMatches[1];
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                arrData.push([]);
            }
            if (arrMatches[2]) {
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"), "\"");
            } else {
                var strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        return (arrData);
    }

    function CSV2JSON(csv) {
        var array = CSVToArray(csv);
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
            objArray[i - 1] = {};
            for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                var key = array[0][k];
                objArray[i - 1][key] = array[i][k]
            }
        }
        var json = JSON.stringify(objArray);
        var str = json.replace(/},/g, "},\r\n");
        return str;
    }

    function ComputeFactionRatio(jsonData) {
        var factions = {"r": 0, "e": 0};
        jsonData.forEach(function (items) {
            if (items["What faction do you play for?"] === "Resistance") {
                factions.r++;
            } else {
                factions.e++;
            }
        });
        var total = factions.r + factions.e;
        var results = [];
        results.push(Number.parseFloat(factions.r / total * 100).toPrecision(2));
        results.push(Number.parseFloat(100 - (factions.r / total * 100)).toPrecision(2));
        return results;
    }

    function ComputeYNRatio(jsonData, key) {
        var responses = {y: 0, n: 0};
        jsonData.forEach(function (items) {
            if (items[key] === "Yes") {
                responses.y++;
            } else {
                responses.n++;
            }
        });
        var total = responses.y + responses.n;
        var results = [];
        results.push(Number.parseFloat(responses.y / total * 100).toPrecision(2));
        results.push(Number.parseFloat(100 - (responses.y / total * 100)).toPrecision(2));
        return results;
    }

    function ComputeLevelRatio(jsonData) {
        var responses = new Array(10);
        responses.fill(0);
        jsonData.forEach(function (items) {
            var level = parseInt(items["What is your current level?"].substring(1));
            if (8 < level && level < 16) {
                responses[8]++;
            } else if (level === 16) {
                responses[9]++;
            } else {
                responses[level - 1]++;
            }


        });
        var total = responses.reduce(function (acc, val) {
            return acc + val;
        });
        console.log(total);
        var results = [];
        responses.forEach(function (items) {
            results.push(parseFloat(items / total * 100).toPrecision(2));
        });
        console.dir(results);
        return results;

    }

    function ComputeIITCRatio(jsonData) {
        var responses = {y: 0, n: 0};
        jsonData.forEach(function (items) {
            if (items["Do you use IITC?"] === "Yes") {
                responses.y++;
            } else {
                responses.n++;
            }
        });
        var total = responses.y + responses.n;
        var results = [];
        results.push(Number.parseFloat(responses.y / total * 100).toPrecision(2));
        results.push(Number.parseFloat(100 - (responses.y / total * 100)).toPrecision(2));
        return results;

    }

    function ComputeDeviceRatio(jsonData) {
        var responses = {aphone: 0, iphone: 0, atablet: 0, ipad: 0, other: 0};
        jsonData.forEach(function (items) {
            switch (items["What kind of device do you play the most often on?"]) {
                case "Android Phone":
                    responses.aphone++;
                    break;
                case "iPhone":
                    responses.iphone++;
                    break;
                case "iPad":
                    responses.ipad++;
                    break;
                case "Android Tablet":
                    responses.atablet++;
                    break;
                default:
                    responses.other++;
                    break;
            }
        });
        var total = responses.aphone + responses.atablet + responses.iphone + responses.ipad + responses.other;
        var results = [];
        results.push(Number.parseFloat(responses.aphone / total * 100).toPrecision(2));
        results.push(Number.parseFloat(responses.atablet / total * 100).toPrecision(2));
        results.push(Number.parseFloat(responses.iphone / total * 100).toPrecision(2));
        results.push(Number.parseFloat(responses.ipad / total * 100).toPrecision(2));
        results.push(Number.parseFloat(responses.other / total * 100).toPrecision(2));
        return results;

    }

    function ComputeAnomalyRatio(jsonData) {
        var responses = {y: 0, n: 0};
        jsonData.forEach(function (items) {
            if (items["Have you attended an anomaly?"] === "Yes") {
                responses.y++;
            } else {
                responses.n++;
            }
        });
        var total = responses.y + responses.n;
        var results = [];
        results.push(Number.parseFloat(responses.y / total * 100).toPrecision(2));
        results.push(Number.parseFloat(100 - (responses.y / total * 100)).toPrecision(2));
        return results;
    }

    function ComputePokemonGoRatio(jsonData) {
        var responses = {y: 0, n: 0};
        jsonData.forEach(function (items) {
            if (items["Do you play Pokemon Go?"] === "Yes") {
                responses.y++;
            } else {
                responses.n++;
            }
        });
        var total = responses.y + responses.n;
        var results = [];
        results.push(Number.parseFloat(responses.y / total * 100).toPrecision(2));
        results.push(Number.parseFloat(100 - (responses.y / total * 100)).toPrecision(2));
        console.dir(results);
        return results;
    }

    function TransportationRatio(jsonData) {
        var responses = {w: 0, pt: 0, c: 0, b: 0, rs: 0, skate: 0, motor: 0, other: 0};
        jsonData.forEach(function (items) {
            switch (items["How do you most often get around while playing?"]) {
                case "Walking":
                    responses.w++;
                    break;
                case "Public Transportation":
                    responses.pt++;
                    break;
                case "Car":
                    responses.c++;
                    break;
                case "Bicycle":
                    responses.b++;
                    break;
                case "Taxi / Uber / Lyft":
                    responses.rs++;
                    break;
                case "Skateboard, Scooter, Rollerblades":
                    responses.skate++;
                    break;
                case "Motorcycle":
                    responses.motor++;
                    break;
                default:
                    responses.other++;
                    break;
            }
        });
        var total = responses.w + responses.pt + responses.c + responses.b + responses.rs + responses.skate + responses.motor + responses.other;
        var results = [];
        //results.push(Number.parseFloat(responses.y / total * 100).toPrecision(2));
        //results.push(Number.parseFloat(100 - (responses.y / total * 100)).toPrecision(2));
        results.push(responses.w);
        results.push(responses.pt);
        results.push(responses.c);
        results.push(responses.b);
        results.push(responses.rs);
        results.push(responses.skate);
        results.push(responses.motor);
        results.push(responses.other);
        console.dir(results);
        return results;
    }
});
