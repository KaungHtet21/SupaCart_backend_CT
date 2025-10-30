import { PrismaClient, UserRole, MembershipStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {},
    create: {
      email: 'admin@gym.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample member
  const memberPassword = await bcrypt.hash('member123', 10);
  const member = await prisma.user.upsert({
    where: { email: 'member@gym.com' },
    update: {},
    create: {
      email: 'member@gym.com',
      password: memberPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567891',
      role: UserRole.MEMBER,
    },
  });

  console.log('✅ Sample member created:', member.email);

  // Create membership packages
  const packages = [
    {
      title: 'Basic Monthly',
      description: 'Basic gym access for 1 month',
      price: 49.99,
      durationDays: 30,
    },
    {
      title: 'Premium 3-Month',
      description: 'Premium gym access for 3 months with personal training',
      price: 299.99,
      durationDays: 90,
    },
    {
      title: 'Annual Membership',
      description: 'Full year access with all amenities',
      price: 999.99,
      durationDays: 365,
    },
    {
      title: 'Student Monthly',
      description: 'Discounted rate for students',
      price: 29.99,
      durationDays: 30,
    },
  ];

  for (const pkg of packages) {
    const membershipPackage = await prisma.membershipPackage.create({
      data: pkg,
    });
    console.log('✅ Membership package created:', membershipPackage.title);
  }

  // Create personal trainers
  const trainers = [
    {
      name: 'Mike Johnson',
      email: 'mike@gym.com',
      phone: '+1234567892',
      specialties: ['Weight Training', 'Cardio', 'Nutrition'],
      bio: 'Certified personal trainer with 10+ years experience',
      hourlyRate: 75.0,
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@gym.com',
      phone: '+1234567893',
      specialties: ['Yoga', 'Pilates', 'Flexibility'],
      bio: 'Yoga instructor and wellness coach',
      hourlyRate: 65.0,
    },
    {
      name: 'David Brown',
      email: 'david@gym.com',
      phone: '+1234567894',
      specialties: ['CrossFit', 'Functional Training', 'Injury Recovery'],
      bio: 'CrossFit Level 2 trainer and rehabilitation specialist',
      hourlyRate: 85.0,
    },
  ];

  for (const trainer of trainers) {
    try {
      const personalTrainer = await prisma.personalTrainer.create({
        data: trainer,
      });
      console.log('✅ Personal trainer created:', personalTrainer.name);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('⚠️ Personal trainer already exists:', trainer.name);
      } else {
        throw error;
      }
    }
  }

  // Create sample membership for the member
  const basicPackage = await prisma.membershipPackage.findFirst({
    where: { title: 'Basic Monthly' },
  });

  if (basicPackage) {
    const membership = await prisma.membership.create({
      data: {
        userId: member.id,
        packageId: basicPackage.id,
        status: MembershipStatus.ACTIVE,
        paymentStatus: PaymentStatus.APPROVED,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });
    console.log('✅ Sample membership created for member');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
