import Main from "../Pantallas/Main"
import LogIn from "../Pantallas/LogIn";
import ReportesEventos from "../Pantallas/ReportesEventos";
import Reportes from "../Pantallas/Reportes";
import Home from "../Pantallas/Home"
import Rutas from "../Pantallas/Rutas"
import MapaReportes from "../Pantallas/MapaReportes";
import NewReporte from "../Pantallas/NewReporte"
import MapaReportesFiltros from '../Pantallas/MapaReportesFiltro';
import TraficoSensores from "../Pantallas/TraficoSensores/TraficoSensores";

//Módulo recorridos
import Recorridos from "../Pantallas/Recorridos";
import MapaRecorridos from "../Pantallas/MapaRecorridos";
import Unauthorized from "../Pantallas/Unauthorized";

//Módulo Dashboard
import Dashboard from "../Pantallas/Dashboard";
import DashboardSupervisores from "../Pantallas/DashboardSupervisores";

// GoogleMaps Test
import GoogleMapsTest from "../Pantallas/GoogleMapsTest";

//Módulo de rutas
import RutasAleatorias from "../Pantallas/Rutas/RutasAleatorias";

import TVehiculos from "../Pantallas/Vehiculos/TVehiculos"; 
import NewUser from "../Pantallas/CrearUsuario/NewUser";
import TInversiones from "../Pantallas/Inversiones/TInversiones";
import TUsuarios from "../Pantallas/Usuarios/TUsuarios";
import TReportesC from "../Pantallas/TReportesC/TReportesC";
import MapGoogleInv from "../Pantallas/MapGoogleInv/MapGoogleInv";
import TReportesA from "../Pantallas/Ayuntamiento/ReportesA.jsx/TReportesA";
import Page_Construction from "../Pantallas/Construction/PageConstruction";
import CensoSemaforos from "../Pantallas/Semáforos/CensoSemáforos/CensoSemaforos";

export const rutas = [
    //Alumbrado Público
    { ruta: '/login', component: <LogIn /> },
    { ruta: '/luminarias', component: <Main />, isPrivate: true },
    { ruta: '/reportes/call', component: <ReportesEventos />},
    
    { ruta: '/reportes', component: <Reportes />},
    { ruta: '/tablaReportes', component: <TReportesC />},
    { ruta: '/ReportesTabla', component: <TReportesA />},

    { ruta: '/creacionreporte', component: <NewReporte /> },
    { ruta: '/recorridos', component: <Recorridos />},
    { ruta: '/mapaRecorridos', component: <MapaRecorridos/>},
    { ruta: '/home', component: <Home />},
    { ruta: '/rutas', component: <Rutas />},
    { ruta: '/reportesmapa', component: <MapaReportes/>},
    { ruta: '/reportesmapafiltros', component: <MapaReportesFiltros/>},
    { ruta: '/dashboard', component: <Dashboard />},
    { ruta: '/dashboardSupervisores', component: <DashboardSupervisores />},
    { ruta: '/vehiculos', component: <TVehiculos />},
    { ruta: '/unauthorized', component: <Unauthorized />},
    { ruta: '/trafico', component: <TraficoSensores />},
    { ruta: '/googlemaps', component: <GoogleMapsTest />},
    { ruta: '/rutasAleatorias', component: <RutasAleatorias />},
    { ruta: '/registro', component: <NewUser /> },
    { ruta: '/inversiones', component: <TInversiones /> },
    { ruta: '/usuarios', component: <TUsuarios /> },
    { ruta: '/mapainversiones', component: <MapGoogleInv /> },

    //Red Semafórica
    { ruta: '/construction', component: <Page_Construction />},
    { ruta: '/censoSemaforos', component: <CensoSemaforos />}
];