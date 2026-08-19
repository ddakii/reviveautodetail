import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding Revive Auto Detail...");

  // Create admin user
  const adminPass = await bcrypt.hash("Revive2026!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@revive.com" },
    update: {},
    create: {
      name: "Marcus Rivera",
      email: "admin@revive.com",
      password: adminPass,
      role: "OWNER",
    },
  });

  const detailer = await prisma.user.upsert({
    where: { email: "tyler@revive.com" },
    update: {},
    create: {
      name: "Tyler Banks",
      email: "tyler@revive.com",
      password: await bcrypt.hash("Revive2026!", 10),
      role: "DETAILER",
    },
  });

  // Business settings
  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Revive Auto Detail",
      email: "hello@reviveautodetail.com",
      phone: "(555) 847-2100",
      address: "1420 Auto Blvd, Suite 100",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      website: "https://reviveautodetail.com",
      taxRate: 0,
      currency: "USD",
      invoicePrefix: "INV",
      quotePrefix: "QUO",
      aptPrefix: "APT",
      invoiceTerms: "Payment due within 30 days of invoice date.",
      footerMessage: "Thank you for trusting Revive Auto Detail with your vehicle.",
      mondayHours: "8:00 AM – 6:00 PM",
      tuesdayHours: "8:00 AM – 6:00 PM",
      wednesdayHours: "8:00 AM – 6:00 PM",
      thursdayHours: "8:00 AM – 6:00 PM",
      fridayHours: "8:00 AM – 6:00 PM",
      saturdayHours: "9:00 AM – 5:00 PM",
      sundayHours: "Closed",
    },
  });

  // Services
  const services = [
    { name: "Maintenance Detail", slug: "maintenance-detail", description: "Regular maintenance wash and protection refresh.", price: 79, duration: 90, category: "MAINTENANCE" as const },
    { name: "Exterior Detail", slug: "exterior-detail", description: "Hand wash, clay bar, and premium wax protection.", price: 99, duration: 120, category: "EXTERIOR" as const },
    { name: "Interior Detail", slug: "interior-detail", description: "Deep cleaning of all interior surfaces and upholstery.", price: 149, duration: 180, category: "INTERIOR" as const },
    { name: "Full Detail", slug: "full-detail", description: "Complete interior and exterior transformation.", price: 199, duration: 240, category: "MAINTENANCE" as const },
    { name: "Paint Correction", slug: "paint-correction", description: "Remove swirl marks, scratches, and oxidation.", price: 350, duration: 480, category: "CORRECTION" as const },
    { name: "Ceramic Coating", slug: "ceramic-coating", description: "Long-lasting paint protection with hydrophobic performance.", price: 750, duration: 600, category: "PROTECTION" as const },
    { name: "Paint Protection Film", slug: "ppf", description: "Ultimate clear bra protection against rock chips.", price: 1200, duration: 720, category: "PROTECTION" as const },
    { name: "Engine Bay Detail", slug: "engine-bay", description: "Professional engine bay cleaning and dressing.", price: 89, duration: 60, category: "EXTERIOR" as const },
  ];

  const createdServices: Record<string, any> = {};
  for (const s of services) {
    const svc = await prisma.service.upsert({
      where: { slug: s.slug },
      update: { price: s.price },
      create: s,
    });
    createdServices[s.slug] = svc;
  }

  // Customers
  const customerData = [
    { firstName: "Michael", lastName: "Carter", email: "michael.carter@email.com", phone: "(310) 555-0101", city: "Beverly Hills", state: "CA" },
    { firstName: "Sarah", lastName: "Mitchell", email: "sarah.mitchell@email.com", phone: "(213) 555-0102", city: "Santa Monica", state: "CA" },
    { firstName: "James", lastName: "Rodriguez", email: "james.rodriguez@email.com", phone: "(424) 555-0103", city: "Malibu", state: "CA" },
    { firstName: "Emily", lastName: "Chen", email: "emily.chen@email.com", phone: "(310) 555-0104", city: "Bel Air", state: "CA" },
    { firstName: "David", lastName: "Park", email: "david.park@email.com", phone: "(323) 555-0105", city: "West Hollywood", state: "CA" },
    { firstName: "Ashley", lastName: "Thompson", email: "ashley.thompson@email.com", phone: "(818) 555-0106", city: "Calabasas", state: "CA" },
    { firstName: "Robert", lastName: "Williams", email: "robert.williams@email.com", phone: "(213) 555-0107", city: "Pasadena", state: "CA" },
    { firstName: "Jennifer", lastName: "Davis", email: "jennifer.davis@email.com", phone: "(310) 555-0108", city: "Manhattan Beach", state: "CA" },
    { firstName: "Christopher", lastName: "Brown", email: "chris.brown@email.com", phone: "(424) 555-0109", city: "Redondo Beach", state: "CA" },
    { firstName: "Amanda", lastName: "Wilson", email: "amanda.wilson@email.com", phone: "(818) 555-0110", city: "Woodland Hills", state: "CA" },
  ];

  const customers: any[] = [];
  for (const c of customerData) {
    const cust = await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });
    customers.push(cust);
  }

  // Vehicles
  const vehicleData = [
    { customerId: customers[0].id, make: "BMW", model: "M4 Competition", year: 2024, color: "Black", licensePlate: "7BMR841" },
    { customerId: customers[0].id, make: "Porsche", model: "Cayenne", year: 2022, color: "White", licensePlate: "8POR921" },
    { customerId: customers[1].id, make: "Mercedes-Benz", model: "AMG GT 63", year: 2023, color: "Obsidian Black", licensePlate: "6MBZ571" },
    { customerId: customers[2].id, make: "Porsche", model: "911 Carrera S", year: 2023, color: "GT Silver", licensePlate: "4POR221" },
    { customerId: customers[3].id, make: "Tesla", model: "Model S Plaid", year: 2024, color: "Midnight Silver", licensePlate: "3TES113" },
    { customerId: customers[4].id, make: "Audi", model: "RS7 Sportback", year: 2023, color: "Navarra Blue", licensePlate: "2AUD773" },
    { customerId: customers[5].id, make: "Range Rover", model: "Sport SVR", year: 2024, color: "Santorini Black", licensePlate: "9RRV445" },
    { customerId: customers[6].id, make: "Lexus", model: "LC 500", year: 2023, color: "Infrared", licensePlate: "1LEX223" },
    { customerId: customers[7].id, make: "BMW", model: "X7 M60i", year: 2024, color: "Dravit Grey", licensePlate: "5BMW661" },
    { customerId: customers[8].id, make: "Mercedes-Benz", model: "S 580", year: 2024, color: "Nautical Blue", licensePlate: "8MBZ119" },
    { customerId: customers[9].id, make: "Lamborghini", model: "Urus S", year: 2023, color: "Giallo Inti", licensePlate: "URUS23" },
  ];

  const vehicles: any[] = [];
  for (const v of vehicleData) {
    const existing = await prisma.vehicle.findFirst({ where: { customerId: v.customerId, make: v.make, model: v.model } });
    if (existing) { vehicles.push(existing); continue; }
    const veh = await prisma.vehicle.create({ data: v });
    vehicles.push(veh);
  }

  // Counters
  await prisma.counter.upsert({ where: { name: "invoice_2026" }, update: {}, create: { name: "invoice_2026", value: 8 } });
  await prisma.counter.upsert({ where: { name: "quote_2026" }, update: {}, create: { name: "quote_2026", value: 6 } });
  await prisma.counter.upsert({ where: { name: "appointment_2026" }, update: {}, create: { name: "appointment_2026", value: 15 } });
  await prisma.counter.upsert({ where: { name: "booking_2026" }, update: {}, create: { name: "booking_2026", value: 12 } });

  // Appointments
  const apts = [
    { reference: "APT-2026-0001", customerId: customers[0].id, vehicleId: vehicles[0].id, serviceId: createdServices["paint-correction"].id, date: new Date("2026-07-15T09:00:00"), price: 500, status: "COMPLETED", assignedToId: detailer.id },
    { reference: "APT-2026-0002", customerId: customers[0].id, vehicleId: vehicles[0].id, serviceId: createdServices["ceramic-coating"].id, date: new Date("2026-07-16T10:00:00"), price: 750, status: "COMPLETED", assignedToId: detailer.id },
    { reference: "APT-2026-0003", customerId: customers[1].id, vehicleId: vehicles[2].id, serviceId: createdServices["full-detail"].id, date: new Date("2026-07-20T08:00:00"), price: 250, status: "COMPLETED", assignedToId: detailer.id },
    { reference: "APT-2026-0004", customerId: customers[2].id, vehicleId: vehicles[3].id, serviceId: createdServices["paint-correction"].id, date: new Date("2026-07-25T09:00:00"), price: 450, status: "COMPLETED" },
    { reference: "APT-2026-0005", customerId: customers[3].id, vehicleId: vehicles[4].id, serviceId: createdServices["ceramic-coating"].id, date: new Date("2026-08-01T10:00:00"), price: 850, status: "COMPLETED" },
    { reference: "APT-2026-0006", customerId: customers[4].id, vehicleId: vehicles[5].id, serviceId: createdServices["exterior-detail"].id, date: new Date("2026-08-05T09:00:00"), price: 120, status: "COMPLETED" },
    { reference: "APT-2026-0007", customerId: customers[5].id, vehicleId: vehicles[6].id, serviceId: createdServices["full-detail"].id, date: new Date("2026-08-10T08:00:00"), price: 250, status: "COMPLETED" },
    { reference: "APT-2026-0008", customerId: customers[6].id, vehicleId: vehicles[7].id, serviceId: createdServices["interior-detail"].id, date: new Date("2026-08-12T11:00:00"), price: 180, status: "COMPLETED" },
    { reference: "APT-2026-0009", customerId: customers[7].id, vehicleId: vehicles[8].id, serviceId: createdServices["maintenance-detail"].id, date: new Date("2026-08-25T09:00:00"), price: 99, status: "CONFIRMED", assignedToId: detailer.id },
    { reference: "APT-2026-0010", customerId: customers[8].id, vehicleId: vehicles[9].id, serviceId: createdServices["paint-correction"].id, date: new Date("2026-08-28T10:00:00"), price: 500, status: "CONFIRMED" },
    { reference: "APT-2026-0011", customerId: customers[9].id, vehicleId: vehicles[10].id, serviceId: createdServices["ppf"].id, date: new Date("2026-09-02T08:00:00"), price: 1500, status: "REQUESTED" },
    { reference: "APT-2026-0012", customerId: customers[0].id, vehicleId: vehicles[1].id, serviceId: createdServices["maintenance-detail"].id, date: new Date("2026-09-05T09:00:00"), price: 99, status: "CONFIRMED" },
  ];

  for (const a of apts) {
    const existing = await prisma.appointment.findUnique({ where: { reference: a.reference } });
    if (!existing) await prisma.appointment.create({ data: a as any });
  }

  // Invoices
  const invData = [
    {
      number: "INV-2026-0001",
      customerId: customers[0].id,
      vehicleId: vehicles[0].id,
      status: "PAID" as const,
      issueDate: new Date("2026-07-16"),
      dueDate: new Date("2026-08-15"),
      subtotal: 1250,
      discount: 0,
      tax: 0,
      total: 1250,
      amountPaid: 1250,
      notes: "Paint correction + ceramic coating combo.",
      items: [
        { description: "Paint Correction (2-stage)", quantity: 1, unitPrice: 500, total: 500, serviceId: createdServices["paint-correction"].id },
        { description: "Gyeon Quartz Ceramic Coating", quantity: 1, unitPrice: 750, total: 750, serviceId: createdServices["ceramic-coating"].id },
      ],
    },
    {
      number: "INV-2026-0002",
      customerId: customers[1].id,
      vehicleId: vehicles[2].id,
      status: "PAID" as const,
      issueDate: new Date("2026-07-20"),
      dueDate: new Date("2026-08-19"),
      subtotal: 250,
      discount: 0,
      tax: 0,
      total: 250,
      amountPaid: 250,
      items: [{ description: "Full Detail", quantity: 1, unitPrice: 250, total: 250, serviceId: createdServices["full-detail"].id }],
    },
    {
      number: "INV-2026-0003",
      customerId: customers[2].id,
      vehicleId: vehicles[3].id,
      status: "PAID" as const,
      issueDate: new Date("2026-07-25"),
      dueDate: new Date("2026-08-24"),
      subtotal: 450,
      discount: 0,
      tax: 0,
      total: 450,
      amountPaid: 450,
      items: [{ description: "Paint Correction (1-stage)", quantity: 1, unitPrice: 450, total: 450, serviceId: createdServices["paint-correction"].id }],
    },
    {
      number: "INV-2026-0004",
      customerId: customers[3].id,
      vehicleId: vehicles[4].id,
      status: "PAID" as const,
      issueDate: new Date("2026-08-01"),
      dueDate: new Date("2026-08-31"),
      subtotal: 850,
      discount: 0,
      tax: 0,
      total: 850,
      amountPaid: 850,
      items: [{ description: "Ceramic Coating + Interior Detail", quantity: 1, unitPrice: 850, total: 850, serviceId: createdServices["ceramic-coating"].id }],
    },
    {
      number: "INV-2026-0005",
      customerId: customers[4].id,
      vehicleId: vehicles[5].id,
      status: "PAID" as const,
      issueDate: new Date("2026-08-05"),
      dueDate: new Date("2026-09-04"),
      subtotal: 120,
      discount: 0,
      tax: 0,
      total: 120,
      amountPaid: 120,
      items: [{ description: "Exterior Detail", quantity: 1, unitPrice: 120, total: 120, serviceId: createdServices["exterior-detail"].id }],
    },
    {
      number: "INV-2026-0006",
      customerId: customers[5].id,
      vehicleId: vehicles[6].id,
      status: "PAID" as const,
      issueDate: new Date("2026-08-10"),
      dueDate: new Date("2026-09-09"),
      subtotal: 250,
      discount: 0,
      tax: 0,
      total: 250,
      amountPaid: 250,
      items: [{ description: "Full Detail", quantity: 1, unitPrice: 250, total: 250, serviceId: createdServices["full-detail"].id }],
    },
    {
      number: "INV-2026-0007",
      customerId: customers[7].id,
      vehicleId: vehicles[8].id,
      status: "SENT" as const,
      issueDate: new Date("2026-08-19"),
      dueDate: new Date("2026-09-18"),
      subtotal: 99,
      discount: 0,
      tax: 0,
      total: 99,
      amountPaid: 0,
      items: [{ description: "Maintenance Detail", quantity: 1, unitPrice: 99, total: 99, serviceId: createdServices["maintenance-detail"].id }],
    },
    {
      number: "INV-2026-0008",
      customerId: customers[8].id,
      vehicleId: vehicles[9].id,
      status: "OVERDUE" as const,
      issueDate: new Date("2026-07-01"),
      dueDate: new Date("2026-07-31"),
      subtotal: 500,
      discount: 0,
      tax: 0,
      total: 500,
      amountPaid: 0,
      items: [{ description: "Paint Correction", quantity: 1, unitPrice: 500, total: 500, serviceId: createdServices["paint-correction"].id }],
    },
  ];

  for (const inv of invData) {
    const { items, ...rest } = inv;
    const existing = await prisma.invoice.findUnique({ where: { number: inv.number } });
    if (!existing) {
      const created = await prisma.invoice.create({
        data: { ...rest, items: { create: items } },
      });

      // Create payment for paid invoices
      if (rest.status === "PAID") {
        await prisma.payment.create({
          data: {
            invoiceId: created.id,
            customerId: rest.customerId,
            amount: rest.total,
            method: "CARD",
            paidAt: rest.dueDate,
          },
        });
      }
    }
  }

  // Quotes
  const quoteData = [
    {
      number: "QUO-2026-0001",
      customerId: customers[9].id,
      vehicleId: vehicles[10].id,
      status: "ACCEPTED" as const,
      subtotal: 2200,
      discount: 0,
      tax: 0,
      total: 2200,
      expiresAt: new Date("2026-09-30"),
      items: [
        { description: "Paint Protection Film - Full Front", quantity: 1, unitPrice: 1200, total: 1200, serviceId: createdServices["ppf"].id },
        { description: "Ceramic Coating", quantity: 1, unitPrice: 750, total: 750, serviceId: createdServices["ceramic-coating"].id },
        { description: "Full Interior Detail", quantity: 1, unitPrice: 250, total: 250, serviceId: createdServices["interior-detail"].id },
      ],
    },
    {
      number: "QUO-2026-0002",
      customerId: customers[6].id,
      vehicleId: vehicles[7].id,
      status: "SENT" as const,
      subtotal: 1050,
      discount: 50,
      tax: 0,
      total: 1000,
      expiresAt: new Date("2026-09-15"),
      items: [
        { description: "Paint Correction", quantity: 1, unitPrice: 450, total: 450, serviceId: createdServices["paint-correction"].id },
        { description: "Ceramic Coating", quantity: 1, unitPrice: 600, total: 600, serviceId: createdServices["ceramic-coating"].id },
      ],
    },
    {
      number: "QUO-2026-0003",
      customerId: customers[3].id,
      vehicleId: vehicles[4].id,
      status: "DRAFT" as const,
      subtotal: 199,
      discount: 0,
      tax: 0,
      total: 199,
      expiresAt: new Date("2026-09-30"),
      items: [
        { description: "Full Detail + Maintenance Wash", quantity: 1, unitPrice: 199, total: 199, serviceId: createdServices["full-detail"].id },
      ],
    },
  ];

  for (const q of quoteData) {
    const { items, ...rest } = q;
    const existing = await prisma.quote.findUnique({ where: { number: q.number } });
    if (!existing) {
      await prisma.quote.create({ data: { ...rest, items: { create: items } } });
    }
  }

  // Notifications
  const notifications = [
    { title: "New Booking Request", message: "Amanda Wilson requested a Maintenance Detail — RAD-2026-00012", type: "INFO" as const, link: "/dashboard/bookings" },
    { title: "Invoice Overdue", message: "Invoice INV-2026-0008 is overdue — Christopher Brown ($500.00)", type: "WARNING" as const, link: "/dashboard/invoices" },
    { title: "Quote Accepted", message: "Amanda Wilson accepted Quote QUO-2026-0001 for $2,200", type: "SUCCESS" as const, link: "/dashboard/quotes" },
    { title: "Appointment Tomorrow", message: "Jennifer Davis — Maintenance Detail at 9:00 AM", type: "INFO" as const, link: "/dashboard/appointments" },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  console.log("✅ Seed complete!");
  console.log("📧 Admin: admin@revive.com");
  console.log("🔑 Password: Revive2026!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
