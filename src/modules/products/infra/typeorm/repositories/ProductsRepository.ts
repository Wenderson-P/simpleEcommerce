import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    return this.ormRepository.save({ name, price, quantity });
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findProducts = await this.ormRepository.findByIds(products);
    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const returnProducts = [];
    const oldProducts = await this.findAllById(products);

    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];

      const newProduct = oldProducts.find(
        oldProduct => oldProduct.id === product.id,
      );

      if (newProduct) {
        newProduct.quantity -= product.quantity;
        returnProducts.push(this.ormRepository.save(newProduct));
      }
    }

    return Promise.all(returnProducts);
  }
}

export default ProductsRepository;
