import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('Should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '324243432',
      user_id: '3242',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('324243432');
    expect(appointment.user_id).toBe('3242');
  });

  it('Should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id: '324243432',
      user_id: '3242',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '324243432',
        user_id: '3242',
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(appointment.provider_id).toBe('324243432');
  });
});
