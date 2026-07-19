import { Expose, Type } from 'class-transformer';

export class AdminUserGrowthDto {
  @Expose()
  name: string;

  @Expose()
  users: number;

  constructor(name: string, users: number) {
    this.name = name;
    this.users = users;
  }
}

export class AdminContentDistributionDto {
  @Expose()
  name: string;

  @Expose()
  value: number;

  @Expose()
  color: string;

  constructor(name: string, value: number, color: string) {
    this.name = name;
    this.value = value;
    this.color = color;
  }
}

export class AdminWeeklyActivityDto {
  @Expose()
  name: string;

  @Expose()
  TOEIC: number;

  @Expose()
  Vocabulary: number;

  @Expose()
  Materials: number;

  constructor(
    name: string,
    toeic: number,
    vocabulary: number,
    materials: number,
  ) {
    this.name = name;
    this.TOEIC = toeic;
    this.Vocabulary = vocabulary;
    this.Materials = materials;
  }
}

export class AdminDashboardResponseDto {
  @Expose()
  totalUsers: number;

  @Expose()
  testsCompleted: number;

  @Expose()
  materialViews: number;

  @Expose()
  activeNow: number;

  @Expose()
  @Type(() => AdminUserGrowthDto)
  userGrowth: AdminUserGrowthDto[];

  @Expose()
  @Type(() => AdminContentDistributionDto)
  contentDistribution: AdminContentDistributionDto[];

  @Expose()
  @Type(() => AdminWeeklyActivityDto)
  weeklyActivity: AdminWeeklyActivityDto[];

  constructor(
    totalUsers: number,
    testsCompleted: number,
    materialViews: number,
    activeNow: number,
    userGrowth: AdminUserGrowthDto[],
    contentDistribution: AdminContentDistributionDto[],
    weeklyActivity: AdminWeeklyActivityDto[],
  ) {
    this.totalUsers = totalUsers;
    this.testsCompleted = testsCompleted;
    this.materialViews = materialViews;
    this.activeNow = activeNow;
    this.userGrowth = userGrowth;
    this.contentDistribution = contentDistribution;
    this.weeklyActivity = weeklyActivity;
  }
}
