import MapaRecorrido from '../components/MapaRecorridos/MapaRecorrido';
import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';

import 'semantic-ui-css/semantic.min.css';

const MapaRecorridos = () => {
	return (
		<>
		<div className="App">
		<TopBar titulo={"Ruta del recorrido"}/>
			<div className="work-area">
				<MenuModulos />
				<div style={{width:'100%'}}><MapaRecorrido  /></div>
			</div>
			
			
		</div>
		</>
	);
}

export default MapaRecorridos;