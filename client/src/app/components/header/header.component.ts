import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export default class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  isLoggedin : boolean = false;


  ngOnInit(): void {
      this.authService.isLoggedIn$.subscribe(res =>{
       this.isLoggedin =  this.authService.isLoggedIn();
      })
  }


  logout(){
    localStorage.removeItem('user_id');
    this.authService.isLoggedIn$.next(false);
  }
}
