import { HttpInterceptorFn } from '@angular/common/http';

// Automatically attaches Authorization: Bearer <token> for protected API calls
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Do not attach for login endpoint
  const isLogin = req.url.includes('/login');

  if (!token || isLogin) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cloned);
};


