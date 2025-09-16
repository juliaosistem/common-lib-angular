import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-buttons-socialmedia-login',
  imports: [],
  templateUrl: './buttons-socialmedia-login.html',
  styleUrl: './buttons-socialmedia-login.scss'
})
export class ButtonsSocialmediaLogin {
@Input() isRegistering: boolean = true;
@Input() isLogout: boolean = false;

}
