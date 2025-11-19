import { Routes } from '@angular/router';
import { LoginPage } from '../component/login-page/login-page';
import { MainPage } from '../component/main-page/main-page';
import { SignupPage } from '../component/signup-page/signup-page';
import { authGuard } from '../services/authguard';
import { FavorisPage } from '../component/favoris-page/favoris-page';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { path: 'sign', component: SignupPage },
    { path: 'main', component: MainPage, canActivate: [authGuard] },
    { path: 'favorite', component: FavorisPage}
];
