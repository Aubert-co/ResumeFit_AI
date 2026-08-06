import { Injectable } from "@nestjs/common";
import { IDocument } from "./document.factory";

@Injectable()
export class DocumentTXT implements IDocument{
    constructor(){}

    async parser(buffer: Buffer): Promise<string> {
        return buffer.toString('utf-8').trim()
    }
}