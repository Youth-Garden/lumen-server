import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProgressSettingsCommand } from './update-progress-settings.command';
import { Inject } from '@nestjs/common';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';

@CommandHandler(UpdateProgressSettingsCommand)
export class UpdateProgressSettingsHandler implements ICommandHandler<
  UpdateProgressSettingsCommand,
  void
> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
  ) {}

  async execute(command: UpdateProgressSettingsCommand): Promise<void> {
    let profile = await this.profileRepo.findByUserId(command.userId);

    if (!profile) {
      profile = LearningProfile.create(command.userId);
    }

    if (command.dailyGoalMinutes) {
      profile.updateSettings(command.dailyGoalMinutes);
    }

    await this.profileRepo.save(profile);
  }
}
