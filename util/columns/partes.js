module.exports = {
    parteColumns: [
        {
            "id": "Id",
            "numeric": false,
            "disablePadding": true,
            "label": "Id",
            "width": 10,
            "show": true,
            "placeHolder": "#",
            "type": "number",//text, number, date, select, none
            "search":null
        },
        {
            "id": "numero_reporte",
            "numeric": false,
            "disablePadding": true,
            "label": "Número de Reporte",
            "width": 90,
            "show": true,
            "placeHolder": "#",
            "type": "text",
            "search":null
        },
        {
            "id": "tag",
            "numeric": false,
            "disablePadding": false,
            "label": "TAG Equipo",
            "width": 90,
            "show": true,
            "placeHolder": "#",
            "type": "text",
            "search":null
        },
        {
            "id": "tag_detalle",
            "numeric": false,
            "disablePadding": false,
            "label": "Descripción Equipo",
            "width": 300,
            "show": false,
            "placeHolder": "#",
            "type": "text",
            "search":null
        },
        {
            "id": "items[0].descripcion_servicio",
            "numeric": false,
            "disablePadding": true,
            "label": "Descripción del Servicio",
            "width": 350,
            "show": true,
            "placeHolder": "Servicio",
            "type": "text",
            "search":null
        },
        {
            "id": "items[0].cantidad",
            "numeric": true,
            "disablePadding": false,
            "label": "Cantidad",
            "width": 60,
            "show": true,
            "placeHolder": "#",
            "type": "text",
            "search":null
        },
        {
            "id": "items[0].tipo_actividad",
            "numeric": false,
            "disablePadding": true,
            "label": "Tipo de Actividad",
            "width": 70,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "items[0].clase",
            "numeric": false,
            "disablePadding": true,
            "label": "Clase de Actividad",
            "width": 70,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "operador[0].nombre",
            "numeric": false,
            "disablePadding": true,
            "label": "Operador",
            "width": 150,
            "show": false,
            "placeHolder": "Operador",
            "type": "text",
            "search":null
        },
        {
            "id": "numero_orden",
            "numeric": false,
            "disablePadding": false,
            "label": "Número Orden",
            "width": 120,
            "show": false,
            "placeHolder": "#",
            "type": "text",
            "search":null
        },
        {
            "id": "cliente[0].nombre",
            "numeric": false,
            "disablePadding": true,
            "label": "Cliente",
            "width": 120,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "contrato[0].nombre",
            "numeric": false,
            "disablePadding": false,
            "label": "Contrato",
            "width": 160,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "unidad",
            "numeric": false,
            "disablePadding": true,
            "label": "Unidad",
            "width": 120,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "fecha_carga",
            "numeric": false,
            "disablePadding": false,
            "label": "Fecha Carga",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "date",
            "search":null
        },
        {
            "id": "semana_carga",
            "numeric": false,
            "disablePadding": false,
            "label": "Semana Carga",
            "width": 100,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "fecha_inspeccion",
            "numeric": false,
            "disablePadding": false,
            "label": "Fecha Inspeccion",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "date",
            "search":null
        },
        {
            "id": "AAMM_inspeccion",
            "numeric": false,
            "disablePadding": false,
            "label": "AA/MM Inspeccion",
            "width": 100,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "AAsem_inspeccion",
            "numeric": false,
            "disablePadding": false,
            "label": "AA/sem Inspeccion",
            "width": 100,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "semana_inspeccion",
            "numeric": false,
            "disablePadding": false,
            "label": "Semana Inspección",
            "width": 80,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "trabajo_terminado",
            "numeric": false,
            "disablePadding": false,
            "label": "Trabajo Terminado",
            "width": 90,
            "show": false,
            "placeHolder": "-",
            "type": "select",
            "search":null
        },
        {
            "id": "trabajo_terminado_fecha",
            "numeric": false,
            "disablePadding": false,
            "label": "Fecha Trabajo Terminado",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "date",
            "search":null
        },
        {
            "id": "informe_realizado",
            "numeric": false,
            "disablePadding": false,
            "label": "Informe Realizado",
            "width": 90,
            "show": false,
            "placeHolder": "-",
            "type": "select",
            "search":null
        },
        {
            "id": "informe_realizado_fecha",
            "numeric": false,
            "disablePadding": false,
            "label": "Fecha Informe",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "date",
            "search":null
        },
        {
            "id": "informe_revisado",
            "numeric": false,
            "disablePadding": false,
            "label": "Informe Revisado",
            "width": 90,
            "show": false,
            "placeHolder": "-",
            "type": "select",
            "search":null
        },
        {
            "id": "informe_revisado_fecha",
            "numeric": false,
            "disablePadding": false,
            "label": "Fecha Informe Revisado",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "date",
            "search":null
        },
        {
            "id": "remito_realizado",
            "numeric": false,
            "disablePadding": false,
            "label": "Remito Realizado",
            "width": 90,
            "show": false,
            "placeHolder": "-",
            "type": "select",
            "search":null
        },
        {
            "id": "remito_numero",
            "numeric": false,
            "disablePadding": false,
            "label": "Número Remito",
            "width": 90,
            "show": false,
            "placeHolder": "-",
            "type": "number",
            "search":null
        },
        {
            "id": "remito_realizado_fecha",
            "numeric": false,
            "disablePadding": false,
            "label": "Fecha Remito",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "date",
            "search":null
        },
        {
            "id": "certificado_realizado",
            "numeric": false,
            "disablePadding": false,
            "label": "Certificado Realizado",
            "width": 90,
            "show": false,
            "placeHolder": "-",
            "type": "select",
            "search":null
        },
        {
            "id": "certificado_fecha",
            "numeric": false,
            "disablePadding": false,
            "label": "Certificado Fecha",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "date",
            "search":null
        },
        {
            "id": "certificante",
            "numeric": false,
            "disablePadding": true,
            "label": "Certificante",
            "width": 200,
            "show": false,
            "placeHolder": "-",
            "type": "text",//text, number, date, select, none
            "search": null
        },
        {
            "id": "items[0].codigo_servicio",
            "numeric": false,
            "disablePadding": false,
            "label": "Ítem Contrato",
            "width": 110,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "archivo",
            "numeric": false,
            "disablePadding": false,
            "label": "Archivo",
            "width": 220,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "observaciones",
            "numeric": false,
            "disablePadding": false,
            "label": "Observaciones",
            "width": 300,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "paga[0].nombre",
            "numeric": false,
            "disablePadding": false,
            "label": "Paga",
            "width": 150,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "modificado",
            "numeric": false,
            "disablePadding": false,
            "label": "Modificado",
            "width": 90,
            "show": false,
            "placeHolder": "-",
            "type": "select",
            "search":null
        },
        {
            "id": "modificado_nombre",
            "numeric": false,
            "disablePadding": false,
            "label": "Modificado por",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "modificado_fecha",
            "numeric": false,
            "disablePadding": false,
            "label": "Modificado Fecha",
            "width": 190,
            "show": false,
            "placeHolder": "-",
            "type": "date",
            "search":null
        }
    ]
}



