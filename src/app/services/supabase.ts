import { Injectable, inject } from "@angular/core";
import { createClient, SupabaseClient, PostgrestQueryBuilder } from "@supabase/supabase-js";
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
    //no tengo que poner mas el auth porque sino se inyectan infinitamente
    private client: SupabaseClient;
    ahorcadoTable: PostgrestQueryBuilder<any, any, any, 'ahorcadoScore', unknown>;

    constructor() {
        const supabaseURL = environment.supabaseUrl;
        const supabaseKey = environment.supabaseKey;
        this.client = createClient(supabaseURL, supabaseKey);
        this.ahorcadoTable = this.client.from('ahorcadoScore');
    }

    getClient(): SupabaseClient {
        return this.client;
    }

    async getUltimapartida(juego: 'ahorcado', user_uuid: string | null) {
        const tabladeJuego = {
            ahorcado: this.ahorcadoTable
        };
        const tabla = tabladeJuego[juego];
        const { data, error } = await tabla.select('*').eq('user_uuid', user_uuid)
            .order('id', { ascending: false }).limit(1);
        if (error) {
            console.log(data, error);
        }
        return data?.[0] || null;
    }

    async insertStats(juego: 'ahorcado', victoria: number, derrota: number, tiempo_de_juego: number, puntos: number, user_uuid?: string | null, userName?: string | null) {
        const tabladeJuego = {
            ahorcado: this.ahorcadoTable
        };
        const tabla = tabladeJuego[juego];
        const ultima_partida = await this.getUltimapartida(juego, user_uuid ?? null);
        const { data, error } = await tabla
            .insert({
                user_uuid: user_uuid ?? null,
                userName: userName ?? null,
                partidas_ganadas: (ultima_partida?.partidas_ganadas || 0) + victoria,
                partidas_perdidas: (ultima_partida?.partidas_perdidas || 0) + derrota,
                tiempo_finalizacion: tiempo_de_juego,
                aciertos: puntos
            }).select();

        if (error) {
            console.error('Error al insertar estadísticas:', error);
        } else {
            console.log('Estadísticas insertadas:', data);
        }

        console.log(data, error);
        return data;
    }

    async getAllStats(juego: 'ahorcado') {
        const tablasDeJuegos = {
            ahorcado: this.ahorcadoTable,
        };

        const { data, error } = await tablasDeJuegos[juego].select('*').order('aciertos', { ascending: false }).limit(10);
        if (error) {
            console.log(error);
            return [];
        }
        return data;
    }
}


