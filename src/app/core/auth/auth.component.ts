import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SupabaseService } from '../services/supabase.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: [],
})
export class AuthDialog {
    signInEmail = new FormControl<string>('', [Validators.email]);

    constructor(
        private readonly dialogRef: MatDialogRef<AuthDialog>,
        private readonly supabase: SupabaseService
    ) {}

    async signUp(): Promise<void> {
        const email = this.signInEmail.value;
        if (!email || email === '' || this.signInEmail.invalid) {
            return;
        }
        try {
            const { error } = await this.supabase.signIn(email);
            if (error) {
                throw error;
            } else {
                this.dialogRef.close();
                alert('Check your email for the login link!');
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
