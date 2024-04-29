import React, { useEffect,} from "react";

//Tarjetas de la cabecera
import Box from '@mui/material/Box';

//SCSS
import '../Dashboard.scss';

//TABS
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


//DASHBOARDS
import Terminados from "./Terminados";
import EnProceso from "./EnProceso";

const PanelPrincipal = () =>{

  
  //Tabs
  const [tabValue, setTabValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };


    return(

         

       <div>
         <Box sx={{ flexGrow: 1 }} >

          <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Reportes finalizados - Terminados" value="1" />
              <Tab label="Reportes Abiertos" value="2" />

            </TabList>
          </Box>
          <TabPanel value="1">
            <Terminados/>
          </TabPanel>

          <TabPanel value="2">
            <EnProceso/>
          </TabPanel>

          </TabContext>
          </Box>
       </div>
        
    );

        }


export default PanelPrincipal;