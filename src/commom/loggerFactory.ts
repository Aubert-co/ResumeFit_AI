export type LoggerMetadata = {
  action: string;
  method: string;
  message: string;
  errorMsg?: string;
  data?: {
    userId?: string;
    resumeId?: string;
    analysisId?: string;
    email?: string;
    [key: string]: unknown;
    name?: string;
  };
};

export const loggerFactory = (logger: LoggerMetadata) => {
  return logger;
};
