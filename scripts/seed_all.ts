import { execSync } from 'child_process'

function run(command: string) {
  console.log(`\n▶️ ${command}`)
  execSync(command, { stdio: 'inherit' })
}

async function main() {
  try {
    console.log('🚀 Running all seed scripts in order...\n')

    run('npx tsx prisma/seed_all.ts')
    run('npx tsx prisma/demo/assignment.ts')


    console.log('\n🎉 All seed scripts completed successfully!')
  } catch (error) {
    console.error('\n❌ Seed process failed')
    process.exit(1)
  }
}

main()