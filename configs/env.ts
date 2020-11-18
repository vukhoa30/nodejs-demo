import dotenv from 'dotenv';

dotenv.config()

export const DB_DIALECT = process.env.DB_DIALECT || 'pg';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_NAME = process.env.DB_NAME || 'football_demo';
export const DB_NAME_TEST = process.env.DB_NAME_TEST || 'football_demo_test';
export const APP_PORT = process.env.APP_PORT || 3000;
export const PER_PAGE = Number(process.env.PER_PAGE) || 10;
export const ENV = process.env.NODE_ENV;
