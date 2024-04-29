import Map from '../components/Map/Map';
import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';

import './Main.scss';
import 'semantic-ui-css/semantic.min.css'

const Main = () => {

	//localStorage.setItem('token', token);

	return (
		<div className="App">
			<TopBar titulo={"Luminarias"}/>
			<div className="work-area">
				<MenuModulos />
				<Map />
			</div>
		</div>
	);
}

export default Main;
