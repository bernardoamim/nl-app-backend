import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authenticateUserService = new AuthenticateUserService();

    const { user, token } = await authenticateUserService.execute({
      email,
      password,
    });

    const { password: _password, ...userWithoutPassword } = user;

    return response.json({ user: userWithoutPassword, token });
  } catch (error) {
    return response.status(error.statusCode).json({ error: error.message });
  }
});

export default sessionsRouter;
