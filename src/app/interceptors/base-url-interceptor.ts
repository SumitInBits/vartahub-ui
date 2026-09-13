import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    const apiReq = req.clone({
      url: `${environment.baseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`,
    });
    return next(apiReq);
  }
  return next(req);
};
