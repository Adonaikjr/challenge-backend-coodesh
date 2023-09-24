import { Product } from './model'

// serviço é responsavel por enviar os dados recebidos do controller a um repository
// assim temos uma manutenção melhor do repository, caso queira mudar de banco de dados alteramos somente o repository e instanciamos aqui
export class ProductService {
  private repository

  constructor(repository: any) {
    this.repository = repository
  }

  async execute(products: any): Promise<void> {
    return await this.repository.create(products)
  }

  async executeFilter(products: Product[]) {
    try {
      const productFilterResult = products?.map((item) => {
        return {
          code: item.code,
          url: item.url,
          creator: item.creator,
          created_t: item.created_t,
          last_modified_t: item.last_modified_t,
          product_name: item.product_name,
          quantity: item.quantity,
          brands: item.brands,
          categories: item.categories,
          labels: item.labels,
          cities: item.cities,
          purchase_places: item.purchase_places,
          stores: item.stores,
          ingredients_text: item.ingredients_text,
          traces: item.traces,
          serving_size: item.serving_size,
          serving_quantity: item.serving_quantity,
          nutriscore_score: item.nutriscore_score,
          nutriscore_grade: item.nutriscore_grade,
          main_category: item.main_category,
          image_url: item.image_url,
          imported_t: new Date(),
          status: 'draft',
        }
      })

      return await this.repository.createInProducts(productFilterResult)
    } catch (error) {
      throw new Error(`Erro ao executar o filtro ${error}`)
    }
  }

  async executeFindOne(code: number) {
    try {
      const response = await this.repository.getFindOne(code)
      return response
    } catch (error) {
      throw new Error(`Erro ao buscar um Code ${error}`)
    }
  }

  async executeFindAll(page: number) {
    try {
      const response = await this.repository.findAll(page)
      return response
    } catch (error) {
      throw new Error(`Erro no serviço ao executar ${error}`)
    }
  }

  async executeUpdateProduct(code: number, updateObject: Product[]) {
    try {
      const response = await this.repository.updateProduct(code, updateObject)
      return response
    } catch (error) {
      throw new Error(`Erro service update ${error}`)
    }
  }

  async executeupdateProductTrash(code: number) {
    try {
      const response = await this.repository.deleteProduct(code)
      return response
    } catch (error) {
      const message = 'Erro ao mudar o produto para trash'
      throw new Error(message)
    }
  }
}
