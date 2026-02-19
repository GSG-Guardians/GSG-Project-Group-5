import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { Chat } from '../../../database/entities/chat.entities';
import { Message } from '../../../database/entities/message.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message])],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
