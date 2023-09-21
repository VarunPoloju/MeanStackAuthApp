import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { confirmPasswordValidator } from 'src/app/validators/confirmPassword.validator';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export default class ResetComponent implements OnInit {
  fb = inject(FormBuilder);   // as we are using latest angular version we are not injecting things in constructor instead of using new feature inject function
  authservice = inject(AuthService);
  router = inject(Router);
  resetForm !: FormGroup;
  activatedRoute = inject(ActivatedRoute);
  token !: string;

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password : ['', Validators.required],
      confirmPassword : ['', Validators.required]
    },
    {
      validator : confirmPasswordValidator('password','confirmPassword')
    }
    )
    this.getTokenFromUrl();
  }


  getTokenFromUrl(){
    this.activatedRoute.params.subscribe(tokenValueFromUrl =>{
      this.token = tokenValueFromUrl['token'] //why token? bcz if u see app route file that's how we defined path
      console.log('token is', this.token);
    })
  }

  reset(){
    // console.log( this.resetForm.value)
    let resetObj = {
      token : this.token,
      password : this.resetForm.value.password

    }
    this.authservice.resetPassword(resetObj).subscribe({
      next : (res) =>{
        alert(res.message);
        this.resetForm.reset();
        this.router.navigate(['login'])
      },
      error : (err) =>{
        alert(err.error.message);
      }
    })
  }
}
