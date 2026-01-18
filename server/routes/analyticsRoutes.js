const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const router = express.Router();

const interactionsFilePath = path.join(__dirname, '../data/interactions.json');

const getInteractions = () => {
    if (!fs.existsSync(interactionsFilePath)) return [];
    try {
        const data = fs.readFileSync(interactionsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

router.get('/', (req, res) => {
    const interactions = getInteractions();

    // 1. Total Interactions
    const totalInteractions = interactions.length;

    // 2. Topic Breakdown
    const topicBreakdown = interactions.reduce((acc, curr) => {
        acc[curr.topic] = (acc[curr.topic] || 0) + 1;
        return acc;
    }, {});

    // 3. Recent Activity (Last 5)
    const recentActivity = interactions.slice(-5).reverse();

    // 4. Active Users (Unique IDs in last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = new Set(
        interactions
            .filter(i => new Date(i.timestamp) > oneDayAgo && i.userId)
            .map(i => i.userId)
    ).size;

    // 5. Peak User Times (Hour of day)
    const hours = interactions.map(i => new Date(i.timestamp).getHours());
    const hourCounts = hours.reduce((acc, h) => { acc[h] = (acc[h] || 0) + 1; return acc; }, {});
    const peakHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b, 0);

    // 6. Sentiment Analysis
    const sentimentAnalysis = interactions.reduce((acc, curr) => {
        const s = curr.sentiment || 'Neutral';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    // 7. Demographics (Program)
    const demographics = interactions.reduce((acc, curr) => {
        const p = curr.program || 'Unknown';
        acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {});

    // 8. Unresolved Intents
    // We consider it unresolved if resolved=false or topic=general (unless it was just a greeting)
    const unresolvedIntents = interactions.filter(i => !i.resolved && i.topic !== 'general').length;

    res.send({
        totalInteractions,
        activeUsers,
        peakTime: `${peakHour}:00 - ${parseInt(peakHour) + 1}:00`,
        unresolvedIntents,
        topicBreakdown,
        sentimentAnalysis,
        demographics,
        recentActivity
    });
});

router.get('/export', (req, res) => {
    const interactions = getInteractions();

    // Generate CSV
    const header = "ID,Timestamp,UserID,Program,UserMessage,BotResponse,Topic,Sentiment,Resolved\n";
    const rows = interactions.map(i => {
        // Escape quotes and commas for CSV
        const safe = (text) => `"${(text || '').replace(/"/g, '""')}"`;
        return [
            i.id,
            i.timestamp,
            i.userId || 'Anonymous',
            i.program || 'Unknown',
            safe(i.userMessage),
            safe(i.botResponse),
            i.topic,
            i.sentiment || 'Neutral',
            i.resolved ? 'Yes' : 'No'
        ].join(',');
    }).join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('analytics_report.csv');
    res.send(header + rows);
});

router.get('/export-pdf', (req, res) => {
    const interactions = getInteractions();
    const doc = new PDFDocument({ margin: 50 });

    let filename = `Analytics_Report_${Date.now()}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    // Title & Header
    doc.fillColor("#444444").fontSize(20).text("AI Guidance - Analytics Report", { align: "center" });
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown(2);

    // Summary Section
    doc.fillColor("#667eea").fontSize(14).text("System Summary", { underline: true });
    doc.moveDown(0.5);
    doc.fillColor("#333333").fontSize(11);

    const totalInteractions = interactions.length;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = new Set(interactions.filter(i => new Date(i.timestamp) > oneDayAgo).map(i => i.userId)).size;
    const unresolved = interactions.filter(i => !i.resolved).length;

    doc.text(`Total Interactions: ${totalInteractions}`);
    doc.text(`Active Users (24h): ${activeUsers}`);
    doc.text(`Unresolved Queries: ${unresolved}`);
    doc.moveDown(2);

    // Activity Table Header
    doc.fillColor("#667eea").fontSize(14).text("Recent Activity Details", { underline: true });
    doc.moveDown(1);

    // Table Setup
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 150;
    const col3 = 350;
    const col4 = 450;

    doc.fillColor("#444444").fontSize(10);
    doc.text("Timestamp", col1, tableTop, { bold: true });
    doc.text("User Message", col2, tableTop, { bold: true });
    doc.text("Topic", col3, tableTop, { bold: true });
    doc.text("Sentiment", col4, tableTop, { bold: true });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let currentY = tableTop + 25;

    // Rows (Limit to last 20 for PDF readability)
    interactions.slice(-20).reverse().forEach(item => {
        if (currentY > 700) { // Page break
            doc.addPage();
            currentY = 50;
        }

        const dateStr = new Date(item.timestamp).toLocaleDateString();
        doc.text(dateStr, col1, currentY);
        doc.text(item.userMessage.substring(0, 40) + "...", col2, currentY);
        doc.text(item.topic || "General", col3, currentY);
        doc.text(item.sentiment || "Neutral", col4, currentY);

        currentY += 20;
    });

    doc.end();
    doc.pipe(res);
});

module.exports = router;
