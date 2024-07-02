import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const createNextRouteHandler =
  (methods: Record<string, (...args: any) => Promise<any>>) => async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method ?? '';

    if (!(method in methods))
      return new NextResponse(`Method ${method} Not Allowed`, {
        status: 405,
        headers: {
          Allow: Object.keys(methods)
        } as any
      });

    return await methods[method](req, res);
  };

export { createNextRouteHandler };
