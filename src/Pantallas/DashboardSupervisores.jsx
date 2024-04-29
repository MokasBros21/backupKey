import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';
import PanelPrincipal from '../components/Dashboard/Supervisores/PanelPrincipal';

import './ReportesEventos.scss';
import 'semantic-ui-css/semantic.min.css'

const IndicadoresSupervisores = () => {
	return (
		<>
		<div className="App">
		<TopBar titulo={"Indicadores de operativos"}/>
			<div className="work-area">
				
				<MenuModulos/>
			   <div className='dimensiones'><PanelPrincipal/></div>
			</div>
		</div>
		</>
	);
}

export default IndicadoresSupervisores;