import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LoginAdminService } from '../service/login.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public hideInputPassword = true;
  private loginService = inject(LoginAdminService);
  private router = inject(Router);

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  public async login() {
    this.loginForm.disable();
    try {
      const response = await firstValueFrom(this.loginService.login(this.loginForm.value));
      if (response && response.admin) {
        console.log(response, 'response');

        localStorage.setItem('accessToken', response.token);
        await this.router.navigate(['/dashboard', response.admin]);
      }
    } catch (err: unknown) {
      console.error(err);
      if (err && typeof err === 'object' && 'status' in err) {
      }
    }
    this.loginForm.enable();
  }
}
