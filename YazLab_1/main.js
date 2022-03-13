let marker_coords = [] // işaretçi kordinatları tutar.
let shortest_paths = {} // iki nokta arasında en kısa yolları tutar.
let markers = [] // işaretçi class'larını tutar
let shortest_path // 2.GUI ekranından thread üzerinden hesaplanmış en kısa yolu alır
let selected_cargo = 1 // Silinecek kargo numarasını tutar
let marker_adresses = {} // marker adreslerini tutar
const {
    ObjectId
} = require("bson")
const mongoose = require("mongoose")
const {
    db_cargo_address,
    db_cargo_locations,
    db_courier_locations,
    db_login,
    db_shortest_paths,
    db_verifications
} = require("./schemas")
const url = "mongodb+srv://admin:uzunburunmurat@cluster0.suejd.mongodb.net/mydb?retryWrites=true&w=majority"

// Database bağlantı değişkenleri
async function initDatabase() {
    await mongoose.connect(url);
    console.log("Database baglandi!");
}
initDatabase()

// parolamı unuttum sayfası işlemleri
document.getElementById("forgot_password").addEventListener("click", (e) => {
    document.getElementById("login_section").style.display = "none"
    document.getElementById("google_maps_api_section").style.display = "none"
    document.getElementById("forgot_password_section").style.display = "initial"
})
document.getElementById("form_submit_p").addEventListener("submit", async (e) => {
    e.preventDefault()
    let email_dom = document.getElementById("email_text_p")
    let password_dom = document.getElementById("password_text_p")
    let password_again_dom = document.getElementById("password_text_again_p")
    let code_dom = document.getElementById("code")

    if (password_dom.value != password_again_dom.value) {
        alert("girdiginiz sifreler eslesmiyor, lutfen tekrar giriniz")
    } else {
        let result = await db_verifications.find({
            email: email_dom.value,
            code: code_dom.value
        })
        console.log(result)
        if (result.length > 0) {
            let doc = await db_login.findOneAndUpdate({
                username: email_dom.value
            }, {
                password: password_dom.value
            });
            document.getElementById("login_section").style.display = "initial"
            document.getElementById("google_maps_api_section").style.display = "none"
            document.getElementById("forgot_password_section").style.display = "none"
        } else {
            alert("girdiginiz kod hatali")
        }
    }

})

// silinecek kargoyu seçme işlemleri
function selectCargo() {
    selected_cargo = document.getElementById("select_cargo").value
    console.log(selected_cargo)
}

// yeni girilen lokasyonlara göre kargo silme penceresini düzenleme
function optionsUpdate() {
    /*<option selected>Open this select menu</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option> */
    let select_cargo = document.getElementById("select_cargo")
    select_cargo.innerHTML = ""
    for (let i = 1; i < marker_coords.length; i++) {
        select_cargo.innerHTML += `<option value="${i}">${i}</option>`
    }
}

// önceki çalıştırmadan kalan gereksiz verileri silme
localStorage.clear()

let alphabet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

async function printDeliveryStation() {
    try {
        let status_dom = document.getElementById("deliveryStatus")
        status_dom.innerHTML = "<h2>Teslimat Durumu</h2>"
        let email_dom = document.getElementById("email_text")
        let res = await db_login.findOne({username : email_dom.value})
        let result = await db_cargo_locations.find({
            cargoman_id : res._id
        })
        for (let i = 0; i < result.length; i++) {
            let result2 = await db_cargo_address.findOne({
                lat: result[i].lat,
                lng: result[i].lng
            }).clone().catch(function (err) {
                console.log(err)
            })
            if (result[i].isDelivered) {
                status_dom.innerHTML += `<p> ${result2.address} // Kargo Teslim Edildi . </p><br>`
            } else {
                status_dom.innerHTML += `<p> ${result2.address} // Kargo Teslim Edilecek . </p><br>`
            }
        }
    } catch (err) {
        console.log(err)
    }
}

function printDeliveryOrder(shortest_path) {
    let order_dom = document.getElementById("deliveryOrder")
    order_dom.innerHTML = "<h2>Teslimat Sırası</h2>"
    for (let i = 0; i < shortest_path.length; i++) {
        order_dom.innerHTML += `<p> ${alphabet[i]} => ${marker_adresses[ marker_coords[shortest_path[i]] ]} // Marker No : ${shortest_path[i]} </p><br>`
    }
}


function change(i, j) {
    let temp = marker_coords[j]
    marker_coords[j] = marker_coords[i]
    marker_coords[i] = temp
}

async function addAddressToDatabase(i) {
    await db_cargo_address.create({
        lat: String(marker_coords[i].lat()),
        lng: String(marker_coords[i].lng()),
        address: marker_adresses[marker_coords[i]]
    })
}

async function getAdressFromDatabase() {

    for (let i = 1; i < marker_coords.length; i++) {
        let myobj = {
            lat: String(marker_coords[i].lat()),
            lng: String(marker_coords[i].lng()),
        }
        let result = await db_cargo_address.findOne(myobj).exec()
        marker_adresses[marker_coords[i]] = result.address
    }
    printDeliveryStation()

}

// google maps api ana fonksiyon
function initMap() {

    // window'lar arası iletişim 
    window.addEventListener("message", (event) => {
        console.log(event.data)
        if (event.data == 'get shortest path') {
            shortest_path = JSON.parse(localStorage.getItem("shortest_path"))
            printDeliveryOrder(shortest_path)
            console.log("shortes path", shortest_path)
            addShortestPathsToDatabase()

        } else {
            console.log("sp", shortest_paths)
            localStorage.setItem("marker_coords", JSON.stringify(marker_coords))
            localStorage.setItem("shortest_paths", JSON.stringify(shortest_paths))
        }
    })

    // login bilgilerinin database'de kontrolü
    document.getElementById("form_submit").addEventListener("submit", async (e) => {
        e.preventDefault()
        let email_dom = document.getElementById("email_text")
        let password_dom = document.getElementById("password_text")

        let result = await db_login.findOne({
            username: email_dom.value,
            password: password_dom.value
        }).exec()
        if (result) {
            document.getElementById("login_section").style.display = "none"
            document.getElementById("google_maps_api_section").style.display = "initial"
            let window2 = window.open("./html2.html", "2.GUI")
            initLocations("courier_locations")
            setTimeout(() => {
                initLocations("cargo_locations")
            }, 500);
        }
    })

    // 1.GUI ekranında haritaya tıklayarak lokasyon ekleme
    document.getElementById("add_location").addEventListener("click", (e) => {
        query_number = 0
        console.log("ekleye girdi")
        let lng_ = Number(document.getElementById("lng").value)
        let lat_ = Number(document.getElementById("lat").value)
        let coord = new google.maps.LatLng({
            lat: lat_,
            lng: lng_
        })
        console.log(coord)
        addMarkerAndCalculate(coord, true)
    })

    // İlk açılışta database'e bağlanma ve lokasyonları güncelleme
    async function initLocations(type) {
        query_number = 0
        let result_
        let find_dict
        let cargoman_id2
        if (type == "courier_locations") {
            let email_dom = document.getElementById("email_text")
            find_dict = {
                email: email_dom.value
            }
        } else {
            let email_dom = document.getElementById("email_text")
            let find = await db_login.findOne({
                username: email_dom.value
            }).exec()
            console.log(find)
            cargoman_id2 = find._id
            console.log("cargoman_id", String(cargoman_id2))
        }

        if (type == "courier_locations") {
            result_ = await db_courier_locations.find(find_dict)
        } else {
            result_ = await db_cargo_locations.find({
                cargoman_id : cargoman_id2,
                isDelivered : false
            })
            console.log(result_, find_dict)
        }
        for (let i = 0; i < result_.length; i++) {
            if (type == "courier_locations") {
                await addMarkerAndCalculate(new google.maps.LatLng({
                    lat: Number(result_[i].lat),
                    lng: Number(result_[i].lng)
                }), false, true)
                console.log(result_[i])
                marker_adresses[marker_coords[0]] = result_[i].address
            } else {
                await addMarkerAndCalculate(new google.maps.LatLng({
                    lat: Number(result_[i].lat),
                    lng: Number(result_[i].lng)
                }), false, true)
            }
        }
        setTimeout(() => {
            getShortestPathFromDatabase()
            getAdressFromDatabase()
        }, 2500);

    }

    // Kargocu lokasyonunu database üzerinde güncelleme
    async function updateCargomanLocation() {
        let email_dom = document.getElementById("email_text")
        await db_courier_locations.findOneAndUpdate({
            email: email_dom.value
        }, {
            lat: String(marker_coords[1].lat()),
            lng: String(marker_coords[1].lng()),
            address: marker_adresses[marker_coords[1]]
        })
    }

    // Kargo teslim bilgisi güncelleme
    async function deleteCargo(id) {

        await db_cargo_locations.findOneAndUpdate({
            lat: String(marker_coords[id].lat()),
            lng: String(marker_coords[id].lng())
        }, {
            isDelivered: true
        })

    }

    function removeMarker(id, isMovement) {
        console.log(id)
        if (markers.length > 1) {
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(null)
            }
            markers = []
            if (isMovement) {
                let next = shortest_path[1]
                change(1, next)
                updateCargomanLocation()
                deleteCargo(1)
            } else {
                deleteCargo(id)
            }
            marker_coords.splice(id, 1)



            drawMarkers(markers)
            query_number = 0
            calculatePaths(directionsService, directionsRenderer)

            setTimeout(() => {
                window.postMessage("message")
                printDeliveryStation()
            }, 500);

            optionsUpdate()
        }
    }

    document.getElementById("move").addEventListener("click", (e) => {
        removeMarker(0, true)

    })

    document.getElementById("delete_cargo").addEventListener("click", (e) => {
        removeMarker(selected_cargo, false)
        selected_cargo = 1
    })


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

    // eklenen kargoları database'e ekleme
    async function addCargoToDatabase(location) {
        if (marker_coords.length == 0)
            return
        let email_dom = document.getElementById("email_text")
        let cargoman_id2
        let find = await db_login.findOne({
            username: email_dom.value
        }).exec()
        cargoman_id2 = find._id
        console.log(cargoman_id2)
        await db_cargo_locations.create({
            cargoman_id: cargoman_id2,
            lat: String(location.lat()),
            lng: String(location.lng()),
            isDelivered: false
        })

    }

    // en kısa yolları database'e ekleme
    async function addShortestPathsToDatabase() {
        let email_dom = document.getElementById("email_text")
        let cargoman_id2
        let find = await db_login.findOne({
            username: email_dom.value
        }).exec()
        cargoman_id2 = find._id

        let res = await db_shortest_paths.find({
            cargoman_id: cargoman_id2
        })
        console.log(shortest_paths)
        if (res.length > 0) {
            await db_shortest_paths.findOneAndUpdate({
                cargoman_id: cargoman_id2
            }, {
                shortest_paths: shortest_paths
            })
        } else {
            await db_shortest_paths.create({
                cargoman_id: cargoman_id2,
                shortest_paths: shortest_paths
            })
        }


    }

    // en kısa yolu database üzerinden çekmek
    async function getShortestPathFromDatabase() {
        let email_dom = document.getElementById("email_text")
        let cargoman_id2
        let find = await db_login.findOne({
            username: email_dom.value
        }).exec()
        cargoman_id2 = find._id
        console.log("cargoman_id_2", cargoman_id2)
        let res = await db_shortest_paths.findOne({
            cargoman_id: cargoman_id2
        })
        shortest_paths = res.shortest_paths[0]
        console.log("393", shortest_paths)
        window.postMessage("message")

    }

    // bir lokasyon ekleme ve bu lokasyona göre en kısa yolu yeniden hesaplama
    function addMarkerAndCalculate(location, addToDatabase = false, notCalculate = false) {

        console.log(location)
        if (addToDatabase)
            addCargoToDatabase(location)
        marker_coords.push(location)
        placeMarker(location, String(marker_coords.length - 1), marker_coords.length == 1);
        if (marker_coords.length > 0 && !notCalculate) {
            calculatePaths(directionsService, directionsRenderer)
            setTimeout(() => {
                if (addToDatabase) {
                    addAddressToDatabase(marker_coords.length - 1)
                    printDeliveryStation()

                }
                window.postMessage("message")
            }, 500);
        }

        optionsUpdate()
    }

    google.maps.event.addListener(map, 'click', function (event) {
        query_number = 0
        addMarkerAndCalculate(event.latLng, true)
    });

    // yeni lokasyonlara göre marker'ları harita üzerinde çizdirme
    function drawMarkers() {
        for (let i = 0; i < marker_coords.length; i++) {
            placeMarker(marker_coords[i], String(i), i == 0)
        }
    }

    // harita üzerinde marker yerleştirme
    function placeMarker(location, label, is_cargoman) {

        if (is_cargoman) {
            let marker = new google.maps.Marker({
                position: location,
                map: map,
                label: label,
                icon: "cargoman_image.png"
            });
            markers.push(marker)
        } else {
            let marker = new google.maps.Marker({
                position: location,
                map: map,
                label: label
            });
            markers.push(marker)
        }
    }

}

function calculatePaths(directionsService, directionsRenderer) {
    let time = 0
    for (let i = 0; i < marker_coords.length - 1; i++) {
        setTimeout(() => {
            calculatePath(i, marker_coords.length - 1, directionsService, directionsRenderer)
        }, time);
    }
}

function calculatePath(i, j, directionsService, directionsRenderer) {

    directionsService
        .route({
            origin: marker_coords[i],
            destination: marker_coords[j],
            waypoints: [],
            travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((result) => {
            let km = computeTotalDistance(result)
            const route = result.routes[0];
            marker_adresses[marker_coords[i]] = route.legs[0].start_address
            marker_adresses[marker_coords[j]] = route.legs[0].end_address
            shortest_paths[i + " " + j] = km
            shortest_paths[j + " " + i] = km
        })
        .catch((e) => {
            alert("Could not display directions due to: " + e);
        });
}

// api'den elde edilen sonuca göre uzaklık hesaplama
function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];

    if (!myroute) {
        return;
    }

    for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }

    total = total / 1000;
    return total
}