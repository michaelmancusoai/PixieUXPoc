import { execSync } from 'child_process';

console.log('🌱 Running realistic appointment seeding script...\n');

try {
  execSync('npx tsx server/seed-realistic.ts', { stdio: 'inherit' });
  console.log('\n✅ Seeding complete!');
} catch (error) {
  console.error('\n❌ Seeding failed:', error.message);
  process.exit(1);
}