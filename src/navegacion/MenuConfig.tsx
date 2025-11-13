export const menuConfig = [
    {
        subtitle: "Desempeño Financiero"
    },
    {
        icon: "receipt-outline",
        label: "Facturación",
        items: [
            { label: "Consolidado Nacional", route: "PowerBIEmbed", nameBD: "facturacionConsolidadoNacional", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMjNkODVlMjEtODc3YS00ZjA2LWI0NmEtNmFjZTgyMzhhMzZkIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Corporativo", route: "PowerBIEmbed", nameBD: "facturacionCorporativo", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiZDQwOWM2OTMtZGE4NC00ZjMwLWIxZTktMjg2NTY2NzVhNmE4IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Implementacion Movil", route: "PowerBIEmbed", nameBD: "facturacionImplementacionMovil", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiZTJiZjA1NjYtMTE0My00OTExLWFiMzUtNDliZmJmOWZhMDQ1IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Mantenimiento", route: "PowerBIEmbed", nameBD: "facturacionMantenimiento", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMmQ5YzIwNzktZTk2OS00YjkxLWEwYjctMzU4MjA2ZGIwYzJkIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Mediciones Movil", route: "PowerBIEmbed", nameBD: "facturacionMedicionesMovil", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOGE2M2MxMjItZDdmNC00NDIzLTg0NDEtY2FjYTJjYjIzZmExIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Mintic", route: "PowerBIEmbed", nameBD: "facturacionMintic", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMjM5OTg2NGMtMThhYS00YmE3LThmMjQtNzkwOTZiYzExYjc4IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Obra Civil Movil", route: "PowerBIEmbed", nameBD: "facturacionObraCivilMovil", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMjNmYjAxOTAtYmE3ZS00ZDI4LWI5NjYtOWI1ODlhZWUyMzRiIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Operaciones", route: "PowerBIEmbed", nameBD: "facturacionOperaciones", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiZDBiMTRiZDgtZTA3Mi00MzIxLWFhYzYtNGI1MzE2NGQ1MWMxIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Proyectos", route: "PowerBIEmbed", nameBD: "facturacionProyectos", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNzUxODY4NjctMTk5Yi00NDZmLWE1OWEtNjVkNjlkYjVjNDk3IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "SMU", route: "PowerBIEmbed", nameBD: "facturacionSmu", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNDE4NGQzN2YtNWY3ZS00ZDY3LTljODAtMDhlNGNkNjExYzQzIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        icon: "trending-up-outline",
        label: "Productividad",
        items: [
            { label: "Corporativo", route: "PowerBIEmbed", nameBD: "productividadCorporativo", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNDMyN2FhMzEtYmYyMy00ZTE4LTg1NjktMDhiYmFmMmYwYmE1IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Enel AP", route: "PowerBIEmbed", nameBD: "productividadEnelAp", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMWVmMDQwMDAtMDgzMC00YjdhLWI2NjgtYjE3OTk2NGNlZWExIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Mantenimiento", route: "PowerBIEmbed", nameBD: "productividadMantenimiento", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiZmU0ZmZjNjctMmFmNS00YjNjLThkMjktZWI5MjBkZWZmM2U2IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Operaciones", route: "PowerBIEmbed", nameBD: "productividadOperaciones", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNmY2YmRmY2QtZWU0NC00OGI3LWFjMjgtZGVmNjE4ODMzZTlhIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Productividad Nacional", route: "PowerBIEmbed", nameBD: "productividadNacional", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiZWJiYTc3Y2MtOTNhMS00Yjk3LWE4OTktMTEzMjY0ZDFkYTYzIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Proyectos", route: "PowerBIEmbed", nameBD: "productividadProyectos", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNmU3ZDU4YWItNzM5MC00YzcxLTlmZmMtZjk0OTMyYzBkNWVmIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Reingenierias", route: "PowerBIEmbed", nameBD: "productividadReingenierias", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOTJiMjhmNDItMzFkZi00Y2ZmLWJiODEtMzc3MjNkMzAxZDQ0IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        icon: "stats-chart-outline",
        label: "Indicadores",
        items: [
            { label: "G1 Mantenimiento", route: "PowerBIEmbed", nameBD: "indicadoresG1Mantenimiento", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMDRmNjE3ODQtMDZkNS00ZWIxLWE3MTQtYzgwNzY3NTJmZmMxIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "G2 - G8 Masivo Centro", route: "PowerBIEmbed", nameBD: "indicadoresG2G8MasivoCentro", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiZjhhZTQ1ZDItZTI4Ny00NGNlLWJjNmItMzZjMzhkMDEwZDhkIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Historico KPI", route: "PowerBIEmbed", nameBD: "indicadoresHistoricoKpi", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiYjUyYjVhYjUtNDMwNC00OGYwLTgzZmItODRiZjFhOTFiZmI3IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "NPS", route: "PowerBIEmbed", nameBD: "indicadoresNps", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNDEyMTA3ZmYtNTZlYi00NDljLTljN2YtZDA0OTljN2EyMzc1IiwidCI6IjE0MDQ0M2FmLThlNzktNGZjZS1iM2VkLWRlMDAxMzEyOTg0ZiIsImMiOjR9" } },
        ]
    },
    {
        subtitle: "Rendimiento Operativo"
    },
    {
        icon: "hammer-outline",
        label: "Operación",
        items: [
            { label: "Atencion AP", route: "PowerBIEmbed", nameBD: "operacionAtencionAP", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiM2M1NWVlMzYtNGNjNS00ODc4LTk0MGYtMmEwMDZhNGUyYzljIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Backlog AP", route: "PowerBIEmbed", nameBD: "operacionBacklogAP", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNDNiY2VjMjktOGM2Yi00YjBkLWE0N2EtMjNiNjI1N2IyMTMyIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Correctivo - Preventivo", route: "PowerBIEmbed", nameBD: "operacionCorrectivoPreventivo", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOTFiYTAxMjgtYjc1Mi00ZmVhLWE3MDUtYzE1Nzc3MzAzOWU4IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9&pageName=ReportSection" } },
            { label: "Cumplimiento SLA FO", route: "PowerBIEmbed", nameBD: "operacionCumplimientoSlaFo", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiYmM0ZTU2NWMtMmFlYi00ZTE1LTlhZTEtNjYyNWM2ZDQ1NzViIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Cumplimiento SLA HFC", route: "PowerBIEmbed", nameBD: "operacionCumplimientoSlaHfc", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiODVkZThmM2ItZmJlZC00NjkyLThkNGUtYjUwZGFhNmNhM2RjIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Enel Cronograma", route: "PowerBIEmbed", nameBD: "operacionEnelCronograma", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMWJlMzRhYTgtYjAzYS00MTU0LTg4OTktMjJmODFkMTFhNTFiIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Operaciones Formacion", route: "PowerBIEmbed", nameBD: "operacionOperacionesFormacion", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiM2JkMWY4OTktMTIxNi00MmRkLWE0NWYtYzg1YzA3ZGIxMjhjIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Recurso Operaciones", route: "PowerBIEmbed", nameBD: "operacionRecursoOperaciones", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOGU1OTU3MmItNjMyMC00MDI1LThkZmEtNjQ0NmMwNDY2M2RiIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Seguimiento Operaciones Centro", route: "PowerBIEmbed", nameBD: "operacionSeguimientoOperacionesCentro", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiZTI1NGRmODctNDY1ZC00ODcyLWIxZDAtOWE1NzE0OTE2NDhhIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Seguimiento Operaciones Norte", route: "PowerBIEmbed", nameBD: "operacionSeguimientoOperacionesNorte", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMmFmYTRiZTAtYzEzYS00N2Y3LTg4MzUtNjc1NDVhYzI3ZmJjIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Seguimiento SMU", route: "PowerBIEmbed", nameBD: "operacionSeguimientoSmu", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiYzUzZTczZDctNzg3NC00YmUxLTkxM2YtYzM5YThjY2RkMzEyIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Técnico SMU", route: "PowerBIEmbed", nameBD: "operacionTecnicoSmu", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiYzliMjkxN2EtNWNhMC00NzU5LTkzYjktOTY5ZmMzOWZiN2Q5IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        icon: "star-outline",
        label: "Puntuación",
        items: [
            { label: "Corporativo", route: "PowerBIEmbed", nameBD: "puntuacionCorporativo", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOGE2MTE1YWMtMzlkMS00YWVjLWFhYjMtZWZhZjNiZTc4Njc5IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9&pageName=ReportSectionb91baa6a7888aad6ade4" } },
            { label: "Enel AP", route: "PowerBIEmbed", nameBD: "puntuacionEnelAp", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOTFlZGZlY2MtNTZlNS00ZjE4LTgzNzgtZGFiNWZjYjVjODliIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Mantenimiento", route: "PowerBIEmbed", nameBD: "puntuacionMantenimiento", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMGFjZTc5NzgtNWZlNi00MTEyLThiZGEtMDcwOGUzZmJmNzZlIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Proyectos", route: "PowerBIEmbed", nameBD: "puntuacionProyectos", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiYWQyZGVjZjktZWZmNC00MDRhLTk5ZjQtYjRkODk3ZmZmMjFmIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9&pageName=ReportSection83c3e8cb60804ee55105" } },
            { label: "Reingenierias", route: "PowerBIEmbed", nameBD: "puntuacionReingenierias", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiM2JlNDY0YzYtYmNjNi00OTMyLThhZWEtZDdjMzY2OGJjZGQxIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        icon: "business-outline",
        label: "Administracion",
        items: [
            { label: "Capacidades", route: "PowerBIEmbed", nameBD: "administracionCapacidades", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMDlmMTM5OGQtMzNiZC00MjM1LWEyN2YtZDQzMzU5YjRmNmE0IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Centro de costos", route: "PowerBIEmbed", nameBD: "administracionCentroDeCostos", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiYThmZTU1YzEtYTVhMy00MWFhLTkyMTMtYzgzMThiZTI0NDY3IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Composicion moviles", route: "PowerBIEmbed", nameBD: "administracionComposicionMoviles", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNzJjNjViMTgtMjYwZi00MTNhLThhMDctYmE3MjFmM2Q5MDQxIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Compras", route: "PowerBIEmbed", nameBD: "administracionCompras", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOWY0ZGEyMjgtY2VmNC00ODM5LTkzZDEtZGY2YWZiNGFjNjlmIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Penalizaciones", route: "PowerBIEmbed", nameBD: "administracionPenalizaciones", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNzZlNDUzODMtZTdlZi00MDdmLTg3NWItMjkyNDZhN2IzYzQ0IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        subtitle: "Cadena de Suministro"
    },
    {
        icon: "cube-outline",
        label: "Logistica",
        items: [
            { label: "Activos", route: "PowerBIEmbed", nameBD: "logisticaActivos", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNDAyMzNjZDItMWZlMS00MGQwLTk4ZDctMTU1NDUxYTFmNDc4IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Criticidad Equipos", route: "PowerBIEmbed", nameBD: "logisticaCriticidadEquipos", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiY2I0MzY2ZWItZTc4Ny00MTRlLTk4ODUtMDA4NWViMGE3MTM0IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Desmonte Mantenimiento", route: "PowerBIEmbed", nameBD: "logisticaDesmonteMantenimiento", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNDNkOTVhNTEtMTI2Ni00OTI1LTgxYzgtNmJjNjA0ODU4NjllIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Enel Control Materiales", route: "PowerBIEmbed", nameBD: "logisticaEnelControlMateriales", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMzlmYzdlYjEtODcyMi00YmRkLWEzMTAtYTMwMDIyMDZhNjE4IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Equipos en moviles", route: "PowerBIEmbed", nameBD: "logisticaEquiposEnMoviles", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiZGEwODc4ZjItNTMyMy00OTMyLWFhNDEtMzk2Y2JkM2ExNjVjIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Estado Proyectos R4", route: "PowerBIEmbed", nameBD: "logisticaEstadoProyectosR4", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOTVjYzEyMDEtNDQ1OC00Nzc5LWIyN2QtNDg5NDJiNmQ3YzgxIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Reporte Sicte", route: "PowerBIEmbed", nameBD: "logisticaReporteSicte", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMGIxNDE2NWQtYzY1ZC00OTg2LWJiMjItY2EwZGJjZmNiZGU5IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        icon: "bus-outline",
        label: "Parque Automotor",
        items: [
            { label: "Gestion Mantenimientos", route: "PowerBIEmbed", nameBD: "parqueAutomotorGestionMantenimientos", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOTRkYWM4N2ItNTUwMi00ZTA1LTg3YTItNjhhMzU4MGUzMGUyIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Moviles", route: "PowerBIEmbed", nameBD: "parqueAutomotorMoviles", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNGZmYWI5MDItZWY1YS00YzZiLTlkN2MtMzNmODMwYjMyMmM4IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Seguimiento", route: "PowerBIEmbed", nameBD: "parqueAutomotorSeguimiento", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiYjA1MGZlMmYtNjViMS00NzI0LWI1NjEtODQ3MzM4YzViMjg1IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        subtitle: "HSEQ"
    },
    {
        icon: "shield-checkmark-outline",
        label: "HSEQ",
        items: [
            { label: "COPASST", route: "PowerBIEmbed", nameBD: "hseqCopasst", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiMGYwZTlhNzMtMGZiMS00YjVhLThlZTgtNDMxYjY2ZjEwYmRiIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Entregas Pendientes Dotacion", route: "PowerBIEmbed", nameBD: "hseqEntregasPendientesDotacion", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiN2NkYWVlZjQtMWQ5Yy00OGMxLThkYmQtYzhiYTUzM2Y3YjlmIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Indicadores Capacitacion", route: "PowerBIEmbed", nameBD: "hseqCursoDeAlturas", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiYzUzY2I0ZGMtNzMyZC00MWZhLThmYzItMGMzMDM0YzUzODc4IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "Inspecciones Enel", route: "PowerBIEmbed", nameBD: "hseqInspeccionesEnel", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiN2YyN2JmM2QtYmViZS00ZmRlLWE1ZmQtN2IyNTdmNGZiYjQ5IiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
            { label: "SSTA", route: "PowerBIEmbed", nameBD: "hseqSsta", params: { url: "https://www.sstasicte.com/" } },
            { label: "Ubicacion de Actividades", route: "PowerBIEmbed", nameBD: "hseqUbicacionDeActividades", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiOGRhMjczN2ItNDVkMC00NjYxLTk3YTUtZGIyM2YxZWMxMzJkIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        icon: "people-outline",
        label: "Gestion humana",
        items: [
            { label: "Indicadores Chatbot", route: "PowerBIEmbed", nameBD: "gestionHumanaIndicadoresChatbot", params: { url: "https://app.powerbi.com/view?r=eyJrIjoiNjM3N2NhZWItNGJlNi00ZjhjLWI3MWMtN2MwZGFiMzJjYTAzIiwidCI6ImUwYmZlOTBkLTIwZTAtNDEwYi1iNmYxLTQyOWIwNDNkMzYwOCJ9" } },
        ]
    },
    {
        subtitle: "Version 3.0.0"
    },
];
