import { PartialType } from '@nestjs/swagger';
import { CreateFolderDto } from './folder-flashcard.dto';

export class UpdateFolderDto extends PartialType(CreateFolderDto) {}
