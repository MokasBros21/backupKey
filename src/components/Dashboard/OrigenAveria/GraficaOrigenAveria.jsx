import React, {useState} from "react";

//Importanción de la librería de gráficas
import ReactEcharts from "echarts-for-react";

const GraficaOrigenAveria = (props) =>{

  let grafica = <div></div>;

    const obtenerOrigenAveriaIndividualFecha = (array_fechas) =>{
  
        let origenAveriaFechas = []
        array_fechas.map((dataOA) =>( 
          origenAveriaFechas.push(dataOA.created_at)
        ));
        return origenAveriaFechas;
        }
      
        const obtenerOrigenAveriaIndividualValores = (array_valores) =>{
        let origenAveriaValores = []
      
        array_valores.map((dataOA) =>( 
          origenAveriaValores.push(dataOA.count)
        ));
      
        return origenAveriaValores;
        }


    if(props.data != '' && props.tipo != ''){

             //GRÁFICA ORIGEN AVERIA
             let graficaOrigenAveria={
              title: {
                text: props.tipo,
                subtext: 'Origen de averia',
                left: 'center'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
            xAxis: {
              
              type: 'category',
              axisLabel: {
                fontSize: 10
              },
              data: obtenerOrigenAveriaIndividualFecha(props.data),
            },
            yAxis: {
              type: 'value'
            },
            series: [
              { 
                
                data: obtenerOrigenAveriaIndividualValores(props.data),
                type: 'line'
              }
            ]};
            
       grafica = <ReactEcharts option={graficaOrigenAveria} />;
    }

    
    return(
        <>
        <div>{grafica}</div>
        </>
    );
}


export default GraficaOrigenAveria;