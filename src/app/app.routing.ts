import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards';
import { HtcAnalyticsComponent } from './htc-analytics/htc-analytics.component';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: '', component: HtcAnalyticsComponent, canActivate: [AuthGuard] }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes, {onSameUrlNavigation: "reload"});