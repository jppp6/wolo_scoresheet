import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SupabaseService } from '../services/supabase.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: [],
})
export class AuthComponent {
    signInEmail = new FormControl<string>('', [Validators.email]);

    constructor(
        private readonly dialogRef: MatDialogRef<AuthComponent>,
        private readonly supabase: SupabaseService
    ) {}

    async signUp(): Promise<void> {
        try {
            const email = this.signInEmail.value;
            if (!email) {
                return;
            }
            const { error } = await this.supabase.signIn(email);
            if (error) {
                throw error;
            } else {
                alert('Check your email for the login link!');
                this.dialogRef.close();
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            this.signInEmail.reset();
        }
    }
}
