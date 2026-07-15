import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';
import type { InsertEvent, UpdateEvent } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RequestContext } from './request-context';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export class BaseEntityListener implements EntitySubscriberInterface {
  private readonly logger = new Logger(BaseEntityListener.name);
  listenTo(): typeof BaseEntity {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<BaseEntity>): void {
    const userId = RequestContext.getUserId();
    if (userId && event.entity) {
      event.entity.createdBy = userId;
      event.entity.updatedBy = userId;
    }
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>): void {
    const userId = RequestContext.getUserId();
    if (userId && event.entity) {
      (event.entity as BaseEntity).updatedBy = userId;
    }
  }

  afterInsert(event: InsertEvent<BaseEntity>): void {
    const userId = RequestContext.getUserId();
    this.logger.debug(
      `[INSERT] Entity: ${event.metadata.name} | ID: ${event.entity?.id} | User: ${userId || 'SYSTEM'}`,
    );
  }

  afterUpdate(event: UpdateEvent<BaseEntity>): void {
    const userId = RequestContext.getUserId();
    this.logger.debug(
      `[UPDATE] Entity: ${event.metadata.name} | ID: ${event.entity?.id} | User: ${userId || 'SYSTEM'}`,
    );
  }

  afterRemove(event: RemoveEvent<BaseEntity>): void {
    const userId = RequestContext.getUserId();
    // In afterRemove, entity might be undefined if removed by ID, but let's log what we have
    this.logger.debug(
      `[REMOVE] Entity: ${event.metadata.name} | ID: ${event.entityId || event.entity?.id} | User: ${userId || 'SYSTEM'}`,
    );
  }
}
