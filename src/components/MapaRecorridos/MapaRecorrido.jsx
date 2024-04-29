import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState } from 'react';

import './MapaRecorrido.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsdHJhZmZpYyIsImEiOiJjbG01Z2U2cW0wajdiM3Bsb2N6ZGhrN2lxIn0.hMkzztmUbOf-N9uToXeBwA';

const MapaRecorrido = (props) =>{
  const mapContainer = useRef(null);
  const mapaRecorridos = useRef(null);


  var geojson = new Object();
  var alto_geojson = new Object();
  
  if(props.coordenadas != undefined){
    geojson = props.coordenadas;
    alto_geojson = props.altos;
    mapaRecorridos.current.getSource('line').setData(geojson);
  }else{
     
    geojson = 
    {
      "type": "FeatureCollection",
      "features": [
          {
              "type": "Feature",
              "geometry": {
                  "type": "LineString",
                  "coordinates": [],
                  "properties": []
              }
          }
      ]
    };

  }

  if(props.altos != undefined){
    alto_geojson = props.altos;
    mapaRecorridos.current.getSource('museums').setData(alto_geojson);
  }else{

    alto_geojson = 
    {
      "type": "FeatureCollection",
      "features": [
          {
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                  
                  ]
              },
              "properties": {
                 
                
              }
          }
      ]
  };

  }


    useEffect(() => {
  
        if (mapaRecorridos.current) return; // initialize map only once
        mapaRecorridos.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/navigation-night-v1',
          center: [-98.212985, 19.036356],
          zoom: 12
        });
           
          mapaRecorridos.current.on('load', () => {
          mapaRecorridos.current.addSource('line', {
          type: 'geojson',
          data: geojson,
          });
           
          // add a line layer without line-dasharray defined to fill the gaps in the dashed line
          mapaRecorridos.current.addLayer({
          type: 'line',
          source: 'line',
          id: 'line-background',
          paint: {
          'line-color': "rgba(25, 149, 173,0.6)",
          'line-width': 6,
          // 'line-opacity': 0.8
          }
          });
           
          // add a line layer with line-dasharray set to the first value in dashArraySequence
          //"rgba(161, 214, 210,0.9)"
          mapaRecorridos.current.addLayer({
          type: 'line',
          source: 'line',
          id: 'line-dashed',
          paint: {
          'line-color': "rgb(25, 149, 173)",
          'line-width': 6,
          'line-dasharray': [0, 4, 3]
          }
          });

       //CAPA DE PRUEBA
       mapaRecorridos.current.addSource('museums', {
        type: 'geojson',
        data: ''
        });
        mapaRecorridos.current.addLayer({
        'id': 'museums',
        'type': 'circle',
        'source': 'museums',
        // 'layout': {
        //   'icon-image': ['get', 'icon'],
        //   'icon-allow-overlap': true
        // },
        'paint': {
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-color':[
            'match',
            ['get', 'TipoAlto'],
            'Semáforo',     '#1E8449',
            'Accidente',    '#D4AC0D',
            'Tráfico',      '#B03A2E',
            'Paradero',     '#2874A6',
            'Manifestación','#6C3483',
            'Otro',         '#5F6A6A',
            'pink'
        ],
          'circle-stroke-color': 'white'
        },
       
        });

        mapaRecorridos.current.on('click', 'museums', (e) => {
          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
           
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
           
          new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(mapaRecorridos.current);
          });

           
          // technique based on https://jsfiddle.net/2mws8y3q/
          // an array of valid line-dasharray values, specifying the lengths of the alternating dashes and gaps that form the dash pattern
          const dashArraySequence = [
          [0, 4, 3],
          [0.5, 4, 2.5],
          [1, 4, 2],
          [1.5, 4, 1.5],
          [2, 4, 1],
          [2.5, 4, 0.5],
          [3, 4, 0],
          [0, 0.5, 3, 3.5],
          [0, 1, 3, 3],
          [0, 1.5, 3, 2.5],
          [0, 2, 3, 2],
          [0, 2.5, 3, 1.5],
          [0, 3, 3, 1],
          [0, 3.5, 3, 0.5]
          ];
           
          let step = 0;
           
          function animateDashArray(timestamp) {
          // Update line-dasharray using the next value in dashArraySequence. The
          // divisor in the expression `timestamp / 50` controls the animation speed.
          const newStep = parseInt(
          (timestamp / 50) % dashArraySequence.length
          );
           
          if (newStep !== step) {
          mapaRecorridos.current.setPaintProperty(
          'line-dashed',
          'line-dasharray',
          dashArraySequence[step]
          );
          step = newStep;
          }
           
          // Request the next frame of the animation.
          requestAnimationFrame(animateDashArray);
          }
           
          // start the animation
          animateDashArray(0);
          });
        }
      );

        // mapaRecorridos.current.getSource('line').setData(geojson);
    
       
      return(
          <div>
          <div ref={mapContainer} className="map-container-recorrido" 
          style={{height:props.height}} />
        </div>
        
      );

}


export default MapaRecorrido;