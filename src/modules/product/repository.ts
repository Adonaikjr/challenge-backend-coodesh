import { env } from '../../env'
import MongoDB from '../../config/database'
import { Product } from './model'

export interface PropsFindOne {
  code: number
}
export interface PropsPaginationFindAll {
  page: number
}
export class ProductRepository {
  private database = MongoDB.db(env.DATABASE_NAME)

  // inserir os dados lidos em stream sem filtro para uma collection stream
  async create(product: Product[]): Promise<void> {
    try {
      const collection = this.database.collection(env.COLLECTION_STREAM)
      await collection.insertOne(product)
    } catch (error) {
      throw new Error(`Erro no repository, ${error}`)
    }
  }

  // salvando os dados lidos da stream e salvando na collection product
  async createInProducts(products: Product[]) {
    try {
      const createProduct = this.database.collection(env.COLLECTION_PRODUCT)
      const insertAllProducts = await createProduct.insertMany(products)
      console.log(`${insertAllProducts} produtos inseridos com sucesso.`)
    } catch (error) {
      console.error('Erro ao inserir produtos:', error)
    }
  }

  // buscando registro com paginação
  async findAll(page: number) {
    try {
      const product = this.database.collection(`${env.COLLECTION_PRODUCT}`)
      const perPage = 10
      // Calcula o número de itens para pular com base na página e itens por página
      const skip = (page - 1) * perPage
      // Consulta o banco de dados com a paginação
      const response = await product
        .find({})
        .skip(skip)
        .limit(perPage)
        .toArray()
      return response
    } catch (error) {
      throw new Error(`Erro ao fazer chamada GET no banco de dados ${error}`)
    }
  }

  // buscando um item especifico pelo CODE
  async getFindOne(code: number) {
    try {
      const createProduct = this.database.collection(
        `${env.COLLECTION_PRODUCT}`,
      )
      const response = await createProduct.findOne({ code }) // Adicione o await aqui

      if (response) {
        return response
      } else {
        return { message: 'Produto não encontrado' } // Altere para retornar null em vez de console.log
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
    }
  }

  // fazendo atualização de um CODE enviando o numero CODE e o item a ser atualizado
  async updateProduct(code: number, updateObject: Product[]) {
    try {
      const update = this.database.collection(`${env.COLLECTION_PRODUCT}`)

      const filter = { code }
      const updateDocument = { $set: updateObject }

      await update.updateOne(filter, updateDocument)
    } catch (error) {
      throw new Error(`Erro ao atualizar produto por código: ${error}`)
    }
  }

  async deleteProduct(code: number) {
    try {
      const update = this.database.collection(`${env.COLLECTION_PRODUCT}`)

      const filter = { code }
      const updateDocument = { $set: { status: 'trash' } }

      await update.updateOne(filter, updateDocument)
    } catch (error) {
      throw new Error(`Erro ao atualizar produto por código: ${error}`)
    }
  }
}
