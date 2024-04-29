import React, { useEffect, useState,useRef} from "react";
import axios from 'axios';
import { Url } from '../../constants/global';

//Tarjetas de la cabecera
import Box from '@mui/material/Box';

//SCSS
import './Dashboard.scss';

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

//NUEVA SELECCIÓN CANAL DE ENTRADA
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

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

const DashboardCancelados = () =>{

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

    //SECTORES
    const [dataSector, setDataSector] = useState([]);
    let sectoresNombre = []
    let sectoresValores = []


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

  
  //CANAL DE ENTRADA
  const statusCanal = useRef('');

  // PRUEBA - NUEVA SELECCIÓN CANAL DE ENTRADA
  
  const [state, setState] = React.useState({
    appCiudadana: false,
    callCenter: false,
    oficio: false,
    peticionDirecta: false,
    redesSociales: false,
    reporteEnCampo: false,
    rondasInspeccion: false,
    tasaAverias: false,


  });


  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
     
    //AppCiudadana
    if(event.target.name == 'appCiudadana'){
      if(event.target.checked){
         if(statusCanal.current != ''){
        if(!statusCanal.current.includes('2')){
          statusCanal.current = statusCanal.current + ',2';
        }
      }else{
        statusCanal.current = '2';
      }
      }else{
        if(statusCanal.current.includes(',2')){
          statusCanal.current = statusCanal.current.split(",2").join('');
        }
        if(statusCanal.current.includes('2,')){
          statusCanal.current = statusCanal.current.split("2,").join('');
        }
        if(statusCanal.current.includes('2')){
          statusCanal.current = statusCanal.current.split("2").join('');
        }     
      }
     
    }

    //CallCenter
    if(event.target.name == 'callCenter'){
      if(event.target.checked){
         if(statusCanal.current != ''){
        if(!statusCanal.current.includes('3')){
          statusCanal.current = statusCanal.current + ',3';
        }
      }else{
        statusCanal.current = '3';
      }
      }else{
        if(statusCanal.current.includes(',3')){
          statusCanal.current = statusCanal.current.split(",3").join('');
        }
        if(statusCanal.current.includes('3,')){
          statusCanal.current = statusCanal.current.split("3,").join('');
        }
        if(statusCanal.current.includes('3')){
          statusCanal.current = statusCanal.current.split("3").join('');
        }     
      }
    }

    //Oficio
     if(event.target.name == 'oficio'){
      if(event.target.checked){
         if(statusCanal.current != ''){
        if(!statusCanal.current.includes('4')){
          statusCanal.current = statusCanal.current + ',4';
        }
      }else{
        statusCanal.current = '4';
      }
      }else{
        if(statusCanal.current.includes(',4')){
          statusCanal.current = statusCanal.current.split(",4").join('');
        }
        if(statusCanal.current.includes('4,')){
          statusCanal.current = statusCanal.current.split("4,").join('');
        }
        if(statusCanal.current.includes('4')){
          statusCanal.current = statusCanal.current.split("4").join('');
        }     
      }
    }

   //Oficio
   if(event.target.name == 'peticionDirecta'){
    if(event.target.checked){
       if(statusCanal.current != ''){
      if(!statusCanal.current.includes('6')){
        statusCanal.current = statusCanal.current + ',6';
      }
    }else{
      statusCanal.current = '6';
    }
    }else{
      if(statusCanal.current.includes(',6')){
        statusCanal.current = statusCanal.current.split(",6").join('');
      }
      if(statusCanal.current.includes('6,')){
        statusCanal.current = statusCanal.current.split("6,").join('');
      }
      if(statusCanal.current.includes('6')){
        statusCanal.current = statusCanal.current.split("6").join('');
      }     
    }
  }

    //Redes sociales
    if(event.target.name == 'redesSociales'){
      if(event.target.checked){
         if(statusCanal.current != ''){
        if(!statusCanal.current.includes('7')){
          statusCanal.current = statusCanal.current + ',7';
        }
      }else{
        statusCanal.current = '7';
      }
      }else{
        if(statusCanal.current.includes(',7')){
          statusCanal.current = statusCanal.current.split(",7").join('');
        }
        if(statusCanal.current.includes('7,')){
          statusCanal.current = statusCanal.current.split("7,").join('');
        }
        if(statusCanal.current.includes('7')){
          statusCanal.current = statusCanal.current.split("7").join('');
        }     
      }
    }

   //Reporte Campo
   if(event.target.name == 'reporteEnCampo'){
    if(event.target.checked){
       if(statusCanal.current != ''){
      if(!statusCanal.current.includes('8')){
        statusCanal.current = statusCanal.current + ',8';
      }
    }else{
      statusCanal.current = '8';
    }
    }else{
      if(statusCanal.current.includes(',8')){
        statusCanal.current = statusCanal.current.split(",8").join('');
      }
      if(statusCanal.current.includes('8,')){
        statusCanal.current = statusCanal.current.split("8,").join('');
      }
      if(statusCanal.current.includes('8')){
        statusCanal.current = statusCanal.current.split("8").join('');
      }     
    }
  }

    //Rondas de inspección
    if(event.target.name == 'rondasInspeccion'){
      if(event.target.checked){
         if(statusCanal.current != ''){
        if(!statusCanal.current.includes('9')){
          statusCanal.current = statusCanal.current + ',9';
        }
      }else{
        statusCanal.current = '9';
      }
      }else{
        if(statusCanal.current.includes(',9')){
          statusCanal.current = statusCanal.current.split(",9").join('');
        }
        if(statusCanal.current.includes('9,')){
          statusCanal.current = statusCanal.current.split("9,").join('');
        }
        if(statusCanal.current.includes('9')){
          statusCanal.current = statusCanal.current.split("9").join('');
        }     
      }
    }

    //Tasa de averias
    if(event.target.name == 'tasaAverias'){
      if(event.target.checked){
         if(statusCanal.current != ''){
        if(!statusCanal.current.includes('10')){
          statusCanal.current = statusCanal.current + ',10';
        }
      }else{
        statusCanal.current = '10';
      }
      }else{
        if(statusCanal.current.includes(',10')){
          statusCanal.current = statusCanal.current.split(",10").join('');
        }
        if(statusCanal.current.includes('10,')){
          statusCanal.current = statusCanal.current.split("10,").join('');
        }
        if(statusCanal.current.includes('10')){
          statusCanal.current = statusCanal.current.split("10").join('');
        }     
      }
    }

  //Llamado de las funciones que realizan peticiones en la API de KEYCITY
 peticionesAPIValoresIndicadores();
    
  };


  //RESUMEN
  const resumen = useRef(0);
  const [dataResumen, setDataResumen] = React.useState([]);

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
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
      cuadrillaChip.current = typeof value === 'string' ? value.split(',') : value
    );
  
    peticionCuadrillaChip();
    cuadrilla.current = '';
  };


 //PETICIÓN DEL GEOJSON MAPA
  const geojsonMapa= (fechaInicio,fechaFin,cuadrilla,canal) => {
    axios.get(Url +"dashboard/cancelado/geojson?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
    +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal, {
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
  const resumenConsulta = (fechaInicio,fechaFin,cuadrilla,canal) => {
    axios.get(Url + "dashboard/cancelado/resumen?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
    +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal, {
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

  //PETICIONES DE SECTOR 
  const reportesSector= (fechaInicio,fechaFin,cuadrilla,canal) => {
  axios.get(Url + "dashboard/cancelado/sector?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
  +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal, {
      headers: {
          Authorization : token,
      }
  })
  .then(res =>  {
    
    setDataSector(res.data);
    
    })
  .catch(err => console.log(err))
  }

  const obtenerSectoresNombres =(data_sector) =>{

  data_sector.map((sector) =>( 
  sectoresNombre.push(sector.sector)
  ));

  return sectoresNombre;
  }

  const obtenerSectoresValores = (data_sector) =>{

  data_sector.map((sector) =>( 
  sectoresValores.push(sector.count)
  ));

  return sectoresValores;
  }




  //Llamado de peticiones

  const peticionesAPIValoresIndicadores = () =>{

    let lineaProgreso= document.getElementById('lineaDeProgreso');
    lineaProgreso.style.display = 'block';
     
    setTimeout(() => {
      //SECTOR
     reportesSector(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current)
    }, "1000");
    
    setTimeout(() => {
      //RESUMEN
      resumenConsulta(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current)
    }, "1000");
   
    setTimeout(() => {
      //MAPA
     geojsonMapa(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current)
    }, "1000");
     
    setTimeout(() => {
      lineaProgreso.style.display = 'none';
     }, "1500");
     
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
          'circle-color': 'rgb(216, 50, 23)',
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
          if(!cuadrilla.current.includes(diccionarioCuadrilla[names[k]])){
            cuadrilla.current = cuadrilla.current+','+diccionarioCuadrilla[names[k]];
          
          }
        }else{
          cuadrilla.current = diccionarioCuadrilla[names[k]];
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

      if(dataFechaFinal.current !== ''){  
      
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
     
     if(dataFechaInicial.current !==''){
   
      //Llamado de las funciones que realizan peticiones en la API de KEYCITY
      peticionesAPIValoresIndicadores();
  
     }else{
      console.log('setDataFechaFinalMethod: No se ha ingresado una fecha inicial.')
     }
        }




    //REPORTES TERMINADOS
     let graficaReportesCanceladosSector= {
      title: {
        text: 'Sectores donde se generaron los reportes',
        subtext: 'SECTOR',
        left: 'center'
      },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              fontSize: 10
            },
            data: obtenerSectoresNombres(dataSector),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Total',
            type: 'bar',
            barWidth: '60%',
            data:obtenerSectoresValores(dataSector),
          }
        ]
      };

     
     
      useEffect(() => {
   //Llamado de las funciones que realizan peticiones en la API de KEYCITY
   peticionesAPIValoresIndicadores();
   
   //Obtener lista de cuadrillas
   informacionCuadrilla();

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
                <Typography level="h1">{dataResumen}</Typography>
                <Typography level="h5" >Total de reportes cancelados</Typography>
              </CardContent>
            </CardContent>
          </Card>
          </div>
          </Grid>
        </Grid>

        <Grid item xs={3}>
        <div className='contenedorTabla' id="menu">
         
        <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Seleccione el canal de entrada</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={state.appCiudadana} onChange={handleChange} name="appCiudadana"/>
          }
          label="App Ciudadana"
        />
        <FormControlLabel
          control={
            <Switch checked={state.callCenter} onChange={handleChange} name="callCenter" />
          }
          label="Call center"
        />
        <FormControlLabel
          control={
            <Switch checked={state.oficio} onChange={handleChange} name="oficio" />
          }
          label="Oficio"
        />
        <FormControlLabel
          control={
            <Switch checked={state.peticionDirecta} onChange={handleChange} name="peticionDirecta" />
          }
          label="Petición directa"
        />
        <FormControlLabel
          control={
            <Switch checked={state.redesSociales} onChange={handleChange} name="redesSociales" />
          }
          label="Redes sociales"
        />
        <FormControlLabel
          control={
            <Switch checked={state.reporteEnCampo} onChange={handleChange} name="reporteEnCampo" />
          }
          label="Reporte en campo"
        />
        <FormControlLabel
          control={
            <Switch checked={state.rondasInspeccion} onChange={handleChange} name="rondasInspeccion" />
          }
          label="Rondas de inspección"
        />
        <FormControlLabel
          control={
            <Switch checked={state.tasaAverias} onChange={handleChange} name="tasaAverias" />
          }
          label="Tasa de averias"
        />
      </FormGroup>
    </FormControl>
       
       </div>


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
          { obtenerCuadrillaNombres(listaCuadrillas).map((name) => (
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

    </Grid> 
     <Grid item xs={5}>
     
        <div ref={mapContainer} className="map-container-dashboard-reportes "></div>
     
     </Grid>
         
        <Grid item xs={12}>
        <div className='contenedorTabla'><ReactEcharts option={graficaReportesCanceladosSector} /></div>
        </Grid>
  
      </Grid>
      </div> 
        </Box>
        </div>
        
        
    );

        }


export default DashboardCancelados;