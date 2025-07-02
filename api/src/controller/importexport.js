import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

function generateRandomString() {
  const numbers = '0123456789';
  let randomString = 'B';

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomString += numbers[randomIndex];
  }

  return randomString;
}

export const importProducts = async (req, res) => {
  const { products } = req.body;

  try {
    const importedProducts = [];
    const skippedProducts = [];
    for (const productData of products) {
      delete productData._id;

      // Ensure required fields are present
      if (!productData['IMAGE URL'] || !productData['LEVEL 1'] || !productData['LEVEL 2'] || !productData['LEVEL 3']) {
        skippedProducts.push(productData);
        continue;
      }

      const L1 = productData['LEVEL 1'].toUpperCase();
      const L2 = productData['LEVEL 2'].toUpperCase();
      const L3 = productData['LEVEL 3'].toUpperCase();

      let level_1 = await Category.findOne({ name: L1 });
      let level_2 = await Category.findOne({ name: L2 });
      let level_3 = await Category.findOne({ name: L3 });

      if (!level_1) { 
        level_1 = await CreateCategory(L1, 1, L1, null);
      }
      if (!level_2) {
        level_2 = await CreateCategory(L2, 2, L2, level_1);
      }
      if (!level_3) {
        level_3 = await CreateCategory(L3, 3, L3, level_2);
      }

      // Handle product barcode
      let barcode = productData.BarCode || productData.Barcode ;
      if(productData['Update Barcode'])
      {
        barcode = productData['Update Barcode'];
      }
      console.log(productData.BarCode, 'new product');
      console.log(productData.Barcode, 'GST pad product');
      if (barcode && barcode !== 0) {
        const existingProduct = await Product.findOne({ BarCode: barcode });
        const name = await Product.findOne({ title: productData.NAME });
        const existingSlug = await Product.findOne({ slug: productData.NAME });
        if (existingProduct || name || existingSlug) {  
            if(name)
            {
              name.BarCode = barcode;
              await name.save();
            }  
            if(existingProduct)
              {
                existingProduct.BarCode = barcode;
                await existingProduct.save();
              }  
              if(existingSlug)
                {
                  existingSlug.BarCode = barcode;
                  await existingSlug.save();
                }  
          skippedProducts.push(productData);
          continue;
        }
      } else {
        let newBarcode;
        let isUnique = false;

        while (!isUnique) {
          newBarcode = generateRandomString();
          const checkBarcode = await Product.findOne({ BarCode: newBarcode });

          if (!checkBarcode) {
            isUnique = true;
          }
        }
        productData.BarCode ? productData.BarCode = newBarcode : productData.Barcode = newBarcode;
      }

      // Ensure unique slug
      let slug = productData.NAME || 'default-slug';
      let slugExists = await Product.findOne({ slug });
      if (slugExists) {
        slug += `-${generateRandomString()}`;
      }

      productData.slug = slug;

      // Import product based on GST data
      const result = productData.BarCode
        ? await NewimportGSTData(productData, level_3)
        : await importGSTData(productData, level_3);
      importedProducts.push(result);
    }

    res.json({
      message: "Products imported successfully",
      status: true,
      data: importedProducts,
      skipped: skippedProducts,
    });
  } catch (error) {
    console.error('Error processing products:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

async function importGSTData(productData, category) {
  const product = new Product({
    title: productData.NAME || null,
    description: productData.Description || null,
    price: parseFloat(productData.MRP) || parseFloat(productData['Net Sale']),
    discountedPrice: parseFloat(productData['Net Sale']) || 0,
    discountPercent: parseFloat(productData.discountPercent) || 0,
    weight: parseFloat(productData.weight) || 0,
    quantity: parseInt(productData['Qty.'], 10) || 0,
    brand: productData.brand || null,
    imageUrl: productData['IMAGE URL'] || 'https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png',
    slug: productData.slug,
    ratings: productData.ratings || [],
    reviews: productData.reviews || [],
    numRatings: parseInt(productData.numRatings, 10) || 0,
    category: category._id,
    createdAt: productData.createdAt || null,
    updatedAt: productData.updatedAt || null,
    BarCode: productData.Barcode || null,
    stockType: productData.stockType || null,
    unit: productData.Unit || null,
    purchaseRate: parseFloat(productData['Purchase Rate']) || 0,
    profitPercentage: parseFloat(productData.profit) || 0,
    HSN: productData.CESS || null,
    GST: parseFloat(productData.TAX) || 0,
    retailPrice: parseFloat(productData['Net Sale']) || 0,
    totalAmount: parseFloat(productData['Net Sale']) || 0,
    amountPaid: parseFloat(productData.amountpaid) || 0
  });
  return await product.save();
}

async function NewimportGSTData(productData, category) {
  const product = new Product({
    title: productData.title || null,
    description: productData.description || null,
    price: parseFloat(productData.price) || 0,
    discountedPrice: parseFloat(productData.discountedPrice) || 0,
    discountPercent: parseFloat(productData.discountPercent) || 0,
    weight: parseFloat(productData.weight) || 0,
    quantity: parseInt(productData.quantity, 10) || 0,
    brand: productData.brand || null,
    imageUrl: productData.imageUrl || 'https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png',
    slug: productData.slug,
    ratings: productData.ratings || [],
    reviews: productData.reviews || [],
    numRatings: parseInt(productData.numRatings, 10) || 0,
    category: category._id,
    createdAt: productData.createdAt || null,
    updatedAt: productData.updatedAt || null,
    BarCode: productData.BarCode || null,
    stockType: productData.stockType || null,
    unit: productData.unit || null,
    purchaseRate: parseFloat(productData.purchaseRate) || 0,
    profitPercentage: parseFloat(productData.profitPercentage) || 0,
    HSN: productData.HSN || null,
    GST: parseFloat(productData.GST) || 0,
    retailPrice: parseFloat(productData.retailPrice) || 0,
    totalAmount: parseFloat(productData.totalAmount) || 0,
    amountPaid: parseFloat(productData.amountpaid) || 0
  });
  return await product.save();
}

async function CreateCategory(name, level, slug, parentCategory) {
  const category = new Category({
    name: name || "no data",
    level,
    slug: slug,
    parentCategory
  });
  return await category.save();
}


