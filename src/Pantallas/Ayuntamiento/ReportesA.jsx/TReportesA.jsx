import TableReportesAyuntamiento from '../../../components/Tables/Reportes/TableReportesAyuntamiento';
import MenuModulos from '../../../layout/MenuModulos/MenuModulos';
import TopBar from '../../../layout/TopBar/TopBar';
import './TReportesA.scss'

const TReportesA = () => {

    return(
        <div className="App_ReportesC">
		<TopBar titulo={"Reportes"}/>
			<div className="work-area_ReportesC">
				<MenuModulos />
				<TableReportesAyuntamiento/>
			</div>
        </div>
    );
}

export default TReportesA