import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ListItemIcon from '@mui/material/ListItemIcon';

import classNames from "classnames";

const Panel = ({closePanel, children, dato, icono, top, width, chip, cronometro, bool}) => {
    
    const style = {
        position: 'absolute',
        //top: '0.5%',
        //left: '0.5%',
        width: {width},
        //height: '91%',
        top: {top},
        bottom: 0,
        bgcolor: 'white',
        boxShadow: '10px 1px 8px -1px rgba(0,0,0,0.3)',
        //p: 1.5,
        overflow: 'auto',
        textAlign:'center',
        zIndex: 1
      };

    return (
        <>       
        <div className={classNames("Panel")}>
            <Box sx={{...style, zIndex:3}}>
                <div style={{
                        display: 'flex',
                        justifyContent:'space-between',
                        alignItems:'center',
                        top: 0,
                        backgroundColor: 'white', 
                        position:'sticky',
                        zIndex: 1,
                        //border: '1px solid #52dab3',
                        boxShadow: '7px 8px 5px 0px rgba(0,0,0,0.1)'
                        }}>
                    <div style={{display:"flex", alignItems:"center"}}>
                        {/*<Typography id="modal-modal-title" variant="h6">
                            <ListItemIcon style={{marginRight:-25}}>
                                {icono}
                            </ListItemIcon>
                            {dato}
                        </Typography>
                        */}

                        <ListItemIcon style={{marginRight:-30, marginLeft:5}}>
                            {icono}
                        </ListItemIcon>
                        
                        <label style={{fontSize:17}}>{dato}</label>
                        
                        <div style={{marginLeft:8}}>
                            {chip}
                        </div>
                        <div style={{marginLeft:8}}>
                            {cronometro}
                        </div>
                        <div style={{marginLeft:8}}>
                            {bool}
                        </div>
                    </div>
                    <div>
                        <button className={classNames("mini circular ui button")}
                            style={{width: 40, backgroundColor: "transparent"}} onClick={closePanel}>
                        <span>X</span> 
                        </button>
                    </div>
                </div>
            <div style={{marginBottom:10, marginTop:10}}/>
            
                {children}

            </Box>
        </div>
        </>
    );
}

export default Panel;