import { DocumentType } from "./types/document.types";


export function getDocumentType(mimeType: string): DocumentType {
  switch (mimeType) {
    case "application/pdf":
      return "pdf";

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";

    case "text/plain":
      return "txt";

    default:
      throw new Error(`Unsupported mime type: ${mimeType}`);
  }
}