import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import "./TableVehiculos.scss";
import classNames from 'classnames';
import { useEffect, useState } from 'react';
    import axios from 'axios';
    import { Url } from '../../../constants/global';
import Swal from 'sweetalert2';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import { red, yellow } from '@mui/material/colors';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const TableVehiculos = () => {

    const token = localStorage.getItem('token');

    const [datavehicles, setdatavehicles] = useState([])

    const [editIndex, seteditIndex] = useState(null);
    const [inicialtemp, setinicialtemp] = useState({})

    const traerVehiculos = async () => {
        await axios.get(Url + "vehiculos", {
            headers: {
                Authorization : token
            }
        })
        .then(res => {
            setdatavehicles(res.data.data)
        })
        .catch(err => {
            console.log(err)
            Swal.fire({
                title: "Error",
                text: "Favor de revisar su conexión",
                icon: "error"
              });
        })
    }

    useEffect(() => {
        traerVehiculos()
    },[])

    const handleChangeValue = (event, indexprop) => {
        const updatedDataVehicles = [...datavehicles];
        updatedDataVehicles[indexprop][event.target.name] = event.target.value;
        setdatavehicles(updatedDataVehicles);
    }

    const editChanges = async (indexprop) => {
        setinicialtemp({
            "nombre"    :   datavehicles[indexprop] === undefined ? "" : datavehicles[indexprop].nombre,
            "tipo"      :   datavehicles[indexprop] === undefined ? "" : datavehicles[indexprop].tipo,
            "placas"    :   datavehicles[indexprop] === undefined ? "" : datavehicles[indexprop].placas,
        })

        seteditIndex(indexprop)
    }

    const saveChanges = (indexprop) => {
        if (datavehicles[indexprop].nombre === "" || datavehicles[indexprop].tipo === ""
        || datavehicles[indexprop].placas === "") {
            Swal.fire({
                title: "Error \n No puede haber campos vacíos",
                icon: "error"
              })
        } else {
            if (datavehicles[indexprop].id === undefined) {
                
                axios.post(Url + "vehiculos", datavehicles[indexprop], {
                    headers:{
                        Authorization : token
                    }
                })
                .then(res => {
                    traerVehiculos()
                    seteditIndex(null)
                })
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                        title: "Error",
                        text: "Favor de revisar su conexión",
                        icon: "error"
                      });
                })

            } else {
                const new_Update = {
                    "nombre"    :   datavehicles[indexprop].nombre,
                    "tipo"      :   datavehicles[indexprop].tipo,
                    "placas"    :   datavehicles[indexprop].placas
                }
    
                axios.put(Url + "vehiculos/" + datavehicles[indexprop].id, new_Update, {
                    headers: {
                        Authorization : token
                    }
                })
                .then(res => {
                    traerVehiculos()
                    seteditIndex(null)
                })
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                        title: "Error",
                        text: "Favor de revisar su conexión",
                        icon: "error"
                      });
                })
            }
        }
    }

    const cancelChanges = (indexprop) => {
        if(datavehicles[indexprop].id !== undefined) {
            seteditIndex(null)
        } 
        const originalDataVehicles = [...datavehicles];
        originalDataVehicles[indexprop].nombre = inicialtemp.nombre;
        originalDataVehicles[indexprop].tipo = inicialtemp.tipo;
        originalDataVehicles[indexprop].placas = inicialtemp.placas;
        setdatavehicles(originalDataVehicles);
    }

    const deleteVehicle = (indexprop) => {
        if (datavehicles[indexprop].id === undefined) {
            removevehicle()
        } else {
            Swal.fire({
                title: "Está seguro de eliminar éste Vehículo?",
                icon: "question",  
                showCancelButton: true,
                confirmButtonColor: "#27AE60",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar"
            }).then((result) => {
                if (result.isConfirmed) {
                  axios.delete(Url + "vehiculos/" + datavehicles[indexprop].id, {
                    headers:{
                        Authorization : token
                    }
                  })
                  .then(res => {
                    traerVehiculos()
                  })
                  .catch(err => {
                    console.log(err)
                    Swal.fire({
                        title: "Error",
                        text: "Favor de revisar su conexión",
                        icon: "error"
                      });
                })
                }
              });
        }
    }

    const addvehicle = () => {
        setdatavehicles(prevState => [
            ...prevState,
            {
                "nombre":"",
                "tipo":"",
                "placas":""
            }
          ]);
          editChanges(datavehicles.length)
    }

    const removevehicle = () => {
        setdatavehicles(prevState => prevState.slice(0, -1));
    }

    const styleCell = {
        color: 'white',
        textAlign: "center",
        backgroundColor: "#237f65",
    }

    const styleCellRow = {
        color: 'black',
        textAlign: 'center',
    }

    const styleTextField = {
        "& input": {
            textAlign: "center",
            fontSize: 12.5,
          },
          mb:-1
    }

    return (
        <div className={classNames("TableVehiculos")}>
        <TableContainer>
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        {/*<TableCell sx={styleCell}>Folio</TableCell>*/}
                        <TableCell sx={styleCell}>Nombre</TableCell>
                        <TableCell sx={styleCell}>Tipo</TableCell>
                        <TableCell sx={styleCell}>Placas</TableCell>
                        <TableCell sx={styleCell}></TableCell>
                        <TableCell sx={styleCell}>
                            <Button sx={{border:1, color:"white"}} onClick={addvehicle}
                                startIcon={<AddIcon sx={{color:"white"}} fontSize="small"/>}
                                endIcon={<AirportShuttleIcon sx={{color:"white", ml:-1}}/>}>
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datavehicles.map((vehiculo, index) => (
                        <TableRow key={index}>
                            {/*<TableCell sx={styleCellRow}>{vehiculo.id}</TableCell>*/}
                            <TableCell sx={{...styleCellRow, width:"15%"}}>
                            {editIndex === index ?
                                <TextField variant="standard" size="small" value={vehiculo.nombre}
                                onChange={(e) => handleChangeValue(e, index)} name="nombre"
                                autoComplete='off' sx={styleTextField}/>
                                :
                                vehiculo.nombre
                            }
                            </TableCell>
                            <TableCell sx={{...styleCellRow, width:"20%"}}>                            
                            {editIndex === index ?
                                <TextField variant="standard" size="small" value={vehiculo.tipo}
                                onChange={(e) => handleChangeValue(e, index)} name="tipo"
                                autoComplete='off' sx={styleTextField}/>
                                :
                                vehiculo.tipo
                            }
                            </TableCell>
                            <TableCell sx={{...styleCellRow, width:"15%"}}>                            
                            {editIndex === index ?
                                <TextField variant="standard" size="small" value={vehiculo.placas}
                                onChange={(e) => handleChangeValue(e, index)} name="placas"
                                autoComplete='off' sx={styleTextField}/>
                                :
                                vehiculo.placas
                            }
                            </TableCell>
                            <TableCell sx={styleCellRow}>
                                <div style={{display:"flex", justifyContent:"space-evenly"}}>
                                    <IconButton size="small" sx={{color:yellow[700], border:1}}
                                                onClick={() => editChanges(index)}
                                                disabled={editIndex === index}>
                                        <Tooltip title="Editar" placement="top-end" arrow>
                                            <EditIcon fontSize="small"/>
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton size="small" color="primary" sx={{border:1}}
                                        disabled={editIndex !== index} onClick={() =>saveChanges(index)}>
                                        <Tooltip title="Guardar" placement="top-end" arrow>
                                            <SaveIcon fontSize="small"/>
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton size="small" color="error" sx={{border:1}}
                                        disabled={editIndex !== index} onClick={() => cancelChanges(index)}>
                                        <Tooltip title="Cancelar" placement="top-end" arrow>
                                            <CloseIcon fontSize="small"/>
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton size="small" sx={{color:red[600], border:1}}
                                        //disabled={editIndex === index} 
                                        onClick={() => deleteVehicle(index)}>
                                        <Tooltip title="Eliminar" placement="top-end" arrow>
                                            <DeleteIcon fontSize="small"/>
                                        </Tooltip>
                                    </IconButton>
                                </div>
                            </TableCell>
                            <TableCell sx={{width:0}}></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
}

export default TableVehiculos;