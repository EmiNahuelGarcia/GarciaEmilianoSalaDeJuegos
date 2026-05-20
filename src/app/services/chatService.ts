import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService, } from './supabase';
import { AuthService } from './auth';
import { Imensaje } from '../models/mensaje-interface';
import { RealtimeChannel, PostgrestQueryBuilder } from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  public mensajes = signal<Imensaje[]>([]);
  canal: RealtimeChannel | null = null;
  chatTable: PostgrestQueryBuilder<any, any, any, 'chatMensajes', unknown>;

  constructor() {
    this.chatTable = this.supabase.getClient().from('chatMensajes');
    this.canal = this.supabase.getClient().channel("chat-global");
  }

  async enviarMensaje(contentMsj: string) {
    const userName = this.auth.getUsername();
    const userId = this.auth.getUserUuid();
    if (!userName || !userId) {
      console.error('Usuario no autenticado');
      return;
    }
    await this.supabase.getClient().from('chatMensajes').insert([
      { user_uuid: userId, user_name: userName, mensaje: contentMsj }
    ]);
  }


  async cargarMensajes() {
    const { data, error } = await this.chatTable
      .select('id, user_uuid, user_name, mensaje, created_at')
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.log('Error al traer los mensajes:', error);
      return [];
    }
    this.mensajes.set(data as Imensaje[]);
    return data as Imensaje[];
  }

  suscribirseAlChat() {
    if (!this.canal) return;
    this.canal
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chatMensajes' },
        (dato) => {
          const nuevoMensaje = dato.new as Imensaje;
          this.mensajes.update((actuales) => [...actuales, nuevoMensaje]);
        }
      )
      .subscribe();
  }
}


