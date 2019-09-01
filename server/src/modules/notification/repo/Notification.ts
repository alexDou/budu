import { getRepository, FindOneOptions } from 'typeorm';
import { Service } from 'typedi';
import { NotificationEntity } from '..';


@Service()
export class NotificationRepository {
    private repository = getRepository(NotificationEntity, 'pg-conn');

    async findOneById(_id: string) {
        return this.repository.findOne(_id);
    }

    async findOneBySelector(selector?: FindOneOptions<NotificationEntity>) {
        return this.repository.findOne(selector);
    }

    async find(selector?: Partial<NotificationEntity>) {
        return this.repository.find(selector);
    }

    async create(invite: Partial<NotificationEntity>) {
        return this.repository.save(invite);
    }

    async update(_id: string, update: Partial<NotificationEntity>) {
        const user = await this.findOneById(_id);
        await this.repository.merge(user, update);
        return this.repository.save(user);
    }

    async remove(_id: string) {
        const invite = await this.repository.findOne(_id);
        return this.repository.remove(invite);
    }
}
