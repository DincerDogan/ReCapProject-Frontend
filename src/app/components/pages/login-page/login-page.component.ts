import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginModel } from 'src/app/models/Entity/loginModel';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm!: FormGroup;

  passwordHidden: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    //login page açıldığı an form build edilsin.
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required], //'' kısmı başlangıç değeri
      password: ['', Validators.required], // Form Control Accessor sayesinde bunu bunraya yazabiliyoruz. Yoksa hiç demedin mi bu başka componentten geldi nasıl oldu?
    });
  }

  login() {
    console.log(
      `!! file: login-page.component.ts ~ line 44 ~ this.loginForm.valid`,
      this.loginForm.valid
    );
    console.log(
      `!! file: login-page.component.ts ~ line 48 ~ ...this.loginForm.value`,
      this.loginForm.value
    );
    if (!this.loginForm.valid) {
      return;
    }
    // ... ' nın anlamı => this.loginForm.value'deki her şeyi al.
    let loginModel: LoginModel = { ...this.loginForm.value };

    this.authService.login(loginModel).subscribe(
      (response) => {
        //login olurken tokenModel ve userMail'i localStorage'a kaydediyoruz. Key olarak tokenModel ve userMail ' i verdik.
        this.localStorageService.set('tokenModel', response.data);
        this.localStorageService.set('userMail', this.loginForm.get('email')?.value);
        this.getUserDetailByEmail(this.loginForm.get('email')?.value);
        this.toastrService.info(response.message);
        this.router.navigateByUrl(''); //bizi homepage'e götür...
      },
      (errorResponse) => this.toastrService.error(errorResponse.error)
    );
  }

  getUserDetailByEmail(mail: string) {
    this.userService.getUserDetailByEmail(mail).subscribe((response) => {
      //gelen userDetail'i store'a gönderdik.
      this.authService.setUserDetail(response.data);
    });
  }

  togglePasswordHidden() {
    this.passwordHidden = !this.passwordHidden;
  }

  isPasswordHidden(): string {
    return this.passwordHidden ? 'password' : 'text';
  }

  isPasswordHiddenIcon(): string {
    return this.passwordHidden ? 'fa-eye-slash' : 'fa-eye text-primary';
  }

}
