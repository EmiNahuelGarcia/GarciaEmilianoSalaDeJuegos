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

    async login({ email, password }: ILogin): Promise<boolean> {
        const { data, error } = await this.supabase.getClient().auth.signInWithPassword({ email, password });

        if (error) return false;

        if (data.user) {
            this.actualUser.set(data.user);
            console.log('Usuario logueado:', this.actualUser());
            this.router.navigate(['/home']);
            return true;
        } else {

            return false;
        }

    }

    logout() {
        this.supabase.getClient().auth.signOut();
        this.actualUser.set(null);
        this.router.navigateByUrl('/home')
    }

    async register({ name, surname, email, age, password }: IRegister): Promise<boolean> {
        try {
            const { data, error } = await this.supabase.getClient().auth.signUp({
                email,
                password,
                options: {
                    data: { name, surname, age }
                }
            });

            if (error) {
                console.error('Error en el registro:', error);
                return false;
            }

            if (data.user) {
                return await this.login({ email, password });
            }

            return false;
        } catch (err) {
            console.error('Error inesperado en el registro:', err);
            return false;
        }
    }
}