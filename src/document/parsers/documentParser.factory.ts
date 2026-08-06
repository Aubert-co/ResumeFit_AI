import { Injectable } from "@nestjs/common";
import { DocumentDOCX } from "./documentDocx";
import { DocumentPDF } from "./documentPdf";
import { DocumentTXT } from "./documentTXT";
import { DocumentType } from "../types/document.types";

type DocumentFile = {
    buffer:Buffer,
    type:DocumentType
}
@Injectable()
export class DocumentParserFactory {
    constructor(
        private readonly documentDOCX: DocumentDOCX,
        private readonly documentPDF:DocumentPDF,
        private readonly documentTXT:DocumentTXT
    ){
       
    }
    async parser(document:DocumentFile){
        if(document.type==='pdf'){
            return  this.documentPDF.parser(document.buffer)
        }
        if(document.type==='docx'){
            return  this.documentDOCX.parser(document.buffer)
        }
        return  this.documentTXT.parser(document.buffer)
    }
}
