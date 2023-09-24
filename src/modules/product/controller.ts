import { Request, Response } from 'express'
import * as zlib from 'zlib'
import * as readline from 'readline'
import { ProductService } from './service'
import { ProductRepository } from './repository'
import axios from 'axios'

const repository = new ProductRepository()
const service = new ProductService(repository)
class ProductController {
  // post - responsavel por ler os 100 arquivos em stream e salvar em duas collections diferentes
  async createStream(req: Request, res: Response) {
    try {
      const response = await axios.get(
        'https://challenges.coode.sh/food/data/json/index.txt',
      )
      const urls = response.data.split('\n')

      for (const url of urls) {
        if (url.trim() !== '') {
          await axios({
            method: 'get',
            url: `https://challenges.coode.sh/food/data/json/${url.trim()}`,
            responseType: 'stream',
          })
            .then((response) => {
              const descompactArquivo = zlib.createGunzip()
              const readArquivo = readline.createInterface({
                input: response.data.pipe(descompactArquivo),
                crlfDelay: Infinity,
              })

              let readObjects = 0

              readArquivo.on('line', (line) => {
                const jsonObject = JSON.parse(line)

                if (typeof jsonObject.code === 'string') {
                  const clearCode = jsonObject.code.replace(/"/g, '')

                  const codeTypeNumber = parseFloat(clearCode)

                  if (!isNaN(codeTypeNumber)) {
                    jsonObject.code = codeTypeNumber
                    console.log(`Conversão ok: ${jsonObject.code}`)
                  } else {
                    console.log(
                      `Campo "code" não é um número válido: ${clearCode}`,
                    )
                  }
                }

                service.execute(jsonObject)
                service.executeFilter([jsonObject])

                readObjects++
                if (readObjects >= 100) {
                  readArquivo.close()
                }
                console.log(`Objetos lidos: ${readObjects}`)
              })

              readArquivo.on('close', () => {
                console.log('Leitura concluída.')
              })

              readArquivo.on('error', (err) => {
                console.error('Erro:', err)
              })
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }

      return res.status(201).json({ message: 'importado com sucesso!' })
    } catch (error) {
      throw new Error('erro ao fazer importação')
    }
  }

  // buscar todos os items por pagina passamos /product?page=1 || /product?page=2 ...
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page)
      const response = await service.executeFindAll(page)
      res.status(200).json(response)
    } catch (error) {
      res.status(404).json({ message: 'Erro ao fazer requisição controller' })
    }
  }

  // buscar 1 único registro passamos /product/88
  async findOne(req: Request, res: Response): Promise<void> {
    try {
      const code = Number(req.params.code)
      const response = await service.executeFindOne(code)
      res.status(200).json(response)
    } catch (error) {
      res.status(404).json({ message: `Erro ao fazer requisição controller` })
    }
  }

  // atualizar PUT apenas 1 unico registro no banco, passamos o CODE por parametro /product/88, e enviamos um objeto no body a ser atualizado
  // exemplo de objeto: { stores: "teste update" }
  async updateProduct(req: Request, res: Response) {
    try {
      const code = Number(req.params.code)
      const objectUpdate = req.body
      await service.executeUpdateProduct(code, objectUpdate)

      return res.status(200).json({
        message: 'Atualizado com sucesso!',
      })
    } catch (error) {
      throw new Error(`Erro ao atualizar o codigo ${error}`)
    }
  }

  async updateProductTrash(req: Request, res: Response) {
    try {
      const code = Number(req.params.code)

      await service.executeupdateProductTrash(code)

      return res.status(200).json({
        message: 'status do produto foi alterado para trash!',
      })
    } catch (error) {
      throw new Error(`Erro ao atualizar o codigo ${error}`)
    }
  }
}

export default new ProductController()
