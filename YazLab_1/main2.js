function initMap() {

    let marker_coords = []
    let shortest_paths = []

    let worker = new Worker("./shortest_path_thread.js")

    let shortest_path
    let cargoman_marker

    worker.onmessage = function (e) {
        shortest_path = e.data[1]
        console.log("bekledi")
        localStorage.setItem("shortest_path", JSON.stringify(shortest_path))
        console.log("shortest path", shortest_path)
        setTimeout(() => {
            window.opener.parent.postMessage("get shortest path")
        }, 40);
        if (marker_coords.length == 1) {
            displayRoute(marker_coords, shortest_path, directionsService, directionsRenderer, true)
        } else
            displayRoute(marker_coords, shortest_path, directionsService, directionsRenderer, false)
    }


    setInterval(() => {
        marker_coords_2 = JSON.parse(localStorage.getItem("marker_coords"))
        if (marker_coords && marker_coords_2 && marker_coords.length != marker_coords_2.length) {
            shortest_paths = localStorage.getItem("shortest_paths")
            marker_coords = marker_coords_2
            drawCargoman()
            sendMessage(worker,shortest_paths, marker_coords_2.length)
        }

    }, 1000);

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: {
            lat: 40.766666,
            lng: 29.916668
        }, // Kocaeli.
    });
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
        panel: document.getElementById("panel"),
    });

    directionsRenderer.setMap(map);

    function drawCargoman() {
        if (typeof cargoman_marker === "undefined") {
            //
        } else {
            cargoman_marker.setMap(null)
        }
        cargoman_marker = new google.maps.Marker({
            position: marker_coords[0],
            map: map,
            icon: "cargoman_image.png"
        });
    }


}


async function sendMessage(worker,shortest_paths, leng){
    console.log(shortest_paths)
    shortest_paths = await JSON.parse(shortest_paths)
    console.log("main 2 shortest paths ", shortest_paths)
    worker.postMessage([shortest_paths, leng])
    
}

function displayRoute(marker_coords, permutation, directionsService, directionsRenderer, justCargoman) {

    if (justCargoman) {
        let waypts = []

        for (let i = 1; i < 2; i++) {
            waypts.push({
                location: marker_coords[0],
                stopover: true, // mola yeri olacak mı ?
            });
        }

        directionsService
            .route({
                origin: marker_coords[0],
                destination: marker_coords[0],
                waypoints: waypts,
                travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((result) => {
                directionsRenderer.setDirections(result);
            })
            .catch((e) => {
                alert("Could not display directions due to: " + e);
            });
    }

    /*if (marker_coords.length < 2) {
        return
    }*/

    let waypts = []

    for (let i = 1; i < marker_coords.length - 1; i++) {
        waypts.push({
            location: marker_coords[permutation[i]],
            stopover: true, // mola yeri olacak mı ?
        });
    }
    directionsService
        .route({
            origin: marker_coords[0],
            destination: marker_coords[permutation[permutation.length - 1]],
            waypoints: waypts,
            travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((result) => {
            directionsRenderer.setDirections(result);
        })
        .catch((e) => {
            alert("Could not display directions due to: " + e);
        });
}