
import type { Contract } from '@/types/legacy';

export const initialContractData: Contract[] = [
    {
        id: "split-sheet-acuerdo-de-coautoria",
        title: "Split Sheet: Acuerdo de Coautoría",
        tags: "música, colaboración, bilingüe",
        category: "música, colaboración",
        type: "Plantilla",
        status: "Borrador",
        mins: "5",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://placehold.co/400x225.png",
        desc: "Define porcentajes de autoría y administración de forma clara. Incluye cláusulas de créditos y regalías.",
        shortDesc: "Ideal para sesiones. Establece porcentajes, administración y créditos en minutos.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "licencia-de-uso-de-obra-sincronizacion",
        title: "Licencia de Uso de Obra: Sincronización",
        tags: "licencias, sincronización, pro, bilingüe",
        category: "licencias",
        type: "Contrato",
        status: "Completado",
        mins: "7",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://placehold.co/400x225.png",
        desc: "Autoriza el uso audiovisual de una obra musical en películas, anuncios o series. Incluye campos de territorio, plazo y medios.",
        shortDesc: "Cubre medios, exclusividad y reportes. Pensado para productoras, sellos y creadores.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "contrato-de-artista-en-vivo",
        title: "Contrato de Artista en Vivo",
        tags: "eventos, performance, artista",
        category: "eventos",
        type: "Contrato",
        status: "Pendiente",
        mins: "6",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/jean1.png?alt=media&token=b54755a8-0876-4daf-ab49-9dfb3857eeb7",
        desc: "Asegura logística, pagos, backline y cancelaciones para presentaciones en vivo. Incluye riders y penalizaciones.",
        shortDesc: "Protege a artista y contratante. Claridad en pagos, horarios y condiciones técnicas.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "acuerdo-de-distribucion-digital",
        title: "Acuerdo de Distribución Digital",
        tags: "distribución, plataformas, regalías, pro",
        category: "distribución",
        type: "Contrato",
        status: "Borrador",
        mins: "8",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://placehold.co/400x225.png",
        desc: "Estructura comisiones, territorios, ventanas de lanzamiento y reportes con agregadores o sellos.",
        shortDesc: "Define split de regalías, auditorías y derechos de catálogo para releases.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "contrato-de-manager-de-artista",
        title: "Contrato de Manager de Artista",
        tags: "management, comisión, representación, pro",
        category: "management",
        type: "Contrato",
        status: "Completado",
        mins: "10",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://placehold.co/400x225.png",
        desc: "Define alcance de representación, comisiones, exclusividad y terminación con managers o agencias.",
        shortDesc: "Incluye nivel de comisión por áreas, sunset clause y gastos reembolsables.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "contrato-de-produccion-musical",
        title: "Contrato de Producción Musical",
        tags: "música, producción, obra por encargo",
        category: "música",
        type: "Contrato",
        status: "Borrador",
        mins: "9",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://placehold.co/400x225.png",
        desc: "Alinea entregables, propiedad intelectual y pagos por hitos con productores y artistas.",
        shortDesc: "Incluye obra por encargo, stems, revisiones y créditos de productor.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "cesion-de-derechos-publishing",
        title: "Cesión de Derechos (Publishing)",
        tags: "publishing, licencias, edición, pro",
        category: "licencias",
        type: "Contrato",
        status: "Pendiente",
        mins: "11",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/img6.jpg?alt=media&token=8d5c0dd4-dc3d-4d48-871d-66e738b7b32b",
        desc: "Formaliza la cesión total o parcial de derechos editoriales con cláusulas de reversion y reportes.",
        shortDesc: "Modelo para works for hire, participación y subedición con límites claros.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "acuerdo-de-colaboracion-entre-artistas",
        title: "Acuerdo de Colaboración entre Artistas",
        tags: "colaboración, música, derechos",
        category: "colaboración",
        type: "Plantilla",
        status: "Completado",
        mins: "4",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://placehold.co/400x225.png",
        desc: "Define aportes creativos, splits de master y publishing, y autorizaciones de lanzamiento.",
        shortDesc: "Perfecto para feats. Cubre créditos, distribución de ingresos y aprobación creativa.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "unlimited-stems-license-agreement",
        title: "Acuerdo de Licencia Unlimited + Stems",
        tags: "música, licencias, pro",
        category: "música, licencias",
        type: "Contrato",
        status: "Borrador",
        mins: "30",
        filetypes: "PDF, DOCX",
        verified: true,
        image: "https://placehold.co/400x225.png",
        shortDesc: "Licencia no exclusiva para uso ilimitado y stems del beat, con condiciones claras de uso, propiedad y distribución.",
        desc: `Acuerdo de licencia para el uso del beat "Unlimited + Stems" con derechos no exclusivos, duración de 10 años, y condiciones detalladas sobre uso, propiedad, regalías y terminación.`,
        createdAt: new Date().toISOString(),
        content: `
# Acuerdo de Licencia Unlimited + Stems

Este Acuerdo de Licencia No Exclusiva Unlimited + Stems (el “Acuerdo”) se celebra a partir de la Fecha de Vigencia entre el Productor/Licenciante: Joel Rosario Crisostomo; Magdiel Sterling Santana Morales p/k/a sterlingmadeit; 8qsquare (colectivamente “Productor” o “Licenciante”), y el Licenciatario: Patrick Novillo Leon (el “Licenciatario”). Las partes acuerdan lo siguiente:

1. Cuota de Licencia  
El Licenciatario pagará al Licenciante la Cuota de Licencia por un monto de $[INSERTAR MONTO] en o antes de la fecha de este Acuerdo. Todos los derechos otorgados al Licenciatario bajo este Acuerdo están condicionados al pago oportuno de la Cuota de Licencia. La Cuota de Licencia es un pago único; este Acuerdo no será efectivo hasta que se realice el pago.

2. Entrega del Beat  
a. El Licenciante entregará el Beat en formato MP3 de alta calidad, WAV y stems individuales (TRACKSTEMS) en el formato acordado.  
b. La entrega se realizará vía [correo electrónico/WeTransfer/enlace] a la dirección de correo electrónico proporcionada por el Licenciatario dentro de [X] horas/días tras la recepción del pago.

3. Plazo  
El plazo de este Acuerdo será de diez (10) años a partir de la Fecha de Vigencia, salvo terminación anticipada conforme a lo previsto en este documento.

4. Concesión de Licencia y Usos Permitidos  
a. El Licenciante concede al Licenciatario una licencia limitada, mundial, no exclusiva y no transferible para incorporar el Beat en hasta [X] nuevas canciones (cada una una “Nueva Canción”). Para usos que excedan [X] Nuevas Canciones, las partes negociarán una licencia adicional por escrito. El Licenciatario podrá modificar el arreglo, duración, tempo o tono del Beat para preparar una Nueva Canción.  
b. Sujeto al cumplimiento del Licenciatario con este Acuerdo, el Licenciatario podrá:  
   i. Lanzar, vender, distribuir y explotar comercialmente cada Nueva Canción en formatos físicos y digitales (incluyendo descargas y ventas físicas ilimitadas), y poner la Nueva Canción a disposición en servicios de streaming con transmisiones monetizadas y no monetizadas ilimitadas;  
   ii. Usar la Nueva Canción para fines promocionales, incluyendo lanzamientos como sencillo, inclusión en EPs/álbumes y distribución digital promocional;  
   iii. Realizar presentaciones públicas de la Nueva Canción en contextos con o sin fines de lucro (conciertos, radio, streaming, etc.); y  
   iv. Sincronizar cada Nueva Canción en una obra audiovisual única (un “Video”) de hasta cinco (5) minutos de duración, siempre que si la Nueva Canción es más corta que cinco (5) minutos, la duración del Video no exceda la duración de la Nueva Canción. No se conceden otros derechos de sincronización salvo los expresamente indicados.  
c. Para mayor claridad, el Licenciatario NO tiene derecho a vender o distribuir el Beat en su forma entregada. Cualquier venta o distribución del Beat en forma sustancialmente original constituye un incumplimiento material.

5. Restricciones  
a. Los derechos otorgados son no transferibles y no podrán ser cedidos ni sublicenciados por el Licenciatario sin acuerdo escrito previo.  
b. El Licenciatario no podrá sincronizar el Beat o la Nueva Canción con obras audiovisuales salvo lo permitido en la Sección 4(b)(iv), salvo acuerdo previo por escrito.  
c. El Licenciatario no podrá licenciar ni autorizar samples del Beat. Podrá proporcionar el Beat o stems a músicos, ingenieros o estudios que trabajen en la Nueva Canción.  
d. Identificación de Contenido y Distribución: El Licenciatario podrá registrar la Nueva Canción en sistemas de identificación de contenido y distribuirla mediante agregadores, siempre que notifique por escrito al Productor y registre simultáneamente la participación del Productor conforme a los porcentajes acordados en la Sección 6; alternativamente, las partes podrán acordar por escrito que el Productor gestione la identificación de contenido en nombre de ambas partes con autorización previa por escrito.  
e. El Licenciatario no podrá copiar, subir, publicar ni distribuir el Beat en su forma original salvo lo razonablemente necesario para producción y colaboración en la Nueva Canción.

6. Propiedad; Porcentajes; Publishing

a. Propiedad
El Productor (Licenciante) retiene todos los derechos, títulos e intereses sobre el Beat, incluyendo todos los derechos de autor sobre la grabación sonora (master) y sobre la composición musical subyacente. Nada en este Acuerdo constituye una cesión de derechos del Productor respecto al Beat o al master. El Licenciatario recibe únicamente la licencia limitada expresamente concedida en este documento.

b. Participaciones de autores (writers’ share)
Las partes acuerdan que, respecto de la composición subyacente de la Nueva Canción, las participaciones de autores se asignarán y reflejarán conforme a lo acordado entre las partes y documentado en la sección de firmas o en un anexo. De forma expresa y como reparto acordado:

LICENCIANTE / PRODUCTOR: 50% de la participación de autores.
El porcentaje restante corresponderá al Licenciatario y/o a cualquier otro coautor según lo acordado y documentado por escrito.
c. Participación editorial (publisher’s share) y administración
El Productor poseerá, controlará y administrará el 50% de la participación editorial (publisher’s share) del tema. Las partes acuerdan cooperar para la gestión editorial y podrán nombrar un administrador editorial (publishing administrator) para encargarse de la recaudación y distribución de regalías editoriales cuando proceda.

d. Registro ante PROs y metadatos
Las partes se comprometen a registrar las participaciones acordadas ante sus respectivas entidades de gestión colectiva (PROs) y a mantener metadatos consistentes y precisos (incluyendo nombres, IPI/CAE/identificadores y splits). Si el Licenciatario registra la Nueva Canción ante un PRO o ante cualquier sistema de identificación, deberá hacerlo simultáneamente con la inscripción de la participación del Productor conforme a este Acuerdo.

e. Cooperación y correcciones posteriores
Ambas partes deberán cooperar de buena fe para corregir o actualizar cualquier registro, metadato, split o inscripción necesarios para la correcta recaudación y asignación de derechos. Cualquier modificación de las participaciones o del administrador editorial requerirá un acuerdo escrito y firmado por las partes.

f. Garantías limitadas sobre derechos subyacentes
El Productor garantiza, hasta donde tiene conocimiento razonable, que posee los derechos necesarios sobre el Beat para conceder la licencia descrita y que no existen derechos de terceros no autorizados que impidan su explotación conforme a este Acuerdo. Si existiera algún sample o derecho de terceros no revelado previamente, el Productor será responsable de su regularización y de las reclamaciones derivadas de ello, salvo pacto expreso en contrario.

g. El Productor poseerá, controlará y administrará el 50% de la participación editorial de la Nueva Canción. Licenciatario y Productor acuerdan registrar los porcentajes con las entidades de gestión correspondientes y cooperar para asegurar que los metadatos y registros reflejen correctamente las participaciones acordadas. Si el Licenciatario registra intereses ante una entidad de gestión, registrará simultáneamente la participación del Productor conforme a lo establecido.

7. Regalías Mecánicas  
Las regalías mecánicas serán contabilizadas y pagadas conforme a la ley aplicable y prácticas estándar de la industria. Las partes coordinarán y, cuando corresponda, utilizarán un administrador editorial para asegurar la correcta recaudación y asignación. Cualquier desviación, límite o arreglo especial será acordado por escrito.

8. Créditos  
El Licenciatario hará esfuerzos comercialmente razonables para acreditar al Productor como “Produced by 8qsquare; Sterling Santana p/k/a sterlingmadeit” en todos los metadatos digitales, notas de álbum y materiales de lanzamiento, y proporcionará al Productor pruebas de los créditos para revisión antes de la distribución final.

9. Opción de Terminación del Licenciante (Limitada)  
El Licenciante podrá optar por terminar esta licencia dentro de los tres (3) años siguientes a la Fecha de Vigencia solo si se cumplen las siguientes condiciones: (i) notificación por escrito con al menos sesenta (60) días de antelación al Licenciatario especificando los motivos; (ii) pago al Licenciatario de una compensación razonable calculada de buena fe basada en los ingresos documentados y las inversiones razonables relacionadas con la(s) Nueva(s) Canción(es) afectada(s); y (iii) un período razonable para la retirada de los canales de distribución no menor a treinta (30) días. Tras el pago y cumplimiento del período, el Licenciatario retirará la(s) Nueva(s) Canción(es) de la distribución según se requiera.

10. Incumplimiento por parte del Licenciatario; Remedios  
a. El Licenciatario dispondrá de cinco (5) días hábiles desde la recepción de notificación escrita de incumplimiento para subsanar, salvo que no sea razonablemente posible en ese plazo, en cuyo caso deberá iniciar la subsanación dentro de los cinco (5) días y proceder con diligencia. La falta de subsanación constituirá incumplimiento y podrá resultar en la terminación de derechos.  
b. Si el Licenciatario realiza explotación comercial no autorizada, será responsable por daños, incluyendo cualquier ingreso recibido por dicha explotación.  
c. En caso de incumplimiento o amenaza de daño irreparable, el Productor podrá solicitar medidas cautelares además de otros remedios.

11. Garantías; Representaciones; Indemnización  
a. El Productor declara y garantiza que, a su conocimiento, tiene derecho a celebrar este Acuerdo y que el Beat no contiene samples de terceros no autorizados. Si conoce algún sample, lo notificará por escrito antes de la firma y será responsable de su autorización salvo acuerdo en contrario.  
b. El Licenciatario declara y garantiza que cualquier material aportado es original o debidamente licenciado y no infringe derechos de terceros.  
c. Cada parte indemnizará a la otra por reclamaciones de terceros derivadas de incumplimientos o mala fe propios. El Productor indemnizará por samples no autorizados no revelados; el Licenciatario indemnizará por elementos aportados por él.

12. Registro de Derechos de Autor  
El Licenciatario podrá registrar la Nueva Canción ante la Oficina de Derechos de Autor de EE.UU. u otra autoridad aplicable, ya sea (i) conjuntamente con el Productor, o (ii) con autorización previa por escrito del Productor; dicho registro reflejará los porcentajes y derechos acordados.

13. Notificaciones  
Todas las notificaciones serán por escrito y entregadas por correo certificado, mensajería o correo electrónico a las direcciones indicadas. Las notificaciones por correo se considerarán recibidas cinco (5) días hábiles después del envío; por mensajería, dos (2) días hábiles; por correo electrónico, al confirmarse la recepción.

14. Ley Aplicable y Resolución de Conflictos  
Este Acuerdo se regirá por las leyes de [insertar jurisdicción neutral, ej. Estado de Nueva York], sin considerar conflictos de leyes. Cualquier disputa será resuelta mediante arbitraje en [ciudad/país] bajo las reglas de [ej. ICC / AAA / organismo arbitral], y el laudo será definitivo y vinculante, salvo que alguna parte solicite medidas cautelares en tribunal competente para evitar daños irreparables.

15. Misceláneos  
a. Acuerdo Completo. Este documento constituye el acuerdo completo y reemplaza acuerdos previos.  
b. Modificaciones. Cualquier cambio deberá constar por escrito y firmado por ambas partes.  
c. Contrapartes y Firmas Electrónicas. El Acuerdo podrá firmarse en contrapartes y enviarse electrónicamente con igual validez.  
d. Cooperación. Las partes cooperarán para realizar registros, ejecutar documentos y tomar acciones razonables para cumplir el propósito del Acuerdo, incluyendo registros ante entidades de gestión y corrección de metadatos.

16. Formatos y Etiquetado de Entregables  
El Productor entregará MP3 (320 kbps), WAV (44.1kHz/24-bit) y stems individuales en [formato], debidamente etiquetados. La entrega se realizará vía [correo electrónico/WeTransfer/enlace] dentro de [X] horas/días tras el pago.
`,
    },
];
