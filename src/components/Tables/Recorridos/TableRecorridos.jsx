// import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';

import React, { useEffect, useState, useRef } from "react";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import axios from 'axios';
import { Url } from '../../../constants/global';
import './TableRecorridos.scss';
import Table0 from '../../../assets/Table0.jpg'
import MapaRecorrido from '../../MapaRecorridos/MapaRecorrido';

//Mapa del recorrido
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

//Tarjetas de información del recorrido
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LoaderIndicator from '../../../layout/LoaderIndicator/LoaderIndicator';
import { Autocomplete, MenuItem, Popover, Select, TextField, Tooltip } from '@mui/material';

//Iconos 
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import DownloadIcon from '@mui/icons-material/Download';
import { DeleteForever } from '@mui/icons-material';
import Swal from 'sweetalert2';

const TableRecorridos = () => {

  const token = localStorage.getItem('token');
  let dataCoordenadas = useRef();
  let geojson_altos = useRef();
   //Obtener número de proyecto
   const id_proyect = localStorage.getItem('id_proyecto');
        
  const [dataRecorridos, setdataRecorridos] = useState([]);
  const [dataAltos, setdataAltos] = useState([])
  const [id_recorrido, setid_recorrido] = useState([]);
  const [altosresumen, setaltosresumen] = useState([])
  const [totalTime, settotalTime] = useState(null)

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [isCharging, setisCharging] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);

  const [rangofechas, setrangofechas] = useState([
    {
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: 'selection'
    }
  ]);

  //Filtros
  const [usersRecorridos, setusersRecorridos] = useState([])

  const [showPopNombre, setshowPopNombre] = useState(false)
  const [showPopDuracion, setshowPopDuracion] = useState(false)
  const [showPopFecha, setshowPopFecha] = useState(false) 

  const [iduser, setiduser] = useState("")
  const [selectduracion, setselectduracion] = useState("")
  const [fechadesde, setfechadesde] = useState("")
  const [fechahasta, setfechahasta] = useState("")

  function horaASegundos(hora) {
    const partes = hora.split(':');
    return (+partes[0]) * 3600 + (+partes[1]) * 60 + (+partes[2]);
  }

  function segundosAHora(segundos) {
      const horas = Math.floor(segundos / 3600);
      const minutos = Math.floor((segundos % 3600) / 60);
      const segs = segundos % 60;
      return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  }

  const mapaRecorrido = (idRecorrido) =>{
    setid_recorrido(idRecorrido);
    axios.get(Url + 'coordenadas_geojson/'+idRecorrido, {
        headers: {
            Authorization : token,
        }
    })
    .then(res =>  {
        dataCoordenadas.current = res.data;
      })
    .catch(err => console.log(err))

    axios.get(Url + 'altos_geojson/'+idRecorrido, {
      headers: {
          Authorization : token,
      }
    })
    .then(res =>  {
        geojson_altos.current = res.data.data;    
      })
    .catch(err => console.log(err))

    axios.get(Url + "altos/resumen/" + idRecorrido, {
      headers:{
        Authorization : token
      }
    })
    .then(res => {
      setaltosresumen(res.data.data)
    })
    .catch(err => {
      setaltosresumen(null)
      console.log(err)
    })

    axios.get(Url + 'altos/'+idRecorrido, {
        headers: {
            Authorization : token,
        }
    })
    .then(res =>  {
        setdataAltos(res.data.data)
        
        let totalAltosSegundos  = 0;
        for (let i = 0; i < res.data.data.length; i++) {
          totalAltosSegundos  += horaASegundos(res.data.data[i].duracion);
        }

        const totalAltosEnFormatoHora = segundosAHora(totalAltosSegundos);
        const totalAltosEnMinutos = (totalAltosSegundos / 60).toFixed(3);
        settotalTime(totalAltosEnFormatoHora)
        handleOpen();     
      })
    .catch(err => console.log(err))
  }

  const eliminarRecorrido = (idRecorrido) => {

    Swal.fire({
      title:"¿Está seguro de eliminar éste recorrido?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#27AE60",
      confirmButtonText: "Confirmar",
      cancelButtonColor: "#E74C3C",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setisCharging(true)

        axios.delete(Url + "recorridos/" + idRecorrido, {
          headers:{
            Authorization : token
          }
        })
        .then(res => {
          setisCharging(false)
          recorridos()

          Swal.fire({
            title : "Eliminado con éxito",
            icon : 'success',
          })
        })
        .catch(err => {
          console.log(err)
        })
      }
    });
  }

  const recorridos = () => {
    setisCharging(true)
    axios.get(Url + 'recorridos', {
      headers: {
          Authorization : token,
        }
    })
    .then(res =>  {
      setisCharging(false)
      setdataRecorridos(res.data.data);
    })
    .catch(err => {
      setisCharging(false)
      console.log(err)
    })
  }

  const traerUsers = () => {
    axios.get(Url + "users?proyecto="+id_proyect, {
      headers:{
        Authorization : token
      }
    })
    .then(res => {
      setusersRecorridos(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }
    
  useEffect(() => {
    traerUsers()
    recorridos();
  }, [])

  //Filtros
  const Filtrados = (datoborrar) => {
    const UrlFiltrada = Url + "recorridos?usuario=" + (datoborrar==="nombre" ? "" : iduser)
                                        +"&duracion=" + (datoborrar==="duracion" ? "" : selectduracion)
                                        +"&desde=" + (datoborrar==="desde" ? "" : fechadesde)
                                        +"&hasta=" + (datoborrar==="hasta" ? "" : fechahasta)

     axios.get( UrlFiltrada, {
      headers: {
          Authorization : token,
        }
    })
    .then(res =>  {
      setisCharging(false)
      setdataRecorridos(res.data.data);
    })
    .catch(err => {
      setisCharging(false)
      console.log(err)
    })

  }

  //Nombre
  const abrirPopNombre = (event) => {
    setAnchorEl(event.currentTarget)
    setshowPopNombre(true)
  }

  const handleChangeNombre = (value) => {
    const valorNombre = value===null ? 0 : value.id
    setiduser(valorNombre)

    const UrlFiltroNombre = Url + "recorridos?usuario="+valorNombre+"&duracion="+selectduracion
                                            +"&desde="+fechadesde+"&hasta="+fechahasta
    
    axios.get(UrlFiltroNombre, {
      headers: {
          Authorization : token,
        }
    })
    .then(res =>  {
      setisCharging(false)
      setdataRecorridos(res.data.data);
    })
    .catch(err => {
      setisCharging(false)
      console.log(err)
    })

  }

  const cerrarPopNombre = () => {
    setshowPopNombre(false)
  }

  const limpiarNombre = () => {
    setiduser("")
    Filtrados("nombre")
  }

  //Duracion
  const abrirPopDuracion = (event) => {
    setAnchorEl(event.currentTarget)
    setselectduracion(" ")
    setshowPopDuracion(true)
  }

  const handleChangeDuracion = (event) => {
    const valorduracion = event.target.value
    setselectduracion(valorduracion)

    const UrlFiltroDuracion = Url + "recorridos?usuario="+iduser+"&duracion="+valorduracion
                                     +"&desde="+fechadesde+"&hasta="+fechahasta
    
    axios.get(UrlFiltroDuracion, {
        headers: {
      Authorization : token,
    }
    })
    .then(res =>  {
      setisCharging(false)
      setdataRecorridos(res.data.data);
    })
      .catch(err => {
        setisCharging(false)
        console.log(err)
        })
                        
  }

  const cerrarPopDuracion = () => {
    setshowPopDuracion(false)
  }

  const limpiarDuracion = () => {
    setselectduracion("")
    Filtrados("duracion")
  }

  //FechaCreación
  const revisarfecha0 = (fecha) => {
    if (fecha < 10) {
        return "0"+fecha
    }
    return fecha
  }

  const abrirPopFecha = (event) => {
      setAnchorEl(event.currentTarget)
      setshowPopFecha(true)
  }

  const cerrarPopFecha = () => {
      setshowPopFecha(false)
  }

  const handleChangeFecha = () => {
    const desde = (rangofechas[0].startDate.getFullYear() + "-" + revisarfecha0(rangofechas[0].startDate.getMonth() + 1)
    + "-" + revisarfecha0(rangofechas[0].startDate.getDate()))

    const hasta = (rangofechas[0].endDate.getFullYear() + "-" + revisarfecha0(rangofechas[0].endDate.getMonth() + 1)
    + "-" + revisarfecha0(rangofechas[0].endDate.getDate()))

    setfechadesde(desde)
    setfechahasta(hasta)

    const UrlFiltroFecha = Url + "recorridos?usuario="+iduser+"&duracion="+selectduracion
                                +"&desde="+desde+"&hasta="+hasta
                            
                                axios.get(UrlFiltroFecha, {
                                  headers: {
                                      Authorization : token,
                                    }
                                })
                                .then(res =>  {
                                  setisCharging(false)
                                  setdataRecorridos(res.data.data);
                                })
                                .catch(err => {
                                  setisCharging(false)
                                  console.log(err)
                                })
                            

    // console.log(UrlFiltroFecha)
  }

  const limpiarfiltroFecha = () => {
      setfechadesde("")
      setfechahasta("")
      Filtrados("desde")
  }

  const StyledCell = {
      color: 'white',
      textAlign: "center",
      backgroundColor: "#237f65",
  }

  const styleCellRow = {
      color: 'black',
      textAlign: 'center',
      //backgroundColor: 'white',

  }
   
  const styleBox = (tipoAlto) => {
    switch (tipoAlto) {
      case "Semáforo":
          const styleSemaforo = {
            backgroundColor: "#1E8449"
          }
      return styleSemaforo

      case "Accidente":
          const styleAccidente = {
            backgroundColor: "#D4AC0D"
          }
      return styleAccidente

      case "Tráfico":
          const styleTráfico = {
            backgroundColor: "#B03A2E"
          }
      return styleTráfico

      case "Paradero":
          const styleParadero = {
            backgroundColor: "#2874A6"
          }
      return styleParadero
    
      case "Manifestación":
          const styleManifestación = {
            backgroundColor: "#6C3483"
          }
      return styleManifestación

      case "Otro":
        const styleOtro = {
          backgroundColor: "#5F6A6A"
        }
      return styleOtro
    
      default:
        break;
    }
  } 

  const downloadExcel = async () => {
  
    var UrlExcel = Url + "altos/excel/download?proyecto="+id_proyect+"&id="+id_recorrido 
    
    setisCharging(true)
    const response = await axios.get(UrlExcel , {
        headers: {
            Authorization: token
        },
        responseType: 'blob'
    });

    // Crea una URL para el Blob
    const url = window.URL.createObjectURL(response.data);

    setisCharging(false)
    // Abre una nueva ventana con la URL
    window.open(url, "_blank");

}

  return(  
    <div className='TableRecorridos'>
         <TableContainer>
          <Table stickyHeader sx={{ minWidth: 700, "& .MuiTableRow-root:hover": {backgroundColor: "#A2D9CE"} 
                  }} aria-label="customized table">
            <TableHead>
            <TableRow>
              <TableCell align="right"sx={StyledCell}>
              <div className='tableCell'>No. Recorrido</div>
              </TableCell>
              <TableCell align="right"sx={StyledCell}>
              <div className='tableCell'>Inicio del corrido</div>
              </TableCell>
              <TableCell align="right"sx={StyledCell}>
                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                  Usuario
                  <IconButton onClick={iduser === "" ? abrirPopNombre : limpiarNombre}>
                      {iduser === "" ?
                        <FilterAltIcon sx={{color:"white"}} />
                        :
                        <FilterAltOffIcon sx={{color:"white"}} />
                      }
                  </IconButton>
                    <Popover
                      open={showPopNombre}
                      anchorEl={anchorEl}
                      onClose={cerrarPopNombre}
                      anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                      }}
                    >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        onChange={(event, value) => handleChangeNombre(value)}
                        options={usersRecorridos}
                        getOptionLabel={(option) => option.nombre_completo}
                        sx={{ width: 180, height:200, p:1 }}
                        renderInput={(params) => 
                            <TextField {...params} id="nombreBuscado" variant="standard"/>}
                                        />
                    </Popover>
                </div>
              </TableCell>
              <TableCell align="right"sx={StyledCell}>
                <div className='tableCell'>Duración
                  <IconButton onClick={selectduracion === "" ? abrirPopDuracion : limpiarDuracion}>
                    {selectduracion === "" ?
                      <FilterAltIcon sx={{color:"white"}} />
                      :
                      <FilterAltOffIcon sx={{color:"white"}} />
                    }
                  </IconButton>
                    <Popover
                      open={showPopDuracion}
                      anchorEl={anchorEl}
                      onClose={cerrarPopDuracion}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <Select
                        id="select-duracion"
                        onClose={() => {
                          setTimeout(() => {
                            document.activeElement.blur();
                          }, 0);
                        }}
                        value={selectduracion}
                        onChange={handleChangeDuracion}
                        variant="standard"
                        sx={{p:1}}
                      >
                        <MenuItem value={" "} disabled>-Seleccione-</MenuItem>
                        <MenuItem value={"1"}>1-20 min</MenuItem>
                        <MenuItem value={"2"}>21-45 min</MenuItem>
                        <MenuItem value={"3"}>+45 min</MenuItem>
                      </Select>
                    </Popover>
                </div>
              </TableCell>
              <TableCell align="right"sx={StyledCell}>
              <div className='tableCell'>Fecha Creación
                <IconButton onClick={fechadesde === "" ? abrirPopFecha : limpiarfiltroFecha}>
                  {fechadesde === "" ?
                    <FilterAltIcon sx={{color:"white"}} />
                    :
                    <FilterAltOffIcon sx={{color:"white"}} />
                  }
                </IconButton>
                  <Popover
                    open={showPopFecha}
                    anchorEl={anchorEl}
                    onClose={cerrarPopFecha}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <Box p={1} component="div">
                      <DateRangePicker
                        onChange={item => setrangofechas([item.selection])}
                        showSelectionPreview={true}
                        months={1}
                        ranges={rangofechas}
                        direction="horizontal"
                      />;
                      <Button onClick={handleChangeFecha}>OK</Button>
                    </Box>
                  </Popover>
              </div>
              </TableCell>
              <TableCell align="right"sx={StyledCell}>
              <div className='tableCell'>Más</div>
              </TableCell>
            </TableRow>
          </TableHead>
          {dataRecorridos.length >= 1 &&
          <TableBody>
            {dataRecorridos.map((recorrido) => (
              <TableRow key={recorrido.id}>
                <TableCell sx={styleCellRow}>{recorrido.id}</TableCell>
                <TableCell sx={styleCellRow}>{recorrido.avenida_inicio}</TableCell>
                <TableCell sx={styleCellRow}>
                  {recorrido.usuario[0]===undefined ? "--" : recorrido.usuario[0].nombre + " " + 
                                                            recorrido.usuario[0].ap_paterno}
                </TableCell>
                <TableCell sx={styleCellRow}>
                  {recorrido.duracion_recorrido==="" ? "00:00:00" : recorrido.duracion_recorrido}
                </TableCell>
                <TableCell sx={styleCellRow}>{recorrido.created_at}</TableCell>
                <TableCell sx={styleCellRow}>
                  <Tooltip title="Detalles" arrow placement='top'>
                    <IconButton onClick={()=>mapaRecorrido(recorrido.id)}>
                      <DirectionsCarFilledIcon></DirectionsCarFilledIcon>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar" arrow placement='top'>
                    <IconButton color='error' onClick={() => eliminarRecorrido(recorrido.id)}>
                      <DeleteForever color='error'/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          }
        </Table>
      </TableContainer>
      {dataRecorridos.length === 0 &&
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
                    <img src={Table0} alt="Searching..." height={300} width={400} style={{marginTop:"5%"}}/>
                    <h3 style={{marginTop:"-4%", color:"#dce4f7"}}>Sin Registros</h3>
                </div>
            }
        <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <Box>
            <div className='contenidoRecorrido'>
              <Box sx={{display:"flex", mt:2, justifyContent:"space-between", width:"95%"}}>
                <h2>Recorrido: # {id_recorrido}</h2>
                  <div>
                    <Button color="success" variant="contained" onClick={downloadExcel} sx={{mr:2.2}}><DownloadIcon />DESCARGA </Button>
                    <Button onClick={handleClose} sx={{border:"1px solid", minWidth:"30px", maxHeight:"30px"}}color='error'>X</Button>
                  </div>
              </Box>

              {altosresumen!==null ?
              <div style={{display:"flex", justifyContent:"space-evenly", width:"100%", marginBottom:-50,
                          paddingLeft:10, paddingRight:10, gridGap:10}}>
                {altosresumen.map((resumen, index) => (
                  <Card key={index} sx={{width:250}}>
                    <CardContent>
                      <h4 style={{marginBottom:2}}>Resumen {resumen.tipo}</h4>
                      <label>Total de Altos: {resumen.total_altos}</label>
                      <div><label>Duración total: {resumen.duracion}</label></div>
                    </CardContent>
                </Card>
                ))}
              </div>
              :
              <div style={{marginTop:"-80px"}}></div>
              }
              <div style={{display:"flex", justifyContent:"space-between", width:"90%", alignItems:"center", 
              height:"75%", marginTop:"3%"}}>
                  <div style={{width:"70%", marginLeft:"-150px", height:"75vh"}}>
                    <MapaRecorrido coordenadas={dataCoordenadas.current} altos={geojson_altos.current}
                    height={"calc(90vh - 190px)"}
                    />
                  </div>
                  {dataAltos.length > 0 ?
                  <div style={{width:"30%", height:"80%", padding:0, marginTop:10}}> {/*Tarjetas de información del recorrido*/}
                  <h3>Altos ({dataAltos.length}) - ({totalTime} min) :</h3>
                  <div className='wrapper'>
                    <>
                    {dataAltos.map((alto, index) => (
                    <Card key={index} sx={{height:140}}>
                      <CardContent sx={{display:"flex", flexDirection:"column"}}>
                        <Typography variant="h7" gutterBottom>
                        <strong>Alto #: {index+1}</strong> 
                        </Typography>
                        <Box sx={{display:"flex"}}>
                          <Typography variant="h7" gutterBottom>
                            Tipo Alto: {alto.tipo}
                          </Typography>
                          <Box sx={{border:"1.5px solid", borderRadius:4, alignItems:"center", 
                                    display:"flex", justifyContent:"center", p:0.5, ml:1}}>
                            <Box sx={[styleBox(alto.tipo), {width:"15px", height:"15px", borderRadius:3}]}/>
                          </Box>
                        </Box>
                        <Typography variant="h7" gutterBottom>
                          Coordenadas: {alto.coordenadas===undefined ? "Por definir" : alto.coordenadas.latitud + "," + alto.coordenadas.longitud}
                        </Typography>
                        <Typography variant="h7" gutterBottom>
                          Duración: {alto.duracion||"--"} min
                        </Typography>
                      </CardContent>
                    </Card>
                    ))}
                    </>
                  </div>
                </div>
                :
                <div style={{display:"flex", alignItems:"flex-start", justifyContent:"left", width:"25%"}}>
                  <p>Sin Registros</p>
                </div>
                }
              </div>
            </div>
          </Box>
        </Modal>
      </div>

    {isCharging && <LoaderIndicator/>}
    </div>

      
    );
    }

export default TableRecorridos;         