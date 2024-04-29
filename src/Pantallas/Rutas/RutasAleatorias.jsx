import MenuModulos from '../../layout/MenuModulos/MenuModulos';
import TopBar from '../../layout/TopBar/TopBar';
import Ruta from '../../components/Rutas/Ruta';
import '../ReportesEventos.scss';
import 'semantic-ui-css/semantic.min.css'

const RutasAleatorias = () => {
	return (
		<>
		<div className="App">
		<TopBar titulo={"Rutas"}/>
			<div className="work-area">
				
				<MenuModulos/>
                <Ruta/>
			   
			</div>
		</div>
		</>
	);
}

export default RutasAleatorias;