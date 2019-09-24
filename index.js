mapkit.init({
    authorizationCallback: function (done) {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFERkMzRks5WUwifQ.eyJpc3MiOiJHWjg0NVlRUDZFIiwiaWF0IjoxNTU0NzY2ODAxLCJleHAiOjE1ODY5MDc2MDF9.PO_7FkHPWAH27l7u8brP4PUT5EBUPvQM9g8AIzn0wd8s0-RbFYMvRyuV7kdDWvKRXC_m_X4CJO82TZGbLmuxbw');
    }
});

var Campus = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(36.989537530470294, -122.05852024725598),
    new mapkit.CoordinateSpan(0.0243376876410224, 0.022487640380859375)
);

var map = new mapkit.Map("map");

var mapAtr = document.getElementById("map");

console.log(mapAtr);

var info = document.createElement("div");
info.className = "info";
info.innerHTML = "Created by <a class='link' href='https://ajzbc.com'>Andrew Jazbec</a> Find on <a class='link' href='https://github.com/ajzbc'>GitHub</a>"

mapAtr.appendChild(info);

var count = document.createElement("div");
count.className = "count";
count.innerHTML = "Buses In Service:  <b id='service'>loading</b>";

mapAtr.appendChild(count);

var browser = navigator.userAgent.indexOf("Chrome") != -1;

var busLandmarks = [];

var url = 'http://slugroute.com:8081/location/get';

function placeBuses() {


    fetch(url).then(response => {
        return response.json();
    }).then(data => {

        var customA = function (coordinate, options) {
            var div = document.createElement("div");
            div.className = "annotation";

            var emoji = document.createElement("p");
            if (browser) {
                emoji.textContent = "\xa0🚌";
            } else {
                emoji.textContent = "🚌";
            }


            if (options.data.color == true) {
                emoji.className = "annotation-bad";
            } else {
                emoji.className = "annotation-good";
            }

            div.appendChild(emoji);

            return div;
        };

        busLandmarks = [];
        map.removeAnnotations(map.annotations);

        data.forEach(function (bus) {
            console.log(bus);

            var options = {
                data: {
                    color: bus.type.includes("OUT")
                }
            };
            var annotation = new mapkit.Annotation(new mapkit.Coordinate(bus.lat, bus.lon), customA, options);
            map.addAnnotation(annotation);
        });

        if (!data[0]) {
            document.getElementById("service").innerHTML = 0;
        } else {
            document.getElementById("service").innerHTML = data.length;
        }

    }).catch(err => {
        console.log(err);
    });
}

placeBuses();
map.region = Campus;

window.setInterval(function () {
    placeBuses();
}, 3000);