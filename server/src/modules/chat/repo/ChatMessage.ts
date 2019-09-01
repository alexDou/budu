import { getRepository, FindOneOptions } from 'typeorm';
import { Service } from 'typedi';
import { ChatMessagesEntity } from '../entity/ChatMessages';


@Service()
export class ChatMessagesRepository {
    private repository = getRepository(ChatMessagesEntity);

    async findOneById(_id: string) {
        return this.repository.findOne(_id);
    }

    async findOneBySelector(selector?: FindOneOptions<ChatMessagesEntity>) {
        return this.repository.findOne(selector);
    }

    async find(selector?: Partial<ChatMessagesEntity>) {
        return this.repository.find(selector);
    }

    async create(chat_message: Partial<ChatMessagesEntity>) {
        return this.repository.save(chat_message);
    }

    async update(_id: string, update: Partial<ChatMessagesEntity>) {
        const chat_message = await this.findOneById(_id);
        await this.repository.merge(chat_message, update);
        return this.repository.save(chat_message);
    }

    async remove(_id: string) {
        const chat_message = await this.repository.findOne(_id);
        return this.repository.remove(chat_message);
    }
}
