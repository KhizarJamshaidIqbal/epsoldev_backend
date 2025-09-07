# Database Seeders

This directory contains database seeders for populating the EpsolDev application with initial data.

## Technology Seeder

The technology seeder is a comprehensive tool for managing technology data in the database.

### Features

- **Comprehensive Technology Data**: 50+ technologies across 7 categories
- **Data Validation**: Validates all data before insertion
- **Flexible Seeding**: Support for force reseeding and conditional seeding
- **Statistics**: Get detailed statistics about seeded data
- **Error Handling**: Robust error handling with detailed logging
- **Category Management**: Technologies organized by category (frontend, backend, database, devops, mobile, design, other)

### Technology Categories

1. **Frontend** (10 technologies)
   - React.js, Vue.js, Angular, Next.js, TypeScript, Tailwind CSS, Bootstrap, Sass, Vite, Webpack

2. **Backend** (10 technologies)
   - Node.js, Express.js, Python, Django, Flask, PHP, Laravel, Java, Spring Boot, GraphQL

3. **Database** (5 technologies)
   - MongoDB, PostgreSQL, MySQL, Redis, SQLite

4. **DevOps** (7 technologies)
   - Docker, Kubernetes, AWS, Git, GitHub, Jenkins, Nginx

5. **Mobile** (5 technologies)
   - React Native, Flutter, Ionic, Swift, Kotlin

6. **Design** (4 technologies)
   - Figma, Adobe XD, Sketch, InVision

7. **Other** (5 technologies)
   - REST API, Jest, Cypress, Storybook, ESLint

### Usage

#### Using npm scripts (Recommended)

```bash
# Seed technologies (skip if already exists)
npm run seed:technologies

# Force reseed (clear existing data first)
npm run seed:technologies:force

# Show technology statistics
npm run seed:technologies:stats

# Clear all technologies
npm run seed:technologies:clear
```

#### Direct script execution

```bash
# Basic seeding
node server/scripts/seedTechnologies.js

# Force reseed
node server/scripts/seedTechnologies.js --force

# Show statistics
node server/scripts/seedTechnologies.js stats

# Clear all technologies
node server/scripts/seedTechnologies.js clear

# Show help
node server/scripts/seedTechnologies.js help
```

#### Programmatic usage

```javascript
import seedTechnologies, { getSeedingStats, clearTechnologies } from './seeders/technologySeeder.js';

// Seed technologies
const result = await seedTechnologies();
console.log(result);

// Get statistics
const stats = await getSeedingStats();
console.log(stats);

// Clear technologies
const clearResult = await clearTechnologies();
console.log(clearResult);
```

### Technology Data Structure

Each technology includes:

```javascript
{
  name: 'Technology Name',
  description: 'Technology description (max 500 chars)',
  category: 'frontend|backend|database|devops|mobile|design|other',
  icon: 'icon-name',
  color: '#HEXCOLOR',
  website: 'https://website.com',
  featured: true|false,
  order: 1,
  status: 'active|inactive',
  usageCount: 0
}
```

### Validation Rules

- **Name**: Required, unique
- **Category**: Required, must be one of the valid categories
- **Description**: Optional, max 500 characters
- **Color**: Must be valid hex color format (#RRGGBB)
- **Website**: Must be valid URL format
- **Featured**: Boolean, defaults to false
- **Order**: Number for sorting, defaults to 0
- **Status**: 'active' or 'inactive', defaults to 'active'
- **UsageCount**: Number, defaults to 0

### Error Handling

The seeder includes comprehensive error handling:

- **Validation Errors**: Detailed validation with specific error messages
- **Database Errors**: Handles connection issues and duplicate key errors
- **Data Integrity**: Ensures all required fields are present
- **Graceful Degradation**: Continues processing even if some items fail

### Logging

The seeder provides detailed logging:

- 🌱 Seeding process start
- ✅ Database connection success
- 🔍 Data validation progress
- 📝 Insertion progress
- 📊 Summary statistics
- ⚠️ Warnings and non-critical issues
- ❌ Error details

### Performance

- **Batch Insertion**: Uses MongoDB's `insertMany` for efficient bulk insertion
- **Validation**: Pre-validates all data before database operations
- **Timing**: Provides execution time metrics
- **Memory Efficient**: Processes data in batches

### Integration

The technology seeder integrates with:

- **Technology Model**: Uses the Technology schema for validation
- **Database Connection**: Uses the shared database configuration
- **API Routes**: Seeded data is immediately available via `/api/technologies`
- **Admin Panel**: Technologies can be managed through the admin interface

### Maintenance

To add new technologies:

1. Add the technology data to the `technologies` array in `technologySeeder.js`
2. Ensure all required fields are present
3. Run validation: `npm run seed:technologies:stats`
4. Test seeding: `npm run seed:technologies:force`

### Troubleshooting

**Common Issues:**

1. **Duplicate Key Error**: Technology name already exists
   - Solution: Use `--force` flag to reseed

2. **Validation Errors**: Invalid data format
   - Solution: Check the technology data and fix validation issues

3. **Connection Errors**: Database connection failed
   - Solution: Check database configuration and network connectivity

4. **Permission Errors**: Database access denied
   - Solution: Verify database credentials and permissions

### Related Files

- `server/models/Technology.js` - Technology data model
- `server/controllers/technologyController.js` - Technology API controller
- `server/routes/technologyRoutes.js` - Technology API routes
- `server/scripts/seedTechnologies.js` - Seeding script

## Other Seeders

### Admin Seeder
```bash
npm run seed:admin
```
Seeds the initial admin user for the application.

### Blog Seeder
```bash
npm run seed:blog
```
Seeds sample blog data for testing and development.

### All Seeders
```bash
npm run seed:all
```
Runs all seeders in the correct order: admin → blog → technologies.

## Environment Setup

Ensure your environment variables are properly configured:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=development
```

## Contributing

When adding new seeders or modifying existing ones:

1. Follow the established patterns and structure
2. Include comprehensive validation
3. Add proper error handling
4. Include detailed logging
5. Update this README with new information
6. Test thoroughly before committing
