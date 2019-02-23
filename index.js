mapkit.init({
    authorizationCallback: function(done) {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1SWVBEV1dINzMifQ.eyJpc3MiOiJHWjg0NVlRUDZFIiwiaWF0IjoxNTUwODg4MzgzLCJleHAiOjE1NTM1NjY3ODN9.IQjTmTuPdcUbAc1cHBdNxIxOOmjgzrR42CdARBAcQoViW_DXuyDTWSH_U6eYkQFXfPlEFBFhriDL9ffehuxQNA');
    }
});

var Campus = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(36.990320, -122.058319),
    new mapkit.CoordinateSpan(.02, 0.02)
);

var MarkerAnnotation = mapkit.MarkerAnnotation, clickAnnotation;

var map = new mapkit.Map("map");

var browser = navigator.userAgent.indexOf("Chrome") != -1;

var busLandmarks = [];

var url = 'http://slugroute.com:8081/location/get';

function placeBuses() {


    fetch(url).then(response => {
        return response.json();
    }).then(data => {

        var customA = function(coordinate, options) {
            var div = document.createElement("div");
            div.className = "annotation";

            var emoji = document.createElement("p");
            if(browser) {
                emoji.textContent = "\xa0🚌";
            }
            else {
                emoji.textContent = "🚌";
            }
            

            if(options.data.color == true) {
                emoji.className = "annotation-bad";
            }
            else {
                emoji.className = "annotation-good";
            }

            div.appendChild(emoji);

            return div;
        };

        busLandmarks = [];
        map.removeAnnotations(map.annotations);
        
        data.forEach(function(bus) {
            console.log(bus);

            var options = {
                data: { color: bus.type.includes("OUT") }
            };
            var annotation = new mapkit.Annotation(new mapkit.Coordinate(bus.lat, bus.lon), customA, options);
            map.addAnnotation(annotation);
        });
    
    }).catch(err => {
        console.log(err);
    });
}

placeBuses();
map.region = Campus;

window.setInterval(function(){
    placeBuses();
}, 3000);

var bottom = document.getElementsByClassName("mk-bottom-left-controls-container");

var info = document.createElement("div");
info.className = "info";
info.innerHTML = "Created by <a class='link' href='https://ajzbc.com'>ajzbc</a> Find on <a class='link' href='https://github.com/ajzbc'>GitHub</a>"

bottom[0].appendChild(info);