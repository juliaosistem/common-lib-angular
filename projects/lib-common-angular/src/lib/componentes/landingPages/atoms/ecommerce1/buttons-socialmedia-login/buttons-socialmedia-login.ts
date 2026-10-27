import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-buttons-socialmedia-login',
  standalone: true,
  imports: [],
  templateUrl: './buttons-socialmedia-login.html',
  styleUrl: './buttons-socialmedia-login.scss'
})
export class ButtonsSocialmediaLogin {
@Input() isRegistering: boolean = true;
@Input() isLogout: boolean = false;
@Input() disabled = false;
@Output() facebookLogin = new EventEmitter<void>();

}
