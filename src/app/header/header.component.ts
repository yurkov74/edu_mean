import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStausListener().subscribe(isAuthenicated => {
      this.userIsAuthenticated = isAuthenicated;
    });
  }

  onLogout() { this.authService.logout(); }

  ngOnDestroy() { this.authListenerSubs.unsubscribe(); }

}
