import { getRepository } from 'typeorm'
import { Service } from 'typedi'
import { User } from '../entity/User';


@Service()
export class UserRepository {
    private repository = getRepository(User, 'pg-conn');

    async findOne(_id: string) {
        return this.repository.findOne(_id);
    }

    async findOneBySelector(selector?: Partial<User>) {
        return this.repository.findOne(selector)
    }

    async find(selector?: Partial<User>) {
        return this.repository.find(selector)
    }

    async create(entity: any) {
        return this.repository.save(entity)
    }

    async update(_id: string, entity: Partial<User>) {
        const user = await this.findOne(_id);
        await this.repository.merge(user, entity);
        return await this.repository.save(user);
    }

    async remove(_id: string) {
        let entityToRemove = await this.repository.findOne(_id)
        await this.repository.remove(entityToRemove)
    }
}
