import { PrismaClient } from '@prisma/client';
import * as data from '../src/data/store_data.json';

const prisma = new PrismaClient();

async function seedData() {
  for (const store of data?.['DATA'] || []) {
    const storeData = {
      phone: store?.tel_no,
      address: store?.rdn_code_nm,
      lat: store?.y_dnts,
      lng: store?.x_cnts,
      name: store?.upso_nm,
      category: store?.bizcnd_code_nm,
      storeType: store?.cob_code_nm,
      foodCertifyName: store?.crtfc_gbn_nm,
    };

    // 1. 중복된 address가 있는지 확인 후 삭제
    await prisma.store.deleteMany({
      where: {
        address: storeData.address,
      },
    });

    // 2. 새로운 데이터 추가
    const res = await prisma.store.create({
      data: storeData,
    });

    console.log(`Added store with name: ${storeData.name}`);
  }
}

async function main() {
  await seedData();
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
