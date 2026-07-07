import { IsInt, Min, Max, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateQuizDto {
  @ApiProperty({ example: 10, description: 'Số lượng câu hỏi' })
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number;
}

export class SubmitAnswerDto {
  @ApiProperty({ example: 'Apple', description: 'Đáp án người dùng chọn' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
