import MenuModulos from '../../layout/MenuModulos/MenuModulos';
import TopBar from '../../layout/TopBar/TopBar';
import ImageConstruction from '../../assets/Page_Construction.png'

import './PageConstruction.scss';
//import 'semantic-ui-css/semantic.min.css'

const Page_Construction = () => {
	return (
		<>
		<div className="AppConstruction">
		<TopBar/>
			<div className="work-areaConstruction">
				<MenuModulos />
				<div className="Construction">
                    <img src={ImageConstruction} alt='Imagen Construccion' 
                    style={{width:"80%", height:"calc(100vh - 100px)", marginTop:10}}
                    />
                </div>
			</div>
		</div>
		</>
	);
}

export default Page_Construction;