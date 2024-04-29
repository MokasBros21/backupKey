import React, { useState, useRef } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import mapStyle from "./MapGoogleStyle.jsx";

import './Rutas.scss';

//Inputs
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import LightIcon from '@mui/icons-material/Light';
import IconButton from '@mui/material/IconButton';

//Button
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoopIcon from '@mui/icons-material/Loop';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import SaveIcon from '@mui/icons-material/Save';

//Punto de partida
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import RvHookupIcon from '@mui/icons-material/RvHookup';
import DoneAllIcon from '@mui/icons-material/DoneAll';

//Vehiculos
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import axios from 'axios'
import { Url } from "../../constants/global";

 //Paper
 import Paper from '@mui/material/Paper';
 import ClearIcon from '@mui/icons-material/Clear';

//Alerts
import Alert from '@mui/material/Alert';

const Ruta = (props) =>{
    const token = localStorage.getItem('token');
    const id_proyect = localStorage.getItem('id_proyecto');
    const mapRef = useRef(null);
    const [circulosActuales, setcirculosActuales] = useState([]);
    const [waypts, setwaypts] = useState([]);
    
    //Punto de partida
    const [latitudPuntoPartida, setLatitudPuntoPartida] = useState(null);
    const [longitudPuntoPartida, setLongitudPuntoPartida] = useState(null);

    //Destino
    const [latitudDestino, setLatitudDestino] = useState(null);
    const [longitudDestino, setLongitudDestino] = useState(null);
    const puntoPartida = useRef(false);
    const puntoDestino = useRef(false);

    //Directions
    let arrayDirectionsRenderer = []
    
    //Caja de búsqueda
  const searchBoxRef = useRef(null);

  //Arreglo de colores 
  const arrayColors = ['#CC7BFC','#9679F9','#48A3EC','#0BB1CB','#04C69B','#FB63E7','#A572F7'];

    
    const mapStyles = {
        width: '70%',
        height: '93%',
    };
    
  const image = {
        url: "https://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png",
        //This marker is 20 pixels wide by 32 pixels high.
        size: new props.google.maps.Size(512, 512),
        // The origin for this image is (0, 0).
        origin: new props.google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new props.google.maps.Point(0, 32),
      };
    
      const input = searchBoxRef.current;

      const searchBox = new window.google.maps.places.SearchBox(input);

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

      mapRef.current.map.panTo(place.geometry.location);
      mapRef.current.map.setZoom(17);
      
  
      if(puntoPartida.current){
        if(puntoDestino.current === false){
          setLatitudDestino(place.geometry.location.lat());
        setLongitudDestino(place.geometry.location.lng());
        }
         
      }else{
        setLatitudPuntoPartida(place.geometry.location.lat())
        setLongitudPuntoPartida(place.geometry.location.lng())
      }

    });

    const pintarLuminariasAleatorias = () => {

       
        limpiarcirculos()
        const numeroLuminarias = document.getElementById('input-luminarias').value;
        let map = mapRef.current.map;
        let waypoints = []

        map.setCenter({
            lat: 19.0409511,
            lng: -98.221976,
        });
        map.setZoom(11);

        axios.get(Url + "luminarias_random?proyecto="+id_proyect+"&cantidad="+numeroLuminarias, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {

            const nuevosCirculos = [];
            for (let index = 0; index < res.data.length; index++) {

                (function(index) {
                    var latitud = parseFloat(res.data[index].latitud);
                    var longitud =parseFloat(res.data[index].longitud);
                    var center = { lat: latitud, lng: longitud };

                    waypoints.push({
                      location: {lat:latitud,lng:longitud},
                      stopover: false,
                    });
                    
                    const cityCircle = new props.google.maps.Marker({
                       
                        position: center,
                        icon: image,
                        // radius: 125,
                    });
            
                    // Agregar un evento onclick al círculo
                    cityCircle.addListener('click', () => {
                        map.setCenter(center);
                        map.setZoom(19);

                        if(puntoPartida.current){
                          if(puntoDestino.current === false){
                            setLatitudDestino(latitud);
                          setLongitudDestino(longitud);
                          }
                           
                        }else{
                          setLatitudPuntoPartida(latitud)
                          setLongitudPuntoPartida(longitud)
                        }
                
                    });
                    cityCircle.setMap(map);
                    nuevosCirculos.push(cityCircle);
                })(index);
            }

            setwaypts(waypoints);
            
            let coordenadas= document.getElementById('puntoPartida');
            coordenadas.style.display = 'block';
            document.getElementById('cajaBusqueda').style.display = 'flex';

            map.addListener('click', (e) => {

              if(puntoPartida.current){
                if(puntoDestino.current === false){
                  setLatitudDestino(e.latLng.lat());
                setLongitudDestino(e.latLng.lng());
                }
                 
              }else{
                setLatitudPuntoPartida(e.latLng.lat())
                setLongitudPuntoPartida(e.latLng.lng())
              }
              
              
            });

            setcirculosActuales(prevCirculos => {
                // Eliminar círculos antiguos de manera segura
                prevCirculos.forEach(circulo => {
                  circulo.setMap(null);
                });
        
                return nuevosCirculos;
              });
            
          })
        .catch(err => console.log(err))
        
       
      }

      const limpiarcirculos = () => {
        if (circulosActuales && circulosActuales.length > 0) {
            circulosActuales.forEach(circulo => {
              circulo.setMap(null);
            });
    
            setcirculosActuales([])
          }
    }

    const obtenerUnidades = () =>{
      if(document.getElementById('vehiculo').value !== ''){
        let numeroUnidades = parseInt(document.getElementById('vehiculo').value);
        let waypointsPorRuta = 0;
        let arrayWaipontsPorRuta = []
        let numeroWaypoints = waypts.length;
        
        let start = 0;
        let end = 0;
  
        if(waypts.length%numeroUnidades !== 0){
          waypointsPorRuta = Math.floor(waypts.length/numeroUnidades)
        }else{
          waypointsPorRuta = waypts.length/numeroUnidades;
        }
        if(waypointsPorRuta === 1 || (waypts.length === numeroUnidades) || (numeroUnidades>waypts.length)){
          
          document.getElementById('alertaRecorrido').style.display = "flex";
               
        }else{
          document.getElementById('alertaRecorrido').style.display = "none";
          end = waypointsPorRuta;
        for(let i = 0;i<numeroUnidades;i++){
           
          if(numeroWaypoints >= waypointsPorRuta){
           arrayWaipontsPorRuta.push(waypts.slice(start,end));
           numeroWaypoints = numeroWaypoints - waypointsPorRuta;
           start = start + waypointsPorRuta;
           end = end + waypointsPorRuta;
           
          }else{
            
           arrayWaipontsPorRuta.pop()
           start = start - waypointsPorRuta;
           end = end + numeroWaypoints;
           arrayWaipontsPorRuta.push(waypts.slice(start,end));
          }
        }
        //Si el arreglo es menor al número de waypoints permitidos en la API
        if( waypts.length < 25){
          var origin = new Object();
          var destination = new Object();
          var waypoints = new Object();
          var color = '';
        for(let i=0; i<arrayWaipontsPorRuta.length;i++){
            color = arrayColors.pop();
            origin = {lat:latitudPuntoPartida,lng:longitudPuntoPartida};
            destination = {lat:latitudDestino,lng:longitudDestino};
            waypoints = arrayWaipontsPorRuta[i];
            obtenerRuta(origin, destination, waypoints,color);
          }

        }else{
          for(let j=0; j< arrayWaipontsPorRuta.length;j++){
           
            //si un objeto en el arreglo mide exactamente los 25 puntos que pide la API para una ruta
            if(arrayWaipontsPorRuta[j].length == 25){
              var color = arrayColors.pop();
              let origin = {lat:latitudPuntoPartida,lng:longitudPuntoPartida};
              let destination = {lat:latitudDestino,lng:longitudDestino};
              let waypoints = arrayWaipontsPorRuta[j];
              obtenerRuta(origin,destination,waypoints,color);
            }

            //Si el objeto en el arreglo sobrepasa los 25 puntos permitidos por la API
            if(arrayWaipontsPorRuta[j].length > 25){
              if(arrayWaipontsPorRuta[j].length%25 == 0){
                var color = arrayColors.pop();
                let totalwaypoints = arrayWaipontsPorRuta[j].length;
                  let inicioRuta = 0;
                  let finalRuta =25;
                  var origin = new Object();
                  var destination = new Object();
                  var waypoints = new Object();
                for(let k=0; k<(arrayWaipontsPorRuta[j].length/25);k++){
                  
                  if(k == 0){
                    origin = {lat:latitudPuntoPartida,lng:longitudPuntoPartida};
                    destination = arrayWaipontsPorRuta[j][finalRuta].location;
                    waypoints =  arrayWaipontsPorRuta[j].slice(inicioRuta,finalRuta);
                  }
                  
                  if(k > 0){
                    if(finalRuta == arrayWaipontsPorRuta[j].length){
                      finalRuta = finalRuta - 1;

                    origin = arrayWaipontsPorRuta[j][inicioRuta].location;
                    destination = {lat:latitudDestino,lng:longitudDestino};
                    waypoints = arrayWaipontsPorRuta[j].slice(inicioRuta,finalRuta)

                    }else{
                    origin = arrayWaipontsPorRuta[j][inicioRuta].location;
                    destination = arrayWaipontsPorRuta[j][finalRuta].location;
                    waypoints = arrayWaipontsPorRuta[j].slice(inicioRuta,finalRuta)
                    }
                
                  }
          
                  obtenerRuta(origin,destination,waypoints,color);
                  totalwaypoints = totalwaypoints - 25;
                  inicioRuta = inicioRuta + 25;
                  finalRuta = finalRuta+25;
                }

              }else{
                
                  let modulo = arrayWaipontsPorRuta[j].length%25;
                  let totalwaypointsModulo= arrayWaipontsPorRuta[j].length;
                  let inicioRutaModulo = 0;
                  let finalRutaModulo =25;
                   
                  var origin = new Object();
                  var destination = new Object();
                  var waypoints = new Object();
                  var color = arrayColors.pop();

                      for(let l=0;l<(arrayWaipontsPorRuta[j].length-modulo)/25;l++){

                        if(l == 0){
                          origin = {lat:latitudPuntoPartida,lng:longitudPuntoPartida};
                          destination = arrayWaipontsPorRuta[j][finalRutaModulo].location;
                          waypoints = arrayWaipontsPorRuta[j].slice(inicioRutaModulo,finalRutaModulo); 
                          console.log("B")
                        }
                        
                        if(l > 0){
                          totalwaypointsModulo = totalwaypointsModulo - 25;
                           inicioRutaModulo = inicioRutaModulo + 25;
                           finalRutaModulo = finalRutaModulo+25;
                          console.log("C")
                          if(finalRutaModulo == arrayWaipontsPorRuta[j].length){
                              finalRutaModulo = finalRutaModulo - 1;
                              origin = arrayWaipontsPorRuta[j][inicioRutaModulo].location;
                              destination = {lat:latitudDestino,lng:longitudDestino};
                              waypoints = arrayWaipontsPorRuta[j].slice(inicioRutaModulo,finalRutaModulo);
                              
                          }else{
                              origin = arrayWaipontsPorRuta[j][inicioRutaModulo].location;
                              
                              destination = arrayWaipontsPorRuta[j][finalRutaModulo].location;
                              waypoints = arrayWaipontsPorRuta[j].slice(inicioRutaModulo,finalRutaModulo)
                              
                          }
                          
                        }
                           obtenerRuta(origin,destination,waypoints,color)
                      }
              destination = {lat:latitudDestino,lng:longitudDestino};
              obtenerRuta(arrayWaipontsPorRuta[j][finalRutaModulo].location,destination,arrayWaipontsPorRuta[j].slice(finalRutaModulo),color);
              }
            }

            if(arrayWaipontsPorRuta[j].length < 25){
              let origin =  {lat:latitudPuntoPartida,lng:longitudPuntoPartida};
              let destination = {lat:latitudDestino,lng:longitudDestino};
              let waypoints = arrayWaipontsPorRuta[j];
              var color = arrayColors.pop();
              
              obtenerRuta(origin,destination,waypoints,color);
            }
          }
        }
        let iniciarRecorrido= document.getElementById('iniciarRecorrido');
        iniciarRecorrido.style.display = 'none';
        let inputVehiculos = document.getElementById('vehiculo');
        inputVehiculos.disabled = true;
        document.getElementById('input-luminarias').disabled = true;
        //Botones
        let btn= document.getElementById('btn');
        btn.style.display = 'grid';
        }
      }
    }

    const obtenerRuta = (origin_,destination_,waypoints_,color) =>{

      let map = mapRef.current.map;

      // Instantiate a directions service.
     const directionsService = new props.google.maps.DirectionsService();
     // Create a renderer for directions and bind it to the map.
     const directionsRenderer = new props.google.maps.DirectionsRenderer({ map: map });
     // Instantiate an info window to hold step text.
      
     directionsService
     .route({
      origin: origin_,
      destination: destination_,
      waypoints: waypoints_,
      optimizeWaypoints: true,
      travelMode: props.google.maps.TravelMode.DRIVING,
        
    })
     .then((result) => {
     
       directionsRenderer.setDirections(result);
       arrayDirectionsRenderer.push(directionsRenderer);
        directionsRenderer.setOptions({
        polylineOptions: { 
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 5,
        },
    });

     console.log(directionsRenderer.getDirections());
       
     })
     .catch((e) => {
       window.alert("Directions request failed due to " + e);
     });
    
    
    }

    const confirmarPuntoPartida = () =>{
      if( latitudPuntoPartida !== null && latitudPuntoPartida !== '' ){
        let buttonLuminarias= document.getElementById('buttonLuminarias');
        buttonLuminarias.style.display = 'none';
        let inputLuminarias = document.getElementById('input-with-icon-adornment');
        inputLuminarias.disabled = true;
  
        let buttonPuntoPartida= document.getElementById('buttonPuntoPartida');
        buttonPuntoPartida.style.display = 'none';
        puntoPartida.current = true;
        let puntoDestino= document.getElementById('destino');
        puntoDestino.style.display = 'block';
        mapRef.current.map.setZoom(11);
        limpiarsearchbox();
      }
    }

    const confirmarPuntoDestino = () =>{

     if(latitudDestino !== null && latitudDestino !== ''){
      puntoDestino.current = true;
      let buttonDestino= document.getElementById('buttonDestino');
      buttonDestino.style.display = 'none';
      let vehiculo= document.getElementById('unidadMovil');
      vehiculo.style.display = 'block';
      mapRef.current.map.setZoom(11);
      limpiarsearchbox();
     }
     
    }
    
    const trazarNuevoRecorrido = () =>{
      mapRef.current.map.setZoom(11);

      document.getElementById('input-luminarias').value = '';
      document.getElementById('buttonLuminarias').style.display = 'flex';
      document.getElementById('input-luminarias').disabled = false;

      setLatitudPuntoPartida('');
      setLongitudPuntoPartida('');
      setLatitudDestino('');
      setLongitudDestino('');

      document.getElementById('puntoPartida').style.display = 'none';
      document.getElementById('buttonPuntoPartida').style.display = 'flex';
      document.getElementById('destino').style.display = 'none';
      document.getElementById('buttonDestino').style.display = 'flex';
      
      document.getElementById('vehiculo').disabled = false;
      document.getElementById('vehiculo').value = '';
      document.getElementById('unidadMovil').style.display = 'none';
      document.getElementById('iniciarRecorrido').style.display = 'flex';

      document.getElementById('btn').style.display = 'none';


      puntoDestino.current = false;
      puntoPartida.current = false;
      
      limpiarcirculos()
      for(let h = 0;h<arrayDirectionsRenderer.length;h++){
            arrayDirectionsRenderer[h].setMap(null);
      }

      document.getElementById('cajaBusqueda').style.display = 'none';
      limpiarsearchbox();
    }

    const limpiarsearchbox = () => {
      searchBoxRef.current.value = ''
  }
  
     
    return(
       <div>
        <Box sx={{ width: '26%', zIndex: 1, position: 'absolute', right: "40.3%", top: 58, 
                    height:45, backgroundColor:"white", borderRadius:10, display:"flex",
                    border:"2px solid gray"}} id="cajaBusqueda">
                <input
                ref={searchBoxRef}
                placeholder="Buscar Dirección"
                type="text"
                style={{ width: '88%', border:0, height:40, marginLeft:20, padding:5}} />
                <IconButton onClick={limpiarsearchbox}>
                    <ClearIcon/>
                </IconButton>
            </Box>
          
      <Paper sx={{width:"25%", zIndex:3, position:"absolute", right:0, height:"93%"}} className='dimensiones'>
  
        <div id='luminarias'>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            Número de luminarias aleatorias
          </InputLabel>
          <Input
            id="input-luminarias"
            startAdornment={
              <InputAdornment position="start">
                <LightIcon />
              </InputAdornment>
            }
            type='number'
          />
        </FormControl>

        <Stack direction="row" spacing={1} alignContent='center'>
          <Button variant="contained" id='buttonLuminarias' endIcon={<LoopIcon />} onClick={pintarLuminariasAleatorias}>
              Generar
          </Button>
          </Stack>
        </Box>
        </div>

        <div id='puntoPartida'>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <InputLabel htmlFor="input-with-icon-adornment">
            Punto de partida
          </InputLabel>
        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            Latitud
          </InputLabel>
          <Input
            id="latitudPuntoPartida"
            startAdornment={
              <InputAdornment position="start">
                <GpsFixedIcon />
              </InputAdornment>
            }
            type='number'
            value={latitudPuntoPartida}
            disabled
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            Longitud
          </InputLabel>
          <Input
            id="longitudPuntoPartida"
            startAdornment={
              <InputAdornment position="start">
                <GpsFixedIcon />
              </InputAdornment>
            }
            type='number'
            value={longitudPuntoPartida}
            disabled
          />
        </FormControl>
        </Box>
        <Stack  direction="row" spacing={1} alignContent='center'>
          <Button variant="contained"  id="buttonPuntoPartida" endIcon={<DoneAllIcon />} onClick={confirmarPuntoPartida}>
            Confirmar
          </Button>
          </Stack>
        </div>

        <div id='destino' >
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <InputLabel htmlFor="input-with-icon-adornment">
            Seleccione el punto de destino
          </InputLabel>
        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            Latitud
          </InputLabel>
          <Input
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <GpsFixedIcon />
              </InputAdornment>
            }
            type='number'
            value={latitudDestino}
            disabled
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            Longitud
          </InputLabel>
          <Input
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <GpsFixedIcon />
              </InputAdornment>
            }
            type='number'
            value={longitudDestino}
            disabled
          />
        </FormControl>
        <Stack direction="row" spacing={1} alignContent='center'>
          <Button variant="contained" id="buttonDestino" endIcon={<DoneAllIcon />} onClick={confirmarPuntoDestino}>
            Confirmar
          </Button>
          </Stack>
        </Box>
        </div>

<Alert severity="error" id='alertaRecorrido'>Demasiadas unidades para este recorrido.</Alert>
  <div id='unidadMovil'>
  <Box sx={{ '& > :not(style)': { m: 1 } }}>
  
  <FormControl variant="standard">
    <InputLabel htmlFor="vehiculo">
      Número de unidades
    </InputLabel>
    <Input
      id="vehiculo"
      startAdornment={
        <InputAdornment position="start">
          < DirectionsBusIcon />
        </InputAdornment>
      }
      type='number'
    />
  </FormControl>
  <Stack direction="row" spacing={1} alignContent='center'>
    <Button variant="contained" endIcon={<RvHookupIcon />} id='iniciarRecorrido' onClick={obtenerUnidades}>
        Iniciar recorrido
    </Button>
    </Stack>
    
  </Box>
  </div>   

  <div id='btn'>
  <Box sx={{ '& > :not(style)': { m: 1 } }}>
  <Stack direction="row" spacing={1} alignContent='center'>
    <Button variant="contained" endIcon={<AddCircleIcon />} id='nuevoRecorrido' onClick={trazarNuevoRecorrido}>
       Nuevo recorrido
    </Button>
    </Stack>
  </Box>
  {/* <Box sx={{ '& > :not(style)': { m: 1 } }}>
  <Stack direction="row" spacing={1} alignContent='center'>
    <Button variant="contained" endIcon={<SaveIcon />} id='guardarRecorrido' onClick={obtenerUnidades} color="success">
        Guardar recorrido
    </Button>
    </Stack>
  </Box> */}
  </div>
    </Paper > 
       
       <Map
              ref={mapRef}
              google={props.google}
              zoom={11}
              style={mapStyles}
              //gestureHandling='cooperative'
              styles={mapStyle}
              initialCenter={{
                  lat: 19.0409511,
                  lng: -98.221976,
              }}
              
          >
        </Map>
       
       </div>
    );
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAiXWOxSPvO0AViX6hlFjBTP3dg5NH83FQ',
  })(Ruta);