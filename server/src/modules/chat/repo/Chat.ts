import { getRepository, FindOneOptions } from 'typeorm';
import { Service } from 'typedi';
import { ChatEntity } from '../entity/Chat';


@Service()
export class ChatRepository {
    private repository = getRepository(ChatEntity, 'pg-conn');

    async findOneById(_id: string) {
        return this.repository.findOne(_id);
    }

    async findOneBySelector(selector?: FindOneOptions<ChatEntity>) {
        return this.repository.findOne(selector);
    }

    async find(selector?: Partial<ChatEntity>) {
        return this.repository.find(selector);
    }

    async create(chat: Partial<ChatEntity>) {
        return this.repository.save(chat);
    }

    async update(_id: string, update: Partial<ChatEntity>) {
        const chat = await this.findOneById(_id);
        await this.repository.merge(chat, update);
        return this.repository.save(chat);
    }

    async remove(_id: string) {
        const chat = await this.repository.findOne(_id);
        return this.repository.remove(chat);
    }
}
