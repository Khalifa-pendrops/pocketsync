import { Request, Response, NextFunction } from 'express';

const sanitiseObject = (obj: Record<string, unknown>): void => {
  for (const key of Object.keys(obj)) {
    if (key.includes('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitiseObject(value as Record<string, unknown>);
    }
  }
};

/** Strip MongoDB operator keys ($, .) from query and body — NoSQL injection prevention */
export const sanitizeInput = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  sanitiseObject(req.query as Record<string, unknown>);
  sanitiseObject(req.body as Record<string, unknown>);
  next();
};