import TableInversiones from '../../components/Tables/Inversiones/TableInversiones';
import MenuModulos from '../../layout/MenuModulos/MenuModulos';
import TopBar from '../../layout/TopBar/TopBar';
import './TInversiones.scss'

const TInversiones = () => {

    return(
        <div className="App_Inversiones">
		<TopBar titulo={"Inversiones"}/>
			<div className="work-area_Inversiones">
				<MenuModulos />
				<TableInversiones/>
			</div>
        </div>
    );
}

export default TInversiones