import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { darkStyle } from './GoogleMapsStyle';

import "./GoogleMaps.scss";

const GoogleMaps = ({ 
    latitud, 
    longitud, 
    points, 
    onmarkerclic, 
    zoom = 15, 
    tamano = 10, 
    defaultIcon, 
    mapStyle 
}) => {
    const googlemap = useRef(null);
    const searchBoxRef = useRef(null);
    const [ map, setMap ] = useState(null);
    
    useEffect( () => {
        const loader = new Loader({
            apiKey: 'AIzaSyCqeVG33Apnn8q4ZtskQVwMd1uwJNxkQo4', 
            version: 'weekly',
            libraries: ['places', 'visualization'] 
        });

        loader.importLibrary("maps").then( () => {
            const initializedMap = new window.google.maps.Map(googlemap.current, {
                center: { lat: latitud, lng: longitud },
                zoom: zoom,
                zoomControl: true, // Enable zoom controls
                scrollwheel: true, // Disable scrollwheel zooming
                gestureHandling: 'cooperative',
                styles: mapStyle || darkStyle
            });

            const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);
            initializedMap.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);

            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();
                if (!places || places.length === 0) {
                    return;
                }
        
                // Assuming you want to zoom in on the first place returned
                const firstPlace = places[0];
                if (firstPlace.geometry && firstPlace.geometry.location) {
                    // Center the map on the selected place
                    initializedMap.setCenter(firstPlace.geometry.location);

                    // Optionally, adjust the zoom level
                    initializedMap.setZoom(18); // You can choose an appropriate zoom level
                }
            });

            setMap(initializedMap);

        }).catch(error => {
            console.error("Error loading Google Maps: ", error);
        });
    }, []);

    useEffect( () => {
        // Load and add the GeoJSON data to the map
        if (points && points.features) {
            points.features.forEach(feature => {
                const latLng = new window.google.maps.LatLng(
                    feature.geometry.coordinates[1],
                    feature.geometry.coordinates[0]
                );

                let icon = defaultIcon ? defaultIcon: "https://maps.google.com/mapfiles/kml/pal4/icon17.png";
                if ( feature.properties?.icon  ) {
                    icon = feature.properties.icon;
                }
            
                const marker = new window.google.maps.Marker({
                    position: latLng,
                    map: map,
                    icon: {
                        url: icon,
                        scaledSize: new window.google.maps.Size(tamano, tamano), // Adjust size
                    }
                });

                marker.addListener('click', () => {
                    if ( onmarkerclic ) onmarkerclic( feature.properties );
                });
            });
        }
    }, [points, map] );
    
    return (
        <div className='GoogleMaps'>
            <input ref={searchBoxRef} type="text" placeholder="Buscar por dirección o coordenadas" className='map-input-search' />
            <div ref={googlemap} className='map' />
        </div>
    );
};

export default GoogleMaps;








//AIzaSyCqeVG33Apnn8q4ZtskQVwMd1uwJNxkQo4