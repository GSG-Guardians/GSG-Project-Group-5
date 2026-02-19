import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../../../database/entities/chat.entities';
import { ChatRole } from '../../../database/enums';
import { Message } from '../../../database/entities/message.entities';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createChat(userId: string) {
    const chat = this.chatRepository.create({ userId });
    return this.chatRepository.save(chat);
  }

  async createMessage(chatId: string, role: ChatRole, content: string) {
    const message = this.messageRepository.create({
      chatId,
      role,
      content,
    });
    return this.messageRepository.save(message);
  }

  async getChatWithMessages(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId, userId },
      relations: ['messages'],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }
}
