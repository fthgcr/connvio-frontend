import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('token');
  console.log('Current token:', token); // Debug log
  
  if (token) {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Request with token:', clonedRequest); // Debug log
    return next(clonedRequest);
  }
  
  return next(request);
}; 