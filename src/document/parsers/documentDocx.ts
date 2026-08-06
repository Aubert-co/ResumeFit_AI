import { Injectable } from "@nestjs/common";
import { IDocument } from "./document.factory";
import mammoth from 'mammoth'
@Injectable()
export class DocumentDOCX implements IDocument{
    constructor(){}

    async parser(documentInfo: Buffer): Promise<string> {
         const result = await mammoth.extractRawText({
            buffer: documentInfo,
        });

        return result.value.trim();
    }
}