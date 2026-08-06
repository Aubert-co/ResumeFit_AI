import { Injectable } from "@nestjs/common";
import { IDocument } from "./document.factory";
import {PDFParse} from "pdf-parse";

@Injectable()
export class DocumentPDF implements IDocument{
    constructor(){}

    async parser(buffer: Buffer): Promise<string> {
        const pdf = new PDFParse({
            data:buffer
        })

        const result = await pdf.getText()
        return result.text;
    }
}