
export interface IDocument{
    parser(documentInfo:Buffer):Promise<string>
}