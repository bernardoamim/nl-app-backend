// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('Should be able to list all providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Test User',
      email: 'test@email.com',
      password: 'password',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Test User 2',
      email: 'test-user-2@email.com',
      password: 'password',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Logged User',
      email: 'logged-user@email.com',
      password: 'password',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
