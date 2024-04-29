import React, { useRef, useState, useEffect} from "react";
import mapboxgl from "mapbox-gl";

import "./MapRoute.scss";
import classNames from "classnames";

import { Url } from "../../constants/global";

mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsdHJhZmZpYyIsImEiOiJjbG01Z2U2cW0wajdiM3Bsb2N6ZGhrN2lxIn0.hMkzztmUbOf-N9uToXeBwA';

const MapRoute = () => {
    //Variables que se estarán manipulando constantemente
    const token = localStorage.getItem('token');
    const id_proyect = localStorage.getItem('id_proyecto')

    //Para el Mapa
    const mapRouteContainer = useRef(null);
    const map = useRef(null);
    let [lat] = useState(19.0409511);
    let [lng] = useState(-98.221976);
    let [zoom] = useState(15);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        /*map.current = new mapboxgl.Map({
            container: mapRouteContainer.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [lng, lat],
            zoom: zoom,
            boxZoom: true,
            
        });*/

        //Bearer 5|laravel_sanctum_nhPmiT5r0yHFXZrObruboN9YdUsIsa0nPKVeK0Rv5bbd7e49

        const coordinates = [
            
                [
                    -98.20043,
                    19.111457
                ],
                [
                    -98.204373,
                    19.098706
                ],
                [
                    -98.217786,
                    19.110794
                ],
                [
                    -98.24094,
                    19.093044
                ],
                [
                    -98.241045,
                    19.091297
                ],
                [
                    -98.236149,
                    19.076287
                ]
            
          ];

        map.current = new mapboxgl.Map({
            container: mapRouteContainer.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [lng, lat],
            zoom: 15,
        });

        map.current.on('load', function() {
            var coordinatesString = coordinates.map(coord => coord.join(',')).join(';');

            // Hacer la solicitud a la Map Matching API
            fetch(`https://api.mapbox.com/matching/v5/mapbox/driving-traffic/${coordinatesString}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
              .then(response => response.json())
              .then(data => {
                // Manejar la respuesta de la API, por ejemplo, mostrar la ruta en el mapa
                var route = data.matchings[0].geometry;

                map.current.addSource('route', {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: route.coordinates,
                    },
                  },
                });
                map.current.addLayer({
                  id: 'route',
                  type: 'line',
                  source: 'route',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                  },
                  paint: {
                    'line-color': '#2DD911',
                    'line-width': 2,
                  },
                });
              });

              coordinates.forEach((coord, index) => {
                var marker = null
                
                if (index === 0) {
                    marker = new mapboxgl.Marker({
                        color: "#3CA6FF"
                        })
                }else{
                    if (index === (coordinates.length - 1)) {
                        marker = new mapboxgl.Marker({
                            color: "#FF5A3C"
                            })
                    }else{
                        
                    marker = new mapboxgl.Marker({
                            color: "#BDBABA"
                        })
                    }
                }
                  marker.setLngLat(coord)
                  marker.addTo(map.current);

                  /*var popup = new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`<p style={{marginBottom:20px}}>Punto ${index + 1}</p>`)
                  .setLngLat(coord)
                  .addTo(map.current)*/
          
                //marker.setPopup(popup);
              });
    })
        
    },[]);

    return (           
       <div ref={mapRouteContainer} className={classNames("maproute-container")}>
        </div>
    );
}

export default MapRoute;