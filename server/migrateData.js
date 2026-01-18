const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const Interaction = require('./models/Interaction');
const KnowledgeBase = require('./models/KnowledgeBase');
const Assessment = require('./models/Assessment');
const Career = require('./models/Career');
const Program = require('./models/Program');

const connectDB = require('./config/db');

const migrate = async () => {
    await connectDB();

    const dataDir = path.join(__dirname, 'data');

    // 1. Migrate Users
    const usersPath = path.join(dataDir, 'users.json');
    if (fs.existsSync(usersPath)) {
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        for (const u of users) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create({
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    password: u.password,
                    studentId: u.studentId,
                    program: u.program,
                    role: u.role || 'student'
                });
            }
        }
        console.log('[MIGRATE] Users migrated.');
    }

    // 2. Migrate Interactions
    const interactionsPath = path.join(dataDir, 'interactions.json');
    if (fs.existsSync(interactionsPath)) {
        const interactions = JSON.parse(fs.readFileSync(interactionsPath, 'utf8'));
        for (const i of interactions) {
            // Find user to get new MongoDB ID if possible, or just keep old string for now
            const user = await User.findOne({ email: i.userEmail }); // Assuming we might have email link, but we don't.
            // Just use the old ID string for now if it doesn't match a new user
            await Interaction.create({
                userId: i.userId,
                program: i.program,
                userMessage: i.userMessage,
                botResponse: i.botResponse,
                topic: i.topic,
                sentiment: i.sentiment,
                resolved: i.resolved,
                timestamp: i.timestamp
            });
        }
        console.log('[MIGRATE] Interactions migrated.');
    }

    // 3. Migrate KnowledgeBase
    const kbPath = path.join(dataDir, 'knowledgeBase.json');
    if (fs.existsSync(kbPath)) {
        const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
        await KnowledgeBase.deleteMany({}); // Clear and refill
        await KnowledgeBase.insertMany(kb.map(entry => ({
            intent: entry.intent,
            keywords: entry.keywords,
            response: entry.response,
            category: entry.category
        })));
        console.log('[MIGRATE] Knowledge Base migrated.');
    }

    // 4. Migrate Assessments
    const assessmentsPath = path.join(dataDir, 'assessments.json');
    if (fs.existsSync(assessmentsPath)) {
        const assessments = JSON.parse(fs.readFileSync(assessmentsPath, 'utf8'));
        await Assessment.deleteMany({});
        await Assessment.insertMany(assessments.map(a => ({
            title: a.title,
            description: a.description,
            questions: a.questions
        })));
        console.log('[MIGRATE] Assessments migrated.');
    }

    // 5. Migrate Careers
    const careersPath = path.join(dataDir, 'careers.json');
    if (fs.existsSync(careersPath)) {
        const careers = JSON.parse(fs.readFileSync(careersPath, 'utf8'));
        await Career.deleteMany({});
        await Career.insertMany(careers.map(c => ({
            title: c.title,
            description: c.description,
            outlook: c.outlook,
            education: c.education,
            salary: c.salary,
            category: c.category
        })));
        console.log('[MIGRATE] Careers migrated.');
    }

    // 6. Migrate Programs
    const programsPath = path.join(dataDir, 'programs.json');
    if (fs.existsSync(programsPath)) {
        const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));
        await Program.deleteMany({});
        await Program.insertMany(programs.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            courses: p.courses
        })));
        console.log('[MIGRATE] Programs migrated.');
    }

    console.log('[MIGRATE] Migration complete. Press Ctrl+C to exit.');
};

migrate().catch(err => {
    console.error('[MIGRATE] Error:', err);
    process.exit(1);
});
