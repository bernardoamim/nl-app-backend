import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to update the user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Bernaden',
      email: 'bernaden@email.com',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('Should not be able to update user avatar of a non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-exisiting-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should delete old avatar when performing update', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Bernaden',
      email: 'bernaden@email.com',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar2.jpg');
  });
});
