// src/utils/splitPdf.ts

// Tipos de datos esperados (muy útil para la claridad)
export interface ComposerData {
  name: string;
  id: string;
  percentage: string;
  address: string;
  phone: string;
  email: string;
  publisher: string;
  society: string; // ASCAP / BMI / SESAC / OTHER
  ipi: string;
  signature?: string; // base64 de la firma
}

export interface SplitSheetData {
  songTitle: string;
  publicationDate: string;
  performers: string;
  duration: string;
  composers: ComposerData[];
}

type OutputType = 'open' | 'download' | 'print' | 'getBase64';

// Función para generar el PDF del Split Sheet usando importación dinámica
export async function generateSplitPDF(data: SplitSheetData, outputType: OutputType = 'open'): Promise<string | void> {
  // Importación dinámica solo en el cliente
  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts');

  // Acceder a la exportación por defecto y asignar fuentes
  const pdfMake = pdfMakeModule.default;
  if (pdfMake.vfs) {
     pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
  }


  const documentDefinition: any = {
    content: [
      // Encabezado
      { text: "SPLIT SHEET AGREEMENT", style: "header", alignment: "center" },
      { text: "\n" },
      {
        columns: [
          { width: "25%", text: "Song Title:" },
          { width: "*", text: data.songTitle || "" },
        ],
      },
      {
        columns: [
          { width: "25%", text: "Publication date:" },
          { width: "*", text: data.publicationDate || "" },
        ],
      },
      {
        columns: [
          { width: "25%", text: "Performer artists:" },
          { width: "*", text: data.performers || "" },
        ],
      },
      {
        columns: [
          { width: "25%", text: "Duration:" },
          { width: "*", text: data.duration || "" },
        ],
      },
      { text: "\n" },

      // Texto legal
      {
        text: "We hereby confirm that our percentage of contribution and our respective publishing company (s) for the above-mentioned composition are:",
        margin: [0, 10, 0, 10],
      },

      // Tabla de compositores
      {
        table: {
          headerRows: 1,
          widths: ["15%", "10%", "10%", "20%", "15%", "15%", "15%", "10%"],
          body: [
            [
              { text: "Composer", style: "tableHeader" },
              { text: "ID", style: "tableHeader" },
              { text: "%", style: "tableHeader" },
              { text: "Address", style: "tableHeader" },
              { text: "Phone", style: "tableHeader" },
              { text: "Email", style: "tableHeader" },
              { text: "Publisher", style: "tableHeader" },
              { text: "Society/IPI", style: "tableHeader" },
            ],
            // Mapea los datos de los compositores a filas de la tabla
            ...data.composers.map((c) => [
              c.name,
              c.id,
              c.percentage,
              c.address,
              c.phone,
              c.email,
              c.publisher,
              `${c.society} / ${c.ipi}`,
            ]),
          ],
        },
        layout: "lightHorizontalLines", // Estilo de líneas para la tabla
      },

      { text: "\n\n" }, // Espacio entre la tabla y las firmas

      // Firmas (se crea una columna por cada compositor con su firma o línea)
      {
        columns: data.composers.map((c) => ({
          stack: [ // Elementos apilados verticalmente en cada columna de firma
            c.signature // Si hay firma...
              ? { image: c.signature, width: 120, height: 50 } // ...inserta la imagen
              : { text: "_______________________", margin: [0, 20, 0, 5] }, // ...si no, inserta la línea
            { text: c.name, alignment: "center" }, // Nombre del compositor debajo
          ],
          width: "*", // Distribuye el ancho equitativamente entre las columnas de firma
        })),
      },
    ],

    // Definición de estilos reutilizables
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fillColor: "#eeeeee",
      },
    },
  };

  const pdf = pdfMake.createPdf(documentDefinition);

  return new Promise((resolve, reject) => {
    switch (outputType) {
      case 'open':
        pdf.open();
        resolve();
        break;
      case 'download':
        pdf.download(`${data.songTitle.replace(/ /g, '_')}_Split_Sheet.pdf`);
        resolve();
        break;
      case 'print':
        pdf.print();
        resolve();
        break;
      case 'getBase64':
        pdf.getBase64((base64) => {
          resolve(`data:application/pdf;base64,${base64}`);
        });
        break;
      default:
        reject(new Error(`Invalid output type: ${outputType}`));
    }
  });
}
