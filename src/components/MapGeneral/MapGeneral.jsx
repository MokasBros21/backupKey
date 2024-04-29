import React, { useRef, useState, useEffect} from "react";
import mapboxgl from "mapbox-gl";
//import TopBar  from "../../layout/TopBar/TopBar";
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import "./MapGeneral.scss";
import classNames from "classnames";

import { Url } from "../../constants/global";
import LoaderIndicator from "../../layout/LoaderIndicator/LoaderIndicator";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import { makeStyles } from "@material-ui/core";

//Geocode

//CUADRO DE BÚSQUEDA
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
//  import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'



mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsdHJhZmZpYyIsImEiOiJjbG01Z2U2cW0wajdiM3Bsb2N6ZGhrN2lxIn0.hMkzztmUbOf-N9uToXeBwA';

const useStylesMapGen = makeStyles(theme => ({
    root: {
      "& .MuiInput-root": {
        color: "black",
      }
    }
  }));

const MapGeneral = ({latitudReporte, longitudReporte, setinfoLuminaria, 
                      setdatosGeoJson,showButton, caso, primerTab, setiporeporte}) => {
    //Variables que se estarán manipulando constantemente
    const token = localStorage.getItem('token');

    const classes = useStylesMapGen();
    //Para el Mapa
    const mapContainerGeneral = useRef(null);
    const map = useRef(null);
    const [lat] = useState(19.0409511);
    const [lng] = useState(-98.221976);

    const countRef = useRef(0);

    const MySwal = withReactContent(Swal);

    let [pdl, setpdl] = useState('')
    let [coordenadas, setcoordenadas] = useState('')
    let coordenadasbusqueda = ""

    const [ isCharging, setisCharging ] = useState(false);
    const [markers] = useState([])
    const id_proyect = localStorage.getItem('id_proyecto')
    
    //Buscador
    const buscador = useRef(null);

    useEffect(() => {
        //setIsLogging(true);
        if (map.current) return; // initialize map only once
          map.current = new mapboxgl.Map({
              container: mapContainerGeneral.current,
              style: 'mapbox://styles/mapbox/navigation-night-v1',
              center: [lng, lat],
              zoom: 14,
              boxZoom: true
              });

              map.current.on('load', function() {
          
                buscador.current = new MapboxGeocoder({
                  accessToken:mapboxgl.accessToken,
                  countries: 'mx',
                  placeholder:'Ingrese una dirección',
                  // bbox: [-98.20346,19.03793,-98.20346,19.03793],
                  // district:'Puebla',
                  mapboxgl:mapboxgl,
                 
                  // types: 'poi',
                })

                buscador.current.on("result", function(result) {                  
                  var XYbusqueda = result.result.center[1] + "," + [result.result.center[0]]
                  coordenadasbusqueda = XYbusqueda

                  buscar("coordenadasbusqueda")
                })

                buscador.current.on('clear', function () {
                  /*if (pdl.length === 0 && coordenadas.length === 0) {
                    limpiardatos()
                    borrarMarkers()
                  }*/
                  limpiardatos()
                  borrarMarkers()
                  //console.log("Se limpio la caja de búsqueda")
                })
      
                map.current.addControl(buscador.current);

                var url = Url + 'luminarias?proyecto='+id_proyect+'&colonia=""';

                setisCharging(true)
                axios.get(url, {
                    headers: {
                        Authorization : token,
                    }
                  })
                  .then(res =>  {
                    setisCharging(false);                                            
                        map.current.addSource('xample_points', {
                          type: 'geojson',
                          data: res.data
                          });
          
                        map.current.addLayer({
                          'id': 'xample_points',
                          'type': 'circle',
                          'source': 'xample_points',

                            'paint': {
                            'circle-radius': 4,
                            'circle-stroke-width': 0.5,
                            'circle-stroke-color': 'white',
                            'circle-color': [
                              'match',
                              ['get', 'reporte_activo'],
                              0, 'green',
                              'red'
                            ]
                          }  
                        });

                        
                    })
                  .catch(err => {
                      setisCharging(false);
                      console.log(err)}
                  )

                  const marker = new mapboxgl.Marker()
            
                  map.current.on('mouseenter', 'xample_points', () => {
                      map.current.getCanvas().style.cursor = 'pointer'
                    })
                    map.current.on('mouseleave', 'xample_points', () => {
                      map.current.getCanvas().style.cursor = 'default'
                    })
      
                  map.current.on('click', 'xample_points', (e) => {
      
                      const coordinates = e.features[0].geometry.coordinates;
                      const description = e.features[0].properties;
                      
                      markers.push(marker)
                      marker.setLngLat(coordinates)
                      marker.addTo(map.current);
      
                      markerClicked(description)
                  });
              
              map.current.on('click', function(e) {
                var coordinates = e.lngLat;

                if((countRef.current < 1)){
                    const marker1 = new mapboxgl.Marker({
                      color: "#BDBABA"
                    })
                      marker1.setLngLat(coordinates)
                      marker1.addTo(map.current);
    
                      var url = Url + 'luminarias?proyecto='+id_proyect+'&latitud='+coordinates["lat"]+'&longitud='+coordinates["lng"];

                      setisCharging(true)
                      axios.get(url, {
                          headers: {
                              Authorization : token,
                          }
                        })
                      .then(res =>  {
                          countRef.current=1
                          map.current.getSource('xample_points').setData(res.data);
                          setisCharging(false);
                            
                          })
                        .catch(err => {
                            setisCharging(false);
                            console.log(err)}
                        )
                    }
                });
              });
        },[]);

    const buscarkillkizeo = async (id_reporte) => {
      if(id_reporte.reporte_activo !== 0){
        await axios.get(Url + 'reportes/'+id_reporte.reporte_activo, {
          headers: {
              Authorization : token,
              }
            })
          .then(res =>  {
              setiporeporte("reporte_activo")
              setdatosGeoJson(res.data)
            })
          .catch(err => console.log(err))
      }else{
        if (id_reporte.reincidencia !== 0) {
          await axios.get(Url + 'reportes/'+id_reporte.reincidencia, {
            headers: {
                Authorization : token,
                }
              })
            .then(res =>  {
                setiporeporte("reincidencia")
                setdatosGeoJson(res.data)
              })
            .catch(err => console.log(err))
        }else{
          setdatosGeoJson(0)
        }
      }
    }

    const markerClicked  = async (datos) => {
        primerTab()
        buscarkillkizeo(datos)
        await axios.get(Url + 'luminarias/'+datos.id, {
            headers: {
                Authorization : token,
            }
          })
        .then(res =>  {
            setinfoLuminaria(res.data);
            showButton(true);
          })
        .catch(err => console.log(err))
    };

    const borrarMarkers = () => {
        if (markers!==null) {
            for (var i = markers.length - 1; i >= 0; i--) {
                markers[i].remove();
            }
        }
    }

    const handleText = (event) =>{
      switch (event.target.name) {
        case "pdl":
              setpdl(event.target.value)
          break;

        case "coordenadas":
              setcoordenadas(event.target.value)
          break;
      
        default:
          break;
      }
    }

    const onKeyDownHandlerPDL = (event) => {
      if (event.key === "Enter") {
          buscar("pdl")
      }
    }

    const onKeyDownHandlerXY = (event) => {
      if (event.key === "Enter") {
          buscar("coordenadas")
      }
    }

    const limpiarcoordenadas = () => {
      coordenadas = ""
      setcoordenadas("")
      buscar("coordenadas")
    }

    const limpiarpdl = () => {
      pdl = ""
      setpdl("")
      buscar("pdl")
    }

    const limpiardatos = async () => {
      setisCharging(true)
      await axios.get(Url + 'luminarias?proyecto='+id_proyect+'&pdl=null', {
        headers: {
            Authorization : token,
        }
      })
      .then(res =>  {
          map.current.getSource('xample_points').setData(res.data);
          setinfoLuminaria([])
          showButton(false);
          setdatosGeoJson(0)
          setisCharging(false)
        })
      .catch(err => console.log(err))
    }

    const buscar = async (busqueda) => {
        setisCharging(true)

        const markerbusqueda = new mapboxgl.Marker({
          color: "#BDBABA"
        })
        switch (busqueda) {
          case "pdl":
                if (pdl.length > 0) {
                  borrarMarkers()
                  await axios.get(Url + 'luminarias?proyecto='+id_proyect+'&pdl='+ pdl, {
                    headers: {
                        Authorization : token,
                    }
                    })
                  .then(res =>  {
                      setisCharging(false)
                      if (res.data.features.length !== 0) {
                        const markerpdl = new mapboxgl.Marker()

                        countRef.current = 1;
                        map.current.getSource('xample_points').setData(res.data);
                        map.current.setCenter(res.data.features[0].geometry.coordinates)
                        map.current.setZoom(16)
  
                        markers.push(markerpdl)
                        markerpdl.setLngLat(res.data.features[0].geometry.coordinates)
                        markerpdl.addTo(map.current);
  
                        markerClicked(res.data.features[0].properties) 
                      }else{
                        MySwal.fire({
                          title: "No existe la luminaria",
                          text: "",
                          icon: "info"
                        });
                        limpiardatos()
                      }
                    })
                  .catch(err => console.log(err))
                } else {
                  setisCharging(false)
                  if(coordenadas.length === 0)
                  {
                    borrarMarkers()
                    limpiardatos()
                  }
                }
            break;

          case "coordenadas":
            if (coordenadas.length > 0) {
              borrarMarkers()
              var coordinatesendpoint = coordenadas.split(",")

              await axios.get(Url + 'luminarias?proyecto='+id_proyect+
              '&latitud='+coordinatesendpoint[0]+'&longitud='+coordinatesendpoint[1], {
                headers: {
                    Authorization : token,
                }
                })
                .then(res =>  {
                    countRef.current = 1;
  
                    markerbusqueda.setLngLat([coordinatesendpoint[1], coordinatesendpoint[0]])
                    markerbusqueda.addTo(map.current)
                    markers.push(markerbusqueda)
  
                    map.current.setCenter([coordinatesendpoint[1], coordinatesendpoint[0]])
                    map.current.setZoom(16)
                    map.current.getSource('xample_points').setData(res.data);
                    setisCharging(false)
                })
                .catch(err => console.log(err))
            } else {
              setisCharging(false)
              if(pdl.length === 0)
              {
                borrarMarkers()
                limpiardatos()
              }
            }
          break;

          case "coordenadasbusqueda":
            if (coordenadasbusqueda.length > 0) {
              borrarMarkers()
              var pointbusqueda = coordenadasbusqueda.split(",")

              await axios.get(Url + 'luminarias?proyecto='+id_proyect+
              '&latitud='+pointbusqueda[0]+'&longitud='+pointbusqueda[1], {
                headers: {
                    Authorization : token,
                }
                })
                .then(res =>  {
                    countRef.current = 1;
  
                    map.current.setCenter([pointbusqueda[1], pointbusqueda[0]])
                    map.current.setZoom(16)
                    map.current.getSource('xample_points').setData(res.data);
                    setisCharging(false)
                })
                .catch(err => console.log(err))
            } else {
              setisCharging(false)
            }
          break;

          case "point":
            var point = map.current.getCenter()
            borrarMarkers()
            //limpiardatos()

            await axios.get(Url + 'luminarias?proyecto='+id_proyect+
              '&latitud='+point.lat+'&longitud='+point.lng, {
                headers: {
                    Authorization : token,
                }
                })
                .then(res =>  {
                    countRef.current = 1;
  
                    markerbusqueda.setLngLat([point.lng, point.lat])
                    markerbusqueda.addTo(map.current)
                    markers.push(markerbusqueda)
  
                    map.current.getSource('xample_points').setData(res.data);
                    setisCharging(false)
                })
                .catch(err => console.log(err))
          break;
        
          default:
            break;
        }
    }
  


    return (           
       <div ref={mapContainerGeneral} className={classNames("map-containerGeneral")}>
        <div style={{display:"flex", width:"100%", position:"absolute"}}>
          <Box sx={{zIndex:1, backgroundColor:"white", width:"20%", height:40, m:1, 
          borderRadius:2}}>
              <TextField variant="standard" sx={{width:"100%", padding:0.8}} name="pdl"
              className={classes.root} placeholder="PDL" value={pdl} onChange={handleText}
              InputProps={{
                endAdornment:<IconButton size="small" onClick={limpiarpdl}><ClearIcon/></IconButton>,
              }}
              autoComplete="off"
              onKeyDownCapture={onKeyDownHandlerPDL}
              />
          </Box>

          <Box sx={{zIndex:1, backgroundColor:"white", width:"37%", height:40, m:1, 
            borderRadius:2}}>
                <TextField variant="standard" sx={{width:"100%", padding:0.8}} name="coordenadas"
                className={classes.root} placeholder="Coordenadas" value={coordenadas} onChange={handleText}
                InputProps={{
                  endAdornment:<IconButton size="small" onClick={limpiarcoordenadas}><ClearIcon/></IconButton>,
                }}
                autoComplete="off"
                onKeyDownCapture={onKeyDownHandlerXY}
                />
            </Box>      
        </div>
        <Box sx={{position:"absolute", bottom:0, zIndex:3, backgroundColor:"white", m:1, borderRadius:5}}>
          <IconButton onClick={() => buscar("point")}>
              <MyLocationIcon />
            </IconButton>
        </Box >
        
        { isCharging && <LoaderIndicator /> }
       </div>
    );
}

export default MapGeneral;