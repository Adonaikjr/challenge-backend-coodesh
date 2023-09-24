import express from 'express'
import axios from 'axios'
import cron from 'node-cron'
import productRoutes from './modules/product/route'
import { format } from 'date-fns'
export const app = express()

app.use(express.json())
app.use('/product', productRoutes)

let lastCronExecutionTime: any = null

// Função para atualizar o horário da última execução do CRON
function updateLastCronExecutionTime() {
  lastCronExecutionTime = new Date()
  lastCronExecutionTime = format(lastCronExecutionTime, 'dd/MM/yyyy HH:mm:ss')
}

// Função para obter o horário da última execução do CRON
function getLastCronExecutionTime() {
  return lastCronExecutionTime
}

// faz a chamada para adicionar novos produtos em stream e filtra para products as 0horas e 0 minutos
cron.schedule('00 00 * * *', async () => {
  try {
    const response = await axios.post('http://localhost:3000/product/import')
    const data = response.data
    console.log('Rota chamada com sucesso:', data)
    updateLastCronExecutionTime()
  } catch (error) {
    console.error('Erro ao chamar a rota:', error)
  }
})

// uso de memoria
app.use('/', (req, res) => {
  const status = {
    databaseStatus: 'OK',
    lastCronExecution: getLastCronExecutionTime(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  }
  res.json(status)
})
