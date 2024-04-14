import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { Service } from "typedi";
import { prisma } from "../prisma";
import {
  LicenseCreateInput,
  LicenseListInput,
} from "../routers/license-schema";
import { ShowError } from "../utils/ShowError";

const INCLUDE_LAST_7_DAYS_LOGS: Prisma.LicenseInclude = {
  logs: {
    where: {
      timestamp: {
        gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 50,
  },
};

@Service()
export class LicenseService {
  async create({
    license,
    userId,
  }: {
    license: LicenseCreateInput;
    userId: number;
  }) {
    const licenseKey = license.licenseKey || randomUUID();

    try {
      return await prisma.license.create({
        data: {
          ...license,
          userId: userId,
          licenseKey,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ShowError(
            "License with same key already exists",
            "license-with-same-key-already-exists"
          );
        }
      }

      throw e;
    }
  }

  async read({
    licenseId,
    checkUserId,
    includeLogs,
  }: {
    licenseId: number;
    checkUserId?: number;
    includeLogs?: boolean;
  }) {
    const license = await prisma.license.findFirst({
      where: {
        id: licenseId,
        ...(checkUserId !== undefined && { userId: checkUserId }),
      },
      include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
    });

    if (!license) {
      throw new ShowError("License not found", "not-found");
    }

    return license;
  }

  async readByLicenseKey({
    licenseKey,
    checkUserId,
    includeLogs,
  }: {
    licenseKey: string;
    checkUserId?: number;
    includeLogs?: boolean;
  }) {
    const license = await prisma.license.findFirst({
      where: {
        licenseKey,
        ...(checkUserId !== undefined && { userId: checkUserId }),
      },
      include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
    });

    if (!license) {
      throw new ShowError("License not found", "not-found");
    }

    return license;
  }

  async update({
    license,
    checkUserId,
    includeLogs,
  }: {
    license: Partial<LicenseCreateInput> & { id: number };
    checkUserId?: number;
    includeLogs?: boolean;
  }) {
    const existingLicense = await prisma.license.findFirst({
      where: {
        id: license.id,
        ...(checkUserId !== undefined && { userId: checkUserId }),
      },
      select: { id: true },
    });

    if (!existingLicense) {
      throw new ShowError("License not found", "not-found");
    }

    return await prisma.license.update({
      include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
      where: {
        id: license.id,
      },
      data: license,
    });
  }

  async delete({
    licenseId,
    checkUserId,
    includeLogs,
  }: {
    licenseId: number;
    checkUserId?: number;
    includeLogs?: boolean;
  }) {
    const license = await prisma.license.findFirst({
      where: {
        id: licenseId,
        ...(checkUserId !== undefined && { userId: checkUserId }),
      },
    });

    if (!license) {
      throw new ShowError("License not found", "not-found");
    }

    return await prisma.license.delete({
      include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
      where: {
        id: licenseId,
      },
    });
  }

  async countActive({ userId }: { userId: number }) {
    return await prisma.license.count({
      where: {
        userId: userId,
        OR: [
          {
            expirationDate: {
              gt: new Date(),
            },
          },
          {
            expirationDate: null,
          },
        ],
        active: true,
      },
    });
  }

  async list({
    take,
    skip,
    filterStatus,
    userId,
    includeLogs,
  }: LicenseListInput & { userId?: number; includeLogs?: boolean }) {
    const where: Prisma.LicenseWhereInput =
      userId !== undefined ? { userId } : {};

    if (filterStatus == "active") {
      where.OR = [
        {
          expirationDate: {
            gt: new Date(),
          },
        },
        {
          expirationDate: null,
        },
      ];
      where.active = true;
    } else if (filterStatus == "disabled/expired") {
      where.OR = [
        {
          expirationDate: {
            lt: new Date(),
          },
        },
        {
          active: false,
        },
      ];
    }

    const [licenses, count] = await Promise.all([
      prisma.license.findMany({
        where,
        take: take,
        skip: skip,
        include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.license.count({ where }),
    ]);

    return {
      licenses,
      count,
    };
  }
}
