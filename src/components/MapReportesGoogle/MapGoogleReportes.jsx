import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import "./MapGoogleReportes.scss";
import mapStyle from "./MapGoogleStyle.jsx"

import React, { useEffect, useRef, useState } from 'react';
import { Url } from "../../constants/global";
import axios from 'axios';

import { Box, Checkbox, IconButton, MenuItem, Select, SpeedDial, SpeedDialAction } from '@mui/material';
//Iconos
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import Panel from '../Panel Lateral/Panel.jsx';
import Reporte from '../Tables/Reportes/Reportes/Reporte.jsx';
import LoaderIndicator from '../../layout/LoaderIndicator/LoaderIndicator.jsx';

//import { Tab } from "@mui/material";
//import { TabContext, TabList, TabPanel } from "@mui/lab";

const MapGoogleReporte = (props) => {
  
  const token = localStorage.getItem('token');
  const id_proyect = localStorage.getItem('id_proyecto')

  const mapReportesRef = useRef(null);
  const searchBoxRef = useRef(null);
  //Latitud y longitud del circulo
  const circleLat = useRef(null);
  const circleLng = useRef(null);

  const [isCharging, setisCharging] = useState(false)
  
  const [circulosActuales, setcirculosActuales] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [showFilterEstatus, setshowFilterEstatus] = useState(false)
  const [showFilterResponsable, setshowFilterResponsable] = useState(false)

  const [status, setstatus] = useState({
    CREADO: false,
    ASIGNADO: false,
    ENPROCESO: false,
    INCOMPLETO: false,
    TERMINADO: false, 
  })
  const [responsables, setresponsable] = useState([])

  const [selectestatus, setselectestatus] = useState('')
  const [selectresponsable, setselectresponsable] = useState('')

  const [showPanel, setshowPanel] = useState(false)
  const [valueTab, setValueTab] = React.useState('InfoReportes');
  const handleChangeTab = (event, newValue) => {
      setValueTab(newValue);
    };
  const [reporteId, setreporteId] = useState([])

  useEffect(() => {
      if (mapReportesRef.current) {
        const map = mapReportesRef.current.map;
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
    
          const newXY = {
              latitud : place.geometry.location.lat(),
              longitud: place.geometry.location.lng()
          }
    
          // Actualizar el estado con la ubicación seleccionada
          setSelectedLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        });
      }

      axios.get(Url + "users?roles=6&proyecto="+id_proyect,{
        headers:{
          Authorization : token
        }
      })
      .then(res => {
        setresponsable(res.data)
      })
      .catch(err => {
        console.log(err)
      })

      console.clear()
    }, []);

  const limpiarsearchbox = () => {
      searchBoxRef.current.value = ''
  }

  const colorestadopunto = (estado) => {
    switch (estado) {
      case 'CREADO':
        return '#2B88EB';

      case 'ASIGNADO':
        return '#D35400';

      case 'EN PROCESO':
        return '#F4D03F';

      case "INCOMPLETO":
        return '#8E44AD';
    
      case "TERMINADO":
        return "#28B463";

      case "CANCELADO":
        return "#D1D4D8";

      default:
        break;
    }
  }

  const radiuszoom = (zoom) => {
    switch (true) {
      case zoom <= 12:
        return 200;

      case zoom === 13:
        return 70;

      case zoom >= 14 && zoom <= 15:
        return 30;

      case zoom === 16:
        return 17;

      case zoom === 17:
        return 10;

      case zoom >= 18 && zoom <= 19:
        return 5;

      case zoom >= 20 && zoom <= 22:
        return 1;
    
      default:
        break;
    }
  }

  const pointclic = async (datosReporte) => {
    await axios.get(Url + "reportes/" + datosReporte.id, {
      headers:{
        Authorization : token
      }
    })
    .then(res => {
      setreporteId(res.data)
    })
    .catch(err => {
      console.log(err)
    })

    setshowPanel(true)
  }

  const cerrarPanel = () => {
    setshowPanel(false)
  }

  const crearpuntosReportes = (mapprops, urlreportesgeojson) => {
      setisCharging(true)
  
      // var urlreportesgeojson = Url + 'reportes/geojson?proyecto='+id_proyect+
      //                        '&estados=CREADO,ASIGNADO,EN PROCESO,INCOMPLETO,TERMINADO';

      axios.get(urlreportesgeojson, {
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
                        strokeColor: colorestadopunto(description.estado),
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: colorestadopunto(description.estado),
                        fillOpacity: 0.5,
                        map: mapprops,
                        center: center,
                        radius: 30,
                    });
            
                    // Agregar un evento onclick al círculo
                    cityCircle.addListener('click', () => {
                      pointclic(description);
                    });

                    mapprops.addListener('zoom_changed', () => {
                      cityCircle.setRadius(radiuszoom(mapprops.getZoom()));
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
            
          default:
            break;
      }
    
      return ProyectoCoordenadas
  }

  function filtrarToString(objeto) {
    // Filtrar las propiedades del objeto que tienen el valor true
    const propiedadesTrue = Object.keys(objeto).filter(propiedad => objeto[propiedad] === true && propiedad !== 'ENPROCESO');

    // Verificar si 'EnProceso' es true y agregarlo separadamente
    const enProceso = objeto.ENPROCESO === true ? 'EN PROCESO' : '';

    // Concatenar las propiedades true en una cadena, separadas por ', '
    const resultadoToString = [enProceso, ...propiedadesTrue].join(',');

    return resultadoToString;
  }

  const handleChangeEstatus = (event) => {
      var estados = ""

      status[event.target.name] = event.target.checked
      setstatus({...status, 
          [event.target.name] : event.target.checked
      })

      estados = filtrarToString(status)

      if (estados === "") {
          estados = ''
      }

      setselectestatus(estados)

      const UrlEstatus = Url + "reportes/geojson?proyecto="+id_proyect+"&estados="+estados+
                        "&responsables="+selectresponsable

      console.log(UrlEstatus)
      crearpuntosReportes(mapReportesRef.current.map, UrlEstatus)
  }

  const handleChangeSelect = (event) => {
    const responsableid = event.target.value

    setselectresponsable(responsableid)
    const UrlResponsable = Url + "reportes/geojson?proyecto="+id_proyect+"&estados="+selectestatus+
                        "&responsables="+responsableid


    console.log(UrlResponsable)
    crearpuntosReportes(mapReportesRef.current.map, UrlResponsable)
  }

  const limpiarFiltros = () => {
    setshowFilterEstatus(false)
    setshowFilterResponsable(false)

    setstatus({...status,
      CREADO : false,
      ASIGNADO : false,
      ENPROCESO : false,
      INCOMPLETO : false,
      TERMINADO : false
    })
    setselectresponsable('')

    const UrlClean = Url + "reportes/geojson?proyecto="+id_proyect+"&estados=''"
    crearpuntosReportes(mapReportesRef.current.map, UrlClean)
  }

  const hidefilters = () => {
    setshowFilterEstatus(false)
    setshowFilterResponsable(false)
  }

  const styleComponent = {
      width: 'calc(100% - 70px)',
      height: 'calc(100vh - 50px)',
  };

  return (
        <>
        <Map
        ref={mapReportesRef}
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
        dato={"Folio: " + reporteId.killkizeo }
        icono={<ReportGmailerrorredIcon />}
        //style
        top={"50px"}
        width={"45%"}
      >
        <Reporte dataReporte={reporteId} cerrarPanel={cerrarPanel} showoptions={false}/>
      </Panel>
      }

      {showFilterEstatus &&
        <Box sx={{zIndex:1, backgroundColor:"white", m:1, display:"flex", flexDirection:"column", 
        borderRadius:2, position:"absolute", right:0, p:1}}>
          <strong>Estatus</strong>

          <div className='cajacheck' style={{marginTop:-6}}>
            <label>CREADO:</label>
            <Checkbox 
              name='CREADO' size='small' checked={status.CREADO} 
              onChange={handleChangeEstatus}
            />
          </div>
          <div className='cajacheck'>
            <label>ASIGNADO:</label>
            <Checkbox
              name='ASIGNADO' size='small' checked={status.ASIGNADO} 
              sx={{'&.Mui-checked': {color: '#D35400'}}} onChange={handleChangeEstatus}
            />
          </div>
          <div className='cajacheck'>
            <label>EN PROCESO:</label>
            <Checkbox
              name='ENPROCESO' size='small' checked={status.ENPROCESO} 
              sx={{'&.Mui-checked': {color: '#F4D03F'}}} onChange={handleChangeEstatus}
            />
          </div>
          <div className='cajacheck'>
            <label>INCOMPLETO:</label>
            <Checkbox
              name='INCOMPLETO' size='small' checked={status.INCOMPLETO} 
              sx={{'&.Mui-checked': {color: '#8E44AD'}}} onChange={handleChangeEstatus}
            />
          </div>
          <div className='cajacheck'>
            <label>TERMINADO:</label>
            <Checkbox
              name='TERMINADO' size='small' checked={status.TERMINADO} 
              sx={{'&.Mui-checked': {color: '#28B463'}}} onChange={handleChangeEstatus}
            />
          </div>
        </Box>
      }

      {showFilterResponsable &&
      <Select
        value={selectresponsable === '' ? " " : selectresponsable}
        sx={{zIndex:1, position:"absolute", right:-1, p:1, top:205, backgroundColor:"white", borderRadius:2,
        m:1}}
        MenuProps={{sx:{maxHeight:200}}}
        variant='standard'
        onChange={handleChangeSelect}
      >
        <MenuItem value=" ">Sin Reponsable</MenuItem>
        {responsables.map((responsable, index) => (
          <MenuItem key={index} value={responsable.id}>{responsable.nombre_completo}</MenuItem>
        ))}
        
      </Select>
      }
      
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 56}}
        icon={<FilterAltIcon />}
        direction="left"
      >
        <SpeedDialAction
            icon={<ReportGmailerrorredIcon />}
            tooltipTitle="Estatus"
            onClick={()=> setshowFilterEstatus(true)}
            sx={{ mr: -1 }} />

        <SpeedDialAction
            icon={<AssignmentIndIcon />}
            tooltipTitle="Responsable"
            onClick={()=> setshowFilterResponsable(true)}
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
})(MapGoogleReporte);