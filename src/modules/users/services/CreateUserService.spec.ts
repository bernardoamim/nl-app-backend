import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Bernaden',
      email: 'bernaden@email.com',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a new user with same email', async () => {
    await createUser.execute({
      name: 'Bernaden',
      email: 'bernaden@email.com',
      password: '123123',
    });

    await expect(
      createUser.execute({
        name: 'Bernaden',
        email: 'bernaden@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
