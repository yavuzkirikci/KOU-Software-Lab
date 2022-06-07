import React from 'react';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({current_info}) => {
    return (
        <div>
            <p>Date : {current_info.date}</p>
            <p>Hour : {current_info.hour}</p>
            <p>Latitude : {current_info.lat}</p>
            <p>Longtitude : {current_info.lng}</p>
            <p>Taxi Id: {current_info.taxi_id}</p>

        </div>
    )
}