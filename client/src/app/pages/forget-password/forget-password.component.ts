import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export default class ForgetPasswordComponent implements OnInit{
  forgetForm !: FormGroup;
  fb = inject(FormBuilder);
  authService = inject(AuthService)

ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email : ['', Validators.compose([Validators.required , Validators.email])]
    })
}

sendEmail(){
  this.authService.sendEmail(this.forgetForm.value.email).subscribe(
    {
      next : (res) =>{
        alert(res.message);
        this.forgetForm.reset();
      },
      error : (err) =>{
        alert(err.error.message);
      }
    }
  )
}
}
