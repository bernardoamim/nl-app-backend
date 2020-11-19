import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test User',
      email: 'test@email.com',
      password: 'password',
    });

    await updateProfile.execute({
      user_id: user.id,
      name: 'New User Name',
      email: 'new-user-mail@test.com',
    });

    expect(user.name).toBe('New User Name');
    expect(user.email).toBe('new-user-mail@test.com');
  });

  it('Should NOT be able to update to an email already in use', async () => {
    await fakeUsersRepository.create({
      name: 'Test User',
      email: 'test@email.com',
      password: 'password',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test New User',
      email: 'new-user@email.com',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'New User Name',
        email: 'test@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should NOT be able to update the profile of non existing user', async () => {
    await expect(
      updateProfile.execute({
        name: 'New User Name',
        email: 'test@email.com',
        user_id: 'non-existing-user-uuid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test User',
      email: 'test@email.com',
      password: 'password',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'New User Name',
      email: 'new-user@email.com',
      password: 'new-password',
      old_password: 'password',
    });

    expect(updatedUser.password).toBe('new-password');
  });

  it('Should NOT be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test User',
      email: 'test@email.com',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'New User Name',
        email: 'new-user@email.com',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should NOT be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test User',
      email: 'test@email.com',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'New User Name',
        email: 'new-user@email.com',
        old_password: 'wrong-old-password',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
