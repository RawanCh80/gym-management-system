import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { SuperAdminLoginService } from './service/super-admin-login.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './portal-admin-login.page.html',
  styleUrl: './portal-admin-login.page.scss'
})
export class PortalAdminLoginPage implements OnInit {
  public loginForm: FormGroup;
  public hideInputPassword = true;
  private superAdminLoginService = inject(SuperAdminLoginService);
  private router = inject(Router);

  constructor() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  public async login() {
    this.loginForm.disable();
    try {
      const response = await firstValueFrom(this.superAdminLoginService.login(this.loginForm.value));
      if (response && response.admin) {
        console.log(response, 'response');

        localStorage.setItem('accessToken', response.token);
        await this.router.navigate(['/super-admin-dashboard', response.admin]);
      }
    } catch (err: unknown) {
      console.error(err);
      if (err && typeof err === 'object' && 'status' in err) {
      }
    }
    this.loginForm.enable();
  }
}
