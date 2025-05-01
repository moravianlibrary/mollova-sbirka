// src/app/services/environment.service.ts
import { Injectable } from '@angular/core';
import { environment as staticEnv } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
    private config: any = {};

    public async load(): Promise<void> {
        if (staticEnv.useRuntimeConfig) {
            try {
                const response = await fetch('/assets/env.json');
                if (!response.ok) throw new Error('env.json load failed');
                const data = await response.json();
                this.config = { ...staticEnv, ...data };
            } catch (err) {
                console.warn('env.json not found or invalid. Falling back to static env.');
                this.config = staticEnv;
            }
        } else {
            this.config = staticEnv;
        }
    }

    public get(key: string): any {
        return this.config[key];
    }
}
