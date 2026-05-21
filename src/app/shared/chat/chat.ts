import { Component, inject, effect,  } from '@angular/core';
import { ChatService } from '../../services/chatService';
import { Imensaje } from '../../models/mensaje-interface';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { FormatearFechaPipe } from '../pipes/formatear-fecha.pipe';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, FormatearFechaPipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  chatService = inject(ChatService);
  auth = inject(AuthService);
  contentMsj: string = '';
  abierto: boolean = false;

  toggleChat() {
    this.abierto = !this.abierto;
  }

  autoScroll = effect(() => {
    const mensajes = this.chatService.mensajes();
    if (mensajes.length > 0) {
      this.scrollToBottom();
    }
  });

  enviarMensaje() {
    if (this.contentMsj.trim() === '') return;
    this.chatService.enviarMensaje(this.contentMsj);
    this.contentMsj = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  async ngOnInit() {
    await this.chatService.cargarMensajes();
    this.scrollToBottom();
    this.chatService.suscribirseAlChat();
    
  }
}



