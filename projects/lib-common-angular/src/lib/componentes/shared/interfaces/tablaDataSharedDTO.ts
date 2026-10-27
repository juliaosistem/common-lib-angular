
import { Column,ExportColumn} from "@juliaosistem/core-dtos";
import { PlantillaResponse } from "juliaositembackenexpress/dist/utils/PlantillaResponse";


/**
 * clase  para manejar la tabla de datos compartida 
 * @template M Tipo de modelo de Menu
 * @param RES Clase de respuesta que contine la data
 * @version 1
 */

export class TablaDataSharedDTO<M, RES> {

   /** para agregar  boton agregar ala tabla   */
   isAdd: boolean = false; 
   
    /** para agregar boton editar ala tabla   */

   isEdit: boolean = false;
 /** para agreagar boton eliminar ala tabla   */
   isDelete: boolean = false;

    /** para agreagar boton eliminar ala tabla   */
   isWhatsapp: boolean = false;
   
    /** para agreagar boton eliminar ala tabla   */
   isExportExcel: boolean = false;

    /** para agreagar boton exportar excel ala tabla   */
   isExportPdf: boolean = false;

    /** para mandar item a seleccionar   ala tabla   */
   selectedItems: RES[] = [] as RES[]; 

   /** para agreagar boton de importar Excel ala tabla   */
   isImportExcel:boolean = false;

    /** para agreagar boton de importar PDF ala tabla   */
   isImportPdf:boolean = false;
   
    /** para agreagar botones personalizados ala tabla   */
   isPersonalizedButton: boolean = false;

    /** para agreagar checks ala tabla   */
   isCheck: boolean = false;
 
    /** para agregar items  al boton de opciones  de manera personalizada ala tabla */
   itemsPersonalized: M[] = []; 

    /** son los datos de la tabla  */
   data: PlantillaResponse<RES> = new PlantillaResponse<RES>(); 



   statuses!: unknown[];

   exportColumns!: ExportColumn[];

    cols!: Column[];

  }