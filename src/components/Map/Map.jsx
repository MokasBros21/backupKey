import React, { useRef, useState, useEffect} from "react";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';

import mapboxgl from "mapbox-gl";
//import TopBar  from "../../layout/TopBar/TopBar";
import axios from 'axios'
import LoaderIndicator from '../../layout/LoaderIndicator/LoaderIndicator';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

//Filters
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import Button from '@mui/material/Button';

import "./Map.scss";
import classNames from "classnames";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';

import Panel from "../Panel Lateral/Panel";
import { Url } from "../../constants/global";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Luminaria from "../Luminaria/Luminaria";
import Comentarios from "../Comentarios/Comentario";

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

import { makeStyles } from "@material-ui/core";
import Brazo from "../Brazos/Brazo";


//CUADRO DE BÚSQUEDA
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
//  import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { Modal } from "@mui/material";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';

const useStylesMap = makeStyles(theme => ({
    root: {
      "& .MuiInput-root": {
        color: "black",
      }
    }
  }));

mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsdHJhZmZpYyIsImEiOiJjbG01Z2U2cW0wajdiM3Bsb2N6ZGhrN2lxIn0.hMkzztmUbOf-N9uToXeBwA';

const Map = () => {

    const MySwal = withReactContent(Swal);
    const classes = useStylesMap();

    const Navigate = useNavigate();
    //Variables que se estarán manipulando constantemente
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const XY_proyect = JSON.parse(localStorage.getItem('proyect_latlng'));
    const id_proyect = localStorage.getItem('id_proyecto')

    //Para el Mapa
    const mapContainer = useRef(null);
    const cajaBusqueda = useRef(null);
    const map = useRef(null);

    const MapaSemaforos = "";

    let [lat] = useState(XY_proyect.lat);
    let [lng] = useState(XY_proyect.lng);
    let [zoom] = useState(15);

    let [pdl, setpdl] = useState('')
    let [coordenadas, setcoordenadas] = useState('')
    /*
    let [calle, setcalle] = useState('')
    let [colonia, setcolonia] = useState('')
    */
    
    const [openModalLuminaria, setopenModalLuminaria] = useState(false)
    const [showPanel, setShowPanel] = useState(false);

    const [rangofechasupdate, setrangofechasupdate] = useState([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
      }
    ]);
    const [showFechaFilter, setshowFechaFilter] = useState(false)
    const [banderaFFecha, setbanderaFFecha] = useState(false)

    //Datos para Panel
    const [dataLuminaria, setdataLuminaria] = useState([]);
    const [dataLuminariaNew, setdataLuminariaNew] = useState({})
    const [markers] = useState([])
    const [showadd, setshowadd] = useState(false)
    const [ isCharging, setisCharging ] = useState(false);
    const [value, setValue] = React.useState('Informacion');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    //Para puntero cuándo se cargue valores desde GET normal
    //const marker = new mapboxgl.Marker()

    //Método para asignar puntos personalizados desde método GET
    /*
    const updateMarker = useCallback( () => {

        axios.get('http://localhost:8081/2')
        .then(res =>  {

        res.data.forEach( (point) => {
            // Create a React ref
            const ref = React.createRef();
            // Create a new DOM node and save it to the React ref
            ref.current = document.createElement('div');
            // Render a Marker Component on our new DOM node
            createRoot(ref.current).render(
                <Marker onClick={markerClicked} data={point} />
            );

            // Create a Mapbox Marker at our new DOM node
            new mapboxgl.Marker(ref.current)
                .setLngLat([ point.longitud, point.latitud ])
                .addTo(map.current);
        } );
    })
    .catch(err => console.log(err))
    }, [markers]);*/

    
    useEffect(() => {
        if(token === null){
            Navigate("/")
        }else{
        //setIsLogging(true);

        switch (id_proyect) {
            case "2":
                zoom = 12
                break;
            
            case "3":
                zoom = 12.9
                break;

            case "4":
                lng = -98.29855783279912
                lat = 19.050966324235745
                zoom = 14
                break;

            case "5":
                lat = 19.049495448888855
                lng = -98.2140849071712
                zoom = 11
                break;

            case "6":
                lat = 19.06114759114169
                lng = -98.30773870118088
                zoom = 12.9
                break;
                
            default:
                break;
        }

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [lng, lat],
            zoom: zoom,
            boxZoom: true,
            
        });
                  
        map.current.on('load', function() {
              
          cajaBusqueda.current = new MapboxGeocoder({
            accessToken:mapboxgl.accessToken,
            countries: 'mx',
            placeholder:'Ingrese una dirección',
            mapboxgl:mapboxgl,
            // types: 'poi',
          })

           map.current.addControl(cajaBusqueda.current);

            setisCharging(true);
            var url = Url + 'luminarias?proyecto='+ id_proyect;
            /*var headers = {
                'Authorization': token 
            };*/
          
            /*var url2 = Url + 'luminarias?proyecto='+ id_proyect+"&fecha=updated_at&"+
            "desde=2024-01-01&hasta=2024-01-31";

            axios.get(url2, {
              headers: {
                Authorization : token,
              }
            })
            .then(res =>  {
              map.current.addSource('xample_points2', {
                type: 'geojson',
                data: res.data
              });
        
              map.current.addLayer({
                'id': 'xample_points2',
                'type': 'circle',
                'source': 'xample_points2',
        
                'paint': {
                'circle-radius': 4,
                'circle-stroke-width': 0.5,
                'circle-color': 'yellow',
                'circle-stroke-color': 'white'
                }  
              });
            })
            .catch(err => {
              console.log(err)
            })*/

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
                      'circle-color': 'green',
                      'circle-stroke-color': 'white'
                      }  
                    });
              })
            .catch(err => {
                setisCharging(false);
                
                if (err.response.status===404) {
                    MySwal.fire({
                        icon: "info",
                        title: "Oops... <br/> Aún no existen registros",
                      });
                }
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
                
                
                marker.setLngLat(coordinates)
                marker.addTo(map.current);
                markers.push(marker)

                markerClicked(description)
            });
           
        });
        }
    },[]);

    const closePanel = () => {
        setShowPanel(false);
    }

    const markerClicked  = async(datos) => {
        setisCharging(true)
        setValue("Informacion")
        //console.log(datos.id)
        await axios.get(Url + 'luminarias/'+datos.id, {
            headers: {
                Authorization : token,
            }
          })
        .then(res =>  {
            setisCharging(false)
            closePanel()
            setdataLuminaria(res.data);
            setShowPanel(true);
          })
        .catch(err => {
          setisCharging(false)
          if(err.response.status === 404){
            closePanel()
            MySwal.fire({
              icon: "info",
              title: "Luminaria no Encontrada",
            });
          }else{
            console.log(err)
          }
        })
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
  
          /*case "calle":
                setcalle(event.target.value)
            break;
  
          case "colonia":
                setcolonia(event.target.value)
            break;*/
        
          default:
            break;
        }
      }

      const onKeyDownHandlerPDL = (event) => {
        if (event.key === "Enter") {
            buscar("pdl")
        }
      }


      function esCoordenadaValida(cadena) {
        // Expresión regular para validar el formato de la coordenada: "latitud, longitud"
        var regex = /^-?\d+(\.\d+)?, ?-?\d+(\.\d+)?$/;
      
        // Verificar el formato de la cadena
        if (!regex.test(cadena)) {
          return false;
        }
      
        // Extraer los valores de latitud y longitud
        var valores = cadena.split(',').map(function(valor) {
          return parseFloat(valor.trim());
        });
      
        var latitud = valores[0];
        var longitud = valores[1];
      
        // Verificar los rangos de latitud (-90 a 90) y longitud (-180 a 180)
        if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
          return false;
        }
      
        // La coordenada es válida
        return true;
      }
  
      const onKeyDownHandlerXY = (event) => {
        if (event.key === "Enter") {
          if (esCoordenadaValida(coordenadas)) {
            buscar("coordenadas")
          }else{
            MySwal.fire({
              title: "Coordenadas NO válidas",
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            });
          }
        }
      }
  
      const limpiarcoordenadas = () => {
        coordenadas = ""
        setcoordenadas("")
        buscar("coordenadas")
        setshowadd(false)
      }
  
      const limpiarpdl = () => {
        pdl = ""
        setpdl("")
        buscar("pdl")
      }
  
      const buscar = async (busqueda) => {
          borrarMarkers()
          switch (busqueda) {
            case "pdl":
                 setshowadd(false)

                 if (pdl.length > 0) {
                  setisCharging(true)
                  await axios.get(Url + 'luminarias?proyecto='+id_proyect+'&pdl='+ pdl, {
                    headers: {
                        Authorization : token,
                    }
                    })
                  .then(res =>  {
                      setisCharging(false)
                      //map.current.getSource('xample_points').setData(res.data);
                      if (res.data.features.length === 0) {
                        MySwal.fire({
                          title: "Luminaria no existe",
                          icon: "error"
                        });
                      }
                      else {
                        if (res.data.features.length === 1) {   
                          const markerpdl = new mapboxgl.Marker()
  
                          markerpdl.setLngLat(res.data.features[0].geometry.coordinates)
                          markerpdl.addTo(map.current);
                          markers.push(markerpdl)
  
                          map.current.setCenter(res.data.features[0].geometry.coordinates)
                          markerClicked(res.data.features[0].properties)
  
                          map.current.setZoom(16)
                        }
                        else{
                          MySwal.fire({
                            title: "Se encontraron varias etiquetas iguales",
                            text : "Para continuar, deberá seleccionar una",
                            icon: "info"
                          });
  
                          var puntos = []
  
                          for (let index = 0; index < res.data.features.length; index++) {
                            const markerpdl = new mapboxgl.Marker({
                              color: "#BDBABA"
                            })
  
                            puntos.push(res.data.features[index].geometry.coordinates)
  
                            markerpdl.setLngLat(res.data.features[index].geometry.coordinates)
                            markerpdl.addTo(map.current);
                            markers.push(markerpdl)
                          }
  
                          var bounds = puntos.reduce(function(bounds, punto) {
                            return bounds.extend(punto);
                          }, new mapboxgl.LngLatBounds(puntos[0], puntos[0]));
  
                          map.current.setCenter(bounds.getCenter())
                          map.current.fitBounds(bounds, { padding: 100 });
                        }
                        //console.log(res.data.features[0].geometry.coordinates)
                      }
                    })
                  .catch(err => console.log(err))
                 }
                 
              break;

              case "coordenadas":
                if (coordenadas.length > 0) {
                  borrarMarkers()

                  const markerbusqueda = new mapboxgl.Marker({
                    color: "#BDBABA"
                  })

                  var coordinatesendpoint = coordenadas.split(",")

                  setdataLuminariaNew({
                    "latitud":coordinatesendpoint[0],
                    "longitud":coordinatesendpoint[1],
                    "id":0
                  })
                  
                  markerbusqueda.setLngLat([coordinatesendpoint[1], coordinatesendpoint[0]])
                  markerbusqueda.addTo(map.current)
                  markers.push(markerbusqueda)

                  setshowadd(true)
      
                  map.current.setCenter([coordinatesendpoint[1], coordinatesendpoint[0]])
                  map.current.setZoom(16)
                } else {

                  if(pdl.length === 0)
                  {
                    borrarMarkers()
                  }
                }
              break;
            /*case "calle":
              setisCharging(true)
              await axios.get(Url + 'luminarias?proyecto='+id_proyect+'&calle='+calle+'&colonia='+colonia, {
                headers: {
                    Authorization : token,
                }
                })
              .then(res =>  {
                    setisCharging(false)
                    map.current.getSource('xample_points').setData(res.data);
                })
              .catch(err => console.log(err))
              break;
  
            case "colonia":
              setisCharging(true)
              await axios.get(Url + 'luminarias?proyecto='+id_proyect+'&calle='+calle+'&colonia='+colonia, {
                headers: {
                    Authorization : token,
                }
                })
              .then(res =>  {
                  setisCharging(false)
                  map.current.getSource('xample_points').setData(res.data);
                })
              .catch(err => console.log(err))
              break;*/
          
            default:
              break;
          }
      }
    
  const revisarfecha0 = (fecha) => {
        if (fecha < 10) {
            return "0"+fecha
        }
        return fecha
    }
  
  const FiltroFecha = () => {
    setisCharging(true)
    setshowFechaFilter(false)

    const desde = (rangofechasupdate[0].startDate.getFullYear() + "-" 
    + revisarfecha0(rangofechasupdate[0].startDate.getMonth() + 1)
    + "-" + revisarfecha0(rangofechasupdate[0].startDate.getDate()))

    const hasta = (rangofechasupdate[0].endDate.getFullYear() + "-" 
    + revisarfecha0(rangofechasupdate[0].endDate.getMonth() + 1)
    + "-" + revisarfecha0(rangofechasupdate[0].endDate.getDate()))

    map.current.setZoom(12.5)

    const urlFechasFiltro = Url + 'luminarias?proyecto='+ id_proyect+"&fecha=updated_at&desde="+desde+"&hasta="+hasta

    axios.get(urlFechasFiltro, {
      headers: {
        Authorization : token,
      }
    })
    .then(res =>  {
      setisCharging(false);
    
      setbanderaFFecha(true)
      // Verificar si la fuente ya existe
      const existingSource = map.current.getSource('xample_points2');
      if (existingSource) {
        // Actualizar los datos de la fuente existente
        existingSource.setData(res.data);
      } else {
        // Si la fuente no existe, agregarla
        map.current.addSource('xample_points2', {
          type: 'geojson',
          data: res.data
        });
    
        // Verificar si la capa ya existe
        if (!map.current.getLayer('xample_points2')) {
          // Agregar la capa solo si no existe
          map.current.addLayer({
            'id': 'xample_points2',
            'type': 'circle',
            'source': 'xample_points2',
    
            'paint': {
              'circle-radius': 4,
              'circle-stroke-width': 0.5,
              'circle-color': 'yellow',
              'circle-stroke-color': 'white'
            }  
          });
        }
      }
    })
    .catch(err => {
      if(err.response !== undefined) {
        if (err.response.status===500) {
          MySwal.fire({
            icon: "error",
            title: "Error en la búsqueda",
          });
        }

        if (err.response.status===404) {
          MySwal.fire({
            icon: "info",
            title: "Oops... <br/> Aún no existen registros",
          });
        }
      }
      else{
        MySwal.fire({
          icon: "info",
          title: "Tiempo de espera demasiado alto",
        });
      }
      
      setisCharging(false);
      console.log(err)
    })
  }
  const limpiarFiltroFecha = () => {
    setbanderaFFecha(false)
    map.current.getSource('xample_points2').setData({
      type: 'FeatureCollection',
      features: []
    });
  }

  const closeModalNewLuminaria = () => {
      setopenModalLuminaria(false)
  }

  const abrirModalNewLuminaria = () =>{
    //console.log(dataLuminariaNew)  
    setopenModalLuminaria(true)
  }

  const styleModalNewLuminaria = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      height: '90%',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      p: 4,
      overflow: 'auto'
  };

  return (           
       <div ref={mapContainer} className={classNames("map-container")}>
        
       {showPanel &&
        <Panel 
        dato={"PDL: " + dataLuminaria.pdl_id
        //+ " - " + dataLuminaria.id
        } 
        closePanel={closePanel} 
        icono={<EmojiObjectsIcon/>}
        top={0}
        width={'48%'}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleChange}>   
                        <Tab label="Información" value="Informacion" sx={{width:'33%'}}/>
                        <Tab label="Comentarios" value="Comentarios" sx={{width:'33%'}}/>
                        <Tab label="Brazos" value="Brazos" sx={{width:'33%'}}/>
                    </TabList>
                </Box>
                <TabPanel value="Informacion" sx={{m:2, p:0}}>
                    <Luminaria dataLuminariaPanel={dataLuminaria} showAñadirReporte={true} showEditar={true}
                      closePanel={closePanel} borrarMarkers={borrarMarkers} accion={"actualizar"}
                      reloadInfoPanel={setdataLuminaria}/>
                </TabPanel>
                <TabPanel value="Comentarios" sx={{p:0}}>
                    <Comentarios ruta={Url + "luminarias/"+dataLuminaria.id+"/comentarios"} 
                      showAdd={true}/>
                    {/*<Comentarios datacoments={dataComentarios} />*/}
                </TabPanel>
                <TabPanel value="Brazos">
                    <Brazo idLuminaria={dataLuminaria.id}/>
                </TabPanel>
            </TabContext>
        </Panel>
        }
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
          
         {/* <Box sx={{zIndex:1, backgroundColor:"white", width:"30%", height:40, m:1, 
          borderRadius:2}}>
              <TextField variant="standard" sx={{width:"90%", padding:0.8}} name="colonia"
              className={classes.root} placeholder="Colonia" value={colonia} onChange={handleText}
              InputProps={{
                endAdornment:<IconButton size="small" onClick={limpiarcolonia}><ClearIcon/></IconButton>,
              }}
              />
              <IconButton size="small" sx={{mt:0.5}} onClick={() => buscar("colonia")}>
                  <SearchIcon/>
              </IconButton>
          </Box> */}
        </div>

        <Modal
        open={openModalLuminaria}
        onClose={closeModalNewLuminaria}>
            <Box sx={styleModalNewLuminaria}>
                <Luminaria dataLuminariaPanel={dataLuminariaNew} showEditar={true} accion={"crear"}
                  cerrarModalNuevaLum={closeModalNewLuminaria}/>
            </Box>
        </Modal>
  
        {!showPanel &&
        <>
        <SpeedDial
          ariaLabel="SpeedDial Filtros Lum"
          sx={{ position: 'absolute', bottom: 16, left: 16 }}
          icon={<FilterAltIcon/>}
          direction="right"    
        >

          <SpeedDialAction
            icon = {<CalendarTodayIcon fontSize="small"/>}
            tooltipTitle="Actualización"
            sx={{ml:-1}}
            onClick={() => setshowFechaFilter(!showFechaFilter)}
          />
          {banderaFFecha &&
          <SpeedDialAction
            icon = {<><ClearIcon fontSize="small" /><CalendarTodayIcon fontSize="small" /></>}
            tooltipTitle="Limpiar Fecha"
            sx={{ml:-1}}
            onClick={limpiarFiltroFecha}
          />
          }

        </SpeedDial>
        
        {showFechaFilter &&
        <Box component="div" sx={{backgroundColor:"white", position:"absolute", top:50, right:20}}>
          <DateRangePicker
              onChange={item => setrangofechasupdate([item.selection])}
              showSelectionPreview={true}
              months={1}
              ranges={rangofechasupdate}
              direction="horizontal"
              />
          <Button onClick={FiltroFecha}>OK</Button>
        </Box>
        }
        </>
        }

        {(showadd && ![7].includes(user.rol)) &&
          <SpeedDial
          ariaLabel="SpeedDial basic example"
          onClick={abrirModalNewLuminaria}
          sx={{ position: 'absolute', bottom: 16, right: 16}}
          icon={<AddIcon />}
          FabProps={{
            sx: {
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.main',
              }
            }
          }}
          />
        }
        { isCharging && <LoaderIndicator /> }
        </div>
    );
}

export default Map;