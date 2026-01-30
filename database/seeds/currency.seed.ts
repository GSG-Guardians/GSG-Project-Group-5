import { DataSource } from 'typeorm';
import { Currency } from '../entities/currency.entities';
import { dataSourceOptions } from '../data-source';

const seedCurrencies = async () => {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const currencyRepo = dataSource.getRepository(Currency);

  const currencies = [
    { code: 'USD', name: 'United States (US Dollar)', symbol: '$' },
    {
      code: 'GBP',
      name: 'United Kingdom (British Pound Sterling)',
      symbol: '£',
    },
    { code: 'EUR', name: 'European Union (Euro)', symbol: '€' },
    { code: 'SAR', name: 'Saudi Arabia (Saudi Riyal)', symbol: 'SR' },
    { code: 'AED', name: 'United Arab Emirates (UAE Dirham)', symbol: 'AED' },
    { code: 'JOD', name: 'Jordan (Jordanian Dinar)', symbol: 'JD' },
    { code: 'JPY', name: 'Japan (Japanese Yen)', symbol: '¥' },
  ];

  for (const currencyData of currencies) {
    const existing = await currencyRepo.findOne({
      where: { code: currencyData.code },
    });
    if (!existing) {
      const currency = currencyRepo.create(currencyData);
      await currencyRepo.save(currency);
      console.log(`Created currency: ${currencyData.code}`);
    } else {
      console.log(`Currency already exists: ${currencyData.code}`);
    }
  }

  await dataSource.destroy();
  console.log('Currency seeding completed!');
};

seedCurrencies().catch((err) => {
  console.error('Error seeding currencies:', err);
  process.exit(1);
});
