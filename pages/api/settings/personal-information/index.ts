import prisma from '../../../../src/lib/prisma';
import { withAuthMiddleware } from '../../../../src/lib/withAuthMiddleware';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { Session } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';

class SettingsService {
  private req: NextApiRequest;
  private res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
  }

  async getPersonalInformation() {
    const { req, res } = this;
    const session = await unstable_getServerSession(req, res, authOptions);

    const castedSession = session as Session & { userId: string };

    const result = await prisma.user.findUnique({
      where: {
        id: castedSession.userId,
      },
    });

    res.json(result);
  }

  async updatePersonalInformation() {
    const { req, res } = this;
    const session = await unstable_getServerSession(req, res, authOptions);

    const castedSession = session as Session & { userId: string };

    const { name, email } = req.body;

    const result = await prisma.user.update({
      where: {
        id: castedSession.userId,
      },
      data: {
        name,
        email,
      },
    });

    res.json(result);
  }
}

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const service = new SettingsService(req, res);

  switch (req.method) {
    case 'GET': {
      return service.getPersonalInformation();
    }
    case 'POST': {
      return service.updatePersonalInformation();
    }
    default: {
      throw new Error('Unsupported method');
    }
  }
}

export default withAuthMiddleware(handle);