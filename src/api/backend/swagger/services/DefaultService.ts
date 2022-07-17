/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns string
   * @throws ApiError
   */
  public getHello(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/',
    });
  }

  /**
   * @returns any
   * @throws ApiError
   */
  public getProtectedHello(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/protected',
    });
  }
}
