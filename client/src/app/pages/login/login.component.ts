import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent implements OnInit {
  fb = inject(FormBuilder);   // as we are using latest angular version we are not injecting things in constructor instead of using new feature inject function
  authservice = inject(AuthService);
  router = inject(Router);
  loginForm !: FormGroup;

  ngOnInit():void{
    this.loginForm = this.fb.group({
      email : ['', Validators.compose([Validators.required, Validators.email])], //whenever more tan 2 validations are there we can use compose
      password : ['', Validators.required],
    },
    )
  }


  login(){
    // console.log(this.loginForm.value)
    this.authservice.login(this.loginForm.value).subscribe({
      next : (res) =>{
        if(res["message"] == "Login success"){
          alert('Login success');
          localStorage.setItem('user_id',res.data._id);
          this.authservice.isLoggedIn$.next(true);
          this.router.navigate(['home']);
          this.loginForm.reset();
        }
        else{
          if (res["message"] == "invaliduser" || "invalidpassword"){
            alert('Invalid password or Invalid User');
          }
        }

      },
      error : (err) =>{
        console.log(err);
      }
    })
  }



}
