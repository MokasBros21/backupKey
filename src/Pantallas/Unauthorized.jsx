import { Box, Button } from "@mui/material";
import Restrinct from "../assets/bloquear-pagina-web.png"
import './Unauthorized.scss'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useNavigate} from "react-router-dom";

const Unauthorized = () => {

    const Navigate = useNavigate();

    const returnmain = () => {
        Navigate("/home")
    }

    return(
        <div className="Unauthorized">
            <Box sx={{position:"absolute", right:"3%", display:"flex", alignItems:"center"}}>
                <Button sx={{color:"white"}} endIcon={<KeyboardReturnIcon sx={{color:"white"}}/>}
                onClick={returnmain}>
                    Regresar
                </Button>
            </Box>


            <h1 style={{color:"white"}}>Sin Permisos para la página</h1>
            <img src={Restrinct} alt="Sin Permisos.jpg" height="80%"></img>
        </div>
    );
}

export default Unauthorized