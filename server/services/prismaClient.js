// prismaClient.js — Creates a single Prisma database connection
// In Prisma 7, we need to use a database adapter (driver adapter)
// This is the new way Prisma connects to databases

const { PrismaClient } = require('@prisma/client');
// PrismaClient is the main class we use to query the database

const { PrismaPg } = require('@prisma/adapter-pg');
// PrismaPg is the PostgreSQL adapter for Prisma 7
// It acts as a bridge between PrismaClient and PostgreSQL

// ─── CREATE DATABASE CONNECTION ───────────────────────────────────────────────

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// PrismaPg creates a PostgreSQL connection pool using our DATABASE_URL
// A connection pool means multiple connections are kept ready
// so the database responds faster — reuses connections instead of creating new ones each time

const prisma = new PrismaClient({ adapter });
// Create the Prisma client and pass the adapter to it
// This is the Prisma 7 way of connecting to a database

module.exports = prisma;
// Export so any file can import and use it
// Example: const prisma = require('./services/prismaClient')
//          await prisma.analysis.create({...})
