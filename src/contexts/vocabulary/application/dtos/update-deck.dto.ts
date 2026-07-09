import { PartialType } from '@nestjs/swagger';
import { CreateDeckDto } from './deck-flashcard.dto';

export class UpdateDeckDto extends PartialType(CreateDeckDto) {}
