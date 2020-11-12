import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatarService.execute({
      avatarFilename: request.file.filename,
      user_id: request.user.id,
    });

    const { password: _password, ...userWithoutPassword } = user;

    return response.json({ user: userWithoutPassword });
  }
}
