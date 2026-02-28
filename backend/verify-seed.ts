import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const paths = await prisma.learningPath.findMany({ include: { lessons: true } })
  
  console.log(`\n✓ Trilhas criadas: ${paths.length}`)
  
  paths.forEach(path => {
    console.log(`\n  📚 ${path.title} (${path.colorToken})`)
    console.log(`     Lições: ${path.lessons.length}`)
  })
  
  const totalLessons = await prisma.lesson.count()
  const totalSteps = await prisma.lessonStep.count()
  const totalQuestions = await prisma.question.count()
  
  console.log(`\n✓ Total de lições: ${totalLessons}`)
  console.log(`✓ Total de passos: ${totalSteps}`)
  console.log(`✓ Total de questões: ${totalQuestions}`)
}

main().finally(() => prisma.$disconnect())
