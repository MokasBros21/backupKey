import { IconButton, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import './TableUsuarios.scss'
import { Url } from '../../../constants/global';
import Table0 from '../../../assets/Table0.jpg';
import LoaderIndicator from '../../../layout/LoaderIndicator/LoaderIndicator';
import Swal from 'sweetalert2';


const TableUsers = () => {

    const token = localStorage.getItem('token');
    const id_proyect = localStorage.getItem('id_proyecto')
    const userstorage = JSON.parse(localStorage.getItem('user_datos'));

    const [dataUsers, setdataUsers] = useState([])
    const [selectsup, setselectsup] = useState([])
    const [totalUser, settotalUsers] = useState(0)
    const [isCharging, setisCharging] = useState(false)

    const [editIndex, seteditIndex] = useState(null)
    const [dataUsernoChange, setdataUsernoChange] = useState({})

    const allUsers = async () => {
        setisCharging(true)

        var UrlCarga = "";

        if (userstorage.rol === 3) {
            UrlCarga = Url + "users?proyecto="+id_proyect
        }else{
            UrlCarga = Url + "users?roles=6,10&proyecto="+id_proyect
        }

        await axios.get(UrlCarga, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataUsers(res.data)
            settotalUsers(res.data.length)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
        })
    }

    const traerSup = async () => {
        await axios.get(Url + "users?roles=5&proyecto="+id_proyect, {
            headers: {
                Authorization : token
            }
        })
        .then(res => {
            setselectsup(res.data)
        })
    }

    useEffect(() => {
        traerSup()
        allUsers()
    },[])

    const handleChangeUpdate = (event) => {
        const name = event.target.name
        const value = event.target.value

        // Obtener una copia del array dataUsers
        const newDataUsers = [...dataUsers];

        // Actualizar el elemento en la posición editIndex
        newDataUsers[editIndex] = {
        ...newDataUsers[editIndex], // Mantener las propiedades existentes del elemento
        [name]: value // Actualizar la propiedad especificada con el nuevo valor
        };

        // Llamar a setdataUsers para actualizar el estado
        setdataUsers(newDataUsers);
    }

    const startChange = (index) => {
        if (index !== editIndex) {
            cancelChange()
        }

        seteditIndex(index)
        setdataUsernoChange(dataUsers[index])
    }

    const cancelChange = () => {
        seteditIndex(null)
        const newDataUsers = [...dataUsers];
        newDataUsers[editIndex] = dataUsernoChange;
        setdataUsers(newDataUsers);
    }

    const saveChange = () => {
        const newDates = {};

        if (dataUsernoChange.telefono !== dataUsers[editIndex].telefono) {
            newDates.telefono = dataUsers[editIndex].telefono
        }

        if (dataUsernoChange.email !== dataUsers[editIndex].email) {
            newDates.email = dataUsers[editIndex].email
        }

        if (dataUsernoChange.supervisor !== dataUsers[editIndex].supervisor) {
            newDates.supervisor = 
            dataUsers[editIndex].supervisor === "Sin Supervisor" ? null : dataUsers[editIndex].supervisor
        }
        const idUser = dataUsers[editIndex].id || -1

        console.log(newDates)

        axios.put(Url + "users/"+ idUser, newDates,{
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            allUsers()
            seteditIndex(null)
            Swal.fire({
                title: "Actualizado con éxito",
                icon: "success"
            });
        })
        .catch(err => {
            console.log(err)
            Swal.fire({
                title: "Error",
                text: err.response.data.messages,
                icon: "error"
            });
        })
    }

    const DeleteUser = (index) => {
        const nameUser = dataUsers[index].nombre_completo || "Sin Registro";
        const idUser = dataUsers[index].id || -1

        Swal.fire({
            title: "Estás seguro de eliminar al usuario "+nameUser+"?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#28B463",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar"
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(Url + "users/" + idUser, {
                    headers:{
                        Authorization : token
                    }
                })
                .then(res => {
                    allUsers()
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El Usuario ha sido eliminado",
                        icon: "success"
                    });
                })
                .catch(err => {
                    console.log(err)
                })

            }
          });
    }

    const styleCellHead = {
        color: 'white',
        textAlign: "center",
        backgroundColor: "#237f65",
    }

    const styleCellBody = {
        color: 'black',
        textAlign: 'center',
    }

    return (
        <div className='TableUsers'>
        <TableContainer>
            <Table stickyHeader size='small' sx={{
                            "& .MuiTableRow-root:hover": {
                                backgroundColor: "#A2D9CE"
                                }
                            }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={styleCellHead}>Folio</TableCell>
                        {userstorage.rol === 3 &&
                        <TableCell sx={styleCellHead}>E - Mail</TableCell>
                        }
                        <TableCell sx={styleCellHead}>Nombre Completo</TableCell>
                        {userstorage.rol === 3 &&
                        <TableCell sx={styleCellHead}>Teléfono</TableCell>
                        }
                        <TableCell sx={styleCellHead}>Supervisor</TableCell>
                        <TableCell sx={styleCellHead}></TableCell>
                    </TableRow>
                </TableHead>
                {totalUser > 0 &&
                    <TableBody>
                        {dataUsers.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell sx={styleCellBody}>{user.id}</TableCell>
                                {userstorage.rol === 3 &&
                                    <TableCell sx={styleCellBody}>
                                    {editIndex === index ?
                                        <TextField variant='standard' value={user.email} 
                                        name='email' autoComplete='off' sx={{width:"80%"}}
                                        inputProps={{style:{textAlign:"center", fontSize:12, padding:0.5}}}
                                        onChange={handleChangeUpdate}/>
                                        :
                                        user.email
                                    }
                                    </TableCell>
                                }
                                <TableCell sx={styleCellBody}>{user.nombre_completo}</TableCell>
                                {userstorage.rol === 3 &&
                                    <TableCell sx={styleCellBody}>
                                    {editIndex === index ?
                                        <TextField variant='standard' value={user.telefono} 
                                        name='telefono' autoComplete='off' sx={{width:"80%"}}
                                        inputProps={{style:{textAlign:"center", fontSize:12, padding:0.5},
                                        maxLength: 10}}
                                        onChange={handleChangeUpdate}/>
                                        :
                                        user.telefono
                                    }
                                    </TableCell>
                                }
                                <TableCell sx={styleCellBody}>
                                    <Select
                                        variant='standard'
                                        sx={{width:175, fontSize:12}}
                                        onClose={() => {
                                            setTimeout(() => {
                                            document.activeElement.blur();
                                            }, 0);
                                        }}
                                        value={(user.supervisor === null || user.supervisor === "") ? 
                                                "Sin Supervisor" : user.supervisor}
                                        name='supervisor'
                                        onChange={handleChangeUpdate}
                                        disabled={editIndex !== index}
                                    >
                                    <MenuItem value={"Sin Supervisor"}>Sin Supervisor</MenuItem>
                                    {selectsup.map((sup, index) => (
                                        <MenuItem value={sup.id} key={index}>
                                            {sup.nombre_completo}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </TableCell>
                                <TableCell sx={{textAlign:"center", display:"flex", justifyContent:"space-evenly"}}>
                                    <IconButton color="warning" sx={{border:"1px solid #F3CD33"}} size='small'
                                        onClick={() => startChange(index)}>
                                            <EditIcon fontSize='small' sx={{color: "#F3CD33"}}/>
                                    </IconButton>

                                    {editIndex === index &&
                                    <IconButton color="error" sx={{border:"1px solid"}} size='small'
                                    onClick={cancelChange}>
                                        <CloseIcon fontSize='small' />
                                    </IconButton>
                                    }

                                    {editIndex === index &&
                                    <IconButton color="primary" sx={{border:"1px solid"}} size='small'
                                    onClick={saveChange}>
                                        <SaveIcon fontSize='small' />
                                    </IconButton>
                                    }

                                    {(editIndex !== index && userstorage.rol === 3) &&
                                    <IconButton color="error" sx={{border:"1px solid"}} size='small'
                                    onClick={() => DeleteUser(index)}>
                                        <DeleteForeverIcon fontSize='small' />
                                    </IconButton>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                }
            </Table>
        </TableContainer>

        {totalUser === 0 &&
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
                <img src={Table0} alt="Searching..." height={300} width={400} style={{marginTop:"5%"}}/>
                <h3 style={{marginTop:"-3%", color:"#dce4f7"}}>Sin Registros</h3>
            </div>
        }

        <footer className={"footerTableUsers"}>
                    Total de Registros: {totalUser}
        </footer>

        {isCharging && <LoaderIndicator />}
        </div>
    );
}

export default TableUsers;