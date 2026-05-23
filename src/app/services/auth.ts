import { Injectable, inject, signal, computed, effect, WritableSignal } from "@angular/core";
import { Router } from "@angular/router";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { SupabaseService } from "./supabase";
import { ILogin, IRegister } from "../models/registro-interface";


@Injectable({ providedIn: 'root' })
export class AuthService {
    private router = inject(Router);
    private supabase = inject(SupabaseService);
    isAutehticated = computed(() => this.actualUser() !== null);
    actualUser: WritableSignal<User | null> = signal<User | null>(null);
    userEmail = computed(() => this.actualUser()?.email ?? 'Invitado');

    constructor() {
        this.checkSession();
        this.supabase.getClient().auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            this.actualUser.set(session?.user ?? null);
        });

    }

    async checkSession() {
        const { data: { session }, error } = await this.supabase.getClient().auth.getSession();
        if (error) {
            console.error('getSession error', error);
            return;
        }
        if (session?.user) {
            this.actualUser.set(session.user);
        } else {
            this.actualUser.set(null);
        }
    }

    async login({ email, password }: ILogin): Promise<{ ok: boolean, message?: string }> {
        const { data, error } = await this.supabase.getClient().auth.signInWithPassword({ email, password });

        if (error) return { ok: false, message: 'Credenciales inválidas.' };

        if (data.user) {
            this.actualUser.set(data.user);
            console.log('Usuario logueado:', this.actualUser());
            this.router.navigate(['/home']);
            return { ok: true };
        } else {
            console.error('Error al iniciar sesión:', error);
            return { ok: false, message: 'Error al iniciar sesión.' };
        }

    }

    logout() {
        this.supabase.getClient().auth.signOut();
        this.actualUser.set(null);
        this.router.navigateByUrl('/home')
    }

    async register({ name, surname, email, age, password }: IRegister): Promise<{ ok: boolean, message?: string }> {
        try {
            const { data, error } = await this.supabase.getClient().auth.signUp({
                email,
                password,
                options: {
                    data: { name, surname, age }
                }
            });

            if (error?.status === 422) {
                console.error('Error en el registro: El correo ya está registrado.');
                return { ok: false, message: 'El correo ya está registrado.' };
            }

            else if (error) {
                console.error('Error en el registro:', error.message);
            }

            if (data.user) {
                return await this.login({ email, password });
            }

            return { ok: false, message: 'Error al registrar el usuario.' };
        } catch (err) {
            console.error('Error inesperado en el registro:', err);
            return { ok: false, message: 'Error inesperado en el registro.' };
        }
    }

    getUsername() {
        return this.actualUser()?.user_metadata?.['name'];
    }

    getUserUuid() {
        return this.actualUser()?.id;
    }
}