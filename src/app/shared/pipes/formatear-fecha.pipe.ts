import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatearFecha',
    standalone: true
})
export class FormatearFechaPipe implements PipeTransform {
    transform(fecha: string | null, modo: 'completo' | 'chat' = 'completo'): string {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);

        if (modo === 'chat') {
            return date.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        return date.toLocaleString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

