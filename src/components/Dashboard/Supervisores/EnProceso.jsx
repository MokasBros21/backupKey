import React, { useEffect, useState,useRef} from "react";
import axios from 'axios';
import { Url } from '../../../constants/global';

//Tarjetas de la cabecera
import Box from '@mui/material/Box';

//SCSS
import '../Dashboard.scss';

//Importanción de la librería de gráficas
import ReactEcharts from "echarts-for-react";

//Responsive
import Grid from '@mui/material/Grid';

//Selector de fechas
import dayjs from 'dayjs';
import { DemoContainer} from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//CARDS JOY
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';


//CUADRILLAS
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//CHIP
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';

//LINEAR PROGRESS
import LinearProgress from '@mui/material/LinearProgress';

//MAPA
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsdHJhZmZpYyIsImEiOiJjbG01Z2U2cW0wajdiM3Bsb2N6ZGhrN2lxIn0.hMkzztmUbOf-N9uToXeBwA';


//----------- CHIP CUADRILLAS -----------------------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

//-------------------------------------------------

const EnProceso = () =>{
   //coordenadas
   let [lat] = useState(19.043679178263694);
   let [lng] = useState(-98.1981651320212);
   let [zoom] = useState(10);

  //Obtener número de proyecto
  const id_proyect = localStorage.getItem('id_proyecto');
   
     //DEFINICIÓN DEL ARREGLO DE CUADRILLAS - NOMBRES DINÁMICOS
  
     const [listaCuadrillas, setListaCuadrillas] = useState([]);
     let names = [];
     var diccionarioCuadrilla = new Object();
  
     const informacionCuadrilla = () => {
      
      axios.get(Url + "users?roles=6", {
          headers: {
              Authorization : token,
          }
      })
      .then(res =>  {
        setListaCuadrillas(res.data);
         
        })
      .catch(err => console.log(err))
  
  }
  
  const obtenerCuadrillaNombres =(data_cuadrilla) =>{
     
    data_cuadrilla.map((nc) =>( 
       names.push(nc.nombre_completo)
    ));

    data_cuadrilla.map((nc) =>( 
      diccionarioCuadrilla[nc.nombre_completo] = nc.id
     ));

     return names;
    }
  
  
    //Peticiones para obtener la información

   //TIEMPOS DE RESPUESTA

   const [dataTiempoRespuesta, setDataTiempoRespuesta] = useState([]);

     //OBTENCIÓN DE FECHA ACTUAL
     let fecha_actual = dayjs();
     let fecha_actual_formateada_inicio = '';
     let fecha_actual_formateada_fin = '';
     let year_actual = fecha_actual.$y;
     let month_actual =fecha_actual.$M+1;
     let day_actual = fecha_actual.$D;
     
 
      if(month_actual < 10){
          month_actual = '0'+month_actual; 
      }
 
      if(day_actual < 10){
        day_actual= '0'+day_actual; 
    }
    
    fecha_actual_formateada_inicio = year_actual+'-'+month_actual+'-'+ '01'
    fecha_actual_formateada_fin = year_actual+'-'+month_actual+'-'+day_actual;
  
     //SELECTOR DE FECHAS
     const dataFechaInicial= useRef(fecha_actual_formateada_inicio);
     const dataFechaFinal = useRef(fecha_actual_formateada_fin);
     let fechaI = '';
     let fechaF = '';

  //TOKEN LARAVEL
  const token = localStorage.getItem('token');

  //MAPA
  const mapContainer = useRef(null);
  const map = useRef(null);
  const geoMapa = useRef();

  
  //TIEMPO MÁXIMO DE ATENCIÓN
  let data_tiempo_maximo_atencion = []

  //RESUMEN
  const resumen = useRef('');
  const [resumen02, setDataResumen] = useState([]);

  //FUNCIONES CHIP CUADRILLA

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const cuadrillaChip = useRef();
  const cuadrilla= useRef('');
  const cuadrillaGlobal = useRef('');
  
  const handleChangeChip = (event) => {
     const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
      cuadrillaChip.current = typeof value === 'string' ? value.split(',') : value
    );
  
    peticionCuadrillaChip();
    cuadrilla.current = '';
  };

 //PETICIÓN DEL GEOJSON MAPA
  const geojsonMapa= (fechaInicio,fechaFin,responsable,companero) => {
   axios.get(Url +"dashboard/enproceso/geojsonsupervisor?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
    +fechaFin+"&responsable="+responsable+"&compañero="+companero, {
        headers: {
            Authorization : token,
        }
    })
    .then(res =>  {
      
      geoMapa.current = res.data;
      map.current.getSource('museums').setData(geoMapa.current);
     
      })
    .catch(err => console.log(err))
    }
  
     //PETICIÓN DE RESUMEN
  const resumenConsulta =(fechaInicio,fechaFin,responsable,companero) => {
    axios.get(Url + "dashboard/enproceso/resumensupervisor?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
    +fechaFin+"&responsable="+responsable+"&compañero="+companero, {
        headers: {
            Authorization : token,
        }
    })
    .then(res =>  {
      
        resumen.current = res.data.total;
        setDataResumen(res.data.total)
       
      })
    .catch(err => console.log(err))
}

  //PETICIONES DE TIEMPO DE ATENCIÓN
  const reportesTiempoRespuesta =(fechaInicio,fechaFin,responsable,companero) => {
  axios.get(Url + "dashboard/enproceso/tiempoatencionsupervisor?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
  +fechaFin+"&responsable="+responsable+"&compañero="+companero, {
    headers: {
        Authorization : token,
    }
  })
 .then(res =>  {
   
 
  setDataTiempoRespuesta(res.data);
  
  })
  .catch(err => console.log(err))
  }
  
  const obtenerDataTiempoAtencion= (data_tiempo_atencion) =>{
   
    let data_nombres_tiempo_atencion = []
    let data_valores_tiempo_atencion = []

    data_tiempo_atencion.map((dta) =>( 
    data_nombres_tiempo_atencion.push(JSON.stringify(dta.tiempo_respuesta)+' Horas de respuesta')
    
    ));

    data_tiempo_atencion.map((dta) =>( 
    data_valores_tiempo_atencion.push(dta.count)
    ));
   

    for(let i=0;i<data_tiempo_atencion.length;i++){
      
      data_tiempo_maximo_atencion.push({value:data_valores_tiempo_atencion[i],name:data_nombres_tiempo_atencion[i]})
      
    }
  
    return data_tiempo_maximo_atencion;
    }
    
  //Llamado de peticiones

  const peticionesAPIValoresIndicadores = () =>{

    let lineaProgreso= document.getElementById('lineaDeProgreso');
    lineaProgreso.style.display = 'block';

    setTimeout(() => {
      //MÁXIMO TIEMPO DE RESPUESTA
  reportesTiempoRespuesta(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,companeroGlobal.current);
    }, "1000");
  
    setTimeout(() => {
      //RESUMEN
      resumenConsulta(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,companeroGlobal.current);
    }, "1000");
  
    setTimeout(() => {
       //MAPA
   geojsonMapa(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,companeroGlobal.current);
    }, "1000");
   
    setTimeout(() => {
     lineaProgreso.style.display = 'none';
    }, "1500");
   
  }

//Compañeros 
const [nombreCompanero, setNombreCompanero] = React.useState([]);
const companeroChip = useRef();
const companero= useRef('');
const companeroGlobal = useRef('');

 const handleChangeCompanero = (event) => {
    const {
     target: { value },
   } = event;
   setNombreCompanero(
     // On autofill we get a stringified value.
     typeof value === 'string' ? value.split(',') : value,
     companeroChip.current = typeof value === 'string' ? value.split(',') : value
   );
 
   peticionCompaneroChip();
   companero.current = '';
 };

   //Compañeros auxiliares
   const [listaCompaneros, setListaCompaneros] = useState([]);
   let namesCompanero = [];
   var diccionarioCompanero = new Object();

   const informacionCompaneros = () => {
     
     axios.get(Url + "users?roles=10&proyecto="+id_proyect, {
         headers: {
             Authorization : token,
         }
     })
     .then(res =>  {
       setListaCompaneros(res.data);
       })
     .catch(err => console.log(err))
 }

 const obtenerCompaneroNombres =(data_companero) =>{
   
  data_companero.map((nc) =>( 
     namesCompanero.push(nc.nombre_completo)
  ));

  data_companero.map((nc) =>( 
    diccionarioCompanero[nc.nombre_completo] = nc.id
   ));

   return namesCompanero;
  }


  const peticionCompaneroChip = () =>{

    for(let k=0;k<namesCompanero.length;k++){
      //PRUEBA
    if(companeroChip.current.includes(namesCompanero[k])){
      if(companero.current != ''){
        if(!companero.current.includes(JSON.stringify(diccionarioCompanero[namesCompanero[k]]))){
          companero.current = companero.current+','+JSON.stringify(diccionarioCompanero[namesCompanero[k]]);
        
        }
      }else{
        companero.current = JSON.stringify(diccionarioCompanero[namesCompanero[k]]);
      }
    }
    }
  
    companeroGlobal.current = companero.current;

  //Llamado de las funciones que realizan peticiones en la API de KEYCITY
  peticionesAPIValoresIndicadores();

  }

  
//PINTAMOS EL MAPA
    useEffect(() => {

      switch (id_proyect) {
        case "2":
            lng = -116.596191
            lat = 31.866396
            zoom = 10
            break;
        
        case "3":
            lng = -87.074004
            lat = 20.629081
            zoom = 10
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
      zoom: zoom
    });
   

    //MÉTODO ONLOAD
    map.current.on('load', () => {
    
       //CAPA DE PRUEBA
       map.current.addSource('museums', {
        type: 'geojson',
        data: ''
        });
        map.current.addLayer({
        'id': 'museums',
        'type': 'circle',
        'source': 'museums',
        'layout': {
        // Make the layer visible by default.
        'visibility': 'visible'
        },
        'paint': {
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-color': 'rgba(0, 163, 241, 0.8)',
          'circle-stroke-color': 'white'
        },
       
        })
      }); //OnLoad

    }
  );
  
  //OBTENCIÓN DE CUADRILLAS PARA LA PETICIÓN

  const peticionCuadrillaChip = () =>{

    for(let k=0;k<names.length;k++){
      //PRUEBA
      if(cuadrillaChip.current.includes(names[k])){
        if(cuadrilla.current != ''){
          if(!cuadrilla.current.includes(JSON.stringify(diccionarioCuadrilla[names[k]]))){
            cuadrilla.current = cuadrilla.current+','+JSON.stringify(diccionarioCuadrilla[names[k]]);
          
          }
        }else{
          cuadrilla.current = JSON.stringify(diccionarioCuadrilla[names[k]]);
        } 
      }
    }
    
    cuadrillaGlobal.current = cuadrilla.current;

  //Llamado de las funciones que realizan peticiones en la API de KEYCITY
  peticionesAPIValoresIndicadores();
   
  }

   //MÉTODOS DE FECHA

     const setDataFechaInicialMethod = (newDate) =>{
      let year = newDate.$y;
      let month = newDate.$M+1;
      let day = newDate.$D;
     

      if(month < 10){
          month = '0'+month; 
      }

      if(day < 10){
        day= '0'+day; 
    }
    
      fechaI = year+'-'+month+'-'+day;
      
     dataFechaInicial.current = fechaI;

      if(dataFechaFinal.current != ''){  
      
     //Llamado de las funciones que realizan peticiones en la API de KEYCITY
      peticionesAPIValoresIndicadores();

      map.current.getSource('museums').setData(geoMapa.current);
      }else{
        console.log('Método: SetDataFechaInicial - el parámetro dataFechaFinal no tiene un valor establecido.')
      }
      }

      const setDataFechaFinalMethod = (newDate) =>{
        
        let year = newDate.$y;
        let month = newDate.$M+1;
        let day = newDate.$D;
       
  
        if(month < 10){
            month = '0'+month; 
        }
  
        if(day < 10){
          day= '0'+day; 
      }
      
        fechaF = year+'-'+month+'-'+day;
        dataFechaFinal.current = fechaF;
     
     if(dataFechaInicial.current !=''){
     
       
     //Llamado de las funciones que realizan peticiones en la API de KEYCITY
     peticionesAPIValoresIndicadores();

  
     }else{
      console.log('setDataFechaFinalMethod: No se ha ingresado una fecha inicial.')
     }
        }


    //GRÁFICA DE TIEMPO MÁXIMO DE ATENCIÓN

    let graficaMaximoTiempo= {
      title: {
        text: 'Reportes por máximo tiempo de atención',
        left: 'center'
      },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '8%',
          left: 'center'
        },
        series: [
          {
            name: 'Total de reportes',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: obtenerDataTiempoAtencion(dataTiempoRespuesta)
          }
        ]
      };

      useEffect(() => {
       
     //Llamado de las funciones que realizan peticiones en la API de KEYCITY
     peticionesAPIValoresIndicadores();

    //Obtener lista de cuadrillas
   informacionCuadrilla();
   informacionCompaneros();

           }, [])
    

    return(

         

        <div>
          <Box sx={{ flexGrow: 1 }}>
        <div id="lineaDeProgreso"><LinearProgress/></div>
      <div>
        <Grid container spacing={3}>
        <Grid item xs={4}>
           <Grid item xs={12}>
             <div className='contenedorFechas'> 
            
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker', 'DatePicker']}>
            <Grid item xs={8}>
            <DatePicker
              label="Fecha inicial"
              format="YYYY-MM-DD"
              value={dayjs(dataFechaInicial.current)}
              onChange={(newValue) => setDataFechaInicialMethod(newValue)}
            />
            </Grid>
            <Grid item xs={8}>
            <DatePicker
              label="Fecha final"
              format="YYYY-MM-DD"
              value={dayjs(dataFechaFinal.current)}
              onChange={(newValue) => setDataFechaFinalMethod(newValue)}
            />     
          </Grid>
          </DemoContainer>
        </LocalizationProvider>
        </div>
        </Grid>
          <Grid item xs={10}>
             
          <div className='contenedorTarjeta'>
          <Card variant="solid" color="primary" invertedColors>
            <CardContent orientation="horizontal">
          
              <CardContent>
                <Typography level="h2" >Resumen</Typography>
                <Typography level="h1">{resumen02}</Typography>
                <Typography level="h5" >Recuento de abiertos</Typography>
              </CardContent>
            </CardContent>
          </Card>
          </div>

          <div className="contenedorTarjeta">
        
        <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-chip-label">Responsable</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={personName}
            onChange={handleChangeChip}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {obtenerCuadrillaNombres(listaCuadrillas).map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
  
       {/* //companero */}
       <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-chip-label">Compañero</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={nombreCompanero}
            onChange={handleChangeCompanero}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            { obtenerCompaneroNombres(listaCompaneros).map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name,nombreCompanero, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
        </div>
        
          </Grid>
        </Grid>

      <Grid item xs={8}>
       <div ref={mapContainer} className="map-container-dashboard-reportes "></div>
       </Grid>


        <Grid item xs={12}>
        <div className='contenedorTabla'><ReactEcharts option={graficaMaximoTiempo} /></div>
        </Grid>
      </Grid>
      </div> 
        </Box>
        </div>
        
    );

        }


export default EnProceso;