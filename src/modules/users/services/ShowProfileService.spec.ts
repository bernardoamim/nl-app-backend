import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test User',
      email: 'test@email.com',
      password: 'password',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe('Test User');
    expect(profile.email).toBe('test@email.com');
  });

  it('Should NOT be able to show the profile of non existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user-uuid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
