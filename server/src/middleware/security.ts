import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

export const securityMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    },
  })(req, res, next);
};
