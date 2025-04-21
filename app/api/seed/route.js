// app/api/seed/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    // 1. DEPARTAMENTOS
    await prisma.departamentos.createMany({
      data: [
        { nombre: 'Contraloría', descripcion: 'Departamento de control interno' },
        { nombre: 'Planeación', descripcion: 'Departamento de planificación' },
      ],
      skipDuplicates: true,
    });

    // 2. ROLES
    await prisma.roles.createMany({
      data: [
        { tipo: 'admin', descripcion: 'Administrador del sistema' },
        { tipo: 'capturista', descripcion: 'Usuario que sube documentos' },
        { tipo: 'revisor', descripcion: 'Usuario que revisa documentos' },
      ],
      skipDuplicates: true,
    });

    // 3. USUARIOS
    const existingUsers = await prisma.usuarios.findMany({
      where: {
        email: { in: ['jorge.garcia@apibcs.com.mx', 'annel@apibcs.com.mx'] },
      },
    });

    let usuarioJorge, usuarioAna;

    if (existingUsers.length === 0) {
      const hashedPasswordJorge = await bcrypt.hash('123456', 10);
      const hashedPasswordAna = await bcrypt.hash('123456', 10);

      await prisma.usuarios.createMany({
        data: [
          {
            nombre: 'Jorge',
            apellidos: 'García',
            email: 'jorge.garcia@apibcs.com.mx',
            password: hashedPasswordJorge,
            departamentos_id: 1,
          },
          {
            nombre: 'Ana',
            apellidos: 'Torres',
            email: 'annel@apibcs.com.mx',
            password: hashedPasswordAna,
            departamentos_id: 2,
          },
        ],
      });
    }

    usuarioJorge = await prisma.usuarios.findUnique({ where: { email: 'jorge.garcia@apibcs.com.mx' } });
    usuarioAna = await prisma.usuarios.findUnique({ where: { email: 'annel@apibcs.com.mx' } });

    const roles = await prisma.roles.findMany();
    const rolAdmin = roles.find(r => r.tipo === 'admin');
    const rolRevisor = roles.find(r => r.tipo === 'revisor');

    if (usuarioJorge && usuarioAna && rolAdmin && rolRevisor) {
      const relaciones = await prisma.usuarios_has_roles.findMany({
        where: {
          OR: [
            { usuarios_id: usuarioJorge.id, roles_id: rolAdmin.id },
            { usuarios_id: usuarioAna.id, roles_id: rolRevisor.id },
          ],
        },
      });

      const nuevasRelaciones = [];
      if (!relaciones.some(r => r.usuarios_id === usuarioJorge.id && r.roles_id === rolAdmin.id)) {
        nuevasRelaciones.push({ usuarios_id: usuarioJorge.id, roles_id: rolAdmin.id });
      }
      if (!relaciones.some(r => r.usuarios_id === usuarioAna.id && r.roles_id === rolRevisor.id)) {
        nuevasRelaciones.push({ usuarios_id: usuarioAna.id, roles_id: rolRevisor.id });
      }

      if (nuevasRelaciones.length > 0) {
        await prisma.usuarios_has_roles.createMany({ data: nuevasRelaciones });
      }
    }

    // 5. TIPOS_DOCUMENTOS
    await prisma.tipos_documentos.createMany({
      data: [
        { tipo: 'Informe' },
        { tipo: 'Oficio' },
        { tipo: 'Circular' },
      ],
      skipDuplicates: true,
    });

    // 6. DOCUMENTOS
    await prisma.documentos.createMany({
      data: [
        {
          nombre: 'Informe Trimestral',
          descripcion: 'Informe financiero Q1',
          mime: 'application/pdf',
          ruta: '/docs/doc1.pdf',
          tipos_documentos_id: 1,
          usuarios_id: usuarioJorge?.id || 1,
        },
        {
          nombre: 'Oficio Externo',
          descripcion: 'Oficio enviado a proveedores',
          mime: 'application/pdf',
          ruta: '/docs/doc2.pdf',
          tipos_documentos_id: 2,
          usuarios_id: usuarioAna?.id || 2,
        },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({ message: 'Datos insertados con éxito ✅' });
  } catch (error) {
    console.error('Error en el seed:', error);
    return NextResponse.json({ error: 'Ocurrió un error al insertar datos.' }, { status: 500 });
  }
}
