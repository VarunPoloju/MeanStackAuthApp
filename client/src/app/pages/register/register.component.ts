import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup , FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { confirmPasswordValidator } from '../../validators/confirmPassword.validator';
import { AuthService } from './../../services/auth.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule, RouterModule],
templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent implements OnInit{

  fb = inject(FormBuilder);   // as we are using latest angular version we are not injecting things in constructor instead of using new feature inject function
  authservice = inject(AuthService);
  router = inject(Router);
  registerForm !: FormGroup;


  ngOnInit():void{
    this.registerForm = this.fb.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      email : ['', Validators.compose([Validators.required, Validators.email])], //whenever more tan 2 validations are there we can use compose
      userName : ['', Validators.required],
      password : ['', Validators.required],
      confirmPassword : ['', Validators.required]
    },
    {
      validator : confirmPasswordValidator('password','confirmPassword')
    }
    )
  }

  register(){
    // console.log(this.registerForm.value);
    this.authservice.register(this.registerForm.value).subscribe({
      next: (res)=>{
        alert('User created');
        this.registerForm.reset();
        this.router.navigate(['login'])
      },
      error : (err)=>{
        console.log(err);
      }
    })
  }
}
