import mysql, { Connection } from "mysql2/promise";
import dotenv from "dotenv";
import { hashPassword } from "../utils";
import { insertVehicles } from "./addVeicoli";

//dotenv.config({ path: '../../.env' });
dotenv.config();


export const InitializingDB = async () => {
    const rootConnection: Connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_ROOT_USER,
        password: process.env.DB_ROOT_PASSWORD,
        multipleStatements: true,
    });

    try {
        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        await rootConnection.query(`USE ${process.env.DB_NAME};`);

        const initQueries = `
            CREATE USER IF NOT EXISTS '${process.env.DB_USER}'@'%' IDENTIFIED BY '${process.env.DB_USER_PASSWORD}';
            GRANT SELECT, INSERT, UPDATE, DELETE ON ${process.env.DB_NAME}.* TO '${process.env.DB_USER}'@'%';
            FLUSH PRIVILEGES;

            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                username VARCHAR(30) DEFAULT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                last_sign_in_at DATETIME DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                banned TINYINT(1) NOT NULL DEFAULT '0',
                PRIMARY KEY (id),
                UNIQUE KEY email_UNIQUE (email),
                UNIQUE KEY username_UNIQUE (username)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

            CREATE TABLE IF NOT EXISTS user_roles (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                user_id CHAR(36) NOT NULL,
                role VARCHAR(10) DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

            CREATE TABLE IF NOT EXISTS profiles (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                email VARCHAR(255) NOT NULL,                
                username VARCHAR(30) NOT NULL,
                nome VARCHAR(50) DEFAULT NULL,
                cognome VARCHAR(50) DEFAULT NULL,
                image TEXT,
                cellulare VARCHAR(15) DEFAULT NULL,
                telefono VARCHAR(15) DEFAULT NULL,
                citta VARCHAR(50) DEFAULT NULL,
                via VARCHAR(100) DEFAULT NULL,
                cap VARCHAR(5) DEFAULT NULL,
                provincia VARCHAR(3) DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

            CREATE TABLE IF NOT EXISTS session (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                user_id CHAR(36) NOT NULL,
                refresh_token VARCHAR(255) DEFAULT NULL,
                refresh_token_exp DATETIME DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

            CREATE TABLE IF NOT EXISTS veicoli (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                brand VARCHAR(20) NOT NULL,
                modello VARCHAR(20) NOT NULL,
                tipo VARCHAR(10) NOT NULL,
                anno SMALLINT UNSIGNED NOT NULL,
                kilometri MEDIUMINT UNSIGNED NOT NULL,
                alimentazione VARCHAR(10) NOT NULL,
                prezzo MEDIUMINT UNSIGNED NOT NULL,
                stato VARCHAR(10) NOT NULL,
                image TEXT,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

            -- inizio stored procedures per FOREIGN KEY 
            -- Per user_roles
            DROP PROCEDURE IF EXISTS add_fk_user_roles;
            CREATE PROCEDURE add_fk_user_roles()
            BEGIN
                IF NOT EXISTS (
                    SELECT * FROM information_schema.table_constraints 
                    WHERE constraint_schema = DATABASE()
                    AND table_name = 'user_roles'
                    AND constraint_name = 'fk_user_roles_user_id'
                ) THEN
                    ALTER TABLE user_roles
                    ADD CONSTRAINT fk_user_roles_user_id
                    FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE ON UPDATE CASCADE;
                END IF;
            END;
            CALL add_fk_user_roles();
            DROP PROCEDURE IF EXISTS add_fk_user_roles;

            -- Per session
            DROP PROCEDURE IF EXISTS add_fk_session;
            CREATE PROCEDURE add_fk_session()
            BEGIN
                IF NOT EXISTS (
                    SELECT * FROM information_schema.table_constraints 
                    WHERE constraint_schema = DATABASE()
                    AND table_name = 'session'
                    AND constraint_name = 'fk_session_user_id'
                ) THEN
                    ALTER TABLE session
                    ADD CONSTRAINT fk_session_user_id
                    FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE ON UPDATE CASCADE;
                END IF;
            END;
            CALL add_fk_session();
            DROP PROCEDURE IF EXISTS add_fk_session;

            -- Per profiles
            DROP PROCEDURE IF EXISTS add_fk_profiles;            
            CREATE PROCEDURE add_fk_profiles()
            BEGIN
                IF NOT EXISTS (
                    SELECT * FROM information_schema.table_constraints 
                    WHERE constraint_schema = DATABASE()
                    AND table_name = 'profiles'
                    AND constraint_name = 'fk_profiles_user_email'
                ) THEN
                    ALTER TABLE profiles
                    ADD CONSTRAINT fk_profiles_user_email
                    FOREIGN KEY (email) REFERENCES users(email)
                    ON DELETE CASCADE ON UPDATE CASCADE;
                END IF;
            END;
            CALL add_fk_profiles();
            DROP PROCEDURE IF EXISTS add_fk_profiles;

            -- fine stored procedures per FOREIGN KEY 
             
            CREATE TRIGGER IF NOT EXISTS after_user_insert_role
            AFTER INSERT ON users
            FOR EACH ROW
            BEGIN
                DECLARE role_to_insert VARCHAR(10);
                SET role_to_insert = IFNULL(@default_role, 'USER');
                INSERT INTO user_roles (user_id, role) 
                VALUES (NEW.id, role_to_insert);
            END;

            CREATE TRIGGER IF NOT EXISTS handle_create_profile
            AFTER INSERT ON users
            FOR EACH ROW
            BEGIN
                INSERT INTO profiles (email, username) 
                VALUES (NEW.email, NEW.username);
            END;
             
            CREATE TRIGGER IF NOT EXISTS after_user_insert_session
            AFTER INSERT ON users
            FOR EACH ROW
            BEGIN
                INSERT INTO session (user_id) 
                VALUES (NEW.id);
            END;
        `;

        await rootConnection.query(initQueries);

        const password = process.env.SUPERADMIN_PASSWORD || 'admin.Password25';
        const hashedPassword = await hashPassword(password);
       
        const adminSetup = `
            SET @default_role = 'SUPERADMIN';
        
            INSERT INTO users (email, username, password) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE id = id;
        
            SET @default_role = NULL;
        `;
        await rootConnection.query(adminSetup, [
            process.env.SUPERADMIN_EMAIL,
            process.env.SUPERADMIN_USERNAME,
            hashedPassword
        ]);

        console.log("Database e utente inizializzati con successo.");
        await insertVehicles(rootConnection)

    } catch (error) {
        console.error("Errore durante l'inizializzazione del database:", error);
        throw error;
    } finally {
        await rootConnection.end();
    }
};
