import {Prisma} from "@prisma/client";
import {randomUUID} from "crypto";
import {Service} from "typedi";
import {prisma} from "../prisma";
import {
  DeviceListInput,
} from "../routers/device-schema";
import {ShowError} from "../utils/ShowError";
import {DeviceCreateInput} from "../routers/device-schema";

const INCLUDE_LAST_7_DAYS_LOGS: Prisma.DeviceInclude = {
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
export class DeviceService {
  async create({
                 device,
                 licenseId,
                 userId,
               }: {
    device: DeviceCreateInput;
    licenseId: number;
    userId: number;
  }) {
    const deviceId = device.deviceId;

    try {
      return await prisma.device.create({
        data: {
          ...device,
          userId: userId,
          licenseId: licenseId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ShowError(
            "Device with same ID already exists",
            "device-with-same-id-already-exists"
          );
        }
      }

      throw e;
    }
  }

  async read({
               deviceId,
               checkUserId,
               includeLogs,
             }: {
    deviceId: string;
    checkUserId?: number;
    includeLogs?: boolean;
  }) {
    const device = await prisma.device.findFirst({
      where: {
        deviceId: deviceId,
        ...(checkUserId !== undefined && {userId: checkUserId}),
      },
      include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
    });

    if (!device) {
      throw new ShowError("Device not found", "not-found");
    }

    return device;
  }

  async readByLicenseId({
                          licenseId,
                          checkUserId,
                          includeLogs,
                        }: {
    licenseId: number;
    checkUserId?: number;
    includeLogs?: boolean;
  }) {
    const device = await prisma.device.findFirst({
      where: {
        licenseId,
        ...(checkUserId !== undefined && {userId: checkUserId}),
      },
      include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
    });

    if (!device) {
      throw new ShowError("Device not found", "not-found");
    }

    return device;
  }

  async update({
                 device,
                 checkUserId,
                 includeLogs,
               }: {
    device: Partial<DeviceCreateInput> & { deviceId: string };
    checkUserId?: number;
    includeLogs?: boolean;
  }) {
    const existingDevice = await prisma.device.findFirst({
      where: {
        deviceId: device.deviceId,
        ...(checkUserId !== undefined && {userId: checkUserId}),
      },
      select: {deviceId: true},
    });

    if (!existingDevice) {
      throw new ShowError("Device not found", "not-found");
    }

    return await prisma.device.update({
      include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
      where: {
        deviceId: device.deviceId,
      },
      data: device,
    });
  }

  async delete({
                 deviceId,
                 checkUserId,
                 includeLogs,
               }: {
    deviceId: string;
    checkUserId?: number;
    includeLogs?: boolean;
  }) {
    const device = await prisma.device.findFirst({
      where: {
        deviceId: deviceId,
        ...(checkUserId !== undefined && {userId: checkUserId}),
      },
    });

    if (!device) {
      throw new ShowError("Device not found", "not-found");
    }

    return await prisma.device.delete({
      include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
      where: {
        deviceId: deviceId,
      },
    });
  }

  async countActive({userId}: { userId: number }) {
    return await prisma.device.count({
      where: {
        userId: userId,
        isActive: true,
      },
    });
  }

  async list({
               take,
               skip,
               filterStatus,
               userId,
               includeLogs,
             }: DeviceListInput & { userId?: number; includeLogs?: boolean }) {
    const where: Prisma.DeviceWhereInput =
      userId !== undefined ? {userId} : {};

    if (filterStatus == "active") {
      where.isActive = true;
    } else if (filterStatus == "disabled/expired") {
      where.OR = [
        {
          isActive: false,
        },
      ];
    }

    const [devices, count] = await Promise.all([
      prisma.device.findMany({
        where,
        take: take,
        skip: skip,
        include: includeLogs ? INCLUDE_LAST_7_DAYS_LOGS : undefined,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.device.count({where}),
    ]);

    return {
      devices,
      count,
    };
  }
}
