/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LicenseController } from './../routers/public/license.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LicenseVerifyController } from './../routers/public/license-verify.controller';
import { expressAuthentication } from './../routers/public/authentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ReplenishInterval": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["TEN_SECONDS"]},{"dataType":"enum","enums":["MINUTE"]},{"dataType":"enum","enums":["HOUR"]},{"dataType":"enum","enums":["DAY"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "License": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"integer","required":true},
            "active": {"dataType":"boolean","required":true},
            "userId": {"dataType":"integer","required":true},
            "licenseKey": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "notes": {"dataType":"string","required":true},
            "ipLimit": {"dataType":"union","subSchemas":[{"dataType":"integer"},{"dataType":"enum","enums":[null]}],"default":null,"required":true},
            "licenseScope": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"default":null,"required":true},
            "expirationDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"default":null,"required":true},
            "validationPoints": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"default":null,"required":true},
            "validationLimit": {"dataType":"union","subSchemas":[{"dataType":"integer"},{"dataType":"enum","enums":[null]}],"default":null,"required":true},
            "replenishAmount": {"dataType":"union","subSchemas":[{"dataType":"integer"},{"dataType":"enum","enums":[null]}],"default":null,"required":true},
            "replenishInterval": {"dataType":"union","subSchemas":[{"ref":"ReplenishInterval"},{"dataType":"enum","enums":[null]}],"default":null,"required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseError_license-with-same-key-already-exists_": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"enum","enums":["license-with-same-key-already-exists"],"required":true},
            "details": {"dataType":"any","default":{},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseError_unauthorized_": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"enum","enums":["unauthorized"],"required":true},
            "details": {"dataType":"any","default":{},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseError_invalid-schema_": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"enum","enums":["invalid-schema"],"required":true},
            "details": {"dataType":"any","default":{},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LicenseCreateInput": {
        "dataType": "refObject",
        "properties": {
            "active": {"dataType":"boolean","required":true},
            "name": {"dataType":"string","required":true},
            "notes": {"dataType":"string","required":true},
            "ipLimit": {"dataType":"integer","default":null,"required":true},
            "licenseScope": {"dataType":"string","default":null,"required":true},
            "expirationDate": {"dataType":"datetime","default":null,"required":true},
            "validationPoints": {"dataType":"double","default":null,"required":true},
            "validationLimit": {"dataType":"integer","default":null,"required":true},
            "replenishAmount": {"dataType":"integer","default":null,"required":true},
            "replenishInterval": {"ref":"ReplenishInterval","default":null,"required":true},
            "licenseKey": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseError_not-found_": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"enum","enums":["not-found"],"required":true},
            "details": {"dataType":"any","default":{},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LicenseUpdateInput": {
        "dataType": "refObject",
        "properties": {
            "licenseKey": {"dataType":"string"},
            "active": {"dataType":"boolean"},
            "name": {"dataType":"string"},
            "notes": {"dataType":"string"},
            "ipLimit": {"dataType":"integer","default":null},
            "licenseScope": {"dataType":"string","default":null},
            "expirationDate": {"dataType":"datetime","default":null},
            "validationPoints": {"dataType":"double","default":null},
            "validationLimit": {"dataType":"integer","default":null},
            "replenishAmount": {"dataType":"integer","default":null},
            "replenishInterval": {"ref":"ReplenishInterval","default":null},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationResult": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["VALID"]},{"dataType":"enum","enums":["NOT_FOUND"]},{"dataType":"enum","enums":["NOT_ACTIVE"]},{"dataType":"enum","enums":["EXPIRED"]},{"dataType":"enum","enums":["LICENSE_SCOPE_FAILED"]},{"dataType":"enum","enums":["IP_LIMIT_EXCEEDED"]},{"dataType":"enum","enums":["RATE_LIMIT_EXCEEDED"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationResponse": {
        "dataType": "refObject",
        "properties": {
            "valid": {"dataType":"boolean","required":true},
            "result": {"ref":"ValidationResult","required":true},
            "signedChallenge": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerificationOptions": {
        "dataType": "refObject",
        "properties": {
            "scope": {"dataType":"string"},
            "challenge": {"dataType":"string"},
            "metadata": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/admin/licenses',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LicenseController)),
            ...(fetchMiddlewares<RequestHandler>(LicenseController.prototype.create)),

            function LicenseController_create(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LicenseCreateInput"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LicenseController();

              templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/admin/licenses/:licenseId',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LicenseController)),
            ...(fetchMiddlewares<RequestHandler>(LicenseController.prototype.read)),

            function LicenseController_read(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    licenseId: {"in":"path","name":"licenseId","required":true,"dataType":"double"},
                    includeLogs: {"in":"query","name":"includeLogs","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LicenseController();

              templateService.apiHandler({
                methodName: 'read',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/admin/licenses/key/:licenseKey',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LicenseController)),
            ...(fetchMiddlewares<RequestHandler>(LicenseController.prototype.readByLicenseKey)),

            function LicenseController_readByLicenseKey(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    licenseKey: {"in":"path","name":"licenseKey","required":true,"dataType":"string"},
                    includeLogs: {"in":"query","name":"includeLogs","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LicenseController();

              templateService.apiHandler({
                methodName: 'readByLicenseKey',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/admin/licenses/:licenseId',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LicenseController)),
            ...(fetchMiddlewares<RequestHandler>(LicenseController.prototype.update)),

            function LicenseController_update(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    licenseId: {"in":"path","name":"licenseId","required":true,"dataType":"double"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LicenseUpdateInput"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LicenseController();

              templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/admin/licenses/:licenseId',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LicenseController)),
            ...(fetchMiddlewares<RequestHandler>(LicenseController.prototype.delete)),

            function LicenseController_delete(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    licenseId: {"in":"path","name":"licenseId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LicenseController();

              templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/admin/licenses',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LicenseController)),
            ...(fetchMiddlewares<RequestHandler>(LicenseController.prototype.list)),

            function LicenseController_list(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    take: {"default":10,"in":"query","name":"take","dataType":"integer","validators":{"isInt":{"errorMsg":"take"}}},
                    skip: {"default":0,"in":"query","name":"skip","dataType":"integer","validators":{"isInt":{"errorMsg":"skip"}}},
                    filterStatus: {"in":"query","name":"filterStatus","dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["disabled/expired"]}]},
                    includeLogs: {"default":false,"in":"query","name":"includeLogs","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LicenseController();

              templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/license/:userId/:licenseKey/verify',
            ...(fetchMiddlewares<RequestHandler>(LicenseVerifyController)),
            ...(fetchMiddlewares<RequestHandler>(LicenseVerifyController.prototype.verifyLicenseGet)),

            function LicenseVerifyController_verifyLicenseGet(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                    licenseKey: {"in":"path","name":"licenseKey","required":true,"dataType":"string"},
                    scope: {"in":"query","name":"scope","dataType":"string"},
                    challenge: {"in":"query","name":"challenge","dataType":"string"},
                    metadata: {"in":"query","name":"metadata","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LicenseVerifyController();

              templateService.apiHandler({
                methodName: 'verifyLicenseGet',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/license/:userId/:licenseKey/verify',
            ...(fetchMiddlewares<RequestHandler>(LicenseVerifyController)),
            ...(fetchMiddlewares<RequestHandler>(LicenseVerifyController.prototype.verifyLicensePost)),

            function LicenseVerifyController_verifyLicensePost(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                    licenseKey: {"in":"path","name":"licenseKey","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"VerificationOptions"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LicenseVerifyController();

              templateService.apiHandler({
                methodName: 'verifyLicensePost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
