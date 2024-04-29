import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import mapStyle from "./MapGoogleStyle.jsx"

import React, { useEffect, useRef, useState } from 'react';
import { Url } from "../../../constants/global";
import axios from 'axios';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';

import { Box, IconButton, SpeedDial, SpeedDialAction, Button } from '@mui/material';

//Iconos
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import Panel from '../../Panel Lateral/Panel.jsx';
import LoaderIndicator from '../../../layout/LoaderIndicator/LoaderIndicator.jsx';
import Swal from 'sweetalert2';

//import { Tab } from "@mui/material";
//import { TabContext, TabList, TabPanel } from "@mui/lab";

const MapGoogleInversion = (props) => {
  
  const token = localStorage.getItem('token');
  const id_proyect = localStorage.getItem('id_proyecto')

  const mapInversionesRef = useRef(null);
  const searchBoxRef = useRef(null);
  //Latitud y longitud del circulo
  const circleLat = useRef(null);
  const circleLng = useRef(null);

  const [isCharging, setisCharging] = useState(false)
  
  const [showFechaFilter, setshowFechaFilter] = useState(false)
  const today = new Date();
  const [rangofechasinversion, setrangofechasinversion] = useState([
    {
      //startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  
  const [circulosActuales, setcirculosActuales] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [showPanel, setshowPanel] = useState(false)
  const [reporteId, setreporteId] = useState([])

  useEffect(() => {
      if (mapInversionesRef.current) {
        const map = mapInversionesRef.current.map;
        const input = searchBoxRef.current;
    
        const searchBox = new window.google.maps.places.SearchBox(input);
    
        map.addListener('bounds_changed', () => {
          searchBox.setBounds(map.getBounds());
        });
          
        //Capturando el evento click en el mapa
        /*map.addListener('mousemove', () => {
          circleLat.current =map.center.lat();
          circleLng.current = map.center.lng(); 
        });*/
         
        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
    
          if (places.length === 0) {
            return;
          }
    
          const place = places[0];
    
          if (!place.geometry) {
            console.error('Place not found:', place);
            return;
          }
    
          map.panTo(place.geometry.location);
          map.setZoom(17);
    
          // Actualizar el estado con la ubicación seleccionada
          setSelectedLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        });

        crearpuntosInversion(map, Url + "luminarias?proyecto="+id_proyect)
      }

      console.clear()
    }, []);

  const limpiarsearchbox = () => {
      searchBoxRef.current.value = ''
  }

  const radiuszoom = (zoom) => {
    switch (true) {
      case zoom <= 12:
        return 200;

      case zoom === 13:
        return 50;

      case zoom >= 14 && zoom <= 15:
        return 25;

      case zoom === 16:
        return 17;

      case zoom === 17:
        return 10;

      case zoom >= 18 && zoom <= 19:
        return 4;

      case zoom >= 20 && zoom <= 22:
        return 1;
    
      default:
        break;
    }
  }

  const pointclic = async (datosReporte) => {
    /*await axios.get(Url + "reportes/" + datosReporte.id, {
      headers:{
        Authorization : token
      }
    })
    .then(res => {
      setreporteId(res.data)
    })
    .catch(err => {
      console.log(err)
    })*/

    setshowPanel(true)
  }

  const cerrarPanel = () => {
    setshowPanel(false)
  }

  const crearpuntosInversion = (mapprops, urlinversiongeojson) => {
      axios.get(urlinversiongeojson, {
          headers: {
              Authorization : token,
          }
        })
      .then(res =>  {
            const nuevosCirculos = [];
            
            for (let index = 0; index < res.data.features.length; index++) {
                (function(index) {
                    var coordenadas = res.data.features[index].geometry.coordinates;
                    var description = res.data.features[index].properties;

                    var center = { lat: coordenadas[1], lng: coordenadas[0] };
            
                    const cityCircle = new props.google.maps.Circle({
                        strokeColor: "#27AE60",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#27AE60",
                        fillOpacity: 0.5,
                        map: mapprops,
                        center: center,
                        radius: 15,
                    });
            
                    // Agregar un evento onclick al círculo
                    cityCircle.addListener('click', () => {
                      //pointclic(description);
                    });

                    mapprops.addListener('zoom_changed', () => {
                      cityCircle.setRadius(radiuszoom(mapprops.getZoom()));
                    });
  
                    nuevosCirculos.push(cityCircle);
                })(index);
            }
            setisCharging(false)
        })
        .catch(err => {
            console.log(err)}
        )
  }
    
  const centrarMapa = (proyecto) => {
      var ProyectoCoordenadas = {}
    
      switch (proyecto) {
          case "1":
              ProyectoCoordenadas = {
                lat : 19.0409511,
                lng : -98.221976
              }
          break;
    
          case "2":
              ProyectoCoordenadas = {
                lng : -116.596191,
                lat : 31.866396
              }
          break;
            
          case "3":
              ProyectoCoordenadas = {
                lng : -87.074004,
                lat : 20.629081
              }
          break;
    
          case "4":
              ProyectoCoordenadas = {
                lng : -98.29559007022044,
                lat : 19.059260195326157
              }
          break;
          
          case "5":
            ProyectoCoordenadas = {
                lat : 19.049495448888855,
                lng : -98.2140849071712
            }
            break;

          case "6":
              ProyectoCoordenadas = {
                  lat : 19.06114759114169,
                  lng : -98.30773870118088
              }
              break;

          case "8":
            ProyectoCoordenadas = {
                lat : 18.995292,
                lng : -98.272635
            }
            break;
            
          default:
            break;
      }
    
      return ProyectoCoordenadas
  }

  const filtrofecha = async () => {
    const revisarfecha0 = (fecha) => {
      if (fecha < 10) {
          return "0"+fecha
      }
      return fecha
    }

    const desde = (rangofechasinversion[0].startDate.getFullYear() + "-" 
    + revisarfecha0(rangofechasinversion[0].startDate.getMonth() + 1)
    + "-" + revisarfecha0(rangofechasinversion[0].startDate.getDate()))

    const hasta = (rangofechasinversion[0].endDate.getFullYear() + "-" 
    + revisarfecha0(rangofechasinversion[0].endDate.getMonth() + 1)
    + "-" + revisarfecha0(rangofechasinversion[0].endDate.getDate()))

    const mapa = mapInversionesRef.current.map

    setisCharging(true)

    await axios.get(Url + "inversiones/geojson?proyecto=8&desde="+desde+"&hasta="+hasta, {
      headers: {
          Authorization : token,
      }
    })
    .then(res =>  {
        if (res.data.features.length > 0) {
          const nuevosCirculos = [];
          
          for (let index = 0; index < res.data.features.length; index++) {
              (function(index) {
                  var coordenadas = res.data.features[index].geometry.coordinates;
                  var description = res.data.features[index].properties;

                  var center = { lat: coordenadas[1], lng: coordenadas[0] };
          
                  const cityCircle = new props.google.maps.Circle({
                      strokeColor: "#2DDD9A",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#2DDD9A",
                      fillOpacity: 0.5,
                      map: mapa,
                      center: center,
                      radius: 20,
                  });
          
                  // Agregar un evento onclick al círculo
                  cityCircle.addListener('click', () => {
                    //pointclic(description);
                  });

                  mapa.addListener('zoom_changed', () => {
                    cityCircle.setRadius(radiuszoom(mapa.getZoom()));
                  });

                  nuevosCirculos.push(cityCircle);
              })(index);
          }

          // Usa la función de retorno en setcirculosActuales para garantizar el uso del estado más reciente
          setcirculosActuales(prevCirculos => {
            // Eliminar círculos antiguos de manera segura
            prevCirculos.forEach(circulo => {
              circulo.setMap(null);
            });
            return nuevosCirculos;
          });

          setshowFechaFilter(false)

        } else {
          if(circulosActuales.length > 0)
          {
            limpiarcirculos()
          }
          Swal.fire({
            title: "No hay datos con éste rango de fechas",
            icon: "info"
          })

          setshowFechaFilter(false)
        }
        setisCharging(false)
    })
    .catch(err => {
        console.log(err)}
    )
  }

  const limpiarcirculos = () => {
    if (circulosActuales && circulosActuales.length > 0) {
        circulosActuales.forEach(circulo => {
          circulo.setMap(null);
        });

        setcirculosActuales([])
      }
  }

  const limpiarFiltros = async () => {
    limpiarcirculos()
  }

  const hidefilters = () => {
    setshowFechaFilter(false)
  }

  const styleComponent = {
      width: 'calc(100% - 70px)',
      height: 'calc(100vh - 50px)',
  };

  return (
        <>
        <Map
        ref={mapInversionesRef}
        google={props.google}
        zoom={15}
        style={styleComponent}
        //gestureHandling='cooperative'
        styles={mapStyle}
        initialCenter={centrarMapa(id_proyect)}
      >
        <Box sx={{
          width: 300, zIndex: 1, position: 'absolute', top: 8,
          height: 45, backgroundColor: "white", borderRadius: 10, display: "flex",
          border: "2px solid gray"
        }}>
          <input
            ref={searchBoxRef}
            placeholder="Buscar Dirección"
            type="text"
            style={{ width: '88%', border: 0, height: 40, marginLeft: 20, padding: 5 }} />
            <IconButton onClick={limpiarsearchbox}>
              <ClearIcon/>
            </IconButton>
        </Box>

        {/* Renderizar el marcador si hay una ubicación seleccionada */}
        {selectedLocation && <Marker position={selectedLocation} />}
      </Map>

      {isCharging && <LoaderIndicator />}

      {showPanel &&
        <Panel
          //Top
          closePanel={cerrarPanel}
          dato={"Folio: "}
          icono={<ReportGmailerrorredIcon />}
          //style
          top={"50px"}
          width={"45%"}
        >

        </Panel>
      }

      {showFechaFilter &&
        <Box component="div" sx={{backgroundColor:"white", position:"absolute", top:60, right:10}}>
          <DateRangePicker
              onChange={item => setrangofechasinversion([item.selection])}
              showSelectionPreview={true}
              months={1}
              ranges={rangofechasinversion}
              direction="horizontal"
              />
          <Button onClick={filtrofecha}>OK</Button>
        </Box>
      }
      
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 56}}
        icon={<FilterAltIcon />}
        direction="left"
      >
        <SpeedDialAction
          icon={<CalendarMonthIcon />}
          tooltipTitle="Fecha"
          onClick={() => setshowFechaFilter(showFechaFilter ? false : true)}
          sx={{ mr: -0.5 }}
        />

        <SpeedDialAction
          icon={<FilterAltOffIcon />}
          tooltipTitle="Limpiar"
          onClick={limpiarFiltros}
          sx={{ mr: -0.5 }}
        />

        <SpeedDialAction
          icon={<PlaylistRemoveIcon />}
          tooltipTitle="Ocultar"
          onClick={hidefilters}
          sx={{ mr: -0.5 }}
        />
      </SpeedDial>
      </>
    )
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAiXWOxSPvO0AViX6hlFjBTP3dg5NH83FQ',
})(MapGoogleInversion);