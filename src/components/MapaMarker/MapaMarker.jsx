import React from "react";
import ReactMapGL, { Marker } from 'react-map-gl';

const MapaMarker = ({ latitud, longitud }) => {

    return(
        <Marker latitude={latitud} longitude={longitud}>
            <div>Your Marker Content</div>
        </Marker>
    );

}

export default MapaMarker;