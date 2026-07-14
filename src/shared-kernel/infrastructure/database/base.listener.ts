import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import type { InsertEvent, UpdateEvent } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RequestContext } from './request-context';

@EventSubscriber()
export class BaseEntityListener implements EntitySubscriberInterface {
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
}
