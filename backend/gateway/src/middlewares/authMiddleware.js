import redis from '../../../shared/redis/redis';

const protect = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(400).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }

    const session = await redis.get(`session:${sessionId}`);
    if (!session) {
return res.status(400).json({
        status: 'failed',
        message: 'Session expired, Please Login again',
      });
    }
    req.user = JSON.parse(session);
  } catch (error) {}
};
