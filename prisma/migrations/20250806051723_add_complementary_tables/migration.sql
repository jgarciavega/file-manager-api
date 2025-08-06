-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NULL,
    `apellidos` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `departamentos_id` INTEGER NULL,
    `activo` INTEGER NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NULL,
    `descripcion` VARCHAR(191) NULL,
    `mime` VARCHAR(191) NULL,
    `ruta` VARCHAR(191) NULL,
    `tipos_documentos_id` INTEGER NULL,
    `usuarios_id` INTEGER NULL,
    `fecha_subida` DATETIME(3) NULL,
    `serieId` INTEGER NULL,
    `subserieId` INTEGER NULL,
    `expedienteId` INTEGER NULL,

    INDEX `tipos_documentos_id`(`tipos_documentos_id`),
    INDEX `usuarios_id`(`usuarios_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SerieDocumental` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubserieDocumental` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `serieId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expediente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transferencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentoId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `observaciones` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VersionDocumento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentoId` INTEGER NOT NULL,
    `version` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `ruta` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrestamoDocumento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `fechaPrestamo` DATETIME(3) NOT NULL,
    `fechaDevolucion` DATETIME(3) NULL,
    `observaciones` VARCHAR(191) NULL,

    INDEX `PrestamoDocumento_documentoId_idx`(`documentoId`),
    INDEX `PrestamoDocumento_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoritos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documento_id` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuario_id` INTEGER NOT NULL,

    INDEX `favoritos_documento_id_fkey`(`documento_id`),
    UNIQUE INDEX `favoritos_usuario_id_documento_id_key`(`usuario_id`, `documento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NULL,
    `descripcion` VARCHAR(191) NULL,
    `activo` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periodos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `periodo` VARCHAR(191) NULL,
    `fecha_inicio` DATETIME(3) NULL,
    `fecha_final` DATETIME(3) NULL,
    `activo` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procesos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estatus` ENUM('en_proceso', 'terminado') NOT NULL,
    `resultado` ENUM('aprobado', 'rechazado', 'en_revision') NULL,
    `fecha_inicio` DATETIME(3) NULL,
    `fecha_fin` DATETIME(3) NULL,
    `departamentos_id` INTEGER NULL,
    `periodos_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('admin', 'capturista', 'revisor') NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `activo` BOOLEAN NULL,
    `fecha_creacion` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_has_roles` (
    `usuarios_id` INTEGER NOT NULL,
    `roles_id` INTEGER NOT NULL,

    INDEX `usuarios_has_roles_roles_id_fkey`(`roles_id`),
    PRIMARY KEY (`usuarios_id`, `roles_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bitacora` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NULL,
    `rol` VARCHAR(191) NULL,
    `accion` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `descripcion` VARCHAR(191) NULL,
    `fecha_inicio` DATETIME(3) NULL,
    `fecha_act` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_tipos_documentos_id_fkey` FOREIGN KEY (`tipos_documentos_id`) REFERENCES `tipos_documentos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_serieId_fkey` FOREIGN KEY (`serieId`) REFERENCES `SerieDocumental`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_subserieId_fkey` FOREIGN KEY (`subserieId`) REFERENCES `SubserieDocumental`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_expedienteId_fkey` FOREIGN KEY (`expedienteId`) REFERENCES `Expediente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubserieDocumental` ADD CONSTRAINT `SubserieDocumental_serieId_fkey` FOREIGN KEY (`serieId`) REFERENCES `SerieDocumental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transferencia` ADD CONSTRAINT `Transferencia_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `documentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transferencia` ADD CONSTRAINT `Transferencia_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VersionDocumento` ADD CONSTRAINT `VersionDocumento_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `documentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VersionDocumento` ADD CONSTRAINT `VersionDocumento_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrestamoDocumento` ADD CONSTRAINT `PrestamoDocumento_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `documentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrestamoDocumento` ADD CONSTRAINT `PrestamoDocumento_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_documento_id_fkey` FOREIGN KEY (`documento_id`) REFERENCES `documentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_has_roles` ADD CONSTRAINT `usuarios_has_roles_roles_id_fkey` FOREIGN KEY (`roles_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_has_roles` ADD CONSTRAINT `usuarios_has_roles_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
