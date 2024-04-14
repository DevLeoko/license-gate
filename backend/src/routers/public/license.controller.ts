import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import Container from "typedi";
import { LicenseService } from "../../controller/license.controller";
import { Expand } from "../../utils/Expand";
import { ResponseError } from "../../utils/tsoa-response-error";
import { licenseCreateSchema } from "../license-schema";

type ReplenishInterval = "TEN_SECONDS" | "MINUTE" | "HOUR" | "DAY";

/**
 * A license with all its properties and restrictions.
 */
interface License {
  /**
   * License ID.
   * @isInt
   */
  id: number;

  /**
   * Whether the license is active.
   * When a license is disabled, it will not validate.
   */
  active: boolean;

  /**
   * User ID that owns this license (you).
   * @isInt
   */
  userId: number;

  /**
   * License key.
   */
  licenseKey: string;

  /**
   * Name to identify the license.
   */
  name: string;

  /**
   * Notes for the license.
   */
  notes: string;

  /**
   * Limit of IPs that can validate this license.
   * See https://docs.licensegate.io/restriction-options/ip-limit
   * @isInt
   * @default null
   */
  ipLimit: number | null;

  /**
   * Scope of the license.
   * See https://docs.licensegate.io/restriction-options/scope
   * @default null
   */
  licenseScope: string | null;

  /**
   * Expiration date of the license.
   * See https://docs.licensegate.io/restriction-options/expiration
   * @default null
   */
  expirationDate: Date | null;

  /**
   * Current amount of validation points. This is used for rate limiting.
   * See https://docs.licensegate.io/restriction-options/rate-limit
   * @default null
   */
  validationPoints: number | null;

  /**
   * Maximum amount of validation points. This is used for rate limiting.
   * Set to null for no rate limiting.
   * See https://docs.licensegate.io/restriction-options/rate-limit
   * @isInt
   * @default null
   */
  validationLimit: number | null;

  /**
   * Amount of validation points to replenish every interval.
   * Set to null for no rate limiting.
   * See https://docs.licensegate.io/restriction-options/rate-limit
   * @isInt
   * @default null
   */
  replenishAmount: number | null;

  /**
   * Interval to replenish validation points.
   * Set to null for no rate limiting.
   * See https://docs.licensegate.io/restriction-options/rate-limit
   * @default null
   */
  replenishInterval: ReplenishInterval | null;

  /**
   * Date the license was created.
   */
  createdAt: Date;
}

/**
 * Data required to create a license.
 */
interface LicenseCreateInput
  extends Expand<
    Omit<License, "id" | "createdAt" | "userId" | "licenseKey"> & {
      /**
       * You can specify a custom license key, or one will be generated (UUIDv4).
       * If you specify a custom key, it must be unique.
       */
      licenseKey?: string;
    }
  > {}

/**
 * Data required to update a license.
 * Updates are partial, so all fields are optional.
 */
interface LicenseUpdateInput
  extends Expand<Partial<Omit<License, "id" | "createdAt" | "userId">>> {}

@Route("admin/licenses")
@Tags("Admin")
export class LicenseController extends Controller {
  licenseService!: LicenseService;

  constructor() {
    super();
    this.licenseService = Container.get(LicenseService);
  }

  /**
   * Create a new license.
   * @returns The newly created license.
   * @summary Create license
   */
  @Security("api_key")
  @Post()
  @SuccessResponse(201, "Created")
  @Response<ResponseError<"license-with-same-key-already-exists">>(
    "400",
    "License with same key already exists"
  )
  @Response<ResponseError<"unauthorized">>(401, "Unauthorized")
  @Response<ResponseError<"invalid-schema">>(422, "Invalid schema")
  public async create(
    @Request() request: Express.Request,
    @Body() requestBody: LicenseCreateInput
  ): Promise<License> {
    requestBody = licenseCreateSchema.parse(requestBody);

    return this.licenseService.create({
      license: requestBody,
      userId: request.user!.id,
    });
  }

  /**
   * Read a license by ID.
   * @param licenseId License ID.
   * @param includeLogs Include logs for this license.
   * @returns The license.
   * @summary Read license
   */
  @Security("api_key")
  @Get("{licenseId}")
  @Response<ResponseError<"not-found">>(404, "License not found")
  @Response<ResponseError<"unauthorized">>(401, "Unauthorized")
  @Response<ResponseError<"invalid-schema">>(422, "Invalid schema")
  public async read(
    @Request() request: Express.Request,
    @Path() licenseId: number,
    @Query() includeLogs?: boolean
  ): Promise<License> {
    return this.licenseService.read({
      licenseId,
      checkUserId: request.user!.id,
      includeLogs: includeLogs,
    });
  }

  /**
   * Read a license by its license key.
   * @param licenseKey License key.
   * @param includeLogs Include logs for this license.
   * @returns The license.
   * @summary Read license by license key
   */
  @Security("api_key")
  @Get("key/{licenseKey}")
  @Response<ResponseError<"not-found">>(404, "License not found")
  @Response<ResponseError<"unauthorized">>(401, "Unauthorized")
  @Response<ResponseError<"invalid-schema">>(422, "Invalid schema")
  public async readByLicenseKey(
    @Request() request: Express.Request,
    @Path() licenseKey: string,
    @Query() includeLogs?: boolean
  ): Promise<License> {
    return this.licenseService.readByLicenseKey({
      licenseKey,
      checkUserId: request.user!.id,
      includeLogs: includeLogs,
    });
  }

  /**
   * Update a license by ID.
   * @param licenseId License ID.
   * @returns The updated license.
   * @summary Update license
   */
  @Security("api_key")
  @Patch("{licenseId}")
  @Response<ResponseError<"not-found">>(404, "License not found")
  @Response<ResponseError<"unauthorized">>(401, "Unauthorized")
  @Response<ResponseError<"invalid-schema">>(422, "Invalid schema")
  public async update(
    @Request() request: Express.Request,
    @Path() licenseId: number,
    @Body() requestBody: LicenseUpdateInput
  ): Promise<License> {
    requestBody = licenseCreateSchema.partial().parse(requestBody);

    return this.licenseService.update({
      checkUserId: request.user!.id,
      license: {
        id: licenseId,
        ...requestBody,
      },
    });
  }

  /**
   * Delete a license by ID.
   * @param licenseId License ID.
   * @returns The deleted license.
   * @summary Delete license
   */
  @Security("api_key")
  @Delete("{licenseId}")
  @Response<ResponseError<"not-found">>(404, "License not found")
  @Response<ResponseError<"unauthorized">>(401, "Unauthorized")
  @Response<ResponseError<"invalid-schema">>(422, "Invalid schema")
  public async delete(
    @Request() request: Express.Request,
    @Path() licenseId: number
  ): Promise<License> {
    return this.licenseService.delete({
      checkUserId: request.user!.id,
      licenseId,
    });
  }

  /**
   * List licenses for the authenticated account.
   * @param take Number of licenses to take.
   * @isInt take
   * @param skip Number of licenses to skip.
   * @isInt skip
   * @param filterStatus Filter licenses by status.
   * @param includeLogs Include logs for each license.
   * @returns List of licenses and total count.
   * @security api_key
   * @summary List licenses
   */
  @Security("api_key")
  @Get()
  @Response<ResponseError<"unauthorized">>(401, "Unauthorized")
  @Response<ResponseError<"invalid-schema">>(422, "Invalid schema")
  public async list(
    @Request() request: Express.Request,
    @Query() take: number = 10,
    @Query() skip: number = 0,
    @Query() filterStatus?: "active" | "disabled/expired",
    @Query() includeLogs: boolean = false
  ): Promise<{
    licenses: License[];
    count: number;
  }> {
    return this.licenseService.list({
      take: take ?? 10,
      skip: skip ?? 0,
      filterStatus,
      userId: request.user!.id,
      includeLogs,
    });
  }
}
