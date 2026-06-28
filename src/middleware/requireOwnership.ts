import { Request, Response, NextFunction } from 'express';
import LinkedAccount from '../models/LinkedAccount';

declare global {
  namespace Express {
    interface Request {
      linkedAccount?: InstanceType<typeof LinkedAccount>;
    }
  }
}

export const requireAccountOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { accountId } = req.params;

  const account = await LinkedAccount.findById(accountId);

  if (!account) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }

  if (account.userId.toString() !== req.user!.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  req.linkedAccount = account;
  next();
};
