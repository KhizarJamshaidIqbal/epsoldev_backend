import seedTechnologies, { getSeedingStats, clearTechnologies } from '../seeders/technologySeeder.js';

const args = process.argv.slice(2);
const command = args[0] || 'seed';

console.log('🚀 Technology Seeder Tool');
console.log('========================');

switch (command) {
  case 'seed':
  case '--seed':
    const force = args.includes('--force') || args.includes('-f');
    console.log(`🌱 Starting technology seeding${force ? ' (force mode)' : ''}...`);
    
    seedTechnologies(force)
      .then(result => {
        if (result.success) {
          console.log('🎉 Technology seeding completed successfully!');
          console.log(`📊 Seeded ${result.count} technologies in ${result.duration}ms`);
          console.log(`⭐ Featured technologies: ${result.featuredCount}`);
        } else {
          console.log('⚠️  Technology seeding completed with warnings');
          console.log(`💡 ${result.message}`);
        }
        process.exit(0);
      })
      .catch(error => {
        console.error('💥 Technology seeding failed:', error);
        process.exit(1);
      });
    break;

  case 'stats':
  case '--stats':
    console.log('📊 Getting technology statistics...');
    
    getSeedingStats()
      .then(stats => {
        console.log('\n📈 Technology Statistics:');
        console.log('========================');
        console.log(`Total technologies: ${stats.total}`);
        console.log(`Featured technologies: ${stats.featured}`);
        console.log(`Active technologies: ${stats.active}`);
        
        console.log('\n📋 By Category:');
        stats.categories.forEach(cat => {
          console.log(`  ${cat._id}: ${cat.count} (${cat.featured} featured)`);
        });
      })
      .catch(error => {
        console.error('❌ Error getting statistics:', error);
        process.exit(1);
      });
    break;

  case 'clear':
  case '--clear':
    console.log('🗑️  Clearing all technologies...');
    
    clearTechnologies()
      .then(result => {
        if (result.success) {
          console.log(`✅ Cleared ${result.deletedCount} technologies`);
        } else {
          console.error('❌ Error clearing technologies:', result.error);
        }
        process.exit(0);
      })
      .catch(error => {
        console.error('💥 Error clearing technologies:', error);
        process.exit(1);
      });
    break;

  case 'help':
  case '--help':
  case '-h':
    console.log(`
Usage: node seedTechnologies.js [command] [options]

Commands:
  seed, --seed     Seed technologies (default)
  stats, --stats   Show technology statistics
  clear, --clear   Clear all technologies
  help, --help     Show this help message

Options:
  --force, -f      Force reseed (clear existing data first)

Examples:
  node seedTechnologies.js                    # Seed technologies (skip if exists)
  node seedTechnologies.js --force            # Force reseed
  node seedTechnologies.js stats              # Show statistics
  node seedTechnologies.js clear              # Clear all technologies
    `);
    break;

  default:
    console.error(`❌ Unknown command: ${command}`);
    console.log('Use "node seedTechnologies.js help" for usage information');
    process.exit(1);
}
