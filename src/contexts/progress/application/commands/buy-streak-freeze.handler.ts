import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppException } from '../../../../shared/domain/exceptions/app.exception';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import { ProgressEx } from '../../domain/exceptions/progress.exception';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import { BuyStreakFreezeCommand } from './buy-streak-freeze.command';

@CommandHandler(BuyStreakFreezeCommand)
export class BuyStreakFreezeHandler implements ICommandHandler<
  BuyStreakFreezeCommand,
  void
> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
  ) {}

  async execute(command: BuyStreakFreezeCommand): Promise<void> {
    let profile = await this.profileRepo.findByUserId(command.userId);

    if (!profile) {
      profile = LearningProfile.create(command.userId);
    }

    const success = profile.buyStreakFreeze(500);
    if (!success) {
      throw new AppException(ProgressEx.InsufficientPoints);
    }

    await this.profileRepo.save(profile);
  }
}
