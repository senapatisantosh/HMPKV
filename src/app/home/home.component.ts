import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router, ActivatedRoute, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private acRouter: ActivatedRoute
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          case "/Home":
            {
              $('.navbar').removeClass('solid');
              break;
            }
          default:
            {
              $('.navbar').addClass('solid');
              break;
            }
        }
        window.scrollTo(0, 0);
      }
    })
  }

  ngOnInit() {

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
