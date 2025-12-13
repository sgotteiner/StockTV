import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');

// Helper to read JSON
function readJSON(filename) {
    const filePath = path.join(dataDir, filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper to write JSON
function writeJSON(filename, data) {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Generate unique ID
function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

console.log('🚀 Starting data migration...\n');

// Step 1: Extract companies from existing videos and create companies.json
console.log('Step 1: Creating companies from existing videos...');
let videosData = readJSON('videos.json');
// Handle both array and object formats
const videos = Array.isArray(videosData) ? videosData : (videosData.videos || []);
const companyNames = new Set();

// Extract unique company names from videos
videos.forEach(video => {
    if (video.company) {
        companyNames.add(video.company.toLowerCase());
    }
});

// Create company records
const companies = Array.from(companyNames).map((name) => ({
    id: Math.random().toString(36).substring(2, 10),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    created_at: new Date().toISOString()
}));

writeJSON('companies.json', { companies });
console.log(`✅ Created ${companies.length} companies`);

// Step 2: Add company_id to videos
console.log('\nStep 2: Adding company_id to videos...');
videos.forEach(video => {
    if (video.company) {
        const company = companies.find(c =>
            c.name.toLowerCase() === video.company.toLowerCase()
        );
        video.company_id = company ? company.id : null;
    }
});

writeJSON('videos.json', videos);
console.log(`✅ Updated ${videos.length} videos with company_id`);

// Step 3: Migrate likes.json to user_video_interactions.json
console.log('\nStep 3: Migrating likes to user_video_interactions...');
const likes = readJSON('likes.json');
const interactions = [];

if (likes.likes && Array.isArray(likes.likes)) {
    likes.likes.forEach(like => {
        interactions.push({
            id: generateId('int'),
            user_id: like.userId || like.user_id,
            video_id: like.videoId || like.video_id,
            viewed: false, // Unknown, will be tracked going forward
            viewed_at: null,
            watch_percentage: 0,
            liked: true,
            liked_at: like.likedAt || like.liked_at || new Date().toISOString()
        });
    });
}

writeJSON('user_video_interactions.json', { interactions });
console.log(`✅ Migrated ${interactions.length} likes to interactions`);

// Step 4: Verify migration
console.log('\n📊 Migration Summary:');
console.log(`   Companies: ${companies.length}`);
console.log(`   Videos with company_id: ${videos.filter(v => v.company_id).length}/${videos.length}`);
console.log(`   User-Video Interactions: ${interactions.length}`);

console.log('\n✅ Migration complete!');
console.log('\n📝 Next steps:');
console.log('   1. Review the migrated data files');
console.log('   2. Update storage layer to use new structure');
console.log('   3. Update API endpoints to use user_video_interactions');
console.log('   4. (Optional) Delete old likes.json after verifying everything works');
