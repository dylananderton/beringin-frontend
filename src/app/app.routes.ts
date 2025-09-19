import { Routes } from '@angular/router';
import { HomeComponent } from './pages/admin/home/home.component';
import { StockDetailsComponent } from './pages/admin/stock-details/stock-details.component';
import { TransactionsComponent } from './pages/admin/transactions/transactions.component';
import { AddCurrencyComponent } from './pages/admin/add-currency/add-currency.component';
import { CurrenciesListComponent } from './pages/admin/currencies-list/currencies-list.component';
import { AddTransactionComponent } from './pages/admin/add-transaction/add-transaction.component';
import { UserHomeComponent } from './pages/user/user-home/user-home.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { LainKeluarCashComponent } from './pages/admin/lain-keluar-cash/lain-keluar-cash.component';
import { AddLainKeluarCashComponent } from './pages/admin/add-lain-keluar-cash/add-lain-keluar-cash.component';
import { LiveCurrencyComponent } from './pages/admin/live-currency/live-currency.component';
import { LoginComponent } from './pages/admin/authentication/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AboutComponent } from './pages/user/about/about.component';
import { ContactComponent } from './pages/user/contact/contact.component';
import { LocationComponent } from './pages/user/location/location.component';

export const routes: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            { path: '', component: UserHomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'location', component: LocationComponent }
        ]
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'currencies', component: CurrenciesListComponent },
            { path: 'stock-details', component: StockDetailsComponent },
            { path: 'transactions', component: TransactionsComponent },
            { path: 'lain-keluar', component: LainKeluarCashComponent},
            { path: 'live-currency', component: LiveCurrencyComponent},
            { path: 'currencies/add', component: AddCurrencyComponent },
            { path: 'transactions/add', component: AddTransactionComponent },
            { path: 'lain-keluar/add', component: AddLainKeluarCashComponent }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
