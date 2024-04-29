import { Box, Button, Checkbox, IconButton, ListItemText, MenuItem, Select, TextField } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import './Usuario.scss'
import { useEffect, useState } from "react";
import axios from "axios";

import {Url} from '../../constants/global'
import Swal from "sweetalert2";

const Usuario = () => {

    const token = localStorage.getItem('token');

    const [newuser, setnewuser] = useState({
        "username": null,
        "password": null,
        "password_confirmation": null,
        "nombre": null,
        "ap_paterno": null,
        "ap_materno": null,
        "email": null,
        "telefono": null,
        "genero": null,
        "fecha_nacimiento": null,
        "cp": null,
        "verificado":null,
        "solo_reporte":0,
        "proyectos":[null],
        "roles":[null],
        "supervisor":null
    })
    const [visibility, setvisibility] = useState(false)
    const [visibility2, setvisibility2] = useState(false)

    const [selectproyecto, setselectproyecto] = useState([])
    const [selectroles, setselectroles] = useState([])
    const [selectsups, setselectsups] = useState([])

    /*const [personName, setPersonName] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(Array.from(new Set(value)));
    };*/

    const traerselects = async () => {
        await axios.get(Url + "proyectos", {
            headers: {
                Authorization : token
            }
        })
        .then(res => {
            setselectproyecto(res.data.data)
        })

        await axios.get(Url + "roles", {
            headers: {
                Authorization : token
            }
        })
        .then(res => {
            setselectroles(res.data)
        })

        await axios.get(Url + "users?roles=5", {
            headers: {
                Authorization : token
            }
        })
        .then(res => {
            setselectsups(res.data)
        })
    }

    useEffect(() => {
        traerselects()
    },[])

    const cargarFormNuevo = () => {
        setnewuser({
            "password": null,
            "password_confirmation": null,
            "nombre": null,
            "ap_paterno": null,
            "ap_materno": null,
            "email": null,
            "telefono": null,
            "genero": null,
            "fecha_nacimiento": null,
            "cp": null,
            "verificado":null,
            "solo_reporte":0,
            "proyectos":[null],
            "roles":[null],
            "supervisor":null
        })
    }

    const handleChangeForm = (event) => {
        setnewuser(oldValues => 
            ({...oldValues,
                [event.target.name] : event.target.value
            })
        )
    }

    const handleChangeSelect = (event) => {

        if (event.target.name === "proyectos") {
            axios.get(Url + "users?proyecto="+event.target.value+"&roles=5", {
                headers: {
                    Authorization : token
                }
            })
            .then(res => {
                setselectsups(res.data)
            })
            .catch(err => console.log(err))
        }

        setnewuser(oldValues => 
            ({...oldValues,
                [event.target.name] : [event.target.value]
            })
        )
    }

    function solonumeros (e) {
        const key = e.keyCode
        return (key >= 48 && key <= 57) || [8,16,35,36,37,38,39,40].includes(key);
    }

    const handleOnPressKey = (event) => {
        if(!solonumeros(event)){
            event.preventDefault()
        }
    }

    const savealluser = () => {
        axios.post(Url + "register", newuser,{
            headers:{
                Authorization:token
            }
        })
        .then(res => {
            Swal.fire({
                title: "Registrado Exitosamente",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    cargarFormNuevo()
                }
              });

            cargarFormNuevo()
        })
        .catch(err => {
            Swal.fire({
                title: "Error en la Operación",
                text: "Favor de verificar los datos",
                icon: "error"
              });
            console.log(err)
        })
    }

    const style = {
        input:{
            color:"white",
        },
        borderBottom: "1px solid white"
    }
    
    return (
        <div className="PantallaPrincipal">
            <Box sx={{m:1, border:"2px solid #14FFDB", p:2}}>
                <h2 style={{color:"white", textAlign:"left", padding:0}}>Usuario</h2>
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div className="caja">
                        <label>Contraseña:</label>
                        <TextField variant="standard" sx={style} autoComplete="off" name="password"
                            type={!visibility ? "password" : "text"} value={newuser.password || ""} 
                            onChange={handleChangeForm} 
                            InputProps={{endAdornment:(<IconButton sx={{color:"white"}} size="small"
                                                        onMouseDown={() => setvisibility(true)}
                                                        onMouseUp={() => setvisibility(false)}>
                                                            {!visibility ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                                        </IconButton>)}}
                        />
                    </div>

                    <div className="caja">
                        <label>Confirmar Contraseña:</label>
                        <TextField variant="standard" sx={style} autoComplete="off" name="password_confirmation"
                            type={!visibility2 ? "password" : "text"} value={newuser.password_confirmation || ""} 
                            onChange={handleChangeForm} 
                            InputProps={{endAdornment:(<IconButton sx={{color:"white"}} size="small"
                                                        onMouseDown={() => setvisibility2(true)}
                                                        onMouseUp={() => setvisibility2(false)}>
                                                            {!visibility2 ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                                        </IconButton>)}}
                        />
                    </div>
                </Box>
            </Box>
            <Box sx={{m:1, border:"2px solid #14FFDB", p:2}}>
                <h2 style={{color:"white", textAlign:"left", padding:0}}>Datos Personales</h2>
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", mb:3}}>
                    <div className="caja">
                        <label>Nombre:</label>
                        <TextField variant="standard" sx={style} autoComplete="off" name="nombre"
                            value={newuser.nombre || ""} onChange={handleChangeForm}
                        />
                    </div>

                    <div className="caja">
                        <label>Primer Apellido:</label>
                        <TextField variant="standard" sx={style} autoComplete="off" name="ap_paterno"
                            value={newuser.ap_paterno || ""} onChange={handleChangeForm} 
                        />
                    </div>

                    <div className="caja">
                        <label>Segundo Apellido:</label>
                        <TextField variant="standard" sx={style} autoComplete="off" name="ap_materno"
                            value={newuser.ap_materno || ""} onChange={handleChangeForm} 
                        />
                    </div>
                </Box>
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", mb:3}}>
                    <div className="caja">
                        <label>E-Mail:</label>
                        <TextField variant="standard" sx={style} autoComplete="off" name="email"
                            value={newuser.email || ""} onChange={handleChangeForm} type="email"
                        />
                    </div>

                    <div className="caja">
                        <label>Teléfono:</label>
                        <TextField variant="standard" sx={style} autoComplete="off" name="telefono"
                            value={newuser.telefono || ""} onChange={handleChangeForm} 
                            onKeyDownCapture={handleOnPressKey} inputProps={{ maxLength: 10 }}
                        />
                    </div>

                    <div className="caja">
                        <label>Género:</label>
                        <Select
                            variant="standard"
                            sx={{...style, color:"white", width:170, textAlign:"center",
                            backgroundColor:"rgba(11,21,34,1)", borderRadius:1}}
                            value={newuser.genero || " "}
                            name="genero"
                            onChange={handleChangeForm}
                        >
                            <MenuItem value={" "} disabled>-Seleccione-</MenuItem>
                            <MenuItem value={"M"}>Masculino</MenuItem>
                            <MenuItem value={"F"}>Femenino</MenuItem>
                        </Select>
                    </div>
                </Box>
                <Box sx={{display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                    <div className="caja">
                        <label>Fecha Nacimiento:</label>
                        <TextField variant="standard" autoComplete="off" name="fecha_nacimiento" type="date"
                        sx={{...style, borderBottom:"2px solid white"}}                             
                            value={newuser.fecha_nacimiento || ""} onChange={handleChangeForm}
                        />
                    </div>

                    <div className="caja">
                        <label>Código Postal:</label>
                        <TextField variant="standard" sx={style} autoComplete="off" name="cp"
                        value={newuser.cp || ""} onChange={handleChangeForm}
                        onKeyDownCapture={handleOnPressKey} inputProps={{ maxLength: 5 }}
                        />
                    </div>
                </Box>
            </Box>
            <Box sx={{m:1, border:"2px solid #14FFDB", p:2}}>
                <h2 style={{color:"white", textAlign:"left", padding:0}}>Permisos</h2>
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div className="caja">
                        <label>Proyecto:</label>
                        <Select
                            variant="standard"
                            sx={{...style, color:"white", width:170, textAlign:"center"}}
                            value={newuser.proyectos[0] === null ? " " : newuser.proyectos[0]}
                            name="proyectos"
                            onChange={handleChangeSelect}
                        >
                            <MenuItem value={" "} disabled>-Seleccione-</MenuItem>
                            {selectproyecto.map((proyecto, index) => (
                                <MenuItem key={index} value={proyecto.id}>
                                    {proyecto.nombre_interno}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    <div className="caja">
                        <label>Rol:</label>
                        <Select
                            variant="standard"
                            sx={{...style, color:"white", width:170, textAlign:"center"}}
                            MenuProps={{style:{maxHeight:"300px"}}}
                            value={newuser.roles[0] === null ? " " : newuser.roles[0]}
                            name="roles"
                            onChange={handleChangeSelect}
                        >
                            <MenuItem value={" "} disabled>-Seleccione-</MenuItem>
                            {selectroles.map((rol, index) => (
                                <MenuItem key={index} value={rol.id}>
                                    {rol.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    {/*
                    <div className="caja">
                        <label>Proyectos:</label>
                        <Select
                            multiple
                            variant="standard"
                            sx={{...style, color:"white", width:170, textAlign:"center"}}
                            value={personName.map(id => id)}
                            onChange={handleChange}
                            renderValue={(selected) => selected.map(id => selectproyecto.find(proyecto => proyecto.id === id).nombre).join(', ')}
                        >
                        {selectproyecto.map((proyecto, index) => (
                            <MenuItem key={index} value={proyecto.id}>
                                <Checkbox checked={personName.indexOf(proyecto.id) > -1} />
                                <ListItemText primary={proyecto.nombre} />
                            </MenuItem>
                        ))}
                        </Select>
                    </div>
                    */}

                    <div className="caja">
                        <label style={{backgroundColor:"rgba(11,21,34,.9)", color:"white", marginRight:"6px",
                                    marginBottom:-1.5, fontWeight:"bold", width:78, borderRadius:15}}>
                            Supervisor:</label>
                        <Select
                            variant="standard"
                            sx={{...style, color:"white", width:170, textAlign:"center",
                            backgroundColor:"rgba(11,21,34,1)", borderRadius:1}}
                            MenuProps={{style:{maxHeight:"300px"}}}
                            value={newuser.supervisor || " "}
                            name="supervisor"
                            onChange={handleChangeForm}
                        >
                            <MenuItem value={" "} disabled>-Seleccione-</MenuItem>
                            {selectsups.map((sup, index) => (
                                
                                <MenuItem key={index} value={sup.id}>
                                    {sup.nombre_completo}
                                </MenuItem>
                                
                            ))}
                        </Select>
                    </div>
                </Box>
            </Box>

            <Box sx={{width:"100%", display:"flex", justifyContent:"end", pr:1}}>

                <Button sx={{color:"white", border:"1px solid white", mb:2,
                            backgroundColor:"#0F3843",'&:hover': {backgroundColor: '#0F3843',color: "white"}}}
                    endIcon={<SaveIcon />} size="large" onClick={savealluser}
                    >
                    GUARDAR</Button>
            </Box>
        </div>
    );
}

export default Usuario;