import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProgressSettingsCommand } from './update-progress-settings.command';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import type { ILearningProfileRepository } from '../../domain/repositories/learning-profile.repository.interface';
import { LEARNING_PROFILE_REPOSITORY } from '../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../domain/aggregates/learning-profile.aggregate';
import { DailyGoalHistoryEntity } from '../../infrastructure/entities/daily-goal-history.entity';

@CommandHandler(UpdateProgressSettingsCommand)
export class UpdateProgressSettingsHandler implements ICommandHandler<
  UpdateProgressSettingsCommand,
  void
> {
  constructor(
    @Inject(LEARNING_PROFILE_REPOSITORY)
    private readonly profileRepo: ILearningProfileRepository,
    @InjectRepository(DailyGoalHistoryEntity)
    private readonly goalHistoryRepo: Repository<DailyGoalHistoryEntity>,
  ) {}

  async execute(command: UpdateProgressSettingsCommand): Promise<void> {
    let profile = await this.profileRepo.findByUserId(command.userId);

    if (!profile) {
      profile = LearningProfile.create(command.userId);
    }

    if (command.dailyGoalMinutes && command.dailyGoalMinutes > 0) {
      if (profile.dailyGoalMinutes !== command.dailyGoalMinutes) {
        const now = new Date();
        const activeHistory = await this.goalHistoryRepo.findOne({
          where: { userId: command.userId, effectiveTo: IsNull() },
          order: { effectiveFrom: 'DESC' },
        });

        if (activeHistory) {
          activeHistory.effectiveTo = now;
          await this.goalHistoryRepo.save(activeHistory);
        } else {
          const initialHistory = this.goalHistoryRepo.create({
            userId: command.userId,
            targetMinutes: profile.dailyGoalMinutes || 15,
            effectiveFrom: new Date(2020, 0, 1),
            effectiveTo: now,
          });
          await this.goalHistoryRepo.save(initialHistory);
        }

        const newHistory = this.goalHistoryRepo.create({
          userId: command.userId,
          targetMinutes: command.dailyGoalMinutes,
          effectiveFrom: now,
          effectiveTo: null,
        });
        await this.goalHistoryRepo.save(newHistory);
      }

      profile.updateSettings(command.dailyGoalMinutes);
    }

    await this.profileRepo.save(profile);
  }
}
