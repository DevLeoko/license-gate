-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `isEmailVerified` BOOLEAN NOT NULL,
    `passwordHash` VARCHAR(191) NULL,
    `refreshSession` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `marketingEmails` BOOLEAN NOT NULL DEFAULT false,
    `rsaPublicKey` TEXT NOT NULL,
    `rsaPrivateKey` TEXT NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `License` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `userId` INTEGER NOT NULL,
    `licenseKey` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `notes` TEXT NOT NULL,
    `ipLimit` INTEGER NULL,
    `licenseScope` VARCHAR(191) NULL,
    `expirationDate` DATETIME(3) NULL,
    `validationPoints` INTEGER NULL,
    `validationLimit` INTEGER NULL,
    `replenishAmount` INTEGER NULL,
    `replenishInterval` ENUM('TEN_SECONDS', 'MINUTE', 'HOUR', 'DAY') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `License_userId_licenseKey_key`(`userId`, `licenseKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `licenseId` INTEGER NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `result` ENUM('VALID', 'NOT_FOUND', 'NOT_ACTIVE', 'EXPIRED', 'LICENSE_SCOPE_FAILED', 'IP_LIMIT_EXCEEDED', 'RATE_LIMIT_EXCEEDED') NOT NULL,
    `metadata` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `License` ADD CONSTRAINT `License_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_licenseId_fkey` FOREIGN KEY (`licenseId`) REFERENCES `License`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

