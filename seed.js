const { MongoClient, ObjectId } = require('mongodb');

// Connection URL and Database Name
const uri = 'mongodb+srv://gondaleditz3519_db_user:R3ev8eTDPdf9T14B@cluster0.7lggwlw.mongodb.net/?appName=Cluster0';
const dbName = 'test'; // Spring Boot default database is 'test' unless specified in connection string

// Pre-calculated bcrypt hash for password 'password123'
const PASSWORD_HASH = '$2a$10$gR5x2r2dM7E/1rQxN4G6f.tD5v55d49W.l0l7qC/W/5tYVw2o0cve';

async function main() {
    const client = new MongoClient(uri);

    try {
        console.log('Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('Connected successfully!');
        const db = client.db(dbName);

        // Clear existing collections
        console.log('Clearing existing data...');
        await db.collection('organizations').deleteMany({});
        await db.collection('users').deleteMany({});
        await db.collection('categories').deleteMany({});
        await db.collection('complaints').deleteMany({});
        await db.collection('complaint_histories').deleteMany({});

        // 1. Seed Organizations
        console.log('Seeding organizations...');
        const orgAcmeId = new ObjectId();
        const orgGlobexId = new ObjectId();

        const orgs = [
            {
                _id: orgAcmeId,
                name: 'Acme Corp',
                orgCode: 'ORG-ACME',
                address: '123 Industrial Way, Silicon Valley',
                contactEmail: 'contact@acme.com',
                createdAt: new Date(),
                _class: 'com.scms.model.Organization'
            },
            {
                _id: orgGlobexId,
                name: 'Globex Corp',
                orgCode: 'ORG-GLOBEX',
                address: '456 Cyber Road, Tech City',
                contactEmail: 'contact@globex.com',
                createdAt: new Date(),
                _class: 'com.scms.model.Organization'
            }
        ];
        await db.collection('organizations').insertMany(orgs);

        // 2. Seed Categories
        console.log('Seeding categories...');
        const catItId = new ObjectId();
        const catFacilitiesId = new ObjectId();

        const categories = [
            {
                _id: catItId,
                name: 'IT Support',
                description: 'Technical issues related to internet, hardware, software.',
                organization: { $ref: 'organizations', $id: orgAcmeId },
                _class: 'com.scms.model.Category'
            },
            {
                _id: catFacilitiesId,
                name: 'Facilities & Maintenance',
                description: 'Maintenance, cleanliness, repairs.',
                organization: { $ref: 'organizations', $id: orgAcmeId },
                _class: 'com.scms.model.Category'
            }
        ];
        await db.collection('categories').insertMany(categories);

        // 3. Seed Users
        console.log('Seeding users...');
        const superAdminId = new ObjectId();
        const adminId = new ObjectId();
        const staffId = new ObjectId();
        const userId = new ObjectId();

        const users = [
            {
                _id: superAdminId,
                name: 'Super Admin User',
                email: 'super@scms.com',
                password: PASSWORD_HASH,
                employeeId: 'EMP-SUPER',
                role: 'SUPER_ADMIN',
                createdAt: new Date(),
                _class: 'com.scms.model.User'
            },
            {
                _id: adminId,
                name: 'Acme Admin',
                email: 'admin@acme.com',
                password: PASSWORD_HASH,
                employeeId: 'EMP-ADMIN-1',
                role: 'ADMIN',
                organization: { $ref: 'organizations', $id: orgAcmeId },
                createdAt: new Date(),
                _class: 'com.scms.model.User'
            },
            {
                _id: staffId,
                name: 'John Staff',
                email: 'staff@acme.com',
                password: PASSWORD_HASH,
                employeeId: 'EMP-STAFF-1',
                role: 'STAFF',
                organization: { $ref: 'organizations', $id: orgAcmeId },
                createdAt: new Date(),
                _class: 'com.scms.model.User'
            },
            {
                _id: userId,
                name: 'Jane User',
                email: 'user@acme.com',
                password: PASSWORD_HASH,
                employeeId: 'EMP-USER-1',
                role: 'USER',
                organization: { $ref: 'organizations', $id: orgAcmeId },
                createdAt: new Date(),
                _class: 'com.scms.model.User'
            }
        ];
        await db.collection('users').insertMany(users);

        // 4. Seed Complaints
        console.log('Seeding complaints...');
        const complaints = [
            {
                _id: new ObjectId(),
                title: 'WiFi Outage in Wing B',
                description: 'The wireless network in wing B has been completely down since 9:00 AM.',
                status: 'PENDING',
                priority: 'HIGH',
                user: { $ref: 'users', $id: userId },
                category: { $ref: 'categories', $id: catItId },
                organization: { $ref: 'organizations', $id: orgAcmeId },
                createdAt: new Date(),
                updatedAt: new Date(),
                _class: 'com.scms.model.Complaint'
            },
            {
                _id: new ObjectId(),
                title: 'Broken AC in Room 204',
                description: 'The air conditioner in Room 204 is leaking water and not cooling.',
                status: 'IN_PROGRESS',
                priority: 'MEDIUM',
                user: { $ref: 'users', $id: userId },
                assignedTo: { $ref: 'users', $id: staffId },
                category: { $ref: 'categories', $id: catFacilitiesId },
                organization: { $ref: 'organizations', $id: orgAcmeId },
                createdAt: new Date(),
                updatedAt: new Date(),
                _class: 'com.scms.model.Complaint'
            }
        ];
        await db.collection('complaints').insertMany(complaints);

        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await client.close();
    }
}

main();
