/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessTokenResponse } from '../models/AccessTokenResponse';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { Web3LoginInfoResponse } from '../models/Web3LoginInfoResponse';
import type { Web3LoginRequest } from '../models/Web3LoginRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns Web3LoginInfoResponse
     * @throws ApiError
     */
    public getLoginInfo({
        publicAddress,
    }: {
        publicAddress: string,
    }): CancelablePromise<Web3LoginInfoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/web3',
            query: {
                'publicAddress': publicAddress,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal Service Error`,
            },
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public createAndSignWeb3LoginInfo(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/login/test',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal Service Error`,
            },
        });
    }

    /**
     * @returns AccessTokenResponse
     * @throws ApiError
     */
    public getToken({
        requestBody,
    }: {
        requestBody: Web3LoginRequest,
    }): CancelablePromise<AccessTokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal Service Error`,
            },
        });
    }

    /**
     * @returns AccessTokenResponse
     * @throws ApiError
     */
    public getRefreshToken({
        requestBody,
    }: {
        requestBody: RefreshTokenRequest,
    }): CancelablePromise<AccessTokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/token/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal Service Error`,
            },
        });
    }

}
