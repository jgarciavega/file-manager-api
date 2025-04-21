// app/api/usuarios/route.js
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const usuarios = await prisma.usuarios.findMany();

    console.log("Usuarios en la base de datos:", usuarios);

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los usuarios" },
      { status: 500 }
    );
  }
}
