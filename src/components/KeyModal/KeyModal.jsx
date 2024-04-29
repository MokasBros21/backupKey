import React from "react";
import {  Modal } from "@mui/material";
import { Button } from "@mui/material";

import "./KeyModal.scss";

const KeyModal = ({
    open,
    onClose,
    title,
    children,
    width,
    height
}) => {

    return(
        <Modal
            open={open}
            onClose={onClose} 
            className="ModalContainer"
            >
            <div className="KeyModal" style={{ width: ( width? width+'%': "auto") }}>
                <div className="modal-title">
                    <span className="modal-title-text">{ title || "Keycity" }</span>
                    
                        <Button onClick={onClose} variant="outlined" color="error" size="small">
                            X
                        </Button>
                    
                </div>
                <div className="modal-body" style={{ height: ( height? height+'vh': "auto") }}>
                    {children}
                </div>
                
            </div>
        </Modal>
    );
}

export default KeyModal;