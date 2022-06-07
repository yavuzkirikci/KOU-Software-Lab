import "./MapPage.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import TaxiInfo from "./TaxiInfo.js";
import { useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [taxiIdList, setTaxiIdList] = useState([]);
  const [dateInfos, setDateInfos] = useState([]);
  const [hourInfos, setHourInfos] = useState([]);
  const [center, setCenter] = useState({ lat: 59.12, lng: 18.64 });
  const [zoom, setZoom] = useState(8);

  const [selectedTaxiID, setSelectedTaxiID] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const [markerList, setMarkerList] = useState([
    { lat: 38.96, lng: 35.25 },
    { lat: 38, lng: 35 },
  ]);
  const [currentInfo, setCurrentInfo] = useState({
    lat: "",
    lng: "",
    date: "",
    hour: "",
    taxi_id: "",
  });
  const location = useLocation();

  const onViewDateClicked = () => {
    const asyncFunc = async () => {
      const rawResponse = await fetch("/get_locations_by_date", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taxi_id: selectedTaxiID, date: selectedDate }),
      });

      const content = await rawResponse.json();

      console.log("LOCATIONS", content.locations);
      setMarkerList(content.locations);
    };

    asyncFunc();
  };

  const lastMinutes = async () => {
    const rawResponse = await fetch("/last_locations", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_id: location.state.email_id }),
    });

    const content = await rawResponse.json();
    setTaxiIdList(content.taxi_ids);

    setMarkerList(content.taxi_infos);
  };

  useEffect(() => {
    lastMinutes();
  }, []);

  useEffect(() => {
    if (selectedTaxiID === "") return;

    const asyncFunc = async () => {
      const rawResponse = await fetch("/get_dates", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taxi_id: selectedTaxiID }),
      });

      const content = await rawResponse.json();

      setDateInfos(content.dates);
    };

    asyncFunc();
  }, [selectedTaxiID]);

  useEffect(() => {
    if (selectedDate === "") return;

    const asyncFunc = async () => {
      const rawResponse = await fetch("/get_hours", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate, taxi_id: selectedTaxiID }),
      });

      const content = await rawResponse.json();

      console.log("HOURS ", content.hours);
      setHourInfos(content.hours);
    };

    asyncFunc();
  }, [selectedDate]);

  useEffect(() => {
    if(selectedHour === "")
      return

    const asyncFunc = async () => {
      const rawResponse = await fetch("/get_location_by_date_and_hour", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate, taxi_id: selectedTaxiID, hour : selectedHour }),
      });

      const content = await rawResponse.json();

      console.log("LOCATION ", content.lat, content.lng);

      setCenter({lat : Number(content.lat), lng : Number(content.lng)});
      setZoom(24)
    };
    
    asyncFunc()
    
  }, [selectedHour])

  const containerStyle = {
    width: "1000px",
    height: "500px",
  };

  const onClickFunc = (e, pos) => {
    setCurrentInfo({
      lat: pos.lat,
      lng: pos.lng,
      taxi_id: pos.taxi_id,
      date: pos.date,
      hour: pos.hour,
    });
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey="AIzaSyDtBiZX6Zpwdxuq1-ZhbEd17L1lAWoqECk"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
        >
          {markerList.map((pos) => (
            <Marker
              position={{ lat: Number(pos.lat), lng: Number(pos.lng) }}
              label={
                pos.taxi_id
                  ? "Taxi " + pos.taxi_id + ": " + pos.hour
                  : "Taxi " + pos.id + ": " + pos.hour
              }
              onClick={(e) => onClickFunc(e, pos)}
            ></Marker>
          ))}
        </GoogleMap>
      </LoadScript>

      <div style={{ width: "25%", float: "left" }}>
        <button onClick={lastMinutes} style={{ fontSize: "11px" }}>
          Son 30 Dakika Verilerini Göster
        </button>
        <TaxiInfo current_info={currentInfo} />
      </div>

      <div style={{ width: "25%", float: "left" }}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            ID : {selectedTaxiID}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {taxiIdList.map((id) => (
              <Dropdown.Item
                onClick={() => {
                  setSelectedTaxiID(id);
                }}
              >
                Taxi {id}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div style={{ width: "25%", float: "left" }}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Date : {selectedDate}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {dateInfos.map((date) => (
              <Dropdown.Item
                onClick={() => {
                  setSelectedDate(date);
                }}
              >
                {date}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <button onClick={onViewDateClicked} style={{ fontSize: "11px" }}>
          Seçilen Tarih Verilerini Haritada Göster
        </button>
      </div>
      <div style={{ width: "25%", float: "left" }}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Hour : {selectedHour}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {hourInfos.map((hour) => (
              <Dropdown.Item
                onClick={(e) => {
                  setSelectedHour(hour);
                }}
              >
                {hour}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default App;
