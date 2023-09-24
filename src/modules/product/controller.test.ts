import { app } from '../../app'
import request from 'supertest'

describe('teste das requests HTTP controller product', () => {
  it(' GET espero que retorne todos os items em um array com paginação e status 200 ', async () => {
    const page = 1
    const response = await request(app).get(`/product?page=${page}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
  it(' GET espero ter um erro e retornar status 404 ao buscar todos os produtos', async () => {
    const response = await request(app).get(`/product?page=`)

    expect(response.status).toBe(404)

    expect(response.body).toEqual({
      message: 'Erro ao fazer requisição controller',
    })
  })
  it(' GET espero que retorne um objeto e status 200 ', async () => {
    const productCode = 88
    const response = await request(app).get(`/product/${productCode}`)

    expect(response.status).toBe(200)
    expect(typeof response.body).toBe('object')
  })
  it(' GET espero que retorne uma mensagem e status 200 ao buscar um produto que não existe', async () => {
    const response = await request(app).get(`/product/1`)

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      message: 'Produto não encontrado',
    })
  })
  it(' PUT espero que retorne uma mensagem de sucesso e status 200 após a atualização', async () => {
    const productCode = 88
    const updateData = {
      traces: 'executando teste update',
    }

    const response = await request(app)
      .put(`/product/${productCode}`)
      .send(updateData)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Atualizado com sucesso!',
    })
  })
  it('DELETE espero que retorne uma mensagem de sucesso e status 200 apos deletar um produto', async () => {
    const productCode = 88

    const response = await request(app).delete(`/product/${productCode}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'status do produto foi alterado para trash!',
    })
  })
})
