import { PrismaClient, Prisma } from '@prisma/client';
import * as data from '../src/data/store_data.json';

const prisma = new PrismaClient();

async function seedData() {
  try {
    for (const store of data['DATA']) {
      const storeData: Prisma.StoreCreateInput = {
        phone: store?.tel_no || 'N/A',
        address: store?.rdn_code_nm || 'N/A',
        lat: parseFloat(store?.y_dnts) || 0, // 숫자 변환 및 기본값 설정
        lng: parseFloat(store?.x_cnts) || 0, // 숫자 변환 및 기본값 설정
        name: store?.upso_nm || 'Unnamed Store',
        category: store?.bizcnd_code_nm || 'Uncategorized',
        storeType: store?.cob_code_nm || 'Unknown',
        foodCertifyName: store?.crtfc_gbn_nm || 'N/A',
      };

      const res = await prisma.store.create({
        data: storeData,
      });
      console.log('Created store:', res);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

async function main() {
  await seedData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
